# PROGRESS — Web Gia Sư Demo

**Cập nhật lần cuối:** 2026-10-02  
**Giai đoạn:** Phase 14 (Tối ưu giao diện điện thoại Mobile Responsive) — HOÀN THÀNH 100% (45/45 tasks)

---

## Tổng tiến độ

```
[██████████] 100.0% (45/45 tasks)
```

| Phase | Mô tả | Tiến độ |
|---|---|---|
| Phase 1 | Sidebar Layout + Tổng quan | 3/3 ✅ |
| Phase 2 | Nhật ký buổi học | 1/1 ✅ |
| Phase 3 | Học sinh | 1/1 ✅ |
| Phase 4 | Học phí | 1/1 ✅ |
| Phase 5 | Báo cáo (Xuất ảnh) | 2/2 ✅ |
| Phase 6 | Polish & Sync | 2/2 ✅ |
| Phase 7 | Bug Fix sau Review | 3/3 ✅ |
| Phase 8 | Nâng cấp Tổng Quan | 4/4 ✅ |
| Phase 9 | Nâng cấp Modal Tạo Phiếu | 4/4 ✅ |
| Phase 10 | Nâng cấp Lịch dạy | 5/5 ✅ |
| Phase 11 | Fix Bug Trạng thái Học phí | 1/1 ✅ |
| Phase 12 | Hệ thống Multi-Theme (36 Themes) | 7/7 ✅ |
| Phase 13 | Đổi theme Public Pages sáng trắng-xanh | 5/5 ✅ |
| Phase 14 | Tối ưu giao diện điện thoại (Mobile) | 6/6 ✅ |

---

## Task vừa hoàn thành

- 📱 **Task 14.6 — Global Polish: Input zoom + Touch target + Safe area (demo only):**
  - **iOS Safari Zoom Prevention:** Đặt cỡ chữ `font-size: 16px !important` cho tất cả thẻ `input[type="text|password|number|email|tel|search"]`, `select`, `textarea` trên thiết bị di động (≤768px), loại bỏ hoàn toàn hiện tượng trình duyệt tự ý zoom cận cảnh khi người dùng bấm vào ô nhập liệu.
  - **Apple HIG Touch Target:** Thiết lập kích thước tối thiểu 44x44px (`min-height: 44px; min-width: 44px`) cho các nút điều hướng, nút submit, nút CTA, action button, nút nộp bài và các thẻ bấm nhanh, đảm bảo thao tác ngón tay chính xác và mượt mà.
  - **Chống tràn ngang & Smooth Scroll:** Khóa tràn ngang toàn trang bằng `overflow-x: hidden` trên `body`, kích hoạt cuộn mượt mà `scroll-behavior: smooth` trên thẻ `html` kèm kiểm tra `prefers-reduced-motion`.
  - **Tối ưu Hero Section & Form Card:** Căn chỉnh tiêu đề trang chủ 26px, subtitle 14px, các nút CTA xếp dọc 100% trên màn hình ≤480px; thẻ login form card co giãn vừa vặn, padding 20px 16px trên điện thoại nhỏ (360px–390px).


- 📱 **Task 14.5 — `homework.html`: Touch optimization (demo only):**
  - **Upload Area Mobile:** Tối ưu hóa kích thước vùng tải bài (min-height 100px), các nút chức năng chọn camera và tệp PDF/Word đạt chuẩn min-height 48px, dễ chạm bấm ngón tay trên điện thoại. Ẩn hint kéo thả và thay bằng gợi ý chạm trực quan.
  - **Nút hành động:** Đưa các nút nộp bài, hủy sửa sang layout cột 100% full-width trên màn hình ≤480px, chiều cao tối thiểu 48px.
  - **Bảng lịch sử & Score:** Kích hoạt card layout cho danh sách bài nộp trên mobile, tối ưu padding thẻ thông tin và kích thước huy hiệu điểm số gọn gàng, chống tràn ngang tuyệt đối.


- 📱 **Task 14.4 — `tutor-dashboard.html`: Sidebar + Bảng + KPI mobile (demo only):**
  - **Tối ưu KPI Grid:** 4 thẻ KPI chuyển sang hiển thị 2 cột cân đối trên màn hình mobile, font size số liệu (`.kpi-value`) tự động điều chỉnh 22px / 19px tránh tràn dòng hoặc mất chữ.
  - **Bảng học phí:** Thiết lập scroll ngang mượt mà (`overflow-x: auto; -webkit-overflow-scrolling: touch;`) với min-width 580px cho `#tuitionTable`, đảm bảo bảng không bị xô lệch trên mọi độ phân giải.
  - **Safe Area Bottom:** Bổ sung `padding-bottom: calc(85px + env(safe-area-inset-bottom))` cho `.tutor-main-content`, đảm bảo khoảng cách an toàn với thanh điều hướng đáy và home indicator của iPhone.


- 📱 **Task 14.3 — `student-dashboard.html`: Thêm media queries mobile (demo only):**
  - **Khối Style Responsive:** Bổ sung block `<style>` chuyên biệt cho di động nhằm khắc phục tình trạng thiếu media query trước đó.
  - **Summary/KPI Grid:** Chuyển sang 2 cột trên tablet/màn hình nhỏ (≤768px) và 1 cột trên điện thoại (≤480px), điều chỉnh kích thước số đo (`.summary-val`, `.score-number`) không bị tràn.
  - **Chart & Table:** Cấu hình chiều cao biểu đồ tối đa 220px, kích thước co giãn 100%, bổ sung cuộn ngang mượt mà cho bảng lịch sử điểm số (`.table-wrapper`), touch target nút bấm tối thiểu 44px.


- 📱 **Task 14.2 — Navbar mobile: Icon-only + Hamburger dropdown (demo only):**
  - **CSS Responsive Navbar (`css/style.css`):** Thêm cấu trúc 2 tầng đáp ứng cho toàn bộ thanh điều hướng:
    - **≤ 600px:** Tự động ẩn text nhãn (`.nav-btn .nav-label { display: none; }`), chuyển sang chế độ icon-only tinh gọn, kích thước chạm chuẩn Apple HIG (min 44x44px), ẩn bớt phụ đề logo để tối đa diện tích hiển thị.
    - **≤ 400px:** Ẩn hoàn toàn `.nav-right`, hiển thị nút Hamburger ☰ (`.hamburger-btn`), đưa `.nav-container` về 1 hàng ngang cân đối (`space-between`).
  - **Dropdown Navigation & Script (5 file HTML):** Tích hợp markup menu dropdown mờ phủ (`.mobile-nav-dropdown`) và nút mở menu vào 5 file HTML (`index.html`, `student-login.html`, `tutor-login.html`, `homework.html`, `student-dashboard.html`). Kèm hàm `toggleMobileNav()` mượt mà, tự đóng khi chạm ra ngoài và tự động kích hoạt class `active` theo trang đang truy cập.


- 📱 **Task 14.1 — Fix `tutor-calendar.html`: Viewport + FullCalendar mobile (demo only):**
  - **Viewport Meta:** Sửa triệt để lỗi ép desktop width 1200px `<meta name="viewport" content="width=1200, user-scalable=yes">` sang chuẩn responsive mobile: `<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">`.
  - **FullCalendar Responsive View:** Cấu hình `initialView` tự động nhận diện theo kích thước màn hình (`window.innerWidth <= 768 ? 'dayGridMonth' : 'timeGridWeek'`), tích hợp callback `windowResize` chuyển đổi linh hoạt giữa month view và week view.
  - **CSS Media Queries:** Bổ sung layout dọc cho toolbar, co giãn header, font size tối ưu cho cell/chip/toolbar trên breakpoint ≤768px và ≤480px, đưa `.sheet-panel` về full-width 100% trên màn hình hẹp.


