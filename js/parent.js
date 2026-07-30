/**
 * PARENT DASHBOARD LOGIC (DÀNH CHO PHỤ HUYNH & HỌC SINH)
 * Tra cứu điểm số, chuyên cần, nhận xét & gửi phản hồi cho Giáo viên
 */

var globalParentData = null;
var scoreChartInstance = null;
var visibleLogsCount = 5;

// 1. NÚT TRỞ VỀ TRANG CHỦ
function quayLai() {
    window.location.href = "index.html";
}

// 2. TRA CỨU DỮ LIỆU PHỤ HUYNH / HỌC SINH
function traCuuPhuHuynh(searchKey) {
    var key = searchKey || document.getElementById('searchParentInput')?.value;
    if (!key || key.trim() === '') {
        alert("Vui lòng nhập Số điện thoại Phụ huynh hoặc Mã HS!");
        return;
    }

    var loadingEl = document.getElementById('loadingText');
    if (loadingEl) loadingEl.style.display = 'block';

    google.script.run.withSuccessHandler(function(res) {
        if (loadingEl) loadingEl.style.display = 'none';
        if (res && res.success && res.student) {
            globalParentData = res.student;
            renderParentView(res.student);
        } else {
            alert(res.error || "Không tìm thấy thông tin học sinh với dữ liệu trên!");
        }
    }).withFailureHandler(function(err) {
        if (loadingEl) loadingEl.style.display = 'none';
        alert("Lỗi kết nối server: " + err);
    }).getParentData(key.trim());
}

// 3. HIỂN THỊ GIAO DIỆN PHỤ HUYNH
function renderParentView(student) {
    var loiChaoEl = document.getElementById('loiChao');
    if (loiChaoEl) {
        loiChaoEl.innerHTML = `
            <div style="background: rgba(142,77,255,0.1); border: 1px solid #8E4DFF; border-radius: 16px; padding: 20px; margin-bottom: 20px; text-align: left;">
                <h3 style="color: #FFD23F; margin-bottom: 6px;"><i class="fa-solid fa-user-graduate"></i> Học sinh: ${student.name || 'Học sinh'}</h3>
                <p style="color: #A6ADCE; font-size: 14px; margin: 0;">Mã HS: <strong>${student.code}</strong> | PH: <strong>${student.parentName || 'Phụ huynh'}</strong> (${student.parentPhone})</p>
            </div>
        `;
    }

    renderScoreTable(student.scores || []);
    renderScoreChart(student.scores || []);
}

// 4. HIỂN THỊ BẢNG ĐIỂM SỐ & BÀI TẬP
function renderScoreTable(scores) {
    var tableEl = document.getElementById('khuVucLichSu');
    if (!tableEl) return;

    if (!scores || scores.length === 0) {
        tableEl.innerHTML = "<p style='color:#A6ADCE; padding: 15px;'>Chưa có dữ liệu bài tập hoặc điểm số.</p>";
        return;
    }

    var html = `
        <table class="data-table" style="width:100%; border-collapse: collapse; text-align: left;">
            <thead>
                <tr style="background: rgba(255,255,255,0.05); color: #8E4DFF;">
                    <th style="padding: 12px;">Môn học</th>
                    <th style="padding: 12px;">Mã bài tập</th>
                    <th style="padding: 12px;">Ngày nộp</th>
                    <th style="padding: 12px;">Điểm số</th>
                    <th style="padding: 12px;">Nhận xét Thầy giáo</th>
                </tr>
            </thead>
            <tbody>
    `;

    var limit = Math.min(scores.length, visibleLogsCount);
    for (var i = 0; i < limit; i++) {
        var s = scores[i] || {};
        html += `
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                <td style="padding: 12px; font-weight: bold; color: #FFD23F;">${s.subject || 'Môn Toán'}</td>
                <td style="padding: 12px;">${s.homeworkId || '-'}</td>
                <td style="padding: 12px;">${s.submitTime || '-'}</td>
                <td style="padding: 12px; color: #10B981; font-weight: bold;">${s.score || 'Đã nộp'}</td>
                <td style="padding: 12px; color: #A6ADCE;">${s.comment || 'Tốt'}</td>
            </tr>
        `;
    }

    html += "</tbody></table>";
    tableEl.innerHTML = html;

    var btnLoadMore = document.getElementById('btnLoadMore');
    var loadMoreContainer = document.getElementById('loadMoreContainer');
    if (loadMoreContainer) {
        loadMoreContainer.style.display = (scores.length > visibleLogsCount) ? 'block' : 'none';
    }
}

// 5. NÚT XEM THÊM BUỔI HỌC
function hienThemBuoi() {
    visibleLogsCount += 5;
    if (globalParentData && globalParentData.scores) {
        renderScoreTable(globalParentData.scores);
    }
}

// 6. BẬT/TẮT ĐƯỜNG BIỂU ĐỒ DIỂM SỐ
function toggleDataset(index) {
    if (scoreChartInstance && scoreChartInstance.data.datasets[index]) {
        var meta = scoreChartInstance.getDatasetMeta(index);
        meta.hidden = meta.hidden === null ? !scoreChartInstance.data.datasets[index].hidden : null;
        scoreChartInstance.update();
    }
}

// 7. VẼ BIỂU ĐỒ ĐIỂM SỐ
function renderScoreChart(scores) {
    var canvas = document.getElementById('diemChart');
    if (!canvas) return;

    var labels = [];
    var dataPoints = [];

    scores.forEach(function(s, idx) {
        labels.push(s.subject ? (s.subject + " (Bài " + (idx+1) + ")") : ("Bài " + (idx+1)));
        var num = parseFloat(s.score);
        dataPoints.push(isNaN(num) ? 8 : num);
    });

    if (scoreChartInstance) {
        scoreChartInstance.destroy();
    }

    var ctx = canvas.getContext('2d');
    scoreChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Điểm số môn học',
                data: dataPoints,
                borderColor: '#8E4DFF',
                backgroundColor: 'rgba(142, 77, 255, 0.15)',
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { min: 0, max: 10 }
            }
        }
    });
}

// 8. PHỤ HUYNH GỬI PHẢN HỒI CHO GIÁO VIÊN
function guiPhanHoiPhuHuynh() {
    var input = document.getElementById('feedbackInput');
    var msgStatus = document.getElementById('feedbackMessage');
    
    if (!input || input.value.trim() === '') {
        alert("Vui lòng nhập nội dung phản hồi trước khi gửi!");
        return;
    }

    var text = input.value.trim();
    if (msgStatus) msgStatus.innerText = "Đang gửi phản hồi...";

    var studentCode = globalParentData ? globalParentData.code : (sessionStorage.getItem('userPhone') || 'PH');
    var studentName = globalParentData ? globalParentData.name : 'Phụ huynh';

    google.script.run.withSuccessHandler(function(res) {
        if (msgStatus) {
            msgStatus.style.color = "#10B981";
            msgStatus.innerText = "Cảm ơn Phụ huynh! Phản hồi đã được gửi tới Thầy giáo thành công.";
        }
        input.value = "";
    }).withFailureHandler(function(err) {
        if (msgStatus) {
            msgStatus.style.color = "#EF4444";
            msgStatus.innerText = "Gửi phản hồi thất bại: " + err;
        }
    }).submitHomework({
        studentCode: studentCode,
        studentName: studentName,
        subject: "Phản hồi Phụ huynh",
        fileUrl: text
    });
}
