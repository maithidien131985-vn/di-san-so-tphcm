import React, { useState, useMemo } from 'react';
import { 
  Compass, 
  Sparkles, 
  Award, 
  ShieldCheck, 
  Flame, 
  MapPin, 
  ChevronRight, 
  ArrowRight, 
  Search, 
  CheckCircle2, 
  Lock, 
  Unlock, 
  Printer, 
  Share2, 
  Calendar, 
  Layers, 
  GitBranch, 
  Clock, 
  Grid, 
  Star, 
  BookOpen, 
  ExternalLink, 
  User, 
  LogIn, 
  RefreshCw,
  Landmark,
  Eye,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { allMonumentsList } from '../data/allMonumentsData';
import soundEffects from '../utils/soundEffects';

export default function PersonalJourneyPage({
  activePassport,
  onOpenPassportModal,
  onSelectMonument,
  onNavigate
}) {
  const [activeTrack, setActiveTrack] = useState('all'); // 'all' | 'track-1' | 'track-2' | 'track-3' | 'track-4'
  const [viewMode, setViewMode] = useState('roadmap'); // 'roadmap' | 'timeline' | 'matrix'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState('all');

  const visitedMap = useMemo(() => {
    return activePassport?.visitedMonuments || {};
  }, [activePassport]);

  const visitedCount = Object.keys(visitedMap).length;
  const progressPercent = Math.min(100, Math.round((visitedCount / 103) * 100));

  // Determine Explorer Level
  const explorerRank = useMemo(() => {
    if (visitedCount >= 103) return { title: 'Huyền Thoại 103 Di Tích', icon: '👑', color: 'from-amber-400 to-yellow-300 text-amber-950' };
    if (visitedCount >= 50) return { title: 'Đại Sứ Di Sản Học Đường', icon: '🎖️', color: 'from-red-600 to-rose-500 text-white' };
    if (visitedCount >= 15) return { title: 'Chuyên Gia Di Tích Sài Gòn', icon: '🏛️', color: 'from-purple-600 to-indigo-500 text-white' };
    if (visitedCount >= 5) return { title: 'Nhà Thám Hiểm Tập Sự', icon: '🎒', color: 'from-blue-600 to-cyan-500 text-white' };
    return { title: 'Tân Binh Thám Hiểm', icon: '🧭', color: 'from-emerald-600 to-teal-500 text-white' };
  }, [visitedCount]);

  // Thematic Tracks grouping
  const tracks = useMemo(() => [
    {
      id: 'track-1',
      name: 'Mốc Son Kháng Chiến & Địa Chỉ Đỏ',
      icon: '🚩',
      color: '#B31D21',
      bgGlow: 'from-red-950/80 via-[#3B0709]/90 to-[#1F0405]',
      desc: 'Các di tích lịch sử ghi dấu bước chân anh hùng, chiến khu, địa đạo và thời khắc giải phóng.',
      filterFn: (m) => m.info.type?.toLowerCase().includes('lịch sử') || m.info.badge?.toLowerCase().includes('quốc gia đặc biệt') || m.stt <= 25
    },
    {
      id: 'track-2',
      name: 'Tuyệt Tác Kiến Trúc & Đô Thị Sài Gòn',
      icon: '🏛️',
      color: '#D97706',
      bgGlow: 'from-amber-950/80 via-[#3B1E05]/90 to-[#1F1003]',
      desc: 'Công trình kiến trúc nghệ thuật tiêu biểu, dinh thự, nhà hát, bưu điện và dấu ấn đô thị hơn 300 năm.',
      filterFn: (m) => m.info.type?.toLowerCase().includes('kiến trúc') || (m.stt > 25 && m.stt <= 55)
    },
    {
      id: 'track-3',
      name: 'Không Gian Văn Hóa & Tín Ngưỡng Dân Gian',
      icon: '🛕',
      color: '#059669',
      bgGlow: 'from-emerald-950/80 via-[#052E1E]/90 to-[#02170F]',
      desc: 'Chùa cổ, đình làng, hội quán và không gian lưu giữ phong tục tín ngưỡng độc đáo của phương Nam.',
      filterFn: (m) => m.info.type?.toLowerCase().includes('văn hóa') || m.info.name?.toLowerCase().includes('đình') || m.info.name?.toLowerCase().includes('chùa') || (m.stt > 55 && m.stt <= 80)
    },
    {
      id: 'track-4',
      name: 'Cội Nguồn Khảo Cổ & Căn Cứ Ven Đô',
      icon: '🏺',
      color: '#7C3AED',
      bgGlow: 'from-purple-950/80 via-[#260B3B]/90 to-[#12041D]',
      desc: 'Di chỉ khảo cổ học Giồng Cá Vồ, lò gốm cổ, căn cứ du kích Rừng Sác và địa chỉ đỏ ngoại thành.',
      filterFn: (m) => m.info.type?.toLowerCase().includes('khảo cổ') || m.stt > 80
    }
  ], []);

  // Filtered monuments based on track, district, and search term
  const displayedMonuments = useMemo(() => {
    return allMonumentsList.filter((m) => {
      // Track filter
      if (activeTrack !== 'all') {
        const tr = tracks.find((t) => t.id === activeTrack);
        if (tr && !tr.filterFn(m)) return false;
      }
      // District filter
      if (selectedDistrict !== 'all') {
        if (!m.info.address?.toLowerCase().includes(selectedDistrict.toLowerCase())) return false;
      }
      // Search
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        return (
          m.info.name.toLowerCase().includes(q) ||
          m.info.address.toLowerCase().includes(q) ||
          `${m.stt}` === q
        );
      }
      return true;
    });
  }, [activeTrack, selectedDistrict, searchTerm, tracks]);

  // Chronological timeline of visited monuments
  const visitedTimeline = useMemo(() => {
    if (!activePassport?.visitedMonuments) return [];
    return Object.entries(activePassport.visitedMonuments)
      .map(([stt, data]) => {
        const mon = allMonumentsList.find((m) => m.stt === parseInt(stt)) || {
          stt: parseInt(stt),
          info: { name: data.name || `Di tích #${stt}`, address: 'TP.HCM', heroImage: '' }
        };
        return {
          ...data,
          monument: mon,
          dateObj: new Date(data.visitedAt || Date.now())
        };
      })
      .sort((a, b) => b.dateObj - a.dateObj);
  }, [activePassport]);

  const handleNodeClick = (monument) => {
    soundEffects.playTap();
    setSelectedNode(monument);
  };

  const handleGoToMonument = (stt) => {
    soundEffects.playTap();
    if (onSelectMonument) onSelectMonument(stt);
  };

  return (
    <div className="min-h-screen bg-[#140D0B] text-white select-none pb-20">
      
      {/* ========================================================================= */}
      {/* 1. HERO PROFILE DASHBOARD BANNER */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#2B080A] via-[#1A090A] to-[#140D0B] border-b border-amber-500/20 pt-8 pb-10 px-4 sm:px-6 lg:px-8">
        {/* Background glow effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-6 relative z-10">
          {/* Top Bar Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  soundEffects.playTap();
                  if (onNavigate) onNavigate('home');
                }}
                className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-amber-200 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>&larr; Trang Chủ</span>
              </button>
              <span className="text-stone-500 text-xs">•</span>
              <span className="text-xs text-amber-400/90 font-bold uppercase tracking-wider">
                Hành Trình Di Sản Cá Nhân
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  soundEffects.playTap();
                  window.print();
                }}
                className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                title="In hoặc xuất bản đồ lộ trình học tập"
              >
                <Printer className="w-3.5 h-3.5 text-amber-300" />
                <span>In Sơ Đồ Báo Cáo</span>
              </button>

              <button
                onClick={() => {
                  soundEffects.playTap();
                  if (onOpenPassportModal) onOpenPassportModal();
                }}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-amber-950 text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shadow-md hover:scale-102"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{activePassport ? 'Đổi Hộ Chiếu' : 'Đăng Nhập / Nhận Mã'}</span>
              </button>
            </div>
          </div>

          {/* User Profile Card */}
          <div className="bg-gradient-to-br from-[#3D0A0E] via-[#2A0709] to-[#1F0507] rounded-3xl p-6 sm:p-8 border-2 border-amber-400/40 shadow-2xl relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              
              {/* Avatar Mascot & Main Title */}
              <div className="lg:col-span-4 flex items-center gap-4 sm:gap-5">
                <div className="relative">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-5xl sm:text-6xl shadow-xl ring-4 ring-amber-300/40 transform hover:scale-105 transition-transform">
                    {activePassport?.avatar || '🦁'}
                  </div>
                  <span className="absolute -bottom-2 -right-1 px-2 py-0.5 rounded-full bg-red-600 text-white font-black text-[9px] uppercase border border-amber-300 shadow">
                    Học sinh
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] uppercase font-black tracking-widest text-amber-300 bg-black/40 px-2 py-0.5 rounded-md border border-amber-400/30">
                      MÃ: {activePassport?.code || 'CHẾ ĐỘ TỰ DO'}
                    </span>
                  </div>
                  <h2 className="font-serif-title font-black text-xl sm:text-2xl text-amber-100 leading-tight">
                    {activePassport?.fullName || 'Nhà Thám Hiểm Trẻ Tuổi'}
                  </h2>
                  <p className="text-xs text-rose-200/80">
                    {activePassport?.school || 'TP. Hồ Chí Minh'} {activePassport?.grade ? `• ${activePassport.grade}` : ''}
                  </p>
                  
                  {/* Explorer Rank Badge */}
                  <div className="pt-1">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black shadow-md bg-gradient-to-r ${explorerRank.color}`}>
                      <span>{explorerRank.icon}</span>
                      <span>{explorerRank.title}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Summary Metrics */}
              <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t lg:border-t-0 lg:border-l border-amber-500/20 pt-4 lg:pt-0 lg:pl-6">
                
                {/* Metric 1 */}
                <div className="p-3.5 rounded-2xl bg-black/40 border border-amber-500/20 space-y-1 text-center sm:text-left">
                  <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-bold">
                    Di tích mở khóa
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-amber-300">
                    {visitedCount} <span className="text-xs text-neutral-400 font-normal">/ 103</span>
                  </div>
                  <div className="text-[10px] text-emerald-400 font-bold">
                    Đạt {progressPercent}% lộ trình
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="p-3.5 rounded-2xl bg-black/40 border border-amber-500/20 space-y-1 text-center sm:text-left">
                  <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-bold">
                    Điểm kinh nghiệm
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-amber-300">
                    {activePassport?.totalXP || 0} <span className="text-xs text-neutral-400 font-normal">XP</span>
                  </div>
                  <div className="text-[10px] text-amber-400 font-bold">
                    Tích lũy từ câu đố &amp; học tập
                  </div>
                </div>

                {/* Metric 3 */}
                <div className="p-3.5 rounded-2xl bg-black/40 border border-amber-500/20 space-y-1 text-center sm:text-left">
                  <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-bold">
                    Chuỗi thám hiểm
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-orange-400 flex items-center justify-center sm:justify-start gap-1">
                    <span>{activePassport?.streakDays || 1}</span>
                    <Flame className="w-5 h-5 text-orange-400 fill-orange-400" />
                  </div>
                  <div className="text-[10px] text-neutral-400 font-bold">
                    Khám phá đều đặn
                  </div>
                </div>

                {/* Metric 4 */}
                <div className="p-3.5 rounded-2xl bg-black/40 border border-amber-500/20 space-y-1 text-center sm:text-left">
                  <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-bold">
                    Huy hiệu đạt được
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-amber-300">
                    {activePassport?.badges?.length || 1} <span className="text-xs text-neutral-400 font-normal">huy hiệu</span>
                  </div>
                  <div className="text-[10px] text-amber-400 font-bold">
                    Vinh danh thành tích
                  </div>
                </div>

              </div>

            </div>

            {/* Overall Progress Line */}
            <div className="mt-5 pt-4 border-t border-amber-500/20 space-y-2">
              <div className="flex items-center justify-between text-xs text-rose-200">
                <span className="font-bold">Tiến độ khám phá toàn bộ 103 Di tích TP.HCM:</span>
                <span className="font-black text-amber-300">{visitedCount} / 103 ({progressPercent}%)</span>
              </div>
              <div className="w-full h-3.5 bg-black/60 rounded-full overflow-hidden border border-amber-500/30 p-0.5">
                <div 
                  className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-yellow-300 rounded-full transition-all duration-1000 shadow-sm"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. DIAGRAM CONTROLS & THEMATIC TABS */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        
        {/* Controls Bar: Switch View Modes & Thematic Filter */}
        <div className="bg-[#1C1412] rounded-3xl p-4 sm:p-5 border border-amber-500/20 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-xl">
          
          {/* View Modes */}
          <div className="inline-flex rounded-2xl bg-black/50 p-1 border border-white/10 shrink-0">
            <button
              onClick={() => {
                soundEffects.playTap();
                setViewMode('roadmap');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'roadmap'
                  ? 'bg-amber-500 text-amber-950 font-black shadow-md'
                  : 'text-neutral-300 hover:text-white'
              }`}
            >
              <GitBranch className="w-4 h-4" />
              <span>Sơ Đồ Nhánh Lộ Trình</span>
            </button>

            <button
              onClick={() => {
                soundEffects.playTap();
                setViewMode('timeline');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'timeline'
                  ? 'bg-amber-500 text-amber-950 font-black shadow-md'
                  : 'text-neutral-300 hover:text-white'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Dòng Thời Gian ({visitedCount})</span>
            </button>

            <button
              onClick={() => {
                soundEffects.playTap();
                setViewMode('matrix');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'matrix'
                  ? 'bg-amber-500 text-amber-950 font-black shadow-md'
                  : 'text-neutral-300 hover:text-white'
              }`}
            >
              <Grid className="w-4 h-4" />
              <span>Ma Trận 103 Điểm</span>
            </button>
          </div>

          {/* Search and District filter */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm tên di tích, số #STT..."
                className="w-full py-2 pl-8 pr-3 text-xs bg-black/40 border border-white/15 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
              />
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
            </div>
          </div>
        </div>

        {/* 4 THEMATIC TRACKS SELECTOR BAR */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          <button
            onClick={() => {
              soundEffects.playTap();
              setActiveTrack('all');
            }}
            className={`p-3.5 rounded-2xl border transition-all text-left cursor-pointer ${
              activeTrack === 'all'
                ? 'bg-amber-500/20 border-amber-400 text-amber-200 ring-2 ring-amber-400/30'
                : 'bg-[#18110F] border-white/10 text-neutral-300 hover:border-amber-500/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs">⭐ Toàn Bộ Tuyến</span>
              <span className="text-[10px] bg-black/40 px-2 py-0.5 rounded font-mono font-black text-amber-400">
                103
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 mt-1 line-clamp-1">Tất cả di tích TP.HCM</p>
          </button>

          {tracks.map((track) => {
            const isSelected = activeTrack === track.id;
            const countInTrack = allMonumentsList.filter(track.filterFn).length;
            const visitedInTrack = allMonumentsList.filter(track.filterFn).filter(m => !!visitedMap[m.stt]).length;

            return (
              <button
                key={track.id}
                onClick={() => {
                  soundEffects.playTap();
                  setActiveTrack(track.id);
                }}
                className={`p-3.5 rounded-2xl border transition-all text-left cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500/20 border-amber-400 text-amber-200 ring-2 ring-amber-400/30 shadow-lg'
                    : 'bg-[#18110F] border-white/10 text-neutral-300 hover:border-amber-500/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs truncate max-w-[130px]">
                    {track.icon} {track.name}
                  </span>
                  <span className="text-[10px] bg-black/40 px-1.5 py-0.5 rounded font-mono font-black text-amber-300">
                    {visitedInTrack}/{countInTrack}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 mt-1 line-clamp-1">{track.desc}</p>
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* 3. MAIN DIAGRAM RENDER AREA */}
        {/* ========================================================================= */}

        {/* MODE A: ROADMAP FLOWCHART DIAGRAM */}
        {viewMode === 'roadmap' && (
          <div className="space-y-6">
            <div className="p-4 sm:p-6 rounded-3xl bg-[#17110F] border border-amber-500/20 shadow-2xl relative overflow-hidden">
              
              {/* Roadmap Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <GitBranch className="w-4 h-4" />
                      <span>Sơ Đồ Tuyến Khám Phá &amp; Mở Khóa Dấu Mộc</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                      {displayedMonuments.length} Điểm di tích
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400">
                    Nhấp vào từng nút để xem hồ sơ, khám phá lịch sử và ghi nhận hành trình của bạn.
                  </p>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-3 text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-300 shadow-sm" />
                    <span className="text-neutral-300">Đã mở khóa ({visitedCount})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-amber-400 animate-pulse border border-amber-200 shadow-sm" />
                    <span className="text-neutral-300">Gợi ý tiếp theo</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-neutral-700 border border-neutral-600" />
                    <span className="text-neutral-400">Chưa mở khóa</span>
                  </div>
                </div>
              </div>

              {/* Interactive Tree & Flow Diagram */}
              <div className="py-6 overflow-x-auto">
                <div className="min-w-[800px] space-y-8">
                  
                  {/* Start Hub Node */}
                  <div className="flex items-center justify-center">
                    <div className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-amber-950 font-black text-sm shadow-xl flex items-center gap-2.5 border-2 border-amber-200">
                      <Compass className="w-5 h-5" />
                      <span>TRUNG TÂM KHỞI HÀNH THÁM HIỂM 103 DI TÍCH TP.HCM</span>
                    </div>
                  </div>

                  {/* Stem Connection Line */}
                  <div className="w-0.5 h-8 bg-gradient-to-b from-amber-400 to-amber-500/30 mx-auto" />

                  {/* Nodes Grid connected in thematic branches */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {displayedMonuments.map((m, idx) => {
                      const isVisited = !!visitedMap[m.stt];
                      const isNextRecommended = !isVisited && idx === displayedMonuments.findIndex(x => !visitedMap[x.stt]);
                      const visitData = visitedMap[m.stt];

                      return (
                        <div
                          key={m.stt}
                          onClick={() => handleNodeClick(m)}
                          className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 group ${
                            isVisited
                              ? 'bg-gradient-to-br from-[#2D0B0E] to-[#1F0709] border-amber-400/80 ring-2 ring-amber-400/20 shadow-xl hover:scale-102'
                              : isNextRecommended
                              ? 'bg-[#221610] border-amber-400 shadow-xl ring-4 ring-amber-400/30 animate-pulse hover:scale-102'
                              : 'bg-[#150F0D] border-white/10 hover:border-amber-500/50 opacity-75 hover:opacity-100 hover:scale-101'
                          }`}
                        >
                          {/* Top Badges */}
                          <div className="flex items-center justify-between gap-2">
                            <span className={`text-[10px] font-mono font-black px-2 py-0.5 rounded-md ${
                              isVisited ? 'bg-amber-400 text-amber-950' : 'bg-white/10 text-neutral-400'
                            }`}>
                              #{m.stt}
                            </span>

                            {isVisited ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/40">
                                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                <span>Đã Đóng Dấu</span>
                              </span>
                            ) : isNextRecommended ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-black text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-500/40 animate-bounce">
                                <Sparkles className="w-3 h-3 text-amber-300" />
                                <span>Gợi ý tiếp</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] text-neutral-500">
                                <Lock className="w-3 h-3" />
                                <span>Chưa mở</span>
                              </span>
                            )}
                          </div>

                          {/* Monument Name */}
                          <div className="space-y-1">
                            <h4 className="font-serif-title font-bold text-sm text-amber-100 group-hover:text-amber-300 transition-colors line-clamp-2 leading-snug">
                              {m.info.name}
                            </h4>
                            <p className="text-[11px] text-neutral-400 truncate">
                              📍 {m.info.address || 'TP. Hồ Chí Minh'}
                            </p>
                          </div>

                          {/* Footer Action of Node */}
                          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                            {isVisited ? (
                              <span className="text-[10px] text-amber-300 font-bold flex items-center gap-1">
                                <Star className="w-3 h-3 fill-amber-300" />
                                <span>+{visitData?.earnedXP || 100} XP</span>
                              </span>
                            ) : (
                              <span className="text-[10px] text-neutral-400">
                                {m.info.type || 'Di tích'}
                              </span>
                            )}

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleGoToMonument(m.stt);
                              }}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 ${
                                isVisited
                                  ? 'bg-white/10 hover:bg-white/20 text-white'
                                  : 'bg-amber-500 hover:bg-amber-400 text-amber-950 font-black'
                              }`}
                            >
                              <span>Khám phá</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* MODE B: CHRONOLOGICAL TIMELINE */}
        {viewMode === 'timeline' && (
          <div className="p-6 rounded-3xl bg-[#17110F] border border-amber-500/20 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="space-y-1">
                <h3 className="font-serif-title font-black text-lg text-amber-200 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-400" />
                  <span>Dòng Thời Gian Hành Trình Khám Phá Của Bạn</span>
                </h3>
                <p className="text-xs text-neutral-400">
                  Ghi nhận theo trình tự thời gian bạn đã giải mã và mở khóa các di tích
                </p>
              </div>

              <span className="px-3 py-1 rounded-full bg-amber-400 text-amber-950 text-xs font-black">
                {visitedTimeline.length} Dấu mốc đã lưu
              </span>
            </div>

            {visitedTimeline.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto text-neutral-400">
                  <Compass className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-base text-neutral-300">
                  Chưa có dấu mốc thám hiểm nào
                </h4>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                  Hãy bắt đầu khám phá các di tích, xem video và trả lời câu hỏi để tạo nên cuốn nhật ký hành trình của riêng bạn!
                </p>
                <button
                  onClick={() => handleGoToMonument(1)}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 text-amber-950 font-black text-xs hover:bg-amber-400 transition-all cursor-pointer"
                >
                  Bắt đầu với Dinh Độc Lập (#1) &rarr;
                </button>
              </div>
            ) : (
              <div className="relative pl-6 sm:pl-8 border-l-2 border-amber-500/40 space-y-6">
                {visitedTimeline.map((item, idx) => (
                  <div key={idx} className="relative group">
                    {/* Circle marker on line */}
                    <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-5 h-5 rounded-full bg-amber-400 border-4 border-[#17110F] shadow-md flex items-center justify-center text-[9px] font-black text-amber-950">
                      ✓
                    </div>

                    <div className="p-4 sm:p-5 rounded-2xl bg-black/40 border border-amber-500/20 hover:border-amber-400/60 transition-all space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-amber-400 text-amber-950 font-mono font-black text-xs">
                            #{item.monument.stt}
                          </span>
                          <span className="text-xs font-bold text-neutral-400">
                            {item.dateObj.toLocaleDateString('vi-VN')} {item.dateObj.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        <span className="text-xs font-black text-amber-300 bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                          +{item.earnedXP || 100} XP
                        </span>
                      </div>

                      <h4 className="font-serif-title font-bold text-base sm:text-lg text-white group-hover:text-amber-200 transition-colors">
                        {item.monument.info.name}
                      </h4>

                      {item.notes && (
                        <p className="text-xs text-neutral-300 bg-white/5 p-3 rounded-xl border border-white/10 italic">
                          "{item.notes}"
                        </p>
                      )}

                      <div className="pt-2 flex items-center justify-between text-xs">
                        <span className="text-[11px] text-neutral-400">
                          📍 {item.monument.info.address}
                        </span>
                        <button
                          onClick={() => handleGoToMonument(item.monument.stt)}
                          className="text-amber-300 hover:text-amber-200 font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <span>Xem lại di tích</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* MODE C: 103 MATRIX GRID */}
        {viewMode === 'matrix' && (
          <div className="p-6 rounded-3xl bg-[#17110F] border border-amber-500/20 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="font-serif-title font-black text-lg text-amber-200">
                Ma Trận Trực Quan 103 Di Tích Toàn Thành Phố
              </h3>
              <span className="text-xs text-neutral-400 font-bold">
                Hiển thị {displayedMonuments.length} / 103
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2.5">
              {displayedMonuments.map((m) => {
                const isVisited = !!visitedMap[m.stt];

                return (
                  <button
                    key={m.stt}
                    onClick={() => handleNodeClick(m)}
                    className={`p-2.5 rounded-xl border transition-all text-center flex flex-col items-center justify-center space-y-1 cursor-pointer group ${
                      isVisited
                        ? 'bg-gradient-to-b from-amber-500/30 to-red-950/80 border-amber-400 text-amber-100 shadow-md hover:scale-105'
                        : 'bg-black/40 border-white/10 text-neutral-400 hover:border-amber-400/50 hover:text-white'
                    }`}
                    title={m.info.name}
                  >
                    <span className={`text-xs font-mono font-black ${isVisited ? 'text-amber-300' : 'text-neutral-400'}`}>
                      #{m.stt}
                    </span>
                    <span className="text-[10px] font-bold line-clamp-1 leading-tight">
                      {isVisited ? '★ Mở' : 'Khóa'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

      </section>

      {/* ========================================================================= */}
      {/* 4. NODE QUICK DETAIL MODAL */}
      {/* ========================================================================= */}
      {selectedNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#1C1412] w-full max-w-lg rounded-3xl overflow-hidden border-2 border-amber-500/40 shadow-2xl flex flex-col max-h-[85vh] animate-scaleUp text-white">
            
            {/* Header with image */}
            <div className="relative h-44 bg-black">
              <img
                src={selectedNode.info.heroImage || '/assets/images/monuments/Dinh%20%C4%90%E1%BB%99c%20L%E1%BA%ADp/Dinh%20%C4%90%E1%BB%99c%20L%E1%BA%ADp%20nh%C3%ACn%20qua%20c%E1%BB%95ng%20ch%C3%ADnh.jpg'}
                alt={selectedNode.info.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = '/assets/images/monuments/Dinh%20%C4%90%E1%BB%99c%20L%E1%BA%ADp/Dinh%20%C4%90%E1%BB%99c%20L%E1%BA%ADp%20nh%C3%ACn%20qua%20c%E1%BB%95ng%20ch%C3%ADnh.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1412] via-black/40 to-transparent" />
              
              <div className="absolute top-3 right-3">
                <button
                  onClick={() => setSelectedNode(null)}
                  className="w-8 h-8 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center cursor-pointer transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-md bg-amber-400 text-amber-950 font-mono font-black text-xs">
                  Di tích #{selectedNode.stt}
                </span>
                <span className="text-xs bg-black/60 px-2 py-0.5 rounded text-amber-200 border border-amber-400/30">
                  {selectedNode.info.ranking || 'Di tích Quốc gia'}
                </span>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-5 space-y-4 overflow-y-auto flex-1">
              <div className="space-y-1">
                <h3 className="font-serif-title font-black text-lg sm:text-xl text-amber-200 leading-snug">
                  {selectedNode.info.name}
                </h3>
                <p className="text-xs text-neutral-400 flex items-center gap-1">
                  📍 {selectedNode.info.address}
                </p>
              </div>

              {/* Status banner */}
              <div className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                visitedMap[selectedNode.stt]
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                  : 'bg-white/5 border-white/10 text-neutral-400'
              }`}>
                <div className="flex items-center gap-2 text-xs font-bold">
                  {visitedMap[selectedNode.stt] ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Đã hoàn thành khám phá &amp; đóng dấu</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-neutral-500" />
                      <span>Chưa mở khóa trong Hộ Chiếu</span>
                    </>
                  )}
                </div>

                {visitedMap[selectedNode.stt] && (
                  <span className="text-xs font-mono font-black text-amber-300">
                    +{visitedMap[selectedNode.stt].earnedXP || 100} XP
                  </span>
                )}
              </div>

              {/* Overview snippet */}
              <p className="text-xs text-neutral-300 leading-relaxed line-clamp-3 font-serif-title">
                {selectedNode.info.overview || 'Di tích lịch sử văn hóa tiêu biểu của Thành phố Hồ Chí Minh.'}
              </p>

              {/* Actions */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => {
                    handleGoToMonument(selectedNode.stt);
                    setSelectedNode(null);
                  }}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-amber-950 font-black text-xs sm:text-sm shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-102"
                >
                  <Compass className="w-4 h-4" />
                  <span>Đến Khám Phá Di Tích Này Ngay</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
