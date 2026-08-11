// Exam.gs — Hệ thống Thi trắc nghiệm (Word-Based Parser, không OCR)
// Kiến trúc: Word XML parse → Slides thumbnail → Gemini Vision bbox

// ═══════════════════════════════════════════════════════
//  TIỆN ÍCH
// ═══════════════════════════════════════════════════════

function testConnectGemini() {
  try {
    var apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
    if (!apiKey) return 'Chưa có API Key!';
    var res = UrlFetchApp.fetch('https://generativelanguage.googleapis.com/v1beta/models?key=' + apiKey, { muteHttpExceptions: true });
    return 'Kết nối Gemini OK! HTTP ' + res.getResponseCode();
  } catch(e) { return 'Lỗi: ' + e; }
}

// ═══════════════════════════════════════════════════════
//  BƯỚC 1: GIẢI NÉN & ĐỌC FILE WORD (.docx)
// ═══════════════════════════════════════════════════════

/**
 * Giải nén .docx (ZIP) và trả về các thành phần cần thiết.
 * @param {string} base64Docx - File .docx encode base64
 * @returns {{ documentXml, relsXml, mediaFiles, success, error }}
 */
function unzipDocx(base64Docx) {
  try {
    var bytes = Utilities.base64Decode(base64Docx);
    var blob  = Utilities.newBlob(bytes, 'application/zip', 'de_thi.docx');
    var files = Utilities.unzip(blob);

    var documentXml = '';
    var relsXml     = '';
    var mediaFiles  = {}; // name → Blob

    for (var i = 0; i < files.length; i++) {
      var f    = files[i];
      var name = f.getName();
      if (name === 'word/document.xml') {
        documentXml = f.getDataAsString('UTF-8');
      } else if (name === 'word/_rels/document.xml.rels') {
        relsXml = f.getDataAsString('UTF-8');
      } else if (name.indexOf('word/media/') === 0) {
        var ext = name.split('.').pop().toLowerCase();
        // Chỉ giữ ảnh hiển thị được trên web (bỏ wmf/emf vì browser không support)
        if (ext === 'png' || ext === 'jpg' || ext === 'jpeg' || ext === 'gif' || ext === 'webp') {
          mediaFiles[name] = f;
        }
        // WMF/EMF bỏ qua — sẽ hiển thị qua Slides thumbnail
      }
    }

    if (!documentXml) return { success: false, error: 'Không đọc được word/document.xml từ file .docx' };
    return { success: true, documentXml: documentXml, relsXml: relsXml, mediaFiles: mediaFiles };
  } catch(e) {
    return { success: false, error: 'Lỗi giải nén .docx: ' + e.toString() };
  }
}

// ═══════════════════════════════════════════════════════
//  BƯỚC 2: PARSE XML → TEXT NODES
// ═══════════════════════════════════════════════════════

/**
 * Parse relationships: rId → media file path
 */
function parseRels(relsXml) {
  var map = {};
  var re  = /Id="(rId\d+)"[^>]+Target="([^"]+)"/g;
  var m;
  while ((m = re.exec(relsXml)) !== null) {
    map[m[1]] = m[2]; // e.g. rId5 → "media/image5.emf"
  }
  return map;
}

/**
 * Trích xuất TẤT CẢ text nodes từ document.xml theo thứ tự.
 * OLE objects và WMF/EMF sẽ bị bỏ qua (không có text).
 * Image blips (PNG/JPG) sẽ được ghi nhận.
 * @returns {Array<{text:string, imageRid:string|null}>}
 */
function extractTextNodes(documentXml, relsMap) {
  var results = [];

  // Tách thành các paragraph <w:p>
  var paragraphs = documentXml.match(/<w:p[ >][\s\S]*?<\/w:p>/g) || [];

  for (var pi = 0; pi < paragraphs.length; pi++) {
    var para = paragraphs[pi];

    // Tìm tất cả <w:t> trong paragraph và ghép lại
    var textParts = para.match(/<w:t[^>]*>([^<]*)<\/w:t>/g) || [];
    var fullText  = '';
    for (var ti = 0; ti < textParts.length; ti++) {
      var m = textParts[ti].match(/<w:t[^>]*>([^<]*)<\/w:t>/);
      if (m) fullText += m[1];
    }

    // Tìm ảnh blip trong paragraph (chỉ PNG/JPG từ relsMap)
    var imageRid = null;
    var blipMatch = para.match(/r:embed="(rId\d+)"/);
    if (blipMatch) {
      var rid    = blipMatch[1];
      var target = relsMap[rid] || '';
      var ext    = target.split('.').pop().toLowerCase();
      if (ext === 'png' || ext === 'jpg' || ext === 'jpeg') {
        imageRid = rid;
      }
      // WMF/EMF/OLE: bỏ qua, sẽ render qua Slides thumbnail
    }

    var trimmed = fullText.trim();
    if (trimmed || imageRid) {
      results.push({ text: trimmed, imageRid: imageRid });
    }
  }

  return results;
}

// ═══════════════════════════════════════════════════════
//  BƯỚC 3: NHẬN DIỆN CẤU TRÚC CÂU HỎI
// ═══════════════════════════════════════════════════════

/**
 * Nhận diện cấu trúc câu hỏi từ text nodes.
 * Trả về mảng questions với thông tin cơ bản (không có đáp án).
 */
