/**
 * API GATEWAY SHIM FOR GOOGLE APPS SCRIPT
 * Tự động kết nối với Web App Google Apps Script mới của Thầy giáo
 */
const SCRIPT_URL = (typeof window.APP_CONFIG !== 'undefined' && window.APP_CONFIG.SCRIPT_URL)
    ? window.APP_CONFIG.SCRIPT_URL 
    : 'https://script.google.com/macros/s/AKfycbyY6FXI-Lh3WKJhws0YXsMngG4RO2MFBhfJPONKew2mIvI9CovUe93wJADoJR9NgWsN/exec';






// Chỉ tạo Shim giả lập nếu chạy ngoài môi trường Google Apps Script (ví dụ trên GitHub Pages / Localhost)
if (typeof google === 'undefined' || typeof google.script === 'undefined' || typeof google.script.run === 'undefined') {
    console.log('Chạy ngoài môi trường Google Apps Script. Kích hoạt API Gateway Shim...');
    
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
                })
                .catch(err => {
                    if (retriesLeft > 0) {
                        console.warn(`Lỗi kết nối API (${functionName}). Thử lại lần nữa... (${retriesLeft} lần thử còn lại)`);
                        setTimeout(() => doFetch(retriesLeft - 1), 1500); // Đợi 1.5s trước khi thử lại
                    } else {
                        console.error("API Call Exception (Đã hết số lần thử):", err);
                        if (self._failureHandler) {
                            self._failureHandler(err.toString());
                        }
                    }
                });
            }
            
            doFetch(maxRetries);
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
