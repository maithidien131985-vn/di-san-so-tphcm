import React from 'react';
import { X, ChevronLeft, ChevronRight, Download, Maximize2 } from 'lucide-react';

export default function LightboxModal({ isOpen, onClose, images, currentIndex, setCurrentIndex }) {
  if (!isOpen || !images || images.length === 0) return null;

  const currentImage = images[currentIndex] || images[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md animate-fadeIn">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 z-50 w-11 h-11 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Prev / Next buttons */}
      <button
        onClick={handlePrev}
        className="absolute left-4 z-50 w-12 h-12 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
      >
        <ChevronLeft className="w-7 h-7" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 z-50 w-12 h-12 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
      >
        <ChevronRight className="w-7 h-7" />
      </button>

      {/* Image and Caption Container */}
      <div className="max-w-5xl w-full max-h-[90vh] p-4 flex flex-col items-center justify-center">
        <div className="relative max-h-[75vh] overflow-hidden rounded-2xl shadow-2xl">
          <img
            src={currentImage.src}
            alt={currentImage.title}
            className="max-h-[75vh] max-w-full object-contain rounded-2xl"
          />
        </div>

        {/* Caption */}
        <div className="mt-4 text-center text-white max-w-2xl">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-amber-500/80 text-white text-xs font-bold">
              {currentImage.year || 'Tư liệu'}
            </span>
            <span className="text-xs text-neutral-400">
              Ảnh {currentIndex + 1} / {images.length}
            </span>
          </div>
          <h4 className="font-serif-title font-bold text-lg text-amber-200">
            {currentImage.title}
          </h4>
          <p className="text-xs sm:text-sm text-neutral-300 mt-1">
            {currentImage.caption}
          </p>
        </div>
      </div>
    </div>
  );
}
