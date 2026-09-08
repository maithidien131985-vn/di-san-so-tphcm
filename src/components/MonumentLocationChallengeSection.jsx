import React, { useState, useEffect } from 'react';
import { MapPin, Compass, CheckCircle2, XCircle, HelpCircle, ExternalLink, Sparkles, Navigation, Layers, Award, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import LocationMap from './LocationMap';
import ScrollReveal from './ScrollReveal';

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

  const handleSelectOption = (opt) => {
    if (isAnswered) return;
    setSelectedOption(opt);
  };

  const handleCheckAnswer = () => {
    if (!selectedOption) return;
    const correct = selectedOption === address;
    setIsCorrect(correct);
    setIsAnswered(true);

    if (correct) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  };

  const handleReset = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
  };

  return (
    <section className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 py-6">
      <ScrollReveal>
        {/* Section Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 pb-3 border-b border-[#EAE3D9]">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 text-[#7E1819]">
              <Compass className="w-6 h-6 text-[#7E1819]" />
              <h2 className="font-serif-title font-black text-xl sm:text-2xl lg:text-3xl tracking-wide text-[#7E1819]">
                Định Vị Không Gian & Tọa Độ Lịch Sử
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#666666]">
              Khám phá tọa độ GPS thực địa, định vị trên bản đồ số và giải mã bí ẩn vị trí địa lý của di tích.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenMyMap}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 hover:scale-102 cursor-pointer"
            >
              <Layers className="w-4 h-4" />
              <span>Mở Bản Đồ 103 Di Tích Toàn Cảnh</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* CỘT 1: BẢN ĐỒ TỌA ĐỘ GPS (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-5 sm:p-6 border border-[#EAE3D9] shadow-sm flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-[#7E1819]">
                <MapPin className="w-5 h-5" />
                <h3 className="font-serif-title font-bold text-base sm:text-lg text-[#2C241E]">
                  Bản Đồ Số Tọa Độ GPS
                </h3>
              </div>
              <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-red-50 text-[#7E1819] border border-red-200 font-bold">
                📍 {lat.toFixed(5)}°N, {lng.toFixed(5)}°E
              </span>
            </div>

            {/* Map Container */}
            <div className="relative w-full h-[320px] sm:h-[380px] lg:h-[420px] rounded-xl overflow-hidden border border-gray-200 shadow-inner">
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
            <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#555555]">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#7E1819]">Địa chỉ thực địa:</span>
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

          {/* CỘT 2: THỬ THÁCH "BẠN ĐANG Ở ĐÂU?" (5 cols) (MÀU ĐỎ ĐÔ) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#3A080B] via-[#590D11] to-[#7E1819] text-white rounded-2xl p-5 sm:p-6 border-2 border-amber-400/60 shadow-lg flex flex-col justify-between space-y-4 relative overflow-hidden">
            <div className="space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-amber-400/30">
                <div className="flex items-center gap-2 text-amber-300 font-black">
                  <div className="w-8 h-8 rounded-xl bg-amber-400 text-[#7E1819] flex items-center justify-center shadow-xs font-bold">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif-title text-lg sm:text-xl text-amber-200 font-black">
                      Thử Thách: Bạn Đang Ở Đâu?
                    </h3>
                    <p className="text-[11px] text-rose-200 font-medium">
                      Khám phá & Xác định vị trí địa lý di tích
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/50 text-[10px] font-black uppercase tracking-wider">
                  +10 Điểm Thám Hiểm
                </span>
              </div>

              {/* Question Text */}
              <div className="p-3.5 rounded-xl bg-black/30 border border-amber-400/30 shadow-xs">
                <p className="font-serif-title font-bold text-sm sm:text-base text-amber-100 leading-relaxed">
                  🧭 Dựa vào bản đồ và kiến thức của bạn, hãy cho biết di tích <span className="text-amber-300 font-extrabold underline decoration-amber-400/50">"{name}"</span> tọa lạc tại địa chỉ nào dưới đây?
                </p>
              </div>
            </div>

            {/* Options List */}
            <div className="space-y-2.5 my-2">
              {shuffledOptions.map((opt, idx) => {
                const isSelected = selectedOption === opt;
                let optionStyle = "bg-white/10 hover:bg-white/20 border-white/15 text-rose-50";

                if (isAnswered) {
                  if (opt === address) {
                    optionStyle = "bg-emerald-600/90 border-emerald-400 text-white font-bold ring-2 ring-emerald-300";
                  } else if (isSelected && !isCorrect) {
                    optionStyle = "bg-rose-700/80 border-rose-400 text-white line-through ring-1 ring-rose-300";
                  } else {
                    optionStyle = "bg-black/30 border-white/10 text-stone-400 opacity-60";
                  }
                } else if (isSelected) {
                  optionStyle = "bg-amber-400/25 border-amber-400 text-amber-200 font-bold ring-2 ring-amber-300 shadow-xs";
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
                      <span>Chính xác tuyệt vời! Bạn đã mở khóa vị trí thành công.</span>
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
            <div className="pt-2">
              {!isAnswered ? (
                <button
                  onClick={handleCheckAnswer}
                  disabled={!selectedOption}
                  className={`w-full py-3 px-4 rounded-xl font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${selectedOption ? 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-[#7E1819]' : 'bg-white/10 text-stone-400 cursor-not-allowed border border-white/10'}`}
                >
                  <Sparkles className="w-4 h-4 text-amber-800" />
                  <span>Xác Nhận Vị Trí</span>
                </button>
              ) : (
                <button
                  onClick={handleReset}
                  className="w-full py-3 px-4 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-200 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer border border-amber-400/50"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Thử Thách Lại</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
