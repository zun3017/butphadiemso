/**
 * CONFIGURATION FILE - BỨT PHÁ ĐIỂM SỐ (LỚP HỌC THẦY GIÁO)
 * Thầy giáo có thể dễ dàng chỉnh sửa thông tin bên dưới để kết nối Google Sheet & Google Drive mới.
 */
const APP_CONFIG = {
    // Thông tin thương hiệu cá nhân của Thầy Giáo
    TEACHER_NAME: "Thầy Nguyễn Hữu Phúc",
    BRAND_NAME: "Lớp Học Bứt Phá Điểm Số",
    SUBJECT: "Chuyên Toán THCS & THPT",
    PHONE: "0985.692.879",
    ZALO_URL: "https://zalo.me/0985692879",
    ADDRESS: "Biên Hòa, Đồng Nai (Có lớp Online & Offline)",
    SLOGAN: "Đồng hành bứt phá điểm số - Tối ưu lộ trình học tập",

    // URL Web App Google Apps Script mới (Thay thế URL này khi triển khai Google Sheet mới)
    // Nếu để trống hoặc dùng demo, hệ thống sẽ tự động bật chế độ Dữ Liệu Mẫu (Demo Mode)
    SCRIPT_URL: "https://script.google.com/macros/s/AKfycbxQyi3jPVuPxP9rujFEBdh1MFX4-BC59jqTFk3-mgZgdMTHD3mL4demkhurcbKJZ7PA/exec",

    // Link Folder Google Drive của Thầy Giáo
    HOMEWORK_DRIVE_FOLDER: "https://drive.google.com/drive/folders/1ABC_DEMO_NOP_BAI_TAP",
    ASSIGNMENT_DRIVE_FOLDER: "https://drive.google.com/drive/folders/1XYZ_DEMO_GIAO_BAI_TAP",

    // Thông tin chuyển khoản học phí (Hiển thị ở trang Phụ huynh)
    BANK_INFO: {
        BANK_NAME: "MB Bank (Ngân hàng Quân Đội)",
        ACCOUNT_NUMBER: "0985692879",
        ACCOUNT_HOLDER: "NGUYEN HUU PHUC"
    }
};
