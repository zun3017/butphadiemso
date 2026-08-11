// ==========================================
// VIDEO MANAGER — BACKEND APPS SCRIPT
// Quản lý thư viện video & mã khóa học
// ==========================================

// Lấy Google Spreadsheet lớp học (tái dụng hàm có sẵn)
function getVideoSpreadsheet() {
  return (typeof getClassSpreadsheet === 'function') ? getClassSpreadsheet() : SpreadsheetApp.getActiveSpreadsheet();
}

// ---- Khởi tạo Sheets nếu chưa có ----
function initVideoSheets() {
  var ss = getVideoSpreadsheet();

  // Sheet: Video_Library
  var sheetLib = ss.getSheetByName('Video_Library');
  if (!sheetLib) {
    sheetLib = ss.insertSheet('Video_Library');
    sheetLib.getRange(1, 1, 1, 9).setValues([[
      'Video_ID', 'Tên Video', 'Link Drive', 'File_ID', 'Lớp', 'Chủ đề', 'Bài học', 'Thời lượng', 'Ngày thêm'
    ]]);
    sheetLib.setFrozenRows(1);
  }

  // Sheet: Khoa_Hoc
  var sheetKH = ss.getSheetByName('Khoa_Hoc');
  if (!sheetKH) {
    sheetKH = ss.insertSheet('Khoa_Hoc');
    sheetKH.getRange(1, 1, 1, 8).setValues([[
      'Ma_KH', 'Ten_KH', 'Ghi_chu_HS', 'Video_IDs', 'Link_Drive_Folder', 'Ngay_tao', 'Trang_thai', 'Tutor_Phone'
    ]]);
    sheetKH.setFrozenRows(1);
  }

  // Sheet: Truy_Cap_KH
  var sheetLog = ss.getSheetByName('Truy_Cap_KH');
  if (!sheetLog) {
    sheetLog = ss.insertSheet('Truy_Cap_KH');
    sheetLog.getRange(1, 1, 1, 3).setValues([[
      'Ma_KH', 'Thoi_gian', 'Thiet_bi'
    ]]);
    sheetLog.setFrozenRows(1);
  }

  return { sheetLib: sheetLib, sheetKH: sheetKH, sheetLog: sheetLog };
}

// ---- Trích xuất File ID từ Google Drive Link ----
function extractFileId(driveLink) {
  if (!driveLink) return '';
  // Hỗ trợ nhiều dạng link Drive
  var patterns = [
    /\/file\/d\/([a-zA-Z0-9_-]+)/,
    /id=([a-zA-Z0-9_-]+)/,
    /\/d\/([a-zA-Z0-9_-]+)/
  ];
  for (var i = 0; i < patterns.length; i++) {
    var m = driveLink.match(patterns[i]);
    if (m && m[1]) return m[1];
  }
  return '';
}

