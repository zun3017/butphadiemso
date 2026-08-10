/**
 * API GATEWAY SHIM FOR GOOGLE APPS SCRIPT
 * Tự động kết nối với Web App Google Apps Script mới của Thầy giáo
 */
const SCRIPT_URL = (typeof window.APP_CONFIG !== 'undefined' && window.APP_CONFIG.SCRIPT_URL)
    ? window.APP_CONFIG.SCRIPT_URL 
    : 'https://script.google.com/macros/s/AKfycbwS4t4bbQx6PryPQSuMnxKNe99tVf2nitNGv82OzbIs6DZUuHY4f0Ga1B-YU2q6j2eH/exec';






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
                    if (this._failureHandler) {
                        this._failureHandler(data.error);
                    } else {
                        console.error("API Server Error:", data.error);
                    }
                } else {
                    if (this._successHandler) {
                        this._successHandler(data.result);
                    }
                }
            })
            .catch(err => {
                console.error("API Call Exception:", err);
                if (this._failureHandler) {
                    this._failureHandler(err.toString());
                }
            });
        }
    }

    window.google = {
        script: {
            run: new GoogleScriptRunInstance()
        }
    };
}
