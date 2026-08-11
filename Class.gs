// Class.gs - Backend logic for Class Management System (Mô hình quản lý Lớp học)



var ssCache = null;
var schemaInitialized = false;

function getClassSpreadsheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (typeof initClassSpreadsheetSchema === 'function') {
    initClassSpreadsheetSchema(ss);
  }
  return ss;
}

function clearClassCache(classId, type) {
  var cache = CacheService.getScriptCache();
  
  if (!type) {
    cache.remove("all_classes_raw");
    cache.remove("all_class_logs_raw");
  }

  if (!classId) return;
  var cleanClassId = String(classId).trim();
  if (type) {
    cache.remove("class_" + type + "_" + cleanClassId);
    if (type === "logs") cache.remove("all_class_logs_raw");
  } else {
    cache.remove("class_students_" + cleanClassId);
    cache.remove("class_logs_" + cleanClassId);
    cache.remove("class_hw_" + cleanClassId);
    cache.remove("class_announce_" + cleanClassId);
  }
  
  // Đồng bộ xóa cache của tất cả học sinh trong lớp để Phụ huynh nhận được dữ liệu mới (Thông báo, Bài tập, Nhật ký, vv)
  if (type === "logs" || type === "hw" || type === "announcement" || !type) {
    try {
      var students = getClassStudents(cleanClassId);
      if (students && students.length > 0) {
        students.forEach(function(st) {
          if (typeof clearStudentCache === 'function') {
            if (st.parentPhone) clearStudentCache(st.parentPhone);
            if (st.studentId) clearStudentCache(st.studentId);
          }
        });
      }
    } catch(e) {
      Logger.log("Lỗi xóa cache học sinh lớp: " + e.toString());
    }
  }
}


function allocateClassBlock(ss, classId, className) {
  var sheetName = 'Nhật ký chung';
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) return;
  
  var data = sheet.getDataRange().getValues();
  // Kiểm tra xem lớp này đã được cấp phát Block chưa
  for (var i = 0; i < data.length; i++) {
    if (String(data[i][1]).trim() === classId && String(data[i][0]).includes("--- NHẬT KÝ LỚP HỌC")) {
      return sheet; // Đã cấp phát
    }
  }
  
  // Chưa cấp phát -> Tạo Block mới ở cuối sheet
  sheet.appendRow(["--- NHẬT KÝ LỚP HỌC: " + className.toUpperCase() + " ---", classId, "", "", "", "", "", "", "", "", "", "", ""]);
  var headerRow = sheet.getLastRow();
  sheet.getRange(headerRow, 1, 1, 13).setFontWeight("bold").setBackground("#5B2EFF").setFontColor("#FFFFFF");
  
  var logHeaders = [
    "Mã nhật ký", "Mã lớp", "Tên lớp", "Tuần dạy", "Ngày học", "Môn học",
    "Trạng thái", "Đánh giá BTVN", "Điểm KT Đầu giờ", "Điểm KT Định kỳ",
    "Nội dung & Nhận xét chung", "Chi tiết nhận xét riêng (JSON)", "Ngày xóa"
  ];
  sheet.appendRow(logHeaders);
  sheet.getRange(headerRow + 1, 1, 1, 13).setFontWeight("bold").setBackground("#8E4DFF").setFontColor("#FFFFFF");
  
  // Chèn 15 dòng trống cho lớp này
  for (var k = 0; k < 15; k++) {
    sheet.appendRow(["", classId, className, "", "", "", "", "", "", "", "", "", ""]);
  }
  
  return sheet;
}

// loginClassSystem đã được chuyển xuống dòng 712 (bên dưới) — không khai báo lại ở đây để tránh hàm trùng

// Lấy danh sách Lớp học của Giáo viên theo SĐT hoặc Mã Giáo Viên
function getClassList(tutorPhone, tutorCode, ssParam) {
  var normPhone = normalizePhone(tutorPhone || "");
  var normCode = String(tutorCode || "").trim().toLowerCase();
  
  var teacherName = "";
  var cache = CacheService.getScriptCache();
  try {
    var ssClass = ssParam || getClassSpreadsheet();
    var gsCacheKey = "all_class_teachers_raw";
    var cachedGS = cache.get(gsCacheKey);
    var dataGS = null;
    
    if (cachedGS) {
      try { dataGS = JSON.parse(cachedGS); } catch(e){}
    }
    
    if (!dataGS) {
      var sheetGS = ssClass.getSheetByName('Mã Giáo viên') || ssClass.getSheetByName('Mã giáo viên') || ssClass.getSheetByName('Mã gia sư');
      if (sheetGS) {
        dataGS = sheetGS.getDataRange().getValues();
        try {
          var gsStr = JSON.stringify(dataGS);
          if (gsStr.length < 95000) cache.put(gsCacheKey, gsStr, 600);
        } catch(e) {}
      }
    }
    
    if (dataGS) {
      for (var k = 1; k < dataGS.length; k++) {
        if (dataGS[k] && dataGS[k].length > 2) {
          var rawPhone = dataGS[k][2] !== null && dataGS[k][2] !== undefined ? String(dataGS[k][2]).trim() : "";
          if (rawPhone && !rawPhone.startsWith("0") && /^\d+$/.test(rawPhone)) {
            rawPhone = "0" + rawPhone;
          }
          if (normalizePhone(rawPhone) === normPhone) {
            teacherName = String(dataGS[k][1]).trim().toLowerCase();
            break;
          }
        }
      }
    }
  } catch (e) {
    Logger.log("Lỗi tra cứu tên giáo viên: " + e.toString());
  }
  
  var clsCacheKey = "all_classes_raw";
  var cachedCls = cache.get(clsCacheKey);
  var data = null;
  
  if (cachedCls) {
    try { 
      data = JSON.parse(cachedCls);
      if (!Array.isArray(data) || data.length <= 1) {
        data = null;
        cache.remove(clsCacheKey);
      }
    } catch(e){ data = null; cache.remove(clsCacheKey); }
  }
  
  if (!data || !Array.isArray(data) || data.length <= 1) {
    var ss = ssParam || getClassSpreadsheet();
    var sheetClasses = ss.getSheetByName('Danh sách lớp học') || ss.getSheetByName('Mã lớp học');
    if (!sheetClasses) return [];
    data = sheetClasses.getDataRange().getValues();
    try {
      if (data && data.length > 1) {
        var clsStr = JSON.stringify(data);
        if (clsStr.length < 95000) cache.put(clsCacheKey, clsStr, 180);
      }
    } catch(e) {}
  }
  var allClasses = [];
  var matchedClasses = [];

  for (var i = 1; i < data.length; i++) {
    if (data[i] && data[i].length >= 2) {
      var cId = data[i][0] ? String(data[i][0]).trim() : "";
      var cName = data[i][1] ? String(data[i][1]).trim() : "";
      
      if (cName !== "" || cId !== "") {
        if (!cId) cId = "LH_" + i;
        if (!cName) cName = "Lớp " + i;
        
        var dbVal = data[i][2] !== null && data[i][2] !== undefined ? String(data[i][2]).trim() : "";
        if (dbVal && !dbVal.startsWith("0") && /^\d+$/.test(dbVal)) {
          dbVal = "0" + dbVal;
        }
        
        var clsObj = {
          classId: cId,
          className: cName,
          tutorPhone: dbVal,
          tutorCode: dbVal,
          subject: data[i][3] ? String(data[i][3]).trim() : "",
          schedule: data[i][4] ? String(data[i][4]).trim() : "",
          fee: data[i][5] !== null && data[i][5] !== undefined ? String(data[i][5]).trim() : "",
          maxStudents: data[i][5] !== null && data[i][5] !== undefined ? String(data[i][5]).trim() : "20",
          feeType: (data[i].length > 6 && data[i][6]) ? String(data[i][6]).trim() : "per_session"
        };
        
        allClasses.push(clsObj);
        
        var dbPhone = normalizePhone(dbVal);
        var dbCode = dbVal.toLowerCase();
        
        var isMatch = false;
        if (normPhone === "" && normCode === "") {
          isMatch = true;
        } else if (dbVal === "") {
          isMatch = true;
        } else if (normPhone !== "" && dbPhone === normPhone) {
          isMatch = true;
        } else if (normCode !== "" && dbCode === normCode) {
          isMatch = true;
        } else if (teacherName !== "" && dbCode === teacherName) {
          isMatch = true; // Khớp bằng Tên Giáo viên
        }
        
        if (isMatch) {
          matchedClasses.push(clsObj);
        }
      }
    }
  }
  
  // Nếu tìm thấy theo SĐT / Mã GV / Tên GV thì lấy matchedClasses, nếu không thì lấy toàn bộ allClasses
  return (matchedClasses.length > 0) ? matchedClasses : allClasses;
}

