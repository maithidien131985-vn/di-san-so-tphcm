import React from 'react';
import { Film, MapPin, ExternalLink, Play, Sparkles, Navigation } from 'lucide-react';
import LocationMap from './LocationMap';
import ScrollReveal from './ScrollReveal';

export default function MonumentMediaAndLocationSection({
  video,
  info,
  map,
  onOpenMyMap
}) {
  const youtubeId = video?.youtubeId || 'cplxidwCHyE';
  const resolvedCoordinates = map?.coordinates || info?.coordinates || [10.77715, 106.69534];

  const lat = resolvedCoordinates && !isNaN(resolvedCoordinates[0]) ? parseFloat(resolvedCoordinates[0]) : 10.77715;
  const lng = resolvedCoordinates && !isNaN(resolvedCoordinates[1]) ? parseFloat(resolvedCoordinates[1]) : 106.69534;
  const directionsUrl = info?.googleMapsDirectionsUrl || `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <ScrollReveal>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Ô VIDEO PHIM TƯ LIỆU (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-5 sm:p-6 border border-[#EAE3D9] shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#7E1819]">
                  <Film className="w-5 h-5" />
                  <h3 className="font-serif-title font-black text-lg sm:text-xl tracking-wide">
                    Phim Tư Liệu Di Tích
                  </h3>
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-red-50 text-[#7E1819] border border-red-200">
                  Thước phim lịch sử
                </span>
              </div>
              <p className="text-xs text-[#777777]">
                {video?.title || `Thước phim tư liệu chân thực về di tích ${info.name}`}
              </p>
            </div>

            {/* Video Iframe Container */}
            <div className="relative aspect-video rounded-xl overflow-hidden bg-black shadow-md border border-gray-200">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1`}
                title={video?.title || "Phim tư liệu di tích"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-[#555555]">
              <span className="font-medium text-[#7E1819]">
                {video?.copyright || (video?.channel ? `Video thuộc bản quyền Kênh YouTube ${video.channel}` : 'Video thuộc bản quyền Kênh YouTube THVL Tổng Hợp')}
              </span>
              <a
                href={video?.youtubeUrl || `https://www.youtube.com/watch?v=${youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[#7E1819] hover:underline flex items-center gap-1 shrink-0"
              >
                <span>Xem trên YouTube</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Ô VỊ TRÍ & BẢN ĐỒ SỐ (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-5 sm:p-6 border border-[#EAE3D9] shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#7E1819]">
                  <MapPin className="w-5 h-5" />
                  <h3 className="font-serif-title font-black text-lg sm:text-xl tracking-wide">
                    Vị Trí & Tọa Độ GPS
                  </h3>
                </div>
                <button
                  onClick={onOpenMyMap}
                  className="text-xs font-bold text-[#7E1819] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <span>Bản đồ toàn cảnh</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs text-[#777777] truncate">
                📍 {info.address}
              </p>
            </div>

            {/* Map Container */}
            <div className="relative aspect-video lg:aspect-auto flex-1 min-h-[220px] rounded-xl overflow-hidden border border-gray-200 shadow-sm">
              <LocationMap
                lat={lat}
                lng={lng}
                coordinates={[lat, lng]}
                name={info.name}
                address={info.address}
                ranking={info.ranking || info.badge || 'Di tích'}
                onOpenMyMap={onOpenMyMap}
                googleMapsDirectionsUrl={directionsUrl}
              />
            </div>

            {/* Directions Link */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <span className="text-[11px] text-[#777777] font-mono">
                GPS: {lat.toFixed(5)}, {lng.toFixed(5)}
              </span>
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-xl bg-[#7E1819] hover:bg-[#911d1e] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
              >
                <Navigation className="w-3.5 h-3.5 text-amber-200" />
                <span>Chỉ đường trên GG Maps</span>
              </a>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
