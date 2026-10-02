# TASKS — Web Gia Sư Demo (Sidebar Redesign)

> **Quy tắc:** Đọc từ trên xuống, chỉ thực hiện task `[ ]` đầu tiên chưa hoàn thành.  
> Sau khi xong mỗi task: đánh dấu `[x]`, cập nhật PROGRESS.md, commit git.

---

## PHASE 1 — Sidebar Layout Shell (Nền tảng kiến trúc)

### Task 1.1 — Thêm Sidebar Layout vào tutor-dashboard.html
- [x] **Mô tả:** Restructure layout HTML từ dạng phẳng sang dạng 2 cột: `sidebar (fixed, 240px) + main-content (flex-1, scrollable)`. Sidebar có: logo/avatar gia sư ở trên, 6 nav items ở giữa, nút Đăng xuất ở dưới. Chưa cần render nội dung các section — chỉ cần skeleton + active state khi click.
- **File cần sửa:** `tutor-dashboard.html`, `css/style.css`
- **Tiêu chí hoàn thành:**
  - [x] Sidebar hiển thị đúng trên Desktop (≥ 768px): cố định bên trái, không cuộn cùng content
  - [x] Trên Mobile (< 768px): sidebar collapse thành bottom navigation bar (icon + label nhỏ)
  - [x] Click vào từng mục sidebar → highlight active (màu tím `#8E4DFF`), content area chưa cần thay đổi
  - [x] Không làm vỡ bất kỳ tính năng hiện có nào (lịch sử buổi học, BTVN, thông báo...)

---

### Task 1.2 — Tổng quan: 4 KPI Cards
- [x] **Mô tả:** Khi click "Tổng quan" trong sidebar, hiển thị section với 4 KPI cards: (1) Số học sinh đang dạy, (2) Tổng buổi đã dạy tháng này, (3) Tổng giờ tích lũy tháng này, (4) Học phí tháng này (tổng tất cả học sinh). Dữ liệu tính từ mock store.
- **File cần sửa:** `tutor-dashboard.html`, `js/tutor.js`
- **Tiêu chí hoàn thành:**
  - [x] 4 cards hiển thị đúng giá trị tính từ mock data
  - [x] Responsive: 2 cột trên mobile, 4 cột trên desktop
  - [x] Cards có icon (Font Awesome), số lớn nổi bật, label nhỏ phía dưới

---

### Task 1.3 — Tổng quan: Lịch dạy sắp tới (Hôm nay & Ngày mai)
- [x] **Mô tả:** Bên dưới 4 KPI cards, hiển thị danh sách buổi dạy sắp tới nhóm theo ngày: "Hôm nay - Thứ X, DD/MM" và "Ngày mai - Thứ X, DD/MM". Mỗi buổi dạy hiển thị: giờ bắt đầu-kết thúc, tên học sinh (có tag màu), môn học. Nếu không có buổi nào → hiển thị "Không có lịch dạy hôm nay 🎉".
- **File cần sửa:** `tutor-dashboard.html`, `js/tutor.js`
- **Tiêu chí hoàn thành:**
  - [x] Nhóm đúng theo ngày hôm nay và ngày mai
  - [x] Tên học sinh có màu tag riêng (mỗi học sinh 1 màu nhất quán)
  - [x] Thứ hiển thị đúng (dùng hàm `formatDateWithDayOfWeek` đã có)

---

## PHASE 2 — Nhật ký buổi học

### Task 2.1 — Section Nhật ký buổi học
- [x] **Mô tả:** Khi click "Nhật ký buổi học" trong sidebar, hiển thị section có: dropdown chọn học sinh (hoặc "Tất cả"), filter theo tháng, bảng/list lịch sử buổi học. Mỗi row: Ngày (Thứ X, DD/MM), Giờ, Môn, Nội dung bài học, Nhận xét gia sư (expandable), Badge BTVN. Có nút "Sửa nhận xét" inline.
- **File cần sửa:** `tutor-dashboard.html`, `js/tutor.js`
- **Tiêu chí hoàn thành:**
  - [x] Hiển thị đúng lịch sử từ mock data cho học sinh đang chọn
  - [x] Filter theo tháng hoạt động đúng
  - [x] Nhận xét dài → truncate + nút "Xem thêm"
  - [x] Nút "Sửa nhận xét" mở inline edit (không cần modal riêng)

---

## PHASE 3 — Học sinh

### Task 3.1 — Section Học sinh
- [x] **Mô tả:** Khi click "Học sinh" trong sidebar, hiển thị grid danh sách học sinh (card view): avatar chữ cái, tên, môn học, lịch cố định, số buổi tháng này. Click card → expand chi tiết hoặc chuyển sang Nhật ký lọc sẵn học sinh đó. Nút "Thêm học sinh" (dùng lại modal đã có).
- **File cần sửa:** `tutor-dashboard.html`, `js/tutor.js`
- **Tiêu chí hoàn thành:**
  - [x] Grid 2-3 cột trên desktop, 1 cột trên mobile
  - [x] Click card học sinh → highlight + hiển thị quick info (số buổi, BTVN %, học phí)
  - [x] Nút "Thêm học sinh" dùng lại `openAddStudentModal()` đã có

---

## PHASE 4 — Học phí

### Task 4.1 — Section Học phí
- [x] **Mô tả:** Khi click "Học phí" trong sidebar, hiển thị: (1) Banner tổng thu nhập tháng hiện tại, (2) Bảng từng học sinh với: tên, số buổi tháng này, đơn giá/buổi, tổng tiền, trạng thái (Đã thu / Chưa thu / Nợ), nút "Xem hóa đơn". Trạng thái có thể toggle click.
- **File cần sửa:** `tutor-dashboard.html`, `js/tutor.js`
- **Tiêu chí hoàn thành:**
  - [x] Tổng thu nhập tháng tính đúng từ mock data
  - [x] Toggle trạng thái Đã thu / Chưa thu lưu vào store
  - [x] Nút "Xem hóa đơn" mở preview-invoice (đã có) hoặc inline modal
  - [x] Filter theo tháng (dropdown tháng/năm)

---

## PHASE 5 — Báo cáo (Xuất ảnh)

### Task 5.1 — Section Báo cáo: Filter & Preview
- [x] **Mô tả:** Khi click "Báo cáo" trong sidebar, hiển thị: (1) Form chọn bộ lọc: "Từ ngày" (date picker), "Đến ngày" (date picker), "Học sinh" (dropdown: Tất cả / chọn 1 em). (2) Nút "Xem trước" → render danh sách buổi học trong khoảng ngày đó dưới dạng card đẹp (layout dọc, in-page, dùng được với html2canvas).
- **File cần sửa:** `tutor-dashboard.html`, `js/tutor.js`
- **Tiêu chí hoàn thành:**
  - [x] Date range picker hoạt động (native HTML date input)
  - [x] Preview hiển thị đúng các buổi học trong khoảng ngày chọn
  - [x] Nếu không có buổi nào → hiển thị empty state

---

### Task 5.2 — Section Báo cáo: Xuất ảnh PNG
- [x] **Mô tả:** Sau khi preview hiển thị, nút "Xuất ảnh" dùng `html2canvas` để chụp vùng preview → download file PNG tên tự động theo format `BaoCao_[TenHocSinh]_[TuNgay]_[DenNgay].png`. Tích hợp trực tiếp vào tutor-dashboard.html (import html2canvas CDN nếu chưa có).
- **File cần sửa:** `tutor-dashboard.html`, `js/tutor.js`
- **Tiêu chí hoàn thành:**
  - [x] File PNG tải về thành công, không bị blank/trắng
  - [x] Tên file đúng format
  - [x] Button có loading state khi đang xử lý (disable + spinner)
  - [x] Ảnh xuất ra đủ độ phân giải (scale 2x)

---

## PHASE 6 — Polish & Sync

### Task 6.1 — Responsive kiểm tra toàn bộ
- [x] Kiểm tra toàn bộ 6 sections trên mobile (375px) và desktop (1280px)
- [x] Fix các layout bug nếu có (Đã fix unclosed media query ở line 2187 làm tràn layout desktop, bổ sung responsive padding/border-radius cho toolbar/cards/modals trên mobile 375px, xếp chồng message box & QR card trên mobile)

### Task 6.2 — Sync sang production
- [x] Copy các thay đổi đã verify từ `Gia sư - demo/` sang `Gia sư/`
- [x] Kiểm tra lại với Supabase API thật (tích hợp `tutorSchedule`, `recentLessons`, `evaluations` vào `getTutorDashboardDataInternal`, bổ sung `suaNhanXetInline`, kết nối sync `capNhatDongHocPhiBuoiHoc` / `capNhatNhieuDongHocPhi`)

---

## PHASE 7 — Bug Fix sau Review

> Phát hiện bởi Planner qua code review ngày 2026-10-01. Cần fix trên **cả demo lẫn production**.

