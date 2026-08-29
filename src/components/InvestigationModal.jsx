import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  Sparkles, 
  RotateCcw, 
  RotateCw,
  BrainCircuit,
  Layers,
  HelpCircle,
  FolderSearch,
  Check,
  Trophy,
  Printer
} from 'lucide-react';
import confetti from 'canvas-confetti';

const comprehensiveQuiz = [
  {
    id: 1,
    question: "Trưa ngày 30/4/1975, chiếc xe tăng nào đã húc đổ cánh cổng chính của Dinh Độc Lập?",
    options: [
      "Xe tăng T59 mang số hiệu 390 do Trung úy Vũ Đăng Toàn làm trưởng xe",
      "Xe tăng T54 mang số hiệu 843 do Trung úy Bùi Quang Thận làm trưởng xe",
      "Xe tăng M41 của quân đội ngụy Sài Gòn",
      "Xe thiết giáp M113 của lực lượng Biệt động Sài Gòn"
    ],
    correctIndex: 0,
    explanation: "Xe tăng T59 số hiệu 390 (do Vũ Đăng Toàn làm trưởng xe) đã húc bật tung cánh cổng chính Dinh Độc Lập, trong khi xe tăng T54 số 843 (do Bùi Quang Thận làm trưởng xe) húc nghiêng cổng phụ. Cả hai xe đều là Bảo vật Quốc gia."
  },
  {
    id: 2,
    question: "Mặt bằng tổng thể của Dinh Độc Lập do Kiến trúc sư Ngô Viết Thụ thiết kế mang hình chữ gì trong chữ Hán?",
    options: [
      "Chữ CÁT (吉) - mang ý nghĩa may mắn, tốt lành và hưng thịnh",
      "Chữ ĐẠI (大) - mang ý nghĩa to lớn, hùng vĩ",
      "Chữ THẮNG (勝) - mang ý nghĩa toàn thắng",
      "Chữ TÂM (心) - mang ý nghĩa hòa bình nhân ái"
    ],
    correctIndex: 0,
    explanation: "Kiến trúc sư Ngô Viết Thụ đã phối hợp tài tình giữa nghệ thuật kiến trúc hiện đại và triết lý phong thủy phương Đông: toàn thể bình diện Dinh làm thành hình chữ CÁT (吉)."
  },
  {
    id: 3,
    question: "Hội nghị Hiệp thương chính trị thống nhất hai miền Nam - Bắc được tổ chức tại Dinh Độc Lập vào thời gian nào?",
    options: [
      "Tháng 11 và 12 năm 1975",
      "Ngày 30 tháng 4 năm 1975",
      "Ngày 2 tháng 9 năm 1976",
      "Tháng 1 năm 1973"
    ],
    correctIndex: 0,
    explanation: "Vào tháng 11–12/1975, Hội nghị Hiệp thương chính trị thống nhất đất nước được tổ chức trọng thể tại Hội trường chính Dinh Độc Lập, quyết định tổng tuyển cử bầu Quốc hội chung của cả nước."
  },
  {
    id: 4,
    question: "Hệ thống Địa đạo Củ Chi có cấu trúc mấy tầng ngầm xuyên trong lòng đất sét pha đá ong?",
    options: [
      "3 tầng ngầm (tầng trên cách 3m, tầng giữa 5-8m, tầng dưới sâu tới 8-12m)",
      "Chỉ có duy nhất 1 tầng ngầm ngắn",
      "2 tầng ngầm thông ra biển",
      "5 tầng ngầm đúc bê tông cốt thép"
    ],
    correctIndex: 0,
    explanation: "Địa đạo Củ Chi được đào kỳ công thành 3 tầng ngầm: tầng 1 chịu được đạn pháo và xe tăng, tầng 2 và tầng 3 sâu đến 12m chịu được bom cỡ nhỏ, liên hoàn cùng bếp Hoàng Cầm giấu khói và hầm chông."
  },
  {
    id: 5,
    question: "Ý nghĩa chiến lược quan trọng nhất của Chiến dịch Bình Giã (Đông - Xuân 1964 - 1965) là gì?",
    options: [
      "Làm thất bại về cơ bản chiến lược 'Chiến tranh đặc biệt' và chiến thuật trực thăng vận, thiết xa vận",
      "Kết thúc hoàn toàn chiến dịch giải phóng miền Nam",
      "Thành lập Mặt trận Dân tộc Giải phóng miền Nam",
      "Ký kết hiệp định Pa-ri lập lại hòa bình"
    ],
    correctIndex: 0,
    explanation: "Đại tướng Võ Nguyên Giáp khẳng định: 'Chiến thắng Bình Giã đánh dấu sự thất bại về cơ bản của chiến lược Chiến tranh đặc biệt', chứng minh bước trưởng thành vượt bậc của quân chủ lực Miền."
  }
];

