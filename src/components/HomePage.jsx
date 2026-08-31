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
  Star
} from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export default function HomePage({ 
  allMonuments = [], 
  onSelectMonument, 
  onOpenExplorer, 
  onOpenMyMap,
  onOpenContribute
}) {
  const [searchTerm, setSearchTerm] = useState('');
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
    <div className="bg-[#F5EFEB] min-h-screen text-[#2A1D17] font-sans antialiased selection:bg-amber-300 selection:text-[#681315]">
      {/* 1. HERO BANNER WITH PANORAMIC SAIGON VIEW */}
      <section className="relative bg-[#1A1412] text-white min-h-[560px] sm:min-h-[600px] flex flex-col justify-between overflow-visible shadow-2xl">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="/assets/images/dinh-doc-lap-front.jpg"
            alt="Di sản TP. Hồ Chí Minh"
            className="w-full h-full object-cover object-center opacity-40 scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1412] via-black/55 to-black/80" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-600/15 via-transparent to-black/70" />
        </div>

        {/* Top Navbar with High Contrast Navigation Links */}
        <header className="relative z-20 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#681315] to-[#8C1B1E] border border-amber-400/50 flex items-center justify-center text-amber-200 shadow-lg shadow-black/50 group-hover:scale-105 transition-transform">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif-title font-black text-base sm:text-lg tracking-wider text-white block uppercase drop-shadow">
                DI SẢN
              </span>
              <span className="text-[10px] font-black text-amber-300 tracking-widest block uppercase drop-shadow-sm">
                TP. HỒ CHÍ MINH
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-2 lg:gap-3 text-xs sm:text-sm font-bold text-white/95">
            <a 
              href="#home" 
              className="px-4 py-2 rounded-full bg-[#681315] text-amber-100 border border-amber-400/40 shadow-md shadow-black/30"
            >
              Trang chủ
            </a>
            <button 
              onClick={onOpenExplorer} 
              className="px-3.5 py-2 rounded-full hover:bg-white/15 text-white/90 hover:text-amber-200 transition-all cursor-pointer"
            >
              Khám phá di tích
            </button>
            <button 
              onClick={onOpenMyMap} 
              className="px-3.5 py-2 rounded-full hover:bg-white/15 text-white/90 hover:text-amber-200 transition-all cursor-pointer"
            >
              Bản đồ di tích
            </button>
            <button 
              onClick={() => onSelectMonument(1)} 
              className="px-3.5 py-2 rounded-full hover:bg-white/15 text-white/90 hover:text-amber-200 transition-all cursor-pointer"
            >
              Thử thách
            </button>
            <button 
              onClick={onOpenContribute} 
              className="px-3.5 py-2 rounded-full hover:bg-white/15 text-white/90 hover:text-amber-200 transition-all cursor-pointer"
            >
              Ý tưởng – Hành động
            </button>
            <a 
              href="#about-project" 
              className="px-3.5 py-2 rounded-full hover:bg-white/15 text-white/90 hover:text-amber-200 transition-all"
            >
              Giới thiệu
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                const el = document.getElementById('search-input-field');
                if (el) el.focus();
              }}
              className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 flex items-center justify-center text-white transition-all hover:scale-105 cursor-pointer shadow-md"
              title="Tìm kiếm di tích"
            >
              <Search className="w-4 h-4 text-amber-200" />
            </button>
            <div 
              onClick={onOpenContribute}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500/30 to-amber-700/30 border border-amber-300/60 flex items-center justify-center text-amber-200 font-bold text-sm cursor-pointer shadow-inner hover:scale-105 transition-all"
              title="Cộng đồng & Đóng góp"
            >
              👤
            </div>
          </div>
        </header>

        {/* Hero Main Content */}
        <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 my-auto">
          <div className="max-w-3xl space-y-4">
            <h1 className="font-serif-title font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-wide leading-tight drop-shadow-xl">
              DI SẢN <br />
              <span className="text-[#E7B874]">TP. HỒ CHÍ MINH</span>
            </h1>

            <h2 className="font-serif-title text-lg sm:text-2xl text-[#E5983A] font-bold tracking-wide drop-shadow">
              Hành trình khám phá những câu chuyện còn sống mãi
            </h2>

            <p className="text-sm sm:text-base text-stone-200 leading-relaxed font-normal max-w-2xl drop-shadow-sm">
              Hàng trăm di tích. Hàng nghìn câu chuyện. Và một thế hệ trẻ có thể tiếp nối.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={onOpenExplorer}
                className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#B86E18] via-[#CB7D20] to-[#DF8E2B] hover:from-[#a05e13] hover:to-[#c67a1b] text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-xl shadow-amber-950/40 ring-2 ring-amber-400/40 transition-all hover:scale-104 cursor-pointer flex items-center gap-2.5"
              >
                <Landmark className="w-4 h-4 text-white" />
                <span>Khám Phá Di Tích</span>
              </button>

              <button
                onClick={onOpenMyMap}
                className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#214F33] via-[#2A6340] to-[#34794F] hover:from-[#1b4029] hover:to-[#275d3c] text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-xl shadow-emerald-950/40 ring-2 ring-emerald-400/40 transition-all hover:scale-104 cursor-pointer flex items-center gap-2.5"
              >
                <MapPin className="w-4 h-4 text-white" />
                <span>Khám Phá Gần Bạn</span>
              </button>
            </div>
          </div>
        </div>

        {/* Floating Search Bar */}
        <div className="relative z-40 max-w-4xl w-full mx-auto px-4 -mb-9">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handlePerformSearch();
            }}
            className="bg-[#FFFDFB] rounded-2xl sm:rounded-full p-2.5 sm:p-3 shadow-2xl border-2 border-[#D8C4AD] ring-4 ring-black/10 flex flex-col sm:flex-row items-center gap-3 backdrop-blur-md"
          >
            <div className="flex items-center gap-2 pl-3 text-xs sm:text-sm font-black text-[#2A1D17] shrink-0">
              <Search className="w-4 h-4 text-[#2A6340]" />
              <span className="tracking-tight">Bạn muốn khám phá điều gì?</span>
            </div>

            <div className="relative flex-1 w-full">
              <input
                id="search-input-field"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm tên di tích, địa phương, nhân vật, sự kiện..."
                className="w-full py-2.5 px-4 text-xs sm:text-sm text-[#2A1D17] placeholder-stone-500 bg-[#F5EFEB] rounded-xl sm:rounded-full focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2A6340] transition-all font-medium border border-[#DECDBB]"
              />

              {searchResults.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-[#FFFDFB] rounded-2xl shadow-2xl border border-[#D8C4AD] p-2 z-50 max-h-80 overflow-y-auto divide-y divide-[#EFE6DC] animate-fadeIn">
                  <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-[#681315] bg-[#F9EDE1] rounded-lg mb-1 flex items-center justify-between">
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
                      className="p-3 hover:bg-[#F7EFE6] rounded-xl cursor-pointer flex items-center justify-between group transition-colors"
                    >
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-[#681315] group-hover:underline flex items-center gap-1.5">
                          <span>{m.info.name}</span>
                          <span className="px-1.5 py-0.2 rounded text-[9px] bg-amber-100 text-[#681315] font-black">{m.info.badge || m.info.ranking}</span>
                        </div>
                        <div className="text-[11px] text-stone-600">{m.info.address}</div>
                      </div>
                      <div className="flex items-center gap-1 text-xs font-bold text-[#681315] opacity-0 group-hover:opacity-100 transition-opacity">
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
              className="w-full sm:w-auto px-7 py-3 rounded-xl sm:rounded-full bg-gradient-to-r from-[#214F33] to-[#2E6F48] hover:from-[#1b4029] hover:to-[#255c3c] text-white font-black text-xs sm:text-sm shadow-md transition-all hover:scale-103 cursor-pointer flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Tìm kiếm</span>
            </button>
          </form>
        </div>
      </section>

      {/* 2. INSPIRATIONAL INTRODUCTION SECTION (LỜI NGỎ DI SẢN) */}
      <section id="about-project" className="max-w-5xl mx-auto px-4 sm:px-6 pt-20 pb-6 relative z-10">
        <ScrollReveal>
          <div className="relative bg-[#FFFDFB] rounded-3xl p-6 sm:p-10 border-2 border-[#D8C4AD] shadow-md shadow-[#4A2E1B]/5 overflow-hidden">
            <div className="absolute -right-8 -bottom-8 opacity-5 text-[#681315] pointer-events-none">
              <Landmark className="w-64 h-64" />
            </div>

            <div className="relative z-10 space-y-4 text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F6EDE1] border border-[#DECFBE] text-[#681315] text-xs font-black uppercase tracking-wider shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-[#B86E18]" />
                <span>Ký Ức Thành Phố &amp; Hành Trình Kết Nối</span>
              </div>

              <p className="font-serif-title text-base sm:text-lg text-[#2A1D17] font-medium leading-relaxed italic">
                “Mỗi viên gạch cũ đều mang một cái tên, một câu chuyện, một phần ký ức của thành phố này.”
              </p>

              <div className="space-y-3 text-xs sm:text-sm text-[#4E3D34] leading-relaxed text-justify sm:text-center">
                <p>
                  Giữa nhịp sống hối hả của một Sài Gòn - Hồ Chí Minh không ngừng đổi thay, vẫn có những mái ngói, những bức tường rêu phong lặng lẽ giữ lại cả một dòng thời gian đã qua. Chúng chứng kiến những biến động của lịch sử, những đổi thay của thành phố, và cả những điều bình dị nhất trong đời sống của bao thế hệ đã từng đi qua nơi đây.
                </p>
                <p>
                  Có bao nhiêu di tích bạn đã từng đi ngang qua mà chưa một lần dừng lại? Có bao nhiêu câu chuyện đang ngủ quên trong lòng thành phố, chỉ chờ một ai đó bước vào và lắng nghe?
                </p>
                <p className="font-bold text-[#681315] pt-1">
                  Chúng tôi bắt đầu hành trình này — không phải để kể lại lịch sử theo cách khô khan trong sách vở, mà để mời bạn chạm vào nó, theo cách gần gũi nhất với thế hệ mình.
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 3. DI TÍCH QUANH EM (MAP) & DI TÍCH HÔM NAY (FEATURED CARD) - ĐƯỢC ĐƯA LÊN TRÊN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ScrollReveal>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 7 Cols: DI TÍCH QUANH EM MAP */}
            <div className="lg:col-span-7 bg-[#FFFDFB] rounded-3xl p-5 sm:p-6 border-2 border-[#D8C4AD] shadow-md shadow-[#4A2E1B]/5 space-y-3 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-serif-title font-black text-sm sm:text-base uppercase tracking-wider text-[#681315]">
                    DI TÍCH QUANH EM
                  </span>
                </div>
                <button
                  onClick={onOpenMyMap}
                  className="text-xs font-bold text-[#681315] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <span>Xem tất cả</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Google My Maps Embed */}
              <div className="h-64 sm:h-72 rounded-2xl overflow-hidden border border-[#DECDBB] relative z-0 bg-[#EFE6DC] shadow-inner">
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

              {/* Map Actions / Info */}
              <div className="flex items-center justify-between text-xs pt-1">
                <div className="flex items-center gap-1.5 text-stone-600 font-semibold text-[11px]">
                  <MapPin className="w-3.5 h-3.5 text-[#681315]" />
                  <span>Bản đồ tọa độ 103 Di tích TP.HCM</span>
                </div>
                <a
                  href="https://www.google.com/maps/d/edit?mid=1UM24OubPpISXPfooW7VY8Vo4xMZ6dIg&usp=sharing"
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-[#681315] hover:underline flex items-center gap-1 text-[11px]"
                >
                  <span>Mở Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Right 5 Cols: DI TÍCH HÔM NAY (FEATURED RICH CARD) */}
            <div className="lg:col-span-5 bg-[#1C3B27] text-white rounded-3xl p-5 sm:p-6 shadow-xl border-2 border-[#132A1C] flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-serif-title font-black text-xs sm:text-sm uppercase tracking-wider text-amber-300">
                  DI TÍCH HÔM NAY
                </span>
                <button
                  onClick={onOpenExplorer}
                  className="text-xs font-semibold text-white/80 hover:text-white hover:underline cursor-pointer"
                >
                  Xem thêm
                </button>
              </div>

              <div className="space-y-3">
                <div className="h-40 rounded-2xl overflow-hidden bg-black/30 border border-white/15 shadow-inner">
                  <img
                    src={featuredMonument.info.heroImage}
                    alt={featuredMonument.info.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div>
                  <h3 className="font-serif-title font-black text-lg sm:text-xl text-[#F4E3C9]">
                    {featuredMonument.info.name}
                  </h3>
                  <p className="text-xs text-white/85 leading-relaxed mt-1 line-clamp-2">
                    {featuredMonument.info.overview}
                  </p>
                </div>

                <div className="space-y-1.5 text-xs text-white/90">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-300">🔍</span>
                    <span><strong>Có gì được tìm thấy?</strong> Các hiện vật khảo cổ &amp; dấu tích nguyên bản.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-amber-300">🏺</span>
                    <span><strong>Người xưa đã sản xuất như thế nào?</strong> Kỹ nghệ thủ công tinh xảo của cư dân xưa.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-amber-300">💡</span>
                    <span><strong>Vì sao cần bảo vệ?</strong> Giá trị văn hóa lịch sử độc nhất vô nhị.</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onSelectMonument(featuredMonument.stt)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#B86E18] to-[#DF8E2B] hover:from-[#9d5c12] hover:to-[#c67a1b] text-white font-black text-xs sm:text-sm shadow-lg shadow-black/30 transition-all hover:scale-102 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Khám phá câu chuyện</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 4. BẢNG KHẢO SÁT & GỢI Ý HÀNH TRÌNH: "KHÁM PHÁ THEO CÁCH CỦA BẠN" (ĐẶT SAU DI TÍCH QUANH EM) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ScrollReveal>
          <div className="bg-[#FFFDFB] rounded-3xl p-6 sm:p-10 border-2 border-[#D8C4AD] shadow-xl shadow-[#4A2E1B]/5 space-y-8">
            {/* Header */}
            <div className="text-center space-y-2.5 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-[#F6EDE1] to-[#EFE2D2] border border-[#DECFBE] text-[#681315] text-xs font-black uppercase tracking-wider shadow-2xs">
                <Compass className="w-4 h-4 text-[#681315]" />
                <span>Trắc Nghiệm Khảo Sát &amp; Gợi Ý Cá Nhân Hóa</span>
              </div>
              <h2 className="font-serif-title font-black text-2xl sm:text-3xl uppercase tracking-wider text-[#2A1D17]">
                KHÁM PHÁ THEO CÁCH CỦA BẠN
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Hãy cho chúng tôi biết nơi bạn ở, mục đích chuyến đi và chủ đề đam mê để nhận ngay gợi ý di tích phù hợp nhất!
              </p>
            </div>

            {/* 3 Survey Steps */}
            <div className="space-y-6">
              {/* BƯỚC 1: NƠI Ở / KHU VỰC CỦA BẠN */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#681315] text-white flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <h3 className="font-serif-title font-bold text-sm sm:text-base text-[#2A1D17]">
                    Nơi ở / Khu vực địa lý của bạn:
                  </h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {locationOptions.map(loc => {
                    const isSelected = surveyLocation === loc.id;
                    return (
                      <button
                        key={loc.id}
                        type="button"
                        onClick={() => setSurveyLocation(loc.id)}
                        className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between space-y-1 relative group ${
                          isSelected
                            ? 'bg-[#F9EDE1] border-[#681315] ring-2 ring-[#681315]/20 shadow-md'
                            : 'bg-[#F5EFEB] border-[#DECDBB] hover:border-[#B86E18] hover:bg-[#F9EDE1]/50'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-lg">{loc.icon}</span>
                          {isSelected && (
                            <span className="w-4 h-4 rounded-full bg-[#681315] text-white flex items-center justify-center text-[10px]">
                              ✓
                            </span>
                          )}
                        </div>
                        <div>
                          <div className={`text-xs font-bold ${isSelected ? 'text-[#681315]' : 'text-stone-800'}`}>
                            {loc.name}
                          </div>
                          <div className="text-[10px] text-stone-500 line-clamp-1 mt-0.5">
                            {loc.tag}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* BƯỚC 2: MỤC ĐÍCH KHÁM PHÁ CỦA BẠN */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#B86E18] text-white flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <h3 className="font-serif-title font-bold text-sm sm:text-base text-[#2A1D17]">
                    Mục đích khám phá của bạn:
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  {purposeOptions.map(pur => {
                    const isSelected = surveyPurpose === pur.id;
                    return (
                      <button
                        key={pur.id}
                        type="button"
                        onClick={() => setSurveyPurpose(pur.id)}
                        className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between space-y-1.5 relative ${
                          isSelected
                            ? 'bg-[#F9EDE1] border-[#B86E18] ring-2 ring-[#B86E18]/20 shadow-md'
                            : 'bg-[#F5EFEB] border-[#DECDBB] hover:border-[#B86E18] hover:bg-[#F9EDE1]/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xl">{pur.icon}</span>
                          {isSelected && (
                            <span className="w-4 h-4 rounded-full bg-[#B86E18] text-white flex items-center justify-center text-[10px]">
                              ✓
                            </span>
                          )}
                        </div>
                        <div>
                          <div className={`text-xs font-bold ${isSelected ? 'text-[#B86E18]' : 'text-stone-800'}`}>
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
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#214F33] text-white flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <h3 className="font-serif-title font-bold text-sm sm:text-base text-[#2A1D17]">
                    Đam mê &amp; Chủ đề bạn quan tâm nhất:
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {topicOptions.map(top => {
                    const isSelected = surveyTopic === top.id;
                    return (
                      <button
                        key={top.id}
                        type="button"
                        onClick={() => setSurveyTopic(top.id)}
                        className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center gap-3 relative ${
                          isSelected
                            ? 'bg-[#EBF3ED] border-[#214F33] ring-2 ring-[#214F33]/20 shadow-md'
                            : 'bg-[#F5EFEB] border-[#DECDBB] hover:border-[#214F33] hover:bg-[#EBF3ED]/50'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-xl bg-white shadow-2xs flex items-center justify-center text-xl shrink-0">
                          {top.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`text-xs font-bold truncate ${isSelected ? 'text-[#214F33]' : 'text-stone-800'}`}>
                            {top.name}
                          </div>
                          <div className="text-[10px] text-stone-500 line-clamp-1 mt-0.5">
                            {top.desc}
                          </div>
                        </div>
                        {isSelected && (
                          <span className="w-4 h-4 rounded-full bg-[#214F33] text-white flex items-center justify-center text-[10px] shrink-0">
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
            <div className="pt-4 border-t-2 border-[#D8C4AD] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-[#DF8E2B] fill-[#DF8E2B]" />
                  <span className="font-serif-title font-black text-sm sm:text-base uppercase tracking-wider text-[#681315]">
                    KẾT QUẢ GỢI Ý DÀNH RIÊNG CHO BẠN ({recommendedMonuments.length} Di Tích Hợp Lý Nhất)
                  </span>
                </div>
                <button
                  onClick={onOpenExplorer}
                  className="text-xs font-bold text-[#681315] hover:underline cursor-pointer flex items-center gap-1 self-start sm:self-auto"
                >
                  <span>Xem toàn bộ 103 di tích</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* 4 Recommended Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {recommendedMonuments.map((m, idx) => (
                  <div
                    key={m.stt}
                    onClick={() => onSelectMonument(m.stt)}
                    className="bg-[#F5EFEB] rounded-3xl p-4 border-2 border-[#DECDBB] hover:border-[#681315] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer group hover:-translate-y-1"
                  >
                    <div className="space-y-3">
                      <div className="h-36 rounded-2xl overflow-hidden bg-stone-200 relative shadow-inner">
                        <img
                          src={m.info.heroImage}
                          alt={m.info.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-2.5 left-2.5">
                          <span className="px-2 py-0.5 rounded-full bg-[#681315] text-amber-100 text-[10px] font-black uppercase shadow">
                            {m.info.ranking || 'Quốc gia'}
                          </span>
                        </div>
                        <div className="absolute bottom-2 right-2">
                          <span className="px-2 py-0.5 rounded-full bg-[#214F33] text-white text-[9px] font-black uppercase backdrop-blur-xs shadow">
                            ★ Khớp {98 - idx * 3}%
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <h4 className="font-serif-title font-black text-sm text-[#2A1D17] group-hover:text-[#681315] transition-colors line-clamp-1">
                          {m.info.name}
                        </h4>
                        <p className="text-[11px] text-stone-600 flex items-center gap-1 line-clamp-1">
                          <MapPin className="w-3 h-3 text-[#681315] shrink-0" />
                          <span>{m.info.address}</span>
                        </p>
                        <p className="text-[11px] text-stone-600 line-clamp-2 leading-relaxed pt-0.5">
                          {m.info.overview}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 mt-2 border-t border-[#DECDBB] flex items-center justify-between text-xs font-bold text-[#681315] group-hover:underline">
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ScrollReveal>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 7 Cols: DI SẢN CẦN BẠN */}
            <div className="lg:col-span-7 bg-[#FFFDFB] rounded-3xl p-5 sm:p-6 border-2 border-[#D8C4AD] shadow-md shadow-[#4A2E1B]/5 space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="font-serif-title font-black text-sm sm:text-base uppercase tracking-wider text-[#2A1D17]">
                  DI SẢN CẦN BẠN
                </h3>
                <p className="text-xs text-stone-600 mt-0.5">
                  Bạn có thể làm gì?
                </p>
              </div>

              {/* 6 Action Items */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">
                <div 
                  onClick={onOpenContribute}
                  className="p-2.5 rounded-2xl bg-[#F5EFEB] hover:bg-[#EBF3ED] border border-[#DECDBB] cursor-pointer transition-colors flex flex-col items-center gap-1 group"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#214F33] flex items-center justify-center text-sm font-bold">
                    ✓
                  </div>
                  <span className="text-[10px] font-bold text-stone-700 leading-tight">Ghi lại hiện trạng</span>
                </div>

                <div 
                  onClick={onOpenContribute}
                  className="p-2.5 rounded-2xl bg-[#F5EFEB] hover:bg-[#EBF3ED] border border-[#DECDBB] cursor-pointer transition-colors flex flex-col items-center gap-1 group"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#214F33] flex items-center justify-center text-sm font-bold">
                    📢
                  </div>
                  <span className="text-[10px] font-bold text-stone-700 leading-tight">Chia sẻ câu chuyện</span>
                </div>

                <div 
                  onClick={onOpenContribute}
                  className="p-2.5 rounded-2xl bg-[#F5EFEB] hover:bg-[#EBF3ED] border border-[#DECDBB] cursor-pointer transition-colors flex flex-col items-center gap-1 group"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#214F33] flex items-center justify-center text-sm font-bold">
                    🌿
                  </div>
                  <span className="text-[10px] font-bold text-stone-700 leading-tight">Giữ gìn cảnh quan</span>
                </div>

                <div 
                  onClick={onOpenExplorer}
                  className="p-2.5 rounded-2xl bg-[#F5EFEB] hover:bg-[#EBF3ED] border border-[#DECDBB] cursor-pointer transition-colors flex flex-col items-center gap-1 group"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#214F33] flex items-center justify-center text-sm font-bold">
                    📖
                  </div>
                  <span className="text-[10px] font-bold text-stone-700 leading-tight">Tìm hiểu thêm</span>
                </div>

                <div 
                  onClick={onOpenContribute}
                  className="p-2.5 rounded-2xl bg-[#F5EFEB] hover:bg-[#EBF3ED] border border-[#DECDBB] cursor-pointer transition-colors flex flex-col items-center gap-1 group"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#214F33] flex items-center justify-center text-sm font-bold">
                    👥
                  </div>
                  <span className="text-[10px] font-bold text-stone-700 leading-tight">Rủ bạn bè cùng khám phá</span>
                </div>

                <div 
                  onClick={onOpenContribute}
                  className="p-2.5 rounded-2xl bg-[#F5EFEB] hover:bg-[#EBF3ED] border border-[#DECDBB] cursor-pointer transition-colors flex flex-col items-center gap-1 group"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#214F33] flex items-center justify-center text-sm font-bold">
                    💡
                  </div>
                  <span className="text-[10px] font-bold text-stone-700 leading-tight">Đề xuất ý tưởng</span>
                </div>
              </div>

              <button
                onClick={onOpenContribute}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#1C3B27] to-[#265337] hover:from-[#152e1f] hover:to-[#1e432c] text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-black/20 transition-all hover:scale-102 cursor-pointer"
              >
                TÔI MUỐN HÀNH ĐỘNG
              </button>
            </div>

            {/* Right 5 Cols: Ý TƯỞNG CỦA HỌC SINH */}
            <div className="lg:col-span-5 bg-[#FFFDFB] rounded-3xl p-5 sm:p-6 border-2 border-[#D8C4AD] shadow-md shadow-[#4A2E1B]/5 space-y-3 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <h3 className="font-serif-title font-black text-sm sm:text-base uppercase tracking-wider text-[#2A1D17]">
                  Ý TƯỞNG CỦA HỌC SINH
                </h3>
                <button
                  onClick={onOpenContribute}
                  className="text-xs font-bold text-[#681315] hover:underline cursor-pointer"
                >
                  Xem tất cả
                </button>
              </div>

              {/* 3 Student Projects */}
              <div className="space-y-2.5">
                <div className="p-2.5 rounded-2xl bg-[#F5EFEB] hover:bg-[#F9EDE1] border border-[#DECDBB] flex items-center justify-between gap-3 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-stone-300 shrink-0 shadow-inner">
                      <img src="/assets/images/dinh-doc-lap-front.jpg" alt="Idea 1" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xs font-bold text-stone-800">Làm QR giới thiệu di tích tại trường học</span>
                  </div>
                  <button 
                    onClick={() => handleLikeIdea(1)}
                    className="flex items-center gap-1 text-xs font-bold text-[#681315] hover:scale-110 transition-transform cursor-pointer"
                  >
                    <span>❤️</span>
                    <span>{studentIdeaLikes[1]}</span>
                  </button>
                </div>

                <div className="p-2.5 rounded-2xl bg-[#F5EFEB] hover:bg-[#F9EDE1] border border-[#DECDBB] flex items-center justify-between gap-3 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-stone-300 shrink-0 shadow-inner">
                      <img src="/assets/images/dia-dao-cu-chi.jpg" alt="Idea 2" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xs font-bold text-stone-800">Thiết kế tour tham quan di tích cho học sinh</span>
                  </div>
                  <button 
                    onClick={() => handleLikeIdea(2)}
                    className="flex items-center gap-1 text-xs font-bold text-[#681315] hover:scale-110 transition-transform cursor-pointer"
                  >
                    <span>❤️</span>
                    <span>{studentIdeaLikes[2]}</span>
                  </button>
                </div>

                <div className="p-2.5 rounded-2xl bg-[#F5EFEB] hover:bg-[#F9EDE1] border border-[#DECDBB] flex items-center justify-between gap-3 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-stone-300 shrink-0 shadow-inner">
                      <img src="/assets/images/ben-nha-rong.jpg" alt="Idea 3" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xs font-bold text-stone-800">Tạo bản đồ di tích quanh trường</span>
                  </div>
                  <button 
                    onClick={() => handleLikeIdea(3)}
                    className="flex items-center gap-1 text-xs font-bold text-[#681315] hover:scale-110 transition-transform cursor-pointer"
                  >
                    <span>❤️</span>
                    <span>{studentIdeaLikes[3]}</span>
                  </button>
                </div>
              </div>

              <button
                onClick={onOpenContribute}
                className="w-full py-3 rounded-xl bg-[#2A1D17] hover:bg-[#681315] text-white font-black text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-md"
              >
                + ĐỀ XUẤT Ý TƯỞNG
              </button>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 6. BOTTOM MOTTO BANNER WITH STUDENT ILLUSTRATION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-center">
        <ScrollReveal>
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-4 text-3xl sm:text-4xl">
              <span>🎒</span>
              <span>🏛️</span>
              <span>📚</span>
            </div>

            <div className="space-y-1.5 max-w-2xl mx-auto">
              <h3 className="font-serif-title text-base sm:text-xl font-black text-[#2A1D17]">
                Di tích kể câu chuyện của quá khứ.
              </h3>
              <h3 className="font-serif-title text-base sm:text-xl font-black text-[#681315]">
                Còn chúng ta quyết định câu chuyện ấy sẽ được tiếp tục như thế nào.
              </h3>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
