import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { X, MapPin, ExternalLink, Compass, Layers, Search, Navigation, Check, Landmark, ArrowRight } from 'lucide-react';
import { allMonumentsList } from '../data/allMonumentsData';

export default function MyMapModal({ 
  isOpen, 
  onClose, 
  embedUrl = 'https://www.google.com/maps/d/embed?mid=1UM24OubPpISXPfooW7VY8Vo4xMZ6dIg&ehbc=2E312F',
  currentMonumentStt = 1,
  onSelectMonument
}) {
  const [viewMode, setViewMode] = useState('leaflet103'); // 'leaflet103' | 'mymaps'
  const [mapSearch, setMapSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersGroupRef = useRef(null);

  const fullMapUrl = 'https://www.google.com/maps/d/viewer?mid=1UM24OubPpISXPfooW7VY8Vo4xMZ6dIg&usp=sharing';

  useEffect(() => {
    if (!isOpen || viewMode !== 'leaflet103' || !mapContainerRef.current) return;

    // Center on current monument or TP.HCM center
    const current = allMonumentsList.find(m => m.stt === currentMonumentStt) || allMonumentsList[0];
    const initialLat = current.map?.lat || 10.77715;
    const initialLng = current.map?.lng || 106.69534;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: 14,
        zoomControl: true,
        attributionControl: false
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
        attribution: '&copy; CartoDB &amp; OpenStreetMap'
      }).addTo(map);

      mapInstanceRef.current = map;
      markersGroupRef.current = L.layerGroup().addTo(map);
    } else {
      mapInstanceRef.current.invalidateSize();
    }

    // Render all 103 pins with User's Custom 3 Icons
    if (markersGroupRef.current) {
      markersGroupRef.current.clearLayers();

      allMonumentsList.forEach((mon) => {
        // Filter check
        if (typeFilter !== 'all' && !mon.info.type.includes(typeFilter)) return;
        if (mapSearch) {
          const q = mapSearch.toLowerCase().trim();
          const match = mon.info.name.toLowerCase().includes(q) || 
            mon.info.address.toLowerCase().includes(q) ||
            mon.stt.toString() === q;
          if (!match) return;
        }

        const isCurrent = mon.stt === currentMonumentStt;
        const lat = mon.map?.lat || mon.info?.lat;
        const lng = mon.map?.lng || mon.info?.lng;
        if (!lat || !lng || isNaN(lat) || isNaN(lng)) return;

        // Custom 3 Category Icons provided by the user
        const monType = mon.info?.type || 'Lịch sử';
        let iconUrl = '/assets/icons/di%20t%C3%ADch%20l%E1%BB%8Bch%20s%E1%BB%AD.png';
        if (monType.includes('Khảo cổ')) {
          iconUrl = '/assets/icons/Di%20t%C3%ADch%20kh%E1%BA%A3o%20c%E1%BB%95.png';
        } else if (monType.includes('Kiến trúc')) {
          iconUrl = '/assets/icons/Di%20t%C3%ADch%20ki%E1%BA%BFn%20tr%C3%BAc.png';
        }

        const pinSize = isCurrent ? 46 : 36;

        const customIcon = L.divIcon({
          className: 'custom-monument-icon',
          html: `<div style="
            width: ${pinSize}px;
            height: ${pinSize}px;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            filter: drop-shadow(0 4px 8px rgba(0,0,0,0.45));
            ${isCurrent ? 'transform: scale(1.15); z-index: 999;' : ''}
            transition: transform 0.2s ease;
          ">
            <img src="${iconUrl}" alt="${monType}" style="
              width: 100%;
              height: 100%;
              object-fit: contain;
              border-radius: ${isCurrent ? '50%' : '6px'};
              ${isCurrent ? 'box-shadow: 0 0 0 3px #FBBF24, 0 0 16px rgba(251,191,36,0.9);' : ''}
            " />
            ${isCurrent ? '<div style="position:absolute; bottom:-8px; background:#D97706; color:white; font-size:8px; font-weight:900; padding:1px 4px; border-radius:4px; border:1px solid white; white-space:nowrap;">ĐANG XEM</div>' : ''}
          </div>`,
          iconSize: [pinSize, pinSize],
          iconAnchor: [pinSize / 2, pinSize / 2],
          popupAnchor: [0, -pinSize / 2]
        });

        const marker = L.marker([lat, lng], { icon: customIcon });

        const heroImg = mon.info?.heroImage || mon.gallery?.[0]?.src || '';

        const popupContent = `
          <div style="font-family: inherit; padding: 4px; max-width: 270px;">
            ${heroImg ? `<div style="width: 100%; height: 110px; border-radius: 8px; overflow: hidden; margin-bottom: 6px; background: #222;">
              <img src="${heroImg}" alt="${mon.info.name}" style="width: 100%; height: 100%; object-fit: cover;" />
            </div>` : ''}
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
              <span style="background: #7B1113; color: white; font-size: 10px; font-weight: 800; padding: 1px 6px; border-radius: 4px;">#${mon.stt}/103</span>
              <span style="background: #FEF3C7; color: #92400E; font-size: 10px; font-weight: 700; padding: 1px 6px; border-radius: 4px;">${mon.info.ranking || 'Di tích Quốc gia'}</span>
            </div>
            <div style="color: #7B1113; font-weight: 800; font-size: 13px; margin-bottom: 3px; line-height: 1.3;">${mon.info.name}</div>
            <div style="font-size: 11px; color: #555; margin-bottom: 4px;">📍 ${mon.info.address}</div>
            <div style="font-size: 10px; color: #888; margin-bottom: 8px;">Tọa độ GPS: ${lat.toFixed(5)}, ${lng.toFixed(5)}</div>
            <button id="btn-select-mon-${mon.stt}" style="width: 100%; background: linear-gradient(135deg, #7B1113, #96171a); color: white; border: none; padding: 7px 10px; border-radius: 8px; font-size: 11px; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">
              <span>Xem trang di tích này &rarr;</span>
            </button>
          </div>
        `;

        marker.bindPopup(popupContent);
        
        marker.on('popupopen', () => {
          const btn = document.getElementById(`btn-select-mon-${mon.stt}`);
          if (btn) {
            btn.onclick = () => {
              if (onSelectMonument) {
                onSelectMonument(mon.stt);
              }
              onClose();
            };
          }
        });

        markersGroupRef.current.addLayer(marker);

        if (isCurrent) {
          marker.openPopup();
        }
      });
    }
  }, [isOpen, viewMode, currentMonumentStt, typeFilter, mapSearch, onSelectMonument, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-6xl rounded-3xl overflow-hidden shadow-2xl border border-[#EADBC8] flex flex-col h-[90vh] animate-scaleUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#7B1113] via-[#96171a] to-[#7B1113] text-white p-4 sm:p-5 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center text-amber-300 border border-white/20 shadow-inner">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-300 bg-black/20 px-2.5 py-0.5 rounded-full">
                  Bản Đồ Số Hóa Không Gian
                </span>
                <span className="text-[10px] bg-emerald-500/90 text-white font-bold px-2 py-0.5 rounded-full">
                  103 Tọa Độ GPS Di Tích
                </span>
              </div>
              <h3 className="font-serif-title font-bold text-base sm:text-xl text-white">
                Bản Đồ Vị Trí 103 Di Tích Lịch Sử & Văn Hóa TP.HCM
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar & Filters */}
        <div className="bg-[#FAF7F2] p-3 sm:p-4 border-b border-[#EADBC8] flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Mode Switcher */}
          <div className="inline-flex rounded-xl p-0.5 bg-white border border-[#EADBC8] shadow-2xs flex-wrap gap-1">
            <button
              onClick={() => setViewMode('leaflet103')}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'leaflet103'
                  ? 'bg-[#7B1113] text-white shadow-xs'
                  : 'text-[#6B5E55] hover:text-[#7B1113]'
              }`}
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Bản đồ 103 Điểm Ghim</span>
            </button>
            <button
              onClick={() => setViewMode('mymaps')}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'mymaps'
                  ? 'bg-[#7B1113] text-white shadow-xs'
                  : 'text-[#6B5E55] hover:text-[#7B1113]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Google My Maps</span>
            </button>
            <button
              onClick={() => setViewMode('tphcm_map')}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'tphcm_map'
                  ? 'bg-[#7B1113] text-white shadow-xs'
                  : 'text-[#6B5E55] hover:text-[#7B1113]'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Bản Đồ TP.HCM (Tư Liệu)</span>
            </button>
          </div>

          {/* Search & Type filter (only in Leaflet mode) */}
          {viewMode === 'leaflet103' && (
            <div className="flex items-center gap-2 flex-1 max-w-md justify-end">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm di tích trên bản đồ..."
                  value={mapSearch}
                  onChange={(e) => setMapSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-gray-300 bg-white text-xs outline-none focus:border-[#7B1113]"
                />
              </div>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="p-1.5 rounded-xl border border-gray-300 bg-white text-xs font-bold text-gray-700 outline-none cursor-pointer"
              >
                <option value="all">Tất cả loại</option>
                <option value="Lịch sử">Di tích Lịch sử</option>
                <option value="Kiến trúc">Kiến trúc nghệ thuật</option>
                <option value="Khảo cổ">Khảo cổ học</option>
                <option value="thắng cảnh">Danh lam thắng cảnh</option>
              </select>
            </div>
          )}
        </div>

        {/* 3 Icon Legend Bar */}
        {viewMode === 'leaflet103' && (
          <div className="bg-[#FAF4F0] px-4 py-2 border-b border-rose-100 flex items-center justify-center gap-4 sm:gap-6 flex-wrap text-[11px] font-bold text-stone-700">
            <span className="text-[#8B1417] uppercase tracking-wider font-black text-[10px]">Phân loại Icon:</span>
            <div className="flex items-center gap-1.5">
              <img src="/assets/icons/di%20t%C3%ADch%20l%E1%BB%8Bch%20s%E1%BB%AD.png" alt="Lịch sử" className="w-5 h-5 object-contain" />
              <span>Di tích Lịch sử</span>
            </div>
            <div className="flex items-center gap-1.5">
              <img src="/assets/icons/Di%20t%C3%ADch%20ki%E1%BA%BFn%20tr%C3%BAc.png" alt="Kiến trúc" className="w-5 h-5 object-contain" />
              <span>Kiến trúc nghệ thuật</span>
            </div>
            <div className="flex items-center gap-1.5">
              <img src="/assets/icons/Di%20t%C3%ADch%20kh%E1%BA%A3o%20c%E1%BB%95.png" alt="Khảo cổ" className="w-5 h-5 object-contain" />
              <span>Khảo cổ học</span>
            </div>
          </div>
        )}

        {/* Map Body */}
        <div className="flex-1 w-full bg-gray-100 relative">
          {viewMode === 'leaflet103' ? (
            <div ref={mapContainerRef} className="w-full h-full" />
          ) : viewMode === 'mymaps' ? (
            <iframe
              src={embedUrl}
              width="100%"
              height="100%"
              title="Google My Maps Di Tích Lịch Sử TP.HCM"
              className="border-0 w-full h-full"
              loading="lazy"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full bg-[#1A1A1A] flex flex-col items-center justify-center p-4 relative overflow-auto">
              <iframe
                src="https://drive.google.com/file/d/1MncmQZXrDI_70HKjR0MIkYOM8Nx9hkrs/preview"
                width="100%"
                height="100%"
                title="Bản đồ Thành phố Hồ Chí Minh"
                className="w-full h-full border-0 rounded-2xl shadow-xl bg-white"
                allowFullScreen
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 bg-[#FAF7F2] border-t border-[#EADBC8] flex flex-wrap items-center justify-between gap-3 text-xs text-[#6B5E55]">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#7B1113]" />
            <span>
              {viewMode === 'leaflet103' 
                ? 'Đã tải 103 vị trí GPS chính xác. Nhấp vào điểm ghim bất kỳ để xem chi tiết và chuyển trang.'
                : 'Bản đồ Google My Maps tích hợp không gian di tích TP.HCM.'}
            </span>
          </div>
          <a
            href={fullMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-[#7B1113] hover:bg-[#96171a] text-white font-bold flex items-center gap-1.5 shadow-sm transition-all hover:scale-105"
          >
            <span>Mở trên Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
