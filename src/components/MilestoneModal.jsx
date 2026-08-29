import React from 'react';
import { X, Calendar, Clock, Sparkles } from 'lucide-react';

export default function MilestoneModal({ isOpen, onClose, milestone }) {
  if (!isOpen || !milestone) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#FAF7F2] w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-[#EADBC8] flex flex-col animate-scaleUp">
        {/* Header */}
        <div className="bg-[#7B1113] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-[#7B1113] flex items-center justify-center font-black text-sm">
              {milestone.year}
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-amber-200 font-bold block">Dấu mốc lịch sử</span>
              <h3 className="font-serif-title font-bold text-base text-white">
                {milestone.title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="p-4 rounded-2xl bg-white border border-[#EADBC8] space-y-2">
            <h4 className="font-bold text-sm text-[#7B1113] flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#7B1113]" />
              Chi tiết sự kiện:
            </h4>
            <p className="text-xs sm:text-sm text-[#4A3E36] leading-relaxed text-justify">
              {milestone.description}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-[#EADBC8] text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#7B1113] hover:bg-[#96171a] text-white text-xs font-bold shadow cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
