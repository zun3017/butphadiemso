/**
 * ============================================================================
 * HOMEWORK.GS - QUẢN LÝ BÀI TẬP VỀ NHÀ & NỘP BÀI TẬP LỚP HỌC
 * Xử lý giao nhận bài tập theo Lớp & Môn học
 * ============================================================================
 */

// 1. LẤY DANH SÁCH BÀI TẬP VỀ NHÀ
function getHomeworkList(classId, subject) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Bài tập lớp học');
  if (!sheet) return { success: true, homeworks: [] };
  
  var data = sheet.getDataRange().getValues();
  var homeworks = [];
  
  for (var i = 1; i < data.length; i++) {
    var hwClassId = String(data[i][1]);
    var hwSubject = String(data[i][3]);
    
    var matchClass = (!classId || classId === 'Tất cả' || hwClassId === classId);
    var matchSubject = (!subject || subject === 'Tất cả' || hwSubject.toLowerCase() === subject.toLowerCase());
    
    if (matchClass && matchSubject) {
      homeworks.push({
        id: data[i][0],
        classId: data[i][1],
        className: data[i][2],
        subject: data[i][3],
        title: data[i][4],
        assignedDate: data[i][5],
        deadline: data[i][6],
        fileUrl: data[i][7]
      });
    }
  }
  
  return { success: true, homeworks: homeworks };
}

// 2. HỌC SINH NỘP BÀI TẬP
function submitHomework(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Học sinh nộp bài lớp học');
  if (!sheet) return { success: false, error: 'Chưa có sheet Học sinh nộp bài lớp học' };
  
  var submissionId = 'SUB_' + new Date().getTime();
  sheet.appendRow([
    submissionId,
    data.homeworkId || '',
    data.classId || '',
    data.subject || 'Môn Toán',
    data.studentCode || '',
    data.studentName || '',
    data.parentPhone || '',
    new Date().toLocaleString('vi-VN'),
    data.fileUrl || '',
    '', // Điểm số
    ''  // Nhận xét GV
  ]);
  
  return { success: true, message: 'Nộp bài tập thành công!' };
}

// 3. THẦY GIÁO TẠO BÀI TẬP MỚI
function createHomework(hwData) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Bài tập lớp học');
  if (!sheet) return { success: false, error: 'Thiếu Sheet Bài tập lớp học' };
  
  var hwId = 'BT_' + new Date().getTime();
  sheet.appendRow([
    hwId,
    hwData.classId || 'Tất cả',
    hwData.className || 'Tất cả các lớp',
    hwData.subject || 'Môn Toán',
    hwData.title || '',
    new Date().toLocaleDateString('vi-VN'),
    hwData.deadline || '',
    hwData.fileUrl || ''
  ]);
  
  return { success: true, message: 'Giao bài tập mới thành công!' };
}

// ============================================================================
// CÁC HÀM XỬ LÝ BÀI TẬP MỚI DÀNH CHO DASHBOARD LỚP HỌC (class-dashboard.html)
// ============================================================================

function getOrCreateHomeworkSheet(ss) {
  if (!ss) ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetName = 'Bài tập lớp học';
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow([
      "Mã BT", "Mã lớp", "Tên lớp", "Môn học", "Tên bài tập", "Ngày giao", "File đính kèm (URL)", "Tên file", "Link xem/nộp", "Ngày xóa"
    ]);
    sheet.getRange(1, 1, 1, 11).setFontWeight("bold").setBackground("#8E4DFF").setFontColor("#FFFFFF");
  } else {
    // Kiem tra nếu chưa có cột Tên file, Link xem/nộp, Ngày xóa
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    if (headers.indexOf("Tên file") === -1) sheet.getRange(1, 8).setValue("Tên file");
    if (headers.indexOf("Link xem/nộp") === -1) sheet.getRange(1, 9).setValue("Link xem/nộp");
    if (headers.indexOf("Ngày xóa") === -1) sheet.getRange(1, 10).setValue("Ngày xóa");
  }
  return sheet;
}

function getClassHomeworkList(classId, className) {
  var ss = (typeof getClassSpreadsheet === 'function') ? getClassSpreadsheet() : SpreadsheetApp.getActiveSpreadsheet();
  var sheet = getOrCreateHomeworkSheet(ss);
  var data = sheet.getDataRange().getDisplayValues();
  var hwList = [];
  var cleanClassId = String(classId).trim();
  
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][1]).trim() === cleanClassId) {
      var deletedAt = String(data[i][9] || "").trim(); // Cột Ngày xóa (J)
      if (deletedAt === "") {
        hwList.push({
          hwId: data[i][0],
          classId: data[i][1],
          className: data[i][2],
          subject: data[i][3],
          title: data[i][4],
          releaseDate: data[i][5], // assignedDate
          fileUrl: data[i][6],
          fileName: data[i][7],
          link: data[i][8]
        });
      }
    }
  }
  
  // Sắp xếp giảm dần theo ID
  hwList.sort(function(a, b) {
    var idA = parseInt(a.hwId.replace("HW_", "").replace("BT_", "")) || 0;
    var idB = parseInt(b.hwId.replace("HW_", "").replace("BT_", "")) || 0;
    return idB - idA;
  });
  
  return hwList;
}

