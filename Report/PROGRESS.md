# PROGRESS — Web Gia Sư Demo

**Cập nhật lần cuối:** 2026-10-01  
**Giai đoạn:** Phase 9 (Nâng cấp Modal "Tạo Phiếu Học Phí" Demo) — 21/21 tasks hoàn thành (100%) 🎉

---

## Tổng tiến độ

```
[██████████] 100% (21/21 tasks)
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

---

## Task vừa hoàn thành

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
  - Hỗ trợ hiển thị 2 mẫu phiếu song song:
    - **Mẫu 1 (Chi tiết đầy đủ):** Header, chuyên cần, BTVN, số buổi/giờ, bảng danh sách ngày học trong kỳ, bảng kê học phí, lời nhắn phụ huynh, mã VietQR.
    - **Mẫu 2 (Gọn nhẹ):** Tiêu đề, tên học sinh, lớp môn, tổng tiền lớn nổi bật, mã QR VietQR và box thông tin chuyển khoản ngân hàng.
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



