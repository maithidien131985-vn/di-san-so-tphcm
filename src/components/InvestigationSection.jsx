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
  ShieldCheck,
  Leaf,
  Heart,
  Send
} from 'lucide-react';
import confetti from 'canvas-confetti';
import ScrollReveal from './ScrollReveal';
import { checkInMonument } from '../utils/passportStorage';
import soundEffects from '../utils/soundEffects';
import WordByWordTitle from './WordByWordTitle';
import { shuffleQuestions } from '../utils/quizUtils';
import { trackQuizAttempt } from '../utils/studentAnalytics';

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

  // Âm thanh kèn thắng cuộc vui nhộn chúc mừng khi chinh phục đủ 5 câu
  playVictoryFanfare() {
    if (!this.soundEnabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const notes = [
        { freq: 523.25, time: 0.00, dur: 0.12, type: 'triangle' }, // C5
        { freq: 659.25, time: 0.12, dur: 0.12, type: 'triangle' }, // E5
        { freq: 783.99, time: 0.24, dur: 0.14, type: 'triangle' }, // G5
        { freq: 1046.50, time: 0.38, dur: 0.22, type: 'triangle' }, // C6
        { freq: 783.99, time: 0.60, dur: 0.12, type: 'triangle' }, // G5
        { freq: 1046.50, time: 0.72, dur: 0.14, type: 'triangle' }, // C6
        { freq: 1318.51, time: 0.86, dur: 0.45, type: 'triangle' }, // E6
        // Hợp âm vang sáng
        { freq: 523.25, time: 0.86, dur: 0.45, type: 'sine' }, // C5
        { freq: 659.25, time: 0.86, dur: 0.45, type: 'sine' }, // E5
        { freq: 1046.50, time: 0.86, dur: 0.45, type: 'sine' }  // C6
      ];

      const now = this.ctx.currentTime;
      notes.forEach(({ freq, time, dur, type }) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type || 'triangle';
        osc.frequency.setValueAtTime(freq, now + time);
        gain.gain.setValueAtTime(0.001, now + time);
        gain.gain.linearRampToValueAtTime(0.18, now + time + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + time + dur);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + time);
        osc.stop(now + time + dur + 0.05);
      });
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
  onOpenActionModal,
  onOpenDocsModal,
  onCompleteInvestigation
}) {
  // Đồng bộ danh sách lời cam kết hành động từ LocalStorage
  const [pledgesList, setPledgesList] = useState(() => {
    try {
      const saved = localStorage.getItem('di_san_so_pledges');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      { name: 'Trương Mai Lan • 9a1 • THCS Xà Bang', text: `Em xin hứa sẽ noi gương các thế hệ cha anh, tích cực học tập, rèn luyện và góp phần bảo tồn, phát huy giá trị di sản ${monumentName}!`, time: 'Vừa xong' },
      { name: 'Nguyễn Văn An • THCS Xà Bang', text: `Em cam kết tìm hiểu sâu sắc lịch sử dân tộc và giới thiệu di tích ${monumentName} đến bạn bè quốc tế!`, time: 'Hôm nay' },
      { name: 'Trần Thị Mai • 9A1', text: `Giữ gìn vệ sinh và tôn trọng không gian trang nghiêm khi đến tham quan khu di tích ${monumentName}.`, time: 'Hôm nay' }
    ];
  });

  useEffect(() => {
    const handleStorageUpdate = () => {
      try {
        const saved = localStorage.getItem('di_san_so_pledges');
        if (saved) setPledgesList(JSON.parse(saved));
      } catch (e) {}
    };
    window.addEventListener('storage', handleStorageUpdate);
    window.addEventListener('di_san_so_pledge_updated', handleStorageUpdate);
    handleStorageUpdate();
    return () => {
      window.removeEventListener('storage', handleStorageUpdate);
      window.removeEventListener('di_san_so_pledge_updated', handleStorageUpdate);
    };
  }, [monumentStt]);

  // ==========================================
  // CỘT 1: CHINH PHỤC HUY HIỆU DI SẢN (5 CÂU HỎI THỬ THÁCH)
  // ==========================================
  const default5Questions = [
    {
      id: 1,
      category: '⚔️ Mốc Son & Sự Kiện',
      question: `Sự kiện lịch sử nổi bật nhất gắn liền với di tích "${monumentName}" là gì?`,
      options: [
        `Gắn liền với các mốc son đấu tranh hào hùng và dấu ấn lịch sử vẻ vang của dân tộc`,
        'Một cuộc triển lãm thương mại quốc tế tạm thời vào thế kỷ 21',
        'Công trình xây dựng phục vụ du lịch sinh thái thuần túy',
        'Địa điểm tổ chức hội chợ nông sản thường niên'
      ],
      correctIndex: 0,
      explanation: `Di tích ${monumentName} là nơi ghi dấu những bước chân lịch sử hào hùng, lưu giữ bí mật tự hào của các thế hệ cha anh.`
    },
    {
      id: 2,
      category: '🏺 Hiện Vật & Báu Vật',
      question: `Báu vật hiện vật hoặc các chứng tích nguyên bản tại "${monumentName}" truyền tải thông điệp gì?`,
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
      category: '👤 Nhân Vật & Chứng Nhân',
      question: `Các anh hùng, nhân vật lịch sử và thế hệ đi trước gắn liền với "${monumentName}" tiêu biểu cho phẩm chất nào?`,
      options: [
        'Lòng yêu nước nồng nàn, ý chí quật cường và tinh thần hy sinh vì độc lập tự do của Tổ quốc',
        'Lợi ích cá nhân và mong muốn làm giàu nhanh chóng',
        'Sự thỏa hiệp và chấp nhận số phận',
        'Thái độ bàng quan trước thời cuộc'
      ],
      correctIndex: 0,
      explanation: `Tinh thần bất khuất của các thế hệ tiền nhân tại ${monumentName} mãi là tấm gương sáng ngời cho thế hệ trẻ học tập.`
    },
    {
      id: 4,
      category: '🏛️ Tinh Hoa Kiến Trúc',
      question: `Nét độc đáo về mặt không gian, kiến trúc hoặc giá trị văn hóa tại "${monumentName}" được khẳng định qua điều gì?`,
      options: [
        'Sự kết tinh của bàn tay tài hoa, bản sắc văn hóa dân tộc và giá trị trường tồn cùng thời gian',
        'Kiểu dáng sao chép hiện đại không có bản sắc',
        'Công trình tạm bợ không được bảo tồn',
        'Chỉ là kiến trúc dân dụng thông thường'
      ],
      correctIndex: 0,
      explanation: `Không gian kiến trúc và cảnh quan tại ${monumentName} chứa đựng linh hồn văn hóa và kỹ nghệ xây dựng độc đáo của tiền nhân.`
    },
    {
      id: 5,
      category: '🧭 Ý Nghĩa & Trách Nhiệm',
      question: `Sau khi chinh phục và tìm hiểu di tích "${monumentName}", sứ mệnh cao đẹp nhất của học sinh chúng ta là gì?`,
      options: [
        'Trân trọng lịch sử, bảo vệ cảnh quan di tích và tích cực lan tỏa niềm tự hào di sản đến mọi người',
        'Vẽ bậy, khắc tên lên tường và hiện vật',
        'Tùy tiện mang các hiện vật trưng bày về nhà',
        'Thờ ơ, không quan tâm đến các giá trị truyền thống'
      ],
      correctIndex: 0,
      explanation: 'Gìn giữ và lan tỏa ngọn lửa tình yêu di sản chính là phần thưởng ý nghĩa nhất của hành trình Chinh Phục Huy Hiệu!'
    }
  ];

  // Đảm bảo luôn có đủ đúng 5 câu hỏi phong phú
  const baseQuestions = React.useMemo(() => {
    const customQuiz = investigation?.quiz || [];
    if (customQuiz.length >= 5) {
      return customQuiz.slice(0, 5);
    }
    if (customQuiz.length > 0) {
      const remaining = default5Questions.slice(customQuiz.length);
      return [...customQuiz, ...remaining];
    }
    return default5Questions;
  }, [investigation, monumentName]);

  const [shuffledQuestions, setShuffledQuestions] = useState(() => shuffleQuestions(baseQuestions));
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [soundOn, setSoundOn] = useState(true);
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    gameAudio.soundEnabled = soundOn;
  }, [soundOn]);

  useEffect(() => {
    setShuffledQuestions(shuffleQuestions(baseQuestions));
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setCorrectCount(0);
    setStreak(0);
    setIsGameOver(false);
  }, [baseQuestions]);

  const currentQ = shuffledQuestions[currentIdx] || shuffledQuestions[0] || baseQuestions[0];
  const questions = shuffledQuestions;

  const handleSelectOption = (index) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = index === currentQ.correctIndex;
    if (isCorrect) {
      const earnedXP = 150 + streak * 25;
      setScore(prev => prev + earnedXP);
      setCorrectCount(prev => prev + 1);
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

    // Ghi nhận telemetry trắc nghiệm gửi về Google Sheets
    try {
      trackQuizAttempt({
        passport: activePassport,
        monumentStt,
        monumentName,
        question: currentQ?.question,
        isCorrect,
        score: isCorrect ? (150 + streak * 25) : 0,
        totalQuestions: questions.length
      });
    } catch (e) {}
  };

  const triggerVictoryCelebration = (isPerfect = true) => {
    soundEffects.playStamp();
    setTimeout(() => {
      soundEffects.playMonumentCompletion(monumentName);
    }, 350);

    try {
      if (isPerfect) {
        // Đợt 1: Bung pháo hoa tâm điểm rực rỡ
        confetti({
          particleCount: 110,
          spread: 85,
          origin: { y: 0.55 },
          colors: ['#FFE81F', '#FFA500', '#FF3366', '#00E5FF', '#76FF03']
        });

        // Đợt 2: Pháo hoa cánh tả
        setTimeout(() => {
          confetti({
            particleCount: 75,
            angle: 60,
            spread: 65,
            origin: { x: 0.1, y: 0.6 }
          });
        }, 200);

        // Đợt 3: Pháo hoa cánh hữu
        setTimeout(() => {
          confetti({
            particleCount: 75,
            angle: 120,
            spread: 65,
            origin: { x: 0.9, y: 0.6 }
          });
        }, 400);

        // Đợt 4: Mưa ngôi sao vàng vinh danh
        setTimeout(() => {
          confetti({
            particleCount: 60,
            spread: 120,
            origin: { y: 0.5 },
            shapes: ['star'],
            colors: ['#FFD700', '#FFA500', '#FFF8DC', '#FF4500']
          });
        }, 600);
      } else {
        // Pháo hoa nhẹ nhàng khích lệ
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (e) {}
  };

  const handleNextQuestion = () => {
    gameAudio.playTap();
    if (currentIdx < shuffledQuestions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsGameOver(true);
      const isPerfect = correctCount === shuffledQuestions.length;
      const isPassed = correctCount >= 3;

      if (isPassed) {
        triggerVictoryCelebration(isPerfect);
      } else {
        gameAudio.playTap();
      }

      if (activePassport) {
        const updated = checkInMonument(monumentStt, monumentName, score);
        if (updated && onPassportUpdate) onPassportUpdate(updated);
      }
      if (onCompleteInvestigation) {
        onCompleteInvestigation();
      }
    }
  };

  const handleRestartMiniGame = () => {
    gameAudio.playTap();
    setShuffledQuestions(shuffleQuestions(baseQuestions));
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setCorrectCount(0);
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
    if (onCompleteInvestigation) {
      onCompleteInvestigation();
    }
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

  const scrollToInvestigation = () => {
    soundEffects.playTap();
    const el = document.getElementById('investigation-box');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToPledge = () => {
    soundEffects.playTap();
    const el = document.getElementById('investigation-action-pledge');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 py-2">
      <ScrollReveal>
        <div className="bg-[#F3F6FB] rounded-3xl p-6 sm:p-8 border border-indigo-200/80 shadow-sm space-y-8">
          {/* TIÊU ĐỀ SECTION */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-4 border-b border-indigo-200/70">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100 border border-amber-300 text-[#7E1819] text-xs font-black uppercase tracking-wider">
              <Award className="w-4 h-4 text-[#7E1819]" />
              <span>HÀNH TRÌNH THÁM HIỂM & GIẢI MÃ DI SẢN</span>
            </div>
            <WordByWordTitle
              as="h2"
              text="Chinh Phục Huy Hiệu • Hồ Sơ Điều Tra • Sổ Tay Cam Kết"
              className="font-serif-title font-black text-2xl sm:text-3xl lg:text-4xl text-[#2C241E]"
              staggerDelay={0.05}
            />
          </div>
          <span className="hidden sm:inline-block text-xs sm:text-sm font-bold text-[#7E1819] bg-white px-4 py-2 rounded-xl border border-[#EAE3D9] shadow-2xs">
            🏛️ {monumentName}
          </span>
        </div>

        {/* ========================================================================= */}
        {/* PHẦN 1: CHINH PHỤC HUY HIỆU DI SẢN (TRẢI RỘNG TOÀN BỘ BỀ NGANG CỦA TRANG) */}
        {/* ========================================================================= */}
        <div className="w-full bg-gradient-to-br from-[#220709] via-[#3B0A0E] to-[#4F0D12] text-white rounded-3xl p-6 sm:p-8 border-2 border-amber-500/40 shadow-2xl space-y-5 relative overflow-hidden ring-4 ring-[#7E1819]/20">
          {/* Header MiniGame */}
          <div className="space-y-3 pb-4 border-b border-amber-400/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/30 via-yellow-400/40 to-amber-500/30 border-2 border-amber-400/70 text-amber-300 text-xs sm:text-sm font-black uppercase tracking-wider shadow-lg shadow-amber-500/20 backdrop-blur-md animate-pulse">
                  <span className="text-base animate-bounce">🎮</span>
                  <span className="bg-gradient-to-r from-yellow-200 via-amber-300 to-yellow-100 bg-clip-text text-transparent drop-shadow-sm font-extrabold tracking-wide">
                    THAM GIA TRÒ CHƠI NHÉ!
                  </span>
                  <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" style={{ animationDuration: '4s' }} />
                </div>

                <span className="hidden md:inline-flex text-xs font-bold text-amber-200/90 bg-white/10 px-3 py-1.5 rounded-full border border-white/15">
                  🎖️ Hoàn thành 5 câu hỏi để nhận Huy Hiệu Di Tích
                </span>
              </div>

              <div className="flex items-center gap-2.5 self-end sm:self-auto">
                <button
                  onClick={() => setSoundOn(!soundOn)}
                  className="p-2 rounded-xl bg-black/40 border border-white/15 text-amber-300 hover:bg-white/10 text-xs transition-colors cursor-pointer"
                  title={soundOn ? "Tắt âm" : "Bật âm"}
                >
                  {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-stone-400" />}
                </button>

                <div className="bg-black/40 border border-amber-400/40 px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 text-xs sm:text-sm font-black text-amber-300">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{score} XP</span>
                </div>
              </div>
            </div>

            {/* Tiến trình manh mối */}
            <div className="flex items-center justify-between text-xs sm:text-sm text-rose-200 pt-1">
              <span className="font-bold text-amber-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{currentQ?.category || '🔍 Thử Thách Di Sản'}</span>
              </span>
              <span className="font-mono font-bold bg-white/10 px-3 py-1 rounded-lg text-amber-300 border border-amber-400/30 text-xs">
                Câu hỏi {currentIdx + 1}/{questions.length}
              </span>
            </div>
          </div>

          {/* Thân câu hỏi & Đáp án (FULL WIDTH) */}
          {!isGameOver ? (
            <div className="space-y-5">
              <p className="font-serif-title font-black text-xl sm:text-2xl md:text-3xl text-amber-100 leading-snug tracking-normal drop-shadow-sm">
                {currentQ?.question}
              </p>

              {/* Các lựa chọn A, B, C, D xếp 2 cột rộng rãi */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
                {currentQ?.options?.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === currentQ.correctIndex;
                  let btnClass = "bg-white/10 hover:bg-white/20 border-white/15 text-rose-50 hover:border-amber-400/60";

                  if (isAnswered) {
                    if (isCorrect) {
                      btnClass = "bg-emerald-600/90 border-emerald-400 text-white font-bold ring-2 ring-emerald-300 shadow-lg";
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
                      className={`w-full text-left p-4 sm:p-5 rounded-2xl border text-sm sm:text-base md:text-lg transition-all flex items-start justify-between gap-3.5 cursor-pointer shadow-md ${btnClass}`}
                    >
                      <div className="flex items-start gap-3.5">
                        <span className="w-8 h-8 rounded-full bg-amber-400/20 text-amber-300 text-sm font-black flex items-center justify-center shrink-0 mt-0.5 border border-amber-400/40 shadow-xs">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="leading-relaxed font-semibold">{opt}</span>
                      </div>
                      {isAnswered && isCorrect && <CheckCircle2 className="w-6 h-6 text-emerald-300 shrink-0 mt-0.5" />}
                      {isAnswered && isSelected && !isCorrect && <XCircle className="w-6 h-6 text-rose-300 shrink-0 mt-0.5" />}
                    </button>
                  );
                })}
              </div>

              {/* Phản hồi giải thích */}
              {isAnswered && (
                <div className="p-4 sm:p-5 rounded-2xl bg-black/40 border border-amber-400/30 text-sm sm:text-base text-rose-100 space-y-2 animate-fadeIn">
                  <p className="font-bold text-amber-300 flex items-center gap-2 text-sm sm:text-base">
                    <span>💡 Lời giải mã lịch sử:</span>
                  </p>
                  <p className="leading-relaxed text-sm sm:text-base text-amber-100 font-medium">{currentQ.explanation}</p>
                </div>
              )}

              {/* Nút Câu hỏi tiếp theo hoặc Nhận Huy Hiệu */}
              {isAnswered && (
                <div className="pt-2 animate-fadeIn flex flex-col sm:flex-row items-center justify-end gap-3">
                  <button
                    onClick={handleNextQuestion}
                    className="w-full sm:w-auto py-3.5 px-9 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-[#7E1819] font-black text-sm sm:text-base shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer animate-pulse hover:scale-103"
                  >
                    <span>{currentIdx < questions.length - 1 ? `👉 Câu hỏi tiếp theo (${currentIdx + 2}/${questions.length})` : '🎉 Nhận Huy Hiệu Vinh Danh 🎖️'}</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Game Over / Chinh Phục Huy Hiệu & Đóng Dấu Hộ Chiếu Thành Công */
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-4 animate-fadeIn">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <div className="relative">
                  <div className={`w-20 h-20 rounded-3xl text-white flex items-center justify-center text-4xl shadow-2xl ring-4 ${
                    correctCount === questions.length
                      ? 'bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 text-[#7E1819] shadow-amber-500/30 ring-amber-300/40 animate-bounce'
                      : correctCount >= 3
                      ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-emerald-500/30 ring-emerald-300/40'
                      : 'bg-gradient-to-br from-orange-400 to-rose-600 shadow-rose-500/30 ring-rose-300/40'
                  }`}>
                    {correctCount === questions.length ? '🏆' : correctCount >= 3 ? '🎖️' : '💡'}
                  </div>
                  {correctCount >= 3 && <Sparkles className="w-6 h-6 text-amber-300 absolute -top-2 -right-2 animate-ping" />}
                </div>

                {/* Con dấu mộc đỏ chứng thực Hộ chiếu di sản số */}
                {correctCount >= 3 && (
                  <div className="relative animate-fadeIn">
                    <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full border-4 border-red-500/90 bg-red-950/60 p-2 flex flex-col items-center justify-center text-center text-red-300 shadow-2xl shadow-red-500/40 transform rotate-[-6deg] ring-4 ring-red-400/30">
                      <div className="w-full h-full rounded-full border-2 border-dashed border-red-400/80 flex flex-col items-center justify-center p-1.5">
                        <span className="text-[9px] uppercase font-black tracking-widest text-amber-300">★ ĐÃ ĐÓNG DẤU ★</span>
                        <span className="text-xs font-black text-white leading-tight line-clamp-1 max-w-[110px] my-1 drop-shadow-sm">
                          {monumentName}
                        </span>
                        <span className="text-[8px] text-red-200 uppercase font-black tracking-wider">HỘ CHIẾU DI SẢN</span>
                        <span className="text-[7px] text-amber-300 font-mono mt-0.5">TP. HỒ CHÍ MINH</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-1.5 max-w-xl">
                <div className={`inline-flex items-center gap-2 px-4 py-1 rounded-full border text-xs font-black uppercase tracking-wider ${
                  correctCount === questions.length
                    ? 'bg-amber-400/20 border-amber-400/50 text-amber-300'
                    : correctCount >= 3
                    ? 'bg-emerald-400/20 border-emerald-400/50 text-emerald-300'
                    : 'bg-rose-400/20 border-rose-400/50 text-rose-300'
                }`}>
                  <span>
                    {correctCount === questions.length
                      ? 'Huy Hiệu Nhà Thám Hiểm Xuất Sắc'
                      : correctCount >= 3
                      ? 'Nhà Khám Phá Di Sản Tiêu Biểu'
                      : 'Cần Cố Gắng Thêm'}
                  </span>
                </div>
                <h4 className="font-serif-title font-black text-2xl sm:text-3xl text-amber-200">
                  {correctCount === questions.length
                    ? `Xuất Sắc! Tuyệt Đối +${score} XP`
                    : correctCount >= 3
                    ? `Rất Tốt! Đạt +${score} XP`
                    : `Đạt +${score} XP (${correctCount}/${questions.length} Câu Đúng)`}
                </h4>
                <p className="text-xs sm:text-sm text-rose-100 leading-relaxed">
                  {correctCount === questions.length ? (
                    <>Em đã xuất sắc chinh phục trọn vẹn và <strong>đóng dấu đỏ thành công</strong> vào Hộ chiếu di sản của <strong>{monumentName}</strong>!</>
                  ) : correctCount >= 3 ? (
                    <>Em đã trả lời chính xác <strong>{correctCount}/{questions.length} câu hỏi</strong> và hoàn thành mở khóa di tích <strong>{monumentName}</strong>.</>
                  ) : (
                    <>Em đã trả lời đúng <strong>{correctCount}/{questions.length} câu hỏi</strong>. Hãy xem lại tư liệu và bấm nút bên dưới để chinh phục lại nhé!</>
                  )}
                </p>
              </div>

              {/* 2 NÚT HÀNH ĐỘNG SAU KHI XONG QUIZ: CUỘN ĐẾN ĐIỀU TRA & CHINH PHỤC LẠI */}
              <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={scrollToInvestigation}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-[#7E1819] font-black text-sm shadow-xl transition-all flex items-center gap-2 cursor-pointer hover:scale-105 transform duration-150 animate-bounce"
                >
                  <Compass className="w-5 h-5 text-[#7E1819]" />
                  <span>👉 BƯỚC 2: TIẾN TỚI HỒ SƠ ĐIỀU TRA DI SẢN (+300 XP)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={handleRestartMiniGame}
                  className="px-5 py-3 rounded-2xl bg-black/40 hover:bg-white/15 border border-white/20 text-amber-200 font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Chinh phục lại</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* PHẦN 2: 2 CỘT (HỒ SƠ ĐIỀU TRA & TÀI LIỆU CĂN CỨ LỊCH SỬ) */}
        {/* ========================================================================= */}
        <div id="investigation-box" className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch scroll-mt-24">
          
          {/* CỘT TRÁI: HỒ SƠ ĐIỀU TRA DI SẢN (7 CỘT) */}
          <div className="lg:col-span-7 bg-gradient-to-br from-[#FFFDF9] via-[#FAF5ED] to-[#F5ECE0] rounded-3xl p-6 sm:p-7 border-2 border-amber-300/80 shadow-md flex flex-col justify-between relative overflow-hidden">
            <div className="space-y-4">
              {/* Header Điều Tra */}
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#7E1819] to-[#9E1B1D] text-white flex items-center justify-center font-bold shrink-0 shadow-md border border-amber-300">
                  <FolderSearch className="w-6 h-6 text-amber-200" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif-title font-black text-base uppercase tracking-wider text-[#7E1819]">
                      HỒ SƠ ĐIỀU TRA DI SẢN
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-950 font-black text-[10px] uppercase">
                      Nhiệm Vụ 2
                    </span>
                  </div>
                  <p className="text-xs text-[#666]">Đóng vai nhà thám hiểm trẻ tuổi để phân tích và lập báo cáo khoa học</p>
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

            {/* NÚT BẮT ĐẦU ĐIỀU TRA */}
            <div className="pt-5">
              <button
                onClick={handleStartReport}
                className="w-full group relative py-4 px-5 rounded-2xl bg-gradient-to-r from-[#7E1819] via-[#9E1B1D] to-[#7E1819] hover:from-[#9E1B1D] hover:to-[#7E1819] text-white text-sm sm:text-base font-black shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2.5 cursor-pointer border-2 border-amber-400 overflow-hidden"
                title="Bấm để mở ngay Bảng Điều Tra & Phiếu Học Tập Lịch Sử"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Compass className="w-5 h-5 text-amber-300 group-hover:rotate-45 transition-transform duration-500" />
                <span>🔭 BẮT ĐẦU ĐIỀU TRA (+300 XP)</span>
                <ArrowRight className="w-5 h-5 text-amber-200 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* CỘT PHẢI: TÀI LIỆU & CĂN CỨ LỊCH SỬ (5 CỘT) */}
          <div
            onClick={() => {
              soundEffects.playTap();
              if (onOpenDocsModal) onOpenDocsModal();
            }}
            className="lg:col-span-5 bg-white rounded-3xl p-6 border-2 border-amber-200 hover:border-[#7E1819] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer group"
          >
            <div className="space-y-3.5">
              {/* Hình ảnh tư liệu */}
              <div className="h-44 rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 relative shadow-inner">
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
              <div className="space-y-2">
                <h4 className="font-serif-title font-black text-lg sm:text-xl text-[#2C241E] group-hover:text-[#7E1819] transition-colors flex items-center justify-between">
                  <span>Tài Liệu & Căn Cứ Lịch Sử</span>
                  <Bookmark className="w-5 h-5 text-[#7E1819]" />
                </h4>
                <p className="text-xs sm:text-sm text-[#555] leading-relaxed line-clamp-3">
                  {firstCitation}
                </p>
                {secondCitation && (
                  <p className="text-xs sm:text-sm text-[#777] leading-relaxed line-clamp-2">
                    • {secondCitation}
                  </p>
                )}
              </div>
            </div>

            {/* Footer Cột Phải */}
            <div className="pt-4 border-t border-[#F0EAE1] flex items-center justify-between text-xs sm:text-sm text-[#7E1819] font-bold">
              <span className="group-hover:underline">Tra cứu hồ sơ khoa học & văn bản &rarr;</span>
              <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PHẦN 3: SỔ TAY CAM KẾT HÀNH ĐỘNG & THÔNG ĐIỆP TỪ HỌC SINH */}
        {/* ========================================================================= */}
        <div id="investigation-action-pledge" className="mt-8 p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#FFFDF9] via-[#FAF5ED] to-[#F5ECE0] border-2 border-[#EADBC8] shadow-sm space-y-4 scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EADBC8]">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#A6732E] text-amber-100 flex items-center justify-center shadow-md">
                <Heart className="w-6 h-6 text-red-300 fill-red-300" />
              </div>
              <div>
                <h3 className="font-serif-title font-black text-base sm:text-lg text-[#7E1819] flex items-center gap-2">
                  <span>🌟 Thông Điệp Hành Động & Sổ Tay Cam Kết Từ Các Bạn Học Sinh</span>
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Cộng đồng
                  </span>
                </h3>
                <p className="text-xs text-[#6B5E55]">
                  Lời hứa và thông điệp tri ân gửi thế hệ tương lai sau khi hoàn thành hồ sơ điều tra di tích {monumentName}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                soundEffects.playUnlock();
                if (onOpenActionModal) onOpenActionModal();
              }}
              className="px-5 py-2.5 rounded-xl bg-[#A6732E] hover:bg-[#8C5D1E] text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 hover:scale-102"
            >
              <Leaf className="w-4 h-4 text-amber-200" />
              <span>✍️ Viết Cam Kết Của Em (+100 XP)</span>
            </button>
          </div>

          {/* Danh sách thông điệp hành động trực tiếp trên web */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 max-h-64 overflow-y-auto pr-1">
            {pledgesList.map((p, idx) => (
              <div 
                key={idx} 
                className="p-4 rounded-2xl bg-white border border-[#EADBC8] shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-2 animate-fadeIn"
              >
                <div className="flex items-center justify-between text-xs">
                  <strong className="text-[#7E1819] font-bold line-clamp-1">{p.name}</strong>
                  <span className="text-[10px] text-gray-400 font-medium shrink-0 ml-2">{p.time || 'Hôm nay'}</span>
                </div>
                <p className="text-xs text-[#4A3E36] leading-relaxed italic line-clamp-3">
                  "{p.text}"
                </p>
                <div className="pt-1 flex items-center gap-1 text-[10px] text-emerald-700 font-bold">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Đã ghi nhận trên Web & Google Sheet</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ScrollReveal>
  </section>
);
}