// Lấy toàn bộ dữ liệu tổng cho Phân hệ Lớp Học trong 1 chuyến gọi server duy nhất (1s)
function getClassDashboardData(tutorPhone, requestedClassId, tutorCode) {
  var classes = getClassList(tutorPhone, tutorCode);
  
  if (!classes || classes.length === 0) {
    return {
      success: true,
      classes: [],
      activeClass: null,
      students: [],
      lessonLogs: [],
      announcement: "",
      homeworkList: []
    };
  }
  
  var activeClass = null;
  if (requestedClassId) {
    for (var i = 0; i < classes.length; i++) {
      if (classes[i].classId === requestedClassId) {
        activeClass = classes[i];
        break;
      }
    }
  }
  if (!activeClass) {
    activeClass = classes[0];
  }
  
  var students = getClassStudents(activeClass.classId);
  var lessonLogs = getClassLessonLogs(activeClass.classId, activeClass.className);
  var announcement = getClassAnnouncement(activeClass.classId);
  var homeworkList = getClassHomeworkList(activeClass.classId, activeClass.className);
  
  if (homeworkList && homeworkList.length > 0) {
    var submissions = getClassSubmissions(activeClass.classId);
    var totalStudents = students ? students.length : 0;
    
    for (var h = 0; h < homeworkList.length; h++) {
      var hw = homeworkList[h];
      var submittedStudents = {};
      var count = 0;
      if (submissions) {
        for (var s = 0; s < submissions.length; s++) {
          if (submissions[s].homeworkId === hw.hwId) {
             var sid = submissions[s].studentId || submissions[s].studentName || submissions[s].parentPhone;
             if (sid && !submittedStudents[sid]) {
                 submittedStudents[sid] = true;
                 count++;
             }
          }
        }
      }
      hw.submittedCount = count;
      hw.totalStudents = totalStudents;
    }
  }
  
  return {
    success: true,
    classes: classes,
    activeClass: activeClass,
    students: students || [],
    lessonLogs: lessonLogs || [],
    announcement: announcement || "",
    homeworkList: homeworkList || []
  };
}

// Tạo Lớp học mới
function createClass(tutorPhone, className, subject, schedule, feeType, tutorCode, fee) {
  var ss = getClassSpreadsheet();
  var sheetClasses = ss.getSheetByName('Danh sách lớp học');
  
  if (!sheetClasses) return { error: "Không tìm thấy Sheet Danh sách lớp học." };
  var classId = "LH_" + new Date().getTime().toString().slice(-6);
  var cleanClassName = String(className).trim();
  var ownerCred = (tutorCode && String(tutorCode).trim() !== "") ? String(tutorCode).trim() : (tutorPhone || "");
  
  sheetClasses.appendRow([classId, cleanClassName, ownerCred, subject || "", schedule || "", fee || "", feeType || "per_session"]);
  
  // Cấp phát 15 dòng trống vào Nhật ký chung
  allocateClassBlock(ss, classId, cleanClassName);
  
  clearClassCache(null, null); // Xóa cache Danh sách lớp chung
  SpreadsheetApp.flush();
  
  return { success: true, classId: classId, className: cleanClassName, feeType: feeType || "per_session", fee: fee || "" };
}

// Cập nhật thông tin Lớp học (Tên lớp, Lịch dạy, Môn học, Loại học phí)
function updateClassInfo(classId, className, subject, schedule, feeType, fee) {
  var ss = getClassSpreadsheet();
  var sheetClasses = ss.getSheetByName('Danh sách lớp học');
  if (!sheetClasses) return { error: "Không tìm thấy sheet Danh sách lớp học." };
  
  var data = sheetClasses.getDataRange().getDisplayValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === classId) {
      var oldClassName = data[i][1];
      sheetClasses.getRange(i + 1, 2).setValue(className);
      sheetClasses.getRange(i + 1, 4).setValue(subject);
      sheetClasses.getRange(i + 1, 5).setValue(schedule);
      if (fee !== undefined && fee !== null) { sheetClasses.getRange(i + 1, 6).setValue(fee); }
      sheetClasses.getRange(i + 1, 7).setValue(feeType || "per_session");
      
      // Nếu đổi tên lớp, tự động đổi tên Tab Sheet tương ứng
      if (oldClassName && oldClassName !== className) {
        var oldSheet = ss.getSheetByName(oldClassName) || ss.getSheetByName("Bảng đánh giá học tập dành cho lớp học (" + oldClassName + ")");
        if (oldSheet) {
          oldSheet.setName(className);
        }
      }
      
      clearClassCache(classId);
      SpreadsheetApp.flush();
      return { success: true };
    }
  }
  return { error: "Không tìm thấy lớp học với mã này." };
}

// Xóa tạm Lớp học vào Thùng rác (Soft Delete)
function deleteClass(classId, className) {
  var ss = getClassSpreadsheet();
  var sheetClasses = ss.getSheetByName('Danh sách lớp học');
  if (sheetClasses) {
    var data = sheetClasses.getDataRange().getDisplayValues();
    var nowStr = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "dd/MM/yyyy HH:mm");
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][0]).trim() === String(classId).trim()) {
        sheetClasses.getRange(i + 1, 8).setValue(nowStr); // Cột 8: Ngày xóa
        clearClassCache(classId);
        SpreadsheetApp.flush();
        break;
      }
    }
  }
  return { success: true };
}

