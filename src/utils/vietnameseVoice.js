// ==============================================================================
// BỘ ĐIỀU KHIỂN PHÁT ÂM TIẾNG VIỆT CHUẨN (STRICT VIETNAMESE TTS ENGINE)
// Tuân thủ nghiêm ngặt: Chỉ phát âm bằng giọng vi-VN, tuyệt đối không dùng en-US
// ==============================================================================

/**
 * Kiểm tra xem một Voice có thực sự là giọng Tiếng Việt hay không
 */
export function isVietnameseVoice(voice) {
  if (!voice) return false;
  const lang = (voice.lang || '').toLowerCase().replace('_', '-');
  const name = (voice.name || '').toLowerCase();

  return (
    lang.startsWith('vi') ||
    lang.includes('vietnam') ||
    name.includes('vietnam') ||
    name.includes('tiếng việt') ||
    name.includes('tieng viet') ||
    name.includes('hoaimy') ||
    name.includes('namminh') ||
    name.includes('an') ||
    name.includes('linh') ||
    name.includes('mai')
  );
}

/**
 * Tìm và ưu tiên giọng đọc tiếng Việt chất lượng cao nhất có sẵn trên thiết bị
 */
export function getBestVietnameseVoice() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return null;
  }

  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  // 1. Ưu tiên các giọng đọc tiếng Việt tự nhiên chất lượng cao
  const preferredNames = [
    'microsoft hoaimy online',
    'microsoft hoaimy',
    'microsoft namminh online',
    'microsoft namminh',
    'microsoft an',
    'google tiếng việt',
    'google tieng viet',
    'linh',
    'vietnamese'
  ];

  for (const pref of preferredNames) {
    const found = voices.find(v => isVietnameseVoice(v) && v.name.toLowerCase().includes(pref));
    if (found) return found;
  }

  // 2. Tìm bất kỳ voice nào có ngôn ngữ khớp vi-VN hoặc chứa tiếng Việt
  const anyVietnameseVoice = voices.find(v => isVietnameseVoice(v));
  if (anyVietnameseVoice) return anyVietnameseVoice;

  return null;
}

/**
 * Dừng toàn bộ giọng đọc đang phát
 */
export function stopVietnameseSpeech() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Làm sạch văn bản Markdown & HTML trước khi đưa vào TTS
 */
export function cleanTextForSpeech(text) {
  if (!text) return '';
  return text
    .replace(/[#*`_~>[\]()]/g, ' ') // Xóa ký tự markdown
    .replace(/https?:\/\/\S+/g, '')  // Xóa URL
    .replace(/STT\s*#?\d+/gi, '')     // Xóa ký hiệu STT
    .replace(/\s+/g, ' ')            // Chuẩn hóa khoảng trắng
    .trim();
}

/**
 * Phát âm thanh tiếng Việt với voice vi-VN được kiểm tra nghiêm ngặt
 * @param {string} text - Văn bản cần đọc
 * @param {object} options - { rate: 1.0, onStart, onEnd, onError, onNoVoice }
 */
export function speakVietnamese(text, options = {}) {
  stopVietnameseSpeech();

  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (options.onError) options.onError('SPEECH_NOT_SUPPORTED');
    alert('Trình duyệt của bạn không hỗ trợ tính năng Text-to-Speech.');
    return;
  }

  const cleanText = cleanTextForSpeech(text);
  if (!cleanText) {
    if (options.onEnd) options.onEnd();
    return;
  }

  const rate = options.rate || 1.0;
  const onStart = options.onStart || (() => {});
  const onEnd = options.onEnd || (() => {});
  const onError = options.onError || (() => {});
  const onNoVoice = options.onNoVoice || (() => {});

  // Lấy voice tiếng Việt
  let bestVoice = getBestVietnameseVoice();

  // Nếu lần đầu danh sách voice chưa kịp load trong Chrome/Edge, thử load lại
  if (!bestVoice) {
    const allVoices = window.speechSynthesis.getVoices();
    bestVoice = allVoices.find(v => isVietnameseVoice(v));
  }

  // NGHIÊM NGẶT: Nếu thiết bị không có voice tiếng Việt, TUYỆT ĐỐI KHÔNG dùng voice en-US/default
  if (!bestVoice) {
    if (onNoVoice) {
      onNoVoice();
    }
    if (onError) {
      onError('NO_VIETNAMESE_VOICE');
    }

    alert(
      '⚠️ Thiết bị/Trình duyệt của bạn hiện chưa cài đặt gói giọng đọc Tiếng Việt (vi-VN).\n\n' +
      'Để sử dụng tính năng đọc giọng nói Tiếng Việt:\n' +
      '1. Trên Windows: Vào Settings ➔ Time & Language ➔ Speech ➔ Thêm gói ngôn ngữ "Vietnamese".\n' +
      '2. Hoặc sử dụng trình duyệt Google Chrome/Microsoft Edge trên máy tính hoặc điện thoại có hỗ trợ Tiếng Việt.'
    );
    return;
  }

  onStart();

  // Chia nhỏ văn bản thành các câu ngắn để phát âm mượt mà, không bị ngắt quãng
  const sentences = cleanText.match(/[^.!?\n]+[.!?\n]+|[^.!?\n]+$/g) || [cleanText];
  let currentIndex = 0;

  function speakNextSentence() {
    if (currentIndex >= sentences.length) {
      onEnd();
      return;
    }

    const sentence = sentences[currentIndex].trim();
    if (!sentence) {
      currentIndex++;
      speakNextSentence();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(sentence);
    // Đặt ngôn ngữ rõ ràng là vi-VN và gán trực tiếp Voice tiếng Việt
    utterance.voice = bestVoice;
    utterance.lang = 'vi-VN';
    utterance.rate = rate;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      currentIndex++;
      speakNextSentence();
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis utterance error:', e);
      onError(e);
      onEnd();
    };

    window.speechSynthesis.speak(utterance);
  }

  speakNextSentence();
}