// ---- Sinh mã Video ID duy nhất ----
function generateVideoId() {
  var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  var id = 'VID-';
  for (var i = 0; i < 6; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

// ---- Sinh mã Khóa Học duy nhất ----
function generateCourseCode() {
  var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  var code = 'KH-';
  for (var i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// ==========================================
// CRUD VIDEO LIBRARY
// ==========================================

/**
 * Thêm video mới vào thư viện
 * @param {string} name - Tên video
 * @param {string} driveLink - Link Google Drive (đã chia sẻ)
 * @param {string} classLevel - Lớp (vd: "Lớp 10")
 * @param {string} topic - Chủ đề (vd: "Hóa Hữu Cơ")
 * @param {string} lesson - Bài học (vd: "Bài 1: Ankan") — có thể để trống
 * @param {string} duration - Thời lượng (vd: "45:00") — có thể để trống
 */
function addVideo(name, driveLink, classLevel, topic, lesson, duration) {
  try {
    initVideoSheets();
    var ss = getVideoSpreadsheet();
    var sheet = ss.getSheetByName('Video_Library');

    var fileId = extractFileId(driveLink);
    var videoId = generateVideoId();
    var now = Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'dd/MM/yyyy HH:mm');

    // Kiểm tra link trùng
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (data[i][2] === driveLink) {
        return { success: false, message: 'Link Drive này đã tồn tại trong thư viện!' };
      }
    }

    sheet.appendRow([
      videoId,
      name || 'Video không tên',
      driveLink,
      fileId,
      classLevel || '',
      topic || '',
      lesson || '',
      duration || '',
      now
    ]);

    return { success: true, videoId: videoId, fileId: fileId };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

/**
 * Lấy danh sách video (có thể lọc theo lớp, chủ đề, bài)
 */
function getVideoList(classFilter, topicFilter, lessonFilter) {
  try {
    initVideoSheets();
    var ss = getVideoSpreadsheet();
    var sheet = ss.getSheetByName('Video_Library');
    var data = sheet.getDataRange().getValues();
    if (data.length <= 1) return { success: true, videos: [] };

    var videos = [];
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      if (!row[0]) continue; // Bỏ hàng rỗng

      // Lọc nếu có filter
      if (classFilter && row[4] !== classFilter) continue;
      if (topicFilter && row[5] !== topicFilter) continue;
      if (lessonFilter && row[6] !== lessonFilter) continue;

      videos.push({
        videoId: row[0],
        name: row[1],
        driveLink: row[2],
        fileId: row[3],
        classLevel: row[4],
        topic: row[5],
        lesson: row[6],
        duration: row[7],
        addedAt: row[8],
        embedUrl: row[3] ? 'https://drive.google.com/file/d/' + row[3] + '/preview' : ''
      });
    }

    return { success: true, videos: videos };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

/**
 * Lấy danh sách tất cả Lớp, Chủ đề, Bài học hiện có (để render bộ lọc)
 */
function getVideoFilterOptions() {
  try {
    initVideoSheets();
    var ss = getVideoSpreadsheet();
    var sheet = ss.getSheetByName('Video_Library');
    var data = sheet.getDataRange().getValues();

    var classes = {}, topics = {}, lessons = {};
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      if (!row[0]) continue;
      if (row[4]) classes[row[4]] = true;
      if (row[5]) topics[row[5]] = true;
      if (row[6]) lessons[row[6]] = true;
    }

    return {
      success: true,
      classes: Object.keys(classes).sort(),
      topics: Object.keys(topics).sort(),
      lessons: Object.keys(lessons).sort()
    };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

/**
 * Cập nhật thông tin video
 */
function updateVideo(videoId, name, classLevel, topic, lesson, duration) {
  try {
    var ss = getVideoSpreadsheet();
    var sheet = ss.getSheetByName('Video_Library');
    if (!sheet) return { success: false, message: 'Sheet không tồn tại' };

    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] === videoId) {
        var row = i + 1; // 1-indexed
        if (name !== undefined && name !== null) sheet.getRange(row, 2).setValue(name);
        if (classLevel !== undefined) sheet.getRange(row, 5).setValue(classLevel);
        if (topic !== undefined) sheet.getRange(row, 6).setValue(topic);
        if (lesson !== undefined) sheet.getRange(row, 7).setValue(lesson);
        if (duration !== undefined) sheet.getRange(row, 8).setValue(duration);
        return { success: true };
      }
    }
    return { success: false, message: 'Không tìm thấy video ID: ' + videoId };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

/**
 * Xóa video khỏi thư viện (chỉ xóa dòng trong Sheet)
 */
function deleteVideo(videoId) {
  try {
    var ss = getVideoSpreadsheet();
    var sheet = ss.getSheetByName('Video_Library');
    if (!sheet) return { success: false, message: 'Sheet không tồn tại' };

    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] === videoId) {
        sheet.deleteRow(i + 1);
        return { success: true };
      }
    }
    return { success: false, message: 'Không tìm thấy video ID: ' + videoId };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

// ==========================================
// TẠO & QUẢN LÝ MÃ KHÓA HỌC
// ==========================================

/**
 * Tạo khóa học mới từ danh sách video đã chọn
 * @param {string} courseName - Tên khóa học
 * @param {string} studentNote - Ghi chú học sinh (tên, ghi chú nội bộ)
 * @param {string[]} videoIds - Mảng các Video ID đã chọn
 * @param {string} tutorPhone - SĐT giáo viên (để định danh)
 */
function createCourse(courseName, studentNote, videoIds, tutorPhone) {
  try {
    initVideoSheets();
    var ss = getVideoSpreadsheet();

    // Sinh mã KH không trùng
    var sheetKH = ss.getSheetByName('Khoa_Hoc');
    var existingData = sheetKH.getDataRange().getValues();
    var existingCodes = {};
    for (var i = 1; i < existingData.length; i++) {
      existingCodes[existingData[i][0]] = true;
    }

    var code;
    var maxRetry = 20;
    do {
      code = generateCourseCode();
      maxRetry--;
    } while (existingCodes[code] && maxRetry > 0);

    // KHÔNG tạo thư mục Drive, KHÔNG copy file
    // Hệ thống chỉ lưu mã + danh sách Video ID (link gốc của giáo viên được dùng trực tiếp)
    var now = Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'dd/MM/yyyy HH:mm');
    sheetKH.appendRow([
      code,
      courseName || 'Khóa học',
      studentNote || '',
      Array.isArray(videoIds) ? videoIds.join(',') : '',
      '', // folderLink bỏ trống
      now,
      'active',
      tutorPhone || ''
    ]);

    return {
      success: true,
      courseCode: code,
      folderLink: folderLink,
      videoCount: Array.isArray(videoIds) ? videoIds.length : 0
    };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

/**
 * Lấy danh sách tất cả khóa học (cho tab lịch sử)
 */
function getCourseList(tutorPhone) {
  try {
    initVideoSheets();
    var ss = getVideoSpreadsheet();
    var sheet = ss.getSheetByName('Khoa_Hoc');
    var data = sheet.getDataRange().getValues();
    if (data.length <= 1) return { success: true, courses: [] };

    var courses = [];
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      if (!row[0]) continue;
      // Nếu có lọc theo giáo viên
      if (tutorPhone && row[7] && row[7] !== tutorPhone) continue;

      var videoIds = row[3] ? row[3].split(',').filter(Boolean) : [];
      courses.push({
        courseCode: row[0],
        courseName: row[1],
        studentNote: row[2],
        videoCount: videoIds.length,
        folderLink: row[4],
        createdAt: row[5],
        status: row[6] || 'active'
      });
    }

    // Sắp xếp mới nhất lên đầu
    courses.sort(function(a, b) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return { success: true, courses: courses };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

/**
 * Bật/tắt trạng thái mã khóa học
 */
function toggleCourseStatus(courseCode) {
  try {
    var ss = getVideoSpreadsheet();
    var sheet = ss.getSheetByName('Khoa_Hoc');
    if (!sheet) return { success: false, message: 'Sheet không tồn tại' };

    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] === courseCode) {
        var newStatus = (data[i][6] === 'active') ? 'locked' : 'active';
        sheet.getRange(i + 1, 7).setValue(newStatus);
        return { success: true, newStatus: newStatus };
      }
    }
    return { success: false, message: 'Không tìm thấy mã: ' + courseCode };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

// ==========================================
// XÁC THỰC MÃ KHI ĐĂNG NHẬP
// ==========================================

/**
 * Kiểm tra mã nhập vào là SĐT hay Mã KH
 * Trả về: { type: 'student'|'course'|'unknown', ... }
 */
function checkLoginCode(code) {
  if (!code) return { success: false, type: 'unknown', message: 'Mã không hợp lệ' };

  var cleanCode = code.trim().toUpperCase();

  // Kiểm tra Mã Khóa Học (bắt đầu bằng KH-)
  if (cleanCode.startsWith('KH-')) {
    try {
      initVideoSheets();
      var ss = getVideoSpreadsheet();
      var sheet = ss.getSheetByName('Khoa_Hoc');
      var data = sheet.getDataRange().getValues();

      for (var i = 1; i < data.length; i++) {
        if (data[i][0] === cleanCode) {
          var status = data[i][6] || 'active';
          if (status === 'locked') {
            return { success: false, type: 'course', message: 'Mã khóa học này đã bị khóa. Vui lòng liên hệ giáo viên.' };
          }

          // Lấy danh sách video
          var videoIds = data[i][3] ? data[i][3].split(',').filter(Boolean) : [];
          return {
            success: true,
            type: 'course',
            courseCode: data[i][0],
            courseName: data[i][1],
            studentNote: data[i][2],
            videoIds: videoIds,
            folderLink: data[i][4]
          };
        }
      }
      return { success: false, type: 'course', message: 'Mã khóa học không tồn tại.' };
    } catch (e) {
      return { success: false, type: 'unknown', message: e.toString() };
    }
  }

  // Không phải mã KH → trả về student để loginSystem xử lý
  return { success: true, type: 'student' };
}

/**
 * Lấy danh sách video chi tiết của một khóa học (cho trang xem)
 */
function getCourseVideos(courseCode) {
  try {
    if (!courseCode) return { success: false, message: 'Thiếu mã khóa học' };

    var cleanCode = courseCode.trim().toUpperCase();
    initVideoSheets();
    var ss = getVideoSpreadsheet();

    var sheetKH = ss.getSheetByName('Khoa_Hoc');
    var khData = sheetKH.getDataRange().getValues();
    var courseRow = null;

    for (var i = 1; i < khData.length; i++) {
      if (khData[i][0] === cleanCode) {
        courseRow = khData[i];
        break;
      }
    }

    if (!courseRow) return { success: false, message: 'Mã khóa học không tồn tại.' };
    if ((courseRow[6] || 'active') === 'locked') {
      return { success: false, message: 'Mã khóa học đã bị khóa.' };
    }

    var videoIds = courseRow[3] ? courseRow[3].split(',').filter(Boolean) : [];

    // Lấy thông tin chi tiết từng video
    var sheetLib = ss.getSheetByName('Video_Library');
    var libData = sheetLib.getDataRange().getValues();
    var videoMap = {};
    for (var j = 1; j < libData.length; j++) {
      videoMap[libData[j][0]] = libData[j];
    }

    var videos = [];
    for (var k = 0; k < videoIds.length; k++) {
      var vRow = videoMap[videoIds[k]];
      if (vRow) {
        videos.push({
          videoId: vRow[0],
          name: vRow[1],
          driveLink: vRow[2],
          fileId: vRow[3],
          classLevel: vRow[4],
          topic: vRow[5],
          lesson: vRow[6],
          duration: vRow[7],
          embedUrl: vRow[3] ? 'https://drive.google.com/file/d/' + vRow[3] + '/preview' : ''
        });
      }
    }

    return {
      success: true,
      courseCode: cleanCode,
      courseName: courseRow[1],
      videos: videos,
      folderLink: courseRow[4]
    };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

/**
 * Ghi log truy cập khóa học
 */
function logCourseAccess(courseCode, device) {
  try {
    initVideoSheets();
    var ss = getVideoSpreadsheet();
    var sheet = ss.getSheetByName('Truy_Cap_KH');
    var now = Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'dd/MM/yyyy HH:mm:ss');
    sheet.appendRow([courseCode || '', now, device || '']);
    return { success: true };
  } catch (e) {
    return { success: false };
  }
}
