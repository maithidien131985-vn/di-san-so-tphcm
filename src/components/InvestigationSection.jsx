import React, { useState, useEffect } from 'react';
import { 
  FolderSearch, 
  ArrowRight, 
  BookOpen, 
  ExternalLink, 
  Bookmark, 
  Sparkles, 
  Compass, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Flame, 
  Award,
  Key,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import ScrollReveal from './ScrollReveal';
import { checkInMonument } from '../utils/passportStorage';
import soundEffects from '../utils/soundEffects';
import WordByWordTitle from './WordByWordTitle';

// Web Audio Sound Synthesizer for MiniGame
class GameAudioEngine {
  constructor() {
    this.ctx = null;
    this.soundEnabled = true;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playCorrect() {
    if (!this.soundEnabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.50];
      const now = this.ctx.currentTime;
      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.07);
        gain.gain.setValueAtTime(0.001, now + i * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.2, now + i * 0.07 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.07);
        osc.stop(now + i * 0.07 + 0.38);
      });
    } catch (e) {}
  }

  playWrong() {
    if (!this.soundEnabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(140, now + 0.22);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    } catch (e) {}
  }

  playStreak() {
    if (!this.soundEnabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(1320, now + 0.25);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.22, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.32);
    } catch (e) {}
  }

  playTap() {
    if (!this.soundEnabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.06);
    } catch (e) {}
  }
}

const gameAudio = new GameAudioEngine();

