import React, { useState, useEffect } from 'react';
import {
  UserCheck, Package, Flag, Sparkles, BookOpen,
  Unlock, Lock, Eye, ShieldCheck, Award, Star, Zap
} from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import confetti from 'canvas-confetti';
import WordByWordTitle from './WordByWordTitle';

const CARD_CONFIG = [
  {
    id: 'figures',
    titleKey: 'figures',
    defaultTitle: 'Nhân Vật Lịch Sử',
    defaultSubtitle: 'Những con người làm nên lịch sử',
    defaultDetails: 'Gắn liền với các anh hùng, chiến sĩ và nhân dân kiên trung.',
    tag: 'Nhân chứng lịch sử',
    icon: UserCheck,
    emoji: '👤',
    gradient: 'from-[#7E1819] via-[#96171a] to-[#7E1819]',
    glowColor: 'rgba(126,24,25,0.35)',
    borderColor: 'border-red-800/40',
    badgeBg: 'bg-red-100 text-[#7E1819] border-red-300',
    accentColor: 'text-[#7E1819]',
    bgLight: 'from-[#FFF8F8] to-[#FFF0F0]',
    labelNum: '01',
    mystery: 'Ai là người đã định hình lịch sử nơi này?',
    clue: '🔍 Manh mối: Những cái tên gắn liền với các sự kiện chấn động...',
  },
  {
    id: 'artifacts',
    titleKey: 'artifacts',
    defaultTitle: 'Hiện Vật Tiêu Biểu',
    defaultSubtitle: 'Chứng tích và bảo vật nguyên bản',
    defaultDetails: 'Hệ thống hiện vật lịch sử, khí tài và công trình kiến trúc.',
    tag: 'Bảo vật di sản',
    icon: Package,
    emoji: '🏺',
    gradient: 'from-[#2D5016] via-[#3a6b1f] to-[#2D5016]',
    glowColor: 'rgba(45,80,22,0.35)',
    borderColor: 'border-green-900/30',
    badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    accentColor: 'text-emerald-800',
    bgLight: 'from-[#F3FAF3] to-[#E8F5E8]',
    labelNum: '02',
    mystery: 'Những vật phẩm nào đang được lưu giữ tại đây?',
    clue: '🔍 Manh mối: Những đồ vật im lặng nhưng kể nhiều câu chuyện...',
  },
  {
    id: 'events',
    titleKey: 'events',
    defaultTitle: 'Sự Kiện Tiêu Biểu',
    defaultSubtitle: 'Những mốc son lịch sử hào hùng',
    defaultDetails: 'Các sự kiện đấu tranh giải phóng dân tộc và dấu mốc xếp hạng.',
    tag: 'Dấu ấn lịch sử',
    icon: Flag,
    emoji: '📅',
    gradient: 'from-[#8B5E1A] via-[#a06e20] to-[#8B5E1A]',
    glowColor: 'rgba(139,94,26,0.35)',
    borderColor: 'border-amber-700/40',
    badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
    accentColor: 'text-amber-800',
    bgLight: 'from-[#FFFBF0] to-[#FFF5DC]',
    labelNum: '03',
    mystery: 'Sự kiện nào đã làm thay đổi dòng chảy lịch sử?',
    clue: '🔍 Manh mối: Một ngày, một thời khắc, một quyết định...',
  }
];

import { soundEffects } from '../utils/soundEffects';