function uploadHomeworkFileToDrive(base64Data, fileName, mimeType) {
  var folderName = "BÀI TẬP LỚP HỌC";
  var driveApp = DriveApp;
  var parentFolder;
  var folders = driveApp.getRootFolder().getFoldersByName(folderName);
  if (folders.hasNext()) {
    parentFolder = folders.next();
  } else {
    parentFolder = driveApp.getRootFolder().createFolder(folderName);
  }
  
  var decoded = Utilities.base64Decode(base64Data);
  var blob = Utilities.newBlob(decoded, mimeType, fileName);
  var file = parentFolder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return file.getUrl();
}

function saveClassHomework(classId, className, subject, title, releaseDate, base64, fName, mType, link) {
  var ss = (typeof getClassSpreadsheet === 'function') ? getClassSpreadsheet() : SpreadsheetApp.getActiveSpreadsheet();
  var sheet = getOrCreateHomeworkSheet(ss);
  
  var fileUrl = "";
  var finalFName = "";
  if (base64 && fName) {
    try {
      fileUrl = uploadHomeworkFileToDrive(base64, fName, mType);
      finalFName = fName;
    } catch(e) {
      return { error: "Lỗi upload file: " + e.toString() };
    }
  }
  
  var hwId = "HW_" + new Date().getTime();
  
  sheet.appendRow([
    hwId,
    classId,
    className,
    subject || "",      // Môn học
    title || "",        // Tên bài tập
    releaseDate || "", // Ngày phát hành
    fileUrl || "",      // File URL
    finalFName || "",   // File name
    link || "",         // Link ngoài
    ""                  // Ngày xóa
  ]);
  
  if (typeof clearClassCache === 'function') clearClassCache(classId, "hw");
  SpreadsheetApp.flush();
  
  return {
    success: true,
    hw: {
      hwId: hwId,
      classId: classId,
      className: className,
      subject: subject || "",
      title: title,
      releaseDate: releaseDate,
      link: link,
      fileUrl: fileUrl,
      fileName: finalFName
    }
  };
}

/**
 * Lấy danh sách bài tập + bài nộp theo nhóm cho giáo viên
 * Trả về: mỗi bài tập kèm số HS đã nộp + danh sách chi tiết
 */
function getClassSubmissionsGrouped(classId) {
  try {
    var ss = (typeof getClassSpreadsheet === 'function') ? getClassSpreadsheet() : SpreadsheetApp.getActiveSpreadsheet();
    var sheetHW = ss.getSheetByName('Bài tập lớp học');
    var sheetSub = ss.getSheetByName('Học sinh nộp bài lớp học');
    var sheetCS = ss.getSheetByName('Học sinh lớp học');
    if (!sheetHW) return { error: 'Chưa có sheet Bài tập lớp học' };
    
    // Tổng số HS trong lớp
    var totalStudents = 0;
    var studentNames = {}; // studentId -> studentName
    if (sheetCS) {
      var dataCS = sheetCS.getDataRange().getDisplayValues();
      for (var s = 1; s < dataCS.length; s++) {
        if (dataCS[s][2] === classId && !dataCS[s][9]) { // Cột C=classId, J=ngày xóa
          totalStudents++;
          studentNames[dataCS[s][0]] = dataCS[s][1]; // studentId -> name
        }
      }
    }
    
    // Đọc tất cả bài nộp của lớp
    var subsByHwId = {}; // hwId -> [submissions]
    if (sheetSub) {
      var dataSub = sheetSub.getDataRange().getDisplayValues();
      for (var j = 1; j < dataSub.length; j++) {
        if (String(dataSub[j][2]).trim() !== String(classId).trim()) continue;
        var hwId = dataSub[j][1];
        if (!subsByHwId[hwId]) subsByHwId[hwId] = [];
        subsByHwId[hwId].push({
          subId:       dataSub[j][0],
          studentId:   dataSub[j][4],
          studentName: dataSub[j][5],
          timestamp:   dataSub[j][7],
          fileUrl:     dataSub[j][8],
          score:       dataSub[j][9] || '',
          comment:     dataSub[j][10] || '',
          rowIndex:    j + 1
        });
      }
    }
    
    // Ghép bài tập + bài nộp
    var dataHW = sheetHW.getDataRange().getDisplayValues();
    var result = [];
    for (var i = 1; i < dataHW.length; i++) {
      if (String(dataHW[i][1]).trim() !== String(classId).trim()) continue;
      if (dataHW[i][9] && String(dataHW[i][9]).trim() !== '') continue; // đã xóa
      var hwId = dataHW[i][0];
      var subs = subsByHwId[hwId] || [];

      var submittedIds = {};
      for (var k = 0; k < subs.length; k++) {
        submittedIds[subs[k].studentId] = true;
      }
      
      var unsubmitted = [];
      for (var sId in studentNames) {
        if (!submittedIds[sId]) {
          unsubmitted.push({
            studentId: sId,
            studentName: studentNames[sId]
          });
        }
      }

      result.push({
        hwId:          hwId,
        title:         dataHW[i][4],
        subject:       dataHW[i][3],
        releaseDate:   dataHW[i][5],
        fileUrl:       dataHW[i][6],
        fileName:      dataHW[i][7],
        externalLink:  dataHW[i][8],
        totalStudents: totalStudents,
        submissions:   subs,
        unsubmitted:   unsubmitted
      });
    }
    // Sắp xếp mới nhất lên đầu
    result.sort(function(a,b){ return (b.releaseDate > a.releaseDate) ? 1 : -1; });
    return { success: true, homeworks: result };
  } catch(e) {
    return { error: e.toString() };
  }
}

