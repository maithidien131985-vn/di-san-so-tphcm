import { useSharedAudio } from '../utils/sharedAudioManager';
import React, { useState, useEffect, useRef, useMemo } from 'react';
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
import { parseScriptIntoSentences, getActiveSentenceIndex } from '../utils/audioScriptSync';

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
  // SHARED SYNCHRONIZED AUDIO PLAYER (MP3)
  // ==========================================
  const currentStt = monumentStt || stt || info?.stt || 1;
  const baseUrl = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
  const audioSrc = `${baseUrl}/assets/audio/monument-audio-${currentStt}.mp3`;

  const sharedAudio = useSharedAudio(currentStt, audioSrc);
  const isPlaying = sharedAudio.isPlaying;
  const currentTime = sharedAudio.currentTime;
  const duration = sharedAudio.duration || 180;
  const playbackRate = sharedAudio.playbackRate;
  const isMuted = sharedAudio.isMuted;

  // Script text for audio narration fallback
  const rawAudioScript = Array.isArray(audioScript)
    ? audioScript.map(s => (typeof s === 'string' ? s : (s?.text || s?.content || ''))).join(' ')
    : (typeof audioScript === 'string' ? audioScript : '');
  const narrationText = rawAudioScript || (typeof info?.overview === 'string' ? info.overview : '') || `Kính chào các em học sinh và quý độc giả. Chúng ta đang cùng nhau tìm hiểu về di tích lịch sử ${monumentName}. Đây là một công trình mang ý nghĩa đặc biệt trong lịch sử và văn hóa của Thành phố Hồ Chí Minh.`;

  // Parse sections for sentence-by-sentence synchronization
  const normalizedSections = useMemo(() => {
    if (Array.isArray(audioScript) && audioScript.length > 0) {
      return audioScript.map((item, i) => ({
        index: i,
        title: typeof item === 'string' ? `Phần ${i + 1}` : (item.title || `Phần ${i + 1}`),
        text: typeof item === 'string' ? item : (item.text || item.content || '')
      }));
    }
    const paragraphs = (narrationText || '').split('\n\n').filter(p => p.trim().length > 0);
    return paragraphs.map((p, i) => ({
      index: i,
      title: `Phần ${i + 1}`,
      text: p.trim()
    }));
  }, [audioScript, narrationText]);

  const syncedSentences = useMemo(() => {
    return parseScriptIntoSentences(normalizedSections, duration);
  }, [normalizedSections, duration]);

  const activeSentenceIndex = useMemo(() => {
    return getActiveSentenceIndex(syncedSentences, currentTime);
  }, [syncedSentences, currentTime]);

  const currentSentence = syncedSentences[activeSentenceIndex] || {
    text: narrationText.slice(0, 140) + '...'
  };

  // Audio Play / Pause handler seamlessly connected to shared manager
  const handleTogglePlay = () => {
    sharedAudio.togglePlay().catch(err => {
      console.warn('Audio play error, fallback to TTS:', err);
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(narrationText);
        utterance.lang = 'vi-VN';
        utterance.rate = playbackRate;
        window.speechSynthesis.speak(utterance);
      }
    });
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    sharedAudio.seek(newTime);
  };

  const handleRewind10 = () => {
    sharedAudio.seekOffset(-10);
  };

  const handleForward10 = () => {
    sharedAudio.seekOffset(10);
  };

  const handleSetSpeed = (rate) => {
    sharedAudio.setPlaybackRate(rate);
  };

  const handleToggleMute = () => {
    sharedAudio.toggleMute();
  };

  const formatTime = sharedAudio.formatTime;

  // ==========================================
  // GAME TRẠM 1: LẬT THẺ TRÍ NHỚ DI TÍCH (MEMORY MATCH)
  // ==========================================
  const initialCards = useMemo(() => {
    const rawPairs = [
      {
        pairId: 1,
        a: { icon: '🏛️', tag: 'Di tích', title: monumentName, sub: 'Biểu tượng lịch sử' },
        b: { icon: '📍', tag: 'Địa danh', title: info?.address || 'TP. Hồ Chí Minh', sub: 'Tọa độ không gian' }
      },
      {
        pairId: 2,
        a: { icon: '📜', tag: 'Dấu ấn', title: info?.ranking || 'Di tích Quốc Gia', sub: 'Cấp độ xếp hạng' },
        b: { icon: '🏺', tag: 'Đặc trưng', title: info?.type || 'Lịch sử - Văn hóa', sub: 'Loại hình di sản' }
      },
      {
        pairId: 3,
        a: { icon: '⏳', tag: 'Thời kỳ', title: info?.established || 'Dấu mốc lịch sử', sub: 'Thời gian hình thành' },
        b: { icon: '🌟', tag: 'Sứ mệnh', title: 'Gìn giữ & Tự hào', sub: 'Trách nhiệm thế hệ trẻ' }
      }
    ];

    const flat = [];
    rawPairs.forEach((p) => {
      flat.push({ id: `p${p.pairId}_a`, pairId: p.pairId, ...p.a });
      flat.push({ id: `p${p.pairId}_b`, pairId: p.pairId, ...p.b });
    });

    return flat.sort(() => Math.random() - 0.5);
  }, [monumentName, info, currentStt]);

  const [cards, setCards] = useState(initialCards);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    setCards(initialCards);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setIsCompleted(false);
  }, [initialCards]);

  const handleCardClick = (idx) => {
    if (flipped.length >= 2 || flipped.includes(idx) || matched.includes(cards[idx].pairId)) return;
    
    soundEffects.playCardFlip();
    const nextFlipped = [...flipped, idx];
    setFlipped(nextFlipped);

    if (nextFlipped.length === 2) {
      setMoves(m => m + 1);
      const [firstIdx, secondIdx] = nextFlipped;
      const firstCard = cards[firstIdx];
      const secondCard = cards[secondIdx];

      if (firstCard.pairId === secondCard.pairId) {
        soundEffects.playSuccessChime();
        const nextMatched = [...matched, firstCard.pairId];
        setMatched(nextMatched);
        setFlipped([]);

        if (nextMatched.length === 3) {
          setIsCompleted(true);
          soundEffects.playVictoryFanfare();
          try {
            confetti({
              particleCount: 80,
              spread: 80,
              origin: { y: 0.7 }
            });
          } catch (e) {}

          try {
            const passport = getActivePassport();
            trackQuizAttempt({
              passport,
              monumentStt: currentStt,
              monumentName,
              question: `Lật Thẻ Trí Nhớ Di Tích: ${monumentName}`,
              isCorrect: true,
              score: 30
            });
          } catch (e) {}
        }
      } else {
        soundEffects.playWrong();
        setTimeout(() => {
          setFlipped([]);
        }, 850);
      }
    }
  };

  const handleResetMemoryGame = () => {
    soundEffects.playTap();
    setCards([...initialCards].sort(() => Math.random() - 0.5));
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setIsCompleted(false);
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
        {/* ========================================================================= */}
        {/* HÀNG 1: 2 CỘT STUDIO SONG SONG (VIDEO CINEMA & AUDIO STATION - GIAO DIỆN NHẠT THANH LỊCH) */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch pt-2">
          
          {/* ------------------------------------------------------------------------- */}
          {/* CỘT 1: RẠP PHIM TƯ LIỆU GỐC (CINEMA THEATER MODE) - 6 COLS */}
          {/* ------------------------------------------------------------------------- */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-5 sm:p-6 border border-[#EAE3D9] shadow-sm flex flex-col justify-between space-y-4 relative overflow-hidden group">
            
            {/* Header Cinema */}
            <div className="space-y-2 pb-3 border-b border-[#F0EAE1]">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-[#7E1819] text-xs font-black uppercase tracking-wider">
                  <Film className="w-3.5 h-3.5 text-[#7E1819]" />
                  <span>RẠP PHIM TƯ LIỆU GỐC</span>
                </div>

                <div className="flex items-center gap-2 text-[11px]">
                  <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-stone-100 border border-stone-300 text-stone-700 font-mono font-bold">
                    <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                    <span>HD 1080P</span>
                  </span>
                  <button
                    onClick={onOpenVideoModal}
                    className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-[#7E1819] border border-stone-200 transition-colors cursor-pointer"
                    title="Mở toàn màn hình rạp chiếu"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h3 className="font-serif-title font-black text-base sm:text-lg text-[#2C241E] line-clamp-1">
                {video?.title || `Thước phim tư liệu lịch sử: ${monumentName}`}
              </h3>
            </div>

            {/* Video Iframe / Local Video Theater Bezel */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black shadow-md border-2 border-stone-200">
              {video?.videoType === 'local' || video?.localUrl || video?.mp4Url || (video?.src && video.src.endsWith('.mp4')) ? (
                <video
                  className="w-full h-full object-contain bg-black"
                  controls
                  playsInline
                  preload="metadata"
                  src={video?.localUrl || video?.mp4Url || video?.src}
                  title={video?.title || "Phim tư liệu di tích"}
                >
                  Trình duyệt không hỗ trợ phát video MP4.
                </video>
              ) : (
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
              )}
            </div>

            {/* Cinema Chapter Highlights & Actions */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center gap-1.5 flex-wrap text-[11px]">
                <span className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-[#7E1819] font-medium flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#7E1819]" />
                  <span>00:00 Toàn Cảnh</span>
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-[#7E1819] font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#7E1819]" />
                  <span>01:15 Hiện Vật & Dấu Ấn</span>
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-[#7E1819] font-medium flex items-center gap-1">
                  <Award className="w-3 h-3 text-[#7E1819]" />
                  <span>02:30 Giá Trị Lịch Sử</span>
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-stone-500 pt-1 border-t border-[#F0EAE1]">
                <span className="truncate max-w-[240px] text-stone-600 font-medium">
                  {video?.copyright || (video?.channel ? `Bản quyền: ${video.channel}` : 'Bản quyền: Kênh Tư Liệu Lịch Sử')}
                </span>

                <a
                  href={
                    video?.videoType === 'local' || video?.localUrl || video?.mp4Url || (video?.src && video.src.endsWith('.mp4'))
                      ? (video?.localUrl || video?.mp4Url || video?.src)
                      : (video?.youtubeUrl || (video?.driveFileId ? `https://drive.google.com/file/d/${video.driveFileId}/view` : `https://www.youtube.com/watch?v=${youtubeId}`))
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#7E1819] hover:underline flex items-center gap-1 shrink-0 transition-colors"
                >
                  <span>
                    {video?.videoType === 'local' || video?.localUrl || video?.mp4Url || (video?.src && video.src.endsWith('.mp4'))
                      ? 'Xem video gốc MP4'
                      : (video?.videoType === 'drive' || video?.driveFileId || (video?.youtubeUrl && video.youtubeUrl.includes('drive.google.com')) ? 'Mở Drive' : 'Xem trên YouTube')}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------------------------- */}
          {/* CỘT 2: PHÒNG THU THUYẾT MINH DI SẢN (STUDIO SOUND STATION) - 6 COLS */}
          {/* ------------------------------------------------------------------------- */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-5 sm:p-6 border border-[#EAE3D9] shadow-sm flex flex-col justify-between space-y-4 relative overflow-hidden">
            
            {/* Header Studio */}
            <div className="space-y-2 pb-3 border-b border-[#F0EAE1]">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-[#7E1819] text-xs font-black uppercase tracking-wider">
                  <Mic className="w-3.5 h-3.5 text-[#7E1819]" />
                  <span>PHÒNG THU THUYẾT MINH DI SẢN</span>
                </div>

                {/* Speed Selector Tabs */}
                <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200">
                  {[0.75, 1.0, 1.25, 1.5].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => handleSetSpeed(rate)}
                      className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                        playbackRate === rate
                          ? 'bg-[#7E1819] text-white shadow-xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <h3 className="font-serif-title font-black text-base sm:text-lg text-[#2C241E] line-clamp-1">
                  Giọng đọc truyền cảm • Lịch sử {monumentName}
                </h3>
                <span className="text-[11px] font-mono text-[#7E1819] bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 font-bold">
                  MP3 Studio
                </span>
              </div>
            </div>

            {/* Dynamic Animated Waveform Visualizer */}
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D9] shadow-2xs space-y-3.5">
              
              {/* Status Header inside Box */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${isPlaying ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'}`} />
                  <span className="font-bold text-[#2C241E] text-xs sm:text-sm tracking-wide">
                    {isPlaying ? '🔴 Đang phát thuyết minh trực tiếp...' : '⏸️ Sẵn sàng thưởng thức'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 font-mono font-bold text-[#7E1819] bg-white px-2.5 py-0.5 rounded-lg border border-[#EAE3D9]">
                  <span>{formatTime(currentTime)}</span>
                  <span className="text-stone-400">/</span>
                  <span className="text-stone-600">{formatTime(duration)}</span>
                </div>
              </div>

              {/* 32-Bar Live Sound Equalizer Waveform */}
              <div className="h-12 flex items-end justify-between gap-1 px-1 py-1 rounded-xl bg-white border border-[#EAE3D9] overflow-hidden">
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
                          ? 'bg-gradient-to-t from-[#A6732E] to-[#C59B63] shadow-2xs' 
                          : 'bg-stone-200'
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
                    className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#7E1819] focus:outline-none"
                  />
                </div>
              </div>

              {/* Master Playback Controls */}
              <div className="flex items-center justify-between pt-1">
                
                {/* Mute toggle button */}
                <button
                  onClick={handleToggleMute}
                  className="p-2.5 rounded-xl bg-white hover:bg-stone-100 text-[#7E1819] border border-stone-200 transition-all cursor-pointer shadow-2xs"
                  title={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-rose-600" /> : <Volume2 className="w-4 h-4" />}
                </button>

                {/* Main Player Center Trio */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleRewind10}
                    className="p-2.5 rounded-xl bg-white hover:bg-stone-100 text-[#7E1819] border border-stone-200 transition-transform hover:scale-110 cursor-pointer flex items-center gap-1 text-xs font-bold shadow-2xs"
                    title="Lùi lại 10 giây"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span className="text-[10px]">10s</span>
                  </button>

                  <button
                    onClick={handleTogglePlay}
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7E1819] to-[#9E1B1D] hover:from-[#9E1B1D] hover:to-[#7E1819] text-amber-200 flex items-center justify-center shadow-lg shadow-red-950/20 hover:scale-110 active:scale-95 transition-all cursor-pointer border-2 border-amber-300 ${
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
                    className="p-2.5 rounded-xl bg-white hover:bg-stone-100 text-[#7E1819] border border-stone-200 transition-transform hover:scale-110 cursor-pointer flex items-center gap-1 text-xs font-bold shadow-2xs"
                    title="Tua tới 10 giây"
                  >
                    <span className="text-[10px]">10s</span>
                    <RotateCw className="w-4 h-4" />
                  </button>
                </div>

                {/* Full Script Modal Button */}
                <button
                  onClick={onOpenAudioModal}
                  className="p-2.5 rounded-xl bg-white hover:bg-stone-100 text-[#7E1819] border border-stone-200 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                  title="Mở toàn văn kịch bản thuyết minh"
                >
                  <FileText className="w-4 h-4" />
                  <span className="hidden sm:inline text-xs font-bold">Kịch bản</span>
                </button>
              </div>
            </div>

            {/* Teleprompter Dynamic Excerpt */}
            <div 
              onClick={onOpenAudioModal}
              className="p-3 rounded-xl bg-white border border-[#EAE3D9] hover:border-amber-400 transition-all cursor-pointer group shadow-2xs"
              title="Bấm để mở toàn văn kịch bản thuyết minh tự sáng"
            >
              <div className="flex items-center justify-between gap-2 mb-1.5 pb-1 border-b border-[#F0EAE1] text-[10px]">
                <div className="flex items-center gap-1.5 text-[#7E1819] font-bold">
                  <Disc className={`w-3.5 h-3.5 text-[#7E1819] shrink-0 ${isPlaying ? 'animate-spin' : ''}`} />
                  <span>{isPlaying ? 'LỜI THUYẾT MINH TRỰC TIẾP' : 'TRÍCH ĐOẠN THUYẾT MINH'}</span>
                </div>
                {isPlaying && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-[#7E1819] font-black flex items-center gap-1 border border-amber-300 animate-pulse text-[9px] uppercase tracking-wider">
                    <Sparkles className="w-2.5 h-2.5 fill-current" />
                    <span>Tự sáng theo giọng đọc</span>
                  </span>
                )}
              </div>
              <p className={`text-xs leading-relaxed transition-all duration-300 ${
                isPlaying 
                  ? 'text-[#7E1819] font-bold bg-amber-50 px-2 py-1.5 rounded-lg border-l-4 border-amber-500 shadow-2xs' 
                  : 'text-stone-600 italic'
              }`}>
                "{currentSentence?.text || narrationText.slice(0, 150)}..."
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* HÀNG 2: TRÒ CHƠI LẬT THẺ TRÍ NHỚ DI TÍCH (MEMORY FLIP CARD MATCH) */}
        {/* ========================================================================= */}
        <div className="bg-[#FAF7F2] text-[#2C241E] rounded-3xl p-5 sm:p-7 border border-[#EAE3D9] shadow-sm space-y-4 pt-5 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EAE3D9]">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-[#7E1819] text-xs font-black uppercase tracking-wider">
                <span className="text-xs">🃏</span>
                <span className="font-bold tracking-wide text-[#7E1819]">
                  TRÒ CHƠI LẬT THẺ TRÍ NHỚ
                </span>
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              </div>
              <h3 className="font-serif-title font-black text-lg sm:text-xl text-[#2C241E] flex items-center gap-2">
                <span>Ghép Cặp Dấu Ấn Di Tích & Không Gian Di Sản</span>
              </h3>
              <p className="text-xs text-[#666666]">
                Lật mở từng cặp thẻ bài tương ứng để thử tài ghi nhớ các dữ liệu lịch sử vừa tiếp thu qua Video & Thuyết minh!
              </p>
            </div>

            <div className="flex items-center gap-3 self-start sm:self-auto">
              <span className="px-3 py-1 rounded-full bg-amber-50 text-[#7E1819] border border-amber-200 font-bold text-xs uppercase tracking-wider">
                Đã ghép: {matched.length}/3 cặp
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold text-xs uppercase tracking-wider">
                ⭐ +30 XP
              </span>
            </div>
          </div>

          {/* Cards Grid (6 Cards = 3 Pairs) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 pt-2">
            {cards.map((card, idx) => {
              const isFlipped = flipped.includes(idx) || matched.includes(card.pairId);
              const isMatched = matched.includes(card.pairId);

              return (
                <button
                  key={card.id || idx}
                  onClick={() => handleCardClick(idx)}
                  disabled={isMatched || flipped.length >= 2}
                  className={`relative h-32 sm:h-36 rounded-2xl border-2 transition-all duration-300 transform perspective-1000 cursor-pointer shadow-xs ${
                    isMatched
                      ? 'bg-gradient-to-br from-emerald-50 to-emerald-100/70 border-emerald-400 text-emerald-950 scale-100 ring-2 ring-emerald-300/60 shadow-md'
                      : isFlipped
                      ? 'bg-gradient-to-br from-amber-50 to-white border-amber-400 text-[#2C241E] scale-102 ring-2 ring-amber-300/70 shadow-md'
                      : 'bg-gradient-to-br from-[#7E1819] to-[#5C1112] border-amber-300/40 text-amber-200 hover:scale-103 hover:border-amber-400 shadow-md'
                  }`}
                >
                  {isFlipped ? (
                    <div className="p-3 h-full flex flex-col justify-between items-center text-center animate-fadeIn">
                      <span className="text-3xl sm:text-4xl filter drop-shadow-sm mt-1">{card.icon}</span>
                      <div className="w-full">
                        <span className="text-[11px] uppercase font-black px-2 py-0.5 rounded bg-amber-200/80 text-[#7E1819] inline-block mb-1 border border-amber-300/60">
                          {card.tag}
                        </span>
                        <p className="font-extrabold text-xs sm:text-sm leading-snug line-clamp-2 text-[#2C241E]">
                          {card.title}
                        </p>
                      </div>
                      {isMatched && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 animate-bounce" />
                      )}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center gap-1.5 p-2 text-amber-200/90">
                      <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-300/30 flex items-center justify-center text-xl">
                        🏛️
                      </div>
                      <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                        Thẻ #{idx + 1}
                      </span>
                      <span className="text-[10px] text-amber-100/80 font-bold">Chạm để lật</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Victory Announcement Box */}
          {isCompleted && (
            <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-400 text-emerald-950 animate-fadeIn space-y-2">
              <div className="flex items-center gap-2.5 font-bold text-sm text-[#7E1819]">
                <Award className="w-5 h-5 text-emerald-700" />
                <span>Xuất sắc! Bạn đã mở khóa toàn bộ 3 cặp thẻ trí nhớ di tích.</span>
                <span className="text-xs bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded-full font-black">
                  +30 XP Hoàn Thành
                </span>
              </div>
              <p className="text-xs leading-relaxed text-[#444444]">
                👏 Bạn đã ghi nhớ xuất sắc các dấu mốc then chốt của <strong>{monumentName}</strong> ({info?.ranking || 'Di tích Lịch sử'}) tọa lạc tại <em>{info?.address || 'TP.HCM'}</em>. Hãy tiếp tục tiến bước đến Trạm Dòng Thời Gian nhé!
              </p>
            </div>
          )}

          {/* Reset / Replay Button */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-stone-500 font-medium">
              Số lượt lật bài: <strong>{moves}</strong>
            </span>
            <button
              onClick={handleResetMemoryGame}
              className="py-2 px-5 rounded-xl bg-amber-100 hover:bg-amber-200 text-[#7E1819] border border-amber-300 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs hover:scale-102"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Xáo bài & Chơi lại</span>
            </button>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
