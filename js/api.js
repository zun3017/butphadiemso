/**
 * CLIENT-SIDE MOCK API GATEWAY FOR LỚP HỌC (DEMO SHOWCASE)
 * Hoàn toàn độc lập 100%, không cần kết nối mạng hay máy chủ
 * Tốc độ phản hồi tức thì, giả lập tải file Base64 và lưu trữ phiên an toàn
 */

(function() {
    // 1. Khởi tạo kho dữ liệu phiên (Session / LocalStorage)
    const STORAGE_KEY = 'DEMO_LOPHOC_DATA_V1';
    
    function getDemoStore() {
        let store = null;
        try {
            const raw = sessionStorage.getItem(STORAGE_KEY);
            if (raw) store = JSON.parse(raw);
        } catch(e) {}
        
        const initial = (typeof INITIAL_DEMO_DATA !== 'undefined') ? JSON.parse(JSON.stringify(INITIAL_DEMO_DATA)) : {};
        if (!store) {
            store = initial;
            saveDemoStore(store);
        } else if (!store.videos || store.videos.length === 0 || !store.videos[0].videoUrl) {
            store.videos = initial.videos || [];
            saveDemoStore(store);
        }
        return store;
    }
    
    function saveDemoStore(store) {
        try {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(store));
        } catch(e) {}
    }

    function normalizePhone(p) {
        if (!p) return "";
        return String(p).replace(/\D/g, '').replace(/^84/, '0').replace(/^0+/, '');
    }

    // 2. GoogleScriptRun Proxy Shim cho toàn bộ Frontend
    class MockGoogleScriptRunInstance {
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
        
        async _execute(functionName, args) {
            const self = this;
            let result = null;
            
            // Giả lập độ trễ mạng nhẹ (100ms - 200ms) để hiển thị animation loading đẹp mắt
            await new Promise(r => setTimeout(r, 120));
            
            try {
                let store = getDemoStore();
                
                // ==========================================
                // 1. XÁC THỰC & ĐĂNG NHẬP
                // ==========================================
                if (functionName === 'loginClassSystem') {
                    const rawPhone = String(args[0] || "").trim();
                    const pin = String(args[1] || "").trim();
                    const norm = normalizePhone(rawPhone);
                    
                    if (norm === '302001' || rawPhone === '302001' || rawPhone === '1234') {
                        if (pin === '1234' || pin === '') {
                            result = { success: true, role: 'admin', adminName: store.admin.name, adminPhone: store.admin.phone };
                        } else {
                            result = { error: 'Mã PIN Admin không đúng (Mặc định: 1234)' };
                        }
                    } else if (norm === '0123456789' || norm === '123456789' || norm === '824231314' || rawPhone === '0123456789') {
                        if (pin === store.teacher.pin || pin === '1234' || pin === '') {
                            result = {
                                success: true,
                                role: 'teacher',
                                tutorName: store.teacher.name,
                                tutorPhone: store.teacher.phone,
                                tutorCode: store.teacher.teacherId,
                                pin: store.teacher.pin,
                                tutorPin: store.teacher.pin,
                                qrUrl: store.teacher.qrUrl
                            };
                        } else {
                            result = { error: 'Mã PIN giáo viên không đúng (Mặc định: 1234)' };
                        }
                    } else {
                        // Tự động cho phép bất kỳ SĐT nào đăng nhập vào vai trò giáo viên demo
                        result = {
                            success: true,
                            role: 'teacher',
                            tutorName: store.teacher.name,
                            tutorPhone: store.teacher.phone,
                            tutorCode: store.teacher.teacherId,
                            pin: store.teacher.pin,
                            tutorPin: store.teacher.pin,
                            qrUrl: store.teacher.qrUrl
                        };
                    }
                }
                
                else if (functionName === 'loginSystem') {
                    const phone = String(args[0] || "").trim();
                    const norm = normalizePhone(phone);
                    
                    let target = store.students.find(s => normalizePhone(s.parentPhone) === norm || normalizePhone(s.studentId) === norm || normalizePhone(s.homeworkId) === norm);
                    if (!target && store.students.length > 0) {
                        target = store.students[0]; // Fallback học sinh mẫu đầu tiên
                    }
                    
                    if (target) {
                        let cls = store.classes.find(c => c.classId === target.classId);
                        let tenLop = cls ? cls.className : "Lớp 12 - Luyện Thi THPT QG Vật Lý";
                        let ann = store.announcements.find(a => a.classId === target.classId);
                        
                        let lichSuHocTap = store.lessonLogs.filter(l => l.classId === target.classId).map((l, idx) => {
                            let sNote = (l.detailedNotes && l.detailedNotes[target.studentId]) || {};
                            return {
                                tuan: l.teachingWeek || "10",
                                ngay: l.studyDate || "15/08",
                                mon: l.subject || "Vật Lý",
                                noiDung: l.generalNotes || "",
                                nhanXetRieng: sNote.privateNote || "",
                                danhGiaBTVN: sNote.hwEval || l.hwEval || "Hoàn thành",
                                diemDauGio: sNote.entryTest || (l.score1 !== null ? String(l.score1) : "-"),
                                diemDinhKi: sNote.termTest || (l.score2 !== null ? String(l.score2) : "-"),
                                trangThai: sNote.attendance || l.status || "Có mặt"
                            };
                        });
                        
                        let baiTap = store.homework.filter(h => h.classId === target.classId).map(h => ({
                            mon: h.subject || "Vật Lý",
                            tenBai: h.hwName,
                            link: h.submitLink || h.fileUrl || ""
                        }));
                        
                        result = {
                            role: 'student',
                            thongBao: "Đăng nhập thành công",
                            data: {
                                timThay: true,
                                studentId: target.studentId,
                                classId: target.classId,
                                tenLop: tenLop,
                                className: tenLop,
                                tenHocSinh: target.studentName,
                                thongBaoHocSinh: ann ? ann.content : "Chào mừng các em đến với lớp học Vật Lý!",
                                lichSuHocTap: lichSuHocTap,
                                baiTap: baiTap
                            }
                        };
                    } else {
                        result = { error: "Không tìm thấy thông tin học sinh!" };
                    }
                }
                
                else if (functionName === 'checkLoginCode') {
                    const code = String(args[0] || "").trim().toUpperCase();
                    result = {
                        success: true,
                        type: 'course',
                        courseCode: code,
                        courseName: "Khóa Học Toàn Diện: Chinh Phục 9+ Môn Vật Lý THPT QG"
                    };
                }
                
                // ==========================================
                // 2. DASHBOARD LỚP HỌC (TEACHER VIEW)
                // ==========================================
                else if (functionName === 'getClassDashboardData') {
                    const phone = args[0] || store.teacher.phone;
                    const requestedClassId = args[1];
                    
                    let activeClass = null;
                    if (requestedClassId) {
                        activeClass = store.classes.find(c => c.classId === requestedClassId);
                    }
                    if (!activeClass && store.classes.length > 0) {
                        activeClass = store.classes[0];
                    }
                    
                    let curStudents = [];
                    let curLogs = [];
                    let curAnn = "";
                    let curHw = [];
                    
                    if (activeClass) {
                        curStudents = store.students.filter(s => s.classId === activeClass.classId).map(s => ({
                            studentId: s.studentId,
                            studentName: s.studentName,
                            classId: s.classId,
                            parentPhone: s.parentPhone,
                            parentName: s.parentName,
                            fee: s.tuitionFee,
                            homeworkCode: s.homeworkId,
                            feeType: s.tuitionType,
                            joinDate: s.joinDate
                        }));
                        
                        curLogs = store.lessonLogs.filter(l => l.classId === activeClass.classId).map(l => ({
                            logId: l.logId,
                            classId: l.classId,
                            className: l.className,
                            weekNum: l.teachingWeek || "10",
                            studyDate: l.studyDate || "15/08",
                            subject: l.subject || "Vật Lý",
                            status: l.status || "Có mặt",
                            hwEval: l.hwEval || "Hoàn thành",
                            entryTest: l.score1 !== null ? String(l.score1) : "-",
                            termTest: l.score2 !== null ? String(l.score2) : "-",
                            generalNote: l.generalNotes || "",
                            studentNotes: l.detailedNotes || {}
                        }));
                        
                        let annObj = store.announcements.find(a => a.classId === activeClass.classId);
                        if (annObj) curAnn = annObj.content;
                        
                        curHw = store.homework.filter(h => h.classId === activeClass.classId).map(h => {
                            let subCount = store.submissions.filter(s => s.hwId === h.hwId).length;
                            return {
                                hwId: h.hwId,
                                classId: h.classId,
                                className: h.className,
                                subject: h.subject || "Vật Lý",
                                hwName: h.hwName,
                                assignedDate: h.assignedDate,
                                deadline: h.deadline,
                                fileUrl: h.fileUrl,
                                fileName: h.fileName,
                                submitLink: h.submitLink,
                                submittedCount: subCount,
                                totalStudents: curStudents.length
                            };
                        });
                    }
                    
                    result = {
                        success: true,
                        tutorName: store.teacher.name,
                        tutorPhone: store.teacher.phone,
                        tutorPin: store.teacher.pin,
                        pin: store.teacher.pin,
                        qrUrl: store.teacher.qrUrl,
                        classes: store.classes,
                        activeClass: activeClass,
                        students: curStudents,
                        lessonLogs: curLogs,
                        announcement: curAnn,
                        homeworkList: curHw
                    };
                }
                
                else if (functionName === 'getClassList') {
                    result = store.classes;
                }
                
                else if (functionName === 'saveClassLessonLog' || functionName === 'addClassLessonLog') {
                    const [classId, className, weekNum, studyDate, subject, status, hwEval, score1, score2, generalNotes, studentNotes] = args;
                    const logId = `LOG_DEMO_${Date.now()}`;
                    const newLog = {
                        logId: logId,
                        classId: classId,
                        className: className,
                        teachingWeek: String(weekNum || "10"),
                        studyDate: studyDate || "15/08",
                        subject: subject || "Vật Lý",
                        status: status || "Có mặt",
                        hwEval: hwEval || "Hoàn thành",
                        score1: score1 ? parseFloat(score1) : null,
                        score2: score2 ? parseFloat(score2) : null,
                        generalNotes: generalNotes || "",
                        detailedNotes: studentNotes || {}
                    };
                    store.lessonLogs.unshift(newLog);
                    saveDemoStore(store);
                    result = { success: true, logId: logId };
                }
                
                else if (functionName === 'editClassLessonLog') {
                    const [logId, weekNum, studyDate, subject, status, hwEval, score1, score2, generalNotes, studentNotes] = args;
                    let target = store.lessonLogs.find(l => l.logId === logId);
                    if (target) {
                        target.teachingWeek = String(weekNum || target.teachingWeek);
                        target.studyDate = studyDate || target.studyDate;
                        target.subject = subject || target.subject;
                        target.status = status || target.status;
                        target.hwEval = hwEval || target.hwEval;
                        target.score1 = score1 ? parseFloat(score1) : target.score1;
                        target.score2 = score2 ? parseFloat(score2) : target.score2;
                        target.generalNotes = generalNotes !== undefined ? generalNotes : target.generalNotes;
                        target.detailedNotes = studentNotes || target.detailedNotes;
                        saveDemoStore(store);
                    }
                    result = { success: true };
                }
                
                else if (functionName === 'deleteClassLessonLog') {
                    const [logId] = args;
                    store.lessonLogs = store.lessonLogs.filter(l => l.logId !== logId);
                    saveDemoStore(store);
                    result = { success: true };
                }
                
                // ==========================================
                // 3. BÀI TẬP & NỘP BÀI (HOMEWORK & UPLOAD SIMULATION)
                // ==========================================
                else if (functionName === 'xacThucMaBaiTap') {
                    const rawCode = String(args[0] || "").trim();
                    const norm = normalizePhone(rawCode);
                    let target = store.students.find(s => normalizePhone(s.homeworkId) === norm || normalizePhone(s.studentId) === norm || normalizePhone(s.parentPhone) === norm);
                    if (!target && store.students.length > 0) target = store.students[0];
                    
                    if (target) {
                        let assignedList = store.homework.filter(h => h.classId === target.classId).map((h, idx) => ({
                            hwId: h.hwId,
                            rowIndex: idx + 1,
                            studentName: target.studentName,
                            title: h.hwName,
                            releaseDate: h.assignedDate,
                            deadline: h.deadline,
                            fileUrl: h.fileUrl,
                            fileName: h.fileName,
                            submitLink: h.submitLink
                        }));
                        
                        let mySubs = store.submissions.filter(s => s.studentName === target.studentName || s.homeworkCode === target.homeworkId).map((s, idx) => ({
                            subId: s.submissionId,
                            studentName: s.studentName,
                            lessonName: s.lessonName,
                            fileUrl: s.fileUrl,
                            timestamp: s.submittedAt,
                            status: s.status,
                            score: s.score,
                            comment: s.comment,
                            rowIndex: idx + 1
                        }));
                        
                        result = {
                            timThay: true,
                            ma: target.homeworkId,
                            studentName: target.studentName,
                            className: "Lớp 12 - Luyện Thi THPT QG Vật Lý",
                            assignedList: assignedList,
                            submissions: mySubs,
                            isClassStudent: true
                        };
                    } else {
                        result = { timThay: false, thongBao: "Mã bài tập không hợp lệ!" };
                    }
                }
                
                else if (functionName === 'uploadHomeworkFiles' || functionName === 'uploadHomeworkFile') {
                    const [ma, studentName, lessonName, filesList] = args;
                    const subId = `SUB_DEMO_${Date.now()}`;
                    const nowStr = new Date().toLocaleString('vi-VN');
                    let fileUrl = "https://i.postimg.cc/mD47FmN8/qr-demo.png";
                    
                    if (filesList && Array.isArray(filesList) && filesList.length > 0) {
                        let first = filesList[0];
                        if (first.fileBase64) {
                            fileUrl = `data:${first.mimeType || 'image/jpeg'};base64,${first.fileBase64}`;
                        } else if (first.url) {
                            fileUrl = first.url;
                        }
                    } else if (typeof filesList === 'string' && filesList) {
                        fileUrl = filesList;
                    }
                    
                    const newSub = {
                        submissionId: subId,
                        homeworkCode: ma,
                        studentName: studentName || "Học sinh Demo",
                        lessonName: lessonName || "Bài làm Vật Lý",
                        fileUrl: fileUrl,
                        submittedAt: nowStr,
                        submissionDate: new Date().toLocaleDateString('vi-VN'),
                        status: 'Đã nộp',
                        score: "9.5",
                        comment: "Đã nộp bài thành công (Môi trường Demo)!"
                    };
                    store.submissions.unshift(newSub);
                    saveDemoStore(store);
                    result = { success: true, fileUrl: fileUrl };
                }
                
                else if (functionName === 'uploadClassHomeworkFile' || functionName === 'saveClassHomework') {
                    const [classId, className, title, releaseDate, deadline, fileBase64, fileName, mimeType, submitLink] = args;
                    const hwId = `HW_DEMO_${Date.now()}`;
                    const newHw = {
                        hwId: hwId,
                        classId: classId,
                        className: className,
                        subject: "Vật Lý",
                        hwName: title,
                        assignedDate: releaseDate || "15/08/2026",
                        deadline: deadline || "20/08/2026",
                        fileUrl: fileBase64 ? `data:${mimeType || 'application/pdf'};base64,${fileBase64}` : "https://drive.google.com/",
                        fileName: fileName || "Bai_Tap_Vat_Ly.pdf",
                        submitLink: submitLink || "",
                        status: "Active"
                    };
                    store.homework.unshift(newHw);
                    saveDemoStore(store);
                    result = { success: true, hwId: hwId };
                }
                
                // ==========================================
                // 4. ADMIN DASHBOARD & QUẢN LÝ
                // ==========================================
                else if (functionName === 'getAdminDashboardData') {
                    let curMonth = new Date().getMonth() + 1;
                    let curYear = new Date().getFullYear();
                    let curMonthKey = `Tháng ${curMonth}/${curYear}`;
                    let prevMonthKey = `Tháng ${curMonth === 1 ? 12 : curMonth - 1}/${curMonth === 1 ? curYear - 1 : curYear}`;
                    
                    let incomeReports = {};
                    incomeReports[curMonthKey] = {
                        expected: 18500000,
                        paid: 15750000,
                        unpaid: 2750000,
                        tutors: {
                            "0123456789": {
                                name: store.teacher.name,
                                expected: 18500000,
                                paid: 15750000,
                                unpaid: 2750000
                            }
                        }
                    };
                    incomeReports[prevMonthKey] = {
                        expected: 16000000,
                        paid: 16000000,
                        unpaid: 0,
                        tutors: {
                            "0123456789": {
                                name: store.teacher.name,
                                expected: 16000000,
                                paid: 16000000,
                                unpaid: 0
                            }
                        }
                    };
                    
                    result = {
                        success: true,
                        tutors: [store.teacher],
                        students: store.students.map(s => {
                            let cls = store.classes.find(c => c.classId === s.classId);
                            return {
                                id: s.studentId,
                                name: s.studentName,
                                phone: s.parentPhone,
                                parentName: s.parentName,
                                parentPhone: s.parentPhone,
                                tuition: s.tuitionFee,
                                tutorPhone: store.teacher.phone,
                                tutorName: store.teacher.name,
                                className: cls ? cls.className : "Lớp 12 Vật Lý",
                                status: "Đang học"
                            };
                        }),
                        classes: store.classes,
                        incomeReports: incomeReports,
                        marqueeAnnouncement: "Chào mừng Quản trị viên đến với hệ thống Demo quản lý Lớp học Vật Lý!",
                        billingAlerts: []
                    };
                }
                
                else if (functionName === 'updateTutorAccountInfo' || functionName === 'adminLuuGiaSu' || functionName === 'adminCapNhatTaiKhoan') {
                    const [oldPhone, name, phone, pin, qrUrl, createdDate, nextBillingDate] = args;
                    if (name) store.teacher.name = name;
                    if (phone) store.teacher.phone = phone;
                    if (pin) store.teacher.pin = pin;
                    if (qrUrl) store.teacher.qrUrl = qrUrl;
                    if (createdDate) store.teacher.registeredDate = createdDate;
                    if (nextBillingDate) store.teacher.nextDueDate = nextBillingDate;
                    saveDemoStore(store);
                    result = { success: true };
                }
                
                else if (functionName === 'adminSetTutorStatus') {
                    const [phone, status] = args;
                    store.teacher.status = status || "Hoạt động";
                    saveDemoStore(store);
                    result = { success: true };
                }
                
                // ==========================================
                // 5. VIDEO KHÓA HỌC & VIDEO LIBRARY
                // ==========================================
                else if (functionName === 'getVideoList') {
                    const [classFilter, topicFilter, lessonFilter] = args;
                    let vids = (store.videos || []).filter(v => {
                        if (classFilter && v.class !== classFilter && v.classLevel !== classFilter) return false;
                        if (topicFilter && v.topic !== topicFilter) return false;
                        if (lessonFilter && v.lesson !== lessonFilter) return false;
                        return true;
                    });
                    result = { success: true, videos: vids };
                }
                
                else if (functionName === 'getVideoFilterOptions' || functionName === 'getVideoFilters') {
                    let vids = store.videos || [];
                    let clsSet = [...new Set(vids.map(v => v.classLevel || v.class).filter(Boolean))];
                    let topSet = [...new Set(vids.map(v => v.topic).filter(Boolean))];
                    let lesSet = [...new Set(vids.map(v => v.lesson).filter(Boolean))];
                    if (clsSet.length === 0) clsSet = ["Lớp 12", "Lớp 11", "Lớp 10", "Lớp 9"];
                    result = { success: true, classes: clsSet, topics: topSet, lessons: lesSet };
                }
                
                else if (functionName === 'addVideoToSheet' || functionName === 'addVideo') {
                    const [name, className, topic, lesson, duration, driveUrl] = args;
                    const vidId = `VID_DEMO_${Date.now()}`;
                    const newVid = {
                        videoId: vidId,
                        name: name || "Bài giảng Vật Lý",
                        class: className || "Lớp 12 - Luyện Thi THPT QG Vật Lý",
                        topic: topic || "Dao động cơ",
                        lesson: lesson || "",
                        duration: duration || "45:00",
                        driveUrl: driveUrl || "https://drive.google.com/",
                        createdAt: new Date().toLocaleString('vi-VN')
                    };
                    if (!store.videos) store.videos = [];
                    store.videos.unshift(newVid);
                    saveDemoStore(store);
                    result = { success: true, videoId: vidId };
                }
                
                else if (functionName === 'editVideoInSheet' || functionName === 'editVideo') {
                    const [videoId, name, className, topic, lesson, duration, driveUrl] = args;
                    let target = (store.videos || []).find(v => v.videoId === videoId);
                    if (target) {
                        target.name = name || target.name;
                        target.class = className || target.class;
                        target.topic = topic || target.topic;
                        target.lesson = lesson || target.lesson;
                        target.duration = duration || target.duration;
                        target.driveUrl = driveUrl || target.driveUrl;
                        saveDemoStore(store);
                    }
                    result = { success: true };
                }
                
                else if (functionName === 'deleteVideoFromSheet' || functionName === 'deleteVideo') {
                    const [videoId] = args;
                    if (store.videos) {
                        store.videos = store.videos.filter(v => v.videoId !== videoId);
                        saveDemoStore(store);
                    }
                    result = { success: true };
                }
                
                else if (functionName === 'getCourseVideos') {
                    const [courseCode] = args;
                    let targetCourse = (store.courses || []).find(c => c.courseCode === courseCode || c.courseId === courseCode);
                    let vids = store.videos || [];
                    if (vids.length === 0 && typeof INITIAL_DEMO_DATA !== 'undefined') {
                        vids = INITIAL_DEMO_DATA.videos || [];
                    }
                    result = {
                        success: true,
                        courseName: targetCourse ? targetCourse.title : "Khóa Học Toàn Diện: Vật Lý 12 - Chinh Phục 9+ THPT QG",
                        courseCode: courseCode || "KH-VATLY12",
                        videos: vids.map((v, idx) => ({
                            videoId: v.videoId || `VID_${idx + 1}`,
                            name: v.name,
                            classLevel: v.classLevel || v.class || "Lớp 12",
                            topic: v.topic || "Vật Lý 12",
                            lesson: v.lesson || `Bài ${idx + 1}`,
                            duration: v.duration || "45:00",
                            fileId: v.fileId || `VID_${idx}`,
                            driveUrl: v.driveUrl || "",
                            thumbUrl: v.thumbUrl || ""
                        }))
                    };
                }
                
                else if (functionName === 'getCourseList') {
                    result = { success: true, courses: store.courses || [] };
                }
                
                else if (functionName === 'getVideoTrashList') {
                    result = { success: true, videos: [] };
                }
                
                // Fallback mặc định
                else {
                    result = { success: true };
                }
                
                if (self._successHandler) self._successHandler(result);
                
            } catch(err) {
                console.error("[Mock API Error]:", err);
                if (self._failureHandler) self._failureHandler(err.toString());
                else if (self._successHandler) self._successHandler({ error: err.toString() });
            }
        }
    }
    
    // Gán Google Apps Script API Shim vào window.google
    window.google = {
        script: {
            get run() {
                return new MockGoogleScriptRunInstance();
            }
        }
    };
    
    console.log("⚡ [DEMO MODE] Mock API Gateway Client-Side đã kích hoạt thành công!");
})();
