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

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
      }).addTo(map);

      mapInstanceRef.current = map;
      markersGroupRef.current = L.layerGroup().addTo(map);
    } else {
      mapInstanceRef.current.invalidateSize();
    }

    // Render all 103 pins
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
        const lat = mon.map?.lat;
        const lng = mon.map?.lng;
        if (!lat || !lng || isNaN(lat) || isNaN(lng)) return;

        // Custom Icon: Gold/Active for current, Crimson Red for others
        const pinColor = isCurrent ? '#D97706' : '#7B1113';
        const pinEmoji = isCurrent ? '⭐' : '🏛️';
        const pinSize = isCurrent ? 38 : 30;

        const customIcon = L.divIcon({
          className: 'monument-marker-pin',
          html: `<div style="background-color: ${pinColor}; color: white; width: ${pinSize}px; height: ${pinSize}px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.35); border: ${isCurrent ? '3px solid #FEF08A' : '2px solid white'};">
            <span style="transform: rotate(45deg); font-size: ${isCurrent ? '15px' : '12px'}; font-weight: bold;">${pinEmoji}</span>
          </div>`,
          iconSize: [pinSize, pinSize],
          iconAnchor: [pinSize / 2, pinSize],
          popupAnchor: [0, -pinSize + 4]
        });

        const marker = L.marker([lat, lng], { icon: customIcon });

        const popupContent = `
          <div style="font-family: inherit; padding: 4px; max-width: 250px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
              <span style="background: #7B1113; color: white; font-size: 10px; font-weight: 800; padding: 1px 6px; border-radius: 4px;">#${mon.stt}/103</span>
              <span style="background: #FEF3C7; color: #92400E; font-size: 10px; font-weight: 700; padding: 1px 6px; border-radius: 4px;">${mon.info.ranking}</span>
            </div>
            <div style="color: #7B1113; font-weight: 800; font-size: 13px; margin-bottom: 3px; line-height: 1.3;">${mon.info.name}</div>
            <div style="font-size: 11px; color: #555; margin-bottom: 4px;">📍 ${mon.info.address}</div>
            <div style="font-size: 10px; color: #888; margin-bottom: 8px;">Tọa độ GPS: ${lat.toFixed(5)}, ${lng.toFixed(5)}</div>
            <button id="btn-select-mon-${mon.stt}" style="width: 100%; background: #7B1113; color: white; border: none; padding: 6px 10px; border-radius: 8px; font-size: 11px; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px;">
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
                onSelectMonument(mon);
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
          <div className="inline-flex rounded-xl p-0.5 bg-white border border-[#EADBC8] shadow-2xs">
            <button
              onClick={() => setViewMode('leaflet103')}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'leaflet103'
                  ? 'bg-[#7B1113] text-white shadow-xs'
                  : 'text-[#6B5E55] hover:text-[#7B1113]'
              }`}
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Bản đồ Tương tác 103 Điểm Ghim</span>
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
                className="p-1.5 rounded-xl border border-gray-300 bg-white text-xs font-bold text-gray-700 outline-none"
              >
                <option value="all">Tất cả loại</option>
                <option value="Lịch sử">Lịch sử</option>
                <option value="Kiến trúc">Kiến trúc</option>
                <option value="thắng cảnh">Thắng cảnh</option>
              </select>
            </div>
          )}
        </div>

        {/* Map Body */}
        <div className="flex-1 w-full bg-gray-100 relative">
          {viewMode === 'leaflet103' ? (
            <div ref={mapContainerRef} className="w-full h-full" />
          ) : (
            <iframe
              src={embedUrl}
              width="100%"
              height="100%"
              title="Google My Maps Di Tích Lịch Sử TP.HCM"
              className="border-0 w-full h-full"
              loading="lazy"
              allowFullScreen
            />
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
