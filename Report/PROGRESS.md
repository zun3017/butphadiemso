# PROGRESS — Web Gia Sư Demo

**Cập nhật lần cuối:** 2026-10-01  
**Giai đoạn:** Phase 4 Hoàn thành (1/1) — Chuyển sang Phase 5 (Báo cáo)

---

## Tổng tiến độ

```
[██████░░░░] 60% (6/10 tasks)
```

| Phase | Mô tả | Tiến độ |
|---|---|---|
| Phase 1 | Sidebar Layout + Tổng quan | 3/3 (Xong) |
| Phase 2 | Nhật ký buổi học | 1/1 (Xong) |
| Phase 3 | Học sinh | 1/1 (Xong) |
| Phase 4 | Học phí | 1/1 (Xong) |
| Phase 5 | Báo cáo (Xuất ảnh) | 0/2 |
| Phase 6 | Polish & Sync | 0/2 |

---

## Task vừa hoàn thành

- ✅ **Task 1.1:** Thêm Sidebar Layout vào `tutor-dashboard.html` (2 cột fixed 240px trên Desktop, bottom navigation trên Mobile, 6 mục điều hướng, active state `#8E4DFF`)
- ✅ **Task 1.2:** Tổng quan: 4 KPI Cards (Học sinh đang dạy, Buổi dạy tháng này, Tổng giờ tích lũy, Học phí tháng này; responsive 4 cột desktop / 2 cột mobile; tính động từ mock data)
- ✅ **Task 1.3:** Tổng quan: Lịch dạy sắp tới (Hôm nay & Ngày mai; format Thứ X DD/MM; tag màu học sinh nhất quán; empty state thân thiện)
- ✅ **Task 2.1:** Section Nhật ký buổi học (Dropdown chọn học sinh hoặc Tất cả, lọc theo tháng linh hoạt, bảng desktop + card mobile, truncate nhận xét dài kèm Xem thêm/Thu gọn, sửa nhận xét inline lưu trực tiếp vào store)
- ✅ **Task 3.1:** Section Học sinh (Grid thẻ học sinh 3 cột desktop / 1 cột mobile, avatar chữ cái màu đồng bộ, lịch cố định, quick info số buổi/BTVN/học phí, click thẻ highlight + mở chi tiết bên dưới, shortcut Xem nhật ký, nút Thêm học sinh & Thùng rác trên toolbar)
- ✅ **Task 4.1:** Section Học phí (Banner tổng thu nhập 3 thẻ: Tổng thu dự kiến / Đã thu / Còn phải thu, bảng từng học sinh kèm đơn giá và tổng tiền, toggle Đã thu / Chưa thu reactive lưu store, modal xem trước hóa đơn phiếu học tập kèm QR VietQR & xuất PNG)

## Task tiếp theo

→ **Task 5.1:** Section Báo cáo: Filter & Preview (Bộ lọc từ ngày, đến ngày, học sinh; xem trước danh sách buổi học dạng card đẹp mắt)

## Blockers

Không có blocker nào.

---

## Tính năng đã hoàn thành

- ✅ **Sidebar Navigation:** 6 mục chính (Tổng quan, Báo cáo, Nhật ký buổi học, Lịch dạy, Học sinh, Học phí)
- ✅ **Responsive Navigation:** Fixed sidebar bên trái trên desktop, bottom navigation bar trên mobile
- ✅ **4 KPI Cards:** Thống kê trực quan số học sinh, buổi dạy, giờ tích lũy, học phí
- ✅ **Lịch dạy sắp tới (Hôm nay & Ngày mai):** Phân nhóm ngày rõ ràng, hiển thị giờ, môn học, tag màu riêng biệt
- ✅ **Nhật ký buổi học:** Tra cứu lịch sử toàn diện, lọc theo học sinh & tháng, xem và sửa nhận xét inline
- ✅ Hiển thị Thứ kèm ngày dạy (`Thứ X, DD/MM`) *(đợt trước)*
- ✅ Đại tu logic đánh giá BTVN *(đợt trước)*
- ✅ Fix lỗi không đăng được bài tập của Gia sư *(đợt trước)*

## Tính năng chờ triển khai

- ⏳ Section Học sinh (Task 3.1)
- ⏳ Section Học phí (Task 4.1)
- ⏳ Báo cáo xuất ảnh PNG (Task 5.1 & 5.2)
- ⏳ Polish & Sync sang production (Task 6.1 & 6.2)
