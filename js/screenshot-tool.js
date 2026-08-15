/**
 * CÔNG CỤ CHỤP ẢNH TOÀN TRANG HD (PNG) TỰ ĐỘNG CHO TẤT CẢ CÁC TRANG WEB
 * Xử lý triệt để 100%:
 * 1. Chữ tiêu đề không bao giờ bị mờ hay mất màu (Ép #FFFFFF & #FFD23F trực tiếp)
 * 2. Khung tìm kiếm / Form đăng nhập sáng rõ, loại bỏ hoàn toàn vệt cung tròn đen
 * 3. Trình phát video trong course-viewer.html: Tự động thay thế khung iframe đen bằng giao diện Video Player HD sống động
 * 4. Biểu đồ Chart.js và Canvas mô phỏng sóng được sao chép chính xác 100%
 * 5. Tự động ẩn các nút nổi Zalo, Hotline, Nút chụp
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
                    // 1. Tiêm CSS Override cực mạnh vào clonedDoc để giải quyết 100% lỗi mờ, đè bóng, font chữ
                    var styleOverride = clonedDoc.createElement('style');
                    styleOverride.innerHTML = `
                        /* Ẩn các nút nổi và thông báo */
                        #floatingScreenshotBtn, #tempScreenshotToast, .fab-container, .homework-shortcut-left, .desk-surface {
                            display: none !important;
                        }

                        /* Ép màu chữ tiêu đề sáng rõ 100% */
                        .main-title, .main-title * {
                            color: #FFFFFF !important;
                            text-shadow: 0 0 20px rgba(255,255,255,0.4) !important;
                            opacity: 1 !important;
                            -webkit-text-fill-color: #FFFFFF !important;
                        }
                        .main-title .highlight, .highlight {
                            color: #FFD23F !important;
                            background: none !important;
                            -webkit-text-fill-color: #FFD23F !important;
                            text-shadow: 0 0 20px rgba(255,210,63,0.6) !important;
                            opacity: 1 !important;
                        }
                        .sub-title {
                            color: #CBD5E1 !important;
                            opacity: 1 !important;
                            text-shadow: none !important;
                        }
                        .badge {
                            color: #E2D1FF !important;
                            opacity: 1 !important;
                            background: rgba(45, 20, 90, 0.95) !important;
                            border: 1px solid #8E4DFF !important;
                        }

                        /* Khung tìm kiếm & Thẻ tính năng sáng rõ nổi bật */
                        .search-card {
                            background: #0F0B2E !important;
                            border: 1.5px solid #8E4DFF !important;
                            opacity: 1 !important;
                            position: relative !important;
                            z-index: 9999 !important;
                            box-shadow: 0 15px 50px rgba(0,0,0,0.8) !important;
                        }
                        .search-card * {
                            opacity: 1 !important;
                        }
                        .input-wrapper {
                            background: #04020A !important;
                            border: 1px solid rgba(142,77,255,0.5) !important;
                        }
                        .input-wrapper input {
                            color: #FFFFFF !important;
                        }

                        .features-container {
                            position: relative !important;
                            z-index: 9999 !important;
                            opacity: 1 !important;
                        }
                        .feature-card {
                            background: #140E36 !important;
                            border: 1px solid rgba(142,77,255,0.3) !important;
                            opacity: 1 !important;
                            box-shadow: 0 10px 30px rgba(0,0,0,0.6) !important;
                        }
                        .feature-card * {
                            opacity: 1 !important;
                        }

                        /* Trang chủ: Loại bỏ triệt để lỗi gradient text */
                        .section-title {
                            color: #FFFFFF !important;
                            background: none !important;
                            -webkit-text-fill-color: #FFFFFF !important;
                        }
                        .hero-title {
                            color: #FFFFFF !important;
                            opacity: 1 !important;
                        }
                        .hero-title .highlight {
                            color: #C084FC !important;
                            background: none !important;
                            -webkit-text-fill-color: #C084FC !important;
                        }
                        .fade-up, .fade-in, [class*="fade"] {
                            opacity: 1 !important;
                            transform: none !important;
                            visibility: visible !important;
                            transition: none !important;
                            animation: none !important;
                        }
                    `;
                    clonedDoc.head.appendChild(styleOverride);

                    // 2. Xử lý đặc biệt cho Trình phát video trong course-viewer.html (Thay iframe đen bằng Player UI thật)
                    var playerWrap = clonedDoc.getElementById('playerWrap');
                    if (playerWrap) {
                        var curTitle = (document.getElementById('infoTitle') ? document.getElementById('infoTitle').textContent : '') || 'Bài 1: Dao động điều hòa & Phương trình li độ';
                        playerWrap.innerHTML = `
                            <div style="width: 100%; height: 100%; min-height: 480px; background: radial-gradient(circle at center, #1C1145 0%, #05040F 100%); border: 2px solid #8E4DFF; border-radius: 14px; display: flex; flex-direction: column; justify-content: space-between; padding: 25px; box-sizing: border-box; position: relative; overflow: hidden;">
                                <div style="display: flex; justify-content: space-between; align-items: center; z-index: 2;">
                                    <span style="background: #8E4DFF; color: #FFF; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 800; letter-spacing: 0.5px;">VẬT LÝ THẦY NAM</span>
                                    <span style="background: rgba(16,185,129,0.2); border: 1px solid #10B981; color: #10B981; padding: 5px 12px; border-radius: 20px; font-size: 11.5px; font-weight: 700;">● MÔ PHỎNG VẬT LÝ 4K</span>
                                </div>
                                <div style="text-align: center; z-index: 2; margin: 35px 0;">
                                    <div style="width: 76px; height: 76px; border-radius: 50%; background: linear-gradient(135deg, #FFD23F, #F59E0B); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px auto; box-shadow: 0 0 35px rgba(255,210,63,0.7);">
                                        <i class="fa-solid fa-play" style="font-size: 32px; color: #000; margin-left: 4px;"></i>
                                    </div>
                                    <h3 style="color: #FFF; font-size: 21px; font-weight: 800; margin-bottom: 8px;">` + curTitle + `</h3>
                                    <p style="color: #C084FC; font-size: 14px; font-family: 'JetBrains Mono', monospace;">x = A·cos(ωt + φ) • v = -ωA·sin(ωt + φ) • W = 1/2 kA²</p>
                                </div>
                                <div style="display: flex; justify-content: space-between; align-items: center; z-index: 2; background: rgba(10,8,28,0.9); border: 1px solid rgba(255,255,255,0.1); padding: 12px 18px; border-radius: 10px;">
                                    <div style="display: flex; align-items: center; gap: 12px; color: #FFF; font-size: 13px;">
                                        <i class="fa-solid fa-pause" style="color: #FFD23F;"></i>
                                        <span>04:15 / 45:00</span>
                                        <div style="width: 250px; height: 4px; background: rgba(255,255,255,0.2); border-radius: 4px; overflow: hidden;">
                                            <div style="width: 25%; height: 100%; background: #FFD23F;"></div>
                                        </div>
                                    </div>
                                    <div style="color: #FFD23F; font-size: 13px; font-weight: 700;">1080p 60fps HD</div>
                                </div>
                            </div>
                        `;
                    }

                    // 3. Sao chép trực tiếp nội dung các thẻ Canvas (Biểu đồ Chart.js & Canvas mô phỏng)
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

                    // 4. Đảm bảo nền trang đồng nhất màu tối sang trọng
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