const flashcardData = [
  {
    id: 1,
    tag: "Nhân vật lịch sử",
    front: "Ai là người đã kéo lá cờ giải phóng trên nóc Dinh Độc Lập lúc 11h30 trưa 30/4/1975?",
    back: "Trung úy Bùi Quang Thận (Đại đội trưởng Đại đội 4, Lữ đoàn xe tăng 203, Quân đoàn 2), trưởng xe tăng 843, đã chạy lên sân thượng hạ cờ đối phương và kéo cờ Mặt trận Dân tộc Giải phóng miền Nam Việt Nam.",
    badge: "Bảo vật Quốc gia"
  },
  {
    id: 2,
    tag: "Chiến tích xe tăng",
    front: "Vai trò lịch sử của kíp xe tăng T59 số hiệu 390 trong ngày 30/4/1975?",
    back: "Do Trung úy Vũ Đăng Toàn làm trưởng xe, xe tăng 390 đã dũng mãnh húc bật tung cánh cổng chính Dinh Độc Lập, mở đường tiến thẳng vào sân Dinh, trở thành biểu tượng bất diệt của ngày toàn thắng.",
    badge: "Bảo vật Quốc gia"
  },
  {
    id: 3,
    tag: "Nghệ thuật kiến trúc",
    front: "Kiến trúc sư Ngô Viết Thụ đã thiết kế rèm hoa đá ở mặt tiền Dinh Độc Lập mang hình ảnh gì?",
    back: "Mặt tiền Dinh được trang trí bằng rèm hoa đá hình các đốt trúc thanh nhã, tượng trưng cho khí tiết thanh cao của người quân tử, đồng thời đóng vai trò che nắng nhiệt đới và thông gió đối lưu tự nhiên.",
    badge: "KTS Khôi nguyên La Mã"
  },
  {
    id: 4,
    tag: "Sáng chế quân sự",
    front: "Bếp Hoàng Cầm trong hệ thống căn cứ và địa đạo có đặc điểm kỳ diệu gì?",
    back: "Bếp Hoàng Cầm dẫn khói qua hệ thống nhiều rãnh ngầm dài tỏa khói sát mặt đất như làn sương mỏng, giúp nấu chín thức ăn nóng hổi cho bộ đội giữa ban ngày mà máy bay địch không thể phát hiện khói lửa.",
    badge: "Sáng tạo Việt Nam"
  },
  {
    id: 5,
    tag: "Địa đạo Củ Chi",
    front: "Danh hiệu cao quý nào được trao tặng cho quân và dân Củ Chi sau những chiến công chống càn quét khốc liệt?",
    back: "Quân và dân Củ Chi vinh dự được Mặt trận Dân tộc Giải phóng miền Nam Việt Nam trao tặng danh hiệu 'Củ Chi đất thép thành đồng' nhờ mạng lưới địa đạo dài hơn 200km và hàng trăm trận đánh kiên cường.",
    badge: "Đất thép thành đồng"
  },
  {
    id: 6,
    tag: "Đặc công Rừng Sác",
    front: "Vì sao Căn cứ Rừng Sác Cần Giờ được mệnh danh là 'Pháo đài xanh' trên sông Lòng Tàu?",
    back: "Đoàn 10 Đặc công Rừng Sác đã bám trụ giữa rừng ngập mặn hiểm trở, đánh chìm hàng trăm tàu chiến, tàu chở vũ khí của địch trên sông Lòng Tàu và tập kích kho xăng dầu Nhà Bè, lập nên chiến công huyền thoại.",
    badge: "Anh hùng LLVTND"
  }
];

