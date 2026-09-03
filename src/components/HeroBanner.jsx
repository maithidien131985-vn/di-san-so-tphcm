import React, { useRef } from 'react';
import { Sparkles, MapPin, ChevronRight, Home, Star, Image as ImageIcon, Camera } from 'lucide-react';

export default function HeroBanner({
  info,
  gallery = [],
  onOpenAudio,
  onOpenVideo,
  onOpenGallery,
  isEditMode,
  onUpdateInfo,
  onNavigateHome
}) {
  const fileInputRef = useRef(null);

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (onUpdateInfo) {
        onUpdateInfo('heroImage', event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const bgImage = info.heroImage || gallery?.[0]?.src || '/assets/images/dinh-doc-lap-front.jpg';
  const totalPhotosCount = gallery && gallery.length > 0 ? gallery.length : 4;
  const previewPhotos = gallery && gallery.length >= 4 
    ? gallery.slice(0, 4) 
    : [
        gallery?.[0] || { src: bgImage, title: info.name },
        gallery?.[1] || { src: bgImage, title: info.name },
        gallery?.[2] || { src: bgImage, title: info.name },
        gallery?.[3] || { src: bgImage, title: info.name }
      ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-4 select-none">
      {/* 1. Top Breadcrumb & Quick Badges */}
      <div className="flex items-center justify-between gap-2 text-xs sm:text-sm text-stone-600 font-medium py-2.5">
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <button
            onClick={onNavigateHome}
            className="hover:text-[#8B1417] flex items-center gap-1 cursor-pointer transition-colors font-bold text-[#8B1417]"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Trang chủ</span>
          </button>
          <span>&gt;</span>
          <span className="text-stone-500 hover:text-[#8B1417] cursor-pointer" onClick={onNavigateHome}>
            Kho 103 di tích
          </span>
          <span>&gt;</span>
          <span className="text-[#8B1417] font-black uppercase truncate max-w-[200px] sm:max-w-none">
            {info.name}
          </span>
        </div>

        {/* Ranking Badge */}
        <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF4F0] text-[#8B1417] border border-rose-200 text-xs font-bold shadow-2xs">
          <Star className="w-3.5 h-3.5 fill-[#8B1417] text-[#8B1417]" />
          <span>{info.badge || info.ranking || 'Di tích Quốc gia Đặc biệt'}</span>
        </div>
      </div>

      {/* 2. Main Hero Banner Frame with Natural Colors & Docked Gallery Strip */}
      <div className="relative w-full h-[360px] sm:h-[460px] md:h-[540px] lg:h-[600px] rounded-3xl overflow-hidden bg-stone-900 border-2 border-rose-200/80 shadow-2xl group">
        {/* Background Cover Image - Natural & Vivid Colors */}
        <img
          src={bgImage}
          alt={info.name}
          className="w-full h-full object-cover object-center scale-100 transition-transform duration-700"
        />

        {/* Localized Subtle Gradients for Legibility (Top & Bottom only, keeping center naturally bright) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/25 to-transparent pointer-events-none" />

        {/* Edit Mode Button */}
        {isEditMode && (
          <div className="absolute top-4 right-4 z-30">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageFileChange}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-2 rounded-xl bg-white text-[#8B1417] text-xs font-bold shadow-lg hover:bg-rose-50 cursor-pointer flex items-center gap-1.5"
            >
              <Camera className="w-4 h-4" />
              <span>Đổi ảnh bìa</span>
            </button>
          </div>
        )}

        {/* Top-Left Title & Information Block */}
        <div className="absolute top-4 sm:top-6 lg:top-8 left-4 sm:left-6 lg:left-8 right-4 sm:right-6 lg:right-8 z-20 max-w-3xl space-y-2">
          {/* Mobile Ranking Badge */}
          <div className="sm:hidden inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-amber-300 border border-amber-400/40 text-[11px] font-bold shadow-md">
            <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
            <span>{info.badge || info.ranking || 'Di tích Quốc gia'}</span>
          </div>

          {/* Monument Name */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black font-serif-title tracking-tight text-white leading-tight uppercase drop-shadow-xl text-shadow-lg">
            {info.name}
          </h1>

          {/* Subtitle / Historic Tagline */}
          <p className="text-xs sm:text-sm md:text-base text-amber-200 font-medium leading-relaxed max-w-2xl drop-shadow-md">
            {info.subtitle || 'Chứng nhân lịch sử & Di sản văn hóa trường tồn'}
          </p>
        </div>

        {/* 3. THE 4 BOTTOM GALLERY THUMBNAIL CARDS (AS SHOWN IN SAMPLE IMAGE) */}
        <div className="absolute bottom-3 sm:bottom-5 md:bottom-6 left-3 sm:left-5 md:left-6 right-3 sm:right-5 md:right-6 z-20">
          <div className="grid grid-cols-4 gap-2 sm:gap-3.5 md:gap-4 max-w-xl sm:max-w-2xl md:max-w-3xl">
            {/* Card 1 */}
            <div
              onClick={() => onOpenGallery && onOpenGallery(0)}
              className="group/card relative aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden border-2 border-white/90 shadow-xl bg-black/50 cursor-pointer hover:scale-105 hover:border-amber-300 transition-all duration-300 ring-2 ring-black/30"
              title="Xem ảnh di tích 1"
            >
              <img
                src={previewPhotos[0]?.src}
                alt={previewPhotos[0]?.title || info.name}
                className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center justify-center">
                <span className="px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-bold">Xem</span>
              </div>
            </div>

            {/* Card 2 */}
            <div
              onClick={() => onOpenGallery && onOpenGallery(1)}
              className="group/card relative aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden border-2 border-white/90 shadow-xl bg-black/50 cursor-pointer hover:scale-105 hover:border-amber-300 transition-all duration-300 ring-2 ring-black/30"
              title="Xem ảnh di tích 2"
            >
              <img
                src={previewPhotos[1]?.src}
                alt={previewPhotos[1]?.title || info.name}
                className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center justify-center">
                <span className="px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-bold">Xem</span>
              </div>
            </div>

            {/* Card 3 */}
            <div
              onClick={() => onOpenGallery && onOpenGallery(2)}
              className="group/card relative aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden border-2 border-white/90 shadow-xl bg-black/50 cursor-pointer hover:scale-105 hover:border-amber-300 transition-all duration-300 ring-2 ring-black/30"
              title="Xem ảnh di tích 3"
            >
              <img
                src={previewPhotos[2]?.src}
                alt={previewPhotos[2]?.title || info.name}
                className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center justify-center">
                <span className="px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-bold">Xem</span>
              </div>
            </div>

            {/* Card 4: "Xem tất cả (X)" with darkened translucent overlay */}
            <div
              onClick={() => onOpenGallery && onOpenGallery(0)}
              className="group/card relative aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden border-2 border-white/90 shadow-xl bg-black/60 cursor-pointer hover:scale-105 hover:border-amber-300 transition-all duration-300 ring-2 ring-black/30 flex items-center justify-center"
              title="Xem tất cả bộ sưu tập ảnh"
            >
              <img
                src={previewPhotos[3]?.src}
                alt="Xem tất cả ảnh"
                className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-500 opacity-60"
              />
              <div className="absolute inset-0 bg-black/65 backdrop-blur-[2px] flex flex-col items-center justify-center p-1 text-center transition-all group-hover/card:bg-black/75">
                <ImageIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 mb-0.5" />
                <span className="text-white font-black text-[10px] sm:text-xs md:text-sm tracking-tight leading-tight">
                  Xem tất cả ({totalPhotosCount})
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
