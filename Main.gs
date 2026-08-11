// ==========================================
// CENTRAL WEB APP ROUTER & AUTHENTICATION
// ==========================================

function doGet(e) {
  var page = (e && e.parameter && e.parameter.p) ? e.parameter.p : 'index';
  try {
    return HtmlService.createHtmlOutputFromFile(page)
        .setTitle('Quản lý & Tra cứu học tập')
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
        .addMetaTag('viewport', 'width=device-width, initial-scale=1');
  } catch (err) {
    try {
      return HtmlService.createHtmlOutputFromFile('Index')
          .setTitle('Quản lý & Tra cứu học tập')
          .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
          .addMetaTag('viewport', 'width=device-width, initial-scale=1');
    } catch (err2) {
      return HtmlService.createHtmlOutput(
        '<div style="font-family: sans-serif; padding: 30px; text-align: center;">' +
        '<h2 style="color: #EF4444;">⚠️ Lỗi chưa tạo file giao diện index trên Google Apps Script</h2>' +
        '<p style="color: #4B5563; font-size: 15px;">Trên trình duyệt Google Apps Script Editor online, bạn cần tạo thêm 1 file HTML đặt tên là <b>index</b> và dán nội dung từ file <code>index.html</code> vào nhé!</p>' +
        '</div>'
      );
    }
  }
}

// Xử lý CORS Preflight (OPTIONS request từ trình duyệt trước khi gửi POST)
function doOptions(e) {
  return ContentService.createTextOutput('')
      .setMimeType(ContentService.MimeType.TEXT);
}

