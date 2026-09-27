import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      if (totalHeight > 0) {
        const currentProgress = (scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      } else {
        setScrollProgress(0);
      }

      setShowScrollTop(scrollY > 160);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <>
      {/* 1. TOP DYNAMIC HORIZONTAL SCROLL PROGRESS BAR */}
      <div className="fixed top-0 left-0 right-0 h-1 sm:h-1.5 z-[9999] bg-black/15 pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-amber-400 via-rose-600 to-yellow-300 transition-all duration-100 ease-out shadow-sm shadow-amber-500/50 relative"
          style={{ width: `${scrollProgress}%` }}
        >
          {scrollProgress > 0 && scrollProgress < 99 && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-2.5 h-2.5 rounded-full bg-amber-300 shadow-md shadow-amber-300 ring-2 ring-white/60 animate-pulse" />
          )}
        </div>
      </div>

      {/* 2. FLOATING CIRCULAR SCROLL PROGRESS WIDGET & SCROLL-TO-TOP BUTTON */}
      <div
        className={`fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40 transition-all duration-300 ${
          showScrollTop ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-90 pointer-events-none'
        }`}
      >
        <button
          onClick={scrollToTop}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative w-12 h-12 rounded-full bg-[#200507]/90 hover:bg-[#3D0A0E] text-amber-300 shadow-xl border border-amber-400/50 flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95 group backdrop-blur-md"
          title={`Tiến trình đọc trang: ${Math.round(scrollProgress)}% - Nhấn để cuộn lên đầu`}
        >
          <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 48 48">
            <circle
              cx="24"
              cy="24"
              r={radius}
              className="text-white/10"
              strokeWidth="3"
              stroke="currentColor"
              fill="transparent"
            />
            <circle
              cx="24"
              cy="24"
              r={radius}
              className="text-amber-400 transition-all duration-100 ease-out"
              strokeWidth="3.5"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
            />
          </svg>

          <div className="relative z-10 flex flex-col items-center justify-center">
            {isHovered ? (
              <ArrowUp className="w-5 h-5 text-amber-300 group-hover:-translate-y-0.5 transition-transform" />
            ) : (
              <span className="text-[10px] font-black font-mono text-amber-200">
                {Math.round(scrollProgress)}%
              </span>
            )}
          </div>

          <div className="absolute right-full mr-2.5 top-1/2 -translate-y-1/2 bg-[#200507] text-amber-200 text-[10px] font-bold px-2 py-1 rounded-lg border border-amber-400/40 shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Cuộn lên đầu trang ({Math.round(scrollProgress)}%)
          </div>
        </button>
      </div>
    </>
  );
}
