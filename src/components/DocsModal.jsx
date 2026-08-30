import React from 'react';
import { X, FileText, Bookmark, BookOpen } from 'lucide-react';

export default function DocsModal({ 
  isOpen, 
  onClose,
  referencesList,
  monumentName = 'Di tích Lịch sử'
}) {
  if (!isOpen) return null;

  const defaultDocs = [
    {
      title: `Hồ sơ khoa học Di tích ${monumentName}`,
      source: "Sở Văn hóa và Thể thao TP. Hồ Chí Minh",
      desc: "Văn bản, bản vẽ và hồ sơ lý lịch chính thức công nhận và quy định ranh giới bảo tồn di tích."
    },
    {
      title: "Địa chí Lịch sử - Văn hóa TP. Hồ Chí Minh",
      source: "Viện Lịch sử Quân sự Việt Nam / NXB Tổng hợp TP.HCM",
      desc: "Công trình nghiên cứu tổng kết toàn diện về vùng đất, con người, các mốc son đấu tranh và di sản văn hóa."
    },
    {
      title: "Tài liệu Thuyết minh & Giáo dục Di sản (doc1, doc2, doc3)",
      source: "Hệ thống Cơ sở dữ liệu Di sản số TP.HCM",
      desc: "Nội dung chuẩn hóa phục vụ công tác thuyết minh, học tập liên môn và giáo dục truyền thống."
    }
  ];

  const docs = referencesList && referencesList.length > 0 ? referencesList : defaultDocs;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#FAF7F2] w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-[#EADBC8] flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-[#7E1819] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-amber-200">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif-title font-bold text-lg text-amber-100">
                Tài Liệu Tham Khảo: {monumentName}
              </h3>
              <p className="text-xs text-white/80">
                Danh mục hồ sơ khoa học, văn bản pháp lý và tư liệu nghiên cứu
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

        {/* List */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3">
          {docs.map((doc, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-white border border-[#EADBC8] shadow-xs space-y-1.5 hover:border-[#7E1819]/40 transition-colors">
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-serif-title font-bold text-sm sm:text-base text-[#7E1819]">
                  {doc.title}
                </h4>
                <Bookmark className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              </div>
              <p className="text-[11px] font-semibold text-[#8C7A6B]">
                Nguồn: {doc.source || doc.author || "Sở Văn hóa và Thể thao TP.HCM"}
              </p>
              {doc.desc && (
                <p className="text-xs text-[#555] leading-relaxed">
                  {doc.desc}
                </p>
              )}
            </div>
          ))}
        </div>

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
