import React, { useState, useEffect, useRef } from 'react';
import { Users, Building, ShieldAlert, Award, Sparkles, TrendingUp, CheckCircle, Brain, Search, BookOpen, HeartHandshake } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export default function StatsCounterSection() {
  const [hasCounted, setHasCounted] = useState(false);
  const [counts, setCounts] = useState({
    students: 0,
    area: 0,
    rooms: 0,
    artifacts: 0,
    satisfaction: 0
  });

  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !hasCounted) {
          setHasCounted(true);

          // Animate counters
          const duration = 1800; // ms
          const startTime = performance.now();

          const updateCounter = (currentTime) => {
            const progress = Math.min(1, (currentTime - startTime) / duration);
            // Ease out cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);

            setCounts({
              students: Math.floor(easeOut * 12500),
              area: Math.floor(easeOut * 120),
              rooms: Math.floor(easeOut * 150),
              artifacts: Math.floor(easeOut * 3700),
              satisfaction: Math.floor(easeOut * 100)
            });

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            }
          };

          requestAnimationFrame(updateCounter);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [hasCounted]);

  const skillBars = [
    { label: "Năng lực tiếp thu & ghi nhớ lịch sử", percent: 96, icon: BookOpen, color: "from-amber-500 to-amber-600" },
    { label: "Kỹ năng khảo sát & phân tích tư liệu", percent: 92, icon: Search, color: "from-red-600 to-red-700" },
    { label: "Tư duy phản biện & giải quyết vấn đề", percent: 89, icon: Brain, color: "from-emerald-600 to-teal-700" },
    { label: "Ý thức bảo tồn & lan tỏa di sản văn hóa", percent: 98, icon: HeartHandshake, color: "from-orange-500 to-amber-600" }
  ];

  return (
    <section ref={sectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <ScrollReveal>
        <div className="glass-panel-dark rounded-3xl p-6 sm:p-10 border border-white/20 text-white shadow-2xl relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Section Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 relative z-10 border-b border-white/15 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-amber-300 text-xs font-bold border border-white/20 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Hiệu quả giáo dục & Lan tỏa di sản</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black font-serif-title text-white">
                Dữ Liệu Số Hóa & Thành Tựu Học Tập
              </h3>
            </div>
            <span className="text-xs text-amber-200 font-semibold bg-white/10 px-3 py-1.5 rounded-xl border border-white/15">
              Cập nhật liên tục 2026
            </span>
          </div>

          {/* 1. Counter Animation (5 Metric Cards) */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 relative z-10 mb-10">
            <div className="glass-panel p-4 rounded-2xl text-center border border-white/30 glow-gold">
              <Users className="w-6 h-6 text-[#7B1113] mx-auto mb-1.5" />
              <div className="text-2xl sm:text-3xl font-black text-[#7B1113] font-serif-title">
                {counts.students.toLocaleString('vi-VN')}+
              </div>
              <p className="text-[11px] font-bold text-gray-700 mt-1">Lượt học sinh tìm hiểu</p>
            </div>

            <div className="glass-panel p-4 rounded-2xl text-center border border-white/30 glow-gold">
              <Building className="w-6 h-6 text-[#7B1113] mx-auto mb-1.5" />
              <div className="text-2xl sm:text-3xl font-black text-[#7B1113] font-serif-title">
                {counts.area}k m²
              </div>
              <p className="text-[11px] font-bold text-gray-700 mt-1">Diện tích khuôn viên</p>
            </div>

            <div className="glass-panel p-4 rounded-2xl text-center border border-white/30 glow-gold">
              <Award className="w-6 h-6 text-[#7B1113] mx-auto mb-1.5" />
              <div className="text-2xl sm:text-3xl font-black text-[#7B1113] font-serif-title">
                {counts.rooms}+
              </div>
              <p className="text-[11px] font-bold text-gray-700 mt-1">Phòng ốc & Trưng bày</p>
            </div>

            <div className="glass-panel p-4 rounded-2xl text-center border border-white/30 glow-gold">
              <ShieldAlert className="w-6 h-6 text-[#7B1113] mx-auto mb-1.5" />
              <div className="text-2xl sm:text-3xl font-black text-[#7B1113] font-serif-title">
                {counts.artifacts.toLocaleString('vi-VN')}+
              </div>
              <p className="text-[11px] font-bold text-gray-700 mt-1">Hiện vật lưu giữ</p>
            </div>

            <div className="glass-panel p-4 rounded-2xl text-center border border-white/30 col-span-2 lg:col-span-1 glow-gold">
              <TrendingUp className="w-6 h-6 text-emerald-700 mx-auto mb-1.5" />
              <div className="text-2xl sm:text-3xl font-black text-emerald-800 font-serif-title">
                {counts.satisfaction}%
              </div>
              <p className="text-[11px] font-bold text-gray-700 mt-1">Đánh giá xuất sắc</p>
            </div>
          </div>

          {/* 2. Progress Bar Animation (4 Skill Bars) */}
          <div className="relative z-10 bg-white/10 p-6 rounded-2xl border border-white/15 backdrop-blur-sm space-y-4">
            <h4 className="text-sm font-bold text-amber-200 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Chỉ số phát triển năng lực của học sinh qua di sản số:</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {skillBars.map((skill, idx) => {
                const Icon = skill.icon;
                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold text-white/90">
                      <div className="flex items-center gap-1.5">
                        <Icon className="w-3.5 h-3.5 text-amber-300" />
                        <span>{skill.label}</span>
                      </div>
                      <span className="font-bold text-amber-300">{skill.percent}%</span>
                    </div>

                    {/* Animated Progress Track */}
                    <div className="w-full h-2.5 bg-black/30 rounded-full overflow-hidden p-0.5 border border-white/20">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${skill.color} transition-all duration-1000 ease-out`}
                        style={{ width: hasCounted ? `${skill.percent}%` : '0%' }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
