/**
 * PARENT DASHBOARD LOGIC (DÀNH CHO PHỤ HUYNH & HỌC SINH - LỚP HỌC)
 * Đồng bộ logic từ student.js (folder chính)
 * Tra cứu điểm số, chuyên cần, nhận xét & gửi phản hồi cho Giáo viên
 */

var currentChartInstance = null;
var currentStudentName = "";

// Hàm chuyển đổi link Google Drive sang link ảnh trực tiếp
function convertDriveLink(url) {
    if (!url) return "";
    var match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) return "https://drive.google.com/uc?export=view&id=" + match[1];
    match = url.match(/id=([a-zA-Z0-9_-]+)/);
    if (match && match[1]) return "https://drive.google.com/uc?export=view&id=" + match[1];
    return url;
}

// ==================== RENDER DASHBOARD PHỤ HUYNH ====================
function renderStudentView(ketQua) {
    // Hủy biểu đồ cũ nếu có
    if (currentChartInstance) {
        currentChartInstance.destroy();
        currentChartInstance = null;
    }

    // Hiện khung kết quả
    var resBox = document.getElementById('resultBox');
    if (resBox) resBox.style.display = 'block';

    var studentPhone = sessionStorage.getItem('userPhone') || localStorage.getItem('userPhone') || "";
    if (studentPhone && studentPhone.charAt(0) !== '0' && studentPhone.length === 9) {
        studentPhone = '0' + studentPhone;
    }

    // Lấy tên lớp học từ lịch sử hoặc data
    var lopHoc = ketQua.className || ketQua.tenLop || "Đang cập nhật";
    if ((!lopHoc || lopHoc === "Đang cập nhật") && ketQua.lichSuHocTap && ketQua.lichSuHocTap.length > 0) {
        for (var k = 0; k < ketQua.lichSuHocTap.length; k++) {
            if (ketQua.lichSuHocTap[k].mon) {
                lopHoc = ketQua.lichSuHocTap[k].mon;
                break;
            }
        }
    }

    // --- Greeting card ---
    var loiChaoEl = document.getElementById('loiChao');
    if (loiChaoEl) {
        loiChaoEl.innerHTML =
            "<h3 style='color: #FFD23F; font-size: 20px; font-weight: 800; margin: 0 0 8px 0; text-align: center; font-family: Inter;'>Xin chào, <span style='color: #FFFFFF;'>" + (ketQua.tenHocSinh || 'Học sinh') + "</span> 👋</h3>" +
            "<p style='color: #A6ADCE; font-size: 13px; text-align: center; margin: 0 0 25px 0; font-family: Inter;'>(" + lopHoc + " • Số điện thoại: " + studentPhone + ")</p>";
    }
    currentStudentName = ketQua.tenHocSinh || "";

    // Khôi phục trạng thái active cho các nút legend
    var btnDauGio = document.getElementById('btnLegDauGio');
    var btnDinhKi = document.getElementById('btnLegDinhKi');
    if (btnDauGio && btnDinhKi) {
        btnDauGio.className = 'legend-btn active btn-dau-gio';
        btnDinhKi.className = 'legend-btn active btn-dinh-ki';
    }

    // --- 1. HIỂN THỊ KHUNG THÔNG BÁO ---
    var khuVucThongBao = document.getElementById('khuVucThongBao');
    if (khuVucThongBao) {
        var thongBaoText = ketQua.thongBaoHocSinh || "";
        if (thongBaoText.trim() !== "") {
            khuVucThongBao.innerHTML =
                '<div class="announcement-box has-msg">' +
                    '<div class="announcement-icon"><i class="fa-solid fa-bullhorn"></i></div>' +
                    '<div class="announcement-content">' +
                        '<div class="announcement-title">Thông báo từ Giáo viên</div>' +
                        '<div class="announcement-text">' + thongBaoText + '</div>' +
                    '</div>' +
                '</div>';
        } else {
            khuVucThongBao.innerHTML =
                '<div class="announcement-box no-msg">' +
                    '<div class="announcement-icon"><i class="fa-regular fa-bell"></i></div>' +
                    '<div class="announcement-content">' +
                        '<div class="announcement-title">Thông báo</div>' +
                        '<div class="announcement-text">Chưa có thông báo</div>' +
                    '</div>' +
                '</div>';
        }
    }

    // --- 2. TÍNH TOÁN SỐ LIỆU TÓM TẮT THEO THÁNG HIỆN TẠI ---
    var today = new Date();
    var currentMonth = today.getMonth(); // 0 - 11
    var currentYear = today.getFullYear();

    // Thiết lập nhãn động cho tháng hiện tại
    var elLblBuoiHoc = document.getElementById('lblBuoiHoc');
    if (elLblBuoiHoc) elLblBuoiHoc.innerText = "Số buổi đã học (Tháng " + (currentMonth + 1) + ")";
    var elLblBuoiNghi = document.getElementById('lblBuoiNghi');
    if (elLblBuoiNghi) elLblBuoiNghi.innerText = "Số buổi nghỉ (Tháng " + (currentMonth + 1) + ")";

    var buoiHocThangNay = 0;
    var buoiNghiThangNay = 0;
    var listDiemDauGioThangNay = [];
    var listDiemDinhKiThangNay = [];
    var tongBTVNThangNay = 0;
    var completedBTVNThangNay = 0;

    var lichSu = ketQua.lichSuHocTap || [];

    lichSu.forEach(function(item) {
        var parsedDate = null;
        if (item.ngay) {
            var cleanStr = item.ngay.split(" ")[0].trim();
            var parts = cleanStr.split(/[-\/]/);
            if (parts.length === 3) {
                var y, m;
                if (parts[0].length === 4) { // YYYY-MM-DD
                    y = parseInt(parts[0], 10);
                    m = parseInt(parts[1], 10) - 1;
                } else if (parts[2].length === 4) { // DD/MM/YYYY
                    y = parseInt(parts[2], 10);
                    m = parseInt(parts[1], 10) - 1;
                }
                if (!isNaN(y) && !isNaN(m)) {
                    parsedDate = { year: y, month: m };
                }
            } else if (parts.length === 2) { // DD/MM
                var m2 = parseInt(parts[1], 10) - 1;
                var y2 = currentYear;
                if (!isNaN(y2) && !isNaN(m2)) {
                    parsedDate = { year: y2, month: m2 };
                }
            }
        }

        if (!parsedDate && item.ngay) {
            var dateObj = new Date(item.ngay);
            if (!isNaN(dateObj.getTime())) {
                parsedDate = { year: dateObj.getFullYear(), month: dateObj.getMonth() };
            }
        }

        // Chỉ tính toán nếu buổi học nằm trong tháng hiện tại
        if (parsedDate && parsedDate.year === currentYear && parsedDate.month === currentMonth) {
            var tt = (item.trangThai || "").trim().toLowerCase();
            if (tt === "đã học" || tt === "học bù" || tt === "có mặt" || tt === "đi muộn") {
                buoiHocThangNay++;
            } else if (tt.indexOf("hủy") !== -1 || tt.indexOf("nghỉ") !== -1 || tt === "vắng" || tt === "vắng mặt") {
                buoiNghiThangNay++;
            }

            // Điểm đầu giờ & định kì
            var scoreDG = parseFloat(item.diemDauGio);
            var scoreDK = parseFloat(item.diemDinhKi);
            if (!isNaN(scoreDG) && scoreDG >= 0 && scoreDG <= 10) {
                listDiemDauGioThangNay.push(scoreDG);
            }
            if (!isNaN(scoreDK) && scoreDK >= 0 && scoreDK <= 10) {
                listDiemDinhKiThangNay.push(scoreDK);
            }

            // Đánh giá BTVN
            var btvnStr = (item.danhGiaBTVN || "").trim().toLowerCase();
            if (btvnStr !== "") {
                tongBTVNThangNay++;
                if (btvnStr.indexOf("hoàn thành") !== -1) {
                    completedBTVNThangNay += 1.0;
                } else if (btvnStr.indexOf("thiếu") !== -1) {
                    var matchBtvn = btvnStr.match(/thiếu\s+(\d+)/);
                    if (matchBtvn) {
                        var missingCount = parseInt(matchBtvn[1], 10);
                        var completedCount = 5 - missingCount;
                        if (completedCount < 0) completedCount = 0;
                        completedBTVNThangNay += (completedCount / 5.0);
                    } else {
                        completedBTVNThangNay += 0.0;
                    }
                } else {
                    completedBTVNThangNay += 0.0;
                }
            }
        }
    });

    // Gán chỉ số trung bình điểm Đầu Giờ (tháng)
    var valDiemDauGio = "Chưa có";
    var numDiemDauGio = null;
    if (listDiemDauGioThangNay.length > 0) {
        var sumDG = 0;
        for (var s = 0; s < listDiemDauGioThangNay.length; s++) { sumDG += listDiemDauGioThangNay[s]; }
        numDiemDauGio = sumDG / listDiemDauGioThangNay.length;
        valDiemDauGio = numDiemDauGio.toFixed(2);
    }
    var elDauGio = document.getElementById('valDiemDauGio');
    if (elDauGio) elDauGio.innerText = valDiemDauGio;

    // Gán chỉ số trung bình điểm Định Kỳ (tháng)
    var valDiemDinhKi = "Chưa có";
    var numDiemDinhKi = null;
    if (listDiemDinhKiThangNay.length > 0) {
        var sumDK = 0;
        for (var k2 = 0; k2 < listDiemDinhKiThangNay.length; k2++) { sumDK += listDiemDinhKiThangNay[k2]; }
        numDiemDinhKi = sumDK / listDiemDinhKiThangNay.length;
        valDiemDinhKi = numDiemDinhKi.toFixed(2);
    }
    var elDinhKi = document.getElementById('valDiemDinhKi');
    if (elDinhKi) elDinhKi.innerText = valDiemDinhKi;

    // Gán tỷ lệ BTVN (%)
    var valBTVNText = "Chưa có";
    var btvnPercent = null;
    if (tongBTVNThangNay > 0) {
        btvnPercent = Math.round((completedBTVNThangNay / tongBTVNThangNay) * 100);
        valBTVNText = btvnPercent + "%";
    } else if (buoiHocThangNay > 0) {
        btvnPercent = 0;
        valBTVNText = "0%";
    }
    var elBTVN = document.getElementById('valBTVN');
    if (elBTVN) elBTVN.innerText = valBTVNText;

    // Gán số buổi học & nghỉ
    var elBuoiHoc = document.getElementById('valBuoiHoc');
    if (elBuoiHoc) elBuoiHoc.innerText = buoiHocThangNay + " buổi";
    var elBuoiNghi = document.getElementById('valBuoiNghi');
    if (elBuoiNghi) elBuoiNghi.innerText = buoiNghiThangNay + " buổi";

    // --- 3. SINH HUY CHƯƠNG THÀNH TÍCH ---
    function createScoreBadgeHtml(scoreNum) {
        if (scoreNum === null) return "";
        if (scoreNum >= 9.0) {
            return '<div class="medal-badge medal-academic"><i class="fa-solid fa-award"></i> Học giỏi 🎖️</div>';
        } else if (scoreNum >= 8.0) {
            return '<div class="medal-badge medal-silver"><i class="fa-solid fa-award"></i> Học khá 🎖️</div>';
        } else if (scoreNum >= 7.0) {
            return '<div class="medal-badge medal-bronze"><i class="fa-solid fa-award"></i> Học TB 🎖️</div>';
        } else {
            return '<div class="medal-badge" style="background: rgba(255, 51, 51, 0.15); border: 1px solid #FF3333; color: #FF3333; text-shadow: 0 0 5px rgba(255, 51, 51, 0.3);"><i class="fa-solid fa-triangle-exclamation"></i> Học yếu</div>';
        }
    }
    var badgeDauGioEl = document.getElementById('badgeDauGioContainer');
    if (badgeDauGioEl) badgeDauGioEl.innerHTML = createScoreBadgeHtml(numDiemDauGio);

    var badgeDinhKiEl = document.getElementById('badgeDinhKiContainer');
    if (badgeDinhKiEl) badgeDinhKiEl.innerHTML = createScoreBadgeHtml(numDiemDinhKi);

    var btvnBadgeHtml = "";
    if (btvnPercent !== null) {
        if (btvnPercent === 100) {
            btvnBadgeHtml = '<div class="medal-badge medal-platinum"><i class="fa-solid fa-trophy"></i> Chăm chỉ Xuất sắc 🏆</div>';
        } else if (btvnPercent >= 90) {
            btvnBadgeHtml = '<div class="medal-badge medal-gold"><i class="fa-solid fa-medal"></i> Tích cực 🥇</div>';
        } else if (btvnPercent >= 80) {
            btvnBadgeHtml = '<div class="medal-badge medal-silver"><i class="fa-solid fa-medal"></i> Tiến bộ 🥈</div>';
        } else if (btvnPercent >= 70) {
            btvnBadgeHtml = '<div class="medal-badge medal-bronze"><i class="fa-solid fa-medal"></i> Cố gắng 🥉</div>';
        }
    }
    var elBtvnBadge = document.getElementById('btvnBadgeContainer');
    if (elBtvnBadge) elBtvnBadge.innerHTML = btvnBadgeHtml;

    // --- 4. BIỂU ĐỒ ĐIỂM SỐ (TOÀN BỘ LỊCH SỬ) ---
    var labels = [];
    var dataDauGio = [];
    var dataDinhKi = [];

    var lichSuVe = lichSu.slice();
    lichSuVe.forEach(function(item) {
        var rawDate = item.ngay || "";
        var shortDate = rawDate;
        var dateParts = rawDate.match(/(\d{1,2})\/(\d{1,2})/);
        if (dateParts) shortDate = dateParts[1] + "/" + dateParts[2];
        labels.push(shortDate);

        var valDG = parseFloat(item.diemDauGio);
        var valDK = parseFloat(item.diemDinhKi);
        dataDauGio.push(!isNaN(valDG) && valDG >= 0 && valDG <= 10 ? valDG : null);
        dataDinhKi.push(!isNaN(valDK) && valDK >= 0 && valDK <= 10 ? valDK : null);
    });

    if (labels.length > 0) {
        var ctx = document.getElementById('diemChart').getContext('2d');
        currentChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Điểm đầu giờ',
                        data: dataDauGio,
                        borderColor: '#8E4DFF',
                        backgroundColor: 'rgba(142, 77, 255, 0.1)',
                        borderWidth: 2,
                        pointBackgroundColor: '#8E4DFF',
                        pointBorderColor: '#ffffff',
                        pointHoverRadius: 5,
                        tension: 0.3,
                        spanGaps: true
                    },
                    {
                        label: 'Điểm định kì',
                        data: dataDinhKi,
                        borderColor: '#FFD23F',
                        backgroundColor: 'rgba(255, 210, 63, 0.1)',
                        borderWidth: 2,
                        pointBackgroundColor: '#FFD23F',
                        pointBorderColor: '#ffffff',
                        pointHoverRadius: 5,
                        tension: 0.3,
                        spanGaps: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(11, 8, 38, 0.95)',
                        titleColor: '#FFF',
                        bodyColor: '#A6ADCE',
                        titleFont: { family: 'Inter', weight: 'bold', size: 11 },
                        bodyFont: { family: 'Inter', size: 10 },
                        borderColor: '#8E4DFF',
                        borderWidth: 1
                    }
                },
                scales: {
                    x: {
                        grid: { color: 'rgba(255, 255, 255, 0.03)' },
                        ticks: {
                            color: '#A6ADCE',
                            font: { family: 'Inter', size: 9.5 },
                            maxRotation: 45,
                            minRotation: 0,
                            autoSkip: true,
                            maxTicksLimit: 12
                        }
                    },
                    y: {
                        min: 0,
                        max: 10,
                        grid: { color: 'rgba(255, 255, 255, 0.03)' },
                        ticks: { color: '#A6ADCE', font: { family: 'Inter', size: 9.5 }, stepSize: 2 }
                    }
                }
            }
        });
    }

    // --- 5. BẢNG LỊCH SỬ HỌC TẬP ---
    var htmlLichSu = "";
    var totalBuoi = lichSu.length;
    if (totalBuoi > 0) {
        var getStatusBadge = function(trangThai) {
            var tt = (trangThai || "").trim().toLowerCase();
            if (tt === "đã học" || tt === "có mặt") return '<span class="status-badge badge-dahoc">Có mặt</span>';
            if (tt === "học bù") return '<span class="status-badge badge-hocbu">Học bù</span>';
            if (tt === "đi muộn") return '<span class="status-badge badge-hocbu" style="background:rgba(245,158,11,0.15); border-color:rgba(245,158,11,0.4); color:#F59E0B;">Đi muộn</span>';
            if (tt.indexOf("hủy") !== -1 || tt.indexOf("nghỉ") !== -1 || tt === "vắng" || tt === "vắng mặt") {
                var label = (tt === "cả lớp nghỉ") ? "Cả lớp nghỉ" : "Vắng";
                return '<span class="status-badge badge-nghi">' + label + '</span>';
            }
            return '<span class="status-badge" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.15); color: #FFF;">' + trangThai + '</span>';
        };
        var getBtvnBadge = function(btvn) {
            var bt = (btvn || "").trim().toLowerCase();
            if (bt.indexOf("hoàn thành") !== -1) return '<span class="status-badge badge-hoanthanh">Hoàn thành</span>';
            if (bt.indexOf("thiếu") !== -1) return '<span class="status-badge badge-thieu">' + btvn + '</span>';
            return '<span class="status-badge" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.15); color: #FFF;">' + (btvn || '-') + '</span>';
        };

        // Desktop Table
        htmlLichSu += "<div class='desktop-table-view'>";
        htmlLichSu += "<table><tr><th>Buổi</th><th>Ngày học</th><th>Môn / Lớp</th><th>Nội dung</th><th>Đánh giá BTVN</th><th>KT Đầu giờ</th><th>KT Định kì</th><th>Trạng thái</th></tr>";

        // Mobile Accordion
        var htmlMobile = "<div class='mobile-cards-view'>";

        lichSu.slice().reverse().forEach(function(item, idx) {
            var styleStr = (idx >= 5) ? 'style="display: none;" class="history-row hidden-row"' : 'class="history-row"';

            var contentHtml = item.noiDung || '';
            if (item.nhanXetRieng) {
                contentHtml += "<div style='margin-top: 5px; color: #C4B5FD; font-size: 12px; font-style: italic; font-weight: 500;'>Nhận xét riêng: " + item.nhanXetRieng + "</div>";
            }

            // Desktop Row
            htmlLichSu += "<tr " + styleStr + ">";
            htmlLichSu += "<td>" + (item.tuan || (idx + 1)) + "</td>";
            htmlLichSu += "<td>" + (item.ngay || '') + "</td>";
            htmlLichSu += "<td>" + (item.mon || item.tenLop || '') + "</td>";
            htmlLichSu += "<td>" + contentHtml + "</td>";
            htmlLichSu += "<td>" + getBtvnBadge(item.danhGiaBTVN) + "</td>";
            htmlLichSu += "<td>" + (item.diemDauGio || '-') + "</td>";
            htmlLichSu += "<td>" + (item.diemDinhKi || '-') + "</td>";
            htmlLichSu += "<td>" + getStatusBadge(item.trangThai) + "</td>";
            htmlLichSu += "</tr>";

            // Mobile Card
            var mobileStyleStr = (idx >= 5) ? 'style="display: none;" class="accordion-item history-row hidden-row"' : 'class="accordion-item history-row"';
            htmlMobile += "<div " + mobileStyleStr + ">";
            htmlMobile += "  <div class='accordion-header' onclick='toggleAccordion(" + idx + ")'>";
            htmlMobile += "    <div class='accordion-header-title'>";
            htmlMobile += "      <span>Buổi " + (item.tuan || (idx + 1)) + "</span>";
            htmlMobile += "      <span class='accordion-header-date'>" + (item.ngay || '') + "</span>";
            htmlMobile += "    </div>";
            htmlMobile += "    <div class='accordion-header-status'>";
            htmlMobile += "      " + getStatusBadge(item.trangThai);
            htmlMobile += "      <i class='fa-solid fa-chevron-down' id='chevron-" + idx + "'></i>";
            htmlMobile += "    </div>";
            htmlMobile += "  </div>";
            htmlMobile += "  <div class='accordion-body' id='accordion-body-" + idx + "'>";
            htmlMobile += "    <div class='accordion-body-row'><span class='accordion-body-label'>Môn / Lớp</span><span class='accordion-body-val'>" + (item.mon || item.tenLop || '') + "</span></div>";
            htmlMobile += "    <div class='accordion-body-row'><span class='accordion-body-label'>Nội dung dạy học</span><span class='accordion-body-val'>" + contentHtml + "</span></div>";
            htmlMobile += "    <div class='accordion-body-row'><span class='accordion-body-label'>Đánh giá bài tập về nhà</span><span class='accordion-body-val'>" + getBtvnBadge(item.danhGiaBTVN) + "</span></div>";
            htmlMobile += "    <div class='accordion-body-row'><span class='accordion-body-label'>Kiểm tra đầu giờ</span><span class='accordion-body-val'>" + (item.diemDauGio || '-') + "</span></div>";
            htmlMobile += "    <div class='accordion-body-row'><span class='accordion-body-label'>Kiểm tra định kì</span><span class='accordion-body-val'>" + (item.diemDinhKi || '-') + "</span></div>";
            htmlMobile += "  </div>";
            htmlMobile += "</div>";
        });

        htmlLichSu += "</table></div>";
        htmlMobile += "</div>";
        htmlLichSu = htmlLichSu + htmlMobile;
    } else {
        htmlLichSu = "<p style='color: #A6ADCE;'>Chưa có dữ liệu đánh giá nào được cập nhật.</p>";
    }

    var khuVucLichSuEl = document.getElementById('khuVucLichSu');
    if (khuVucLichSuEl) khuVucLichSuEl.innerHTML = htmlLichSu;

    // Ẩn/Hiện nút Xem thêm
    var loadMoreContainer = document.getElementById('loadMoreContainer');
    if (loadMoreContainer) {
        loadMoreContainer.style.display = totalBuoi > 5 ? 'block' : 'none';
    }

    // --- 6. BÀI TẬP / FILE TẢI VỀ ---
    var khuVucBaiTapEl = document.getElementById('khuVucBaiTap');
    if (khuVucBaiTapEl) {
        var htmlBaiTap = "";
        if (ketQua.baiTap && ketQua.baiTap.length > 0) {
            ketQua.baiTap.slice().reverse().forEach(function(bt) {
                htmlBaiTap += "<div class='bt-item'>";
                htmlBaiTap += "<div><strong style='color: #FFD23F;'>[" + (bt.mon || bt.tenLop || 'Lớp') + "]</strong> <span style='color: #FFF; font-weight: 500; font-size: 15px; margin-left: 8px;'>" + bt.tenBai + "</span></div>";
                htmlBaiTap += "<a href='" + bt.link + "' target='_blank' class='btn-download'><i class='fa-solid fa-cloud-arrow-down'></i> Tải Xuống</a>";
                htmlBaiTap += "</div>";
            });
        } else {
            htmlBaiTap = "<p style='color: #A6ADCE;'>Chưa có bài kiểm tra hoặc tài liệu nào.</p>";
        }
        khuVucBaiTapEl.innerHTML = htmlBaiTap;
    }

    // Tự động tải danh sách đề thi trực tuyến được giao cho lớp học này
    var classIdToUse = ketQua.classId || sessionStorage.getItem('activeClassId') || localStorage.getItem('activeClassId') || '';
    if (classIdToUse) {
        // Lưu lại để trang exam.html sử dụng
        sessionStorage.setItem('activeClassId', classIdToUse);
        if (ketQua.studentId) {
            sessionStorage.setItem('userPhone', ketQua.studentId);
            localStorage.setItem('userPhone', ketQua.studentId);
        }
        loadAssignedExams(classIdToUse);
    }
} // End renderStudentView

