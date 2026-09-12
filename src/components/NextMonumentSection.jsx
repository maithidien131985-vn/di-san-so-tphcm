import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Compass, ArrowRight, MapPin, Sparkles, Navigation, Layers, ChevronRight, Award, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { allMonumentsList } from '../data/allMonumentsData';
import { soundEffects } from '../utils/soundEffects';

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
  onSelectMonument,
  isCompleted = false
}) {
  const [activeTab, setActiveTab] = useState('nearby'); // 'nearby' | 'same_type'
  const [showCelebrationPopup, setShowCelebrationPopup] = useState(false);
  const prevCompletedRef = useRef(isCompleted);

  const currentMonument = useMemo(() => {
    return allMonuments.find(m => m.stt === currentStt) || allMonuments[0];
  }, [currentStt, allMonuments]);

  const currentName = currentMonument?.info?.name || 'Di tích lịch sử';

  // Trigger 7-second celebration circular popup + fanfare sound when completed
  useEffect(() => {
    if (isCompleted && !prevCompletedRef.current) {
      setShowCelebrationPopup(true);
      soundEffects.playVictoryFanfare();
      try {
        confetti({ particleCount: 140, spread: 90, origin: { y: 0.55 } });
      } catch (e) {}
      const timer = setTimeout(() => {
        setShowCelebrationPopup(false);
      }, 7000);
      return () => clearTimeout(timer);
    }
    prevCompletedRef.current = isCompleted;
  }, [isCompleted, currentStt]);

  // Reset when changing monument
  useEffect(() => {
    setShowCelebrationPopup(false);
    prevCompletedRef.current = isCompleted;
  }, [currentStt]);

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

  // 2. Same Type Monuments (Matching info.type)
  const sameTypeMonuments = useMemo(() => {
    const curType = currentMonument?.info?.type || 'Lịch sử';
    return allMonuments
      .filter(m => m.stt !== currentStt && m.info?.type === curType)
      .slice(0, 4);
  }, [currentMonument, currentStt, allMonuments]);

  const displayList = activeTab === 'nearby' ? nearbyMonuments : sameTypeMonuments;

  const handleChoose = (stt) => {
    if (onSelectMonument) {
      onSelectMonument(stt);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 pt-2 pb-8">
      {/* ========================================================================= */}
      {/* 7-SECOND CIRCULAR CELEBRATION BADGE POPUP (KÈM ÂM THANH CHÚC MỪNG) */}
      {/* ========================================================================= */}
      {showCelebrationPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none p-4 animate-fadeIn">
          <div
            onClick={() => setShowCelebrationPopup(false)}
            className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-full bg-gradient-to-br from-[#7E1819] via-[#9E1B1D] to-[#45080A] border-4 border-amber-300 shadow-[0_0_60px_rgba(245,158,11,0.65)] flex flex-col items-center justify-center text-center p-6 text-white pointer-events-auto cursor-pointer transform hover:scale-105 transition-transform select-none"
          >
            {/* Glowing & rotating decorative borders */}
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-amber-300/60 animate-spin-slow pointer-events-none" />
            <div className="absolute -inset-1.5 rounded-full bg-amber-400/25 blur-lg pointer-events-none" />

            {/* Trophy Icon */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-yellow-500 flex items-center justify-center shadow-lg border-2 border-white mb-2 transform">
              <Trophy className="w-9 h-9 sm:w-11 sm:h-11 text-[#7E1819]" />
            </div>

            <div className="font-serif-title font-black text-sm sm:text-base text-amber-200 leading-tight px-2">
              🎉 HOÀN THÀNH ĐIỀU TRA!
            </div>
            <p className="text-[11px] sm:text-xs text-rose-100 mt-1 line-clamp-2 px-3 leading-tight">
              Di tích "{currentName}"
            </p>

            <div className="mt-2 inline-flex items-center gap-1 bg-amber-400/30 border border-amber-300 px-3 py-1 rounded-full text-amber-200 font-black text-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>+100 Điểm Thám Hiểm</span>
            </div>

            <div className="absolute bottom-3 text-[10px] text-amber-200/70 font-mono">
              (Tự đóng sau 7s)
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* COMPACT & MINIMALIST NEXT MONUMENT SUGGESTIONS CONTAINER */}
      {/* ========================================================================= */}
      <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-4 sm:p-5 border border-rose-200/80 shadow-xs space-y-4">
        {/* Compact Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-rose-100">
          <div className="flex items-center gap-2 text-[#7E1819]">
            <Compass className="w-4 h-4 text-[#7E1819]" />
            <h3 className="font-serif-title font-bold text-sm sm:text-base text-[#2C241E]">
              Gợi Ý Hành Trình Tiếp Theo
            </h3>
            <span className="text-[11px] text-stone-500 font-normal hidden sm:inline">
              (Di tích phụ cận & cùng thể loại)
            </span>
          </div>

          {/* Compact Tab Switcher */}
          <div className="flex items-center gap-1.5 bg-rose-50/80 p-1 rounded-xl border border-rose-200/60 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('nearby')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                activeTab === 'nearby'
                  ? 'bg-[#7E1819] text-white shadow-xs'
                  : 'text-stone-600 hover:text-[#7E1819] hover:bg-white/60'
              }`}
            >
              <Navigation className="w-3 h-3" />
              <span>Gần nhất</span>
            </button>
            <button
              onClick={() => setActiveTab('same_type')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                activeTab === 'same_type'
                  ? 'bg-[#7E1819] text-white shadow-xs'
                  : 'text-stone-600 hover:text-[#7E1819] hover:bg-white/60'
              }`}
            >
              <Layers className="w-3 h-3" />
              <span>Cùng loại</span>
            </button>
          </div>
        </div>

        {/* Compact 4-Columns Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {displayList.slice(0, 4).map((monument, idx) => {
            const imgUrl = monument.info?.heroImage || monument.gallery?.[0]?.src || '/assets/images/fallback.jpg';
            const dist = monument.distanceKm !== undefined && monument.distanceKm < 9999
              ? (monument.distanceKm < 1 ? `${Math.round(monument.distanceKm * 1000)}m` : `${monument.distanceKm.toFixed(1)}km`)
              : null;

            return (
              <div
                key={monument.stt || idx}
                onClick={() => handleChoose(monument.stt)}
                className="group bg-[#FAF8F5] hover:bg-white rounded-xl p-3 border border-rose-100/90 hover:border-[#7E1819] shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-2.5 cursor-pointer hover:scale-[1.01]"
              >
                <div className="space-y-2">
                  <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-stone-900 shadow-inner">
                    <img
                      src={imgUrl}
                      alt={monument.info?.name}
                      className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-300"
                    />
                    <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold">
                      #{monument.stt}
                    </div>
                    {activeTab === 'nearby' && dist && (
                      <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-amber-400/90 text-stone-900 text-[10px] font-bold">
                        📍 ~{dist}
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-1 text-[10px] text-[#7E1819] font-bold">
                      <span>{monument.info?.type || 'Lịch sử'}</span>
                      <span>•</span>
                      <span className="text-stone-500 font-medium truncate">{monument.info?.ranking}</span>
                    </div>
                    <h4 className="font-serif-title font-bold text-xs text-[#2C241E] group-hover:text-[#7E1819] transition-colors line-clamp-1 mt-0.5">
                      {monument.info?.name}
                    </h4>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-[#7E1819] font-bold">
                  <span>Khám phá</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}