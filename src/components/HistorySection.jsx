import React from 'react';
import { Landmark, Calendar, Image as ImageIcon, Film, Play, ChevronRight, Sparkles, Clock, CheckCircle2 } from 'lucide-react';

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
  const [selectedMilestone, setSelectedMilestone] = React.useState(null);

  return (
    <div className="space-y-8">
      {/* 1. Giá trị lịch sử */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-[#EADBC8] shadow-xs">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#FAF0E6] flex items-center justify-center text-[#7B1113]">
            <Landmark className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-[#7B1113] font-serif-title tracking-wide">
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
          <p className="text-[#4A3E36] text-sm sm:text-base leading-relaxed text-justify">
            {overview}
          </p>
        )}

        {/* 2. Dấu mốc lịch sử (Interactive Timeline) */}
        <div className="mt-8 pt-6 border-t border-[#F2E8DC]">
          <h3 className="text-lg font-bold text-[#2C241E] mb-6 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#7B1113]" />
            Dấu mốc lịch sử
          </h3>

          <div className="relative">
            {/* Horizontal Timeline Connector */}
            <div className="hidden sm:block absolute top-5 left-8 right-8 h-1 bg-[#E8D9C8] z-0" />

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 sm:gap-2 relative z-10">
              {timeline.map((item, idx) => (
                <div 
                  key={item.id || idx}
                  onClick={() => {
                    setSelectedMilestone(item);
                    if (onOpenMilestoneDetail) onOpenMilestoneDetail(item);
                  }}
                  className="group cursor-pointer text-center sm:px-2 flex sm:flex-col items-start sm:items-center gap-4 sm:gap-2 p-3 rounded-xl hover:bg-[#FAF7F2] transition-colors"
                >
                  {/* Timeline dot */}
                  <div className="w-10 h-10 rounded-full bg-white border-4 border-[#7B1113] group-hover:bg-[#7B1113] group-hover:scale-110 flex items-center justify-center transition-all shadow-md shrink-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#7B1113] group-hover:bg-white" />
                  </div>

                  {/* Content */}
                  <div className="text-left sm:text-center">
                    <span className="inline-block font-black text-sm sm:text-base text-[#7B1113] font-serif-title group-hover:underline">
                      {item.year}
                    </span>
                    <h4 className="text-xs sm:text-xs font-bold text-[#2C241E] mt-0.5 line-clamp-2">
                      {item.title}
                    </h4>
                    <p className="hidden sm:block text-[11px] text-[#7A6B60] mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Hình ảnh và video lịch sử (Updated Heading & Video integration) */}
        <div className="mt-8 pt-6 border-t border-[#F2E8DC]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[#2C241E] flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-[#7B1113]" />
              <span>Hình ảnh và video lịch sử</span>
            </h3>
            <button
              onClick={() => onOpenLightbox(0)}
              className="text-xs font-bold text-[#7B1113] hover:text-[#96171a] flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span>Xem toàn bộ ({gallery.length})</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {gallery.slice(0, 4).map((img, idx) => (
              <div
                key={img.id || idx}
                onClick={() => {
                  if (img.isVideo && onOpenVideo) {
                    onOpenVideo();
                  } else {
                    onOpenLightbox(idx);
                  }
                }}
                className="group relative rounded-xl overflow-hidden aspect-[4/3] bg-gray-100 shadow-xs cursor-pointer border border-[#EADBC8]"
              >
                <img
                  src={img.src}
                  alt={img.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {img.isVideo && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    </div>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2.5 text-white">
                  <span className="text-[11px] font-bold leading-tight line-clamp-2">{img.title}</span>
                  <span className="text-[10px] text-amber-200 font-medium">{img.year}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onOpenLightbox(0)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FAF0E6] hover:bg-[#F2E3D0] text-[#7B1113] text-xs font-bold transition-colors border border-[#E8D9C8] cursor-pointer"
            >
              <ImageIcon className="w-4 h-4" />
              <span>Xem thêm ảnh ({gallery.length})</span>
            </button>
            <button
              onClick={onOpenVideo}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-800 text-xs font-bold transition-colors border border-red-200 cursor-pointer"
            >
              <Film className="w-4 h-4 text-red-600" />
              <span>Xem video tư liệu lịch sử</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
