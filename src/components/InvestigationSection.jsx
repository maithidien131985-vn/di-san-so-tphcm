import React from 'react';
import { FolderOpen, ArrowRight, ShieldCheck, Sparkles, PenSquare, Eye } from 'lucide-react';

export default function InvestigationSection({
  investigation,
  onOpenDossierDetail,
  onStartQuiz,
  onOpenStudentReport
}) {
  return (
    <section className="bg-[#FBF8F3] rounded-3xl p-6 sm:p-10 border border-[#EADBC8] shadow-xs">
      {/* Title Header */}
      <div className="flex items-start gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-[#7B1113] text-white flex items-center justify-center shrink-0 shadow-md">
          <FolderOpen className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#7B1113]">HỒ SƠ ĐIỀU TRA</span>
            <span className="px-2 py-0.5 rounded-full bg-red-100 text-[#7B1113] text-[10px] font-bold">Khám phá tương tác</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#2C241E] font-serif-title mt-1">
            {investigation.title}
          </h2>
          <p className="text-sm sm:text-base text-[#6B5E55] mt-1 font-medium">
            {investigation.subtitle}
          </p>
        </div>
      </div>

      {/* Content Layout: 3 Dossier Cards + Action Card on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* 3 Sub-Cards: Sự kiện tiêu biểu - Nhân vật liên quan - Hiện vật tiêu biểu */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {investigation.dossiers.map((dossier, idx) => (
            <div
              key={dossier.id || idx}
              onClick={() => onOpenDossierDetail(dossier)}
              className="group bg-white rounded-2xl p-4 border border-[#EADBC8] hover:border-[#7B1113]/40 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer"
            >
              <div>
                {/* Thumbnail with accurate photo */}
                <div className="rounded-xl overflow-hidden aspect-[4/3] bg-gray-100 mb-3 border border-gray-100 relative">
                  <img
                    src={dossier.image}
                    alt={dossier.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold">
                    {dossier.title}
                  </div>
                </div>

                <h3 className="font-black text-base text-[#2C241E] font-serif-title group-hover:text-[#7B1113] transition-colors">
                  {dossier.title}
                </h3>
                <p className="text-xs text-[#6B5E55] mt-1 line-clamp-3 leading-relaxed">
                  {dossier.subtitle}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#7B1113] group-hover:translate-x-0.5 transition-transform">
                <span>Khảo sát chứng cứ</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>

        {/* Right CTA Action Block */}
        <div className="lg:col-span-4 bg-gradient-to-br from-[#7B1113] to-[#540B0C] rounded-2xl p-6 text-white flex flex-col justify-between shadow-lg relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-amber-200 text-xs font-bold border border-white/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Góc học tập & Nghiên cứu</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black font-serif-title text-white leading-snug">
              Trở thành Nhà sử học trẻ
            </h3>
            <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed">
              Khảo sát các chứng cứ lịch sử, trả lời phiếu câu hỏi điều tra và vượt qua thử thách để mở khóa huy hiệu danh dự!
            </p>
          </div>

          <div className="relative z-10 mt-6 space-y-2.5">
            {/* Nút Trả lời câu hỏi của học sinh */}
            <button
              onClick={onOpenStudentReport}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white text-[#7B1113] hover:bg-amber-50 font-black text-xs sm:text-sm transition-all shadow-md cursor-pointer hover:scale-102"
            >
              <PenSquare className="w-4 h-4 text-[#7B1113]" />
              <span>✍️ Trả lời câu hỏi điều tra</span>
            </button>

            {/* Nút Làm bài thử thách trắc nghiệm nhận huy hiệu */}
            <button
              onClick={onStartQuiz}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#540B0C] font-black text-xs sm:text-sm transition-all shadow-md cursor-pointer hover:scale-102"
            >
              <span>🔭 Thử thách nhận Huy hiệu (8 câu)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-[11px] text-amber-200/90 justify-center pt-1">
              <ShieldCheck className="w-4 h-4 text-amber-300" />
              <span>Mở khóa huy hiệu "Nhà sử học trẻ"!</span>
            </div>
          </div>

          {/* Background decoration */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
        </div>
      </div>
    </section>
  );
}
