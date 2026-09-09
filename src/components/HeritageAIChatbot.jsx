import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  MessageSquare, 
  Bot, 
  Sparkles, 
  Send, 
  X, 
  Minimize2, 
  Maximize2, 
  Copy, 
  Check, 
  RefreshCw, 
  ChevronRight, 
  Landmark, 
  MapPin, 
  BookOpen, 
  Compass, 
  Lightbulb, 
  HelpCircle,
  Award,
  Search,
  Flame,
  ArrowRight,
  Key,
  Settings,
  Zap,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { allMonumentsList } from '../data/allMonumentsData';
import { 
  systemFaqList, 
  monumentQaMap, 
  fullQaDataset 
} from '../data/chatbotTrainingData';
import { 
  getGeminiApiKey, 
  saveGeminiApiKey, 
  hasGeminiApiKey, 
  queryGeminiAI 
} from '../utils/geminiService';

// Helper to remove accents and clean punctuation for robust search
const removeAccents = (str) => {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

// 1. FAST LOOKUP INDEX FOR 3,605 OFFICIAL Q&A ITEMS
const questionLookupMap = new Map();
fullQaDataset.forEach(item => {
  const normQ = removeAccents(item.question);
  if (!questionLookupMap.has(normQ)) {
    questionLookupMap.set(normQ, item);
  }
});

// 2. MONUMENT ALIASES & HISTORICAL SHORTCUTS
const MONUMENT_ALIASES = [
  { stt: 1, aliases: ['dinh doc lap', 'dinh thong nhat', 'dinh norodom', 'hoi truong thong nhat', 'xe tang 390', 'xe tang 843', 'ngo viet thu', 'bui quang than', 'vu dang toan'] },
  { stt: 2, aliases: ['dia dao cu chi', 'ben duoc', 'ben dinh', 'cu chi'] },
  { stt: 3, aliases: ['ben loc an', 'duong ho chi minh tren bien', 'tau khong so'] },
  { stt: 4, aliases: ['nha tu con dao', 'con dao', 'hang duong', 'chuong cop', 'nghia trang hang duong'] },
  { stt: 5, aliases: ['chien thang binh gia', 'duc thanh', 'binh gia'] },
  { stt: 6, aliases: ['can cu minh dam', 'nui minh dam', 'minh dam'] },
  { stt: 7, aliases: ['can cu rung sac', 'rung sac', 'dac cong rung sac', 'trung doan 10', 'luong van nho'] },
  { stt: 8, aliases: ['chien khu d'] },
  { stt: 9, aliases: ['dia dao kim long'] },
  { stt: 10, aliases: ['dia dao phu tho hoa', 'phu tho hoa'] },
  { stt: 11, aliases: ['dia dao tay nam', 'tam giac sat'] },
  { stt: 12, aliases: ['ba son', 'ton duc thang', 'u tau ba son', 'bac ton'] },
  { stt: 13, aliases: ['ham vu khi ba thang hai', 'ham 183 4 ba thang hai', '183 4 ba thang hai'] },
  { stt: 14, aliases: ['tran phu', 'benh vien cho quan', 'trai giam cho quan', 'nha thuong cho quan', 'hay giu vung chi khi'] },
  { stt: 15, aliases: ['nga ba giong', '18 thon vuon trau', 'hoc mon'] },
  { stt: 16, aliases: ['vo thi sau', 'chi sau', 'nha luu niem vo thi sau', 'dat do'] },
  { stt: 17, aliases: ['nha tu phu loi', 'cang phu loi'] },
  { stt: 18, aliases: ['nguyen tat thanh', 'bac ho', 'chu van liem', 'so 5 chu van liem', 'ra di tim duong cuu nuoc', 'ben nha rong', 'nha rong'] },
  { stt: 19, aliases: ['an nam cong san dang', 'so 1 chu van liem'] },
  { stt: 20, aliases: ['so chi huy tien phuong', 'chien dich ho chi minh'] },
  { stt: 21, aliases: ['cu lao rua'] },
  { stt: 22, aliases: ['doc chua'] },
  { stt: 23, aliases: ['giong ca vo'] },
  { stt: 24, aliases: ['lo gom hung loi', 'gom hung loi'] },
  { stt: 28, aliases: ['ham vu khi nguyen dinh chieu', '287 70 nguyen dinh chieu', 'biet dong sai gon', 'ba muong', 'sau ba'] },
  { stt: 39, aliases: ['mo phan chau trinh', 'phan chau trinh', 'phan chu trinh'] },
  { stt: 46, aliases: ['chua vinh nghiem', 'vinh nghiem'] },
  { stt: 57, aliases: ['bao tang lich su tp hcm', 'bao tang lich su'] },
  { stt: 58, aliases: ['bao tang thanh pho ho chi minh', 'dinh gia long'] },
  { stt: 59, aliases: ['chua giac lam', 'giac lam'] },
  { stt: 70, aliases: ['chua giac vien', 'giac vien'] },
  { stt: 88, aliases: ['lang ong ba chieu', 'lang ong', 'le van duyet', 'ta quan le van duyet'] },
  { stt: 96, aliases: ['nha hat thanh pho', 'nha hat lon'] },
  { stt: 103, aliases: ['tru so ubnd', 'toa do chinh'] }
];

// 3. INTENT RECOGNITION KEYWORDS (15 INTENT CATEGORIES)
const INTENT_KEYWORDS = [
  { intent: 'rank', label: '⭐ Xếp hạng & Giá trị di tích', keys: ['xep hang', 'hang di tich', 'cap quoc gia', 'cap thanh pho', 'quoc gia dac biet', 'xep hang gi', 'vi sao xep hang', 'tai sao xep hang', 'vi sao duoc xep hang', 'tai sao duoc xep hang', 'duoc xep hang', 'cong nhan cap', 'quoc gia', 'gia tri', 'y nghia', 'khong co gia tri', 'co gia tri gi', 'vi sao co gia tri', 'gia tri gi', 'vi sao', 'tai sao'] },
  { intent: 'lichsu', label: '📜 Lịch sử & Nguồn gốc hình thành', keys: ['lich su', 'nguon goc', 'hinh thanh', 'xay dung nam nao', 'xay dung khi nao', 'nien dai', 'boi canh', 'qua trinh hinh thanh', 'lich su hinh thanh', 'ra doi khi nao', 'xay dung'] },
  { intent: 'nhanvat', label: '👤 Nhân vật lịch sử gắn liền', keys: ['nhan vat', 'gan lien voi ai', 'ai lanh dao', 'ai chi huy', 'ai hy sinh', 'ai thiet ke', 'ai dung dau', 'ai hoat dong', 'con nguoi', 'anh hung', 'chi si', 'ai'] },
  { intent: 'hientvat', label: '🏺 Hiện vật & Bảo vật tiêu biểu', keys: ['hien vat', 'vu khi', 'trung bay', 'bao vat', 'co gi trung bay', 'do vat', 'xe tang', 'sung phao', 'sung', 'tu lieu', 'hien vat quy'] },
  { intent: 'sukien', label: '⚔️ Sự kiện lịch sử tiêu biểu', keys: ['su kien', 'dien bien', 'su kien lich su', 'chuyen gi da dien ra', 'chien cong', 'tran danh', 'cuoc khoi nghia', 'bai cong', 'khoi nghia'] },
  { intent: 'dc_sau', label: '📍 Địa chỉ & Vị trí hiện nay', keys: ['dia chi', 'o dau', 'vi tri', 'nam o dau', 'tai dau', 'phuong nao', 'quan nao', 'duong nao', 'toa lac o dau', 'dia diem', 'cach di', 'tim duong'] },
  { intent: 'dc_truoc', label: '🏛️ Địa chỉ & Đơn vị hành chính trước đây', keys: ['dia chi truoc', 'don vi hanh chinh truoc', 'truoc day thuoc', 'ten cu', 'dia chi cu'] },
  { intent: 'qd', label: '📋 Quyết định công nhận di tích', keys: ['quyet dinh', 'ngay cong nhan', 'so quyet dinh', 'cong nhan ngay nao', 'van ban cong nhan', 'nam cong nhan'] },
  { intent: 'loai', label: '🏷️ Loại hình di tích', keys: ['loai hinh', 'thuoc loai nao', 'the loai di tich', 'loai di tich'] },
  { intent: 'toado', label: '🌐 Tọa độ GPS', keys: ['toa do', 'kinh do', 'vi do', 'gps'] },
  { intent: 'map', label: '🗺️ Bản đồ chỉ đường Google Maps', keys: ['ban do', 'google map', 'chi duong', 'map', 'vi tri tren ban do'] },
  { intent: 'video', label: '🎥 Video tư liệu & Thước phim', keys: ['video', 'clip', 'xem phim', 'thuoc phim', 'phim tu lieu', 'video di tich'] },
  { intent: 'tailieu', label: '📚 Hồ sơ & Tài liệu khoa học', keys: ['tai lieu', 'ho so', 'tai lieu khoa hoc', 'ho so khoa hoc'] },
  { intent: 'tomtat', label: '💡 Giới thiệu di tích', keys: ['tom tat', 'tong quan', 'gioi thieu', 'so luoc', 'thong tin', 've di tich', 'la gi'] }
];

export default function HeritageAIChatbot({
  currentMonumentStt = 1,
  viewMode = 'home', // 'home' | 'detail'
  onSelectMonument,
  onOpenExplorer,
  onOpenMyMap
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [hasUnread, setHasUnread] = useState(true);

  // Gemini API Settings State
  const [showSettings, setShowSettings] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(getGeminiApiKey() || '');
  const [isGeminiEnabled, setIsGeminiEnabled] = useState(hasGeminiApiKey());
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Current monument info if in detail mode
  const currentMonument = useMemo(() => {
    return allMonumentsList.find(m => m.stt === currentMonumentStt) || allMonumentsList[0];
  }, [currentMonumentStt]);

  // Initial Welcome Messages
  const [messages, setMessages] = useState([
    {
      id: 'welcome_1',
      sender: 'ai',
      text: `Xin chào! Tôi là **Trợ Lý Di Sản AI** được huấn luyện với bộ tri thức chuẩn **3.605 câu hỏi - đáp chính thống** về **103 Di tích Lịch sử - Văn hóa TP.HCM & Vùng phụ cận** 🏛️✨\n\nBạn có thể hỏi tôi về:\n- 📜 **Lịch sử & Niên đại** của bất kỳ di tích nào.\n- 👤 **Nhân vật & Sự kiện** hào hùng gắn liền.\n- 🏺 **Hiện vật & Bảo vật** quý giá được lưu giữ.\n- 📍 **Địa chỉ, Tọa độ GPS, Bản đồ & Video** tư liệu.\n- 📚 **Tích hợp 6 môn học THCS & Đề tài KHKT**.\n\n*Hãy nhập tên di tích, số STT hoặc câu hỏi để bắt đầu!*`,
      timestamp: new Date(),
      suggestions: [
        'Có bao nhiêu di tích thuộc loại Lịch sử?',
        'Dinh Độc Lập có những hiện vật tiêu biểu nào?',
        'Nhân vật lịch sử gắn liền với Bến Nhà Rồng là ai?',
        'Địa chỉ của Địa đạo Củ Chi ở đâu?'
      ]
    }
  ]);

  // Dynamic context suggestions based on current screen
  const contextualSuggestions = useMemo(() => {
    if (viewMode === 'detail' && currentMonument) {
      const name = currentMonument.info.name;
      return [
        `Tóm tắt lịch sử ${name}`,
        `Nhân vật và sự kiện gắn liền với ${name}`,
        `Hiện vật tiêu biểu tại ${name}`,
        `Địa chỉ và cách di chuyển đến ${name}`,
        `Điều tra: ${currentMonument.investigation?.investigationQuestion || 'Giá trị lịch sử cốt lõi'}`
      ];
    }
    return [
      'Có bao nhiêu di tích thuộc loại Lịch sử?',
      'Có bao nhiêu di tích được xếp hạng Quốc gia đặc biệt?',
      'Dinh Độc Lập có những hiện vật tiêu biểu nào?',
      'Kể về lịch sử Căn cứ Rừng Sác',
      'Những di tích lịch sử nổi bật ở Côn Đảo'
    ];
  }, [viewMode, currentMonument]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isThinking]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  // =========================================================================
  // TRAINED KNOWLEDGE BASE & HIGH-PRECISION INFERENCE ENGINE (3,605 Q&A)
  // =========================================================================
  const formatTrainedResponse = (mon, intentKey, customAnswer = null, customLabel = null, rawQuery = '') => {
    const rawMon = allMonumentsList.find(m => m.stt === mon.stt) || allMonumentsList[0];
    const answer = customAnswer || mon.intents[intentKey]?.answer || mon.intents.tomtat?.answer || mon.intents.lichsu?.answer || rawMon.info?.overview;
    const cleanUserQ = removeAccents(rawQuery || '');
    
    let resp = `### 🏛️ ${mon.name} (#STT ${mon.stt})\n\n`;

    // Dynamic Context-Aware Lead-in: nương theo câu hỏi người dùng
    if (intentKey === 'rank' || cleanUserQ.includes('xep hang') || cleanUserQ.includes('vi sao') || cleanUserQ.includes('tai sao') || cleanUserQ.includes('gia tri') || cleanUserQ.includes('y nghia') || cleanUserQ.includes('quoc gia')) {
      const rankVal = mon.intents.rank?.answer || rawMon.info?.ranking || 'Di tích Lịch sử cấp Quốc gia';
      const qdVal = mon.intents.qd?.answer ? ` (${mon.intents.qd.answer.replace(/\.$/, '')})` : '';
      const historicalMeaning = mon.intents.lichsu?.answer || mon.intents.tomtat?.answer || rawMon.info?.overview;

      if (cleanUserQ.includes('vi sao') || cleanUserQ.includes('tai sao') || cleanUserQ.includes('gia tri') || cleanUserQ.includes('khong co') || cleanUserQ.includes('y nghia')) {
        resp += `Di tích **${mon.name}** được xếp hạng **${rankVal}**${qdVal} vì mang những giá trị lịch sử, văn hóa và kiến trúc tiêu biểu sau:\n\n`;
        resp += `${historicalMeaning}\n\n`;
      } else {
        resp += `Di tích **${mon.name}** được xếp hạng cấp **${rankVal}**${qdVal}.\n\n`;
        resp += `⭐ **Giá trị và ý nghĩa lịch sử tiêu biểu:**\n${historicalMeaning}\n\n`;
      }
    } else if (intentKey === 'lichsu' || cleanUserQ.includes('lich su') || cleanUserQ.includes('nguon goc') || cleanUserQ.includes('hinh thanh') || cleanUserQ.includes('xay dung')) {
      resp += `Về lịch sử hình thành và nguồn gốc của **${mon.name}**:\n\n${answer}\n\n`;
    } else if (intentKey === 'nhanvat' || cleanUserQ.includes('nhan vat') || cleanUserQ.includes('ai')) {
      resp += `Gắn liền với lịch sử của **${mon.name}** là các nhân vật tiêu biểu:\n\n${answer}\n\n`;
    } else if (intentKey === 'hientvat' || cleanUserQ.includes('hien vat') || cleanUserQ.includes('bao vat') || cleanUserQ.includes('vu khi')) {
      resp += `Tại di tích **${mon.name}**, các hiện vật và bảo vật lịch sử tiêu biểu được lưu giữ gồm:\n\n${answer}\n\n`;
    } else if (intentKey === 'sukien' || cleanUserQ.includes('su kien') || cleanUserQ.includes('chien cong')) {
      resp += `Các sự kiện lịch sử và dấu mốc tiêu biểu diễn ra tại **${mon.name}**:\n\n${answer}\n\n`;
    } else if (intentKey === 'dc_sau' || intentKey === 'dc_truoc' || cleanUserQ.includes('dia chi') || cleanUserQ.includes('o dau') || cleanUserQ.includes('vi tri')) {
      resp += `Di tích **${mon.name}** hiện tọa lạc tại địa chỉ: **${answer}**\n\n`;
      if (mon.intents.dc_truoc?.answer && mon.intents.dc_truoc.answer !== answer) {
        resp += `*(Địa chỉ trước đây: ${mon.intents.dc_truoc.answer})*\n\n`;
      }
    } else if (intentKey === 'qd' || cleanUserQ.includes('quyet dinh') || cleanUserQ.includes('ngay cong nhan')) {
      resp += `Di tích **${mon.name}** được công nhận chính thức theo: **${answer}** (Xếp hạng: **${mon.intents.rank?.answer || 'Quốc gia'}**).\n\n`;
    } else if (intentKey === 'loai' || cleanUserQ.includes('loai hinh')) {
      resp += `Di tích **${mon.name}** thuộc loại hình: **${answer}**.\n\n`;
    } else if (intentKey === 'toado' || intentKey === 'map') {
      resp += `Vị trí địa lý và định vị bản đồ của di tích **${mon.name}**:\n- 🌐 **Tọa độ GPS:** \`${mon.intents.toado?.answer || 'Đang cập nhật'}\`\n- 🗺️ **Bản đồ chỉ đường:** [Mở chỉ đường trên Google Maps](${mon.intents.map?.answer || '#'})\n\n`;
    } else if (intentKey === 'video') {
      resp += `Thước phim và video tư liệu về **${mon.name}**:\n- 🎥 **Xem tư liệu:** [Nhấp vào đây để xem video](${mon.intents.video?.answer})\n\n`;
    } else if (intentKey === 'tailieu') {
      resp += `Hồ sơ khoa học và tài liệu lưu trữ về di tích **${mon.name}**:\n\n${answer}\n\n`;
    } else {
      // Giới thiệu tổng quan tự nhiên, KHÔNG có chữ "Tóm tắt & Giới thiệu tổng quan:"
      const cleanIntro = answer.startsWith(mon.name) ? answer.substring(mon.name.length).replace(/^[\s,.:\-–]+/, '') : answer;
      resp += `**${mon.name}** là ${cleanIntro}\n\n`;
    }

    // Quick meta line
    const addr = mon.intents.dc_sau?.answer || rawMon.info?.address;
    const rank = mon.intents.rank?.answer || rawMon.info?.ranking || 'Di tích Lịch sử';
    const type = mon.intents.loai?.answer || rawMon.info?.type;

    resp += `---\n`;
    if (addr) resp += `- 📍 **Địa chỉ:** ${addr}\n`;
    if (rank) resp += `- ⭐ **Xếp hạng:** ${rank}\n`;
    if (type) resp += `- 🏷️ **Loại hình:** ${type}\n`;

    if (rawMon.investigation?.investigationQuestion && (intentKey === 'tomtat' || intentKey === 'lichsu' || intentKey === 'rank')) {
      resp += `\n🔭 **Gợi ý học tập & điều tra:**\n*${rawMon.investigation.investigationQuestion}*`;
    }

    return {
      text: resp.trim(),
      relatedMonuments: [rawMon]
    };
  };

  const processAIQuery = (query) => {
    const rawQ = query.trim();
    const cleanQ = removeAccents(rawQ);

    if (!cleanQ) {
      return {
        text: 'Bạn hãy nhập câu hỏi về di tích, lịch sử, nhân vật hoặc bài học để tôi hỗ trợ nhé!',
        relatedMonuments: []
      };
    }

    // 1. GREETINGS & INTRO
    if (/^(chao|hello|hi|xin chao|ban la ai|gioi thieu ban|tro ly la ai|ban lam duoc gi)/i.test(cleanQ)) {
      return {
        text: `Xin chào! Tôi là **Trợ Lý Di Sản AI** 🏛️✨\n\nTôi hỗ trợ bạn tra cứu toàn diện với **bộ tri thức chuẩn 3.605 câu hỏi - đáp chính thống** về **103 Di tích Lịch sử - Văn hóa TP.HCM & Vùng phụ cận**:\n\n- 🔍 **Tra cứu nhanh:** Theo tên di tích, số STT (#1 - #103) hoặc địa bàn Quận/Huyện.\n- 📜 **Lịch sử & Niên đại:** Tóm tắt bối cảnh, nguồn gốc và quá trình hình thành.\n- 👤 **Nhân vật & Hiện vật:** Bác Hồ, Võ Thị Sáu, Trần Phú, Tôn Đức Thắng, xe tăng 390/843, hầm vũ khí...\n- ⚔️ **Sự kiện & Chiến công:** Các trận đánh, khởi nghĩa, chiến dịch giải phóng...\n- 📚 **Học tập 6 môn:** Lịch sử, Địa lý, Ngữ văn, GDCD, STEM và hồ sơ điều tra KHKT.\n\n*Bạn hãy nhập câu hỏi cần giải đáp nhé!*`,
        relatedMonuments: [allMonumentsList[0], allMonumentsList[1], allMonumentsList[3]]
      };
    }

    // 2. CONTEXT-AWARE: CURRENT MONUMENT IN DETAIL VIEW
    if (viewMode === 'detail' && currentMonument) {
      const otherMonMatched = allMonumentsList.some(m => m.stt !== currentMonument.stt && cleanQ.includes(removeAccents(m.info.name)));
      
      if (!otherMonMatched) {
        const monData = monumentQaMap[currentMonument.stt];
        if (monData) {
          if (cleanQ.includes('xep hang') || cleanQ.includes('quoc gia') || cleanQ.includes('gia tri') || cleanQ.includes('y nghia') || cleanQ.includes('vi sao') || cleanQ.includes('tai sao')) {
            return formatTrainedResponse(monData, 'rank', null, null, rawQ);
          }
          if (cleanQ.includes('dia chi') || cleanQ.includes('o dau') || cleanQ.includes('vi tri') || cleanQ.includes('duong nao') || cleanQ.includes('quan nao')) {
            return formatTrainedResponse(monData, 'dc_sau', null, null, rawQ);
          }
          if (cleanQ.includes('hien vat') || cleanQ.includes('bao vat') || cleanQ.includes('vu khi') || cleanQ.includes('trung bay')) {
            return formatTrainedResponse(monData, 'hientvat', null, null, rawQ);
          }
          if (cleanQ.includes('nhan vat') || cleanQ.includes('ai lanh dao') || cleanQ.includes('ai chi huy') || cleanQ.includes('gan lien voi ai')) {
            return formatTrainedResponse(monData, 'nhanvat', null, null, rawQ);
          }
          if (cleanQ.includes('su kien') || cleanQ.includes('dien bien') || cleanQ.includes('chien cong') || cleanQ.includes('tran danh')) {
            return formatTrainedResponse(monData, 'sukien', null, null, rawQ);
          }
          if (cleanQ.includes('lich su') || cleanQ.includes('nguon goc') || cleanQ.includes('hinh thanh') || cleanQ.includes('xay dung')) {
            return formatTrainedResponse(monData, 'lichsu', null, null, rawQ);
          }
          if (cleanQ.includes('quyet dinh') || cleanQ.includes('ngay cong nhan')) {
            return formatTrainedResponse(monData, 'qd', null, null, rawQ);
          }
          if (cleanQ.includes('loai hinh') || cleanQ.includes('the loai')) {
            return formatTrainedResponse(monData, 'loai', null, null, rawQ);
          }
          if (cleanQ.includes('toa do') || cleanQ.includes('gps') || cleanQ.includes('ban do') || cleanQ.includes('map')) {
            return formatTrainedResponse(monData, 'map', null, null, rawQ);
          }
          if (cleanQ.includes('video') || cleanQ.includes('clip') || cleanQ.includes('phim')) {
            return formatTrainedResponse(monData, 'video', null, null, rawQ);
          }
          if (cleanQ.includes('dieu tra') && currentMonument.investigation?.investigationQuestion) {
            return {
              text: `### 🔬 Hồ Sơ Điều Tra Lịch Sử: ${currentMonument.info.name} (#STT ${currentMonument.stt})\n\n> 🔭 **Câu hỏi điều tra:** *${currentMonument.investigation.investigationQuestion}*\n\n💡 **Gợi ý giải đáp:**\n${currentMonument.investigation.suggestedAnswer || monData.intents.tomtat?.answer || currentMonument.info.overview}\n\n📍 *Địa chỉ:* ${currentMonument.info.address}`,
              relatedMonuments: [currentMonument]
            };
          }
          if (cleanQ.includes('di tich nay') || cleanQ.includes('o day') || cleanQ.includes('noi nay') || cleanQ.includes('tom tat') || cleanQ.includes('gioi thieu')) {
            return formatTrainedResponse(monData, 'tomtat', null, null, rawQ);
          }
        }
      }
    }

    // 3. STEP 1: SYSTEM FAQ MATCH (Exact & semantic sub-string)
    const sortedFaqs = [...systemFaqList].sort((a, b) => b.q.length - a.q.length);
    for (const faq of sortedFaqs) {
      const normFaqQ = removeAccents(faq.q);
      if (cleanQ === normFaqQ || (cleanQ.length > 10 && cleanQ.includes(normFaqQ))) {
        return {
          text: `### 📊 ${faq.group} (${faq.id})\n\n${faq.a}\n\n💡 *Hệ thống đang lưu trữ và số hóa đầy đủ toàn bộ 103 di tích lịch sử - văn hóa TP.HCM & vùng phụ cận.*`,
          relatedMonuments: allMonumentsList.slice(0, 4)
        };
      }
    }

    // 4. STEP 2: EXACT MATCH IN 3,605 PRE-TRAINED QUESTIONS
    if (questionLookupMap.has(cleanQ)) {
      const matched = questionLookupMap.get(cleanQ);
      const monData = monumentQaMap[matched.stt];
      if (monData) {
        return formatTrainedResponse(monData, matched.intent, matched.answer, matched.intentLabel, rawQ);
      }
    }

    // 5. STEP 3: TARGETED MONUMENT + INTENT EXTRACTION
    let matchedStt = null;

    // Check direct STT
    const sttMatch = cleanQ.match(/(?:stt|so|di tich|#)\s*([0-9]{1,3})/i) || cleanQ.match(/^([0-9]{1,3})$/);
    if (sttMatch) {
      const num = parseInt(sttMatch[1], 10);
      if (monumentQaMap[num]) matchedStt = num;
    }

    // Check aliases
    if (!matchedStt) {
      for (const item of MONUMENT_ALIASES) {
        if (item.aliases.some(alias => cleanQ.includes(alias))) {
          matchedStt = item.stt;
          break;
        }
      }
    }

    // Check fuzzy name matching
    if (!matchedStt) {
      let bestScore = 0;
      allMonumentsList.forEach(m => {
        const mNameNorm = removeAccents(m.info.name);
        let score = 0;
        if (cleanQ.includes(mNameNorm)) score += 120;
        else if (mNameNorm.includes(cleanQ)) score += 80;

        const words = mNameNorm.split(' ').filter(w => w.length > 2);
        let matchCount = 0;
        words.forEach(w => {
          if (cleanQ.includes(w)) matchCount++;
        });
        if (words.length > 0 && matchCount >= 2) score += matchCount * 15;

        if (score > bestScore && score >= 35) {
          bestScore = score;
          matchedStt = m.stt;
        }
      });
    }

    if (matchedStt && monumentQaMap[matchedStt]) {
      const monData = monumentQaMap[matchedStt];

      // Detect Intent
      let matchedIntent = null;
      for (const item of INTENT_KEYWORDS) {
        if (item.keys.some(k => cleanQ.includes(k))) {
          matchedIntent = item;
          break;
        }
      }

      if (matchedIntent && monData.intents[matchedIntent.intent]) {
        return formatTrainedResponse(monData, matchedIntent.intent, null, matchedIntent.label, rawQ);
      } else {
        return formatTrainedResponse(monData, 'tomtat', null, null, rawQ);
      }
    }

    // 6. STEP 4: HISTORICAL FIGURE CLUSTERS
    const figures = [
      {
        keys: ['ho chi minh', 'nguyen tat thanh', 'bac ho', 'nguyen ai quoc', 'ben nha rong'],
        name: 'Chủ tịch Hồ Chí Minh (Nguyễn Tất Thành)',
        stts: [18, 12, 3, 20, 1],
        summary: 'Người thanh niên Nguyễn Tất Thành đã ở tại căn nhà số 5 Châu Văn Liêm (Quận 5 - STT 18) trước khi ra đi tìm đường cứu nước ngày 5/6/1911. Tên Người gắn liền với Chiến dịch Hồ Chí Minh 1975 giải phóng miền Nam.'
      },
      {
        keys: ['vo thi sau', 'chi sau', 'dat do', 'hang duong'],
        name: 'Nữ anh hùng LLVTND Võ Thị Sáu (1933–1952)',
        stts: [16, 4],
        summary: 'Nữ anh hùng Đất Đỏ (STT 16) kiên trung, bất khuất, là nữ tù nhân duy nhất và đầu tiên bị thực dân Pháp xử bắn tại Hàng Dương, Côn Đảo (STT 4) khi mới 19 tuổi.'
      },
      {
        keys: ['tran phu', 'tong bi thu dau tien', 'hay giu vung chi khi'],
        name: 'Tổng Bí thư Trần Phú (1904–1931)',
        stts: [14],
        summary: 'Tổng Bí thư đầu tiên của Đảng, tác giả Luận cương chính trị 1930. Đồng chí bị địch giam cầm và hy sinh anh dũng tại Nhà thương Chợ Quán (STT 14) ngày 6/9/1931 với lời dặn bất hủ: *"Hãy giữ vững chí khí chiến đấu!"*.'
      },
      {
        keys: ['ton duc thang', 'ba son', 'chu tich ton duc thang', 'bac ton'],
        name: 'Chủ tịch Tôn Đức Thắng (Bác Tôn)',
        stts: [12],
        summary: 'Gắn liền với phong trào công nhân xưởng Ba Son (STT 12), lãnh đạo cuộc bãi công lịch sử năm 1925 ủng hộ phong trào cách mạng của công nhân Quảng Châu.'
      },
      {
        keys: ['le van duyet', 'ta quan', 'lang ong', 'ba chieu'],
        name: 'Tả quân Lê Văn Duyệt (1764–1832)',
        stts: [88],
        summary: 'Tổng trấn Gia Định Thành, có công lớn trong việc khai phá, mở mang và bảo vệ vùng đất phương Nam thịnh vượng thế kỷ 19.'
      },
      {
        keys: ['phan chau trinh', 'phan chu trinh', 'chi si'],
        name: 'Nhà yêu nước Phan Châu Trinh (1872–1926)',
        stts: [39],
        summary: 'Chí sĩ yêu nước khởi xướng phong trào Duy Tân với chủ trương "Khai dân trí, chấn dân khí, hậu dân sinh". Mộ của cụ tọa lạc tại Tân Bình, TP.HCM (STT 39).'
      },
      {
        keys: ['ngo viet thu', 'kien truc su dinh doc lap', 'thiet ke dinh doc lap', 'ai thiet ke dinh doc lap'],
        name: 'Kiến trúc sư Ngô Viết Thụ (1926–2000)',
        stts: [1],
        summary: 'KTS đoạt giải Khôi nguyên La Mã 1955, là người thiết kế Dinh Độc Lập (STT 1) với triết lý kiến trúc Á Đông kết hợp hiện đại độc đáo (mặt bằng chữ CÁT, KHẨU, CHỦ, TRUNG).'
      },
      {
        keys: ['bui quang than', 'vu dang toan', 'xe tang 390', 'xe tang 843', 'huc do cong dinh doc lap', '30/4/1975', 'giai phong mien nam'],
        name: 'Chứng nhân lịch sử ngày 30/4/1975 tại Dinh Độc Lập',
        stts: [1],
        summary: 'Xe tăng 843 do Đại đội trưởng Bùi Quang Thận chỉ huy và xe tăng 390 do Trung úy Vũ Đăng Toàn chỉ huy húc đổ cổng chính Dinh Độc Lập trưa 30/4/1975, cắm cờ giải phóng trên nóc Dinh.'
      },
      {
        keys: ['rung sac', 'dac cong rung sac', 'trung doan 10', 'luong van nho'],
        name: 'Chiến sĩ Đặc công Rừng Sác (Trung đoàn 10)',
        stts: [7],
        summary: 'Đội quân "xuất quỷ nhập thần" bám trụ rừng ngập mặn Cần Giờ hiểm trở, lập nên những chiến công vang dội như thiêu hủy kho bom Thành Tuy Hạ, kho xăng Nhà Bè.'
      },
      {
        keys: ['biet dong thanh', 'biet dong sai gon', 'ham vu khi', 'ba muong', 'sau ba'],
        name: 'Lực lượng Biệt động Sài Gòn - Gia Định',
        stts: [28, 13, 1, 48],
        summary: 'Lực lượng đặc biệt tinh nhuệ hoạt động ngay trong lòng địch. Các căn hầm bí mật như 287/70 Nguyễn Đình Chiểu (STT 28) và 183/4 Ba Tháng Hai (STT 13) chứa hàng tấn vũ khí tấn công Dinh Độc Lập, Đại sứ quán Mỹ Tết Mậu Thân 1968.'
      }
    ];

    for (const fig of figures) {
      if (fig.keys.some(k => cleanQ.includes(k))) {
        const matches = allMonumentsList.filter(m => fig.stts.includes(m.stt));
        let resp = `### 👤 ${fig.name}\n\n`;
        resp += `💡 **Tóm tắt lịch sử:**\n${fig.summary}\n\n`;
        resp += `🏛️ **Di tích gắn liền trực tiếp:**\n`;
        matches.forEach((m, idx) => {
          resp += `${idx + 1}. **${m.info.name}** (#STT ${m.stt}) - 📍 ${m.info.address}\n`;
        });
        return {
          text: resp.trim(),
          relatedMonuments: matches
        };
      }
    }

    // 7. STEP 5: REGIONAL & DISTRICT FILTER
    const regions = [
      { keys: ['can gio', 'rung sac'], name: 'Huyện Cần Giờ', filter: m => m.info.address.toLowerCase().includes('cần giờ') || m.stt === 7 || m.stt === 23 },
      { keys: ['cu chi', 'dia dao cu chi'], name: 'Huyện Củ Chi', filter: m => m.info.address.toLowerCase().includes('củ chi') || m.stt === 2 },
      { keys: ['hoc mon', '18 thon vuon trau', 'nga ba giong'], name: 'Huyện Hóc Môn', filter: m => m.info.address.toLowerCase().includes('hóc môn') || m.stt === 15 || m.stt === 31 },
      { keys: ['quan 1', 'q1', 'trung tam quan 1'], name: 'Quận 1', filter: m => m.info.address.toLowerCase().includes('quận 1') || m.stt === 1 || m.stt === 12 || m.stt === 48 || m.stt === 57 || m.stt === 58 || m.stt === 69 || m.stt === 96 || m.stt === 102 || m.stt === 103 },
      { keys: ['quan 3', 'q3'], name: 'Quận 3', filter: m => m.info.address.toLowerCase().includes('quận 3') || m.stt === 27 || m.stt === 28 || m.stt === 46 },
      { keys: ['quan 5', 'q5', 'cho lon', 'hoi quan'], name: 'Quận 5 (Chợ Lớn)', filter: m => m.info.address.toLowerCase().includes('quận 5') || (m.stt >= 82 && m.stt <= 87) || m.stt === 14 || m.stt === 18 || m.stt === 73 || m.stt === 92 || m.stt === 98 },
      { keys: ['quan 10', 'q10'], name: 'Quận 10', filter: m => m.info.address.toLowerCase().includes('quận 10') || m.stt === 13 || m.stt === 29 || m.stt === 71 },
      { keys: ['quan 8', 'q8'], name: 'Quận 8', filter: m => m.info.address.toLowerCase().includes('quận 8') || m.stt === 24 || m.stt === 34 },
      { keys: ['thu duc', 'tp thu duc', 'quan 9', 'quan 2'], name: 'TP. Thủ Đức', filter: m => m.info.address.toLowerCase().includes('thủ đức') || m.info.address.toLowerCase().includes('quận 9') || m.stt === 26 || m.stt === 35 || m.stt === 62 || m.stt === 66 || m.stt === 78 || m.stt === 80 || m.stt === 81 },
      { keys: ['tan binh', 'go vap', 'phu nhuan', 'binh thanh'], name: 'Khu vực Tân Bình - Gò Vấp - Phú Nhuận - Bình Thạnh', filter: m => m.info.address.toLowerCase().includes('tân bình') || m.info.address.toLowerCase().includes('gò vấp') || m.info.address.toLowerCase().includes('phú nhuận') || m.info.address.toLowerCase().includes('bình thạnh') || m.stt === 10 || m.stt === 39 || m.stt === 47 || m.stt === 49 || m.stt === 54 || m.stt === 59 || m.stt === 70 || m.stt === 75 || m.stt === 79 || m.stt === 88 || m.stt === 89 || m.stt === 90 },
      { keys: ['con dao', 'nha tu con dao'], name: 'Huyện Côn Đảo', filter: m => m.info.address.toLowerCase().includes('côn đảo') || m.stt === 4 },
      { keys: ['vung tau', 'ba ria', 'ba ria - vung tau', 'brvt'], name: 'Bà Rịa - Vũng Tàu', filter: m => m.info.address.toLowerCase().includes('vũng tàu') || m.info.address.toLowerCase().includes('bà rịa') || m.info.address.toLowerCase().includes('long điền') || m.info.address.toLowerCase().includes('đất đỏ') || (m.stt >= 50 && m.stt <= 56) || m.stt === 3 || m.stt === 5 || m.stt === 6 || m.stt === 9 || m.stt === 16 || m.stt === 25 || m.stt === 32 || m.stt === 33 || m.stt === 36 || m.stt === 37 || m.stt === 40 || m.stt === 41 || m.stt === 42 || m.stt === 43 || m.stt === 45 || m.stt === 63 || m.stt === 65 || m.stt === 68 || m.stt === 77 || m.stt === 91 || m.stt === 97 || m.stt === 99 || m.stt === 101 },
      { keys: ['binh duong', 'song be', 'di an', 'thu dau mot', 'tan uyen', 'ben cat'], name: 'Bình Dương', filter: m => m.info.address.toLowerCase().includes('bình dương') || m.info.address.toLowerCase().includes('dĩ an') || m.info.address.toLowerCase().includes('tân uyên') || m.stt === 8 || m.stt === 11 || m.stt === 17 || m.stt === 21 || m.stt === 22 || m.stt === 61 || m.stt === 72 || m.stt === 74 || m.stt === 76 || m.stt === 94 || m.stt === 95 || m.stt === 100 }
    ];

    if (cleanQ.includes('di tich o') || cleanQ.includes('tai ') || cleanQ.includes('khu vuc') || cleanQ.includes('cac di tich')) {
      for (const reg of regions) {
        if (reg.keys.some(k => cleanQ.includes(k))) {
          const matches = allMonumentsList.filter(reg.filter);
          if (matches.length > 0) {
            let resp = `Tại **${reg.name}**, hệ thống có **${matches.length} di tích** tiêu biểu:\n\n`;
            matches.slice(0, 5).forEach((m, idx) => {
              resp += `${idx + 1}. **${m.info.name}** (#STT ${m.stt})\n   - 📍 *Địa chỉ:* ${m.info.address}\n   - ⭐ *Xếp hạng:* ${m.info.ranking || 'Di tích Lịch sử'}\n\n`;
            });
            if (matches.length > 5) {
              resp += `*Và còn ${matches.length - 5} di tích khác trong khu vực này.*`;
            }
            return {
              text: resp.trim(),
              relatedMonuments: matches.slice(0, 4)
            };
          }
        }
      }
    }

    // 8. STEP 6: INTERDISCIPLINARY & 6 SUBJECTS / KHKT
    if (cleanQ.includes('mon hoc') || cleanQ.includes('khkt') || cleanQ.includes('de tai') || cleanQ.includes('stem') || cleanQ.includes('lien mon')) {
      return {
        text: `### 📚 Tích Hợp Di Sản Với 6 Môn Học THCS & Đề Tài KHKT\n\n` +
          `- 📜 **Lịch sử:** Phân tích các mốc son chống Pháp, chống Mỹ, Chiến dịch Hồ Chí Minh (STT 1, 2, 4, 7, 20).\n` +
          `- 🌍 **Địa lý:** Khảo sát phân bố không gian di tích, địa hình rừng ngập mặn Cần Giờ, địa đạo Củ Chi (STT 2, 7, 23).\n` +
          `- 📖 **Ngữ văn:** Cảm thụ văn học qua thơ văn yêu nước, hình tượng nữ anh hùng Võ Thị Sáu, nhà tù Côn Đảo (STT 4, 16).\n` +
          `- ⚖️ **GDCD / HĐTN:** Giáo dục lòng yêu nước, ý thức trách nhiệm bảo tồn và phát huy giá trị di sản văn hóa.\n` +
          `- 🔬 **KHTN / STEM:** Nghiên cứu cấu trúc địa chất đất sét Củ Chi, kỹ thuật xây dựng vòm cuốn, bảo quản hiện vật gốm cổ.\n` +
          `- 🎨 **Nghệ thuật:** Tìm hiểu nghệ thuật chạm khắc gỗ đình làng Nam Bộ, kiến trúc hoa văn Chợ Lớn (STT 59, 73, 83).`,
        relatedMonuments: [allMonumentsList[0], allMonumentsList[1], allMonumentsList[6], allMonumentsList[15]]
      };
    }

    // 9. CLEAN FALLBACK WITH INSTRUCTIVE GUIDANCE
    return {
      text: `Tôi chưa tìm thấy câu trả lời chính xác cho câu hỏi *"**${rawQ}**"*. \n\n` +
        `💡 **Gợi ý cách hỏi hiệu quả để nhận phản hồi từ bộ huấn luyện:**\n` +
        `- Hỏi theo tên di tích: *"Dinh Độc Lập có hiện vật gì?", "Lịch sử Địa đạo Củ Chi", "Nhân vật gắn liền với Bến Nhà Rồng"*\n` +
        `- Hỏi theo số thứ tự: *"STT 1", "Di tích 14", "STT 18"*\n` +
        `- Hỏi theo địa bàn: *"Di tích ở Cần Giờ", "Di tích ở Quận 5", "Di tích ở Côn Đảo"*\n` +
        `- Hỏi theo thống kê: *"Có bao nhiêu di tích thuộc loại Lịch sử?", "Có bao nhiêu di tích Quốc gia đặc biệt?"*`,
      relatedMonuments: allMonumentsList.slice(0, 3)
    };
  };

  // Helper to parse and format inline markdown (**bold**, *italic*) safely
  const formatInlineText = (text) => {
    if (!text) return null;
    try {
      const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
      return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
          return (
            <strong key={i} className="font-bold text-[#8B1417]">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
          return (
            <em key={i} className="italic text-stone-700">
              {part.slice(1, -1)}
            </em>
          );
        }
        return part;
      });
    } catch (e) {
      return text;
    }
  };

  // Handle Save API Key
  const handleSaveApiKey = (e) => {
    if (e) e.preventDefault();
    const cleanKey = apiKeyInput.trim();
    saveGeminiApiKey(cleanKey);
    setIsGeminiEnabled(Boolean(cleanKey));
    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 3000);
  };

  // Handle Clear API Key
  const handleClearApiKey = () => {
    saveGeminiApiKey('');
    setApiKeyInput('');
    setIsGeminiEnabled(false);
  };

  // Handle Send Message (Hybrid: Gemini Live AI + Local Fallback)
  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputMessage;
    if (!query || !query.trim()) return;

    const trimmedQ = query.trim();

    // Add user message
    const userMsg = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: trimmedQ,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');

    // Check if Gemini Live AI is active
    if (isGeminiEnabled && getGeminiApiKey()) {
      setIsThinking(true);
      try {
        const geminiRes = await queryGeminiAI({
          query: trimmedQ,
          chatHistory: messages,
          currentMonument,
          allMonumentsList
        });

        const aiMsg = {
          id: `ai_${Date.now() + 1}`,
          sender: 'ai',
          text: geminiRes.text,
          relatedMonuments: geminiRes.relatedMonuments || [],
          isGemini: true,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMsg]);
      } catch (geminiErr) {
        console.warn('Gemini API query error, falling back to local engine:', geminiErr);
        // Fallback to local knowledge base
        const localResult = processAIQuery(trimmedQ);
        const isApiKeyIssue = geminiErr?.message?.includes('API_KEY') || geminiErr?.message?.includes('API key');
        const aiMsg = {
          id: `ai_${Date.now() + 1}`,
          sender: 'ai',
          text: (isApiKeyIssue ? '> ⚠️ *Chế độ Bản Địa (Cần kiểm tra lại Gemini API Key trong phần Cài đặt)*\n\n' : '> ⚡ *Chế độ Bản Địa (Dữ liệu chuẩn 103 Di tích)*\n\n') + localResult.text,
          relatedMonuments: localResult.relatedMonuments || [],
          isGemini: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMsg]);
      } finally {
        setIsThinking(false);
      }
    } else {
      // Local Fast Offline Engine (< 1ms)
      try {
        const result = processAIQuery(trimmedQ);
        const aiMsg = {
          id: `ai_${Date.now() + 1}`,
          sender: 'ai',
          text: result?.text || 'Không tìm thấy kết quả phù hợp.',
          relatedMonuments: result?.relatedMonuments || [],
          isGemini: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMsg]);
      } catch (err) {
        console.error('Local chatbot error:', err);
        setMessages(prev => [...prev, {
          id: `ai_${Date.now() + 1}`,
          sender: 'ai',
          text: 'Xin chào! Bạn vui lòng thử lại với tên di tích cụ thể hoặc câu hỏi khác nhé.',
          relatedMonuments: allMonumentsList.slice(0, 3),
          isGemini: false,
          timestamp: new Date()
        }]);
      }
    }
  };

  // Copy text to clipboard
  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Reset / Clear chat
  const handleReset = () => {
    setMessages([
      {
        id: `welcome_new_${Date.now()}`,
        sender: 'ai',
        text: `Đã làm mới hội thoại! Bạn muốn tìm hiểu hoặc hỏi đáp về di tích nào tiếp theo? 🏛️✨`,
        timestamp: new Date(),
        suggestions: contextualSuggestions
      }
    ]);
  };

  return (
    <>
      {/* 1. FLOATING AVATAR LAUNCHER BUTTON (ALWAYS VISIBLE CORNER) */}
      <div className="fixed bottom-16 sm:bottom-6 right-4 sm:right-6 z-50 flex items-end gap-2 pointer-events-auto">
        {!isOpen && hasUnread && (
          <div 
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#FFFDFB] text-[#2A1214] border-2 border-[#8B1417]/30 shadow-xl shadow-red-950/20 cursor-pointer animate-bounce hover:border-[#8B1417] transition-all max-w-[220px]"
          >
            <Sparkles className="w-4 h-4 text-[#8B1417] shrink-0" />
            <span className="text-xs font-bold leading-snug line-clamp-2">
              Hỏi Trợ Lý Di Sản AI về 103 di tích!
            </span>
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`relative p-3.5 sm:p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 cursor-pointer flex items-center justify-center ${
            isOpen 
              ? 'bg-[#2A1214] text-white rotate-90 ring-4 ring-rose-200'
              : 'bg-gradient-to-br from-[#8B1417] via-[#A81B1F] to-[#C42226] text-amber-200 ring-4 ring-amber-400/40 shadow-red-950/40'
          }`}
          title="Mở Trợ Lý Di Sản AI"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <>
              <Bot className="w-6 h-6 sm:w-7 sm:h-7" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 rounded-full border-2 border-[#8B1417] animate-ping" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 rounded-full border-2 border-[#8B1417]" />
            </>
          )}
        </button>
      </div>

      {/* 2. EXPANDABLE CHATBOT WINDOW */}
      {isOpen && (
        <div 
          className={`fixed z-50 transition-all duration-300 flex flex-col bg-[#FFFDFB] border-2 border-rose-200 shadow-2xl shadow-red-950/30 overflow-hidden ${
            isExpanded
              ? 'inset-2 sm:inset-6 md:inset-10 rounded-3xl'
              : 'bottom-24 sm:bottom-20 right-2 sm:right-6 w-[calc(100vw-16px)] sm:w-[420px] md:w-[460px] h-[560px] sm:h-[620px] max-h-[85vh] rounded-3xl'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#8B1417] via-[#9B1C1E] to-[#B31D21] text-white p-3.5 sm:p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white/15 border border-amber-300/40 flex items-center justify-center text-amber-200 shadow-inner">
                <Bot className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="font-serif-title font-black text-xs sm:text-sm uppercase tracking-wide text-white">
                    TRỢ LÝ DI SẢN AI
                  </h3>
                  {isGeminiEnabled && getGeminiApiKey() ? (
                    <button
                      onClick={() => setShowSettings(true)}
                      className="px-2 py-0.2 rounded-full bg-amber-400 text-[#8B1417] text-[9px] font-black uppercase flex items-center gap-1 shadow-xs hover:scale-105 transition-transform cursor-pointer"
                      title="Đang chạy Google Gemini AI trực tiếp"
                    >
                      <Sparkles className="w-2.5 h-2.5 fill-current" />
                      <span>Gemini Live</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowSettings(true)}
                      className="px-1.5 py-0.2 rounded-full bg-white/20 text-amber-200 text-[9px] font-bold uppercase hover:bg-white/30 transition-colors cursor-pointer"
                      title="Nhấn để kết nối Gemini API"
                    >
                      Bản Địa (103 DT)
                    </button>
                  )}
                </div>
                <p className="text-[10px] text-rose-100/90 flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${isGeminiEnabled && getGeminiApiKey() ? 'bg-amber-300 animate-pulse' : 'bg-emerald-400 animate-pulse'}`} />
                  <span>{isGeminiEnabled && getGeminiApiKey() ? 'Google Gemini 1.5 Flash Sẵn Sàng' : 'Tri thức số hóa 103 di tích'}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-white/80">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${showSettings ? 'bg-white/25 text-amber-200' : 'hover:bg-white/15 hover:text-white'}`}
                title="Cài đặt Gemini AI API"
              >
                <Settings className="w-4 h-4" />
              </button>

              <button
                onClick={handleReset}
                className="p-1.5 rounded-lg hover:bg-white/15 hover:text-white transition-colors cursor-pointer"
                title="Làm mới cuộc trò chuyện"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="hidden sm:block p-1.5 rounded-lg hover:bg-white/15 hover:text-white transition-colors cursor-pointer"
                title={isExpanded ? "Thu nhỏ" : "Phóng to"}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/15 hover:text-white transition-colors cursor-pointer"
                title="Đóng chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Gemini API Settings Collapsible Drawer */}
          {showSettings && (
            <div className="bg-[#FFFDFB] border-b-2 border-rose-200 p-3.5 sm:p-4 text-xs space-y-3 shadow-inner animate-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-[#8B1417]">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span className="font-serif-title uppercase text-xs">Cấu hình Google Gemini API</span>
                </div>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-stone-400 hover:text-stone-600 p-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-[11px] text-stone-600 leading-relaxed">
                Tích hợp mô hình <strong>Gemini 1.5 Flash</strong> giúp chatbot trả lời thông minh, linh hoạt mọi câu hỏi học tập và kết nối 6 môn học.
              </p>

              <form onSubmit={handleSaveApiKey} className="space-y-2">
                <div className="relative">
                  <input
                    type="password"
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    placeholder="Dán mã Gemini API Key (AIzaSy...)"
                    className="w-full py-2 pl-3 pr-8 text-xs font-mono bg-[#FAF4F0] border border-rose-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8B1417]"
                  />
                  {apiKeyInput && (
                    <button
                      type="button"
                      onClick={handleClearApiKey}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-[10px] font-bold"
                    >
                      Xóa
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-bold text-[#8B1417] hover:underline flex items-center gap-1"
                  >
                    <span>Lấy API Key miễn phí (Google AI Studio)</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <button
                    type="submit"
                    className="px-3.5 py-1.5 rounded-lg bg-[#8B1417] hover:bg-[#A81B1F] text-white font-bold text-[11px] transition-colors cursor-pointer shadow-xs"
                  >
                    Lưu cấu hình
                  </button>
                </div>
              </form>

              {saveSuccessMsg && (
                <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold flex items-center gap-1.5 animate-in fade-in">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Đã lưu API Key! Chatbot sẵn sàng hoạt động với Google Gemini Live.</span>
                </div>
              )}
            </div>
          )}

          {/* Context Banner (If looking at specific monument) */}
          {viewMode === 'detail' && currentMonument && !showSettings && (
            <div className="bg-[#FAF4F0] px-3.5 py-2 border-b border-rose-100 flex items-center justify-between text-xs text-[#8B1417]">
              <div className="flex items-center gap-1.5 font-bold truncate">
                <Landmark className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Đang xem: #{currentMonument.stt} {currentMonument.info.name}</span>
              </div>
              <span className="text-[10px] text-stone-500 shrink-0">Hỏi đáp trực tiếp</span>
            </div>
          )}

          {/* Message List */}
          <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-4 bg-[#FAF7F5]/50">
            {messages.map((msg, index) => (
              <div
                key={msg.id || index}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[90%] sm:max-w-[85%] rounded-2xl p-3 sm:p-3.5 text-xs sm:text-sm leading-relaxed shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-[#8B1417] to-[#A81B1F] text-white rounded-tr-xs'
                      : 'bg-white border border-rose-200 text-[#2A1214] rounded-tl-xs space-y-2'
                  }`}
                >
                  {/* Rich Formatted Message content */}
                  <div className="space-y-1">
                    {msg.text.split('\n').map((line, lIdx) => {
                      const trimmedLine = line.trim();
                      if (!trimmedLine) {
                        return <div key={lIdx} className="h-1" />;
                      }
                      if (trimmedLine.startsWith('### ')) {
                        return (
                          <h4 key={lIdx} className="font-serif-title font-black text-xs sm:text-sm text-[#8B1417] pt-1 pb-0.5 border-b border-rose-100">
                            {trimmedLine.replace('### ', '')}
                          </h4>
                        );
                      }
                      if (trimmedLine.startsWith('> ')) {
                        return (
                          <blockquote key={lIdx} className="border-l-3 border-amber-500 bg-amber-50/80 px-2.5 py-1 my-1 italic text-stone-800 rounded-r-md text-[11px] sm:text-xs">
                            {formatInlineText(trimmedLine.replace('> ', ''))}
                          </blockquote>
                        );
                      }
                      if (trimmedLine.startsWith('- ')) {
                        return (
                          <div key={lIdx} className="flex items-start gap-1.5 py-0.5 pl-1 text-[11.5px] sm:text-xs">
                            <span className="text-[#8B1417] font-bold shrink-0">•</span>
                            <span className="leading-snug">{formatInlineText(trimmedLine.slice(2))}</span>
                          </div>
                        );
                      }
                      if (/^[0-9]+\.\s/.test(trimmedLine)) {
                        const numMatch = trimmedLine.match(/^([0-9]+)\.\s(.*)$/);
                        if (numMatch) {
                          return (
                            <div key={lIdx} className="flex items-start gap-1.5 py-0.5 pl-1 text-[11.5px] sm:text-xs">
                              <span className="font-black text-[#8B1417] shrink-0">{numMatch[1]}.</span>
                              <span className="leading-snug">{formatInlineText(numMatch[2])}</span>
                            </div>
                          );
                        }
                      }
                      return (
                        <p key={lIdx} className="leading-relaxed text-[11.5px] sm:text-xs">
                          {formatInlineText(trimmedLine)}
                        </p>
                      );
                    })}
                  </div>

                  {/* Interactive Monument Cards in AI Response */}
                  {msg.relatedMonuments && msg.relatedMonuments.length > 0 && (
                    <div className="pt-2 mt-2 border-t border-rose-100 space-y-1.5">
                      <div className="text-[10px] font-black uppercase tracking-wider text-[#8B1417]">
                        Di tích liên quan ({msg.relatedMonuments.length}):
                      </div>
                      <div className="grid grid-cols-1 gap-1.5">
                        {msg.relatedMonuments.map(rm => (
                          <div
                            key={rm.stt}
                            onClick={() => {
                              if (onSelectMonument) onSelectMonument(rm.stt);
                              if (window.innerWidth < 640) setIsOpen(false);
                            }}
                            className="p-2 rounded-xl bg-[#FAF4F0] hover:bg-rose-100/70 border border-rose-200/80 flex items-center justify-between cursor-pointer transition-colors group"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="w-8 h-8 rounded-lg overflow-hidden bg-rose-100 shrink-0 border border-rose-200">
                                <img src={rm.info.heroImage} alt={rm.info.name} className="w-full h-full object-cover" />
                              </div>
                              <div className="min-w-0">
                                <div className="text-[11px] font-bold text-[#8B1417] truncate group-hover:underline">
                                  #{rm.stt} {rm.info.name}
                                </div>
                                <div className="text-[9px] text-stone-500 truncate">{rm.info.address}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-0.5 text-[10px] font-bold text-[#8B1417] shrink-0 pl-1">
                              <span>Xem</span>
                              <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* AI Message Action Buttons: Copy */}
                  {msg.sender === 'ai' && (
                    <div className="flex items-center justify-between pt-1.5 text-[11px] text-stone-400 border-t border-rose-50/60 mt-1">
                      {msg.isGemini ? (
                        <span className="text-[9.5px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/80 flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5 text-amber-600 fill-current" />
                          <span>Google Gemini 1.5 Flash</span>
                        </span>
                      ) : (
                        <span className="text-[9.5px] font-bold text-[#8B1417] bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100 flex items-center gap-1">
                          <Landmark className="w-2.5 h-2.5" />
                          <span>Trí tuệ Di Sản Số hóa</span>
                        </span>
                      )}
                      <button
                        onClick={() => handleCopy(msg.text, index)}
                        className="hover:text-[#8B1417] cursor-pointer flex items-center gap-1 transition-colors"
                        title="Sao chép câu trả lời"
                      >
                        {copiedIndex === index ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span className="text-[10px]">{copiedIndex === index ? 'Đã sao chép' : 'Sao chép'}</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Suggestions chips attached to message */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5 max-w-[95%]">
                    {msg.suggestions.map((sug, sIdx) => (
                      <button
                        key={sIdx}
                        onClick={() => handleSendMessage(sug)}
                        className="px-2.5 py-1 rounded-full bg-white hover:bg-[#FAF4F0] border border-rose-200 text-[#8B1417] text-[11px] font-medium transition-all hover:scale-102 cursor-pointer shadow-2xs text-left"
                      >
                        💡 {sug}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Thinking Indicator */}
            {isThinking && (
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-rose-200 w-fit text-xs text-[#8B1417] shadow-sm animate-pulse">
                {isGeminiEnabled && getGeminiApiKey() ? (
                  <Sparkles className="w-4 h-4 animate-spin text-amber-600" />
                ) : (
                  <Bot className="w-4 h-4 animate-spin text-[#8B1417]" />
                )}
                <span className="font-bold">
                  {isGeminiEnabled && getGeminiApiKey() ? 'Google Gemini 1.5 Flash đang suy nghĩ...' : 'Đang tra cứu cơ sở dữ liệu 103 di tích...'}
                </span>
                <span className="flex gap-0.5">
                  <span className="w-1.5 h-1.5 bg-[#8B1417] rounded-full animate-pulse" />
                  <span className="w-1.5 h-1.5 bg-[#8B1417] rounded-full animate-pulse delay-75" />
                  <span className="w-1.5 h-1.5 bg-[#8B1417] rounded-full animate-pulse delay-150" />
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Context Prompt Chips */}
          <div className="px-3 py-2 bg-white border-t border-rose-100 overflow-x-auto whitespace-nowrap flex items-center gap-1.5 no-scrollbar">
            <span className="text-[10px] font-bold text-stone-400 shrink-0">Gợi ý:</span>
            {contextualSuggestions.map((chip, cIdx) => (
              <button
                key={cIdx}
                onClick={() => handleSendMessage(chip)}
                className="px-2.5 py-1 rounded-full bg-[#FAF4F0] hover:bg-rose-100 text-[#8B1417] text-[10px] font-bold border border-rose-200/60 shrink-0 transition-colors cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input & Send Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-2.5 sm:p-3 bg-[#FFFDFB] border-t border-rose-200 flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Nhập câu hỏi về di tích, lịch sử, nhân vật..."
              className="flex-1 py-2.5 px-3.5 text-xs sm:text-sm text-[#2A1214] placeholder-stone-400 bg-[#FAF4F0] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8B1417] transition-all font-medium border border-rose-200"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className={`p-2.5 sm:px-4 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                inputMessage.trim()
                  ? 'bg-gradient-to-r from-[#8B1417] to-[#B31D21] text-white shadow-md hover:scale-103'
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Gửi</span>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
