import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  MessageSquare, 
  Bot, 
  Sparkles, 
  Send, 
  X, 
  Minimize2, 
  Maximize2, 
  Volume2, 
  VolumeX, 
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
import { speakVietnamese, stopVietnameseSpeech } from '../utils/vietnameseVoice';

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
  const [speakingMsgIndex, setSpeakingMsgIndex] = useState(null);
  const [hasUnread, setHasUnread] = useState(true);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      stopVietnameseSpeech();
    };
  }, []);

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
  // LOCAL KNOWLEDGE BASE & AI INFERENCE ENGINE
  // =========================================================================
  const removeAccents = (str) => {
    if (!str) return '';
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .toLowerCase();
  };

  const processAIQuery = (query) => {
    const rawQ = query.trim();
    const cleanQ = removeAccents(rawQ);

    // 1. GREETINGS & INTRO
    if (/^(chao|hello|hi|xin chao|ban la ai|gioi thieu ban|tro ly la ai)/i.test(cleanQ)) {
      return {
        text: `Chào bạn! Tôi là **Trợ Lý Trí Tuệ Nhân Tạo Di Sản TP.HCM** 🏛️✨\n\nTôi được huấn luyện từ cơ sở dữ liệu chuyên sâu về **103 Di tích Lịch sử - Văn hóa** của TP. Hồ Chí Minh, Bà Rịa - Vũng Tàu và Bình Dương.\n\nBạn có thể hỏi tôi về:\n- 📜 **Lịch sử & kiến trúc** của bất kỳ di tích nào.\n- 👤 **Nhân vật & hiện vật** tiêu biểu.\n- 🔬 **Câu hỏi điều tra lịch sử & 6 môn học** (Lịch sử, Địa lý, Văn học, STEM...).\n- 🗺️ **Địa chỉ, tọa độ và tuyến tham quan** theo khu vực.`,
        relatedMonuments: [allMonumentsList[0], allMonumentsList[1], allMonumentsList[2]]
      };
    }

    // 2. QUERY ABOUT CURRENT MONUMENT (IF IN DETAIL MODE)
    if (viewMode === 'detail' && currentMonument && (
      cleanQ.includes('di tich nay') || cleanQ.includes('o day') || cleanQ.includes('noi nay') || cleanQ.includes('tom tat') || cleanQ.includes('hien vat') || cleanQ.includes('nhan vat') || cleanQ.includes('dieu tra')
    )) {
      const m = currentMonument;
      let resp = `### 🏛️ ${m.info.name}\n\n`;
      resp += `📍 **Địa chỉ:** ${m.info.address}\n`;
      resp += `⭐ **Xếp hạng:** ${m.info.ranking || 'Di tích Quốc gia'}\n\n`;
      resp += `**Tóm tắt giá trị:**\n${m.info.overview}\n\n`;
      
      if (cleanQ.includes('hien vat') || cleanQ.includes('nhan vat') || cleanQ.includes('su kien')) {
        if (m.keyHighlights) {
          resp += `**Điểm nhấn tiêu biểu:**\n`;
          if (m.keyHighlights.figures) resp += `- 👤 **Nhân vật:** ${m.keyHighlights.figures.title || m.keyHighlights.figures.name || 'Gắn liền với các anh hùng, chỉ huy và nhân dân thời kỳ đấu tranh'}\n`;
          if (m.keyHighlights.artifacts) resp += `- 🏺 **Hiện vật:** ${m.keyHighlights.artifacts.title || m.keyHighlights.artifacts.name || 'Hệ thống hiện vật, vũ khí, tài liệu lưu giữ nguyên bản'}\n`;
          if (m.keyHighlights.events) resp += `- ⚔️ **Sự kiện:** ${m.keyHighlights.events.title || m.keyHighlights.events.name || 'Dấu mốc lịch sử quan trọng trong tiến trình dựng nước và giữ nước'}\n`;
        }
      }

      if (m.investigation?.investigationQuestion) {
        resp += `\n**Hồ sơ điều tra gợi mở:**\n> 🔭 *${m.investigation.investigationQuestion}*`;
      }

      return {
        text: resp,
        relatedMonuments: [m]
      };
    }

    // 3. STATISTICAL & AGGREGATE QUERIES
    if (cleanQ.includes('bao nhieu di tich') || cleanQ.includes('tong so di tich') || cleanQ.includes('tat ca di tich')) {
      const specialRankings = allMonumentsList.filter(m => m.info.ranking.toLowerCase().includes('dac biet')).length;
      const nationalRankings = allMonumentsList.filter(m => m.info.ranking.toLowerCase().includes('quoc gia') && !m.info.ranking.toLowerCase().includes('dac biet')).length;
      const cityRankings = allMonumentsList.filter(m => m.info.ranking.toLowerCase().includes('thanh pho') || m.info.ranking.toLowerCase().includes('tinh')).length;

      return {
        text: `Hệ thống Di Sản Số hiện đang lưu trữ và số hóa toàn diện **${allMonumentsList.length} Di tích Lịch sử - Văn hóa** tiêu biểu:\n\n` +
          `- ⭐ **${specialRankings} Di tích Quốc gia Đặc biệt** (Dinh Độc Lập, Địa đạo Củ Chi, Côn Đảo, Rừng Sác, Bến Lộc An...)\n` +
          `- 🏛️ **${nationalRankings} Di tích cấp Quốc gia**\n` +
          `- 🏮 **${cityRankings} Di tích cấp Thành phố / Tỉnh**\n\n` +
          `Các di tích trải dài khắp 21 quận huyện TP.HCM, TP. Thủ Đức và các địa bàn lịch sử liên kết như Côn Đảo, Bà Rịa - Vũng Tàu, Bình Dương.`,
        relatedMonuments: allMonumentsList.slice(0, 4)
      };
    }

    // 4. SPECIAL RANKINGS (QUỐC GIA ĐẶC BIỆT)
    if (cleanQ.includes('dac biet') || cleanQ.includes('quoc gia dac biet')) {
      const specials = allMonumentsList.filter(m => m.info.ranking.toLowerCase().includes('dac biet'));
      let resp = `Hiện nay có **${specials.length} Di tích Quốc gia Đặc biệt** nổi bật trong hệ thống:\n\n`;
      specials.forEach((m, idx) => {
        resp += `${idx + 1}. **${m.info.name}**\n   - *Địa chỉ:* ${m.info.address}\n   - *Đặc điểm:* ${m.info.overview.slice(0, 110)}...\n\n`;
      });
      return {
        text: resp,
        relatedMonuments: specials.slice(0, 4)
      };
    }

    // 5. REGIONAL QUERIES (Cần Giờ, Củ Chi, Quận 1, Chợ Lớn, Côn Đảo, Bình Dương, Vũng Tàu...)
    const regions = [
      { key: 'can gio', name: 'Cần Giờ', filter: m => m.info.address.toLowerCase().includes('cần giờ') || m.stt === 7 || m.stt === 83 },
      { key: 'cu chi', name: 'Củ Chi', filter: m => m.info.address.toLowerCase().includes('củ chi') || m.stt === 2 },
      { key: 'quan 1', name: 'Quận 1', filter: m => m.info.address.toLowerCase().includes('quận 1') || m.stt === 1 },
      { key: 'quan 5', name: 'Quận 5 / Chợ Lớn', filter: m => m.info.address.toLowerCase().includes('quận 5') || m.info.name.includes('Hội quán') },
      { key: 'con dao', name: 'Côn Đảo', filter: m => m.info.address.toLowerCase().includes('côn đảo') || m.stt === 4 },
      { key: 'vung tau', name: 'Bà Rịa - Vũng Tàu', filter: m => m.info.address.toLowerCase().includes('vũng tàu') || m.info.address.toLowerCase().includes('bà rịa') || (m.stt >= 56 && m.stt <= 81) },
      { key: 'binh duong', name: 'Bình Dương', filter: m => m.info.address.toLowerCase().includes('bình dương') || m.stt === 8 || (m.stt >= 60 && m.stt <= 64) }
    ];

    for (const r of regions) {
      if (cleanQ.includes(r.key)) {
        const matches = allMonumentsList.filter(r.filter);
        let resp = `Tại khu vực **${r.name}**, hệ thống có **${matches.length} di tích** tiêu biểu:\n\n`;
        matches.slice(0, 5).forEach((m, idx) => {
          resp += `${idx + 1}. **${m.info.name}** (#${m.stt})\n   - 📍 ${m.info.address}\n   - 💡 ${m.info.overview.slice(0, 100)}...\n\n`;
        });
        if (matches.length > 5) {
          resp += `*Và còn ${matches.length - 5} di tích khác trong khu vực này.*`;
        }
        return {
          text: resp,
          relatedMonuments: matches.slice(0, 4)
        };
      }
    }

    // 6. HISTORICAL FIGURES (Bác Hồ, Võ Thị Sáu, Trần Phú, Lê Văn Duyệt, Ngô Viết Thụ, Bùi Quang Thận...)
    const figures = [
      { key: 'ho chi minh', name: 'Chủ tịch Hồ Chí Minh (Nguyễn Tất Thành)', stts: [11, 3, 1, 97] },
      { key: 'nguyen tat thanh', name: 'Nguyễn Tất Thành (Bác Hồ)', stts: [11] },
      { key: 'vo thi sau', name: 'Nữ anh hùng Võ Thị Sáu', stts: [4, 76] },
      { key: 'tran phu', name: 'Tổng Bí thư Trần Phú', stts: [9] },
      { key: 'le van duyet', name: 'Tả quân Lê Văn Duyệt', stts: [85] },
      { key: 'ngo viet thu', name: 'Kiến trúc sư Ngô Viết Thụ', stts: [1] },
      { key: 'bui quang than', name: 'Đại đội trưởng Bùi Quang Thận (Xe tăng 843)', stts: [1] },
      { key: 'vu van thao', name: 'Trung úy Vũ Đăng Toàn (Xe tăng 390)', stts: [1] },
      { key: 'phan chau trinh', name: 'Chí sĩ Phan Châu Trinh', stts: [84] }
    ];

    for (const fig of figures) {
      if (cleanQ.includes(fig.key)) {
        const matches = allMonumentsList.filter(m => fig.stts.includes(m.stt));
        let resp = `Về nhân vật lịch sử **${fig.name}**:\n\n`;
        if (fig.key.includes('ho chi minh') || fig.key.includes('nguyen tat thanh')) {
          resp += `Người thanh niên yêu nước Nguyễn Tất Thành đã ở tại căn nhà số 5 Châu Văn Liêm (Quận 5) trước khi đến Bến Nhà Rồng ngày 5/6/1911 để ra đi tìm đường cứu nước. Tên Người cũng gắn liền với Chiến dịch Hồ Chí Minh lịch sử năm 1975 và Đường Hồ Chí Minh trên biển huyền thoại.\n\n`;
        } else if (fig.key.includes('vo thi sau')) {
          resp += `Chị Võ Thị Sáu (1933–1952) là người nữ tử tù đầu tiên và duy nhất tại Côn Đảo thời Pháp. Chị kiên cường bất khuất trước họng súng quân thù tại Hàng Dương, Côn Đảo. Nhà lưu niệm của chị hiện tọa lạc tại Đất Đỏ (Bà Rịa - Vũng Tàu).\n\n`;
        } else if (fig.key.includes('tran phu')) {
          resp += `Đồng chí Trần Phú - Tổng Bí thư đầu tiên của Đảng Cộng sản Việt Nam đã hy sinh anh dũng tại Nhà thương Chợ Quán (nay là Bệnh viện Bệnh Nhiệt Đới TP.HCM) năm 1931 với câu nói bất hủ: *"Hãy giữ vững chí khí chiến đấu!"*.\n\n`;
        }
        resp += `**Các di tích trực tiếp gắn liền:**\n`;
        matches.forEach((m, idx) => {
          resp += `${idx + 1}. **${m.info.name}** (#${m.stt}) - 📍 ${m.info.address}\n`;
        });
        return {
          text: resp,
          relatedMonuments: matches
        };
      }
    }

    // 7. MULTI-FACTOR MONUMENT FUZZY SEARCH
    let bestMatch = null;
    let highestScore = 0;
    const scoredList = [];

    allMonumentsList.forEach(m => {
      let score = 0;
      const mNameClean = removeAccents(m.info.name);
      const mOverviewClean = removeAccents(m.info.overview);
      const mAddrClean = removeAccents(m.info.address);

      // Name direct match
      if (mNameClean === cleanQ) score += 100;
      else if (mNameClean.includes(cleanQ)) score += 50;
      else if (cleanQ.includes(mNameClean)) score += 40;

      // Word-level matching
      const words = cleanQ.split(/\s+/).filter(w => w.length > 2);
      words.forEach(w => {
        if (mNameClean.includes(w)) score += 15;
        if (mOverviewClean.includes(w)) score += 8;
        if (mAddrClean.includes(w)) score += 6;
        if (m.keyHighlights?.figures?.title?.toLowerCase().includes(w)) score += 12;
        if (m.keyHighlights?.artifacts?.title?.toLowerCase().includes(w)) score += 12;
      });

      if (score > 0) {
        scoredList.push({ monument: m, score });
      }

      if (score > highestScore) {
        highestScore = score;
        bestMatch = m;
      }
    });

    if (bestMatch && highestScore >= 20) {
      const m = bestMatch;
      let resp = `### 🏛️ ${m.info.name} (#STT ${m.stt})\n\n`;
      resp += `📍 **Địa chỉ:** ${m.info.address}\n`;
      resp += `🏆 **Cấp xếp hạng:** ${m.info.badge || m.info.ranking}\n\n`;
      resp += `📖 **Tổng quan lịch sử:**\n${m.info.overview}\n\n`;

      if (m.keyHighlights) {
        resp += `🔍 **Thông tin cốt lõi:**\n`;
        if (m.keyHighlights.figures) {
          resp += `- 👤 **Nhân vật:** ${m.keyHighlights.figures.title || m.keyHighlights.figures.name || 'Gắn liền với các chứng nhân lịch sử'}\n`;
        }
        if (m.keyHighlights.artifacts) {
          resp += `- 🏺 **Hiện vật:** ${m.keyHighlights.artifacts.title || m.keyHighlights.artifacts.name || 'Hệ thống hiện vật và tài liệu lưu giữ nguyên bản'}\n`;
        }
        if (m.keyHighlights.events) {
          resp += `- 📅 **Sự kiện:** ${m.keyHighlights.events.title || m.keyHighlights.events.name || 'Các mốc thời gian đấu tranh kiên cường'}\n`;
        }
        resp += `\n`;
      }

      if (m.investigation?.investigationQuestion) {
        resp += `🔭 **Câu hỏi điều tra:** *${m.investigation.investigationQuestion}*\n`;
      }

      scoredList.sort((a, b) => b.score - a.score);
      const topRelated = scoredList.slice(0, 3).map(s => s.monument);

      return {
        text: resp,
        relatedMonuments: topRelated
      };
    }

    // 8. GENERAL INTENTIONAL FALLBACK RESPONSE
    return {
      text: `Cảm ơn bạn đã đặt câu hỏi! Về nội dung *"**${rawQ}**"*, hệ thống gợi ý bạn có thể khám phá thêm thông qua các di tích tiêu biểu sau đây hoặc thử tìm kiếm cụ thể theo **Tên di tích, Địa phương (Quận/Huyện) hoặc Nhân vật lịch sử**:\n\n` +
        `💡 *Mẹo:* Bạn có thể hỏi những câu như:\n` +
        `- *"Kể cho tôi nghe về lịch sử Địa đạo Củ Chi"*\n` +
        `- *"Dinh Độc Lập có những hiện vật nào?"*\n` +
        `- *"Các di tích kiến trúc Pháp cổ tại TP.HCM"*\n` +
        `- *"Di tích lịch sử nào ở Quận 5?"*`,
      relatedMonuments: allMonumentsList.slice(0, 3)
    };
  };

  // Handle Send Message
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

    // Simulate AI thinking and retrieve answer
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
    }, 450);
  };

  // Text-To-Speech Tiếng Việt Chuẩn Tự Nhiên
  const handleSpeak = (text, index) => {
    if (speakingMsgIndex === index) {
      stopVietnameseSpeech();
      setSpeakingMsgIndex(null);
      return;
    }

    setSpeakingMsgIndex(index);

    speakVietnamese(text, {
      rate: 1.0,
      onStart: () => setSpeakingMsgIndex(index),
      onEnd: () => setSpeakingMsgIndex(null),
      onError: () => setSpeakingMsgIndex(null),
      onNoVoice: () => setSpeakingMsgIndex(null)
    });
  };

  // Copy text to clipboard
  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Reset / Clear chat
  const handleReset = () => {
    stopVietnameseSpeech();
    setSpeakingMsgIndex(null);
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
                  className={`max-w-[88%] sm:max-w-[82%] rounded-2xl p-3 sm:p-3.5 text-xs sm:text-sm leading-relaxed shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-[#8B1417] to-[#A81B1F] text-white rounded-tr-xs'
                      : 'bg-white border border-rose-200 text-[#2A1214] rounded-tl-xs space-y-2'
                  }`}
                >
                  {/* Message content formatted */}
                  <div className="whitespace-pre-line">
                    {msg.text.split('\n').map((line, lIdx) => {
                      if (line.startsWith('### ')) {
                        return <h4 key={lIdx} className="font-serif-title font-black text-sm text-[#8B1417] pt-1">{line.replace('### ', '')}</h4>;
                      }
                      if (line.startsWith('- ')) {
                        return <div key={lIdx} className="pl-2 py-0.5">{line}</div>;
                      }
                      return <p key={lIdx} className={line === '' ? 'h-2' : ''}>{line}</p>;
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
                              <div className="w-7 h-7 rounded-lg overflow-hidden bg-rose-100 shrink-0">
                                <img src={rm.info.heroImage} alt={rm.info.name} className="w-full h-full object-cover" />
                              </div>
                              <div className="min-w-0">
                                <div className="text-[11px] font-bold text-[#8B1417] truncate group-hover:underline">
                                  #{rm.stt} {rm.info.name}
                                </div>
                                <div className="text-[9px] text-stone-500 truncate">{rm.info.address}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-0.5 text-[10px] font-bold text-[#8B1417] shrink-0">
                              <span>Xem</span>
                              <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* AI Message Action Buttons: Read Voice & Copy */}
                  {msg.sender === 'ai' && (
                    <div className="flex items-center justify-between pt-1 text-[11px] text-stone-400">
                      <span className="text-[9px]">Trợ lý Di Sản AI</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSpeak(msg.text, index)}
                          className={`cursor-pointer flex items-center gap-1 transition-colors ${
                            speakingMsgIndex === index ? 'text-[#8B1417] font-bold' : 'hover:text-[#8B1417]'
                          }`}
                          title="Đọc văn bản bằng tiếng Việt (vi-VN)"
                        >
                          {speakingMsgIndex === index ? (
                            <>
                              <VolumeX className="w-3.5 h-3.5 text-[#8B1417] animate-pulse" />
                              <span className="text-[10px] text-[#8B1417]">Dừng đọc</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3.5 h-3.5" />
                              <span className="text-[10px]">Đọc (vi-VN)</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleCopy(msg.text, index)}
                          className="hover:text-[#8B1417] cursor-pointer flex items-center gap-1 transition-colors"
                          title="Sao chép câu trả lời"
                        >
                          {copiedIndex === index ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          <span className="text-[10px]">{copiedIndex === index ? 'Đã chép' : 'Chép'}</span>
                        </button>
                      </div>
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
