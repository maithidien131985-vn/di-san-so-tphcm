import React, { useRef } from 'react';
import { Sparkles, MapPin, ChevronRight, Home, Star } from 'lucide-react';

export default function HeroBanner({
  info,
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

  const bgImage = info.heroImage || '/assets/images/dinh-doc-lap-front.jpg';

  return (
    <div className="relative w-full h-[360px] sm:h-[420px] lg:h-[480px] bg-[#1a0506] text-white overflow-hidden select-none">
      {/* Background Hero Image */}
      <img
        src={bgImage}
        alt={info.name}
        className="absolute inset-0 w-full h-full object-cover object-center transform scale-100 transition-transform duration-700"
      />

      {/* Subtle Cinematic Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/50" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />

      {/* Edit Mode button for Image */}
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
            className="px-3 py-1.5 rounded-xl bg-white text-[#7E1819] text-xs font-bold shadow-lg hover:bg-amber-100 cursor-pointer"
          >
            📷 Đổi ảnh nền bìa
          </button>
        </div>
      )}

      {/* Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-between py-6 sm:py-8 relative z-20">
        {/* Top Breadcrumb */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-white/80 font-medium">
          <button
            onClick={onNavigateHome}
            className="hover:text-amber-300 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Trang chủ</span>
          </button>
          <span>&gt;</span>
          <span className="hover:text-amber-300 cursor-pointer">Kho di tích</span>
          <span>&gt;</span>
          <span className="text-white font-bold uppercase truncate max-w-[200px] sm:max-w-none">
            {info.name}
          </span>
        </div>

        {/* Bottom Left Title & Badge */}
        <div className="space-y-3 pb-8 sm:pb-12 max-w-3xl">
          {/* Gold Star Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#3D2614]/85 text-amber-300 border border-amber-400/30 text-xs font-bold shadow-md">
            <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
            <span>{info.badge || info.ranking || 'Di tích quốc gia đặc biệt'}</span>
          </div>

          {/* Monument Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-serif-title tracking-tight text-white leading-tight uppercase text-shadow-lg">
            {info.name}
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base lg:text-lg text-amber-100/95 font-medium leading-relaxed max-w-2xl drop-shadow">
            {info.subtitle || 'Chứng nhân lịch sử của ngày 30–4–1975'}
          </p>
        </div>
      </div>
    </div>
  );
}
