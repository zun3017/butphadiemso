/**
 * API GATEWAY & SHIM - LỚP HỌC ĐA MÔN BỨT PHÁ ĐIỂM SỐ
 */

(function () {
    if (typeof google === 'undefined' || typeof google.script === 'undefined' || typeof google.script.run === 'undefined') {
        console.log('[API Gateway] Kích hoạt Shim gõ Google Apps Script...');

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
                    console.warn('[API Warning] Dùng dữ liệu Mock Fallback vì lỗi fetch:', error);
                    this._handleFallback(functionName, args);
                });
            }

            _handleFallback(functionName, args) {
                setTimeout(() => {
                    let mockResult = getMockData(functionName, args);
                    if (this._successHandler) this._successHandler(mockResult);
                }, 200);
            }
        }

        window.google = window.google || {};
        window.google.script = window.google.script || {};
        Object.defineProperty(window.google.script, 'run', {
            get: () => new GoogleScriptRunInstance()
        });
    }
})();

// DỮ LIỆU MẪU MÔ PHỎNG HỆ THỐNG ĐA MÔN & ĐA LỚP HỌC
function getMockData(functionName, args) {
    console.log(`[Mock Demo] Executing "${functionName}" with args:`, args);
    
    switch (functionName) {
        case 'getClassList':
            const subjectFilter = args[0];
            const allClasses = [
                { id: '10A1_TOAN', name: 'Lớp 10A1 - Chuyên Toán', subject: 'Môn Toán', teacher: 'Thầy Phúc', schedule: 'T3 - T5 - T7 (18h30)', totalStudents: 32 },
                { id: '11_LY', name: 'Lớp 11A1 - Vật Lý Nâng Cao', subject: 'Vật Lý', teacher: 'Thầy Phúc', schedule: 'T2 - T4 - T6 (17h00)', totalStudents: 28 },
                { id: '12_HOA', name: 'Lớp 12A1 - Hóa Học Về Đích 9+', subject: 'Hóa Học', teacher: 'Thầy Phúc', schedule: 'T2 - T6 (19h30)', totalStudents: 35 },
                { id: '9A_ANH', name: 'Lớp 9A - Tiếng Anh Luyện Thi 10', subject: 'Tiếng Anh', teacher: 'Cô Hương', schedule: 'T4 - CN (18h00)', totalStudents: 25 }
            ];

            if (!subjectFilter || subjectFilter === 'Tất cả') {
                return { success: true, classes: allClasses };
            }
            return {
                success: true,
                classes: allClasses.filter(c => c.subject.toLowerCase() === subjectFilter.toLowerCase())
            };
            
        case 'getHomeworkList':
            const classId = args[0];
            const subject = args[1];
            
            const allHomeworks = [
                { id: 'BT01', classId: '10A1_TOAN', className: 'Lớp 10A1 - Chuyên Toán', subject: 'Môn Toán', title: 'Bài tập 1: Phương trình và Bất phương trình chứa căn', deadline: '2026-08-05', fileUrl: 'https://drive.google.com' },
                { id: 'BT02', classId: '11_LY', className: 'Lớp 11A1 - Vật Lý Nâng Cao', subject: 'Vật Lý', title: 'Bài tập 2: Dao động cơ và Con lắc đơn', deadline: '2026-08-07', fileUrl: 'https://drive.google.com' },
                { id: 'BT03', classId: '12_HOA', className: 'Lớp 12A1 - Hóa Học Về Đích', subject: 'Hóa Học', title: 'Chuyên đề 05: Este - Lipit & Bài tập Este nâng cao', deadline: '2026-08-10', fileUrl: 'https://drive.google.com' },
                { id: 'BT04', classId: '9A_ANH', className: 'Lớp 9A - Tiếng Anh', subject: 'Tiếng Anh', title: 'Đề thi thử Tiếng Anh vào 10 Chuyên', deadline: '2026-08-08', fileUrl: 'https://drive.google.com' }
            ];

            let filtered = allHomeworks;
            if (classId && classId !== 'Tất cả') {
                filtered = filtered.filter(hw => hw.classId === classId);
            }
            if (subject && subject !== 'Tất cả') {
                filtered = filtered.filter(hw => hw.subject.toLowerCase() === subject.toLowerCase());
            }

            return { success: true, homeworks: filtered };

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
                    parentPhone: '0901234567',
                    parentName: 'Nguyễn Văn Bình',
                    enrolledClasses: [
                        { classId: '10A1_TOAN', subject: 'Môn Toán Học', attendance: '100% (12/12 buổi)', tuition: 'Đã hoàn thành' },
                        { classId: '11_LY', subject: 'Môn Vật Lý', attendance: '92% (11/12 buổi)', tuition: 'Đã hoàn thành' }
                    ],
                    scores: [
                        { subject: 'Môn Toán Học', testName: 'Kiểm tra Chuyên đề Toán 15p', score: '9.5', submitTime: '25/07/2026', comment: 'Làm bài xuất sắc' },
                        { subject: 'Môn Vật Lý', testName: 'Kiểm tra Định kỳ Vật Lý 45p', score: '8.8', submitTime: '22/07/2026', comment: 'Cần chú ý phần Con lắc đơn' }
                    ]
                }
            };

        case 'createClass':
            return { success: true, message: 'Tạo lớp học mới thành công!' };

        case 'createHomework':
            return { success: true, message: 'Giao bài tập mới thành công!' };

        default:
            return { success: true, message: 'Thao tác giả lập thành công' };
    }
}
