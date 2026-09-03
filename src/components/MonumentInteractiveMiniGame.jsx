import React, { useState, useEffect } from 'react';
import { 
  Gamepad2, 
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
  Check
} from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export default function MonumentInteractiveMiniGame({
  quiz = [],
  monumentName = 'Di tích lịch sử',
  onOpenNextMonument
}) {
  // Safe default questions if quiz is missing
  const defaultQuestions = [
    {
      id: 1,
      category: 'Sự kiện lịch sử',
      question: `Sự kiện lịch sử nổi bật nhất gắn liền với di tích "${monumentName}" là gì?`,
      options: [
        `Các mốc son đấu tranh hào hùng và dấu ấn lịch sử hào hùng của dân tộc tại TP.HCM`,
        'Một cuộc triển lãm thương mại tạm thời',
        'Công trình phục vụ giải trí thuần túy',
        'Địa điểm tổ chức hội chợ thường niên'
      ],
      correctIndex: 0,
      explanation: `Di tích ${monumentName} là nơi ghi dấu những sự kiện lịch sử quan trọng, lưu giữ ký ức tự hào của các thế hệ cha anh.`
    },
    {
      id: 2,
      category: 'Nhân vật & Hiện vật',
      question: `Nhân vật lịch sử hoặc hiện vật tiêu biểu gắn liền với "${monumentName}" thể hiện điều gì?`,
      options: [
        'Tinh thần kiên cường bất khuất, sự cống hiến và di sản văn hóa quý báu cho thế hệ mai sau',
        'Những câu chuyện truyền thuyết không có thật',
        'Các trào lưu giải trí ngắn hạn',
        'Không có giá trị lịch sử cụ thể nào'
      ],
      correctIndex: 0,
      explanation: `Mỗi hiện vật và câu chuyện về nhân vật tại ${monumentName} đều là chứng nhân lịch sử vô giá.`
    },
    {
      id: 3,
      category: 'Ý nghĩa & Hành động',
      question: 'Sau khi xem video và nghe thuyết minh, học sinh chúng ta nên làm gì để phát huy giá trị di sản?',
      options: [
        'Tìm hiểu lịch sử, bảo vệ cảnh quan di tích và tích cực chia sẻ niềm tự hào di sản đến bạn bè',
        'Vẽ bậy, khắc tên lên tường và hiện vật',
        'Tùy tiện mang các hiện vật trưng bày về nhà',
        'Thờ ơ, không quan tâm đến các giá trị truyền thống'
      ],
      correctIndex: 0,
      explanation: 'Gìn giữ và lan tỏa tình yêu di sản là trách nhiệm cao đẹp của mỗi học sinh chúng ta.'
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

  // Reset state when monumentName or quiz changes
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
      const earnedXP = 100 + streak * 20;
      setScore(prev => prev + earnedXP);
      newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);
    } else {
      setStreak(0);
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
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsGameOver(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setIsGameOver(false);
    setHistoryAnswers([]);
  };

  // Badge calculation
  const totalQuestions = questions.length;
  const correctCount = historyAnswers.filter(a => a.isCorrect).length;
  const percentage = Math.round((correctCount / totalQuestions) * 100);

  let badge = {
    title: 'Tập Sự Điều Tra Di Sản',
    icon: '🔭',
    rank: 'Huy Hiệu Đồng',
    color: 'from-amber-700 to-amber-900',
    desc: 'Em đã bước đầu tìm hiểu di tích! Hãy xem lại video và thuyết minh để đạt điểm số cao hơn nhé.'
  };

  if (percentage === 100) {
    badge = {
      title: 'Bậc Thầy Di Sản Số',
      icon: '👑',
      rank: 'Huy Hiệu Hoàng Gia',
      color: 'from-amber-400 via-amber-500 to-yellow-600',
      desc: 'Xuất sắc tuyệt đối! Em đã ghi nhớ trọn vẹn mọi sự kiện, hiện vật và mốc son lịch sử của di tích!'
    };
  } else if (percentage >= 80) {
    badge = {
      title: 'Chuyên Gia Lịch Sử Sài Gòn',
      icon: '🎖️',
      rank: 'Huy Hiệu Vàng',
      color: 'from-amber-500 to-amber-700',
      desc: 'Tuyệt vời! Em có sự hiểu biết rất sâu sắc và khả năng quan sát di sản đáng khen ngợi.'
    };
  } else if (percentage >= 60) {
    badge = {
      title: 'Nhà Thám Hiểm Di Sản Nhí',
      icon: '🏅',
      rank: 'Huy Hiệu Bạc',
      color: 'from-stone-400 to-stone-600',
      desc: 'Rất tốt! Em đã nắm vững các thông tin cốt lõi nhất của di tích lịch sử này.'
    };
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <ScrollReveal>
        <div className="bg-gradient-to-br from-[#2D0A0D] via-[#4A0A0C] to-[#630E11] text-white rounded-3xl p-5 sm:p-7 md:p-9 border-2 border-rose-900/60 shadow-2xl relative overflow-hidden">
          {/* Background Decorative Shapes */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Bar: Title & Live Stats */}
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-5 border-b border-white/15">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[11px] font-black uppercase tracking-wider">
                <Gamepad2 className="w-3.5 h-3.5 text-amber-300" />
                <span>Trò Chơi Tương Tác Sau Khi Xem Video &amp; Nghe Audio</span>
              </div>
              <h2 className="font-serif-title font-black text-xl sm:text-2xl md:text-3xl text-amber-100">
                Thử Thách Đố Vui &amp; Chinh Phục Huy Hiệu
              </h2>
              <p className="text-xs sm:text-sm text-rose-100/90">
                Khảo sát trí nhớ và khám phá những điều thú vị về <strong className="text-white">{monumentName}</strong>
              </p>
            </div>

            {/* Live Score & Progress Pills */}
            {!isGameOver && (
              <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                {/* XP Score */}
                <div className="bg-black/40 border border-white/20 px-3.5 py-1.5 rounded-2xl flex items-center gap-2 backdrop-blur-md">
                  <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                  <div>
                    <span className="text-[10px] text-stone-300 uppercase block font-semibold leading-none">Điểm XP</span>
                    <span className="text-sm sm:text-base font-black text-amber-300">{score}</span>
                  </div>
                </div>

                {/* Streak Combo */}
                {streak > 1 && (
                  <div className="bg-gradient-to-r from-amber-500 to-rose-600 px-3 py-1.5 rounded-2xl flex items-center gap-1.5 shadow-lg animate-bounce">
                    <Flame className="w-4 h-4 text-yellow-200 fill-yellow-200" />
                    <span className="text-xs font-black text-white uppercase">Combo x{streak}!</span>
                  </div>
                )}

                {/* Question counter */}
                <div className="bg-white/15 border border-white/20 px-3.5 py-1.5 rounded-2xl text-xs font-bold text-white">
                  Câu {currentIdx + 1}/{questions.length}
                </div>
              </div>
            )}
          </div>

          {/* GAME BODY */}
          <div className="relative z-10 pt-6">
            {!isGameOver ? (
              <div className="space-y-6">
                {/* Question Progress Bar */}
                <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden border border-white/10">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-400 to-amber-200 transition-all duration-500 rounded-full"
                    style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
                  />
                </div>

                {/* Question Box */}
                <div className="bg-black/30 border border-white/20 rounded-2xl p-4 sm:p-6 backdrop-blur-md space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg bg-[#8B1417] text-amber-200 text-[10px] font-black uppercase tracking-wider border border-amber-400/30">
                      {currentQ.category || 'Câu hỏi lịch sử'}
                    </span>
                    <span className="text-xs text-rose-200 font-medium">
                      (Chọn 1 phương án đúng nhất)
                    </span>
                  </div>

                  <h3 className="font-serif-title font-bold text-base sm:text-lg md:text-xl text-white leading-relaxed">
                    {currentQ.question}
                  </h3>
                </div>

                {/* 4 Options Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentQ.options.map((opt, optIdx) => {
                    const isSelected = selectedOption === optIdx;
                    const isCorrectOption = optIdx === currentQ.correctIndex;
                    
                    let btnStyle = 'bg-white/10 hover:bg-white/20 border-white/20 text-white hover:border-amber-300';
                    let iconState = null;

                    if (isAnswered) {
                      if (isCorrectOption) {
                        btnStyle = 'bg-emerald-600/90 border-emerald-400 text-white ring-2 ring-emerald-400/50 shadow-lg shadow-emerald-950/50';
                        iconState = <CheckCircle2 className="w-5 h-5 text-white shrink-0" />;
                      } else if (isSelected) {
                        btnStyle = 'bg-rose-700/90 border-rose-400 text-white ring-2 ring-rose-400/50 shadow-lg shadow-red-950/50';
                        iconState = <XCircle className="w-5 h-5 text-white shrink-0" />;
                      } else {
                        btnStyle = 'bg-black/20 border-white/10 text-stone-400 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={isAnswered}
                        onClick={() => handleSelectOption(optIdx)}
                        className={`p-4 rounded-2xl border-2 text-left transition-all duration-300 flex items-start gap-3 cursor-pointer group ${btnStyle}`}
                      >
                        <span className="w-6 h-6 rounded-full bg-white/20 group-hover:bg-amber-400 group-hover:text-[#2D0A0D] flex items-center justify-center font-bold text-xs shrink-0 transition-colors">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="text-xs sm:text-sm font-medium leading-relaxed flex-1">
                          {opt}
                        </span>
                        {iconState}
                      </button>
                    );
                  })}
                </div>

                {/* Answer Feedback & Explanation Box */}
                {isAnswered && (
                  <div className={`p-4 sm:p-5 rounded-2xl border-2 animate-fadeIn space-y-3 ${
                    selectedOption === currentQ.correctIndex
                      ? 'bg-emerald-950/70 border-emerald-500/80 text-emerald-100'
                      : 'bg-rose-950/70 border-rose-500/80 text-rose-100'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {selectedOption === currentQ.correctIndex ? (
                          <>
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            <span className="font-bold text-sm text-emerald-300">Chính xác! +100 XP 🎉</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-5 h-5 text-rose-400" />
                            <span className="font-bold text-sm text-rose-300">Chưa chính xác! Hãy đọc giải thích bên dưới nhé.</span>
                          </>
                        )}
                      </div>

                      <button
                        onClick={handleNextQuestion}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-[#2D0A0D] font-black text-xs sm:text-sm shadow-md transition-all hover:scale-104 cursor-pointer flex items-center gap-1.5"
                      >
                        <span>{currentIdx < questions.length - 1 ? 'Câu tiếp theo' : 'Xem kết quả'}</span>
                        <ArrowRight className="w-4 h-4 text-[#2D0A0D]" />
                      </button>
                    </div>

                    {currentQ.explanation && (
                      <div className="text-xs leading-relaxed pt-2 border-t border-white/10 text-justify text-white/90">
                        <strong className="text-amber-200">💡 Giải thích lịch sử: </strong>
                        {currentQ.explanation}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* VICTORY / RESULTS CELEBRATION SCREEN */
              <div className="text-center space-y-6 max-w-2xl mx-auto py-4 animate-scaleUp">
                {/* Giant Badge */}
                <div className="relative inline-block">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-600 flex items-center justify-center text-4xl sm:text-5xl shadow-2xl mx-auto border-4 border-white/40 ring-8 ring-amber-400/30 animate-bounce">
                    {badge.icon}
                  </div>
                  <div className="absolute -bottom-2 -right-2 px-3 py-0.5 rounded-full bg-[#8B1417] text-amber-200 text-[10px] font-black uppercase tracking-wider border border-amber-300 shadow-md">
                    {badge.rank}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-serif-title font-black text-2xl sm:text-3xl md:text-4xl text-amber-100">
                    {badge.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-rose-100/90 leading-relaxed max-w-lg mx-auto">
                    {badge.desc}
                  </p>
                </div>

                {/* Score Summary Card */}
                <div className="grid grid-cols-3 gap-3 bg-black/40 border border-white/20 p-4 rounded-2xl backdrop-blur-md">
                  <div className="space-y-1">
                    <span className="text-[10px] sm:text-xs text-stone-300 block">Đúng</span>
                    <span className="text-lg sm:text-2xl font-black text-emerald-400">{correctCount}/{totalQuestions}</span>
                  </div>
                  <div className="space-y-1 border-x border-white/15">
                    <span className="text-[10px] sm:text-xs text-stone-300 block">Tổng Điểm XP</span>
                    <span className="text-lg sm:text-2xl font-black text-amber-300">{score}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] sm:text-xs text-stone-300 block">Chuỗi Đúng Max</span>
                    <span className="text-lg sm:text-2xl font-black text-rose-400">x{maxStreak} 🔥</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    onClick={handleRestart}
                    className="px-6 py-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs sm:text-sm border border-white/30 shadow-md transition-all hover:scale-103 cursor-pointer flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4 text-amber-300" />
                    <span>Chơi lại thử thách</span>
                  </button>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      setCopiedLink(true);
                      setTimeout(() => setCopiedLink(false), 2000);
                    }}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#8B1417] to-[#B31D21] hover:from-[#731013] hover:to-[#96171a] text-white font-bold text-xs sm:text-sm border border-amber-400/40 shadow-xl transition-all hover:scale-103 cursor-pointer flex items-center gap-2"
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
