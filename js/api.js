/**
 * API GATEWAY SHIM FOR GOOGLE APPS SCRIPT
 * Tự động kết nối với Web App Google Apps Script mới của Thầy giáo
 * Hỗ trợ Hàng chờ nối đuôi (Sequential Queue) & Cảnh báo chống mất dữ liệu khi đóng trang
 */
const SCRIPT_URL = (typeof window.APP_CONFIG !== 'undefined' && window.APP_CONFIG.SCRIPT_URL)
    ? window.APP_CONFIG.SCRIPT_URL 
    : 'https://script.google.com/macros/s/AKfycbzeLcJO43zCuPQH4gmvrXOlywF76eYLAVNa1DU7_H-BpwhW76pcBLCwcNwYDbFbXFg0/exec';

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

// Cập nhật trạng thái đồng bộ ở góc màn hình & Toast
function updateSyncIndicator() {
    const remaining = apiQueue.length + (isQueueProcessing ? 1 : 0);
    
    // Ưu tiên 1: Dùng hàm showSyncToast sẵn có của Dashboard
    if (typeof window !== 'undefined' && typeof window.showSyncToast === 'function') {
        if (remaining > 0) window.showSyncToast('pending');
        else window.showSyncToast('success');
        return;
    }
    
    // Ưu tiên 2: Dùng phần tử #syncToast trên giao diện HTML
    if (typeof document !== 'undefined') {
        const toast = document.getElementById('syncToast');
        if (toast) {
            if (remaining > 0) {
                toast.className = 'sync-toast pending';
                toast.innerHTML = '<i class="fa-solid fa-rotate fa-spin"></i> Đang đồng bộ...';
                toast.style.display = 'flex';
            } else {
                toast.className = 'sync-toast success';
                toast.innerHTML = '<i class="fa-solid fa-circle-check"></i> Đã đồng bộ';
                toast.style.display = 'flex';
                setTimeout(() => { if (apiQueue.length === 0 && !isQueueProcessing) toast.style.display = 'none'; }, 1500);
            }
            return;
        }
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
            // Lập tức thực hiện task tiếp theo không chờ đợi
            processNextApiTask();
        });
}

// Chỉ tạo Shim giả lập nếu chạy ngoài môi trường Google Apps Script (ví dụ trên GitHub Pages / Localhost)
if (typeof google === 'undefined' || typeof google.script === 'undefined' || typeof google.script.run === 'undefined') {
    console.log('Chạy ngoài môi trường Google Apps Script. Kích hoạt API Gateway Shim siêu tốc...');
    
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

            const executeFetch = function() {
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
                                setTimeout(() => doFetch(retriesLeft - 1), 1000);
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
            };

            // Phân loại: Các hàm đọc dữ liệu (get, read, check...) cho chạy đọc ngay lập tức song song không cần xếp hàng!
            const fnLower = functionName.toLowerCase();
            const isReadOnly = fnLower.startsWith('get') || fnLower.startsWith('read') || fnLower.startsWith('check') || fnLower.startsWith('fetch') || fnLower.startsWith('login') || fnLower.startsWith('xacthuc');

            if (isReadOnly) {
                executeFetch();
            } else {
                // Các hàm ghi dữ liệu (save, update, delete...) xếp hàng FIFO để ghi nối đuôi an toàn
                apiQueue.push({ execute: executeFetch });
                processNextApiTask();
            }
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
