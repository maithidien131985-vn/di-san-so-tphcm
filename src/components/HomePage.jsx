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
  ExternalLink
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

  // Search Results Filtering
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

  // Featured Monument: Lò gốm cổ Hưng Lợi (hoặc Dinh Độc Lập / Củ Chi)
  const featuredMonument = useMemo(() => {
    return allMonuments.find(m => m.info.name.includes('Hưng Lợi') || m.info.name.includes('Lò gốm')) ||
           allMonuments.find(m => m.stt === 1) ||
           allMonuments[0];
  }, [allMonuments]);

  // Quick feature monument for 3-min section: Địa đạo Củ Chi
  const cuchiMonument = useMemo(() => {
    return allMonuments.find(m => m.stt === 2) || allMonuments[1] || allMonuments[0];
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
    <div className="bg-[#FAF7F2] min-h-screen text-[#2C241E] font-sans antialiased">
      {/* 1. HERO BANNER WITH PANORAMIC SAIGON VIEW */}
      <section className="relative bg-[#1A1A1A] text-white min-h-[540px] sm:min-h-[580px] flex flex-col justify-between overflow-hidden">
        {/* Background Image with Dark Vignette Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/images/dinh-doc-lap-front.jpg"
            alt="Di sản TP. Hồ Chí Minh"
            className="w-full h-full object-cover object-center opacity-40 scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-black/40 to-black/70" />
        </div>

        {/* Top Navbar */}
        <header className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#7E1819] border border-amber-400/40 flex items-center justify-center text-amber-200 shadow-md">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif-title font-black text-base sm:text-lg tracking-wider text-white block uppercase">
                DI SẢN
              </span>
              <span className="text-[10px] font-bold text-amber-200 tracking-widest block uppercase">
                TP. HỒ CHÍ MINH
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-semibold text-white/90">
            <a href="#home" className="text-white border-b-2 border-amber-400 pb-1 font-bold">Trang chủ</a>
            <button onClick={onOpenExplorer} className="hover:text-amber-300 transition-colors cursor-pointer">Khám phá di tích</button>
            <button onClick={onOpenMyMap} className="hover:text-amber-300 transition-colors cursor-pointer">Bản đồ di tích</button>
            <button onClick={() => onSelectMonument(1)} className="hover:text-amber-300 transition-colors cursor-pointer">Thử thách</button>
            <button onClick={onOpenContribute} className="hover:text-amber-300 transition-colors cursor-pointer">Ý tưởng – Hành động</button>
            <a href="#about-project" className="hover:text-amber-300 transition-colors">Giới thiệu</a>
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            <button 
              onClick={onOpenExplorer}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
              title="Tìm kiếm di tích"
            >
              <Search className="w-4 h-4 text-amber-200" />
            </button>
            <div 
              onClick={onOpenContribute}
              className="w-9 h-9 rounded-full bg-amber-400/20 border border-amber-400/50 flex items-center justify-center text-amber-200 font-bold text-xs cursor-pointer shadow-inner"
              title="Cộng đồng & Đóng góp"
            >
              👤
            </div>
          </div>
        </header>

        {/* Hero Main Content */}
        <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 my-auto">
          <div className="max-w-3xl space-y-4">
            <h1 className="font-serif-title font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-wide leading-tight drop-shadow-md">
              DI SẢN <br />
              <span className="text-amber-100">TP. HỒ CHÍ MINH</span>
            </h1>

            <h2 className="font-serif-title text-lg sm:text-2xl text-[#F5A623] font-bold tracking-wide">
              Hành trình khám phá những câu chuyện còn sống mãi
            </h2>

            <p className="text-sm sm:text-base text-gray-200 leading-relaxed font-normal max-w-2xl">
              Hàng trăm di tích. Hàng nghìn câu chuyện. Và một thế hệ trẻ có thể tiếp nối.
            </p>

            {/* 2 CTA Buttons */}
            <div className="pt-4 flex flex-wrap items-center gap-3.5">
              <button
                onClick={onOpenExplorer}
                className="px-6 py-3 rounded-xl bg-[#E58B24] hover:bg-[#cf7b1c] text-white font-bold text-xs sm:text-sm uppercase tracking-wider shadow-lg transition-all hover:scale-103 cursor-pointer flex items-center gap-2"
              >
                <Landmark className="w-4 h-4 text-white" />
                <span>Khám Phá Di Tích</span>
              </button>

              <button
                onClick={onOpenMyMap}
                className="px-6 py-3 rounded-xl bg-[#3B7E4B] hover:bg-[#326d40] text-white font-bold text-xs sm:text-sm uppercase tracking-wider shadow-lg transition-all hover:scale-103 cursor-pointer flex items-center gap-2"
              >
                <MapPin className="w-4 h-4 text-white" />
                <span>Khám Phá Gần Bạn</span>
              </button>
            </div>
          </div>
        </div>

        {/* Floating Search Bar prominently raised on top */}
        <div className="relative z-40 max-w-4xl w-full mx-auto px-4 -mb-8">
          <div className="bg-white rounded-2xl sm:rounded-full p-2.5 sm:p-3 shadow-2xl border-2 border-amber-200/60 ring-4 ring-black/10 flex flex-col sm:flex-row items-center gap-3 backdrop-blur-md">
            <div className="flex items-center gap-2 pl-3 text-xs sm:text-sm font-black text-gray-900 shrink-0">
              <Search className="w-4 h-4 text-[#3B7E4B]" />
              <span className="tracking-tight">Bạn muốn khám phá điều gì?</span>
            </div>

            <div className="relative flex-1 w-full">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm tên di tích, địa phương, nhân vật, sự kiện..."
                className="w-full py-2.5 px-4 text-xs sm:text-sm text-gray-900 placeholder-gray-400 bg-gray-50/80 rounded-xl sm:rounded-full focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3B7E4B] transition-all font-medium"
              />

              {/* Live search dropdown results */}
              {searchResults.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 p-2 z-50 max-h-80 overflow-y-auto divide-y divide-gray-100">
                  {searchResults.map(m => (
                    <div
                      key={m.stt}
                      onClick={() => {
                        onSelectMonument(m.stt);
                        setSearchTerm('');
                      }}
                      className="p-3 hover:bg-amber-50 rounded-xl cursor-pointer flex items-center justify-between group transition-colors"
                    >
                      <div>
                        <div className="text-xs font-bold text-[#7E1819] group-hover:underline">{m.info.name}</div>
                        <div className="text-[11px] text-gray-500">{m.info.address} • {m.info.ranking}</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#7E1819] group-hover:translate-x-1 transition-all" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => {
                if (searchTerm.trim()) {
                  onOpenExplorer();
                } else {
                  onOpenExplorer();
                }
              }}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl sm:rounded-full bg-[#3B7E4B] hover:bg-[#326d40] text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-102 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Search className="w-4 h-4" />
              <span className="sm:hidden">Tìm kiếm</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. INSPIRATIONAL INTRODUCTION SECTION (LỜI NGỎ DI SẢN) */}
      <section id="about-project" className="max-w-5xl mx-auto px-4 sm:px-6 pt-18 pb-8 relative z-10">
        <ScrollReveal>
          <div className="relative bg-[#FEFAF4] rounded-3xl p-6 sm:p-10 border border-[#EADBC8] shadow-sm overflow-hidden">
            {/* Decorative watermark */}
            <div className="absolute -right-8 -bottom-8 opacity-5 text-[#7E1819] pointer-events-none">
              <Landmark className="w-64 h-64" />
            </div>

            <div className="relative z-10 space-y-4 text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-300/60 text-[#7E1819] text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ký Ức Thành Phố &amp; Hành Trình Kết Nối</span>
              </div>

              <p className="font-serif-title text-base sm:text-lg text-[#3C2E24] font-medium leading-relaxed italic">
                “Mỗi viên gạch cũ đều mang một cái tên, một câu chuyện, một phần ký ức của thành phố này.”
              </p>

              <div className="space-y-3 text-xs sm:text-sm text-[#5A4B41] leading-relaxed text-justify sm:text-center">
                <p>
                  Giữa nhịp sống hối hả của một Sài Gòn - Hồ Chí Minh không ngừng đổi thay, vẫn có những mái ngói, những bức tường rêu phong lặng lẽ giữ lại cả một dòng thời gian đã qua. Chúng chứng kiến những biến động của lịch sử, những đổi thay của thành phố, và cả những điều bình dị nhất trong đời sống của bao thế hệ đã từng đi qua nơi đây.
                </p>
                <p>
                  Có bao nhiêu di tích bạn đã từng đi ngang qua mà chưa một lần dừng lại? Có bao nhiêu câu chuyện đang ngủ quên trong lòng thành phố, chỉ chờ một ai đó bước vào và lắng nghe?
                </p>
                <p className="font-bold text-[#7E1819] pt-1">
                  Chúng tôi bắt đầu hành trình này — không phải để kể lại lịch sử theo cách khô khan trong sách vở, mà để mời bạn chạm vào nó, theo cách gần gũi nhất với thế hệ mình.
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 3. KHÁM PHÁ THEO CÁCH CỦA BẠN (4 CARDS GRID) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ScrollReveal>
          <div className="text-center space-y-2 mb-8">
            <h2 className="font-serif-title font-black text-lg sm:text-2xl uppercase tracking-wider text-[#2C241E]">
              KHÁM PHÁ THEO CÁCH CỦA BẠN
            </h2>
            <div className="w-12 h-1 bg-[#7E1819] mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {/* Card 1: Khám phá theo địa phương */}
            <div
              onClick={onOpenMyMap}
              className="bg-white rounded-2xl p-5 border border-[#EAE3D9] hover:border-[#3B7E4B] shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between cursor-pointer group"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#3B7E4B] flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">
                  📍
                </div>
                <div>
                  <h3 className="font-serif-title font-black text-sm sm:text-base text-[#2C241E] group-hover:text-[#3B7E4B] transition-colors uppercase">
                    KHÁM PHÁ THEO ĐỊA PHƯƠNG
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    Tìm những di tích ngay quanh nơi bạn sống.
                  </p>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-[#3B7E4B] flex items-center justify-center group-hover:bg-[#3B7E4B] group-hover:text-white transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Card 2: Khám phá theo loại hình */}
            <div
              onClick={onOpenExplorer}
              className="bg-white rounded-2xl p-5 border border-[#EAE3D9] hover:border-[#BA8438] shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between cursor-pointer group"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#BA8438] flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">
                  🏛️
                </div>
                <div>
                  <h3 className="font-serif-title font-black text-sm sm:text-base text-[#2C241E] group-hover:text-[#BA8438] transition-colors uppercase">
                    KHÁM PHÁ THEO LOẠI HÌNH
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    Lịch sử - Khảo cổ - Kiến trúc - Danh lam thắng cảnh
                  </p>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <div className="w-8 h-8 rounded-full bg-amber-50 text-[#BA8438] flex items-center justify-center group-hover:bg-[#BA8438] group-hover:text-white transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Card 3: Khám phá theo câu chuyện */}
            <div
              onClick={() => onSelectMonument(1)}
              className="bg-white rounded-2xl p-5 border border-[#EAE3D9] hover:border-[#2980B9] shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between cursor-pointer group"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 text-[#2980B9] flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">
                  📖
                </div>
                <div>
                  <h3 className="font-serif-title font-black text-sm sm:text-base text-[#2C241E] group-hover:text-[#2980B9] transition-colors uppercase">
                    KHÁM PHÁ THEO CÂU CHUYỆN
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    Những câu chuyện về con người, sự kiện và vùng đất.
                  </p>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <div className="w-8 h-8 rounded-full bg-sky-50 text-[#2980B9] flex items-center justify-center group-hover:bg-[#2980B9] group-hover:text-white transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Card 4: Khám phá theo thử thách */}
            <div
              onClick={() => onSelectMonument(1)}
              className="bg-white rounded-2xl p-5 border border-[#EAE3D9] hover:border-[#8E44AD] shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between cursor-pointer group"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#8E44AD] flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">
                  🏆
                </div>
                <div>
                  <h3 className="font-serif-title font-black text-sm sm:text-base text-[#2C241E] group-hover:text-[#8E44AD] transition-colors uppercase">
                    KHÁM PHÁ THEO THỬ THÁCH
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    Trả lời câu hỏi – hoàn thành nhiệm vụ – nhận huy hiệu.
                  </p>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <div className="w-8 h-8 rounded-full bg-purple-50 text-[#8E44AD] flex items-center justify-center group-hover:bg-[#8E44AD] group-hover:text-white transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 4. ROW 1: DI TÍCH QUANH EM (MAP) & DI TÍCH HÔM NAY (FEATURED CARD) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ScrollReveal>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 7 Cols: DI TÍCH QUANH EM MAP */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-5 border border-[#EAE3D9] shadow-xs space-y-3 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-serif-title font-black text-sm sm:text-base uppercase tracking-wider text-[#7E1819]">
                    DI TÍCH QUANH EM
                  </span>
                </div>
                <button
                  onClick={onOpenMyMap}
                  className="text-xs font-bold text-[#7E1819] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <span>Xem tất cả</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Google My Maps Embed */}
              <div className="h-64 sm:h-72 rounded-2xl overflow-hidden border border-gray-200 relative z-0 bg-gray-100 shadow-inner">
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
                <div className="flex items-center gap-1.5 text-gray-600 font-semibold text-[11px]">
                  <MapPin className="w-3.5 h-3.5 text-[#7E1819]" />
                  <span>Bản đồ tọa độ 103 Di tích TP.HCM</span>
                </div>
                <a
                  href="https://www.google.com/maps/d/edit?mid=1UM24OubPpISXPfooW7VY8Vo4xMZ6dIg&usp=sharing"
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-[#7E1819] hover:underline flex items-center gap-1 text-[11px]"
                >
                  <span>Mở Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Right 5 Cols: DI TÍCH HÔM NAY (FEATURED RICH CARD) */}
            <div className="lg:col-span-5 bg-[#1B3E2B] text-white rounded-3xl p-5 sm:p-6 shadow-md flex flex-col justify-between space-y-4">
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
                <div className="h-40 rounded-2xl overflow-hidden bg-black/30 border border-white/10">
                  <img
                    src={featuredMonument.info.heroImage}
                    alt={featuredMonument.info.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div>
                  <h3 className="font-serif-title font-black text-lg sm:text-xl text-amber-100">
                    {featuredMonument.info.name}
                  </h3>
                  <p className="text-xs text-white/80 leading-relaxed mt-1 line-clamp-2">
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
                className="w-full py-2.5 rounded-xl bg-[#E58B24] hover:bg-[#cf7b1c] text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-102 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Khám phá câu chuyện</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 5. ROW 2: KHÔNG CÓ NHIỀU THỜI GIAN? (3 PHÚT) & QUICK CARD (CỦ CHI) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ScrollReveal>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 7 Cols: KHÔNG CÓ NHIỀU THỜI GIAN? */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-6 border border-[#EAE3D9] shadow-xs space-y-4">
              <div>
                <h3 className="font-serif-title font-black text-sm sm:text-base uppercase tracking-wider text-[#2C241E]">
                  KHÔNG CÓ NHIỀU THỜI GIAN?
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Khám phá một di tích trong 3 phút
                </p>
              </div>

              {/* 5 Quick Icons Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-center">
                <div 
                  onClick={onOpenMyMap}
                  className="p-3 rounded-2xl bg-[#FAF7F2] hover:bg-amber-100/50 border border-gray-100 cursor-pointer transition-all flex flex-col items-center gap-1.5 group"
                >
                  <div className="w-9 h-9 rounded-full bg-white shadow-2xs flex items-center justify-center text-[#7E1819] text-base group-hover:scale-110 transition-transform">
                    📍
                  </div>
                  <span className="text-[11px] font-bold text-gray-700">Ở đâu?</span>
                </div>

                <div 
                  onClick={() => onSelectMonument(1)}
                  className="p-3 rounded-2xl bg-[#FAF7F2] hover:bg-amber-100/50 border border-gray-100 cursor-pointer transition-all flex flex-col items-center gap-1.5 group"
                >
                  <div className="w-9 h-9 rounded-full bg-white shadow-2xs flex items-center justify-center text-[#7E1819] text-base group-hover:scale-110 transition-transform">
                    📅
                  </div>
                  <span className="text-[11px] font-bold text-gray-700">Khi nào?</span>
                </div>

                <div 
                  onClick={() => onSelectMonument(1)}
                  className="p-3 rounded-2xl bg-[#FAF7F2] hover:bg-amber-100/50 border border-gray-100 cursor-pointer transition-all flex flex-col items-center gap-1.5 group"
                >
                  <div className="w-9 h-9 rounded-full bg-white shadow-2xs flex items-center justify-center text-[#7E1819] text-base group-hover:scale-110 transition-transform">
                    👤
                  </div>
                  <span className="text-[11px] font-bold text-gray-700">Gắn với ai?</span>
                </div>

                <div 
                  onClick={() => onSelectMonument(1)}
                  className="p-3 rounded-2xl bg-[#FAF7F2] hover:bg-amber-100/50 border border-gray-100 cursor-pointer transition-all flex flex-col items-center gap-1.5 group"
                >
                  <div className="w-9 h-9 rounded-full bg-white shadow-2xs flex items-center justify-center text-[#7E1819] text-base group-hover:scale-110 transition-transform">
                    ✨
                  </div>
                  <span className="text-[11px] font-bold text-gray-700">Điều gì đặc biệt?</span>
                </div>

                <div 
                  onClick={() => onSelectMonument(1)}
                  className="p-3 rounded-2xl bg-[#FAF7F2] hover:bg-amber-100/50 border border-gray-100 cursor-pointer transition-all flex flex-col items-center gap-1.5 group"
                >
                  <div className="w-9 h-9 rounded-full bg-white shadow-2xs flex items-center justify-center text-[#7E1819] text-base group-hover:scale-110 transition-transform">
                    🛡️
                  </div>
                  <span className="text-[11px] font-bold text-gray-700">Vì sao cần bảo vệ?</span>
                </div>
              </div>
            </div>

            {/* Right 5 Cols: QUICK FEATURE CARD (ĐỊA ĐẠO CỦ CHI) */}
            <div 
              onClick={() => onSelectMonument(cuchiMonument.stt)}
              className="lg:col-span-5 bg-white rounded-3xl p-4 sm:p-5 border border-[#EAE3D9] hover:border-[#7E1819]/50 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center gap-4 group"
            >
              <div className="w-28 sm:w-36 h-24 sm:h-28 rounded-2xl overflow-hidden bg-gray-100 shrink-0">
                <img
                  src={cuchiMonument.info.heroImage}
                  alt={cuchiMonument.info.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="space-y-1.5">
                <h4 className="font-serif-title font-black text-sm sm:text-base text-[#2C241E] group-hover:text-[#7E1819] transition-colors">
                  {cuchiMonument.info.name}
                </h4>
                <p className="text-xs text-gray-500 line-clamp-2">
                  {cuchiMonument.info.overview}
                </p>
                <div className="pt-1 text-xs font-bold text-[#7E1819] flex items-center gap-1 group-hover:underline">
                  <span>Khám phá ngay</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 6. ROW 3: THỬ THÁCH NHÀ KHÁM PHÁ & HỆ THỐNG HUY HIỆU */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ScrollReveal>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 7 Cols: THỬ THÁCH NHÀ KHÁM PHÁ */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-6 border border-[#EAE3D9] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif-title font-black text-sm sm:text-base uppercase tracking-wider text-[#2C241E]">
                  THỬ THÁCH NHÀ KHÁM PHÁ
                </h3>
                <button
                  onClick={() => onSelectMonument(1)}
                  className="text-xs font-bold text-[#7E1819] hover:underline cursor-pointer"
                >
                  Xem tất cả
                </button>
              </div>

              {/* 5 Interactive Mini Challenges */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-center">
                <div 
                  onClick={() => onSelectMonument(1)}
                  className="p-3 rounded-2xl bg-[#FAF7F2] hover:bg-amber-100/50 border border-gray-100 cursor-pointer transition-all flex flex-col items-center gap-1.5 group"
                >
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 text-[#BA8438] flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
                    🏛️
                  </div>
                  <span className="text-[11px] font-bold text-gray-700 leading-snug">Đoán di tích qua 3 manh mối</span>
                </div>

                <div 
                  onClick={onOpenMyMap}
                  className="p-3 rounded-2xl bg-[#FAF7F2] hover:bg-amber-100/50 border border-gray-100 cursor-pointer transition-all flex flex-col items-center gap-1.5 group"
                >
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#3B7E4B] flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
                    🗺️
                  </div>
                  <span className="text-[11px] font-bold text-gray-700 leading-snug">Tìm di tích trên bản đồ</span>
                </div>

                <div 
                  onClick={() => onSelectMonument(2)}
                  className="p-3 rounded-2xl bg-[#FAF7F2] hover:bg-amber-100/50 border border-gray-100 cursor-pointer transition-all flex flex-col items-center gap-1.5 group"
                >
                  <div className="w-10 h-10 rounded-2xl bg-sky-100 text-[#2980B9] flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
                    📜
                  </div>
                  <span className="text-[11px] font-bold text-gray-700 leading-snug">Ai – ở đâu – khi nào?</span>
                </div>

                <div 
                  onClick={() => onSelectMonument(1)}
                  className="p-3 rounded-2xl bg-[#FAF7F2] hover:bg-amber-100/50 border border-gray-100 cursor-pointer transition-all flex flex-col items-center gap-1.5 group"
                >
                  <div className="w-10 h-10 rounded-2xl bg-purple-100 text-[#8E44AD] flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
                    🧩
                  </div>
                  <span className="text-[11px] font-bold text-gray-700 leading-snug">Ghép hiện vật với di tích</span>
                </div>

                <div 
                  onClick={onOpenContribute}
                  className="p-3 rounded-2xl bg-[#FAF7F2] hover:bg-amber-100/50 border border-gray-100 cursor-pointer transition-all flex flex-col items-center gap-1.5 group"
                >
                  <div className="w-10 h-10 rounded-2xl bg-rose-100 text-[#C0392B] flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
                    🤝
                  </div>
                  <span className="text-[11px] font-bold text-gray-700 leading-snug">Bạn sẽ làm gì để bảo vệ di tích?</span>
                </div>
              </div>
            </div>

            {/* Right 5 Cols: HỆ THỐNG HUY HIỆU */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-5 sm:p-6 border border-[#EAE3D9] shadow-xs space-y-4 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <h3 className="font-serif-title font-black text-sm sm:text-base uppercase tracking-wider text-[#2C241E]">
                  HỆ THỐNG HUY HIỆU
                </h3>
                <button
                  onClick={() => onSelectMonument(1)}
                  className="text-xs font-bold text-[#7E1819] hover:underline cursor-pointer"
                >
                  Xem hành trình
                </button>
              </div>

              {/* Badges Display */}
              <div className="flex items-center justify-around py-1">
                <div className="text-center space-y-1">
                  <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl shadow-md">
                    🏛️
                  </div>
                  <div className="text-[10px] font-bold text-gray-600">Dinh Độc Lập</div>
                </div>

                <div className="text-center space-y-1">
                  <div className="w-12 h-12 rounded-full bg-amber-500 text-white flex items-center justify-center text-xl shadow-md">
                    ⚔️
                  </div>
                  <div className="text-[10px] font-bold text-gray-600">Củ Chi</div>
                </div>

                <div className="text-center space-y-1">
                  <div className="w-12 h-12 rounded-full bg-slate-700 text-white flex items-center justify-center text-xl shadow-md">
                    🌲
                  </div>
                  <div className="text-[10px] font-bold text-gray-600">Rừng Sác</div>
                </div>

                <div className="text-center space-y-1">
                  <div className="w-12 h-12 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-xl border border-dashed border-gray-400">
                    🔒
                  </div>
                  <div className="text-[10px] font-bold text-gray-400">Chưa mở</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-xs font-bold text-gray-700">
                  <span>Huy hiệu của bạn:</span>
                  <span className="text-[#7E1819]">4 / 12</span>
                </div>
                <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-500 to-[#7E1819] rounded-full w-1/3 transition-all duration-1000" />
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 7. ROW 4: DI SẢN CẦN BẠN & Ý TƯỞNG CỦA HỌC SINH */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ScrollReveal>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 7 Cols: DI SẢN CẦN BẠN */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-6 border border-[#EAE3D9] shadow-xs space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="font-serif-title font-black text-sm sm:text-base uppercase tracking-wider text-[#2C241E]">
                  DI SẢN CẦN BẠN
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Bạn có thể làm gì?
                </p>
              </div>

              {/* 6 Action Items */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">
                <div 
                  onClick={onOpenContribute}
                  className="p-2.5 rounded-2xl bg-[#FAF7F2] hover:bg-emerald-50 cursor-pointer transition-colors flex flex-col items-center gap-1 group"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#3B7E4B] flex items-center justify-center text-sm">
                    ✓
                  </div>
                  <span className="text-[10px] font-bold text-gray-700 leading-tight">Ghi lại hiện trạng</span>
                </div>

                <div 
                  onClick={onOpenContribute}
                  className="p-2.5 rounded-2xl bg-[#FAF7F2] hover:bg-emerald-50 cursor-pointer transition-colors flex flex-col items-center gap-1 group"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#3B7E4B] flex items-center justify-center text-sm">
                    📢
                  </div>
                  <span className="text-[10px] font-bold text-gray-700 leading-tight">Chia sẻ câu chuyện</span>
                </div>

                <div 
                  onClick={onOpenContribute}
                  className="p-2.5 rounded-2xl bg-[#FAF7F2] hover:bg-emerald-50 cursor-pointer transition-colors flex flex-col items-center gap-1 group"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#3B7E4B] flex items-center justify-center text-sm">
                    🌿
                  </div>
                  <span className="text-[10px] font-bold text-gray-700 leading-tight">Giữ gìn cảnh quan</span>
                </div>

                <div 
                  onClick={onOpenExplorer}
                  className="p-2.5 rounded-2xl bg-[#FAF7F2] hover:bg-emerald-50 cursor-pointer transition-colors flex flex-col items-center gap-1 group"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#3B7E4B] flex items-center justify-center text-sm">
                    📖
                  </div>
                  <span className="text-[10px] font-bold text-gray-700 leading-tight">Tìm hiểu thêm</span>
                </div>

                <div 
                  onClick={onOpenContribute}
                  className="p-2.5 rounded-2xl bg-[#FAF7F2] hover:bg-emerald-50 cursor-pointer transition-colors flex flex-col items-center gap-1 group"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#3B7E4B] flex items-center justify-center text-sm">
                    👥
                  </div>
                  <span className="text-[10px] font-bold text-gray-700 leading-tight">Rủ bạn bè cùng khám phá</span>
                </div>

                <div 
                  onClick={onOpenContribute}
                  className="p-2.5 rounded-2xl bg-[#FAF7F2] hover:bg-emerald-50 cursor-pointer transition-colors flex flex-col items-center gap-1 group"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#3B7E4B] flex items-center justify-center text-sm">
                    💡
                  </div>
                  <span className="text-[10px] font-bold text-gray-700 leading-tight">Đề xuất ý tưởng</span>
                </div>
              </div>

              <button
                onClick={onOpenContribute}
                className="w-full py-3 rounded-2xl bg-[#2E5A36] hover:bg-[#254b2c] text-white font-black text-xs uppercase tracking-wider shadow transition-all cursor-pointer"
              >
                TÔI MUỐN HÀNH ĐỘNG
              </button>
            </div>

            {/* Right 5 Cols: Ý TƯỞNG CỦA HỌC SINH */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-5 sm:p-6 border border-[#EAE3D9] shadow-xs space-y-3 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <h3 className="font-serif-title font-black text-sm sm:text-base uppercase tracking-wider text-[#2C241E]">
                  Ý TƯỞNG CỦA HỌC SINH
                </h3>
                <button
                  onClick={onOpenContribute}
                  className="text-xs font-bold text-[#7E1819] hover:underline cursor-pointer"
                >
                  Xem tất cả
                </button>
              </div>

              {/* 3 Student Projects */}
              <div className="space-y-2.5">
                <div className="p-2.5 rounded-2xl bg-[#FAF7F2] hover:bg-amber-50/50 border border-gray-100 flex items-center justify-between gap-3 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-200 shrink-0">
                      <img src="/assets/images/dinh-doc-lap-front.jpg" alt="Idea 1" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xs font-bold text-gray-800">Làm QR giới thiệu di tích tại trường học</span>
                  </div>
                  <button 
                    onClick={() => handleLikeIdea(1)}
                    className="flex items-center gap-1 text-xs font-bold text-rose-600 hover:scale-110 transition-transform cursor-pointer"
                  >
                    <span>❤️</span>
                    <span>{studentIdeaLikes[1]}</span>
                  </button>
                </div>

                <div className="p-2.5 rounded-2xl bg-[#FAF7F2] hover:bg-amber-50/50 border border-gray-100 flex items-center justify-between gap-3 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-200 shrink-0">
                      <img src="/assets/images/dia-dao-cu-chi.jpg" alt="Idea 2" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xs font-bold text-gray-800">Thiết kế tour tham quan di tích cho học sinh</span>
                  </div>
                  <button 
                    onClick={() => handleLikeIdea(2)}
                    className="flex items-center gap-1 text-xs font-bold text-rose-600 hover:scale-110 transition-transform cursor-pointer"
                  >
                    <span>❤️</span>
                    <span>{studentIdeaLikes[2]}</span>
                  </button>
                </div>

                <div className="p-2.5 rounded-2xl bg-[#FAF7F2] hover:bg-amber-50/50 border border-gray-100 flex items-center justify-between gap-3 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-200 shrink-0">
                      <img src="/assets/images/ben-nha-rong.jpg" alt="Idea 3" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xs font-bold text-gray-800">Tạo bản đồ di tích quanh trường</span>
                  </div>
                  <button 
                    onClick={() => handleLikeIdea(3)}
                    className="flex items-center gap-1 text-xs font-bold text-rose-600 hover:scale-110 transition-transform cursor-pointer"
                  >
                    <span>❤️</span>
                    <span>{studentIdeaLikes[3]}</span>
                  </button>
                </div>
              </div>

              <button
                onClick={onOpenContribute}
                className="w-full py-2.5 rounded-xl border-2 border-gray-800 text-gray-900 hover:bg-gray-900 hover:text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                + ĐỀ XUẤT Ý TƯỞNG
              </button>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 8. BOTTOM MOTTO BANNER WITH STUDENT ILLUSTRATION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-center">
        <ScrollReveal>
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-4 text-3xl sm:text-4xl">
              <span>🎒</span>
              <span>🏛️</span>
              <span>📚</span>
            </div>

            <div className="space-y-1.5 max-w-2xl mx-auto">
              <h3 className="font-serif-title text-base sm:text-xl font-black text-[#2C241E]">
                Di tích kể câu chuyện của quá khứ.
              </h3>
              <h3 className="font-serif-title text-base sm:text-xl font-black text-[#7E1819]">
                Còn chúng ta quyết định câu chuyện ấy sẽ được tiếp tục như thế nào.
              </h3>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
