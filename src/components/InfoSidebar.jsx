import React from 'react';
import { 
  Building2, 
  Award, 
  MapPin, 
  FileText, 
  Volume2, 
  Lightbulb, 
  Maximize2, 
  Layers, 
  ChevronRight, 
  ExternalLink,
  Sparkles
} from 'lucide-react';
import LocationMap from './LocationMap';

export default function InfoSidebar({
  info,
  map,
  isEditMode,
  onUpdateInfo,
  onOpenAudio,
  onOpenDocsModal,
  onOpenMyMap
}) {
  const [funFactIndex, setFunFactIndex] = React.useState(0);

  const funFacts = [
    { label: "Mặt bằng chữ CÁT", desc: "Toàn thể bình diện của Dinh làm thành hình chữ CÁT (吉) có nghĩa là tốt lành, may mắn." },
    { label: "Rèm hoa đá", desc: "Mặt tiền Dinh được trang trí bằng rèm hoa đá hình các đốt trúc, mang ý nghĩa thanh cao và tiết khí người quân tử." },
    { label: "Bảo vật Quốc gia", desc: "Xe tăng T54B số hiệu 843 và T59 số hiệu 390 tại Dinh đều đã được công nhận là Bảo vật Quốc gia." }
  ];

  // Resolve exact coordinates from map or info
  const resolvedCoordinates = map?.coordinates || info?.coordinates || 
    (map?.lat && map?.lng ? [map.lat, map.lng] : null) || 
    (info?.lat && info?.lng ? [info.lat, info.lng] : null) || 
    [10.77715, 106.69534];

  return (
    <aside className="space-y-6">
      {/* 1. Thông tin tóm tắt & Nút Nghe thuyết minh */}
      <div className="bg-white rounded-2xl p-6 border border-[#EADBC8] shadow-xs space-y-4">
        <div className="space-y-3.5 text-sm">
          {/* Loại di tích */}
          <div className="flex items-start gap-3 pb-3 border-b border-[#F5EDE2]">
            <div className="w-8 h-8 rounded-lg bg-[#FAF0E6] flex items-center justify-center text-[#7B1113] shrink-0 mt-0.5">
              <Building2 className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <span className="text-xs text-[#8C7A6B] block">Loại di tích</span>
              {isEditMode ? (
                <input
                  type="text"
                  value={info.type}
                  onChange={(e) => onUpdateInfo('type', e.target.value)}
                  className="w-full text-sm font-bold text-[#2C241E] border border-amber-400 rounded px-1.5 py-0.5 bg-amber-50"
                />
              ) : (
                <span className="font-bold text-[#2C241E]">{info.type}</span>
              )}
            </div>
          </div>

          {/* Cấp xếp hạng */}
          <div className="flex items-start gap-3 pb-3 border-b border-[#F5EDE2]">
            <div className="w-8 h-8 rounded-lg bg-[#FAF0E6] flex items-center justify-center text-[#7B1113] shrink-0 mt-0.5">
              <Award className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <span className="text-xs text-[#8C7A6B] block">Cấp xếp hạng</span>
              {isEditMode ? (
                <input
                  type="text"
                  value={info.ranking}
                  onChange={(e) => onUpdateInfo('ranking', e.target.value)}
                  className="w-full text-sm font-bold text-[#2C241E] border border-amber-400 rounded px-1.5 py-0.5 bg-amber-50"
                />
              ) : (
                <span className="font-bold text-[#2C241E]">{info.ranking}</span>
              )}
            </div>
          </div>

          {/* Địa chỉ */}
          <div className="flex items-start gap-3 pb-3 border-b border-[#F5EDE2]">
            <div className="w-8 h-8 rounded-lg bg-[#FAF0E6] flex items-center justify-center text-[#7B1113] shrink-0 mt-0.5">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <span className="text-xs text-[#8C7A6B] block">Địa chỉ</span>
              {isEditMode ? (
                <input
                  type="text"
                  value={info.address}
                  onChange={(e) => onUpdateInfo('address', e.target.value)}
                  className="w-full text-xs font-semibold text-[#2C241E] border border-amber-400 rounded px-1.5 py-0.5 bg-amber-50"
                />
              ) : (
                <span className="font-medium text-[#2C241E] text-xs leading-relaxed block">{info.address}</span>
              )}
            </div>
          </div>

          {/* Tài liệu tham khảo */}
          <div 
            onClick={onOpenDocsModal}
            className="flex items-center justify-between pt-1 cursor-pointer group hover:bg-[#FAF7F2] p-2 rounded-xl transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#FAF0E6] flex items-center justify-center text-[#7B1113]">
                <FileText className="w-4 h-4" />
              </div>
              <span className="font-bold text-[#2C241E] text-xs sm:text-sm">Tài liệu tham khảo</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-[#7B1113] font-semibold group-hover:underline">
              <span>{info.referencesText || 'Xem danh sách tài liệu'}</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Nút Nghe Thuyết Minh Prominent */}
        <button
          onClick={onOpenAudio}
          className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl bg-[#7B1113] hover:bg-[#96171a] text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
        >
          <div className="flex items-center gap-1">
            <Volume2 className="w-5 h-5 animate-pulse" />
          </div>
          <span>Nghe thuyết minh</span>
        </button>
      </div>

      {/* 2. Vị trí di tích (Interactive Map Card) */}
      <div className="bg-white rounded-2xl p-5 border border-[#EADBC8] shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-[#2C241E] text-sm flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#7B1113]" />
            Vị trí di tích
          </h3>
          <button
            onClick={onOpenMyMap}
            className="text-xs text-[#7B1113] font-bold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Bản đồ TP.HCM</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        {/* Interactive Google My Maps / LocationMap */}
        <div className="h-48 w-full rounded-xl overflow-hidden border border-[#EADBC8] relative shadow-inner">
          <LocationMap
            embedUrl="https://www.google.com/maps/d/embed?mid=1UM24OubPpISXPfooW7VY8Vo4xMZ6dIg&ehbc=2E312F"
            name={info.name}
            address={info.address}
            ranking={info.ranking}
            coordinates={resolvedCoordinates}
            onOpenMyMap={onOpenMyMap}
          />
        </div>
      </div>

      {/* 3. Thẻ "Em có biết?" (Did You Know?) */}
      <div className="bg-[#FFFBF5] rounded-2xl p-5 border border-[#F0DFCA] shadow-xs space-y-3 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#9C6928]">
            <Lightbulb className="w-5 h-5 fill-amber-400 text-amber-500" />
            <h3 className="font-serif-title font-bold text-base text-[#7B4F1A]">
              Em có biết?
            </h3>
          </div>
          <button
            onClick={() => setFunFactIndex((prev) => (prev + 1) % funFacts.length)}
            className="text-[11px] font-bold text-[#9C6928] hover:underline cursor-pointer flex items-center gap-1"
            title="Đổi kiến thức thú vị khác"
          >
            <Sparkles className="w-3 h-3" />
            <span>Khám phá thêm</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="space-y-2.5 text-xs text-[#4A3E36]">
          <div className="flex items-center gap-2.5">
            <Maximize2 className="w-4 h-4 text-[#9C6928] shrink-0" />
            <span>Diện tích khuôn viên: <strong className="text-[#2C241E]">{info.stats?.campusArea || '120.000 m²'}</strong></span>
          </div>
          <div className="flex items-center gap-2.5">
            <Building2 className="w-4 h-4 text-[#9C6928] shrink-0" />
            <span>Số phòng: <strong className="text-[#2C241E]">{info.stats?.roomsCount || '150+ phòng'}</strong></span>
          </div>
          <div className="flex items-center gap-2.5">
            <Layers className="w-4 h-4 text-[#9C6928] shrink-0" />
            <span>Hiện vật trưng bày: <strong className="text-[#2C241E]">{info.stats?.artifactsCount || '3.700+ hiện vật'}</strong></span>
          </div>
        </div>

        {/* Dynamic Fun Fact Box */}
        <div className="mt-3 p-3 rounded-xl bg-amber-100/60 border border-amber-200/80 text-xs text-[#5C3F1B] transition-all">
          <p className="font-bold text-[#7B4F1A] mb-0.5">✨ {funFacts[funFactIndex].label}</p>
          <p className="leading-relaxed">{funFacts[funFactIndex].desc}</p>
        </div>
      </div>
    </aside>
  );
}
