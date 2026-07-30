/**
 * HOMEWORK SCRIPT - BỨT PHÁ ĐIỂM SỐ
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Load Drive Folder Links from config
    if (window.APP_CONFIG) {
        const btnDriveAssignment = document.getElementById('btnDriveAssignment');
        const btnDriveHomework = document.getElementById('btnDriveHomework');
        
        if (btnDriveAssignment) btnDriveAssignment.href = APP_CONFIG.ASSIGNMENT_DRIVE_FOLDER;
        if (btnDriveHomework) btnDriveHomework.href = APP_CONFIG.HOMEWORK_DRIVE_FOLDER;
        
        const brandTeacherName = document.getElementById('brandTeacherName');
        if (brandTeacherName) brandTeacherName.innerText = APP_CONFIG.BRAND_NAME;
    }

    // 2. Load Class List & Homework List via API
    loadClassesAndHomeworks();

    // 3. Form Submit Listener
    const formSubmitHomework = document.getElementById('formSubmitHomework');
    if (formSubmitHomework) {
        formSubmitHomework.addEventListener('submit', (e) => {
            e.preventDefault();
            submitHomeworkForm();
        });
    }
});

function loadClassesAndHomeworks() {
    google.script.run
        .withSuccessHandler((response) => {
            if (response && response.success && response.classes) {
                const selectClass = document.getElementById('selectClass');
                if (selectClass) {
                    selectClass.innerHTML = '<option value="">-- Chọn lớp học --</option>';
                    response.classes.forEach(c => {
                        selectClass.innerHTML += `<option value="${c.id}">${c.name}</option>`;
                    });
                }
            }
        })
        .getClassList();
}

function selectHomeworkToSubmit(homeworkId, classId) {
    const selectClass = document.getElementById('selectClass');
    const selectHomework = document.getElementById('selectHomework');
    
    if (selectClass) selectClass.value = classId;
    if (selectHomework) selectHomework.value = homeworkId;
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function submitHomeworkForm() {
    const classId = document.getElementById('selectClass').value;
    const homeworkId = document.getElementById('selectHomework').value;
    const studentCode = document.getElementById('studentCode').value;
    const studentName = document.getElementById('studentName').value;
    const fileUrl = document.getElementById('fileUrl').value;
    const alertBox = document.getElementById('submitAlert');

    if (!classId || !homeworkId || !studentCode || !studentName || !fileUrl) {
        alert('Vui lòng điền đầy đủ tất cả các trường thông tin!');
        return;
    }

    const payload = {
        className: classId,
        homeworkId: homeworkId,
        studentCode: studentCode,
        studentName: studentName,
        fileUrl: fileUrl
    };

    google.script.run
        .withSuccessHandler((response) => {
            if (response && response.success) {
                if (alertBox) {
                    alertBox.style.display = 'flex';
                    alertBox.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${response.message || 'Nộp bài tập thành công!'}`;
                }
                document.getElementById('formSubmitHomework').reset();
            } else {
                alert('Có lỗi xảy ra: ' + (response.error || 'Vui lòng thử lại sau!'));
            }
        })
        .withFailureHandler((err) => {
            alert('Lỗi kết nối máy chủ: ' + err);
        })
        .submitHomework(payload);
}