function detectQuestionStructure(nodes, titleInfo) {
  var questions    = [];
  var currentType  = 'MULTIPLE_CHOICE';
  var passageAccum = '';
  var inPassage    = false;
  var maxQNum      = 0;

  var rSection    = /^(PHẦN|Phần|phan)\s*(I{1,3}|[123])\b/i;
  var rQuestion   = /^(Câu|CAU|cau)\s+(\d+)\s*[:.]\s*/i;
  var rPassage    = /^(Sử dụng|Dùng|Cho|Read|Use|Dựa vào)\s/i;
  var rShortLabel = /^(PHẦN|Phần)\s*(III|3)\b/i;
  var rTFLabel    = /^(PHẦN|Phần)\s*(II|2)\b/i;
  var rAnswerSect = /^\s*(BẢNG\s+)?ĐÁP\s+ÁN|^HƯỚNG\s+DẪN\s+CHẤM/i;

  for (var i = 0; i < nodes.length; i++) {
    var t = (nodes[i].text || '').trim();
    if (!t) continue;

    // DỪNG khi gặp phần đáp án cuối file
    if (rAnswerSect.test(t)) break;

    // Nhận diện section
    if (rShortLabel.test(t)) { currentType = 'SHORT_ANSWER';    continue; }
    if (rTFLabel.test(t))    { currentType = 'TRUE_FALSE';      continue; }
    if (rSection.test(t))    { currentType = 'MULTIPLE_CHOICE'; continue; }

    // Nhận diện passage (đoạn dùng chung)
    if (rPassage.test(t) && t.length > 30) {
      passageAccum = t; inPassage = true; continue;
    }
    if (inPassage && t.length > 20 && !rQuestion.test(t)) {
      passageAccum += ' ' + t; continue;
    }

    // Nhận diện câu hỏi
    var qMatch = rQuestion.exec(t);
    if (qMatch) {
      inPassage = false;
      var qNum  = parseInt(qMatch[2]);
      var qText = t.substring(qMatch[0].length).trim();

      // Bỏ qua câu giả trong bảng đáp án:
      // - Text chỉ là A/B/C/D
      // - Text là "Chọn đáp án A"
      // - Text rỗng
      // - Số câu giảm đột ngột (đang lặp lại từ đầu → đây là bảng đáp án)
      if (qText === '' ||
          /^[ABCDabcd]$/.test(qText) ||
          /^(Chọn|chon)\s*(đáp\s*án\s*|dap\s*an\s*)?[ABCDabcd]/i.test(qText)) {
        continue;
      }
      if (maxQNum > 5 && qNum < maxQNum - 2) break; // câu số reset lại → bảng đáp án

      maxQNum = Math.max(maxQNum, qNum);
      questions.push({
        qNum:         qNum,
        type:         currentType,
        questionText: qText,
        passageText:  passageAccum,
        hasFigure:    nodes[i].imageRid != null,
        imageRid:     nodes[i].imageRid,
        options:      { A: '', B: '', C: '', D: '' },
        correctAnswer: '',
        explanation:  ''
      });
      passageAccum = '';
      continue;
    }

    // Gán options vào câu hỏi hiện tại
    if (questions.length > 0) {
      var last = questions[questions.length - 1];

      // Global regex tách TẤT CẢ A/B/C/D kể cả khi cùng 1 dòng:
      // Ví dụ: "A. 5 K.B. 278 K.C. 268 K.D. 4 K." → A=5K, B=278K, C=268K, D=4K
      if (/^[ABCDabcd][.)]/i.test(t)) {
        var re = /([ABCDabcd])[.)]\s*([\s\S]*?)(?=\s*[ABCDabcd][.)]|$)/g;
        var m;
        while ((m = re.exec(t)) !== null) {
          var k = m[1].toUpperCase();
          var v = m[2].trim();
          if ('ABCD'.indexOf(k) >= 0 && v) last.options[k] = v;
        }
      }

      // Ảnh inline
      if (nodes[i].imageRid) {
        last.hasFigure = true;
        last.imageRid  = last.imageRid || nodes[i].imageRid;
      }
    }
  }

  var title     = titleInfo.title     || 'Đề kiểm tra trắc nghiệm';
  var subject   = titleInfo.subject   || 'Vật lý';
  var timeLimit = titleInfo.timeLimit || 50;
  return { title: title, subject: subject, timeLimit: timeLimit, questions: questions };
}
function extractTitleInfo(nodes) {
  var info = { title: '', subject: '', timeLimit: 50 };
  var rTime = /(\d+)\s*phút/i;
  var rSubj = /(toán|vật\s*lý|hóa|sinh|anh|văn|lịch\s*sử|địa|tin|gdcd|gdkt)/i;
  var subjMap = {
    'toán': 'Toán học', 'vật': 'Vật lý', 'hóa': 'Hóa học',
    'sinh': 'Sinh học', 'anh': 'Tiếng Anh', 'văn': 'Ngữ văn',
    'lịch': 'Lịch sử', 'địa': 'Địa lý', 'tin': 'Tin học',
    'gdcd': 'GDCD', 'gdkt': 'GDKT'
  };

  for (var i = 0; i < Math.min(nodes.length, 20); i++) {
    var t = nodes[i].text;
    if (!t) continue;

    // Tiêu đề: dòng viết HOA chứa "ĐỀ" hoặc "KIỂM TRA" hoặc "THI"
    if (!info.title && /ĐỀ|KIỂM\s*TRA|ĐỀ\s*THI|ÔN\s*TẬP/i.test(t) && t.length < 120) {
      info.title = t.trim();
    }
    // Thời gian
    var tm = rTime.exec(t);
    if (tm) info.timeLimit = parseInt(tm[1]);

    // Môn học
    var sm = rSubj.exec(t.toLowerCase());
    if (sm) {
      var key = sm[1].substring(0, 3).toLowerCase().replace(/\s/g,'');
      info.subject = subjMap[key] || subjMap[Object.keys(subjMap).find(function(k){ return sm[1].toLowerCase().indexOf(k)>=0; })] || sm[1];
    }
  }
  return info;
}

// ═══════════════════════════════════════════════════════
//  BƯỚC 4: TRÍCH ĐÁP ÁN (ĐA DẠNG) + AI FALLBACK
// ═══════════════════════════════════════════════════════

/**
 * Trích đáp án từ XML text nodes.
 * Hỗ trợ NHIỀU DẠNG định dạng đáp án khác nhau.
 * @returns {{ answers: {qNum: answer}, missing: [qNum] }}
 */
function extractAnswersFromXML(nodes, questions) {
  var answers = {}; // qNum → answer string

  // Ghép toàn bộ text để tìm pattern
  var fullText = nodes.map(function(n){ return n.text; }).join('\n');

  // ── Dạng 1: Bảng cuối file "1A 2D 3B 4C..." hoặc "1.A 2.B 3.C"
  var rMC = /\b(\d+)\s*[.\-–:]\s*([ABCD])\b/g;
  var mcMap = {};
  var m;
  // Chỉ tìm trong 30% cuối file (khu vực đáp án)
  var tail = fullText.substring(Math.floor(fullText.length * 0.5));
  while ((m = rMC.exec(tail)) !== null) {
    mcMap[parseInt(m[1])] = m[2];
  }
  if (Object.keys(mcMap).length >= 3) { // Có ít nhất 3 câu → khả năng là bảng đáp án
    Logger.log('Dạng 1 (bảng MCQ): tìm thấy ' + Object.keys(mcMap).length + ' đáp án');
    for (var k in mcMap) answers[k] = mcMap[k];
  }

  // ── Dạng 2: "Đáp số: X.X" hoặc "Đáp s?: X" (SHORT_ANSWER)
  var rSA = /[Ðđ][áa]p\s+s[ốo]?[:\s]+([0-9]+[.,][0-9]+|[0-9]+)/gi;
  var saMatches = fullText.match(rSA) || [];
  // Map theo thứ tự câu SHORT_ANSWER
  var saQuestions = questions.filter(function(q){ return q.type === 'SHORT_ANSWER'; });
  var saValues    = [];
  while ((m = rSA.exec(fullText)) !== null) {
    saValues.push(m[1].replace(',', '.')); // chuẩn hóa dấu thập phân
  }
  for (var si = 0; si < saQuestions.length && si < saValues.length; si++) {
    answers[saQuestions[si].qNum] = saValues[si];
  }
  if (saValues.length > 0) Logger.log('Dạng 2 (Đáp số): tìm thấy ' + saValues.length + ' đáp án');

  // ── Dạng 3: TRUE_FALSE — tìm "đúng"/"sai" hoặc "x" trong bảng kết quả
  // Tìm pattern: "a) x" hoặc "a đúng", "b sai"...
  var rTF    = /\b([abcd])\)\s*(?:[\s\S]{0,100}?)((?:\bx\b)|(?:đúng)|(?:Đúng)|(?:Sai)|(?:sai))/gi;
  var tfMap  = {}; // câu TF → {a:Đ, b:S, c:Đ, d:S}
  var tfQ    = questions.filter(function(q){ return q.type === 'TRUE_FALSE'; });

  // Đơn giản hơn: tìm block "a) ... x" trong từng đoạn bảng kết quả
  var blockRe = /([abcd])\)\s*[\s\S]{0,200}?\b(x|đúng|sai)\b/gi;
  // (Sẽ được xử lý bởi AI fallback nếu không đủ rõ ràng)

  // ── Dạng 4: "Câu 1: A", "Câu 2: D" (dạng liệt kê có chữ "Câu")
  var rCauAns = /[Cc][aâ]u\s+(\d+)\s*[:]\s*([ABCD])\b/g;
  while ((m = rCauAns.exec(fullText)) !== null) {
    if (!answers[parseInt(m[1])]) answers[parseInt(m[1])] = m[2];
  }

  // ── Dạng 5: Bảng dạng HTML-like trong XML: Đúng | x và Sai | x
  // Sẽ được xử lý bởi AI khi cần

  // Xác định câu nào còn thiếu đáp án
  var missing = [];
  for (var qi = 0; qi < questions.length; qi++) {
    if (!answers[questions[qi].qNum]) missing.push(questions[qi].qNum);
  }

  Logger.log('Tổng đáp án tìm được từ XML: ' + Object.keys(answers).length + '/' + questions.length);
  Logger.log('Còn thiếu: ' + missing.length + ' câu → sẽ dùng AI');

  return { answers: answers, missing: missing };
}