// Lấy danh sách Học sinh thuộc một Lớp học
function getClassStudents(classId, ssParam) {
  var cleanClassId = String(classId || "").trim();
  if (cleanClassId === "") return [];
  
  var cache = CacheService.getScriptCache();
  var cacheKey = "class_students_" + cleanClassId;
  var cached = cache.get(cacheKey);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch(e) {
      Logger.log("Lỗi parse cache students: " + e.toString());
    }
  }
  
  var ss = ssParam || getClassSpreadsheet();
  var sheetStudents = ss.getSheetByName('Học sinh lớp học');
  var students = [];
  
  if (!sheetStudents) return students;
  
  var data = sheetStudents.getDataRange().getValues(); // Dùng getValues() để đọc thô siêu nhanh
  for (var i = 1; i < data.length; i++) {
    if (data[i].length >= 3 && String(data[i][2]).trim() === cleanClassId) {
      var deletedAt = (data[i].length > 8 && data[i][8] !== null) ? String(data[i][8]).trim() : "";
      if (deletedAt !== "") continue; // Bỏ qua học sinh nằm trong Thùng rác
      
      var phoneVal = data[i][3] !== null && data[i][3] !== undefined ? String(data[i][3]).trim() : "";
      
      var joinDateVal = "";
      if (data[i][4] instanceof Date) {
        joinDateVal = Utilities.formatDate(data[i][4], Session.getScriptTimeZone(), "dd/MM/yyyy");
      } else {
        joinDateVal = data[i][4] ? String(data[i][4]).trim() : "";
      }
      
      students.push({
        studentId: data[i][0] ? String(data[i][0]).trim() : "",
        studentName: data[i][1] ? String(data[i][1]).trim() : "",
        classId: String(data[i][2]).trim(),
        parentPhone: phoneVal,
        joinDate: joinDateVal,
        parentName: data[i][5] ? String(data[i][5]).trim() : "",
        fee: data[i][6] !== null && data[i][6] !== undefined ? String(data[i][6]).trim() : "",
        homeworkCode: data[i][7] !== null && data[i][7] !== undefined ? String(data[i][7]).trim() : "",
        feeType: (data[i].length > 9 && data[i][9]) ? String(data[i][9]).trim() : ""
      });
    }
  }
  
  try {
    cache.put(cacheKey, JSON.stringify(students), 600); // Lưu đệm 10 phút
  } catch(e) {
    Logger.log("Lỗi lưu cache students: " + e.toString());
  }
  
  return students;
}

// Thêm Học sinh mới vào Lớp học (Đầy đủ thông tin Phụ huynh, Học phí, Mã bài tập, Loại học phí)
function addClassStudent(classId, studentName, parentPhone, parentName, fee, homeworkCode, feeType) {
  var ss = getClassSpreadsheet();
  var sheetStudents = ss.getSheetByName('Học sinh lớp học');
  if (!sheetStudents) return { error: "Không tìm thấy Sheet Học sinh lớp học." };
  var studentId = String(parentPhone || "").trim() || ("HS_LH_" + new Date().getTime().toString().slice(-6));
  var joinDate = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "dd/MM/yyyy");
  
  sheetStudents.appendRow([
    studentId,
    studentName,
    classId,
    "'" + (parentPhone || ""),
    joinDate,
    parentName || "",
    fee || "",
    homeworkCode || "",
    "", // Cột 9: Ngày xóa (Trống = Hoạt động)
    feeType || "" // Cột 10: Loại học phí
  ]);
  
  clearClassCache(classId, "students");
  
  return {
    success: true,
    studentId: studentId,
    studentName: studentName,
    parentPhone: parentPhone,
    parentName: parentName,
    fee: fee,
    homeworkCode: homeworkCode,
    feeType: feeType || ""
  };
}

// Aliases cho các hàm CRUD Học sinh & Lớp học
function saveClassStudent(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
  if (typeof arg2 === 'string' && arguments.length >= 8) {
    return addClassStudent(arg1, arg3, arg4, arg5, arg6, arg7, arg8);
  } else {
    return addClassStudent(arg1, arg2, arg3, arg4, arg5, arg6, arg7);
  }
}

function deleteClassStudent(studentId) {
  return removeClassStudent(studentId);
}

function saveClass(tutorPhone, className, subject, schedule, feeType, tutorCode) {
  return createClass(tutorPhone, className, subject, schedule, feeType, tutorCode);
}

// Chỉnh sửa thông tin Học sinh Lớp học
function updateClassStudent(studentId, studentName, parentPhone, parentName, fee, homeworkCode, feeType) {
  var ss = getClassSpreadsheet();
  var sheetStudents = ss.getSheetByName('Học sinh lớp học');
  if (!sheetStudents) return { success: false, error: "Không tìm thấy sheet học sinh." };
  
  var data = sheetStudents.getDataRange().getDisplayValues();
  var rowIndex = -1;
  var classId = "";
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === studentId) {
      rowIndex = i + 1;
      classId = data[i][2];
      break;
    }
  }
  
  if (rowIndex !== -1) {
    sheetStudents.getRange(rowIndex, 2).setValue(studentName || "").setFontFamily("Arial");
    sheetStudents.getRange(rowIndex, 4).setValue("'" + (parentPhone || "")).setFontFamily("Arial");
    sheetStudents.getRange(rowIndex, 6).setValue(parentName || "").setFontFamily("Arial");
    sheetStudents.getRange(rowIndex, 7).setValue(fee || "").setFontFamily("Arial");
    sheetStudents.getRange(rowIndex, 8).setValue(homeworkCode || "").setFontFamily("Arial");
    sheetStudents.getRange(rowIndex, 10).setValue(feeType || "").setFontFamily("Arial");
    if (classId) clearClassCache(classId, "students");
    SpreadsheetApp.flush();
    return { success: true };
  }
  return { success: false, error: "Không tìm thấy học sinh cần sửa." };
}

// Chuyển Học sinh Lớp học vào Thùng rác (Soft delete)
function removeClassStudent(studentId) {
  var ss = getClassSpreadsheet();
  var sheetStudents = ss.getSheetByName('Học sinh lớp học');
  if (sheetStudents) {
    var data = sheetStudents.getDataRange().getDisplayValues();
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] === studentId) {
        var nowStr = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "dd/MM/yyyy HH:mm");
        sheetStudents.getRange(i + 1, 9).setValue(nowStr);
        var classId = data[i][2];
        if (classId) clearClassCache(classId, "students");
        SpreadsheetApp.flush();
        break;
      }
    }
  }
  return { success: true };
}

// Lấy danh sách Học sinh trong Thùng rác của Lớp học
function getClassTrashStudents(classId) {
  var ss = getClassSpreadsheet();
  var sheetStudents = ss.getSheetByName('Học sinh lớp học');
  var trashList = [];
  if (!sheetStudents) return trashList;
  
  var data = sheetStudents.getDataRange().getDisplayValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i].length >= 3 && data[i][2] === classId) {
      var deletedAt = (data[i].length > 8) ? data[i][8].trim() : "";
      if (deletedAt !== "") {
        trashList.push({
          studentId: data[i][0],
          studentName: data[i][1],
          classId: data[i][2],
          parentPhone: data[i][3] || "",
          parentName: data[i][5] || "",
          deletedAt: deletedAt
        });
      }
    }
  }
  return trashList;
}

// Khôi phục Học sinh từ Thùng rác Lớp học
function restoreClassStudent(studentId) {
  var ss = getClassSpreadsheet();
  var sheetStudents = ss.getSheetByName('Học sinh lớp học');
  if (sheetStudents) {
    var data = sheetStudents.getDataRange().getDisplayValues();
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] === studentId) {
        sheetStudents.getRange(i + 1, 9).setValue("");
        var classId = data[i][2];
        if (classId) clearClassCache(classId, "students");
        SpreadsheetApp.flush();
        break;
      }
    }
  }
  return { success: true };
}