// Tải danh sách đề thi online được giao cho lớp
function loadAssignedExams(classId) {
    var container = document.getElementById('khuVucDeThiOnline');
    if (!container) return;

    google.script.run
        .withSuccessHandler(function(list) {
            var html = "";
            if (list && list.length > 0) {
                list.forEach(function(exam) {
                    html += "<div class='bt-item' style='display:flex; justify-content:space-between; align-items:center; background:rgba(142,77,255,0.05); border:1px solid rgba(142,77,255,0.15); padding:12px 20px; border-radius:12px; margin-bottom:10px;'>";
                    html += "  <div style='text-align:left;'>";
                    html += "    <strong style='color:#FFD23F; font-size:14px;'>[" + exam.examId + "]</strong>";
                    html += "    <span style='color:#FFF; font-weight:600; margin-left:8px; font-size:15px;'>" + exam.title + "</span>";
                    html += "    <div style='font-size:12px; color:#A6ADCE; margin-top:4px;'><i class='fa-regular fa-clock'></i> Thời gian: " + exam.timeLimit + " phút | Giao ngày: " + exam.dateAssigned + "</div>";
                    html += "  </div>";
                    html += "  <button onclick='startOnlineExam(\"" + exam.examId + "\", \"" + classId + "\")' class='btn-download' style='background:linear-gradient(135deg, #10B981 0%, #059669 100%); border:none; box-shadow: 0 4px 12px rgba(16,185,129,0.3); padding:8px 18px; border-radius:15px; font-weight:700; color:#fff; cursor:pointer; font-size:13px; display:inline-flex; align-items:center; gap:6px;'><i class='fa-solid fa-play'></i> Làm bài</button>";
                    html += "</div>";
                });
            } else {
                html = "<p style='color: #A6ADCE; font-style:italic;'>Không có bài thi trắc nghiệm nào đang mở cho lớp của bạn.</p>";
            }
            container.innerHTML = html;
        })
        .withFailureHandler(function(err) {
            container.innerHTML = "<p style='color: #EF4444;'>Lỗi tải danh sách bài thi: " + err + "</p>";
        })
        .getAssignedExamsForClass(classId);
}