/**
 * Dùng Gemini để:
 * 1. Phát hiện đáp án từ toàn bộ text (mọi format)
 * 2. Tạo đáp án cho câu chưa có (nếu đề không có đáp án)
 */
function resolveAnswersWithAI(nodes, questions, existingAnswers, apiKey) {
  try {
    var apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=' + apiKey;

    // Ghép text để gửi cho AI
    var textDump = nodes.map(function(n){ return n.text; }).filter(Boolean).join('\n');
    // Giới hạn 8000 ký tự
    if (textDump.length > 8000) textDump = textDump.substring(0, 4000) + '\n...\n' + textDump.substring(textDump.length - 4000);

    // Danh sách câu cần AI giải quyết
    var needAI = questions.filter(function(q){ return !existingAnswers[q.qNum]; });
    if (needAI.length === 0) return existingAnswers;

    var qList = needAI.map(function(q){
      return 'Câu ' + q.qNum + ' (' + q.type + '): ' + (q.questionText || '(có công thức toán)');
    }).join('\n');

    var prompt =
      'Đây là nội dung (text) của một đề thi Việt Nam. Công thức toán có thể bị thiếu do định dạng file.\n' +
      'NHIỆM VỤ: Tìm đáp án cho CÁC CÂU HỎI BÊN DƯỚI từ bảng đáp án hoặc lời giải trong text.\n' +
      'Nếu không tìm thấy trong text → suy luận dựa trên context.\n\n' +
      '=== TEXT ĐỀ THI ===\n' + textDump + '\n\n' +
      '=== CÁC CÂU CẦN TÌM ĐÁP ÁN ===\n' + qList + '\n\n' +
      'TRẢ VỀ JSON object, key là số câu (string), value là đáp án:\n' +
      '- MULTIPLE_CHOICE: "A", "B", "C", hoặc "D"\n' +
      '- TRUE_FALSE: "Đ,Đ,S,S" (4 ký tự Đ/S cho a,b,c,d theo thứ tự)\n' +
      '- SHORT_ANSWER: số hoặc chuỗi ngắn (ví dụ: "7.88", "961")\n' +
      'Ví dụ: {"1":"A","2":"C","3":"Đ,S,Đ,S","4":"7.88"}';

    var schema = {
      type: 'object',
      additionalProperties: { type: 'string' }
    };

    var resp = UrlFetchApp.fetch(apiUrl, {
      method: 'POST', contentType: 'application/json',
      payload: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: schema,
          temperature: 0,
          maxOutputTokens: 512
        }
      }),
      muteHttpExceptions: true
    });

    if (resp.getResponseCode() === 200) {
      var parsed = JSON.parse(JSON.parse(resp.getContentText()).candidates[0].content.parts[0].text);
      Logger.log('AI đáp án: ' + JSON.stringify(parsed));
      // Merge với existing answers
      for (var k in parsed) {
        if (!existingAnswers[parseInt(k)]) {
          existingAnswers[parseInt(k)] = parsed[k];
        }
      }
    } else {
      Logger.log('AI answer HTTP ' + resp.getResponseCode());
    }

  } catch(e) {
    Logger.log('resolveAnswersWithAI error: ' + e);
  }
  return existingAnswers;
}

// ═══════════════════════════════════════════════════════
//  BƯỚC 5: UPLOAD ẢNH PNG/JPG LÊN DRIVE (nếu có)
// ═══════════════════════════════════════════════════════

function uploadMediaToDrive(mediaFiles, usedRids, relsMap, figureFolder) {
  var ridToUrl = {};
  for (var rid in usedRids) {
    var target = relsMap[rid]; // e.g. "media/image2.jpg"
    if (!target) continue;
    var fullKey = 'word/' + target;
    var blob    = mediaFiles[fullKey];
    if (!blob) continue;
    try {
      blob.setName('img_' + rid + '_' + target.split('/').pop());
      var f = figureFolder.createFile(blob);
      f.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      ridToUrl[rid] = 'https://drive.google.com/uc?export=view&id=' + f.getId();
    } catch(e) {
      Logger.log('uploadMedia error ' + rid + ': ' + e);
    }
  }
  return ridToUrl;
}

// ═══════════════════════════════════════════════════════
//  ENTRY POINT: parseWordExam (thay thế uploadAndCreateExam)
// ═══════════════════════════════════════════════════════

/**
 * Nhận file .docx base64, parse XML, lưu vào Sheets.
 * Hàm này gọi từ giao diện (class-dashboard.html).
 */