// Xóa vĩnh viễn Học sinh khỏi Sheet Lớp học
function deleteClassStudentPermanently(studentId) {
  var ss = getClassSpreadsheet();
  var sheetStudents = ss.getSheetByName('Học sinh lớp học');
  if (sheetStudents) {
    var data = sheetStudents.getDataRange().getDisplayValues();
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] === studentId) {
        var classId = data[i][2];
        sheetStudents.deleteRow(i + 1);
        if (classId) clearClassCache(classId, "students");
        SpreadsheetApp.flush();
        break;
      }
    }
  }
  return { success: true };
}

// Lưu Đánh Giá Hàng Loạt Cho Lớp Học (Batch Evaluation) vào Sheet riêng của lớp
function saveClassBatchEvaluation(classId, className, studyDate, globalNotes, evaluationRows) {
  var ss = getClassSpreadsheet();
  var sheetEval = getOrCreateClassEvaluationSheet(ss, className);
  
  if (!evaluationRows || !Array.isArray(evaluationRows) || evaluationRows.length === 0) {
    return { error: "Không có dữ liệu đánh giá để lưu." };
  }
  
  for (var i = 0; i < evaluationRows.length; i++) {
    var row = evaluationRows[i];
    var evalId = "EV_" + new Date().getTime() + "_" + i;
    
    // Đảm bảo mặc định chuyên cần là "Có mặt" nếu không chọn
    var attendanceStatus = row.attendance || "Có mặt";
    var privateNotes = row.privateNotes || "";
    
    sheetEval.appendRow([
      evalId,
      classId,
      row.studentId || "",
      row.studentName || "",
      studyDate || Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "dd/MM/yyyy"),
      attendanceStatus,
      row.homeworkScore || "",
      row.testScore || "",
      row.stars || "5",
      privateNotes,
      globalNotes || ""
    ]);
  }
  
  return { success: true, count: evaluationRows.length };
}

// Lấy lịch sử đánh giá gần đây của một Lớp học
function getClassEvaluations(className) {
  var ss = getClassSpreadsheet();
  var sheetEval = getOrCreateClassEvaluationSheet(ss, className);
  var data = sheetEval.getDataRange().getDisplayValues();
  
  var list = [];
  for (var i = 1; i < data.length; i++) {
    if (data[i].length >= 6 && data[i][0] !== "") {
      list.push({
        evalId: data[i][0],
        classId: data[i][1],
        studentId: data[i][2],
        studentName: data[i][3],
        studyDate: data[i][4],
        attendance: data[i][5],
        homeworkScore: data[i][6],
        testScore: data[i][7],
        stars: data[i][8],
        privateNotes: data[i][9],
        globalNotes: data[i][10] || ""
      });
    }
  }
  return list;
}

// Đăng nhập hệ thống Lớp học dành cho Giáo viên Lớp học
function loginClassSystem(phone, pin) {
  var ssClass = getClassSpreadsheet(); 
  var normPhone = normalizePhone(phone || "");
  if (!normPhone) {
    return { success: false, error: "Vui lòng nhập số điện thoại hợp lệ." };
  }

  var teacherFound = false;
  var teacherName = "Giáo viên Lớp học";
  var tutorCode = "";
  var truePin = "";
  var qrUrl = "";
  var role = "class_tutor";

  // 1. Kiểm tra quyền Admin
  var sAdmin = ssClass.getSheetByName('Mã Admin') || ssClass.getSheetByName('Mã admin');
  if (sAdmin) {
    var dataA = sAdmin.getDataRange().getValues();
    for (var i = 1; i < dataA.length; i++) {
      var aPhone = normalizePhone(String(dataA[i][2] || dataA[i][0]));
      if (aPhone !== "" && aPhone === normPhone) {
        truePin = String(dataA[i][3] || dataA[i][2] || "").trim();
        if (String(pin || "").trim() === truePin) {
          teacherFound = true;
          teacherName = dataA[i][1] || "Quản trị viên";
          tutorCode = dataA[i][0] || "ADMIN";
          role = "admin";
          break;
        }
      }
    }
  }

  // 2. Kiểm tra quyền Giáo viên (Dựa vào Sheet Mã Giáo viên)
  if (!teacherFound) {
    var sTeacher = ssClass.getSheetByName('Mã Giáo viên') || ssClass.getSheetByName('Mã giáo viên') || ssClass.getSheetByName('Mã gia sư');
    if (sTeacher) {
      var dataT = sTeacher.getDataRange().getValues();
      for (var i = 1; i < dataT.length; i++) {
        var tPhone = normalizePhone(String(dataT[i][2] || ""));
        if (tPhone !== "" && tPhone === normPhone) {
          var tStatus = String(dataT[i][4] || "").trim();
          if (tStatus.toLowerCase() === "vô hiệu hóa") {
             return { success: false, error: "Tài khoản của bạn đã bị vô hiệu hóa." };
          }
          
          truePin = String(dataT[i][3] || "").trim();
          if (String(pin || "").trim() === truePin) {
            teacherFound = true;
            teacherName = dataT[i][1] || "Giáo viên phụ trách";
            tutorCode = dataT[i][0] || tPhone;
            role = "class_tutor";
            break;
          }
        }
      }
    }
  }

  if (!teacherFound) {
    return { success: false, error: "Số điện thoại không tồn tại hoặc sai mã PIN." };
  }

  // 3. Lấy danh sách lớp học của giáo viên (hoặc tất cả nếu là admin)
  // getClassList(phone, tutorCode) sẽ tìm các lớp có SĐT/Mã GV trùng khớp
  var classes = getClassList(phone, tutorCode);
  if (role === 'admin') {
     classes = getClassList(null, null); // Lấy toàn bộ danh sách lớp cho Admin
  }

  return {
    success: true,
    role: role,
    tutorPhone: phone,
    tutorName: teacherName,
    tutorCode: tutorCode,
    tutorPin: truePin,
    pin: truePin,
    qrUrl: qrUrl,
    qrCodeUrl: qrUrl,
    classes: classes
  };
}

// === QUẢN LÝ THỜI KHÓA BIỂU THẬT DÀNH CHO LỚP HỌC (SHEET 'Lịch học lớp') ===

// Lấy danh sách lịch học của tất cả lớp (hoặc theo SĐT giáo viên nếu truyền vào)
function getOrCreateClassScheduleSheet(ss, tutorPhone) {
  if (!ss) ss = getClassSpreadsheet();
  var sheet = ss.getSheetByName('Lịch học lớp');
  if (!sheet) return [];
  var data = sheet.getDataRange().getDisplayValues();
  var scheduleList = [];
  var filterPhone = tutorPhone ? normalizePhone(tutorPhone) : "";
  for (var i = 1; i < data.length; i++) {
    if (data[i].length >= 2) {
      var dbPhone = normalizePhone(data[i][1]);
      // Nếu có lọc theo SĐT thì chỉ lấy dòng khớp; nếu không truyền thì lấy tất cả
      if (filterPhone === "" || dbPhone === filterPhone) {
        scheduleList.push({
          studentName: data[i][0],
          className: data[i][0],
          tutorPhone: data[i][1],
          mon: data[i][2] || "",
          tue: data[i][3] || "",
          wed: data[i][4] || "",
          thu: data[i][5] || "",
          fri: data[i][6] || "",
          sat: data[i][7] || "",
          sun: data[i][8] || ""
        });
      }
    }
  }
  return scheduleList;
}