// Helper: tạo response JSON với CORS headers
function _makeJsonResponse(obj) {
  return ContentService
      .createTextOutput(JSON.stringify(obj))
      .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var funcName, args;
    
    // Xử lý yêu cầu dạng FormData (để nhận File Blob lớn không bị giới hạn)
    if (e && e.parameter && e.parameter.isFormData === 'true') {
      funcName = e.parameter.functionName;
      // Dùng e.parameters cho an toàn đối với file Blob
      var uploadedFile = e.parameter.file;
      if (!uploadedFile && e.parameters && e.parameters.file && e.parameters.file.length > 0) {
        uploadedFile = e.parameters.file[0];
      }
      
      if (!uploadedFile) {
        return ContentService.createTextOutput(JSON.stringify({ 
          error: "Không tìm thấy file trong payload. Các tham số nhận được: " + JSON.stringify(Object.keys(e.parameter)) + " | parameters: " + JSON.stringify(Object.keys(e.parameters || {}))
        })).setMimeType(ContentService.MimeType.JSON);
      }
      
      args = [uploadedFile, e.parameter.tutorPhone];
    } else {
      // Xử lý yêu cầu dạng JSON (Mặc định của api.js)
      var contents = (e && e.postData && e.postData.contents) ? e.postData.contents : "{}";
      var data = JSON.parse(contents);
      funcName = data.functionName;
      args = data.arguments || [];
    }
    
    if (funcName && typeof this[funcName] === 'function') {
      // === WHITELIST BẢO MẬT: Chỉ cho phép các hàm được chỉ định ===
      var ALLOWED_FUNCTIONS = [
        // Xác thực & Đăng nhập
        'loginSystem', 'xacThucMaBaiTap', 'loginClassSystem',
        // Lớp học - Giáo viên đọc
        'getClassList', 'getClassRosterAndEval', 'getClassLessonLogs',
        'getClassHomeworkList', 'getClassTuitionOverview', 'getClassSubmissions',
        'getClassTutorFeedback', 'getClassAnnouncement',
        // Lớp học - Giáo viên ghi
        'saveClassAttendance', 'saveClassLessonLog', 'addClassHomework', 'saveClassHomework',
        'deleteClassHomework', 'updateClassStudent', 'saveClassAnnouncement',
        'addStudentToClass', 'removeStudentFromClass', 'updateTuitionRecord',
        'getClassSubmissionsGrouped', 'gradeSubmission',
        // Bài tập học sinh
        'submitHomework', 'getHomeworkHistory', 'guiPhanHoi', 'editHomeworkFile',
        // Đề thi
        'saveAzotaExam', 'uploadAndCreateExam', 'uploadAndCreateExamRaw',
        'getAssignedExamsForClass', 'getExamForStudent',
        'submitExamResult', 'assignExamToClass', 'getTeacherExams',
        'updateExamStatus', 'extractAllExamFiguresBatch', 'debugExamFigures',
        // Admin
        'getAdminDashboardData', 'adminLuuGiaSu', 'adminLuuHocSinh',
        'adminXacNhanDongTienTutor', 'adminSetTutorStatus', 'adminLuuMarquee',
        'adminCapNhatTaiKhoan', 'xoaGiaSuTamThoi', 'khoiPhucGiaSu',
        // Các hàm bổ sung từ kết quả quét tự động Toàn Hệ Thống
        'createClass', 'createHomework', 'deleteClass', 'deleteClassLessonLog', 'deleteClassStudent', 'deleteClassStudentPermanently', 'deleteHomeworkFile', 'editClassHomework', 'getClassDashboardData', 'getClassStudents', 'getClassTrashItems', 'getClassTrashStudents', 'getDeletedClassHomeworkList', 'getExamResults', 'getHomeworkList', 'markClassInvoiceBulkPaid', 'purgeClassHomework', 'purgeClassItem', 'restoreClassHomework', 'restoreClassItem', 'restoreClassStudent', 'restoreHomeworkFile', 'saveClassStudent', 'updateClassInfo', 'updateClassStudentPaymentStatus', 'updateClassStudentPaymentStatusBulk', 'updateMultipleStudentsPaymentStatus', 'updateTutorAccountInfo', 'uploadHomeworkFiles',
        // Video Khóa Học
        'addVideo', 'getVideoList', 'getVideoFilterOptions', 'updateVideo', 'deleteVideo',
        'createCourse', 'getCourseList', 'toggleCourseStatus', 'deleteCourse', 'updateCourse',
        'checkLoginCode', 'getCourseVideos', 'logCourseAccess',
        'saveStudentNote', 'getStudentNotes',
      ];
      if (ALLOWED_FUNCTIONS.indexOf(funcName) === -1) {
        return ContentService.createTextOutput(JSON.stringify({
          error: "Hàm '" + funcName + "' không được phép gọi từ client."
        })).setMimeType(ContentService.MimeType.JSON);
      }
      // === END WHITELIST ===
      try {
        var result = this[funcName].apply(this, args);
        return ContentService.createTextOutput(JSON.stringify({ result: result }))
            .setMimeType(ContentService.MimeType.JSON);
      } catch (runErr) {
        return ContentService.createTextOutput(JSON.stringify({ 
          error: "Lỗi chạy hàm '" + funcName + "': " + runErr.toString() 
        })).setMimeType(ContentService.MimeType.JSON);
      }
    } else {
      return ContentService.createTextOutput(JSON.stringify({ error: "Hàm '" + funcName + "' không tồn tại trên server backend." }))
          .setMimeType(ContentService.MimeType.JSON);
    }
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.toString() }))
        .setMimeType(ContentService.MimeType.JSON);
  }
}

