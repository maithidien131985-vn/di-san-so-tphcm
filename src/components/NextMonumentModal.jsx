import React from 'react';
import { X, MapPin, Award, Compass, ExternalLink, ArrowRight } from 'lucide-react';

export default function NextMonumentModal({ isOpen, onClose, monument }) {
  if (!isOpen || !monument) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#FAF7F2] w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-[#EADBC8] flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="bg-[#7B1113] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-amber-300">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-200 tracking-wider block">HỆ THỐNG DI SẢN SỐ TP.HCM</span>
              <h3 className="font-serif-title font-bold text-base sm:text-lg text-white">
                {monument.name}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          <div className="rounded-2xl overflow-hidden aspect-[16/9] bg-gray-100 border border-[#EADBC8] shadow-xs">
            <img
              src={monument.image}
              alt={monument.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
                {monument.ranking}
              </span>
              <span className="text-xs text-gray-500 font-semibold">{monument.category}</span>
            </div>

            <h4 className="text-xl font-black text-[#7B1113] font-serif-title">
              {monument.name}
            </h4>

            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <MapPin className="w-4 h-4 text-[#7B1113]" />
              <span>{monument.address}</span>
            </div>

            <p className="text-xs sm:text-sm text-[#4A3E36] leading-relaxed text-justify pt-1">
              {monument.summary}
            </p>

            {monument.highlight && (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 font-medium">
                🌟 {monument.highlight}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-[#EADBC8] flex items-center justify-between">
          <a
            href="https://www.google.com/maps/d/edit?mid=1fhqi2PL70jHLsJl9tasTiaxnl_rQwTA&usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#7B1113] font-bold hover:underline flex items-center gap-1"
          >
            <span>Xem trên Bản đồ di tích TP.HCM</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
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
