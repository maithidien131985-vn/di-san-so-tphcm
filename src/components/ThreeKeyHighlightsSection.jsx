import React, { useState } from 'react';
import {
  UserCheck, Package, Flag, Sparkles, BookOpen,
  Unlock, Lock, Eye, ShieldCheck, Award, Star, Zap
} from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import confetti from 'canvas-confetti';

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

export default function ThreeKeyHighlightsSection({ keyHighlights, monumentName }) {
  if (!keyHighlights) return null;

  const [unlockedCards, setUnlockedCards] = useState({});
  const [allUnlocked, setAllUnlocked] = useState(false);

  const unlockedCount = Object.values(unlockedCards).filter(Boolean).length;

  const handleUnlock = (id) => {
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
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-[#7E1819] text-xs font-black uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5" />
                <span>Kho Báu Di Tích · Cần Khám Phá</span>
              </div>
              <h2 className="font-serif-title font-black text-xl sm:text-2xl lg:text-3xl text-[#2C241E]">
                Nhân Vật · Hiện Vật · Sự Kiện Tiêu Biểu
              </h2>
              <p className="text-xs text-[#666666]">Bấm vào từng thẻ bí mật để mở khóa tư liệu lịch sử cốt lõi về di tích này</p>
            </div>

            {/* Progress Tracker */}
            <div className="flex items-center gap-3 bg-white border border-[#EAE3D9] rounded-2xl px-4 py-3 shadow-xs shrink-0">
              <div className="text-center">
                <div className="text-xl font-black text-[#7E1819] leading-none">{unlockedCount}<span className="text-sm text-gray-400">/3</span></div>
                <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wide mt-0.5">Đã Khám Phá</div>
              </div>
              <div className="flex flex-col gap-1.5 ml-1">
                {CARD_CONFIG.map(c => (
                  <div key={c.id} className={`h-2 w-16 rounded-full transition-all duration-700 ${unlockedCards[c.id] ? 'bg-gradient-to-r from-[#7E1819] to-amber-500 shadow-sm' : 'bg-gray-200'}`} />
                ))}
              </div>
              {allUnlocked && (
                <div className="ml-2 flex items-center gap-1 text-[10px] font-black text-amber-600 bg-amber-50 border border-amber-300 rounded-xl px-2 py-1.5">
                  <Award className="w-4 h-4" />
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
                        <div className={`bg-gradient-to-r ${card.gradient} px-5 py-3.5 flex items-center justify-between`}>
                          <div className="flex items-center gap-2.5 text-white">
                            <span className="text-2xl">{card.emoji}</span>
                            <div>
                              <div className="text-[10px] font-black uppercase tracking-widest text-white/60">{card.labelNum}</div>
                              <div className="font-serif-title font-black text-sm leading-tight">{title}</div>
                            </div>
                          </div>
                          <Lock className="w-5 h-5 text-white/70 group-hover:animate-bounce" />
                        </div>

                        {/* Locked body */}
                        <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 text-center space-y-4">
                          <div
                            className={`w-16 h-16 rounded-full bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                            style={{ boxShadow: `0 0 25px ${card.glowColor}` }}
                          >
                            <Lock className="w-7 h-7 text-white/90" />
                          </div>
                          <div className="space-y-2">
                            <p className="font-serif-title font-bold text-sm text-[#2C241E] leading-snug">{card.mystery}</p>
                            <p className="text-xs text-[#888888] italic leading-relaxed">{card.clue}</p>
                          </div>
                          <button
                            className={`px-5 py-2.5 rounded-xl bg-gradient-to-r ${card.gradient} text-white font-bold text-xs shadow-md hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer group-hover:shadow-lg`}
                          >
                            <Unlock className="w-4 h-4" />
                            <span>Mở Khóa Tư Liệu</span>
                          </button>
                        </div>

                        {/* Bottom hint */}
                        <div className="px-5 py-2.5 bg-white/70 border-t border-gray-200 flex items-center gap-2 text-[11px] text-gray-500">
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          <span>Bấm để khám phá • +20 điểm thám hiểm</span>
                        </div>
                      </div>
                    )}

                    {/* === UNLOCKED STATE === */}
                    {isUnlocked && (
                      <div className={`flex flex-col h-full bg-gradient-to-br ${card.bgLight}`}>
                        {/* Top bar */}
                        <div className={`bg-gradient-to-r ${card.gradient} px-5 py-3.5 flex items-center justify-between`}>
                          <div className="flex items-center gap-2.5 text-white">
                            <span className="text-2xl">{card.emoji}</span>
                            <div>
                              <div className="text-[10px] font-black uppercase tracking-widest text-white/60">{card.labelNum}</div>
                              <div className="font-serif-title font-black text-sm leading-tight">{title}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 bg-white/20 border border-white/30 rounded-full px-2.5 py-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-white" />
                            <span className="text-[10px] text-white font-bold">Đã mở khóa</span>
                          </div>
                        </div>

                        {/* Unlocked body */}
                        <div className="flex-1 p-5 space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-[11px] font-semibold text-[#555555] leading-snug flex-1 italic">{subtitle}</p>
                            <span className={`shrink-0 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${card.badgeBg}`}>
                              {card.tag}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={`h-0.5 flex-1 bg-gradient-to-r ${card.gradient} opacity-25 rounded-full`} />
                            <Icon className={`w-4 h-4 ${card.accentColor} opacity-50`} />
                            <div className={`h-0.5 flex-1 bg-gradient-to-r ${card.gradient} opacity-25 rounded-full`} />
                          </div>
                          <p className="text-xs sm:text-sm text-[#333333] leading-relaxed text-justify">{details}</p>
                        </div>

                        {/* Bottom bar */}
                        <div className={`px-5 py-3 border-t ${card.borderColor} flex items-center justify-between`}>
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#7E1819]">
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Tư liệu lịch sử xác thực</span>
                          </div>
                          <div className="flex items-center gap-1 text-[10px] font-black text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
                            <Sparkles className="w-3 h-3" />
                            <span>+20 điểm</span>
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

