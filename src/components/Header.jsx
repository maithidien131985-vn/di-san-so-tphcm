import React, { useState, useEffect } from 'react';
import { Landmark, Menu, X, Edit3, Settings, Upload, Grid, Home } from 'lucide-react';

export default function Header({
  monumentName = 'DI TÍCH DINH ĐỘC LẬP',
  monumentRanking = 'Đặc biệt',
  monumentStt = 1,
  viewMode = 'home', // 'home' | 'detail'
  isEditMode,
  setIsEditMode,
  onOpenAdmin,
  onOpenContribute,
  onOpenExplorer,
  onOpenMyMap,
  pendingContributionsCount = 0,
  onNavigate
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Trang chủ', isHome: true },
    { id: 'monuments', label: 'Kho 103 di tích', isExplorer: true },
    { id: 'map', label: 'Bản đồ số GPS', isMap: true },
    { id: 'survey', label: 'Khảo sát gợi ý', isSurvey: true },
    { id: 'about', label: 'Tư liệu di sản' }
  ];

  const handleNavClick = (link) => {
    if (link.isHome) {
      if (onNavigate) onNavigate('home');
    } else if (link.isExplorer) {
      if (onOpenExplorer) onOpenExplorer();
    } else if (link.isMap) {
      if (onOpenMyMap) onOpenMyMap();
    } else if (link.isSurvey) {
      if (viewMode !== 'home' && onNavigate) {
        onNavigate('home');
        setTimeout(() => {
          const el = document.getElementById('survey-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        const el = document.getElementById('survey-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      if (onNavigate) onNavigate(link.id);
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled
          ? 'glass-panel-dark text-white shadow-xl py-2.5 border-b border-white/20'
          : 'bg-[#7B1113] text-white py-3.5 shadow-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo and Brand */}
        <div 
          onClick={() => onNavigate && onNavigate('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-[#7B1113] flex items-center justify-center font-bold shadow-md group-hover:scale-105 transition-transform duration-300">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black tracking-widest text-amber-300 uppercase">
                HỆ THỐNG DI SẢN SỐ TP.HCM
              </span>
              {viewMode === 'detail' && (
                <>
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-emerald-600 text-[9px] font-black text-white uppercase">
                    {monumentRanking || 'Đặc biệt'}
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 text-[9px] font-bold">
                    #{monumentStt}/103
                  </span>
                </>
              )}
            </div>
            <h1 className="font-serif-title font-black text-base sm:text-lg leading-tight tracking-wide text-white group-hover:text-amber-200 transition-colors truncate max-w-[250px] sm:max-w-[400px]">
              {viewMode === 'home' ? 'Trang Chủ Khám Phá 103 Di Tích' : monumentName}
            </h1>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-bold uppercase tracking-wider">
          {navLinks.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item)}
              className={`transition-colors py-1 cursor-pointer nav-link-hover flex items-center gap-1.5 ${
                item.isHome && viewMode === 'home'
                  ? 'text-amber-300 font-black border-b-2 border-amber-300'
                  : item.isExplorer
                  ? 'text-amber-300 font-black'
                  : 'text-white/90 hover:text-amber-300'
              }`}
            >
              {item.isHome && <Home className="w-3.5 h-3.5" />}
              {item.isExplorer && <Grid className="w-3.5 h-3.5" />}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Nút Về Trang Chủ khi đang ở trang con */}
          {viewMode === 'detail' && (
            <button
              onClick={() => onNavigate && onNavigate('home')}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all cursor-pointer border border-white/25 shadow-xs"
              title="Quay về Trang chủ"
            >
              <Home className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">Trang Chủ</span>
            </button>
          )}

          {/* Nút Kho 103 Di Tích */}
          <button
            onClick={onOpenExplorer}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-all cursor-pointer border border-white/20"
            title="Mở toàn bộ danh mục 103 di tích TP.HCM"
          >
            <Grid className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden md:inline">103 Di Tích</span>
          </button>

          {/* Nút Đóng Góp Tư Liệu */}
          <button
            onClick={onOpenContribute}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-amber-950 text-xs font-black shadow-md cursor-pointer transition-all hover:scale-105 border border-amber-300/40"
            title="Độc giả đóng góp tư liệu di sản"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Đóng góp tư liệu</span>
            <span className="sm:hidden">Đóng góp</span>
          </button>

          {/* Edit Mode Quick Toggle */}
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className={`hidden xl:flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
              isEditMode
                ? 'bg-white text-[#7B1113] ring-2 ring-amber-300 font-black scale-105'
                : 'bg-white/15 text-white hover:bg-white/25 border border-white/20'
            }`}
            title="Bật/Tắt chế độ chỉnh sửa nội dung"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditMode ? 'Sửa: BẬT' : 'Sửa nhanh'}</span>
          </button>

          {/* Admin CMS Button */}
          <button
            onClick={onOpenAdmin}
            className="relative flex items-center gap-1.5 px-3.5 py-1.5 sm:py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#7B1113] text-xs font-black transition-all shadow-md cursor-pointer hover:scale-105"
            title="Bảng điều khiển quản trị CMS & xét duyệt dữ liệu"
          >
            <Settings className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Quản trị CMS</span>
            {pendingContributionsCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-bounce">
                {pendingContributionsCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#5a0c0e] border-t border-white/10 px-4 py-4 space-y-2 text-sm font-bold animate-fadeIn">
          {navLinks.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setMobileMenuOpen(false);
                handleNavClick(item);
              }}
              className="block w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 text-white/90"
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2 border-t border-white/10 space-y-2">
            <button
              onClick={() => {
                onOpenExplorer();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 px-3 rounded-lg bg-amber-400 text-[#7B1113] text-xs font-black flex items-center justify-center gap-1.5 shadow"
            >
              <Grid className="w-4 h-4" />
              <span>Mở Kho 103 Di Tích TP.HCM</span>
            </button>
            <button
              onClick={() => {
                onOpenContribute();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 px-3 rounded-lg bg-white/20 text-white text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <Upload className="w-4 h-4" />
              <span>Đóng góp tư liệu di sản</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
