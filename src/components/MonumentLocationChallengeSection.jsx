import React from 'react';
import { MapPin, Compass, ExternalLink, Navigation, Layers } from 'lucide-react';
import LocationMap from './LocationMap';
import ScrollReveal from './ScrollReveal';
import WordByWordTitle from './WordByWordTitle';
import InfoSidebar from './InfoSidebar';

export default function MonumentLocationChallengeSection({
  info = {},
  map = {},
  onOpenMyMap,
  isEditMode,
  onUpdateInfo
}) {
  const resolvedCoordinates = map?.coordinates || info?.coordinates || 
    (info?.lat && info?.lng ? [info.lat, info.lng] : null) || 
    (map?.lat && map?.lng ? [map.lat, map.lng] : null) || 
    [10.77715, 106.69534];

  const lat = resolvedCoordinates && !isNaN(resolvedCoordinates[0]) ? parseFloat(resolvedCoordinates[0]) : 10.77715;
  const lng = resolvedCoordinates && !isNaN(resolvedCoordinates[1]) ? parseFloat(resolvedCoordinates[1]) : 106.69534;
  const directionsUrl = info?.googleMapsDirectionsUrl || `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  const address = info?.address || 'Thành phố Hồ Chí Minh';
  const name = info?.name || 'Di tích lịch sử';

  return (
    <section className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 py-4 sm:py-6">
      <ScrollReveal>
        {/* Section Header */}
        <div className="mb-5 flex flex-col md:flex-row md:items-end justify-between gap-4 pb-3 border-b border-[#EAE3D9]">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 text-[#7E1819]">
              <Compass className="w-7 h-7 text-[#7E1819]" />
              <WordByWordTitle
                as="h2"
                text="Định Vị Không Gian & Hồ Sơ Di Tích"
                className="font-serif-title font-black text-2xl sm:text-3xl lg:text-4xl tracking-tight text-[#7E1819]"
                staggerDelay={0.05}
              />
            </div>
            <p className="text-xs sm:text-sm md:text-base text-[#555555]">
              Khám phá tọa độ GPS thực địa, định vị trên bản đồ số và nắm bắt hồ sơ trích yếu của di tích.
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

        {/* 2 Columns Layout: Left Map (7 cols), Right InfoSidebar (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
          
          {/* CỘT 1: BẢN ĐỒ TỌA ĐỘ GPS LỚN (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-4 sm:p-5 border-2 border-rose-200/90 shadow-sm flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-xs sm:text-sm text-[#2C241E]">Bản Đồ GPS Trực Tuyến</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#7E1819] font-black bg-rose-50 px-3 py-1 rounded-lg border border-rose-200">
                <MapPin className="w-3.5 h-3.5 text-[#7E1819]" />
                <span>{lat.toFixed(5)}, {lng.toFixed(5)}</span>
              </div>
            </div>

            {/* Main Interactive Leaflet Map Container */}
            <div className="h-[360px] sm:h-[420px] rounded-2xl overflow-hidden border border-gray-200 shadow-inner">
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

          {/* CỘT 2: THÔNG TIN NHANH & EM CÓ BIẾT (5 cols) */}
          <div className="lg:col-span-5 flex flex-col">
            <InfoSidebar
              info={info}
              isEditMode={isEditMode}
              onUpdateInfo={onUpdateInfo}
            />
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