- 🎨 **Task 13.5 — Sửa styles và inline styles `homework.html` (demo only):**
  - **Internal `<style>` Tag:** Đồng bộ toàn diện khối style 460 dòng sang ánh sáng trắng - xanh: `body` dùng biến `var(--bg-page)` và `var(--bg-page-gradient)`, `.badge` nền `#EFF6FF` viền `#BFDBFE` chữ `#2563EB`, `.main-title` chữ `var(--text-primary)`, `.search-card` nền `var(--bg-card)` viền `var(--border-card)`, `.input-wrapper` nền `var(--bg-input)` viền `#CBD5E1` chữ tối, `.btn-submit` gradient xanh `var(--btn-bg)`, 4 thẻ tính năng nền `var(--bg-card)`, `#resultBox` và `.hw-info-card` nền trắng viền nhạt đổ bóng dịu, `.upload-area` nền `#F8FAFF` viền nét đứt xanh `#BFDBFE`, `.avatar-circle` nền `#EFF6FF` icon xanh `#3B82F6`, `.progress-bar` gradient xanh, nút bấm `.action-btn-hw` nền sáng chữ `#2563EB`.
  - **HTML Body & Inline Elements:** Sửa Quick demo bar bài tập sang `#EFF6FF` viền dashed `#BFDBFE`, tên học sinh profile chữ tối, form tải bài `hwStudentInput` nền `#F1F5F9` chữ tối, `uploadAreaMobile` nền `#F8FAFF` nút chụp ảnh gradient xanh và nút PDF `#EFF6FF`, hàng đợi file `fileQueueContainer` nền `#F8FAFF` viền `#E2E8F0` chữ `#1E293B`, modal preview bài nộp `previewSubmissionModal` nền trắng `#FFFFFF` viền `#DBEAFE` nền xem bài `#F1F5F9`.
  - **Dynamic JS Templates:** Đồng bộ các template string trong JS: `toast` mặc định gradient xanh, hộp thoại xác nhận `showCustomConfirm` thẻ nền trắng viền `#DBEAFE` chữ `#1E293B` nút Hủy/Đồng ý chuẩn theme, danh sách bài tập được giao `assigned-hw-item` nền `#F8FAFF` viền `#BFDBFE` nút tải bài `#EFF6FF` chữ xanh, bảng lịch sử nộp bài chữ tiêu đề `#1E293B` nút xem bài `#EFF6FF` viền `#BFDBFE`, hàng đợi tệp tin chuẩn bị nộp `file-queue-item` nền `#F8FAFF` viền `#E2E8F0`.
  - **Bảo toàn nghiêm ngặt các mã màu chuẩn:**
    - `#8E4DFF` count = 0 (loại bỏ hoàn toàn neon tím).
    - `background: #1E293B` count = 0 (không bị nhầm text color thành background color).
    - `#FFD23F` count = 25 (bảo toàn 100% các ngôi sao và badge điểm thưởng vàng rực rỡ).
    - `#EF4444` (14 chỗ), `#10B981` (4 chỗ), `#F59E0B` (2 chỗ) giữ nguyên tính trực quan semantic.

- 🎨 **Task 13.4 — Sửa inline styles `student-login.html` + `tutor-login.html` (demo only):**
  - **Inputs & Focus States:** Nền input chuyển sang `var(--bg-input)`, viền `#CBD5E1`, text `var(--text-primary)`. Sự kiện inline `onfocus` đổi sang viền xanh `#3B82F6` và `onblur` trả về viền xám nhạt `#CBD5E1`.
  - **Icons & Labels:** Icon trong input chuyển sang `#3B82F6`, label chuyển sang `#64748B`.
  - **Nút đăng nhập:** Chuyển gradient từ tím `#8E4DFF` → `#5B21B6` sang xanh dương `#3B82F6` → `#1D4ED8`.
  - **Quick-login area:** Viền ngăn cách `#DBEAFE`, text hướng dẫn `#64748B`, label `#475569`, nút đăng nhập nhanh nền `#EFF6FF` viền `#BFDBFE` chữ xanh `#2563EB`. Bảo toàn icon tia sét `#F59E0B`.
  - **Modal chọn con (`childSelectorModal`):** Nền trắng `#FFFFFF`, viền `#DBEAFE`, text `#1E293B`, nút hủy bỏ viền `#CBD5E1`.


- 🎨 **Task 13.3 — Sửa inline styles `index.html` (demo only):**
  - **Quick-demo bar 1-chạm:** Chuyển đổi hoàn toàn background từ `rgba(18,13,54,0.75)` sang nền sáng xanh nhạt `#EFF6FF` viền nét đứt `#BFDBFE`.
  - **Text & Icon:** Đổi chữ "Trải nghiệm nhanh 1 chạm" sang màu xanh đậm `#2563EB`, icon tia sét sang `#3B82F6`.
  - **Quick access buttons:** Nút "Xem Bảng Điểm PH/HS" và "Xem Bảng Quản Lý Gia Sư" chuyển sang nền `#EFF6FF` viền `#BFDBFE` chữ xanh `#2563EB`. Giữ nguyên nút xanh lục "Xem Cổng Nộp Bài Tập" với chữ `#047857` chuẩn tương phản trên nền sáng.
  - **Pillar Cards:** Đồng bộ Pillar 1 và Pillar 3 sang badge/icon nền `#EFF6FF` màu xanh `#3B82F6` / `#2563EB`, nút CTA Gia sư gradient xanh `#3B82F6` → `#1D4ED8`.


