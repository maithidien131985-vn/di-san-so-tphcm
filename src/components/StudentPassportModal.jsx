import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  X, 
  Compass, 
  Award, 
  MapPin, 
  CheckCircle2, 
  Sparkles, 
  Trophy, 
  Lock, 
  ChevronRight, 
  Search, 
  Filter, 
  Calendar, 
  Share2, 
  UserCheck, 
  Star, 
  ShieldCheck, 
  Flame, 
  BookOpen, 
  Gift, 
  ExternalLink,
  Layers,
  Zap,
  Check,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  AVATAR_OPTIONS, 
  calculateLevel, 
  getExplorationData, 
  getStudentQuests, 
  claimQuestReward,
  markMonumentAsExplored
} from '../utils/studentStorage';

export default function StudentPassportModal({
  isOpen,
  onClose,
  profile,
  onOpenAuth,
  allMonuments = [],
  onSelectMonument,
  initialTab = 'passport' // 'passport' | 'journey' | 'quests'
}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [explorationData, setExplorationData] = useState(getExplorationData());
  const [quests, setQuests] = useState(getStudentQuests());
  const [passportFilter, setPassportFilter] = useState('all'); // 'all' | 'completed' | 'uncompleted'
  const [questFilter, setQuestFilter] = useState('all'); // 'all' | 'daily' | 'monument' | 'topic' | 'region' | 'special'
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const mapRef = useRef(null);
  const leafletMapInstance = useRef(null);

  // Sync tab when initialTab changes
  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  // Refresh data on modal open
  useEffect(() => {
    if (isOpen) {
      setExplorationData(getExplorationData());
      setQuests(getStudentQuests());
    }
  }, [isOpen]);

  const levelInfo = useMemo(() => {
    return calculateLevel(explorationData.totalXP || 0);
  }, [explorationData.totalXP]);

  const currentAvatar = AVATAR_OPTIONS.find(a => a.id === profile?.avatarId) || AVATAR_OPTIONS[0];

  // Explored STT lookup set
  const exploredSttSet = useMemo(() => {
    return new Set(explorationData.exploredMonuments.map(m => m.stt));
  }, [explorationData.exploredMonuments]);

  const completedCount = exploredSttSet.size;
  const totalMonumentsCount = allMonuments.length > 0 ? allMonuments.length : 103;
  const progressPercent = Math.round((completedCount / totalMonumentsCount) * 100);

  // Filtered 103 Monuments for Passport Grid
  const filteredMonuments = useMemo(() => {
    return allMonuments.filter(m => {
      const isCompleted = exploredSttSet.has(m.stt);
      if (passportFilter === 'completed' && !isCompleted) return false;
      if (passportFilter === 'uncompleted' && isCompleted) return false;

      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        return (
          m.name?.toLowerCase().includes(query) ||
          m.stt?.toString().includes(query) ||
          m.district?.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [allMonuments, exploredSttSet, passportFilter, searchTerm]);

  // Explored monuments in chronological order for Journey Map
  const exploredChronological = useMemo(() => {
    return explorationData.exploredMonuments.map(em => {
      const mon = allMonuments.find(m => m.stt === em.stt) || {
        stt: em.stt,
        name: em.name,
        lat: 10.7769,
        lng: 106.6953,
        district: 'TP. Hồ Chí Minh'
      };
      return {
        ...mon,
        completedAt: em.completedAt,
        score: em.score
      };
    });
  }, [explorationData.exploredMonuments, allMonuments]);

  // Leaflet Journey Map Initialization
  useEffect(() => {
    if (!isOpen || activeTab !== 'journey' || !mapRef.current) return;

    let map = leafletMapInstance.current;

    // Load Leaflet if available
    if (typeof window !== 'undefined' && window.L) {
      if (!map) {
        map = window.L.map(mapRef.current, {
          center: [10.7769, 106.6953],
          zoom: 11,
          zoomControl: true
        });

        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 18
        }).addTo(map);

        leafletMapInstance.current = map;
      }

      // Clear existing layers
      map.eachLayer(layer => {
        if (layer instanceof window.L.Marker || layer instanceof window.L.Polyline) {
          map.removeLayer(layer);
        }
      });

      const latlngs = [];

      exploredChronological.forEach((mon, idx) => {
        const lat = mon.lat || (10.7769 + (idx * 0.01));
        const lng = mon.lng || (106.6953 + (idx * 0.01));
        const point = [lat, lng];
        latlngs.push(point);

        const customIcon = window.L.divIcon({
          className: 'custom-journey-pin',
          html: `<div style="background: linear-gradient(135deg, #7E1819, #B31D21); color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 12px; border: 2px solid #FDE047; box-shadow: 0 4px 10px rgba(0,0,0,0.4); transform: scale(1.1);">${idx + 1}</div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        const marker = window.L.marker(point, { icon: customIcon }).addTo(map);
        marker.bindPopup(`
          <div style="font-family: sans-serif; padding: 4px; max-width: 220px;">
            <div style="color: #7E1819; font-weight: 900; font-size: 13px; margin-bottom: 2px;">#${mon.stt}. ${mon.name}</div>
            <div style="font-size: 11px; color: #555;">Chặng khám phá số: <strong>#${idx + 1}</strong></div>
            <div style="font-size: 10px; color: #888; margin-top: 4px;">Khám phá ngày: ${new Date(mon.completedAt).toLocaleDateString('vi-VN')}</div>
          </div>
        `);
      });

      // Draw Journey Path (Polyline connecting explored points in order)
      if (latlngs.length > 1) {
        const polyline = window.L.polyline(latlngs, {
          color: '#D97706',
          weight: 4,
          opacity: 0.85,
          dashArray: '8, 8',
          lineCap: 'round'
        }).addTo(map);

        map.fitBounds(polyline.getBounds(), { padding: [40, 40] });
      } else if (latlngs.length === 1) {
        map.setView(latlngs[0], 13);
      }
    }

    return () => {
      // Keep map instance
    };
  }, [isOpen, activeTab, exploredChronological]);

  // Handle Claim Quest
  const handleClaim = (questId) => {
    const result = claimQuestReward(questId);
    if (result.success) {
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
      setQuests(getStudentQuests());
      setExplorationData(getExplorationData());
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn select-none">
      <div className="bg-[#FAF7F2] w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-300/40 flex flex-col max-h-[94vh] animate-scaleUp">
        {/* TOP STUDENT PASSPORT BANNER */}
        <div className="bg-gradient-to-r from-[#50080B] via-[#7E1819] to-[#9E2225] text-white p-4 sm:p-6 relative overflow-hidden shadow-md">
          {/* Ambient Lighting */}
          <div className="absolute -top-16 -right-16 w-56 h-56 bg-amber-400/15 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            {/* Student Info Profile */}
            <div className="flex items-center gap-3.5">
              <div 
                onClick={onOpenAuth}
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${currentAvatar.bg} flex items-center justify-center text-3xl sm:text-4xl shadow-xl border-2 border-amber-300 ring-4 ring-white/20 cursor-pointer hover:scale-105 transition-transform shrink-0`}
                title="Bấm để chỉnh sửa hồ sơ học sinh"
              >
                {currentAvatar.emoji}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-serif-title font-black text-lg sm:text-2xl text-white">
                    {profile?.name || 'Học Sinh Thám Hiểm'}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-[#7E1819] text-[10px] font-black uppercase tracking-wider shadow-xs">
                    Cấp {levelInfo.level}: {levelInfo.title}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-rose-100/90 font-medium flex-wrap">
                  <span>🏫 {profile?.school || 'Trường THCS/THPT'}</span>
                  <span>•</span>
                  <span>🎒 {profile?.className || 'Lớp'}</span>
                  {profile?.classCode && (
                    <>
                      <span>•</span>
                      <span className="bg-black/30 px-2 py-0.5 rounded-md text-amber-300 font-mono text-[11px]">
                        Mã: {profile.classCode}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Stats: XP & 103 Progress */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
              {/* Total XP */}
              <div className="bg-black/40 border border-amber-400/30 px-3.5 py-2 rounded-2xl flex items-center gap-2.5 backdrop-blur-md">
                <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
                <div>
                  <span className="text-[10px] text-stone-300 uppercase block font-bold leading-none">Tổng Điểm XP</span>
                  <span className="text-base sm:text-lg font-black text-amber-300">{explorationData.totalXP} XP</span>
                </div>
              </div>

              {/* 103 Monument Progress Badge */}
              <div className="bg-gradient-to-br from-amber-500/30 to-amber-600/30 border border-amber-400/50 px-4 py-2 rounded-2xl text-center backdrop-blur-md">
                <span className="text-[10px] text-amber-200 uppercase block font-bold leading-none">Tiến Độ Di Sản</span>
                <span className="text-base sm:text-lg font-black text-white">
                  {completedCount} / {totalMonumentsCount}
                </span>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="relative z-10 pt-4 flex items-center gap-3">
            <div className="flex-1 h-2 bg-black/40 rounded-full overflow-hidden border border-white/10">
              <div 
                className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-[11px] font-bold text-amber-200 shrink-0">
              {progressPercent}% Hoàn thành
            </span>
          </div>
        </div>

        {/* 3 CORE TABS NAVIGATION */}
        <div className="bg-white border-b border-[#EAE3D9] px-4 sm:px-6 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1 sm:gap-3 py-2">
            <button
              onClick={() => setActiveTab('passport')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'passport'
                  ? 'bg-[#7E1819] text-white shadow-md'
                  : 'text-[#555555] hover:bg-stone-100'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Passport 103 Di Tích</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                activeTab === 'passport' ? 'bg-amber-400 text-[#7E1819]' : 'bg-stone-200 text-stone-700'
              }`}>
                {completedCount}/{totalMonumentsCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('journey')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'journey'
                  ? 'bg-[#7E1819] text-white shadow-md'
                  : 'text-[#555555] hover:bg-stone-100'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Bản Đồ "Hành Trình Của Tôi"</span>
            </button>

            <button
              onClick={() => setActiveTab('quests')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'quests'
                  ? 'bg-[#7E1819] text-white shadow-md'
                  : 'text-[#555555] hover:bg-stone-100'
              }`}
            >
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Trang Nhiệm Vụ</span>
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            </button>
          </div>

          <button
            onClick={onOpenAuth}
            className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-[#7E1819] hover:underline cursor-pointer"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Sửa hồ sơ</span>
          </button>
        </div>

        {/* TAB BODY CONTENT */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#FAF7F2]">
          {/* ================================================================= */}
          {/* TAB 1: PASSPORT DI SẢN (103 Ô DI TÍCH) */}
          {/* ================================================================= */}
          {activeTab === 'passport' && (
            <div className="space-y-5">
              {/* Filter & Search Toolbar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#EAE3D9] shadow-2xs">
                {/* Status Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  <button
                    onClick={() => setPassportFilter('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                      passportFilter === 'all'
                        ? 'bg-[#7E1819] text-white shadow-xs'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    Tất cả (103)
                  </button>

                  <button
                    onClick={() => setPassportFilter('completed')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                      passportFilter === 'completed'
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    ✓ Đã khám phá ({completedCount})
                  </button>

                  <button
                    onClick={() => setPassportFilter('uncompleted')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                      passportFilter === 'uncompleted'
                        ? 'bg-amber-700 text-white shadow-xs'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    🔒 Chưa mở khóa ({totalMonumentsCount - completedCount})
                  </button>
                </div>

                {/* Search Box */}
                <div className="relative min-w-[200px]">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tìm tên hoặc số STT..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-stone-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#7E1819]"
                  />
                </div>
              </div>

              {/* 103 Monument Stamps Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                {filteredMonuments.map((mon) => {
                  const isCompleted = exploredSttSet.has(mon.stt);
                  const exploredEntry = explorationData.exploredMonuments.find(m => m.stt === mon.stt);

                  return (
                    <div
                      key={mon.stt}
                      onClick={() => {
                        if (onSelectMonument) onSelectMonument(mon.stt);
                        onClose();
                      }}
                      className={`relative rounded-2xl overflow-hidden border-2 transition-all duration-300 p-2.5 flex flex-col justify-between cursor-pointer group shadow-sm ${
                        isCompleted
                          ? 'bg-gradient-to-b from-[#FFFDF9] to-[#FDF4EA] border-amber-400/80 hover:border-[#7E1819] hover:shadow-lg hover:scale-102 ring-1 ring-amber-300/40'
                          : 'bg-stone-100/70 border-stone-200 hover:border-stone-300 opacity-75 hover:opacity-100'
                      }`}
                    >
                      {/* Top Stamp Header */}
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                          isCompleted ? 'bg-[#7E1819] text-amber-200' : 'bg-stone-300 text-stone-600'
                        }`}>
                          #{mon.stt}
                        </span>

                        {isCompleted ? (
                          <div className="flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-md">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Đã đóng dấu</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-[10px] font-bold text-stone-500 bg-stone-200 px-1.5 py-0.5 rounded-md">
                            <Lock className="w-3 h-3" />
                            <span>Chưa mở</span>
                          </div>
                        )}
                      </div>

                      {/* Image Thumbnail */}
                      <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-stone-200 mb-2">
                        <img
                          src={mon.heroImage || `/assets/images/monuments/dinh-doc-lap-front.jpg`}
                          alt={mon.name}
                          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                            !isCompleted ? 'grayscale-50' : ''
                          }`}
                        />

                        {/* Red Wax Seal Stamp Overlay if Completed */}
                        {isCompleted && (
                          <div className="absolute inset-0 bg-black/10 flex items-center justify-center pointer-events-none">
                            <div className="w-12 h-12 rounded-full border-2 border-red-600/90 bg-red-600/20 backdrop-blur-[1px] flex flex-col items-center justify-center text-red-700 font-black text-[8px] transform -rotate-12 shadow-sm uppercase tracking-tighter">
                              <span>★ DI SẢN ★</span>
                              <span className="text-[7px]">ĐÃ KHÁM PHÁ</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Monument Name */}
                      <div className="space-y-1">
                        <h4 className="font-serif-title font-bold text-xs text-[#2C241E] leading-tight line-clamp-2 group-hover:text-[#7E1819] transition-colors">
                          {mon.name}
                        </h4>
                        <div className="text-[10px] text-stone-500 flex items-center justify-between">
                          <span className="truncate max-w-[90px]">{mon.district || 'TP.HCM'}</span>
                          {isCompleted ? (
                            <span className="font-bold text-amber-700">+100 XP</span>
                          ) : (
                            <span className="text-[#7E1819] font-bold group-hover:underline">Khám phá ➔</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 2: BẢN ĐỒ HÀNH TRÌNH ("HÀNH TRÌNH CỦA TÔI") */}
          {/* ================================================================= */}
          {activeTab === 'journey' && (
            <div className="space-y-5">
              {/* Journey Header */}
              <div className="bg-white p-4 rounded-2xl border border-[#EAE3D9] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif-title font-black text-lg sm:text-xl text-[#7E1819]">
                      HÀNH TRÌNH CỦA TÔI 🗺️
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold border border-amber-300">
                      {exploredChronological.length} Điểm di tích đã chinh phục
                    </span>
                  </div>
                  <p className="text-xs text-stone-600">
                    Bản đồ cá nhân hóa nối các điểm di tích theo đúng thứ tự thời gian em đã khám phá
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs text-stone-600 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                  <span className="w-3 h-0.5 bg-amber-600 inline-block border-dashed" />
                  <span className="font-bold text-[#7E1819]">Tuyến đường thám hiểm di sản</span>
                </div>
              </div>

              {/* Map Container */}
              <div className="relative w-full h-[380px] sm:h-[450px] rounded-3xl overflow-hidden border-2 border-[#7E1819]/30 shadow-lg bg-stone-100">
                <div ref={mapRef} className="w-full h-full z-10" />

                {exploredChronological.length === 0 && (
                  <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white space-y-3">
                    <Compass className="w-12 h-12 text-amber-300 animate-spin-slow" />
                    <h4 className="font-serif-title font-bold text-lg">Chưa có di tích nào trên bản đồ</h4>
                    <p className="text-xs text-stone-300 max-w-md">
                      Hãy bắt đầu chuyến thám hiểm đầu tiên bằng cách chọn 1 di tích và giải mã câu hỏi để đánh dấu lên bản đồ của em!
                    </p>
                    <button
                      onClick={() => setActiveTab('passport')}
                      className="px-5 py-2.5 rounded-xl bg-amber-400 text-[#7E1819] font-black text-xs shadow-md"
                    >
                      Mở Passport để chọn di tích
                    </button>
                  </div>
                )}
              </div>

              {/* Chronological Discovery Timeline List */}
              <div className="space-y-3">
                <h4 className="font-serif-title font-bold text-sm text-[#7E1819] uppercase tracking-wider">
                  Thứ Tự Dấu Chân Lịch Sử Đã Qua:
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {exploredChronological.map((mon, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        if (onSelectMonument) onSelectMonument(mon.stt);
                        onClose();
                      }}
                      className="bg-white p-3 rounded-2xl border border-amber-200/80 shadow-2xs flex items-center gap-3 cursor-pointer hover:border-[#7E1819] hover:scale-102 transition-all group"
                    >
                      <div className="w-9 h-9 rounded-xl bg-[#7E1819] text-amber-200 font-black text-xs flex items-center justify-center shadow-xs shrink-0">
                        #{idx + 1}
                      </div>
                      <div className="overflow-hidden flex-1 space-y-0.5">
                        <h5 className="font-bold text-xs text-[#2C241E] truncate group-hover:text-[#7E1819]">
                          {mon.name}
                        </h5>
                        <div className="text-[10px] text-stone-500 flex items-center justify-between">
                          <span>{new Date(mon.completedAt).toLocaleDateString('vi-VN')}</span>
                          <span className="text-emerald-700 font-bold">✓ Đã giải mã</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 3: TRANG NHIỆM VỤ (QUEST & MISSION HUB) */}
          {/* ================================================================= */}
          {activeTab === 'quests' && (
            <div className="space-y-5">
              {/* Quests Header */}
              <div className="bg-white p-4 rounded-2xl border border-[#EAE3D9] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif-title font-black text-lg sm:text-xl text-[#7E1819]">
                      NHIỆM VỤ THÁM HIỂM DI SẢN 🎯
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-xs font-bold">
                      Tích lũy Điểm XP &amp; Mở khóa Huy Hiệu
                    </span>
                  </div>
                  <p className="text-xs text-stone-600">
                    Hoàn thành các thử thách học tập để nâng cấp bậc Hộ Chiếu Di Sản của em
                  </p>
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  {[
                    { id: 'all', label: 'Tất cả' },
                    { id: 'daily', label: 'Hằng ngày' },
                    { id: 'monument', label: 'Theo di tích' },
                    { id: 'topic', label: 'Chủ đề' },
                    { id: 'region', label: 'Khu vực' },
                    { id: 'special', label: 'Đặc biệt tuần' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setQuestFilter(tab.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                        questFilter === tab.id
                          ? 'bg-[#7E1819] text-white'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quests Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {quests
                  .filter(q => questFilter === 'all' || q.category === questFilter)
                  .map(quest => {
                    const isReadyToClaim = quest.isCompleted && !quest.isClaimed;
                    return (
                      <div
                        key={quest.id}
                        className={`bg-white rounded-2xl p-4 border-2 transition-all shadow-2xs flex flex-col justify-between gap-3 ${
                          quest.isClaimed
                            ? 'border-stone-200 opacity-60 bg-stone-50'
                            : isReadyToClaim
                            ? 'border-amber-400 ring-2 ring-amber-300/40 bg-amber-50/40'
                            : 'border-[#EAE3D9]'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-11 h-11 rounded-2xl bg-[#7E1819]/10 text-[#7E1819] flex items-center justify-center text-xl shrink-0 border border-[#7E1819]/20">
                            {quest.icon}
                          </div>

                          <div className="space-y-1 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[10px] font-black text-rose-800 uppercase tracking-wider bg-rose-50 px-2 py-0.5 rounded-md">
                                {quest.categoryLabel}
                              </span>
                              <span className="text-xs font-black text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
                                +{quest.rewardXP} XP
                              </span>
                            </div>

                            <h4 className="font-bold text-sm text-[#2C241E]">
                              {quest.title}
                            </h4>
                            <p className="text-xs text-stone-600 leading-snug">
                              {quest.description}
                            </p>
                          </div>
                        </div>

                        {/* Progress Bar & Claim Button */}
                        <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-3">
                          <div className="flex-1 space-y-1">
                            <div className="flex justify-between text-[10px] font-bold text-stone-500">
                              <span>Tiến độ</span>
                              <span>{quest.current} / {quest.target}</span>
                            </div>
                            <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-[#7E1819] to-amber-500 rounded-full transition-all"
                                style={{ width: `${Math.min(100, (quest.current / quest.target) * 100)}%` }}
                              />
                            </div>
                          </div>

                          {quest.isClaimed ? (
                            <span className="px-3 py-1.5 rounded-xl bg-stone-100 text-stone-500 text-xs font-bold flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" />
                              <span>Đã nhận thưởng</span>
                            </span>
                          ) : isReadyToClaim ? (
                            <button
                              onClick={() => handleClaim(quest.id)}
                              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-[#2C241E] font-black text-xs shadow-md transition-all hover:scale-104 cursor-pointer flex items-center gap-1.5 animate-bounce"
                            >
                              <Gift className="w-3.5 h-3.5 text-[#2C241E]" />
                              <span>Nhận +{quest.rewardXP} XP</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setActiveTab('passport');
                              }}
                              className="px-3.5 py-1.5 rounded-xl bg-[#7E1819] text-white font-bold text-xs hover:bg-[#911d1e] transition-colors cursor-pointer"
                            >
                              Khám phá ngay
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
