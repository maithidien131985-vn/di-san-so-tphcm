import React from 'react';
import { FolderSearch, ArrowRight, FileText, Binoculars, BookOpen } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export default function InvestigationSection({
  investigation,
  onOpenDossierDetail,
  onStartQuiz,
  onOpenStudentReport,
  onOpenDocsModal
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
      desc: 'Đọc tài liệu, báo chí, văn bản gốc liên quan đến sự kiện lịch sử.',
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
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <ScrollReveal>
        <div className="bg-[#FAF5ED] rounded-3xl p-6 sm:p-8 border border-[#EAE3D9] shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left 4.5 Cols: Red Folder Icon & Tailored Investigation Question */}
            <div className="lg:col-span-5 flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#7E1819] text-white flex items-center justify-center font-bold shrink-0 shadow-sm mt-1">
                <FolderSearch className="w-6 h-6 text-amber-200" />
              </div>
              <div className="space-y-2">
                <span className="font-serif-title font-black text-sm sm:text-base uppercase tracking-wider text-[#7E1819] block">
                  HỒ SƠ ĐIỀU TRA
                </span>
                <h3 className="font-serif-title font-black text-lg sm:text-xl text-[#2C241E] leading-snug">
                  {defaultQuestion}
                </h3>
                <p className="text-xs text-[#777777] leading-relaxed">
                  Hãy khám phá chứng cứ, phân tích tư liệu và đưa ra kết luận của riêng em.
                </p>
                <div className="pt-2 flex flex-wrap gap-2">
                  <button
                    onClick={onStartQuiz}
                    className="px-4 py-2 rounded-xl bg-[#7E1819] hover:bg-[#911d1e] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Binoculars className="w-3.5 h-3.5 text-amber-200" />
                    <span>Bắt đầu điều tra</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={onOpenDocsModal}
                    className="px-3.5 py-2 rounded-xl bg-white hover:bg-amber-50 text-[#7E1819] border border-amber-300 text-xs font-bold shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#7E1819]" />
                    <span>Tài liệu tham khảo</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right 7 Cols: 3 Dossier Cards */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {dossierItems.map((item, idx) => {
                const correspondingDossier = investigation?.dossiers && investigation.dossiers[idx];
                return (
                  <div
                    key={item.id}
                    onClick={() => onOpenDossierDetail(correspondingDossier || item)}
                    className="bg-white rounded-2xl p-3.5 border border-[#EAE3D9] hover:border-[#7E1819]/50 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer group"
                  >
                    <div className="space-y-2.5">
                      <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 border border-gray-100">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div>
                        <h4 className="font-serif-title font-black text-sm text-[#2C241E] group-hover:text-[#7E1819] transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-[#777777] leading-relaxed line-clamp-3 mt-1">
                          {item.desc}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2.5 mt-2 border-t border-gray-100 text-xs font-bold text-[#7E1819] flex items-center gap-1 group-hover:underline">
                      <span>Khám phá</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
