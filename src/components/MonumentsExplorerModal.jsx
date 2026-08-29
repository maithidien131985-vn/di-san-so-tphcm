import React, { useState, useMemo } from 'react';
import { 
  X, 
  Search, 
  Landmark, 
  MapPin, 
  ArrowRight, 
  Check
} from 'lucide-react';
import { allMonumentsList } from '../data/allMonumentsData';

export default function MonumentsExplorerModal({
  isOpen,
  onClose,
  currentMonumentStt,
  onSelectMonument
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRank, setSelectedRank] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  const filteredMonuments = useMemo(() => {
    return allMonumentsList.filter(m => {
      const q = searchTerm.toLowerCase().trim();
      const matchSearch = !q || 
        m.info.name.toLowerCase().includes(q) ||
        (m.info.address && m.info.address.toLowerCase().includes(q)) ||
        (m.info.overview && m.info.overview.toLowerCase().includes(q)) ||
        m.stt.toString() === q;

      const matchRank = selectedRank === 'all' || (m.info.ranking && m.info.ranking.includes(selectedRank));
      const matchType = selectedType === 'all' || (m.info.type && m.info.type.includes(selectedType));

      return matchSearch && matchRank && matchType;
    });
  }, [searchTerm, selectedRank, selectedType]);

  const totalPages = Math.ceil(filteredMonuments.length / itemsPerPage);
  const paginatedMonuments = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredMonuments.slice(start, start + itemsPerPage);
  }, [filteredMonuments, page]);

  if (!isOpen) return null;

  const handleChoose = (monument) => {
    if (onSelectMonument) {
      onSelectMonument(monument);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#FAF7F2] w-full max-w-6xl rounded-3xl overflow-hidden shadow-2xl border border-[#EADBC8] flex flex-col max-h-[94vh] animate-scaleUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#7B1113] via-[#96171a] to-[#7B1113] text-white p-5 sm:p-6 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center border border-white/20 shadow-inner">
              <Landmark className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-300 bg-black/20 px-2.5 py-0.5 rounded-full">
                  Kho Di Sản Số Toàn Diện
                </span>
                <span className="text-[10px] bg-emerald-600 text-white font-black px-2 py-0.5 rounded-full">
                  103 Di Tích TP.HCM
                </span>
              </div>
              <h3 className="font-serif-title font-black text-lg sm:text-2xl text-white">
                Khám Phá Toàn Bộ 103 Di Tích Lịch Sử & Văn Hóa
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

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 sm:p-5 border-b border-[#EADBC8] space-y-3 shadow-2xs">
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm theo tên di tích, địa chỉ, quận huyện, mốc STT (ví dụ: Địa đạo Củ Chi, Côn Đảo, Quận 1...)..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-gray-300 text-xs sm:text-sm outline-none focus:border-[#7B1113] focus:ring-1 focus:ring-[#7B1113]"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Rank filter */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={selectedRank}
                onChange={(e) => {
                  setSelectedRank(e.target.value);
                  setPage(1);
                }}
                className="p-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 bg-white outline-none focus:border-[#7B1113] flex-1 sm:flex-none cursor-pointer"
              >
                <option value="all">Tất cả cấp xếp hạng</option>
                <option value="đặc biệt">Quốc gia đặc biệt</option>
                <option value="Quốc gia">Cấp Quốc gia</option>
                <option value="Thành phố">Cấp Thành phố</option>
              </select>

              {/* Type filter */}
              <select
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value);
                  setPage(1);
                }}
                className="p-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 bg-white outline-none focus:border-[#7B1113] flex-1 sm:flex-none cursor-pointer"
              >
                <option value="all">Tất cả loại di tích</option>
                <option value="Lịch sử">Lịch sử</option>
                <option value="Kiến trúc">Kiến trúc nghệ thuật</option>
                <option value="thắng cảnh">Danh lam thắng cảnh</option>
                <option value="Khảo cổ">Khảo cổ học</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
            <div>
              Hiển thị <strong className="text-[#7B1113]">{filteredMonuments.length}</strong> / 103 di tích
            </div>
            {searchTerm && (
              <span className="text-[11px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                Đang lọc từ khóa: "{searchTerm}"
              </span>
            )}
          </div>
        </div>

        {/* Grid List of 103 Monuments */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {paginatedMonuments.length === 0 ? (
            <div className="text-center py-16 space-y-3 bg-white rounded-3xl border border-dashed border-gray-300">
              <Landmark className="w-12 h-12 mx-auto text-gray-300" />
              <p className="text-sm font-bold text-gray-600">Không tìm thấy di tích phù hợp với từ khóa này</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedRank('all');
                  setSelectedType('all');
                }}
                className="px-4 py-2 rounded-xl bg-[#7B1113] text-white text-xs font-bold hover:bg-[#96171a] cursor-pointer"
              >
                Xóa bộ lọc để xem tất cả
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {paginatedMonuments.map((monument) => {
                const isCurrent = monument.stt === currentMonumentStt;
                const isSpecial = monument.info.ranking.toLowerCase().includes('đặc biệt');

                return (
                  <div
                    key={monument.id}
                    onClick={() => handleChoose(monument)}
                    className={`rounded-3xl p-4 sm:p-5 border transition-all duration-300 flex flex-col justify-between cursor-pointer group shadow-xs hover:shadow-md ${
                      isCurrent
                        ? 'bg-amber-50/90 border-[#7B1113] ring-2 ring-[#7B1113]/30'
                        : 'bg-white border-[#EADBC8] hover:border-[#7B1113]/50 hover:-translate-y-0.5'
                    }`}
                  >
                    <div className="space-y-3">
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="w-7 h-7 rounded-xl bg-[#7B1113] text-white flex items-center justify-center font-black text-xs shadow-2xs">
                            {monument.stt}
                          </span>
                          <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                            isSpecial
                              ? 'bg-red-100 text-[#7B1113] border border-red-200'
                              : 'bg-amber-100 text-amber-900 border border-amber-200'
                          }`}>
                            {monument.info.ranking}
                          </span>
                        </div>

                        {isCurrent && (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-600 text-white flex items-center gap-1">
                            <Check className="w-3 h-3" /> Đang xem
                          </span>
                        )}
                      </div>

                      {/* Image Thumbnail */}
                      <div className="h-32 sm:h-36 w-full rounded-2xl overflow-hidden relative bg-black/10">
                        <img
                          src={monument.info.heroImage}
                          alt={monument.info.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.target.src = '/assets/images/dinh-doc-lap-front.jpg';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-2 left-3 right-3 text-white text-[11px] font-bold truncate flex items-center gap-1">
                          <span className="px-2 py-0.5 rounded bg-black/50 text-[10px]">
                            {monument.info.type}
                          </span>
                        </div>
                      </div>

                      {/* Title & Address */}
                      <div>
                        <h4 className="font-serif-title font-bold text-sm sm:text-base text-[#2C241E] group-hover:text-[#7B1113] transition-colors line-clamp-2 leading-snug">
                          {monument.info.name}
                        </h4>
                        <div className="flex items-start gap-1.5 text-[11px] text-[#6B5E55] mt-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#7B1113] shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{monument.info.address}</span>
                        </div>
                      </div>

                      {/* Summary */}
                      <p className="text-xs text-[#555] line-clamp-2 leading-relaxed">
                        {monument.info.overview}
                      </p>
                    </div>

                    {/* Button Action */}
                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#7B1113] group-hover:translate-x-1 transition-transform">
                      <span>{isCurrent ? 'Tiếp tục xem trang này' : 'Khám phá trang di tích này'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-xl border border-gray-300 text-xs font-bold disabled:opacity-40 cursor-pointer"
              >
                Trang trước
              </button>

              <span className="text-xs font-bold text-gray-700 px-3">
                Trang {page} / {totalPages}
              </span>

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 rounded-xl border border-gray-300 text-xs font-bold disabled:opacity-40 cursor-pointer"
              >
                Trang tiếp
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-[#FAF0E6] p-4 border-t border-[#EADBC8] flex flex-wrap items-center justify-between gap-2 text-xs text-[#8C7A6B]">
          <span>Dữ liệu số hóa đầy đủ 103 Di tích Lịch sử & Văn hóa TP.HCM</span>
          <span className="font-bold text-[#7B1113]">Hệ thống Di sản số TP.HCM</span>
        </div>
      </div>
    </div>
  );
}