function saveClassScheduleItem(tutorPhone, className, mon, tue, wed, thu, fri, sat, sun) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    var ss = getClassSpreadsheet();
    var sheet = ss.getSheetByName('Lịch học lớp');
    if (!sheet) return { error: "Không tìm thấy Sheet Lịch học lớp." };
    var normPhone = normalizePhone(tutorPhone);
    var cleanClassName = String(className || "").trim();
    var data = sheet.getDataRange().getDisplayValues();
    
    var rowIndex = -1;
    for (var i = 1; i < data.length; i++) {
      if (normalizePhone(data[i][1]) === normPhone && String(data[i][0]).trim() === cleanClassName) {
        rowIndex = i + 1;
        break;
      }
    }
    
    if (rowIndex !== -1) {
      sheet.getRange(rowIndex, 3).setValue(mon || "").setFontFamily("Arial");
      sheet.getRange(rowIndex, 4).setValue(tue || "").setFontFamily("Arial");
      sheet.getRange(rowIndex, 5).setValue(wed || "").setFontFamily("Arial");
      sheet.getRange(rowIndex, 6).setValue(thu || "").setFontFamily("Arial");
      sheet.getRange(rowIndex, 7).setValue(fri || "").setFontFamily("Arial");
      sheet.getRange(rowIndex, 8).setValue(sat || "").setFontFamily("Arial");
      sheet.getRange(rowIndex, 9).setValue(sun || "").setFontFamily("Arial");
    } else {
      sheet.appendRow([cleanClassName, "'" + tutorPhone, mon || "", tue || "", wed || "", thu || "", fri || "", sat || "", sun || ""]);
      var lastRow = sheet.getLastRow();
      sheet.getRange(lastRow, 1, 1, 9).setFontFamily("Arial");
    }
    return { success: true };
  } catch(e) {
    return { error: "Lỗi lưu lịch lớp: " + e.toString() };
  } finally {
    lock.releaseLock();
  }
}

// === QUẢN LÝ NHẬT KÝ BÀI HỌC VÀ NHẬN XÉT CHI TIẾT TRỰC TIẾP TRÊN SHEET TÊN LỚP ===

function getOrCreateClassLessonLogSheet(ss, className) {
  if (!ss) ss = getClassSpreadsheet();
  var sheetName = 'Nhật ký chung';
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }
  return sheet;
}

function getClassLessonLogs(classId, className) {
  var cleanClassId = String(classId).trim();
  var cacheKey = "class_logs_" + cleanClassId;
  var cache = CacheService.getScriptCache();
  try {
    var cached = cache.get(cacheKey);
    if (cached) return JSON.parse(cached);
  } catch(e) {}

  var ss = getClassSpreadsheet();
  var sheet = getOrCreateClassLessonLogSheet(ss, className);
  if (!sheet) return [];
  
  var data = sheet.getDataRange().getDisplayValues();
  var logs = [];
  
  for (var i = 0; i < data.length; i++) {
    if (String(data[i][1]).trim() === cleanClassId) {
      var logId = String(data[i][0]).trim();
      var deletedAt = String(data[i][12] || "").trim(); // Cột Ngày xóa
      if (logId !== "" && logId !== "Mã nhật ký" && !logId.includes("---") && deletedAt === "") {
        try {
          logs.push({
            logId: logId,
            classId: data[i][1],
            className: data[i][2],
            weekNum: data[i][3],
            studyDate: data[i][4],
            subject: data[i][5],
            status: data[i][6],
            hwEval: data[i][7],
            entryTest: data[i][8],
            termTest: data[i][9],
            generalNote: data[i][10],
            studentNotes: data[i][11] ? JSON.parse(data[i][11] || "{}") : {}
          });
        } catch(e) {
          // Ignore parse error for individual student notes
        }
      }
    }
  }
  
  // Sắp xếp giảm dần theo thời gian (nhật ký mới nhất lên đầu)
  logs.sort(function(a, b) {
    var idA = parseInt(a.logId.replace("LOG_", "")) || 0;
    var idB = parseInt(b.logId.replace("LOG_", "")) || 0;
    return idB - idA;
  });
  
  try {
    cache.put(cacheKey, JSON.stringify(logs), 600);
  } catch(e) {}

  return logs;
}

function saveClassLessonLog(classId, className, weekNum, studyDate, subject, status, hwEval, entryTest, termTest, generalNote, studentNotesJson, editingLessonLogId) {
  var ss = getClassSpreadsheet();
  var sheet = getOrCreateClassLessonLogSheet(ss, className);
  var cleanClassId = String(classId).trim();
  var data = sheet.getDataRange().getValues();
  var targetRow = -1;
  
  if (editingLessonLogId) {
    // Sửa log cũ
    for (var i = 0; i < data.length; i++) {
      if (String(data[i][0]).trim() === String(editingLessonLogId).trim() && String(data[i][1]).trim() === cleanClassId) {
        targetRow = i + 1;
        break;
      }
    }
  } else {
    // Thêm mới: tìm dòng trống đầu tiên trong block của lớp này
    for (var i = 0; i < data.length; i++) {
      if (String(data[i][1]).trim() === cleanClassId && String(data[i][0]).trim() === "") {
        targetRow = i + 1;
        break;
      }
    }
  }
  
  var logId = editingLessonLogId || ("LOG_" + new Date().getTime());
  
  if (targetRow !== -1) {
    sheet.getRange(targetRow, 1).setValue(logId);
    sheet.getRange(targetRow, 2).setValue(classId);
    sheet.getRange(targetRow, 3).setValue(className);
    sheet.getRange(targetRow, 4).setValue(weekNum || "");
    sheet.getRange(targetRow, 5).setValue(studyDate || "");
    sheet.getRange(targetRow, 6).setValue(subject || "");
    sheet.getRange(targetRow, 7).setValue(status || "");
    sheet.getRange(targetRow, 8).setValue(hwEval || "");
    sheet.getRange(targetRow, 9).setValue(entryTest || "");
    sheet.getRange(targetRow, 10).setValue(termTest || "");
    sheet.getRange(targetRow, 11).setValue(generalNote || "");
    sheet.getRange(targetRow, 12).setValue(studentNotesJson || "");
    sheet.getRange(targetRow, 13).setValue(""); // Xóa ngày xóa nếu có
  } else {
    // Khi dùng hết dòng trống: Tìm dòng cuối cùng thuộc block của lớp này và chèn thêm 15 dòng ngay tại đó!
    var lastBlockRow = -1;
    for (var r = data.length - 1; r >= 0; r--) {
      if (String(data[r][1]).trim() === cleanClassId) {
        lastBlockRow = r + 1;
        break;
      }
    }

    if (lastBlockRow !== -1) {
      // Chèn 15 dòng mới đúng ngay dưới block của lớp này (không nhảy xuống cuối sheet)
      sheet.insertRowsAfter(lastBlockRow, 15);

      var newRowsData = [];
      for (var k = 0; k < 15; k++) {
        newRowsData.push(["", classId, className, "", "", "", "", "", "", "", "", "", ""]);
      }
      sheet.getRange(lastBlockRow + 1, 1, 15, 13).setValues(newRowsData);

      // Ghi log mới vào dòng đầu tiên trong 15 dòng vừa chèn
      targetRow = lastBlockRow + 1;
      sheet.getRange(targetRow, 1).setValue(logId);
      sheet.getRange(targetRow, 2).setValue(classId);
      sheet.getRange(targetRow, 3).setValue(className);
      sheet.getRange(targetRow, 4).setValue(weekNum || "");
      sheet.getRange(targetRow, 5).setValue(studyDate || "");
      sheet.getRange(targetRow, 6).setValue(subject || "");
      sheet.getRange(targetRow, 7).setValue(status || "");
      sheet.getRange(targetRow, 8).setValue(hwEval || "");
      sheet.getRange(targetRow, 9).setValue(entryTest || "");
      sheet.getRange(targetRow, 10).setValue(termTest || "");
      sheet.getRange(targetRow, 11).setValue(generalNote || "");
      sheet.getRange(targetRow, 12).setValue(studentNotesJson || "");
      sheet.getRange(targetRow, 13).setValue("");
    } else {
      // Nếu chưa có block của lớp này thì khởi tạo block mới
      allocateClassBlock(ss, classId, className);
      return saveClassLessonLog(classId, className, weekNum, studyDate, subject, status, hwEval, entryTest, termTest, generalNote, studentNotesJson, editingLessonLogId);
    }
  }
  
  clearClassCache(classId, "logs");
  SpreadsheetApp.flush();
  return { success: true, logId: logId };
}

