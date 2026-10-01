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



