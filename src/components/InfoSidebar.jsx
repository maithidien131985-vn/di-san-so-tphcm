import React from 'react';
import { 
  Building2, 
  Award, 
  MapPin, 
  Lightbulb, 
  DoorClosed,
  Landmark,
  Archive
} from 'lucide-react';

export default function InfoSidebar({
  info,
  isEditMode,
  onUpdateInfo
}) {
  return (
    <aside className="space-y-5">
      {/* 1. Bảng thông tin chính & Nút Nghe thuyết minh */}
      <div className="bg-[#FAF7F2] rounded-2xl p-5 sm:p-6 border border-[#EAE3D9] shadow-xs space-y-4">
        <div className="space-y-3.5 text-sm">
          {/* Loại di tích */}
          <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#EFE8DE]">
            <div className="flex items-center gap-2.5 text-[#333333]">
              <Building2 className="w-4 h-4 text-[#7E1819] shrink-0" />
              <span className="font-bold text-xs sm:text-sm">Loại di tích</span>
            </div>
            <span className="font-medium text-[#555555] text-xs sm:text-sm text-right">
              {info.type || 'Lịch sử'}
            </span>
          </div>

          {/* Cấp xếp hạng */}
          <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#EFE8DE]">
            <div className="flex items-center gap-2.5 text-[#333333]">
              <Award className="w-4 h-4 text-[#7E1819] shrink-0" />
              <span className="font-bold text-xs sm:text-sm">Cấp xếp hạng</span>
            </div>
            <span className="font-medium text-[#555555] text-xs sm:text-sm text-right">
              {info.ranking || 'Quốc gia đặc biệt'}
            </span>
          </div>

          {/* Địa chỉ */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5 text-[#333333] shrink-0">
              <MapPin className="w-4 h-4 text-[#7E1819] shrink-0" />
              <span className="font-bold text-xs sm:text-sm">Địa chỉ</span>
            </div>
            <span className="font-medium text-[#555555] text-xs text-right leading-relaxed max-w-[200px]">
              {info.address}
            </span>
          </div>
        </div>
      </div>

      {/* 3. "Em có biết?" Box */}
      <div className="bg-[#FEF9EE] rounded-2xl p-5 border border-amber-200 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-amber-950 font-black text-sm">
          <Lightbulb className="w-4 h-4 text-amber-600 fill-amber-500" />
          <span>Em có biết?</span>
        </div>

        <ul className="space-y-2.5 text-xs text-[#4A3E36]">
          {info.emCoBiet && info.emCoBiet.length > 0 ? (
            info.emCoBiet.map((point, idx) => (
              <li key={idx} className="flex items-start gap-2 leading-relaxed">
                <span className="text-sm shrink-0 mt-0.5">{point.slice(0, 2)}</span>
                <span className="font-medium text-[#3A3028]">{point.slice(2).trim()}</span>
              </li>
            ))
          ) : (
            <>
              <li className="flex items-center gap-2">
                <Landmark className="w-3.5 h-3.5 text-[#7E1819] shrink-0" />
                <span><strong>Diện tích khuôn viên:</strong> {info.stats?.campusArea || '120.000 m²'}</span>
              </li>
              <li className="flex items-center gap-2">
                <DoorClosed className="w-3.5 h-3.5 text-[#7E1819] shrink-0" />
                <span><strong>Số phòng:</strong> {info.stats?.roomsCount || '150+ phòng'}</span>
              </li>
              <li className="flex items-center gap-2">
                <Archive className="w-3.5 h-3.5 text-[#7E1819] shrink-0" />
                <span><strong>Hiện vật trưng bày:</strong> {info.stats?.artifactsCount || '3.700+ hiện vật'}</span>
              </li>
            </>
          )}
        </ul>
      </div>
    </aside>
  );
}