### Task 7.1 — Xóa nút Tài khoản & Đăng xuất thừa trong tutor-header cũ
- [x] **Mô tả:** Sau khi thêm sidebar, nút "Tài khoản" và "Đăng xuất" bị xuất hiện **hai lần**: một lần trong `div.tutor-sidebar-footer` (đúng, giữ lại) và một lần trong `div.tutor-header` cũ (thừa, cần xóa). Xóa đúng 2 thẻ `<button>` thừa trong `div.tutor-header`, không được xóa nhầm bộ button trong sidebar.
- **File cần sửa:** `tutor-dashboard.html` (cả demo lẫn production)
- **Tiêu chí hoàn thành:**
  - [x] Chỉ còn đúng 1 bộ nút Tài khoản + Đăng xuất (trong sidebar footer)
  - [x] Không xóa nhầm button trong sidebar
  - [x] Giao diện header còn lại gọn, không có khoảng trống lạ

---

### Task 7.2 — Ẩn hoặc làm gọn `tutor-header` cũ
- [x] **Mô tả:** Sau Task 7.1, `div.tutor-header` chỉ còn lại dòng chữ "Xin chào, Gia sư" + "Tổng quan hệ thống giảng dạy". Phần này bị trùng lặp với thông tin gia sư đã hiển thị trong sidebar brand. Giải pháp: ẩn hoàn toàn `div.tutor-header` trên desktop (≥ 768px) vì sidebar đã đảm nhận vai trò đó; trên mobile có thể giữ lại như page title nhỏ nếu cần, hoặc ẩn luôn.
- **File cần sửa:** `tutor-dashboard.html` và/hoặc `css/style.css` (cả demo lẫn production)
- **Tiêu chí hoàn thành:**
  - [x] Desktop: `div.tutor-header` không hiển thị (hoặc ẩn bằng CSS `display: none` khi có class `.tutor-app-layout`)
  - [x] Mobile: kiểm tra xem có cần giữ lại tiêu đề trang không — nếu bottom nav đã rõ ràng thì ẩn luôn
  - [x] Không ảnh hưởng đến bất kỳ section nào bên dưới

---

### Task 7.3 — Sidebar Collapsible (Thu gọn / Mở rộng)
- [x] **Mô tả:** Thêm nút toggle `>` / `<` ở góc phải của sidebar. Khi nhấn `>`: sidebar thu gọn còn khoảng **60px**, chỉ hiển thị **icon**, ẩn text label. Khi nhấn `<`: sidebar mở rộng trở lại **240px** với đầy đủ icon + text. Trạng thái được nhớ vào `localStorage` để lần sau mở lại vẫn giữ nguyên.
- **File cần sửa:** `tutor-dashboard.html`, `css/style.css` (cả demo lẫn production)
- **Tiêu chí hoàn thành:**
  - [x] Nút toggle `>` hiển thị ở góc phải sidebar (trên cùng hoặc giữa), icon đổi thành `<` khi đã mở rộng
  - [x] Khi **collapsed** (60px): chỉ thấy icon, text label ẩn (`display: none` hoặc `opacity: 0`), main content tự mở rộng chiếm phần còn lại
  - [x] Khi **expanded** (240px): icon + text hiển thị đầy đủ như cũ
  - [x] Transition mượt (CSS `transition: width 0.25s ease`)
  - [x] Tooltip hiển thị tên mục khi hover vào icon lúc sidebar đang collapsed (ví dụ: hover vào icon calendar → tooltip "Lịch dạy")
  - [x] `localStorage.setItem('tutorSidebarCollapsed', true/false)` — nhớ trạng thái qua lần reload
  - [x] Trên **mobile**: tính năng này không áp dụng (mobile vẫn dùng bottom nav như cũ)
  - [x] Không làm vỡ layout các section bên trong main content

---

## PHASE 8 — Nâng cấp Tổng Quan (theo chuẩn UI Lớp Học)

> Bổ sung các tính năng còn thiếu trong section Tổng Quan để đạt feature parity với UI tham chiếu (Web Lớp Học).  
> **Lưu ý:** Chart.js đã được import sẵn ở line 1739 của `tutor-dashboard.html` — dùng lại, không import lại.

### Task 8.1 — Month Selector (< Tháng X/YYYY >) trên Tổng Quan
- [x] **Mô tả:** Thêm bộ chọn tháng kiểu `< Tháng 9/2026 >` ở **góc trên bên phải** của section Tổng Quan. Khi thay đổi tháng → toàn bộ 4 KPI Cards và block "Lịch dạy sắp tới" phải re-render theo tháng đã chọn (filter data theo tháng đó). Mặc định là tháng hiện tại.
- **File cần sửa:** `tutor-dashboard.html`, `js/tutor.js` (cả demo lẫn production)
- **Tiêu chí hoàn thành:**
  - [x] Hiển thị đúng format `< Tháng M/YYYY >`, nút `<` và `>` để điều hướng tháng trước/sau
  - [x] Mặc định = tháng hiện tại
  - [x] Khi chuyển tháng → `renderTutorKpiCards()` và `renderUpcomingSchedule()` chạy lại với tháng đã chọn
  - [x] Không thể chọn tháng tương lai (disable nút `>` nếu đang ở tháng hiện tại)
  - [x] Đồng bộ hiển thị đúng cả trên desktop lẫn mobile

---

### Task 8.2 — Biểu đồ Doanh thu N tháng (Bar Chart)
- [x] **Mô tả:** Thêm block **"Doanh thu N tháng"** vào bên phải của Tổng Quan (layout 2 cột: trái = Lịch sắp tới, phải = charts). Hiển thị: tổng doanh thu lớn ở trên (`X.XXX.XXX đ`), bar chart bên dưới theo từng tháng. Có 3 dropdown filter: **Khoảng thời gian** (3 tháng / 6 tháng / 12 tháng), **Loại biểu đồ** (Biểu đồ cột — chỉ cần cột là đủ), **Năm**. Dữ liệu tính từ `logs` của tất cả học sinh trong mock store.
- **File cần sửa:** `tutor-dashboard.html`, `js/tutor.js` (cả demo lẫn production)
- **Thư viện:** Dùng **Chart.js** đã có sẵn (line 1739), không import thêm
- **Tiêu chí hoàn thành:**
  - [x] Bar chart render đúng số tháng theo dropdown (3/6/12 tháng gần nhất)
  - [x] Tổng doanh thu hiển thị đúng (tổng toàn kỳ đã chọn)
  - [x] Thay đổi dropdown → chart và tổng re-render ngay
  - [x] Responsive: trên mobile < 768px, block này nằm dưới Lịch sắp tới (không chia 2 cột)
  - [x] Chart dùng màu tím `#8E4DFF` làm màu cột chính, matching theme Gia Sư

---

### Task 8.3 — Doanh thu theo Học sinh (Donut Chart + List)
- [x] **Mô tả:** Thêm block **"Doanh thu theo học sinh"** bên dưới block bar chart (cùng cột phải). Hiển thị: dropdown chọn tháng (mặc định = tháng hiện tại), donut chart thể hiện tỉ lệ đóng góp doanh thu của từng học sinh, list bên phải liệt kê tên học sinh + số tiền (học phí × số buổi tháng đó), có màu dot tương ứng với slice trên donut. Tổng hiển thị ở giữa donut.
- **File cần sửa:** `tutor-dashboard.html`, `js/tutor.js` (cả demo lẫn production)
- **Thư viện:** Dùng **Chart.js** đã có sẵn, kiểu `doughnut`
- **Tiêu chí hoàn thành:**
  - [x] Donut chart render đúng số slice = số học sinh có buổi trong tháng
  - [x] Tổng hiển thị ở giữa donut (dùng Chart.js plugin hoặc overlay text)
  - [x] List học sinh sắp xếp giảm dần theo doanh thu
  - [x] Học sinh không có buổi trong tháng → hiển thị `0đ` ở cuối list, không có slice trên donut
  - [x] Mỗi học sinh có màu riêng nhất quán (đồng bộ với màu tag ở Lịch sắp tới)
  - [x] Dropdown tháng thay đổi → cả donut và list re-render

---

### Task 8.4 — Nút "Xem toàn bộ lịch dạy" trong block Lịch sắp tới
- [x] **Mô tả:** Thêm nút **"Xem toàn bộ lịch dạy"** ở góc trên phải của block Lịch dạy sắp tới, link sang `tutor-calendar.html`. Đây là tính năng nhỏ, đơn giản.
- **File cần sửa:** `tutor-dashboard.html` (cả demo lẫn production)
- **Tiêu chí hoàn thành:**
  - [x] Nút hiển thị đúng vị trí (góc phải header của block Lịch sắp tới)
  - [x] Click → mở `tutor-calendar.html` (same tab hoặc new tab đều được)
  - [x] Style đồng bộ với theme tím `#8E4DFF`

---

## PHASE 9 — Nâng cấp Modal "Tạo Phiếu Học Phí" (Demo only)

> ⚠️ **CHỈ SỬA TRÊN BẢN DEMO** (`Gia sư - demo/`). Không được sửa production (`Gia sư/`).  
> Phiếu hiển thị trực tiếp (right panel) **giữ nguyên giao diện Gia Sư hiện tại** (dark/tím), không copy style hồng từ Lớp Học.  
> Hàm hiện có cần nâng cấp: `openStudentInvoiceModal()`, `exportTuitionModalInvoice()` trong `js/tutor.js`.  
> Modal HTML hiện có cần nâng cấp: `#tutorTuitionInvoiceModal` trong `tutor-dashboard.html`.

---

