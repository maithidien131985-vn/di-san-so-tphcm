import React from 'react';
import { FolderSearch, ArrowRight, ShieldCheck, Binoculars, Map, FileText, Package } from 'lucide-react';

export default function InvestigationSection({
  investigation,
  onOpenDossierDetail,
  onStartQuiz,
  onOpenStudentReport
}) {
  const defaultQuestion = investigation?.investigationQuestion || "Vì sao ngày 30–4–1975 trở thành dấu mốc lịch sử?";
  
  const dossierItems = [
    {
      id: 'map_dossier',
      title: 'Bản đồ',
      desc: 'Quan sát sơ đồ di tích và khu vực xung quanh.',
      image: '/assets/images/so-do-kien-truc.jpg'
    },
    {
      id: 'doc_dossier',
      title: 'Tư liệu',
      desc: 'Đọc tài liệu, báo chí, văn bản gốc liên quan.',
      image: '/assets/images/co-giai-phong-dinh.jpg'
    },
    {
      id: 'artifact_dossier',
      title: 'Hiện vật',
      desc: 'Khám phá hiện vật gốc, phương tiện và dụng cụ thời kỳ đó.',
      image: '/assets/images/may-danh-chu-hien-vat.jpg'
    }
  ];

  return (
    <section className="bg-[#FAF5ED] rounded-3xl p-6 sm:p-8 border border-[#EAE3D9] shadow-xs">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left 4 Cols: Question & Intro */}
        <div className="lg:col-span-4 space-y-2.5">
          <div className="flex items-center gap-2.5 text-[#7E1819]">
            <div className="w-9 h-9 rounded-xl bg-[#7E1819] text-white flex items-center justify-center font-bold shadow-xs">
              <FolderSearch className="w-5 h-5 text-amber-200" />
            </div>
            <span className="font-serif-title font-black text-base sm:text-lg uppercase tracking-wider text-[#7E1819]">
              HỒ SƠ ĐIỀU TRA
            </span>
          </div>

          <h3 className="font-serif-title font-black text-lg sm:text-xl text-[#2C241E] leading-snug">
            {defaultQuestion}
          </h3>

          <p className="text-xs sm:text-sm text-[#666666] leading-relaxed">
            Hãy khám phá chứng cứ, phân tích tư liệu và đưa ra kết luận của riêng em.
          </p>
        </div>

        {/* Center 5 Cols: 3 Dossier Cards */}
        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {dossierItems.map((item, idx) => {
            const correspondingDossier = investigation?.dossiers && investigation.dossiers[idx];
            return (
              <div
                key={item.id}
                onClick={() => onOpenDossierDetail(correspondingDossier || item)}
                className="bg-white rounded-2xl p-3 border border-[#EAE3D9] hover:border-[#7E1819]/50 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer group"
              >
                <div className="space-y-2">
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 border border-gray-100">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div>
                    <h4 className="font-serif-title font-bold text-xs sm:text-sm text-[#2C241E] group-hover:text-[#7E1819] transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-[#777777] leading-tight line-clamp-2 mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-2 mt-1 border-t border-gray-100 text-[11px] font-bold text-[#7E1819] flex items-center gap-0.5 group-hover:underline">
                  <span>Khám phá</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Right 3 Cols: Start Action Button & Badge Note */}
        <div className="lg:col-span-3 flex flex-col justify-center items-center lg:items-end text-center lg:text-right space-y-3 pl-0 lg:pl-2">
          <button
            onClick={onStartQuiz}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#7E1819] hover:bg-[#911d1e] text-white font-bold text-sm shadow-md transition-all hover:scale-103 cursor-pointer flex items-center justify-center gap-2"
          >
            <Binoculars className="w-4 h-4 text-amber-200" />
            <span>Bắt đầu điều tra</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenStudentReport}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white hover:bg-amber-50 text-[#7E1819] border border-amber-300 font-bold text-xs shadow-2xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>✍️ Trả lời phiếu điều tra</span>
          </button>

          <p className="text-[11px] text-[#888888] flex items-center justify-center lg:justify-end gap-1 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Hoàn thành hồ sơ để mở khóa huy hiệu "Nhà sử học trẻ"!</span>
          </p>
        </div>
      </div>
    </section>
  );
}