function parseWordExam(base64Docx, mimeType, tutorPhone) {
  try {
    var apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
    if (!apiKey) return { success: false, error: 'Chưa cấu hình GEMINI_API_KEY.' };

    // ── 1. Kiểm tra file type
    var isDocx = mimeType && (
      mimeType.indexOf('wordprocessingml') >= 0 ||
      mimeType.indexOf('docx') >= 0 ||
      mimeType.indexOf('msword') >= 0 ||
      mimeType.indexOf('openxmlformats') >= 0
    );
    if (!isDocx) return { success: false, error: 'Chỉ nhận file Word (.docx). File bạn gửi là: ' + mimeType };

    // ── 2. Giải nén .docx
    Logger.log('=== parseWordExam bắt đầu ===');
    var unzipResult = unzipDocx(base64Docx);
    if (!unzipResult.success) return { success: false, error: unzipResult.error };

    var documentXml = unzipResult.documentXml;
    var relsXml     = unzipResult.relsXml;
    var mediaFiles  = unzipResult.mediaFiles;

    // ── 3. Parse cấu trúc
    var relsMap  = parseRels(relsXml);
    var nodes    = extractTextNodes(documentXml, relsMap);
    var titleInfo = extractTitleInfo(nodes);
    var examData  = detectQuestionStructure(nodes, titleInfo);

    Logger.log('Phát hiện ' + examData.questions.length + ' câu hỏi');

    if (examData.questions.length === 0) {
      return { success: false, error: 'Không phát hiện được câu hỏi nào. Kiểm tra định dạng file Word (cần có "Câu 1:", "Câu 2:"...)' };
    }

    // ── 4. Trích đáp án từ XML (đa dạng format)
    var ansResult = extractAnswersFromXML(nodes, examData.questions);
    var answers   = ansResult.answers;

    // ── 5. AI resolve đáp án còn thiếu
    if (ansResult.missing.length > 0) {
      Logger.log('Gọi AI để xử lý ' + ansResult.missing.length + ' câu chưa có đáp án...');
      answers = resolveAnswersWithAI(nodes, examData.questions, answers, apiKey);
    }

    // ── 6. Gán đáp án vào câu hỏi
    for (var qi = 0; qi < examData.questions.length; qi++) {
      var q   = examData.questions[qi];
      var ans = answers[q.qNum];
      if (ans) q.correctAnswer = String(ans).trim();
    }

    // ── 7. Lưu file gốc .docx lên Drive (để dùng convert → Slides sau)
    var fileUrl = '';
    var fileId  = '';
    try {
      var folderName = 'ĐỀ THI AI (Bản gốc)';
      var folders    = DriveApp.getRootFolder().getFoldersByName(folderName);
      var parentFolder = folders.hasNext() ? folders.next() : DriveApp.getRootFolder().createFolder(folderName);
      var docxBytes  = Utilities.base64Decode(base64Docx);
      var docxBlob   = Utilities.newBlob(docxBytes, mimeType, 'DeThi_' + Date.now() + '.docx');
      var driveFile  = parentFolder.createFile(docxBlob);
      driveFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      fileUrl = driveFile.getUrl();
      fileId  = driveFile.getId();
      Logger.log('Đã lưu .docx lên Drive: ' + fileUrl);
    } catch(driveErr) {
      Logger.log('Lỗi lưu Drive (bỏ qua): ' + driveErr);
    }

    // ── 8. Upload ảnh PNG/JPG inline (nếu có)
    var usedRids = {};
    for (var qi2 = 0; qi2 < examData.questions.length; qi2++) {
      if (examData.questions[qi2].imageRid) {
        usedRids[examData.questions[qi2].imageRid] = true;
      }
    }
    if (Object.keys(usedRids).length > 0 && Object.keys(mediaFiles).length > 0) {
      try {
        var figFolders   = DriveApp.getRootFolder().getFoldersByName('Hình Vẽ Đề Thi');
        var figureFolder = figFolders.hasNext() ? figFolders.next() : DriveApp.getRootFolder().createFolder('Hình Vẽ Đề Thi');
        var ridToUrl     = uploadMediaToDrive(mediaFiles, usedRids, relsMap, figureFolder);
        // Gán URL ảnh vào câu hỏi
        for (var qi3 = 0; qi3 < examData.questions.length; qi3++) {
          var q3 = examData.questions[qi3];
          if (q3.imageRid && ridToUrl[q3.imageRid]) {
            q3.questionImageUrl = ridToUrl[q3.imageRid];
          }
        }
      } catch(imgErr) {
        Logger.log('Lỗi upload ảnh inline: ' + imgErr);
      }
    }

    // ── 9. Lưu vào Google Sheets
    examData.fileUrl = fileUrl;
    examData.fileId  = fileId;

    var ss        = getClassSpreadsheet();
    var sheetExam = ss.getSheetByName('Đề thi online');
    if (!sheetExam) {
      sheetExam = ss.insertSheet('Đề thi online');
      sheetExam.appendRow(['Mã đề', 'Tên đề', 'Thời gian (phút)', 'Dữ liệu JSON', 'Người tạo (SĐT)', 'Ngày tạo', 'Môn học', 'Link Đề Gốc']);
      sheetExam.getRange(1, 1, 1, 8).setFontWeight('bold').setBackground('#8E4DFF').setFontColor('#FFFFFF');
      sheetExam.setFrozenRows(1);
    } else {
      var headers = sheetExam.getRange(1, 1, 1, sheetExam.getLastColumn()).getValues()[0];
      if (headers.indexOf('Môn học')    === -1) sheetExam.getRange(1, 7).setValue('Môn học').setFontWeight('bold').setBackground('#8E4DFF').setFontColor('#FFFFFF');
      if (headers.indexOf('Link Đề Gốc') === -1) sheetExam.getRange(1, 8).setValue('Link Đề Gốc').setFontWeight('bold').setBackground('#8E4DFF').setFontColor('#FFFFFF');
    }

    var examId = 'DE_' + Math.floor(100000 + Math.random() * 900000);
    var nowStr = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm:ss');

    sheetExam.appendRow([
      examId,
      examData.title    || 'Đề kiểm tra trắc nghiệm',
      examData.timeLimit || 50,
      JSON.stringify(examData),
      tutorPhone || 'Admin',
      nowStr,
      examData.subject  || 'Vật lý',
      fileUrl
    ]);
    SpreadsheetApp.flush();

    Logger.log('=== parseWordExam hoàn thành. examId=' + examId + ', ' + examData.questions.length + ' câu ===');

    return {
      success:       true,
      examId:        examId,
      title:         examData.title,
      timeLimit:     examData.timeLimit,
      questionCount: examData.questions.length,
      fileUrl:       fileUrl,
      questions:     examData.questions
    };

  } catch(e) {
    Logger.log('parseWordExam FATAL: ' + e.toString());
    return { success: false, error: e.toString() };
  }
}

/**
 * Giữ tương thích với code cũ (class-dashboard.html vẫn gọi uploadAndCreateExam)
 * Tự động redirect sang parseWordExam nếu là file .docx
 */
function uploadAndCreateExam(base64File, mimeType, tutorPhone) {
  // Chuyển hướng về parseWordExam cho tất cả file
  return parseWordExam(base64File, mimeType, tutorPhone);
}