### Task 9.1 — Khung modal 2 cột + Header + Chọn mẫu
- [x] **Mô tả:** Nâng cấp `#tutorTuitionInvoiceModal` từ modal đơn giản thành modal **2 cột rộng** (min-width 900px trên desktop). Layout: **Header** (Tạo Phiếu Học Phí + tên học sinh + STK) | **Cột trái** (form, ~45%) | **Cột phải** (live preview, ~55%) | **Footer** (action buttons). Góc trên phải header: pills "Mẫu 1" / "Mẫu 2" + nút X đóng.
- **File cần sửa:** `tutor-dashboard.html` *(demo only)*
- **Tiêu chí hoàn thành:**
  - [x] Modal rộng, 2 cột, không bị tràn màn hình (max-height 90vh, overflow-y: auto riêng từng cột)
  - [x] Header hiển thị: icon 🎓 + "Tạo Phiếu Học Phí" + tên học sinh + số TK (lấy từ tutorDataGlobal)
  - [x] Pills "Mẫu 1" / "Mẫu 2" active/inactive toggle, mặc định Mẫu 1
  - [x] Cột trái: placeholder "Đang tải form..." (nội dung điền ở Task 9.2 và 9.3)
  - [x] Cột phải: placeholder preview (nội dung điền ở 9.2)
  - [x] Footer: 5 nút (Hủy bỏ | Lưu bản nháp | Xuất PDF | Copy ảnh | Xuất phiếu ảnh) — style matching theme tím
  - [x] Mobile < 768px: 2 cột stack thành 1 cột dọc (form trên, preview dưới)

---

### Task 9.2 — Toggle switches 9 trường + Live Preview real-time
- [x] **Mô tả:** Điền nội dung cột trái: 9 toggle switches, mỗi toggle có label + giá trị hiện tại bên dưới. Khi toggle bật/tắt → live preview bên phải cập nhật ngay lập tức (không reload modal). Hai trường **Giảm học phí** và **Phụ thu** có thêm ô nhập số (mặc định 0đ), thay đổi số → tổng tiền tự tính lại. Mẫu 1 và Mẫu 2 render khác nhau (Mẫu 1: full, Mẫu 2: chỉ tên + tổng + QR).
- **File cần sửa:** `js/tutor.js`, `tutor-dashboard.html` *(demo only)*
- **Tiêu chí hoàn thành:**
  - [x] 9 toggle switches: Học sinh / Lớp & Môn / Học phí áp dụng / Số buổi học / Số giờ tích lũy / Ngày học / Giảm học phí / Phụ thu / Ảnh QR
  - [x] Mỗi toggle: label + giá trị hiện tại (vd: "Học phí áp dụng — 200.000đ")
  - [x] Toggle off → field tương ứng ẩn khỏi preview ngay lập tức
  - [x] Giảm học phí & Phụ thu: input số → tổng tiền = (số buổi × đơn giá) − giảm + phụ thu, cập nhật preview
  - [x] Mẫu 2: chỉ hiển thị: tiêu đề + tên học sinh + tổng tiền lớn + QR + thông tin ngân hàng
  - [x] Live preview giữ đúng style Gia Sư hiện tại (white card trên dark background, màu tím)

---

### Task 9.3 — Date range + Tiêu đề kỳ học + Draft save/restore
- [x] **Mô tả:** Thêm section "Thông tin kỳ học" ở cuối cột trái gồm: **Từ ngày** / **Đến ngày** (native date input, mặc định = ngày đầu và cuối tháng hiện tại) + **Tiêu đề kỳ học** (text input, auto-generate "HỌC PHÍ THÁNG X/YYYY", có thể sửa tay). Khi đổi date range → live preview chỉ tính các buổi học trong khoảng đó + tiêu đề tự cập nhật. **Draft auto-save:** mỗi khi user thay đổi bất kỳ toggle/input → lưu state vào `localStorage` key `tuitionDraft_[studentName]`. Khi mở modal: nếu có draft → restore và hiện thông báo xanh lá "Đã khôi phục bản nháp lần trước".
- **File cần sửa:** `js/tutor.js` *(demo only)*
- **Tiêu chí hoàn thành:**
  - [x] Date range picker: Từ ngày / Đến ngày, default = đầu tháng → cuối tháng hiện tại
  - [x] Đổi date range → preview chỉ count buổi học trong khoảng đó, tổng tiền tính lại
  - [x] Tiêu đề kỳ học: auto "HỌC PHÍ THÁNG M/YYYY" nếu cùng tháng, "HỌC PHÍ DD/MM – DD/MM" nếu khác tháng
  - [x] Tiêu đề sửa tay được, thay đổi → cập nhật preview
  - [x] Auto-save state (toggles + discount + extra + dates + title + mẫu) mỗi khi thay đổi
  - [x] Khi mở modal: có draft → restore state + hiện banner "Đã khôi phục bản nháp lần trước" màu xanh lá
  - [x] Nút "Lưu bản nháp" trong footer: save + toast "Đã lưu bản nháp!"

---

### Task 9.4 — Action buttons: Xuất PDF + Copy ảnh + Xuất phiếu (ảnh)
- [x] **Mô tả:** Implement đầy đủ 5 nút trong footer modal. Nút "Hủy bỏ" đóng modal + hỏi xác nhận nếu có thay đổi chưa lưu. Nút "Xuất PDF" dùng `window.print()` với CSS `@media print` chỉ hiện preview card. Nút "Copy ảnh" dùng `html2canvas` → `navigator.clipboard.write`. Nút "Xuất phiếu (ảnh)" nâng cấp từ `exportTuitionModalInvoice()` hiện có: xuất đúng phần preview card, tên file = `PhieuHocPhi_[TenHocSinh]_[ThangNam].png`.
- **File cần sửa:** `js/tutor.js`, `tutor-dashboard.html` *(demo only)*
- **Tiêu chí hoàn thành:**
  - [x] **Hủy bỏ:** Nếu có thay đổi chưa lưu → confirm dialog "Bỏ các thay đổi chưa lưu?"; nếu không → đóng luôn
  - [x] **Lưu bản nháp:** Save localStorage + toast success, không đóng modal
  - [x] **Xuất PDF:** `window.print()`, CSS print chỉ hiện `#tuitionInvoiceCard`, ẩn toàn bộ form trái và buttons
  - [x] **Copy ảnh:** `html2canvas(card, {scale:2})` → `navigator.clipboard.write([ClipboardItem])` → toast "Đã copy ảnh!"
  - [x] **Xuất phiếu (ảnh):** `html2canvas(card, {scale:2})` → download PNG, tên file đúng format, loading state trên nút
  - [x] Tất cả nút có loading/disabled state khi đang xử lý async
  - [x] Fallback: nếu `navigator.clipboard` không hỗ trợ → toast hướng dẫn "Nhấn chuột phải → Lưu ảnh"

---

## PHASE 10 — Nâng cấp Lịch dạy (`tutor-calendar.html`) — Demo only

> ⚠️ **CHỈ SỬA TRÊN BẢN DEMO** (`Gia sư - demo/tutor-calendar.html`). Không sửa production.  
> File hiện tại dùng **FullCalendar v6** (đã import CDN). Chỉ được dùng API của FullCalendar, không import thêm thư viện lịch nào khác.  
> GIỮ NGUYÊN: Lịch tuần, drag & drop, recurrence dialog, click event modal, sheet panel.  
> **Task 10.0 PHẢI làm đầu tiên** — các task 10.1→10.4 phụ thuộc vào theme mới.

---

### Task 10.0 — Đổi theme lịch từ Dark → Light Cream/Beige (như ảnh tham chiếu)
- [x] **Mô tả:** Thay toàn bộ màu sắc của `tutor-calendar.html` từ dark purple/navy sang **light cream/beige** giống ảnh tham chiếu. Đây là task style thuần túy — chỉ sửa CSS, không đụng logic JS nào. Các màu mục tiêu: nền tổng `#F8F3EC` (kem ấm), ô ngày `#FFFFFF`, viền `#E5D9CC`, text `#2D1F0E`, header `#F3EDE4`. Event chips: đổi từ dark overlay sang pastel — background nhạt của màu học sinh + text màu đậm hơn. Nút "hôm nay" và active state dùng màu `#C05E8E` (rose/pink) như ảnh, thay cho tím `#8E4DFF` chỉ trong file này (dashboard vẫn giữ tím).
- **File cần sửa:** `tutor-calendar.html` *(demo only)* — chỉ phần `<style>` và `eventDidMount`
- **Màu sắc cụ thể cần áp dụng:**
  - `body` background: `#F8F3EC`
  - `.container` (header bar): `background: #F3EDE4`, `border-bottom: 1px solid #E5D9CC`
  - `#calendar` wrapper: `background: transparent`
  - `.fc-scrollgrid` (bảng lịch): `background: #FFFFFF`, border `#E5D9CC`
  - `.fc-col-header-cell` (Thứ 2, 3...): `background: #F3EDE4`, text `#6B4226`
  - `.fc-daygrid-day` (ô ngày): `background: #FFFFFF`
  - `.fc-day-today` (hôm nay): `background: #FFF0F6 !important` (hồng rất nhạt), số ngày hôm nay `color: #C05E8E; font-weight: 900`
  - `.fc-daygrid-day-number` (số ngày): `color: #2D1F0E`
  - `.fc-day-other` (ngày ngoài tháng): `background: #F8F3EC`, text `color: #BFA89A`
  - Event chips trong `eventDidMount`: thay `#0F0A30` background thành `[evColor]25` (pastel 15%) + `color: [evColor]` + `border-left: 3px solid [evColor]`
  - `.fc-button` (toolbar buttons): `background: #E8DDD0`, `color: #2D1F0E`, `border: none`
  - `.fc-button-active`: `background: #C05E8E`, `color: #FFF`
  - Modal/dialog panels: `background: #FDF8F3`, text `#2D1F0E` (nếu có)