// Bắt đầu làm bài thi trực tuyến
function startOnlineExam(examId, classId) {
    sessionStorage.setItem('activeExamId', examId);
    sessionStorage.setItem('activeClassId', classId);
    window.location.href = "exam.html";
}

// ==================== HELPERS ====================

function quayLai() {
    if (currentChartInstance) {
        currentChartInstance.destroy();
        currentChartInstance = null;
    }
    sessionStorage.clear();
    window.location.href = 'parent-login.html';
}

function hienThemBuoi() {
    var hiddenRows = document.querySelectorAll('.history-row.hidden-row');
    var showCount = 0;
    for (var i = 0; i < hiddenRows.length; i++) {
        if (showCount < 5) {
            hiddenRows[i].style.display = '';
            hiddenRows[i].classList.remove('hidden-row');
            showCount++;
        } else {
            break;
        }
    }
    var remainingHidden = document.querySelectorAll('.history-row.hidden-row');
    if (remainingHidden.length === 0) {
        var loadMoreContainer = document.getElementById('loadMoreContainer');
        if (loadMoreContainer) loadMoreContainer.style.display = 'none';
    }
}

function toggleDataset(index) {
    if (!currentChartInstance) return;
    var meta = currentChartInstance.getDatasetMeta(index);
    var btn = (index === 0) ? document.getElementById('btnLegDauGio') : document.getElementById('btnLegDinhKi');
    if (!btn) return;
    meta.hidden = meta.hidden === null ? !currentChartInstance.data.datasets[index].hidden : null;
    if (meta.hidden) {
        btn.classList.remove('active');
        btn.classList.add('inactive');
    } else {
        btn.classList.remove('inactive');
        btn.classList.add('active');
    }
    currentChartInstance.update();
}

