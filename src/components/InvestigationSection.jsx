import React from 'react';
import { FolderSearch, ArrowRight, BookOpen, Award, ExternalLink, Bookmark } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export default function InvestigationSection({
  investigation,
  monumentImage,
  onStartQuiz,
  onOpenStudentReport,
  onOpenDocsModal
}) {
  const defaultQuestion = investigation?.investigationQuestion || "Vì sao ngày 30–4–1975 trở thành dấu mốc lịch sử?";
  
  const driveRef = investigation?.driveReferenceData || {};
  const firstCitation = driveRef.citationsList?.[0]?.title || driveRef.citations?.split('\n')[0] || "Hồ sơ khoa học và văn bản di tích - Sở Văn hóa và Thể thao TP.HCM";
  const secondCitation = driveRef.citationsList?.[1]?.title || driveRef.citations?.split('\n')[1] || null;

  const thumbnailImage = monumentImage || "/assets/images/dinh-doc-lap-front.jpg";

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <ScrollReveal>
        <div className="bg-[#FAF5ED] rounded-3xl p-6 sm:p-8 border border-[#EAE3D9] shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left 7 Cols: Red Folder Icon, Tailored Investigation Question & 2 Action Buttons */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
              <div className="flex items-start gap-4">
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
                </div>
              </div>

              {/* 2 Buttons at bottom of Left Column */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                {/* Nút 1: Bắt đầu điều tra -> Mở phiếu trả lời câu hỏi điều tra */}
                <button
                  onClick={onOpenStudentReport}
                  className="px-5 py-2.5 rounded-xl bg-[#7E1819] hover:bg-[#911d1e] text-white text-xs sm:text-sm font-bold shadow-md transition-all hover:scale-102 flex items-center gap-2 cursor-pointer"
                  title="Trả lời câu hỏi điều tra cốt lõi và ghi chép phiếu học tập"
                >
                  <span>🔭 Bắt đầu điều tra</span>
                  <ArrowRight className="w-4 h-4 text-amber-200" />
                </button>

                {/* Nút 2: Chinh phục huy hiệu -> Mở modal trắc nghiệm, flashcard, ghép đôi */}
                <button
                  onClick={onStartQuiz}
                  className="px-4 py-2.5 rounded-xl bg-white hover:bg-amber-50 text-[#BA8438] hover:text-[#a06f2b] border-2 border-[#BA8438] text-xs sm:text-sm font-bold shadow-2xs transition-all hover:scale-102 flex items-center gap-2 cursor-pointer"
                  title="Thử thách trả lời câu hỏi trắc nghiệm, ghép đôi, flashcard để nhận huy hiệu"
                >
                  <Award className="w-4 h-4 text-[#BA8438]" />
                  <span>🏆 Chinh phục huy hiệu</span>
                </button>
              </div>
            </div>

            {/* Right 5 Cols: CHỈ 1 Ô "Tư liệu" (Tài liệu tham khảo từ Google Drive) */}
            <div className="lg:col-span-5 flex">
              <div
                onClick={onOpenDocsModal}
                className="w-full bg-white rounded-2xl p-4 sm:p-5 border border-[#EAE3D9] hover:border-[#7E1819]/50 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer group"
              >
                <div className="space-y-3">
                  <div className="h-36 sm:h-40 rounded-xl overflow-hidden bg-gray-100 border border-gray-100 relative">
                    <img
                      src={thumbnailImage}
                      alt="Tư liệu tham khảo"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3">
                      <span className="text-[11px] font-black uppercase tracking-wider text-amber-200 bg-[#7E1819]/80 px-2.5 py-1 rounded-lg backdrop-blur-xs">
                        📚 Tài liệu tham khảo
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-serif-title font-black text-base text-[#2C241E] group-hover:text-[#7E1819] transition-colors flex items-center gap-1.5">
                      <span>Tư liệu</span>
                      <Bookmark className="w-3.5 h-3.5 text-[#7E1819]" />
                    </h4>
                    <p className="text-[11px] text-[#666] leading-relaxed line-clamp-2 mt-1">
                      {firstCitation}
                    </p>
                    {secondCitation && (
                      <p className="text-[11px] text-[#888] leading-relaxed line-clamp-1 mt-0.5">
                        • {secondCitation}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-gray-100 text-xs font-bold text-[#7E1819] flex items-center justify-between group-hover:underline">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Khám phá &amp; Đọc tài liệu</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