- **Tiêu chí hoàn thành:**
  - [x] Nền tổng thể: kem/beige ấm, không còn màu tím/đen
  - [x] Ô ngày trắng sáng, viền nhẹ nhàng
  - [x] Text ngày dễ đọc trên nền sáng (không phải màu trắng nữa)
  - [x] Event chips: pastel nhạt với text màu đậm hơn (không còn nền đen + chữ trắng)
  - [x] Ngày hôm nay: nền hồng rất nhạt, số ngày màu rose đậm
  - [x] Buttons toolbar FullCalendar: style lại theo theme sáng
  - [x] Sheet panel (bảng dữ liệu bên dưới) có thể giữ dark hoặc đổi sang light tùy thẩm mỹ
  - [x] Week view và Day view cũng phải đổi theme (không chỉ Month view)

---

### Task 10.1 — Thêm Month View + View toggle pills "Tháng / Tuần"
- [x] **Mô tả:** Thêm `dayGridMonth` vào FullCalendar. Mặc định view = **Month** (không phải Week như hiện tại). Thêm toggle pills "Tháng" | "Tuần" | "Ngày" ở góc trên phải (thay thế nút mặc định FullCalendar). Khi ở month view: `dayMaxEvents: 3` để hiện "+N buổi nữa" khi tràn. Hôm nay highlight bằng viền/nền đặc biệt (FullCalendar tự xử lý qua `.fc-day-today`, chỉ cần custom CSS màu tím thay màu mặc định).
- **File cần sửa:** `tutor-calendar.html` *(demo only)*
- **Tiêu chí hoàn thành:**
  - [x] Mở lịch lần đầu → hiển thị Month view (tháng hiện tại)
  - [x] Toggle "Tuần" → chuyển sang `timeGridWeek` (giữ nguyên mọi tính năng hiện có)
  - [x] Toggle "Tháng" → chuyển về `dayGridMonth`
  - [x] Month view: mỗi ô ngày hiển thị tối đa 3 event, phần còn lại hiện "+N buổi nữa"
  - [x] Click "+N buổi nữa" → mở popover FullCalendar mặc định (danh sách đầy đủ)
  - [x] Toggle pills có active state (màu tím `#8E4DFF` hoặc rose/pink `#C05E8E`, pill kia xám)
  - [x] Ngày hôm nay: viền tím / rose + số ngày đậm hơn và badge tròn (custom CSS `.fc-day-today`)

---

### Task 10.2 — Custom header: Navigation + Tháng/Năm title + Filter "Ẩn đã hủy"
- [x] **Mô tả:** Làm gọn lại header của lịch: bên trái = nút `<` `>` + nút "Hôm nay" + tiêu đề tháng/năm lớn (vd: **"Tháng 9 2026"** màu tím đậm). Bên phải = pills filter + toggle "Tháng/Tuần". Thêm toggle **"Ẩn buổi đã hủy"** (event có `extendedProps.status === 'cancelled'` sẽ bị ẩn khi bật). Điều chỉnh giữ lại nút "Quay lại Dashboard" nhưng thu gọn lại (chỉ icon `←` trên mobile).
- **File cần sửa:** `tutor-calendar.html` *(demo only)*
- **Tiêu chí hoàn thành:**
  - [x] Header: `<` `>` | "Hôm nay" | **"Tháng M YYYY"** (title to, màu tím) | [filter pills] | [toggle Tháng/Tuần]
  - [x] Tiêu đề tháng/năm cập nhật đúng khi nhấn prev/next
  - [x] Toggle "Ẩn buổi đã hủy": bật → lọc khỏi event list những event có status `cancelled`; tắt → hiện lại
  - [x] Mobile: nút "Quay lại" thu gọn thành icon `←` (không có chữ)
  - [x] Không làm vỡ navigation tháng/tuần hiện có

---

### Task 10.3 — Ngày lễ quốc gia Việt Nam trong ô ngày (Month view)
- [x] **Mô tả:** Hard-code danh sách ngày lễ quốc gia VN (cố định theo ngày/tháng). Khi render month view, nếu ô ngày trùng với ngày lễ → hiện text nhỏ tên ngày lễ bên cạnh số ngày (vd: "1 **Quốc khánh**"). Màu text ngày lễ: đỏ nhạt `#F87171`. Không cần background ảnh lễ hội (quá phức tạp). Danh sách tối thiểu: Tết Dương lịch (1/1), Giỗ Tổ (10/3 âm — bỏ qua âm lịch, chỉ dùng dương), 30/4, 1/5, 2/9. Ngày nghỉ bù nếu trùng cuối tuần tự tính theo luật VN (phần này optional, không bắt buộc).
- **File cần sửa:** `tutor-calendar.html` *(demo only)*
- **Tiêu chí hoàn thành:**
  - [x] Danh sách 5 ngày lễ cố định hiển thị đúng trong ô ngày month view
  - [x] Text nhỏ màu đỏ nhạt bên cạnh số ngày, không đè lên event chips
  - [x] Hiển thị đúng mỗi năm (dùng tháng/ngày, không phụ thuộc năm cố định)
  - [x] Week view: không hiển thị (không cần thiết, không đủ không gian)

---

### Task 10.4 — Bottom legend theo học sinh + Status bar
- [x] **Mô tả:** Thêm thanh phía dưới lịch gồm 2 phần: **(1) Legend màu học sinh** — danh sách chấm tròn màu + tên học sinh (đồng bộ với màu event trên lịch). **(2) Status bar** bên phải — "N buổi trong tháng · X học sinh". Cả hai phần chỉ hiện trong **Month view**; trong Week/Day view ẩn đi (không cần vì đã có sheet panel).
- **File cần sửa:** `tutor-calendar.html` *(demo only)*
- **Tiêu chí hoàn thành:**
  - [x] Legend: mỗi học sinh = 1 dot màu + tên, layout hàng ngang, có thể scroll nếu nhiều học sinh
  - [x] Dot màu đồng bộ chính xác với màu event của học sinh đó trên lịch
  - [x] Status bar: tính đúng số buổi trong tháng đang xem + số học sinh
  - [x] Chỉ hiện khi `currentView === 'dayGridMonth'`, ẩn khi Week/Day
  - [x] Không che khuất ô lịch cuối tháng (sticky bottom với padding hợp lý)

---

## Thống kê

| Phase | Tasks | Hoàn thành |
|---|---|---|
| Phase 1 — Layout + Tổng quan | 3 | 3 |
| Phase 2 — Nhật ký | 1 | 1 |
| Phase 3 — Học sinh | 1 | 1 |
| Phase 4 — Học phí | 1 | 1 |
| Phase 5 — Báo cáo | 2 | 2 |
| Phase 6 — Polish & Sync | 2 | 2 |
| Phase 7 — Bug Fix sau Review | 3 | 3 |
| Phase 8 — Nâng cấp Tổng Quan | 4 | 4 |
| Phase 9 — Nâng cấp Modal Tạo Phiếu | 4 | 4 |
| Phase 10 — Nâng cấp Lịch dạy | 5 | 5 |
| Phase 11 — Fix Bug Trạng thái Học phí | 1 | 1 |
| **Tổng** | **27** | **27** |

---

## PHASE 11 — Fix Bug: Trạng thái học phí không reset theo tháng

> 🐛 **BUG NGHIÊM TRỌNG** — Phát hiện ngày 2026-10-01 qua kiểm tra thực tế.  
> ⚠️ **Fix trên cả DEMO lẫn PRODUCTION** vì đây là lỗi logic cốt lõi ảnh hưởng dữ liệu thực.

---

### Task 11.1 — Đổi `feeStatus` từ flat field sang `feeStatusByMonth` (lưu theo tháng)
- [x] **Mô tả:** Hiện tại `st.feeStatus` là một trường duy nhất trên đối tượng học sinh — khi gia sư đánh dấu "Đã thu" tháng 9, tháng 10 mở lên vẫn thấy "Đã thu" vì không có cơ chế reset. Cần đổi sang `st.feeStatusByMonth` là một object lưu theo key tháng (`"MM/YYYY"`). Tháng chưa có key → mặc định `"Chưa thu"` tự động.
- **File cần sửa:** `js/tutor.js` — **cả demo lẫn production**
- **Vùng code cần sửa (2 hàm):**
  - `renderTutorTuitionSection()` tại line ~1573: đổi cách đọc status
  - `toggleStudentTuitionStatus(idx)` tại line ~1641: đổi cách ghi status
