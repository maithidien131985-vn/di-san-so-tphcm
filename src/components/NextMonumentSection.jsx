import React, { useState, useMemo } from 'react';
import { Compass, ArrowRight, MapPin, Sparkles, Navigation, Layers, ChevronRight, Award } from 'lucide-react';
import { allMonumentsList } from '../data/allMonumentsData';

// Haversine formula to compute exact distance in km between two GPS points
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 999999;
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function NextMonumentSection({
  currentStt = 1,
  allMonuments = allMonumentsList,
  onSelectMonument
}) {
  const [activeTab, setActiveTab] = useState('nearby'); // 'nearby' | 'same_type'

  const currentMonument = useMemo(() => {
    return allMonuments.find(m => m.stt === currentStt) || allMonuments[0];
  }, [currentStt, allMonuments]);

  // 1. Nearby Monuments (Sorted by real GPS distance)
  const nearbyMonuments = useMemo(() => {
    const curLat = currentMonument?.info?.lat;
    const curLng = currentMonument?.info?.lng;

    return allMonuments
      .filter(m => m.stt !== currentStt)
      .map(m => ({
        ...m,
        distanceKm: calculateDistanceKm(curLat, curLng, m.info?.lat, m.info?.lng)
      }))
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .slice(0, 4);
  }, [currentMonument, currentStt, allMonuments]);

  // 2. Same Type Monuments (Matching info.type, e.g. Lịch sử, Kiến trúc nghệ thuật, Khảo cổ học...)
  const sameTypeMonuments = useMemo(() => {
    const curType = currentMonument?.info?.type || 'Lịch sử';
    return allMonuments
      .filter(m => m.stt !== currentStt && m.info?.type === curType)
      .slice(0, 4);
  }, [currentMonument, currentStt, allMonuments]);

  const displayList = activeTab === 'nearby' ? nearbyMonuments : sameTypeMonuments;
  const featuredNext = displayList[0];
  const otherNext = displayList.slice(1, 4);

  const handleChoose = (stt) => {
    if (onSelectMonument) {
      onSelectMonument(stt);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const currentName = currentMonument?.info?.name || 'Di tích lịch sử';
  const nextName = featuredNext?.info?.name || 'Di tích tiếp theo';
  const distanceText = activeTab === 'nearby' && featuredNext.distanceKm !== undefined && featuredNext.distanceKm < 9999
    ? (featuredNext.distanceKm < 1 ? `khoảng ${Math.round(featuredNext.distanceKm * 1000)} mét` : `khoảng ${featuredNext.distanceKm.toFixed(1)} km`)
    : 'trong khu vực lân cận';

  // ==========================================
  // HIỆU ỨNG CHỮ XUẤT HIỆN TỪNG KÝ TỰ (TYPEWRITER REVEAL EFFECT)
  // ==========================================
  const [displayedTitle, setDisplayedTitle] = useState('');
  const [displayedDesc, setDisplayedDesc] = useState('');
  const [typingStep, setTypingStep] = useState('title'); // 'title' | 'desc' | 'done'

  const fullTitle = `🎉 Bạn vừa hoàn thành điều tra di tích "${currentName}" và tích lũy thành công +100 Điểm Thám Hiểm!`;
  const fullDesc = `🧭 Di tích tiếp theo dành cho bạn: "${nextName}" (${distanceText})... Hãy tiếp tục mở rộng bản đồ và giải mã những bí ẩn lịch sử tiếp theo!`;

  useEffect(() => {
    setDisplayedTitle('');
    setDisplayedDesc('');
    setTypingStep('title');

    let titleIdx = 0;
    let descIdx = 0;
    let timer;

    const typeTitle = () => {
      if (titleIdx <= fullTitle.length) {
        setDisplayedTitle(fullTitle.slice(0, titleIdx));
        titleIdx += 2; // Gõ nhanh mượt mà
        timer = setTimeout(typeTitle, 20);
      } else {
        setDisplayedTitle(fullTitle);
        setTypingStep('desc');
        timer = setTimeout(typeDesc, 150);
      }
    };

    const typeDesc = () => {
      if (descIdx <= fullDesc.length) {
        setDisplayedDesc(fullDesc.slice(0, descIdx));
        descIdx += 2;
        timer = setTimeout(typeDesc, 18);
      } else {
        setDisplayedDesc(fullDesc);
        setTypingStep('done');
      }
    };

    timer = setTimeout(typeTitle, 200);

    return () => clearTimeout(timer);
  }, [currentName, nextName, distanceText]);

  return (
    <section className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 pt-4 pb-12 space-y-6">
      {/* ========================================================================= */}
      {/* BANNER LỜI DẪN NỔI BẬT: CHUYỂN TIẾP HÀNH TRÌNH VỚI HIỆU ỨNG CHỮ XUẤT HIỆN */}
      {/* ========================================================================= */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-r from-[#4A0609] via-[#7E1819] to-[#9E1B1D] text-white p-6 sm:p-8 border-2 border-amber-400/90 ring-4 ring-amber-500/25">
        {/* Ambient background glow & Watermark */}
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-6 bottom-0 opacity-10 pointer-events-none hidden md:block">
          <Award className="w-48 h-48 text-amber-300" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3.5 max-w-4xl flex-1">
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/25 border border-amber-300/50 text-amber-300 text-xs font-black uppercase tracking-wider shadow-inner">
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>GHI NHẬN THÀNH TỰU THÁM HIỂM</span>
            </div>

            {/* Lời dẫn chính có hiệu ứng chữ xuất hiện (Typewriter) */}
            <div className="space-y-2">
              <h3 className="font-serif-title font-black text-lg sm:text-2xl text-amber-100 leading-snug min-h-[36px]">
                {displayedTitle}
                {typingStep === 'title' && (
                  <span className="inline-block w-2.5 h-5 ml-1 bg-amber-400 animate-pulse align-middle shadow-[0_0_8px_#fbbf24]" />
                )}
              </h3>
              
              <p className="text-sm sm:text-base text-rose-100/95 leading-relaxed font-medium min-h-[28px]">
                {displayedDesc}
                {typingStep === 'desc' && (
                  <span className="inline-block w-2 h-4 ml-1 bg-amber-300 animate-pulse align-middle shadow-[0_0_6px_#fde047]" />
                )}
              </p>
            </div>
          </div>

          {/* Nút hành động 1-click khám phá di tích tiếp theo */}
          <button
            onClick={() => handleChoose(featuredNext.stt)}
            className={`w-full lg:w-auto px-7 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-[#7E1819] font-black text-sm sm:text-base shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-3 cursor-pointer shrink-0 border-2 border-white/60 group ${
              typingStep === 'done' ? 'animate-bounce' : ''
            }`}
          >
            <span>🚀 Khám Phá "{nextName}" Ngay</span>
            <ArrowRight className="w-5 h-5 text-[#7E1819] group-hover:translate-x-1.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* DANH SÁCH DI TÍCH GỢI Ý TIẾP THEO (GẦN ĐÓ NHẤT & CÙNG LOẠI HÌNH) */}
      {/* ========================================================================= */}
      <div className="bg-[#FFFDFB] rounded-3xl p-5 sm:p-8 md:p-10 border-2 border-rose-200 shadow-xl shadow-rose-950/5 space-y-6 sm:space-y-8">
        
        {/* Header & Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-rose-100">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FDF2F3] border border-rose-300 text-[#8B1417] text-[11px] font-black uppercase tracking-wider shadow-2xs">
              <Compass className="w-3.5 h-3.5 text-[#8B1417]" />
              <span>Gợi Ý Hành Trình Tiếp Nối</span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-[#2A1214] font-serif-title tracking-tight">
              Khám Phá Di Tích Gần Đó &amp; Cùng Loại Hình
            </h2>
          </div>

          {/* Tab Filter Controls */}
          <div className="flex items-center gap-2 bg-[#FAF4F0] p-1.5 rounded-2xl border border-rose-200/80 self-start md:self-auto">
            <button
              onClick={() => setActiveTab('nearby')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'nearby'
                  ? 'bg-[#8B1417] text-white shadow-md'
                  : 'text-stone-700 hover:text-[#8B1417] hover:bg-white/60'
              }`}
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Di tích gần đó nhất</span>
            </button>

            <button
              onClick={() => setActiveTab('same_type')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'same_type'
                  ? 'bg-[#8B1417] text-white shadow-md'
                  : 'text-stone-700 hover:text-[#8B1417] hover:bg-white/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Cùng loại ({currentMonument?.info?.type || 'Lịch sử'})</span>
            </button>
          </div>
        </div>

        {/* Featured Card (Spanning full top banner) */}
        <div
          onClick={() => handleChoose(featuredNext.stt)}
          className="group bg-gradient-to-br from-white to-[#FAF4F0] rounded-3xl overflow-hidden border-2 border-rose-200/90 hover:border-[#8B1417] shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch"
        >
          {/* Image (5 cols) */}
          <div className="lg:col-span-5 relative aspect-[16/10] lg:aspect-auto overflow-hidden bg-stone-900 min-h-[240px] sm:min-h-[280px]">
            <img
              src={featuredNext.info?.heroImage || featuredNext.gallery?.[0]?.src || '/assets/images/fallback.jpg'}
              alt={featuredNext.info?.name}
              className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

            {/* Badges on Image */}
            <div className="absolute top-3.5 left-3.5 flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-xl bg-[#8B1417] text-white text-[11px] font-black uppercase tracking-wider shadow-md">
                Di tích đề xuất #1
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-amber-400 text-stone-900 text-[11px] font-black shadow-md">
                #{featuredNext.stt}/103
              </span>
            </div>

            {activeTab === 'nearby' && featuredNext.distanceKm !== undefined && featuredNext.distanceKm < 9999 && (
              <div className="absolute bottom-3.5 left-3.5 px-3 py-1 rounded-xl bg-black/70 backdrop-blur-md text-amber-300 border border-amber-400/40 text-xs font-black shadow-md flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-amber-300" />
                <span>Cách đây ~{featuredNext.distanceKm < 1 ? `${Math.round(featuredNext.distanceKm * 1000)} m` : `${featuredNext.distanceKm.toFixed(1)} km`}</span>
              </div>
            )}
          </div>

          {/* Details (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-md bg-[#FDF2F3] text-[#8B1417] text-[11px] font-black border border-rose-200">
                  {featuredNext.info?.ranking || 'Di tích Quốc gia'}
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[11px] font-bold">
                  {featuredNext.info?.type || 'Lịch sử'}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-[#8B1417] font-serif-title group-hover:text-[#630d10] transition-colors leading-snug">
                {featuredNext.info?.name}
              </h3>

              <div className="flex items-start gap-1.5 text-xs text-stone-600">
                <MapPin className="w-4 h-4 text-[#8B1417] shrink-0 mt-0.5" />
                <span className="line-clamp-2">{featuredNext.info?.address || 'TP. Hồ Chí Minh'}</span>
              </div>

              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed line-clamp-3 text-justify">
                {featuredNext.info?.overview || 'Khám phá không gian lịch sử văn hóa hào hùng của thành phố.'}
              </p>
            </div>

            <div className="pt-3 border-t border-rose-200/70 flex items-center justify-between">
              <span className="text-xs text-[#8B1417] font-black group-hover:translate-x-1 transition-transform flex items-center gap-1.5">
                <span>Khám phá chi tiết di tích này</span>
                <ArrowRight className="w-4 h-4" />
              </span>
              <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#8B1417] to-[#B31D21] text-white text-xs font-black shadow-md hover:scale-103 transition-transform cursor-pointer">
                Xem ngay →
              </button>
            </div>
          </div>
        </div>

        {/* 3 Secondary Cards Grid */}
        {otherNext.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {otherNext.map(monument => {
              const imgUrl = monument.info?.heroImage || monument.gallery?.[0]?.src || '/assets/images/fallback.jpg';
              return (
                <div
                  key={monument.stt}
                  onClick={() => handleChoose(monument.stt)}
                  className="group bg-white rounded-2xl p-4 border-2 border-rose-100 hover:border-[#8B1417] shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-3 cursor-pointer"
                >
                  <div className="space-y-2.5">
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-stone-900 shadow-inner">
                      <img
                        src={imgUrl}
                        alt={monument.info?.name}
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-[#8B1417] text-white text-[10px] font-black shadow-md">
                        #{monument.stt}
                      </div>
                      {activeTab === 'nearby' && monument.distanceKm !== undefined && monument.distanceKm < 9999 && (
                        <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-lg bg-black/70 backdrop-blur-xs text-amber-300 text-[10px] font-black">
                          📍 ~{monument.distanceKm < 1 ? `${Math.round(monument.distanceKm * 1000)}m` : `${monument.distanceKm.toFixed(1)}km`}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#FDF2F3] text-[#8B1417]">
                        {monument.info?.type || 'Lịch sử'}
                      </span>
                      <span className="text-[10px] font-medium text-stone-500 truncate max-w-[130px]">
                        {monument.info?.ranking}
                      </span>
                    </div>

                    <h4 className="font-bold text-xs sm:text-sm text-[#2A1214] group-hover:text-[#8B1417] transition-colors line-clamp-2 font-serif-title leading-snug">
                      {monument.info?.name}
                    </h4>

                    <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed">
                      {monument.info?.overview}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-rose-100 flex items-center justify-between text-xs text-[#8B1417] font-bold">
                    <span>Xem di tích #{monument.stt}</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