function deleteClassLessonLog(logId, className) {
  var ss = getClassSpreadsheet();
  var sheet = getOrCreateClassLessonLogSheet(ss, className);
  if (!sheet) return { error: "Không tìm thấy sheet" };
  
  var data = sheet.getDataRange().getDisplayValues();
  for (var i = 0; i < data.length; i++) {
    if (String(data[i][0]).trim() === String(logId).trim()) {
      var nowStr = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "dd/MM/yyyy HH:mm");
      sheet.getRange(i + 1, 13).setValue(nowStr); // Soft delete
      var classId = data[i][1];
      if (classId) clearClassCache(classId, "logs");
      SpreadsheetApp.flush();
      return { success: true };
    }
  }
  return { error: "Không tìm thấy nhật ký" };
}

function getClassAnnouncement(classId) {
  try {
    var ss = getClassSpreadsheet();
    var sheet = ss.getSheetByName('Thông báo lớp');
    if (!sheet) return "";
    
    var data = sheet.getDataRange().getDisplayValues();
    var cleanClassId = String(classId || "").trim();
    
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][1] || "").trim() === cleanClassId) {
        return data[i][3] || "";
      }
    }
    return "";
  } catch (e) {
    Logger.log("Lỗi getClassAnnouncement: " + e.toString());
    return "";
  }
}

function saveClassAnnouncement(classId, className, text) {
  try {
    var ss = getClassSpreadsheet();
    var sheet = ss.getSheetByName('Thông báo lớp');
    if (!sheet) return { error: "Không tìm thấy Sheet Thông báo lớp." };
    
    var data = sheet.getDataRange().getDisplayValues();
    var cleanClassId = String(classId || "").trim();
    var targetRowIndex = -1;
    
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][1] || "").trim() === cleanClassId) {
        targetRowIndex = i + 1;
        break;
      }
    }
    
    var nowStr = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "dd/MM/yyyy HH:mm:ss");
    
    if (targetRowIndex > 0) {
      sheet.getRange(targetRowIndex, 4).setValue(text || "");
      sheet.getRange(targetRowIndex, 5).setValue(nowStr);
    } else {
      var annId = "TB_" + new Date().getTime();
      sheet.appendRow([annId, cleanClassId, className || "", text || "", nowStr]);
    }
    
    clearClassCache(cleanClassId, "announcement");
    SpreadsheetApp.flush();
    return { success: true };
  } catch (e) {
    Logger.log("Lỗi saveClassAnnouncement: " + e.toString());
    return { success: false, error: e.toString() };
  }
}