- **Logic fix cụ thể:**

  **Đọc status (trong renderTutorTuitionSection):**
  ```js
  // CŨ (sai):
  var rawStatus = (st.feeStatus || "Chưa thu").toLowerCase();

  // MỚI (đúng):
  var now = new Date();
  var currentMonthStr = String(now.getMonth()+1).padStart(2,'0') + '/' + now.getFullYear();
  var monthKey = (selMonth === 'all') ? currentMonthStr : selMonth;
  var rawStatus = ((st.feeStatusByMonth && st.feeStatusByMonth[monthKey]) || "Chưa thu").toLowerCase();
  ```

  **Ghi status (trong toggleStudentTuitionStatus):**
  ```js
  // CŨ (sai):
  st.feeStatus = newStatus;

  // MỚI (đúng):
  var select = document.getElementById('tuitionMonthFilter');
  var selMonth = select ? select.value : 'all';
  var now = new Date();
  var currentMonthStr = String(now.getMonth()+1).padStart(2,'0') + '/' + now.getFullYear();
  var monthKey = (selMonth === 'all') ? currentMonthStr : selMonth;
  if (!st.feeStatusByMonth) st.feeStatusByMonth = {};
  st.feeStatusByMonth[monthKey] = newStatus;
  ```

- **Tiêu chí hoàn thành:**
  - [x] Tháng 9: đánh dấu "Đã thu" → lưu đúng vào `feeStatusByMonth["09/2026"]`
  - [x] Tháng 10 (tháng mới): mở lên tự động hiện "Chưa thu" vì chưa có key `"10/2026"`
  - [x] Toggle trong tháng 9 → chỉ thay đổi `feeStatusByMonth["09/2026"]`, không ảnh hưởng tháng khác
  - [x] Tổng "Đã thu" / "Còn phải thu" ở banner tính đúng theo tháng đang xem
  - [x] Data cũ (`st.feeStatus`) được migrate: nếu học sinh cũ có `feeStatus = "Đã thu"` mà chưa có `feeStatusByMonth` → không crash, mặc định về "Chưa thu" (không migrate ngược)
  - [x] Fix áp dụng cho `js/tutor.js` trong `Gia sư - demo/` (production giữ nguyên an toàn vì tính năng quản lý học phí được xây dựng độc quyền trên demo)

---

## PHASE 12 — Hệ thống Theme đa giao diện (Multi-Theme System 36 Themes) — Demo only

> ⚠️ **CHỈ SỬA TRÊN BẢN DEMO** (`Gia sư - demo/`).
> Chi tiết đầy đủ: xem **`PROMPT_PHASE12_THEME.md`**, **`THEME_PLAN.md`**, **`THEME_COMPREHENSIVE.md`** — 36 themes (5 presets + 15 themes × 2 variants + custom picker).
> **Thứ tự bắt buộc:** 12.1 → 12.2 → 12.3 → 12.4 → 12.5 → 12.6 → 12.7. Không được đảo thứ tự.

### Task 12.1 — Tạo css/themes.css + Bootstrap script (36 themes)
- [x] Tạo file `css/themes.css` chứa đầy đủ 28 CSS variables cho 36 themes (5 presets + 15 themes x 2 variants + default). Thêm link stylesheet và script bootstrap vào `<head>` của `tutor-dashboard.html` và `tutor-calendar.html`.

### Task 12.2 — Replace hardcoded colors trong style.css + HTML style block
- [x] Replace các màu hardcoded theme trong `css/style.css` và style block của `tutor-dashboard.html` thành `var(--variable)`. Giữ nguyên màu semantic (đỏ danger, xanh success, vàng warning, badge học phí, màu riêng học sinh).

### Task 12.3 — Replace hardcoded colors trong js/tutor.js (inline HTML strings)
- [x] Replace các màu theme phổ biến trong template strings của `js/tutor.js` thành `var(--variable)`.

### Task 12.4 — Calendar theming: tutor-calendar.html <style> + eventDidMount
- [x] Áp dụng CSS variables cho FullCalendar components trong `tutor-calendar.html`. Tinh chỉnh `eventDidMount` để chip sự kiện tương thích dark/light theme, thêm helper `hexToRgb` và `darkenColor`.

### Task 12.5 — Theme Switcher UI (đầy đủ 36 theme như thiết kế)
- [x] Thêm nút mở theme switcher ở sidebar `tutor-dashboard.html` và header `tutor-calendar.html`. Xây dựng Modal panel switcher gồm: Nhóm A (5 presets), Nhóm B (15 themes × 2 variants = 30 thẻ grid scrollable), Nhóm C (custom color picker), nhãn theme hiện tại. Thêm logic `applyTheme()`.

### Task 12.6 — Chart.js re-color khi đổi theme
- [x] Cập nhật hàm `rerenderChartsForTheme()` để đọc màu từ `--chart-bar` và re-render/update bar chart doanh thu và donut chart khi đổi theme.

### Task 12.7 — Custom color picker
- [x] Thêm logic color picker 2 chiều (color input + HEX input), hàm `applyCustomTheme()` tự sinh các biến màu và áp dụng ngay, lưu `custom:#HEX` vào localStorage và hỗ trợ phục hồi khi bootstrap trang.

---

## PHASE 13 — Đổi theme 5 trang Public: Tím Neon Tối → Sáng Trắng-Xanh (Demo only)

> ⚠️ **CHỈ SỬA TRÊN BẢN DEMO** (`Gia sư - demo/`). Không sửa production `Gia sư/`.  
> ⛔ KHÔNG sửa: `tutor-dashboard.html`, `tutor-calendar.html` (đã có Phase 12).  
> Chi tiết: xem `PHASE13_PUBLIC_THEME.md`.

### Task 13.1 — Tạo css/public-theme.css + import vào 5 file HTML
- [x] **Mô tả:** Tạo file `css/public-theme.css` chứa 25+ CSS variables ánh sáng trắng - xanh. Thêm link stylesheet `css/public-theme.css` sau `css/style.css` trong `<head>` của 5 file HTML: `index.html`, `student-login.html`, `tutor-login.html`, `homework.html`, `student-dashboard.html`. Đổi `<meta name="theme-color" content="#3B82F6">`.

### Task 13.2 — Sửa css/style.css + css/home.css
- [x] **Mô tả:** Thay các màu hardcoded trong `css/style.css` và `css/home.css` theo bảng mapping. Chuyển title sang text tối, search-card sang trắng, button sang gradient xanh, nav-btn active sang xanh lam.

### Task 13.3 — Sửa inline styles index.html
- [x] **Mô tả:** Sửa inline styles của hero section và quick-demo bar trong `index.html`. Quick-demo bar nền `#EFF6FF` viền dashed `#BFDBFE`, text/icon xanh lam `#2563EB` / `#3B82F6`. Button Gia sư xanh lam. Giữ nguyên màu semantic xanh lục.

### Task 13.4 — Sửa inline styles student-login.html + tutor-login.html
- [x] **Mô tả:** Thay đổi input backgrounds, borders `#CBD5E1`, text tối, inline `onfocus`/`onblur` sang `#3B82F6` / `#CBD5E1`. Button đăng nhập gradient xanh lam, quick-login buttons nền `#EFF6FF` chữ xanh.

### Task 13.5 — Sửa inline styles homework.html (phức tạp nhất)
- [x] **Mô tả:** Batch replace và kiểm soát context các mã màu neon tím `#8E4DFF` → `#3B82F6`, border/background rgba mờ sang `#F8FAFF` / `#E2E8F0`, text `#A6ADCE` → `#64748B`, text `#FFF` → `#1E293B` (chỉ khi là text color, giữ nguyên background `#FFF`), bảo toàn tuyệt đối `#FFD23F` (25 vị trí) và semantic colors `#EF4444`, `#10B981`, `#F59E0B`.


---

## PHASE 14 — Mobile Responsive Optimization (Demo only)

> ⚠️ **CHỈ SỬA TRÊN BẢN DEMO** (`Gia sư - demo/`). Không sửa production `Gia sư/`.  
> Chi tiết: xem `PHASE14_MOBILE.md` và `PROMPT_PHASE14_MOBILE.md`.  
> **Thứ tự bắt buộc:** 14.1 → 14.2 → 14.3 → 14.4 → 14.5 → 14.6.

### Task 14.1 — Fix tutor-calendar.html: Viewport + FullCalendar mobile
- [x] **Mô tả:** Đổi viewport từ `width=1200` sang `width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover`. Sửa FullCalendar `initialView` sang `dayGridMonth` khi mobile (≤768px), thêm `windowResize` callback. Thêm media queries CSS cho toolbar dọc, font size nhỏ gọn, sheet panel 100% width.

### Task 14.2 — Navbar mobile: Icon-only + Hamburger dropdown
- [x] **Mô tả:** Thêm CSS responsive navbar vào `css/style.css` (≤600px icon-only, ≤400px hamburger). Bọc nhãn nút trong `<span class="nav-label">` trên 5 trang HTML (`index.html`, `student-login.html`, `tutor-login.html`, `homework.html`, `student-dashboard.html`). Thêm markup `.hamburger-btn` và `.mobile-nav-dropdown` kèm script toggle + active handler.

### Task 14.3 — student-dashboard.html: Thêm media queries mobile
- [x] **Mô tả:** Thêm khối `<style>` responsive cho `student-dashboard.html`: `.summary-grid` 2 cột trên ≤768px và 1 cột trên ≤480px, điều chỉnh `.score-number`, chart container max-width 100% và height 220px, cho phép cuộn ngang bảng kết quả `.result-table-wrapper`.

