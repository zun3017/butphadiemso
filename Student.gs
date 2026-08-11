

// Tải file bài tập đơn lẻ lên (Tương thích ngược)
function uploadHomeworkFile(ma, studentName, lessonName, fileBase64, fileName, mimeType) {
  return uploadHomeworkFiles(ma, lessonName, lessonName, [{ fileBase64: fileBase64, fileName: fileName, mimeType: mimeType }]);
}

// Lưu tệp nộp bài của học sinh (Hỗ trợ nén nhiều ảnh thành 1 file ZIP)
// hwId: Mã bài tập cụ thể từ sheet 'Bài tập lớp học' (VD: HW_1234567890)
// lessonName: Tên hiển thị để đặt tên file trên Drive
function uploadHomeworkFiles(ma, hwId, lessonName, filesList) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    var classId = "";
    var studentId = "";
    var studentName = "";
    var rawMa = String(ma || "").trim().toLowerCase();
    var normMa = normalizePhone(ma);
    
    var ssClass = getClassSpreadsheet();
    if (ssClass) {
      var sheetHW = ssClass.getSheetByName('Bài tập lớp học');
      if (sheetHW) {
        var dataHW = sheetHW.getDataRange().getDisplayValues();
        for (var h = 1; h < dataHW.length; h++) {
          if (String(dataHW[h][0]).trim().toLowerCase() === rawMa) {
            classId = dataHW[h][1];
            break;
          }
        }
      }

      var sheetCS = ssClass.getSheetByName('Học sinh lớp học');
      if (sheetCS) {
        var dataCS = sheetCS.getDataRange().getDisplayValues();
        for (var i = 1; i < dataCS.length; i++) {
          if (!dataCS[i] || dataCS[i].length < 1) continue;
          var delDateCS = (dataCS[i].length > 8) ? String(dataCS[i][8]).trim() : "";
          if (delDateCS !== "") continue; // Bỏ qua học sinh nằm trong Thùng rác

          var csId = String(dataCS[i][0] || "").trim();
          var csPhone = String(dataCS[i][3] || "").trim();
          var csHwCode = String(dataCS[i][7] || "").trim();

          var normCsPhone = normalizePhone(csPhone);
          var normCsHwCode = normalizePhone(csHwCode);
          var normCsId = normalizePhone(csId);

          var isMatch = false;
          if (normMa !== "") {
            if (normCsPhone !== "" && normCsPhone === normMa) isMatch = true;
            else if (normCsHwCode !== "" && normCsHwCode === normMa) isMatch = true;
            else if (normCsId !== "" && normCsId === normMa) isMatch = true;
          }
          if (!isMatch && rawMa !== "") {
            if (csPhone.toLowerCase() === rawMa) isMatch = true;
            else if (csHwCode.toLowerCase() === rawMa) isMatch = true;
            else if (csId.toLowerCase() === rawMa) isMatch = true;
          }

          if (isMatch) {
            studentId = dataCS[i][0];
            studentName = studentName || dataCS[i][1];
            classId = dataCS[i][2];
            break;
          }
        }
      }
    }
    
    var className = "Lớp học không tên";
    var subject = "";
    if (classId && ssClass) {
      var sheetClassList = ssClass.getSheetByName('Danh sách lớp học') || ss.getSheetByName('Mã lớp học');
      if (sheetClassList) {
        var dataClassList = sheetClassList.getDataRange().getDisplayValues();
        for (var c = 1; c < dataClassList.length; c++) {
          if (dataClassList[c][0] === classId) {
            className = dataClassList[c][1];
            break;
          }
        }
      }
      // Tra cứu môn học từ bài tập (hwId)
      var sheetHWList = ssClass.getSheetByName('Bài tập lớp học');
      if (sheetHWList && hwId) {
        var dataHWList = sheetHWList.getDataRange().getDisplayValues();
        for (var h2 = 1; h2 < dataHWList.length; h2++) {
          if (String(dataHWList[h2][0]).trim() === String(hwId).trim()) {
            subject = dataHWList[h2][3] || ""; // Cột D = Môn học
            if (!lessonName) lessonName = dataHWList[h2][4] || ""; // Cột E = Tên bài tập
            break;
          }
        }
      }
    }

    var parentFolder;
    var driveApp = DriveApp;
    var folders = driveApp.getRootFolder().getFoldersByName("HỌC SINH NỘP BÀI");
    if (folders.hasNext()) {
      parentFolder = folders.next();
    } else {
      parentFolder = driveApp.getRootFolder().createFolder("HỌC SINH NỘP BÀI");
    }
    
    var baseFolder = parentFolder;
    var classFolders = baseFolder.getFoldersByName(className);
    if (classFolders.hasNext()) {
      baseFolder = classFolders.next();
    } else {
      baseFolder = baseFolder.createFolder(className);
    }

    var lessonFolders = baseFolder.getFoldersByName(lessonName);
    var lessonFolder;
    if (lessonFolders.hasNext()) {
      lessonFolder = lessonFolders.next();
    } else {
      lessonFolder = baseFolder.createFolder(lessonName);
    }

    var studentFolders = lessonFolder.getFoldersByName(studentName);
    var studentFolder;
    if (studentFolders.hasNext()) {
      studentFolder = studentFolders.next();
    } else {
      studentFolder = lessonFolder.createFolder(studentName);
    }
    
    var now = new Date();
    var shortDateString = Utilities.formatDate(now, Session.getScriptTimeZone(), "dd/MM/yyyy");
    var dateString = Utilities.formatDate(now, Session.getScriptTimeZone(), "dd/MM/yyyy HH:mm:ss");
    
    var fileUrl = "";
    
    if (filesList && filesList.length > 0) {
      var blobs = [];
      for (var i = 0; i < filesList.length; i++) {
        var fileObj = filesList[i];
        if (!fileObj || !fileObj.fileBase64) continue;
        
        var fileData = Utilities.base64Decode(fileObj.fileBase64);
        var ext = "";
        var lastDot = fileObj.fileName.lastIndexOf(".");
        if (lastDot !== -1) {
          ext = fileObj.fileName.substring(lastDot);
        } else {
          if (fileObj.mimeType === "application/pdf") ext = ".pdf";
          else if (fileObj.mimeType === "image/png") ext = ".png";
          else if (fileObj.mimeType === "image/jpeg" || fileObj.mimeType === "image/jpg") ext = ".jpg";
          else if (fileObj.mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") ext = ".docx";
        }
        
        var newFileName = studentName + " - " + shortDateString.split('/').join('-') + " - " + lessonName + (filesList.length > 1 ? (" - " + (i + 1)) : "") + ext;
        blobs.push(Utilities.newBlob(fileData, fileObj.mimeType, newFileName));
      }
      
      if (blobs.length === 1) {
        var singleFile = studentFolder.createFile(blobs[0]);
        try { singleFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW); } catch (fErr) {}
        fileUrl = singleFile.getUrl();
      } else if (blobs.length > 1) {
        var zipName = studentName + " - " + shortDateString.split('/').join('-') + " - " + lessonName + ".zip";
        var zipBlob = Utilities.zip(blobs, zipName);
        var zipFile = studentFolder.createFile(zipBlob);
        try { zipFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW); } catch (fErr) {}
        fileUrl = zipFile.getUrl();
      }
    }
    
    if (ssClass) {
      var sheetSub = ssClass.getSheetByName('Học sinh nộp bài lớp học');
      if (!sheetSub) return { error: "Sheet Học sinh nộp bài lớp học chưa được tạo." };
      
      var subId = "SUB_LH_" + new Date().getTime();
      
      // Lấy SĐT Phụ huynh
      var parentPhone = "";
      var sheetCS = ssClass.getSheetByName('Học sinh lớp học');
      if (sheetCS) {
        var dataCS = sheetCS.getDataRange().getDisplayValues();
        for (var i = 1; i < dataCS.length; i++) {
          if (dataCS[i][0] === studentId) {
            parentPhone = dataCS[i][3] || "";
            break;
          }
        }
      }
      
      sheetSub.appendRow([
        subId,
        hwId || lessonName,  // Mã bài tập (hwId thực sự)
        classId,             // Mã lớp
        subject || "",       // Môn học (lấy từ bài tập)
        studentId,           // Mã học sinh
        studentName,         // Tên học sinh
        parentPhone,         // SĐT Phụ huynh
        dateString,          // Thời gian nộp
        fileUrl,             // Link bài nộp
        "",                  // Điểm số
        ""                   // Nhận xét Giáo viên
      ]);
      
      if (typeof clearHomeworkPortalCache === 'function') {
        try { clearHomeworkPortalCache(ma); } catch(e) {}
      }
      
      return {
        success: true,
        fileUrl: fileUrl,
        submissionDate: shortDateString,
        timestamp: dateString,
        status: "Active",
        rowIndex: sheetSub.getLastRow()
      };
    } else {
      return { error: "Không tìm thấy dữ liệu lớp học!" };
    }

  } catch (e) {
    return { error: "Lỗi hệ thống: " + e.toString() };
  }
}

