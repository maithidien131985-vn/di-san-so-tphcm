import React, { useState, useEffect } from 'react';
import { 
  Landmark, 
  Calendar, 
  Image as ImageIcon, 
  ChevronRight, 
  Play, 
  Film, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  BookOpen, 
  Search,
  Eye,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function HistorySection({
  overview,
  timeline = [],
  gallery = [],
  isEditMode,
  onUpdateOverview,
  onOpenLightbox,
  onOpenMilestoneDetail,
  onOpenVideo
}) {
  // ==========================================
  // TIMELINE CHALLENGE STATE
  // ==========================================
  const firstMilestone = timeline && timeline.length > 0 ? timeline[0] : null;
  const milestoneYear = firstMilestone?.year || '1975';
  const milestoneTitle = firstMilestone?.title || 'Dấu mốc lịch sử tiêu biểu';
  const milestoneDesc = firstMilestone?.description || 'Sự kiện quan trọng gắn liền với di tích.';

  const [selectedTimelineOpt, setSelectedTimelineOpt] = useState(null);
  const [timelineAnswered, setTimelineAnswered] = useState(false);
  const [timelineCorrect, setTimelineCorrect] = useState(false);
  const [shuffledTimelineOpts, setShuffledTimelineOpts] = useState([]);

  useEffect(() => {
    setSelectedTimelineOpt(null);
    setTimelineAnswered(false);
    setTimelineCorrect(false);

    // Build timeline options from actual milestones or plausible distractors
    const correctOpt = `${milestoneYear}: ${milestoneTitle}`;
    const distractors = [
      `Năm 1858: Tiếng súng Đà Nẵng mở đầu cuộc kháng chiến chống Pháp`,
      `Năm 1930: Thành lập Đảng Cộng sản Việt Nam`,
      `Năm 1945: Thắng lợi Cách mạng Tháng Tám và lập nước VNDCCH`
    ].filter(d => !d.includes(milestoneYear));

    const opts = [
      correctOpt,
      distractors[0] || 'Năm 1945: Kháng chiến Nam Bộ',
      distractors[1] || 'Năm 1975: Đại thắng mùa Xuân',
      distractors[2] || 'Năm 1911: Bác Hồ ra đi tìm đường cứu nước'
    ];

    setShuffledTimelineOpts(opts.sort(() => Math.random() - 0.5));
  }, [milestoneYear, milestoneTitle]);

  const handleSelectTimelineOpt = (opt) => {
    if (timelineAnswered) return;
    setSelectedTimelineOpt(opt);
  };

  const handleCheckTimeline = () => {
    if (!selectedTimelineOpt) return;
    const isRight = selectedTimelineOpt.includes(milestoneYear) && selectedTimelineOpt.includes(milestoneTitle);
    setTimelineCorrect(isRight);
    setTimelineAnswered(true);

    if (isRight) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  };

  const handleResetTimeline = () => {
    setSelectedTimelineOpt(null);
    setTimelineAnswered(false);
    setTimelineCorrect(false);
  };

  return (
    <div id="history-section" className="space-y-6">
      {/* 1. GIÁ TRỊ LỊCH SỬ CARD */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-[#EAE3D9] shadow-sm space-y-4">
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#F0EAE1]">
          <div className="flex items-center gap-3 text-[#7E1819]">
            <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-[#7E1819] shadow-2xs">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black font-serif-title tracking-wide text-[#7E1819]">
                Giá Trị Lịch Sử & Ý Nghĩa Di Sản
              </h2>
              <p className="text-xs text-[#666666]">
                Biên niên sử vàng son và dấu ấn không thể phai mờ
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-flex text-[11px] font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
            Tư liệu lịch sử xác thực
          </span>
        </div>

        {isEditMode ? (
          <textarea
            rows={5}
            value={overview}
            onChange={(e) => onUpdateOverview(e.target.value)}
            className="w-full p-4 rounded-xl border-2 border-amber-400 bg-amber-50/30 text-[#2C241E] text-sm sm:text-base leading-relaxed outline-none focus:ring-2 focus:ring-amber-500 font-serif-title"
          />
        ) : (
          <div className="p-4 sm:p-5 rounded-xl bg-[#FAF7F2]/60 border border-[#EFE8DE]">
            <p className="text-[#2C241E] text-sm sm:text-base leading-loose text-justify font-serif-title first-letter:text-3xl first-letter:font-black first-letter:text-[#7E1819] first-letter:float-left first-letter:mr-2">
              {overview}
            </p>
          </div>
        )}
      </section>

      {/* 2. DẤU MỐC LỊCH SỬ & THỬ THÁCH DÒNG THỜI GIAN (2 COLUMNS) */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-[#EAE3D9] shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#F0EAE1]">
          <div className="flex items-center gap-2.5 text-[#7E1819]">
            <Clock className="w-5 h-5 text-[#7E1819]" />
            <h3 className="text-lg sm:text-xl font-bold font-serif-title text-[#2C241E]">
              Dấu Mốc Lịch Sử & Giải Mã Dòng Thời Gian
            </h3>
          </div>
          <span className="text-xs text-[#777777] italic">
            Chạm vào từng dấu mốc để xem chi tiết
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* CỘT TRÁI (7 cols): TRỤC THỜI GIAN DẤU MỐC */}
          <div className="lg:col-span-7 space-y-4">
            <h4 className="text-sm font-bold text-[#7E1819] uppercase tracking-wider flex items-center gap-1.5">
              <span>📅 Trục thời gian các mốc son</span>
            </h4>

            <div className="relative pl-6 sm:pl-8 space-y-4 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-[#7E1819] before:via-amber-500 before:to-[#7E1819]">
              {timeline.slice(0, 4).map((item, idx) => (
                <div 
                  key={item.id || idx}
                  onClick={() => onOpenMilestoneDetail && onOpenMilestoneDetail(item)}
                  className="relative p-3.5 sm:p-4 rounded-xl bg-[#FAF7F2] hover:bg-amber-50/80 border border-[#EAE3D9] hover:border-amber-400 transition-all cursor-pointer group shadow-2xs hover:scale-101"
                >
                  {/* Node Dot */}
                  <div className="absolute -left-[27px] sm:-left-[35px] top-4 w-4 h-4 rounded-full bg-[#7E1819] border-2 border-white shadow-xs group-hover:scale-130 transition-transform" />

                  <div className="flex items-center justify-between gap-2">
                    <span className="font-serif-title font-black text-sm sm:text-base text-[#7E1819]">
                      Năm {item.year}
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#7E1819] group-hover:translate-x-1 transition-transform" />
                  </div>
                  <h5 className="text-xs sm:text-sm font-bold text-[#2C241E] mt-1 group-hover:text-[#7E1819] transition-colors">
                    {item.title}
                  </h5>
                  <p className="text-xs text-[#666666] mt-1 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CỘT PHẢI (5 cols): HỘP THỬ THÁCH "GIẢI MÃ DÒNG THỜI GIAN" */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#FFFDF9] to-[#FAF4EB] rounded-2xl p-5 border-2 border-amber-200 shadow-sm space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-amber-200/60">
              <div className="flex items-center gap-2 text-amber-950 font-black">
                <Sparkles className="w-5 h-5 text-amber-600" />
                <h4 className="font-serif-title text-base sm:text-lg text-[#7E1819]">
                  Thử Thách: Dòng Thời Gian
                </h4>
              </div>
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-100 text-[#7E1819] border border-amber-300">
                +10 Điểm
              </span>
            </div>

            <p className="font-serif-title font-bold text-xs sm:text-sm text-[#2C241E] leading-relaxed">
              ⏳ Theo bạn, dấu mốc lịch sử nào dưới đây gắn liền mật thiết với quá trình hình thành & phát triển của di tích?
            </p>

            <div className="space-y-2">
              {shuffledTimelineOpts.map((opt, idx) => {
                const isSelected = selectedTimelineOpt === opt;
                let optStyle = "bg-white hover:bg-amber-50 border-gray-200 text-[#333333]";

                if (timelineAnswered) {
                  if (opt.includes(milestoneYear) && opt.includes(milestoneTitle)) {
                    optStyle = "bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-400";
                  } else if (isSelected && !timelineCorrect) {
                    optStyle = "bg-rose-50 border-rose-500 text-rose-950 line-through ring-1 ring-rose-400";
                  } else {
                    optStyle = "bg-gray-50 border-gray-200 text-gray-400 opacity-60";
                  }
                } else if (isSelected) {
                  optStyle = "bg-amber-100 border-[#7E1819] text-[#7E1819] font-bold ring-2 ring-amber-400 shadow-xs";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectTimelineOpt(opt)}
                    disabled={timelineAnswered}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-start justify-between gap-2 text-xs cursor-pointer ${optStyle}`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-amber-100 text-[#7E1819] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="leading-snug">{opt}</span>
                    </div>
                    {timelineAnswered && opt.includes(milestoneYear) && opt.includes(milestoneTitle) && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    )}
                    {timelineAnswered && isSelected && !timelineCorrect && (
                      <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {timelineAnswered && (
              <div className={`p-3 rounded-xl border animate-fadeIn text-xs leading-relaxed space-y-1 ${timelineCorrect ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-amber-50 border-amber-300 text-amber-950'}`}>
                <div className="font-bold flex items-center gap-1.5">
                  {timelineCorrect ? <Award className="w-4 h-4 text-emerald-600" /> : <Clock className="w-4 h-4 text-amber-700" />}
                  <span>{timelineCorrect ? "Chính xác! Bạn có trí nhớ sử học rất tốt." : "Dấu mốc chính xác là:"}</span>
                </div>
                <p><strong>Năm {milestoneYear}:</strong> {milestoneDesc}</p>
              </div>
            )}

            <div className="pt-1">
              {!timelineAnswered ? (
                <button
                  onClick={handleCheckTimeline}
                  disabled={!selectedTimelineOpt}
                  className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer ${selectedTimelineOpt ? 'bg-[#7E1819] hover:bg-[#911d1e] text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Kiểm Tra Dấu Mốc</span>
                </button>
              ) : (
                <button
                  onClick={handleResetTimeline}
                  className="w-full py-2.5 px-4 rounded-xl bg-amber-100 hover:bg-amber-200 text-[#7E1819] font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-amber-300"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Thử Lại Dấu Mốc Khác</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. KHO BÁU ẢNH TƯ LIỆU: "MỖI HÌNH ẢNH LÀ MỘT CÂU CHUYỆN, HÃY KHÁM PHÁ" */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-[#EAE3D9] shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F0EAE1]">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 text-[#7E1819]">
              <ImageIcon className="w-5 h-5 text-[#7E1819]" />
              <h3 className="text-lg sm:text-xl font-black font-serif-title text-[#2C241E]">
                Kho Báu Ảnh Tư Liệu: Mỗi Hình Ảnh Là Một Câu Chuyện
              </h3>
            </div>
            <p className="text-xs text-[#666666]">
              📖 Chạm vào bất kỳ bức ảnh nào để lật mở câu chuyện lịch sử chân thực và chi tiết bí ẩn chưa kể.
            </p>
          </div>

          <span className="text-xs font-bold text-[#7E1819] px-3 py-1 rounded-full bg-red-50 border border-red-200 shrink-0">
            {gallery.length} tư liệu ảnh thực địa
          </span>
        </div>

        {/* Photo Story Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {gallery.map((img, idx) => (
            <div
              key={img.id || idx}
              onClick={() => onOpenLightbox && onOpenLightbox(idx)}
              className="group relative rounded-2xl overflow-hidden bg-gray-100 border border-[#EAE3D9] hover:border-amber-400 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col"
            >
              {/* Image Thumbnail */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/5">
                <img
                  src={img.src}
                  alt={img.title || `Tư liệu ${idx + 1}`}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                {/* Badge: Story Card */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-amber-300 border border-amber-300/40 text-[10px] font-bold shadow-xs">
                  <BookOpen className="w-3 h-3" />
                  <span>Câu chuyện #{idx + 1}</span>
                </div>

                {/* Hover Eye Icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-10 h-10 rounded-full bg-white/90 text-[#7E1819] flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform">
                    <Eye className="w-5 h-5" />
                  </div>
                </div>

                {/* Bottom title inside image for mobile */}
                <div className="absolute bottom-2 left-2 right-2 text-white text-[11px] font-bold line-clamp-1 group-hover:text-amber-200 transition-colors">
                  {img.title}
                </div>
              </div>

              {/* Bottom Caption Card */}
              <div className="p-3 bg-white flex-1 flex flex-col justify-between space-y-1 border-t border-[#F0EAE1]">
                <h4 className="text-xs font-bold text-[#2C241E] line-clamp-2 group-hover:text-[#7E1819] transition-colors">
                  {img.title}
                </h4>
                <div className="flex items-center justify-between pt-1 text-[10px] text-gray-500">
                  <span className="text-[#7E1819] font-bold flex items-center gap-0.5">
                    <span>Khám phá ngay</span>
                    <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                  <span>{img.year || 'Tư liệu'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