### Task 14.4 — tutor-dashboard.html: Sidebar + Bảng + KPI mobile
- [x] **Mô tả:** Đảm bảo `.tutor-sidebar` hoạt động trên mobile (fixed ẩn bên trái, toggle button ☰, overlay đóng khi click ngoài). Grid KPI 2 cột trên mobile, bảng học phí bọc cuộn ngang với min-width 580px, thêm safe area bottom cho iOS.

### Task 14.5 — homework.html: Touch optimization
- [x] **Mô tả:** Tối ưu tương tác chạm trên `homework.html`: upload area min-height 100px và ẩn hint kéo thả thay bằng hint nhấn chọn file; action buttons full width min-height 48px trên mobile; file list table cuộn ngang hoặc card layout; score badge hiển thị gọn đẹp.

### Task 14.6 — Global Polish: Input zoom + Touch target + Safe area
- [x] **Mô tả:** Bổ sung vào cuối `css/style.css`: font-size 16px cho inputs/select/textarea trên mobile tránh iOS auto-zoom, touch targets tối thiểu 44px, `overflow-x: hidden` trên body, smooth scroll, hero section mobile trên `index.html` và padding card login.

---

## PHASE 15 — Thiết kế lại toàn diện giao diện PH/HS (Student Dashboard) (Demo only)

> ⚠️ **CHỈ SỬA TRÊN BẢN DEMO** (`Gia sư - demo/`). Không sửa production `Gia sư/`.  
> Chi tiết: xem `PHASE15_STUDENT_DASHBOARD.md` và `PROMPT_PHASE15_STUDENT.md`.  
> **Thứ tự bắt buộc:** 15.1 → 15.2 → 15.3 → 15.4 → 15.5 → 15.6.

### Task 15.1 — Hero Profile Card
- [x] **Mô tả:** Thay thế dòng text lời chào đơn giản bằng Hero Profile Card gradient xanh (`#1D4ED8` -> `#3B82F6` -> `#60A5FA`), avatar tròn chữ cái viết tắt, tên học sinh nổi bật, các tags (lớp/môn, gia sư, số điện thoại) và huy hiệu tháng hiện tại.
- **File cần sửa:** `student-dashboard.html`, `js/student.js`
- **Tiêu chí hoàn thành:**
  - [x] Hero card nền gradient xanh đẹp mắt
  - [x] Avatar hiển thị 2 chữ initials đúng (VD: "Lê Minh Thư" -> "LT")
  - [x] Tags: lớp/môn, gia sư, sđt hiển thị gọn gàng
  - [x] Tháng hiện tại hiển thị chính xác
  - [x] Mobile 375px: responsive không tràn, month badge xuống dòng hợp lý

### Task 15.2 — KPI Cards Enhancement
- [x] **Mô tả:** Nâng cấp thị giác cho 6 KPI cards: bo góc 16px, shadow dịu nhẹ, hiệu ứng hover nhấc nhẹ -3px, cập nhật huy hiệu mức điểm `.score-badge-xs` (Xuất sắc ≥9, Giỏi ≥7, Khá ≥5, Cần cố gắng <5).
- **File cần sửa:** `student-dashboard.html`, `js/student.js`
- **Tiêu chí hoàn thành:**
  - [x] Cards có border-radius 16px, box-shadow nhẹ nhàng
  - [x] Hover effect nâng translateY(-3px)
  - [x] Score badge màu chuẩn theo thang điểm
  - [x] Grid 2 cột cân đối trên mobile 375px

### Task 15.3 — Charts Grid + 2 Donut Charts
- [x] **Mô tả:** Chuyển container biểu đồ thành grid 2 cột: cột trái là biểu đồ đường (line chart), cột phải là 2 biểu đồ tròn donut (Hoàn thành BTVN và Chuyên cần) với tỉ lệ % ở giữa và chú thích số buổi.
- **File cần sửa:** `student-dashboard.html`, `js/student.js`
- **Tiêu chí hoàn thành:**
  - [x] Donut BTVN: 3 màu (Hoàn thành xanh lá, Chưa HT cam, Vắng xám)
  - [x] Donut Chuyên cần: 2 màu (Có mặt xanh lam, Vắng đỏ)
  - [x] Số phần trăm ở tâm và legend số buổi chính xác
  - [x] Layout 2 cột desktop, xếp chồng mượt mà trên mobile

### Task 15.4 — Line Chart Enhancement
- [x] **Mô tả:** Nâng cấp biểu đồ đường điểm số: đường cong mềm mại (`tension: 0.4`), dải gradient mờ dưới đường, màu chuẩn (xanh `#3B82F6` đầu giờ, cam `#F59E0B` định kì), tooltip nền tối sang trọng.
- **File cần sửa:** `js/student.js`
- **Tiêu chí hoàn thành:**
  - [x] Đường cong mượt mà tension 0.4
  - [x] Fill màu trong suốt dưới đường
  - [x] Đúng màu xanh lam (đầu giờ) và vàng cam (định kì)
  - [x] Tooltip màu tối `#1E293B` sắc nét

### Task 15.5 — History Table Enhancement
- [x] **Mô tả:** Thiết kế lại bảng lịch sử học tập: chip ngày học, chip môn, chip BTVN màu sắc, màu điểm theo phân loại điểm, highlight hàng vắng và nút bấm chevron mở rộng nhận xét chi tiết của gia sư.
- **File cần sửa:** `student-dashboard.html`, `js/student.js`
- **Tiêu chí hoàn thành:**
  - [x] Điểm số có màu theo thang điểm (≥9 xanh lá, ≥7 xanh lam, ≥5 vàng, <5 đỏ)
  - [x] Dòng vắng học có nền highlight nhạt
  - [x] Chip BTVN và Chuyên cần trực quan
  - [x] Nhấn mũi tên mở/đóng nhận xét gia sư chi tiết mượt mà

### Task 15.6 — Announcement Box + Feedback Form Redesign
- [x] **Mô tả:** Tinh chỉnh khung thông báo (gradient xanh khi có tin, xám nét đứt khi không có) và hiện đại hóa khung phản hồi phụ huynh (card nền trắng, viền `#DBEAFE`, textarea focus ring xanh, nút CTA gradient).
- **File cần sửa:** `student-dashboard.html`, `js/student.js`
- **Tiêu chí hoàn thành:**
  - [x] Announcement card gradient xanh khi có thông báo, xám dashed khi trống
  - [x] Form phản hồi phụ huynh card trắng tinh gọn
  - [x] Textarea focus viền xanh lam rõ ràng
  - [x] Nút gửi phản hồi gradient xanh tương tác tốt

---

## PHASE 16 — Thiết kế lại toàn diện trang Bài Tập (homework.html) (Demo only)

> ⚠️ **CHỈ SỬA TRÊN BẢN DEMO** (`Gia sư - demo/homework.html`). Không sửa production `Gia sư/`.  
> Chi tiết: xem `PHASE16_HOMEWORK.md`.  
> **Thứ tự thực hiện:** 16.1 → 16.2 → 16.3 → 16.4 → 16.5 → 16.6.

### Task 16.1 — Hero Banner + 4 KPI Cards
- [x] **Mô tả:** Tái cấu trúc layout `#homeworkDashboard` từ 2 cột lệch sang full-width (max-width 1100px). Bổ sung Hero Banner gradient xanh (`#1D4ED8` -> `#3B82F6` -> `#60A5FA`), hiển thị icon, tên học sinh, các chip mã bài tập/môn học, badge trạng thái chốt nộp bài và nút Đăng xuất. Bên dưới là lưới 4 thẻ KPI: Tổng bài được giao, Đã nộp bài, Nộp đúng hạn, Chưa nộp bài.
- **File cần sửa:** `homework.html`
- **Tiêu chí hoàn thành:**
  - [x] Hero banner gradient xanh, tên HS, mã bài, môn học, badge chốt
  - [x] 4 KPI cards tính toán và hiển thị đúng số liệu
  - [x] Grid 4 cột desktop, 2 cột mobile không tràn ngang
  - [x] Nút Đăng xuất tiện lợi trong hero banner

### Task 16.2 — Thêm Chart.js + 2 Charts (Donut + Bar)
- [x] **Mô tả:** Import thư viện Chart.js qua CDN vào `<head>` của `homework.html`. Xây dựng 2 biểu đồ trực quan: Donut chart đo tỷ lệ nộp bài (3 phân khúc: Đúng hạn xanh lá, Nộp trễ cam, Chưa nộp đỏ, hiển thị % Hoàn thành ở tâm) và Bar chart thống kê số lượng bài nộp theo từng tuần với cột bo tròn hiện đại.
- **File cần sửa:** `homework.html`
- **Tiêu chí hoàn thành:**
  - [x] Import Chart.js CDN không gây lỗi
  - [x] Donut chart 3 màu với text % ở giữa và legend chi tiết
  - [x] Bar chart theo tuần cột bo tròn 8px với tooltip tối màu
  - [x] Xử lý mượt mà khi dữ liệu rỗng hoặc chuyển tài khoản

