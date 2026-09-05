import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapPin, ExternalLink, Maximize2, Layers } from 'lucide-react';

export default function LocationMap({
  name = 'Dinh Độc Lập',
  address = '135 Nam Kỳ Khởi Nghĩa, Quận 1, TP.HCM',
  ranking = 'Quốc gia đặc biệt',
  coordinates = [10.77715, 106.69534],
  embedUrl,
  onOpenMyMap
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [viewMode, setViewMode] = useState('interactive'); // 'interactive' (Leaflet) | 'mymaps' (Google My Maps)

  const lat = coordinates && !isNaN(coordinates[0]) ? parseFloat(coordinates[0]) : 10.77715;
  const lng = coordinates && !isNaN(coordinates[1]) ? parseFloat(coordinates[1]) : 106.69534;

  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  const googleMapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lat + ',' + lng)}`;
  const myMapsSrc = embedUrl || 'https://www.google.com/maps/d/embed?mid=1UM24OubPpISXPfooW7VY8Vo4xMZ6dIg&ehbc=2E312F';

  useEffect(() => {
    if (viewMode !== 'interactive' || !mapContainerRef.current) return;

    // Initialize or update Leaflet map
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [lat, lng],
        zoom: 16,
        zoomControl: true,
        attributionControl: false
      });

      L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        attribution: '&copy; Bản đồ Thành phố Hồ Chí Minh'
      }).addTo(map);

      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView([lat, lng], 16);
      mapInstanceRef.current.invalidateSize();
    }

    // Custom Category Icon provided by the user
    let iconUrl = '/assets/icons/di%20t%C3%ADch%20l%E1%BB%8Bch%20s%E1%BB%AD.png';
    const rankingOrName = (ranking + ' ' + name).toLowerCase();
    if (rankingOrName.includes('khảo cổ')) {
      iconUrl = '/assets/icons/Di%20t%C3%ADch%20kh%E1%BA%A3o%20c%E1%BB%95.png';
    } else if (rankingOrName.includes('kiến trúc')) {
      iconUrl = '/assets/icons/Di%20t%C3%ADch%20ki%E1%BA%BFn%20tr%C3%BAc.png';
    }

    const customIcon = L.divIcon({
      className: 'custom-pin',
      html: `<div style="
        width: 44px;
        height: 44px;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        filter: drop-shadow(0 4px 10px rgba(0,0,0,0.45));
      ">
        <img src="${iconUrl}" alt="${name}" style="
          width: 100%;
          height: 100%;
          object-fit: contain;
          border-radius: 50%;
          box-shadow: 0 0 0 3px #FBBF24, 0 0 16px rgba(251,191,36,0.8);
        " />
      </div>`,
      iconSize: [44, 44],
      iconAnchor: [22, 22],
      popupAnchor: [0, -22]
    });

    if (markerRef.current) {
      markerRef.current.remove();
    }

    const marker = L.marker([lat, lng], { icon: customIcon }).addTo(mapInstanceRef.current);
    marker.bindPopup(`
      <div style="font-family: inherit; padding: 4px; max-width: 240px;">
        <div style="color: #7B1113; font-weight: 800; font-size: 13px; margin-bottom: 2px;">${name}</div>
        <div style="font-size: 11px; color: #555; margin-bottom: 4px;">📍 ${address}</div>
        <div style="font-size: 10px; color: #7B1113; background: #FAF0E6; padding: 2px 6px; border-radius: 4px; font-weight: 700; display: inline-block; margin-bottom: 4px;">${ranking}</div>
        <div style="font-size: 10px; color: #888; margin-bottom: 8px;">Tọa độ: ${lat.toFixed(5)}, ${lng.toFixed(5)}</div>
        <a href="${googleMapsDirectionsUrl}" target="_blank" rel="noopener noreferrer" style="display: block; background: #7B1113; color: white; text-align: center; padding: 6px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; text-decoration: none;">
          Chỉ đường trên Google Maps &rarr;
        </a>
      </div>
    `);

    markerRef.current = marker;
  }, [lat, lng, name, address, ranking, googleMapsDirectionsUrl, viewMode]);

  return (
    <div className="w-full h-full relative rounded-xl overflow-hidden bg-gray-100 flex flex-col group">
      {viewMode === 'interactive' ? (
        <div ref={mapContainerRef} className="w-full h-full flex-1 z-0" />
      ) : (
        <iframe
          src={myMapsSrc}
          width="100%"
          height="100%"
          title={`Bản đồ My Maps: ${name}`}
          className="border-0 w-full h-full flex-1"
          loading="lazy"
        />
      )}

      {/* Floating Action Controls */}
      <div className="absolute top-2 right-2 flex items-center gap-1.5 z-20">
        {/* Toggle Mode button */}
        <button
          onClick={() => setViewMode(viewMode === 'interactive' ? 'mymaps' : 'interactive')}
          className="px-2 py-1 rounded-lg bg-white/95 hover:bg-white text-[#7B1113] text-[10px] font-black shadow-md border border-gray-200 transition-all hover:scale-105 cursor-pointer flex items-center gap-1"
          title={viewMode === 'interactive' ? "Chuyển sang Google My Maps" : "Chuyển sang Bản đồ Tọa độ"}
        >
          <Layers className="w-3 h-3" />
          <span>{viewMode === 'interactive' ? 'My Maps' : 'Tọa độ GPS'}</span>
        </button>

        {onOpenMyMap && (
          <button
            onClick={onOpenMyMap}
            className="p-1.5 rounded-lg bg-white/95 hover:bg-white text-[#7B1113] shadow-md border border-gray-200 transition-all hover:scale-105 cursor-pointer"
            title="Mở toàn màn hình Bản đồ 103 Di tích"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        )}

        <a
          href={googleMapsDirectionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 rounded-lg bg-white/95 hover:bg-white text-[#7B1113] shadow-md border border-gray-200 transition-all hover:scale-105"
          title="Chỉ đường trên Google Maps đến vị trí này"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Bottom Coordinates & Status Tag */}
      <div className="bg-white/95 backdrop-blur-xs px-3 py-1.5 border-t border-gray-200 flex items-center justify-between text-[10px] text-gray-600 z-10">
        <a 
          href={googleMapsDirectionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-[#7B1113] hover:underline truncate max-w-[200px]"
          title="Bấm để mở Google Maps chỉ đường"
        >
          📍 GPS: {lat.toFixed(4)}°N, {lng.toFixed(4)}°E
        </a>
        <span className="text-gray-500 font-medium">
          {viewMode === 'interactive' ? 'OpenStreetMap GPS' : 'Google My Maps'}
        </span>
      </div>
    </div>
  );
}
