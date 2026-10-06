import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin } from 'lucide-react';

export default function MiniMonumentCardMap({
  lat = 10.77715,
  lng = 106.69534,
  monumentName = 'Di tích',
  categoryIcon = '/assets/icons/di%20t%C3%ADch%20l%E1%BB%8Bch%20s%E1%BB%AD.png'
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const safeLat = typeof lat === 'number' && !isNaN(lat) ? lat : 10.77715;
    const safeLng = typeof lng === 'number' && !isNaN(lng) ? lng : 106.69534;

    try {
      if (!mapRef.current) {
        const map = L.map(containerRef.current, {
          center: [safeLat, safeLng],
          zoom: 15,
          zoomControl: false,
          attributionControl: false,
          dragging: false,
          scrollWheelZoom: false,
          doubleClickZoom: false,
          touchZoom: false,
          boxZoom: false,
          keyboard: false
        });

        L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
          maxZoom: 19,
          subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
        }).addTo(map);

        const customIcon = L.divIcon({
          className: 'mini-card-pin',
          html: `<div style="
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            filter: drop-shadow(0 3px 6px rgba(0,0,0,0.5));
          ">
            <img src="${categoryIcon}" alt="pin" style="
              width: 100%;
              height: 100%;
              object-fit: contain;
              border-radius: 50%;
              box-shadow: 0 0 0 2.5px #F59E0B, 0 0 12px rgba(245, 158, 11, 0.9);
              background: white;
            " />
          </div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        L.marker([safeLat, safeLng], { icon: customIcon }).addTo(map);
        mapRef.current = map;

        setTimeout(() => {
          if (mapRef.current) {
            mapRef.current.invalidateSize();
          }
        }, 150);
      } else {
        mapRef.current.setView([safeLat, safeLng], 15);
      }
    } catch (e) {
      console.warn('MiniMap init error:', e);
    }

    return () => {
      if (mapRef.current) {
        try {
          mapRef.current.remove();
        } catch (e) {}
        mapRef.current = null;
      }
    };
  }, [lat, lng, categoryIcon]);

  return (
    <div className="relative w-full h-full min-h-[140px] rounded-xl overflow-hidden pointer-events-none bg-stone-100 shadow-inner">
      <div ref={containerRef} className="w-full h-full absolute inset-0 z-0" />
      {/* Top Map Badge */}
      <div className="absolute top-1.5 left-1.5 z-10">
        <span className="px-2 py-0.5 rounded-full bg-[#7E1819]/90 text-amber-200 text-[9px] font-black uppercase shadow-sm flex items-center gap-1 border border-amber-300/50 backdrop-blur-xs">
          <MapPin className="w-2.5 h-2.5 text-amber-300 shrink-0" />
          <span>Bản đồ vị trí</span>
        </span>
      </div>
      {/* Bottom Coordinates Strip */}
      <div className="absolute bottom-1 left-1.5 right-1.5 z-10 bg-black/75 backdrop-blur-xs px-2 py-0.5 rounded-md text-white text-[9px] font-bold text-center truncate border border-white/20 shadow-xs">
        📍 {typeof lat === 'number' ? lat.toFixed(4) : lat}, {typeof lng === 'number' ? lng.toFixed(4) : lng}
      </div>
    </div>
  );
}