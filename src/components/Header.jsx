import React, { useState, useEffect } from 'react';
import { Landmark, Menu, X, Edit3, Settings, Upload, Grid, Home, Map, FolderSearch, Gamepad2, Info } from 'lucide-react';

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
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Trang chủ', isHome: true },
    { id: 'map', label: 'Bản đồ di tích', isMap: true },
    { id: 'monuments', label: 'Kho di tích', isExplorer: true },
    { id: 'investigation', label: 'Hồ sơ điều tra', isInvestigation: true },
    { id: 'quiz_game', label: 'Trò chơi', isQuizGame: true },
    { id: 'about', label: 'Về dự án', isAbout: true }
  ];

  const handleNavClick = (link) => {
    if (link.isHome) {
      if (onNavigate) onNavigate('home');
    } else if (link.isMap) {
      if (onOpenMyMap) onOpenMyMap();
    } else if (link.isExplorer) {
      if (onOpenExplorer) onOpenExplorer();
    } else if (link.isInvestigation) {
      if (viewMode !== 'detail' && onNavigate) {
        onNavigate('detail');
      }
      setTimeout(() => {
        const el = document.getElementById('investigation-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else if (link.isQuizGame) {
      if (viewMode !== 'detail' && onNavigate) {
        onNavigate('detail');
      }
      setTimeout(() => {
        const el = document.getElementById('investigation-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else if (link.isAbout) {
      if (onNavigate) onNavigate('about');
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 bg-white border-b border-[#EAE3D9] ${
        scrolled ? 'shadow-md py-2.5' : 'py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo and Brand on the Left */}
        <div 
          onClick={() => onNavigate && onNavigate('home')}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-[#7E1819] text-white flex items-center justify-center font-bold shadow-xs group-hover:scale-105 transition-transform duration-300">
            <Landmark className="w-6 h-6 text-amber-200" />
          </div>
          <div>
            <h1 className="font-serif-title font-black text-xl sm:text-2xl leading-none text-[#7E1819] tracking-tight group-hover:text-[#9c2022] transition-colors">
              DI SẢN SỐ TP.HCM
            </h1>
            {viewMode === 'detail' && (
              <div className="text-[10px] text-[#777777] font-semibold flex items-center gap-1.5 mt-0.5">
                <span className="text-[#7E1819] font-black">#{monumentStt}</span>
                <span>•</span>
                <span className="truncate max-w-[200px]">{monumentName}</span>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-[13px] font-bold text-[#333333]">
          {navLinks.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item)}
              className={`transition-colors py-1 cursor-pointer hover:text-[#7E1819] ${
                item.isHome && viewMode === 'home'
                  ? 'text-[#7E1819] font-black'
                  : 'text-[#333333]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Nút Đóng Góp */}
          <button
            onClick={onOpenContribute}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#7E1819] border border-amber-300 text-xs font-black shadow-2xs cursor-pointer transition-all hover:scale-103"
            title="Đóng góp tư liệu di sản"
          >
            <Upload className="w-3.5 h-3.5 text-[#7E1819]" />
            <span className="hidden sm:inline">Đóng góp</span>
          </button>

          {/* Admin CMS Button */}
          <button
            onClick={onOpenAdmin}
            className="relative flex items-center gap-1.5 px-3.5 py-1.5 sm:py-2 rounded-xl bg-[#7E1819] hover:bg-[#911d1e] text-white text-xs font-bold transition-all shadow-xs cursor-pointer hover:scale-103"
            title="Quản trị CMS"
          >
            <Settings className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">Quản trị</span>
            {pendingContributionsCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-bounce">
                {pendingContributionsCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-[#EAE3D9] px-4 py-4 space-y-2 text-sm font-bold text-[#333333] shadow-lg animate-fadeIn">
          {navLinks.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setMobileMenuOpen(false);
                handleNavClick(item);
              }}
              className="block w-full text-left px-3 py-2.5 rounded-xl hover:bg-gray-50 text-[#333333] hover:text-[#7E1819]"
            >
              {item.label}
            </button>
          ))}
          <div className="pt-3 border-t border-gray-100 flex gap-2">
            <button
              onClick={() => {
                onOpenExplorer();
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2 px-3 rounded-xl bg-[#7E1819] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow"
            >
              <Grid className="w-4 h-4 text-amber-300" />
              <span>Kho 103 Di Tích</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