// Chỉnh sửa bài tập đã nộp
function editHomeworkFile(rowIndex, lessonName, fileBase64OrList, fileName, mimeType) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var r = parseInt(rowIndex);

    var ssClass = getClassSpreadsheet();
    if (!ssClass) return { error: "Không tìm thấy dữ liệu lớp học!" };
    
    var sheetSub = ssClass.getSheetByName('Học sinh nộp bài lớp học');
    if (!sheetSub) return { error: "Không tìm thấy dữ liệu bài nộp lớp học!" };
    
    var data = sheetSub.getDataRange().getDisplayValues();
    if (isNaN(r) || r < 2 || r > data.length) {
      return { error: "Vị trí dòng không hợp lệ." };
    }
    
    var studentName = data[r - 1][4];
    var oldUrl = data[r - 1][6];
    
    sheetSub.getRange(r, 2).setValue(lessonName);
    var fileUrl = oldUrl;
    
    var filesList = [];
    if (Array.isArray(fileBase64OrList)) {
      filesList = fileBase64OrList;
    } else if (fileBase64OrList && fileName) {
      filesList = [{ fileBase64: fileBase64OrList, fileName: fileName, mimeType: mimeType }];
    }
    
    if (filesList && filesList.length > 0) {
      var driveApp = DriveApp;
      if (oldUrl) {
        var matches = oldUrl.match(/[-\w]{25,}/);
        if (matches && matches[0]) {
          try {
            if (oldUrl.indexOf("/folders/") !== -1 || oldUrl.indexOf("/drive/folders/") !== -1) {
              driveApp.getFolderById(matches[0]).setTrashed(true);
            } else {
              driveApp.getFileById(matches[0]).setTrashed(true);
            }
          } catch (deleteErr) {
            Logger.log("Không thể dọn dẹp tệp cũ: " + deleteErr.toString());
          }
        }
      }
      var classId = "";
      if (sheetSub) {
        var cData = sheetSub.getDataRange().getValues();
        for (var i = 1; i < cData.length; i++) {
          if (String(cData[i][0]).trim() === ma) {
            classId = String(cData[i][1]).trim(); // Mã lớp là cột 2 (index 1)
            break;
          }
        }
      }
      var className = "Lớp không xác định";
      var sheetClassList = ssClass.getSheetByName('Danh sách lớp học') || ssClass.getSheetByName('Mã lớp học');
      if (sheetClassList && classId) {
        var dataClassList = sheetClassList.getDataRange().getDisplayValues();
        for (var c = 1; c < dataClassList.length; c++) {
          if (dataClassList[c][0] === classId) {
            className = dataClassList[c][1];
            break;
          }
        }
      }
      
      var parentFolder;
      var folders = driveApp.getRootFolder().getFoldersByName("HỌC SINH NỘP BÀI");
      if (folders.hasNext()) parentFolder = folders.next();
      else parentFolder = driveApp.getRootFolder().createFolder("HỌC SINH NỘP BÀI");
      
      var baseFolder = parentFolder;
      var classFolders = baseFolder.getFoldersByName(className);
      if (classFolders.hasNext()) baseFolder = classFolders.next();
      else baseFolder = baseFolder.createFolder(className);
      
      var studentFolders = baseFolder.getFoldersByName(studentName);
      var studentFolder;
      if (studentFolders.hasNext()) studentFolder = studentFolders.next();
      else studentFolder = baseFolder.createFolder(studentName);
      
      var now = new Date();
      var shortDateString = Utilities.formatDate(now, Session.getScriptTimeZone(), "dd/MM/yyyy");
      var blobs = [];
      for (var i = 0; i < filesList.length; i++) {
        var fileObj = filesList[i];
        if (!fileObj || !fileObj.fileBase64) continue;
        
        var fileData = Utilities.base64Decode(fileObj.fileBase64);
        var ext = "";
        var lastDot = fileObj.fileName.lastIndexOf(".");
        if (lastDot !== -1) ext = fileObj.fileName.substring(lastDot);
        else {
          if (fileObj.mimeType === "application/pdf") ext = ".pdf";
          else if (fileObj.mimeType === "image/png") ext = ".png";
          else ext = ".jpg";
        }
        var newFileName = studentName + " - " + shortDateString.split('/').join('-') + " - " + lessonName + (filesList.length > 1 ? (" - " + (i + 1)) : "") + ext;
        blobs.push(Utilities.newBlob(fileData, fileObj.mimeType, newFileName));
      }
      
      if (blobs.length === 1) {
        var singleFile = studentFolder.createFile(blobs[0]);
        try { singleFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW); } catch (fErr) {}
        fileUrl = singleFile.getUrl();
      } else if (blobs.length > 1) {
        var zipName = studentName + " - " + shortDateString.split('/').join('-') + " - " + lessonName + ".zip";
        var zipBlob = Utilities.zip(blobs, zipName);
        var zipFile = studentFolder.createFile(zipBlob);
        try { zipFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW); } catch (fErr) {}
        fileUrl = zipFile.getUrl();
      }
      
      sheetSub.getRange(r, 7).setValue(fileUrl);
    }
    
    SpreadsheetApp.flush();
    clearSheetCache('Bài tập nộp lớp');
    
    return { success: true, fileUrl: fileUrl };
  } catch(e) {
    return { error: "Lỗi chỉnh sửa: " + e.toString() };
  }
}