export default function ThreeKeyHighlightsSection({ keyHighlights, monumentName }) {
  if (!keyHighlights) return null;

  const [unlockedCards, setUnlockedCards] = useState({});
  const [allUnlocked, setAllUnlocked] = useState(false);

  // Reset state về trạng thái bị khóa mới mỗi khi học sinh chuyển sang di tích khác
  useEffect(() => {
    setUnlockedCards({});
    setAllUnlocked(false);
  }, [monumentName, keyHighlights]);

  const unlockedCount = Object.values(unlockedCards).filter(Boolean).length;

  const handleUnlock = (id) => {
    soundEffects.playUnlock();
    const newUnlocked = { ...unlockedCards, [id]: true };
    setUnlockedCards(newUnlocked);
    const count = Object.values(newUnlocked).filter(Boolean).length;
    if (count === 3 && !allUnlocked) {
      setAllUnlocked(true);
      setTimeout(() => {
        try { confetti({ particleCount: 120, spread: 100, origin: { y: 0.6 } }); } catch (e) {}
      }, 200);
    }
  };

  return (
    <section className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 py-6">
      <ScrollReveal>
        <div className="space-y-6">

          {/* ====== SECTION HEADER ====== */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-3 border-b border-[#EAE3D9]">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-[#7E1819] text-xs font-black uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5" />
                <span>Kho Báu Di Tích · Cần Khám Phá</span>
              </div>
              <WordByWordTitle
                as="h2"
                text="Nhân Vật · Hiện Vật · Sự Kiện Tiêu Biểu"
                className="font-serif-title font-black text-2xl sm:text-3xl lg:text-4xl text-[#2C241E]"
                staggerDelay={0.05}
              />
              <p className="text-xs sm:text-sm md:text-base text-[#666666]">
                Bấm vào từng thẻ bí mật để mở khóa tư liệu lịch sử cốt lõi về di tích này
              </p>
            </div>

            {/* Progress Tracker */}
            <div className="flex items-center gap-3 bg-white border border-[#EAE3D9] rounded-2xl px-4 py-3 shadow-xs shrink-0">
              <div className="text-center">
                <div className="text-2xl font-black text-[#7E1819] leading-none">{unlockedCount}<span className="text-sm text-gray-400">/3</span></div>
                <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wide mt-0.5">Đã Khám Phá</div>
              </div>
              <div className="flex flex-col gap-1.5 ml-1">
                {CARD_CONFIG.map(c => (
                  <div key={c.id} className={`h-2 w-16 rounded-full transition-all duration-700 ${unlockedCards[c.id] ? 'bg-gradient-to-r from-[#7E1819] to-amber-500 shadow-sm' : 'bg-gray-200'}`} />
                ))}
              </div>
              {allUnlocked && (
                <div className="ml-2 flex items-center gap-1 text-xs font-black text-amber-700 bg-amber-50 border border-amber-300 rounded-xl px-2.5 py-1.5">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>Hoàn thành!</span>
                </div>
              )}
            </div>
          </div>

          {/* ====== 3 INTERACTIVE CARDS ====== */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {CARD_CONFIG.map((card) => {
              const Icon = card.icon;
              const data = keyHighlights[card.titleKey] || {};
              const title = data.title || card.defaultTitle;
              const subtitle = data.subtitle || card.defaultSubtitle;
              const details = typeof data.details === 'string' ? data.details : card.defaultDetails;
              const isUnlocked = !!unlockedCards[card.id];

              return (
                <div key={card.id} className="flex flex-col">
                  <div
                    className={`relative rounded-2xl border-2 overflow-hidden transition-all duration-500 flex flex-col
                      ${isUnlocked
                        ? `${card.borderColor} shadow-lg`
                        : 'border-gray-200 shadow-md'
                      }`}
                    style={isUnlocked ? { boxShadow: `0 8px 30px ${card.glowColor}, 0 2px 8px rgba(0,0,0,0.08)` } : {}}
                  >

                    {/* === LOCKED STATE === */}
                    {!isUnlocked && (
                      <div
                        onClick={() => handleUnlock(card.id)}
                        className="flex flex-col h-full min-h-[280px] bg-gradient-to-br from-gray-50 to-gray-100 cursor-pointer select-none hover:scale-[1.02] hover:shadow-xl transition-all duration-300 group"
                      >
                        {/* Top gradient bar */}
                        <div className={`h-3 bg-gradient-to-r ${card.gradient}`} />

                        <div className="p-6 flex flex-col justify-between flex-1 space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-gray-400">{card.labelNum}</span>
                              <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${card.badgeBg}`}>
                                {card.emoji} BÍ MẬT DI TÍCH
                              </span>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-gray-200 group-hover:bg-amber-100 group-hover:border-amber-400 border border-gray-300 flex items-center justify-center transition-colors">
                              <Lock className="w-4 h-4 text-gray-500 group-hover:text-amber-700" />
                            </div>
                          </div>

                          {/* Mystery question */}
                          <div className="space-y-2">
                            <h3 className="font-serif-title font-black text-lg sm:text-xl text-[#2C241E] leading-snug">
                              {card.mystery}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-500 italic">
                              {card.clue}
                            </p>
                          </div>

                          {/* Action button */}
                          <div className="pt-2">
                            <div className={`w-full py-2.5 px-4 rounded-xl bg-gradient-to-r ${card.gradient} text-white font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 group-hover:shadow-lg transition-all`}>
                              <Unlock className="w-4 h-4 text-amber-200" />
                              <span>Mở Khóa Tư Liệu</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* === UNLOCKED STATE === */}
                    {isUnlocked && (
                      <div className="flex flex-col h-full bg-white animate-fadeIn">
                        {/* Top colored bar with icon */}
                        <div className={`bg-gradient-to-r ${card.gradient} p-4 text-white flex items-center justify-between`}>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shadow-xs font-bold">
                              <Icon className="w-5 h-5" />
                            </div>
                            <div>
                              <span className="text-[10px] uppercase font-black tracking-widest text-amber-200 block">
                                {card.labelNum}
                              </span>
                              <h3 className="font-serif-title font-black text-base sm:text-lg text-white leading-tight">
                                {title}
                              </h3>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold bg-white/20 text-white px-2 py-0.5 rounded-full backdrop-blur-xs flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-amber-300" />
                            <span>Đã mở khóa</span>
                          </span>
                        </div>

                        {/* Content body */}
                        <div className="p-5 flex flex-col justify-between flex-1 space-y-4">
                          <div className="space-y-2">
                            {subtitle && (
                              <p className="text-xs sm:text-sm text-[#777777] font-bold italic leading-snug">
                                {subtitle}
                              </p>
                            )}
                            <p className="text-xs sm:text-sm md:text-base text-[#3A3028] leading-relaxed text-justify pt-1 font-body-historic">
                              {details}
                            </p>
                          </div>

                          <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-gray-500">
                            <span className="flex items-center gap-1.5 text-[#7E1819] font-black">
                              <BookOpen className="w-4 h-4 text-[#7E1819]" />
                              <span>Tư liệu lịch sử xác thực</span>
                            </span>
                            <span className="text-amber-700 bg-amber-100/70 border border-amber-300 px-2.5 py-0.5 rounded-full font-black text-xs">
                              +20 điểm
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ====== ALL-UNLOCKED CELEBRATION BANNER ====== */}
          {allUnlocked && (
            <div className="rounded-2xl bg-gradient-to-r from-[#7E1819] via-[#9E1B1D] to-[#BA8438] p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/20 border-2 border-amber-300 flex items-center justify-center shadow-lg">
                  <Award className="w-8 h-8 text-amber-300" />
                </div>
                <div className="text-white">
                  <div className="font-serif-title font-black text-base sm:text-lg leading-tight">
                    🎉 Bạn đã khám phá đủ 3 tư liệu cốt lõi về di tích này!
                  </div>
                  <div className="text-xs text-white/80 mt-1">
                    Huy hiệu "Nhà Nghiên Cứu Di Sản" đã được ghi vào hồ sơ. Tiếp tục điều tra phần bên dưới!
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white/15 border border-amber-300/50 rounded-xl px-4 py-2.5 shrink-0">
                <Eye className="w-5 h-5 text-amber-300" />
                <span className="text-white font-black text-sm">+60 Điểm Thám Hiểm</span>
              </div>
            </div>
          )}

        </div>
      </ScrollReveal>
    </section>
  );
}