// ===== LƯU ĐỀ THI AZOTA (không cần upload file, chỉ cần link) =====
function saveAzotaExam(examName, subject, azotaLink, tutorPhone, grade) {
  try {
    if (!examName || !azotaLink) return { success: false, error: 'Thiếu tên đề hoặc link Azota.' };

    var ss    = getClassSpreadsheet();
    var sheet = ss.getSheetByName('Đề thi online');
    if (!sheet) return { success: false, error: 'Sheet "Đề thi online" không tồn tại.' };

    var examId = 'AZ' + new Date().getTime().toString(36).toUpperCase().slice(-5);

    var examData = {
      title:     examName,
      subject:   subject || 'Khác',
      grade:     grade || '',
      timeLimit: 0,
      azotaLink: azotaLink,
      questions: [],
      totalQ:    0,
      source:    'azota'
    };

    var nowStr = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm');

    // Cột theo chuẩn Google Sheet:
    // A(0):Mã đề | B(1):Tên đề | C(2):Thời gian | D(3):JSON | E(4):Người tạo (SĐT) | F(5):Ngày tạo | G(6):Môn học | H(7):Link Azota | I(8):Khối lớp
    sheet.appendRow([
      examId,
      examName,
      0,
      JSON.stringify(examData),
      tutorPhone || 'Admin',
      nowStr,
      subject || 'Khác',
      azotaLink,
      grade || ''
    ]);
    SpreadsheetApp.flush();

    Logger.log('saveAzotaExam: saved ' + examId + ' | ' + examName + ' | ' + azotaLink);
    return { success: true, examId: examId };

  } catch(e) {
    Logger.log('saveAzotaExam error: ' + e.toString());
    return { success: false, error: e.toString() };
  }
}
function extractAllExamFiguresBatch(examId) {
  try {
    var apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
    if (!apiKey) return { success: false, error: 'Chưa cấu hình GEMINI_API_KEY.' };

    // 1. Đọc thông tin đề thi từ Sheet
    var ss = getClassSpreadsheet();
    var sheet = ss.getSheetByName('Đề thi online');
    if (!sheet) return { success: false, error: 'Sheet "Đề thi online" không tồn tại.' };

    var data = sheet.getDataRange().getValues();
    var cleanId = String(examId || '').trim().toUpperCase();
    var rowIdx = -1;
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][0]).trim().toUpperCase() === cleanId) { rowIdx = i; break; }
    }
    if (rowIdx < 0) return { success: false, error: 'Không tìm thấy đề thi: ' + examId };

    var examData = JSON.parse(String(data[rowIdx][3]));
    var fileUrl  = String(data[rowIdx][7] || examData.fileUrl || '');
    var fileId   = examData.fileId || '';

    // Lấy fileId từ fileUrl nếu chưa có
    if (!fileId && fileUrl) {
      var m = fileUrl.match(/[-\w]{25,}/);
      if (m) fileId = m[0];
    }
    if (!fileId) return { success: false, error: 'Không tìm thấy file gốc của đề thi.' };

    // 2. Lấy TẤT CẢ câu hỏi chưa có ảnh thân câu
    var questionsWithFigure = examData.questions.filter(function(q) {
      if (q.figureUrl && q.figureUrl.trim() !== '' && q.figureClip) return false;
      return true;
    });

    if (questionsWithFigure.length === 0) {
      return { success: true, figuresExtracted: 0, totalFigures: 0,
               message: 'Tất cả câu hỏi đã có ảnh thân câu.' };
    }

    // 3. OAuth token
    var oauthToken = ScriptApp.getOAuthToken();
    var geminiUrl  = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=' + apiKey;

    // 4. Convert .docx → Google Slides (Drive copy API)
    var slideFileId = null;
    try {
      var copyResp = UrlFetchApp.fetch(
        'https://www.googleapis.com/drive/v3/files/' + fileId + '/copy',
        {
          method: 'POST', contentType: 'application/json',
          payload: JSON.stringify({
            name: 'tmp_slides_' + examId,
            mimeType: 'application/vnd.google-apps.presentation'
          }),
          headers: { Authorization: 'Bearer ' + oauthToken },
          muteHttpExceptions: true
        }
      );
      if (copyResp.getResponseCode() !== 200) throw new Error('HTTP ' + copyResp.getResponseCode());
      slideFileId = JSON.parse(copyResp.getContentText()).id;
      if (!slideFileId) throw new Error('Drive không trả về slideFileId');
      Logger.log('✓ .docx → Slides: ' + slideFileId);
    } catch(convErr) {
      return { success: false, error: 'Lỗi convert .docx → Slides: ' + convErr };
    }

    // 5. Chờ Google xử lý xong + lấy danh sách slide objectIds
    Utilities.sleep(4000);
    var slideObjectIds = [];
    try {
      var presResp = UrlFetchApp.fetch(
        'https://slides.googleapis.com/v1/presentations/' + slideFileId + '?fields=slides.objectId',
        { headers: { Authorization: 'Bearer ' + oauthToken }, muteHttpExceptions: true }
      );
      if (presResp.getResponseCode() === 200) {
        slideObjectIds = (JSON.parse(presResp.getContentText()).slides || []).map(function(s){ return s.objectId; });
        Logger.log('Tổng số trang: ' + slideObjectIds.length);
      }
    } catch(presErr) { Logger.log('Lỗi lấy slides: ' + presErr); }

    if (slideObjectIds.length === 0) {
      try { DriveApp.getFileById(slideFileId).setTrashed(true); } catch(e2) {}
      return { success: false, error: 'Không lấy được danh sách trang từ Slides.' };
    }

    // 6. Tạo thư mục lưu hình
    var figFolders   = DriveApp.getRootFolder().getFoldersByName('Hình Vẽ Đề Thi');
    var figureFolder = figFolders.hasNext() ? figFolders.next() : DriveApp.getRootFolder().createFolder('Hình Vẽ Đề Thi');

    Logger.log('=== Ver 8 (Word): Batch Page Scan - ' + slideObjectIds.length + ' trang ===')


    // Build qNum set for fast lookup
    var qNumSet = {};
    questionsWithFigure.forEach(function(q) { qNumSet[q.qNum] = q; });

    // Map: qNum → {figureUrl, figureClip}
    var qNumToData = {};
    var figCount   = 0;

    // ========== BƯỚC 1: Download TẤT CẢ thumbnails theo từng trang ==========
    var pageThumbnails = {}; // pageNum (1-indexed) → {url, base64}

    for (var pi = 0; pi < slideObjectIds.length; pi++) {
      var pageNum      = pi + 1;
      var pageObjectId = slideObjectIds[pi];

      try {
        var thumbApiUrl =
          'https://slides.googleapis.com/v1/presentations/' + slideFileId +
          '/pages/' + pageObjectId +
          '/thumbnail?thumbnailProperties.thumbnailSize=LARGE';

        var thumbResp = UrlFetchApp.fetch(thumbApiUrl, {
          headers: { Authorization: 'Bearer ' + oauthToken },
          muteHttpExceptions: true
        });

        if (thumbResp.getResponseCode() !== 200) {
          Logger.log('✗ Trang ' + pageNum + ': Slides API lỗi ' + thumbResp.getResponseCode());
          continue;
        }

        var thumbPngUrl = JSON.parse(thumbResp.getContentText()).contentUrl;
        if (!thumbPngUrl) { Logger.log('✗ Trang ' + pageNum + ': không có contentUrl'); continue; }

        var imgResp = UrlFetchApp.fetch(thumbPngUrl, { muteHttpExceptions: true });
        if (imgResp.getResponseCode() !== 200) {
          Logger.log('✗ Trang ' + pageNum + ': lỗi download PNG'); continue;
        }

        var imgBlob   = imgResp.getBlob();
        var imgBase64 = Utilities.base64Encode(imgBlob.getBytes());

        imgBlob.setName('fig_' + examId + '_p' + pageNum + '.png');
        var savedFile = figureFolder.createFile(imgBlob);
        savedFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        var driveUrl  = 'https://drive.google.com/uc?export=view&id=' + savedFile.getId();

        pageThumbnails[pageNum] = { url: driveUrl, base64: imgBase64 };
        Logger.log('✓ Trang ' + pageNum + ' → Drive: ' + driveUrl);

      } catch(pageErr) {
        Logger.log('✗ Lỗi trang ' + pageNum + ': ' + pageErr);
      }

      Utilities.sleep(200); // nhẹ rate-limit
    }

    // ========== BƯỚC 2: Với mỗi trang → 1 lần gọi Gemini Vision cho TẤT CẢ câu ==========
    var batchSchema = {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          qNum:  { type: 'integer' },
          found: { type: 'boolean' },
          x_min: { type: 'integer' },
          y_min: { type: 'integer' },
          x_max: { type: 'integer' },
          y_max: { type: 'integer' }
        },
        required: ['qNum', 'found', 'x_min', 'y_min', 'x_max', 'y_max']
      }
    };

    var pageNums = Object.keys(pageThumbnails);
    for (var pki = 0; pki < pageNums.length; pki++) {
      var pn   = parseInt(pageNums[pki]);
      var pData = pageThumbnails[pn];

      try {
        Utilities.sleep(600);

        var batchPrompt =
          'Đây là ảnh chụp TRANG ' + pn + ' của đề thi Vật lý/Toán/Hóa Việt Nam.\n' +
          'NHIỆM VỤ: Tìm TẤT CẢ câu hỏi xuất hiện trên trang này.\n' +
          'Với MỖI câu hỏi, xác định VÙNG TOÀN BỘ CÂU HỎI:\n' +
          '  - Bắt đầu từ dòng "Câu X." hoặc "Câu X:" (X là số thứ tự)\n' +
          '  - BAO GỒM toàn bộ nội dung câu hỏi, hình vẽ, đồ thị, bảng số liệu\n' +
          '  - BAO GỒM CẢ các phương án lựa chọn A, B, C, D (hoặc a, b, c, d)\n' +
          '    vì các phương án có thể chứa công thức toán không đọc được dưới dạng text\n' +
          '  - KẾT THÚC: sau phương án cuối cùng (D hoặc d) của câu đó\n' +
          '  - KHÔNG bao gồm phần "Lời giải" hoặc "Đáp án" nằm phía dưới\n' +
          'Tọa độ theo thang 0-1000 (0=trái/trên, 1000=phải/dưới).\n' +
          'Nếu trang không có câu hỏi nào → trả về mảng rỗng [].\n' +
          'CHỈ trả về JSON array theo schema đã định.';

        var batchResp = UrlFetchApp.fetch(geminiUrl, {
          method: 'POST',
          contentType: 'application/json',
          payload: JSON.stringify({
            contents: [{ parts: [
              { text: batchPrompt },
              { inlineData: { mimeType: 'image/png', data: pData.base64 } }
            ]}],
            generationConfig: {
              responseMimeType: 'application/json',
              responseSchema: batchSchema,
              temperature: 0,
              maxOutputTokens: 1024
            }
          }),
          muteHttpExceptions: true
        });

        if (batchResp.getResponseCode() !== 200) {
          Logger.log('✗ Trang ' + pn + ': Gemini Vision lỗi ' + batchResp.getResponseCode());
          continue;
        }

        var batchResults = JSON.parse(
          JSON.parse(batchResp.getContentText()).candidates[0].content.parts[0].text
        );

        Logger.log('Trang ' + pn + ': Gemini phát hiện ' + batchResults.length + ' câu');

        for (var ri = 0; ri < batchResults.length; ri++) {
          var item  = batchResults[ri];
          var clipW = item.x_max - item.x_min;
          var clipH = item.y_max - item.y_min;

          if (item.found && clipW >= 50 && clipH >= 30 && clipW < 990 && clipH < 990) {
            qNumToData[item.qNum] = {
              figureUrl:  pData.url,
              figureClip: {
                xMin: Math.max(0,    item.x_min - 10),
                yMin: Math.max(0,    item.y_min - 10),
                xMax: Math.min(1000, item.x_max + 10),
                yMax: Math.min(1000, item.y_max + 10)
              }
            };
            Logger.log('  ✓ Câu ' + item.qNum + ': bbox ' + JSON.stringify(qNumToData[item.qNum].figureClip));
          }
        }

      } catch(batchErr) {
        Logger.log('✗ Lỗi batch trang ' + pn + ': ' + batchErr);
      }
    }

    // ========== BƯỚC 3: Gán dữ liệu vào từng câu hỏi ==========
    examData.questions.forEach(function(q) {
      var data = qNumToData[q.qNum];
      if (data) {
        q.figureUrl  = data.figureUrl;
        q.figureClip = data.figureClip;
        figCount++;
      }
    });

    Logger.log('=== Hoàn tất: ' + figCount + '/' + questionsWithFigure.length + ' câu có ảnh thân câu ===');

    // 10. Cập nhật JSON trong Sheet
    sheet.getRange(rowIdx + 1, 4).setValue(JSON.stringify(examData));
    SpreadsheetApp.flush();

    // 11. Xóa file Slides tạm
    try {
      DriveApp.getFileById(slideFileId).setTrashed(true);
      Logger.log('✓ Đã xóa file Slides tạm.');
    } catch(delErr) {
      Logger.log('Không xóa được file tạm: ' + delErr);
    }

    return {
      success: true,
      figuresExtracted: figCount,
      totalFigures: questionsWithFigure.length,
      message: 'Batch scan ' + pageNums.length + ' trang → ' + figCount + '/' + questionsWithFigure.length + ' câu có ảnh.'
    };


  } catch(e) {
    Logger.log('extractAllExamFiguresBatch error: ' + e.toString());
    return { success: false, error: e.toString() };
  }
}