// Xóa tạm thời bài nộp của học sinh
function deleteHomeworkFile(rowIndex) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheetHW = getOrCreateStudentSubmissionSheet(ss);
    var data = sheetHW.getDataRange().getDisplayValues();
    if (rowIndex > 0 && rowIndex <= data.length) {
      sheetHW.getRange(rowIndex, 9).setValue("Deleted"); // Update status to Deleted (wait, column 9 is fileUrl. Status is gone!)
      // Actually let's just delete the row or mark it. Since we removed Status column, we should just delete the row or add 'Ngày xóa' to column 12.
      // Wait, let's mark it in a non-existent column, or just write Trash Log and delete the row.
      var rowData = data[rowIndex - 1];
      writeTrashLog(ss, "Bài tập", "Xóa", {
        ma: rowData[1],
        studentName: rowData[5],
        lessonName: rowData[1],
        rowJson: JSON.stringify(rowData)
      });
      sheetHW.deleteRow(rowIndex);
      return { success: true, message: "Đã xóa bài tập thành công!" };
    }
    return { error: "Không tìm thấy dòng bài tập" };
  } catch (e) {
    return { error: "Lỗi hệ thống: " + e.toString() };
  }
}

// Khôi phục bài nộp từ Thùng rác
function restoreHomeworkFile(rowIndex) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var r = parseInt(rowIndex);
    
    var ssClass = getClassSpreadsheet();
    var sheetSub = ssClass ? ssClass.getSheetByName('Học sinh nộp bài lớp học') : null;
    
    // Nếu là Học sinh lớp học và đã bị xóa dòng, không khôi phục được nữa
    if (sheetSub) {
      var dataSub = sheetSub.getDataRange().getDisplayValues();
      if (!isNaN(r) && r >= 2 && r <= dataSub.length) {
        return { error: "Không hỗ trợ khôi phục bài nộp lớp học trực tiếp, vui lòng nộp lại bài tập." };
      }
    }
    
    var sheetHW = initHomeworkSheet(ss);
    var hwHeaders = getHeaderIndices(sheetHW);
    var data = sheetHW.getDataRange().getValues();
    if (isNaN(r) || r < 2 || r > data.length) {
      return { error: "Vị trí dòng không hợp lệ." };
    }
    
    var colDateIdx = hwHeaders["Ngày nộp"] !== undefined ? hwHeaders["Ngày nộp"] : 5;
    var colStatusIdx = hwHeaders["Trạng thái nộp"] !== undefined ? hwHeaders["Trạng thái nộp"] : 6;
    var colMaIdx = hwHeaders["Mã bài tập"] !== undefined ? hwHeaders["Mã bài tập"] : 4;
    
    var now = new Date();
    var todayStr = Utilities.formatDate(now, Session.getScriptTimeZone(), "dd/MM/yyyy");
    var submissionDateStr = sheetHW.getRange(r, colDateIdx + 1).getDisplayValue().trim();
    var ma = data[r - 1][colMaIdx];
    
    if (submissionDateStr !== todayStr) {
      return { error: "Đã quá hạn khôi phục (chỉ được khôi phục trong ngày nộp)." };
    }
    
    sheetHW.getRange(r, colStatusIdx + 1).setValue("Active").setFontFamily("Arial");
    writeTrashLog(ss, "Bài tập", "Khôi phục bài tập", data[r - 1]);
    
    clearSheetCache('Bài tập');
    clearHomeworkPortalCache(ma);
    
    return { success: true };
  } catch (e) {
    return { error: "Lỗi hệ thống: " + e.toString() };
  }
}

