/**
 * CÔNG CỤ CHỤP ẢNH TOÀN TRANG HD (PNG) TỰ ĐỘNG CHO TẤT CẢ CÁC TRANG WEB
 * Đã dò và sửa triệt để tất cả các lỗi hiển thị:
 * 1. Chữ tiêu đề bị tối/mờ -> Ép màu #FFFFFF và #FFD23F sáng nét 100%
 * 2. Vệt cung tròn mặt bàn (desk-surface) đè lên ô tìm kiếm -> Hạ z-index = 1, đưa form tra cứu lên z-index = 100
 * 3. Chữ Gradient (-webkit-background-clip) -> Tự động chuyển màu sáng sắc nét
 * 4. Hiệu ứng cuộn fade-up/animation -> Mở sáng 100% toàn trang từ đầu đến chân trang
 * 5. Biểu đồ Chart.js & Canvas mô phỏng sóng -> Sao chép chính xác từng pixel sang ảnh
 * 6. Tự động ẩn các nút nổi (Zalo, Hotline, Nút chụp, Nút nộp bài tắt)
 */
(function() {
    function loadScript(src, callback) {
        if (document.querySelector('script[src="' + src + '"]')) {
            if (callback) callback();
            return;
        }
        var s = document.createElement('script');
        s.src = src;
        s.onload = callback;
        document.head.appendChild(s);
    }

    loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js', function() {
        loadScript('https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js', function() {
            initScreenshotButton();
        });
    });

    function initScreenshotButton() {
        if (document.getElementById('floatingScreenshotBtn')) return;

        var btn = document.createElement('button');
        btn.id = 'floatingScreenshotBtn';
        btn.innerHTML = '<i class="fa-solid fa-camera" style="font-size:16px;"></i> <span>Tải Ảnh Trang Này (HD)</span>';
        btn.style.cssText = `
            position: fixed;
            bottom: 25px;
            left: 25px;
            z-index: 999999;
            background: linear-gradient(135deg, #FFD23F 0%, #F59E0B 100%);
            color: #000;
            border: 2px solid #FFF;
            border-radius: 30px;
            padding: 12px 22px;
            font-family: 'Inter', sans-serif;
            font-size: 13.5px;
            font-weight: 800;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 8px 30px rgba(0,0,0,0.6), 0 0 25px rgba(255,210,63,0.6);
            transition: all 0.25s ease;
        `;
        
        btn.onmouseover = function() { btn.style.transform = 'translateY(-3px) scale(1.05)'; };
        btn.onmouseout = function() { btn.style.transform = 'translateY(0) scale(1)'; };

        btn.onclick = function() {
            btn.style.display = 'none'; // Tự ẩn nút chụp
            
            var toast = document.createElement('div');
            toast.id = 'tempScreenshotToast';
            toast.innerText = '📸 Đang kết xuất ảnh Full HD toàn bộ trang...';
            toast.style.cssText = 'position:fixed;top:25px;right:25px;z-index:9999999;background:rgba(15,11,46,0.98);border:1px solid #10B981;color:#FFF;padding:14px 24px;border-radius:12px;font-weight:700;font-size:14px;box-shadow:0 10px 40px rgba(0,0,0,0.8);';
            document.body.appendChild(toast);

            var pageName = window.location.pathname.split('/').pop().replace('.html', '') || 'trang_chu';

            // Xử lý html2canvas với onclone quét toàn bộ DOM
            html2canvas(document.documentElement, {
                scale: 2, // Độ nét gấp 2 lần (Retina HD)
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#0B0A1D',
                logging: false,
                scrollX: 0,
                scrollY: 0,
                onclone: function(clonedDoc) {
                    // 1. Xóa các nút floating và thông báo tạm thời
                    var clBtn = clonedDoc.getElementById('floatingScreenshotBtn');
                    if (clBtn) clBtn.remove();
                    var clToast = clonedDoc.getElementById('tempScreenshotToast');
                    if (clToast) clToast.remove();
                    var clFab = clonedDoc.querySelector('.fab-container');
                    if (clFab) clFab.remove();
                    var clHwBtn = clonedDoc.querySelector('.homework-shortcut-left');
                    if (clHwBtn) clHwBtn.remove();

                    // 2. Khắc phục lỗi mặt bàn (desk-surface) đè lên form tra cứu
                    var deskEl = clonedDoc.querySelector('.desk-surface');
                    if (deskEl) {
                        deskEl.style.zIndex = '1';
                        deskEl.style.transform = 'none';
                        deskEl.style.left = '-25%';
                        deskEl.style.width = '150%';
                        deskEl.style.opacity = '0.7';
                    }
                    var searchCard = clonedDoc.querySelector('.search-card');
                    if (searchCard) {
                        searchCard.style.zIndex = '100';
                        searchCard.style.position = 'relative';
                        searchCard.style.background = 'rgba(15, 11, 46, 0.95)';
                    }
                    var mainCont = clonedDoc.querySelector('.main-container');
                    if (mainCont) {
                        mainCont.style.zIndex = '50';
                        mainCont.style.position = 'relative';
                    }

                    // 3. Ép toàn bộ các phần tử hiển thị rõ nét và sáng màu
                    var allElements = clonedDoc.querySelectorAll('*');
                    allElements.forEach(function(el) {
                        var cStyle = window.getComputedStyle(el);

                        // Mở hết opacity cho các thành phần đang đợi scroll
                        if (cStyle.opacity === '0' || el.classList.contains('fade-up') || el.classList.contains('fade-in')) {
                            el.style.opacity = '1';
                            el.style.transform = 'none';
                            el.style.visibility = 'visible';
                            el.style.transition = 'none';
                            el.style.animation = 'none';
                        }

                        // Sửa màu chữ cho main-title, highlight, sub-title
                        if (el.classList.contains('main-title')) {
                            el.style.color = '#FFFFFF';
                            el.style.opacity = '1';
                            el.style.textShadow = '0 0 20px rgba(255,255,255,0.4)';
                        }
                        if (el.classList.contains('highlight')) {
                            el.style.color = '#FFD23F';
                            el.style.background = 'none';
                            el.style.webkitBackgroundClip = 'unset';
                            el.style.backgroundClip = 'unset';
                            el.style.webkitTextFillColor = 'initial';
                            el.style.textShadow = '0 0 20px rgba(255,210,63,0.6)';
                        }
                        if (el.classList.contains('sub-title')) {
                            el.style.color = '#CBD5E1';
                            el.style.opacity = '1';
                        }

                        // Sửa triệt để lỗi gradient text (-webkit-background-clip)
                        if (cStyle.webkitBackgroundClip === 'text' || cStyle.backgroundClip === 'text') {
                            el.style.background = 'none';
                            el.style.webkitBackgroundClip = 'unset';
                            el.style.backgroundClip = 'unset';
                            el.style.webkitTextFillColor = 'initial';
                            
                            if (el.classList.contains('highlight')) {
                                el.style.color = '#C084FC';
                            } else if (el.classList.contains('section-title') || el.tagName === 'H1' || el.tagName === 'H2' || el.tagName === 'H4') {
                                el.style.color = '#FFFFFF';
                            } else {
                                el.style.color = '#FFFFFF';
                            }
                        }
                    });

                    // 4. Sao chép trực tiếp nội dung các thẻ Canvas (Biểu đồ Chart.js & Mô phỏng sóng)
                    var origCanvases = document.querySelectorAll('canvas');
                    var clonedCanvases = clonedDoc.querySelectorAll('canvas');
                    for (var i = 0; i < origCanvases.length; i++) {
                        if (clonedCanvases[i]) {
                            try {
                                var destCtx = clonedCanvases[i].getContext('2d');
                                destCtx.drawImage(origCanvases[i], 0, 0);
                            } catch(e) {}
                        }
                    }

                    // 5. Đảm bảo nền trang đồng nhất màu tối
                    clonedDoc.body.style.backgroundColor = '#0B0A1D';
                    clonedDoc.documentElement.style.backgroundColor = '#0B0A1D';
                }
            }).then(function(canvas) {
                canvas.toBlob(function(blob) {
                    saveAs(blob, pageName + '_screenshot_HD.png');
                    toast.innerText = '✅ Đã tải ảnh HD thành công!';
                    setTimeout(function() { toast.remove(); }, 2000);
                    btn.style.display = 'flex';
                }, 'image/png');
            }).catch(function(err) {
                console.error(err);
                toast.innerText = '❌ Lỗi: ' + err.message;
                setTimeout(function() { toast.remove(); }, 3000);
                btn.style.display = 'flex';
            });
        };

        document.body.appendChild(btn);
    }
})();
