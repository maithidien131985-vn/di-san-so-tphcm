import React from 'react';
import { Home, ChevronRight } from 'lucide-react';

export default function Breadcrumb({ monumentName, onNavigate }) {
  return (
    <div className="bg-[#FAF7F2] border-b border-[#EADBC8]/60 py-2.5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-[#8C7A6B]">
          <button 
            onClick={() => onNavigate('home')}
            className="flex items-center gap-1 hover:text-[#7B1113] transition-colors cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Trang chủ</span>
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-[#C8B9A6]" />
          <button 
            onClick={() => onNavigate('monuments')}
            className="hover:text-[#7B1113] transition-colors cursor-pointer"
          >
            Kho di tích
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-[#C8B9A6]" />
          <span className="font-bold text-[#7B1113] tracking-wide uppercase">
            {monumentName || 'DI TÍCH DINH ĐỘC LẬP'}
          </span>
        </nav>
      </div>
    </div>
  );
}
