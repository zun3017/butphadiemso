/**
 * PARENT DASHBOARD SCRIPT - ĐA MÔN & ĐA LỚP
 */

document.addEventListener('DOMContentLoaded', () => {
    if (window.APP_CONFIG) {
        const brandTeacherName = document.getElementById('brandTeacherName');
        if (brandTeacherName) brandTeacherName.innerText = APP_CONFIG.BRAND_NAME;

        if (APP_CONFIG.BANK_INFO) {
            const bankName = document.getElementById('bankName');
            const bankAcc = document.getElementById('bankAcc');
            const bankHolder = document.getElementById('bankHolder');

            if (bankName) bankName.innerText = APP_CONFIG.BANK_INFO.BANK_NAME;
            if (bankAcc) bankAcc.innerText = APP_CONFIG.BANK_INFO.ACCOUNT_NUMBER;
            if (bankHolder) bankHolder.innerText = APP_CONFIG.BANK_INFO.ACCOUNT_HOLDER;
        }
    }

    const formSearchParent = document.getElementById('formSearchParent');
    if (formSearchParent) {
        formSearchParent.addEventListener('submit', (e) => {
            e.preventDefault();
            searchParentData();
        });
    }
});

function searchParentData() {
    const searchKey = document.getElementById('parentSearchInput').value.trim();
    if (!searchKey) {
        alert('Vui lòng nhập Số điện thoại hoặc Mã học sinh!');
        return;
    }

    google.script.run
        .withSuccessHandler((response) => {
            if (response && response.success && response.student) {
                renderStudentData(response.student);
            } else {
                alert(response.error || 'Không tìm thấy dữ liệu học sinh với thông tin này!');
            }
        })
        .withFailureHandler((err) => {
            alert('Lỗi kết nối máy chủ: ' + err);
        })
        .getParentData(searchKey);
}

function renderStudentData(student) {
    document.getElementById('resStudentName').innerText = student.name || '---';
    document.getElementById('resStudentCode').innerText = student.code || '---';
    
    // Render enrolled subjects/classes
    const resClasses = document.getElementById('resEnrolledClasses');
    if (resClasses && student.enrolledClasses) {
        resClasses.innerHTML = '';
        student.enrolledClasses.forEach(c => {
            resClasses.innerHTML += `
                <div style="background: #F8FAFC; border: 1px solid var(--border-color); padding: 8px 12px; border-radius: var(--radius-sm); margin-bottom: 6px;">
                    <strong>${c.subject}</strong> (${c.classId}) - <span class="badge badge-success">${c.attendance} Chuyên cần</span>
                </div>
            `;
        });
    }

    // Render scores per subject
    const tbody = document.getElementById('scoresTableBody');
    if (tbody && student.scores && student.scores.length > 0) {
        tbody.innerHTML = '';
        student.scores.forEach(s => {
            tbody.innerHTML += `
                <tr style="border-bottom: 1px solid var(--border-color);">
                    <td style="padding: 12px;"><span class="badge badge-primary">${s.subject}</span></td>
                    <td style="padding: 12px; font-weight: 600;">${s.testName || s.homeworkId}</td>
                    <td style="padding: 12px; color: var(--text-muted);">${s.submitTime || '---'}</td>
                    <td style="padding: 12px; text-align: right;"><span class="badge badge-success" style="font-size: 14px;">${s.score}</span></td>
                </tr>
            `;
        });
    }
}
