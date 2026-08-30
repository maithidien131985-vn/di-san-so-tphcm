import React from 'react';
import { Landmark, Calendar, Image as ImageIcon, ChevronRight, Play, Film } from 'lucide-react';

export default function HistorySection({
  overview,
  timeline,
  gallery,
  isEditMode,
  onUpdateOverview,
  onOpenLightbox,
  onOpenMilestoneDetail,
  onOpenVideo
}) {
  return (
    <div id="history-section" className="space-y-6">
      {/* 1. Giá trị lịch sử Card Container */}
      <section className="bg-white rounded-2xl p-6 sm:p-7 border border-[#EAE3D9] shadow-xs space-y-6">
        {/* Title */}
        <div className="space-y-3">
          <div className="flex items-center gap-2.5 text-[#7E1819]">
            <Landmark className="w-5 h-5" />
            <h2 className="text-xl sm:text-2xl font-black font-serif-title tracking-wide">
              Giá trị lịch sử
            </h2>
          </div>

          {isEditMode ? (
            <textarea
              rows={4}
              value={overview}
              onChange={(e) => onUpdateOverview(e.target.value)}
              className="w-full p-3 rounded-lg border border-amber-400 bg-amber-50/30 text-[#2C241E] text-sm sm:text-base leading-relaxed outline-none focus:ring-2 focus:ring-amber-500"
            />
          ) : (
            <p className="text-[#333333] text-sm sm:text-[15px] leading-relaxed text-justify">
              {overview}
            </p>
          )}
        </div>

        {/* 2. Dấu mốc lịch sử (Horizontal Timeline) */}
        <div className="pt-5 border-t border-[#F0EAE1] space-y-4">
          <h3 className="text-sm sm:text-base font-bold text-[#2C241E]">
            Dấu mốc lịch sử
          </h3>

          <div className="relative pt-2 pb-1">
            {/* Horizontal timeline connector */}
            <div className="hidden sm:block absolute top-[14px] left-6 right-6 h-[2px] bg-[#E8DDD0] z-0" />

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-2 relative z-10">
              {timeline.slice(0, 4).map((item, idx) => (
                <div 
                  key={item.id || idx}
                  onClick={() => onOpenMilestoneDetail && onOpenMilestoneDetail(item)}
                  className="cursor-pointer text-left sm:text-center p-2 rounded-xl hover:bg-[#FAF7F2] transition-colors group"
                >
                  {/* Dot */}
                  <div className="hidden sm:flex w-4 h-4 rounded-full bg-[#7E1819] mx-auto mb-2 border-2 border-white shadow-xs items-center justify-center group-hover:scale-125 transition-transform" />

                  <div className="font-serif-title font-black text-sm text-[#7E1819]">
                    {item.year}
                  </div>
                  <h4 className="text-xs font-bold text-[#333333] mt-0.5 line-clamp-2">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-[#777777] mt-0.5 line-clamp-2">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Hình ảnh lịch sử (4 Thumbnail Photos & Button) */}
        <div className="pt-5 border-t border-[#F0EAE1] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-bold text-[#2C241E] flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#7E1819]" />
              <span>Hình ảnh lịch sử</span>
            </h3>
            <button
              onClick={onOpenVideo}
              className="text-xs font-bold text-[#7E1819] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Film className="w-3.5 h-3.5" />
              <span>Xem phim tư liệu</span>
            </button>
          </div>

          {/* 4 Photo thumbnails */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {gallery.slice(0, 4).map((img, idx) => (
              <div
                key={img.id || idx}
                onClick={() => onOpenLightbox(idx)}
                className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 border border-[#EAE3D9] cursor-pointer shadow-2xs hover:shadow-md transition-all duration-300"
              >
                <img
                  src={img.src}
                  alt={img.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="px-2 py-1 rounded bg-black/60 text-white text-[10px] font-bold">
                    Xem ảnh
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Xem thêm ảnh Button */}
          <div className="text-center pt-1">
            <button
              onClick={() => onOpenLightbox(0)}
              className="px-4 py-1.5 rounded-lg bg-white hover:bg-gray-50 border border-[#D5C7B5] text-xs font-bold text-[#555555] hover:text-[#7E1819] transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-2xs"
            >
              <ImageIcon className="w-3.5 h-3.5 text-[#7E1819]" />
              <span>Xem thêm ảnh</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
