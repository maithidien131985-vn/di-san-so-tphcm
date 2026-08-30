import React from 'react';
import { BookOpen, Search, Sparkles, ArrowRight, Sprout, MapPin } from 'lucide-react';
import confetti from 'canvas-confetti';
import ScrollReveal from './ScrollReveal';

export default function QuickActionCards({
  onOpenAudio,
  onOpenInvestigation,
  onOpenAction,
  onOpenContribute
}) {
  const cards = [
    {
      id: 'explore',
      title: 'KHÁM PHÁ',
      description: 'Tìm hiểu tổng quan về di tích',
      icon: (
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-100/20 border border-amber-200/30 flex items-center justify-center text-amber-200 shadow-inner">
          <BookOpen className="w-7 h-7 sm:w-8 sm:h-8" />
        </div>
      ),
      bgClass: 'bg-[#7E1819] hover:bg-[#911d1e]',
      onClick: () => {
        confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
        const el = document.getElementById('history-section');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else if (onOpenAudio) {
          onOpenAudio();
        }
      }
    },
    {
      id: 'investigate',
      title: 'ĐIỀU TRA',
      description: 'Khám phá chứng cứ và tư liệu',
      icon: (
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-100/20 border border-amber-200/30 flex items-center justify-center text-amber-200 shadow-inner">
          <Search className="w-7 h-7 sm:w-8 sm:h-8" />
        </div>
      ),
      bgClass: 'bg-[#475E3E] hover:bg-[#526c48]',
      onClick: () => {
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
        if (onOpenInvestigation) onOpenInvestigation();
      }
    },
    {
      id: 'act',
      title: 'HÀNH ĐỘNG',
      description: 'Giữ gìn và phát huy giá trị di sản',
      icon: (
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-100/20 border border-amber-200/30 flex items-center justify-center text-amber-200 shadow-inner">
          <Sprout className="w-7 h-7 sm:w-8 sm:h-8" />
        </div>
      ),
      bgClass: 'bg-[#BA8438] hover:bg-[#ce933e]',
      onClick: () => {
        confetti({ particleCount: 45, spread: 70, origin: { y: 0.6 } });
        if (onOpenAction) onOpenAction();
      }
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 relative z-30">
      <ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {cards.map((card) => (
            <div
              key={card.id}
              onClick={card.onClick}
              className={`${card.bgClass} text-white rounded-2xl p-5 sm:p-6 shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl cursor-pointer flex items-center justify-between gap-4 select-none group border border-white/15`}
            >
              <div className="flex items-center gap-4">
                {card.icon}
                <div className="space-y-1">
                  <h3 className="font-serif-title font-black text-lg sm:text-xl tracking-wider text-white group-hover:text-amber-200 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/90 font-normal leading-snug">
                    {card.description}
                  </p>
                </div>
              </div>

              <div className="w-8 h-8 rounded-full bg-white/20 group-hover:bg-white text-white group-hover:text-[#7E1819] flex items-center justify-center shrink-0 transition-all duration-300 shadow-sm">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
}
