import { allMonumentsList } from '../data/allMonumentsData.js';

/**
 * Standard Fisher-Yates shuffle that returns a new array.
 */
export function shuffleArray(array) {
  if (!Array.isArray(array)) return [];
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Shuffles the options of a single question and updates correctIndex accordingly.
 * Supports questions with correctIndex or options formatted with isCorrect.
 */
export function shuffleQuestion(q) {
  if (!q || !Array.isArray(q.options) || q.options.length <= 1) return q;

  const originalCorrectIdx = typeof q.correctIndex === 'number' ? q.correctIndex : 0;
  const originalCorrectText = q.options[originalCorrectIdx];

  // Map each option with its original index
  const indexed = q.options.map((opt, idx) => ({
    text: opt,
    isCorrect: idx === originalCorrectIdx
  }));

  // Shuffle
  const shuffled = shuffleArray(indexed);
  const newCorrectIndex = shuffled.findIndex(item => item.isCorrect);

  return {
    ...q,
    options: shuffled.map(item => item.text),
    correctIndex: newCorrectIndex >= 0 ? newCorrectIndex : 0
  };
}

/**
 * Shuffles an array of questions.
 */
export function shuffleQuestions(questions) {
  if (!Array.isArray(questions)) return [];
  return questions.map(q => shuffleQuestion(q));
}

function cleanText(str) {
  if (!str) return '';
  return str
    .replace(/^1\+A10/i, '')
    .replace(/^[0-9+–\-:]+\s*/, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Builds a tailored Timeline Challenge question for a specific monument.
 */
export function buildMonumentTimelineQuiz(currentMonument, customTimeline = null) {
  const mon = currentMonument || allMonumentsList[0] || {};
  const name = mon.info?.name || 'Di tích lịch sử';
  const events = mon.keyHighlights?.events?.details || '';
  const timeline = customTimeline || mon.timeline || [];

  let keyMilestone = timeline && timeline.length > 1 ? timeline[1] : (timeline?.[0] || null);
  let correctOpt = '';

  if (events) {
    const firstSentence = events.split('\n')[0].split('.')[0].trim();
    correctOpt = cleanText(firstSentence) + '.';
  } else if (keyMilestone?.description) {
    const firstSentence = keyMilestone.description.split('.')[0].trim();
    const prefix = keyMilestone.year && !['Kháng chiến', 'Khởi nguồn', 'Xếp hạng'].includes(keyMilestone.year)
      ? `${keyMilestone.year}: `
      : '';
    correctOpt = cleanText(prefix + firstSentence) + '.';
  } else {
    correctOpt = `Dấu mốc đấu tranh kiên cường và quá trình hình thành di tích ${name}.`;
  }

  // Pick 3 plausible distractors from other monuments in allMonumentsList
  const monId = Number(mon.stt || mon.id || 1);
  const otherMonuments = allMonumentsList.filter(m => Number(m.stt || m.id) !== monId);
  const distractors = [];

  for (let i = 0; i < otherMonuments.length && distractors.length < 3; i++) {
    const pickIdx = Math.abs((i * 17 + monId * 7)) % otherMonuments.length;
    const target = otherMonuments[pickIdx];
    const raw = target?.keyHighlights?.events?.details;
    if (raw) {
      const sentence = cleanText(raw.split('\n')[0].split('.')[0]) + '.';
      if (sentence && sentence.length > 25 && sentence !== correctOpt && !distractors.includes(sentence)) {
        distractors.push(sentence);
      }
    }
  }

  // Fallbacks if not enough distractors
  const defaultDistractors = [
    'Phong trào bãi khóa và biểu tình yêu nước rầm rộ của học sinh, sinh viên Sài Gòn – Gia Định.',
    'Quá trình xây dựng căn cứ kháng chiến và vận chuyển vũ khí chi viện cho chiến trường miền Nam.',
    'Cuộc tổng tiến công và nổi dậy Tết Mậu Thân 1968 giáng đòn quyết định vào ý chí xâm lược.'
  ];
  defaultDistractors.forEach(d => {
    if (distractors.length < 3 && !distractors.includes(d) && d !== correctOpt) {
      distractors.push(d);
    }
  });

  const rawOptions = [
    { text: correctOpt, isCorrect: true },
    { text: distractors[0], isCorrect: false },
    { text: distractors[1], isCorrect: false },
    { text: distractors[2], isCorrect: false }
  ];

  const shuffled = shuffleArray(rawOptions);
  const correctIndex = shuffled.findIndex(o => o.isCorrect);

  return {
    question: `Dấu mốc lịch sử trọng đại nào dưới đây gắn liền mật thiết với quá trình hình thành & phát triển của "${name}"?`,
    options: shuffled.map(o => o.text),
    correctIndex: correctIndex >= 0 ? correctIndex : 0,
    explanation: events
      ? events.split('\n')[0]
      : (keyMilestone?.description || `Di tích ${name} ghi dấu những mốc son lịch sử chói lọi của dân tộc.`)
  };
}

/**
 * Builds a tailored Media Discovery Quiz ("Bạn vừa khám phá được gì?") for a specific monument.
 */
export function buildMonumentMediaQuiz(currentMonument) {
  const mon = currentMonument || allMonumentsList[0] || {};
  const name = mon.info?.name || 'Di tích lịch sử';
  const artifacts = cleanText(mon.keyHighlights?.artifacts?.details || '');
  const figures = cleanText(mon.keyHighlights?.figures?.details || '');
  const events = cleanText(mon.keyHighlights?.events?.details || '');

  let question = '';
  let correctOpt = '';
  let explanation = '';
  let distractorKey = 'artifacts';

  if (artifacts && artifacts.length > 15) {
    question = `Sau khi theo dõi thước phim và lắng nghe thuyết minh, hiện vật / chứng tích lịch sử tiêu biểu được nhắc đến tại "${name}" là gì?`;
    correctOpt = artifacts.length > 135 ? artifacts.slice(0, 130) + '...' : artifacts;
    explanation = `Tại ${name}, các hiện vật/chứng tích: "${artifacts.slice(0, 160)}..." là bằng chứng lịch sử vô giá.`;
    distractorKey = 'artifacts';
  } else if (figures && figures.length > 15) {
    question = `Thước phim tư liệu và lời thuyết minh về "${name}" ghi nhận dấu ấn cống hiến của những nhân vật / nhân chứng lịch sử nào?`;
    correctOpt = figures.length > 135 ? figures.slice(0, 130) + '...' : figures;
    explanation = `Di tích ${name} gắn liền với tên tuổi và sự cống hiến kiên cường của: ${figures}.`;
    distractorKey = 'figures';
  } else {
    question = `Thông qua video tư liệu và lời thuyết minh, sự kiện lịch sử cốt lõi gắn liền với "${name}" là gì?`;
    correctOpt = events
      ? (events.length > 135 ? events.slice(0, 130) + '...' : events)
      : `Ghi dấu những mốc son đấu tranh kiên cường và tinh thần yêu nước bất khuất của dân tộc.`;
    explanation = `Di tích ${name} là biểu tượng tự hào, nơi lưu giữ truyền thống cách mạng và văn hóa sâu sắc.`;
    distractorKey = 'events';
  }

  const monId = Number(mon.stt || mon.id || 1);
  const otherMonuments = allMonumentsList.filter(m => Number(m.stt || m.id) !== monId);
  const distractors = [];

  for (let i = 0; i < otherMonuments.length && distractors.length < 3; i++) {
    const pickIdx = Math.abs((i * 13 + monId * 11)) % otherMonuments.length;
    const candidate = otherMonuments[pickIdx];
    const raw = cleanText(
      candidate?.keyHighlights?.[distractorKey]?.details ||
      candidate?.keyHighlights?.artifacts?.details ||
      candidate?.keyHighlights?.events?.details ||
      ''
    );
    if (raw && raw.length > 15) {
      const snippet = raw.length > 135 ? raw.slice(0, 130) + '...' : raw;
      if (snippet !== correctOpt && !distractors.includes(snippet)) {
        distractors.push(snippet);
      }
    }
  }

  // Fallbacks if needed
  const defaultDistractors = [
    'Hệ thống tài liệu truyền đơn và máy in ấn bí mật phục vụ phong trào cách mạng đô thị.',
    'Các hiện vật gốm sứ cổ truyền, đồ đồng và công cụ sinh hoạt thời tiền sử.',
    'Hệ thống địa đạo nhiều tầng, bếp Hoàng Cầm ngụy trang khói và công sự chống càn.'
  ];
  defaultDistractors.forEach(d => {
    if (distractors.length < 3 && !distractors.includes(d) && d !== correctOpt) {
      distractors.push(d);
    }
  });

  const rawOptions = [
    { text: correctOpt, isCorrect: true },
    { text: distractors[0], isCorrect: false },
    { text: distractors[1], isCorrect: false },
    { text: distractors[2], isCorrect: false }
  ];

  const shuffled = shuffleArray(rawOptions);
  const correctIndex = shuffled.findIndex(o => o.isCorrect);

  return {
    question,
    options: shuffled.map(o => o.text),
    correctIndex: correctIndex >= 0 ? correctIndex : 0,
    explanation
  };
}