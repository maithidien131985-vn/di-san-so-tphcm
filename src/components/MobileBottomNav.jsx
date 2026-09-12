import React from 'react';
import { Home, Compass, Map, Grid, Bot } from 'lucide-react';

export default function MobileBottomNav({
  viewMode = 'home',
  onNavigate,
  onOpenExplorer,
  onOpenMyMap,
  onOpenPassport,
  onToggleAIChat,
  activePassport,
  isChatOpen = false
}) {
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-amber-900/15 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-2 py-1.5 pb-safe">
      <div className="flex items-center justify-around gap-1">
        {/* 1. Trang chu */}
        <button
          onClick={() => onNavigate && onNavigate('home')}
          className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all cursor-pointer ${
            viewMode === 'home'
              ? 'text-[#7E1819] font-black'
              : 'text-stone-500 hover:text-stone-800 font-medium'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${viewMode === 'home' ? 'bg-rose-100 text-[#7E1819]' : ''}`}>
            <Home className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight font-semibold">Trang chủ</span>
        </button>

        {/* 2. Kho 103 Di Tich */}
        <button
          onClick={onOpenExplorer}
          className="flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl text-stone-500 hover:text-stone-800 font-medium transition-all cursor-pointer"
        >
          <div className="p-1 rounded-xl hover:bg-amber-50">
            <Grid className="w-5 h-5 text-amber-700" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight font-semibold">Kho 103</span>
        </button>

        {/* 3. NUT TRONG TAM: TRO LY AI CHATBOT */}
        <button
          onClick={onToggleAIChat}
          className="flex flex-col items-center justify-center flex-1 -mt-5 transition-all cursor-pointer group"
        >
          <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg border-2 border-white transition-transform duration-300 group-hover:scale-105 ${
            isChatOpen 
              ? 'bg-[#2A1214] text-white ring-2 ring-rose-300' 
              : 'bg-gradient-to-tr from-[#7E1819] via-[#A81B1F] to-amber-500 text-amber-200 ring-2 ring-amber-400/50 shadow-amber-900/30'
          }`}>
            <Bot className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-black text-[#7E1819] mt-0.5">Hỏi AI</span>
        </button>

        {/* 4. Ho Chieu Di San (Hoc sinh) */}
        <button
          onClick={onOpenPassport}
          className="flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl text-stone-500 hover:text-stone-800 font-medium transition-all cursor-pointer relative"
        >
          <div className="p-1 rounded-xl hover:bg-amber-50 relative flex items-center justify-center">
            {activePassport ? (
              <span className="text-lg leading-none">{activePassport.avatar || '🦁'}</span>
            ) : (
              <Compass className="w-5 h-5 text-amber-600 animate-spin-slow" />
            )}
            {activePassport && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white" />
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight font-bold text-[#7E1819]">
            {activePassport ? 'Thẻ khám phá' : 'Khám phá'}
          </span>
        </button>

        {/* 5. Ban Do Di Tich */}
        <button
          onClick={onOpenMyMap}
          className="flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl text-stone-500 hover:text-stone-800 font-medium transition-all cursor-pointer"
        >
          <div className="p-1 rounded-xl hover:bg-amber-50">
            <Map className="w-5 h-5 text-stone-600" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight font-semibold">Bản đồ</span>
        </button>
      </div>
    </div>
  );
}