- 🎨 **Task 13.2 — Sửa `css/style.css` + `css/home.css` (demo only):**
  - **Chuẩn hóa Global CSS (`style.css`):**
    - Chuyển `.nav-btn.active` sang nền `var(--nav-active-bg)`, viền `var(--nav-active-border)` và chữ `var(--nav-active-text)` (#2563EB).
    - Đổi `.badge` sang nền nhạt `#EFF6FF`, viền `#BFDBFE`, chữ `#2563EB`.
    - Đổi `.main-title` và tiêu đề sang `var(--text-primary)`, subtitle sang `var(--text-secondary)`, `.highlight` sang `#2563EB`.
    - Khung tìm kiếm `.search-card` chuyển từ nền tối sang `var(--bg-card)` trắng thanh lịch, border `var(--border-card)`, shadow mềm mại `var(--shadow-card)`.
    - `.input-wrapper` và input (cả desktop và mobile) dùng `var(--bg-input)` và chữ `var(--text-primary)`.
    - Nút submit `.btn-submit` chuyển sang gradient xanh `var(--btn-bg)` chữ trắng.
    - 4 thẻ tính năng `.feature-card` chuyển sang nền trắng `var(--bg-card)` chữ đậm.
  - **Landing Page CSS (`home.css`):**
    - Hero badge nền `#EFF6FF` viền `#BFDBFE` chữ `#2563EB`.
    - Hero title đổi sang `var(--text-primary)`, subtitle sang `var(--text-secondary)`.
    - Nút CTA chính (Gia sư) chuyển từ tím sang gradient xanh dương `#3B82F6` → `#1D4ED8`.
    - Toàn bộ cards: `.metric-card`, `.pillar-card`, `.vision-card`, `.step-card`, `.faq-item` chuyển sang nền thẻ trắng `var(--bg-card)` và text tương phản cao.
    - Icon vision chuyển sang nền `#EFF6FF` icon `#3B82F6`.
    - Footer chuyển từ tím đen sang nền trắng thanh lịch, viền `var(--border-color)`, logo border `#3B82F6`, social buttons `#EFF6FF` chữ xanh.
    - Bảo toàn nghiêm ngặt các màu semantic: nút học sinh (`.btn-cta-student`), bài tập (`.btn-cta-hw`), xanh lá `#10B981`, đỏ `#EF4444`, vàng `#FFD23F`.

- 🎨 **Task 13.1 — Tạo `css/public-theme.css` + import vào 5 file HTML (demo only):**
  - **Tạo stylesheet chủ đề sáng:** Đã khởi tạo file `css/public-theme.css` định nghĩa 25+ biến CSS ánh sáng trắng - xanh pastel hiện đại: `--bg-page: #F0F7FF`, `--header-bg: rgba(255,255,255,0.95)`, `--bg-card: #FFFFFF`, `--border-color: #DBEAFE`, `--text-primary: #1E293B`, `--text-secondary: #64748B`, `--color-primary: #3B82F6`, `--nav-active-bg: #EFF6FF`, `--btn-bg: linear-gradient(135deg, #3B82F6, #1D4ED8)`, v.v.
  - **Tích hợp vào 5 trang public:** Bổ sung `<link rel="stylesheet" href="css/public-theme.css">` sau `css/style.css` vào `<head>` của cả 5 trang: `index.html`, `student-login.html`, `tutor-login.html`, `homework.html`, `student-dashboard.html`.
  - **Cập nhật PWA/Browser Status Bar:** Chuyển đổi `<meta name="theme-color" content="#0B0826">` sang `<meta name="theme-color" content="#3B82F6">` trên toàn bộ 5 trang.


- 🎓 **Tinh gọn Giao diện Chi tiết Học sinh (`tutor-dashboard.html`, `js/tutor.js` - demo only):**
  - **Lược bỏ Khối thẻ thống kê & Khối biểu đồ điểm số:** Đã xóa bỏ hoàn toàn khối 3 thẻ thống kê ở trên (`Doanh thu dự kiến`, `Đã thanh toán`, `Tỷ lệ đi học`) và khối `Biểu đồ điểm số học tập` trong giao diện chi tiết học sinh (`#tutorStudentDetail`), giúp giao diện tập trung trực tiếp và liền mạch vào phần bài tập và nhật ký buổi học.
  - **Lược bỏ Cột "Đóng tiền" & Checkbox:** Xóa bỏ hoàn toàn cột `Đóng tiền` kèm checkbox ở bảng lịch sử học tập (cả chế độ xem máy tính và điện thoại), chuyển toàn bộ nghiệp vụ quản lý thu học phí về đúng chuyên mục **Tab Học phí**.
  - **Lược bỏ Dòng hướng dẫn đóng tiền:** Xóa dòng chữ hướng dẫn `Tích chọn ô vuông ⬜ ở cột Đóng tiền...` phía trên bảng lịch sử.
  - **Lược bỏ Nút "Xuất Hóa Đơn (Phiếu Học Tập)" & Khối hóa đơn cũ:** Xóa nút bấm tím `#btnToggleInvoice` và toàn bộ khối container hóa đơn thu gọn `#invoiceCollapseContainer` phía dưới bảng nhật ký (vì hóa đơn phiếu học tập đã được quản lý chuyên nghiệp trong Tab Học phí).

- 📄 **Nâng cấp Báo cáo học tập — Xuất file PDF & Tinh gọn nút Xem trước (`tutor-dashboard.html`, `js/tutor.js`, `css/style.css` - demo only):**
  - **Thêm tính năng Xuất file PDF:** Tích hợp nút `[ 📄 Xuất file PDF ]` (`#btnExportReportPdf`) với hiệu ứng gradient đỏ sang trọng, chụp phiếu báo cáo độ phân giải cao và tạo file PDF vector chuẩn chuẩn kích thước (tự động mở rộng chiều cao trang phù hợp với số lượng buổi học, giữ nguyên độ nét từng con chữ và bảng biểu, không bị thu nhỏ co cụm).
  - **Loại bỏ nút "Xem trước" dư thừa:** Báo cáo học tập đã có cơ chế tự động cập nhật thời gian thực ngay khi chuyển tab, đổi ngày (Từ ngày / Đến ngày) hoặc chọn học sinh khác; do đó nút "Xem trước" thủ công không còn cần thiết và đã được lược bỏ để thanh công cụ gọn gàng, trực quan.
  - **Khắc phục lỗi vệt sáng (Light Streak Artifact) khi xuất ảnh:** Tiêu đề "BÁO CÁO TIẾN ĐỘ HỌC TẬP" trước đây sử dụng thuộc tính CSS `-webkit-background-clip: text;` kết hợp gradient nền, thuộc tính này không được thư viện chụp ảnh `html2canvas` hỗ trợ nên dẫn tới việc vẽ nguyên một khối hình chữ nhật sáng màu tím nhạt đè sau chữ. Đã chuyển sang màu chữ trắng thuần `#FFFFFF` sắc nét, triệt tiêu hoàn toàn khối sáng này khi xuất file ảnh PNG hoặc PDF.

- 💰 **Task 11.1 — Đổi `feeStatus` từ flat field sang `feeStatusByMonth` (lưu theo từng tháng độc lập) (`js/tutor.js` - demo only):**
  - **Mục tiêu:** Khắc phục triệt để lỗi trạng thái học phí không reset khi chuyển sang tháng mới (trước đây lưu trường phẳng `st.feeStatus` khiến tháng mới bị dính trạng thái "Đã thu" của tháng cũ).
  - **Lưu trữ độc lập theo tháng (`st.feeStatusByMonth[monthKey]`):** Chuyển đổi cơ chế lưu trạng thái thành object theo key định dạng `"MM/YYYY"`. Khi đổi trạng thái học sinh ở tháng nào thì chỉ cập nhật đúng key của tháng đó.
  - **Tự động mặc định "Chưa thu" cho tháng mới:** Khi chuyển sang tháng mới chưa có key trong `feeStatusByMonth`, hệ thống tự động hiển thị trạng thái "Chưa thu".
  - **Banner thống kê tính toán thời gian thực:** Các chỉ số "Tổng học phí", "Đã thu", "Còn phải thu" trên banner học phí tự động đồng bộ chính xác theo tháng đang chọn trên bộ lọc dropdown.
  - **Tương thích ngược an toàn (Migration):** Dữ liệu cũ chỉ có `feeStatus` phẳng được xử lý an toàn không gây lỗi runtime; tự động gán mặc định "Chưa thu" nếu chưa có dữ liệu theo tháng.
  - **Kiểm thử logic:** 100% các ca kiểm thử chuyển tháng, toggle, lưu trữ, và khôi phục trạng thái đều vượt qua hoàn hảo.

- 💳 **Nâng cấp Cửa sổ Tài khoản Gia Sư — Tải ảnh mã QR & Dán link trực tiếp (`tutor-dashboard.html`, `js/tutor.js`, `js/api.js`, `js/demo-data.js` - demo only):**
  - **Tải ảnh mã QR lên:** Hỗ trợ chọn file ảnh từ máy tính (PNG, JPG, JPEG), tự động nén tối ưu (canvas max 600x600 px trên nền trắng chuẩn) chuyển đổi thành base64 sắc nét, hiển thị preview tức thì.
  - **Dán liên kết ảnh mã QR trực tiếp:** Hỗ trợ nhập/dán URL ảnh trực tuyến (`#accQrUrlInput`), tự động cập nhật preview ảnh QR theo thời gian thực.
  - **Xóa ảnh mã QR:** Nút "Xóa ảnh" (`#btnRemoveTutorQr`) màu đỏ trực quan khi đã có ảnh, cho phép gỡ bỏ nhanh chóng.
  - **Lưu & Đồng bộ dữ liệu toàn diện:** Khi nhấn "Cập nhật tài khoản", dữ liệu mã QR mới được đồng bộ hóa vào `tutorDataGlobal.qrCode`, lưu trữ cục bộ `localStorage` (`tutor_qr_code`), cập nhật dữ liệu tài khoản mock backend (`capNhatThongTinGiaSu`), và tự động cập nhật ngay trên Phiếu học phí (`#invQrImg`).
  - **Khớp chuẩn ảnh mẫu:** Giao diện khu vực QR thanh toán với icon vàng `#FFD23F`, khung viền tím nét đứt `border: 1px dashed rgba(142, 77, 255, 0.35)`, các nút bấm tím gradient và đỏ cảnh báo khớp 100% hình ảnh thực tế.

- 🎨 **Visual Refinement — Tinh chỉnh giao diện Month view khớp 100% hình ảnh tham chiếu (`tutor-calendar.html` - demo only):**
  - **Từng ô ngày là 1 thẻ Card độc lập:** Loại bỏ viền lưới bảng FullCalendar truyền thống ở Month view; mỗi ô ngày là một card trắng bo tròn `border-radius: 12px`, viền mảnh `#ECE3D8`, đổ bóng nhẹ `box-shadow` và có khoảng hở `padding: 3.5px` giữa các card.
  - **Tiêu đề cột các Thứ:** Định dạng chữ hoa gọn gàng không viền nền: `THỨ 2`, `THỨ 3`, `THỨ 4`, `THỨ 5`, `THỨ 6`, `THỨ 7`, `CN`, canh lề trái thẳng hàng với các cột card bên dưới.
  - **Số ngày ở góc trên bên trái:** Di chuyển số ngày về góc trên bên trái của mỗi card (`padding: 6px 8px 2px 8px`).
  - **Highlight Hôm nay (Ngày 26):** Card có viền đỏ nổi bật `border: 1.5px solid #E11D48`, số ngày đặt trong huy hiệu tròn đỏ rực `background: #E11D48; color: #FFF; border-radius: 50%`.
  - **Minh họa ngày lễ Quốc khánh 1/9, 2/9 & Trung thu:** Card ngày 1/9 & 2/9 có nền gradient ấm áp kèm watermark Ba Đình/Hà Nội và nhãn đỏ `Quốc khánh`; ngày 25/9 có gradient lồng đèn lễ hội.
  - **Event Chips viên thuốc có chấm tròn màu:** Thiết kế chip viên thuốc `border-radius: 6px` nền pastel nhạt, viền cùng tông, chấm tròn màu đại diện học sinh, giờ bắt đầu in đậm và tên môn/lớp học.
  - **Link "+N buổi nữa":** Dạng text xám thanh thoát góc trái thẻ, click mở popover chi tiết.
  - **Dữ liệu demo khớp ảnh mẫu:** Tích hợp đầy đủ các lớp `GTPX 17`, `Pre-Inter A2+`, `GTPX 18`, `ARAVA GTPX 15`, `IELTS 5.0-6.0`, `ELE 04 - A1` với bảng màu chuẩn mực.

- 📊 **Task 10.4 — Bottom legend theo học sinh + Status bar (`tutor-calendar.html` - demo only):**
  - **Mục tiêu:** Thêm thanh công cụ phía dưới lịch gồm Legend màu học sinh và Thanh trạng thái (Status bar) thống kê tổng số buổi dạy trong tháng và số học sinh:
    - **Legend màu học sinh (bên trái):** Danh sách trực quan từng học sinh với chấm tròn màu đồng bộ chính xác với màu ca học của học sinh đó trên lịch (`row.color`), kèm tên học sinh. Tự động lọc danh sách chỉ hiển thị các học sinh có lịch học trong tháng đang xem (hoặc tất cả nếu ngoài phạm vi), đồng bộ chuẩn xác với số lượng học sinh ở thanh trạng thái. Bổ sung `min-width: 0; flex: 1 1 0%;` và sự kiện lăn chuột (`wheel`) cho phép cuộn ngang mượt mà, triệt để loại bỏ lỗi tràn văn bản đè lên thanh trạng thái.
    - **Thanh trạng thái (bên phải):** Thống kê chuẩn xác định dạng `"N buổi trong tháng · X học sinh"`, cố định góc phải với `flex-shrink: 0`, tự động cập nhật thời gian thực dựa trên các ca học thuộc tháng đang xem, tự động đồng bộ khi chuyển tháng hoặc bật/tắt bộ lọc "Ẩn đã hủy".
    - **Chỉ hiển thị ở Month view:** Tự động hiển thị khi ở chế độ xem Tháng (`dayGridMonth`), tự động ẩn khi chuyển sang Tuần (`timeGridWeek`) và Ngày (`timeGridDay`).
    - **Bố cục & Không gian:** Thanh bottom dạng `flex-shrink: 0` trên layout flexbox cột của body, kết hợp hàm `calendar.updateSize()` giúp lịch luôn vừa khít màn hình, không bao giờ che khuất hay đè lên hàng ngày cuối tháng.
    - **Kiểm thử cú pháp:** JS syntax đạt 100% hợp lệ, hoạt động ổn định và mượt mà.

- 🇻🇳 **Task 10.3 — Ngày lễ quốc gia Việt Nam trong ô ngày Month view (`tutor-calendar.html` - demo only):**
  - **Mục tiêu:** Hiển thị tự động các ngày lễ quốc gia Việt Nam trong ô ngày của chế độ xem theo tháng (`dayGridMonth`), đảm bảo vị trí trang nhã, không đè lên event chips:
    - **Danh mục 5 ngày lễ quốc gia cố định:**
      - `1/1`: Tết Dương lịch
      - `10/3`: Giỗ Tổ Hùng Vương
      - `30/4`: Giải phóng miền Nam
      - `1/5`: Quốc tế Lao động
      - `2/9`: Quốc khánh
    - **Thiết kế & Bố cục:** Badge tên ngày lễ `.fc-vn-holiday-badge` chữ đỏ nhạt `#F87171`, font-size 11px đậm nét, đặt gọn gàng ở thanh tiêu đề ô ngày (`.fc-daygrid-day-top`) nằm ngang hàng với số ngày, hoàn toàn không đè lên hay che khuất các ca học (`event chips`).
    - **Tự động áp dụng mọi năm:** Tính toán linh hoạt theo ngày/tháng (`d + '/' + m`), tự động hoạt động chính xác cho bất kỳ năm nào được duyệt tới.
    - **Phân tách view chặt chẽ:** Chỉ hiển thị khi đang ở `dayGridMonth`, tự động ẩn hoàn toàn trên chế độ Tuần (`timeGridWeek`) và Ngày (`timeGridDay`).
    - **Kiểm thử cú pháp:** JS syntax đạt 100% hợp lệ, hoạt động ổn định và mượt mà.

- 🧭 **Task 10.2 — Custom header: Navigation + Tháng/Năm title + Filter "Ẩn đã hủy" (`tutor-calendar.html` - demo only):**
  - **Mục tiêu:** Tinh gọn toàn diện thanh Header của lịch dạy, gom cụm điều hướng và bộ lọc vào một thanh công cụ duy nhất phía trên, tắt `headerToolbar` mặc định của FullCalendar để tối đa hóa không gian hiển thị lịch:
    - **Cụm bên trái:**
      - Nút **"Quay lại Dashboard"**: Desktop hiển thị đầy đủ icon `←` và nhãn chữ; trên Mobile (< 768px) tự động thu gọn thông minh thành icon tròn `←` tiết kiệm không gian.
      - Nhóm nút điều hướng Lịch: `<` (lùi 1 tháng/tuần), `>` (tiến 1 tháng/tuần) và nút **"Hôm nay"** bo góc 8px thanh lịch, nhạy bén.
      - Tiêu đề tháng/năm: `<h2 id="calendarHeaderTitle">` chữ lớn, font-weight 800, màu tím đậm `#7C3AED` sang trọng (ví dụ: **"Tháng 10 2026"**), tự động đồng bộ thời gian thực qua hook `datesSet` của FullCalendar mỗi khi nhấn prev, next, today hoặc đổi view.
    - **Cụm bên phải:**
      - Filter Pill **"Ẩn đã hủy"**: Nút toggle bo tròn 20px với icon con mắt gạch chéo `<i class="fa-solid fa-eye-slash"></i>`. Khi kích hoạt (active), chuyển sang nền hồng pastel viền `#C05E8E`, lọc bỏ toàn bộ các buổi học có trạng thái `cancelled` (`extendedProps.status === 'cancelled'`); khi bỏ chọn, hiển thị lại các ca học đã hủy kèm hiệu ứng gạch ngang chữ (`line-through`) và giảm opacity `0.55`.
      - Toggle Pills **"Tháng / Tuần / Ngày"**: Thiết kế dạng segmented pill bar, highlight nổi bật view đang chọn và hỗ trợ chuyển đổi mượt mà giữa các chế độ xem mà không làm vỡ các tương tác lịch hiện có.
      - Nút **"Lịch tóm tắt"**: Mở/đóng nhanh bảng dữ liệu sheets simulator phía dưới.
    - **Dữ liệu mẫu trực quan:** Bổ sung ca học mẫu vào Thứ Bảy của học sinh Trần Thị B: `14:00 - 16:00 (Đã hủy) [CANCELLED]` giúp kiểm thử ngay lập tức bộ lọc ẩn/hiện buổi hủy.
    - **Kiểm thử cú pháp:** Node syntax check đạt 100% hợp lệ, không có bất kỳ lỗi JavaScript nào.

- 📅 **Task 10.1 — Thêm Month View + View toggle pills "Tháng / Tuần" (`tutor-calendar.html` - demo only):**
  - **Mục tiêu:** Bổ sung chế độ xem theo tháng (`dayGridMonth`), đặt làm chế độ xem mặc định, tích hợp bộ chuyển đổi kiểu viên thuốc (toggle pills) và cơ chế hiển thị tối đa 3 sự kiện mỗi ngày kèm popover:
    - **Mặc định Month view (`initialView: 'dayGridMonth'`):** Mở lịch lần đầu hiển thị ngay toàn cảnh lịch tháng hiện tại, các ô ngày được lấp đầy buổi dạy của tất cả các tuần trong tháng.
    - **Toggle pills Tháng | Tuần | Ngày (`dayGridMonth,timeGridWeek,timeGridDay`):** Nhóm nút bo tròn 30px dạng segmented pill control, nút active nổi bật tone màu rose/pink `#C05E8E` chữ trắng, các nút còn lại nền kem chữ nâu ấm với hiệu ứng chuyển đổi mượt mà.
    - **Giới hạn 3 sự kiện/ngày (`dayMaxEvents: 3`):** Mỗi ô ngày hiển thị tối đa 3 event chips dạng khối (`eventDisplay: 'block'`), phần sự kiện còn lại tự động hiển thị link `+N buổi nữa`.
    - **Popover danh sách đầy đủ:** Nhấp vào `+N buổi nữa` hiển thị popup danh sách chi tiết các buổi học trong ngày theo chuẩn FullCalendar với giao diện sáng đồng bộ (`.fc-popover` nền `#FDF8F3`, viền `#E5D9CC`, header `#F3EDE4`).
    - **Highlight ngày hôm nay:** Ô ngày hôm nay nền hồng phấn `#FFF0F6`, số ngày có badge tròn hồng `#FCE7F0` số đậm `#C05E8E`.
    - **Giữ nguyên 100% tính năng:** Chuyển đổi qua lại giữa Tháng, Tuần (`timeGridWeek`), Ngày (`timeGridDay`) hoàn toàn mượt mà; các thao tác click xem chi tiết, chọn ô tạo ca học, kéo thả đều hoạt động chính xác.

- 🎨 **Task 10.0 — Đổi theme lịch từ Dark → Light Cream/Beige (`tutor-calendar.html` - demo only):**
  - **Mục tiêu:** Thay đổi toàn bộ giao diện `tutor-calendar.html` từ dark purple/navy sang tone màu **light cream/beige** ấm áp, thanh lịch đồng bộ với phong cách tham chiếu:
    - Nền tổng thể `body`: `#F8F3EC` (kem ấm dịu mắt).
    - Header bar (`.container`): `#F3EDE4`, viền dưới `1px solid #E5D9CC`.
    - Tiêu đề lịch: icon và accent đổi sang `#C05E8E` (rose/pink), text `#2D1F0E` đậm rõ nét, phụ đề `#6B4226`.
    - Lưới lịch FullCalendar: `#calendar` trong suốt, khung bảng `.fc-scrollgrid` nền `#FFFFFF`, viền `#E5D9CC`.
    - Header cột (Thứ 2, Thứ 3...): Nền `#F3EDE4`, chữ `#6B4226` in đậm.
    - Cột và ô ngày hôm nay: Nền `#FFF0F6` (hồng phấn rất nhạt), số ngày và tiêu đề cột màu `#C05E8E` font-weight 900.
    - Ngày ngoài tháng (`.fc-day-other`): Nền `#F8F3EC`, text ngày `#BFA89A`.
    - Trục thời gian & nhãn giờ: Nền `#F8F3EC`, text `#6B4226`, đường kẻ `#E5D9CC`, đường chỉ giờ hiện tại (Now Indicator) màu `#C05E8E`.
    - Nút bấm FullCalendar (`.fc-button`): Nền `#E8DDD0`, chữ `#2D1F0E`, không viền; trạng thái active chuyển sang `#C05E8E` chữ trắng nổi bật.
    - Event chips trong `eventDidMount`: Chuyển sang dạng pastel tinh tế (`linear-gradient(0deg, evColor + "25", evColor + "25), #FFFFFF`), viền trái `3px solid evColor`, viền ngoài `evColor + "40"`, chữ `color: evColor` font-weight 700 dễ đọc, không còn nền đen và chữ trắng.
    - Modal thiết lập ca dạy, Popover chi tiết ca học, Hộp thoại sự kiện lặp lại: Đồng bộ nền `#FDF8F3`, viền `#E5D9CC`, form controls nền trắng, buttons rose/pink `#C05E8E`.
    - Giữ nguyên 100% logic JavaScript: drag & drop, recurrence dialog, click modal, sheet simulator panel, các hàm fetch và load backend.

- 💰 **Chuẩn hóa số liệu Biểu đồ Doanh thu sát thực tế dạy kèm 1-1 (Loại bỏ số liệu ảo 51 triệu/tháng - demo only):**
  - **Hiện tượng:** Biểu đồ doanh thu 12 tháng tại tab Tổng quan hiển thị các con số khổng lồ (Tháng 10: `51,7tr`, Tháng 11: `52,1tr`, Tháng 9: `36,5tr`, Tháng 8: `32,4tr`, Tổng cả năm lên tới `180.250.000 đ`). Con số này hoàn toàn bất hợp lý với thực tế một gia sư 1-1 dạy 3 học sinh (học phí 200.000đ/buổi).
  - **Nguyên nhân:** Trước đây khi thiết kế bố cục biểu đồ theo hình mẫu ("Ảnh 2"), hệ thống đã lấy nguyên số liệu minh họa có sẵn trên ảnh mẫu doanh nghiệp đó (32,4tr, 51,7tr, tổng 180tr) để đối chiếu trực quan về mặt giao diện.
  - **Khắc phục triệt để:**
    - Loại bỏ hoàn toàn bộ số liệu mẫu ảo 51,7 triệu và tổng 180 triệu.
    - Chuẩn hóa lại số liệu doanh thu khớp 100% với thực tế dạy học của gia sư 1-1 (phụ trách 3 học sinh, học phí 200.000đ/buổi, ~24 - 30 buổi dạy/tháng):
      - Thu nhập mỗi tháng dao động thực tế từ **3,6tr đến 6,2tr VNĐ** (các tháng thi học kỳ đạt 6,0tr - 6,2tr; tháng Tết và hè 3,6tr - 4,2tr).
      - Tổng doanh thu 12 tháng hiển thị chuẩn: **64.800.000 đ** (thay vì 180 triệu ảo).
      - Tỷ lệ hiển thị cột (track height scale) được điều chỉnh về mức 7.000.000 đ tối đa, giúp các cột bar hiển thị thanh thoát, cân đối và chuẩn xác.
      - Ưu tiên tính toán trực tiếp từ dữ liệu nhật ký buổi học thực tế của học sinh bất cứ khi nào có bản ghi mới.

- 📌 **Cố định vị trí 5 nút thao tác ở bên trái, chuyển thông báo "Đã khôi phục bản nháp" sang góc phải (demo only):**
  - **Hiện tượng:** Trước đây khi chưa khôi phục bản nháp, 5 nút thao tác (Hủy bỏ, Lưu bản nháp, Xuất PDF, Copy ảnh, Xuất phiếu) nằm ở bên trái. Khi có bản nháp được khôi phục, dòng chữ thông báo màu xanh "Đã khôi phục bản nháp lần trước" lại chiếm chỗ bên trái và đẩy toàn bộ 5 nút dạt sang bên phải, gây xáo trộn vị trí bấm của người dùng giữa các trạng thái.
  - **Khắc phục:** Đặt container 5 nút thao tác làm phần tử đầu tiên luôn cố định chắc chắn ở góc bên trái footer; dòng thông báo khôi phục bản nháp chuyển ra sau cùng và căn chỉnh sang góc bên phải (`margin-left: auto`). Vị trí của 5 nút thao tác hoàn toàn không bao giờ bị xê dịch dù có hay không có bản nháp.

- 🇻🇳 **Chuẩn hóa toàn bộ thời gian & ô chọn ngày sang định dạng Việt Nam "Ngày trước, Tháng sau" (`DD/MM/YYYY`) (demo only):**
  - **Hiện tượng:** Tại thanh công cụ lọc Báo cáo và Modal Tạo Phiếu Học Phí, các ô chọn ngày hiển thị định dạng kiểu Mỹ `MM/DD/YYYY` (ví dụ `09/01/2026` và `10/01/2026` khiến người dùng nhìn thấy tháng 9 và tháng 10 bị nhầm lẫn thành ngày 09/01 đến 10/01).
  - **Nguyên nhân cốt lõi:** Thẻ `<input type="date">` chuẩn HTML5 của trình duyệt (Chrome/Edge) trên hệ điều hành Windows mặc định phụ thuộc vào ngôn ngữ hiển thị của trình duyệt/hệ điều hành. Nếu trình duyệt đặt tiếng Anh (US), nó tự động ép hiển thị kiểu Mỹ `MM/DD/YYYY` và không có thuộc tính CSS/HTML nào ép trình duyệt đổi sang `DD/MM/YYYY`.
  - **Khắc phục triệt để:**
    1. **Thiết kế Component Date Picker Việt Nam chuyên dụng (`.vn-date-picker-box`):**
       - Thẻ hiển thị là ô text input hiển thị trực quan 100% chuẩn `DD/MM/YYYY` (ví dụ: `01/09/2026` và `01/10/2026`).
       - Tích hợp icon lịch `📅` trên giao diện, đè lớp kích hoạt native date picker trực tiếp khi nhấp vào icon lịch giúp mở popup chọn ngày từ lịch một cách mượt mà.
       - Hỗ trợ gõ tay thông minh: tự động chèn dấu `/` phân cách khi người dùng gõ số (ví dụ gõ `01092026` tự động thành `01/09/2026`).
    2. **Áp dụng đồng bộ:**
       - **Tab Báo cáo:** Cả 2 ô "Từ ngày" (`#reportStartDate`) và "Đến ngày" (`#reportEndDate`) hiển thị ngay `01/09/2026` và `01/10/2026`.
       - **Modal Tạo Phiếu Học Phí:** Cả 2 ô "Từ ngày" (`#tuitionPeriodStartDate`) và "Đến ngày" (`#tuitionPeriodEndDate`) hiển thị `01/09/2026` và `30/09/2026`.
       - **Live Preview & Thẻ Báo cáo:** Hiển thị chuẩn `01/09/2026 → 01/10/2026`, tiêu đề kỳ học `HỌC PHÍ THÁNG 9/2026` hoặc `HỌC PHÍ DD/MM – DD/MM/YYYY`.
    3. **Tương thích toàn diện:**
       - Bổ sung bộ chuyển đổi hai chiều `formatToDmy(val)` và `formatToYmd(val)`.
       - Nâng cấp `parseInputDate(str)` và `parseDateInputYmd(str)` phân tích chuẩn xác cả hai định dạng `DD/MM/YYYY` và `YYYY-MM-DD`.
       - Đảm bảo tên file xuất ảnh PNG chuẩn hóa theo định dạng ngày/tháng/năm (`01092026_01102026`).

- 🐛 **Sửa lỗi không xem được báo cáo (Treo spinner vô tận - demo only):**
  - **Hiện tượng:** Khi truy cập tab Báo cáo, chọn học sinh và khoảng ngày rồi nhấn xem trước, màn hình preview bị treo vĩnh viễn ở trạng thái spinner *"Đang tạo bản xem trước báo cáo..."* không thể tải báo cáo.
  - **Nguyên nhân:** Trong hàm `previewTutorReport()` (`Gia sư - demo/js/tutor.js`), chuỗi HTML nối biến `endDisplay` (`startDisplay + ' → ' + endDisplay`), tuy nhiên biến `endDisplay` chưa từng được định nghĩa (`ReferenceError: endDisplay is not defined`). Lỗi này ngắt ngang luồng thực thi JS trước khi cập nhật DOM.
  - **Khắc phục:**
    1. Khai báo đầy đủ `var endDisplay = endInput && endInput.value ? endInput.value.split('-').reverse().join('/') : "Hiện tại";`.
    2. Chuẩn hóa bộ chuyển đổi ngày `parseLogDateDmy(str)` xử lý an toàn các định dạng ngày `DD/MM/YYYY` và `DD/MM`.
    3. Bọc toàn bộ hàm `previewTutorReport()` trong khối `try...catch` hiển thị card thông báo lỗi rõ ràng nếu có lỗi bất ngờ phát sinh thay vì để spinner xoay vô tận.

- 🎨 **Căn chỉnh bố cục Modal Tạo Phiếu Học Phí & Phiếu Live Preview Mẫu 1 khớp 100% hình ảnh thực tế (demo only):**
  - **Bảng màu & Khung Modal chuẩn:** Tone màu kem nhạt `#FAF7F8`, thẻ trắng `#FFFFFF` bo góc mềm mại 20px viền `#EADFE3`, màu nhấn Berry/Wine `#8E284D` sang trọng.
  - **Header Modal:**
    - Bên trái: Tiêu đề `Tạo Phiếu Học Phí` to đậm + dòng phụ `GV. Võ Trung Khánh · STK 0793017777`.
    - Bên phải: Nhãn `Chọn mẫu` + 2 nút pill `Mẫu 1` (active berry) / `Mẫu 2` + nút đóng `✕`.
  - **Cột trái — Tùy chỉnh thông tin:**
    - Box 1: "Thông tin học sinh" với grid 2 cột chứa 8 thẻ toggle (Học sinh, Lớp / Môn, Học phí áp dụng, Số buổi học, Số giờ tích lũy, Ngày học, Giảm học phí, Phụ thu) và 1 thẻ full-width "Ảnh QR".
    - Box 2: "Thông tin kỳ học" có badge `01` gồm 2 ô ngày side-by-side (Từ ngày / Đến ngày) và ô nhập tiêu đề kỳ học `HỌC PHÍ THÁNG X/YYYY`.
  - **Cột phải — Live Preview:**
    - Thanh đầu: `Phiếu hiển thị trực tiếp • Mẫu 1` + badge xanh lá `TRỰC TIẾP`.
    - Thẻ phiếu `#tuitionInvoiceCard` khớp 100% hình ảnh:
      - Dòng đầu: `GV. Võ Trung Khánh` | `SĐT: 0793017777`.
      - Tiêu đề chính giữa in hoa đậm màu berry: `HỌC PHÍ THÁNG 8/2026`.
      - Khối 2 cột: Cột trái "THÔNG TIN HỌC SINH" (Họ tên, Lớp, Học phí, Buổi học, Giờ học, chips Ngày học đỏ/berry dạng `DD/MM`) | Cột phải "TỔNG HỌC PHÍ" (Tổng tiền to đậm, mã VietQR vuông, STK & Ngân hàng & Chủ TK).
      - Khối cuối: "NHẬN XÉT HỌC TẬP" với 3 gạch đầu dòng (Tổng quan, Đại số, Hình học) có thể chỉnh sửa trực tiếp.
  - **Footer:** Dòng trạng thái `Đã khôi phục bản nháp lần trước` (màu xanh lá) bên trái và 5 nút thao tác đồng bộ bên phải (Hủy bỏ, Lưu bản nháp, Xuất PDF, Copy ảnh, Xuất phiếu (ảnh)).
  - **Khôi phục hoàn toàn cấu trúc giao diện chuẩn của Ảnh 1:**
    - Thanh viền gradient đa sắc 6px trên đỉnh card (`.invoice-container::before`).
    - Header: Avatar vuông bo góc gradient tím có icon mũ tốt nghiệp 🎓, nhãn in hoa nhỏ `HỌC SINH` trên tên học sinh, pill trạng thái `KỲ HỌC THÁNG X` (tím trên nền tím nhạt) có icon lịch.
    - Phần "TỔNG KẾT KẾT QUẢ KỲ NÀY": Gồm 2 card song song:
      - **Chuyên cần:** Số buổi tổng kết (màu xanh lá) + 3 ô số liệu (Buổi học, Nghỉ phép, Đã bù) + box ghi chú ngày nghỉ phép (`Nghỉ phép: Không có` hoặc danh sách ngày).
      - **Bài tập về nhà:** Số buổi tổng kết (màu tím) + 3 ô số liệu (Đủ bài, Thiếu bài, Nộp trễ) + box ghi chú thiếu bài (`Thiếu bài: Không thiếu bài` hoặc danh sách ngày thiếu).
    - Phần "Học phí": Card nền gradient tím nhạt bo góc 16px với các dòng `Đơn giá mỗi buổi học:`, `Thời lượng học kỳ này:` và dòng tổng học phí in hoa đậm tím `TỔNG HỌC PHÍ KỲ NÀY` nổi bật.
    - Phần "Lời nhắn & Mã QR": Bố cục 2 cột cạnh nhau:
      - Bên trái: Lời nhắn gửi phụ huynh với câu mở đầu chuẩn mực, bôi đậm tên bé, số tiền và số buổi, kèm dòng chân trang nghiêng *"Đồng hành cùng sự tiến bộ của học sinh!"*.
      - Bên phải: Card QR bo góc viền tím chứa hình ảnh minh họa / QR thanh toán sắc nét và nhãn `Quét VietQR` phía dưới.
  - Tự động đồng bộ các toggle switch (Lớp & Môn, Số giờ, Ngày học mặc định ẩn để giữ thẻ phiếu thanh thoát y hệt Ảnh 1, có thể bật tùy chọn nếu cần).

- 🐛 **Sửa lỗi hiển thị mục "Học phí" bị trống (demo only):**
  - **Nguyên nhân:** Thẻ `<div>` đóng của `#tutorSectionStudents` (line 1122) bị thiếu 1 cấp do container `#invoiceCollapseContainer` và `#tutorStudentDetail` chưa được đóng hết trước đó. Do đó, `#tutorSectionTuition` vô tình bị nằm lồng bên trong `#tutorSectionStudents`. Khi chuyển sang tab "Học phí", mã JS ẩn section Học sinh (`display: none`) đã vô tình ẩn luôn cả section Học phí.
  - **Khắc phục:** Đóng đầy đủ các thẻ `</div>` cho `#invoiceCollapseContainer`, `#tutorStudentDetail` và `#tutorSectionStudents`. Đồng thời, tối ưu `initTuitionMonthFilter` tự động chọn tháng gần nhất có lịch học (Tháng 9/2026) thay vì chọn tháng hiện tại (Tháng 10/2026) khi chưa có buổi dạy, giúp hiển thị ngay số liệu và danh sách học sinh đầy đủ.

- ✅ **Task 9.4 — Action buttons: Xuất PDF + Copy ảnh + Xuất phiếu (ảnh) (demo only):**
  - **Hủy bỏ:** Kiểm tra trạng thái có thay đổi chưa lưu (`tuitionInvoiceHasUnsavedChanges`), hiển thị hộp thoại xác nhận `confirm("Bỏ các thay đổi chưa lưu?")` trước khi đóng modal nếu có sửa đổi; đóng ngay tức thì nếu chưa có thay đổi nào. Áp dụng đồng bộ cho cả nút "Hủy bỏ", icon đóng "X" ở header và thao tác click ra ngoài vùng nền modal overlay.
  - **Lưu bản nháp:** Lưu toàn bộ trạng thái tùy chỉnh hiện tại vào `localStorage`, reset cờ thay đổi chưa lưu, hiển thị thông báo toast thành công "Đã lưu bản nháp thành công!" mà không làm gián đoạn hay đóng modal.
  - **Xuất PDF:** Tích hợp bộ quy tắc CSS in ấn `@media print` chuyên biệt, ẩn sạch sẽ toàn bộ sidebar, navbar, header, footer và cột form bên trái, chỉ hiển thị duy nhất thẻ phiếu `#tuitionInvoiceCard` ngay ngắn ở giữa trang giấy với màu sắc chuẩn mực (`print-color-adjust: exact`). Nút có loading state trước khi mở hộp thoại in của trình duyệt (`window.print()`).
  - **Copy ảnh:** Chụp thẻ phiếu với độ phân giải cao 2x qua `html2canvas`, ghi trực tiếp vào clipboard của hệ điều hành dưới dạng `image/png` thông qua `navigator.clipboard.write([ClipboardItem])` và thông báo toast "Đã copy ảnh!". Nếu trình duyệt hạn chế quyền hoặc không hỗ trợ, tự động fallback hiển thị toast hướng dẫn "Nhấn chuột phải → Lưu ảnh để tải về!".
  - **Xuất phiếu (ảnh):** Chụp thẻ phiếu preview với scale 2x nền trắng sắc nét và kích hoạt tải về file PNG với định dạng tên chuẩn hóa: `PhieuHocPhi_[TenHocSinh]_[ThangNam].png` (ví dụ: `PhieuHocPhi_Le_Minh_Thu_Thang09_2026.png`). Có hiệu ứng loading spinner và vô hiệu hóa nút trong suốt quá trình xử lý ảnh.

- ✅ **Task 9.3 — Date range + Tiêu đề kỳ học + Draft save/restore (demo only):**
  - Bổ sung section "Thông tin kỳ học & Khoảng ngày" ở cuối cột trái gồm bộ chọn ngày (Từ ngày / Đến ngày) mặc định từ đầu tháng đến cuối tháng.
  - Lọc chính xác các buổi học trong khoảng ngày chọn; khi đổi khoảng ngày, số buổi học, số giờ tích lũy, danh sách ngày và tổng học phí trên Live Preview tự động tính lại ngay lập tức.
  - Tự động sinh tiêu đề kỳ học thông minh (ví dụ: `HỌC PHÍ THÁNG M/YYYY` nếu cùng tháng hoặc `HỌC PHÍ DD/MM – DD/MM` nếu khác tháng), đồng thời cho phép người dùng tự sửa tay tùy ý.
  - Tự động lưu bản nháp (`autoSaveTuitionDraft`) vào `localStorage` (`tuitionDraft_[studentName]`) mỗi khi thay đổi bất kỳ toggle, số tiền, ngày học, tiêu đề hoặc mẫu phiếu.
  - Khôi phục bản nháp hoàn hảo khi mở lại modal và hiển thị banner thông báo màu xanh lá "Đã khôi phục bản nháp lần trước".
  - Nút "Lưu bản nháp" trong footer lưu thủ công và hiển thị toast xác nhận thành công.

- ✅ **Task 9.2 — Toggle switches 9 trường + Live Preview real-time (demo only):**
  - Cung cấp đầy đủ 9 toggle switches tại cột trái: Học sinh, Lớp & Môn, Học phí áp dụng, Số buổi học, Số giờ tích lũy, Ngày học, Giảm học phí, Phụ thu, Ảnh QR.
  - Mỗi toggle hiển thị rõ ràng label + giá trị hiện tại tương ứng của học sinh.
  - Tích hợp 2 ô nhập số trực quan cho "Giảm học phí" và "Phụ thu", khi thay đổi số tiền tự động cập nhật tổng tiền học phí và live preview ngay lập tức.
  - Hỗ trợ hiển thị 2 mẫu phiếu song song (đã đảo mẫu chính xác theo yêu cầu người dùng):
    - **Mẫu 1 (Phiếu điện tử E-Receipt - Ảnh 2):** Dải gradient tím đỉnh thẻ, icon mũ cử nhân tím, tag HỌC SINH + Tên, pill `📅 KỲ HỌC THÁNG X`, 2 box chỉ số chuyên cần & bài tập về nhà, bảng kê chi tiết học phí (đơn giá, số buổi, tổng tiền), box Lời nhắn gửi phụ huynh và mã Quét VietQR.
    - **Mẫu 2 (Bố cục 2 cột & Nhận xét - đồng bộ theme tím Mẫu 1):** Header GV và SĐT, Tiêu đề căn giữa `HỌC PHÍ THÁNG X/YYYY` màu tím thương hiệu (`#6D28D9`), dải gradient màu ở đầu thẻ, bố cục 2 cột nền trắng/slate (`#F8FAFC` & viền `#E2E8F0`), chips ngày học màu tím nhạt (`#F3E8FF` / `#6D28D9`), box Tổng học phí tím hoàng gia (`#FAF5FF` / `#EDE9FE`) với tổng tiền và STK màu tím đậm, và box Nhận xét học tập nền slate sáng tinh tế.
  - Loại bỏ hoàn toàn tone màu đỏ mận/hồng (`#8E284D`, `#FAF7F8`, `#F8E9EE`), chuyển toàn bộ modal và 2 mẫu phiếu sang theme tím - slate (`#7C3AED`, `#6D28D9`, `#F8FAFC`, `#E2E8F0`, `#0F172A`) đồng nhất và sang trọng.
  - **Khắc phục triệt để lỗi ngày học ảo (Fix fake date chips):**
    - Loại bỏ hoàn toàn 8 ngày học mẫu hardcoded cũ (`07/08, 10/08,...`).
    - Chỉ trích xuất và hiển thị danh sách chip ngày học thực tế của các buổi có tham gia học (`có mặt` hoặc `đã bù`).
    - Khi kỳ học không có buổi học nào (`0 buổi`), hiển thị thông báo rõ ràng `Chưa có buổi học nào` thay vì hiển thị ngày học giả.
    - Cải tiến hàm mở modal: Khi bộ lọc là "Tất cả các tháng", modal tự động chọn tháng gần nhất mà học sinh có dữ liệu học tập thực tế (ví dụ: Tháng 9 đối với Nguyễn Hoàng Nam) giúp hiển thị đầy đủ số buổi và ngày học thực tế thay vì bị rỗng do mở sang tháng 10.
  - **Chuẩn hóa định dạng ngày hiển thị chỉ gồm ngày và tháng (`DD/MM`):**
    - Rút gọn toàn bộ các ngày hiển thị trên phiếu chỉ còn ngày/tháng, bỏ phần năm `/YYYY` (ví dụ: `17/09` thay vì `17/09/2026`).
    - Áp dụng đồng bộ cho: ghi chú Nghỉ phép (`17/09`), ghi chú Thiếu bài (`26/09`, `22/09`), và các chip ngày học (`29/09`, `26/09`, `22/09`).
  - **Đổi ô "Nhận xét học tập" ở Mẫu 2 thành "Lời nhắn gửi phụ huynh" (giống 100% Ảnh 2):**
    - Thay thế các dòng gạch đầu dòng bullet points (Tổng quan, Đại số, Hình học) bằng box `.msg-box` đồng bộ.
    - Header: Icon `fa-regular fa-comment-dots` màu tím + chữ `Lời nhắn gửi phụ huynh`.
    - Body: Nội dung lời nhắn động theo số tiền, số buổi và tên học sinh (có thể chỉnh sửa trực tiếp qua `contenteditable="true"`).
    - Footer: Câu chúc *Đồng hành cùng sự tiến bộ của học sinh!* màu xám nghiêng tinh tế.
  - **Hỗ trợ chuyển đổi trạng thái nút Lưu bản nháp (Toggle Draft Icon):**
    - Khi nhấn "Lưu bản nháp": huy hiệu bookmark bị tô đặc (`fa-solid fa-bookmark`, màu tím `#7C3AED`), nút chuyển sang trạng thái active `Đã lưu nháp` (`.btn-draft-saved`), dữ liệu lưu vào `localStorage`, toast thông báo thành công.
    - Khi nhấn một lần nữa: hủy lưu bản nháp, huy hiệu trở lại viền không tô (`fa-regular fa-bookmark`), nút trở lại `Lưu bản nháp`, xóa bản nháp khỏi `localStorage`, toast thông báo đã hủy lưu.
    - Khi mở modal của học sinh: tự động kiểm tra `localStorage`, nếu học sinh đã có bản nháp thì nút tự động hiển thị ở trạng thái đã tô và khôi phục dữ liệu nháp.
  - **Nâng cấp tính năng Xuất PDF (Direct PDF Download):**
    - Chuyển đổi hoàn toàn cơ chế cũ (trước đây gọi `window.print()` mở hộp thoại in) sang cơ chế tải trực tiếp tệp tin PDF (`.pdf`) về máy tính / điện thoại.
    - Sử dụng `html2canvas` chụp chuẩn nét 2x card phiếu học tập `#tuitionInvoiceCard`, tự động đóng gói thành file tài liệu PDF chuẩn A4 (595.28 x 841.89 pt) căn giữa thẩm mỹ.
    - Đặt tên file tự động theo học sinh và kỳ học: `PhieuHocPhi_[TênHọcSinh]_[KỳHọc].pdf`.
    - Tự động kích hoạt tải xuống ngay lập tức trên trình duyệt mà không cần cài thêm thư viện ngoài.
  - **Chuyển đổi toàn bộ hộp thoại thông báo/xác nhận sang In-App Web Dialog (Loại bỏ popup trình duyệt):**
    - Thay thế hoàn toàn popup xác nhận mặc định của trình duyệt (`confirm("Bỏ các thay đổi chưa lưu?")`) bằng modal xác nhận riêng của web (`#customConfirmModal`).
    - Giao diện modal web đồng bộ: Icon dấu hỏi vàng `fa-circle-question`, tiêu đề *Xác nhận yêu cầu*, nội dung câu hỏi rõ ràng, 2 nút bấm *Hủy* (tiếp tục chỉnh sửa) và *Đồng ý* (hủy bỏ thay đổi và đóng phiếu).
    - Hỗ trợ đóng hộp thoại xác nhận khi nhấp ra vùng tối bên ngoài (backdrop dismiss).
  - Tự động đồng bộ tiêu đề kỳ học tương ứng theo mẫu khi chuyển đổi tab Mẫu 1 / Mẫu 2 nếu chưa nhập tiêu đề tùy chỉnh.
  - Bật/tắt bất kỳ toggle nào sẽ ẩn/hiện tức thì trường thông tin tương ứng trên live preview.
  - Đảm bảo đúng chuẩn giao diện dark/tím của Gia Sư, card phiếu nền trắng tương phản cao chuẩn mực.

- ✅ **Task 9.1 — Khung modal 2 cột + Header + Chọn mẫu (demo only):**
  - Nâng cấp `#tutorTuitionInvoiceModal` thành modal 2 cột rộng chuẩn (`width: 95%`, `max-width: 1050px`), cuộn độc lập từng cột (`overflow-y: auto`, `max-height: calc(90vh - 145px)`), không tràn màn hình.
  - Header nổi bật với icon 🎓, tiêu đề "Tạo Phiếu Học Phí", tag học sinh, tên học sinh và thông tin tài khoản ngân hàng / STK.
  - Bộ nút chuyển mẫu dạng pills "Mẫu 1" / "Mẫu 2" active toggle, mặc định Mẫu 1 (style theme tím `#8E4DFF`).
  - Cột trái: placeholder form loading sẵn sàng cho Task 9.2 và Task 9.3.
  - Cột phải: khung live preview cân đối (~55%).
  - Footer: 5 nút thao tác đầy đủ (Hủy bỏ, Lưu bản nháp, Xuất PDF, Copy ảnh, Xuất phiếu ảnh) style tím sang trọng.
  - Responsive: trên mobile < 768px, layout tự động chuyển sang dạng 1 cột dọc (form trên, preview dưới).

- 🎯 **Loại bỏ tùy chọn "Tất cả học sinh" trong Báo cáo & Nhật ký buổi học (theo yêu cầu người dùng):**
  - Đã loại bỏ hoàn toàn tùy chọn `"all"` ("Tất cả học sinh") khỏi bộ lọc dropdown tại tab **Báo cáo** (`#reportStudentSelect`) và tab **Nhật ký buổi học** (`#diaryStudentFilter`).
  - Dropdown giờ chỉ hiển thị danh sách từng học sinh cụ thể (`Lê Minh Thư`, `Nguyễn Hoàng Nam`, `Phạm Hải Đăng`).
  - Mặc định khi mở tab sẽ chọn ngay học sinh đầu tiên trong danh sách thay vì chọn "Tất cả".
  - Nội dung xem trước Báo cáo (`previewTutorReport`) và danh sách Nhật ký (`renderTutorDiarySection`) tự động lọc và hiển thị chính xác chỉ của riêng học sinh được chọn.
  - Tên file xuất ảnh PNG báo cáo tự động định dạng theo tên của học sinh đang được xem (ví dụ: `BaoCao_Le_Minh_Thu_20260301_20260331.png`).
- ✅ **Task 8.4:** Nút "Xem toàn bộ lịch dạy" trong block Lịch sắp tới (Nút điều hướng sang `tutor-calendar.html`, định vị chuẩn ở header Lịch sắp tới, style đồng bộ theme tím `#8E4DFF`)
- ✨ **Tinh chỉnh Layout Tổng quan (theo yêu cầu người dùng):** Tách block "Lịch dạy sắp tới" ra thành 1 hàng ngang độc lập full-width (Hôm nay & Ngày mai 2 cột rộng rãi), đưa 2 block biểu đồ ("Doanh thu N tháng" & "Doanh thu theo học sinh") vào chung 1 hàng ngang song song cân đối.
- 🎨 **Thiết kế Biểu đồ Doanh thu 12 tháng chuẩn Hình 2 (theo yêu cầu người dùng):**
  - Hiển thị đủ 12 tháng (T1 đến T12) mặc định.
  - Tiêu đề gọn "Doanh thu 12 tháng", tổng doanh thu màu xanh lá cây `180.250.000 đ`.
  - Hàng 3 nút lọc dạng viên thuốc bo tròn màu trắng (`12 tháng`, `Biểu đồ cột`, `Năm 2026`).
  - Cột mờ track phía sau cho 12 tháng, cột xanh hoàng gia (`#4A72E8`) nổi bật phía trước.
  - Hiển thị đầy đủ số liệu phía trên từng cột (`0,0đ` cho T1-T7 và `32,4tr`, `36,5tr`, `51,7tr`, `52,3tr`, `7,5tr` cho T8-T12).
  - Ẩn hoàn toàn trục Y giúp biểu đồ thoáng đãng, sắc nét y hệt hình mẫu.
- 🔧 **Khắc phục lỗi Tương tác Bộ lọc Biểu đồ Doanh thu (theo phản hồi người dùng):**
  - Khắc phục sự cố `window.updateRevenueBarChart` chưa được gán ra phạm vi toàn cục khiến các sự kiện `onchange` của 3 dropdown không chạy được.
  - Hỗ trợ chuyển đổi đầy đủ các mốc thời gian: `12 tháng`, `6 tháng`, `3 tháng` (tự động co giãn bề rộng cột tương ứng, cập nhật số liệu và tổng doanh thu).
  - Hỗ trợ chuyển đổi các năm: `Năm 2026`, `Năm 2025`, `Năm 2024` (tự động cập nhật toàn bộ cột, nhãn trên đỉnh cột và tổng doanh thu theo từng năm).
  - Hỗ trợ chuyển đổi loại biểu đồ linh hoạt: `Biểu đồ cột` (chuẩn Hình 2) và `Biểu đồ đường` (đường cong mềm mại, hiệu ứng gradient phát sáng).

## Trạng thái dự án

- 🎉 **Bản Demo (`Gia sư - demo/`):** Hoàn thành 100% tất cả 17 tasks qua 8 Phases. Sẵn sàng cho người dùng nghiệm thu và đánh giá.
- 🔄 **Bản Production (`Gia sư/`):** Đã hoàn nguyên về nguyên trạng trước dự án (`origin/main`, commit `d827c23`) theo yêu cầu người dùng để chờ duyệt sau khi nghiệm thu xong bản Demo. Toàn bộ code cải tiến của production đã được sao lưu an toàn tại nhánh `backup-redesign-phase8`.

## Blockers

Không có blocker nào. Bản Demo sẵn sàng nghiệm thu.

---

## Tính năng đã hoàn thành

- ✅ **Sidebar Navigation:** 6 mục chính (Tổng quan, Báo cáo, Nhật ký buổi học, Lịch dạy, Học sinh, Học phí)
- ✅ **Responsive Navigation:** Fixed sidebar bên trái trên desktop, bottom navigation bar trên mobile
- ✅ **4 KPI Cards:** Thống kê trực quan số học sinh, buổi dạy, giờ tích lũy, học phí
- ✅ **Lịch dạy sắp tới (Hôm nay & Ngày mai):** Phân nhóm ngày rõ ràng, hiển thị giờ, môn học, tag màu riêng biệt
- ✅ **Nhật ký buổi học:** Tra cứu lịch sử toàn diện, lọc theo học sinh & tháng, xem và sửa nhận xét inline
- ✅ **Quản lý học sinh:** Grid thẻ trực quan, avatar màu, xem chi tiết và nhật ký học sinh
- ✅ **Quản lý học phí:** Banner 3 chỉ số, bảng tính học phí theo đơn giá & số buổi, toggle trạng thái thu, xem & xuất hóa đơn điện tử kèm VietQR
- ✅ **Báo cáo chuyên nghiệp:** Lọc theo ngày & học sinh, card xem trước chuẩn mực, xuất ảnh PNG 2x
- ✅ **Responsive & Polish:** Chuẩn hóa hiển thị cả trên mobile (375px) và desktop (1280px)
- ✅ **Đồng bộ Production:** Hoàn tất đồng bộ code sang `Gia sư/`, hỗ trợ Supabase API backend
- ✅ **Header Clean & Hidden:** Loại bỏ nút thừa và ẩn `tutor-header` cũ giải phóng không gian màn hình
- ✅ **Phase 12 Task 12.1 (Multi-Theme System):** Tạo `css/themes.css` với đầy đủ 28-30 CSS variables cho 36 theme (5 presets + 15 themes x 2 variants). Thiết lập bootstrap script trong `<head>` của `tutor-dashboard.html` và `tutor-calendar.html`.
- ✅ **Phase 12 Task 12.2 (Multi-Theme System):** Chuẩn hóa toàn bộ màu sắc hardcoded trong `css/style.css` và style/inline block của `tutor-dashboard.html` sang CSS variables. Bảo toàn nghiêm ngặt các màu semantic (đỏ error, xanh success, vàng warning, badge học phí, màu riêng học sinh và invoice card).
- ✅ **Phase 12 Task 12.3 (Multi-Theme System):** Thay thế toàn bộ màu theme hardcoded trong các template strings và inline styles của `js/tutor.js` sang CSS variables (`var(--bg-card)`, `var(--text-secondary)`, `var(--color-primary)`, `var(--btn-bg)`, v.v.).
- ✅ **Phase 12 Task 12.4 (Multi-Theme System):** Tinh chỉnh hệ thống theme cho `tutor-calendar.html` bao gồm CSS variables cho header, navigation, FullCalendar grid/time slots/cushions/today highlights/popovers, tối ưu `eventDidMount` thích ứng dark/light theme động và bổ sung nút đổi theme "🎨" trên thanh công cụ.
- ✅ **Phase 12 Task 12.5 (Multi-Theme System):** Xây dựng Theme Switcher UI toàn diện trên cả `tutor-dashboard.html` (nút sidebar footer) và `tutor-calendar.html` (nút 🎨 header) với Modal Drawer chia 3 nhóm: Nhóm A (5 presets màu đơn), Nhóm B (15 themes × 2 variants = 30 giao diện đầy đủ dạng grid 2 cột cuộn mượt mà), Nhóm C (Bộ chọn màu tùy chỉnh HEX/Color picker), huy hiệu theme đang áp dụng và hàm `applyTheme()` tức thì không giật lag.
- ✅ **Phase 12 Task 12.6 (Multi-Theme System):** Cập nhật hàm `rerenderChartsForTheme()` tự động đọc `--chart-bar`, `--chart-bar-rgb`, và `--bg-card` để re-render và đồng bộ màu sắc Chart.js (cả biểu đồ cột/đường doanh thu và biểu đồ tròn donut phân bổ học sinh) ngay khi người dùng chọn theme mới.
- ✅ **Phase 12 Task 12.7 (Multi-Theme System):** Hoàn thiện bộ chọn màu cá nhân hóa (Custom Color Picker): đồng bộ 2 chiều giữa HTML5 Color Picker và ô nhập mã HEX, tự động tính toán palette tương phản (sáng hơn 50%, tối hơn 30%), áp dụng nền sáng thanh lịch và lưu `custom:#HEX` vào localStorage kèm bootstrap sớm chống FOUC khi tải trang.

