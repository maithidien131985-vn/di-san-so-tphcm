import React, { useEffect } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Image as ImageIcon
} from 'lucide-react';
import soundEffects from '../utils/soundEffects';

export default function LightboxModal({ isOpen, onClose, images, currentIndex, setCurrentIndex }) {
  if (!isOpen || !images || images.length === 0) return null;

  const currentImage = images[currentIndex] || images[0];

  const handlePrev = () => {
    soundEffects.playTap();
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    soundEffects.playTap();
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, images.length]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md animate-fadeIn p-2 sm:p-4 md:p-6">
      {/* Backdrop overlay close */}
      <div className="absolute inset-0 -z-10" onClick={onClose} />

      {/* Close button */}
      <button
        onClick={() => {
          soundEffects.playTap();
          onClose();
        }}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 w-11 h-11 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-all cursor-pointer shadow-xl hover:scale-110"
        title="Đóng (Esc)"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Main Container - Large screen view */}
      <div className="w-full max-w-7xl max-h-[92vh] h-full bg-gradient-to-br from-[#1C1613] via-[#15110E] to-[#0E0C0A] rounded-3xl border border-amber-500/30 shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        
        {/* Left / Main: Expanded Image Section (taking 70%-75% width & full height) */}
        <div className="lg:w-8/12 xl:w-9/12 relative flex-1 flex items-center justify-center bg-black/80 p-3 sm:p-6 overflow-hidden min-h-[350px] lg:min-h-[550px]">
          <img
            key={currentImage.src}
            src={currentImage.src}
            alt={currentImage.title}
            className="max-h-[75vh] sm:max-h-[82vh] w-auto max-w-full object-contain rounded-2xl shadow-2xl transition-transform duration-300 select-none animate-fadeIn"
          />

          {/* Floating badge */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-full bg-amber-500/90 text-amber-950 text-xs font-black shadow-lg flex items-center gap-1.5 backdrop-blur-sm">
              <ImageIcon className="w-4 h-4" />
              <span>Ảnh #{currentIndex + 1} / {images.length}</span>
            </span>
          </div>

          {/* Inline Navigation Arrows for Image Area */}
          <button
            onClick={handlePrev}
            className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 hover:bg-amber-500 text-white hover:text-amber-950 flex items-center justify-center transition-all cursor-pointer shadow-xl backdrop-blur-sm hover:scale-110"
            title="Ảnh trước (Mũi tên trái)"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 hover:bg-amber-500 text-white hover:text-amber-950 flex items-center justify-center transition-all cursor-pointer shadow-xl backdrop-blur-sm hover:scale-110"
            title="Ảnh tiếp theo (Mũi tên phải)"
          >
            <ChevronRight className="w-7 h-7" />
          </button>
        </div>

        {/* Right Sidebar: Title & Photo Gallery Thumbnails */}
        <div className="lg:w-4/12 xl:w-3/12 p-5 sm:p-6 flex flex-col justify-between space-y-4 border-t lg:border-t-0 lg:border-l border-amber-500/20 text-white bg-[#14100D]/90">
          <div className="space-y-4">
            <div className="space-y-2">
              <span className="text-[11px] uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Tư Liệu Ảnh Thực Địa</span>
              </span>
              <h3 className="font-serif-title font-bold text-lg sm:text-xl text-amber-100 leading-snug">
                {currentImage.title}
              </h3>
            </div>

            {/* Thumbnail Preview Strip */}
            {images.length > 1 && (
              <div className="space-y-2 pt-2 border-t border-white/10">
                <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                  Bộ sưu tập ({images.length} ảnh)
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-3 gap-2 max-h-[220px] overflow-y-auto pr-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        soundEffects.playTap();
                        setCurrentIndex(idx);
                      }}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-pointer group ${
                        idx === currentIndex
                          ? 'border-amber-400 ring-2 ring-amber-400/40 scale-105'
                          : 'border-white/10 hover:border-amber-400/60 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img.src}
                        alt={img.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <span className="absolute bottom-0.5 right-1 text-[9px] font-bold text-white bg-black/60 px-1 rounded">
                        #{idx + 1}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Navigation Buttons */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
            <button
              onClick={handlePrev}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer hover:scale-102"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Trước</span>
            </button>

            <button
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-amber-950 text-xs font-black shadow-lg transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105"
            >
              <span>Ảnh tiếp</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
