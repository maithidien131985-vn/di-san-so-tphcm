import React from 'react';
import { Volume2, Search, Heart, Sparkles, ArrowRight, UploadCloud } from 'lucide-react';
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
      badge: 'KHÁM PHÁ',
      badgeColor: 'bg-red-100 text-[#7B1113]',
      title: 'Nghe thuyết minh audio',
      description: 'Lắng nghe giọng đọc tiếng Việt truyền cảm, bản thu âm lịch sử chuẩn studio về Dinh Độc Lập.',
      btnText: 'Bắt đầu nghe',
      icon: Volume2,
      color: 'from-[#7B1113] to-[#96171a]',
      glowClass: 'glow-crimson',
      onClick: (e) => {
        confetti({ particleCount: 35, spread: 50, origin: { y: 0.7 } });
        if (onOpenAudio) onOpenAudio();
      }
    },
    {
      id: 'investigate',
      badge: 'ĐIỀU TRA',
      badgeColor: 'bg-amber-100 text-amber-900',
      title: 'Hồ sơ chứng cứ lịch sử',
      description: 'Khảo sát 3 hồ sơ tư liệu: Sự kiện tiêu biểu, Nhân vật liên quan, Hiện vật tiêu biểu và làm bài thử thách.',
      btnText: 'Bắt đầu điều tra',
      icon: Search,
      color: 'from-amber-600 to-amber-700',
      glowClass: 'glow-gold',
      onClick: (e) => {
        confetti({ particleCount: 45, spread: 60, origin: { y: 0.7 } });
        if (onOpenInvestigation) onOpenInvestigation();
      }
    },
    {
      id: 'contribute',
      badge: 'ĐÓNG GÓP',
      badgeColor: 'bg-purple-100 text-purple-900',
      title: 'Thu thập dữ liệu di sản',
      description: 'Đóng góp tư liệu, hình ảnh, ký ức hoặc đề xuất di tích mới để người sở hữu kiểm duyệt và đăng web.',
      btnText: 'Gửi tư liệu ngay',
      icon: UploadCloud,
      color: 'from-purple-600 to-indigo-700',
      glowClass: 'glow-purple',
      onClick: (e) => {
        confetti({ particleCount: 45, spread: 60, origin: { y: 0.7 } });
        if (onOpenContribute) onOpenContribute();
      }
    },
    {
      id: 'act',
      badge: 'HÀNH ĐỘNG',
      badgeColor: 'bg-emerald-100 text-emerald-900',
      title: 'Gửi cam kết bảo tồn',
      description: 'Chia sẻ thông điệp tự hào và ký tên vào bảng vàng lưu danh bảo vệ các giá trị di sản số dân tộc.',
      btnText: 'Gửi thông điệp',
      icon: Heart,
      color: 'from-emerald-700 to-teal-800',
      glowClass: 'glow-gold',
      onClick: (e) => {
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.7 } });
        if (onOpenAction) onOpenAction();
      }
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-30">
      <ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                onClick={card.onClick}
                className={`glass-panel rounded-3xl p-5 sm:p-6 border border-[#EADBC8] shadow-lg transition-all duration-300 flex flex-col justify-between cursor-pointer ${card.glowClass} group`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] sm:text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${card.badgeColor}`}>
                      {card.badge}
                    </span>
                    <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br ${card.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                  </div>

                  <h3 className="font-serif-title font-black text-base sm:text-lg text-[#2C241E] group-hover:text-[#7B1113] transition-colors leading-snug">
                    {card.title}
                  </h3>

                  <p className="text-xs text-[#6B5E55] leading-relaxed line-clamp-3">
                    {card.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#7B1113] group-hover:translate-x-1 transition-transform">
                  <span>{card.btnText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </ScrollReveal>
    </section>
  );
}
