import React, { useState } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Maximize2, 
  BookOpen, 
  Sparkles, 
  Search, 
  HelpCircle,
  Share2,
  Eye
} from 'lucide-react';

export default function LightboxModal({ isOpen, onClose, images, currentIndex, setCurrentIndex }) {
  if (!isOpen || !images || images.length === 0) return null;

  const currentImage = images[currentIndex] || images[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const storyDescription = currentImage.caption || currentImage.title || 'Tư liệu ảnh thực địa di tích';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md animate-fadeIn p-4 sm:p-6">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 z-50 w-11 h-11 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-colors cursor-pointer shadow-lg"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Prev / Next buttons */}
      <button
        onClick={handlePrev}
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer shadow-lg hover:scale-110"
        title="Câu chuyện trước"
      >
        <ChevronLeft className="w-7 h-7" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer shadow-lg hover:scale-110"
        title="Câu chuyện tiếp theo"
      >
        <ChevronRight className="w-7 h-7" />
      </button>

      {/* Main Story Container: 2-column or responsive story layout */}
      <div className="max-w-6xl w-full max-h-[92vh] bg-gradient-to-br from-[#1E1815] to-[#120F0D] rounded-3xl border border-amber-500/30 shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        {/* Left: Image Container */}
        <div className="lg:w-7/12 relative flex items-center justify-center bg-black/60 p-4 sm:p-6 overflow-hidden min-h-[300px] lg:min-h-[500px]">
          <img
            src={currentImage.src}
            alt={currentImage.title}
            className="max-h-[70vh] max-w-full object-contain rounded-xl shadow-2xl transition-transform duration-300 hover:scale-102"
          />

          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-500/90 text-amber-950 text-xs font-black shadow-md flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Câu chuyện #{currentIndex + 1} / {images.length}</span>
            </span>
          </div>
        </div>

        {/* Right: Story Details & Historical Insight */}
        <div className="lg:w-5/12 p-6 sm:p-8 flex flex-col justify-between space-y-5 overflow-y-auto max-h-[50vh] lg:max-h-full border-t lg:border-t-0 lg:border-l border-amber-500/20 text-white">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <span className="text-[11px] uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Bí Ẩn Lịch Sử & Chứng Tích Thực Địa</span>
              </span>
              <h3 className="font-serif-title font-black text-xl sm:text-2xl text-amber-200 leading-tight">
                {currentImage.title}
              </h3>
            </div>

            {/* Historical Narrative Box */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                <Search className="w-4 h-4" />
                <span>Chi tiết câu chuyện:</span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-serif-title">
                {storyDescription}
              </p>
            </div>

            {/* Observation Prompt for Students */}
            <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                <Eye className="w-4 h-4" />
                <span>Gợi ý quan sát cho học sinh:</span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Hãy chú ý các nét kiến trúc, vết tích thời gian hoặc hiện vật nguyên bản được lưu giữ trong bức ảnh để hiểu thêm về đời sống và tinh thần của các thế hệ cha ông.
              </p>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
            <button
              onClick={handlePrev}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Ảnh trước</span>
            </button>

            <button
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-amber-950 text-xs font-black shadow-lg transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105"
            >
              <span>Khám phá ảnh tiếp</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
