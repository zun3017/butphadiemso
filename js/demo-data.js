/**
 * DEMO DATA FOR LỚP HỌC (MÔN VẬT LÝ)
 * Giáo viên: Thầy Trần Hoàng Nam - 0123456789 (PIN: 1234)
 * Học sinh: Giữ nguyên danh sách học sinh mẫu có sẵn
 */

const INITIAL_DEMO_DATA = {
    teacher: {
        teacherId: "0123456789",
        name: "Thầy Trần Hoàng Nam",
        phone: "0123456789",
        pin: "1234",
        subject: "Vật Lý",
        qrUrl: "https://i.postimg.cc/mD47FmN8/qr-demo.png",
        registeredDate: "15/08/2026",
        nextDueDate: "15/09/2026",
        accountType: "Giáo viên Lớp học",
        status: "Hoạt động"
    },
    admin: {
        adminId: "302001",
        name: "Quản trị viên",
        phone: "302001",
        pin: "1234",
        role: "Super Admin"
    },
    classes: [
        {
            classId: "LH_LY12_VIP",
            className: "Lớp 12 - Luyện Thi THPT QG Vật Lý",
            teacherPhone: "0123456789",
            subject: "Vật Lý",
            schedule: "Thứ 3 - Thứ 6 (18:00 - 20:00)",
            maxStudents: 25,
            fee: 250000,
            tuitionType: "per_session",
            status: "Đang mở"
        },
        {
            classId: "LH_LY11_NC",
            className: "Lớp 11 - Vật Lý Nâng Cao & Chuyên Đề",
            teacherPhone: "0123456789",
            subject: "Vật Lý",
            schedule: "Thứ 4 - Chủ Nhật (19:30 - 21:30)",
            maxStudents: 20,
            fee: 220000,
            tuitionType: "per_session",
            status: "Đang mở"
        },
        {
            classId: "LH_LY10_CB",
            className: "Lớp 10 - Vật Lý Cơ Bản & Nâng Cao",
            teacherPhone: "0123456789",
            subject: "Vật Lý",
            schedule: "Thứ 2 - Thứ 5 (17:30 - 19:30)",
            maxStudents: 20,
            fee: 200000,
            tuitionType: "per_session",
            status: "Đang mở"
        },
        {
            classId: "LH_LY9_CHUYEN",
            className: "Lớp 9 - Ôn Thi Vào 10 Chuyên Lý",
            teacherPhone: "0123456789",
            subject: "Vật Lý",
            schedule: "Thứ 7 (14:00 - 17:00)",
            maxStudents: 15,
            fee: 280000,
            tuitionType: "per_session",
            status: "Đang mở"
        }
    ],
    students: [
        {
            studentId: "HS_0987654321",
            studentName: "Nguyễn Văn An",
            classId: "LH_LY12_VIP",
            parentPhone: "0987654321",
            parentName: "Nguyễn Thị Hương",
            joinDate: "01/06/2026",
            tuitionFee: 250000,
            homeworkId: "0987654321",
            tuitionType: "per_session"
        },
        {
            studentId: "HS_0912345678",
            studentName: "Lê Minh Thư",
            classId: "LH_LY12_VIP",
            parentPhone: "0912345678",
            parentName: "Lê Văn Tuấn",
            joinDate: "01/06/2026",
            tuitionFee: 250000,
            homeworkId: "0912345678",
            tuitionType: "per_session"
        },
        {
            studentId: "HS_0905123456",
            studentName: "Phạm Hải Đăng",
            classId: "LH_LY12_VIP",
            parentPhone: "0905123456",
            parentName: "Phạm Hồng Ngọc",
            joinDate: "05/06/2026",
            tuitionFee: 250000,
            homeworkId: "0905123456",
            tuitionType: "per_session"
        },
        {
            studentId: "HS_0934567890",
            studentName: "Trần Quốc Bảo",
            classId: "LH_LY11_NC",
            parentPhone: "0934567890",
            parentName: "Trần Minh Hoàng",
            joinDate: "10/06/2026",
            tuitionFee: 220000,
            homeworkId: "0934567890",
            tuitionType: "per_session"
        },
        {
            studentId: "HS_0978901234",
            studentName: "Vũ Đức Trọng",
            classId: "LH_LY11_NC",
            parentPhone: "0978901234",
            parentName: "Vũ Thanh Hằng",
            joinDate: "12/06/2026",
            tuitionFee: 220000,
            homeworkId: "0978901234",
            tuitionType: "per_session"
        },
        {
            studentId: "HS_0967890123",
            studentName: "Đỗ Mai Anh",
            classId: "LH_LY10_CB",
            parentPhone: "0967890123",
            parentName: "Đỗ Quốc Khánh",
            joinDate: "15/06/2026",
            tuitionFee: 200000,
            homeworkId: "0967890123",
            tuitionType: "per_session"
        },
        {
            studentId: "HS_0945678901",
            studentName: "Hoàng Gia Huy",
            classId: "LH_LY9_CHUYEN",
            parentPhone: "0945678901",
            parentName: "Hoàng Bích Thủy",
            joinDate: "20/06/2026",
            tuitionFee: 280000,
            homeworkId: "0945678901",
            tuitionType: "per_session"
        }
    ],
    lessonLogs: [
        {
            logId: "LOG_LY12_10",
            classId: "LH_LY12_VIP",
            className: "Lớp 12 - Luyện Thi THPT QG Vật Lý",
            teachingWeek: "10",
            studyDate: "15/08",
            subject: "Vật Lý",
            status: "Có mặt",
            hwEval: "Hoàn thành",
            score1: 9.0,
            score2: 8.5,
            generalNotes: "Chuyên đề: Dòng điện xoay chiều trong mạch RLC không phân nhánh. Luyện giải các câu hỏi mức độ vận dụng cao về giản đồ vecto và độ lệch pha.",
            detailedNotes: {
                "HS_0987654321": { attendance: "Có mặt", hwEval: "Hoàn thành", entryTest: "9.0", termTest: "8.5", paid: true, privateNote: "Nắm chắc phương pháp chuẩn hóa số liệu trong điện xoay chiều." },
                "HS_0912345678": { attendance: "Có mặt", hwEval: "Hoàn thành", entryTest: "8.5", termTest: "8.0", paid: true, privateNote: "Cần luyện thêm dạng bài đồ thị điện áp xoay chiều." },
                "HS_0905123456": { attendance: "Có mặt", hwEval: "Hoàn thành", entryTest: "9.5", termTest: "9.0", paid: false, privateNote: "Tư duy giải toán mạch RLC cộng hưởng rất nhanh và sắc bén." }
            }
        },
        {
            logId: "LOG_LY12_9",
            classId: "LH_LY12_VIP",
            className: "Lớp 12 - Luyện Thi THPT QG Vật Lý",
            teachingWeek: "9",
            studyDate: "12/08",
            subject: "Vật Lý",
            status: "Có mặt",
            hwEval: "Hoàn thành",
            score1: 8.5,
            score2: 9.0,
            generalNotes: "Chuyên đề: Giao thoa sóng cơ học & Sóng dừng trên dây. Khảo sát điều kiện cực đại, cực tiểu giao thoa 2 nguồn cùng pha.",
            detailedNotes: {
                "HS_0987654321": { attendance: "Có mặt", hwEval: "Hoàn thành", entryTest: "8.5", termTest: "9.0", paid: true, privateNote: "Làm tốt các bài toán đếm số điểm cực đại trên đoạn thẳng nối 2 nguồn." },
                "HS_0912345678": { attendance: "Có mặt", hwEval: "Hoàn thành", entryTest: "8.0", termTest: "8.5", paid: true, privateNote: "Cần lưu ý khoảng cách giữa 2 nút sóng liên tiếp là lamda/2." },
                "HS_0905123456": { attendance: "Có mặt", hwEval: "Hoàn thành", entryTest: "9.0", termTest: "9.5", paid: true, privateNote: "Làm bài kiểm tra xuất sắc." }
            }
        },
        {
            logId: "LOG_LY12_8",
            classId: "LH_LY12_VIP",
            className: "Lớp 12 - Luyện Thi THPT QG Vật Lý",
            teachingWeek: "8",
            studyDate: "08/08",
            subject: "Vật Lý",
            status: "Có mặt",
            hwEval: "Hoàn thành",
            score1: 8.0,
            score2: 8.0,
            generalNotes: "Chuyên đề: Con lắc lò xo và con lắc đơn. Tính chu kỳ dao động, cơ năng và lực đàn hồi cực đại, cực tiểu.",
            detailedNotes: {
                "HS_0987654321": { attendance: "Có mặt", hwEval: "Hoàn thành", entryTest: "8.0", termTest: "8.0", paid: true, privateNote: "Nắm vững công thức tính cơ năng và lực kéo về." },
                "HS_0912345678": { attendance: "Có mặt", hwEval: "Thiếu 1 bài", entryTest: "7.5", termTest: "8.0", paid: true, privateNote: "Lần sau nhớ làm đầy đủ câu hỏi trắc nghiệm lý thuyết." },
                "HS_0905123456": { attendance: "Có mặt", hwEval: "Hoàn thành", entryTest: "9.0", termTest: "8.5", paid: true, privateNote: "Tiếp thu bài nhanh." }
            }
        }
    ],
    homework: [
        {
            hwId: "HW_LY12_01",
            classId: "LH_LY12_VIP",
            className: "Lớp 12 - Luyện Thi THPT QG Vật Lý",
            subject: "Vật Lý",
            hwName: "Đề luyện thi số 01: Đại cương Dao động điều hòa & Con lắc lò xo (40 câu)",
            assignedDate: "15/08/2026",
            deadline: "20/08/2026",
            fileUrl: "https://drive.google.com/file/d/demo_ly12_de1/view",
            fileName: "De_Luyen_Thi_Vat_Ly_12_So_01.pdf",
            submitLink: "",
            status: "Active"
        },
        {
            hwId: "HW_LY12_02",
            classId: "LH_LY12_VIP",
            className: "Lớp 12 - Luyện Thi THPT QG Vật Lý",
            subject: "Vật Lý",
            hwName: "Phiếu bài tập nâng cao: Mạch RLC có L thay đổi để U_L cực đại",
            assignedDate: "12/08/2026",
            deadline: "18/08/2026",
            fileUrl: "https://drive.google.com/file/d/demo_ly12_de2/view",
            fileName: "Chuyen_De_RLC_Cuc_Tri.pdf",
            submitLink: "",
            status: "Active"
        }
    ],
    submissions: [
        {
            submissionId: "SUB_DEMO_01",
            homeworkCode: "0987654321",
            classId: "LH_LY12_VIP",
            hwId: "HW_LY12_01",
            studentName: "Nguyễn Văn An",
            lessonName: "Bài làm Đề 01 Dao động điều hòa",
            fileUrl: "https://i.postimg.cc/mD47FmN8/qr-demo.png",
            submittedAt: "16/08/2026 20:30",
            submissionDate: "16/08/2026",
            status: "Đã nộp",
            score: "9.0",
            comment: "Trình bày bài giải chi tiết, chuẩn xác!"
        }
    ],
    announcements: [
        {
            announcementId: "ANN_LY12",
            classId: "LH_LY12_VIP",
            content: "Tuần sau lớp sẽ làm bài thi thử khảo sát chất lượng đầu tháng môn Vật Lý (50 phút). Các em ôn kỹ phần Dao động cơ và Sóng cơ nhé!",
            createdAt: "2026-08-15T08:00:00Z"
        }
    ],
    courses: [
        {
            courseId: "KH_LY12_THPT",
            courseCode: "KH-VATLY12",
            title: "Khóa Học Toàn Diện: Chinh Phục 9+ Môn Vật Lý THPT Quốc Gia",
            subject: "Vật Lý",
            instructor: "Thầy Trần Hoàng Nam",
            totalVideos: 12,
            coverImage: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=600&auto=format&fit=crop&q=80",
            description: "Hệ thống toàn bộ kiến thức Vật lý 12 trọng tâm, kỹ thuật giải nhanh trắc nghiệm bằng máy tính Casio và phương pháp chuẩn hóa số liệu."
        }
    ],
    exams: [
        {
            examId: "AZ_LY12_GK",
            examName: "Đề Thi Khảo Sát Chất Lượng Giữa Kỳ Môn Vật Lý 12",
            sourceUrl: "https://azota.vn/vi/de-thi/demo-vat-ly-12",
            subject: "Vật Lý",
            creatorPhone: "0123456789",
            createdAt: "15/08/2026"
        }
    ],
    parentFeedbacks: [
        {
            feedbackId: "FB_DEMO_01",
            studentPhone: "0987654321",
            studentName: "Nguyễn Văn An",
            classId: "LH_LY12_VIP",
            content: "Cảm ơn thầy Nam đã nhiệt tình giảng dạy môn Vật Lý, đợt này cháu An rất hào hứng và điểm số đã tiến bộ rõ rệt ạ.",
            submittedAt: "14/08/2026 19:45"
        }
    ],
    videos: [
        {
            videoId: "VID_LY12_01",
            name: "Bài 1 - Đại cương Dao động điều hòa & Phương trình li độ, vận tốc",
            class: "Lớp 12",
            classLevel: "Lớp 12",
            topic: "Dao động cơ",
            lesson: "Bài 1: Dao động điều hòa",
            duration: "01:00",
            thumbUrl: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=600&auto=format&fit=crop&q=80",
            videoUrl: "physics-demo-video.html?lesson=1",
            driveUrl: "physics-demo-video.html?lesson=1",
            fileId: "VID_01",
            createdAt: "15/08/2026 09:00"
        },
        {
            videoId: "VID_LY12_02",
            name: "Bài 2 - Con lắc lò xo và bài toán năng lượng cơ năng",
            class: "Lớp 12",
            classLevel: "Lớp 12",
            topic: "Dao động cơ",
            lesson: "Bài 2: Con lắc lò xo",
            duration: "01:00",
            thumbUrl: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=600&auto=format&fit=crop&q=80",
            videoUrl: "physics-demo-video.html?lesson=2",
            driveUrl: "physics-demo-video.html?lesson=2",
            fileId: "VID_02",
            createdAt: "15/08/2026 10:30"
        },
        {
            videoId: "VID_LY12_03",
            name: "Bài 3 - Giao thoa sóng cơ và điều kiện cực đại cực tiểu",
            class: "Lớp 12",
            classLevel: "Lớp 12",
            topic: "Sóng cơ & Sóng âm",
            lesson: "Bài 3: Giao thoa sóng",
            duration: "01:00",
            thumbUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
            videoUrl: "physics-demo-video.html?lesson=3",
            driveUrl: "physics-demo-video.html?lesson=3",
            fileId: "VID_03",
            createdAt: "15/08/2026 14:00"
        },
        {
            videoId: "VID_LY12_04",
            name: "Bài 4 - Mạch RLC nối tiếp và hiện tượng cộng hưởng điện",
            class: "Lớp 12",
            classLevel: "Lớp 12",
            topic: "Dòng điện xoay chiều",
            lesson: "Bài 4: Mạch RLC",
            duration: "01:00",
            thumbUrl: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=600&auto=format&fit=crop&q=80",
            videoUrl: "physics-demo-video.html?lesson=4",
            driveUrl: "physics-demo-video.html?lesson=4",
            fileId: "VID_04",
            createdAt: "15/08/2026 16:20"
        },
        {
            videoId: "VID_LY11_01",
            name: "Bài 1 - Điện tích và Định luật Cu-lông trong chân không",
            class: "Lớp 11",
            classLevel: "Lớp 11",
            topic: "Điện tích & Điện trường",
            lesson: "Bài 1: Định luật Cu-lông",
            duration: "01:00",
            thumbUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80",
            videoUrl: "physics-demo-video.html?lesson=5",
            driveUrl: "physics-demo-video.html?lesson=5",
            fileId: "VID_05",
            createdAt: "15/08/2026 11:00"
        },
        {
            videoId: "VID_LY10_01",
            name: "Bài 1 - Chuyển động thẳng biến đổi đều và đồ thị vận tốc",
            class: "Lớp 10",
            classLevel: "Lớp 10",
            topic: "Động học chất điểm",
            lesson: "Bài 1: Chuyển động thẳng",
            duration: "01:00",
            thumbUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80",
            videoUrl: "physics-demo-video.html?lesson=6",
            driveUrl: "physics-demo-video.html?lesson=6",
            fileId: "VID_06",
            createdAt: "15/08/2026 08:30"
        }
    ]
};
