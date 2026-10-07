import React, { useState, useEffect, useMemo } from 'react';
import { 
  Landmark, 
  Calendar, 
  Image as ImageIcon, 
  ChevronRight, 
  Play, 
  Film, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  BookOpen, 
  Search,
  Eye,
  Award,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  GripVertical,
  Lock,
  Unlock,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEffects } from '../utils/soundEffects';
import WordByWordTitle from './WordByWordTitle';
import { getActivePassport } from '../utils/passportStorage';
import { trackQuizAttempt } from '../utils/studentAnalytics';

export default function HistorySection({
  overview = '',
  timeline = [],
  gallery = [],
  isEditMode,
  onUpdateOverview,
  onOpenLightbox,
  onOpenMilestoneDetail,
  onOpenVideo,
  monumentData,
  monumentName = '',
  info,
  keyHighlights
}) {
  const safeTimeline = Array.isArray(timeline) ? timeline : [];
  const safeGallery = Array.isArray(gallery) ? gallery : [];

  // ==========================================
  // ==========================================
  // GAME TRẠM 2: KÉO - THẢ XẾP NIÊN ĐẠI DÒNG THỜI GIAN
  // ==========================================
  const baseMilestones = useMemo(() => {
    if (safeTimeline.length > 0) {
      return safeTimeline.map((item, idx) => ({
        originalIndex: idx,
        year: item.year || item.time || item.date || `Mốc ${idx + 1}`,
        title: item.title || item.event || item.description || 'Dấu mốc quan trọng',
        description: item.description || item.title || ''
      }));
    }
    return [
      { originalIndex: 0, year: 'Khởi dựng', title: 'Đặt nền móng xây dựng công trình', description: 'Giai đoạn tạo dựng ban đầu' },
      { originalIndex: 1, year: 'Kháng chiến', title: 'Gắn liền với phong trào cách mạng', description: 'Căn cứ và dấu ấn lịch sử' },
      { originalIndex: 2, year: 'Xếp hạng', title: 'Được công nhận Di tích Lịch sử', description: 'Vinh danh cấp Nhà nước' },
      { originalIndex: 3, year: 'Hiện nay', title: 'Bảo tồn & Phát huy giá trị di sản', description: 'Giáo dục truyền thống cho thế hệ trẻ' }
    ];
  }, [safeTimeline]);

  const currentStt = info?.stt || monumentData?.stt || 1;
  const timelineStorageKey = `di_san_so_timeline_unlocked_${currentStt}`;

  const [isTimelineUnlocked, setIsTimelineUnlocked] = useState(() => {
    try {
      return localStorage.getItem(timelineStorageKey) === 'true';
    } catch (e) {
      return false;
    }
  });

  const [shuffledItems, setShuffledItems] = useState(() => {
    return [...baseMilestones].sort(() => Math.random() - 0.5);
  });
  const [isTimelineChecked, setIsTimelineChecked] = useState(false);
  const [isTimelineSuccess, setIsTimelineSuccess] = useState(() => {
    try {
      return localStorage.getItem(timelineStorageKey) === 'true';
    } catch (e) {
      return false;
    }
  });
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  useEffect(() => {
    try {
      const unlocked = localStorage.getItem(timelineStorageKey) === 'true';
      setIsTimelineUnlocked(unlocked);
      setIsTimelineSuccess(unlocked);
    } catch (e) {
      setIsTimelineUnlocked(false);
      setIsTimelineSuccess(false);
    }
  }, [currentStt, timelineStorageKey]);

  useEffect(() => {
    setShuffledItems([...baseMilestones].sort(() => Math.random() - 0.5));
    setIsTimelineChecked(false);
    setDraggedIndex(null);
    setDragOverIndex(null);
  }, [baseMilestones]);

  const handleDragStart = (e, index) => {
    soundEffects.playTap();
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    try {
      e.dataTransfer.setData('text/plain', String(index));
    } catch (err) {}
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = (e, index) => {
    if (dragOverIndex === index) {
      setDragOverIndex(null);
    }
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === undefined) return;
    if (draggedIndex === targetIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    soundEffects.playTap();
    const updated = [...shuffledItems];
    const [movedItem] = updated.splice(draggedIndex, 1);
    updated.splice(targetIndex, 0, movedItem);

    setShuffledItems(updated);
    setDraggedIndex(null);
    setDragOverIndex(null);
    setIsTimelineChecked(false);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleMoveItem = (fromIdx, direction) => {
    soundEffects.playTap();
    const toIdx = fromIdx + direction;
    if (toIdx < 0 || toIdx >= shuffledItems.length) return;

    const updated = [...shuffledItems];
    const temp = updated[fromIdx];
    updated[fromIdx] = updated[toIdx];
    updated[toIdx] = temp;
    setShuffledItems(updated);
    setIsTimelineChecked(false);
  };

  const handleCheckTimelineOrder = () => {
    const isCorrect = shuffledItems.every((item, idx) => item.originalIndex === idx);
    setIsTimelineChecked(true);
    setIsTimelineSuccess(isCorrect);

    if (isCorrect) {
      setIsTimelineUnlocked(true);
      try {
        localStorage.setItem(timelineStorageKey, 'true');
      } catch (e) {}

      soundEffects.playVictoryFanfare();
      try {
        confetti({
          particleCount: 75,
          spread: 70,
          origin: { y: 0.65 }
        });
      } catch (e) {}

      try {
        const passport = getActivePassport();
        trackQuizAttempt({
          passport,
          monumentStt: info?.stt || 1,
          monumentName,
          question: `Sắp Xếp Dòng Thời Gian: ${monumentName}`,
          isCorrect: true,
          score: 50
        });
      } catch (e) {}
    } else {
      soundEffects.playWrong();
    }
  };

  const handleResetTimelineGame = () => {
    soundEffects.playTap();
    setShuffledItems([...baseMilestones].sort(() => Math.random() - 0.5));
    setIsTimelineChecked(false);
    setIsTimelineSuccess(false);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const correctCount = shuffledItems.filter((item, idx) => item.originalIndex === idx).length;

  return (
    <div id="history-section" className="bg-[#FAF4EE] rounded-3xl p-6 sm:p-8 border-2 border-[#E8DCCB] shadow-sm space-y-7">
      {/* ========================================================================= */}
      {/* 1. GIÁ TRỊ LỊCH SỬ CARD */}
      {/* ========================================================================= */}
      <section className="bg-white rounded-2xl p-6 sm:p-7 border border-[#EAE3D9] shadow-2xs space-y-4">
        <div className="flex items-center justify-between gap-3 pb-3.5 border-b border-[#F0EAE1]">
          <div className="flex items-center gap-3 text-[#7E1819]">
            <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-[#7E1819] shadow-2xs shrink-0">
              <Landmark className="w-6 h-6" />
            </div>
            <div>
              <WordByWordTitle
                as="h2"
                text="Giá Trị Lịch Sử & Ý Nghĩa Di Sản"
                className="text-2xl sm:text-3xl lg:text-4xl font-black font-serif-title tracking-tight text-[#7E1819]"
                staggerDelay={0.05}
              />
              <p className="text-xs sm:text-sm text-stone-600">
                Biên niên sử vàng son và dấu ấn không thể phai mờ
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-flex text-xs font-bold px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
            Tư liệu lịch sử xác thực
          </span>
        </div>

        {isEditMode ? (
          <textarea
            rows={5}
            value={overview || ''}
            onChange={(e) => onUpdateOverview && onUpdateOverview(e.target.value)}
            className="w-full p-4 rounded-xl border-2 border-amber-400 bg-amber-50/30 text-[#2C241E] text-base sm:text-lg md:text-xl leading-relaxed outline-none focus:ring-2 focus:ring-amber-500 font-serif-title font-medium"
          />
        ) : (
          <div className="p-5 sm:p-6 rounded-2xl bg-[#FAF7F2]/70 border border-[#EFE8DE]">
            <p className="text-[#2C241E] text-lg sm:text-xl md:text-2xl leading-relaxed sm:leading-loose text-justify font-serif-title font-medium first-letter:text-5xl first-letter:font-black first-letter:text-[#7E1819] first-letter:float-left first-letter:mr-3 first-letter:leading-none">
              {overview || 'Thông tin tổng quan về di tích lịch sử đang được cập nhật.'}
            </p>
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 2. HỘP TRÒ CHƠI TRẠM 2: KÉO - THẢ XẾP NIÊN ĐẠI LỊCH SỬ (TIMELINE ORDER GAME) */}
      {/* ========================================================================= */}
      <section className="bg-white text-[#2C241E] rounded-2xl p-6 sm:p-7 border border-[#EAE3D9] shadow-2xs space-y-5 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-[#EAE3D9]">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 border border-amber-300 text-[#7E1819] text-xs font-black uppercase tracking-wider shadow-2xs">
              <span className="text-sm">⏳</span>
              <span className="font-bold tracking-wide text-[#7E1819]">
                TRÒ CHƠI KÉO - THẢ XẾP DÒNG THỜI GIAN
              </span>
              <Sparkles className="w-4 h-4 text-amber-600" />
            </div>
            <h3 className="font-serif-title font-black text-xl sm:text-2xl md:text-3xl text-[#2C241E] flex items-center gap-2">
              <span>Phục Hồi Trật Tự Niên Đại Các Sự Kiện</span>
            </h3>
            <p className="text-sm sm:text-base font-semibold text-[#4A3E36] leading-relaxed">
              ✋ Giữ và kéo thả các thẻ sự kiện (hoặc dùng nút ▲ ▼) để xếp lại đúng trật tự niên đại từ Quá khứ đến Hiện tại!
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {isTimelineUnlocked && (
              <span className="px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-2xs">
                <Unlock className="w-3.5 h-3.5 text-emerald-700" />
                <span>Đã Mở Khóa Trục Thời Gian</span>
              </span>
            )}
            <span className="px-3.5 py-1.5 rounded-full bg-amber-50 text-[#7E1819] border border-amber-200 font-bold text-xs sm:text-sm uppercase tracking-wider shadow-2xs">
              ⭐ +50 Điểm Thám Hiểm
            </span>
          </div>
        </div>

        {/* Shuffled Timeline List (Interactive Drag & Drop Ordering) */}
        <div className="space-y-3 pt-1 select-none">
          {shuffledItems.map((item, idx) => {
            const isCorrectPosition = isTimelineChecked && item.originalIndex === idx;
            const isWrongPosition = isTimelineChecked && item.originalIndex !== idx;
            const isDragging = draggedIndex === idx;
            const isDragOver = dragOverIndex === idx && draggedIndex !== idx;

            return (
              <div
                key={item.year + '_' + item.originalIndex}
                draggable={!isTimelineSuccess}
                onDragStart={(e) => handleDragStart(e, idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDragLeave={(e) => handleDragLeave(e, idx)}
                onDrop={(e) => handleDrop(e, idx)}
                onDragEnd={handleDragEnd}
                className={`group p-4 sm:p-5 rounded-2xl border-2 transition-all duration-200 flex items-center justify-between gap-3 shadow-2xs ${
                  isDragging
                    ? 'opacity-40 scale-98 border-dashed border-amber-500 bg-amber-50/50 shadow-inner'
                    : isDragOver
                    ? 'ring-4 ring-amber-400/80 border-amber-500 bg-amber-100/90 scale-102 shadow-lg -translate-y-1 z-10'
                    : isTimelineSuccess
                    ? 'bg-emerald-50/90 border-emerald-400 text-emerald-950 ring-2 ring-emerald-300/60'
                    : isCorrectPosition
                    ? 'bg-emerald-50/60 border-emerald-300 text-emerald-900'
                    : isWrongPosition
                    ? 'bg-rose-50/60 border-rose-300 text-rose-900'
                    : 'bg-white border-[#EAE3D9] text-[#2C241E] hover:border-amber-400/90 hover:shadow-md hover:bg-amber-50/30 cursor-grab active:cursor-grabbing'
                }`}
              >
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  {/* Drag Handle Icon */}
                  <div 
                    className={`p-2 rounded-xl transition-colors shrink-0 flex items-center justify-center ${
                      isTimelineSuccess
                        ? 'text-emerald-500 bg-emerald-100/50'
                        : 'text-stone-400 group-hover:text-amber-700 bg-stone-100 group-hover:bg-amber-100 cursor-grab active:cursor-grabbing'
                    }`}
                    title="Giữ và kéo thả để di chuyển vị trí"
                  >
                    <GripVertical className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>

                  <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-100 text-[#7E1819] font-black text-sm sm:text-base flex items-center justify-center shrink-0 border border-amber-300">
                    #{idx + 1}
                  </span>
                  <div className="min-w-0">
                    <span className="inline-block px-3 py-0.5 rounded-full bg-amber-200/70 text-[#7E1819] font-black text-xs sm:text-sm mb-1.5">
                      {item.year}
                    </span>
                    <p className="font-bold text-sm sm:text-base md:text-lg text-[#2C241E] leading-snug">
                      {item.title}
                    </p>
                  </div>
                </div>

                {/* Up / Down Controls (Accessible buttons for touch and keyboard) */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoveItem(idx, -1);
                    }}
                    disabled={idx === 0 || isTimelineSuccess}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#7E1819] disabled:opacity-30 disabled:hover:bg-amber-50 border border-amber-200 flex items-center justify-center cursor-pointer transition-all hover:scale-105"
                    title="Di chuyển lên trên"
                  >
                    <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoveItem(idx, 1);
                    }}
                    disabled={idx === shuffledItems.length - 1 || isTimelineSuccess}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#7E1819] disabled:opacity-30 disabled:hover:bg-amber-50 border border-amber-200 flex items-center justify-center cursor-pointer transition-all hover:scale-105"
                    title="Di chuyển xuống dưới"
                  >
                    <ArrowDown className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Feedback message */}
        {isTimelineChecked && (
          <div className={`p-4 sm:p-5 rounded-2xl border-2 animate-fadeIn space-y-2 ${
            isTimelineSuccess
              ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
              : 'bg-amber-50 border-amber-300 text-[#2C241E]'
          }`}>
            <div className="flex items-center gap-2.5 font-bold text-base sm:text-lg text-[#7E1819]">
              {isTimelineSuccess ? (
                <>
                  <Award className="w-6 h-6 text-emerald-700 shrink-0" />
                  <span>Chính xác tuyệt đối! Bạn đã mở khóa thành công toàn bộ Dòng Thời Gian Lịch Sử.</span>
                </>
              ) : (
                <>
                  <Clock className="w-6 h-6 text-amber-700 shrink-0" />
                  <span>Hiện có {correctCount}/{shuffledItems.length} mốc đang ở đúng vị trí. Hãy điều chỉnh thêm nhé!</span>
                </>
              )}
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-[#555555] font-medium">
              {isTimelineSuccess
                ? '🎉 Trục Dấu Mốc Lịch Sử toàn cảnh đã được mở khóa ngay bên dưới và lưu trữ vĩnh viễn trên thiết bị của bạn.'
                : '💡 Gợi ý: Hãy phân tích tiến trình từ mốc năm xa xưa nhất đến mốc sự kiện gần hiện tại nhất.'}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={handleResetTimelineGame}
            className="py-3 px-5 sm:px-6 rounded-xl bg-amber-100 hover:bg-amber-200 text-[#7E1819] border border-amber-300 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs hover:scale-102"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Xáo trộn & Làm lại</span>
          </button>

          {!isTimelineSuccess && (
            <button
              onClick={handleCheckTimelineOrder}
              className="py-3 px-7 sm:px-9 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-black text-sm sm:text-base transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md hover:scale-103"
            >
              <Check className="w-5 h-5" />
              <span>Kiểm Tra Niên Đại ⏳</span>
            </button>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. DẤU MỐC LỊCH SỬ - TRỤC THỜI GIAN NGANG */}
      {/* ========================================================================= */}
      {isTimelineUnlocked ? (
        <section className="bg-white rounded-2xl p-6 sm:p-7 border border-[#EAE3D9] shadow-2xs space-y-6 animate-scaleUp">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-[#F0EAE1]">
            <div className="flex items-center gap-3 text-[#7E1819]">
              <div className="w-11 h-11 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-[#7E1819] shadow-2xs shrink-0">
                <Clock className="w-6 h-6 text-[#7E1819]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-black font-serif-title text-[#2C241E]">
                    Dấu Mốc Lịch Sử & Dòng Thời Gian
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] sm:text-xs font-black uppercase tracking-wider flex items-center gap-1">
                    <Unlock className="w-3 h-3 text-emerald-700" />
                    <span>Đã Mở Khóa</span>
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-medium text-[#666666]">
                  Chạm vào từng dấu mốc để xem chi tiết tư liệu sự kiện
                </p>
              </div>
            </div>
          </div>

          {/* TRỤC THỜI GIAN NGANG (HORIZONTAL TIMELINE AXIS) */}
          <div className="w-full py-4 overflow-x-auto no-scrollbar">
            <div 
              className="relative py-6 px-4"
              style={{
                minWidth: `${Math.max(650, safeTimeline.length * 170)}px`
              }}
            >
              {/* Đường trục ngang màu vàng kim với mũi tên sang phải */}
              <div className="absolute top-[36px] left-8 right-8 h-[2px] bg-[#C59B63] -translate-y-1/2 flex items-center justify-end z-0">
                <div className="w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[10px] border-l-[#C59B63] translate-x-2" />
              </div>

              {/* Các nút mốc thời gian phân bổ đều trên trục ngang */}
              <div 
                className="relative z-10 grid gap-4 items-start"
                style={{
                  gridTemplateColumns: `repeat(${safeTimeline.length || 1}, minmax(140px, 1fr))`
                }}
              >
                {safeTimeline.map((item, idx) => (
                  <div 
                    key={item.id || idx}
                    onClick={() => onOpenMilestoneDetail && onOpenMilestoneDetail(item)}
                    className="flex flex-col items-center text-center cursor-pointer group px-2 transition-all hover:-translate-y-1"
                  >
                    {/* Nút tròn đồng tâm đặt chính giữa trục */}
                    <div className="w-7 h-7 rounded-full bg-white border-[3px] border-[#C59B63] flex items-center justify-center shadow-xs group-hover:scale-125 group-hover:border-[#7E1819] transition-all mb-3 z-10">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#C59B63] group-hover:bg-[#7E1819] transition-colors" />
                    </div>

                    {/* Dòng 1: Thời gian / Ngày tháng / Năm (Màu đỏ sẫm, in đậm) */}
                    <span className="font-serif-title font-bold text-sm sm:text-base md:text-lg text-[#8B1417] tracking-tight group-hover:text-red-700 transition-colors">
                      {item.year || item.time || `Mốc ${idx + 1}`}
                    </span>

                    {/* Dòng 2: Nội dung tóm tắt sự kiện */}
                    <p className="text-xs sm:text-sm font-semibold text-[#2C241E] leading-relaxed mt-1 max-w-[220px] line-clamp-3 group-hover:text-[#7E1819] transition-colors">
                      {item.title || item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : (
        /* KHUNG THÔNG BÁO NIÊM PHONG KHI CHƯA MỞ KHÓA */
        <section className="bg-amber-50/80 rounded-2xl p-6 sm:p-7 border-2 border-dashed border-amber-300 shadow-2xs space-y-3 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-100 text-amber-900 border border-amber-300 shadow-inner mb-1">
            <Lock className="w-7 h-7 text-[#7E1819] animate-pulse" />
          </div>
          <h4 className="font-serif-title font-black text-lg sm:text-xl text-[#7E1819]">
            🔒 Dòng Thời Gian Lịch Sử Đang Được Niêm Phong
          </h4>
          <p className="text-sm sm:text-base font-semibold text-stone-700 max-w-xl mx-auto leading-relaxed">
            Hãy hoàn thành xuất sắc trò chơi <strong>"Kéo - Thả Xếp Dòng Thời Gian"</strong> ở trên để giải mã và mở khóa toàn bộ trục thời gian lịch sử của di tích này!
          </p>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 4. KHO BÁU ẢNH TƯ LIỆU: CÂU CHUYỆN DI TÍCH */}
      {/* ========================================================================= */}
      <section className="bg-white rounded-2xl p-6 sm:p-7 border border-[#EAE3D9] shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-[#F0EAE1]">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 text-[#7E1819]">
              <ImageIcon className="w-5 h-5 text-[#7E1819]" />
              <h3 className="text-lg sm:text-xl font-black font-serif-title text-[#2C241E]">
                Kho Báu Ảnh Tư Liệu: Mỗi Hình Ảnh Là Một Câu Chuyện
              </h3>
            </div>
            <p className="text-xs text-[#666666]">
              📖 Chạm vào ảnh để lật mở câu chuyện lịch sử chân thực và chi tiết bí ẩn chưa kể.
            </p>
          </div>

          <button
            onClick={() => onOpenLightbox && onOpenLightbox(0)}
            className="text-xs font-bold text-[#7E1819] hover:text-[#911d1e] px-3.5 py-1.5 rounded-full bg-red-50 hover:bg-red-100 border border-red-200 shrink-0 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Xem tất cả ({safeGallery.length} ảnh)</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Photo Story Grid: CHỈ 1 HÀNG (TỐI ĐA 4 ẢNH) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {safeGallery.slice(0, 4).map((img, idx) => {
            const isLastOfRow = idx === 3 && safeGallery.length > 4;
            const remainingCount = safeGallery.length - 3;

            return (
              <div
                key={img.id || idx}
                onClick={() => onOpenLightbox && onOpenLightbox(idx)}
                className="group relative rounded-2xl overflow-hidden bg-gray-100 border border-[#EAE3D9] hover:border-amber-400 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col"
              >
                {/* Image Thumbnail */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/5">
                  <img
                    src={img.src}
                    alt={img.title || `Tư liệu ${idx + 1}`}
                    loading="lazy"
                    className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${isLastOfRow ? 'brightness-50' : ''}`}
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                  {/* Badge: Story Card */}
                  {!isLastOfRow && (
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-amber-300 border border-amber-300/40 text-[10px] font-bold shadow-xs">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Câu chuyện #{idx + 1}</span>
                    </div>
                  )}

                  {/* THẺ CUỐI CÙNG: KHÁM PHÁ THÊM NỔI BẬT */}
                  {isLastOfRow ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center bg-black/60 backdrop-blur-xs text-white space-y-1.5 group-hover:bg-black/70 transition-all">
                      <div className="w-10 h-10 rounded-full bg-amber-400 text-[#7E1819] flex items-center justify-center shadow-lg font-black text-sm">
                        +{remainingCount}
                      </div>
                      <span className="font-serif-title font-black text-xs sm:text-sm text-amber-200">
                        Khám phá thêm
                      </span>
                      <span className="text-[10px] text-white/80">
                        {remainingCount} ảnh tư liệu lịch sử
                      </span>
                    </div>
                  ) : (
                    /* Hover Eye Icon */
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-10 h-10 rounded-full bg-white/90 text-[#7E1819] flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform">
                        <Eye className="w-5 h-5" />
                      </div>
                    </div>
                  )}

                  {/* Bottom title inside image for mobile */}
                  {!isLastOfRow && (
                    <div className="absolute bottom-2 left-2 right-2 text-white text-[11px] font-bold line-clamp-1 group-hover:text-amber-200 transition-colors">
                      {img.title}
                    </div>
                  )}
                </div>

                {/* Bottom Caption Card */}
                <div className="p-3 bg-white flex-1 flex flex-col justify-between space-y-1 border-t border-[#F0EAE1]">
                  <h4 className="text-xs font-bold text-[#2C241E] line-clamp-2 group-hover:text-[#7E1819] transition-colors">
                    {isLastOfRow ? `Xem thêm ${remainingCount} ảnh tư liệu khác` : img.title}
                  </h4>
                  <div className="flex items-center justify-between pt-1 text-[10px] text-gray-500">
                    <span className="text-[#7E1819] font-bold flex items-center gap-0.5">
                      <span>{isLastOfRow ? 'Mở album' : 'Khám phá ngay'}</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                    <span>{img.year || 'Tư liệu'}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
