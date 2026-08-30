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

const defaultFallbackQuiz = [
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
  }
];

const defaultFallbackFlashcards = [
  {
    id: 1,
    tag: "Nhân vật lịch sử",
    front: "Ai là người đã kéo lá cờ giải phóng trên nóc Dinh Độc Lập lúc 11h30 trưa 30/4/1975?",
    back: "Trung úy Bùi Quang Thận (Đại đội trưởng Đại đội 4, Lữ đoàn xe tăng 203, Quân đoàn 2), trưởng xe tăng 843, đã chạy lên sân thượng hạ cờ đối phương và kéo cờ Mặt trận Dân tộc Giải phóng miền Nam Việt Nam.",
    badge: "Bảo vật Quốc gia"
  }
];

const defaultFallbackMatching = [
  { id: 'p1', left: 'Bùi Quang Thận', right: 'Trưởng xe tăng 843, cắm cờ giải phóng trên nóc Dinh', matched: false }
];

export default function InvestigationModal({
  isOpen,
  onClose,
  dossier,
  quiz,
  flashcards,
  matchingPairs,
  monumentName = 'Di tích Lịch sử',
  mode = 'quiz', // 'dossier' | 'quiz' | 'flashcard' | 'matching'
  onSwitchToQuiz
}) {
  const currentQuestions = quiz && quiz.length > 0 ? quiz : defaultFallbackQuiz;
  const currentFlashcards = flashcards && flashcards.length > 0 ? flashcards : defaultFallbackFlashcards;
  const initialMatching = matchingPairs && matchingPairs.length > 0 ? matchingPairs : defaultFallbackMatching;

  const [activeTab, setActiveTab] = useState(mode === 'dossier' ? 'dossier' : 'quiz');
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [badgeUnlocked, setBadgeUnlocked] = useState(false);
  
  // Flashcard state
  const [flashcardIdx, setFlashcardIdx] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  // Matching game state
  const [pairs, setPairs] = useState(() => initialMatching.map(p => ({ ...p, matched: false })));
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
      setPairs((matchingPairs && matchingPairs.length > 0 ? matchingPairs : defaultFallbackMatching).map(p => ({ ...p, matched: false })));
      setSelectedLeft(null);
      setSelectedRight(null);
      setMatchedCount(0);
      setMatchingMessage('');
    }
  }, [isOpen, mode, matchingPairs]);

  // Quiz select
  const handleSelectOption = (questionId, optionIdx) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionIdx }));
  };

  // Submit quiz
  const handleCheckQuiz = () => {
    setIsSubmitted(true);
    let correctCount = 0;
    currentQuestions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctIndex) correctCount++;
    });

    if (correctCount >= Math.ceil(currentQuestions.length * 0.6)) {
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
      setMatchedCount(c => {
        const next = c + 1;
        if (next === (matchingPairs && matchingPairs.length > 0 ? matchingPairs.length : defaultFallbackMatching.length)) {
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        }
        return next;
      });
      setMatchingMessage('🎉 Chính xác! Bạn đã ghép đúng cặp tư liệu.');
      setSelectedLeft(null);
      setSelectedRight(null);
    } else {
      setMatchingMessage('❌ Chưa chính xác. Vui lòng đọc kỹ thông tin và thử lại!');
      setTimeout(() => {
        setSelectedLeft(null);
        setSelectedRight(null);
        setMatchingMessage('');
      }, 1200);
    }
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#FAF7F2] w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl border border-[#EADBC8] flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#7E1819] text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-amber-200 shadow-inner">
              <FolderSearch className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-black tracking-widest text-amber-300">
                  HỒ SƠ ĐIỀU TRA DI TÍCH
                </span>
                <span className="px-2 py-0.2 rounded-full bg-emerald-600 text-white text-[9px] font-bold">
                  {monumentName}
                </span>
              </div>
              <h2 className="font-serif-title font-bold text-base sm:text-xl text-white">
                Giải Mã Tư Liệu & Thử Thách Di Sản
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="bg-[#F0EAE1] px-4 sm:px-6 pt-3 border-b border-[#E0D5C5] flex gap-2 overflow-x-auto">
          {dossier && (
            <button
              onClick={() => setActiveTab('dossier')}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-t-xl transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'dossier'
                  ? 'bg-[#FAF7F2] text-[#7E1819] border-t-2 border-[#7E1819]'
                  : 'text-gray-600 hover:text-[#7E1819]'
              }`}
            >
              <FolderSearch className="w-4 h-4" />
              <span>Chứng cứ hồ sơ</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-t-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'quiz'
                ? 'bg-[#FAF7F2] text-[#7E1819] border-t-2 border-[#7E1819]'
                : 'text-gray-600 hover:text-[#7E1819]'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Thử thách 5 câu hỏi</span>
          </button>

          <button
            onClick={() => setActiveTab('flashcard')}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-t-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'flashcard'
                ? 'bg-[#FAF7F2] text-[#7E1819] border-t-2 border-[#7E1819]'
                : 'text-gray-600 hover:text-[#7E1819]'
            }`}
          >
            <BrainCircuit className="w-4 h-4" />
            <span>Flashcard ({currentFlashcards.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('matching')}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-t-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'matching'
                ? 'bg-[#FAF7F2] text-[#7E1819] border-t-2 border-[#7E1819]'
                : 'text-gray-600 hover:text-[#7E1819]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Ghép nối tư liệu</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 0: DOSSIER CLUES DETAIL */}
          {activeTab === 'dossier' && dossier && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="rounded-2xl overflow-hidden shadow-md border border-[#EADBC8]">
                  <img
                    src={dossier.image}
                    alt={dossier.title}
                    className="w-full h-64 object-cover"
                  />
                </div>
                <div className="space-y-3">
                  <span className="text-xs font-black uppercase text-[#7E1819] bg-red-100 px-3 py-1 rounded-full">
                    {dossier.title}
                  </span>
                  <h3 className="font-serif-title font-black text-xl sm:text-2xl text-[#2C241E]">
                    {dossier.subtitle || dossier.title}
                  </h3>
                  <p className="text-sm text-[#4A3E36] leading-relaxed">
                    {dossier.detail}
                  </p>
                </div>
              </div>

              {/* Clues bullet points */}
              {dossier.clues && dossier.clues.length > 0 && (
                <div className="p-4 rounded-2xl bg-white border border-[#EADBC8] shadow-xs space-y-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#7E1819] flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Dữ kiện và chứng cứ lịch sử cần lưu ý:</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-[#4A3E36]">
                    {dossier.clues.map((clue, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{clue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="text-center pt-2">
                <button
                  onClick={() => setActiveTab('quiz')}
                  className="px-6 py-2.5 rounded-xl bg-[#7E1819] hover:bg-[#96171a] text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-105 cursor-pointer"
                >
                  Bắt đầu làm bài thử thách nhận huy hiệu &gt;
                </button>
              </div>
            </div>
          )}

          {/* TAB 1: 5 QUESTIONS QUIZ */}
          {activeTab === 'quiz' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#EADBC8]">
                <div>
                  <h3 className="font-serif-title font-black text-lg text-[#2C241E]">
                    Thử Thách 5 Câu Hỏi: {monumentName}
                  </h3>
                  <p className="text-xs text-[#7A6B60]">
                    Hoàn thành bài khảo sát để mở khóa Huy hiệu danh dự "Nhà sử học trẻ"!
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-[#7E1819]">
                    Đã trả lời: {Object.keys(selectedAnswers).length} / {currentQuestions.length}
                  </span>
                </div>
              </div>

              {/* Questions List */}
              <div className="space-y-6">
                {currentQuestions.map((q, idx) => {
                  const selectedIdx = selectedAnswers[q.id];
                  const isCorrect = selectedIdx === q.correctIndex;
                  return (
                    <div
                      key={q.id || idx}
                      className="p-4 sm:p-5 rounded-2xl bg-white border border-[#EADBC8] shadow-xs space-y-3"
                    >
                      <div className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-[#7E1819] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <div className="flex-1">
                          {q.category && (
                            <span className="text-[10px] font-bold uppercase text-[#7E1819] bg-red-50 px-2 py-0.5 rounded-md mr-2">
                              {q.category}
                            </span>
                          )}
                          <h4 className="font-serif-title font-bold text-sm sm:text-base text-[#2C241E] inline">
                            {q.question}
                          </h4>
                        </div>
                      </div>

                      {/* Options */}
                      <div className="grid grid-cols-1 gap-2 pl-0 sm:pl-9">
                        {q.options.map((opt, optIdx) => {
                          const isSelected = selectedIdx === optIdx;
                          let btnStyle = "border-gray-200 hover:border-[#7E1819] hover:bg-amber-50/50 text-[#4A3E36]";
                          if (isSubmitted) {
                            if (optIdx === q.correctIndex) {
                              btnStyle = "border-emerald-500 bg-emerald-50 text-emerald-900 font-bold";
                            } else if (isSelected && !isCorrect) {
                              btnStyle = "border-red-500 bg-red-50 text-red-900 font-bold";
                            } else {
                              btnStyle = "opacity-60 border-gray-200";
                            }
                          } else if (isSelected) {
                            btnStyle = "border-[#7E1819] bg-red-50 text-[#7E1819] font-bold shadow-xs";
                          }

                          return (
                            <button
                              key={optIdx}
                              disabled={isSubmitted}
                              onClick={() => handleSelectOption(q.id, optIdx)}
                              className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                            >
                              <span>{opt}</span>
                              {isSubmitted && optIdx === q.correctIndex && (
                                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation */}
                      {isSubmitted && (
                        <div className="mt-3 ml-0 sm:ml-9 p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-[#6B5E55] leading-relaxed">
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
                    className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#7E1819] hover:bg-[#911d1e] disabled:opacity-50 text-white font-bold text-sm shadow-md cursor-pointer transition-all hover:scale-105"
                  >
                    Nộp Bài & Chấm Điểm Thử Thách
                  </button>
                ) : (
                  <div className="flex items-center gap-3 w-full justify-between">
                    <span className="text-xs sm:text-sm font-bold text-[#7E1819]">
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

          {/* TAB 2: FLASHCARDS INTERACTIVE (Tailored per Monument) */}
          {activeTab === 'flashcard' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500">
                  Thẻ ghi nhớ {flashcardIdx + 1} / {currentFlashcards.length}
                </span>
                <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2.5 py-1 rounded-full">
                  {currentFlashcards[flashcardIdx]?.badge || 'Di tích số'}
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
                      <span className="text-xs font-black uppercase tracking-wider text-[#7E1819] bg-red-100 px-3 py-1 rounded-full">
                        {currentFlashcards[flashcardIdx]?.tag || 'Hồ sơ'}
                      </span>
                      <span className="text-xs text-gray-400 font-bold">Mặt câu hỏi</span>
                    </div>

                    <div className="space-y-3 px-4">
                      <h3 className="font-serif-title font-bold text-lg sm:text-2xl text-[#2C241E] leading-snug">
                        {currentFlashcards[flashcardIdx]?.front}
                      </h3>
                      <p className="text-xs text-gray-500 italic">
                        (Bấm vào thẻ để lật xem tư liệu lịch sử giải đáp)
                      </p>
                    </div>

                    <div className="text-xs text-[#7E1819] font-bold flex items-center gap-1.5">
                      <RotateCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                      <span>Lật mặt sau</span>
                    </div>
                  </div>

                  {/* Back Card */}
                  <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-3xl p-8 bg-gradient-to-br from-[#7E1819] to-[#500b0d] text-white shadow-xl flex flex-col justify-between items-center text-center border-2 border-amber-300">
                    <div className="w-full flex justify-between items-center border-b border-white/20 pb-2">
                      <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                        {currentFlashcards[flashcardIdx]?.tag} • Tư liệu chuẩn xác
                      </span>
                      <span className="text-xs bg-white/20 px-2.5 py-0.5 rounded-full font-bold">
                        Đã giải mã
                      </span>
                    </div>

                    <p className="text-sm sm:text-base leading-relaxed text-amber-100/95 font-medium px-2">
                      {currentFlashcards[flashcardIdx]?.back}
                    </p>

                    <div className="text-xs text-white/80 font-bold flex items-center gap-1.5">
                      <RotateCw className="w-4 h-4" />
                      <span>Lật lại mặt trước</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Flashcard Navigation */}
              <div className="flex items-center justify-between gap-4 pt-2">
                <button
                  onClick={() => {
                    setIsCardFlipped(false);
                    setFlashcardIdx((flashcardIdx - 1 + currentFlashcards.length) % currentFlashcards.length);
                  }}
                  className="px-4 py-2 rounded-xl bg-white border border-[#EADBC8] text-xs font-bold hover:bg-gray-50 cursor-pointer shadow-xs"
                >
                  &lt; Thẻ trước
                </button>

                <div className="flex gap-1.5">
                  {currentFlashcards.map((_, i) => (
                    <span
                      key={i}
                      onClick={() => {
                        setIsCardFlipped(false);
                        setFlashcardIdx(i);
                      }}
                      className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-all ${
                        flashcardIdx === i ? 'bg-[#7E1819] w-6' : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={() => {
                    setIsCardFlipped(false);
                    setFlashcardIdx((flashcardIdx + 1) % currentFlashcards.length);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#7E1819] text-white text-xs font-bold hover:bg-[#96171a] cursor-pointer shadow-xs"
                >
                  Thẻ tiếp theo &gt;
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: MATCHING PAIRS (Tailored per Monument) */}
          {activeTab === 'matching' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#EADBC8]">
                <div>
                  <h3 className="font-serif-title font-black text-lg text-[#2C241E]">
                    Thử Thách Ghép Đôi Tư Liệu: {monumentName}
                  </h3>
                  <p className="text-xs text-[#7A6B60]">
                    Chọn một ô ở Cột Trái và nối với ô giải thích tương ứng ở Cột Phải.
                  </p>
                </div>
                <span className="text-xs font-bold text-[#7E1819] bg-amber-100 px-3 py-1 rounded-full">
                  Đã ghép đúng: {matchedCount} / {pairs.length}
                </span>
              </div>

              {matchingMessage && (
                <div className="p-3 rounded-xl bg-amber-100/80 border border-amber-300 text-xs font-bold text-center text-amber-950 animate-fadeIn">
                  {matchingMessage}
                </div>
              )}

              {/* Two Columns Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left Column */}
                <div className="space-y-2.5">
                  <span className="text-xs font-bold text-[#7E1819] uppercase tracking-wider block mb-1">
                    Cột 1: Tên / Hiện vật / Dữ kiện
                  </span>
                  {pairs.map((p) => {
                    const isSelected = selectedLeft === p.id;
                    const isMatched = p.matched;
                    return (
                      <button
                        key={`left-${p.id}`}
                        disabled={isMatched}
                        onClick={() => handleSelectLeft(p.id)}
                        className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-serif-title font-bold transition-all cursor-pointer flex items-center justify-between ${
                          isMatched
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-800 opacity-60 cursor-not-allowed'
                            : isSelected
                            ? 'bg-amber-100 border-[#7E1819] ring-2 ring-[#7E1819] text-[#7E1819] scale-102 shadow-md'
                            : 'bg-white border-[#EADBC8] hover:border-[#7E1819] hover:bg-amber-50/40 text-[#2C241E]'
                        }`}
                      >
                        <span>{p.left}</span>
                        {isMatched && <Check className="w-4 h-4 text-emerald-600" />}
                      </button>
                    );
                  })}
                </div>

                {/* Right Column (Shuffled visual order) */}
                <div className="space-y-2.5">
                  <span className="text-xs font-bold text-[#7E1819] uppercase tracking-wider block mb-1">
                    Cột 2: Ý nghĩa / Vai trò lịch sử
                  </span>
                  {[...pairs].reverse().map((p) => {
                    const isSelected = selectedRight === p.id;
                    const isMatched = p.matched;
                    return (
                      <button
                        key={`right-${p.id}`}
                        disabled={isMatched}
                        onClick={() => handleSelectRight(p.id)}
                        className={`w-full text-left p-3.5 rounded-xl border text-xs leading-relaxed transition-all cursor-pointer flex items-center justify-between ${
                          isMatched
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-800 opacity-60 cursor-not-allowed'
                            : isSelected
                            ? 'bg-amber-100 border-[#7E1819] ring-2 ring-[#7E1819] text-[#7E1819] scale-102 shadow-md font-bold'
                            : 'bg-white border-[#EADBC8] hover:border-[#7E1819] hover:bg-amber-50/40 text-[#4A3E36]'
                        }`}
                      >
                        <span>{p.right}</span>
                        {isMatched && <Check className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {matchedCount === pairs.length && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-300 text-center space-y-2 animate-fadeIn">
                  <Trophy className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h4 className="font-serif-title font-bold text-base text-emerald-900">
                    Xuất sắc! Bạn đã ghép nối thành công toàn bộ tư liệu về {monumentName}!
                  </h4>
                  <p className="text-xs text-emerald-700">
                    Bạn đã chứng tỏ sự am hiểu sâu sắc về chứng tích lịch sử của di tích.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* BADGE UNLOCKED SECTION */}
          {badgeUnlocked && (
            <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-400 via-amber-300 to-amber-500 text-[#500b0d] border-2 border-amber-500 shadow-xl space-y-4 animate-fadeIn">
              <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                <div className="w-16 h-16 rounded-2xl bg-[#7E1819] text-amber-300 flex items-center justify-center shadow-lg shrink-0">
                  <Trophy className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest bg-[#7E1819] text-white px-2.5 py-0.5 rounded-full">
                    CHÚC MỪNG HOÀN THÀNH XUẤT SẮC
                  </span>
                  <h3 className="font-serif-title font-black text-xl sm:text-2xl mt-1">
                    Mở Khóa Huy Hiệu: "Nhà Sử Học Trẻ - {monumentName}"
                  </h3>
                  <p className="text-xs text-[#500b0d]/90 font-medium">
                    Chứng nhận bạn đã hoàn thành xuất sắc thử thách giải mã chứng cứ và tư liệu lịch sử số.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-[#500b0d]/20">
                <button
                  onClick={handlePrintCertificate}
                  className="px-4 py-2 rounded-xl bg-[#7E1819] hover:bg-[#96171a] text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4 text-amber-300" />
                  <span>In chứng nhận danh dự</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
