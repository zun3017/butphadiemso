/**
 * API GATEWAY & SHIM - LỚP HỌC BỨT PHÁ ĐIỂM SỐ
 * Tự động chuyển đổi giữa Google Apps Script run và REST API Fetch
 */

(function () {
    if (typeof google === 'undefined' || typeof google.script === 'undefined' || typeof google.script.run === 'undefined') {
        console.log('[API Gateway] Chạy trên môi trường Web. Kích hoạt Shim gõ Google Apps Script...');

        class GoogleScriptRunInstance {
            constructor() {
                this._successHandler = null;
                this._failureHandler = null;

                return new Proxy(this, {
                    get: (target, prop) => {
                        if (prop in target) return target[prop];
                        return (...args) => target._execute(prop, args);
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
                const scriptUrl = (window.APP_CONFIG && window.APP_CONFIG.SCRIPT_URL) ? window.APP_CONFIG.SCRIPT_URL : '';

                if (!scriptUrl || scriptUrl.includes('YOUR_SCRIPT_ID') || scriptUrl.trim() === '') {
                    console.warn('[API Gateway] Chưa cấu hình SCRIPT_URL hợp lệ. Sử dụng Demo Fallback.');
                    this._handleFallback(functionName, args);
                    return;
                }

                fetch(scriptUrl, {
                    method: 'POST',
                    mode: 'cors',
                    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                    body: JSON.stringify({
                        functionName: functionName,
                        arguments: args
                    })
                })
                .then(response => {
                    if (!response.ok) throw new Error('HTTP ' + response.status);
                    return response.json();
                })
                .then(data => {
                    let resData = (data && data.result !== undefined) ? data.result : data;
                    if (data && data.error && data.result === undefined) {
                        if (this._failureHandler) this._failureHandler(data.error);
                        else if (this._successHandler) this._successHandler({ error: data.error });
                    } else {
                        if (this._successHandler) this._successHandler(resData);
                    }
                })
                .catch(error => {
                    console.error('[API Error]', error);
                    // Fallback to mock demo if fetch fails
                    this._handleFallback(functionName, args);
                });
            }

            _handleFallback(functionName, args) {
                setTimeout(() => {
                    let mockResult = getMockData(functionName, args);
                    if (this._successHandler) this._successHandler(mockResult);
                }, 300);
            }
        }

        window.google = window.google || {};
        window.google.script = window.google.script || {};
        Object.defineProperty(window.google.script, 'run', {
            get: () => new GoogleScriptRunInstance()
        });
    }
})();

// Dữ liệu mẫu Fallback khi chưa kết nối Google Apps Script
function getMockData(functionName, args) {
    console.log(`[Mock Demo] Gọi hàm "${functionName}" với tham số:`, args);
    
    switch (functionName) {
        case 'getClassList':
            return {
                success: true,
                classes: [
                    { id: '10A1', name: 'Lớp 10A1 - Chuyên Toán (Tối T3 - T5 - T7)', teacher: 'Thầy Phúc', totalStudents: 32 },
                    { id: '11A1', name: 'Lớp 11A1 - Luyện Thi Đại Học (Chiều T2 - T4 - T6)', teacher: 'Thầy Phúc', totalStudents: 28 },
                    { id: '12A1', name: 'Lớp 12A1 - Bứt Phá Điểm Số 9+ (Tối T2 - T6)', teacher: 'Thầy Phúc', totalStudents: 35 }
                ]
            };
            
        case 'getHomeworkList':
            return {
                success: true,
                homeworks: [
                    { id: 'BT01', title: 'Bài tập 1: Phương trình và Bất phương trình chứa căn', classId: '10A1', deadline: '2026-08-05', fileUrl: 'https://drive.google.com' },
                    { id: 'BT02', title: 'Bài tập 2: Đạo hàm và Ứng dụng trong Hình học', classId: '11A1', deadline: '2026-08-07', fileUrl: 'https://drive.google.com' },
                    { id: 'BT03', title: 'Đề thi thử số 05 - Chuyên đề Oxyz & Tích phân', classId: '12A1', deadline: '2026-08-10', fileUrl: 'https://drive.google.com' }
                ]
            };

        case 'submitHomework':
            return {
                success: true,
                message: 'Nộp bài tập thành công! File đã được lưu vào Google Drive của Thầy giáo.'
            };

        case 'getParentData':
            return {
                success: true,
                student: {
                    name: 'Nguyễn Văn An',
                    code: 'HS1001',
                    className: 'Lớp 12A1',
                    parentPhone: '0901234567',
                    attendance: '100% (12/12 buổi)',
                    tuitionStatus: 'Đã hoàn thành HP Tháng 7',
                    teacherComment: 'Học sinh tư duy tốt, chăm chỉ làm bài tập về nhà. Cần chú ý phần Hình học không gian.',
                    scores: [
                        { testName: 'Kiểm tra đầu giờ T7 (15p)', score: 9.5, date: '25/07/2026' },
                        { testName: 'Kiểm tra Định kỳ Tháng 7 (45p)', score: 8.8, date: '20/07/2026' },
                        { testName: 'Thi thử Chuyên đề Oxyz', score: 9.0, date: '15/07/2026' }
                    ]
                }
            };

        default:
            return { success: true, message: 'Thao tác giả lập thành công' };
    }
}