export default function InvestigationSection({
  investigation = {},
  monumentName = 'Di tích lịch sử',
  monumentStt = 1,
  monumentImage,
  activePassport = null,
  onPassportUpdate,
  onOpenStudentReport,
  onOpenDocsModal
}) {
  // ==========================================
  // CỘT 1: MINI-GAME TRUY TÌM MANH MỐI
  // ==========================================
  const defaultQuestions = [
    {
      id: 1,
      category: '🔍 Manh mối Sự kiện',
      question: `Sự kiện lịch sử nổi bật nhất gắn liền với di tích "${monumentName}" là gì?`,
      options: [
        `Gắn liền với các mốc son đấu tranh hào hùng và dấu ấn lịch sử của dân tộc`,
        'Một cuộc triển lãm thương mại quốc tế tạm thời vào thế kỷ 21',
        'Công trình xây dựng phục vụ du lịch sinh thái thuần túy',
        'Địa điểm tổ chức hội chợ nông sản thường niên'
      ],
      correctIndex: 0,
      explanation: `Di tích ${monumentName} là nơi ghi dấu những bước chân lịch sử hào hùng, lưu giữ bí mật tự hào của các thế hệ cha anh.`
    },
    {
      id: 2,
      category: '🏺 Manh mối Hiện vật',
      question: `Báu vật hiện vật hoặc nhân vật lịch sử gắn liền với "${monumentName}" truyền tải thông điệp gì?`,
      options: [
        'Tinh thần kiên cường bất khuất, sự cống hiến và di sản văn hóa quý báu cho thế hệ mai sau',
        'Những câu chuyện truyền thuyết không có thật',
        'Các trào lưu giải trí ngắn hạn',
        'Không có giá trị lịch sử cụ thể nào'
      ],
      correctIndex: 0,
      explanation: `Mỗi hiện vật và nhân chứng tại ${monumentName} đều là mảnh ghép lịch sử sống động đang chờ em khám phá.`
    },
    {
      id: 3,
      category: '🧭 Nhật ký Thám hiểm',
      question: 'Sau hành trình khám phá, sứ mệnh cao đẹp nhất của Nhà Thám Hiểm Di Sản trẻ là gì?',
      options: [
        'Trân trọng lịch sử, bảo vệ cảnh quan di tích và tích cực lan tỏa niềm tự hào di sản đến mọi người',
        'Vẽ bậy, khắc tên lên tường và hiện vật',
        'Tùy tiện mang các hiện vật trưng bày về nhà',
        'Thờ ơ, không quan tâm đến các giá trị truyền thống'
      ],
      correctIndex: 0,
      explanation: 'Gìn giữ và lan tỏa ngọn lửa tình yêu di sản chính là phần thưởng ý nghĩa nhất của chuyến thám hiểm này!'
    }
  ];

  const questions = (investigation?.quiz && investigation.quiz.length > 0) ? investigation.quiz : defaultQuestions;

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [soundOn, setSoundOn] = useState(true);
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    gameAudio.soundEnabled = soundOn;
  }, [soundOn]);

  useEffect(() => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setStreak(0);
    setIsGameOver(false);
  }, [monumentName, investigation]);

  const currentQ = questions[currentIdx] || questions[0];

  const handleSelectOption = (index) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = index === currentQ.correctIndex;
    if (isCorrect) {
      const earnedXP = 100 + streak * 25;
      setScore(prev => prev + earnedXP);
      setStreak(prev => prev + 1);
      if (streak > 0) {
        gameAudio.playStreak();
      } else {
        gameAudio.playCorrect();
      }
    } else {
      setStreak(0);
      gameAudio.playWrong();
    }
  };

  const handleNextQuestion = () => {
    gameAudio.playTap();
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsGameOver(true);
      try {
        confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
      } catch (e) {}
      if (activePassport) {
        const updated = checkInMonument(monumentStt, monumentName, score || 100);
        if (updated && onPassportUpdate) onPassportUpdate(updated);
      }
    }
  };

  const handleRestartMiniGame = () => {
    gameAudio.playTap();
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setStreak(0);
    setIsGameOver(false);
  };

  // ==========================================
  // CỘT 2: HỒ SƠ ĐIỀU TRA
  // ==========================================
  const defaultQuestion = investigation?.investigationQuestion || "Vì sao di tích này trở thành dấu mốc lịch sử tiêu biểu của dân tộc?";

  const handleStartReport = () => {
    soundEffects.playUnlock();
    try {
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    } catch (e) {}
    if (onOpenStudentReport) {
      onOpenStudentReport();
    }
  };

  // ==========================================
  // CỘT 3: TƯ LIỆU THAM KHẢO
  // ==========================================
  const driveRef = investigation?.driveReferenceData || {};
  const firstCitation = driveRef.citationsList?.[0]?.title || driveRef.citations?.split('\n')[0] || "Ủy ban nhân dân Thành phố Hồ Chí Minh (2026), Dự thảo Danh mục cơ quan, đơn vị và tổ chức trực tiếp quản lý, bảo vệ và phát huy giá trị di tích lịch sử – văn hóa trên địa bàn.";
  const secondCitation = driveRef.citationsList?.[1]?.title || driveRef.citations?.split('\n')[1] || null;
  const thumbnailImage = monumentImage || "/assets/images/dinh-doc-lap-front.jpg";

  return (
    <section className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 py-6">
      <ScrollReveal>
        {/* TIÊU ĐỀ SECTION */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-3 border-b border-[#EAE3D9]">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100 border border-amber-300 text-[#7E1819] text-xs font-black uppercase tracking-wider">
              <Compass className="w-4 h-4 text-[#7E1819]" />
              <span>HÀNH TRÌNH THÁM HIỂM & GIẢI MÃ DI SẢN</span>
            </div>
            <WordByWordTitle
              as="h2"
              text="Truy Tìm Manh Mối • Hồ Sơ Điều Tra • Tài Liệu Di Tích"
              className="font-serif-title font-black text-2xl sm:text-3xl lg:text-4xl text-[#2C241E]"
              staggerDelay={0.05}
            />
          </div>
          <span className="hidden sm:inline-block text-xs sm:text-sm font-bold text-[#7E1819] bg-white px-4 py-2 rounded-xl border border-[#EAE3D9] shadow-2xs">
            🏛️ {monumentName}
          </span>
        </div>

        {/* 3 PHẦN TRÊN 1 HÀNG (3 COLUMNS GRID) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          
          {/* ========================================================================= */}
          {/* CỘT 1: TRUY TÌM MANH MỐI DI SẢN (MINI GAME) */}
          {/* ========================================================================= */}
          <div className="bg-gradient-to-br from-[#220709] via-[#3B0A0E] to-[#4F0D12] text-white rounded-3xl p-5 sm:p-6 border-2 border-amber-500/30 shadow-xl flex flex-col justify-between relative overflow-hidden ring-2 ring-[#7E1819]/20">
            {/* Header MiniGame */}
            <div className="space-y-3 pb-3 border-b border-amber-400/20">
              <div className="flex items-center justify-between gap-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-black uppercase tracking-wider">
                  <Key className="w-3.5 h-3.5 text-amber-300" />
                  <span>TRUY TÌM MANH MỐI</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSoundOn(!soundOn)}
                    className="p-1.5 rounded-xl bg-black/40 border border-white/15 text-amber-300 hover:bg-white/10 text-xs transition-colors cursor-pointer"
                    title={soundOn ? "Tắt âm" : "Bật âm"}
                  >
                    {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-stone-400" />}
                  </button>

                  <div className="bg-black/40 border border-amber-400/30 px-3 py-1 rounded-xl flex items-center gap-1 text-xs sm:text-sm font-black text-amber-300">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>{score} XP</span>
                  </div>
                </div>
              </div>

              {/* Tiến trình manh mối */}
              <div className="flex items-center justify-between text-xs text-rose-200">
                <span className="font-bold text-amber-200 text-xs sm:text-sm">
                  {currentQ?.category || '🔍 Câu Hỏi Di Sản'}
                </span>
                <span className="text-xs font-mono bg-white/10 px-2.5 py-0.5 rounded-md text-amber-300">
                  {currentIdx + 1}/{questions.length}
                </span>
              </div>
            </div>

            {/* Thân câu hỏi & Đáp án */}
            {!isGameOver ? (
              <div className="py-3 flex-1 flex flex-col justify-between space-y-3">
                <p className="font-serif-title font-bold text-base sm:text-lg text-amber-100 leading-snug">
                  {currentQ?.question}
                </p>

                {/* Các lựa chọn A, B, C, D */}
                <div className="space-y-2">
                  {currentQ?.options?.map((opt, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = idx === currentQ.correctIndex;
                    let btnClass = "bg-white/10 hover:bg-white/20 border-white/15 text-rose-50";

                    if (isAnswered) {
                      if (isCorrect) {
                        btnClass = "bg-emerald-600/90 border-emerald-400 text-white font-bold ring-2 ring-emerald-300";
                      } else if (isSelected && !isCorrect) {
                        btnClass = "bg-rose-700/80 border-rose-400 text-white line-through ring-1 ring-rose-300";
                      } else {
                        btnClass = "bg-black/30 border-white/10 text-stone-400 opacity-60";
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(idx)}
                        disabled={isAnswered}
                        className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between gap-2.5 cursor-pointer ${btnClass}`}
                      >
                        <div className="flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="leading-snug">{opt}</span>
                        </div>
                        {isAnswered && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />}
                        {isAnswered && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-300 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Phản hồi giải thích */}
                {isAnswered && (
                  <div className="p-3 rounded-xl bg-black/40 border border-amber-400/30 text-xs sm:text-sm text-rose-100 space-y-1 animate-fadeIn">
                    <p className="font-bold text-amber-300 text-xs">💡 Lời giải mã:</p>
                    <p className="leading-relaxed text-xs sm:text-sm">{currentQ.explanation}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-6 flex-1 flex flex-col items-center justify-center text-center space-y-3 animate-fadeIn">
                <div className="w-14 h-14 rounded-2xl bg-amber-400 text-[#7E1819] flex items-center justify-center text-2xl shadow-lg">
                  🏆
                </div>
                <h4 className="font-serif-title font-black text-xl text-amber-200">
                  Xuất Sắc! Hoàn Thành {score} XP
                </h4>
                <p className="text-xs sm:text-sm text-rose-200 max-w-xs">
                  Em đã giải mã thành công các manh mối lịch sử của di tích {monumentName}.
                </p>
                <button
                  onClick={handleRestartMiniGame}
                  className="px-4 py-2.5 rounded-xl bg-amber-400 text-[#7E1819] font-bold text-xs sm:text-sm hover:bg-amber-300 transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Khám phá lại</span>
                </button>
              </div>
            )}

            {/* Nút Tiếp tục */}
            {!isGameOver && isAnswered && (
              <button
                onClick={handleNextQuestion}
                className="mt-2 w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-[#7E1819] font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>{currentIdx < questions.length - 1 ? 'Manh mối tiếp theo' : 'Xem kết quả giải mã'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* ========================================================================= */}
          {/* CỘT 2: HỒ SƠ ĐIỀU TRA DI SẢN (BẢNG ĐIỀU TRA) */}
          {/* ========================================================================= */}
          <div className="bg-gradient-to-br from-[#FFFDF9] via-[#FAF5ED] to-[#F5ECE0] rounded-3xl p-5 sm:p-6 border-2 border-amber-300/80 shadow-md flex flex-col justify-between relative overflow-hidden">
            <div className="space-y-3.5">
              {/* Header Cột 2 */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#7E1819] to-[#9E1B1D] text-white flex items-center justify-center font-bold shrink-0 shadow-md border border-amber-300">
                  <FolderSearch className="w-6 h-6 text-amber-200" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif-title font-black text-sm uppercase tracking-wider text-[#7E1819]">
                      HỒ SƠ ĐIỀU TRA DI SẢN
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-950 font-black text-[10px] uppercase">
                      Nhiệm Vụ
                    </span>
                  </div>
                  <p className="text-xs text-[#666]">Đóng vai nhà thám hiểm trẻ tuổi để phân tích và lập báo cáo</p>
                </div>
              </div>

              {/* Hộp câu hỏi trọng tâm */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white/95 border border-amber-200/90 shadow-2xs space-y-2.5">
                <div className="flex items-center gap-1.5 text-amber-900 text-xs font-bold">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>CÂU HỎI TRỌNG TÂM CẦN ĐIỀU TRA:</span>
                </div>
                <h3 className="font-serif-title font-black text-base sm:text-lg md:text-xl text-[#2C241E] leading-snug">
                  {defaultQuestion}
                </h3>
                <p className="text-xs sm:text-sm text-[#666666] leading-relaxed pt-1">
                  Vận dụng chứng cứ từ Bản đồ GPS, Thước phim tư liệu, Thuyết minh và Dấu mốc thời gian để hoàn thành phiếu điều tra.
                </p>
              </div>
            </div>

            {/* DUY NHẤT 1 NÚT: BẮT ĐẦU ĐIỀU TRA (MỞ BẢNG ĐIỀU TRA NGAY) */}
            <div className="pt-4">
              <button
                onClick={handleStartReport}
                className="w-full group relative py-4 px-4 rounded-2xl bg-gradient-to-r from-[#7E1819] via-[#9E1B1D] to-[#7E1819] hover:from-[#9E1B1D] hover:to-[#7E1819] text-white text-sm sm:text-base font-black shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2.5 cursor-pointer border-2 border-amber-400 overflow-hidden"
                title="Bấm để mở ngay Bảng Điều Tra & Phiếu Học Tập Lịch Sử"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Compass className="w-5 h-5 text-amber-300 group-hover:rotate-45 transition-transform duration-500" />
                <span>🔭 BẮT ĐẦU ĐIỀU TRA</span>
                <ArrowRight className="w-5 h-5 text-amber-200 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* CỘT 3: TÀI LIỆU & CĂN CỨ LỊCH SỬ (KHO HỒ SƠ THAM KHẢO) */}
          {/* ========================================================================= */}
          <div
            onClick={() => {
              soundEffects.playTap();
              if (onOpenDocsModal) onOpenDocsModal();
            }}
            className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-amber-200 hover:border-[#7E1819] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer group"
          >
            <div className="space-y-3.5">
              {/* Hình ảnh tư liệu */}
              <div className="h-40 sm:h-44 rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 relative shadow-inner">
                <img
                  src={thumbnailImage}
                  alt="Tư liệu tham khảo"
                  className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-3.5">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-200 bg-[#7E1819]/90 px-3 py-1 rounded-lg backdrop-blur-xs border border-amber-400/30">
                    📚 Kho Hồ Sơ Tham Khảo
                  </span>
                </div>
              </div>

              {/* Thông tin hồ sơ & căn cứ */}
              <div className="space-y-1.5">
                <h4 className="font-serif-title font-black text-lg sm:text-xl text-[#2C241E] group-hover:text-[#7E1819] transition-colors flex items-center justify-between">
                  <span>Tài Liệu & Căn Cứ Lịch Sử</span>
                  <Bookmark className="w-5 h-5 text-[#7E1819]" />
                </h4>
                <p className="text-xs sm:text-sm text-[#555] leading-relaxed line-clamp-2">
                  {firstCitation}
                </p>
                {secondCitation && (
                  <p className="text-xs sm:text-sm text-[#777] leading-relaxed line-clamp-1">
                    • {secondCitation}
                  </p>
                )}
              </div>
            </div>

            {/* Footer Cột 3 */}
            <div className="pt-3 border-t border-[#F0EAE1] flex items-center justify-between text-xs sm:text-sm text-[#7E1819] font-bold">
              <span className="group-hover:underline">Tra cứu toàn bộ hồ sơ khoa học & văn bản pháp lý &rarr;</span>
              <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

        </div>
      </ScrollReveal>
    </section>
  );
}

