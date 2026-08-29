import React from 'react';
import { X, FileText, ExternalLink, BookOpen, Download, Bookmark } from 'lucide-react';

export default function DocsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const docs = [
    {
      title: "Hồ sơ Di tích Quốc gia Đặc biệt Dinh Độc Lập",
      author: "Bộ Văn hóa, Thể thao và Du lịch (Quyết định số 1272/QĐ-TTg ngày 12/8/2009)",
      desc: "Văn bản chính thức công nhận và quy định ranh giới bảo tồn di tích cấp quốc gia đặc biệt."
    },
    {
      title: "Đồ án Kiến trúc Dinh Độc Lập - KTS Ngô Viết Thụ",
      author: "Hồ sơ Lưu trữ Quốc gia II",
      desc: "Bản vẽ quy hoạch mặt bằng, phối cảnh và ý niệm triết lý phong thủy kiến trúc phương Đông (Cát, Khẩu, Trung, Tam, Chủ)."
    },
    {
      title: "Tài liệu Thuyết minh Di tích Lịch sử Dinh Độc Lập (Google Docs)",
      author: "Ban Quản lý Di tích Dinh Độc Lập / Sở Văn hóa & Thể thao TP.HCM",
      desc: "Nội dung chuẩn 10 phần phục vụ công tác thuyết minh và giáo dục lịch sử truyền thống."
    },
    {
      title: "Tổng kết Chiến dịch Hồ Chí Minh lịch sử (Tháng 4/1975)",
      author: "Bộ Quốc phòng - Viện Lịch sử Quân sự Việt Nam",
      desc: "Tư liệu tổng kết bước tiến quân của các cánh quân giải phóng tiến vào giải phóng Sài Gòn."
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#FAF7F2] w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-[#EADBC8] flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-[#7B1113] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-amber-200">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif-title font-bold text-lg text-amber-100">
                Tài Liệu Tham Khảo & Tư Liệu Nguồn
              </h3>
              <p className="text-xs text-white/80">
                Danh mục văn bản, hồ sơ nghiên cứu và sách lịch sử
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
            <div key={idx} className="p-4 rounded-2xl bg-white border border-[#EADBC8] shadow-xs space-y-1.5 hover:border-[#7B1113]/40 transition-colors">
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-serif-title font-bold text-sm sm:text-base text-[#7B1113]">
                  {doc.title}
                </h4>
                <Bookmark className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              </div>
              <p className="text-[11px] font-semibold text-[#8C7A6B]">
                Nguồn: {doc.author}
              </p>
              <p className="text-xs text-[#555] leading-relaxed">
                {doc.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="p-4 bg-white border-t border-[#EADBC8] text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-[#7B1113] hover:bg-[#96171a] text-white text-xs font-bold shadow cursor-pointer"
          >
            Đóng cửa sổ
          </button>
        </div>
      </div>
    </div>
  );
}