// Lấy phản hồi từ phụ huynh cho giáo viên lớp học
function getClassTutorFeedback(tutorPhone, tutorCode) {
  try {
    var ssClass = getClassSpreadsheet();
    if (!ssClass) return [];

    // 1. Lấy danh sách các mã lớp học của giáo viên này
    var classList = getClassList(tutorPhone, tutorCode);
    if (!classList || classList.length === 0) return [];
    
    var tutorClassIds = [];
    for (var i = 0; i < classList.length; i++) {
      tutorClassIds.push(String(classList[i].classId).trim());
    }

    var sheetFeedback = ssClass.getSheetByName('Ý kiến Phụ huynh lớp học');
    if (!sheetFeedback) return [];

    try {
      if (typeof cleanupOldFeedback === 'function') {
        cleanupOldFeedback(sheetFeedback, 5);
      }
    } catch(eFB) {}
    var dataFB = sheetFeedback.getDataRange().getDisplayValues();
    var feedbacks = [];
    
    // Quét từ dưới lên để lấy ý kiến mới nhất
    for (var j = dataFB.length - 1; j >= 1; j--) {
      var fbClassId = String(dataFB[j][1]).trim(); // Cột B: Mã lớp
      
      if (tutorClassIds.map(function(id){return id.toUpperCase();}).indexOf(fbClassId.toUpperCase()) !== -1) {
        feedbacks.push({
          timestamp: dataFB[j][5], // Cột F: Thời gian gửi
          studentPhone: String(dataFB[j][2]).replace(/'/g, ''), // Cột C: SĐT Phụ huynh
          studentName: dataFB[j][3], // Cột D: Tên học sinh
          content: dataFB[j][4] // Cột E: Nội dung đóng góp
        });
      }
    }
    
    return feedbacks;
  } catch (e) {
    Logger.log("Lỗi getClassTutorFeedback: " + e.toString());
    return [];
  }
}

// Lấy dữ liệu cho Học sinh Lớp học tra cứu kết quả
function traCuuDuLieuHocSinhLop(phone, hsRow, ss) {
  var studentId = hsRow[0];
  var studentName = hsRow[1];
  var classId = hsRow[2];
  
  var ketQua = {
    timThay: true,
    studentId: studentId,
    classId: classId,
    tenHocSinh: studentName,
    thongBaoHocSinh: "",
    lichSuHocTap: [],
    baiTap: []
  };

  // Schema Thông báo lớp: A=annId(0), B=classId(1), C=className(2), D=text(3), E=timestamp(4)
  var sAnnounce = ss.getSheetByName('Thông báo lớp') || ss.getSheetByName('Thông báo lớp học');
  if (sAnnounce) {
    var dataAnn = sAnnounce.getDataRange().getDisplayValues();
    for (var i = dataAnn.length - 1; i >= 1; i--) {
      // Mã lớp nằm ở cột B (index 1), không phải cột A
      if (String(dataAnn[i][1]).trim() === String(classId).trim()) {
        ketQua.thongBaoHocSinh = dataAnn[i][3]; // Nội dung ở cột D (index 3)
        break;
      }
    }
  }

  // Lấy Ngày tham gia của học sinh để lọc buổi học nếu tính học phí theo buổi
  var joinDateStr = hsRow[4] ? String(hsRow[4]).trim() : "";
  var joinDate = null;
  if (joinDateStr) {
    joinDate = parseAppScriptDate(joinDateStr);
    if (joinDate) joinDate.setHours(0, 0, 0, 0);
  }
  var feeType = (hsRow.length > 9) ? String(hsRow[9]).trim() : "per_session";

  var sLogs = ss.getSheetByName('Nhật ký chung');
  if (sLogs) {
    var dataLogs = sLogs.getDataRange().getDisplayValues();
    for (var j = 1; j < dataLogs.length; j++) {
      if (String(dataLogs[j][1]).trim() === String(classId).trim()) {
        var deletedAt = String(dataLogs[j][12] || "").trim();
        if (deletedAt !== "") continue;

        // Lọc row rỗng - bỏ qua nếu không có ngày và không có trạng thái
        var ngayLog = String(dataLogs[j][4] || "").trim();
        var trangThaiLog = String(dataLogs[j][6] || "").trim();
        if (!ngayLog && !trangThaiLog) continue;

        // Lọc các buổi học diễn ra trước ngày học sinh tham gia lớp học (chỉ áp dụng khi học phí tính theo buổi)
        if (feeType === "per_session" && joinDate && ngayLog) {
          var logDate = parseAppScriptDate(ngayLog);
          if (logDate) {
            logDate.setHours(0, 0, 0, 0);
            if (logDate < joinDate) {
              continue; // Buổi học trước ngày tham gia -> Bỏ qua
            }
          }
        }

        var generalNote = String(dataLogs[j][10] || "").trim();
        var privateNote = "";
        
        var privateAtt = dataLogs[j][6] || "Có mặt";
        var entryTest = dataLogs[j][8] || "-";
        var termTest = dataLogs[j][9] || "-";

        var jsonStr = dataLogs[j][11];
        if (jsonStr) {
          try {
            var pNotes = JSON.parse(jsonStr);
            var sData = pNotes[studentId] || pNotes[String(studentId).trim()] || pNotes[studentName];
            if (!sData && typeof pNotes === 'object') {
              for (var kKey in pNotes) {
                if (kKey === String(studentId).trim() || kKey.toLowerCase() === String(studentName).toLowerCase()) {
                  sData = pNotes[kKey];
                  break;
                }
              }
            }
            if (sData) {
              if (sData.attendance) {
                privateAtt = sData.attendance;
              }
              if (sData.privateNote !== undefined && sData.privateNote !== null) {
                privateNote = String(sData.privateNote).trim();
              }
              if (sData.entryTest !== undefined && sData.entryTest !== null && String(sData.entryTest).trim() !== "") {
                entryTest = String(sData.entryTest).trim();
              }
              if (sData.termTest !== undefined && sData.termTest !== null && String(sData.termTest).trim() !== "") {
                termTest = String(sData.termTest).trim();
              }
            }
          } catch(e) {}
        }

        ketQua.lichSuHocTap.push({
          tuan: dataLogs[j][3],
          ngay: dataLogs[j][4],
          mon: dataLogs[j][5],
          noiDung: generalNote,
          nhanXetRieng: privateNote,
          danhGiaBTVN: dataLogs[j][7],
          diemDauGio: entryTest,
          diemDinhKi: termTest,
          trangThai: privateAtt
        });
      }
    }
  }

  // Sắp xếp mới nhất lên đầu (reverse theo thứ tự sheet)
  ketQua.lichSuHocTap.reverse();

  var sHw = ss.getSheetByName('Bài tập lớp học');
  if (sHw) {
    var dataHw = sHw.getDataRange().getDisplayValues();
    for (var k = 1; k < dataHw.length; k++) {
      var hwClassId = String(dataHw[k][1]).trim();
      var deletedAtHw = String(dataHw[k][10] || "").trim();
      if ((hwClassId === classId || hwClassId === "Tất cả") && deletedAtHw === "") {
        ketQua.baiTap.push({
          mon: dataHw[k][3],
          tenBai: dataHw[k][4],
          link: dataHw[k][9] || dataHw[k][7]
        });
      }
    }
  }
  
  return ketQua;
}

// ============================================================================
// CÁC HÀM BỊ THIẾU - ĐƯỢC THÊM QUA KIỂM THỬ HỆ THỐNG
// ============================================================================

// Cập nhật thông tin tài khoản Giáo viên (Tên + PIN)
function updateTutorAccountInfo(phone, name, pin) {
  var ss = getClassSpreadsheet();
  var normPhone = normalizePhone(phone || "");
  var updated = false;

  // Thử cập nhật trong sheet Mã Giáo viên
  var sTeacher = ss.getSheetByName('Mã Giáo viên') || ss.getSheetByName('Mã giáo viên') || ss.getSheetByName('Mã gia sư');
  if (sTeacher) {
    var data = sTeacher.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (normalizePhone(String(data[i][2] || "")) === normPhone) {
        if (name) sTeacher.getRange(i + 1, 2).setValue(name);
        if (pin && pin.trim() !== "") sTeacher.getRange(i + 1, 4).setValue(pin);
        updated = true;
        break;
      }
    }
  }

  // Thử cập nhật trong sheet Mã Admin nếu chưa tìm thấy
  if (!updated) {
    var sAdmin = ss.getSheetByName('Mã Admin') || ss.getSheetByName('Mã admin');
    if (sAdmin) {
      var dataA = sAdmin.getDataRange().getValues();
      for (var j = 1; j < dataA.length; j++) {
        if (normalizePhone(String(dataA[j][2] || "")) === normPhone) {
          if (name) sAdmin.getRange(j + 1, 2).setValue(name);
          if (pin && pin.trim() !== "") sAdmin.getRange(j + 1, 4).setValue(pin);
          updated = true;
          break;
        }
      }
    }
  }

  SpreadsheetApp.flush();
  return { success: true, updated: updated };
}

// Lấy danh sách bài nộp của học sinh trong lớp
function getClassSubmissions(classId) {
  var ss = getClassSpreadsheet();
  var sheet = ss.getSheetByName('Học sinh nộp bài lớp học');
  if (!sheet) return [];
  var data = sheet.getDataRange().getDisplayValues();
  var submissions = [];
  var cleanClassId = String(classId || "").trim();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][2] || "").trim() === cleanClassId) {
      submissions.push({
        submissionId: data[i][0],
        homeworkId: data[i][1],
        classId: data[i][2],
        subject: data[i][3],
        studentId: data[i][4],
        studentName: data[i][5],
        parentPhone: data[i][6],
        submitTime: data[i][7],
        fileUrl: data[i][8],
        score: data[i][9],
        comment: data[i][10]
      });
    }
  }
  return submissions;
}

// Đánh dấu nhiều buổi học đã thu tiền (Bulk)
function markClassInvoiceBulkPaid(logIds, studentId) {
  return updateClassStudentPaymentStatusBulk(logIds, studentId, true);
}

// Cập nhật trạng thái thanh toán 1 buổi học cho 1 học sinh
function updateClassStudentPaymentStatus(logId, studentId, isPaid) {
  return updateClassStudentPaymentStatusBulk([logId], studentId, isPaid);
}

// Cập nhật trạng thái thanh toán nhiều buổi học cho 1 học sinh
function updateClassStudentPaymentStatusBulk(logIds, studentId, isPaid) {
  if (!logIds || !logIds.length || !studentId) return { success: false, error: "Thiếu thông tin" };
  var ss = getClassSpreadsheet();
  var sheet = ss.getSheetByName('Nhật ký chung');
  if (!sheet) return { success: false, error: "Không tìm thấy sheet Nhật ký chung" };

  var data = sheet.getDataRange().getValues();
  var updatedCount = 0;

  for (var i = 0; i < data.length; i++) {
    var logId = String(data[i][0]).trim();
    if (logIds.indexOf(logId) !== -1) {
      // Đọc JSON nhận xét riêng ở cột 12 (index 11), cập nhật trạng thái paid
      var jsonStr = data[i][11] ? String(data[i][11]).trim() : "";
      var notes = {};
      if (jsonStr) {
        try { notes = JSON.parse(jsonStr); } catch(e) {}
      }
      if (!notes[studentId]) notes[studentId] = {};
      if (typeof notes[studentId] === 'string') {
        notes[studentId] = { note: notes[studentId], paid: isPaid };
      } else {
        notes[studentId].paid = isPaid;
      }
      sheet.getRange(i + 1, 12).setValue(JSON.stringify(notes));
      updatedCount++;
    }
  }

  SpreadsheetApp.flush();
  return { success: true, updatedCount: updatedCount };
}