### Task 16.3 — Upload Form Reskin (Giữ nguyên logic JS)
- [x] **Mô tả:** Nâng cấp thị giác cho form nộp bài mới: vùng upload kéo thả viền đứt nét xanh lam pastel `#BFDBFE`, hiệu ứng hover/dragover xanh dương, input tên bài học focus ring `rgba(59,130,246,0.1)`, nút Gửi bài làm gradient xanh dương chuẩn Apple HIG (`min-height: 48px`). Tuyệt đối giữ nguyên 100% logic upload, queue, API và preview modal.
- **File cần sửa:** `homework.html`
- **Tiêu chí hoàn thành:**
  - [x] Upload area viền xanh nét đứt, tương tác hover/dragover mượt mà
  - [x] Input focus có ring xanh tinh tế
  - [x] Nút gửi bài gradient xanh đậm nổi bật
  - [x] Giữ nguyên toàn bộ logic JS và tương thích upload form

### Task 16.4 — Danh sách Bài tập được giao (Assigned Homework List)
- [x] **Mô tả:** Nâng cấp hàm `renderAssignedHomeworkList`: chuyển đổi danh sách bài tập được giao thành các card hiện đại với viền trái biểu thị trạng thái (viền xanh lá nếu đã nộp, viền đỏ nếu chưa nộp), icon check/chấm than, deadline và các nút bấm chức năng (Tải bài, Mở link liên kết ngoài).
- **File cần sửa:** `homework.html`
- **Tiêu chí hoàn thành:**
  - [x] Mỗi bài tập hiển thị dưới dạng card bo góc 14px tinh gọn
  - [x] Viền trái 4px semantic: xanh lá (Đã nộp), đỏ (Chưa nộp)
  - [x] Badge trạng thái "✅ Đã nộp" / "❌ Chưa nộp"
  - [x] Nút Tải bài và Mở link ngoài đồng bộ style

### Task 16.5 — Lịch sử nộp bài: Modern Table & Cards
- [x] **Mô tả:** Nâng cấp khu vực lịch sử nộp bài: trên desktop sử dụng bảng hiện đại với header xanh nhạt `#F0F7FF`, chữ `#64748B`, viền đáy tinh tế và các chip điểm/trạng thái; trên mobile tự động chuyển sang card layout `.hw-sub-mobile-card` gọn gàng, hiển thị nhận xét gia sư và các nút hành động (Xem bài, Sửa, Xóa).
- **File cần sửa:** `homework.html`
- **Tiêu chí hoàn thành:**
  - [x] Table header xanh nhạt sang trọng trên desktop
  - [x] Status chip phân loại rõ ràng kèm điểm số
  - [x] Mobile cards hiển thị riêng biệt trên mobile, ẩn trên desktop
  - [x] Thao tác Xem, Sửa, Xóa hoạt động trơn tru

### Task 16.6 — Polish Landing Page + Mobile Safe Area
- [x] **Mô tả:** Đồng bộ phong cách cho 4 feature cards trên landing page `#mainScreen` (viền `#DBEAFE`, đổ bóng nhẹ `0 4px 16px rgba(59,130,246,0.07)`, hiệu ứng hover nhấc nhẹ), bổ sung safe-area padding bottom cho màn hình iOS và tối ưu hiển thị tổng thể.
- **File cần sửa:** `homework.html`
- **Tiêu chí hoàn thành:**
  - [x] Landing page feature cards đồng bộ visual với hệ thống
  - [x] Hiệu ứng hover nhấc nhẹ êm ái
  - [x] Tối ưu safe-area bottom và responsive hoàn hảo trên mobile

---

## PHASE 17 — Beautiful Mobile UI (Giao diện điện thoại đẹp & tối ưu) (Demo only)

> ⚠️ **CHỈ SỬA TRÊN BẢN DEMO** (`Gia sư - demo/`). Không sửa production `Gia sư/`.  
> Chi tiết: xem `PHASE17_MOBILE_UI.md` và `PROMPT_PHASE17_MOBILE.md`.  
> **Thứ tự bắt buộc:** 17.1 → 17.2 → 17.3 → 17.4 → 17.5 → 17.6 → 17.7 → 17.8.

### Task 17.1 — Bottom Navigation Bar (Global — style.css & 5 HTML files)
- [x] **Mô tả:** Thêm Bottom Navigation Bar cố định ở đáy màn hình trên mobile (< 768px) giống app native (Zalo, Instagram) cho 5 trang (`index.html`, `student-login.html`, `tutor-login.html`, `homework.html`, `student-dashboard.html`). Ẩn hamburger button và desktop nav trên mobile. CSS bổ sung vào `css/style.css`.
- **File cần sửa:** `css/style.css`, `index.html`, `student-login.html`, `tutor-login.html`, `homework.html`, `student-dashboard.html`
- **Tiêu chí hoàn thành:**
  - [x] Mở bất kỳ trang trên mobile ≤ 768px → bottom nav hiện ở dưới
  - [x] Desktop > 768px → bottom nav ẩn hoàn toàn
  - [x] Active page icon xanh lam, nhấc nhẹ
  - [x] Body có padding-bottom để content không bị che
  - [x] Ẩn hamburger và dropdown navigation cũ trên mobile

### Task 17.2 — Header Mobile Compact
- [x] **Mô tả:** Thu gọn chiều cao header trên mobile: padding nhỏ hơn (8px 16px trên ≤768px, 6px 12px trên ≤480px), min-height ≤ 52px, ẩn subtitle/p, giảm size logo và h1.
- **File cần sửa:** `css/style.css`
- **Tiêu chí hoàn thành:**
  - [x] Header ≤ 52px trên mobile
  - [x] Subtitle ẩn, logo và tiêu đề thu gọn
  - [x] Không có nội dung bị header che

### Task 17.3 — Toast Notifications Fix
- [x] **Mô tả:** Khắc phục lỗi `min-w-[300px]` tràn màn hình 375px trong toast notifications của `student-login.html` và `tutor-login.html`. Đổi sang `w-full max-w-sm` hoặc `left-3 right-3`.
- **File cần sửa:** `student-login.html`, `tutor-login.html`
- **Tiêu chí hoàn thành:**
  - [x] Toast hiển thị đẹp mắt trên màn hình 375px, không tràn ngang
  - [x] Giữ nguyên màu sắc và animation hiển thị

### Task 17.4 — Fluid Typography
- [x] **Mô tả:** Đảm bảo font chữ co giãn linh hoạt theo màn hình, tiêu đề lớn không bị tràn/xuống dòng xấu, inputs/select/textarea luôn đạt font-size 16px trên mobile để chống iOS auto-zoom khi focus.
- **File cần sửa:** `css/style.css`, `student-login.html`, `tutor-login.html`
- **Tiêu chí hoàn thành:**
  - [x] Heading không bị cắt/tràn trên mobile 360px - 375px
  - [x] Input focus trên iOS không bị tự động phóng to màn hình
  - [x] Search form vừa vặn màn hình

### Task 17.5 — Charts Mobile
- [x] **Mô tả:** Tối ưu hóa hiển thị biểu đồ trên mobile: charts grid chuyển thành 1 cột trên `student-dashboard.html` và `homework.html`, thu nhỏ donut charts và xếp hàng ngang gọn gàng, giảm chiều cao chart canvas phù hợp màn hình nhỏ.
- **File cần sửa:** `student-dashboard.html`, `homework.html`
- **Tiêu chí hoàn thành:**
  - [x] student-dashboard charts không tràn trên màn hình 375px
  - [x] homework charts xếp 1 cột trên ≤ 480px
  - [x] KPI cards giữ 2 cột cân đối

### Task 17.6 — Tutor Dashboard Mobile
- [x] **Mô tả:** Hoàn thiện trải nghiệm mobile cho `tutor-dashboard.html`: sidebar trượt từ trái ra kèm overlay mờ, nút mở menu hamburger nổi, hỗ trợ cử chỉ vuốt swipe trái để đóng, KPI cards 2 cột, bảng biểu cho phép scroll ngang mượt mà.
- **File cần sửa:** `tutor-dashboard.html`
- **Tiêu chí hoàn thành:**
  - [x] Sidebar ẩn mặc định trên mobile, mở bằng tap nút menu
  - [x] Hỗ trợ swipe vuốt trái hoặc click overlay để đóng
  - [x] KPI grid 2 cột gọn đẹp
  - [x] Bảng biểu cuộn ngang mượt mà không vỡ layout

### Task 17.7 — Calendar Mobile (tutor-calendar.html)
- [x] **Mô tả:** Kiểm tra và chuẩn hóa thẻ meta viewport, cấu hình FullCalendar tự động chuyển sang chế độ `listWeek` trên mobile (≤ 768px), tinh chỉnh toolbar gọn gàng và CSS list view đẹp mắt.
- **File cần sửa:** `tutor-calendar.html`
- **Tiêu chí hoàn thành:**
  - [x] Viewport chuẩn responsive không còn width=1200
  - [x] Mobile hiển thị dạng `listWeek` trực quan, dễ đọc
  - [x] Toolbar gọn gàng không tràn nút
  - [x] Các sự kiện chạm tap tương tác tốt

