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
  VolumeX,
  FileText,
  Clock,
  Tv,
  Maximize2,
  Mic,
  Disc
} from 'lucide-react';
import confetti from 'canvas-confetti';
import ScrollReveal from './ScrollReveal';
import { soundEffects } from '../utils/soundEffects';
import { trackQuizAttempt } from '../utils/studentAnalytics';
import { getActivePassport } from '../utils/passportStorage';
import WordByWordTitle from './WordByWordTitle';
import { buildMonumentMediaQuiz } from '../utils/quizUtils';

export default function MediaAudioVideoRow({
  video = {},
  info = {},
  audioScript = '',
  monumentStt,
  stt,
  monumentData,
  onOpenVideoModal,
  onOpenAudioModal
}) {
  const youtubeId = video?.youtubeId || 'cplxidwCHyE';
  const monumentName = info?.name || 'Di tích lịch sử';

  // ==========================================
  // AUDIO PLAYER STATE & REAL MP3 PLAYBACK
  // ==========================================
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180); // default 3:00 min
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  const currentStt = monumentStt || stt || info?.stt || 1;
  const baseUrl = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
  const audioSrc = `${baseUrl}/assets/audio/monument-audio-${currentStt}.mp3`;

  // Script text for audio narration fallback
  const rawAudioScript = Array.isArray(audioScript)
    ? audioScript.map(s => (typeof s === 'string' ? s : (s?.text || s?.content || ''))).join(' ')
    : (typeof audioScript === 'string' ? audioScript : '');
  const narrationText = rawAudioScript || (typeof info?.overview === 'string' ? info.overview : '') || `Kính chào các em học sinh và quý độc giả. Chúng ta đang cùng nhau tìm hiểu về di tích lịch sử ${monumentName}. Đây là một công trình mang ý nghĩa đặc biệt trong lịch sử và văn hóa của Thành phố Hồ Chí Minh.`;

  // Initialize or update audio source when monument changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentTime(0);

    const audio = new Audio(audioSrc);
    audio.playbackRate = playbackRate;
    audio.muted = isMuted;

    const onLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(Math.round(audio.duration));
      }
    };

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(audio.duration || duration);
    };

    const onError = () => {
      // Fallback: estimate duration from word count
      const wordCount = narrationText ? narrationText.split(/\s+/).length : 50;
      const estSec = Math.max(60, Math.round((wordCount / 130) * 60));
      setDuration(estSec);
    };

    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
      try {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
          window.speechSynthesis.cancel();
        }
      } catch (e) {}
    };
  }, [audioSrc, monumentName]);

  // Audio Play / Pause handler
  const handleTogglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.playbackRate = playbackRate;
      audioRef.current.muted = isMuted;
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.warn('Audio play error, fallback to TTS:', err);
        // Fallback TTS
        if (typeof window !== 'undefined' && window.speechSynthesis) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(narrationText);
          utterance.lang = 'vi-VN';
          utterance.rate = playbackRate;
          utterance.onend = () => setIsPlaying(false);
          window.speechSynthesis.speak(utterance);
          setIsPlaying(true);
        }
      });
    }
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleRewind10 = () => {
    const newTime = Math.max(0, currentTime - 10);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleForward10 = () => {
    const newTime = Math.min(duration, currentTime + 10);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleSetSpeed = (rate) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (audioRef.current) {
      audioRef.current.muted = nextMuted;
    }
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds === null) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // ==========================================
  // DISCOVERY QUIZ ("BẠN VỪA KHÁM PHÁ ĐƯỢC GÌ?")
  // ==========================================
  const [currentQuiz, setCurrentQuiz] = useState(() =>
    buildMonumentMediaQuiz(monumentData || { info, video, audioScript, stt: currentStt })
  );
  const [selectedQuizOpt, setSelectedQuizOpt] = useState(null);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [quizCorrect, setQuizCorrect] = useState(false);

  useEffect(() => {
    setSelectedQuizOpt(null);
    setQuizAnswered(false);
    setQuizCorrect(false);
    setCurrentQuiz(buildMonumentMediaQuiz(monumentData || { info, video, audioScript, stt: currentStt }));
  }, [monumentData, monumentName, video, currentStt]);

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
          particleCount: 70,
          spread: 75,
          origin: { y: 0.7 }
        });
      } catch (e) {}
    } else {
      soundEffects.playWrong();
    }

    try {
      const passport = getActivePassport();
      trackQuizAttempt({
        passport,
        monumentStt: currentStt,
        monumentName,
        question: currentQuiz.question,
        isCorrect: isRight,
        score: isRight ? 20 : 0
      });
    } catch (e) {}
  };

  const handleResetQuiz = () => {
    soundEffects.playTap();
    setSelectedQuizOpt(null);
    setQuizAnswered(false);
    setQuizCorrect(false);
    setCurrentQuiz(buildMonumentMediaQuiz(monumentData || { info, video, audioScript, stt: currentStt }));
  };

  // Progress percentage for visual audio bar
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <section className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 py-6 space-y-6">
      <ScrollReveal>
        {/* ========================================================================= */}
        {/* SECTION HEADER: SANG TRỌNG, ĐẲNG CẤP BẢO TÀNG */}
        {/* ========================================================================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#EAE3D9]">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-100 to-rose-100 border border-amber-300 text-[#7E1819] text-xs font-black uppercase tracking-wider shadow-2xs">
              <Headphones className="w-4 h-4 text-[#7E1819]" />
              <span>KHÔNG GIAN ĐA PHƯƠNG TIỆN • THÍNH & THỊ</span>
            </div>
            <WordByWordTitle
              as="h2"
              text="Thước Phim Tư Liệu & Giọng Đọc Thuyết Minh Di Sản"
              className="font-serif-title font-black text-2xl sm:text-3xl lg:text-4xl tracking-tight text-[#2A1214]"
              staggerDelay={0.04}
            />
            <p className="text-xs sm:text-sm text-stone-600 max-w-3xl leading-relaxed">
              Trải nghiệm tư liệu điện ảnh chân thực kết hợp phòng thu âm thanh thuyết minh lịch sử chuẩn mực và thử thách nhận thức nhanh.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-white text-[#7E1819] border border-amber-300/80 shadow-2xs flex items-center gap-2">
              <Radio className="w-4 h-4 text-red-600 animate-pulse" />
              <span>HD 1080p & Stereo Voice</span>
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* HÀNG 1: 2 CỘT STUDIO SONG SONG (VIDEO CINEMA & AUDIO STATION) */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch pt-2">
          
          {/* ------------------------------------------------------------------------- */}
          {/* CỘT 1: RẠP PHIM TƯ LIỆU GỐC (CINEMA THEATER MODE) - 6 COLS */}
          {/* ------------------------------------------------------------------------- */}
          <div className="lg:col-span-6 bg-gradient-to-br from-[#1C0507] via-[#2A0B0E] to-[#180305] text-white rounded-3xl p-5 sm:p-6 border-2 border-amber-500/40 shadow-2xl flex flex-col justify-between space-y-4 relative overflow-hidden ring-1 ring-amber-400/20 group">
            
            {/* Ambient Background Glow Effect */}
            <div className="absolute -top-24 -left-24 w-60 h-60 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header Cinema */}
            <div className="relative z-10 space-y-2 pb-3 border-b border-white/10">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/30 border border-red-500/50 text-amber-300 text-xs font-black uppercase tracking-wider shadow-inner">
                  <Film className="w-3.5 h-3.5 text-amber-300" />
                  <span>RẠP PHIM TƯ LIỆU GỐC</span>
                </div>

                <div className="flex items-center gap-2 text-[11px]">
                  <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/50 border border-red-500/40 text-rose-300 font-mono font-bold">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    <span>HD 1080P</span>
                  </span>
                  <button
                    onClick={onOpenVideoModal}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-amber-300 border border-white/15 transition-colors cursor-pointer"
                    title="Mở toàn màn hình rạp chiếu"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h3 className="font-serif-title font-black text-base sm:text-lg text-amber-100 line-clamp-1">
                {video?.title || `Thước phim tư liệu lịch sử: ${monumentName}`}
              </h3>
            </div>

            {/* Video Iframe Theater Bezel */}
            <div className="relative z-10 aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl border-2 border-amber-500/30 ring-4 ring-black/60">
              <iframe
                className="w-full h-full"
                src={
                  video?.videoType === 'drive' || video?.driveFileId || (video?.youtubeUrl && video.youtubeUrl.includes('drive.google.com'))
                    ? (video?.driveFileId ? `https://drive.google.com/file/d/${video.driveFileId}/preview` : video?.youtubeUrl?.replace(/\/view.*$/, '/preview'))
                    : (video?.embedUrl || `https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1&color=white`)
                }
                title={video?.title || "Phim tư liệu di tích"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Cinema Chapter Highlights & Actions */}
            <div className="relative z-10 space-y-2.5 pt-1">
              <div className="flex items-center gap-1.5 flex-wrap text-[11px]">
                <span className="px-2.5 py-1 rounded-lg bg-black/40 border border-amber-400/20 text-amber-200 font-medium flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>00:00 Toàn Cảnh</span>
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-black/40 border border-amber-400/20 text-amber-200 font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>01:15 Hiện Vật & Dấu Ấn</span>
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-black/40 border border-amber-400/20 text-amber-200 font-medium flex items-center gap-1">
                  <Award className="w-3 h-3 text-amber-400" />
                  <span>02:30 Giá Trị Lịch Sử</span>
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-rose-200/80 pt-1 border-t border-white/10">
                <span className="truncate max-w-[240px] text-amber-300/90 font-medium">
                  {video?.copyright || (video?.channel ? `Bản quyền: ${video.channel}` : 'Bản quyền: Kênh Tư Liệu Lịch Sử')}
                </span>

                <a
                  href={video?.youtubeUrl || (video?.driveFileId ? `https://drive.google.com/file/d/${video.driveFileId}/view` : `https://www.youtube.com/watch?v=${youtubeId}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-amber-300 hover:text-amber-200 hover:underline flex items-center gap-1 shrink-0 transition-colors"
                >
                  <span>{video?.videoType === 'drive' || video?.driveFileId || (video?.youtubeUrl && video.youtubeUrl.includes('drive.google.com')) ? 'Mở Drive' : 'Xem trên YouTube'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------------------------- */}
          {/* CỘT 2: PHÒNG THU THUYẾT MINH DI SẢN (STUDIO SOUND STATION) - 6 COLS */}
          {/* ------------------------------------------------------------------------- */}
          <div className="lg:col-span-6 bg-gradient-to-br from-[#24080B] via-[#350C10] to-[#1C0507] text-white rounded-3xl p-5 sm:p-6 border-2 border-amber-500/40 shadow-2xl flex flex-col justify-between space-y-4 relative overflow-hidden ring-1 ring-amber-400/20">
            
            {/* Ambient Lighting */}
            <div className="absolute -top-24 -right-24 w-60 h-60 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header Studio */}
            <div className="relative z-10 space-y-2 pb-3 border-b border-white/10">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-black uppercase tracking-wider shadow-inner">
                  <Mic className="w-3.5 h-3.5 text-amber-300" />
                  <span>PHÒNG THU THUYẾT MINH DI SẢN</span>
                </div>

                {/* Speed Selector Tabs */}
                <div className="flex items-center gap-1 bg-black/50 p-1 rounded-xl border border-amber-400/30">
                  {[0.75, 1.0, 1.25, 1.5].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => handleSetSpeed(rate)}
                      className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                        playbackRate === rate
                          ? 'bg-amber-400 text-[#7E1819] shadow-xs'
                          : 'text-amber-200/70 hover:text-white'
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <h3 className="font-serif-title font-black text-base sm:text-lg text-amber-100 line-clamp-1">
                  Giọng đọc truyền cảm • Lịch sử {monumentName}
                </h3>
                <span className="text-[11px] font-mono text-amber-300/80 bg-black/40 px-2 py-0.5 rounded-md border border-white/10">
                  MP3 Studio
                </span>
              </div>
            </div>

            {/* Dynamic Animated Waveform Visualizer */}
            <div className="relative z-10 p-4 rounded-2xl bg-black/50 border border-amber-400/30 shadow-inner space-y-3.5">
              
              {/* Status Header inside Box */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${isPlaying ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
                  <span className="font-bold text-amber-200 text-xs sm:text-sm tracking-wide">
                    {isPlaying ? '🔴 Đang phát thuyết minh trực tiếp...' : '⏸️ Sẵn sàng thưởng thức'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 font-mono font-bold text-amber-300 bg-white/10 px-2.5 py-0.5 rounded-lg border border-white/10">
                  <span>{formatTime(currentTime)}</span>
                  <span className="text-amber-200/50">/</span>
                  <span className="text-amber-200/70">{formatTime(duration)}</span>
                </div>
              </div>

              {/* 32-Bar Live Sound Equalizer Waveform */}
              <div className="h-12 flex items-end justify-between gap-1 px-1 py-1 rounded-xl bg-black/40 border border-white/5 overflow-hidden">
                {Array.from({ length: 32 }).map((_, i) => {
                  const baseHeight = ((Math.sin(i * 0.4) + 1.2) * 18) + 10;
                  const isCurrentSection = (i / 32) * 100 <= progressPercent;
                  
                  return (
                    <div
                      key={i}
                      style={{
                        height: isPlaying ? `${Math.max(12, (baseHeight + (i % 5) * 6 * Math.random()).toFixed(0))}px` : `${Math.max(8, baseHeight * 0.4)}px`,
                        transition: 'height 0.15s ease'
                      }}
                      className={`flex-1 rounded-full ${
                        isCurrentSection 
                          ? 'bg-gradient-to-t from-amber-500 to-amber-300 shadow-xs' 
                          : 'bg-white/15'
                      }`}
                    />
                  );
                })}
              </div>

              {/* Progress Slider Track with glowing fill */}
              <div className="space-y-1">
                <div className="relative w-full flex items-center">
                  <input
                    type="range"
                    min="0"
                    max={duration}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-2.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Master Playback Controls */}
              <div className="flex items-center justify-between pt-1">
                
                {/* Mute toggle button */}
                <button
                  onClick={handleToggleMute}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-amber-300 border border-white/15 transition-all cursor-pointer"
                  title={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                </button>

                {/* Main Player Center Trio */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleRewind10}
                    className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-amber-300 border border-white/15 transition-transform hover:scale-110 cursor-pointer flex items-center gap-1 text-xs font-bold"
                    title="Lùi lại 10 giây"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span className="text-[10px]">10s</span>
                  </button>

                  <button
                    onClick={handleTogglePlay}
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 text-[#7E1819] flex items-center justify-center shadow-xl shadow-amber-500/30 hover:scale-110 active:scale-95 transition-all cursor-pointer border-2 border-amber-200 ${
                      isPlaying ? 'ring-4 ring-amber-300/40' : 'animate-pulse'
                    }`}
                    title={isPlaying ? "Tạm dừng" : "Phát âm thanh thuyết minh"}
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6 fill-current" />
                    ) : (
                      <Play className="w-6 h-6 fill-current ml-1" />
                    )}
                  </button>

                  <button
                    onClick={handleForward10}
                    className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-amber-300 border border-white/15 transition-transform hover:scale-110 cursor-pointer flex items-center gap-1 text-xs font-bold"
                    title="Tua tới 10 giây"
                  >
                    <span className="text-[10px]">10s</span>
                    <RotateCw className="w-4 h-4" />
                  </button>
                </div>

                {/* Full Script Modal Button */}
                <button
                  onClick={onOpenAudioModal}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-amber-300 border border-white/15 transition-all cursor-pointer flex items-center gap-1.5"
                  title="Mở toàn văn kịch bản thuyết minh"
                >
                  <FileText className="w-4 h-4" />
                  <span className="hidden sm:inline text-xs font-bold">Kịch bản</span>
                </button>
              </div>
            </div>

            {/* Teleprompter Quote Excerpt Teaser */}
            <div className="relative z-10 p-3 rounded-xl bg-black/40 border border-amber-400/20 text-xs text-amber-100/90 leading-relaxed flex items-start gap-2">
              <Disc className={`w-4 h-4 text-amber-400 shrink-0 mt-0.5 ${isPlaying ? 'animate-spin' : ''}`} />
              <p className="line-clamp-2 italic">
                "{narrationText.slice(0, 160)}..."
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* HÀNG 2: THỬ THÁCH NHẬN THỨC NHANH "BẠN VỪA KHÁM PHÁ ĐƯỢC GÌ?" */}
        {/* ========================================================================= */}
        <div className="bg-gradient-to-br from-[#FFFDF9] via-[#FAF5ED] to-[#F5ECE0] rounded-3xl p-5 sm:p-7 border-2 border-amber-300/80 shadow-lg space-y-4 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-200/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#7E1819] to-[#9E1B1D] text-amber-200 flex items-center justify-center shadow-md border border-amber-300">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h3 className="font-serif-title font-black text-lg sm:text-xl text-[#7E1819]">
                  Thử Thách Nhanh: Bạn Vừa Khám Phá Được Gì?
                </h3>
                <p className="text-xs text-[#555555]">
                  Kiểm tra khả năng quan sát thước phim & tiếp thu lời thuyết minh lịch sử
                </p>
              </div>
            </div>

            <span className="self-start sm:self-auto px-3.5 py-1 rounded-full bg-amber-100 text-[#7E1819] border border-amber-300 font-black text-xs uppercase tracking-wider shadow-2xs">
              ⭐ +20 Điểm Thám Hiểm
            </span>
          </div>

          {/* Question Text */}
          <div className="p-4 rounded-2xl bg-white border border-amber-200 shadow-xs">
            <p className="font-serif-title font-bold text-sm sm:text-base text-[#2C241E] leading-relaxed">
              🎯 {currentQuiz.question}
            </p>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentQuiz.options.map((opt, idx) => {
              const isSelected = selectedQuizOpt === idx;
              let btnStyle = "bg-white hover:bg-amber-50/70 border-gray-200 text-[#333333] hover:border-amber-400";

              if (quizAnswered) {
                if (idx === currentQuiz.correctIndex) {
                  btnStyle = "bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-400 shadow-md";
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
                  className={`text-left p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 text-xs sm:text-sm cursor-pointer shadow-2xs ${btnStyle}`}
                >
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-[#7E1819] font-black text-xs flex items-center justify-center shrink-0 mt-0.5 border border-amber-300/60">
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
            <div className={`p-4 rounded-2xl border animate-fadeIn space-y-1.5 ${quizCorrect ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-amber-50 border-amber-300 text-amber-950'}`}>
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
            <div className="flex items-center justify-end gap-3 pt-1">
              <button
                onClick={handleResetQuiz}
                className="py-2.5 px-6 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#7E1819] font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md hover:scale-102"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Thử thách lại</span>
              </button>
            </div>
          )}
        </div>
      </ScrollReveal>
    </section>
  );
}
