import React from 'react';
import { FolderSearch, ArrowRight, BookOpen, Award, ExternalLink, Bookmark, Sparkles, ShieldCheck, Compass } from 'lucide-react';
import confetti from 'canvas-confetti';
import ScrollReveal from './ScrollReveal';

export default function InvestigationSection({
  investigation,
  monumentImage,
  onStartQuiz,
  onOpenStudentReport,
  onOpenDocsModal
}) {
  const defaultQuestion = investigation?.investigationQuestion || "Vì sao di tích này trở thành dấu mốc lịch sử tiêu biểu của dân tộc?";
  
  const driveRef = investigation?.driveReferenceData || {};
  const firstCitation = driveRef.citationsList?.[0]?.title || driveRef.citations?.split('\n')[0] || "Hồ sơ khoa học và văn bản di tích - Sở Văn hóa và Thể thao TP.HCM";
  const secondCitation = driveRef.citationsList?.[1]?.title || driveRef.citations?.split('\n')[1] || null;

  const thumbnailImage = monumentImage || "/assets/images/dinh-doc-lap-front.jpg";

  const handleStartReport = () => {
    confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
    if (onOpenStudentReport) onOpenStudentReport();
  };

  const handleStartBadgeQuiz = () => {
    confetti({ particleCount: 50, spread: 70, origin: { y: 0.7 } });
    if (onStartQuiz) onStartQuiz();
  };

  return (
    <section className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 py-6">
      <ScrollReveal>
        <div className="bg-gradient-to-br from-[#FFFDF9] via-[#FAF5ED] to-[#F5ECE0] rounded-3xl p-6 sm:p-9 border-2 border-amber-300/80 shadow-lg relative overflow-hidden">
          {/* Subtle Background Badge Watermark */}
          <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 opacity-5 pointer-events-none">
            <Award className="w-96 h-96 text-[#7E1819]" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative z-10">
            {/* Left 7 Cols: Red Folder Icon, Tailored Investigation Question & 2 Action Buttons */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7E1819] to-[#9E1B1D] text-white flex items-center justify-center font-bold shrink-0 shadow-md border-2 border-amber-300">
                    <FolderSearch className="w-7 h-7 text-amber-200" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-serif-title font-black text-sm sm:text-base uppercase tracking-widest text-[#7E1819] block">
                        HỒ SƠ ĐIỀU TRA DI SẢN
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-950 font-black text-[10px] uppercase">
                        Nhiệm Vụ Thám Hiểm
                      </span>
                    </div>
                    <p className="text-xs text-[#666666]">
                      Đóng vai nhà thám hiểm trẻ tuổi để phân tích tư liệu và giải mã lịch sử
                    </p>
                  </div>
                </div>

                {/* Main Challenge Box */}
                <div className="p-5 rounded-2xl bg-white/90 border border-amber-200/80 shadow-sm space-y-2">
                  <div className="flex items-center gap-2 text-amber-900 text-xs font-bold">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>CÂU HỎI TRỌNG TÂM CẦN ĐIỀU TRA:</span>
                  </div>
                  <h3 className="font-serif-title font-black text-lg sm:text-xl text-[#2C241E] leading-snug">
                    {defaultQuestion}
                  </h3>
                  <p className="text-xs text-[#666666] leading-relaxed pt-1">
                    Hãy vận dụng tất cả các chứng cứ đã quan sát từ Bản đồ GPS, Thước phim tư liệu, Audio thuyết minh và Trục thời gian để hoàn thành phiếu điều tra.
                  </p>
                </div>
              </div>

              {/* 2 Impressive Gamified Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                {/* Nút 1: Bắt đầu điều tra -> Hiệu ứng Đỏ Đô Ánh Kim */}
                <button
                  onClick={handleStartReport}
                  className="group relative px-6 py-4 rounded-2xl bg-gradient-to-r from-[#7E1819] via-[#9E1B1D] to-[#7E1819] text-white text-sm sm:text-base font-black shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-3 cursor-pointer border-2 border-amber-400 overflow-hidden"
                  title="Trả lời câu hỏi điều tra cốt lõi và ghi chép phiếu học tập"
                >
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Compass className="w-5 h-5 text-amber-300 group-hover:rotate-45 transition-transform duration-500" />
                  <span>🔭 BẮT ĐẦU ĐIỀU TRA</span>
                  <ArrowRight className="w-5 h-5 text-amber-200 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Nút 2: Nhận huy hiệu -> Hiệu ứng Vàng Hoàng Gia 3D */}
                <button
                  onClick={handleStartBadgeQuiz}
                  className="group relative px-6 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-amber-950 text-sm sm:text-base font-black shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-3 cursor-pointer border-2 border-yellow-200 overflow-hidden"
                  title="Thử thách trả lời câu hỏi trắc nghiệm, ghép đôi, flashcard để nhận huy hiệu"
                >
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Award className="w-5 h-5 text-amber-950 group-hover:scale-125 transition-transform duration-300 animate-bounce" />
                  <span>🏆 NHẬN HUY HIỆU DI SẢN</span>
                  <Sparkles className="w-4 h-4 text-amber-900" />
                </button>
              </div>
            </div>

            {/* Right 5 Cols: Ô "Tư liệu" (Tài liệu tham khảo từ Google Drive) */}
            <div className="lg:col-span-5 flex">
              <div
                onClick={onOpenDocsModal}
                className="w-full bg-white rounded-2xl p-5 border border-amber-200 hover:border-[#7E1819] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer group"
              >
                <div className="space-y-3.5">
                  <div className="h-44 sm:h-48 rounded-xl overflow-hidden bg-gray-100 border border-gray-100 relative shadow-inner">
                    <img
                      src={thumbnailImage}
                      alt="Tư liệu tham khảo"
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent flex items-end p-3.5">
                      <span className="text-xs font-black uppercase tracking-wider text-amber-200 bg-[#7E1819]/90 px-3 py-1 rounded-lg backdrop-blur-xs border border-amber-400/30">
                        📚 Kho Hồ Sơ Tham Khảo
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-serif-title font-black text-base sm:text-lg text-[#2C241E] group-hover:text-[#7E1819] transition-colors flex items-center justify-between">
                      <span>Tài Liệu & Căn Cứ Lịch Sử</span>
                      <Bookmark className="w-4 h-4 text-[#7E1819]" />
                    </h4>
                    <p className="text-xs text-[#555] leading-relaxed line-clamp-2 mt-1">
                      {firstCitation}
                    </p>
                    {secondCitation && (
                      <p className="text-xs text-[#777] leading-relaxed line-clamp-1 mt-1">
                        • {secondCitation}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#F0EAE1] flex items-center justify-between text-xs text-[#7E1819] font-bold">
                  <span className="group-hover:underline">Tra cứu toàn bộ hồ sơ khoa học & văn bản pháp lý &rarr;</span>
                  <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