// Hàm xác thực đăng nhập trung tâm (Gia sư, Lớp học, Admin, Phụ huynh)
function loginSystem(phone, pin, childName) {
  var ssMain = SpreadsheetApp.getActiveSpreadsheet(); // SHEET CHÍNH DÀNH CHO GIA SƯ 1-1 / ADMIN
  var ssClass = (typeof getClassSpreadsheet === 'function') ? getClassSpreadsheet() : ssMain; // SHEET LỚP HỌC NHÓM
  
  // Tự động khởi tạo sheet Admin trên SHEET CHÍNH nếu chưa có
  initAdminSheet(ssMain);
  
  var rawInput = String(phone || "").trim();
  var normPhone = normalizePhone(rawInput);
  if (rawInput === "") {
    return { error: 'Vui lòng nhập Số điện thoại hoặc Mã học sinh để đăng nhập.' };
  }

  // --- ƯU TIÊN A: Nếu có truyền mã PIN (Đăng nhập Gia sư / Admin) ---
  if (pin && String(pin).trim() !== "") {
    var phoneFoundInStaff = false;

    // 1. Thử đối chiếu với quyền Admin trên SHEET CHÍNH trước
    var sheetAdmin = ssMain.getSheetByName('Mã Admin');
    if (sheetAdmin) {
      var dataAdmin = sheetAdmin.getDataRange().getDisplayValues();
      for (var i = 1; i < dataAdmin.length; i++) {
        var adminPhone = normalizePhone(dataAdmin[i][2]);
        if (adminPhone !== "" && adminPhone === normPhone) {
          phoneFoundInStaff = true;
          var trueAdminPin = String(dataAdmin[i][3]).trim();
          if (String(pin).trim() === trueAdminPin) {
            return {
              role: 'admin',
              thongBao: "Đăng nhập với quyền Admin thành công!",
              data: getAdminDashboardData()
            };
          }
        }
      }
    }

    // 2. Thử đối chiếu với quyền Gia sư trên SHEET CHÍNH
    var sheetGS = (ssMain.getSheetByName('Mã Giáo viên') || ssMain.getSheetByName('Mã giáo viên') || ssMain.getSheetByName('Mã gia sư'));
    if (sheetGS) {
      var dataGS = sheetGS.getDataRange().getDisplayValues();
      for (var i = 1; i < dataGS.length; i++) {
        var gsPhone = normalizePhone(dataGS[i][2]);
        if (gsPhone !== "" && gsPhone === normPhone) {
          var tDelDate = (dataGS[i].length > 5) ? dataGS[i][5].trim() : "";
          if (tDelDate !== "") continue;
          phoneFoundInStaff = true;
          var trueTutorPin = String(dataGS[i][3]).trim();
          if (String(pin).trim() === trueTutorPin) {
            var tStatus = (dataGS[i].length > 9) ? dataGS[i][9].trim() : "";
            if (tStatus === "Vô hiệu hóa") {
              return { error: 'Tài khoản của bạn đã bị vô hiệu hóa. Vui lòng liên hệ Admin!' };
            }
            return { 
              role: 'tutor', 
              thongBao: "Đăng nhập với quyền Gia sư thành công!", 
              data: getTutorDashboardData(phone, dataGS[i], ssMain) 
            };
          }
        }
      }
    }

    // 3. Đối chiếu với Quyền Giáo viên / Admin trên Sheet Lớp học
    var sAdminClass = ssClass.getSheetByName('Mã Admin') || ssClass.getSheetByName('Mã admin');
    if (sAdminClass) {
      var dataAC = sAdminClass.getDataRange().getDisplayValues();
      for (var a = 1; a < dataAC.length; a++) {
        var aPhone = normalizePhone(dataAC[a][2] || dataAC[a][0]);
        if (aPhone !== "" && aPhone === normPhone) {
          phoneFoundInStaff = true;
          var truePin = String(dataAC[a][3] || dataAC[a][2] || "").trim();
          if (String(pin).trim() === truePin) {
            return {
              thanhCong: true,
              role: 'admin',
              teacherName: dataAC[a][1] || "Thầy Nguyễn Hữu Phúc",
              thongBao: "Đăng nhập thành công!"
            };
          }
        }
      }
    }

    var sClasses = ssClass.getSheetByName('Danh sách lớp học') || ssClass.getSheetByName('Mã lớp học');
    if (sClasses) {
      var dataC = sClasses.getDataRange().getDisplayValues();
      for (var c = 1; c < dataC.length; c++) {
        var cPhone = normalizePhone(dataC[c][2]);
        if (cPhone !== "" && cPhone === normPhone) {
          phoneFoundInStaff = true;
          var trueCPin = String(dataC[c][7] || "").trim();
          if (String(pin).trim() === trueCPin) {
            return {
              thanhCong: true,
              role: 'tutor',
              teacherName: "Giáo viên Lớp học",
              thongBao: "Đăng nhập thành công!"
            };
          }
        }
      }
    }

    // Nếu SĐT có trong danh sách nhưng sai mã PIN
    if (phoneFoundInStaff) {
      return { thanhCong: false, error: 'Mã PIN bảo mật không chính xác!' };
    } else {
      return { thanhCong: false, error: 'Số điện thoại này chưa được đăng ký làm Giáo viên / Admin trên hệ thống!' };
    }
  }

  // --- B: Thu thập học sinh trùng SĐT phụ huynh (Đăng nhập Phụ huynh / Học sinh) ---
  var matches = [];
  var rawLower = rawInput.toLowerCase();
  

  var sheetClassStudents = ssClass ? ssClass.getSheetByName('Học sinh lớp học') : null;
  if (sheetClassStudents) {
    var dataCS = sheetClassStudents.getDataRange().getDisplayValues();
    for (var i = 1; i < dataCS.length; i++) {
      if (!dataCS[i] || dataCS[i].length < 1) continue;
      var delDateCS = (dataCS[i].length > 8) ? String(dataCS[i][8]).trim() : "";
      if (delDateCS !== "") continue;
      
      var csId = String(dataCS[i][0] || "").trim();
      var csName = String(dataCS[i][1] || "").trim();
      var isMatch = false;

      for (var col = 0; col < dataCS[i].length; col++) {
        var val = String(dataCS[i][col] || "").trim();
        if (val === "") continue;
        if (normPhone !== "" && normalizePhone(val) === normPhone) {
          isMatch = true;
          break;
        }
        if (val.toLowerCase() === rawLower) {
          isMatch = true;
          break;
        }
      }

      if (isMatch) {
        matches.push({
          source: 'class',
          rowData: dataCS[i],
          name: csName || csId,
          id: csId
        });
      }
    }
  }

  // Phân luồng đăng nhập học sinh
  if (matches.length > 0) {
    if (childName) {
      var target = matches.find(function(m) { return m.name === childName || m.id === childName; });
      if (target) {
          return {
            role: 'student',
            thongBao: "Đăng nhập thành công",
            data: traCuuDuLieuHocSinhLop(phone, target.rowData, ssClass)
          };
      }
    }

    if (matches.length > 1) {
      var childrenList = matches.map(function(m) { return { name: m.name, code: m.id }; });
      return {
        role: 'student',
        multipleStudents: true,
        childrenList: childrenList
      };
    }

    var single = matches[0];
    return {
      role: 'student',
      thongBao: "Đăng nhập thành công",
      data: traCuuDuLieuHocSinhLop(phone, single.rowData, ssClass)
    };
  }

  // Nếu không truyền PIN và không tìm thấy học sinh
  var sheetAdmin = ssMain.getSheetByName('Mã Admin');
  if (sheetAdmin) {
    var dataAdmin = sheetAdmin.getDataRange().getDisplayValues();
    for (var i = 1; i < dataAdmin.length; i++) {
      var adminPhone = normalizePhone(dataAdmin[i][2]);
      if (adminPhone !== "" && adminPhone === normPhone) {
        return { requiresPin: true, name: dataAdmin[i][1] };
      }
    }
  }
  
  var sheetGS = (ssMain.getSheetByName('Mã Giáo viên') || ssMain.getSheetByName('Mã giáo viên') || ssMain.getSheetByName('Mã gia sư'));
  if (sheetGS) {
    var dataGS = sheetGS.getDataRange().getDisplayValues();
    for (var i = 1; i < dataGS.length; i++) {
      var gsPhone = normalizePhone(dataGS[i][2]);
      if (gsPhone !== "" && gsPhone === normPhone) {
        var tDelDate = (dataGS[i].length > 5) ? dataGS[i][5].trim() : "";
        if (tDelDate === "") {
          return { requiresPin: true, name: dataGS[i][1] };
        }
      }
    }
  }

  return { error: 'Số điện thoại không tồn tại trên hệ thống.' };
}