// Cập nhật thanh toán nhiều học sinh cùng lúc
function updateMultipleStudentsPaymentStatus(updates) {
  // updates = [{logId, studentId, isPaid}, ...]
  if (!updates || !updates.length) return { success: false };
  var ss = getClassSpreadsheet();
  var sheet = ss.getSheetByName('Nhật ký chung');
  if (!sheet) return { success: false, error: "Không tìm thấy sheet" };

  var data = sheet.getDataRange().getValues();
  var logIdMap = {};
  for (var i = 0; i < data.length; i++) {
    var lid = String(data[i][0]).trim();
    if (lid) logIdMap[lid] = i;
  }

  updates.forEach(function(u) {
    var rowIdx = logIdMap[String(u.logId).trim()];
    if (rowIdx === undefined) return;
    var jsonStr = data[rowIdx][11] ? String(data[rowIdx][11]).trim() : "";
    var notes = {};
    try { if (jsonStr) notes = JSON.parse(jsonStr); } catch(e) {}
    if (!notes[u.studentId]) notes[u.studentId] = {};
    if (typeof notes[u.studentId] === 'string') {
      notes[u.studentId] = { note: notes[u.studentId], paid: u.isPaid };
    } else {
      notes[u.studentId].paid = u.isPaid;
    }
    sheet.getRange(rowIdx + 1, 12).setValue(JSON.stringify(notes));
  });

  SpreadsheetApp.flush();
  return { success: true };
}

// Lấy toàn bộ thùng rác (cả nhật ký + bài tập đã xóa mềm) theo giáo viên
function getClassTrashItems(tutorPhone, tutorCode) {
  var ss = getClassSpreadsheet();
  var classes = getClassList(tutorPhone, tutorCode);
  var classIds = classes.map(function(c) { return c.classId; });
  var items = [];

  // Nhật ký bị xóa mềm
  var sLogs = ss.getSheetByName('Nhật ký chung');
  if (sLogs) {
    var dataL = sLogs.getDataRange().getDisplayValues();
    for (var i = 1; i < dataL.length; i++) {
      var classId = String(dataL[i][1] || "").trim();
      var deletedAt = String(dataL[i][12] || "").trim();
      if (deletedAt !== "" && classIds.indexOf(classId) !== -1) {
        items.push({
          type: "log",
          id: dataL[i][0],
          classId: classId,
          className: dataL[i][2],
          label: "Nhật ký: " + (dataL[i][4] || "") + " - " + (dataL[i][5] || ""),
          deletedAt: deletedAt
        });
      }
    }
  }

  // Bài tập bị xóa mềm
  var sHw = ss.getSheetByName('Bài tập lớp học');
  if (sHw) {
    var dataH = sHw.getDataRange().getDisplayValues();
    for (var j = 1; j < dataH.length; j++) {
      var hwClassId = String(dataH[j][1] || "").trim();
      var hwDeleted = String(dataH[j][10] || "").trim();
      if (hwDeleted !== "" && classIds.indexOf(hwClassId) !== -1) {
        items.push({
          type: "hw",
          id: dataH[j][0],
          classId: hwClassId,
          className: dataH[j][2],
          label: "Bài tập: " + (dataH[j][4] || ""),
          deletedAt: hwDeleted
        });
      }
    }
  }

  // Học sinh bị xóa mềm
  var sSt = ss.getSheetByName('Học sinh lớp học');
  if (sSt) {
    var dataS = sSt.getDataRange().getDisplayValues();
    for (var k = 1; k < dataS.length; k++) {
      var stClassId = String(dataS[k][2] || "").trim();
      var stDeleted = String(dataS[k][8] || "").trim();
      if (stDeleted !== "" && classIds.indexOf(stClassId) !== -1) {
        items.push({
          type: "student",
          id: dataS[k][0],
          classId: stClassId,
          className: "",
          label: "Học sinh: " + (dataS[k][1] || ""),
          deletedAt: stDeleted
        });
      }
    }
  }

  // Sắp xếp mới nhất lên đầu
  items.sort(function(a, b) { return b.deletedAt.localeCompare(a.deletedAt); });
  return items;
}

// Phục hồi 1 mục khỏi thùng rác (log, hw, student)
function restoreClassItem(type, itemId, className) {
  if (type === "log") {
    return restoreClassLessonLog(itemId, className);
  } else if (type === "hw") {
    if (typeof restoreClassHomework === 'function') return restoreClassHomework(itemId);
    return { success: false, error: "Không tìm thấy hàm restoreClassHomework" };
  } else if (type === "student") {
    return restoreClassStudent(itemId);
  }
  return { success: false, error: "Loại không hợp lệ: " + type };
}

// Phục hồi nhật ký từ thùng rác (xóa ngày xóa ở cột 13)
function restoreClassLessonLog(logId, className) {
  var ss = getClassSpreadsheet();
  var sheet = ss.getSheetByName('Nhật ký chung');
  if (!sheet) return { success: false, error: "Không tìm thấy sheet" };
  var data = sheet.getDataRange().getValues();
  for (var i = 0; i < data.length; i++) {
    if (String(data[i][0]).trim() === String(logId).trim()) {
      sheet.getRange(i + 1, 13).setValue(""); // Xóa ngày xóa → khôi phục
      var classId = data[i][1];
      if (classId) clearClassCache(classId, "logs");
      SpreadsheetApp.flush();
      return { success: true };
    }
  }
  return { success: false, error: "Không tìm thấy nhật ký" };
}

// Xóa vĩnh viễn 1 mục khỏi thùng rác
function purgeClassItem(type, itemId, className) {
  if (type === "log") {
    return purgeClassLessonLog(itemId);
  } else if (type === "hw") {
    if (typeof purgeClassHomework === 'function') return purgeClassHomework(itemId);
    return { success: false, error: "Không tìm thấy hàm purgeClassHomework" };
  } else if (type === "student") {
    return deleteClassStudentPermanently(itemId);
  }
  return { success: false, error: "Loại không hợp lệ" };
}

// Xóa vĩnh viễn nhật ký khỏi sheet
function purgeClassLessonLog(logId) {
  var ss = getClassSpreadsheet();
  var sheet = ss.getSheetByName('Nhật ký chung');
  if (!sheet) return { success: false, error: "Không tìm thấy sheet" };
  var data = sheet.getDataRange().getValues();
  for (var i = 0; i < data.length; i++) {
    if (String(data[i][0]).trim() === String(logId).trim()) {
      var classId = data[i][1];
      sheet.deleteRow(i + 1);
      if (classId) clearClassCache(classId, "logs");
      SpreadsheetApp.flush();
      return { success: true };
    }
  }
  return { success: false, error: "Không tìm thấy nhật ký" };
}

