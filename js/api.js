/**
 * API GATEWAY SHIM FOR GOOGLE APPS SCRIPT
 * Tự động kết nối với Web App Google Apps Script mới của Thầy giáo
 * Hỗ trợ Hàng chờ nối đuôi (Sequential Queue) để xử lý sửa dữ liệu liên tục 100% không mất dữ liệu.
 */
const SCRIPT_URL = (typeof window.APP_CONFIG !== 'undefined' && window.APP_CONFIG.SCRIPT_URL)
    ? window.APP_CONFIG.SCRIPT_URL 
    : 'https://script.google.com/macros/s/AKfycbxxtg4ae9QhbAD2faVM46Gyl8ikOK1-Ry1tjUefkN4eeLAprlra15FXhEIH6xNbVnSp/exec';

// Hàng chờ Request FIFO để đảm bảo các thao tác ghi dữ liệu liên tục không bị đè đụng độ
const apiQueue = [];
let isQueueProcessing = false;

function processNextApiTask() {
    if (isQueueProcessing || apiQueue.length === 0) return;
    isQueueProcessing = true;
    
    const task = apiQueue[0];
    task.execute()
        .finally(() => {
            apiQueue.shift();
            isQueueProcessing = false;
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
