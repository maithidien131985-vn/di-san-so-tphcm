import React from 'react';
import { 
  Building2, 
  Award, 
  MapPin, 
  Lightbulb, 
  DoorClosed,
  Landmark,
  Archive,
  Sparkles,
  Info
} from 'lucide-react';

export default function InfoSidebar({
  info,
  isEditMode,
  onUpdateInfo
}) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch">
      {/* 1. Bảng Thông Tin Nhanh */}
      <div className="lg:col-span-5 bg-[#FAF7F2] rounded-3xl p-5 sm:p-6 border-2 border-rose-200/90 shadow-sm flex flex-col justify-between space-y-4">
        <div>
          {/* Header Thông Tin Nhanh màu đỏ đô */}
          <div className="flex items-center justify-between pb-3 border-b border-[#EFE8DE]">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#7E1819] text-white text-xs font-black uppercase tracking-wider shadow-sm">
              <Info className="w-3.5 h-3.5 text-amber-300" />
              <span>Thông tin nhanh</span>
            </div>
            <span className="text-xs text-[#7E1819] font-bold">Hồ sơ trích yếu</span>
          </div>

          <div className="space-y-3 text-sm pt-3">
            {/* Loại di tích */}
            <div className="flex items-center justify-between gap-3 pb-2.5 border-b border-[#EFE8DE]">
              <div className="flex items-center gap-2.5 text-[#333333]">
                <Building2 className="w-4 h-4 text-[#7E1819] shrink-0" />
                <span className="font-bold text-xs sm:text-sm">Loại di tích</span>
              </div>
              <span className="font-black text-[#7E1819] bg-rose-50 px-2.5 py-0.5 rounded-lg border border-rose-200 text-xs sm:text-sm text-right">
                {info.type || 'Lịch sử'}
              </span>
            </div>

            {/* Cấp xếp hạng */}
            <div className="flex items-center justify-between gap-3 pb-2.5 border-b border-[#EFE8DE]">
              <div className="flex items-center gap-2.5 text-[#333333]">
                <Award className="w-4 h-4 text-[#7E1819] shrink-0" />
                <span className="font-bold text-xs sm:text-sm">Cấp xếp hạng</span>
              </div>
              <span className="font-bold text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200 text-xs sm:text-sm text-right">
                {info.ranking || 'Quốc gia'}
              </span>
            </div>

            {/* Địa chỉ */}
            <div className="flex items-start justify-between gap-3 pt-0.5">
              <div className="flex items-center gap-2.5 text-[#333333] shrink-0">
                <MapPin className="w-4 h-4 text-[#7E1819] shrink-0" />
                <span className="font-bold text-xs sm:text-sm">Địa chỉ</span>
              </div>
              <span className="font-semibold text-stone-700 text-xs sm:text-sm text-right leading-relaxed">
                {info.address}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. "Em có biết?" Box màu đỏ đô */}
      <div className="lg:col-span-7 bg-[#FAF7F2] rounded-3xl p-5 sm:p-6 border-2 border-rose-200/90 shadow-sm flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-[#EFE8DE]">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#7E1819] text-white text-xs font-black uppercase tracking-wider shadow-sm">
              <Lightbulb className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              <span>Em có biết?</span>
            </div>
            <span className="text-xs text-amber-800 font-bold">Khám phá thú vị</span>
          </div>

          <ul className="space-y-2 text-xs sm:text-[13px] text-[#4A3E36] pt-3">
            {info.emCoBiet && info.emCoBiet.length > 0 ? (
              info.emCoBiet.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2.5 leading-relaxed bg-white/70 p-2.5 rounded-xl border border-rose-100/80 shadow-2xs">
                  <span className="text-base shrink-0 leading-none">{point.slice(0, 2)}</span>
                  <span className="font-medium text-[#2A1214]">{point.slice(2).trim()}</span>
                </li>
              ))
            ) : (
              <>
                <li className="flex items-center gap-2 bg-white/70 p-2.5 rounded-xl border border-rose-100/80">
                  <Landmark className="w-4 h-4 text-[#7E1819] shrink-0" />
                  <span><strong>Diện tích khuôn viên:</strong> {info.stats?.campusArea || '120.000 m²'}</span>
                </li>
                <li className="flex items-center gap-2 bg-white/70 p-2.5 rounded-xl border border-rose-100/80">
                  <DoorClosed className="w-4 h-4 text-[#7E1819] shrink-0" />
                  <span><strong>Số phòng:</strong> {info.stats?.roomsCount || '150+ phòng'}</span>
                </li>
                <li className="flex items-center gap-2 bg-white/70 p-2.5 rounded-xl border border-rose-100/80">
                  <Archive className="w-4 h-4 text-[#7E1819] shrink-0" />
                  <span><strong>Hiện vật trưng bày:</strong> {info.stats?.artifactsCount || '3.700+ hiện vật'}</span>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}
