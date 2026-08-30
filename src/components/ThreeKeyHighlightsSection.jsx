import React from 'react';
import { UserCheck, Package, Flag, Sparkles, ChevronRight, Award, Shield, Bookmark } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export default function ThreeKeyHighlightsSection({ keyHighlights, monumentName }) {
  if (!keyHighlights) return null;

  const cards = [
    {
      id: 'figures',
      title: 'Nhân vật liên quan',
      subtitle: keyHighlights.figures?.subtitle || 'Những con người làm nên lịch sử',
      details: keyHighlights.figures?.details || 'Gắn liền với các anh hùng, chiến sĩ và nhân dân kiên trung.',
      tag: 'Nhân chứng lịch sử',
      icon: UserCheck,
      color: 'from-[#7E1819] to-[#96171a]',
      badgeBg: 'bg-red-50 text-[#7E1819] border-red-200',
      iconBg: 'bg-[#7E1819] text-amber-200'
    },
    {
      id: 'artifacts',
      title: 'Hiện vật tiêu biểu',
      subtitle: keyHighlights.artifacts?.subtitle || 'Chứng tích, bảo vật và dấu ấn nguyên bản',
      details: keyHighlights.artifacts?.details || 'Hệ thống hiện vật lịch sử, khí tài và công trình kiến trúc.',
      tag: 'Bảo vật di sản',
      icon: Package,
      color: 'from-[#475E3E] to-[#3a4d33]',
      badgeBg: 'bg-emerald-50 text-emerald-900 border-emerald-200',
      iconBg: 'bg-[#475E3E] text-amber-200'
    },
    {
      id: 'events',
      title: 'Sự kiện tiêu biểu',
      subtitle: keyHighlights.events?.subtitle || 'Những mốc son và chiến công hào hùng',
      details: keyHighlights.events?.details || 'Các sự kiện đấu tranh giải phóng dân tộc và dấu mốc xếp hạng.',
      tag: 'Dấu ấn lịch sử',
      icon: Flag,
      color: 'from-[#BA8438] to-[#9c6e2e]',
      badgeBg: 'bg-amber-50 text-amber-900 border-amber-200',
      iconBg: 'bg-[#BA8438] text-white'
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <ScrollReveal>
        <div className="space-y-6">
          {/* Section Header */}
          <div className="flex items-center justify-between pb-2 border-b border-[#EAE3D9]">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-100/70 border border-amber-300 text-[#7E1819] text-xs font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Tư Liệu Cốt Lõi Về Di Tích</span>
              </div>
              <h2 className="font-serif-title font-black text-xl sm:text-2xl text-[#2C241E]">
                Nhân Vật • Hiện Vật • Sự Kiện Tiêu Biểu
              </h2>
            </div>
            <span className="hidden sm:inline-block text-xs font-bold text-[#7E1819] bg-white px-3 py-1.5 rounded-xl border border-[#EAE3D9] shadow-2xs">
              🏛️ {monumentName}
            </span>
          </div>

          {/* 3 Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {cards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.id}
                  className="bg-white rounded-2xl p-5 sm:p-6 border border-[#EAE3D9] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    {/* Card Top */}
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center font-bold shadow-xs`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${card.badgeBg}`}>
                        {card.tag}
                      </span>
                    </div>

                    {/* Title & Subtitle */}
                    <div className="space-y-1">
                      <h3 className="font-serif-title font-black text-base sm:text-lg text-[#2C241E] group-hover:text-[#7E1819] transition-colors leading-snug">
                        {card.title}
                      </h3>
                      <p className="text-xs text-[#777777] font-medium leading-tight">
                        {card.subtitle}
                      </p>
                    </div>

                    {/* Details content */}
                    <p className="text-xs sm:text-sm text-[#444444] leading-relaxed line-clamp-5 text-justify pt-1">
                      {card.details}
                    </p>
                  </div>

                  {/* Card Bottom subtle bar */}
                  <div className="pt-4 mt-4 border-t border-[#F5EFE6] flex items-center justify-between text-xs font-bold text-[#7E1819]">
                    <span>Tư liệu lịch sử xác thực</span>
                    <Bookmark className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
