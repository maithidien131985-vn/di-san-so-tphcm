/**
 * GOOGLE GEMINI AI SERVICE CHO TRỢ LÝ DI SẢN SỐ 103 DI TÍCH
 * Tích hợp Gemini 1.5 Flash / 2.0 Flash với kỹ thuật RAG (Retrieval-Augmented Generation)
 * Bám sát cơ sở dữ liệu 103 di tích lịch sử - văn hóa TP.HCM & Vùng phụ cận
 */

import { monumentQaMap, systemFaqList } from '../data/chatbotTrainingData';

const STORAGE_KEY = 'heritage_gemini_api_key';

// Lấy API Key từ Environment Variable hoặc LocalStorage
export const getGeminiApiKey = () => {
  const envKey = import.meta.env?.VITE_GEMINI_API_KEY;
  if (envKey && envKey.trim()) return envKey.trim();
  const localKey = localStorage.getItem(STORAGE_KEY);
  if (localKey && localKey.trim()) return localKey.trim();
  return '';
};

// Lưu API Key vào LocalStorage
export const saveGeminiApiKey = (key) => {
  if (!key || !key.trim()) {
    localStorage.removeItem(STORAGE_KEY);
  } else {
    localStorage.setItem(STORAGE_KEY, key.trim());
  }
};

// Kiểm tra xem đã cài đặt Gemini API Key hay chưa
export const hasGeminiApiKey = () => {
  return Boolean(getGeminiApiKey());
};

// Helper chuẩn hóa tiếng Việt không dấu
const removeAccents = (str) => {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
};

/**
 * Thuật toán RAG: Trích xuất các di tích liên quan nhất từ 103 di tích để làm tri thức nền (Context Grounding)
 */
