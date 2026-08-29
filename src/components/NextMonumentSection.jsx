import React from 'react';
import { Landmark, Compass, ArrowRight, MapPin, Award, ChevronRight, Sparkles } from 'lucide-react';

export default function NextMonumentSection({ nextMonuments, onSelectMonument }) {
  if (!nextMonuments || nextMonuments.length === 0) return null;

  const primaryNext = nextMonuments[0];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
      <div className="bg-gradient-to-br from-[#FAF7F2] to-[#F3ECE0] rounded-3xl p-6 sm:p-10 border border-[#E0CFBD] shadow-sm space-y-6">
        {/* Section Title */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#7B1113] text-white flex items-center justify-center shadow-md">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#7B1113]">HÀNH TRÌNH TIẾP THEO</span>
              <h2 className="text-xl sm:text-2xl font-black text-[#2C241E] font-serif-title">
                Di Tích Tiếp Theo Trong Hệ Thống Di Sản Số TP.HCM
              </h2>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-amber-100 text-[#7B1113] text-xs font-bold border border-amber-300">
            Tuyến di tích lịch sử kháng chiến
          </span>
        </div>

        {/* Primary Next Monument Banner */}
        <div 
          onClick={() => onSelectMonument(primaryNext)}
          className="group bg-white rounded-2xl overflow-hidden border border-[#EADBC8] hover:border-[#7B1113] shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer grid grid-cols-1 md:grid-cols-12 gap-0 items-stretch"
        >
          {/* Image (5 cols) */}
          <div className="md:col-span-5 relative aspect-[16/10] md:aspect-auto overflow-hidden bg-gray-100">
            <img
              src={primaryNext.image}
              alt={primaryNext.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-[#7B1113] text-white text-xs font-bold shadow-md">
              Di tích đề xuất tiếp theo
            </div>
          </div>

          {/* Details (7 cols) */}
          <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-4">
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-xs font-bold">
                  {primaryNext.ranking}
                </span>
                <span className="text-xs text-gray-500 font-medium">{primaryNext.category}</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-[#7B1113] font-serif-title group-hover:underline">
                {primaryNext.name}
              </h3>

              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <MapPin className="w-3.5 h-3.5 text-[#7B1113] shrink-0" />
                <span>{primaryNext.address}</span>
              </div>

              <p className="text-xs sm:text-sm text-[#4A3E36] leading-relaxed">
                {primaryNext.summary}
              </p>

              {primaryNext.highlight && (
                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EADBC8] text-xs text-[#6B5E55] italic">
                  💡 {primaryNext.highlight}
                </div>
              )}
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-[#7B1113] font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1.5">
                <span>Khám phá chi tiết di tích này</span>
                <ArrowRight className="w-4 h-4" />
              </span>
              <button className="px-5 py-2 rounded-xl bg-[#7B1113] group-hover:bg-[#96171a] text-white text-xs font-bold shadow-md transition-colors">
                Xem ngay
              </button>
            </div>
          </div>
        </div>

        {/* Other Related Monuments (Grid 2 cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {nextMonuments.slice(1).map((monument, idx) => (
            <div
              key={monument.id || idx}
              onClick={() => onSelectMonument(monument)}
              className="group bg-white rounded-2xl p-4 border border-[#EADBC8] hover:border-[#7B1113] shadow-xs hover:shadow-md transition-all flex items-center gap-4 cursor-pointer"
            >
              <img
                src={monument.image}
                alt={monument.name}
                className="w-24 h-24 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform"
              />
              <div className="flex-1 min-w-0 space-y-1">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                  {monument.category}
                </span>
                <h4 className="font-bold text-sm text-[#2C241E] group-hover:text-[#7B1113] truncate font-serif-title">
                  {monument.name}
                </h4>
                <p className="text-xs text-gray-500 line-clamp-2">{monument.summary}</p>
                <span className="text-xs text-[#7B1113] font-bold flex items-center gap-1 pt-1">
                  <span>Xem chi tiết</span>
                  <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
