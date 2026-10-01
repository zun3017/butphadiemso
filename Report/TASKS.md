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
- [ ] Kiểm tra toàn bộ 6 sections trên mobile (375px) và desktop (1280px)
- [ ] Fix các layout bug nếu có

### Task 6.2 — Sync sang production
- [ ] Copy các thay đổi đã verify từ `Gia sư - demo/` sang `Gia sư/`
- [ ] Kiểm tra lại với Supabase API thật (không phải mock)

---

## Thống kê

| Phase | Tasks | Hoàn thành |
|---|---|---|
| Phase 1 — Layout + Tổng quan | 3 | 3 |
| Phase 2 — Nhật ký | 1 | 1 |
| Phase 3 — Học sinh | 1 | 0 |
| Phase 4 — Học phí | 1 | 0 |
| Phase 5 — Báo cáo | 2 | 0 |
| Phase 6 — Polish | 2 | 0 |
| **Tổng** | **10** | **4** |
