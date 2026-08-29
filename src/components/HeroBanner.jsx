import React, { useRef } from 'react';
import { Volume2, Play, Image as ImageIcon, Sparkles, MapPin, Shield, CheckCircle2, ChevronRight, Compass } from 'lucide-react';
import ParticleCanvas from './ParticleCanvas';
import TypewriterText from './TypewriterText';
import confetti from 'canvas-confetti';

export default function HeroBanner({
  info,
  onOpenAudio,
  onOpenVideo,
  onOpenGallery,
  isEditMode,
  onUpdateInfo
}) {
  const fileInputRef = useRef(null);

  // Ripple effect handler for buttons
  const createRipple = (event, callback) => {
    const button = event.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    const rect = button.getBoundingClientRect();
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - rect.left - radius}px`;
    circle.style.top = `${event.clientY - rect.top - radius}px`;
    circle.classList.add('ripple-effect');

    const ripple = button.getElementsByClassName('ripple-effect')[0];
    if (ripple) {
      ripple.remove();
    }
    button.appendChild(circle);

    if (callback) callback();
  };

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

  return (
    <div className="relative bg-gradient-to-b from-[#7B1113] via-[#8C1316] to-[#5A0C0E] text-white overflow-hidden pt-8 pb-16">
      {/* 1. Particle System Canvas */}
      <ParticleCanvas />

      {/* 3. Floating Animated Bubbles / Glowing Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[20%] left-[10%] w-24 h-24 rounded-full bg-amber-400/20 blur-xl animate-bubble-1" />
        <div className="absolute top-[60%] left-[80%] w-32 h-32 rounded-full bg-red-400/20 blur-2xl animate-bubble-2" />
        <div className="absolute top-[40%] left-[45%] w-20 h-20 rounded-full bg-amber-300/15 blur-lg animate-bubble-3" />
        <div className="absolute top-[75%] left-[25%] w-28 h-28 rounded-full bg-rose-400/15 blur-xl animate-bubble-4" />
        <div className="absolute top-[15%] left-[75%] w-36 h-36 rounded-full bg-yellow-400/20 blur-2xl animate-bubble-5" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Title, Subtitle, Typewriter, Actions (7 cols) */}
          <div className="lg:col-span-7 space-y-5 text-left">
            {/* Gold Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-[#7B1113] text-xs font-black shadow-lg uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 fill-[#7B1113]" />
              <span>{info.badge || 'Di tích quốc gia đặc biệt'}</span>
            </div>

            {/* Main Title */}
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-serif-title tracking-tight text-white leading-tight">
                {info.name}
              </h1>
              {/* 2. Typewriter Effect */}
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs sm:text-sm font-bold text-amber-400 uppercase tracking-widest">Chủ đề:</span>
                <TypewriterText />
              </div>
            </div>

            {/* Subtitle / Overview */}
            <p className="text-sm sm:text-base text-amber-100/90 leading-relaxed max-w-2xl font-normal">
              {info.subtitle || 'Chứng nhân lịch sử của ngày 30–4–1975, biểu tượng của nền độc lập, tự do và toàn vẹn non sông Việt Nam.'}
            </p>

            {/* Quick Action Buttons with Ripple & Glow */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {/* Nghe Thuyet Minh */}
              <button
                onClick={(e) => {
                  createRipple(e, onOpenAudio);
                  confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
                }}
                className="ripple-container glow-gold inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-[#7B1113] font-black text-xs sm:text-sm shadow-xl transition-all hover:scale-105 cursor-pointer"
              >
                <Volume2 className="w-4 h-4 text-[#7B1113]" />
                <span>Nghe thuyết minh (Tiếng Việt)</span>
              </button>

              {/* Xem Video */}
              <button
                onClick={(e) => createRipple(e, onOpenVideo)}
                className="ripple-container glow-crimson inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white text-xs sm:text-sm font-bold backdrop-blur-sm border border-white/20 transition-all hover:scale-105 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Xem video tài liệu</span>
              </button>

              {/* Xem Kho Anh */}
              <button
                onClick={(e) => createRipple(e, onOpenGallery)}
                className="ripple-container inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-black/20 hover:bg-black/30 text-amber-200 text-xs sm:text-sm font-bold border border-amber-300/30 transition-all hover:scale-105 cursor-pointer"
              >
                <ImageIcon className="w-4 h-4" />
                <span>Kho ảnh lịch sử</span>
              </button>
            </div>

            {/* Metadata Tags */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-amber-200/90 font-medium">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Quận 1, Thành phố Hồ Chí Minh</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>Xếp hạng: Quyết định số 1272/QĐ-TTg</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Image with Glass Card (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-400/40 glow-gold group">
              <img
                src={info.heroImage || '/assets/images/dinh-doc-lap-front.jpg'}
                alt={info.name}
                className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-700"
              />

              {/* Glass overlay badge on image */}
              <div className="absolute bottom-3 left-3 right-3 p-3 rounded-2xl glass-panel-dark flex items-center justify-between text-white">
                <div>
                  <span className="text-[10px] font-bold uppercase text-amber-300 block">Khuôn viên 12 ha</span>
                  <span className="text-xs font-bold text-white">135 Nam Kỳ Khởi Nghĩa, Q.1</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-amber-400 text-[#7B1113] flex items-center justify-center font-bold text-xs shadow">
                  ★
                </div>
              </div>

              {/* Change hero image button in Edit Mode */}
              {isEditMode && (
                <div className="absolute top-3 right-3 z-30">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#7B1113] text-xs font-black shadow-lg cursor-pointer flex items-center gap-1.5"
                  >
                    <span>📷 Đổi ảnh bìa</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 4. SVG Animated Waves at the bottom of Hero */}
      <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none z-10 pointer-events-none">
        {/* Layer 1: Slow wave */}
        <svg
          className="relative block w-[200%] h-12 text-[#FAF7F2]/40 animate-wave-slow"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 C150,90 350,-40 500,45 C650,130 900,10 1200,50 L1200,120 L0,120 Z"
            fill="currentColor"
          />
        </svg>
        {/* Layer 2: Fast solid wave matching background */}
        <svg
          className="relative block w-[200%] h-10 text-[#FAF7F2] -mt-6 animate-wave-fast"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 C200,80 400,10 600,60 C800,110 1000,20 1200,70 L1200,120 L0,120 Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </div>
  );
}