/**
 * Giáo viên chấm điểm bài nộp (ghi điểm + nhận xét vào sheet)
 */
function gradeSubmission(subId, score, comment) {
  try {
    var ss = (typeof getClassSpreadsheet === 'function') ? getClassSpreadsheet() : SpreadsheetApp.getActiveSpreadsheet();
    var sheetSub = ss.getSheetByName('Học sinh nộp bài lớp học');
    if (!sheetSub) return { error: 'Không tìm thấy sheet bài nộp' };
    var data = sheetSub.getDataRange().getDisplayValues();
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][0]).trim() === String(subId).trim()) {
        sheetSub.getRange(i + 1, 10).setValue(score || '');   // Cột J = Điểm số
        sheetSub.getRange(i + 1, 11).setValue(comment || ''); // Cột K = Nhận xét GV
        SpreadsheetApp.flush();
        return { success: true };
      }
    }
    return { error: 'Không tìm thấy bài nộp với subId: ' + subId };
  } catch(e) {
    return { error: e.toString() };
  }
}

function editClassHomework(hwId, subject, title, releaseDate, link, base64, fName, mType) {
  var ss = (typeof getClassSpreadsheet === 'function') ? getClassSpreadsheet() : SpreadsheetApp.getActiveSpreadsheet();
  var sheet = getOrCreateHomeworkSheet(ss);
  var data = sheet.getDataRange().getValues();
  
  var targetRow = -1;
  var classId = "";
  var existingFileUrl = "";
  var existingFName = "";
  
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim() === String(hwId).trim()) {
      targetRow = i + 1;
      classId = data[i][1];
      existingFileUrl = data[i][6];
      existingFName = data[i][7];
      break;
    }
  }
  
  if (targetRow === -1) return { error: "Không tìm thấy bài tập" };
  
  var fileUrl = existingFileUrl;
  var finalFName = existingFName;
  
  if (base64 && fName) {
    try {
      fileUrl = uploadHomeworkFileToDrive(base64, fName, mType);
      finalFName = fName;
    } catch(e) {
      return { error: "Lỗi upload file: " + e.toString() };
    }
  }
  
  if (subject !== undefined && subject !== null) {
    sheet.getRange(targetRow, 4).setValue(subject || ""); // col 4: subject
  }
  sheet.getRange(targetRow, 5).setValue(title || "");        // col 5: title
  sheet.getRange(targetRow, 6).setValue(releaseDate || ""); // col 6: releaseDate
  sheet.getRange(targetRow, 9).setValue(link || "");        // col 9: link
  if (base64 && fName) {
    sheet.getRange(targetRow, 7).setValue(fileUrl || "");
    sheet.getRange(targetRow, 8).setValue(finalFName || "");
  }
  
  if (classId && typeof clearClassCache === 'function') clearClassCache(classId, "hw");
  SpreadsheetApp.flush();
  
  return { success: true };
}

function deleteClassHomework(hwId) {
  var ss = (typeof getClassSpreadsheet === 'function') ? getClassSpreadsheet() : SpreadsheetApp.getActiveSpreadsheet();
  var sheet = getOrCreateHomeworkSheet(ss);
  var data = sheet.getDataRange().getValues();
  
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim() === String(hwId).trim()) {
      var tz = (typeof getScriptTimeZoneSafe === 'function') ? getScriptTimeZoneSafe() : 'Asia/Ho_Chi_Minh';
      var nowStr = Utilities.formatDate(new Date(), tz, "dd/MM/yyyy HH:mm");
      sheet.getRange(i + 1, 10).setValue(nowStr); // Soft delete (Col J = 10)
      var classId = data[i][1];
      if (classId && typeof clearClassCache === 'function') clearClassCache(classId, "hw");
      clearStudentCacheForClass(ss, classId); // Xóa cache học sinh ngay lập tức
      SpreadsheetApp.flush();
      return { success: true };
    }
  }
  return { error: "Không tìm thấy bài tập" };
}