function toggleAccordion(idx) {
    var body = document.getElementById('accordion-body-' + idx);
    if (!body) return;
    var item = body.closest('.accordion-item');
    if (body.style.display === 'flex') {
        body.style.display = 'none';
        if (item) item.classList.remove('active');
    } else {
        body.style.display = 'flex';
        if (item) item.classList.add('active');
    }
}

function guiPhanHoiPhuHuynh() {
    var textarea = document.getElementById('feedbackInput');
    var btn = document.getElementById('btnSubmitFeedback');
    var msg = document.getElementById('feedbackMessage');
    if (!textarea || !btn || !msg) return;

    var content = textarea.value.trim();
    if (content === "") {
        msg.innerText = "Vui lòng nhập nội dung nhận xét/phản hồi trước khi gửi!";
        msg.className = "feedback-message-status error";
        msg.style.display = "block";
        return;
    }

    var maHS = sessionStorage.getItem('userPhone') || localStorage.getItem('userPhone') || "";
    var tenHocSinh = currentStudentName;

    var data = null;
    try { data = JSON.parse(sessionStorage.getItem('dashboardData') || localStorage.getItem('dashboardData')); } catch(e) {}
    var isClass = true; // Luôn là lớp học trong folder này
    var classId = data ? (data.classId || "") : "";
    var className = data ? (data.className || data.tenLop || "Lớp học") : "Lớp học";

    btn.disabled = true;
    btn.innerHTML = 'Đang gửi... <i class="fa-solid fa-circle-notch fa-spin"></i>';
    msg.style.display = 'none';

    google.script.run
        .withSuccessHandler(function(response) {
            btn.disabled = false;
            btn.innerHTML = 'Gửi phản hồi <i class="fa-regular fa-paper-plane"></i>';
            if (response && response.thanhCong) {
                textarea.value = "";
                msg.innerText = "Gửi phản hồi thành công! Cảm ơn ý kiến đóng góp của phụ huynh.";
                msg.className = "feedback-message-status success";
                msg.style.display = "block";
                setTimeout(function() { msg.style.display = "none"; }, 5000);
            } else {
                msg.innerText = "Lỗi khi gửi: " + (response ? (response.thongBao || "Không rõ nguyên nhân.") : "Lỗi không xác định.");
                msg.className = "feedback-message-status error";
                msg.style.display = "block";
            }
        })
        .withFailureHandler(function(err) {
            btn.disabled = false;
            btn.innerHTML = 'Gửi phản hồi <i class="fa-regular fa-paper-plane"></i>';
            msg.innerText = "Lỗi hệ thống: " + err.toString();
            msg.className = "feedback-message-status error";
            msg.style.display = "block";
        })
        .guiPhanHoi(maHS, tenHocSinh, content, isClass, classId, className);
}