// Đã xóa hàm bóng ma traCuuDuLieuHocSinhLop trùng lặp để chạy bản chuẩn trong Class.gs

// Hết file Student.gs


function xacThucMaBaiTap(ma) {
  var cleanMa = String(ma).trim().toUpperCase();
  if (cleanMa === "") {
    return { timThay: false, thongBao: "Vui lòng nhập mã bài tập của học sinh!" };
  }
  
  // Kiểm tra bộ nhớ đệm trước
  var cache = CacheService.getScriptCache();
  var cacheKey = "student_hw_portal_" + normalizeMa(cleanMa);
  var cached = cache.get(cacheKey);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch(e) {
      Logger.log("Lỗi parse cache homework portal: " + e.toString());
    }
  }

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var ssClass = getClassSpreadsheet(); // Mở Sheet lớp học
    
    // 1. Quét tìm học sinh 1-1 trước
    var sheetHS = ss.getSheetByName('Mã học sinh');
    var isClassStudent = false;
    var studentName = "";
    var classId = "";
    var className = "Lớp học";
    var studentId = "";
    var foundRow = -1;
    
    if (sheetHS) {
      var dataHS = getSheetDisplayValuesCached('Mã học sinh');
      for (var i = 1; i < dataHS.length; i++) {
        if (dataHS[i].length > 7 && normalizeMa(dataHS[i][7]) === normalizeMa(cleanMa)) {
          foundRow = i;
          studentName = dataHS[i][2];
          break;
        }
      }
    }
    
    // 2. Nếu không tìm thấy, quét tiếp trong Học sinh lớp học (trên sheet lớp)
    if (foundRow === -1 && ssClass) {
      var sheetCS = ssClass.getSheetByName('Học sinh lớp học');
      if (sheetCS) {
        var dataCS = sheetCS.getDataRange().getDisplayValues();
        for (var i = 1; i < dataCS.length; i++) {
          if (dataCS[i].length > 7 && normalizeMa(dataCS[i][7]) === normalizeMa(cleanMa)) {
            foundRow = i;
            studentId = dataCS[i][0];
            studentName = dataCS[i][1];
            classId = dataCS[i][2];
            isClassStudent = true;
            break;
          }
        }
      }
    }
    
    if (foundRow === -1) {
      return { timThay: false, thongBao: "Mã bài tập không hợp lệ hoặc học sinh chưa được cấp mã!" };
    }

    if (isClassStudent && classId && ssClass) {
      var sheetClassList = ssClass.getSheetByName('Danh sách lớp học') || ssClass.getSheetByName('Mã lớp học');
      if (sheetClassList) {
        var dataClassList = sheetClassList.getDataRange().getDisplayValues();
        for (var c = 1; c < dataClassList.length; c++) {
          if (dataClassList[c][0] === classId) {
            className = dataClassList[c][1];
            break;
          }
        }
      }
    }
    
    var submissions = [];
    var assignedList = [];
    
    if (isClassStudent && ssClass) {
      // Đọc lịch sử bài nộp của lớp học nhóm từ sheet 'Học sinh nộp bài lớp học'
      var sheetSub = ssClass.getSheetByName('Học sinh nộp bài lớp học');
      var hwTitleMap = {};
      var sheetHwList = ssClass.getSheetByName('Bài tập lớp học');
      
      if (sheetHwList) {
        var dataHwList = sheetHwList.getDataRange().getDisplayValues();
        for (var k = 1; k < dataHwList.length; k++) {
          // Bỏ qua bài tập đã xóa (cột J - index 9 có ngày xóa)
          if (dataHwList[k][9] && String(dataHwList[k][9]).trim() !== '') continue;
          
          hwTitleMap[dataHwList[k][0]] = dataHwList[k][4]; // hwId -> Tên bài tập (cột E, index 4)
          
          var hwClassId = dataHwList[k][1] ? String(dataHwList[k][1]).trim() : "";
          if (hwClassId === classId) {
            assignedList.push({
              hwId:         dataHwList[k][0] || "",   // Cột A = Mã BT
              rowIndex:     k + 1,
              studentName:  studentName,
              subject:      dataHwList[k][3] || "",   // Cột D = Môn học
              title:        dataHwList[k][4] || "",   // Cột E = Tên bài tập
              releaseDate:  dataHwList[k][5] || "",   // Cột F = Ngày giao
              fileUrl:      dataHwList[k][6] || "",   // Cột G = File URL
              fileName:     dataHwList[k][7] || "",   // Cột H = Tên file
              externalLink: dataHwList[k][8] || ""    // Cột I = Link ngoài
            });
          }
        }
      }
      
      if (sheetSub) {
        var dataSub = sheetSub.getDataRange().getDisplayValues();
        for (var j = 1; j < dataSub.length; j++) {
          if (dataSub[j].length >= 9 && dataSub[j][4] === studentId) {  // Fix: index 4 = Mã học sinh
            var hwIdVal = dataSub[j][1]; // index 1 = Mã bài tập (hwId)
            submissions.push({
              subId:          dataSub[j][0] || "",
              hwId:           hwIdVal,
              timestamp:      dataSub[j][7] || "",  // Fix: index 7 = Thời gian nộp
              studentName:    dataSub[j][5] || "",  // Fix: index 5 = Tên học sinh
              lessonName:     hwTitleMap[hwIdVal] || hwIdVal || "Bài tập lớp học",
              fileUrl:        dataSub[j][8] || "",  // Fix: index 8 = File URL
              score:          dataSub[j][9] || "",  // index 9 = Điểm số
              comment:        dataSub[j][10] || "", // index 10 = Nhận xét GV
              ma:             cleanMa,
              submissionDate: dataSub[j][7] ? dataSub[j][7].split(" ")[0] : "",  // Fix: từ timestamp
              status:         "Active",
              rowIndex:       j + 1
            });
          }
        }
      }
    } else {
      // 1-1 Tutor logic
      var sheetHW = initHomeworkSheet(ss);
      var dataHW = getSheetDisplayValuesCached('Bài tập');
      var hwHeaders = getHeaderIndices(sheetHW);
      
      var colMa = hwHeaders["Mã bài tập"] !== undefined ? hwHeaders["Mã bài tập"] : 4;
      var colTime = hwHeaders["Thời gian nộp"] !== undefined ? hwHeaders["Thời gian nộp"] : 0;
      var colName = hwHeaders["Tên học sinh"] !== undefined ? hwHeaders["Tên học sinh"] : 1;
      var colLesson = hwHeaders["Tên bài học"] !== undefined ? hwHeaders["Tên bài học"] : 2;
      var colUrl = hwHeaders["Link Google Drive liên kết"] !== undefined ? hwHeaders["Link Google Drive liên kết"] : 3;
      var colDate = hwHeaders["Ngày nộp"] !== undefined ? hwHeaders["Ngày nộp"] : 5;
      var colStatus = hwHeaders["Trạng thái nộp"] !== undefined ? hwHeaders["Trạng thái nộp"] : 6;
      
      for (var j = 1; j < dataHW.length; j++) {
        if (dataHW[j].length > colMa && normalizeMa(dataHW[j][colMa]) === normalizeMa(cleanMa)) {
          submissions.push({
            timestamp: dataHW[j][colTime] || "",
            studentName: dataHW[j][colName] || "",
            lessonName: dataHW[j][colLesson] || "",
            fileUrl: dataHW[j][colUrl] || "",
            ma: dataHW[j][colMa] || "",
            submissionDate: dataHW[j][colDate] || "",
            status: dataHW[j][colStatus] || "Active",
            rowIndex: j + 1
          });
        }
      }
      
      var sheetAssigned = ss.getSheetByName('Bài tập giao');
      if (sheetAssigned) {
        var dataAssigned = getSheetDisplayValuesCached('Bài tập giao');
        for (var k = 1; k < dataAssigned.length; k++) {
          if (dataAssigned[k].length > 6 && normalizeMa(dataAssigned[k][5]) === normalizeMa(cleanMa) && dataAssigned[k][6] === "Active") {
            assignedList.push({
              rowIndex: k + 1,
              timestamp: dataAssigned[k][0],
              studentName: dataAssigned[k][1],
              title: dataAssigned[k][2],
              releaseDate: dataAssigned[k][3],
              fileUrl: dataAssigned[k][4],
              externalLink: dataAssigned[k].length > 9 ? dataAssigned[k][9] : ""
            });
          }
        }
      }
    }
    
    var result = {
      timThay: true,
      ma: cleanMa,
      studentName: studentName,
      submissions: submissions,
      assignedList: assignedList,
      isClassStudent: isClassStudent,
      classId: classId,
      className: className,
      studentId: studentId
    };
    
    try {
      cache.put(cacheKey, JSON.stringify(result), 600);
    } catch(e) {
      Logger.log("Lỗi ghi cache homework portal: " + e.toString());
    }
    
    return result;
  } catch (e) {
    return { timThay: false, thongBao: "Lỗi hệ thống: " + e.toString() };
  }
}

