import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Film, 
  History, 
  Lightbulb, 
  HelpCircle, 
  Compass 
} from 'lucide-react';

const SECTIONS = [
  { id: 'hero-section', label: 'Giới thiệu', icon: Sparkles },
  { id: 'map-gps-section', label: 'Bản đồ GPS', icon: MapPin },
  { id: 'media-section', label: 'Phim & Audio', icon: Film },
  { id: 'history-section', label: 'Lịch sử', icon: History },
  { id: 'highlights-section', label: '3 Điểm nhấn', icon: Lightbulb },
  { id: 'investigation-section', label: 'Giải mã & Đố', icon: HelpCircle },
  { id: 'next-monuments-section', label: 'Tiếp theo', icon: Compass }
];

export default function DetailSectionNav() {
  const [activeSection, setActiveSection] = useState('hero-section');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 180;
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTIONS[i].id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(SECTIONS[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -130;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  return (
    <nav 
      aria-label="Điều hướng nhanh trang di tích"
      className="sticky top-[102px] sm:top-[106px] z-20 bg-white/95 backdrop-blur-md border-b border-rose-200/80 shadow-xs py-2 px-3 sm:px-6"
    >
      <div className="max-w-[1720px] mx-auto flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar scroll-smooth py-0.5">
        <span className="text-[11px] font-bold text-stone-500 uppercase shrink-0 hidden sm:inline mr-1">
          Mục:
        </span>
        {SECTIONS.map((sec) => {
          const Icon = sec.icon;
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => scrollToSection(sec.id)}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer select-none ${
                isActive
                  ? 'bg-[#7E1819] text-white shadow-xs ring-2 ring-[#7E1819]/30 scale-102 font-black'
                  : 'bg-[#FAF4F0] hover:bg-rose-100 text-[#4A1012] hover:text-[#7E1819] border border-rose-200/60'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : 'text-[#7E1819]'}`} />
              <span className="whitespace-nowrap">{sec.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
