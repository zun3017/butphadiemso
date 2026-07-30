/**
 * CLASS DASHBOARD SCRIPT - ĐA MÔN & ĐA LỚP
 */

document.addEventListener('DOMContentLoaded', () => {
    if (window.APP_CONFIG) {
        const brandTeacherName = document.getElementById('brandTeacherName');
        if (brandTeacherName) brandTeacherName.innerText = APP_CONFIG.BRAND_NAME;
    }

    const formTeacherAuth = document.getElementById('formTeacherAuth');
    if (formTeacherAuth) {
        formTeacherAuth.addEventListener('submit', (e) => {
            e.preventDefault();
            authenticateTeacher();
        });
    }

    const formCreateClass = document.getElementById('formCreateClass');
    if (formCreateClass) {
        formCreateClass.addEventListener('submit', (e) => {
            e.preventDefault();
            createNewClass();
        });
    }

    const formCreateHomework = document.getElementById('formCreateHomework');
    if (formCreateHomework) {
        formCreateHomework.addEventListener('submit', (e) => {
            e.preventDefault();
            createNewHomework();
        });
    }
});

function switchRoleTab(role) {
    const studentRoleView = document.getElementById('studentRoleView');
    const teacherRoleView = document.getElementById('teacherRoleView');
    const tabStudentBtn = document.getElementById('tabStudentBtn');
    const tabTeacherBtn = document.getElementById('tabTeacherBtn');

    if (role === 'student') {
        studentRoleView.style.display = 'block';
        teacherRoleView.style.display = 'none';
        tabStudentBtn.className = 'btn btn-primary';
        tabTeacherBtn.className = 'btn btn-secondary';
    } else {
        studentRoleView.style.display = 'none';
        teacherRoleView.style.display = 'block';
        tabStudentBtn.className = 'btn btn-secondary';
        tabTeacherBtn.className = 'btn btn-primary';
    }
}

function authenticateTeacher() {
    const pin = document.getElementById('teacherPinInput').value.trim();
    if (pin === '1234' || pin === '8888') {
        document.getElementById('teacherAuthCard').style.display = 'none';
        document.getElementById('teacherAdminContent').style.display = 'block';
        alert('Đăng nhập Quản lý Lớp học thành công!');
    } else {
        alert('Mã PIN không chính xác! (Mã PIN dùng thử mặc định: 1234)');
    }
}

function createNewClass() {
    const subject = document.getElementById('newClassSubject').value;
    const name = document.getElementById('newClassName').value;
    const schedule = document.getElementById('newClassSchedule').value;

    const payload = {
        subject: subject,
        name: name,
        schedule: schedule,
        teacher: 'Thầy Nguyễn Hữu Phúc',
        pin: '1234'
    };

    google.script.run
        .withSuccessHandler((response) => {
            if (response && response.success) {
                alert(response.message || 'Tạo lớp học mới thành công!');
                document.getElementById('formCreateClass').reset();
            } else {
                alert('Có lỗi xảy ra!');
            }
        })
        .withFailureHandler((err) => {
            alert('Lỗi kết nối máy chủ: ' + err);
        })
        .createClass(payload);
}

function createNewHomework() {
    const classId = document.getElementById('newHwClass').value;
    const title = document.getElementById('newHwTitle').value;
    const deadline = document.getElementById('newHwDeadline').value;
    const fileUrl = document.getElementById('newHwFileUrl').value;

    const payload = {
        classId: classId,
        title: title,
        deadline: deadline,
        fileUrl: fileUrl
    };

    google.script.run
        .withSuccessHandler((response) => {
            if (response && response.success) {
                alert(response.message || 'Giao bài tập mới thành công!');
                document.getElementById('formCreateHomework').reset();
            } else {
                alert('Có lỗi xảy ra khi tạo bài tập!');
            }
        })
        .withFailureHandler((err) => {
            alert('Lỗi kết nối máy chủ: ' + err);
        })
        .createHomework(payload);
}
