import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  Volume2, 
  SkipBack, 
  SkipForward, 
  Headphones, 
  Clock,
  VolumeX,
  Sparkles,
  Download
} from 'lucide-react';
import { speakVietnamese, stopVietnameseSpeech } from '../utils/vietnameseVoice';

export default function AudioNarratorModal({ 
  isOpen, 
  onClose, 
  audioScript = [], 
  monumentName = 'Di tích Dinh Độc Lập',
  audioUrl = '/assets/audio/thuyet-minh-dinh-doc-lap.mp3'
}) {
  const isDinhDocLap = monumentName.toLowerCase().includes('dinh độc lập');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [rate, setRate] = useState(1);
  const [ttsEngine, setTtsEngine] = useState(isDinhDocLap ? 'studio' : 'system');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  // Audio refs
  const studioAudioRef = useRef(null);

  useEffect(() => {
    setTtsEngine(isDinhDocLap ? 'studio' : 'system');

    return () => {
      stopAllAudio();
    };
  }, [isOpen, isDinhDocLap]);

  const stopAllAudio = () => {
    if (studioAudioRef.current) {
      studioAudioRef.current.pause();
    }
    stopVietnameseSpeech();
    setIsPlaying(false);
  };

  // Format seconds to mm:ss
  const formatTime = (secs) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleTimeUpdate = () => {
    if (studioAudioRef.current) {
      const cur = studioAudioRef.current.currentTime;
      setCurrentTime(cur);
      
      if (studioAudioRef.current.duration) {
        const dur = studioAudioRef.current.duration;
        setDuration(dur);
        
        if (audioScript && audioScript.length > 0 && dur > 0) {
          const prog = cur / dur;
          const estimatedSection = Math.min(
            audioScript.length - 1,
            Math.floor(prog * audioScript.length)
          );
          setCurrentSectionIndex(estimatedSection);
        }
      }
    }
  };

  const handleSeek = (e) => {
    const targetTime = parseFloat(e.target.value);
    setCurrentTime(targetTime);
    if (studioAudioRef.current) {
      studioAudioRef.current.currentTime = targetTime;
    }
  };

  const handleSeekOffset = (seconds) => {
    if (studioAudioRef.current) {
      const dur = studioAudioRef.current.duration || duration || 0;
      studioAudioRef.current.currentTime = Math.max(
        0,
        Math.min(dur, studioAudioRef.current.currentTime + seconds)
      );
    }
  };

  const speakSection = (index = currentSectionIndex) => {
    stopAllAudio();
    if (!audioScript || !audioScript[index]) return;

    if (ttsEngine === 'studio' && isDinhDocLap) {
      if (studioAudioRef.current) {
        studioAudioRef.current.playbackRate = rate;
        studioAudioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(err => {
            console.warn('Studio audio err, fallback to VN speech:', err);
            speakWithVietnameseVoice(index);
          });
      }
    } else {
      speakWithVietnameseVoice(index);
    }
  };

  const speakWithVietnameseVoice = (index) => {
    if (!audioScript || !audioScript[index]) return;
    const textToSpeak = `${audioScript[index].title}. ${audioScript[index].text}`;

    speakVietnamese(textToSpeak, {
      rate: rate,
      onStart: () => setIsPlaying(true),
      onEnd: () => {
        if (index < audioScript.length - 1) {
          const nextIndex = index + 1;
          setCurrentSectionIndex(nextIndex);
          speakSection(nextIndex);
        } else {
          setIsPlaying(false);
        }
      },
      onError: () => setIsPlaying(false)
    });
  };

  const handleTogglePlay = () => {
    if (!isPlaying) {
      if (ttsEngine === 'studio' && isDinhDocLap && studioAudioRef.current) {
        studioAudioRef.current.playbackRate = rate;
        studioAudioRef.current.play().catch(e => console.warn('Audio play failed:', e));
        setIsPlaying(true);
      } else {
        speakSection(currentSectionIndex);
      }
    } else {
      stopAllAudio();
    }
  };

  const handleNext = () => {
    if (ttsEngine === 'studio' && isDinhDocLap) {
      handleSeekOffset(15);
    } else if (currentSectionIndex < audioScript.length - 1) {
      const nextIdx = currentSectionIndex + 1;
      setCurrentSectionIndex(nextIdx);
      if (isPlaying) speakSection(nextIdx);
    }
  };

  const handlePrev = () => {
    if (ttsEngine === 'studio' && isDinhDocLap) {
      handleSeekOffset(-15);
    } else if (currentSectionIndex > 0) {
      const prevIdx = currentSectionIndex - 1;
      setCurrentSectionIndex(prevIdx);
      if (isPlaying) speakSection(prevIdx);
    }
  };

  const handleSelectSection = (idx) => {
    setCurrentSectionIndex(idx);
    if (ttsEngine === 'studio' && isDinhDocLap && studioAudioRef.current && duration > 0) {
      const targetTime = (idx / audioScript.length) * duration;
      studioAudioRef.current.currentTime = targetTime;
      if (!isPlaying) {
        studioAudioRef.current.play();
        setIsPlaying(true);
      }
    } else {
      speakSection(idx);
    }
  };

  const handleClose = () => {
    stopAllAudio();
    onClose();
  };

  const toggleMute = () => {
    if (studioAudioRef.current) {
      studioAudioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#FAF7F2] w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl border border-[#EADBC8] flex flex-col max-h-[92vh] animate-scaleUp">
        {/* Hidden Audio Element */}
        {isDinhDocLap && (
          <audio
            ref={studioAudioRef}
            src={audioUrl}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={() => {
              if (studioAudioRef.current) setDuration(studioAudioRef.current.duration);
            }}
            onEnded={() => setIsPlaying(false)}
            onError={() => {
              if (studioAudioRef.current && !studioAudioRef.current.src.includes('drive.google.com')) {
                studioAudioRef.current.src = 'https://drive.usercontent.google.com/download?id=1JcoOtDlFfUVT0PQJcAje0KTllUdfYt77&export=download&authuser=0&confirm=t';
                studioAudioRef.current.load();
              }
            }}
          />
        )}

        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#7B1113] via-[#96171a] to-[#7B1113] text-white p-5 sm:p-6 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center border border-white/20 shadow-inner">
              <Headphones className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-serif-title font-black text-lg sm:text-xl text-amber-100">
                  Thuyết Minh Giọng Đọc Di Tích
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-[#7B1113] text-[10px] font-black uppercase tracking-wider shadow-xs">
                  {isDinhDocLap ? '🎙️ Studio Google Drive' : '🔊 AI Voice Tiếng Việt'}
                </span>
              </div>
              <p className="text-xs text-white/80">
                {monumentName} • Nghe thuyết minh lịch sử tự động
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Engine Switcher */}
        <div className="bg-[#FAF0E6] px-6 py-2.5 border-b border-[#EADBC8] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#7B1113]">Bộ phát:</span>
            <div className="inline-flex rounded-xl p-0.5 bg-white border border-[#EADBC8] shadow-2xs">
              {isDinhDocLap && (
                <button
                  onClick={() => {
                    stopAllAudio();
                    setTtsEngine('studio');
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    ttsEngine === 'studio'
                      ? 'bg-[#7B1113] text-white shadow-xs'
                      : 'text-[#6B5E55] hover:text-[#7B1113]'
                  }`}
                >
                  🎙️ Bản thu âm Google Drive
                </button>
              )}
              <button
                onClick={() => {
                  stopAllAudio();
                  setTtsEngine('system');
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  ttsEngine === 'system'
                    ? 'bg-[#7B1113] text-white shadow-xs'
                    : 'text-[#6B5E55] hover:text-[#7B1113]'
                }`}
              >
                🔊 Giọng đọc AI Tiếng Việt
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isDinhDocLap && (
              <a
                href="https://drive.google.com/file/d/1JcoOtDlFfUVT0PQJcAje0KTllUdfYt77/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[11px] font-bold text-[#7B1113] hover:underline"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Tải file MP3 gốc</span>
              </a>
            )}
          </div>
        </div>

        {/* Main Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* Main Playback Controller Bar */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#EADBC8] shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Play / Pause / Skip controls */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrev}
                  className="w-10 h-10 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-all cursor-pointer hover:scale-105"
                  title="Tua lùi 15s"
                >
                  <SkipBack className="w-5 h-5" />
                </button>

                <button
                  onClick={handleTogglePlay}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg transition-all transform hover:scale-105 cursor-pointer ${
                    isPlaying
                      ? 'bg-amber-600 hover:bg-amber-700 ring-4 ring-amber-300/50'
                      : 'bg-[#7B1113] hover:bg-[#96171a]'
                  }`}
                >
                  {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
                </button>

                <button
                  onClick={handleNext}
                  className="w-10 h-10 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-all cursor-pointer hover:scale-105"
                  title="Tua nhanh 15s"
                >
                  <SkipForward className="w-5 h-5" />
                </button>
              </div>

              {/* Status and soundwave */}
              <div className="flex items-center gap-3 text-center sm:text-left">
                {isPlaying && (
                  <div className="flex items-center gap-1 h-5">
                    <span className="w-1 bg-[#7B1113] rounded-full animate-bounce h-3" />
                    <span className="w-1 bg-[#7B1113] rounded-full animate-bounce h-5" style={{ animationDelay: '0.2s' }} />
                    <span className="w-1 bg-[#7B1113] rounded-full animate-bounce h-4" style={{ animationDelay: '0.4s' }} />
                    <span className="w-1 bg-[#7B1113] rounded-full animate-bounce h-2" style={{ animationDelay: '0.1s' }} />
                  </div>
                )}
                <div>
                  <div className="text-xs font-bold text-[#7B1113]">
                    {isPlaying ? 'Đang phát thuyết minh...' : 'Đang tạm dừng'}
                  </div>
                  <div className="text-[11px] text-gray-500 font-medium truncate max-w-[200px]">
                    {audioScript[currentSectionIndex]?.title || monumentName}
                  </div>
                </div>
              </div>

              {/* Speed & Mute */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 text-xs font-bold text-gray-700">
                  {[0.75, 1, 1.25, 1.5].map((s) => (
                    <button
                      key={s}
                      onClick={() => setRate(s)}
                      className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                        rate === s ? 'bg-[#7B1113] text-white' : 'hover:bg-gray-200'
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>

                {isDinhDocLap && (
                  <button
                    onClick={toggleMute}
                    className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer"
                    title={isMuted ? "Bật âm thanh" : "Tắt tiếng"}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-red-600" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                )}
              </div>
            </div>

            {/* Timeline Seek Bar */}
            {isDinhDocLap && duration > 0 && (
              <div className="space-y-1 pt-2">
                <div className="flex items-center justify-between text-[11px] text-gray-500 font-medium">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  step={0.5}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#7B1113]"
                />
              </div>
            )}
          </div>

          {/* Script Content Paragraphs with Synchronized Highlighting */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-[#2C241E] flex items-center justify-between">
              <span>Nội Dung Thuyết Minh Chi Tiết ({audioScript.length} phần):</span>
              <span className="text-xs text-[#7B1113] font-normal">
                (Nhấn vào từng phần để nghe ngay)
              </span>
            </h4>

            <div className="space-y-2.5">
              {audioScript.map((sec, idx) => {
                const isActive = currentSectionIndex === idx;

                return (
                  <div
                    key={sec.index || idx}
                    onClick={() => handleSelectSection(idx)}
                    className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
                      isActive
                        ? 'bg-amber-50/90 border-[#7B1113] ring-1 ring-[#7B1113]/30 shadow-xs'
                        : 'bg-white border-[#EADBC8] hover:border-[#7B1113]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <h5 className={`font-bold text-xs sm:text-sm ${
                        isActive ? 'text-[#7B1113]' : 'text-[#2C241E]'
                      }`}>
                        {sec.title}
                      </h5>
                      {isActive && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-black uppercase tracking-wider">
                          Đang nghe
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-[#4A3E36] leading-relaxed">
                      {sec.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-[#FAF0E6] border-t border-[#EADBC8] flex items-center justify-between text-xs text-[#8C7A6B]">
          <span>Thuyết minh số hóa Di sản Văn hóa & Lịch sử TP.HCM</span>
          <span className="font-bold text-[#7B1113]">Audio Lịch Sử</span>
        </div>
      </div>
    </div>
  );
}
