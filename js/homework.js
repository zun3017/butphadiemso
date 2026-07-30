/**
 * HOMEWORK SCRIPT - ĐA MÔN & ĐA LỚP
 */

document.addEventListener('DOMContentLoaded', () => {
    if (window.APP_CONFIG) {
        const btnDriveAssignment = document.getElementById('btnDriveAssignment');
        const btnDriveHomework = document.getElementById('btnDriveHomework');
        
        if (btnDriveAssignment) btnDriveAssignment.href = APP_CONFIG.ASSIGNMENT_DRIVE_FOLDER;
        if (btnDriveHomework) btnDriveHomework.href = APP_CONFIG.HOMEWORK_DRIVE_FOLDER;
        
        const brandTeacherName = document.getElementById('brandTeacherName');
        if (brandTeacherName) brandTeacherName.innerText = APP_CONFIG.BRAND_NAME;
    }

    loadClasses();
    loadHomeworks();

    const formSubmitHomework = document.getElementById('formSubmitHomework');
    if (formSubmitHomework) {
        formSubmitHomework.addEventListener('submit', (e) => {
            e.preventDefault();
            submitHomeworkForm();
        });
    }
});

function onSubjectChange() {
    const subject = document.getElementById('selectSubject').value;
    loadClasses(subject);
    loadHomeworks(null, subject);
}

function onClassChange() {
    const classId = document.getElementById('selectClass').value;
    const subject = document.getElementById('selectSubject').value;
    loadHomeworks(classId, subject);
}

function loadClasses(subjectFilter) {
    google.script.run
        .withSuccessHandler((response) => {
            if (response && response.success && response.classes) {
                const selectClass = document.getElementById('selectClass');
                if (selectClass) {
                    selectClass.innerHTML = '<option value="">-- Chọn lớp học --</option>';
                    response.classes.forEach(c => {
                        selectClass.innerHTML += `<option value="${c.id}">${c.name} (${c.subject})</option>`;
                    });
                }
            }
        })
        .getClassList(subjectFilter);
}

function loadHomeworks(classId, subjectFilter) {
    google.script.run
        .withSuccessHandler((response) => {
            const container = document.getElementById('homeworkListContainer');
            const selectHomework = document.getElementById('selectHomework');
            
            if (response && response.success && response.homeworks && response.homeworks.length > 0) {
                if (selectHomework) {
                    selectHomework.innerHTML = '<option value="">-- Chọn bài tập --</option>';
                    response.homeworks.forEach(h => {
                        selectHomework.innerHTML += `<option value="${h.id}">${h.title} [${h.subject}]</option>`;
                    });
                }

                if (container) {
                    container.innerHTML = '';
                    response.homeworks.forEach(h => {
                        container.innerHTML += `
                            <div style="background: #F8FAFC; border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 16px; margin-bottom: 14px;">
                                <span class="badge badge-primary" style="margin-bottom: 8px;">${h.subject} - ${h.className || h.classId}</span>
                                <h4 style="font-size: 16px; font-weight: 700; color: var(--text-main);">${h.title}</h4>
                                <p style="font-size: 13px; color: var(--text-muted); margin: 6px 0 12px;">Hạn nộp: <strong style="color: var(--danger-color);">${h.deadline}</strong></p>
                                <div style="display: flex; gap: 10px;">
                                    <a href="${h.fileUrl || '#'}" target="_blank" class="btn btn-secondary" style="padding: 6px 12px; font-size: 13px;"><i class="fa-solid fa-download"></i> Tải Đề Bài</a>
                                    <button onclick="selectHomeworkToSubmit('${h.id}', '${h.classId}', '${h.subject}')" class="btn btn-primary" style="padding: 6px 12px; font-size: 13px;"><i class="fa-solid fa-check"></i> Nộp Bài Này</button>
                                </div>
                            </div>
                        `;
                    });
                }
            } else {
                if (selectHomework) selectHomework.innerHTML = '<option value="">-- Không có bài tập nào --</option>';
                if (container) container.innerHTML = '<p style="color: var(--text-muted); text-align: center;">Chưa có bài tập nào cho lớp/môn đã chọn.</p>';
            }
        })
        .getHomeworkList(classId, subjectFilter);
}

function selectHomeworkToSubmit(homeworkId, classId, subject) {
    const selectSubject = document.getElementById('selectSubject');
    const selectClass = document.getElementById('selectClass');
    const selectHomework = document.getElementById('selectHomework');
    
    if (selectSubject) selectSubject.value = subject || 'Tất cả';
    if (selectClass) selectClass.value = classId;
    if (selectHomework) selectHomework.value = homeworkId;
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function submitHomeworkForm() {
    const subject = document.getElementById('selectSubject').value;
    const classId = document.getElementById('selectClass').value;
    const homeworkId = document.getElementById('selectHomework').value;
    const studentCode = document.getElementById('studentCode').value;
    const studentName = document.getElementById('studentName').value;
    const fileUrl = document.getElementById('fileUrl').value;
    const alertBox = document.getElementById('submitAlert');

    if (!classId || !homeworkId || !studentCode || !studentName || !fileUrl) {
        alert('Vui lòng điền đầy đủ các trường thông tin!');
        return;
    }

    const payload = {
        subject: subject,
        classId: classId,
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
                alert('Lỗi: ' + (response.error || 'Vui lòng thử lại sau!'));
            }
        })
        .withFailureHandler((err) => {
            alert('Lỗi kết nối máy chủ: ' + err);
        })
        .submitHomework(payload);
}
