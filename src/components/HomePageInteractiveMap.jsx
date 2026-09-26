import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Search, Maximize2, Compass, Layers, Check, ExternalLink } from 'lucide-react';
import { allMonumentsList } from '../data/allMonumentsData';

export default function HomePageInteractiveMap({
  currentMonumentStt = 1,
  onSelectMonument,
  onOpenMyMap
}) {
  const [mapSearch, setMapSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersGroupRef = useRef(null);

  // Initialize Leaflet Map Instance
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      try {
        mapInstanceRef.current.remove();
      } catch (e) {
        console.warn('Error removing old map instance:', e);
      }
      mapInstanceRef.current = null;
      markersGroupRef.current = null;
    }

    // Default center at Ho Chi Minh City center (District 1)
    const current = allMonumentsList.find(m => m.stt === currentMonumentStt) || allMonumentsList[0];
    const initialLat = current?.map?.lat || current?.info?.lat || 10.77715;
    const initialLng = current?.map?.lng || current?.info?.lng || 106.69534;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 13,
      zoomControl: true,
      attributionControl: false
    });

    // Google Maps Vector Tiles
    L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      attribution: '&copy; Google Maps'
    }).addTo(map);

    const markersGroup = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;
    markersGroupRef.current = markersGroup;

    const t1 = setTimeout(() => map.invalidateSize(), 100);
    const t2 = setTimeout(() => map.invalidateSize(), 300);
    const t3 = setTimeout(() => map.invalidateSize(), 600);

    const resizeObserver = new ResizeObserver(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    });
    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    window.__handleSelectMonumentFromHomeMap = (stt) => {
      const parsed = parseInt(stt, 10);
      if (!isNaN(parsed) && onSelectMonument) {
        onSelectMonument(parsed);
      }
    };

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      resizeObserver.disconnect();
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {
          console.warn('Error on map cleanup:', e);
        }
        mapInstanceRef.current = null;
        markersGroupRef.current = null;
      }
    };
  }, []);

  // Update Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersGroupRef.current) return;

    const markersGroup = markersGroupRef.current;
    markersGroup.clearLayers();

    allMonumentsList.forEach((mon) => {
      if (typeFilter !== 'all' && !mon.info?.type?.toLowerCase().includes(typeFilter.toLowerCase())) return;
      if (mapSearch) {
        const q = mapSearch.toLowerCase().trim();
        const match = mon.info?.name?.toLowerCase().includes(q) || 
          mon.info?.address?.toLowerCase().includes(q) ||
          mon.stt?.toString() === q;
        if (!match) return;
      }

      const lat = mon.map?.lat || mon.info?.lat;
      const lng = mon.map?.lng || mon.info?.lng;
      if (!lat || !lng || isNaN(lat) || isNaN(lng)) return;

      const monType = mon.info?.type || 'Lịch sử';
      let iconUrl = '/assets/icons/di%20t%C3%ADch%20l%E1%BB%8Bch%20s%E1%BB%AD.png';
      if (monType.includes('Khảo cổ')) {
        iconUrl = '/assets/icons/Di%20t%C3%ADch%20kh%E1%BA%A3o%20c%E1%BB%95.png';
      } else if (monType.includes('Kiến trúc')) {
        iconUrl = '/assets/icons/Di%20t%C3%ADch%20ki%E1%BA%BFn%20tr%C3%BAc.png';
      }

      const pinSize = 34;

      const customIcon = L.divIcon({
        className: 'custom-monument-icon',
        html: `<div style="
          width: ${pinSize}px;
          height: ${pinSize}px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          filter: drop-shadow(0 3px 6px rgba(0,0,0,0.4));
          cursor: pointer;
        ">
          <img src="${iconUrl}" alt="${monType}" style="
            width: 100%;
            height: 100%;
            object-fit: contain;
            border-radius: 6px;
          " />
        </div>`,
        iconSize: [pinSize, pinSize],
        iconAnchor: [pinSize / 2, pinSize / 2],
        popupAnchor: [0, -pinSize / 2]
      });

      const marker = L.marker([lat, lng], { icon: customIcon });
      const heroImg = mon.info?.heroImage || mon.gallery?.[0]?.src || '';

      const popupContent = `
        <div style="font-family: inherit; padding: 4px; max-width: 260px;">
          ${heroImg ? `<div style="width: 100%; height: 105px; border-radius: 8px; overflow: hidden; margin-bottom: 6px; background: #222;">
            <img src="${heroImg}" alt="${mon.info.name}" style="width: 100%; height: 100%; object-fit: cover;" />
          </div>` : ''}
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
            <span style="background: #7B1113; color: white; font-size: 10px; font-weight: 800; padding: 1px 6px; border-radius: 4px;">#${mon.stt}/103</span>
            <span style="background: #FEF3C7; color: #92400E; font-size: 9px; font-weight: 700; padding: 1px 5px; border-radius: 4px;">${mon.info.ranking || 'Di tích Quốc gia'}</span>
          </div>
          <div style="color: #7B1113; font-weight: 800; font-size: 12.5px; margin-bottom: 3px; line-height: 1.3;">${mon.info.name}</div>
          <div style="font-size: 11px; color: #555; margin-bottom: 4px;">📍 ${mon.info.address}</div>
          <button onclick="window.__handleSelectMonumentFromHomeMap(${mon.stt})" style="width: 100%; background: linear-gradient(135deg, #7B1113, #96171a); color: white; border: none; padding: 7px 10px; border-radius: 8px; font-size: 11px; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.2); margin-top: 6px;">
            <span>Khám phá di tích này &rarr;</span>
          </button>
        </div>
      `;

      marker.bindPopup(popupContent);
      markersGroup.addLayer(marker);
    });
  }, [typeFilter, mapSearch]);

  const jumpToCoords = (lat, lng, zoom = 14) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([lat, lng], zoom, { duration: 1.2 });
    }
  };

  return (
    <div className="w-full rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-amber-400/60 shadow-2xl bg-[#200507]/90 backdrop-blur-md flex flex-col">
      {/* Header bar */}
      <div className="bg-[#4A0A0C] px-3 sm:px-4 py-2.5 sm:py-3 border-b border-amber-300/30 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-200">
          <MapPin className="w-4 h-4 text-amber-300 animate-bounce" />
          <span>Bản đồ số 103 Di tích TP.HCM</span>
          <span className="hidden sm:inline-block text-[10px] bg-emerald-500/90 text-white font-black px-2 py-0.5 rounded-full">
            103 Điểm Ghim GPS
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenMyMap}
            className="text-[10px] sm:text-xs px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-[#200507] font-black uppercase tracking-wide cursor-pointer transition-all shadow-md flex items-center gap-1.5 hover:scale-105 active:scale-95"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Phóng to toàn màn hình</span>
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-[#2D0608] px-3 py-2 border-b border-amber-400/20 flex flex-wrap items-center justify-between gap-2">
        <div className="relative flex-1 min-w-[140px] max-w-xs">
          <Search className="w-3.5 h-3.5 text-amber-400/70 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Tìm di tích / số thứ tự..."
            value={mapSearch}
            onChange={(e) => setMapSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1 bg-white/10 text-white placeholder-amber-200/50 text-xs rounded-lg border border-amber-400/30 focus:outline-none focus:border-amber-400 focus:bg-white/15"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1 overflow-x-auto py-0.5 max-w-full">
          {[
            { id: 'all', label: 'Tất cả (103)' },
            { id: 'Lịch sử', label: 'Lịch sử', icon: '/assets/icons/di%20t%C3%ADch%20l%E1%BB%8Bch%20s%E1%BB%AD.png' },
            { id: 'Kiến trúc', label: 'Kiến trúc', icon: '/assets/icons/Di%20t%C3%ADch%20ki%E1%BA%BFn%20tr%C3%BAc.png' },
            { id: 'Khảo cổ', label: 'Khảo cổ', icon: '/assets/icons/Di%20t%C3%ADch%20kh%E1%BA%A3o%20c%E1%BB%95.png' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setTypeFilter(cat.id)}
              className={`text-[10px] font-bold px-2 py-1 rounded-md transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                typeFilter === cat.id
                  ? 'bg-amber-400 text-[#200507] shadow-sm font-black'
                  : 'bg-white/10 text-amber-100/80 hover:bg-white/20'
              }`}
            >
              {cat.icon && <img src={cat.icon} alt="" className="w-3 h-3 object-contain" />}
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Leaflet Map Box */}
      <div className="h-[380px] sm:h-[430px] lg:h-[460px] w-full relative z-0 bg-[#FDF7F5]">
        <div ref={mapContainerRef} className="w-full h-full" />
      </div>

      {/* Quick Region Jump Pills Footer */}
      <div className="bg-[#380608]/95 px-3 sm:px-4 py-2 border-t border-amber-300/20 flex flex-wrap items-center justify-between gap-1.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] sm:text-[11px] font-bold text-amber-200/80 flex items-center gap-1 shrink-0 mr-1">
            <Compass className="w-3 h-3 text-amber-400" />
            <span>Khu vực:</span>
          </span>
          {[
            { name: 'Quận 1 & TT', lat: 10.77715, lng: 106.69534 },
            { name: 'Chợ Lớn (Q5/6/11)', lat: 10.75338, lng: 106.65782 },
            { name: 'Gia Định & Bình Thạnh', lat: 10.80387, lng: 106.69634 },
            { name: 'Củ Chi', lat: 11.14321, lng: 106.46328 },
            { name: 'Cần Giờ', lat: 10.40798, lng: 106.95355 },
            { name: 'Thủ Đức', lat: 10.85042, lng: 106.75718 }
          ].map((r, idx) => (
            <button
              key={idx}
              onClick={() => jumpToCoords(r.lat, r.lng, r.name.includes('Củ Chi') || r.name.includes('Cần Giờ') ? 12 : 14)}
              className="text-[10px] sm:text-[11px] font-medium px-2 py-0.5 rounded-md bg-amber-400/10 hover:bg-amber-400/25 text-amber-200 hover:text-amber-100 border border-amber-400/20 transition-all cursor-pointer"
            >
              {r.name}
            </button>
          ))}
        </div>

        <button
          onClick={() => jumpToCoords(10.77715, 106.69534, 12)}
          className="text-[10px] text-amber-300 hover:text-amber-200 underline cursor-pointer ml-auto"
        >
          Về trung tâm TP
        </button>
      </div>
    </div>
  );
}
