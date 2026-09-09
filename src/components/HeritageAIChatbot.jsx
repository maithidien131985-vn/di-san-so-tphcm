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
  ArrowRight
} from 'lucide-react';
import { allMonumentsList } from '../data/allMonumentsData';

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
      text: `Xin chào! Tôi là **Trợ Lý Di Sản AI** của hệ thống Số hóa 103 Di Tích TP.HCM & Vùng phụ cận. 🏛️\n\nTôi có thể giải đáp chi tiết về **lịch sử, kiến trúc, nhân vật, hiện vật, hồ sơ điều tra và 6 môn học** của toàn bộ 103 di tích. Bạn muốn tìm hiểu điều gì hôm nay?`,
      timestamp: new Date(),
      suggestions: [
        'Giới thiệu tổng quan về 103 di tích',
        'Có những di tích Quốc gia đặc biệt nào?',
        'Kể tên các di tích về Chủ tịch Hồ Chí Minh',
        'Tìm các di tích ở Cần Giờ và Côn Đảo'
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
        `Hiện vật tiêu biểu tại di tích này`,
        `Điều tra: ${currentMonument.investigation?.investigationQuestion || 'Giá trị lịch sử cốt lõi'}`,
        `Gợi ý các di tích lân cận gần đây`
      ];
    }
    return [
      'Top 5 di tích lịch sử nổi tiếng nhất TP.HCM',
      'Kể về Chiến khu Rừng Sác và Địa đạo Củ Chi',
      'Những ngôi chùa và hội quán cổ kính ở Chợ Lớn',
      'Di tích nào phù hợp để làm dự án KHKT?',
      'Di tích Bến Lộc An và đường Hồ Chí Minh trên biển'
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
  // LOCAL KNOWLEDGE BASE & HIGH-PRECISION INFERENCE ENGINE
  // =========================================================================
  const extractBriefOverview = (overview, maxLen = 190) => {
    if (!overview) return 'Di tích lịch sử - văn hóa tiêu biểu.';
    const sentences = overview.split(/(?<=[.!?])\s+/);
    let brief = sentences[0] || '';
    if (sentences.length > 1 && (brief + ' ' + sentences[1]).length <= maxLen) {
      brief += ' ' + sentences[1];
    }
    if (brief.length > maxLen) {
      brief = brief.slice(0, maxLen - 3) + '...';
    }
    return brief;
  };

  const formatMonumentResponse = (m) => {
    let resp = `### 🏛️ ${m.info.name} (#STT ${m.stt})\n\n`;
    resp += `- 📍 **Địa chỉ:** ${m.info.address}\n`;
    resp += `- ⭐ **Xếp hạng:** ${m.info.badge || m.info.ranking || 'Di tích Lịch sử'}\n`;
    
    if (m.info.type) {
      resp += `- 🏷️ **Loại hình:** ${m.info.type}\n`;
    }
    
    resp += `\n💡 **Giá trị lịch sử cốt lõi:**\n${extractBriefOverview(m.info.overview, 220)}\n\n`;

    if (m.keyHighlights) {
      resp += `🔍 **Điểm nhấn nổi bật:**\n`;
      if (m.keyHighlights.figures?.details) {
        resp += `- 👤 **Nhân vật:** ${m.keyHighlights.figures.details}\n`;
      }
      if (m.keyHighlights.artifacts?.details) {
        resp += `- 🏺 **Hiện vật:** ${m.keyHighlights.artifacts.details.replace(/\n/g, ' ')}\n`;
      }
    }

    if (m.investigation?.investigationQuestion) {
      resp += `\n🔭 **Gợi ý học tập & điều tra:**\n*${m.investigation.investigationQuestion}*`;
    }

    return {
      text: resp.trim(),
      relatedMonuments: [m]
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
        text: `Xin chào! Tôi là **Trợ Lý Di Sản AI** 🏛️✨\n\nTôi hỗ trợ bạn tra cứu toàn diện về **103 Di tích Lịch sử - Văn hóa TP.HCM & Vùng phụ cận**:\n\n- 🔍 **Tra cứu nhanh:** Theo tên di tích, số STT (#1 - #103) hoặc địa chỉ Quận/Huyện.\n- 📜 **Lịch sử & Kiến trúc:** Tóm tắt ngắn gọn bối cảnh, niên đại và phong cách xây dựng.\n- 👤 **Nhân vật & Hiện vật:** Bác Hồ, Trần Phú, Võ Thị Sáu, xe tăng 390/843, hầm vũ khí...\n- 📚 **Học tập 6 môn:** Lịch sử, Địa lý, Ngữ văn, GDCD, STEM và câu hỏi điều tra.\n\n*Bạn hãy nhập tên di tích hoặc câu hỏi cần giải đáp nhé!*`,
        relatedMonuments: [allMonumentsList[0], allMonumentsList[1], allMonumentsList[3]]
      };
    }

    // 2. CONTEXT-AWARE: CURRENT MONUMENT IN DETAIL VIEW
    if (viewMode === 'detail' && currentMonument && (
      cleanQ.includes('di tich nay') || cleanQ.includes('o day') || cleanQ.includes('noi nay') || 
      cleanQ.includes('tom tat') || cleanQ.includes('hien vat') || cleanQ.includes('nhan vat') || 
      cleanQ.includes('dieu tra') || cleanQ.includes('dia chi') || cleanQ.includes('mon hoc')
    )) {
      const m = currentMonument;
      if (cleanQ.includes('dia chi') || cleanQ.includes('o dau')) {
        return {
          text: `### 📍 Địa chỉ ${m.info.name}\n\n- **Địa chỉ:** ${m.info.address}\n- **Xếp hạng:** ${m.info.ranking || 'Di tích Lịch sử'}\n- **Số thứ tự:** STT #${m.stt}`,
          relatedMonuments: [m]
        };
      }
      if (cleanQ.includes('hien vat') && m.keyHighlights?.artifacts) {
        return {
          text: `### 🏺 Hiện Vật Tiêu Biểu: ${m.info.name}\n\n${m.keyHighlights.artifacts.details || 'Các hiện vật nguyên bản được bảo tồn trang nghiêm tại di tích.'}`,
          relatedMonuments: [m]
        };
      }
      if (cleanQ.includes('nhan vat') && m.keyHighlights?.figures) {
        return {
          text: `### 👤 Nhân Vật Lịch Sử Gắn Liền: ${m.info.name}\n\n${m.keyHighlights.figures.details || 'Gắn liền với các chứng nhân và anh hùng lịch sử.'}`,
          relatedMonuments: [m]
        };
      }
      if (cleanQ.includes('dieu tra') && m.investigation?.investigationQuestion) {
        return {
          text: `### 🔬 Hồ Sơ Điều Tra Lịch Sử: ${m.info.name}\n\n> 🔭 **Câu hỏi điều tra:** *${m.investigation.investigationQuestion}*\n\n💡 **Gợi ý giải đáp:**\n${m.investigation.suggestedAnswer || extractBriefOverview(m.info.overview, 200)}`,
          relatedMonuments: [m]
        };
      }
      return formatMonumentResponse(m);
    }

    // 3. DIRECT STT / ID LOOKUP (e.g. "stt 18", "di tích 14", "#1", "số 5")
    const sttMatch = cleanQ.match(/(?:stt|so|di tich|#)\s*([0-9]{1,3})/i) || cleanQ.match(/^([0-9]{1,3})$/);
    if (sttMatch) {
      const targetStt = parseInt(sttMatch[1], 10);
      const m = allMonumentsList.find(item => item.stt === targetStt);
      if (m) {
        return formatMonumentResponse(m);
      }
    }

    // 4. HISTORICAL FIGURES (Bác Hồ, Võ Thị Sáu, Trần Phú, Tôn Đức Thắng, Ngô Viết Thụ, v.v.)
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
        keys: ['ton duc thang', 'ba son', 'chu tich ton duc thang'],
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
        stts: [39, 30],
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

    // 5. ARCHAEOLOGICAL SITES ("Khảo cổ học")
    if (cleanQ.includes('khao co') || cleanQ.includes('tien su') || cleanQ.includes('mo chum') || cleanQ.includes('gom co') || cleanQ.includes('oc eo') || cleanQ.includes('dong nai')) {
      const archStts = [21, 22, 23, 24]; // Cù Lao Rùa, Dốc Chùa, Giồng Cá Vồ, Lò gốm Hưng Lợi
      const matches = allMonumentsList.filter(m => archStts.includes(m.stt));
      let resp = `Hệ thống ghi nhận **${matches.length} Di tích Khảo cổ học** quý giá phản ánh nền văn minh tiền sử và sơ sử tại Nam Bộ:\n\n`;
      matches.forEach((m, idx) => {
        resp += `${idx + 1}. **${m.info.name}** (#STT ${m.stt})\n   - 📍 ${m.info.address}\n   - 🏺 *Giá trị:* ${extractBriefOverview(m.info.overview, 140)}\n\n`;
      });
      return {
        text: resp.trim(),
        relatedMonuments: matches
      };
    }

    // 6. SPECIAL NATIONAL MONUMENTS ("Quốc gia đặc biệt")
    if ((cleanQ.includes('quoc gia dac biet') || cleanQ.includes('dac biet')) && !cleanQ.includes('cu chi') && !cleanQ.includes('dinh doc lap')) {
      const specials = allMonumentsList.filter(m => removeAccents(m.info.ranking || '').includes('dac biet'));
      let resp = `Hiện hệ thống có **${specials.length} Di tích Quốc gia Đặc biệt** tiêu biểu:\n\n`;
      specials.forEach((m, idx) => {
        resp += `${idx + 1}. **${m.info.name}** (#STT ${m.stt})\n   - 📍 *Địa chỉ:* ${m.info.address}\n   - ⭐ *Ý nghĩa:* ${extractBriefOverview(m.info.overview, 130)}\n\n`;
      });
      return {
        text: resp.trim(),
        relatedMonuments: specials.slice(0, 4)
      };
    }

    // 7. STATISTICAL & AGGREGATE SUMMARY
    if (cleanQ.includes('bao nhieu di tich') || cleanQ.includes('tong so di tich') || cleanQ.includes('tat ca di tich') || cleanQ.includes('thong ke di tich')) {
      const specialRankings = allMonumentsList.filter(m => removeAccents(m.info.ranking || '').includes('dac biet')).length;
      const nationalRankings = allMonumentsList.filter(m => removeAccents(m.info.ranking || '').includes('quoc gia') && !removeAccents(m.info.ranking || '').includes('dac biet')).length;
      const cityRankings = allMonumentsList.filter(m => removeAccents(m.info.ranking || '').includes('thanh pho') || removeAccents(m.info.ranking || '').includes('tinh')).length;

      return {
        text: `Hệ thống Di Sản Số đang số hóa đầy đủ **${allMonumentsList.length} Di tích Lịch sử - Văn hóa**:\n\n` +
          `- ⭐ **${specialRankings} Di tích Quốc gia Đặc biệt:** Dinh Độc Lập, Địa đạo Củ Chi, Côn Đảo, Rừng Sác, Đường HCM trên biển (Bến Lộc An)...\n` +
          `- 🏛️ **${nationalRankings} Di tích cấp Quốc gia**\n` +
          `- 🏮 **${cityRankings} Di tích cấp Thành phố / Tỉnh**\n\n` +
          `💡 *Phân loại theo lĩnh vực:* Di tích Lịch sử cách mạng, Kiến trúc nghệ thuật cổ truyền/Pháp thuộc, và Di tích Khảo cổ học tiền sử.`,
        relatedMonuments: allMonumentsList.slice(0, 4)
      };
    }

    // 8. REGIONAL & DISTRICT FILTER
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

    // 9. INTERDISCIPLINARY & 6 SUBJECTS / KHKT
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

    // 10. HIGH-ACCURACY MONUMENT SEARCH (WEIGHTED MULTI-FACTOR)
    let bestMatch = null;
    let highestScore = 0;
    const scoredList = [];

    const isAddressQuery = /o dau|dia chi|toa do|vi tri|nam o/i.test(cleanQ);
    const isArtifactQuery = /hien vat|vu khi|trung bay|xe tang|sung|sung phao|xe jeep/i.test(cleanQ);
    const isInvestigationQuery = /dieu tra|cau hoi|nghien cuu/i.test(cleanQ);

    allMonumentsList.forEach(m => {
      let score = 0;
      const mNameClean = removeAccents(m.info.name);
      const mSlug = m.slug || '';
      const mOverviewClean = removeAccents(m.info.overview);
      const mAddrClean = removeAccents(m.info.address);

      // Exact name match
      if (mNameClean === cleanQ) score += 150;
      else if (mNameClean.includes(cleanQ)) score += 70;
      else if (cleanQ.includes(mNameClean)) score += 60;

      // Slug match
      if (mSlug.includes(cleanQ)) score += 40;

      // Tokenized word matching with stopword filtering
      const stopWords = ['di', 'tich', 'tai', 'la', 'gi', 'o', 'dau', 'nhu', 'the', 'nao', 'cho', 'toi', 'biet', 've', 'thong', 'tin', 'tp', 'hcm', 'thanh', 'pho', 'co', 'dac', 'biet'];
      const queryWords = cleanQ.split(/\s+/).filter(w => w.length > 1 && !stopWords.includes(w));

      let matchedWordCount = 0;
      queryWords.forEach(w => {
        if (mNameClean.includes(w)) {
          score += 25;
          matchedWordCount++;
        }
        if (mAddrClean.includes(w)) score += 10;
        if (mOverviewClean.includes(w)) score += 5;
        if (m.keyHighlights?.figures?.details && removeAccents(m.keyHighlights.figures.details).includes(w)) score += 15;
        if (m.keyHighlights?.artifacts?.details && removeAccents(m.keyHighlights.artifacts.details).includes(w)) score += 15;
      });

      if (queryWords.length > 0 && matchedWordCount === queryWords.length) {
        score += 40;
      }

      if (score > 0) {
        scoredList.push({ monument: m, score });
      }

      if (score > highestScore) {
        highestScore = score;
        bestMatch = m;
      }
    });

    if (bestMatch && highestScore >= 30) {
      const m = bestMatch;

      // Specific: Address
      if (isAddressQuery) {
        return {
          text: `### 📍 Địa chỉ ${m.info.name}\n\n` +
            `- **Địa chỉ:** ${m.info.address}\n` +
            `- **Xếp hạng:** ${m.info.ranking || 'Di tích Lịch sử'}\n` +
            `- **Số thứ tự:** STT #${m.stt}\n\n` +
            `💡 *Tóm lược:* ${extractBriefOverview(m.info.overview, 140)}`,
          relatedMonuments: [m]
        };
      }

      // Specific: Artifacts
      if (isArtifactQuery && m.keyHighlights?.artifacts) {
        return {
          text: `### 🏺 Hiện Vật Tiêu Biểu: ${m.info.name} (#STT ${m.stt})\n\n` +
            `**${m.keyHighlights.artifacts.title || 'Hiện vật di sản'}:**\n` +
            `${m.keyHighlights.artifacts.details || 'Các hiện vật, vũ khí và tư liệu lịch sử được bảo tồn nguyên vẹn tại di tích.'}\n\n` +
            `📍 *Địa chỉ:* ${m.info.address}`,
          relatedMonuments: [m]
        };
      }

      // Specific: Investigation
      if (isInvestigationQuery && m.investigation?.investigationQuestion) {
        return {
          text: `### 🔬 Hồ Sơ Điều Tra Lịch Sử: ${m.info.name} (#STT ${m.stt})\n\n` +
            `> 🔭 **Câu hỏi điều tra:** *${m.investigation.investigationQuestion}*\n\n` +
            `💡 **Gợi ý giải đáp:**\n${m.investigation.suggestedAnswer || m.info.overview.slice(0, 180) + '...'}\n\n` +
            `📍 *Địa chỉ:* ${m.info.address}`,
          relatedMonuments: [m]
        };
      }

      // Standard concise overview
      return formatMonumentResponse(m);
    }

    // 11. CLEAN FALLBACK
    return {
      text: `Tôi chưa tìm thấy thông tin khớp hoàn toàn với câu hỏi *"**${rawQ}**"*. \n\n` +
        `💡 **Gợi ý cách hỏi hiệu quả:**\n` +
        `- Hỏi theo tên di tích: *"Dinh Độc Lập", "Địa đạo Củ Chi", "Chùa Giác Lâm"*\n` +
        `- Hỏi theo số thứ tự: *"STT 1", "Di tích 18", "STT 14"*\n` +
        `- Hỏi theo địa bàn: *"Di tích ở Cần Giờ", "Di tích ở Quận 5", "Di tích ở Côn Đảo"*\n` +
        `- Hỏi theo nhân vật: *"Võ Thị Sáu", "Bác Hồ", "Trần Phú", "Ngô Viết Thụ"*`,
      relatedMonuments: allMonumentsList.slice(0, 3)
    };
  };

  // Helper to parse and format inline markdown (**bold**, *italic*)
  const formatInlineText = (text) => {
    if (!text) return null;
    const parts = [];
    const regex = /(\*\*.*?\*\*|\*.*?\*)/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      const token = match[0];
      if (token.startsWith('**') && token.endsWith('**')) {
        parts.push(
          <strong key={match.index} className="font-bold text-[#8B1417]">
            {token.slice(2, -2)}
          </strong>
        );
      } else if (token.startsWith('*') && token.endsWith('*')) {
        parts.push(
          <em key={match.index} className="italic text-stone-700">
            {token.slice(1, -1)}
          </em>
        );
      }
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  // Handle Send Message (Instant response)
  const handleSendMessage = (textToSend) => {
    const query = textToSend || inputMessage;
    if (!query.trim()) return;

    // Add user message
    const userMsg = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: query.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsThinking(true);

    // Instant local inference with ultra-fast responsiveness (< 50ms)
    setTimeout(() => {
      const result = processAIQuery(query);
      const aiMsg = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: result.text,
        relatedMonuments: result.relatedMonuments || [],
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsThinking(false);
    }, 40);
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
              : 'bottom-24 sm:bottom-20 right-2 sm:right-6 w-[calc(100vw-16px)] sm:w-[420px] md:w-[450px] h-[560px] sm:h-[620px] max-h-[85vh] rounded-3xl'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#8B1417] via-[#9B1C1E] to-[#B31D21] text-white p-3.5 sm:p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white/15 border border-amber-300/40 flex items-center justify-center text-amber-200 shadow-inner">
                <Bot className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-serif-title font-black text-xs sm:text-sm uppercase tracking-wide text-white">
                    TRỢ LÝ DI SẢN AI
                  </h3>
                  <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-[#8B1417] text-[9px] font-black uppercase">
                    103 Di Tích
                  </span>
                </div>
                <p className="text-[10px] text-rose-100/90 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Sẵn sàng giải đáp lịch sử, tư liệu &amp; bài học</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-white/80">
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

          {/* Context Banner (If looking at specific monument) */}
          {viewMode === 'detail' && currentMonument && (
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
                    <div className="flex items-center justify-between pt-1 text-[11px] text-stone-400">
                      <span className="text-[9px]">Trợ lý Di Sản AI</span>
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
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-white border border-rose-200 w-fit text-xs text-[#8B1417]">
                <Bot className="w-4 h-4 animate-spin text-[#8B1417]" />
                <span className="font-bold">Đang tra cứu cơ sở dữ liệu 103 di tích...</span>
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