function guiPhanHoi(maHS, tenHocSinh, noiDung, isClass, classId, className) {
  try {
    var ssClass = (typeof getClassSpreadsheet === 'function') ? getClassSpreadsheet() : null;
    
    // TỰ ĐỘNG KIỂM TRA: Nếu không có cờ isClass từ frontend, tự dò trong sheet 'Học sinh lớp học'
    var isClassStudent = !!isClass;
    var targetClassId = classId || "";
    
    if (ssClass && !isClassStudent) {
      var sheetClassStudents = ssClass.getSheetByName('Học sinh lớp học');
      if (sheetClassStudents) {
        var dataCS = sheetClassStudents.getDataRange().getDisplayValues();
        var normHS = (typeof normalizePhone === 'function') ? normalizePhone(maHS) : String(maHS).trim();
        for (var i = 1; i < dataCS.length; i++) {
          if (!dataCS[i] || dataCS[i].length < 1) continue;
          var csId = String(dataCS[i][0] || "").trim();
          var csName = String(dataCS[i][1] || "").trim();
          var csClassId = String(dataCS[i][2] || "").trim();
          var csParentPhone = (typeof normalizePhone === 'function') ? normalizePhone(dataCS[i][3] || "") : String(dataCS[i][3]).trim();
          
          if (csId === maHS || csName === tenHocSinh || (normHS && csParentPhone === normHS)) {
            isClassStudent = true;
            if (!targetClassId) targetClassId = csClassId;
            break;
          }
        }
      }
    }

    // NẾU LÀ PHỤ HUYNH LỚP HỌC -> LƯU VÀO FILE LỚP HỌC
    if (isClassStudent && ssClass) {
      var sheetName = "Ý kiến Phụ huynh lớp học";
      var sFeedback = ssClass.getSheetByName(sheetName);
      if (!sFeedback) {
        sFeedback = ssClass.insertSheet(sheetName);
        sFeedback.appendRow(["Mã ý kiến", "Mã lớp", "SĐT Phụ huynh", "Tên học sinh", "Nội dung đóng góp", "Thời gian gửi"]);
        sFeedback.getRange(1, 1, 1, 6).setFontWeight("bold").setBackground("#8E4DFF").setFontColor("#FFFFFF");
      }
      var feedbackId = "YKIEN_" + new Date().getTime();
      sFeedback.appendRow([feedbackId, targetClassId, "'" + maHS, tenHocSinh, noiDung, new Date()]);
      cleanupOldFeedback(sFeedback, 5);
      return { thanhCong: true };
    }

    // NẾU LÀ GIA SƯ 1 KÈM 1 -> LƯU VÀO FILE TỔNG (MAIN)
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheetName = "Ý kiến phụ huynh";
    var sheet = ss.getSheetByName(sheetName);
    
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      sheet.appendRow(["Thời gian", "Số điện thoại học sinh", "Tên học sinh", "Ý kiến phản hồi phụ huynh"]);
      sheet.getRange(1, 1, 1, 4).setFontWeight("bold").setBackground("#f3f3f3");
    }
    
    sheet.appendRow([new Date(), "'" + maHS, tenHocSinh, noiDung]);
    cleanupOldFeedback(sheet, 0);
    
    var cache = CacheService.getScriptCache();
    var sheetHS = ss.getSheetByName('Mã học sinh');
    if (sheetHS) {
      var dataHS = getSheetDisplayValuesCached('Mã học sinh');
      var normHSPhone = normalizePhone(maHS);
      for (var i = 1; i < dataHS.length; i++) {
        if (normalizePhone(dataHS[i][3]) === normHSPhone) {
          var tutorPhone = dataHS[i][6];
          if (tutorPhone) {
            cache.remove("tutor_feedback_" + normalizePhone(tutorPhone));
          }
          break;
        }
      }
    }
    
    return { thanhCong: true };
  } catch (error) {
    return { thanhCong: false, thongBao: error.toString() };
  }
}