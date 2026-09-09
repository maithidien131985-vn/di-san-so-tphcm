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

  let groundingContext = 'DƯỚI ĐÂY LÀ DỮ LIỆU HUẤN LUYỆN CHÍNH THỐNG TỪ BỘ DỮ LIỆU 103 DI TÍCH TP.HCM & VÙNG PHỤ CẬN:\n\n';
  
  // Bổ sung thống kê toàn hệ thống
  groundingContext += 'THỐNG KÊ HỆ THỐNG:\n';
  groundingContext += '- Tổng số: 103 di tích lịch sử - văn hóa.\n';
  groundingContext += '- Di tích Lịch sử: 51 | Kiến trúc nghệ thuật: 46 | Khảo cổ học: 4 | Danh lam thắng cảnh: 2.\n';
  groundingContext += '- Xếp hạng Quốc gia đặc biệt: 4 (Dinh Độc Lập, Địa đạo Củ Chi, Nhà tù Côn Đảo, Căn cứ Rừng Sác) | Xếp hạng Quốc gia: 99.\n\n';

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
  const systemInstruction = 'Bạn là Trợ Lý Trí Tuệ Nhân Tạo Di Sản TP.HCM (Heritage AI Assistant) trong dự án Nghiên Cứu Khoa Học Kỹ Thuật (KHKT) của Trường THCS Xà Bang.\nNhiệm vụ của bạn là hỗ trợ học sinh THCS, giáo viên và khách tham quan tìm hiểu, khám phá và nâng cao ý thức bảo tồn 103 di tích lịch sử - văn hóa TP.HCM và vùng phụ cận.\n\nQUY TẮC TRẢ LỜI:\n1. Độ dài: Ngắn gọn, súc tích, đi thẳng vào trọng tâm, KHÔNG trả lời dài dòng hay lan man (khoảng 3 - 6 dòng hoặc gạch đầu dòng rõ ràng).\n2. Phong cách: Sư phạm chuẩn mực, tôn trọng lịch sử, truyền cảm hứng yêu nước và ý thức bảo tồn di sản văn hóa.\n3. Bố cục:\n   - Dùng tiêu đề ### [Tên di tích hoặc Chủ đề]\n   - Gạch đầu dòng rõ ràng với biểu tượng cảm xúc phù hợp (🏛️, 📍, ⭐, 👤, 🏺, 💡, 🔭).\n   - In đậm các từ khóa lịch sử, nhân vật, mốc năm quan trọng bằng **từ khóa**.\n   - Nếu có câu hỏi điều tra/gợi ý môn học (Lịch sử, Địa lý, Ngữ văn, GDCD, STEM), hãy dùng dấu trích dẫn > để làm nổi bật.\n4. Tính chính xác: Luôn dựa vào dữ liệu 103 di tích được cung cấp trong ngữ cảnh. Luôn ghi rõ mã [STT #Số] của di tích nếu có liên quan.';

  // 3. Lịch sử hội thoại gần nhất (tối đa 4 tin nhắn)
  const recentHistory = chatHistory.slice(-4).map(msg => ({
    role: msg.sender === 'user' ? 'user' : 'model',
    parts: [{ text: msg.text }]
  }));

  // Tin nhắn hiện tại kèm Context RAG
  const currentMessage = {
    role: 'user',
    parts: [
      { text: groundingContext + '\n---\nCÂU HỎI CỦA HỌC SINH: "' + query + '"\n\nHãy trả lời chuẩn xác, súc tích và đúng quy tắc sư phạm đã nêu.' }
    ]
  };

  const contents = [...recentHistory, currentMessage];

  // 4. Gọi API Google Gemini (Model: gemini-1.5-flash)
  const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + apiKey;

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
        maxOutputTokens: 650
      }
    })
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    const errMsg = errData.error?.message || ('HTTP ' + response.status + ': ' + response.statusText);
    throw new Error(errMsg);
  }

  const data = await response.json();
  const rawResponseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

  if (!rawResponseText) {
    throw new Error('NO_CONTENT_GENERATED');
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
