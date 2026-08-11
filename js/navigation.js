/**
 * Tệp xử lý đăng nhập chung cho Học sinh / Phụ huynh
 */

// Hàm chuyển đổi link Google Drive sang link ảnh trực tiếp
function convertDriveLink(url) {
    if (!url) return "";
    var match = url.match(/\/d\/(.*?)\//);
    if (match && match[1]) return "https://drive.google.com/uc?export=view&id=" + match[1];
    match = url.match(/id=(.*?)&/);
    if (match && match[1]) return "https://drive.google.com/uc?export=view&id=" + match[1];
    match = url.match(/id=([^&]*)/);
    if (match && match[1]) return "https://drive.google.com/uc?export=view&id=" + match[1];
    return url;
}

var globalRole = 'student';

var globalInputPhone = '';

function xuLyTraCuu(roleType) {
    globalRole = roleType || 'student';
    var maHocSinh = document.getElementById('maHocSinh').value;
    
    if (!maHocSinh || maHocSinh.trim() === '') {
        showError('Vui lòng nhập Số điện thoại hoặc Mã khóa học!');
        return;
    }

    var loadingEl = document.getElementById('loadingText');
    var btn = document.querySelector('.btn-submit');
    var errorEl = document.getElementById('thongBaoLoi');
    
    if (errorEl) errorEl.style.display = 'none';
    if (loadingEl) loadingEl.style.display = 'block';
    if (btn) btn.disabled = true;

    globalInputPhone = maHocSinh.trim();
    var cleanCode = globalInputPhone.toUpperCase();

    // Bước 1: Nếu có dạng KH-... → kiểm tra mã khóa học trước
    if (cleanCode.startsWith('KH-')) {
        google.script.run
            .withSuccessHandler(function(res) {
                if (loadingEl) loadingEl.style.display = 'none';
                if (btn) btn.disabled = false;

                if (!res) { showError('Lỗi không xác định.'); return; }
                if (!res.success) { showError(res.message || 'Mã không hợp lệ.'); return; }

                if (res.type === 'course') {
                    // Lưu mã vào cả sessionStorage và localStorage để không bị văng phiên
                    sessionStorage.setItem('courseCode', res.courseCode);
                    sessionStorage.setItem('courseName', res.courseName || '');
                    localStorage.setItem('courseCode', res.courseCode);
                    localStorage.setItem('courseName', res.courseName || '');
                    window.location.href = 'course-viewer.html?code=' + encodeURIComponent(res.courseCode);
                } else {
                    showError('Mã không hợp lệ.');
                }
            })
            .withFailureHandler(function(err) {
                if (loadingEl) loadingEl.style.display = 'none';
                if (btn) btn.disabled = false;
                showError('Lỗi kết nối server: ' + err);
            })
            .checkLoginCode(globalInputPhone);
        return;
    }

    // Bước 2: Không phải mã KH → đăng nhập thông thường (SĐT)
    google.script.run
        .withSuccessHandler(function(res) {
            if (loadingEl) loadingEl.style.display = 'none';
            if (btn) btn.disabled = false;

            if (res.error) {
                showError(res.error);
                return;
            }

            if (res.role === 'student' || res.role === 'parent') {
                if (res.multipleStudents) {
                    hienThiChonCon(res.childrenList);
                } else {
                    dangNhapThanhCong(res.data, globalRole);
                }
            } else {
                showError('Đăng nhập thất bại. Vai trò không hợp lệ.');
            }
        })
        .withFailureHandler(function(err) {
            if (loadingEl) loadingEl.style.display = 'none';
            if (btn) btn.disabled = false;
            showError('Lỗi kết nối server: ' + err);
        })
        .loginSystem(globalInputPhone, '', null);
}


function hienThiChonCon(childrenList) {
    var modal = document.getElementById('childSelectorModal');
    var container = document.getElementById('childrenBtnContainer');
    if (!modal || !container) return;

    container.innerHTML = '';
    childrenList.forEach(function(child) {
        var btn = document.createElement('button');
        btn.innerHTML = '<strong>' + (child.name || child.code) + '</strong> - Mã: ' + child.code;
        btn.style.cssText = 'background: rgba(142,77,255,0.1); border: 1px solid rgba(142,77,255,0.3); padding: 12px; border-radius: 12px; color: #FFF; font-size: 15px; cursor: pointer; transition: 0.2s; text-align: left;';
        btn.onmouseover = function() { this.style.background = 'rgba(142,77,255,0.25)'; };
        btn.onmouseout = function() { this.style.background = 'rgba(142,77,255,0.1)'; };
        
        btn.onclick = function() {
            modal.style.display = 'none';
            // Gọi lại login với childName
            var loadingEl = document.getElementById('loadingText');
            if (loadingEl) loadingEl.style.display = 'block';
            
            google.script.run
                .withSuccessHandler(function(res) {
                    if (loadingEl) loadingEl.style.display = 'none';
                    if (res.error) {
                        showError(res.error);
                    } else {
                        dangNhapThanhCong(res.data, globalRole);
                    }
                })
                .withFailureHandler(function(err) {
                    if (loadingEl) loadingEl.style.display = 'none';
                    showError("Lỗi kết nối: " + err);
                })
                .loginSystem(globalInputPhone, "", child.name);
        };
        container.appendChild(btn);
    });

    modal.style.display = 'flex';
}

function dangNhapThanhCong(data, role) {
    if (!data) {
        showError("Không nhận được dữ liệu hợp lệ từ hệ thống.");
        return;
    }
    
    // Xóa sạch session/local storage cũ để tránh dính dữ liệu học sinh trước
    sessionStorage.clear();
    localStorage.removeItem('dashboardData');
    localStorage.removeItem('userPhone');
    localStorage.removeItem('selectedStudentName');
    localStorage.removeItem('userRole');

    var sName = data.tenHocSinh || data.name || data.studentName || data.code || '';

    sessionStorage.setItem('dashboardData', JSON.stringify(data));
    sessionStorage.setItem('userRole', role || 'student');
    sessionStorage.setItem('userPhone', globalInputPhone);
    sessionStorage.setItem('selectedStudentName', sName);

    localStorage.setItem('dashboardData', JSON.stringify(data));
    localStorage.setItem('userRole', role || 'student');
    localStorage.setItem('userPhone', globalInputPhone);
    localStorage.setItem('selectedStudentName', sName);
    
    // Chuyển hướng
    window.location.href = 'parent-dashboard.html';
}

function showError(msg) {
    var errorEl = document.getElementById('thongBaoLoi');
    if (errorEl) {
        errorEl.textContent = msg;
        errorEl.style.display = 'block';
    } else {
        alert(msg);
    }
}
