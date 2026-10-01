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
| **Tổng** | **26** | **26** |