function getTeacherExams(tutorPhone) {
  try {
    var ss = getClassSpreadsheet();
    var sheetExam = ss.getSheetByName('Đề thi online');
    if (!sheetExam) return [];
    
    var data = sheetExam.getDataRange().getDisplayValues();
    var list = [];
    var rawPhone = String(tutorPhone || "").trim();
    var cleanPhone = rawPhone.replace(/\D/g, "");
    if (cleanPhone.startsWith("0")) cleanPhone = cleanPhone.substring(1);

    // 1. Quét thông tin giao đề
    var assignMap = {};
    var sheetAssign = ss.getSheetByName('Giao đề thi');
    if (sheetAssign) {
      var assignData = sheetAssign.getDataRange().getDisplayValues();
      for (var a = 1; a < assignData.length; a++) {
        var eId = String(assignData[a][0]).trim().toUpperCase();
        var cId = String(assignData[a][1]).trim().toUpperCase();
        var status = assignData[a][3];
        if (status === "Mở") {
          if (!assignMap[eId]) assignMap[eId] = [];
          assignMap[eId].push(cId);
        }
      }
    }

    // 2. Quét tên lớp học để map
    var classMap = {};
    var sheetClasses = ss.getSheetByName('Danh sách lớp học') || ss.getSheetByName('Mã lớp học');
    if (sheetClasses) {
      var classData = sheetClasses.getDataRange().getDisplayValues();
      for (var c = 1; c < classData.length; c++) {
        classMap[String(classData[c][0]).trim().toUpperCase()] = classData[c][1];
      }
    }
    
    for (var i = 1; i < data.length; i++) {
      var rawCreator = String(data[i][4] || "").trim();
      var cleanCreator = rawCreator.replace(/\D/g, "");
      if (cleanCreator.startsWith("0")) cleanCreator = cleanCreator.substring(1);

      var isOwner = (
        rawPhone === "" ||
        rawCreator === rawPhone ||
        (cleanPhone !== "" && cleanCreator === cleanPhone) ||
        rawCreator.toLowerCase() === "admin" ||
        rawCreator.indexOf("2026") !== -1
      );

      if (isOwner) {
        var eId = String(data[i][0]).trim().toUpperCase();
        var assignedIds = assignMap[eId] || [];
        var assignedNames = assignedIds.map(function(cid) {
          return classMap[cid] || cid;
        }).join(", ");

        var titleVal = data[i][1] || 'Đề thi';
        var azLink   = (data[i].length > 7) ? String(data[i][7] || '') : '';
        var gradeVal = (data[i].length > 8) ? String(data[i][8] || '') : '';

        // Fallback đọc từ JSON cột D (3) nếu cột H hoặc I bị rỗng hoặc lệch
        if ((!azLink || !gradeVal) && data[i][3]) {
          try {
            var parsedJson = JSON.parse(data[i][3]);
            if (parsedJson) {
              if (!azLink && parsedJson.azotaLink) azLink = parsedJson.azotaLink;
              if (!gradeVal && parsedJson.grade) gradeVal = parsedJson.grade;
              if (parsedJson.title && titleVal === 'Đề thi') titleVal = parsedJson.title;
            }
          } catch(e) {}
        }

        list.push({
          examId:          data[i][0],
          title:           titleVal,
          timeLimit:       parseInt(data[i][2]) || 0,
                  dateCreated:     (data[i][5] && data[i][5] !== 'active') ? data[i][5] : ((data[i][4] && data[i][4] !== 'active') ? data[i][4] : ''),
          subject:         (data[i].length > 6 && data[i][6]) ? data[i][6] : 'Khác',
          assignedClasses: assignedNames || 'Chưa giao',
          azotaLink:       azLink,
          grade:           gradeVal
        });
      }
    }
    // Trả về đề thi mới nhất xếp lên đầu
    return list.reverse();
  } catch(e) {
    return [];
  }
}
function assignExamToClass(examId, classId, status) {
  try {
    var ss = getClassSpreadsheet();
    var sheetAssign = ss.getSheetByName('Giao đề thi');
    
    if (!sheetAssign) {
      sheetAssign = ss.insertSheet('Giao đề thi');
      sheetAssign.appendRow(["Mã đề", "Mã lớp", "Ngày giao", "Trạng thái"]);
      sheetAssign.getRange(1, 1, 1, 4).setFontWeight("bold").setBackground("#8E4DFF").setFontColor("#FFFFFF");
      sheetAssign.setFrozenRows(1);
    }
    
    var data = sheetAssign.getDataRange().getDisplayValues();
    var foundIndex = -1;
    var cleanExamId = String(examId).trim().toUpperCase();
    var cleanClassId = String(classId).trim().toUpperCase();
    
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][0]).trim().toUpperCase() === cleanExamId && String(data[i][1]).trim().toUpperCase() === cleanClassId) {
        foundIndex = i + 1; // 1-based index cho sheet
        break;
      }
    }
    
    var nowStr = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "dd/MM/yyyy HH:mm:ss");
    var activeStatus = status || "Mở"; // Mở hoặc Đóng
    
    if (foundIndex !== -1) {
      // Cập nhật trạng thái giao đề cũ
      sheetAssign.getRange(foundIndex, 3).setValue(nowStr);
      sheetAssign.getRange(foundIndex, 4).setValue(activeStatus);
    } else {
      // Ghi bản ghi giao đề mới
      sheetAssign.appendRow([examId, classId, nowStr, activeStatus]);
    }
    
    SpreadsheetApp.flush();
    return { success: true, message: "Giao đề thi thành công!" };
  } catch(e) {
    return { success: false, error: e.toString() };
  }
}

