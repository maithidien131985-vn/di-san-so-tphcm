import React, { useState, useEffect, useMemo, useRef } from 'react';
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
import soundEffects from '../utils/soundEffects';
import { useSharedAudio } from '../utils/sharedAudioManager';
import { parseScriptIntoSentences, getActiveSentenceIndex } from '../utils/audioScriptSync';

export default function AudioNarratorModal({ 
  isOpen, 
  onClose, 
  audioScript = [], 
  monumentName = 'Di tích Lịch sử',
  monumentStt = 1,
  audioUrl
}) {
  const baseUrl = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
  const resolvedAudioUrl = audioUrl || `${baseUrl}/assets/audio/monument-audio-${monumentStt}.mp3`;

  const sharedAudio = useSharedAudio(monumentStt, resolvedAudioUrl);

  const [ttsEngine, setTtsEngine] = useState('studio'); // 'studio' | 'system'
  const [ttsPlaying, setTtsPlaying] = useState(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const activeSentenceRef = useRef(null);

  // Normalize audioScript: whether it's a string, array of strings, or array of objects
  const normalizedSections = useMemo(() => {
    if (!audioScript) {
      return [{ index: 0, title: 'Thuyết minh tổng quan', text: `Chào mừng bạn đến với ${monumentName}.` }];
    }
    if (typeof audioScript === 'string') {
      const paragraphs = audioScript.split('\n\n').filter(p => p.trim().length > 0);
      if (paragraphs.length > 0) {
        return paragraphs.map((p, i) => ({
          index: i,
          title: `Phần ${i + 1}: ${p.slice(0, 35)}...`,
          text: p.trim()
        }));
      }
      return [{ index: 0, title: 'Thuyết minh di tích', text: audioScript }];
    }
    if (Array.isArray(audioScript)) {
      if (audioScript.length === 0) {
        return [{ index: 0, title: 'Thuyết minh tổng quan', text: `Chào mừng bạn đến với ${monumentName}.` }];
      }
      return audioScript.map((item, i) => {
        if (typeof item === 'string') {
          return { index: i, title: `Phần ${i + 1}`, text: item };
        }
        return {
          index: item.index !== undefined ? item.index : i,
          title: item.title || `Phần ${i + 1}`,
          text: item.text || item.content || ''
        };
      });
    }
    return [{ index: 0, title: 'Thuyết minh tổng quan', text: `Chào mừng bạn đến với ${monumentName}.` }];
  }, [audioScript, monumentName]);

  // Synchronized sentence time map
  const syncedSentences = useMemo(() => {
    return parseScriptIntoSentences(normalizedSections, sharedAudio.duration || 180);
  }, [normalizedSections, sharedAudio.duration]);

  // Active glowing sentence index
  const activeSentenceIndex = useMemo(() => {
    return getActiveSentenceIndex(syncedSentences, sharedAudio.currentTime);
  }, [syncedSentences, sharedAudio.currentTime]);

  // Sync active section from active sentence
  useEffect(() => {
    if (syncedSentences[activeSentenceIndex]) {
      setCurrentSectionIndex(syncedSentences[activeSentenceIndex].secIdx);
    }
  }, [activeSentenceIndex, syncedSentences]);

  // Auto-scroll active glowing sentence into view smoothly
  useEffect(() => {
    if (sharedAudio.isPlaying && activeSentenceRef.current) {
      activeSentenceRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [activeSentenceIndex, sharedAudio.isPlaying]);

  const isPlaying = ttsEngine === 'studio' ? sharedAudio.isPlaying : ttsPlaying;
  const currentTime = sharedAudio.currentTime;
  const duration = sharedAudio.duration;
  const rate = sharedAudio.playbackRate;
  const isMuted = sharedAudio.isMuted;
  const formatTime = sharedAudio.formatTime;

  const speakWithVietnameseVoice = (index) => {
    if (!normalizedSections || !normalizedSections[index]) return;
    const textToSpeak = `${normalizedSections[index].title}. ${normalizedSections[index].text}`;

    setTtsPlaying(true);
    speakVietnamese(textToSpeak, {
      rate: rate,
      onStart: () => setTtsPlaying(true),
      onEnd: () => {
        if (index < normalizedSections.length - 1) {
          const nextIndex = index + 1;
          setCurrentSectionIndex(nextIndex);
          speakWithVietnameseVoice(nextIndex);
        } else {
          setTtsPlaying(false);
        }
      },
      onError: () => setTtsPlaying(false)
    });
  };

  const handleTogglePlay = () => {
    soundEffects.playTap();
    if (ttsEngine === 'studio') {
      stopVietnameseSpeech();
      setTtsPlaying(false);
      sharedAudio.togglePlay();
    } else {
      if (ttsPlaying) {
        stopVietnameseSpeech();
        setTtsPlaying(false);
      } else {
        sharedAudio.pause();
        speakWithVietnameseVoice(currentSectionIndex);
      }
    }
  };

  const handleSeek = (e) => {
    const targetTime = parseFloat(e.target.value);
    sharedAudio.seek(targetTime);
  };

  const handleNext = () => {
    soundEffects.playTap();
    if (ttsEngine === 'studio') {
      sharedAudio.seekOffset(15);
    } else if (currentSectionIndex < normalizedSections.length - 1) {
      const nextIdx = currentSectionIndex + 1;
      setCurrentSectionIndex(nextIdx);
      if (ttsPlaying) speakWithVietnameseVoice(nextIdx);
    }
  };

  const handlePrev = () => {
    soundEffects.playTap();
    if (ttsEngine === 'studio') {
      sharedAudio.seekOffset(-15);
    } else if (currentSectionIndex > 0) {
      const prevIdx = currentSectionIndex - 1;
      setCurrentSectionIndex(prevIdx);
      if (ttsPlaying) speakWithVietnameseVoice(prevIdx);
    }
  };

  const handleSelectSection = (idx) => {
    soundEffects.playTap();
    setCurrentSectionIndex(idx);
    if (ttsEngine === 'studio' && sharedAudio.duration > 0 && normalizedSections.length > 0) {
      const targetTime = (idx / normalizedSections.length) * sharedAudio.duration;
      sharedAudio.seek(targetTime);
      sharedAudio.play();
    } else if (ttsEngine === 'system') {
      speakWithVietnameseVoice(idx);
    }
  };

  const handleClose = () => {
    soundEffects.playTap();
    if (ttsEngine === 'system') {
      stopVietnameseSpeech();
      setTtsPlaying(false);
    }
    onClose();
  };

  const toggleMute = () => {
    soundEffects.playTap();
    sharedAudio.toggleMute();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#FAF7F2] w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl border border-[#EADBC8] flex flex-col max-h-[92vh] animate-scaleUp">
        
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
                  🎙️ Bản Thu Âm Thực Tế #{monumentStt}
                </span>
              </div>
              <p className="text-xs text-white/80">
                {monumentName} • Nghe thuyết minh lịch sử chuẩn hóa
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
              <button
                onClick={() => {
                  stopVietnameseSpeech();
                  setTtsPlaying(false);
                  setTtsEngine('studio');
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  ttsEngine === 'studio'
                    ? 'bg-[#7B1113] text-white shadow-xs'
                    : 'text-[#6B5E55] hover:text-[#7B1113]'
                }`}
              >
                🎙️ Bản thu âm chính thức (MP3)
              </button>
              <button
                onClick={() => {
                  sharedAudio.pause();
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
            <a
              href={resolvedAudioUrl}
              download={`thuyet-minh-di-tich-${monumentStt}.mp3`}
              className="flex items-center gap-1 text-[11px] font-bold text-[#7B1113] hover:underline"
              title="Tải file âm thanh MP3 về máy"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tải file MP3 (#{monumentStt})</span>
            </a>
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
                  className="w-10 h-10 rounded-2xl bg-[#FAF0E6] hover:bg-[#F3E5D8] flex items-center justify-center text-[#7B1113] transition-colors cursor-pointer"
                  title="Lùi lại 15 giây"
                >
                  <SkipBack className="w-5 h-5" />
                </button>

                <button
                  onClick={handleTogglePlay}
                  className="w-14 h-14 rounded-2xl bg-[#7B1113] hover:bg-[#96171a] text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-pointer"
                  title={isPlaying ? "Tạm dừng" : "Phát tiếp âm thanh"}
                >
                  {isPlaying ? (
                    <Pause className="w-7 h-7 fill-white" />
                  ) : (
                    <Play className="w-7 h-7 fill-white ml-0.5" />
                  )}
                </button>

                <button
                  onClick={handleNext}
                  className="w-10 h-10 rounded-2xl bg-[#FAF0E6] hover:bg-[#F3E5D8] flex items-center justify-center text-[#7B1113] transition-colors cursor-pointer"
                  title="Tua tới 15 giây"
                >
                  <SkipForward className="w-5 h-5" />
                </button>
              </div>

              {/* Status information */}
              <div className="text-center sm:text-left flex-1 min-w-0 px-2">
                <div className="text-xs font-bold text-[#7B1113] truncate">
                  {isPlaying ? 'Đang phát thuyết minh...' : 'Đang tạm dừng'}
                </div>
                <div className="text-xs text-[#6B5E55] truncate mt-0.5">
                  {normalizedSections[currentSectionIndex]?.title || 'Thuyết minh di tích'}
                </div>
              </div>

              {/* Rate & Volume Controls */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-[#FAF0E6] rounded-xl p-1 text-xs font-bold text-[#7B1113]">
                  {[0.75, 1, 1.25, 1.5].map((r) => (
                    <button
                      key={r}
                      onClick={() => sharedAudio.setPlaybackRate(r)}
                      className={`px-2 py-0.5 rounded-lg transition-colors cursor-pointer ${
                        rate === r ? 'bg-[#7B1113] text-white' : 'hover:bg-white'
                      }`}
                    >
                      {r}x
                    </button>
                  ))}
                </div>

                <button
                  onClick={toggleMute}
                  className="w-9 h-9 rounded-xl bg-[#FAF0E6] hover:bg-[#F3E5D8] flex items-center justify-center text-[#7B1113] transition-colors cursor-pointer"
                  title={isMuted ? "Bật âm thanh" : "Tắt tiếng"}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Visual Timeline Seek Slider */}
            {ttsEngine === 'studio' && (
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-xs font-mono text-[#6B5E55]">
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
              <span>Nội Dung Thuyết Minh Chi Tiết ({normalizedSections.length} phần):</span>
              <span className="text-xs text-[#7B1113] font-normal">
                (Nhấn vào từng phần để nghe ngay)
              </span>
            </h4>

            <div className="space-y-3">
              {normalizedSections.map((sec, idx) => {
                const isActiveSection = currentSectionIndex === idx;
                const sectionSentences = syncedSentences.filter(s => s.secIdx === idx);

                return (
                  <div
                    key={sec.index || idx}
                    onClick={() => handleSelectSection(idx)}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${
                      isActiveSection
                        ? 'bg-gradient-to-br from-amber-50 via-white to-amber-50/60 border-[#8B1417] ring-2 ring-[#8B1417]/30 shadow-md'
                        : 'bg-white border-[#EADBC8] hover:border-[#8B1417]/40 hover:bg-stone-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-rose-100/60">
                      <div className="flex items-center gap-2">
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black ${
                          isActiveSection ? 'bg-[#8B1417] text-amber-200' : 'bg-stone-100 text-stone-600'
                        }`}>
                          {idx + 1}
                        </div>
                        <h5 className={`font-serif-title font-bold text-xs sm:text-sm ${
                          isActiveSection ? 'text-[#8B1417]' : 'text-[#2C241E]'
                        }`}>
                          {sec.title}
                        </h5>
                      </div>
                      {isActiveSection && isPlaying && (
                        <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-red-600 to-[#8B1417] text-amber-200 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-xs animate-pulse">
                          <Sparkles className="w-2.5 h-2.5 fill-current" />
                          <span>Đang đọc tự sáng</span>
                        </span>
                      )}
                    </div>

                    {/* Sentence-by-Sentence Glowing Text */}
                    <div className="text-xs sm:text-sm leading-relaxed">
                      {sectionSentences.length > 0 ? (
                        sectionSentences.map((sent) => {
                          const isCurrent = sent.globalIndex === activeSentenceIndex && isPlaying;
                          const isPast = sent.globalIndex < activeSentenceIndex;

                          return (
                            <span
                              key={sent.id}
                              ref={isCurrent ? activeSentenceRef : null}
                              onClick={(e) => {
                                e.stopPropagation();
                                soundEffects.playTap();
                                sharedAudio.seek(sent.startTime);
                                sharedAudio.play();
                              }}
                              className={`inline rounded-md transition-all duration-300 cursor-pointer mr-1.5 px-1 py-0.5 ${
                                isCurrent
                                  ? 'bg-amber-300/80 text-[#8B1417] font-black shadow-md ring-2 ring-amber-400 ring-offset-1 ring-offset-amber-50 drop-shadow-xs animate-pulse'
                                  : isPast
                                  ? 'text-[#2C241E] font-medium hover:bg-amber-100/70 hover:text-[#8B1417]'
                                  : 'text-stone-500/80 font-normal hover:bg-amber-50 hover:text-[#8B1417]'
                              }`}
                              title={`Bấm để nghe từ: ${formatTime(sent.startTime)}`}
                            >
                              {sent.text}
                            </span>
                          );
                        })
                      ) : (
                        <p className="text-[#4A3E36]">{sec.text}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-[#FAF0E6] border-t border-[#EADBC8] flex items-center justify-between text-xs text-[#8C7A6B]">
          <span>Thuyết minh số hóa Di sản Văn hóa & Lịch sử TP.HCM</span>
          <span className="font-bold text-[#7B1113]">Audio Di Tích #{monumentStt}</span>
        </div>
      </div>
    </div>
  );
}
