import React, { useState, useEffect } from 'react';
import { MapPin, Compass, CheckCircle2, XCircle, HelpCircle, ExternalLink, Sparkles, Navigation, Layers, Award, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import LocationMap from './LocationMap';
import ScrollReveal from './ScrollReveal';

import { soundEffects } from '../utils/soundEffects';

export default function MonumentLocationChallengeSection({
  info = {},
  map = {},
  onOpenMyMap
}) {
  const resolvedCoordinates = map?.coordinates || info?.coordinates || 
    (info?.lat && info?.lng ? [info.lat, info.lng] : null) || 
    (map?.lat && map?.lng ? [map.lat, map.lng] : null) || 
    [10.77715, 106.69534];

  const lat = resolvedCoordinates && !isNaN(resolvedCoordinates[0]) ? parseFloat(resolvedCoordinates[0]) : 10.77715;
  const lng = resolvedCoordinates && !isNaN(resolvedCoordinates[1]) ? parseFloat(resolvedCoordinates[1]) : 106.69534;
  const directionsUrl = info?.googleMapsDirectionsUrl || `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  // Extract location details for interactive question
  const address = info?.address || 'Thành phố Hồ Chí Minh';
  const name = info?.name || 'Di tích lịch sử';

  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState([]);

  useEffect(() => {
    // Reset state on monument change
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);

    // Create 4 plausible district options
    const targetAddress = address;
    const districtDistractors = [
      'Phường Bến Thành, Quận 1, Thành phố Hồ Chí Minh',
      'Khu vực sông Sài Gòn & Cảng Ba Son lịch sử',
      'Địa bàn căn cứ Hóc Môn – Củ Chi đất thép thành đồng',
      'Khu di tích lịch sử ven biển Long Sơn – Cần Giờ'
    ].filter(d => !targetAddress.toLowerCase().includes(d.toLowerCase()));

    const currentOptions = [
      targetAddress,
      districtDistractors[0] || 'Trung tâm Quận 1, TP.HCM',
      districtDistractors[1] || 'Khu vực Củ Chi, TP.HCM',
      districtDistractors[2] || 'Khu vực Chợ Lớn – Quận 5, TP.HCM'
    ];

    // Shuffle options
    setShuffledOptions(currentOptions.sort(() => Math.random() - 0.5));
  }, [name, address]);

  // Bấm chọn đáp án: Biết đúng/sai luôn, có âm thanh nhỏ và hiển thị giải thích
  const handleSelectOption = (opt) => {
    if (isAnswered) return;
    setSelectedOption(opt);
    const correct = opt === address;
    setIsCorrect(correct);
    setIsAnswered(true);

    if (correct) {
      soundEffects.playCorrect();
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    } else {
      soundEffects.playWrong();
    }
  };

  const handleReset = () => {
    soundEffects.playTap();
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
  };

  return (
    <section className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 py-6">
      <ScrollReveal>
        {/* Section Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 pb-3 border-b border-[#EAE3D9]">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 text-[#7E1819]">
              <Compass className="w-7 h-7 text-[#7E1819]" />
              <h2 className="font-serif-title font-black text-2xl sm:text-3xl lg:text-4xl tracking-tight text-[#7E1819]">
                Định Vị Không Gian & Tọa Độ Lịch Sử
              </h2>
            </div>
            <p className="text-xs sm:text-sm md:text-base text-[#555555]">
              Khám phá tọa độ GPS thực địa, định vị trên bản đồ số và giải mã bí ẩn vị trí địa lý của di tích.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenMyMap}
              className="px-4 py-2.5 rounded-xl bg-white border border-[#EAE3D9] text-[#7E1819] hover:bg-red-50 text-xs sm:text-sm font-black shadow-xs transition-all flex items-center gap-1.5 cursor-pointer hover:scale-102"
            >
              <Layers className="w-4 h-4 text-[#7E1819]" />
              <span>Xem Bản Đồ Toàn Cảnh</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 2 Columns Layout: Left Map (7 cols), Right Interactive Location Box (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* CỘT 1: BẢN ĐỒ TỌA ĐỘ GPS LỚN (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-4 sm:p-5 border border-[#EAE3D9] shadow-sm flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-xs sm:text-sm text-[#2C241E]">Bản Đồ GPS Trực Tuyến</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#7E1819] font-black bg-red-50 px-3 py-1 rounded-lg border border-red-200">
                <MapPin className="w-3.5 h-3.5 text-[#7E1819]" />
                <span>{lat.toFixed(5)}, {lng.toFixed(5)}</span>
              </div>
            </div>

            {/* Main Interactive Leaflet Map Container */}
            <div className="h-[340px] sm:h-[400px] rounded-xl overflow-hidden border border-gray-200 shadow-inner">
              <LocationMap
                lat={lat}
                lng={lng}
                coordinates={[lat, lng]}
                name={name}
                address={address}
                ranking={info?.ranking || info?.badge || 'Di tích'}
                onOpenMyMap={onOpenMyMap}
                googleMapsDirectionsUrl={directionsUrl}
              />
            </div>

            {/* Map Footer Bar */}
            <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm text-[#555555]">
              <div className="flex items-center gap-2">
                <span className="font-black text-[#7E1819]">Địa chỉ thực địa:</span>
                <span className="text-[#333333] font-medium truncate max-w-md">{address}</span>
              </div>
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-[#7E1819] hover:bg-[#911d1e] text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 shrink-0 hover:scale-102"
              >
                <Navigation className="w-3.5 h-3.5 text-amber-200" />
                <span>Chỉ đường trên Google Maps</span>
              </a>
            </div>
          </div>

          {/* CỘT 2: HỘP CÂU HỎI "BẠN ĐANG Ở ĐÂU?" (5 cols) (MÀU ĐỎ ĐÔ) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#3A080B] via-[#590D11] to-[#7E1819] text-white rounded-2xl p-5 sm:p-7 border-2 border-amber-400/60 shadow-lg flex flex-col justify-between space-y-4 relative overflow-hidden">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-amber-400/30">
                <div className="flex items-center gap-2.5 text-amber-300 font-black">
                  <div className="w-9 h-9 rounded-xl bg-amber-400 text-[#7E1819] flex items-center justify-center shadow-xs font-bold shrink-0">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif-title text-xl sm:text-2xl text-amber-200 font-black">
                      Bạn Đang Ở Đâu?
                    </h3>
                    <p className="text-xs text-rose-200 font-medium">
                      Khám phá & Xác định vị trí địa lý di tích
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/50 text-xs font-black uppercase tracking-wider shrink-0">
                  +10 Điểm
                </span>
              </div>

              {/* Question Text */}
              <div className="p-4 rounded-xl bg-black/35 border border-amber-400/40 shadow-xs">
                <p className="font-serif-title font-bold text-base sm:text-lg text-amber-100 leading-relaxed">
                  🧭 Dựa vào bản đồ và kiến thức của bạn, hãy cho biết di tích <span className="text-amber-300 font-extrabold underline decoration-amber-400/50">"{name}"</span> tọa lạc tại địa chỉ nào dưới đây?
                </p>
              </div>
            </div>

            {/* Options List */}
            <div className="space-y-2.5 my-2">
              {shuffledOptions.map((opt, idx) => {
                const isSelected = selectedOption === opt;
                let optionStyle = "bg-white/10 hover:bg-white/20 border-white/15 text-rose-50 hover:scale-[1.01]";

                if (isAnswered) {
                  if (opt === address) {
                    optionStyle = "bg-emerald-600/90 border-emerald-400 text-white font-bold ring-2 ring-emerald-300";
                  } else if (isSelected && !isCorrect) {
                    optionStyle = "bg-rose-700/80 border-rose-400 text-white line-through ring-1 ring-rose-300";
                  } else {
                    optionStyle = "bg-black/30 border-white/10 text-stone-400 opacity-60";
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(opt)}
                    disabled={isAnswered}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 text-xs sm:text-sm cursor-pointer ${optionStyle}`}
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-300 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="leading-snug">{opt}</span>
                    </div>
                    {isAnswered && opt === address && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
                    )}
                    {isAnswered && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-300 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Answer Result & Explanation Box */}
            {isAnswered && (
              <div className={`p-4 rounded-xl border animate-fadeIn space-y-2 ${isCorrect ? 'bg-emerald-950/60 border-emerald-400/60 text-emerald-100' : 'bg-black/40 border-amber-400/40 text-rose-100'}`}>
                <div className="flex items-center gap-2 font-bold text-sm text-amber-300">
                  {isCorrect ? (
                    <>
                      <Sparkles className="w-4 h-4 text-emerald-300" />
                      <span>Chính xác tuyệt vời! Bạn đã xác định vị trí thành công.</span>
                    </>
                  ) : (
                    <>
                      <HelpCircle className="w-4 h-4 text-amber-300" />
                      <span>Chưa chính xác, hãy xem lời giải thích bên dưới nhé!</span>
                    </>
                  )}
                </div>
                <div className="text-xs leading-relaxed space-y-1">
                  <p>
                    📍 <strong className="text-amber-200">Địa chỉ chính xác:</strong> {address}
                  </p>
                  <p className="text-rose-100/80">
                    💡 <em>Lời giải:</em> Di tích mang ý nghĩa lịch sử sâu sắc, được xếp hạng và gắn liền với vị trí địa lý tại {address}.
                  </p>
                </div>
              </div>
            )}

            {/* Actions Button */}
            {isAnswered && (
              <div className="pt-2">
                <button
                  onClick={handleReset}
                  className="w-full py-2.5 px-4 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-200 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer border border-amber-400/50"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Làm Lại</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