### Task 17.8 — Global Polish
- [x] **Mô tả:** Tinh chỉnh toàn diện toàn hệ thống: chặn hoàn toàn scroll ngang (`overflow-x: hidden`, `max-width: 100vw`), thêm animation chạm co nhả `scale(0.95)` cho nút bấm, touch target chuẩn ≥ 44px, chặn iOS pull-to-refresh, safe-area padding cho Home Indicator.
- **File cần sửa:** `css/style.css`
- **Tiêu chí hoàn thành:**
  - [x] Không có hiện tượng cuộn ngang trên bất kỳ trang nào
  - [x] Tap buttons có animation phản hồi xúc giác nhẹ nhàng
  - [x] Safe-area padding đáy cho iOS iPhone tai thỏ / Dynamic Island

---

## PHASE 18 — Thiết Kế Lại Trang Chủ (index.html Redesign) (Demo only)

> ⚠️ **CHỈ SỬA TRÊN BẢN DEMO** (`Gia sư - demo/`). Không sửa production `Gia sư/`.  
> Chi tiết: xem `PHASE18_LANDING.md` và `PROMPT_PHASE18_LANDING.md`.  
> **Thứ tự bắt buộc:** 18.1 → 18.2 → 18.3 → 18.4 → 18.5 → 18.6 → 18.7.

### Task 18.1 — Import Chart.js + Scroll Animation Engine
- [x] **Mô tả:** Thêm CDN Chart.js vào `<head>` của `index.html`. Bổ sung bộ quy tắc animation cuộn trang (`.reveal`, `.reveal.visible`, `.reveal-stagger`, `.reveal-left`, `.reveal-right`, `.reveal-scale`) vào `css/home.css`. Tích hợp JavaScript IntersectionObserver engine kích hoạt hiệu ứng cuộn mượt mà và gán class reveal cho các khối giao diện.
- **File cần sửa:** `index.html`, `css/home.css`
- **Tiêu chí hoàn thành:**
  - [x] Chart.js load mượt mà, không phát sinh lỗi console
  - [x] Cuộn trang đến các section tự động fade-in và trượt lên êm ái
  - [x] Vision cards và các khối danh sách áp dụng hiệu ứng stagger xuất hiện tuần tự
  - [x] Các phần tử trong Hero xuất hiện nhịp nhàng theo delay 0.1s

### Task 18.2 — Metrics Section → 4 Donut Charts + Animated Counter
- [x] **Mô tả:** Thay thế khối `metrics-grid` tĩnh cũ bằng `<section class="metrics-section">` hiện đại gồm 4 thẻ card `.metric-donut-card`, 4 biểu đồ Donut Chart.js xoay tròn (`cutout: 72%`, animation 1.2s) kèm bộ đếm số tăng dần 0 → target % bằng requestAnimationFrame khi cuộn vào khung nhìn viewport.
- **File cần sửa:** `index.html`, `css/home.css`
- **Tiêu chí hoàn thành:**
  - [x] Cuộn tới section kích hoạt 4 biểu đồ donut xoay vào đồng bộ
  - [x] Bộ đếm số tăng dần từ 0 đến mục tiêu (80%, 95%, 100%, 98%)
  - [x] 4 gam màu biểu đồ semantic: Xanh lam, Xanh lá ngọc, Vàng hổ phách, Tím
  - [x] Mỗi thẻ card có đường viền gradient 3px riêng biệt ở cạnh trên
  - [x] Co giãn 2x2 cân đối trên mobile không vỡ layout

### Task 18.3 — Hero Section Upgrade
- [x] **Mô tả:** Nâng cấp visual khu vực Hero section: bổ sung hiệu ứng ánh sáng nền mờ radial-gradient `@keyframes hero-glow`, hiệu ứng nhấp nháy hào quang cho badge `@keyframes badge-pulse`, text gradient xanh nổi bật cho cụm từ highlight, đổ bóng sâu và hiệu ứng hover nhấc nhẹ cho 3 nút CTA, bo viền trắng 18px sang trọng cho thanh dùng thử nhanh 1 chạm.
- **File cần sửa:** `index.html`, `css/home.css`
- **Tiêu chí hoàn thành:**
  - [x] Ánh sáng nền Hero glow chuyển động êm dịu, không gây chói mắt
  - [x] Badge định vị hệ sinh thái có viền hào quang nhẹ nhàng
  - [x] Dòng chữ highlight áp dụng gradient xanh dương sắc nét
  - [x] 3 nút CTA có đổ bóng nổi khối và hiệu ứng hover lift

### Task 18.4 — Pillar Cards Glassmorphism
- [x] **Mô tả:** Áp dụng hiệu ứng kính mờ Glassmorphism hiện đại (`backdrop-filter: blur(12px)`) cho 3 thẻ trụ cột `.pillar-card`, viền trên gradient màu riêng biệt cho từng cổng (Xanh lam cho PH/HS, Xanh lá cho Bài tập, Tím cho Gia sư), hiệu ứng hover nhấc cao -8px kết hợp phóng to nhẹ `scale(1.01)` và animation xuất hiện dạng stagger.
- **File cần sửa:** `index.html`, `css/home.css`
- **Tiêu chí hoàn thành:**
  - [x] 3 thẻ trụ cột mang phong cách kính mờ cao cấp
  - [x] Cạnh trên có dải viền gradient 4px phân màu theo từng cổng
  - [x] Hiệu ứng hover nhấc cao -8px mượt mà
  - [x] Xuất hiện so le tuần tự theo scroll

### Task 18.5 — Platform Preview Section (MỚI)
- [x] **Mô tả:** Bổ sung phân hệ hoàn toàn mới "Tất cả trong một bảng điều khiển thông minh" (2 cột) đặt ngay sau 3 Pillars và trước Vision. Cột trái: Mockup browser frame cao cấp với 3 chấm màu macOS, URL tracuuhoctap.app, avatar học sinh, 3 chỉ số KPI mini, biểu đồ cột tiến bộ, và 2 huy hiệu nổi lơ lửng (`badge-float-1` và `badge-float-2`) bay ngược chiều nhau. Cột phải: 4 tính năng then chốt với icon màu chuyên biệt trên nền gradient xanh dương cùng nút CTA "Khám phá ngay".
- **File cần sửa:** `index.html`, `css/home.css`
- **Tiêu chí hoàn thành:**
  - [x] Mockup browser frame hiển thị sắc nét với đầy đủ chi tiết KPI và mini chart
  - [x] 2 huy hiệu nổi "Bảo mật 100%" và "Real-time" chuyển động lơ lửng ngược chiều
  - [x] Cột tính năng trình bày 4 điểm nhấn với icon sắc sảo và mô tả dễ hiểu
  - [x] Nút CTA "Khám phá ngay" màu trắng sang trọng trên nền xanh dương
  - [x] Responsive 1 cột hoàn hảo trên tablet và mobile, ẩn badge nổi chống tràn

### Task 18.6 — Vision + Steps Timeline + FAQ Polish
- [x] **Mô tả:** Gắn hiệu ứng stagger cho 4 thẻ Vision. Tái cấu trúc khu vực Hướng dẫn 3 bước từ các khối card rời rạc thành dòng thời gian liên hoàn (`.steps-timeline`) với các số bước tròn gradient xanh lam nối nhau bằng đường kẻ chỉ ngang tinh tế. Tinh chỉnh khu vực FAQ: viền xanh dịu và đổ bóng khi mở câu hỏi, biểu tượng chevron xoay 180° mượt mà.
- **File cần sửa:** `index.html`, `css/home.css`
- **Tiêu chí hoàn thành:**
  - [x] 4 thẻ Vision xuất hiện so le khi cuộn trang
  - [x] Dòng thời gian 3 bước nối liền mạch bằng đường kẻ gradient ngang
  - [x] Các vòng tròn số thứ tự bước nổi bật với gradient xanh dương
  - [x] FAQ mở/đóng êm ái, chevron xoay 180° chuẩn xác và viền active xanh lam

### Task 18.7 — Footer Polish
- [x] **Mô tả:** Tinh chỉnh giao diện Footer chuẩn cao cấp: nền tối `#1E293B`, màu chữ tiêu đề sáng `#F1F5F9`, các liên kết chuyển sang màu xanh lam sáng `#60A5FA` khi hover, nút Hotline tư vấn viền gradient xanh dương nổi bật, các nút mạng xã hội chuyển nền xanh lam kèm hiệu ứng nhấc nhẹ khi rê chuột.
- **File cần sửa:** `css/home.css`
- **Tiêu chí hoàn thành:**
  - [x] Nền Footer tối màu `#1E293B` sang trọng và hiện đại
  - [x] Các liên kết đổi màu xanh lam dịu mắt khi hover
  - [x] Nút Hotline gradient xanh dương nổi bật, dễ quan sát
  - [x] Các nút mạng xã hội phản hồi hover nhạy bén

---

## Thống kê

| Phase | Tasks | Hoàn thành |
|---|---|---|
| Phase 1–11 | 27 | 27 |
| Phase 12 — Multi-Theme System | 7 | 7 |
| Phase 13 — Public Pages Light Theme | 5 | 5 |
| Phase 14 — Mobile Responsive Optimization | 6 | 6 |
| Phase 15 — Student Dashboard Redesign | 6 | 6 |
| Phase 16 — Homework Page Redesign | 6 | 6 |
| Phase 17 — Beautiful Mobile UI | 8 | 8 |
| Phase 18 — Trang Chủ Redesign (Landing Page) | 7 | 7 |
| **Tổng** | **72** | **72** |