export const retrieveRelevantMonuments = (query, currentMonument = null, allMonumentsList = [], topK = 5) => {
  if (!allMonumentsList || allMonumentsList.length === 0) return [];
  
  const cleanQ = removeAccents(query);
  const scored = [];

  allMonumentsList.forEach(m => {
    let score = 0;
    const mNameClean = removeAccents(m.info?.name || '');
    const mAddrClean = removeAccents(m.info?.address || '');
    const mOverviewClean = removeAccents(m.info?.overview || '');
    const mSlug = m.slug || '';

    // Khớp tên trực tiếp
    if (mNameClean === cleanQ) score += 150;
    else if (mNameClean.includes(cleanQ)) score += 80;
    else if (cleanQ.includes(mNameClean)) score += 60;

    // Khớp slug
    if (mSlug && mSlug.includes(cleanQ)) score += 40;

    // Khớp số STT
    const sttMatch = cleanQ.match(/(?:stt|so|di tich|#)\s*([0-9]{1,3})/i) || cleanQ.match(/^([0-9]{1,3})$/);
    if (sttMatch && parseInt(sttMatch[1], 10) === m.stt) {
      score += 200;
    }

    // Tokenized word matching
    const stopWords = ['di', 'tich', 'tai', 'la', 'gi', 'o', 'dau', 'nhu', 'the', 'nao', 'cho', 'toi', 'biet', 've', 'thong', 'tin', 'tp', 'hcm', 'thanh', 'pho'];
    const words = cleanQ.split(/\s+/).filter(w => w.length > 1 && !stopWords.includes(w));

    words.forEach(w => {
      if (mNameClean.includes(w)) score += 20;
      if (mAddrClean.includes(w)) score += 8;
      if (mOverviewClean.includes(w)) score += 5;
      if (m.keyHighlights?.figures?.details && removeAccents(m.keyHighlights.figures.details).includes(w)) score += 15;
      if (m.keyHighlights?.artifacts?.details && removeAccents(m.keyHighlights.artifacts.details).includes(w)) score += 15;
    });

    if (currentMonument && m.stt === currentMonument.stt) {
      score += 10;
    }

    if (score > 0) {
      scored.push({ monument: m, score });
    }
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK).map(item => item.monument);
};

/**
 * Gửi yêu cầu truy vấn đến Google Gemini API với System Instructions & RAG Context
 */
export const queryGeminiAI = async ({
  query,
  chatHistory = [],
  currentMonument = null,
  allMonumentsList = []
}) => {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error('MISSING_API_KEY');
  }

  // 1. RAG Context: Lấy tối đa 5 di tích liên quan nhất từ bộ tri thức huấn luyện chính thức
  const relevantMonuments = retrieveRelevantMonuments(query, currentMonument, allMonumentsList, 5);

  let groundingContext = 'DƯỚI ĐÂY LÀ DỮ LIỆU HUẤN LUYỆN CHÍNH THỐNG TỪ BỘ DỮ LIỆU 103 DI TÍCH TP.HCM & THỐNG KÊ TOÀN THÀNH PHỐ:\n\n';
  
  // Bổ sung thống kê chính thống toàn diện (Nguồn: Sở VH&TT TP.HCM & D:\Thông tin cho chatbot.docx)
  groundingContext += 'BẢNG THỐNG KÊ DI TÍCH TP.HCM CHÍNH THỨC:\n';
  groundingContext += '1. TỔNG SỐ DI TÍCH ĐÃ XẾP HẠNG TẠI TP.HCM: 321 di tích, gồm:\n';
  groundingContext += '   - 4 di tích Quốc gia đặc biệt (100% thuộc loại hình Lịch sử: Dinh Độc Lập, Địa đạo Củ Chi, Căn cứ Rừng Sác, Nhà tù Côn Đảo).\n';
  groundingContext += '   - 99 di tích Quốc gia (gồm: 48 Lịch sử, 44 Kiến trúc nghệ thuật, 4 Khảo cổ học, 3 Danh lam thắng cảnh).\n';
  groundingContext += '   - 218 di tích cấp Tỉnh/Thành phố (gồm: 116 Lịch sử, 99 Kiến trúc nghệ thuật, 3 Danh lam thắng cảnh, 0 Khảo cổ).\n';
  groundingContext += '2. PHÂN LOẠI 321 DI TÍCH THEO LOẠI HÌNH TRÊN TOÀN TP.HCM:\n';
  groundingContext += '   - Lịch sử: 168 di tích (4 QG đặc biệt + 48 Quốc gia + 116 Cấp TP).\n';
  groundingContext += '   - Kiến trúc nghệ thuật: 143 di tích (0 QG đặc biệt + 44 Quốc gia + 99 Cấp TP).\n';
  groundingContext += '   - Danh lam thắng cảnh: 6 di tích (0 QG đặc biệt + 3 Quốc gia + 3 Cấp TP).\n';
  groundingContext += '   - Khảo cổ: 4 di tích (0 QG đặc biệt + 4 Quốc gia + 0 Cấp TP: Cù Lao Rùa #STT 21, Dốc Chùa #STT 22, Giồng Cá Vồ #STT 23, Lò gốm cổ Hưng Lợi #STT 24).\n';
  groundingContext += '3. CÔNG TRÌNH KIỂM KÊ CHƯA XẾP HẠNG: 226 công trình/địa điểm (161 Kiến trúc nghệ thuật, 47 Lịch sử, 11 Khảo cổ, 7 Danh lam thắng cảnh).\n';
  groundingContext += '4. DỰ ÁN DI SẢN SỐ (THCS XÀ BANG): Số hóa chuyên sâu 103 di tích lịch sử - văn hóa tiêu biểu (toàn bộ 4 di tích Quốc gia đặc biệt + 99 di tích Quốc gia).\n\n';

  if (relevantMonuments.length > 0) {
    relevantMonuments.forEach(m => {
      const trainedMon = monumentQaMap[m.stt];
      groundingContext += `[STT #${m.stt}] ${m.info.name}\n`;
      groundingContext += `- Địa chỉ hiện nay: ${trainedMon?.intents?.dc_sau?.answer || m.info.address}\n`;
      groundingContext += `- Xếp hạng: ${trainedMon?.intents?.rank?.answer || m.info.badge || m.info.ranking || 'Di tích Lịch sử'}\n`;
      groundingContext += `- Quyết định công nhận: ${trainedMon?.intents?.qd?.answer || 'Đã xếp hạng'}\n`;
      groundingContext += `- Tóm tắt & Lịch sử: ${trainedMon?.intents?.tomtat?.answer || trainedMon?.intents?.lichsu?.answer || m.info.overview}\n`;
      
      if (trainedMon?.intents?.nhanvat?.answer) {
        groundingContext += `- Nhân vật liên quan: ${trainedMon.intents.nhanvat.answer}\n`;
      }
      if (trainedMon?.intents?.hientvat?.answer) {
        groundingContext += `- Hiện vật tiêu biểu: ${trainedMon.intents.hientvat.answer}\n`;
      }
      if (trainedMon?.intents?.sukien?.answer) {
        groundingContext += `- Sự kiện lịch sử: ${trainedMon.intents.sukien.answer}\n`;
      }
      if (m.investigation?.investigationQuestion) {
        groundingContext += `- Câu hỏi điều tra học tập: ${m.investigation.investigationQuestion}\n`;
      }
      groundingContext += '\n';
    });
  }

  // 2. System Instructions
  const systemInstruction = `Bạn là Trợ Lý Trí Tuệ Nhân Tạo Di Sản TP.HCM (Heritage AI Assistant) trong dự án Nghiên Cứu Khoa Học Kỹ Thuật (KHKT) của Trường THCS Xà Bang.
Nhiệm vụ của bạn là hỗ trợ học sinh THCS, giáo viên và khách tham quan tìm hiểu, khám phá và nâng cao ý thức bảo tồn 103 di tích lịch sử - văn hóa TP.HCM và vùng phụ cận.

QUY TẮC TRẢ LỜI & SUY LUẬN CHUẨN MỰC (BIẾT SUY LUẬN NHƯNG TUYỆT ĐỐI KHÔNG NÓI DỐI):

1. NƯƠNG THEO CÂU HỎI & MỞ ĐẦU TỰ NHIÊN:
   - Trả lời trực diện, tự nhiên vào đúng trọng tâm câu hỏi của người dùng.
   - Tuyệt đối KHÔNG dùng tiêu đề rập khuôn, cứng nhắc như "Tóm tắt & Giới thiệu tổng quan:" hay "Thông tin chung:".

2. TƯ DUY SUY LUẬN & ĐẠO ĐỨC TRẢ LỜI (TRUNG THỰC, KHÔNG BỊA ĐẶT):
   - KHÔNG NÓI DỐI / KHÔNG BỊA ĐẶT: Nếu thông tin không có trong cơ sở dữ liệu hoặc nằm ngoài phạm vi di tích (Wi-Fi, trà sữa, nuôi thú cưng, ma quỷ, người ngoài hành tinh, dự đoán tương lai, giá xăng...), hãy từ chối lịch sự, trung thực ("Tôi chưa có dữ liệu xác nhận về nội dung này trong hồ sơ di tích...").
   - PHÂN BIỆT RÕ KHÁI NIỆM:
     + Niên đại hình thành ≠ Năm xây dựng ≠ Năm xếp hạng di tích.
     + Xem video/đọc tài liệu ≠ Trực tiếp khám phá/hoàn thành nhiệm vụ thực địa.
     + Cấp xếp hạng (pháp lý) ≠ Quy mô hay độ nổi tiếng của di tích.
   - TRẢ LỜI CÂU HỎI SO SÁNH / "ĐẸP NHẤT" / "QUAN TRỌNG NHẤT": Không phán đoán chủ quan tuyệt đối "cái này tốt hơn cái kia"; luôn so sánh dựa trên các tiêu chí chuyên môn cụ thể (niên đại, loại hình, sự kiện lịch sử, giá trị khảo cổ/kiến trúc, trải nghiệm học sinh).
   - TRẢ LỜI CÂU HỎI BẮT BẺ / BẪY / BẢO TỒN: Khi người dùng cho rằng di tích không có giá trị hoặc nên đập đi xây mới, hãy giải thích khách quan các lớp giá trị (lịch sử, văn hóa, kiến trúc, khảo cổ, giáo dục) và giá trị nguyên gốc của di sản.
   - LẬP KẾ HOẠCH HÀNH TRÌNH THÔNG MINH: Biết kết hợp các điều kiện (thời gian 30 phút/1 ngày, sở thích khảo cổ/tránh chiến tranh, di tích gần nhất theo khoảng cách, có video/audio) để gợi ý hành trình hợp lý.

3. THỐNG KÊ CHÍNH THỨC TOÀN TP.HCM:
   - 321 di tích đã xếp hạng (4 Quốc gia đặc biệt, 99 Quốc gia, 218 Cấp tỉnh/TP).
   - Phân loại: 168 Lịch sử, 143 Kiến trúc nghệ thuật, 6 Danh lam thắng cảnh, 4 Khảo cổ học.
   - 226 công trình, địa điểm thuộc diện kiểm kê chưa xếp hạng.
   - 103 di tích số hóa trọng điểm của dự án THCS Xà Bang.

4. ĐỘ DÀI & PHONG CÁCH:
   - Ngắn gọn, súc tích (khoảng 4 - 8 dòng hoặc gạch đầu dòng rõ ràng).
   - Gạch đầu dòng với biểu tượng phù hợp (🏛️, 📍, ⭐, 👤, 🏺, 💡, 🔭, 📊, 🗺️, ⏱️).
   - In đậm các từ khóa lịch sử, con số, mốc năm quan trọng (**từ khóa**).
   - Phong cách sư phạm chuẩn mực, truyền cảm hứng tự hào dân tộc và ý thức bảo tồn di sản.`;

  // 3. Lịch sử hội thoại gần nhất (tối đa 4 tin nhắn)
  const recentHistory = chatHistory.slice(-4).map(msg => ({
    role: msg.sender === 'user' ? 'user' : 'model',
    parts: [{ text: msg.text }]
  }));

  // Tin nhắn hiện tại kèm Context RAG
  const currentMessage = {
    role: 'user',
    parts: [
      { text: groundingContext + '\n---\nCÂU HỎI CỦA HỌC SINH: "' + query + '"\n\nHãy nương theo câu hỏi để trả lời chuẩn xác, súc tích, mạch lạc và đúng quy tắc sư phạm đã nêu.' }
    ]
  };

  const contents = [...recentHistory, currentMessage];

  // 4. Danh sách các model Gemini theo thứ tự ưu tiên
  const CANDIDATE_MODELS = [
    'gemini-2.0-flash',
    'gemini-1.5-flash-latest',
    'gemini-1.5-flash',
    'gemini-1.5-flash-001',
    'gemini-1.5-flash-002',
    'gemini-1.5-pro',
    'gemini-pro'
  ];

  let rawResponseText = '';
  let lastError = null;
  let safetyBlocked = false;

  for (const model of CANDIDATE_MODELS) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents,
          systemInstruction: {
            parts: [{ text: systemInstruction }]
          },
          generationConfig: {
            temperature: 0.35,
            topP: 0.85,
            maxOutputTokens: 750
          }
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        const errMsg = errData.error?.message || ('HTTP ' + response.status + ': ' + response.statusText);
        lastError = new Error(errMsg);
        // Nếu lỗi do không tìm thấy model (404 / NOT_FOUND), thử model kế tiếp
        if (response.status === 404 || errMsg.includes('not found') || errMsg.includes('is not supported')) {
          continue;
        }
        throw lastError;
      }

      const data = await response.json();

      // Kiểm tra bộ lọc an toàn ở cấp độ prompt (promptFeedback)
      const blockReason = data.promptFeedback?.blockReason;
      if (blockReason) {
        safetyBlocked = true;
        lastError = new Error('SAFETY_BLOCK:' + blockReason);
        // Thử model khác — đôi khi model khác có ngưỡng an toàn khác nhau
        continue;
      }

      // Kiểm tra finishReason của candidate
      const finishReason = data.candidates?.[0]?.finishReason;
      if (finishReason === 'SAFETY' || finishReason === 'RECITATION') {
        safetyBlocked = true;
        lastError = new Error('SAFETY_BLOCK:' + finishReason);
        continue; // Thử model tiếp theo
      }

      rawResponseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      if (rawResponseText) {
        safetyBlocked = false;
        break; // Thành công
      }
      // Nếu response rỗng nhưng không có lỗi, thử model kế tiếp
      lastError = new Error('EMPTY_RESPONSE');
      continue;

    } catch (err) {
      lastError = err;
      if (err.message?.includes('not found') || err.message?.includes('is not supported')) {
        continue;
      }
      throw err;
    }
  }

  if (!rawResponseText) {
    // Trả về thông báo thân thiện thay vì crash khi bị safety filter
    if (safetyBlocked) {
      return {
        text: '🙏 Câu hỏi này nằm ngoài phạm vi thông tin di tích mà tôi có thể hỗ trợ. Bạn vui lòng đặt câu hỏi liên quan đến 103 di tích lịch sử – văn hóa TP.HCM nhé!',
        relatedMonuments: [],
        source: 'safety_fallback'
      };
    }
    throw lastError || new Error('NO_CONTENT_GENERATED');
  }

  // Tự động nhận diện các di tích được đề cập trong câu trả lời của Gemini
  const identifiedMonuments = new Set(relevantMonuments);
  const sttMatches = rawResponseText.match(/STT\s*#?([0-9]{1,3})/gi) || [];
  sttMatches.forEach(match => {
    const num = parseInt(match.replace(/[^0-9]/g, ''), 10);
    const found = allMonumentsList.find(m => m.stt === num);
    if (found) identifiedMonuments.add(found);
  });

  return {
    text: rawResponseText.trim(),
    relatedMonuments: Array.from(identifiedMonuments).slice(0, 4),
    source: 'gemini'
  };
};
