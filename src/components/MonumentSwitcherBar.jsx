import React from 'react';
import { ChevronLeft, ChevronRight, Grid } from 'lucide-react';
import { allMonumentsList } from '../data/allMonumentsData';

export default function MonumentSwitcherBar({
  currentStt = 1,
  onSelectMonument,
  onSelectStt,
  onOpenExplorer
}) {
  const handleSelect = onSelectMonument || onSelectStt || (() => {});
  const currentIndex = allMonumentsList.findIndex(m => m.stt === currentStt);
  const currentMonument = allMonumentsList[currentIndex] || allMonumentsList[0];

  const prevIdx = currentIndex > 0 ? currentIndex - 1 : allMonumentsList.length - 1;
  const nextIdx = currentIndex < allMonumentsList.length - 1 ? currentIndex + 1 : 0;
  
  const prevMonument = allMonumentsList[prevIdx];
  const nextMonument = allMonumentsList[nextIdx];

  const handlePrev = () => {
    handleSelect(prevMonument.stt);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNext = () => {
    handleSelect(nextMonument.stt);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-[#2C241E] text-white border-b border-amber-900/40 py-2.5 px-3 sm:px-4 sticky top-[60px] z-30 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5 text-xs">
        {/* Left: Current Monument indicator */}
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-amber-950 font-black text-xs shadow-xs">
            #{currentMonument.stt}/103
          </span>
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-stone-400 hidden sm:inline text-xs">Di tích:</span>
            <span className="font-bold text-amber-200 truncate max-w-[150px] sm:max-w-[260px] md:max-w-[360px]">
              {currentMonument.info?.name}
            </span>
            {currentMonument.info?.ranking && (
              <span className="hidden lg:inline-block text-[10px] uppercase font-black px-2 py-0.5 rounded bg-white/10 text-white/80">
                {currentMonument.info.ranking}
              </span>
            )}
          </div>
        </div>

        {/* Center & Right: Navigation Controls & Quick Jump Dropdown */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick Dropdown selector */}
          <select
            value={currentStt}
            onChange={(e) => {
              handleSelect(parseInt(e.target.value));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="bg-[#3e342c] text-white border border-white/20 rounded-xl px-2.5 py-1.5 text-xs font-bold outline-none cursor-pointer hover:border-amber-400 transition-colors max-w-[130px] sm:max-w-[200px] truncate"
            title="Chọn nhanh di tích bất kỳ"
          >
            {allMonumentsList.map(m => (
              <option key={m.stt} value={m.stt}>
                #{m.stt}. {m.info?.name}
              </option>
            ))}
          </select>

          {/* Prev Button -> Chuyển đến di tích trước */}
          <button
            onClick={handlePrev}
            className="px-2 sm:px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-black flex items-center gap-1 cursor-pointer transition-all hover:scale-105 border border-white/10 hover:border-amber-400/50"
            title={`Di tích trước: #${prevMonument.stt}. ${prevMonument.info?.name}`}
          >
            <ChevronLeft className="w-4 h-4 text-amber-300" />
            <span className="hidden sm:inline">Trước</span>
            <span className="text-[10px] opacity-75 font-normal">#{prevMonument.stt}</span>
          </button>

          {/* Open Full 103 Directory Modal */}
          <button
            onClick={onOpenExplorer}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-amber-950 font-black cursor-pointer shadow-xs transition-all hover:scale-105"
            title="Mở thư viện toàn bộ 103 Di tích"
          >
            <Grid className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Kho 103 Di Tích</span>
            <span className="md:hidden">103</span>
          </button>

          {/* Next Button -> Chuyển đến di tích tiếp theo */}
          <button
            onClick={handleNext}
            className="px-2 sm:px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-black flex items-center gap-1 cursor-pointer transition-all hover:scale-105 border border-white/10 hover:border-amber-400/50"
            title={`Di tích tiếp theo: #${nextMonument.stt}. ${nextMonument.info?.name}`}
          >
            <span className="hidden sm:inline">Tiếp</span>
            <span className="text-[10px] opacity-75 font-normal">#{nextMonument.stt}</span>
            <ChevronRight className="w-4 h-4 text-amber-300" />
          </button>
        </div>
      </div>
    </div>
  );
}
