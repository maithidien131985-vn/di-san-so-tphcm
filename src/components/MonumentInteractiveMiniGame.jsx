import React, { useState, useEffect, useRef } from 'react';
import { 
  Compass, 
  Trophy, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Award, 
  Flame, 
  HelpCircle, 
  ArrowRight, 
  BookOpen, 
  Share2, 
  Star,
  Check,
  Volume2,
  VolumeX,
  Music,
  MapPin,
  Key,
  Scroll,
  ShieldCheck,
  Download
} from 'lucide-react';
import ScrollReveal from './ScrollReveal';

// ==============================================================================
// WEB AUDIO SOUND SYNTHESIZER (ÂM THANH THÁM HIỂM & KHÁM PHÁ BÁU VẬT)
// ==============================================================================
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

  // Âm thanh mở khóa manh mối đúng: Hợp âm chuông vàng (Major Chime)
  playCorrect() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
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
  }

  // Âm thanh khi chọn chưa đúng: Âm thám hiểm trầm ấm
  playWrong() {
    if (!this.soundEnabled) return;
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
  }

  // Âm thanh chuỗi thám hiểm liên tiếp (Streak)
  playStreak() {
    if (!this.soundEnabled) return;
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
  }

  // Nhạc kèn chiến thắng mở rương báu (Treasure Unlocked Fanfare)
  playFanfare() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    const chords = [
      { notes: [523.25, 659.25, 783.99], time: 0, dur: 0.18 },
      { notes: [523.25, 659.25, 783.99], time: 0.2, dur: 0.18 },
      { notes: [523.25, 659.25, 783.99], time: 0.4, dur: 0.18 },
      { notes: [698.46, 880.00, 1046.50], time: 0.62, dur: 0.55 }
    ];

    const now = this.ctx.currentTime;
    chords.forEach(c => {
      c.notes.forEach(freq => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + c.time);

        gain.gain.setValueAtTime(0.001, now + c.time);
        gain.gain.linearRampToValueAtTime(0.18, now + c.time + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + c.time + c.dur);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + c.time);
        osc.stop(now + c.time + c.dur + 0.05);
      });
    });
  }

  // Âm gõ nhẹ khi chạm
  playTap() {
    if (!this.soundEnabled) return;
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
  }
}

import { markMonumentAsExplored } from '../utils/studentStorage';

const gameAudio = new GameAudioEngine();

