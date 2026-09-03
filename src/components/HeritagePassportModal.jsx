import React, { useState } from 'react';
import { 
  X, 
  Compass, 
  Sparkles, 
  ShieldCheck, 
  Award, 
  Star, 
  Copy, 
  Check, 
  LogOut, 
  LogIn, 
  UserPlus, 
  MapPin, 
  ChevronRight, 
  Flame, 
  BookOpen, 
  Calendar, 
  Search,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  createPassport, 
  loginPassport, 
  logoutPassport 
} from '../utils/passportStorage';
import { allMonumentsList } from '../data/allMonumentsData';

export default function HeritagePassportModal({
  isOpen,
  onClose,
  activePassport,
  onPassportChange,
  onSelectMonument
}) {
  const [activeTab, setActiveTab] = useState(activePassport ? 'passport' : 'login');
  const [inputCode, setInputCode] = useState('');
  const [loginError, setLoginError] = useState('');
  
  // Registration Form State
  const [fullName, setFullName] = useState('');
  const [school, setSchool] = useState('');
  const [grade, setGrade] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🦁');
  const [copiedCode, setCopiedCode] = useState(false);
  const [stampSearch, setStampSearch] = useState('');

  if (!isOpen) return null;

  const avatars = ['🦁', '🦅', '🐯', '🌟', '🚀', '🔭', '🏛️', '🛡️', '👑', '🎓'];

  // Handle Login via Code
  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');
    if (!inputCode.trim()) {
      setLoginError('Vui lòng nhập mã số hộ chiếu của bạn');
      return;
    }

    const passport = loginPassport(inputCode.trim());
    if (passport) {
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
      onPassportChange(passport);
      setActiveTab('passport');
      setInputCode('');
    } else {
      setLoginError('Không tìm thấy Hộ chiếu với mã số này. Vui lòng kiểm tra lại hoặc tạo Hộ chiếu mới!');
    }
  };

  // Handle Create New Passport
  const handleCreatePassport = (e) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    const newPassport = createPassport({
      fullName,
      school,
      grade,
      avatar: selectedAvatar
    });

    confetti({ particleCount: 80, spread: 90, origin: { y: 0.5 } });
    onPassportChange(newPassport);
    setActiveTab('passport');
  };

  // Handle Logout
  const handleLogout = () => {
    logoutPassport();
    onPassportChange(null);
    setActiveTab('login');
  };

  // Copy Passport Code
  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Visited count & list
  const visitedKeys = activePassport ? Object.keys(activePassport.visitedMonuments || {}) : [];
  const visitedCount = visitedKeys.length;
  const progressPercent = Math.round((visitedCount / 103) * 100);

  // Filter monuments for stamp book
  const filteredMonuments = allMonumentsList.filter(m => {
    if (!stampSearch.trim()) return true;
    const q = stampSearch.toLowerCase();
    return m.info.name.toLowerCase().includes(q) || m.info.address.toLowerCase().includes(q) || `${m.stt}` === q;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn select-none">
      <div className="bg-[#FFFDFB] w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl border-2 border-rose-200 flex flex-col max-h-[92vh] animate-scaleUp">
        
        {/* MODAL HEADER */}
        <div className="bg-gradient-to-r from-[#8B1417] via-[#A81B1F] to-[#8B1417] text-white p-4 sm:p-5 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white/15 border border-amber-300/40 flex items-center justify-center text-amber-200 shadow-inner">
              <Compass className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif-title font-black text-base sm:text-lg uppercase tracking-wider text-white">
                  HỘ CHIẾU DI SẢN SỐ
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-[#8B1417] text-[10px] font-black uppercase">
                  103 Di Tích TP.HCM
                </span>
              </div>
              <p className="text-xs text-rose-100/90">
                {activePassport 
                  ? `Chủ sở hữu: ${activePassport.fullName} • Mã: ${activePassport.code}`
                  : 'Lưu giữ hành trình khám phá di tích mỗi ngày cho học sinh'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* NAVIGATION TABS */}
        <div className="bg-[#FAF4F0] px-4 sm:px-6 py-2 border-b border-rose-200/80 flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-1.5 sm:gap-2">
            {activePassport && (
              <>
                <button
                  onClick={() => setActiveTab('passport')}
                  className={`px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'passport'
                      ? 'bg-[#8B1417] text-white shadow-md'
                      : 'bg-white hover:bg-rose-50 text-[#8B1417] border border-rose-200'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Hộ Chiếu Của Tôi</span>
                </button>

                <button
                  onClick={() => setActiveTab('stamps')}
                  className={`px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'stamps'
                      ? 'bg-[#8B1417] text-white shadow-md'
                      : 'bg-white hover:bg-rose-50 text-[#8B1417] border border-rose-200'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  <span>Dấu Mộc 103 Di Tích ({visitedCount}/103)</span>
                </button>
              </>
            )}

            {!activePassport && (
              <>
                <button
                  onClick={() => setActiveTab('login')}
                  className={`px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'login'
                      ? 'bg-[#8B1417] text-white shadow-md'
                      : 'bg-white hover:bg-rose-50 text-[#8B1417] border border-rose-200'
                  }`}
                >
                  <LogIn className="w-4 h-4" />
                  <span>Đăng Nhập Mã Hộ Chiếu</span>
                </button>

                <button
                  onClick={() => setActiveTab('register')}
                  className={`px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'register'
                      ? 'bg-[#8B1417] text-white shadow-md'
                      : 'bg-white hover:bg-rose-50 text-[#8B1417] border border-rose-200'
                  }`}
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Cấp Hộ Chiếu Mới</span>
                </button>
              </>
            )}
          </div>

          {activePassport && (
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
              title="Đăng xuất về chế độ xem tự do"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Về Chế Độ Tự Do</span>
            </button>
          )}
        </div>

        {/* MODAL BODY */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-[#FFFDFB]">
          
          {/* TAB 1: ACTIVE PASSPORT DASHBOARD */}
          {activeTab === 'passport' && activePassport && (
            <div className="space-y-6 animate-fadeIn">
              {/* Official Passport Card Book */}
              <div className="bg-gradient-to-br from-[#8B1417] via-[#9E1A1E] to-[#680C0E] text-white rounded-3xl p-5 sm:p-7 shadow-2xl border-4 border-amber-400/60 relative overflow-hidden">
                {/* Background Watermark Emblem */}
                <div className="absolute -right-8 -bottom-8 opacity-10 text-white pointer-events-none">
                  <Compass className="w-64 h-64" />
                </div>

                <div className="relative z-10 space-y-5">
                  {/* Passport Header Title */}
                  <div className="flex items-center justify-between border-b border-amber-300/30 pb-3">
                    <div>
                      <span className="text-[10px] sm:text-xs font-black tracking-widest uppercase text-amber-300 block">
                        CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                      </span>
                      <h4 className="font-serif-title font-black text-lg sm:text-2xl text-amber-100 tracking-wider uppercase">
                        HỘ CHIẾU THÁM HIỂM DI SẢN SỐ
                      </h4>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-amber-200 block font-bold">MÃ HỘ CHIẾU:</span>
                      <span className="font-mono font-black text-sm sm:text-base text-white tracking-widest bg-black/40 px-2.5 py-1 rounded-lg border border-amber-400/40">
                        {activePassport.code}
                      </span>
                    </div>
                  </div>

                  {/* Student Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                    {/* Avatar Portrait */}
                    <div className="md:col-span-3 flex flex-col items-center justify-center p-3 bg-black/30 rounded-2xl border-2 border-amber-400/40 text-center space-y-1 shadow-inner">
                      <span className="text-5xl sm:text-6xl">{activePassport.avatar || '🦁'}</span>
                      <span className="text-[10px] font-bold text-amber-300 uppercase">Nhà Thám Hiểm</span>
                    </div>

                    {/* Information */}
                    <div className="md:col-span-9 space-y-2 text-xs sm:text-sm">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <span className="text-[11px] text-amber-200/80 block">Họ và tên học sinh:</span>
                          <span className="font-serif-title font-black text-base sm:text-lg text-white">
                            {activePassport.fullName}
                          </span>
                        </div>
                        <div>
                          <span className="text-[11px] text-amber-200/80 block">Trường / Lớp:</span>
                          <span className="font-bold text-amber-100">
                            {activePassport.school} • {activePassport.grade}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-white/10">
                        <div>
                          <span className="text-[10px] text-stone-300 block">Số di tích đã đóng dấu:</span>
                          <span className="text-base font-black text-amber-300">{visitedCount} / 103 Di tích</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-stone-300 block">Tổng điểm thám hiểm:</span>
                          <span className="text-base font-black text-amber-300">{activePassport.totalXP || 0} XP</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-stone-300 block">Chuỗi ngày khám phá:</span>
                          <span className="text-base font-black text-amber-300 flex items-center gap-1">
                            <span>{activePassport.streakDays || 1} ngày</span>
                            <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar & Copy Code Bar */}
                  <div className="pt-2 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-amber-200">Tiến độ khám phá toàn TP.HCM:</span>
                      <span className="font-black text-amber-300">{progressPercent}%</span>
                    </div>
                    <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden border border-amber-400/30">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-200 transition-all duration-700 rounded-full"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Copy Code & Share Bar */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-amber-300/30">
                    <div className="flex items-center gap-1.5 text-xs text-amber-200">
                      <span>Mã đăng nhập lần sau:</span>
                      <strong className="font-mono text-white text-sm bg-black/50 px-2 py-0.5 rounded border border-amber-400/40">
                        {activePassport.code}
                      </strong>
                    </div>

                    <button
                      onClick={() => handleCopyCode(activePassport.code)}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-[#8B1417] text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? 'Đã chép mã!' : 'Sao chép mã số'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Actions & Badges Unlocked */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left: Unlocked Badges */}
                <div className="bg-[#FAF4F0] rounded-2xl p-4 sm:p-5 border border-rose-200 space-y-3">
                  <h5 className="font-serif-title font-black text-sm text-[#8B1417] flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-[#8B1417]" />
                    <span>Huy Hiệu Đã Mở Khóa ({activePassport.badges?.length || 1})</span>
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {activePassport.badges?.map((badge, bIdx) => (
                      <span
                        key={bIdx}
                        className="px-3 py-1.5 rounded-xl bg-white border border-rose-300/80 text-[#8B1417] text-xs font-bold shadow-2xs flex items-center gap-1.5"
                      >
                        <span>{badge}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right: Daily Goal & Shortcut */}
                <div className="bg-[#FAF4F0] rounded-2xl p-4 sm:p-5 border border-rose-200 space-y-3 flex flex-col justify-between">
                  <div>
                    <h5 className="font-serif-title font-black text-sm text-[#8B1417] flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-amber-500" />
                      <span>Mục Tiêu Khám Phá Mỗi Ngày</span>
                    </h5>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                      Mỗi ngày hãy mở 1-2 di tích, xem phim tư liệu, lắng nghe thuyết minh và giải mã câu đố để nhận thêm dấu mộc!
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveTab('stamps')}
                    className="w-full py-2.5 rounded-xl bg-[#8B1417] hover:bg-[#A81B1F] text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-amber-200" />
                    <span>Mở Sổ Sưu Tập 103 Dấu Mộc</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 103 STAMP COLLECTION GALLERY */}
          {activeTab === 'stamps' && activePassport && (
            <div className="space-y-4 animate-fadeIn">
              {/* Header & Search */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-rose-100">
                <div>
                  <h4 className="font-serif-title font-black text-base sm:text-lg text-[#8B1417]">
                    Bộ Sưu Tập Dấu Mộc 103 Di Tích
                  </h4>
                  <p className="text-xs text-stone-500">
                    Đã thu thập được <strong className="text-[#8B1417]">{visitedCount}</strong> / 103 Dấu mộc di sản
                  </p>
                </div>

                {/* Search */}
                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    value={stampSearch}
                    onChange={(e) => setStampSearch(e.target.value)}
                    placeholder="Tìm theo tên di tích hoặc #STT..."
                    className="w-full py-2 pl-8 pr-3 text-xs bg-[#FAF4F0] border border-rose-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8B1417]"
                  />
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                </div>
              </div>

              {/* Grid of 103 Stamps */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[50vh] overflow-y-auto p-1">
                {filteredMonuments.map((m) => {
                  const isVisited = !!activePassport.visitedMonuments?.[m.stt];
                  const visitData = activePassport.visitedMonuments?.[m.stt];

                  return (
                    <div
                      key={m.stt}
                      onClick={() => {
                        onSelectMonument(m.stt);
                        onClose();
                      }}
                      className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-2 group ${
                        isVisited
                          ? 'bg-[#FFFDFB] border-amber-400 ring-2 ring-amber-400/20 shadow-md hover:scale-103'
                          : 'bg-[#FAF7F5] border-dashed border-stone-300 hover:border-rose-400 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-[#8B1417] bg-rose-100 px-1.5 py-0.2 rounded">
                            #{m.stt}
                          </span>
                          {isVisited ? (
                            <span className="text-[10px] font-black text-emerald-600 flex items-center gap-0.5">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Đã mở</span>
                            </span>
                          ) : (
                            <span className="text-[10px] text-stone-400">Chưa mở</span>
                          )}
                        </div>

                        <h6 className="font-serif-title font-bold text-xs text-[#2A1214] line-clamp-2 group-hover:text-[#8B1417]">
                          {m.info.name}
                        </h6>
                      </div>

                      {/* Stamp Area */}
                      <div className="pt-2 border-t border-stone-200/60 flex items-center justify-center">
                        {isVisited ? (
                          <div className="px-2 py-1 rounded-xl bg-[#8B1417] text-amber-200 border border-amber-300 text-[9px] font-black uppercase tracking-wider text-center shadow-xs rotate-[-3deg] group-hover:rotate-0 transition-transform">
                            ★ ĐÃ ĐÓNG DẤU ★
                          </div>
                        ) : (
                          <span className="text-[10px] text-stone-400 font-bold group-hover:text-[#8B1417] flex items-center gap-1">
                            <span>Khám phá ngay</span>
                            <ChevronRight className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: LOGIN WITH PASSPORT CODE */}
          {activeTab === 'login' && (
            <div className="max-w-md mx-auto py-6 space-y-6 animate-fadeIn">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-3xl bg-[#8B1417] text-amber-200 flex items-center justify-center mx-auto shadow-xl">
                  <LogIn className="w-7 h-7" />
                </div>
                <h4 className="font-serif-title font-black text-xl sm:text-2xl text-[#8B1417]">
                  Đăng Nhập Mã Hộ Chiếu
                </h4>
                <p className="text-xs sm:text-sm text-stone-600">
                  Nhập mã số hộ chiếu đã được cấp (VD: <code className="bg-rose-100 px-1.5 py-0.5 rounded text-[#8B1417] font-mono">HC-2026-8942</code>) để tiếp tục hành trình của bạn.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700 block">Mã số Hộ Chiếu của bạn:</label>
                  <input
                    type="text"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                    placeholder="VD: HC-2026-XXXX"
                    className="w-full p-3.5 rounded-2xl bg-[#FAF4F0] border-2 border-rose-300 text-center font-mono font-black text-base sm:text-lg tracking-widest text-[#8B1417] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8B1417] uppercase shadow-inner"
                  />
                  {loginError && (
                    <p className="text-xs font-bold text-red-600 pt-1 text-center">{loginError}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#8B1417] to-[#B31D21] hover:from-[#731013] hover:to-[#96171a] text-white font-black text-sm shadow-xl transition-all hover:scale-102 cursor-pointer flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4 text-amber-200" />
                  <span>Tra Cứu &amp; Tiếp Tục Hành Trình</span>
                </button>
              </form>

              <div className="pt-4 border-t border-rose-100 text-center">
                <p className="text-xs text-stone-500">
                  Chưa có Hộ Chiếu?{' '}
                  <button
                    onClick={() => setActiveTab('register')}
                    className="font-bold text-[#8B1417] hover:underline cursor-pointer"
                  >
                    Nhấn vào đây để nhận Mã Hộ Chiếu mới (Miễn phí)
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: REGISTER NEW PASSPORT */}
          {activeTab === 'register' && (
            <div className="max-w-lg mx-auto py-4 space-y-6 animate-fadeIn">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-3xl bg-[#8B1417] text-amber-200 flex items-center justify-center mx-auto shadow-xl">
                  <UserPlus className="w-7 h-7" />
                </div>
                <h4 className="font-serif-title font-black text-xl sm:text-2xl text-[#8B1417]">
                  Cấp Hộ Chiếu Di Sản Mới
                </h4>
                <p className="text-xs text-stone-600">
                  Điền thông tin đơn giản để nhận ngay <strong>Mã Số Hộ Chiếu</strong> và bắt đầu tích lũy dấu mộc 103 di tích.
                </p>
              </div>

              <form onSubmit={handleCreatePassport} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Họ và tên học sinh (*):</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="VD: Nguyễn Minh Anh"
                    className="w-full p-3 rounded-xl bg-[#FAF4F0] border border-rose-300 text-sm font-bold text-[#2A1214] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8B1417]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">Trường học:</label>
                    <input
                      type="text"
                      value={school}
                      onChange={(e) => setSchool(e.target.value)}
                      placeholder="VD: THCS Nguyễn Du"
                      className="w-full p-3 rounded-xl bg-[#FAF4F0] border border-rose-300 text-sm font-medium text-[#2A1214] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8B1417]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">Lớp / Khối:</label>
                    <input
                      type="text"
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      placeholder="VD: Lớp 8A3"
                      className="w-full p-3 rounded-xl bg-[#FAF4F0] border border-rose-300 text-sm font-medium text-[#2A1214] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8B1417]"
                    />
                  </div>
                </div>

                {/* Avatar Mascot Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700">Chọn linh vật thám hiểm của bạn:</label>
                  <div className="flex items-center gap-2 overflow-x-auto p-1">
                    {avatars.map((av, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedAvatar(av)}
                        className={`w-10 h-10 rounded-2xl text-xl flex items-center justify-center transition-all cursor-pointer ${
                          selectedAvatar === av
                            ? 'bg-[#8B1417] text-white ring-4 ring-rose-300 scale-110 shadow-md'
                            : 'bg-[#FAF4F0] hover:bg-rose-100'
                        }`}
                      >
                        {av}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#8B1417] to-[#B31D21] hover:from-[#731013] hover:to-[#96171a] text-white font-black text-sm shadow-xl transition-all hover:scale-102 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>Cấp Hộ Chiếu &amp; Nhận Mã Số Ngay</span>
                </button>
              </form>

              <div className="pt-2 text-center">
                <button
                  onClick={() => setActiveTab('login')}
                  className="text-xs font-bold text-[#8B1417] hover:underline cursor-pointer"
                >
                  Đã có mã số? Nhấn để đăng nhập
                </button>
              </div>
            </div>
          )}

        </div>

        {/* MODAL FOOTER */}
        <div className="p-3 bg-[#FAF4F0] border-t border-rose-200 flex items-center justify-between text-xs text-stone-600">
          <span className="flex items-center gap-1 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#8B1417]" />
            <span>Hộ chiếu được lưu trữ bảo mật và khôi phục dễ dàng bằng Mã số</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#8B1417] text-white font-bold text-xs hover:bg-[#731013] transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
}
