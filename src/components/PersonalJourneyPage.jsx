import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Compass, 
  Sparkles, 
  Award, 
  Flame, 
  MapPin, 
  Search, 
  CheckCircle2, 
  Lock, 
  Unlock, 
  Printer, 
  Share2, 
  RefreshCw,
  Landmark,
  X,
  ChevronRight,
  ArrowRight,
  Gift,
  Star,
  Trophy,
  HelpCircle,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { allMonumentsList } from '../data/allMonumentsData';
import soundEffects from '../utils/soundEffects';
import WordByWordTitle from './WordByWordTitle';

export default function PersonalJourneyPage({
  activePassport,
  onOpenPassportModal,
  onSelectMonument,
  onNavigate
}) {
  const [activeTrack, setActiveTrack] = useState('all'); // 'all' | 'track-1' | 'track-2' | 'track-3' | 'track-4'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNode, setSelectedNode] = useState(null);
  const [openedChestModal, setOpenedChestModal] = useState(null);
  const activeNodeRef = useRef(null);

  const visitedMap = useMemo(() => {
    return activePassport?.visitedMonuments || {};
  }, [activePassport]);

  const visitedCount = Object.keys(visitedMap).length;
  const progressPercent = Math.min(100, Math.round((visitedCount / 103) * 100));

  // Thematic Tracks grouping
  const tracks = useMemo(() => [
    {
      id: 'all',
      name: 'Toàn Bộ 103 Di Tích',
      shortName: 'Tất Cả 103 Di Tích',
      icon: '⭐',
      color: '#D97706',
      badgeBg: 'bg-amber-500',
      desc: 'Hành trình trọn vẹn khám phá 103 di tích cấp Quốc gia & Quốc gia đặc biệt TP.HCM.',
      filterFn: () => true
    },
    {
      id: 'track-1',
      name: 'Mốc Son Kháng Chiến & Địa Chỉ Đỏ',
      shortName: 'Mốc Son Kháng Chiến',
      icon: '🚩',
      color: '#DC2626',
      badgeBg: 'bg-red-600',
      desc: 'Các di tích lịch sử cách mạng, chiến khu, địa đạo và thời khắc giải phóng hào hùng.',
      filterFn: (m) => m.info?.type?.toLowerCase().includes('lịch sử') || m.info?.badge?.toLowerCase().includes('quốc gia đặc biệt') || m.stt <= 25
    },
    {
      id: 'track-2',
      name: 'Tuyệt Tác Kiến Trúc Sài Gòn',
      shortName: 'Kiến Trúc Nghệ Thuật',
      icon: '🏛️',
      color: '#D97706',
      badgeBg: 'bg-amber-500',
      desc: 'Công trình kiến trúc nghệ thuật tiêu biểu, dinh thự, nhà hát, bưu điện hơn 300 năm.',
      filterFn: (m) => m.info?.type?.toLowerCase().includes('kiến trúc') || (m.stt > 25 && m.stt <= 55)
    },
    {
      id: 'track-3',
      name: 'Không Gian Văn Hóa & Tín Ngưỡng',
      shortName: 'Văn Hóa & Tín Ngưỡng',
      icon: '🛕',
      color: '#059669',
      badgeBg: 'bg-emerald-600',
      desc: 'Chùa cổ, đình làng, hội quán và không gian phong tục tín ngưỡng phương Nam.',
      filterFn: (m) => m.info?.type?.toLowerCase().includes('văn hóa') || m.info?.name?.toLowerCase().includes('đình') || m.info?.name?.toLowerCase().includes('chùa') || (m.stt > 55 && m.stt <= 80)
    },
    {
      id: 'track-4',
      name: 'Cội Nguồn Khảo Cổ & Ven Đô',
      shortName: 'Khảo Cổ & Ven Đô',
      icon: '🏺',
      color: '#7C3AED',
      badgeBg: 'bg-purple-600',
      desc: 'Di chỉ khảo cổ Giồng Cá Vồ, lò gốm Hưng Lợi, chiến khu Rừng Sác và vùng ven đô.',
      filterFn: (m) => m.info?.type?.toLowerCase().includes('khảo cổ') || m.stt > 80
    }
  ], []);

  const currentTrackObj = tracks.find(t => t.id === activeTrack) || tracks[0];

  // List of monuments in the active journey track (sorted by stt or predefined journey)
  const journeyList = useMemo(() => {
    return allMonumentsList.filter(currentTrackObj.filterFn).filter(m => {
      if (!searchTerm.trim()) return true;
      const q = searchTerm.toLowerCase().trim();
      return (
        m.info?.name?.toLowerCase().includes(q) ||
        m.info?.address?.toLowerCase().includes(q) ||
        m.stt?.toString() === q
      );
    });
  }, [currentTrackObj, searchTerm]);

  // Find first unvisited monument in the active list (this is the active current step)
  const currentActiveIndex = useMemo(() => {
    const idx = journeyList.findIndex(m => !visitedMap[m.stt]);
    return idx !== -1 ? idx : journeyList.length - 1;
  }, [journeyList, visitedMap]);

  // Milestone chests every 6 steps
  const getChestMilestone = (index) => {
    if (index > 0 && index % 6 === 0) {
      const milestoneNum = index;
      const isUnlocked = visitedCount >= milestoneNum;
      return { milestoneNum, isUnlocked };
    }
    return null;
  };

  // Auto scroll to active node on track change or mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeNodeRef.current) {
        activeNodeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [activeTrack]);

  const handleNodeClick = (monument) => {
    soundEffects.playTap();
    setSelectedNode(monument);
  };

  const handleChestClick = (milestone) => {
    soundEffects.playUnlock();
    setOpenedChestModal(milestone);
    if (milestone.isUnlocked) {
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }
  };

  const handleGoToMonument = (stt) => {
    soundEffects.playTap();
    if (onSelectMonument) onSelectMonument(stt);
  };

  // Helper to get category icon url
  const getCategoryIcon = (type = '') => {
    if (type.includes('Khảo cổ')) {
      return '/assets/icons/Di%20t%C3%ADch%20kh%E1%BA%A3o%20c%E1%BB%95.png';
    } else if (type.includes('Kiến trúc')) {
      return '/assets/icons/Di%20t%C3%ADch%20ki%E1%BA%BFn%20tr%C3%BAc.png';
    }
    return '/assets/icons/di%20t%C3%ADch%20l%E1%BB%8Bch%20s%E1%BB%AD.png';
  };

  // Calculate smooth sine-wave zigzag offset (-70px to +70px)
  const getZigzagOffset = (index) => {
    const pattern = [0, -55, -80, -55, 0, 55, 80, 55];
    return pattern[index % pattern.length];
  };

  return (
    <div className="min-h-screen bg-[#13151b] text-white select-none pb-24 font-sans">
      
      {/* ========================================================================= */}
      {/* 1. TOP FLOATING STICKY HEADER & STATS BAR */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-30 bg-[#1e2330]/95 backdrop-blur-md border-b border-white/10 shadow-lg px-3 sm:px-6 py-2.5">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
          
          {/* Back & Track Title */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundEffects.playTap();
                if (onNavigate) onNavigate('home');
              }}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-amber-300 transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold"
              title="Về Trang Chủ"
            >
              <span>&larr;</span>
              <span className="hidden sm:inline">Trang Chủ</span>
            </button>

            <div className="hidden md:flex items-center gap-1.5 pl-2 border-l border-white/10">
              <span className="text-sm">{currentTrackObj.icon}</span>
              <span className="text-xs font-black text-amber-200 uppercase tracking-wide truncate max-w-[200px]">
                {currentTrackObj.shortName}
              </span>
            </div>
          </div>

          {/* Duolingo Gamification Stats (Streak, XP, Stamps, Mascot) */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Streak */}
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-black/40 border border-orange-500/30 text-orange-400 font-black text-xs shadow-xs" title="Chuỗi ngày thám hiểm">
              <Flame className="w-4 h-4 fill-orange-500 text-orange-500 animate-pulse" />
              <span>{activePassport?.streakDays || 1}</span>
            </div>

            {/* Total XP */}
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-black/40 border border-amber-500/30 text-amber-300 font-black text-xs shadow-xs" title="Tổng điểm kinh nghiệm (XP)">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{activePassport?.totalXP || 0} XP</span>
            </div>

            {/* Visited Progress */}
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-black/40 border border-emerald-500/30 text-emerald-300 font-black text-xs shadow-xs" title="Số di tích đã mở khóa">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{visitedCount}/103</span>
            </div>

            {/* Mascot & Passport Profile Switcher */}
            <button
              onClick={() => {
                soundEffects.playTap();
                if (onOpenPassportModal) onOpenPassportModal();
              }}
              className="flex items-center gap-1.5 pl-1.5 pr-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-yellow-400 text-[#200507] font-black text-xs transition-all shadow-md hover:scale-104 cursor-pointer"
              title="Đổi thẻ hoặc chỉnh sửa thông tin học sinh"
            >
              <span className="text-base leading-none">{activePassport?.avatar || '🦁'}</span>
              <span className="hidden lg:inline uppercase font-serif-title max-w-[90px] truncate">{activePassport?.fullName || 'Học sinh'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. THEMATIC TRACK / UNIT BANNER (Duolingo Chapter Card) */}
      {/* ========================================================================= */}
      <div className="max-w-xl mx-auto px-4 pt-4 pb-2">
        <div className="bg-gradient-to-r from-[#2a1715] via-[#3a1d1a] to-[#2a1715] rounded-3xl p-4 sm:p-5 border-2 border-amber-400/40 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between gap-3 relative z-10">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[10px] uppercase font-black tracking-widest text-amber-300 bg-black/40 px-2 py-0.5 rounded-full border border-amber-400/30">
                  {currentTrackObj.icon} HÀNH TRÌNH THÁM HIỂM
                </span>
                <span className="text-[10px] bg-emerald-500/90 text-white font-bold px-2 py-0.5 rounded-full">
                  {journeyList.length} Di tích
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-serif-title font-black text-amber-100 leading-tight">
                {currentTrackObj.name}
              </h2>
              <p className="text-xs text-amber-200/70 mt-1 line-clamp-1">
                {currentTrackObj.desc}
              </p>
            </div>

            {/* Print button */}
            <button
              onClick={() => {
                soundEffects.playTap();
                window.print();
              }}
              className="shrink-0 p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-amber-200 transition-all cursor-pointer shadow-sm"
              title="In sơ đồ hành trình báo cáo học tập"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>

          {/* Journey Progress bar */}
          <div className="mt-3 pt-3 border-t border-amber-400/20 space-y-1 relative z-10">
            <div className="flex justify-between text-[11px] font-bold text-amber-200/90">
              <span>Tiến độ tuyến này:</span>
              <span className="text-amber-300">
                {journeyList.filter(m => !!visitedMap[m.stt]).length} / {journeyList.length} di tích
              </span>
            </div>
            <div className="w-full h-2.5 bg-black/60 rounded-full overflow-hidden border border-amber-400/30">
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 rounded-full transition-all duration-700 shadow-sm"
                style={{
                  width: `${journeyList.length > 0 ? Math.round((journeyList.filter(m => !!visitedMap[m.stt]).length / journeyList.length) * 100) : 0}%`
                }}
              />
            </div>
          </div>
        </div>

        {/* Thematic Track Selector Pills (Duolingo Unit Selector) */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-3 no-scrollbar">
          {tracks.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                soundEffects.playTap();
                setActiveTrack(t.id);
              }}
              className={`px-3 py-1.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 shadow-sm ${
                activeTrack === t.id
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-[#200507] font-black scale-105 ring-2 ring-amber-300'
                  : 'bg-[#1e2330] hover:bg-[#282f42] text-neutral-300 border border-white/10'
              }`}
            >
              <span>{t.icon}</span>
              <span>{t.shortName}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. DUOLINGO-STYLE WINDING STEPPING-STONE PATH */}
      {/* ========================================================================= */}
      <main className="max-w-lg mx-auto px-4 py-4 relative">
        
        {/* Decorative Background Winding Path SVG Line */}
        <div className="absolute inset-0 flex justify-center pointer-events-none z-0">
          <div className="w-1.5 h-full bg-gradient-to-b from-amber-400/40 via-amber-500/20 to-amber-400/40 rounded-full" />
        </div>

        <div className="relative z-10 flex flex-col items-center space-y-7 sm:space-y-9 py-4">
          
          {journeyList.map((monument, index) => {
            const isVisited = !!visitedMap[monument.stt];
            const isCurrentActive = index === currentActiveIndex;
            const xOffset = getZigzagOffset(index);
            const chestMilestone = getChestMilestone(index);
            const monType = monument.info?.type || 'Lịch sử';
            const iconUrl = getCategoryIcon(monType);

            return (
              <React.Fragment key={monument.stt}>
                
                {/* Milestone Chest Reward (Duolingo Treasure Box) */}
                {chestMilestone && (
                  <div className="my-2 flex flex-col items-center animate-fadeIn">
                    <button
                      onClick={() => handleChestClick(chestMilestone)}
                      className={`relative group p-3.5 rounded-3xl transition-all duration-300 cursor-pointer flex flex-col items-center justify-center ${
                        chestMilestone.isUnlocked
                          ? 'bg-gradient-to-b from-amber-400 to-amber-600 border-2 border-yellow-200 shadow-lg shadow-amber-500/30 hover:scale-110 active:scale-95'
                          : 'bg-gradient-to-b from-[#3a251e] to-[#251713] border-2 border-amber-800/60 opacity-80 hover:opacity-100 hover:scale-105'
                      }`}
                    >
                      <div className="text-3xl sm:text-4xl filter drop-shadow-md">
                        {chestMilestone.isUnlocked ? '🎁' : '📦'}
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-wider mt-1 px-2 py-0.5 rounded-full ${
                        chestMilestone.isUnlocked ? 'bg-amber-950 text-amber-200' : 'bg-black/40 text-neutral-400'
                      }`}>
                        {chestMilestone.isUnlocked ? 'Mở Rương +100 XP' : `Mốc ${chestMilestone.milestoneNum} di tích`}
                      </span>
                    </button>
                  </div>
                )}

                {/* Stepping Stone Node */}
                <div
                  ref={isCurrentActive ? activeNodeRef : null}
                  style={{ transform: `translateX(${xOffset}px)` }}
                  className="relative flex flex-col items-center transition-transform duration-300"
                >
                  {/* Mascot Speech Bubble standing on Current Active Node */}
                  {isCurrentActive && (
                    <div className="absolute -top-14 sm:-top-16 z-20 flex flex-col items-center animate-bounce">
                      <div className="bg-gradient-to-r from-amber-400 to-yellow-400 text-[#200507] font-black text-[11px] px-3 py-1 rounded-2xl shadow-xl border border-amber-200 whitespace-nowrap flex items-center gap-1">
                        <span className="text-sm">{activePassport?.avatar || '🦁'}</span>
                        <span>Khám phá ngay!</span>
                      </div>
                      <div className="w-2.5 h-2.5 bg-yellow-400 rotate-45 -mt-1 shadow-sm" />
                    </div>
                  )}

                  {/* Main 3D Round Node Button */}
                  <button
                    onClick={() => handleNodeClick(monument)}
                    className={`relative w-18 h-18 sm:w-20 sm:h-20 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 group ${
                      isVisited
                        ? 'bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500 border-b-6 border-amber-700 shadow-lg shadow-amber-500/30 hover:scale-108 active:scale-95 active:border-b-2 active:translate-y-1'
                        : isCurrentActive
                        ? 'bg-gradient-to-b from-yellow-400 via-amber-500 to-amber-600 border-b-6 border-amber-800 shadow-xl shadow-amber-400/50 ring-4 ring-amber-300/80 hover:scale-110 active:scale-95 active:border-b-2 active:translate-y-1'
                        : 'bg-gradient-to-b from-[#2d3446] to-[#1e2330] border-b-6 border-[#141822] hover:from-[#3a4359] hover:to-[#252c3d] hover:scale-105 active:scale-95 active:border-b-2 active:translate-y-1 opacity-90'
                    }`}
                    title={`#${monument.stt} - ${monument.info?.name}`}
                  >
                    {/* Category Icon (Lịch sử / Kiến trúc / Khảo cổ) */}
                    <div className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center p-1">
                      <img
                        src={iconUrl}
                        alt={monType}
                        className={`w-full h-full object-contain filter drop-shadow-md transition-transform group-hover:scale-110 ${
                          !isVisited && !isCurrentActive ? 'brightness-90 contrast-95' : ''
                        }`}
                      />
                    </div>

                    {/* Visited Checkmark Badge */}
                    {isVisited && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-black shadow-md border-2 border-white">
                        ✓
                      </div>
                    )}

                    {/* Active Pulse Ring */}
                    {isCurrentActive && (
                      <span className="absolute -inset-1 rounded-full border-2 border-amber-300 animate-ping pointer-events-none opacity-75" />
                    )}
                  </button>

                  {/* STT & Title Tag underneath */}
                  <div className="mt-2 text-center max-w-[130px] sm:max-w-[150px]">
                    <div className="inline-flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded-full border border-white/10 shadow-xs mb-0.5">
                      <span className={`text-[9px] font-black ${isVisited ? 'text-amber-300' : 'text-neutral-400'}`}>
                        #{monument.stt}
                      </span>
                      <span className="text-[8px] text-neutral-400 uppercase truncate max-w-[60px]">
                        {monType}
                      </span>
                    </div>
                    <div className="text-[11px] sm:text-xs font-bold text-neutral-200 line-clamp-1 group-hover:text-amber-300">
                      {monument.info?.name}
                    </div>

                    {/* Visited Stars */}
                    {isVisited ? (
                      <div className="flex items-center justify-center gap-0.5 mt-0.5 text-amber-400 text-[10px]">
                        <span>⭐</span>
                        <span>⭐</span>
                        <span>⭐</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-0.5 mt-0.5 text-neutral-600 text-[10px]">
                        <span>★</span>
                        <span>★</span>
                        <span>★</span>
                      </div>
                    )}
                  </div>

                </div>
              </React.Fragment>
            );
          })}

        </div>
      </main>

      {/* ========================================================================= */}
      {/* 4. INTERACTIVE MONUMENT DETAIL MODAL POPUP */}
      {/* ========================================================================= */}
      {selectedNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#1c212e] w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-400/40 animate-scaleUp text-white">
            
            {/* Header Image */}
            <div className="relative h-44 sm:h-48 w-full bg-neutral-900 overflow-hidden">
              <img
                src={selectedNode.info?.heroImage || selectedNode.gallery?.[0]?.src || '/assets/icons/di tích lịch sử.png'}
                alt={selectedNode.info?.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1c212e] via-[#1c212e]/40 to-transparent" />
              
              <button
                onClick={() => setSelectedNode(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="bg-[#7E1819] text-amber-200 text-xs font-black px-2.5 py-0.5 rounded-lg border border-amber-400/40">
                    #{selectedNode.stt}/103
                  </span>
                  <span className="bg-amber-400/90 text-[#200507] text-[10px] font-black px-2 py-0.5 rounded-md">
                    {selectedNode.info?.ranking || 'Di tích Quốc gia'}
                  </span>
                </div>

                {visitedMap[selectedNode.stt] ? (
                  <span className="bg-emerald-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow">
                    ✓ Đã đóng dấu
                  </span>
                ) : (
                  <span className="bg-neutral-700/80 text-neutral-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Chưa khám phá
                  </span>
                )}
              </div>
            </div>

            {/* Body Info */}
            <div className="p-5 space-y-4">
              <div>
                <h3 className="text-base sm:text-lg font-serif-title font-black text-amber-100 leading-snug">
                  {selectedNode.info?.name}
                </h3>
                <p className="text-xs text-neutral-300 mt-1 flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>{selectedNode.info?.address}</span>
                </p>
              </div>

              {/* Type and Description Snippet */}
              <div className="bg-black/30 rounded-2xl p-3 border border-white/5 space-y-2 text-xs">
                <div className="flex items-center justify-between text-neutral-400">
                  <span>Phân loại di tích:</span>
                  <span className="font-bold text-amber-300">{selectedNode.info?.type || 'Di tích Lịch sử'}</span>
                </div>
                {selectedNode.info?.historicalPeriod && (
                  <div className="flex items-center justify-between text-neutral-400">
                    <span>Thời kỳ lịch sử:</span>
                    <span className="font-medium text-neutral-200">{selectedNode.info.historicalPeriod}</span>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-1 flex gap-2">
                <button
                  onClick={() => handleGoToMonument(selectedNode.stt)}
                  className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-[#200507] font-black text-sm uppercase tracking-wider transition-all shadow-lg hover:scale-102 active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Landmark className="w-4 h-4 text-[#200507]" />
                  <span>Khám Phá Di Tích Này &rarr;</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. CHEST REWARD CELEBRATION MODAL */}
      {/* ========================================================================= */}
      {openedChestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-gradient-to-br from-[#2f1f1a] to-[#1c120f] w-full max-w-sm rounded-3xl p-6 border-2 border-amber-400 shadow-2xl text-center space-y-4 animate-scaleUp">
            <div className="text-5xl animate-bounce">
              {openedChestModal.isUnlocked ? '🏆' : '🔒'}
            </div>
            <div>
              <h4 className="text-lg font-serif-title font-black text-amber-200">
                {openedChestModal.isUnlocked ? 'RƯƠNG KHO BÁU DI SẢN!' : 'RƯƠNG CHƯA MỞ KHÓA'}
              </h4>
              <p className="text-xs text-amber-100/80 mt-1">
                {openedChestModal.isUnlocked
                  ? `Chúc mừng bạn đã đạt cột mốc khám phá ${openedChestModal.milestoneNum} di tích TP.HCM! Bạn nhận được +100 XP danh dự!`
                  : `Hãy khám phá thêm ${Math.max(1, openedChestModal.milestoneNum - visitedCount)} di tích nữa để mở khóa phần thưởng bí mật này.`}
              </p>
            </div>
            <button
              onClick={() => setOpenedChestModal(null)}
              className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#200507] font-black text-xs uppercase cursor-pointer"
            >
              Đồng ý
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
