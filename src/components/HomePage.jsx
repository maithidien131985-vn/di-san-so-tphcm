import React, { useState, useMemo } from 'react';
import WordByWordTitle from './WordByWordTitle';
import { 
  Compass, 
  MapPin, 
  Sparkles, 
  ArrowRight, 
  BookOpen, 
  Landmark, 
  Search, 
  Map as MapIcon, 
  ShieldCheck, 
  History, 
  Layers, 
  Award, 
  Users, 
  CheckCircle2,
  Calendar,
  Send,
  HelpCircle,
  FolderOpen,
  Trophy,
  Clock,
  Heart,
  Share2,
  Eye,
  Camera,
  Lightbulb,
  CheckSquare,
  UserCheck,
  Smile,
  ChevronRight,
  ExternalLink,
  Filter,
  Check,
  Flame,
  Star,
  Menu,
  X,
  Home,
  Grid,
  ClipboardCheck,
  FileText,
  ChevronDown
} from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import HomePageInteractiveMap from './HomePageInteractiveMap';
import { hcmcDistrictsData, allHcmcWardsList } from '../data/hcmcAdministrativeData';

export default function HomePage({ 
  allMonuments = [], 
  onSelectMonument, 
  onOpenExplorer, 
  onOpenMyMap,
  onOpenContribute,
  onOpenPassport,
  onOpenChatbot,
  activePassport,
  onNavigate
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [studentIdeaLikes, setStudentIdeaLikes] = useState({ 1: 128, 2: 94, 3: 73 });
  const [likedIdeas, setLikedIdeas] = useState({});

  // Location & Topic Recommendation State
  const [selectedWard, setSelectedWard] = useState('Phường Bến Thành, Quận 1');
  const [selectedDistrict, setSelectedDistrict] = useState('Quận 1');
  const [wardSearchTerm, setWardSearchTerm] = useState('');
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [topicDropdownOpen, setTopicDropdownOpen] = useState(false);
  const [surveyTopic, setSurveyTopic] = useState('military');

  // Filtered 168+ Wards grouped by District based on search term
  const filteredDistricts = useMemo(() => {
    if (!wardSearchTerm.trim()) return hcmcDistrictsData;
    const q = wardSearchTerm.toLowerCase().trim();
    return hcmcDistrictsData
      .map(d => ({
        ...d,
        wards: d.wards.filter(w => 
          w.toLowerCase().includes(q) || 
          d.name.toLowerCase().includes(q) ||
          d.zone.toLowerCase().includes(q)
        )
      }))
      .filter(d => d.wards.length > 0);
  }, [wardSearchTerm]);

  // Topic Options
  const topicOptions = [
    { id: 'all', name: 'Tất cả các chủ đề di tích', icon: '⭐', desc: 'Toàn bộ di tích lịch sử & văn hóa' },
    { id: 'military', name: 'Chiến tích Kháng chiến & Địa đạo ngầm', icon: '⚔️', desc: 'Dinh Độc Lập, Củ Chi, Rừng Sác, Côn Đảo, Hầm bí mật' },
    { id: 'architecture', name: 'Kiến trúc Pháp cổ & Bảo tàng nghệ thuật', icon: '🏛️', desc: 'Bảo tàng Lịch sử, Bạch Dinh, Tòa Án, Nhà Hát TP' },
    { id: 'spiritual', name: 'Cổ tự Phật giáo & Chạm khắc Hán Nôm', icon: '🛕', desc: 'Chùa Giác Lâm, Chùa Giác Viên, Chùa Hội Khánh' },
    { id: 'culture_commune', name: 'Đình làng Nam Bộ & Phong tục truyền thống', icon: '🏮', desc: 'Đình Thông Tây Hội, Lăng Lê Văn Duyệt, Đình Bình Đông' },
    { id: 'archaeology_craft', name: 'Khảo cổ học & Dấu tích làng nghề xưa', icon: '🏺', desc: 'Lò gốm Hưng Lợi, Mộ Cổ Giồng Cá Vồ, Làng nghề cổ' },
    { id: 'mangrove_nature', name: 'Căn cứ Rừng ngập mặn & Thiên nhiên', icon: '🌿', desc: 'Chiến khu Rừng Sác, Bến Lộc An, Chiến khu Đ' }
  ];

  // Dynamic Recommendation Engine matching 168 Wards & Topics
  const recommendedMonuments = useMemo(() => {
    if (!allMonuments || allMonuments.length === 0) return [];

    const scored = allMonuments.map(m => {
      let score = 0;
      const addr = (m.info.address || '').toLowerCase();
      const name = (m.info.name || '').toLowerCase();
      const type = (m.info.type || '').toLowerCase();
      const overview = (m.info.overview || '').toLowerCase();

      // 1. Precise Ward Matching
      const rawWardName = selectedWard ? selectedWard.split(',')[0].trim().toLowerCase().replace(/^(phường|xã|thị trấn)\s+/i, '') : '';
      if (rawWardName && addr.includes(rawWardName)) {
        score += 65;
      }

      // 2. District Matching
      const cleanDistrict = selectedDistrict ? selectedDistrict.toLowerCase().replace(/^(quận|huyện|thành phố|tp\.)\s+/i, '') : '';
      if (cleanDistrict && addr.includes(cleanDistrict)) {
        score += 45;
      }

      // 3. Topic Matching
      if (surveyTopic === 'all') {
        score += 30;
      } else if (surveyTopic === 'military') {
        if (type.includes('lịch sử') || overview.includes('kháng chiến') || overview.includes('địa đạo') || overview.includes('chiến dịch') || m.stt === 1 || m.stt === 2 || m.stt === 7 || m.stt === 4) score += 40;
      } else if (surveyTopic === 'architecture') {
        if (type.includes('kiến trúc') || name.includes('bảo tàng') || name.includes('dinh') || name.includes('bạch dinh') || m.stt === 56 || m.stt === 57 || m.stt === 58) score += 40;
      } else if (surveyTopic === 'spiritual') {
        if (name.includes('chùa') || name.includes('tịnh xá') || name.includes('tự') || overview.includes('phật giáo')) score += 40;
      } else if (surveyTopic === 'culture_commune') {
        if (name.includes('đình') || name.includes('miếu') || name.includes('lăng') || overview.includes('thành hoàng')) score += 40;
      } else if (surveyTopic === 'archaeology_craft') {
        if (type.includes('khảo cổ') || name.includes('gốm') || name.includes('mộ') || name.includes('lò')) score += 45;
      } else if (surveyTopic === 'mangrove_nature') {
        if (m.stt === 7 || m.stt === 3 || m.stt === 8 || overview.includes('rừng') || overview.includes('sông')) score += 45;
      }

      return { monument: m, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 4).map(s => s.monument);
  }, [allMonuments, selectedWard, selectedDistrict, surveyTopic]);

  // Helper to normalize Vietnamese text
  const normalizeVn = (s) => {
    if (!s) return '';
    return s.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd');
  };

  // Smart Search Results with Multi-criteria Relevance Scoring
  const searchScoredList = useMemo(() => {
    const raw = searchTerm.trim();
    if (!raw || !allMonuments || allMonuments.length === 0) return [];
    
    const qNorm = normalizeVn(raw);
    const qWords = qNorm.split(/\s+/).filter(w => w.length > 0);

    const scored = allMonuments.map(m => {
      let score = 0;
      const name = m.info?.name || '';
      const nameNorm = normalizeVn(name);
      const addrNorm = normalizeVn(m.info?.address || '');
      const typeNorm = normalizeVn(m.info?.type || '');
      const overviewNorm = normalizeVn(m.info?.overview || '');
      const sttStr = String(m.stt);

      // Exact STT match
      if (qNorm === sttStr || qNorm === `#${sttStr}`) {
        return { monument: m, score: 300 };
      }

      // Tier 1: Exact Name Match
      if (nameNorm === qNorm) {
        score += 250;
      } else if (nameNorm.includes(qNorm)) {
        score += 120;
        if (nameNorm.startsWith(qNorm)) score += 40;
      }

      let matchedNameWords = 0;
      qWords.forEach(w => {
        if (nameNorm.includes(w)) {
          score += 25;
          matchedNameWords++;
        }
        if (addrNorm.includes(w)) score += 12;
        if (typeNorm.includes(w)) score += 8;
        if (overviewNorm.includes(w)) score += 4;
      });

      // Bonus if all query words appear in the monument's name
      if (qWords.length > 1 && matchedNameWords === qWords.length) {
        score += 60;
      }

      return { monument: m, score };
    }).filter(item => item.score > 0);

    scored.sort((a, b) => b.score - a.score);
    return scored;
  }, [searchTerm, allMonuments]);

  const searchResults = useMemo(() => {
    return searchScoredList.slice(0, 8).map(s => s.monument);
  }, [searchScoredList]);

  // Smart Search Scoring & Best Match Linking
  const handlePerformSearch = (explicitTerm) => {
    const rawQuery = (explicitTerm !== undefined ? explicitTerm : searchTerm).trim();
    if (!rawQuery) {
      onOpenExplorer();
      return;
    }

    if (searchScoredList.length === 0) {
      onOpenExplorer('all', rawQuery);
      return;
    }

    const topMatch = searchScoredList[0];
    const secondMatch = searchScoredList.length > 1 ? searchScoredList[1] : null;

    // If there is an exact or standout best match (e.g. single result or top score much higher)
    if (!secondMatch || topMatch.score >= 200 || (topMatch.score - secondMatch.score >= 50)) {
      onSelectMonument(topMatch.monument.stt);
      setSearchTerm('');
    } else {
      // Broad category search with multiple close candidates (e.g. "địa đạo", "chùa", "đình")
      // Open the explorer modal filtered to this search query so student can pick
      onOpenExplorer('all', rawQuery);
    }
  };

  // Featured Monument: Lò gốm cổ Hưng Lợi
  const featuredMonument = useMemo(() => {
    return allMonuments.find(m => m.info.name.includes('Hưng Lợi') || m.info.name.includes('Lò gốm')) ||
           allMonuments.find(m => m.stt === 1) ||
           allMonuments[0];
  }, [allMonuments]);

  // Handle Likes for Student Ideas
  const handleLikeIdea = (id) => {
    setLikedIdeas(prev => {
      const isLiked = !!prev[id];
      setStudentIdeaLikes(likes => ({
        ...likes,
        [id]: likes[id] + (isLiked ? -1 : 1)
      }));
      return { ...prev, [id]: !isLiked };
    });
  };

  return (
    <div className="bg-[#FAF4F0] min-h-screen text-[#2A1214] font-sans antialiased selection:bg-[#8B1417] selection:text-white pb-20 md:pb-0">
      {/* 1. HERO BANNER WITH REVOLUTIONARY BURGUNDY RED THEME & HERITAGE MAP */}
      <section className="relative bg-gradient-to-br from-[#4A0A0C] via-[#7E1819] to-[#200507] text-white min-h-[580px] sm:min-h-[640px] md:min-h-[700px] flex flex-col justify-between overflow-hidden shadow-2xl border-b-4 border-[#BA8438]/40 pb-12 sm:pb-16">
        {/* Background Decorative Elements: Subtle gold radial glow, historical star texture and heritage motifs */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-[#BA8438]/15 rounded-full blur-3xl" />
          <div className="absolute top-1/3 -right-20 w-[700px] h-[700px] bg-[#A81B1F]/35 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(#BA8438_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#200507]/90 via-transparent to-black/20" />
        </div>

        {/* Hero Main Content with 2-Column Grid on Desktop */}
        <div className="relative z-10 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12 md:py-14 my-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
            
            {/* Left Column: Title, Subtitle & Action CTAs */}
            <div className="lg:col-span-5 space-y-4 sm:space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#BA8438]/20 border border-[#BA8438]/40 text-amber-200 text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-sm shadow-inner">
                <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                <span>Số hóa 103 di tích quốc gia và di tích quốc gia đặc biệt trên địa bàn TP. Hồ Chí Minh</span>
              </div>

              <div className="flex items-center justify-between sm:justify-start lg:justify-start gap-3 sm:gap-4">
                <h1 className="font-serif-title font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-wide leading-tight drop-shadow-2xl text-left">
                  DI SẢN <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400">
                    TP. HỒ CHÍ MINH
                  </span>
                </h1>
                {/* Mobile miniature illustration alongside title */}
                <div className="lg:hidden shrink-0">
                  <img
                    src="/assets/images/tphcm_heritage_map_hero.png"
                    alt="Di sản TP.HCM"
                    className="w-20 h-20 sm:w-24 sm:h-24 object-contain rounded-2xl bg-white/10 p-1.5 border border-amber-300/40 shadow-xl drop-shadow-md"
                  />
                </div>
              </div>

              <WordByWordTitle
                as="h2"
                text="Hành trình chạm vào ký ức sống động của thành phố"
                className="font-serif-title text-base sm:text-xl lg:text-2xl text-amber-100/90 font-medium tracking-wide drop-shadow"
                staggerDelay={0.04}
                initialDelay={0.2}
              />

              {/* Poetic Heritage Narrative */}
              <div className="space-y-2.5 sm:space-y-3 text-xs sm:text-[13px] md:text-sm text-rose-100/90 leading-relaxed font-normal max-w-xl mx-auto lg:mx-0 drop-shadow-sm text-left">
                <p className="font-serif-title italic text-amber-200 text-sm sm:text-base border-l-2 border-amber-400 pl-3 py-0.5">
                  “Mỗi viên gạch cũ đều mang một cái tên, một câu chuyện, một phần ký ức của thành phố này.”
                </p>
                <p>
                  Giữa nhịp sống hối hả của một Sài Gòn - Hồ Chí Minh không ngừng đổi thay, vẫn có những mái ngói, những bức tường rêu phong lặng lẽ giữ lại cả một dòng thời gian đã qua. Chúng chứng kiến những biến động của lịch sử và cả những điều bình dị nhất của bao thế hệ đã từng đi qua nơi đây.
                </p>
                <p>
                  Có bao nhiêu di tích bạn đã từng đi ngang qua mà chưa một lần dừng lại? Có bao nhiêu câu chuyện đang ngủ quên trong lòng thành phố, chỉ chờ một ai đó bước vào và lắng nghe?
                </p>
                <p>
                  Chúng tôi bắt đầu hành trình này — không phải để kể lại lịch sử khô khan trong sách vở, mà để mời bạn chạm vào nó, theo cách gần gũi nhất với thế hệ mình.
                </p>
              </div>

              {/* Single CTA Button: Khám Phá Di Tích */}
              <div className="pt-2 sm:pt-3 flex items-center justify-center lg:justify-start">
                <button
                  onClick={() => onOpenExplorer && onOpenExplorer()}
                  className="w-full sm:w-auto px-8 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-[#200507] font-black text-sm sm:text-base uppercase tracking-wider shadow-xl shadow-amber-950/40 ring-2 ring-amber-300 transition-all hover:scale-104 cursor-pointer flex items-center justify-center gap-2.5"
                >
                  <Landmark className="w-5 h-5 text-[#200507]" />
                  <span>Khám Phá Di Tích</span>
                </button>
              </div>
            </div>

            {/* Right Column: Interactive 103-Point Leaflet Map */}
            <div className="lg:col-span-7 flex justify-center items-center relative w-full overflow-visible py-2 sm:py-4">
              <HomePageInteractiveMap 
                currentMonumentStt={1}
                onSelectMonument={onSelectMonument}
                onOpenMyMap={onOpenMyMap}
              />
            </div>

          </div>
        </div>

        {/* Floating Elevated Search Bar */}
        <div className="relative z-40 max-w-4xl w-full mx-auto px-4 -mb-6 sm:-mb-8">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handlePerformSearch();
            }}
            className="bg-[#FFFDFB] rounded-2xl sm:rounded-full p-2.5 sm:p-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.4)] border-2 border-amber-400/80 ring-4 ring-[#8B1417]/20 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 backdrop-blur-lg transform hover:-translate-y-0.5 transition-all"
          >
            <div className="flex items-center gap-2 pl-2 sm:pl-4 text-xs sm:text-sm font-black text-[#8B1417] shrink-0">
              <Search className="w-5 h-5 text-[#8B1417]" />
              <span className="tracking-tight">Bạn muốn khám phá điều gì?</span>
            </div>

            <div className="relative flex-1 w-full">
              <input
                id="search-input-field"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm tên di tích, địa phương, nhân vật..."
                className="w-full py-2 sm:py-2.5 px-3 sm:px-4 text-xs sm:text-sm text-[#2A1214] placeholder-stone-400 bg-[#FAF4F0] rounded-xl sm:rounded-full focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8B1417] transition-all font-medium border border-rose-200/80"
              />

              {searchResults.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-[#FFFDFB] rounded-2xl shadow-2xl border border-rose-200 p-2 z-50 max-h-80 overflow-y-auto divide-y divide-rose-100 animate-fadeIn">
                  <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-[#8B1417] bg-[#FDF2F3] rounded-lg mb-1 flex items-center justify-between">
                    <span>Di tích phù hợp nhất ({searchResults.length})</span>
                    <span className="text-stone-500 font-normal">Nhấn để mở ngay</span>
                  </div>
                  {searchResults.map(m => (
                    <div
                      key={m.stt}
                      onClick={() => {
                        onSelectMonument(m.stt);
                        setSearchTerm('');
                      }}
                      className="p-3 hover:bg-[#FDF2F3] rounded-xl cursor-pointer flex items-center justify-between group transition-colors"
                    >
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-[#8B1417] group-hover:underline flex items-center gap-1.5">
                          <span>{m.info.name}</span>
                          <span className="px-1.5 py-0.2 rounded text-[9px] bg-rose-100 text-[#8B1417] font-black">{m.info.badge || m.info.ranking}</span>
                        </div>
                        <div className="text-[11px] text-stone-600 truncate max-w-[240px] sm:max-w-none">{m.info.address}</div>
                      </div>
                      <div className="flex items-center gap-1 text-xs font-bold text-[#8B1417] opacity-0 group-hover:opacity-100 transition-opacity">
                        <span>Xem</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 sm:px-7 py-2.5 sm:py-3 rounded-xl sm:rounded-full bg-gradient-to-r from-[#8B1417] to-[#B31D21] hover:from-[#731013] hover:to-[#96171a] text-white font-black text-xs sm:text-sm shadow-md transition-all hover:scale-103 cursor-pointer flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Tìm kiếm</span>
            </button>
          </form>
        </div>
      </section>

      {/* 2. COHESIVE SMART EXPLORER & RECOMMENDATION HUB (1/3 Controls Left & 2/3 Cards Right) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-8">
        <ScrollReveal>
          <div className="bg-gradient-to-b from-white via-[#FFFDF9] to-[#FAF5EF] rounded-3xl p-5 sm:p-7 md:p-8 border-2 border-amber-400/50 shadow-xl shadow-amber-950/5 space-y-6">
            
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-300 text-[#7E1819] text-xs font-black uppercase tracking-wider shadow-2xs">
                <Compass className="w-3.5 h-3.5 text-[#7E1819]" />
                <span>Gợi Ý Tuyến Khám Phá Thông Minh</span>
              </div>
              <h2 className="font-serif-title font-black text-xl sm:text-2xl md:text-3xl text-[#2A1214] tracking-tight">
                Khám Phá Di Tích Theo Cách Của Bạn
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 font-medium">
                Chọn nơi bạn ở và chủ đề đam mê để nhận ngay gợi ý di tích phù hợp nhất.
              </p>
            </div>

            {/* Main 2-Column Split: Left 1/3 (Controls) & Right 2/3 (Recommended Cards) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
              
              {/* LEFT COLUMN (1/3 Width: lg:col-span-4) - BỘ LỌC ĐỊA BÀN & CHỦ ĐỀ */}
              <div className="lg:col-span-4 bg-[#FAF6F0] rounded-2xl p-4 sm:p-5 border border-amber-300/70 shadow-xs space-y-4">
                
                {/* 1. BẠN Ở ĐÂU? (XỔ RA 168 XÃ/PHƯỜNG TP.HCM) */}
                <div className="space-y-1.5 relative">
                  <label className="text-xs font-black text-[#7E1819] flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-amber-600" />
                      <span>Bạn ở đâu?</span>
                    </span>
                    <span className="text-[10px] bg-amber-200/70 text-[#7E1819] px-1.5 py-0.5 rounded font-bold">
                      168 Xã / Phường
                    </span>
                  </label>

                  {/* Dropdown Toggle Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setLocationDropdownOpen(!locationDropdownOpen);
                      setTopicDropdownOpen(false);
                    }}
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-amber-300 hover:border-amber-500 text-left flex items-center justify-between shadow-2xs transition-all cursor-pointer text-xs font-bold text-[#2A1214] hover:bg-amber-50/40"
                  >
                    <span className="truncate max-w-[210px] text-[#7E1819]">
                      📍 {selectedWard || 'Chọn Xã, Phường, Quận / Huyện'}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-amber-600 transition-transform shrink-0 ${locationDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Searchable Dropdown Menu with 168+ Wards */}
                  {locationDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white rounded-2xl border-2 border-amber-400 shadow-2xl p-2.5 space-y-2 max-h-72 flex flex-col animate-fadeIn">
                      {/* Search box inside dropdown */}
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          placeholder="Gõ tìm tên phường, xã, quận..."
                          value={wardSearchTerm}
                          onChange={(e) => setWardSearchTerm(e.target.value)}
                          className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-500"
                          autoFocus
                        />
                      </div>

                      {/* Ward List */}
                      <div className="overflow-y-auto flex-1 space-y-2 pr-1 text-xs max-h-52">
                        {filteredDistricts.length === 0 ? (
                          <div className="text-center py-4 text-xs text-stone-400">
                            Không tìm thấy xã/phường phù hợp
                          </div>
                        ) : (
                          filteredDistricts.map(district => (
                            <div key={district.id} className="space-y-0.5">
                              <div className="text-[10px] font-black uppercase text-amber-900 bg-amber-100/70 px-2 py-0.5 rounded flex items-center justify-between">
                                <span>{district.name}</span>
                                <span className="text-[9px] font-normal text-stone-500">{district.zone}</span>
                              </div>
                              <div className="grid grid-cols-1 gap-0.5 pt-0.5">
                                {district.wards.map(ward => {
                                  const fullName = `${ward}, ${district.name}`;
                                  const isWardSelected = selectedWard === fullName;
                                  return (
                                    <button
                                      key={ward}
                                      type="button"
                                      onClick={() => {
                                        setSelectedWard(fullName);
                                        setSelectedDistrict(district.name);
                                        setLocationDropdownOpen(false);
                                      }}
                                      className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center justify-between ${
                                        isWardSelected ? 'bg-[#7E1819] text-white font-bold' : 'hover:bg-amber-100/60 text-stone-700'
                                      }`}
                                    >
                                      <span>{ward}</span>
                                      {isWardSelected && <Check className="w-3.5 h-3.5 text-amber-300" />}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. BẠN QUAN TÂM CHỦ ĐỀ GÌ? */}
                <div className="space-y-1.5 relative pt-2 border-t border-amber-200/60">
                  <label className="text-xs font-black text-[#7E1819] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Bạn quan tâm chủ đề gì?</span>
                  </label>

                  {/* Dropdown Toggle Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setTopicDropdownOpen(!topicDropdownOpen);
                      setLocationDropdownOpen(false);
                    }}
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-amber-300 hover:border-amber-500 text-left flex items-center justify-between shadow-2xs transition-all cursor-pointer text-xs font-bold text-[#2A1214] hover:bg-amber-50/40"
                  >
                    <span className="truncate max-w-[210px] text-[#7E1819]">
                      {topicOptions.find(t => t.id === surveyTopic)?.icon} {topicOptions.find(t => t.id === surveyTopic)?.name}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-amber-600 transition-transform shrink-0 ${topicDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Topic Dropdown Menu */}
                  {topicDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white rounded-2xl border-2 border-amber-400 shadow-2xl p-1.5 space-y-1 max-h-60 overflow-y-auto animate-fadeIn">
                      {topicOptions.map(top => {
                        const isTopSelected = surveyTopic === top.id;
                        return (
                          <button
                            key={top.id}
                            type="button"
                            onClick={() => {
                              setSurveyTopic(top.id);
                              setTopicDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer flex items-center gap-2 ${
                              isTopSelected ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-[#200507] font-black shadow-xs' : 'hover:bg-amber-50 text-stone-700'
                            }`}
                          >
                            <span className="text-sm shrink-0">{top.icon}</span>
                            <div className="flex-1 min-w-0">
                              <div className="font-bold truncate">{top.name}</div>
                            </div>
                            {isTopSelected && <Check className="w-3.5 h-3.5 text-[#200507] shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Smart Assistant Tip */}
                <div className="p-3 rounded-xl bg-amber-100/60 border border-amber-200/80 text-stone-600 text-[11px] leading-relaxed">
                  💡 <strong>Gợi ý:</strong> Hệ thống tự động xếp hạng các di tích gần địa bàn <span className="font-bold text-[#7E1819]">{selectedWard || 'TP.HCM'}</span> theo đúng chủ đề bạn quan tâm.
                </div>
              </div>

              {/* RIGHT COLUMN (2/3 Width: lg:col-span-8) - DI TÍCH ĐỀ XUẤT CỦA BẠN */}
              <div className="lg:col-span-8 space-y-3.5">
                
                {/* Header bar of recommendations */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-amber-50/70 p-2.5 sm:px-3.5 sm:py-2 rounded-xl border border-amber-200/80">
                  <div className="flex items-center gap-1.5 flex-wrap text-xs">
                    <Flame className="w-4 h-4 text-[#7E1819] fill-[#7E1819]" />
                    <span className="font-serif-title font-black uppercase text-[#7E1819]">
                      Di Tích Đề Xuất Dành Cho Bạn
                    </span>
                    <span className="text-stone-500 hidden sm:inline">•</span>
                    <span className="text-stone-600 font-medium text-[11px] truncate max-w-[240px]">
                      {selectedDistrict}
                    </span>
                  </div>

                  <button
                    onClick={onOpenExplorer}
                    className="text-xs font-bold text-[#7E1819] hover:underline cursor-pointer flex items-center gap-1 self-start sm:self-auto"
                  >
                    <span>Xem tất cả 103 di tích</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 4 Responsive Cards in 2x2 Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                  {recommendedMonuments.map((m, idx) => (
                    <div
                      key={m.stt}
                      onClick={() => onSelectMonument(m.stt)}
                      className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-3.5 border-2 border-amber-200/80 hover:border-[#7E1819] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer group hover:-translate-y-1"
                    >
                      <div className="space-y-2.5">
                        <div className="h-36 sm:h-32 rounded-xl overflow-hidden bg-rose-100 relative shadow-inner">
                          <img
                            src={m.info.heroImage}
                            alt={m.info.name}
                            className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
                          />
                          <div className="absolute top-2 left-2 flex items-center gap-1">
                            <span className="px-2 py-0.5 rounded-full bg-[#7E1819] text-amber-100 text-[10px] font-black uppercase shadow">
                              #{m.stt} {m.info.ranking || 'Quốc gia'}
                            </span>
                          </div>
                          <div className="absolute bottom-2 right-2">
                            <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 text-[#200507] text-[9px] font-black uppercase shadow-md">
                              ★ Khớp {98 - idx * 3}%
                            </span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <h4 className="font-serif-title font-black text-xs sm:text-sm text-[#2A1214] group-hover:text-[#7E1819] transition-colors line-clamp-1">
                            {m.info.name}
                          </h4>
                          <p className="text-[11px] text-stone-600 flex items-center gap-1 line-clamp-1">
                            <MapPin className="w-3 h-3 text-[#7E1819] shrink-0" />
                            <span>{m.info.address}</span>
                          </p>
                          <p className="text-[11px] text-stone-600 line-clamp-2 leading-relaxed">
                            {m.info.overview}
                          </p>
                        </div>
                      </div>

                      <div className="pt-2.5 mt-2 border-t border-amber-100 flex items-center justify-between text-xs font-black text-[#7E1819] group-hover:underline">
                        <span>Khám phá ngay</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  ))}
                </div>

              </div>

            </div>

          </div>
        </ScrollReveal>
      </section>

      {/* 5. DI SẢN CẦN BẠN & Ý TƯỞNG CỦA HỌC SINH */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <ScrollReveal>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
            {/* Left 7 Cols: DI SẢN CẦN BẠN */}
            <div className="lg:col-span-7 bg-[#FFFDFB] rounded-3xl p-4 sm:p-5 md:p-6 border-2 border-rose-200 shadow-md shadow-rose-950/5 space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="font-serif-title font-black text-sm sm:text-base uppercase tracking-wider text-[#2A1214]">
                  DI SẢN CẦN BẠN
                </h3>
                <p className="text-xs text-stone-600 mt-0.5">
                  Bạn có thể làm gì?
                </p>
              </div>

              {/* 6 Action Items: 3 cols on mobile, 6 cols on tablet/desktop */}
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2 text-center">
                <div 
                  onClick={onOpenContribute}
                  className="p-2 sm:p-2.5 rounded-2xl bg-[#FAF4F0] hover:bg-[#FDF2F3] border border-rose-100 cursor-pointer transition-colors flex flex-col items-center gap-1 group"
                >
                  <div className="w-8 h-8 rounded-full bg-rose-100 text-[#8B1417] flex items-center justify-center text-sm font-bold">
                    ✓
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-bold text-stone-700 leading-tight">Ghi lại hiện trạng</span>
                </div>

                <div 
                  onClick={onOpenContribute}
                  className="p-2 sm:p-2.5 rounded-2xl bg-[#FAF4F0] hover:bg-[#FDF2F3] border border-rose-100 cursor-pointer transition-colors flex flex-col items-center gap-1 group"
                >
                  <div className="w-8 h-8 rounded-full bg-rose-100 text-[#8B1417] flex items-center justify-center text-sm font-bold">
                    📢
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-bold text-stone-700 leading-tight">Chia sẻ câu chuyện</span>
                </div>

                <div 
                  onClick={onOpenContribute}
                  className="p-2 sm:p-2.5 rounded-2xl bg-[#FAF4F0] hover:bg-[#FDF2F3] border border-rose-100 cursor-pointer transition-colors flex flex-col items-center gap-1 group"
                >
                  <div className="w-8 h-8 rounded-full bg-rose-100 text-[#8B1417] flex items-center justify-center text-sm font-bold">
                    🌿
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-bold text-stone-700 leading-tight">Giữ gìn cảnh quan</span>
                </div>

                <div 
                  onClick={onOpenExplorer}
                  className="p-2 sm:p-2.5 rounded-2xl bg-[#FAF4F0] hover:bg-[#FDF2F3] border border-rose-100 cursor-pointer transition-colors flex flex-col items-center gap-1 group"
                >
                  <div className="w-8 h-8 rounded-full bg-rose-100 text-[#8B1417] flex items-center justify-center text-sm font-bold">
                    📖
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-bold text-stone-700 leading-tight">Tìm hiểu thêm</span>
                </div>

                <div 
                  onClick={onOpenContribute}
                  className="p-2 sm:p-2.5 rounded-2xl bg-[#FAF4F0] hover:bg-[#FDF2F3] border border-rose-100 cursor-pointer transition-colors flex flex-col items-center gap-1 group"
                >
                  <div className="w-8 h-8 rounded-full bg-rose-100 text-[#8B1417] flex items-center justify-center text-sm font-bold">
                    👥
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-bold text-stone-700 leading-tight">Rủ bạn bè cùng đi</span>
                </div>

                <div 
                  onClick={onOpenContribute}
                  className="p-2 sm:p-2.5 rounded-2xl bg-[#FAF4F0] hover:bg-[#FDF2F3] border border-rose-100 cursor-pointer transition-colors flex flex-col items-center gap-1 group"
                >
                  <div className="w-8 h-8 rounded-full bg-rose-100 text-[#8B1417] flex items-center justify-center text-sm font-bold">
                    💡
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-bold text-stone-700 leading-tight">Đề xuất ý tưởng</span>
                </div>
              </div>

              <button
                onClick={onOpenContribute}
                className="w-full py-3 sm:py-3.5 rounded-2xl bg-gradient-to-r from-[#7A1114] via-[#8B1417] to-[#A81B1F] hover:from-[#630D10] hover:to-[#8F1417] text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-red-950/20 transition-all hover:scale-102 cursor-pointer"
              >
                TÔI MUỐN HÀNH ĐỘNG
              </button>
            </div>

            {/* Right 5 Cols: Ý TƯỞNG CỦA HỌC SINH */}
            <div className="lg:col-span-5 bg-[#FFFDFB] rounded-3xl p-4 sm:p-5 md:p-6 border-2 border-rose-200 shadow-md shadow-rose-950/5 space-y-3.5 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <button
                  onClick={onOpenContribute}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#7E1819] via-[#8B1417] to-[#A81B1F] hover:from-[#6B1315] hover:to-[#8B1417] text-white font-serif-title font-black text-xs sm:text-sm uppercase tracking-wider shadow-md shadow-red-950/20 transition-all hover:scale-102 cursor-pointer flex items-center gap-1.5"
                >
                  <span>💡</span>
                  <span>Ý TƯỞNG CỦA HỌC SINH</span>
                </button>
                <button
                  onClick={onOpenContribute}
                  className="text-xs font-bold text-[#8B1417] hover:underline cursor-pointer"
                >
                  Xem tất cả
                </button>
              </div>

              {/* 3 Student Projects */}
              <div className="space-y-2.5">
                <div className="p-2 sm:p-2.5 rounded-2xl bg-[#FAF4F0] hover:bg-[#FDF2F3] border border-rose-100 flex items-center justify-between gap-2.5 sm:gap-3 transition-colors">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden bg-rose-100 shrink-0 shadow-inner">
                      <img src="/assets/images/dinh-doc-lap-front.jpg" alt="Idea 1" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xs font-bold text-stone-800 truncate">Làm QR di tích tại trường học</span>
                  </div>
                  <button 
                    onClick={() => handleLikeIdea(1)}
                    className="flex items-center gap-1 text-xs font-bold text-[#8B1417] hover:scale-110 transition-transform cursor-pointer shrink-0"
                  >
                    <span>❤️</span>
                    <span>{studentIdeaLikes[1]}</span>
                  </button>
                </div>

                <div className="p-2 sm:p-2.5 rounded-2xl bg-[#FAF4F0] hover:bg-[#FDF2F3] border border-rose-100 flex items-center justify-between gap-2.5 sm:gap-3 transition-colors">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden bg-rose-100 shrink-0 shadow-inner">
                      <img src="/assets/images/dia-dao-cu-chi.jpg" alt="Idea 2" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xs font-bold text-stone-800 truncate">Tour tham quan cho học sinh</span>
                  </div>
                  <button 
                    onClick={() => handleLikeIdea(2)}
                    className="flex items-center gap-1 text-xs font-bold text-[#8B1417] hover:scale-110 transition-transform cursor-pointer shrink-0"
                  >
                    <span>❤️</span>
                    <span>{studentIdeaLikes[2]}</span>
                  </button>
                </div>

                <div className="p-2 sm:p-2.5 rounded-2xl bg-[#FAF4F0] hover:bg-[#FDF2F3] border border-rose-100 flex items-center justify-between gap-2.5 sm:gap-3 transition-colors">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden bg-rose-100 shrink-0 shadow-inner">
                      <img src="/assets/images/ben-nha-rong.jpg" alt="Idea 3" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xs font-bold text-stone-800 truncate">Bản đồ di tích quanh trường</span>
                  </div>
                  <button 
                    onClick={() => handleLikeIdea(3)}
                    className="flex items-center gap-1 text-xs font-bold text-[#8B1417] hover:scale-110 transition-transform cursor-pointer shrink-0"
                  >
                    <span>❤️</span>
                    <span>{studentIdeaLikes[3]}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 6. BOTTOM MOTTO BANNER */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-12 text-center">
        <ScrollReveal>
          <div className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5 max-w-2xl mx-auto items-stretch justify-center">
              <button
                type="button"
                onClick={() => onOpenExplorer && onOpenExplorer('Lịch sử')}
                className="p-3 rounded-2xl bg-white border-2 border-rose-100 hover:border-[#8B1417] shadow-sm hover:shadow-lg flex flex-col items-center justify-center gap-2 hover:scale-105 transition-all duration-300 cursor-pointer group"
                title="Khám phá Di tích Lịch sử"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 p-1.5 rounded-xl bg-amber-50/60 group-hover:bg-rose-50 flex items-center justify-center transition-colors">
                  <img
                    src="/assets/icons/di%20t%C3%ADch%20l%E1%BB%8Bch%20s%E1%BB%AD.png"
                    alt="Di tích Lịch sử"
                    className="w-full h-full object-contain drop-shadow-sm group-hover:scale-110 transition-transform"
                  />
                </div>
                <span className="text-xs sm:text-sm font-bold text-stone-700 group-hover:text-[#8B1417] transition-colors leading-tight">
                  Di tích Lịch sử
                </span>
              </button>

              <button
                type="button"
                onClick={() => onOpenExplorer && onOpenExplorer('Kiến trúc')}
                className="p-3 rounded-2xl bg-white border-2 border-rose-100 hover:border-[#8B1417] shadow-sm hover:shadow-lg flex flex-col items-center justify-center gap-2 hover:scale-105 transition-all duration-300 cursor-pointer group"
                title="Khám phá Di tích Kiến trúc nghệ thuật"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 p-1.5 rounded-xl bg-amber-50/60 group-hover:bg-rose-50 flex items-center justify-center transition-colors">
                  <img
                    src="/assets/icons/Di%20t%C3%ADch%20ki%E1%BA%BFn%20tr%C3%BAc.png"
                    alt="Kiến trúc nghệ thuật"
                    className="w-full h-full object-contain drop-shadow-sm group-hover:scale-110 transition-transform"
                  />
                </div>
                <span className="text-xs sm:text-sm font-bold text-stone-700 group-hover:text-[#8B1417] transition-colors leading-tight">
                  Kiến trúc nghệ thuật
                </span>
              </button>

              <button
                type="button"
                onClick={() => onOpenExplorer && onOpenExplorer('Khảo cổ')}
                className="p-3 rounded-2xl bg-white border-2 border-rose-100 hover:border-[#8B1417] shadow-sm hover:shadow-lg flex flex-col items-center justify-center gap-2 hover:scale-105 transition-all duration-300 cursor-pointer group"
                title="Khám phá Di tích Khảo cổ học"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 p-1.5 rounded-xl bg-amber-50/60 group-hover:bg-rose-50 flex items-center justify-center transition-colors">
                  <img
                    src="/assets/icons/Di%20t%C3%ADch%20kh%E1%BA%A3o%20c%E1%BB%95.png"
                    alt="Khảo cổ học"
                    className="w-full h-full object-contain drop-shadow-sm group-hover:scale-110 transition-transform"
                  />
                </div>
                <span className="text-xs sm:text-sm font-bold text-stone-700 group-hover:text-[#8B1417] transition-colors leading-tight">
                  Khảo cổ học
                </span>
              </button>

              <button
                type="button"
                onClick={() => onOpenExplorer && onOpenExplorer('thắng cảnh')}
                className="p-3 rounded-2xl bg-white border-2 border-rose-100 hover:border-[#8B1417] shadow-sm hover:shadow-lg flex flex-col items-center justify-center gap-2 hover:scale-105 transition-all duration-300 cursor-pointer group"
                title="Khám phá Di tích Danh lam thắng cảnh"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 p-1.5 rounded-xl bg-amber-50/60 group-hover:bg-rose-50 flex items-center justify-center transition-colors">
                  <img
                    src="/assets/icons/Di%20t%C3%ADch%20danh%20lam%20th%E1%BA%AFng%20c%E1%BA%A3nh.png"
                    alt="Danh lam thắng cảnh"
                    className="w-full h-full object-contain drop-shadow-sm group-hover:scale-110 transition-transform"
                  />
                </div>
                <span className="text-xs sm:text-sm font-bold text-stone-700 group-hover:text-[#8B1417] transition-colors leading-tight">
                  Danh lam thắng cảnh
                </span>
              </button>
            </div>

            <div className="space-y-1 sm:space-y-2 max-w-2xl mx-auto px-4 text-center">
              <h3 className="font-serif-title text-base sm:text-lg md:text-xl font-black text-[#2A1214] [text-wrap:balance]">
                Di tích kể câu chuyện của quá khứ.
              </h3>
              <h3 className="font-serif-title text-base sm:text-lg md:text-xl font-black text-[#8B1417] [text-wrap:balance]">
                Còn chúng ta quyết định câu chuyện ấy sẽ được tiếp tục như&nbsp;thế&nbsp;nào.
              </h3>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 7. STICKY MOBILE BOTTOM NAVIGATION BAR (< 768px) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#FFFDFB]/95 backdrop-blur-md border-t border-rose-200/90 py-1.5 px-3 flex items-center justify-around shadow-2xl">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex flex-col items-center gap-0.5 text-[#8B1417] cursor-pointer"
        >
          <Home className="w-4 h-4" />
          <span className="text-[10px] font-bold">Trang chủ</span>
        </button>

        <button
          onClick={onOpenExplorer}
          className="flex flex-col items-center gap-0.5 text-stone-600 hover:text-[#8B1417] cursor-pointer"
        >
          <Grid className="w-4 h-4" />
          <span className="text-[10px] font-bold">Kho di tích</span>
        </button>

        <button
          onClick={onOpenMyMap}
          className="flex flex-col items-center gap-0.5 text-stone-600 hover:text-[#8B1417] cursor-pointer"
        >
          <MapIcon className="w-4 h-4" />
          <span className="text-[10px] font-bold">Bản đồ</span>
        </button>

        <button
          onClick={() => {
            const el = document.getElementById('search-input-field');
            if (el) {
              el.focus();
              el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }}
          className="flex flex-col items-center gap-0.5 text-stone-600 hover:text-[#8B1417] cursor-pointer"
        >
          <Search className="w-4 h-4" />
          <span className="text-[10px] font-bold">Tìm kiếm</span>
        </button>

        <button
          onClick={onOpenContribute}
          className="flex flex-col items-center gap-0.5 text-stone-600 hover:text-[#8B1417] cursor-pointer"
        >
          <Lightbulb className="w-4 h-4" />
          <span className="text-[10px] font-bold">Ý tưởng</span>
        </button>
      </nav>
    </div>
  );
}