/**
 * Lấy danh sách các đề thi được giao cho một lớp học (Dành cho học sinh xem để thi)
 */
function getAssignedExamsForClass(classId) {
  try {
    var ss = getClassSpreadsheet();
    var sheetAssign = ss.getSheetByName('Giao đề thi');
    var sheetExam = ss.getSheetByName('Đề thi online');
    if (!sheetAssign || !sheetExam) return [];
    
    var assignData = sheetAssign.getDataRange().getDisplayValues();
    var examData = sheetExam.getDataRange().getDisplayValues();
    
    // Tạo map thông tin đề thi để tra cứu nhanh
    var examMap = {};
    for (var i = 1; i < examData.length; i++) {
      var azLink = (examData[i].length > 7) ? String(examData[i][7] || '') : '';
      // Fallback from JSON
      if (!azLink && examData[i][3]) {
        try { var pj = JSON.parse(examData[i][3]); if (pj && pj.azotaLink) azLink = pj.azotaLink; } catch(e) {}
      }
      examMap[examData[i][0]] = {
        title: examData[i][1] || (examData[i][3] ? (JSON.parse(examData[i][3]).title || '') : ''),
        timeLimit: parseInt(examData[i][2]) || 0,
        azotaLink: azLink
      };
    }
    
    var list = [];
    var cleanClassId = String(classId).trim().toUpperCase();
    
    for (var j = 1; j < assignData.length; j++) {
      if (String(assignData[j][1]).trim().toUpperCase() === cleanClassId && assignData[j][3] === "Mở") {
        var eId = assignData[j][0];
        var info = examMap[eId];
        if (info) {
          list.push({
            examId: eId,
            title: info.title,
            timeLimit: info.timeLimit,
            azotaLink: info.azotaLink || '',
            dateAssigned: assignData[j][2]
          });
        }
      }
    }
    return list;
  } catch(e) {
    return [];
  }
}

/**
 * Lấy đề thi dành cho học sinh (Ẩn đáp án đúng của câu hỏi)
 */
function getExamForStudent(examId) {
  try {
    var ss = getClassSpreadsheet();
    var sheetExam = ss.getSheetByName('Đề thi online');
    if (!sheetExam) return { error: "Không tìm thấy dữ liệu đề thi." };
    
    var data = sheetExam.getDataRange().getDisplayValues();
    var cleanId = String(examId || "").trim().toUpperCase();
    
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][0]).trim().toUpperCase() === cleanId) {
        var examObj = JSON.parse(data[i][3]);
        
        // Ẩn trường correctAnswer và explanation để chống gian lận
        var studentQuestions = examObj.questions.map(function(q) {
          return {
            qNum: q.qNum,
            type: q.type || 'MULTIPLE_CHOICE',
            passageText: q.passageText || '',
            questionText: q.questionText,
            options: q.options || {},
            hasFigure: q.hasFigure || false,
            hasOptionFigures: q.hasOptionFigures || false, 
            figureSvg: q.figureSvg || '',      
            figureUrl: q.figureUrl || ''
          };
        });
        
        return {
          success: true,
          examId: examId,
          title: examObj.title,
          subject: examObj.subject || '',
          timeLimit: examObj.timeLimit,
          azotaLink: examObj.azotaLink || data[i][7] || '',
          questions: studentQuestions
        };
      }
    }
    return { error: "Không tìm thấy đề thi với mã yêu cầu." };
  } catch(e) {
    return { error: e.toString() };
  }
}

