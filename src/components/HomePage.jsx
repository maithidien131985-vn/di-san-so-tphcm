import React, { useState, useMemo } from 'react';
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
  Grid
} from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export default function HomePage({ 
  allMonuments = [], 
  onSelectMonument, 
  onOpenExplorer, 
  onOpenMyMap,
  onOpenContribute,
  onOpenPassport,
  activePassport
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [studentIdeaLikes, setStudentIdeaLikes] = useState({ 1: 128, 2: 94, 3: 73 });
  const [likedIdeas, setLikedIdeas] = useState({});

  // 3-Dimension Survey State
  const [surveyLocation, setSurveyLocation] = useState('q1_q3_q4');
  const [surveyPurpose, setSurveyPurpose] = useState('khkt_stem');
  const [surveyTopic, setSurveyTopic] = useState('military');

  // Survey Location Options
  const locationOptions = [
    { id: 'q1_q3_q4', name: 'Quận 1, Quận 3, Quận 4', icon: '🏙️', tag: 'Khu Trung Tâm Lịch Sử' },
    { id: 'q5_q6_q10_q11', name: 'Quận 5, Quận 6, Quận 10, Quận 11', icon: '🏮', tag: 'Khu Chợ Lớn Cổ Kính' },
    { id: 'cu_chi_hoc_mon', name: 'Củ Chi, Hóc Môn, Quận 12', icon: '🌾', tag: 'Vành Đai Đất Thép' },
    { id: 'thu_duc', name: 'TP. Thủ Đức (Q.9, Q.2, Thủ Đức)', icon: '🌉', tag: 'Vùng Đất Đông Sài Gòn' },
    { id: 'can_gio_nha_be', name: 'Cần Giờ, Nhà Bè, Quận 7', icon: '🌿', tag: 'Sông Nước Sinh Thái' },
    { id: 'binh_thanh_pn_gv', name: 'Bình Thạnh, Phú Nhuận, Gò Vấp, Tân Bình', icon: '🏘️', tag: 'Khu Nội Thành Mở Rộng' },
    { id: 'ba_ria_vung_tau', name: 'Bà Rịa - Vũng Tàu', icon: '🌊', tag: 'Bến Lộc An, Côn Đảo, Bạch Dinh' },
    { id: 'binh_duong', name: 'Bình Dương', icon: '⛰️', tag: 'Phú Lợi, Hội Khánh, Tam Giác Sắt' }
  ];

  // Survey Purpose Options
  const purposeOptions = [
    { id: 'khkt_stem', name: 'Nghiên cứu KHKT / Dự án STEM', icon: '🔬', desc: 'Khảo sát hiện vật, tư liệu điều tra lịch sử chuyên sâu' },
    { id: 'study_tour', name: 'Khám phá trải nghiệm sau giờ học', icon: '🎒', desc: 'Bán kính gần, thuận tiện di chuyển bằng xe buýt hoặc xe đạp' },
    { id: 'family_group', name: 'Dã ngoại cùng lớp & Gia đình', icon: '👨‍👩‍👧‍👦', desc: 'Không gian mở, chụp ảnh check-in và hoạt động tập thể' },
    { id: 'heritage_roots', name: 'Hành trình Về Nguồn & Tri ân', icon: '⭐', desc: 'Thắp hương, tìm hiểu truyền thống đấu tranh bất khuất' }
  ];

  // Survey Topic Options
  const topicOptions = [
    { id: 'military', name: 'Chiến tích Kháng chiến & Địa đạo ngầm', icon: '⚔️', desc: 'Dinh Độc Lập, Củ Chi, Rừng Sác, Côn Đảo, Hầm bí mật' },
    { id: 'architecture', name: 'Kiến trúc Pháp cổ & Bảo tàng nghệ thuật', icon: '🏛️', desc: 'Bảo tàng Lịch sử, Bạch Dinh, Tòa Án, Nhà Hát TP' },
    { id: 'spiritual', name: 'Cổ tự Phật giáo & Chạm khắc Hán Nôm', icon: '🛕', desc: 'Chùa Giác Lâm, Chùa Giác Viên, Chùa Hội Khánh' },
    { id: 'culture_commune', name: 'Đình làng Nam Bộ & Phong tục truyền thống', icon: '🏮', desc: 'Đình Thông Tây Hội, Lăng Lê Văn Duyệt, Đình Bình Đông' },
    { id: 'archaeology_craft', name: 'Khảo cổ học & Dấu tích làng nghề xưa', icon: '🏺', desc: 'Lò gốm Hưng Lợi, Mộ Cổ Giồng Cá Vồ, Làng nghề cổ' },
    { id: 'mangrove_nature', name: 'Căn cứ Rừng ngập mặn & Thiên nhiên', icon: '🌿', desc: 'Chiến khu Rừng Sác, Bến Lộc An, Chiến khu Đ' }
  ];

  // Dynamic Survey Recommendation Engine
  const recommendedMonuments = useMemo(() => {
    if (!allMonuments || allMonuments.length === 0) return [];

    const scored = allMonuments.map(m => {
      let score = 0;
      const addr = (m.info.address || '').toLowerCase();
      const name = (m.info.name || '').toLowerCase();
      const type = (m.info.type || '').toLowerCase();
      const overview = (m.info.overview || '').toLowerCase();

      // 1. Location Matching Score
      if (surveyLocation === 'q1_q3_q4') {
        if (addr.includes('quận 1') || addr.includes('quận 3') || addr.includes('quận 4') || m.stt === 1) score += 40;
      } else if (surveyLocation === 'q5_q6_q10_q11') {
        if (addr.includes('quận 5') || addr.includes('quận 6') || addr.includes('quận 10') || addr.includes('quận 11') || name.includes('hội quán') || name.includes('chùa')) score += 40;
      } else if (surveyLocation === 'cu_chi_hoc_mon') {
        if (addr.includes('củ chi') || addr.includes('hóc môn') || addr.includes('quận 12') || m.stt === 2 || m.stt === 15) score += 45;
      } else if (surveyLocation === 'thu_duc') {
        if (addr.includes('thủ đức') || addr.includes('quận 9') || addr.includes('quận 2') || m.stt === 32 || m.stt === 62) score += 40;
      } else if (surveyLocation === 'can_gio_nha_be') {
        if (addr.includes('cần giờ') || addr.includes('nhà bè') || addr.includes('quận 7') || m.stt === 7) score += 45;
      } else if (surveyLocation === 'binh_thanh_pn_gv') {
        if (addr.includes('bình thạnh') || addr.includes('phú nhuận') || addr.includes('gò vấp') || addr.includes('tân bình') || m.stt === 79 || m.stt === 88) score += 40;
      } else if (surveyLocation === 'ba_ria_vung_tau') {
        if (addr.includes('bà rịa') || addr.includes('vũng tàu') || addr.includes('côn đảo') || addr.includes('xuyên mộc') || m.stt === 3 || m.stt === 4 || m.stt === 5 || m.stt === 6 || m.stt === 56) score += 45;
      } else if (surveyLocation === 'binh_duong') {
        if (addr.includes('bình dương') || addr.includes('thủ dầu một') || addr.includes('bến cát') || m.stt === 8 || m.stt === 60 || m.stt === 61) score += 45;
      }

      // 2. Topic Matching Score
      if (surveyTopic === 'military') {
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

      // 3. Purpose boost
      if (surveyPurpose === 'khkt_stem' && m.investigation?.investigationQuestion) score += 15;
      if (surveyPurpose === 'heritage_roots' && (m.info.ranking.includes('đặc biệt') || m.info.ranking.includes('Quốc gia'))) score += 15;

      return { monument: m, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 4).map(s => s.monument);
  }, [allMonuments, surveyLocation, surveyPurpose, surveyTopic]);

  // Smart Search Scoring & Best Match Linking
  const handlePerformSearch = (explicitTerm) => {
    const rawQuery = (explicitTerm !== undefined ? explicitTerm : searchTerm).trim();
    if (!rawQuery) {
      onOpenExplorer();
      return;
    }

    const query = rawQuery.toLowerCase();
    const normQuery = query.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');

    // Keyword mapping for high-intent queries
    const keywordMap = [
      { keywords: ['dinh', 'doc lap', 'thong nhat', 'xe tang', '390', '843', 'bui quang than', 'ngo viet thu', '30/4', '30-4', 'quan 1'], stt: 1 },
      { keywords: ['cu chi', 'dia dao', 'dat thep', 'hoang cam', 'ben duoc', 'crimp', 'cedar falls'], stt: 2 },
      { keywords: ['loc an', 'tau khong so', 'ho chi minh tren bien', 'xuyen moc', 'ba ria'], stt: 3 },
      { keywords: ['con dao', 'chuong cop', 'chuong bo', 'vo thi sau', 'le hong phong', 'nha tu con dao'], stt: 4 },
      { keywords: ['binh gia', 'duc thanh', 'chien dich binh gia'], stt: 5 },
      { keywords: ['minh dam', 'chau long', 'chau vien', 'hang da'], stt: 6 },
      { keywords: ['rung sac', 'can gio', 'doan 10', 'dac cong rung sac', 'nha be', 'long tau'], stt: 7 },
      { keywords: ['chien khu d', 'chien khu'], stt: 8 },
      { keywords: ['nha rong', 'ben nha rong', 'ho chi minh', 'ra di tim duong'], stt: 11 },
      { keywords: ['bach dinh', 'vung tau', 'paul doumer'], stt: 56 },
      { keywords: ['bao tang lich su', 'so thu'], stt: 57 },
      { keywords: ['bao tang thanh pho', 'dinh gia long'], stt: 58 },
      { keywords: ['giac lam', 'chua giac lam', 'co tu'], stt: 70 },
      { keywords: ['phu loi', 'nha tu phu loi', 'binh duong'], stt: 60 },
      { keywords: ['gom', 'hung loi', 'lo gom', 'khao co'], nameQuery: 'Hưng Lợi' }
    ];

    for (const km of keywordMap) {
      for (const kw of km.keywords) {
        if (normQuery.includes(kw)) {
          let match = null;
          if (km.stt) {
            match = allMonuments.find(m => m.stt === km.stt);
          } else if (km.nameQuery) {
            match = allMonuments.find(m => m.info.name.includes(km.nameQuery));
          }
          if (match) {
            onSelectMonument(match.stt);
            setSearchTerm('');
            return;
          }
        }
      }
    }

    // Ranking across all 103 monuments
    let bestMonument = null;
    let maxScore = 0;

    allMonuments.forEach(m => {
      let score = 0;
      const nameNorm = m.info.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
      const addressNorm = m.info.address.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
      const typeNorm = m.info.type.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
      const overviewNorm = m.info.overview.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');

      if (nameNorm === normQuery) score += 120;
      else if (nameNorm.startsWith(normQuery)) score += 60;
      else if (nameNorm.includes(normQuery)) score += 35;

      const queryWords = normQuery.split(/\s+/).filter(w => w.length > 1);
      queryWords.forEach(w => {
        if (nameNorm.includes(w)) score += 20;
        if (addressNorm.includes(w)) score += 10;
        if (typeNorm.includes(w)) score += 8;
        if (overviewNorm.includes(w)) score += 4;
      });

      if (score > maxScore) {
        maxScore = score;
        bestMonument = m;
      }
    });

    if (bestMonument && maxScore > 0) {
      onSelectMonument(bestMonument.stt);
      setSearchTerm('');
    } else {
      onOpenExplorer();
    }
  };

  // Search Results Filtering for dropdown
  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const term = searchTerm.toLowerCase();
    return allMonuments.filter(m => 
      m.info.name.toLowerCase().includes(term) ||
      m.info.address.toLowerCase().includes(term) ||
      m.info.overview.toLowerCase().includes(term) ||
      m.info.type.toLowerCase().includes(term)
    ).slice(0, 8);
  }, [searchTerm, allMonuments]);

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
      {/* 1. HERO BANNER WITH NATURAL MONUMENT BACKGROUND */}
      <section className="relative bg-[#200507] text-white min-h-[460px] sm:min-h-[520px] md:min-h-[560px] flex flex-col justify-between overflow-visible shadow-2xl">
        {/* Background Image: Giữ nguyên màu sắc tự nhiên, chỉ phủ bóng nhẹ vùng chữ */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="/assets/images/dinh-doc-lap-front.jpg"
            alt="Di sản TP. Hồ Chí Minh"
            className="w-full h-full object-cover object-center scale-100 transition-transform duration-1000"
          />
          {/* Localized soft gradient overlay: Chỉ làm tối vùng chữ bên trái & chân trang */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#200507]/90 via-transparent to-black/20 pointer-events-none" />
        </div>

        {/* Hero Main Content */}
        <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 my-auto">
          <div className="max-w-3xl space-y-3 sm:space-y-4">
            <h1 className="font-serif-title font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-wide leading-tight drop-shadow-xl">
              DI SẢN <br />
              <span className="text-amber-200">TP. HỒ CHÍ MINH</span>
            </h1>

            <h2 className="font-serif-title text-base sm:text-xl lg:text-2xl text-amber-300 font-bold tracking-wide drop-shadow">
              Hành trình khám phá những câu chuyện còn sống mãi
            </h2>

            <p className="text-xs sm:text-sm md:text-base text-rose-100/90 leading-relaxed font-normal max-w-2xl drop-shadow-sm">
              Hàng trăm di tích. Hàng nghìn câu chuyện. Và một thế hệ trẻ có thể tiếp nối.
            </p>

            {/* CTA Buttons: Full width on Mobile, Inline on Tablet & Desktop */}
            <div className="pt-3 sm:pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 flex-wrap">
              <button
                onClick={onOpenExplorer}
                className="w-full sm:w-auto px-6 sm:px-7 py-3 sm:py-3.5 rounded-2xl bg-gradient-to-r from-[#8B1417] via-[#A81B1F] to-[#C42226] hover:from-[#731013] hover:to-[#a0181c] text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-xl shadow-red-950/50 ring-2 ring-amber-400/50 transition-all hover:scale-104 cursor-pointer flex items-center justify-center gap-2.5"
              >
                <Landmark className="w-4 h-4 text-white" />
                <span>Khám Phá Di Tích</span>
              </button>

              <button
                onClick={onOpenMyMap}
                className="w-full sm:w-auto px-6 sm:px-7 py-3 sm:py-3.5 rounded-2xl bg-gradient-to-r from-[#4A0A0C] via-[#630E11] to-[#7D1215] hover:from-[#3a0709] hover:to-[#570b0e] text-amber-100 font-black text-xs sm:text-sm uppercase tracking-wider shadow-xl shadow-red-950/40 ring-2 ring-red-400/30 transition-all hover:scale-104 cursor-pointer flex items-center justify-center gap-2.5"
              >
                <MapPin className="w-4 h-4 text-amber-200" />
                <span>Bản Đồ Di Tích</span>
              </button>

              <button
                onClick={onOpenPassport}
                className="w-full sm:w-auto px-6 sm:px-7 py-3 sm:py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-[#200507] font-black text-xs sm:text-sm uppercase tracking-wider shadow-xl shadow-amber-950/40 ring-2 ring-amber-300 transition-all hover:scale-104 cursor-pointer flex items-center justify-center gap-2.5"
                title="Mở Hộ Chiếu Di Sản & Lưu hành trình khám phá"
              >
                <Compass className="w-4 h-4 text-[#200507] animate-spin-slow" />
                <span>{activePassport ? `Hộ Chiếu: ${activePassport.fullName}` : 'Hộ Chiếu Di Sản'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Floating Search Bar */}
        <div className="relative z-40 max-w-4xl w-full mx-auto px-4 -mb-8 sm:-mb-9">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handlePerformSearch();
            }}
            className="bg-[#FFFDFB] rounded-2xl sm:rounded-full p-2 sm:p-3 shadow-2xl border-2 border-[#8B1417]/50 ring-4 ring-[#8B1417]/10 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 backdrop-blur-md"
          >
            <div className="flex items-center gap-2 pl-2 sm:pl-3 text-xs sm:text-sm font-black text-[#8B1417] shrink-0">
              <Search className="w-4 h-4 text-[#8B1417]" />
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

      {/* 2. INSPIRATIONAL INTRODUCTION SECTION (LỜI NGỎ DI SẢN) */}
      <section id="about-project" className="max-w-5xl mx-auto px-4 sm:px-6 pt-16 sm:pt-20 pb-6 relative z-10">
        <ScrollReveal>
          <div className="relative bg-[#FFFDFB] rounded-3xl p-5 sm:p-8 md:p-10 border-2 border-rose-200 shadow-md shadow-rose-950/5 overflow-hidden">
            <div className="absolute -right-8 -bottom-8 opacity-5 text-[#8B1417] pointer-events-none">
              <Landmark className="w-48 sm:w-64 h-48 sm:h-64" />
            </div>

            <div className="relative z-10 space-y-3 sm:space-y-4 text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 rounded-full bg-[#FDF2F3] border border-rose-300/80 text-[#8B1417] text-[11px] sm:text-xs font-black uppercase tracking-wider shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-[#8B1417]" />
                <span>Ký Ức Thành Phố &amp; Hành Trình Kết Nối</span>
              </div>

              <p className="font-serif-title text-sm sm:text-base lg:text-lg text-[#2A1214] font-medium leading-relaxed italic">
                “Mỗi viên gạch cũ đều mang một cái tên, một câu chuyện, một phần ký ức của thành phố này.”
              </p>

              <div className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm text-[#4E282B] leading-relaxed text-justify sm:text-center">
                <p>
                  Giữa nhịp sống hối hả của một Sài Gòn - Hồ Chí Minh không ngừng đổi thay, vẫn có những mái ngói, những bức tường rêu phong lặng lẽ giữ lại cả một dòng thời gian đã qua. Chúng chứng kiến những biến động của lịch sử, những đổi thay của thành phố, và cả những điều bình dị nhất trong đời sống của bao thế hệ đã từng đi qua nơi đây.
                </p>
                <p>
                  Có bao nhiêu di tích bạn đã từng đi ngang qua mà chưa một lần dừng lại? Có bao nhiêu câu chuyện đang ngủ quên trong lòng thành phố, chỉ chờ một ai đó bước vào và lắng nghe?
                </p>
                <p className="font-bold text-[#8B1417] pt-1">
                  Chúng tôi bắt đầu hành trình này — không phải để kể lại lịch sử theo cách khô khan trong sách vở, mà để mời bạn chạm vào nó, theo cách gần gũi nhất với thế hệ mình.
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 3. DI TÍCH HÔM NAY (FEATURED SPOTLIGHT BANNER) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <ScrollReveal>
          <div className="bg-gradient-to-br from-[#4A0A0C] via-[#660E11] to-[#801316] text-white rounded-3xl p-5 sm:p-7 md:p-8 shadow-2xl border-2 border-[#380608] relative overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Left 5 cols: Image */}
              <div className="md:col-span-5 h-48 sm:h-56 md:h-64 rounded-2xl overflow-hidden bg-black/40 border border-white/20 shadow-inner relative group">
                <img
                  src={featuredMonument.info.heroImage}
                  alt={featuredMonument.info.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-amber-400 text-[#33080A] text-[11px] font-black uppercase tracking-wider shadow-md flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#33080A]" />
                  <span>Di tích hôm nay</span>
                </div>
              </div>

              {/* Right 7 cols: Information & CTA */}
              <div className="md:col-span-7 flex flex-col justify-between space-y-3 sm:space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">
                      ⭐ GỢI Ý KHÁM PHÁ NỔI BẬT
                    </span>
                    <button
                      onClick={onOpenExplorer}
                      className="text-xs font-semibold text-rose-200 hover:text-white hover:underline cursor-pointer"
                    >
                      Xem toàn bộ 103 di tích →
                    </button>
                  </div>

                  <h3 className="font-serif-title font-black text-xl sm:text-2xl md:text-3xl text-amber-100">
                    {featuredMonument.info.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-rose-100/90 leading-relaxed line-clamp-3 text-justify">
                    {featuredMonument.info.overview}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-white/95 pt-1">
                  <div className="flex items-center gap-2 bg-white/10 p-2.5 rounded-xl backdrop-blur-xs border border-white/10">
                    <span className="text-amber-300 text-base">🔍</span>
                    <span><strong>Hiện vật:</strong> Khảo cổ &amp; tư liệu quý nguyên bản.</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 p-2.5 rounded-xl backdrop-blur-xs border border-white/10">
                    <span className="text-amber-300 text-base">🏺</span>
                    <span><strong>Giá trị:</strong> Dấu ấn lịch sử - văn hóa hào hùng.</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => onSelectMonument(featuredMonument.stt)}
                    className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-[#33080A] font-black text-xs sm:text-sm shadow-lg shadow-black/40 transition-all hover:scale-103 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Khám phá câu chuyện di tích này</span>
                    <ArrowRight className="w-4 h-4 text-[#33080A]" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 4. DI TÍCH QUANH EM (MASSIVE EXPANSIVE FULL-WIDTH MAP SECTION) */}
      <section id="map-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ScrollReveal>
          <div className="bg-[#FFFDFB] rounded-3xl p-5 sm:p-7 md:p-8 border-2 border-rose-200 shadow-xl shadow-rose-950/5 space-y-4">
            {/* Map Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-rose-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <div className="w-9 h-9 rounded-xl bg-[#8B1417] text-white flex items-center justify-center shadow-xs">
                    <MapPin className="w-5 h-5 text-amber-200" />
                  </div>
                  <h2 className="font-serif-title font-black text-lg sm:text-xl md:text-2xl uppercase tracking-wider text-[#8B1417]">
                    DI TÍCH QUANH EM
                  </h2>
                  <span className="px-3 py-0.5 rounded-full bg-[#FDF2F3] text-[#8B1417] text-[11px] font-black uppercase tracking-wider border border-rose-200">
                    Bản đồ số 103 Di tích TP.HCM &amp; Vùng phụ cận
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-stone-600">
                  Khám phá toàn cảnh tọa độ, hành trình và địa điểm 103 Di tích Lịch sử - Văn hóa trên bản đồ số tương tác
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={onOpenMyMap}
                  className="px-4 py-2.5 rounded-xl bg-[#8B1417] hover:bg-[#731013] text-white text-xs font-bold shadow-md transition-all hover:scale-102 cursor-pointer flex items-center gap-1.5"
                >
                  <MapPin className="w-4 h-4 text-amber-200" />
                  <span>Mở toàn màn hình</span>
                </button>
                <a
                  href="https://www.google.com/maps/d/edit?mid=1UM24OubPpISXPfooW7VY8Vo4xMZ6dIg&usp=sharing"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-[#FAF4F0] hover:bg-[#FDF2F3] border border-rose-200 text-[#8B1417] text-xs font-bold transition-all hover:scale-102 cursor-pointer flex items-center gap-1.5"
                >
                  <span>Mở Google Maps</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Large Interactive Google My Maps Frame */}
            <div className="h-[440px] sm:h-[540px] md:h-[620px] lg:h-[680px] w-full rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-rose-200 relative z-0 bg-[#FDF7F5] shadow-inner">
              <iframe
                src="https://www.google.com/maps/d/embed?mid=1UM24OubPpISXPfooW7VY8Vo4xMZ6dIg&ehbc=2E312F"
                width="100%"
                height="100%"
                className="w-full h-full border-0"
                title="Bản đồ Di tích TP. Hồ Chí Minh"
                allowFullScreen
                loading="lazy"
              />
            </div>

            {/* Map Quick Region Shortcuts Footer */}
            <div className="pt-2 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-1.5 text-stone-600 font-semibold text-xs shrink-0">
                <Compass className="w-4 h-4 text-[#8B1417] shrink-0" />
                <span>Khu vực trọng điểm:</span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { name: 'Quận 1 & Trung tâm', stt: 1 },
                  { name: 'Địa đạo Củ Chi', stt: 2 },
                  { name: 'Bến Lộc An & Biển', stt: 3 },
                  { name: 'Côn Đảo', stt: 4 },
                  { name: 'Rừng Sác - Cần Giờ', stt: 7 },
                  { name: 'Chợ Lớn - Quận 5', stt: 10 },
                  { name: 'Tam Giác Sắt - Bình Dương', stt: 8 }
                ].map((tag, tIdx) => (
                  <button
                    key={tIdx}
                    onClick={() => onSelectMonument(tag.stt)}
                    className="px-3 py-1.5 rounded-xl bg-[#FAF4F0] hover:bg-rose-100 text-[#8B1417] text-[11px] font-bold border border-rose-200/80 transition-all hover:scale-102 cursor-pointer shadow-2xs"
                  >
                    📍 {tag.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 4. BẢNG KHẢO SÁT & GỢI Ý HÀNH TRÌNH (RESPONSIVE GRID) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <ScrollReveal>
          <div className="bg-[#FFFDFB] rounded-3xl p-4 sm:p-6 md:p-10 border-2 border-rose-200 shadow-xl shadow-rose-950/5 space-y-6 sm:space-y-8">
            {/* Header */}
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 rounded-full bg-[#FDF2F3] border border-rose-300/80 text-[#8B1417] text-[11px] sm:text-xs font-black uppercase tracking-wider shadow-2xs">
                <Compass className="w-4 h-4 text-[#8B1417]" />
                <span>Trắc Nghiệm Khảo Sát &amp; Gợi Ý Cá Nhân Hóa</span>
              </div>
              <h2 className="font-serif-title font-black text-xl sm:text-2xl md:text-3xl uppercase tracking-wider text-[#2A1214]">
                KHÁM PHÁ THEO CÁCH CỦA BẠN
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Hãy cho chúng tôi biết nơi bạn ở, mục đích chuyến đi và chủ đề đam mê để nhận ngay gợi ý di tích phù hợp nhất!
              </p>
            </div>

            {/* 3 Survey Steps Grid */}
            <div className="space-y-5 sm:space-y-6">
              {/* BƯỚC 1: NƠI Ở / KHU VỰC CỦA BẠN */}
              <div className="space-y-2.5 sm:space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#8B1417] text-white flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <h3 className="font-serif-title font-bold text-xs sm:text-sm md:text-base text-[#2A1214]">
                    Nơi ở / Khu vực địa lý của bạn:
                  </h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-2.5">
                  {locationOptions.map(loc => {
                    const isSelected = surveyLocation === loc.id;
                    return (
                      <button
                        key={loc.id}
                        type="button"
                        onClick={() => setSurveyLocation(loc.id)}
                        className={`p-2.5 sm:p-3 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between space-y-1 relative group ${
                          isSelected
                            ? 'bg-[#FDF2F3] border-[#8B1417] ring-2 ring-[#8B1417]/20 shadow-md'
                            : 'bg-[#FAF4F0] border-rose-100 hover:border-[#8B1417]/60 hover:bg-[#FDF2F3]/60'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-base sm:text-lg">{loc.icon}</span>
                          {isSelected && (
                            <span className="w-4 h-4 rounded-full bg-[#8B1417] text-white flex items-center justify-center text-[10px]">
                              ✓
                            </span>
                          )}
                        </div>
                        <div>
                          <div className={`text-[11px] sm:text-xs font-bold leading-tight ${isSelected ? 'text-[#8B1417]' : 'text-stone-800'}`}>
                            {loc.name}
                          </div>
                          <div className="text-[9px] sm:text-[10px] text-stone-500 line-clamp-1 mt-0.5">
                            {loc.tag}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* BƯỚC 2: MỤC ĐÍCH KHÁM PHÁ CỦA BẠN */}
              <div className="space-y-2.5 sm:space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#8B1417] text-white flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <h3 className="font-serif-title font-bold text-xs sm:text-sm md:text-base text-[#2A1214]">
                    Mục đích khám phá của bạn:
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5">
                  {purposeOptions.map(pur => {
                    const isSelected = surveyPurpose === pur.id;
                    return (
                      <button
                        key={pur.id}
                        type="button"
                        onClick={() => setSurveyPurpose(pur.id)}
                        className={`p-3 sm:p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between space-y-1.5 relative ${
                          isSelected
                            ? 'bg-[#FDF2F3] border-[#8B1417] ring-2 ring-[#8B1417]/20 shadow-md'
                            : 'bg-[#FAF4F0] border-rose-100 hover:border-[#8B1417]/60 hover:bg-[#FDF2F3]/60'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-lg sm:text-xl">{pur.icon}</span>
                          {isSelected && (
                            <span className="w-4 h-4 rounded-full bg-[#8B1417] text-white flex items-center justify-center text-[10px]">
                              ✓
                            </span>
                          )}
                        </div>
                        <div>
                          <div className={`text-xs font-bold ${isSelected ? 'text-[#8B1417]' : 'text-stone-800'}`}>
                            {pur.name}
                          </div>
                          <div className="text-[10px] text-stone-500 line-clamp-2 mt-0.5 leading-snug">
                            {pur.desc}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* BƯỚC 3: ĐAM MÊ & CHỦ ĐỀ BẠN YÊU THÍCH */}
              <div className="space-y-2.5 sm:space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#8B1417] text-white flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <h3 className="font-serif-title font-bold text-xs sm:text-sm md:text-base text-[#2A1214]">
                    Đam mê &amp; Chủ đề bạn quan tâm nhất:
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-2.5">
                  {topicOptions.map(top => {
                    const isSelected = surveyTopic === top.id;
                    return (
                      <button
                        key={top.id}
                        type="button"
                        onClick={() => setSurveyTopic(top.id)}
                        className={`p-3 sm:p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center gap-3 relative ${
                          isSelected
                            ? 'bg-[#FDF2F3] border-[#8B1417] ring-2 ring-[#8B1417]/20 shadow-md'
                            : 'bg-[#FAF4F0] border-rose-100 hover:border-[#8B1417]/60 hover:bg-[#FDF2F3]/60'
                        }`}
                      >
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white shadow-2xs flex items-center justify-center text-lg sm:text-xl shrink-0">
                          {top.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`text-xs font-bold truncate ${isSelected ? 'text-[#8B1417]' : 'text-stone-800'}`}>
                            {top.name}
                          </div>
                          <div className="text-[10px] text-stone-500 line-clamp-1 mt-0.5">
                            {top.desc}
                          </div>
                        </div>
                        {isSelected && (
                          <span className="w-4 h-4 rounded-full bg-[#8B1417] text-white flex items-center justify-center text-[10px] shrink-0">
                            ✓
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* DYNAMIC RECOMMENDATION RESULTS CARDS */}
            <div className="pt-4 border-t-2 border-rose-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-[#8B1417] fill-[#8B1417]" />
                  <span className="font-serif-title font-black text-xs sm:text-sm md:text-base uppercase tracking-wider text-[#8B1417]">
                    KẾT QUẢ GỢI Ý ({recommendedMonuments.length} Di Tích Hợp Lý Nhất)
                  </span>
                </div>
                <button
                  onClick={onOpenExplorer}
                  className="text-xs font-bold text-[#8B1417] hover:underline cursor-pointer flex items-center gap-1 self-start sm:self-auto"
                >
                  <span>Xem toàn bộ 103 di tích</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Responsive Cards: 1 col on Mobile, 2 cols on Tablet, 4 cols on Desktop */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {recommendedMonuments.map((m, idx) => (
                  <div
                    key={m.stt}
                    onClick={() => onSelectMonument(m.stt)}
                    className="bg-[#FAF4F0] rounded-3xl p-3.5 sm:p-4 border-2 border-rose-100 hover:border-[#8B1417] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer group hover:-translate-y-1"
                  >
                    <div className="space-y-3">
                      <div className="h-40 sm:h-36 rounded-2xl overflow-hidden bg-rose-100 relative shadow-inner">
                        <img
                          src={m.info.heroImage}
                          alt={m.info.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-2.5 left-2.5">
                          <span className="px-2 py-0.5 rounded-full bg-[#8B1417] text-amber-100 text-[10px] font-black uppercase shadow">
                            {m.info.ranking || 'Quốc gia'}
                          </span>
                        </div>
                        <div className="absolute bottom-2 right-2">
                          <span className="px-2 py-0.5 rounded-full bg-[#8B1417] text-white text-[9px] font-black uppercase backdrop-blur-xs shadow">
                            ★ Khớp {98 - idx * 3}%
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <h4 className="font-serif-title font-black text-sm text-[#2A1214] group-hover:text-[#8B1417] transition-colors line-clamp-1">
                          {m.info.name}
                        </h4>
                        <p className="text-[11px] text-stone-600 flex items-center gap-1 line-clamp-1">
                          <MapPin className="w-3 h-3 text-[#8B1417] shrink-0" />
                          <span>{m.info.address}</span>
                        </p>
                        <p className="text-[11px] text-stone-600 line-clamp-2 leading-relaxed pt-0.5">
                          {m.info.overview}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 mt-2 border-t border-rose-200/80 flex items-center justify-between text-xs font-bold text-[#8B1417] group-hover:underline">
                      <span>Khám phá ngay</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
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
            <div className="lg:col-span-5 bg-[#FFFDFB] rounded-3xl p-4 sm:p-5 md:p-6 border-2 border-rose-200 shadow-md shadow-rose-950/5 space-y-3 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <h3 className="font-serif-title font-black text-sm sm:text-base uppercase tracking-wider text-[#2A1214]">
                  Ý TƯỞNG CỦA HỌC SINH
                </h3>
                <button
                  onClick={onOpenContribute}
                  className="text-xs font-bold text-[#8B1417] hover:underline cursor-pointer"
                >
                  Xem tất cả
                </button>
              </div>

              {/* 3 Student Projects */}
              <div className="space-y-2 sm:space-y-2.5">
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

              <button
                onClick={onOpenContribute}
                className="w-full py-2.5 sm:py-3 rounded-xl bg-[#8B1417] hover:bg-[#680E11] text-white font-black text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-md"
              >
                + ĐỀ XUẤT Ý TƯỞNG
              </button>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 6. BOTTOM MOTTO BANNER */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-12 text-center">
        <ScrollReveal>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-center gap-3 sm:gap-4 text-2xl sm:text-3xl md:text-4xl">
              <span>🎒</span>
              <span>🏛️</span>
              <span>📚</span>
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
