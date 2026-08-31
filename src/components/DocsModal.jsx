import React from 'react';
import { X, FileText, Bookmark, BookOpen, ExternalLink, Download, FolderOpen } from 'lucide-react';

export default function DocsModal({ 
  isOpen, 
  onClose,
  referencesList,
  driveReferenceData,
  monumentName = 'Di tích Lịch sử'
}) {
  if (!isOpen) return null;

  const defaultDocs = [
    {
      title: `Hồ sơ khoa học Di tích ${monumentName}`,
      source: "Sở Văn hóa và Thể thao TP. Hồ Chí Minh"
    },
    {
      title: "Địa chí Lịch sử - Văn hóa TP. Hồ Chí Minh",
      source: "Viện Lịch sử Quân sự Việt Nam / NXB Tổng hợp TP.HCM"
    }
  ];

  const docs = (driveReferenceData?.citationsList && driveReferenceData.citationsList.length > 0) 
    ? driveReferenceData.citationsList 
    : (referencesList && referencesList.length > 0 ? referencesList : defaultDocs);

  const webLink = driveReferenceData?.webLink || '';
  const bookUrls = driveReferenceData?.bookUrls || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#FAF7F2] w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-[#EADBC8] flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="bg-[#7E1819] text-white p-5 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-amber-200">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif-title font-bold text-lg text-amber-100">
                Tài Liệu Tham Khảo: {monumentName}
              </h3>
              <p className="text-xs text-white/80">
                Hồ sơ khoa học, sách chuyên khảo & văn bản pháp lý chính thống
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of references */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {/* Main citations */}
          <div className="space-y-3">
            <div className="text-xs font-black uppercase text-[#7E1819] tracking-wider flex items-center gap-1.5">
              <Bookmark className="w-4 h-4" />
              <span>Danh mục trích dẫn tài liệu & sách tham khảo</span>
            </div>

            {docs.map((doc, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-white border border-[#EADBC8] shadow-2xs space-y-1 hover:border-[#7E1819]/40 transition-colors">
                <h4 className="font-medium text-xs sm:text-sm text-[#2C241E] leading-relaxed">
                  {doc.title}
                </h4>
                {doc.source && (
                  <p className="text-[11px] font-semibold text-[#8C7A6B]">
                    🏛️ Cơ quan / Nguồn: <span className="text-[#7E1819]">{doc.source}</span>
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Web Links / Trang thông tin điện tử */}
          {webLink && (
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
              <div className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                <ExternalLink className="w-4 h-4 text-[#7E1819]" />
                <span>Trang thông tin điện tử / Cổng dữ liệu chính thống:</span>
              </div>
              <a
                href={webLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-[#7E1819] border border-amber-300 text-xs font-bold hover:bg-amber-100 transition-colors"
              >
                <span>Truy cập website tài liệu</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* Book Drive Links */}
          {bookUrls.length > 0 && (
            <div className="p-4 rounded-2xl bg-[#F4EDE2] border border-[#E0D3C1] space-y-2.5">
              <div className="text-xs font-bold text-[#4A3E36] flex items-center gap-1.5">
                <FolderOpen className="w-4 h-4 text-[#7E1819]" />
                <span>Đọc trực tiếp sách và tư liệu số (Google Drive):</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {bookUrls.map((bUrl, bIdx) => (
                  <a
                    key={bIdx}
                    href={bUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#7E1819] text-white text-xs font-bold hover:bg-[#911d1e] shadow-xs transition-colors"
                  >
                    <span>Mở Sách #{bIdx + 1} (PDF / Docs)</span>
                    <ExternalLink className="w-3 h-3 text-amber-200" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-[#EADBC8] text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-[#7E1819] hover:bg-[#911d1e] text-white text-xs font-bold shadow cursor-pointer"
          >
            Đóng cửa sổ
          </button>
        </div>
      </div>
    </div>
  );
}