/**
 * Học sinh nộp bài thi trắc nghiệm trực tuyến
 */
function submitExamResult(examId, classId, studentId, studentName, correctCount, totalCount, score, answersJson) {
  try {
    var ss = getClassSpreadsheet();

    // === KIỂM TRA NỘP BÀI NHIỀU LẦN ===
    var sheetResult = ss.getSheetByName('Kết quả thi online');
    if (sheetResult) {
      var resultData = sheetResult.getDataRange().getDisplayValues();
      var cleanExamIdCheck = String(examId || "").trim().toUpperCase();
      var cleanStudentIdCheck = String(studentId || "").trim();
      for (var r = 1; r < resultData.length; r++) {
        var existExamId = String(resultData[r][1] || "").trim().toUpperCase();
        var existStudentId = String(resultData[r][3] || "").trim();
        if (existExamId === cleanExamIdCheck && existStudentId === cleanStudentIdCheck) {
          return {
            success: false,
            alreadySubmitted: true,
            error: "Bạn đã nộp bài thi này rồi. Mỗi học sinh chỉ được nộp 1 lần."
          };
        }
      }
    }

    var sheetExam = ss.getSheetByName('Đề thi online');
    var examData = sheetExam ? sheetExam.getDataRange().getDisplayValues() : [];
    var cleanExamId = String(examId || "").trim().toUpperCase();
    var fullExamObj = null;
    
    for (var i = 1; i < examData.length; i++) {
      if (String(examData[i][0]).trim().toUpperCase() === cleanExamId) {
        try {
          fullExamObj = JSON.parse(examData[i][3]);
        } catch(e) {}
        break;
      }
    }
    
    var userAnswers = {};
    try {
      if (answersJson) userAnswers = JSON.parse(answersJson);
    } catch(e) {}

    var computedCorrect = 0;
    var computedTotal = (fullExamObj && fullExamObj.questions) ? fullExamObj.questions.length : (totalCount || 0);

    if (fullExamObj && fullExamObj.questions) {
      fullExamObj.questions.forEach(function(q, qIdx) {
        // Frontend mới dùng global index (0,1,2,...) làm key; fallback qNum cho tương thích cũ
        var uAns = userAnswers[String(qIdx)] !== undefined
          ? userAnswers[String(qIdx)]
          : (userAnswers[q.qNum] || userAnswers[String(q.qNum)] || "");
        var cAns = String(q.correctAnswer || "").trim().toUpperCase();
        var type = q.type || "MULTIPLE_CHOICE";

        if (type === "TRUE_FALSE") {
          var uArr = String(uAns).toUpperCase().split(",");
          var cArr = cAns.split(",");
          var matchCount = 0;
          
          for (var k = 0; k < 4; k++) {
            if (uArr[k] && cArr[k] && uArr[k].trim() === cArr[k].trim()) {
              matchCount++;
            }
          }
          
          if (matchCount === 1) computedCorrect += 0.1;
          else if (matchCount === 2) computedCorrect += 0.25;
          else if (matchCount === 3) computedCorrect += 0.5;
          else if (matchCount === 4) computedCorrect += 1.0;

        } else if (type === 'SHORT_ANSWER') {
          // Chuẩn hóa: "7,88" == "7.88", bỏ khoảng trắng, lowercase
          var normUser = String(uAns).trim().toLowerCase().replace(/,/g, '.').replace(/\s/g, '');
          var normCorr = String(q.correctAnswer || '').trim().toLowerCase().replace(/,/g, '.').replace(/\s/g, '');
          // So sánh số: parse float nếu có thể (bỏ qua vấn đề trailing zeros)
          var numUser = parseFloat(normUser);
          var numCorr = parseFloat(normCorr);
          var isCorrect = false;
          if (!isNaN(numUser) && !isNaN(numCorr)) {
            isCorrect = Math.abs(numUser - numCorr) < 0.001; // sai số nhỏ hơn 0.001
          } else {
            isCorrect = normUser === normCorr; // So sánh chuỗi nếu không phải số
          }
          if (isCorrect) computedCorrect += 1.0;

        } else {
          // MULTIPLE_CHOICE
          if (String(uAns).trim().toUpperCase() === cAns) {
            computedCorrect += 1.0;
          }
        }
      });
    }

    var computedScore = (computedTotal > 0) ? Math.round((computedCorrect / computedTotal) * 10 * 10) / 10 : 0;
    
    var finalCorrect = computedCorrect;
    var finalTotal = computedTotal;
    var finalScore = computedScore;

    if (!sheetResult) {
      sheetResult = ss.insertSheet('Kết quả thi online');
      sheetResult.appendRow(["Mã KQ", "Mã đề", "Mã lớp", "Mã học sinh", "Tên học sinh", "Số câu đúng", "Tổng số câu", "Điểm số", "Thời gian nộp", "Chi tiết bài làm"]);
      sheetResult.getRange(1, 1, 1, 10).setFontWeight("bold").setBackground("#8E4DFF").setFontColor("#FFFFFF");
      sheetResult.setFrozenRows(1);
    }
    
    var resId = "KQ_" + new Date().getTime();
    var nowStr = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "dd/MM/yyyy HH:mm:ss");
    
    sheetResult.appendRow([
      resId,
      examId,
      classId,
      studentId,
      studentName,
      finalCorrect,
      finalTotal,
      finalScore,
      nowStr,
      answersJson
    ]);
    
    SpreadsheetApp.flush();
    
    // KHÔNG trả về fullExamData (chứa đáp án) để tránh gian lận
    return {
      success: true,
      score: finalScore,
      correctCount: finalCorrect,
      totalCount: finalTotal
    };
    
  } catch(e) {
    return { success: false, error: e.toString() };
  }
}

/**
 * Lấy danh sách kết quả điểm thi của một lớp đối với một đề thi (Xem báo cáo)
 */
function getExamResults(classId, examId) {
  try {
    var ss = getClassSpreadsheet();
    var sheetResult = ss.getSheetByName('Kết quả thi online');
    if (!sheetResult) return [];
    
    var data = sheetResult.getDataRange().getDisplayValues();
    var list = [];
    var cleanClassId = String(classId || "").trim().toUpperCase();
    var cleanExamId = String(examId || "").trim().toUpperCase();
    
    for (var i = 1; i < data.length; i++) {
      var cId = String(data[i][2]).trim().toUpperCase();
      var eId = String(data[i][1]).trim().toUpperCase();
      
      if ((cleanClassId === "" || cId === cleanClassId) && (cleanExamId === "" || eId === cleanExamId)) {
        list.push({
          resultId: data[i][0],
          examId: data[i][1],
          classId: data[i][2],
          studentId: data[i][3],
          studentName: data[i][4],
          correctCount: data[i][5],
          totalCount: data[i][6],
          score: data[i][7],
          submitTime: data[i][8]
        });
      }
    }
    return list;
  } catch(e) {
    return [];
  }
}
