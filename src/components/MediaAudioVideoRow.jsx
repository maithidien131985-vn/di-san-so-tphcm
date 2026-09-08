import React, { useState, useEffect, useRef } from 'react';
import { 
  Film, 
  Volume2, 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw, 
  ExternalLink, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  Radio, 
  Award, 
  Headphones,
  Sliders,
  VolumeX
} from 'lucide-react';
import confetti from 'canvas-confetti';
import ScrollReveal from './ScrollReveal';
import { soundEffects } from '../utils/soundEffects';

export default function MediaAudioVideoRow({
  video = {},
  info = {},
  audioScript = '',
  onOpenVideoModal,
  onOpenAudioModal
}) {
  const youtubeId = video?.youtubeId || 'cplxidwCHyE';
  const monumentName = info?.name || 'Di tích lịch sử';

  // ==========================================
  // AUDIO PLAYER STATE & SYNTHESIS
  // ==========================================
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180); // default 3:00 min
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const timerRef = useRef(null);

  // Script text for audio narration — ensure it's always a string (audioScript can be array in some monuments)
  const rawAudioScript = Array.isArray(audioScript)
    ? audioScript.map(s => (typeof s === 'string' ? s : (s?.text || s?.content || ''))).join(' ')
    : (typeof audioScript === 'string' ? audioScript : '');
  const narrationText = rawAudioScript || (typeof info?.overview === 'string' ? info.overview : '') || `Kính chào các em học sinh và quý độc giả. Chúng ta đang cùng nhau tìm hiểu về di tích lịch sử ${monumentName}. Đây là một công trình mang ý nghĩa đặc biệt trong lịch sử và văn hóa của Thành phố Hồ Chí Minh.`;

  // Estimate duration based on text length (~150 words per minute)
  useEffect(() => {
    const wordCount = narrationText ? narrationText.split(/\s+/).length : 50;
    const estSec = Math.max(60, Math.round((wordCount / 130) * 60));
    setDuration(estSec);
    setCurrentTime(0);
    setIsPlaying(false);

    try {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    } catch (e) {}

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      try {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
          window.speechSynthesis.cancel();
        }
      } catch (e) {}
    };
  }, [monumentName, narrationText]);

  // Audio Speech Synthesis / Simulated Timer
  const handleTogglePlay = () => {
    if (typeof window === 'undefined') return;

    if (isPlaying) {
      try {
        if (window.speechSynthesis) {
          window.speechSynthesis.pause();
        }
      } catch (e) {}
      clearInterval(timerRef.current);
      setIsPlaying(false);
    } else {
      try {
        if (window.speechSynthesis) {
          if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
          } else {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(narrationText);
            utterance.lang = 'vi-VN';
            utterance.rate = playbackRate;

            // Find Vietnamese voice if available
            const voices = window.speechSynthesis.getVoices ? window.speechSynthesis.getVoices() : [];
            const viVoice = voices.find(v => v.lang && (v.lang.includes('vi') || v.name.includes('Vietnamese')));
            if (viVoice) utterance.voice = viVoice;

            utterance.onend = () => {
              setIsPlaying(false);
              setCurrentTime(duration);
              clearInterval(timerRef.current);
            };

            window.speechSynthesis.speak(utterance);
          }
        }
      } catch (e) {
        console.warn('Speech synthesis error, falling back to audio timer:', e);
      }

      setIsPlaying(true);
      timerRef.current = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            clearInterval(timerRef.current);
            setIsPlaying(false);
            return duration;
          }
          return prev + 1;
        });
      }, 1000 / playbackRate);
    }
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
  };

  const handleRewind10 = () => {
    setCurrentTime(prev => Math.max(0, prev - 10));
  };

  const handleForward10 = () => {
    setCurrentTime(prev => Math.min(duration, prev + 10));
  };

  const handleToggleSpeed = () => {
    const rates = [1.0, 1.25, 1.5];
    const nextRate = rates[(rates.indexOf(playbackRate) + 1) % rates.length];
    setPlaybackRate(nextRate);
    try {
      if (window.speechSynthesis && isPlaying) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(narrationText);
        utterance.lang = 'vi-VN';
        utterance.rate = nextRate;
        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {}
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // ==========================================
  // DISCOVERY QUIZ ("BẠN VỪA KHÁM PHÁ ĐƯỢC GÌ?")
  // ==========================================
  const quizQuestions = [
    {
      question: `Sau khi theo dõi thước phim và nghe thuyết minh, bạn nhận thấy giá trị tiêu biểu nhất của di tích "${monumentName}" là gì?`,
      options: [
        `Ghi dấu những dấu mốc lịch sử hào hùng và giáo dục truyền thống yêu nước cho các thế hệ học sinh.`,
        `Là một công trình giải trí hiện đại được xây dựng trong thế kỷ 21.`,
        `Địa điểm du lịch thương mại thuần túy không gắn liền với sự kiện lịch sử nào.`,
        `Công trình kiến trúc hiện đại mới xây dựng gần đây.`
      ],
      correctIndex: 0,
      explanation: `Di tích ${monumentName} là chứng tích lịch sử - văn hóa vô giá, phản ánh truyền thống đấu tranh kiên cường, bản sắc dân tộc và là địa chỉ đỏ giáo dục truyền thống yêu nước cho thế hệ trẻ.`
    }
  ];

  const currentQuiz = quizQuestions[0];
  const [selectedQuizOpt, setSelectedQuizOpt] = useState(null);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [quizCorrect, setQuizCorrect] = useState(false);

  useEffect(() => {
    setSelectedQuizOpt(null);
    setQuizAnswered(false);
    setQuizCorrect(false);
  }, [monumentName]);

  // Bấm chọn đáp án: Biết đúng/sai luôn, có âm thanh nhỏ và hiển thị giải thích
  const handleSelectQuiz = (idx) => {
    if (quizAnswered) return;
    setSelectedQuizOpt(idx);
    const isRight = idx === currentQuiz.correctIndex;
    setQuizCorrect(isRight);
    setQuizAnswered(true);

    if (isRight) {
      soundEffects.playCorrect();
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.7 }
        });
      } catch (e) {}
    } else {
      soundEffects.playWrong();
    }
  };

  const handleResetQuiz = () => {
    soundEffects.playTap();
    setSelectedQuizOpt(null);
    setQuizAnswered(false);
    setQuizCorrect(false);
  };

  return (
    <section className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 py-6">
      <ScrollReveal>
        {/* Section Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 pb-3 border-b border-[#EAE3D9]">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 text-[#7E1819]">
              <Headphones className="w-6 h-6 text-[#7E1819]" />
              <h2 className="font-serif-title font-black text-xl sm:text-2xl lg:text-3xl tracking-wide text-[#7E1819]">
                Không Gian Đa Phương Tiện: Thính & Thị
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#666666]">
              Xem phim tư liệu lịch sử sống động kết hợp lắng nghe lời thuyết minh truyền cảm hứng.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-red-600 animate-pulse" />
              <span>Thuyết minh trực quan</span>
            </span>
          </div>
        </div>

        {/* HÀNG 1: VIDEO & AUDIO PLAYER CHUNG 1 DÒNG (2 Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-6">
          {/* CỘT 1: VIDEO PHIM TƯ LIỆU (6 cols) */}
          <div className="lg:col-span-6 bg-white rounded-2xl p-5 sm:p-6 border border-[#EAE3D9] shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#7E1819]">
                  <Film className="w-5 h-5" />
                  <h3 className="font-serif-title font-bold text-base sm:text-lg text-[#2C241E]">
                    Thước Phim Tư Liệu Lịch Sử
                  </h3>
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-red-50 text-[#7E1819] border border-red-200">
                  Phim HD
                </span>
              </div>
              <p className="text-xs text-[#777777] line-clamp-1">
                {video?.title || `Thước phim tư liệu chân thực về di tích ${monumentName}`}
              </p>
            </div>

            {/* Video Iframe Container */}
            <div className="relative aspect-video rounded-xl overflow-hidden bg-black shadow-md border border-gray-200">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1`}
                title={video?.title || "Phim tư liệu di tích"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="pt-1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-[#555555]">
              <span className="font-medium text-[#7E1819] truncate max-w-xs">
                {video?.copyright || (video?.channel ? `Bản quyền: ${video.channel}` : 'Bản quyền Kênh YouTube')}
              </span>
              <a
                href={video?.youtubeUrl || `https://www.youtube.com/watch?v=${youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[#7E1819] hover:underline flex items-center gap-1 shrink-0"
              >
                <span>Mở trên YouTube</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* CỘT 2: AUDIO PLAYER MÁY PHÁT THUYẾT MINH TÍCH HỢP (6 cols) */}
          <div className="lg:col-span-6 bg-gradient-to-br from-[#FAF7F2] to-[#F3ECE0] rounded-2xl p-5 sm:p-6 border-2 border-amber-200 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#7E1819]">
                  <Volume2 className="w-5 h-5 text-[#7E1819]" />
                  <h3 className="font-serif-title font-bold text-base sm:text-lg text-[#2C241E]">
                    Audio Thuyết Minh Di Sản
                  </h3>
                </div>
                <button
                  onClick={handleToggleSpeed}
                  className="px-2.5 py-1 rounded-lg bg-white border border-amber-300 text-[11px] font-bold text-[#7E1819] hover:bg-amber-50 cursor-pointer shadow-xs"
                  title="Thay đổi tốc độ phát"
                >
                  Tốc độ: {playbackRate}x
                </button>
              </div>
              <p className="text-xs text-[#777777] line-clamp-1">
                Giọng đọc truyền cảm tái hiện chiều dài lịch sử di tích
              </p>
            </div>

            {/* Audio Wave Visualizer Box */}
            <div className="p-4 rounded-xl bg-white/90 border border-amber-200/80 shadow-inner flex flex-col justify-center space-y-3">
              <div className="flex items-center justify-between text-xs text-[#555555]">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${isPlaying ? 'bg-emerald-500 animate-ping' : 'bg-amber-400'}`} />
                  <span className="font-bold text-[#7E1819]">
                    {isPlaying ? 'Đang phát thuyết minh...' : 'Sẵn sàng phát'}
                  </span>
                </div>
                <span className="font-mono font-bold text-[#333333]">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              {/* Progress Slider Bar */}
              <div className="relative w-full">
                <input
                  type="range"
                  min="0"
                  max={duration}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-2.5 bg-amber-100 rounded-lg appearance-none cursor-pointer accent-[#7E1819]"
                />
              </div>

              {/* Player Controls Bar */}
              <div className="flex items-center justify-center gap-4 pt-1">
                <button
                  onClick={handleRewind10}
                  className="p-2 rounded-full bg-amber-50 hover:bg-amber-100 text-[#7E1819] border border-amber-200 transition-transform hover:scale-110 cursor-pointer"
                  title="Tua lại 10 giây"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={handleTogglePlay}
                  className="w-12 h-12 rounded-full bg-gradient-to-r from-[#7E1819] to-[#9E1B1D] hover:from-[#9E1B1D] hover:to-[#7E1819] text-white flex items-center justify-center shadow-lg hover:scale-108 transition-all cursor-pointer border-2 border-amber-300"
                  title={isPlaying ? "Tạm dừng" : "Phát thuyết minh"}
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 fill-white" />
                  ) : (
                    <Play className="w-6 h-6 fill-white ml-0.5" />
                  )}
                </button>

                <button
                  onClick={handleForward10}
                  className="p-2 rounded-full bg-amber-50 hover:bg-amber-100 text-[#7E1819] border border-amber-200 transition-transform hover:scale-110 cursor-pointer"
                  title="Tua tới 10 giây"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Footer Audio Action */}
            <div className="pt-1 flex items-center justify-between text-xs text-[#666666]">
              <span className="italic">💡 Học sinh có thể vừa nghe vừa theo dõi bài học</span>
              <button
                onClick={onOpenAudioModal}
                className="font-bold text-[#7E1819] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Xem toàn văn lời đọc &rarr;</span>
              </button>
            </div>
          </div>
        </div>

        {/* HÀNG 2: HỘP CÂU HỎI "BẠN VỪA KHÁM PHÁ ĐƯỢC GÌ?" */}
        <div className="bg-gradient-to-br from-[#FFFDF9] to-[#FAF3E7] rounded-2xl p-5 sm:p-7 border-2 border-amber-300/80 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-amber-200/60">
            <div className="flex items-center gap-3 text-amber-950">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center shadow-xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif-title font-black text-lg sm:text-xl text-[#7E1819]">
                  Bạn Vừa Khám Phá Được Gì?
                </h3>
                <p className="text-xs text-[#666666]">
                  Kiểm tra khả năng quan sát & lắng nghe tư liệu lịch sử
                </p>
              </div>
            </div>

            <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-amber-100 text-[#7E1819] border border-amber-300 font-black text-xs uppercase tracking-wider">
              ⭐ +15 Điểm Thám Hiểm
            </span>
          </div>

          {/* Question Text */}
          <div className="p-4 rounded-xl bg-white border border-amber-200 shadow-2xs">
            <p className="font-serif-title font-bold text-sm sm:text-base text-[#2C241E] leading-relaxed">
              🎯 {currentQuiz.question}
            </p>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentQuiz.options.map((opt, idx) => {
              const isSelected = selectedQuizOpt === idx;
              let btnStyle = "bg-white hover:bg-amber-50/60 border-gray-200 text-[#333333] hover:scale-[1.01]";

              if (quizAnswered) {
                if (idx === currentQuiz.correctIndex) {
                  btnStyle = "bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-400";
                } else if (isSelected && !quizCorrect) {
                  btnStyle = "bg-rose-50 border-rose-500 text-rose-950 line-through ring-1 ring-rose-400";
                } else {
                  btnStyle = "bg-gray-50 border-gray-200 text-gray-400 opacity-60";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectQuiz(idx)}
                  disabled={quizAnswered}
                  className={`text-left p-4 rounded-xl border transition-all flex items-start justify-between gap-3 text-xs sm:text-sm cursor-pointer ${btnStyle}`}
                >
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-[#7E1819] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="leading-relaxed">{opt}</span>
                  </div>
                  {quizAnswered && idx === currentQuiz.correctIndex && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  )}
                  {quizAnswered && isSelected && !quizCorrect && (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box */}
          {quizAnswered && (
            <div className={`p-4 rounded-xl border animate-fadeIn space-y-2 ${quizCorrect ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-amber-50 border-amber-300 text-amber-950'}`}>
              <div className="flex items-center gap-2 font-bold text-sm">
                {quizCorrect ? (
                  <>
                    <Award className="w-4 h-4 text-emerald-600" />
                    <span>Xuất sắc! Bạn đã tiếp thu trọn vẹn thông điệp lịch sử.</span>
                  </>
                ) : (
                  <>
                    <HelpCircle className="w-4 h-4 text-amber-700" />
                    <span>Chưa hoàn toàn chính xác, hãy đọc thêm thông điệp bên dưới nhé!</span>
                  </>
                )}
              </div>
              <p className="text-xs leading-relaxed text-gray-800">
                📖 <strong>Lời giải thích chi tiết:</strong> {currentQuiz.explanation}
              </p>
            </div>
          )}

          {/* Quiz Action Buttons */}
          {quizAnswered && (
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={handleResetQuiz}
                className="py-2.5 px-6 rounded-xl bg-amber-100 hover:bg-amber-200 text-[#7E1819] font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer border border-amber-300 shadow-xs hover:scale-102"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Làm Lại</span>
              </button>
            </div>
          )}
        </div>
      </ScrollReveal>
    </section>
  );
}
