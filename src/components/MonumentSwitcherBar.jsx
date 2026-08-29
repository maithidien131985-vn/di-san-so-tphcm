import React from 'react';
import { ChevronLeft, ChevronRight, Grid } from 'lucide-react';
import { allMonumentsList } from '../data/allMonumentsData';

export default function MonumentSwitcherBar({
  currentStt = 1,
  onSelectStt,
  onOpenExplorer
}) {
  const currentIndex = allMonumentsList.findIndex(m => m.stt === currentStt);
  const currentMonument = allMonumentsList[currentIndex] || allMonumentsList[0];

  const handlePrev = () => {
    const prevIdx = currentIndex > 0 ? currentIndex - 1 : allMonumentsList.length - 1;
    onSelectStt(allMonumentsList[prevIdx].stt);
  };

  const handleNext = () => {
    const nextIdx = currentIndex < allMonumentsList.length - 1 ? currentIndex + 1 : 0;
    onSelectStt(allMonumentsList[nextIdx].stt);
  };

  return (
    <div className="bg-[#2C241E] text-white border-b border-amber-900/40 py-2.5 px-4 sticky top-[60px] z-30 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left: Current Monument indicator */}
        <div className="flex items-center gap-2.5">
          <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-amber-950 font-black text-xs shadow-xs">
            #{currentMonument.stt}/103
          </span>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 hidden sm:inline">Di tích đang xem:</span>
            <span className="font-bold text-amber-200 truncate max-w-[200px] sm:max-w-[320px]">
              {currentMonument.info.name}
            </span>
            <span className="hidden md:inline-block text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-white/10 text-white/80">
              {currentMonument.info.ranking}
            </span>
          </div>
        </div>

        {/* Center & Right: Navigation Controls & Quick Jump Dropdown */}
        <div className="flex items-center gap-2">
          {/* Quick Dropdown selector */}
          <select
            value={currentStt}
            onChange={(e) => onSelectStt(parseInt(e.target.value))}
            className="bg-[#3e342c] text-white border border-white/20 rounded-xl px-2.5 py-1.5 text-xs font-bold outline-none cursor-pointer hover:border-amber-400 transition-colors max-w-[150px] sm:max-w-[220px] truncate"
          >
            {allMonumentsList.map(m => (
              <option key={m.stt} value={m.stt}>
                #{m.stt}. {m.info.name}
              </option>
            ))}
          </select>

          {/* Prev Button */}
          <button
            onClick={handlePrev}
            className="p-1.5 sm:px-2.5 sm:py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold flex items-center gap-1 cursor-pointer transition-all hover:scale-105"
            title="Di tích trước"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Trước</span>
          </button>

          {/* Open Full 103 Directory Modal */}
          <button
            onClick={onOpenExplorer}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-amber-950 font-black cursor-pointer shadow-xs transition-all hover:scale-105"
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Kho 103 Di Tích</span>
          </button>

          {/* Next Button */}
          <button
            onClick={handleNext}
            className="p-1.5 sm:px-2.5 sm:py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold flex items-center gap-1 cursor-pointer transition-all hover:scale-105"
            title="Di tích tiếp theo"
          >
            <span className="hidden sm:inline">Tiếp</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
