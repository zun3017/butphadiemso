/**
 * CONFIGURATION FILE - BỨT PHÁ ĐIỂM SỐ (LỚP HỌC ĐA MÔN & ĐA LỚP)
 * Tinh chỉnh thông tin trung tâm lớp học và các môn học giảng dạy.
 */
const APP_CONFIG = {
    // Thông tin thương hiệu cá nhân của Thầy Giáo / Trung Tâm Lớp Học
    TEACHER_NAME: "Thầy Nguyễn Hữu Phúc & Đội Ngũ Bứt Phá Điểm Số",
    BRAND_NAME: "Lớp Học Bứt Phá Điểm Số",
    SLOGAN: "Đồng hành bứt phá điểm số - Tối ưu lộ trình theo từng Môn học",
    PHONE: "0985.692.879",
    ZALO_URL: "https://zalo.me/0985692879",
    ADDRESS: "Biên Hòa, Đồng Nai (Có lớp Online & Offline)",

    // Danh sách các Môn Học hệ thống đang giảng dạy
    SUBJECTS: [
        { id: "Môn Toán", name: "Môn Toán Học", icon: "fa-calculator", color: "#4F46E5" },
        { id: "Vật Lý", name: "Môn Vật Lý", icon: "fa-atom", color: "#0EA5E9" },
        { id: "Hóa Học", name: "Môn Hóa Học", icon: "fa-flask", color: "#10B981" },
        { id: "Tiếng Anh", name: "Môn Tiếng Anh", icon: "fa-language", color: "#F59E0B" },
        { id: "Ngữ Văn", name: "Môn Ngữ Văn", icon: "fa-pen-nib", color: "#EC4899" }
    ],

    // URL Web App Google Apps Script MỚI (Thay thế URL này khi triển khai Google Sheet mới)
    SCRIPT_URL: "https://script.google.com/macros/s/AKfycbxQyi3jPVuPxP9rujFEBdh1MFX4-BC59jqTFk3-mgZgdMTHD3mL4demkhurcbKJZ7PA/exec",

    // Link Folder Google Drive của Thầy Giáo
    HOMEWORK_DRIVE_FOLDER: "https://drive.google.com/drive/folders/1ABC_DEMO_NOP_BAI_TAP",
    ASSIGNMENT_DRIVE_FOLDER: "https://drive.google.com/drive/folders/1XYZ_DEMO_GIAO_BAI_TAP",

    // Thông tin chuyển khoản học phí
    BANK_INFO: {
        BANK_NAME: "MB Bank (Ngân hàng Quân Đội)",
        ACCOUNT_NUMBER: "0985692879",
        ACCOUNT_HOLDER: "NGUYEN HUU PHUC"
    }
};
