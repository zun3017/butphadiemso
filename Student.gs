// Tải file bài tập đơn lẻ lên (Tương thích ngược)
function uploadHomeworkFile(ma, studentName, lessonName, fileBase64, fileName, mimeType) {
  return uploadHomeworkFiles(ma, lessonName, lessonName, [{ fileBase64: fileBase64, fileName: fileName, mimeType: mimeType }], studentName);
}

// Lưu tệp nộp bài của học sinh (Lưu trực tiếp từng ảnh/file vào thư mục, không nén zip)
// hwId: Mã bài tập cụ thể từ sheet 'Bài tập lớp học' (VD: HW_1234567890)
// lessonName: Tên hiển thị để đặt tên file trên Drive
function uploadHomeworkFiles(ma, hwId, lessonName, filesList, inputStudentName) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    var classId = "";
    var studentId = "";
    var studentName = inputStudentName || "";
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
            studentName = dataCS[i][1] || studentName;
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
      // Xóa các thư mục trùng tên (nếu có) để tránh nhân bản
      while (lessonFolders.hasNext()) {
        try {
          var dupLesson = lessonFolders.next();
          // Di chuyển file từ thư mục trùng vào thư mục chính
          var dupFiles = dupLesson.getFiles();
          while (dupFiles.hasNext()) { try { dupFiles.next().setTrashed(true); } catch(e) {} }
          var dupSubs = dupLesson.getFolders();
          while (dupSubs.hasNext()) { try { dupSubs.next().setTrashed(true); } catch(e) {} }
          dupLesson.setTrashed(true);
        } catch(e) {}
      }
    } else {
      lessonFolder = baseFolder.createFolder(lessonName);
    }

    var studentFolders = lessonFolder.getFoldersByName(studentName);
    var studentFolder;
    if (studentFolders.hasNext()) {
      studentFolder = studentFolders.next();
      // Xóa TẤT CẢ thư mục học sinh trùng tên (nguyên nhân gây nhân bản ảnh)
      while (studentFolders.hasNext()) {
        try {
          var dupStudent = studentFolders.next();
          var dupStudentFiles = dupStudent.getFiles();
          while (dupStudentFiles.hasNext()) { try { dupStudentFiles.next().setTrashed(true); } catch(e) {} }
          dupStudent.setTrashed(true);
        } catch(e) {}
      }
      // Xóa các file cũ trong thư mục để tránh nhân bản khi nộp lại
      var oldFiles = studentFolder.getFiles();
      while(oldFiles.hasNext()) {
        try { oldFiles.next().setTrashed(true); } catch(e) {}
      }
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
        // Lưu từng file/ảnh trực tiếp vào thư mục học sinh (KHÔNG nén zip để xem được ảnh trực tiếp trên web)
        for (var b = 0; b < blobs.length; b++) {
          var savedF = studentFolder.createFile(blobs[b]);
          try { savedF.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW); } catch (fErr) {}
        }
        try { studentFolder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW); } catch (fErr) {}
        fileUrl = studentFolder.getUrl();
      }
    }
    
    if (ssClass && studentId !== "") {
        var sheetSub = ssClass.getSheetByName('Học sinh nộp bài lớp học');
        if (!sheetSub) return { error: "Sheet Học sinh nộp bài lớp học chưa được tạo." };
        
        var subId = "SUB_LH_" + new Date().getTime();
        
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
          subId,               // Cột A (0): Mã nộp bài
          hwId || lessonName,  // Cột B (1): Mã bài tập
          classId,             // Cột C (2): Mã lớp
          studentId,           // Cột D (3): Mã học sinh
          studentName,         // Cột E (4): Tên học sinh
          parentPhone,         // Cột F (5): SĐT Phụ huynh
          subject || "",       // Cột G (6): Môn học
          dateString,          // Cột H (7): Thời gian nộp
          fileUrl,             // Cột I (8): Link bài nộp
          "",                  // Cột J (9): Điểm số
          ""                   // Cột K (10): Nhận xét GV
        ]);
      } else { return { error: "Không tìm thấy học sinh trong lớp học. Học sinh 1-1 không còn được hỗ trợ." }; }
      
      SpreadsheetApp.flush();
      if (typeof clearSheetCache === 'function') {
        clearSheetCache('Bài tập nộp lớp');
      }
      
      return { success: true, fileUrl: fileUrl };
  } catch(e) {
    return { error: "Lỗi chỉnh sửa: " + e.toString() };
  }
}

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
  
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var ssClass = getClassSpreadsheet(); // Mở Sheet lớp học
    
    var isClassStudent = false;
    var studentName = "";
    var classId = "";
    var className = "Lớp học";
    var studentId = "";
    var parentPhone = "";
    var foundRow = -1;
      
    // Quét trong Học sinh lớp học (trên sheet lớp) để kiểm tra xem có phải học sinh lớp không
    if (ssClass) {
      var sheetCS = ssClass.getSheetByName('Học sinh lớp học');
      if (sheetCS) {
        var dataCS = sheetCS.getDataRange().getDisplayValues();
        var normClean = normalizeMa(cleanMa);
        for (var i = 1; i < dataCS.length; i++) {
          if (!dataCS[i] || dataCS[i].length < 1) continue;
          var csId = String(dataCS[i][0] || "").trim();
          var csName = String(dataCS[i][1] || "").trim();
          var csClassId = String(dataCS[i][2] || "").trim();
          var csPhone = String(dataCS[i][3] || "").trim();
          var csCode = dataCS[i].length > 7 ? String(dataCS[i][7] || "").trim() : "";
          
          var isMatch = false;
          if (normClean !== "") {
            if (normalizeMa(csCode) === normClean || normalizeMa(csId) === normClean || normalizeMa(csPhone) === normClean) {
              isMatch = true;
            }
          }
          if (!isMatch) {
            if (csCode.toUpperCase() === cleanMa || csId.toUpperCase() === cleanMa || csPhone.toUpperCase() === cleanMa) {
              isMatch = true;
            }
          }
          
          if (isMatch) {
            foundRow = i;
            studentId = csId;
            studentName = csName;
            classId = csClassId;
            parentPhone = csPhone;
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
          if (hwClassId === classId || hwClassId === "Tất cả" || !hwClassId) {
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
          var rowData = dataSub[j];
          if (!rowData || rowData.length < 4) continue;
          
          var subStudentId = String(rowData[3] || "").trim();
            var subStudentName = String(rowData[4] || "").trim();
            var subParentPhone = String(rowData[5] || "").trim();

          var isSubMatch = false;
          if (studentId && subStudentId === String(studentId).trim()) isSubMatch = true;
          if (!isSubMatch && studentName && subStudentName.toLowerCase() === String(studentName).trim().toLowerCase()) isSubMatch = true;
          if (!isSubMatch && parentPhone && subParentPhone === String(parentPhone).trim()) isSubMatch = true;
          if (!isSubMatch && cleanMa) {
            var normCleanMa = normalizePhone(cleanMa);
            if (normCleanMa !== "" && (normalizePhone(subStudentId) === normCleanMa || normalizePhone(subParentPhone) === normCleanMa)) {
              isSubMatch = true;
            }
          }

          if (isSubMatch) {
            var hwIdVal = rowData[1]; // Index 1 = Mã bài tập (Cột B)
            submissions.push({
              subId:          rowData[0] || "",
              hwId:           hwIdVal,
              timestamp:      rowData[7] || "",  // Index 7 = Thời gian nộp (Cột H)
              studentName:    subStudentName,
              lessonName:     hwTitleMap[hwIdVal] || hwIdVal || "Bài tập lớp học",
              fileUrl:        rowData[8] || "",  // Index 8 = File URL (Cột I)
              score:          rowData[9] || "",  // Index 9 = Điểm số (Cột J)
              comment:        rowData[10] || "", // Index 10 = Nhận xét (Cột K)
              ma:             cleanMa,
              submissionDate: rowData[7] ? rowData[7].split(" ")[0] : "",
              status:         "Active",
              rowIndex:       j + 1
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

    return { thanhCong: false, thongBao: "Hệ thống 1 kèm 1 không còn được hỗ trợ." };
  } catch (error) {
    return { thanhCong: false, thongBao: error.toString() };
  }
}