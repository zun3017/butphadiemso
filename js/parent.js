/**
 * PARENT DASHBOARD SCRIPT
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
    document.getElementById('resClassName').innerText = student.className || '---';
    document.getElementById('resAttendance').innerText = student.attendance || '100%';
    document.getElementById('resTuitionStatus').innerText = student.tuitionStatus || 'Bình thường';
    
    if (student.teacherComment) {
        document.getElementById('resTeacherComment').innerText = student.teacherComment;
    }

    const tbody = document.getElementById('scoresTableBody');
    if (tbody && student.scores && student.scores.length > 0) {
        tbody.innerHTML = '';
        student.scores.forEach(s => {
            tbody.innerHTML += `
                <tr style="border-bottom: 1px solid var(--border-color);">
                    <td style="padding: 12px; font-weight: 600;">${s.testName}</td>
                    <td style="padding: 12px; color: var(--text-muted);">${s.date || '---'}</td>
                    <td style="padding: 12px; text-align: right;"><span class="badge badge-success" style="font-size: 14px;">${s.score}</span></td>
                </tr>
            `;
        });
    }
}