export default function MonumentInteractiveMiniGame({
  quiz = [],
  monumentName = 'Di tích lịch sử',
  monumentStt = 1,
  onOpenNextMonument,
  onOpenPassport
}) {
  const defaultQuestions = [
    {
      id: 1,
      category: '🔍 Manh mối Sự kiện',
      question: `Manh mối lịch sử quan trọng nhất cần giải mã tại "${monumentName}" là gì?`,
      options: [
        `Các mốc son đấu tranh hào hùng và dấu ấn lịch sử hào hùng của dân tộc tại TP.HCM`,
        'Một hội chợ nông sản thường niên',
        'Công trình phục vụ giải trí ngắn hạn',
        'Một cuộc triển lãm thương mại tạm thời'
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

  const questions = quiz && quiz.length > 0 ? quiz : defaultQuestions;

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [historyAnswers, setHistoryAnswers] = useState([]);
  const [copiedLink, setCopiedLink] = useState(false);
  const [soundOn, setSoundOn] = useState(true);

  // Sync sound setting
  useEffect(() => {
    gameAudio.soundEnabled = soundOn;
  }, [soundOn]);

  // Reset state when monumentName changes
  useEffect(() => {
    handleRestart();
  }, [monumentName, quiz]);

  const currentQ = questions[currentIdx] || questions[0];

  const handleSelectOption = (index) => {
    if (isAnswered) return;

    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = index === currentQ.correctIndex;
    let newStreak = streak;

    if (isCorrect) {
      const earnedXP = 100 + streak * 25;
      setScore(prev => prev + earnedXP);
      newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);

      if (newStreak > 1) {
        gameAudio.playStreak();
      } else {
        gameAudio.playCorrect();
      }
    } else {
      setStreak(0);
      gameAudio.playWrong();
    }

    setHistoryAnswers(prev => [
      ...prev,
      {
        question: currentQ.question,
        selected: index,
        correct: currentQ.correctIndex,
        isCorrect
      }
    ]);
  };

  const handleNextQuestion = () => {
    gameAudio.playTap();
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsGameOver(true);
      gameAudio.playFanfare();
      // Tự động ghi nhận di tích này vào Passport & cộng điểm XP
      try {
        markMonumentAsExplored(monumentStt, monumentName, score > 0 ? score : 100);
      } catch (e) {
        console.warn('Lỗi ghi nhận passport:', e);
      }
    }
  };

  const handleRestart = () => {
    gameAudio.playTap();
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setIsGameOver(false);
    setHistoryAnswers([]);
  };

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    gameAudio.soundEnabled = next;
    if (next) gameAudio.playTap();
  };

  // Badge & Passport calculation
  const totalQuestions = questions.length;
  const correctCount = historyAnswers.filter(a => a.isCorrect).length;
  const percentage = Math.round((correctCount / totalQuestions) * 100);

  let badge = {
    title: 'Mật Thám Khám Phá Di Sản',
    icon: '🧭',
    rank: 'Huy Hiệu Đồng',
    stamp: 'ĐÃ KHÁM PHÁ BAN ĐẦU',
    desc: 'Em đã hoàn thành chuyến thám hiểm! Hãy xem lại video và lắng nghe thêm tư liệu để giải mã toàn bộ bí mật nhé!'
  };

  if (percentage === 100) {
    badge = {
      title: 'Bậc Thầy Giải Mã Di Sản',
      icon: '👑',
      rank: 'Huy Hiệu Hoàng Gia',
      stamp: 'XÁC THỰC HOÀN HẢO 100%',
      desc: 'Xuất sắc tuyệt đối! Em đã giải mã thành công mọi manh mối bí mật và mở khóa trọn vẹn rương báu lịch sử!'
    };
  } else if (percentage >= 80) {
    badge = {
      title: 'Nhà Thám Hiểm Xuất Sắc',
      icon: '🎖️',
      rank: 'Huy Hiệu Vàng',
      stamp: 'XÁC THỰC XUẤT SẮC',
      desc: 'Tuyệt vời! Em có trực giác thám hiểm lịch sử cực kỳ nhạy bén và hiểu biết sâu rộng về di tích này.'
    };
  } else if (percentage >= 60) {
    badge = {
      title: 'Thám Tử Lịch Sử Trẻ',
      icon: '🏅',
      rank: 'Huy Hiệu Bạc',
      stamp: 'ĐÃ GIẢI MÃ THÀNH CÔNG',
      desc: 'Rất tốt! Em đã tìm ra hầu hết các manh mối cốt lõi trong chuyến phiêu lưu di sản này.'
    };
  }

  const currentDateStr = new Date().toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return (
    <section id="interactive-game-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 select-none">
      <ScrollReveal>
        <div className="bg-gradient-to-br from-[#200507] via-[#3A080B] to-[#570C0F] text-white rounded-3xl p-5 sm:p-7 md:p-9 border-2 border-amber-500/30 shadow-2xl relative overflow-hidden ring-4 ring-[#8B1417]/20">
          {/* Ambient Lighting & Map Grid Texture */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header Bar */}
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-5 border-b border-amber-400/20">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/25 to-yellow-500/25 text-amber-300 border border-amber-400/40 text-[11px] font-black uppercase tracking-wider shadow-inner">
                  <Compass className="w-4 h-4 text-amber-300 animate-spin-slow" />
                  <span>HÀNH TRÌNH THÁM HIỂM &amp; GIẢI MÃ BÍ ẨN</span>
                </div>
                <div className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/10 text-rose-200 text-[10px] font-bold">
                  <Music className="w-3 h-3 text-amber-300" />
                  <span>Hiệu ứng âm thanh</span>
                </div>
              </div>

              <h2 className="font-serif-title font-black text-xl sm:text-2xl md:text-3xl text-amber-100 flex items-center gap-2">
                <span>Truy Tìm Manh Mối Di Sản</span>
                <span className="text-amber-400">🗝️</span>
              </h2>
              <p className="text-xs sm:text-sm text-rose-100/90 leading-relaxed">
                Đóng vai Nhà Thám Hiểm Trẻ, giải mã các mật mã lịch sử sau khi khám phá <strong className="text-amber-200">{monumentName}</strong>
              </p>
            </div>

            {/* Score & Controls HUD */}
            <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
              {/* Sound Button */}
              <button
                onClick={toggleSound}
                className={`px-3.5 py-2 rounded-2xl border flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer shadow-md ${
                  soundOn
                    ? 'bg-amber-400/20 border-amber-400/60 text-amber-300 hover:bg-amber-400/30'
                    : 'bg-black/40 border-white/20 text-stone-400 hover:bg-white/10'
                }`}
                title={soundOn ? "Tắt âm thanh thám hiểm" : "Bật âm thanh thám hiểm"}
              >
                {soundOn ? <Volume2 className="w-4 h-4 text-amber-300" /> : <VolumeX className="w-4 h-4" />}
                <span className="hidden sm:inline">{soundOn ? 'Âm thanh: Bật' : 'Tắt âm'}</span>
              </button>

              {!isGameOver && (
                <>
                  {/* XP / Crystal Points */}
                  <div className="bg-black/50 border border-amber-400/30 px-4 py-1.5 rounded-2xl flex items-center gap-2 backdrop-blur-md shadow-inner">
                    <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                    <div>
                      <span className="text-[10px] text-stone-300 uppercase block font-semibold leading-none">Điểm Thám Hiểm</span>
                      <span className="text-sm sm:text-base font-black text-amber-300">{score} XP</span>
                    </div>
                  </div>

                  {/* Streak Combo Flame */}
                  {streak > 1 && (
                    <div className="bg-gradient-to-r from-amber-500 via-rose-600 to-red-600 px-3.5 py-1.5 rounded-2xl flex items-center gap-1.5 shadow-xl animate-bounce">
                      <Flame className="w-4 h-4 text-yellow-200 fill-yellow-200" />
                      <span className="text-xs font-black text-white uppercase tracking-wider">Chuỗi x{streak}!</span>
                    </div>
                  )}

                  {/* Clue Progress Pill */}
                  <div className="bg-white/15 border border-white/20 px-3.5 py-1.5 rounded-2xl text-xs font-black text-amber-200">
                    Manh mối {currentIdx + 1}/{questions.length}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ADVENTURE BOARD */}
          <div className="relative z-10 pt-6">
            {!isGameOver ? (
              <div className="space-y-6">
                {/* Visual Adventure Map Pathway */}
                <div className="bg-black/40 border border-amber-400/20 p-3 rounded-2xl backdrop-blur-sm flex items-center justify-between overflow-x-auto no-scrollbar gap-2">
                  {questions.map((q, idx) => {
                    const isPassed = idx < currentIdx;
                    const isCurrent = idx === currentIdx;
                    return (
                      <div key={idx} className="flex items-center gap-2 shrink-0">
                        <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center font-black text-xs transition-all ${
                          isPassed
                            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/50'
                            : isCurrent
                            ? 'bg-amber-400 text-[#200507] ring-4 ring-amber-400/40 font-black scale-110 shadow-lg'
                            : 'bg-white/10 text-stone-400'
                        }`}>
                          {isPassed ? '✓' : idx === questions.length - 1 ? '👑' : `🗝️${idx + 1}`}
                        </div>
                        {idx < questions.length - 1 && (
                          <div className={`w-4 sm:w-8 h-1 rounded-full ${
                            isPassed ? 'bg-emerald-500' : 'bg-white/10'
                          }`} />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Mystery Clue Box */}
                <div className="bg-black/35 border-2 border-amber-400/30 rounded-3xl p-5 sm:p-7 backdrop-blur-md space-y-3 shadow-xl">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-xl bg-[#8B1417] text-amber-200 text-xs font-black uppercase tracking-wider border border-amber-400/30 flex items-center gap-1.5 shadow-sm">
                      <Key className="w-3.5 h-3.5 text-amber-300" />
                      <span>{currentQ.category || 'Manh mối lịch sử'}</span>
                    </span>
                    <span className="text-xs text-amber-200/80 font-semibold italic">
                      Giải mã để nhận báu vật di sản
                    </span>
                  </div>

                  <h3 className="font-serif-title font-bold text-base sm:text-lg md:text-xl text-white leading-relaxed pt-1">
                    {currentQ.question}
                  </h3>
                </div>

                {/* 4 Ancient Option Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {currentQ.options.map((opt, optIdx) => {
                    const isSelected = selectedOption === optIdx;
                    const isCorrectOption = optIdx === currentQ.correctIndex;
                    
                    let btnStyle = 'bg-[#FAF4F0]/10 hover:bg-[#FAF4F0]/20 border-amber-400/20 text-stone-100 hover:border-amber-300 hover:scale-101';
                    let iconState = null;

                    if (isAnswered) {
                      if (isCorrectOption) {
                        btnStyle = 'bg-emerald-600/90 border-emerald-300 text-white ring-4 ring-emerald-400/50 shadow-xl shadow-emerald-950/60 scale-102';
                        iconState = <CheckCircle2 className="w-5 h-5 text-white shrink-0 animate-bounce" />;
                      } else if (isSelected) {
                        btnStyle = 'bg-rose-700/90 border-rose-400 text-white ring-2 ring-rose-400/50 shadow-lg shadow-red-950/50';
                        iconState = <XCircle className="w-5 h-5 text-white shrink-0" />;
                      } else {
                        btnStyle = 'bg-black/30 border-white/10 text-stone-400 opacity-50';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={isAnswered}
                        onClick={() => handleSelectOption(optIdx)}
                        className={`p-4 sm:p-4.5 rounded-2xl border-2 text-left transition-all duration-300 flex items-start gap-3 cursor-pointer group shadow-md ${btnStyle}`}
                      >
                        <span className="w-7 h-7 rounded-xl bg-white/20 group-hover:bg-amber-400 group-hover:text-[#2D0A0D] flex items-center justify-center font-black text-xs shrink-0 transition-colors shadow-inner">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="text-xs sm:text-sm font-medium leading-relaxed flex-1 pt-0.5">
                          {opt}
                        </span>
                        {iconState}
                      </button>
                    );
                  })}
                </div>

                {/* Instant Clue Discovery Feedback */}
                {isAnswered && (
                  <div className={`p-4 sm:p-5 rounded-2xl border-2 animate-fadeIn space-y-3 ${
                    selectedOption === currentQ.correctIndex
                      ? 'bg-emerald-950/80 border-emerald-500/90 text-emerald-100'
                      : 'bg-rose-950/80 border-rose-500/90 text-rose-100'
                  }`}>
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        {selectedOption === currentQ.correctIndex ? (
                          <>
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            <span className="font-bold text-sm sm:text-base text-emerald-300">
                              Giải mã thành công! Mở khóa +100 XP 🎉
                            </span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-5 h-5 text-rose-400" />
                            <span className="font-bold text-sm sm:text-base text-rose-300">
                              Manh mối chưa chuẩn xác! Hãy đọc bí kíp bên dưới:
                            </span>
                          </>
                        )}
                      </div>

                      <button
                        onClick={handleNextQuestion}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-[#2D0A0D] font-black text-xs sm:text-sm shadow-lg transition-all hover:scale-104 cursor-pointer flex items-center gap-1.5"
                      >
                        <span>{currentIdx < questions.length - 1 ? 'Khám phá manh mối tiếp theo' : 'Mở Hộ Chiếu Di Sản'}</span>
                        <ArrowRight className="w-4 h-4 text-[#2D0A0D]" />
                      </button>
                    </div>

                    {currentQ.explanation && (
                      <div className="text-xs sm:text-sm leading-relaxed pt-2.5 border-t border-white/15 text-justify text-white/95">
                        <strong className="text-amber-200 font-black">📜 Bí mật lịch sử được giải mã: </strong>
                        {currentQ.explanation}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* PASSPORT & ADVENTURE COMPLETION CERTIFICATE */
              <div className="space-y-6 max-w-2xl mx-auto py-2 animate-scaleUp">
                {/* Certified Heritage Passport Card */}
                <div className="relative bg-[#FAF4F0] text-[#2A1214] rounded-3xl p-6 sm:p-8 border-4 border-amber-500 shadow-2xl overflow-hidden">
                  {/* Decorative Stamp Header */}
                  <div className="flex items-center justify-between border-b-2 border-rose-900/20 pb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-[#8B1417] text-amber-200 flex items-center justify-center font-bold shadow-md">
                        <ShieldCheck className="w-6 h-6 text-amber-300" />
                      </div>
                      <div>
                        <span className="font-serif-title font-black text-sm sm:text-base text-[#8B1417] uppercase tracking-wider block">
                          HỘ CHIẾU THÁM HIỂM DI SẢN
                        </span>
                        <span className="text-[10px] text-stone-500 font-bold uppercase tracking-widest block">
                          SAIGON HERITAGE PASSPORT • SỐ HÓA 2026
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="px-3 py-1 rounded-full bg-[#8B1417] text-amber-200 text-[10px] font-black uppercase tracking-wider">
                        {badge.stamp}
                      </span>
                    </div>
                  </div>

                  {/* Monument & Explorer Badge Profile */}
                  <div className="py-6 text-center space-y-3">
                    <div className="inline-block p-4 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-600 shadow-xl border-2 border-white text-5xl sm:text-6xl animate-bounce">
                      {badge.icon}
                    </div>

                    <div>
                      <h3 className="font-serif-title font-black text-xl sm:text-2xl md:text-3xl text-[#8B1417] uppercase">
                        {badge.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-stone-600 font-semibold pt-0.5">
                        Đã giải mã thành công: <strong className="text-[#8B1417]">{monumentName}</strong>
                      </p>
                    </div>

                    <p className="text-xs text-stone-600 leading-relaxed italic max-w-md mx-auto">
                      "{badge.desc}"
                    </p>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-3 bg-white border-2 border-rose-100 p-3.5 rounded-2xl shadow-inner text-center">
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-stone-500 font-bold uppercase block">Manh Mối Đúng</span>
                      <span className="text-base sm:text-xl font-black text-emerald-700">{correctCount}/{totalQuestions}</span>
                    </div>
                    <div className="space-y-0.5 border-x border-stone-200">
                      <span className="text-[10px] text-stone-500 font-bold uppercase block">Điểm Thám Hiểm</span>
                      <span className="text-base sm:text-xl font-black text-amber-600">{score} XP</span>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-stone-500 font-bold uppercase block">Ngày Khám Phá</span>
                      <span className="text-xs sm:text-sm font-black text-[#8B1417]">{currentDateStr}</span>
                    </div>
                  </div>

                  {/* Red Wax Seal Stamp at Bottom Right */}
                  <div className="pt-4 flex items-center justify-between text-[11px] text-stone-500 border-t border-rose-900/15 mt-4">
                    <span>Hệ thống Số hóa Di sản Văn hóa TP.HCM</span>
                    <span className="font-black text-[#8B1417] uppercase tracking-wider">★ ĐÃ ĐÓNG DẤU DI SẢN ★</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  {onOpenPassport && (
                    <button
                      onClick={onOpenPassport}
                      className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-[#2D0A0D] font-black text-xs sm:text-sm shadow-xl transition-all hover:scale-104 cursor-pointer flex items-center gap-2"
                    >
                      <Award className="w-4 h-4 text-[#2D0A0D]" />
                      <span>Xem Passport Di Sản Của Tôi (103 Di Tích)</span>
                    </button>
                  )}

                  <button
                    onClick={handleRestart}
                    className="px-6 py-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs sm:text-sm border border-white/30 shadow-md transition-all hover:scale-103 cursor-pointer flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4 text-amber-300" />
                    <span>Thám hiểm lại di tích</span>
                  </button>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      setCopiedLink(true);
                      setTimeout(() => setCopiedLink(false), 2000);
                    }}
                    className="px-6 py-3 rounded-2xl bg-[#8B1417] hover:bg-[#a0181c] text-white font-bold text-xs sm:text-sm border border-amber-400/40 shadow-xl transition-all hover:scale-103 cursor-pointer flex items-center gap-2"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-amber-300" /> : <Share2 className="w-4 h-4 text-amber-300" />}
                    <span>{copiedLink ? 'Đã sao chép liên kết!' : 'Chia sẻ thành tích'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
