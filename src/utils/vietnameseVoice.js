// ==============================================================================
// BỘ ĐỘNG CƠ PHÁT ÂM TIẾNG VIỆT CHUẨN (NATURAL VIETNAMESE SPEECH ENGINE)
// Hỗ trợ cả Web Speech API (Giọng Việt trên máy) và Audio Stream Trực Tuyến
// ==============================================================================

let currentAudioElement = null;
let currentUtterances = [];

/**
 * Tìm giọng đọc tiếng Việt tốt nhất hiện có trong trình duyệt
 */
export function getBestVietnameseVoice() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return null;
  }

  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  // Ưu tiên các giọng tiếng Việt chất lượng cao
  const preferredNames = [
    'microsoft hoaimy',
    'microsoft namminh',
    'microsoft an',
    'google tiếng việt',
    'google tieng viet',
    'vietnamese'
  ];

  for (const pref of preferredNames) {
    const found = voices.find(v => v.name.toLowerCase().includes(pref));
    if (found) return found;
  }

  // Tìm bất kỳ giọng nào có mã ngôn ngữ 'vi' hoặc 'vi-VN'
  const langMatch = voices.find(v => 
    v.lang.toLowerCase().startsWith('vi') || 
    v.lang.toLowerCase().includes('vietnam')
  );
  if (langMatch) return langMatch;

  return null;
}

/**
 * Dừng toàn bộ âm thanh và giọng đọc đang phát
 */
export function stopVietnameseSpeech() {
  if (typeof window !== 'undefined') {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (currentAudioElement) {
      currentAudioElement.pause();
      currentAudioElement.currentTime = 0;
      currentAudioElement = null;
    }
  }
}

/**
 * Làm sạch văn bản Markdown & HTML trước khi phát âm
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
 * Phát âm thanh tiếng Việt tự nhiên cho đoạn văn bản
 * @param {string} text - Văn bản cần đọc
 * @param {object} options - { rate: 1.0, pitch: 1.0, onStart, onEnd, onError }
 */
export function speakVietnamese(text, options = {}) {
  stopVietnameseSpeech();

  const cleanText = cleanTextForSpeech(text);
  if (!cleanText) {
    if (options.onEnd) options.onEnd();
    return;
  }

  const rate = options.rate || 1.0;
  const onStart = options.onStart || (() => {});
  const onEnd = options.onEnd || (() => {});
  const onError = options.onError || (() => {});

  const bestVoice = getBestVietnameseVoice();

  // 1. Nếu có giọng tiếng Việt cục bộ (Microsoft Hoài My, Google tiếng Việt...)
  if (bestVoice && 'speechSynthesis' in window) {
    onStart();

    // Chia nhỏ thành từng câu để tránh bị ngắt âm giữa chừng trên trình duyệt
    const sentences = cleanText.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [cleanText];
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
      utterance.voice = bestVoice;
      utterance.lang = bestVoice.lang || 'vi-VN';
      utterance.rate = rate;
      utterance.pitch = 1.0;

      utterance.onend = () => {
        currentIndex++;
        speakNextSentence();
      };

      utterance.onerror = (e) => {
        console.warn('Speech synthesis error:', e);
        // Chuyển sang phát bằng Audio Stream nếu SpeechSynthesis bị lỗi
        playOnlineVietnameseTTS(cleanText, { rate, onStart, onEnd, onError });
      };

      window.speechSynthesis.speak(utterance);
    }

    speakNextSentence();
    return;
  }

  // 2. Nếu máy người dùng không có sẵn gói giọng đọc tiếng Việt -> Dùng Audio Stream tiếng Việt chuẩn
  playOnlineVietnameseTTS(cleanText, { rate, onStart, onEnd, onError });
}

/**
 * Phát âm tiếng Việt qua luồng trực tuyến (Google TTS Audio Stream)
 */
function playOnlineVietnameseTTS(text, { rate = 1.0, onStart, onEnd, onError }) {
  // Chia đoạn thành các phần nhỏ <= 150 ký tự cho stream URL
  const chunks = [];
  const words = text.split(/\s+/);
  let cur = '';

  for (const w of words) {
    if ((cur + ' ' + w).length <= 150) {
      cur = cur ? cur + ' ' + w : w;
    } else {
      if (cur) chunks.push(cur);
      cur = w;
    }
  }
  if (cur) chunks.push(cur);

  if (chunks.length === 0) {
    if (onEnd) onEnd();
    return;
  }

  onStart();
  let chunkIdx = 0;

  function playNextChunk() {
    if (chunkIdx >= chunks.length) {
      onEnd();
      return;
    }

    const chunk = chunks[chunkIdx];
    const encoded = encodeURIComponent(chunk);
    const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=vi&client=tw-ob&q=${encoded}`;

    const audio = new Audio(audioUrl);
    audio.playbackRate = rate;
    currentAudioElement = audio;

    audio.onended = () => {
      chunkIdx++;
      playNextChunk();
    };

    audio.onerror = (err) => {
      console.warn('Online TTS stream error:', err);
      // Nếu bị chặn stream, thử fallback cuối cùng bằng SpeechSynthesis mặc định
      if ('speechSynthesis' in window) {
        const fallbackUtterance = new SpeechSynthesisUtterance(chunk);
        fallbackUtterance.lang = 'vi-VN';
        fallbackUtterance.rate = rate;
        fallbackUtterance.onend = () => {
          chunkIdx++;
          playNextChunk();
        };
        window.speechSynthesis.speak(fallbackUtterance);
      } else {
        if (onError) onError(err);
      }
    };

    audio.play().catch(err => {
      console.warn('Audio play catch:', err);
      // Fallback
      if ('speechSynthesis' in window) {
        const fallbackUtterance = new SpeechSynthesisUtterance(chunk);
        fallbackUtterance.lang = 'vi-VN';
        fallbackUtterance.rate = rate;
        fallbackUtterance.onend = () => {
          chunkIdx++;
          playNextChunk();
        };
        window.speechSynthesis.speak(fallbackUtterance);
      } else {
        if (onError) onError(err);
      }
    });
  }

  playNextChunk();
}
