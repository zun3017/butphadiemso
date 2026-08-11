/**
 * API GATEWAY SHIM FOR GOOGLE APPS SCRIPT
 * Tự động kết nối với Web App Google Apps Script mới của Thầy giáo
 * Hỗ trợ Hàng chờ nối đuôi (Sequential Queue) & Cảnh báo chống mất dữ liệu khi đóng trang
 */
const SCRIPT_URL = (typeof window.APP_CONFIG !== 'undefined' && window.APP_CONFIG.SCRIPT_URL)
    ? window.APP_CONFIG.SCRIPT_URL 
    : 'https://script.google.com/macros/s/AKfycbxxtg4ae9QhbAD2faVM46Gyl8ikOK1-Ry1tjUefkN4eeLAprlra15FXhEIH6xNbVnSp/exec';

// Hàng chờ Request FIFO để đảm bảo các thao tác ghi dữ liệu liên tục không bị đè đụng độ
const apiQueue = [];
let isQueueProcessing = false;

// Cảnh báo đóng trình duyệt nếu hàng chờ chưa đồng bộ xong
if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', function (e) {
        if (apiQueue.length > 0 || isQueueProcessing) {
            const confirmationMessage = '⚠️ Dữ liệu vừa chỉnh sửa đang được lưu lên Google Sheets. Bạn có chắc chắn muốn đóng web ngay bây giờ?';
            (e || window.event).returnValue = confirmationMessage;
            return confirmationMessage;
        }
    });
}

// Cập nhật trạng thái đồng bộ ở góc màn hình
function updateSyncIndicator() {
    if (typeof document === 'undefined' || !document.body) return;
    let indicator = document.getElementById('globalSyncQueueBadge');
    const remaining = apiQueue.length + (isQueueProcessing ? 1 : 0);
    
    if (remaining > 0) {
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'globalSyncQueueBadge';
            indicator.style.cssText = 'position: fixed; bottom: 20px; right: 20px; z-index: 999999; background: rgba(18, 16, 42, 0.95); border: 1px solid #8E4DFF; color: #FFF; padding: 10px 18px; border-radius: 30px; font-size: 13px; font-weight: bold; font-family: sans-serif; box-shadow: 0 4px 20px rgba(142,77,255,0.4); display: flex; align-items: center; gap: 10px; backdrop-filter: blur(10px); transition: all 0.3s ease;';
            document.body.appendChild(indicator);
        }
        indicator.style.display = 'flex';
        indicator.style.borderColor = '#8E4DFF';
        indicator.innerHTML = '<i class="fa-solid fa-cloud-arrow-up fa-spin" style="color: #FFD23F; font-size: 15px;"></i> Đang đồng bộ lên Sheet (' + remaining + ' thao tác...);';
    } else if (indicator) {
        indicator.innerHTML = '<i class="fa-solid fa-circle-check" style="color: #10B981; font-size: 15px;"></i> Đã đồng bộ xong!';
        indicator.style.borderColor = '#10B981';
        setTimeout(() => {
            if (indicator && apiQueue.length === 0 && !isQueueProcessing) {
                indicator.style.display = 'none';
            }
        }, 2000);
    }
}

function processNextApiTask() {
    updateSyncIndicator();
    if (isQueueProcessing || apiQueue.length === 0) return;
    isQueueProcessing = true;
    
    const task = apiQueue[0];
    task.execute()
        .finally(() => {
            apiQueue.shift();
            isQueueProcessing = false;
            updateSyncIndicator();
            setTimeout(processNextApiTask, 50);
        });
}

// Chỉ tạo Shim giả lập nếu chạy ngoài môi trường Google Apps Script (ví dụ trên GitHub Pages / Localhost)
if (typeof google === 'undefined' || typeof google.script === 'undefined' || typeof google.script.run === 'undefined') {
    console.log('Chạy ngoài môi trường Google Apps Script. Kích hoạt API Gateway Shim với Hàng chờ Tuần tự...');
    
    class GoogleScriptRunInstance {
        constructor() {
            this._successHandler = null;
            this._failureHandler = null;
            
            return new Proxy(this, {
                get: (target, prop) => {
                    if (prop in target) {
                        return target[prop];
                    }
                    return (...args) => {
                        return target._execute(prop, args);
                    };
                }
            });
        }
        
        withSuccessHandler(callback) {
            this._successHandler = callback;
            return this;
        }
        
        withFailureHandler(callback) {
            this._failureHandler = callback;
            return this;
        }
        
        _execute(functionName, args) {
            const urlToUse = (typeof APP_CONFIG !== 'undefined' && APP_CONFIG.SCRIPT_URL) ? APP_CONFIG.SCRIPT_URL : SCRIPT_URL;
            
            if (urlToUse.indexOf('YOUR_SCRIPT_ID') !== -1 || urlToUse.trim() === '') {
                const errMsg = 'Hệ thống chưa được cấu hình URL kết nối Google Sheets.';
                if (this._failureHandler) {
                    this._failureHandler(errMsg);
                } else {
                    alert(errMsg);
                }
                var loading = document.getElementById('loadingText');
                if (loading) loading.style.display = 'none';
                return;
            }
            
            const maxRetries = 2;
            const self = this;

            // Đưa request vào Hàng chờ Tuần tự (FIFO Queue)
            apiQueue.push({
                execute: function() {
                    return new Promise((resolve) => {
                        function doFetch(retriesLeft) {
                            fetch(urlToUse, {
                                method: 'POST',
                                mode: 'cors',
                                headers: {
                                    'Content-Type': 'text/plain;charset=utf-8'
                                },
                                body: JSON.stringify({
                                    functionName: functionName,
                                    arguments: args
                                })
                            })
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('Lỗi phản hồi HTTP server: ' + response.status);
                                }
                                return response.json();
                            })
                            .then(data => {
                                if (data.error) {
                                    if (self._failureHandler) {
                                        self._failureHandler(data.error);
                                    } else {
                                        console.error("API Server Error:", data.error);
                                    }
                                } else {
                                    if (self._successHandler) {
                                        self._successHandler(data.result);
                                    }
                                }
                                resolve();
                            })
                            .catch(err => {
                                if (retriesLeft > 0) {
                                    console.warn(`Lỗi kết nối API (${functionName}). Thử lại lần nữa... (${retriesLeft} lần thử còn lại)`);
                                    setTimeout(() => doFetch(retriesLeft - 1), 1500);
                                } else {
                                    console.error("API Call Exception (Đã hết số lần thử):", err);
                                    if (self._failureHandler) {
                                        self._failureHandler(err.toString());
                                    }
                                    resolve();
                                }
                            });
                        }
                        
                        doFetch(maxRetries);
                    });
                }
            });

            processNextApiTask();
        }
    }

    window.google = {
        script: {
            get run() {
                return new GoogleScriptRunInstance();
            }
        }
    };
}