function getDeletedClassHomeworkList(classId) {
  var ss = (typeof getClassSpreadsheet === 'function') ? getClassSpreadsheet() : SpreadsheetApp.getActiveSpreadsheet();
  var sheet = getOrCreateHomeworkSheet(ss);
  var data = sheet.getDataRange().getDisplayValues();
  var hwList = [];
  var cleanClassId = String(classId).trim();
  
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][1]).trim() === cleanClassId) {
      var deletedAt = String(data[i][9] || "").trim(); // Col J (Index 9)
      if (deletedAt !== "") {
        hwList.push({
          hwId: data[i][0],
          classId: data[i][1],
          className: data[i][2],
          title: data[i][4],
          subject: data[i][3],
          releaseDate: data[i][5],
          fileUrl: data[i][6],
          fileName: data[i][7],
          link: data[i][8],
          deletedAt: deletedAt
        });
      }
    }
  }
  return hwList;
}

function restoreClassHomework(hwId) {
  var ss = (typeof getClassSpreadsheet === 'function') ? getClassSpreadsheet() : SpreadsheetApp.getActiveSpreadsheet();
  var sheet = getOrCreateHomeworkSheet(ss);
  var data = sheet.getDataRange().getValues();
  
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim() === String(hwId).trim()) {
      sheet.getRange(i + 1, 10).setValue(""); // Clear soft delete
      var classId = data[i][1];
      if (classId && typeof clearClassCache === 'function') clearClassCache(classId, "hw");
      clearStudentCacheForClass(ss, classId); // Xóa cache học sinh
      SpreadsheetApp.flush();
      return { success: true };
    }
  }
  return { error: "Không tìm thấy bài tập" };
}

function purgeClassHomework(hwId) {
  var ss = (typeof getClassSpreadsheet === 'function') ? getClassSpreadsheet() : SpreadsheetApp.getActiveSpreadsheet();
  var sheet = getOrCreateHomeworkSheet(ss);
  var data = sheet.getDataRange().getValues();
  
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim() === String(hwId).trim()) {
      var classId = data[i][1];
      sheet.deleteRow(i + 1); // Hard delete
      if (classId && typeof clearClassCache === 'function') clearClassCache(classId, "hw");
      clearStudentCacheForClass(ss, classId); // Xóa cache học sinh
      SpreadsheetApp.flush();
      return { success: true };
    }
  }
  return { error: "Không tìm thấy bài tập" };
}

/**
 * Xóa cache cổng bài tập của TẤT CẢ học sinh trong lớp.
 * Gọi khi giáo viên thêm/xóa/phục hồi bài tập để học sinh thấy ngay.
 */
function clearStudentCacheForClass(ss, classId) {
  try {
    if (!classId || !ss) return;
    var sheetCS = ss.getSheetByName('Học sinh lớp học');
    if (!sheetCS) return;
    var data = sheetCS.getDataRange().getDisplayValues();
    var cache = CacheService.getScriptCache();
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][2]).trim() !== String(classId).trim()) continue;
      // data[i][7] = Mã bài tập (cột H) của học sinh
      var maBaiTap = String(data[i][7] || "").trim();
      if (maBaiTap) {
        cache.remove("student_hw_portal_" + maBaiTap.toUpperCase());
        cache.remove("student_hw_portal_" + maBaiTap.toLowerCase());
      }
    }
  } catch(e) {
    Logger.log("clearStudentCacheForClass lỗi: " + e.toString());
  }
}

// ============================================================================
// HÀM BACKEND CHO CỔNG NỘP BÀI TẬP HỌC VIÊN (homework.html)
// ============================================================================

function getOrCreateStudentSubmissionSheet(ss) {
  if (!ss) ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetName = 'Học sinh nộp bài lớp học';
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow([
      "Mã nộp bài", "Mã bài tập", "Mã lớp", "Môn học", "Mã học sinh", "Tên học sinh", "SĐT Phụ huynh", "Thời gian nộp", "File nộp (URL)", "Điểm số", "Nhận xét GV"
    ]);
    sheet.getRange(1, 1, 1, 11).setFontWeight("bold").setBackground("#8E4DFF").setFontColor("#FFFFFF");
  }
  return sheet;
}

/**
 * Xác thực Mã bài tập (hoặc Mã HS / SĐT) để đăng nhập cổng nộp bài tập
 */