const matchingPairsInitial = [
  { id: 'p1', left: 'Bùi Quang Thận', right: 'Trưởng xe tăng 843, cắm cờ giải phóng trên nóc Dinh', matched: false },
  { id: 'p2', left: 'Vũ Đăng Toàn', right: 'Trưởng xe tăng 390 húc đổ cánh cổng chính Dinh Độc Lập', matched: false },
  { id: 'p3', left: 'Ngô Viết Thụ', right: 'KTS thiết kế Dinh Độc Lập theo hình chữ CÁT (吉)', matched: false },
  { id: 'p4', left: 'Nguyễn Thành Trung', right: 'Phi công lái F-5E ném bom Dinh Độc Lập ngày 8/4/1975', matched: false },
  { id: 'p5', left: 'Bếp Hoàng Cầm', right: 'Hệ thống bếp hầm dẫn khói ngầm tránh máy bay địch phát hiện', matched: false }
];

export default function InvestigationModal({
  isOpen,
  onClose,
  dossier,
  quiz = comprehensiveQuiz,
  monumentName = 'Dinh Độc Lập',
  mode = 'quiz', // 'dossier' | 'quiz' | 'flashcard' | 'matching'
  onSwitchToQuiz
}) {
  const [activeTab, setActiveTab] = useState(mode === 'dossier' ? 'dossier' : 'quiz');
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [badgeUnlocked, setBadgeUnlocked] = useState(false);
  
  // Flashcard state
  const [flashcardIdx, setFlashcardIdx] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  // Matching game state
  const [pairs, setPairs] = useState(matchingPairsInitial);
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [matchedCount, setMatchedCount] = useState(0);
  const [matchingMessage, setMatchingMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      setActiveTab(mode === 'dossier' ? 'dossier' : 'quiz');
      setSelectedAnswers({});
      setIsSubmitted(false);
      setBadgeUnlocked(false);
      setFlashcardIdx(0);
      setIsCardFlipped(false);
      setPairs(matchingPairsInitial.map(p => ({ ...p, matched: false })));
      setSelectedLeft(null);
      setSelectedRight(null);
      setMatchedCount(0);
      setMatchingMessage('');
    }
  }, [isOpen, mode]);

  // Quiz select
  const handleSelectOption = (questionId, optionIdx) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionIdx }));
  };

  // Submit quiz
  const handleCheckQuiz = () => {
    setIsSubmitted(true);
    let correctCount = 0;
    const questionsToGrade = quiz && quiz.length > 0 ? quiz : comprehensiveQuiz;
    questionsToGrade.forEach(q => {
      if (selectedAnswers[q.id] === q.correctIndex) correctCount++;
    });

    if (correctCount >= Math.ceil(questionsToGrade.length * 0.6)) {
      setBadgeUnlocked(true);
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  };

  // Matching game logic
  const handleSelectLeft = (pairId) => {
    setSelectedLeft(pairId);
    if (selectedRight) {
      checkMatch(pairId, selectedRight);
    }
  };

  const handleSelectRight = (pairId) => {
    setSelectedRight(pairId);
    if (selectedLeft) {
      checkMatch(selectedLeft, pairId);
    }
  };

  const checkMatch = (leftId, rightId) => {
    if (leftId === rightId) {
      setPairs(prev => prev.map(p => p.id === leftId ? { ...p, matched: true } : p));
      setMatchedCount(c => c + 1);
      setMatchingMessage('🎉 Chính xác! Bạn đã ghép đúng cặp tư liệu.');
      setSelectedLeft(null);
      setSelectedRight(null);

      if (matchedCount + 1 === pairs.length) {
        setBadgeUnlocked(true);
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }
    } else {
      setMatchingMessage('❌ Chưa chính xác. Hãy suy luận lại chứng cứ lịch sử!');
      setTimeout(() => {
        setSelectedLeft(null);
        setSelectedRight(null);
        setMatchingMessage('');
      }, 1200);
    }
  };

  if (!isOpen) return null;

  const currentQuestions = quiz && quiz.length > 0 ? quiz : comprehensiveQuiz;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#FAF7F2] w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl border border-[#EADBC8] flex flex-col max-h-[92vh] animate-scaleUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#7B1113] via-[#96171a] to-[#7B1113] text-white p-4 sm:p-5 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-400 text-[#7B1113] flex items-center justify-center font-bold shadow-md">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-300 bg-black/20 px-2.5 py-0.5 rounded-full">
                  Trung Tâm Điều Tra & Thử Thách Di Sản
                </span>
                {badgeUnlocked && (
                  <span className="text-[10px] bg-emerald-500 text-white font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Đã Mở Khóa Huy Hiệu
                  </span>
                )}
              </div>
              <h3 className="font-serif-title font-black text-lg sm:text-2xl text-white truncate max-w-[280px] sm:max-w-[500px]">
                Thử Thách: {monumentName}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white px-4 sm:px-6 py-2.5 border-b border-[#EADBC8] flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'quiz'
                  ? 'bg-[#7B1113] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <BrainCircuit className="w-3.5 h-3.5" />
              <span>1. Trắc Nghiệm ({currentQuestions.length} câu)</span>
            </button>

            <button
              onClick={() => setActiveTab('flashcard')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'flashcard'
                  ? 'bg-[#7B1113] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>2. Flashcards Lật Thẻ</span>
            </button>

            <button
              onClick={() => setActiveTab('matching')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'matching'
                  ? 'bg-[#7B1113] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>3. Ghép Nối Tư Liệu</span>
            </button>

            {dossier && (
              <button
                onClick={() => setActiveTab('dossier')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'dossier'
                    ? 'bg-[#7B1113] text-white shadow-xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FolderSearch className="w-3.5 h-3.5" />
                <span>4. Hồ Sơ Chứng Cứ</span>
              </button>
            )}
          </div>

          <div className="text-[11px] text-gray-500 font-medium">
            🎯 Đạt &ge;60% để nhận Huy hiệu vinh danh
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: MULTIPLE CHOICE QUIZ */}
          {activeTab === 'quiz' && (
            <div className="space-y-6">
              <div className="space-y-4">
                {currentQuestions.map((q, idx) => {
                  const selected = selectedAnswers[q.id];
                  const isCorrect = isSubmitted && selected === q.correctIndex;
                  const isWrong = isSubmitted && selected !== undefined && selected !== q.correctIndex;

                  return (
                    <div
                      key={q.id}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                        isCorrect
                          ? 'bg-emerald-50/80 border-emerald-300'
                          : isWrong
                          ? 'bg-rose-50/80 border-rose-300'
                          : 'bg-white border-[#EADBC8]'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="w-6 h-6 rounded-lg bg-[#7B1113] text-white flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <div className="flex-1">
                          {q.category && (
                            <span className="text-[10px] uppercase font-black text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md mb-1 inline-block">
                              {q.category}
                            </span>
                          )}
                          <h4 className="font-bold text-sm sm:text-base text-[#2C241E] leading-snug">
                            {q.question}
                          </h4>
                        </div>
                      </div>

                      <div className="mt-3 space-y-2 pl-8">
                        {q.options.map((opt, optIdx) => {
                          const isOptSelected = selected === optIdx;
                          const isOptCorrectAnswer = isSubmitted && optIdx === q.correctIndex;

                          let btnClass = "border-gray-200 hover:border-amber-400 bg-gray-50/60 text-[#4A3E36]";
                          if (isOptSelected && !isSubmitted) {
                            btnClass = "border-[#7B1113] bg-amber-100 text-[#7B1113] font-bold";
                          } else if (isSubmitted) {
                            if (isOptCorrectAnswer) {
                              btnClass = "border-emerald-500 bg-emerald-100 text-emerald-950 font-bold";
                            } else if (isOptSelected && !isOptCorrectAnswer) {
                              btnClass = "border-rose-400 bg-rose-100 text-rose-950 line-through";
                            }
                          }

                          return (
                            <button
                              key={optIdx}
                              onClick={() => handleSelectOption(q.id, optIdx)}
                              disabled={isSubmitted}
                              className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-between gap-2 ${btnClass}`}
                            >
                              <span>{opt}</span>
                              {isSubmitted && isOptCorrectAnswer && (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation */}
                      {isSubmitted && (
                        <div className="mt-3 ml-8 p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-[#6B5E55] leading-relaxed">
                          <strong>💡 Lời giải lịch sử:</strong> {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#EADBC8]">
                {!isSubmitted ? (
                  <button
                    onClick={handleCheckQuiz}
                    disabled={Object.keys(selectedAnswers).length < currentQuestions.length}
                    className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#7B1113] hover:bg-[#96171a] disabled:opacity-50 text-white font-bold text-sm shadow-md cursor-pointer transition-all hover:scale-105"
                  >
                    Nộp Bài & Chấm Điểm Thử Thách
                  </button>
                ) : (
                  <div className="flex items-center gap-3 w-full justify-between">
                    <span className="text-xs sm:text-sm font-bold text-[#7B1113]">
                      Kết quả: {currentQuestions.filter(q => selectedAnswers[q.id] === q.correctIndex).length} / {currentQuestions.length} câu đúng
                    </span>
                    <button
                      onClick={() => {
                        setIsSubmitted(false);
                        setSelectedAnswers({});
                      }}
                      className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-[#2C241E] text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Làm lại thử thách</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: FLASHCARDS INTERACTIVE */}
          {activeTab === 'flashcard' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500">
                  Thẻ ghi nhớ {flashcardIdx + 1} / {flashcardData.length}
                </span>
                <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2.5 py-1 rounded-full">
                  {flashcardData[flashcardIdx].badge}
                </span>
              </div>

              {/* 3D Interactive Flashcard */}
              <div
                onClick={() => setIsCardFlipped(!isCardFlipped)}
                className="w-full h-72 sm:h-80 perspective-1000 cursor-pointer group select-none"
              >
                <div
                  className={`relative w-full h-full duration-500 transform-style-3d transition-transform ${
                    isCardFlipped ? 'rotate-y-180' : ''
                  }`}
                >
                  {/* Front Card */}
                  <div className="absolute inset-0 w-full h-full backface-hidden rounded-3xl p-8 bg-gradient-to-br from-white to-amber-50/50 border-2 border-[#EADBC8] shadow-lg flex flex-col justify-between items-center text-center">
                    <div className="w-full flex justify-between items-center">
                      <span className="text-xs font-black uppercase tracking-wider text-[#7B1113] bg-red-100 px-3 py-1 rounded-full">
                        {flashcardData[flashcardIdx].tag}
                      </span>
                      <span className="text-xs text-gray-400 font-bold">Mặt câu hỏi</span>
                    </div>

                    <div className="space-y-3 px-4">
                      <h3 className="font-serif-title font-bold text-lg sm:text-2xl text-[#2C241E] leading-snug">
                        {flashcardData[flashcardIdx].front}
                      </h3>
                      <p className="text-xs text-gray-500 italic">
                        (Bấm vào thẻ để lật xem tư liệu lịch sử giải đáp)
                      </p>
                    </div>

                    <div className="text-xs text-[#7B1113] font-bold flex items-center gap-1.5">
                      <RotateCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                      <span>Lật mặt sau</span>
                    </div>
                  </div>

                  {/* Back Card */}
                  <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-3xl p-8 bg-gradient-to-br from-[#7B1113] to-[#500b0d] text-white shadow-xl flex flex-col justify-between items-center text-center border-2 border-amber-300">
                    <div className="w-full flex justify-between items-center border-b border-white/20 pb-2">
                      <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                        {flashcardData[flashcardIdx].tag} • Tư liệu chuẩn xác
                      </span>
                      <span className="text-xs bg-white/20 px-2.5 py-0.5 rounded-full font-bold">
                        Đã giải mã
                      </span>
                    </div>

                    <div className="space-y-3 px-2">
                      <p className="text-sm sm:text-base text-amber-100 font-medium leading-relaxed">
                        {flashcardData[flashcardIdx].back}
                      </p>
                    </div>

                    <div className="text-xs text-white/80 font-bold flex items-center gap-1.5">
                      <RotateCw className="w-4 h-4" />
                      <span>Bấm để lật lại mặt trước</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => {
                    setIsCardFlipped(false);
                    setFlashcardIdx(i => Math.max(0, i - 1));
                  }}
                  disabled={flashcardIdx === 0}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-xs font-bold disabled:opacity-40 cursor-pointer"
                >
                  ← Thẻ trước
                </button>

                <div className="flex gap-1.5">
                  {flashcardData.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setIsCardFlipped(false);
                        setFlashcardIdx(idx);
                      }}
                      className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
                        idx === flashcardIdx ? 'bg-[#7B1113] w-6' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={() => {
                    setIsCardFlipped(false);
                    setFlashcardIdx(i => Math.min(flashcardData.length - 1, i + 1));
                  }}
                  disabled={flashcardIdx === flashcardData.length - 1}
                  className="px-4 py-2 rounded-xl bg-[#7B1113] text-white text-xs font-bold disabled:opacity-40 cursor-pointer"
                >
                  Thẻ tiếp theo →
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: MATCHING CHALLENGE */}
          {activeTab === 'matching' && (
            <div className="space-y-5">
              <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200 text-xs text-[#6B5E55] flex items-center justify-between">
                <span>🧩 Chọn 1 thẻ bên trái rồi chọn thẻ giải nghĩa tương ứng bên phải để ghép đôi.</span>
                <span className="font-black text-[#7B1113]">Đã ghép: {matchedCount} / {pairs.length}</span>
              </div>

              {matchingMessage && (
                <div className={`p-2.5 rounded-xl text-xs font-bold text-center animate-fadeIn ${
                  matchingMessage.includes('Chính xác') ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-rose-100 text-rose-900 border border-rose-300'
                }`}>
                  {matchingMessage}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Left Column: Nhân vật / Khái niệm */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#7B1113]">
                    Cột A: Nhân vật & Hiện vật
                  </h4>
                  {pairs.map((p) => {
                    const isSelected = selectedLeft === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => !p.matched && handleSelectLeft(p.id)}
                        disabled={p.matched}
                        className={`w-full text-left p-3.5 rounded-2xl border text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-between ${
                          p.matched
                            ? 'bg-emerald-100 border-emerald-400 text-emerald-900 opacity-80'
                            : isSelected
                            ? 'bg-amber-200 border-[#7B1113] text-[#7B1113] ring-2 ring-[#7B1113]/30 scale-[1.02]'
                            : 'bg-white border-gray-200 hover:border-amber-400 text-[#2C241E]'
                        }`}
                      >
                        <span>{p.left}</span>
                        {p.matched && <Check className="w-4 h-4 text-emerald-600" />}
                      </button>
                    );
                  })}
                </div>

                {/* Right Column: Ý nghĩa / Vai trò */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#7B1113]">
                    Cột B: Chiến công & Ý nghĩa lịch sử
                  </h4>
                  {pairs.map((p) => {
                    const isSelected = selectedRight === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => !p.matched && handleSelectRight(p.id)}
                        disabled={p.matched}
                        className={`w-full text-left p-3.5 rounded-2xl border text-xs leading-relaxed transition-all cursor-pointer flex items-center justify-between ${
                          p.matched
                            ? 'bg-emerald-100 border-emerald-400 text-emerald-900 font-bold opacity-80'
                            : isSelected
                            ? 'bg-amber-200 border-[#7B1113] text-[#7B1113] font-bold ring-2 ring-[#7B1113]/30 scale-[1.02]'
                            : 'bg-white border-gray-200 hover:border-amber-400 text-[#4A3E36]'
                        }`}
                      >
                        <span>{p.right}</span>
                        {p.matched && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {matchedCount === pairs.length && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-center space-y-2">
                  <h4 className="font-bold text-emerald-900 text-sm sm:text-base">
                    🎉 Xuất sắc! Bạn đã hoàn thành trọn vẹn thử thách ghép nối tư liệu!
                  </h4>
                  <p className="text-xs text-emerald-700">
                    Bạn đã mở khóa chứng chỉ Nhà Sử Học Trẻ.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: INVESTIGATION DOSSIER */}
          {activeTab === 'dossier' && dossier && (
            <div className="space-y-5">
              <div className="rounded-3xl overflow-hidden aspect-[16/9] bg-gray-100 border border-[#EADBC8] shadow-sm">
                <img
                  src={dossier.image}
                  alt={dossier.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-2">
                <h4 className="font-serif-title font-black text-xl text-[#7B1113]">
                  {dossier.title} - Hồ sơ điều tra chuyên sâu
                </h4>
                <p className="text-xs sm:text-sm text-[#4A3E36] leading-relaxed">
                  {dossier.detail}
                </p>
              </div>

              {/* Clues */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                <div className="text-xs font-black text-[#7B1113] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Manh mối & Chứng cứ lịch sử xác thực</span>
                </div>
                <ul className="space-y-1.5 text-xs text-[#5A4D44]">
                  {dossier.clues && dossier.clues.map((clue, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#7B1113] font-black">•</span>
                      <span>{clue}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* UNLOCKED BADGE & CERTIFICATE BANNER */}
          {badgeUnlocked && (
            <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-amber-950 shadow-xl border-2 border-white space-y-4 animate-scaleUp">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white text-[#7B1113] flex items-center justify-center text-3xl shadow-md shrink-0">
                    🎖️
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest bg-black/15 px-2.5 py-0.5 rounded-full text-amber-950">
                      Chứng nhận vinh danh
                    </span>
                    <h3 className="font-serif-title font-black text-xl text-[#7B1113]">
                      Huy Hiệu: Nhà Sử Học Trẻ Xuất Sắc
                    </h3>
                    <p className="text-xs text-amber-900 font-medium">
                      Đã hoàn thành xuất sắc thử thách giải mã lịch sử {monumentName} và hệ thống Di sản số TP.HCM.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => window.print()}
                  className="px-4 py-2.5 rounded-xl bg-[#7B1113] text-white text-xs font-bold shadow-md hover:bg-[#96171a] cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  <Printer className="w-4 h-4" />
                  <span>In Chứng Nhận</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FAF0E6] border-t border-[#EADBC8] flex items-center justify-between text-xs text-[#8C7A6B]">
          <span>Hệ thống thử thách học tập lịch sử số TP.HCM</span>
          <span className="font-bold text-[#7B1113]">Khám Phá Di Sản Số</span>
        </div>
      </div>
    </div>
  );
}
