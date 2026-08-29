import React, { useState } from 'react';
import { 
  BookOpen, 
  Compass, 
  Building2, 
  Scale, 
  ScrollText, 
  ShieldCheck, 
  Sparkles, 
  RotateCw, 
  CheckCircle2,
  GraduationCap
} from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export default function FlipCardGrid() {
  const [flippedCards, setFlippedCards] = useState({});

  const toggleFlip = (id) => {
    setFlippedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const subjectCards = [
    {
      id: 1,
      subject: "Lịch sử",
      tag: "Môn Lịch sử",
      icon: BookOpen,
      color: "from-red-600 to-rose-900",
      accent: "border-red-400",
      frontTitle: "Mốc Son 30/4/1975 & Kháng Chiến Chống Mỹ",
      frontDesc: "Tìm hiểu toàn vẹn 21 năm kháng chiến chống Mỹ, Chiến dịch Hồ Chí Minh lịch sử và thời khắc xe tăng húc đổ cổng Dinh trưa 30/4/1975.",
      backTitle: "Kiến Thức Lịch Sử Cốt Lõi",
      backPoints: [
        "Trưa 30/4/1975: Xe tăng 843 và 390 tiến vào Dinh, cắm cờ giải phóng trên nóc Dinh lúc 11h30, kết thúc 21 năm kháng chiến chống Mỹ.",
        "Tháng 12/1975: Dinh là nơi diễn ra Hội nghị Hiệp thương chính trị thống nhất Tổ quốc hai miền Nam - Bắc.",
        "Được Thủ tướng Chính phủ xếp hạng Di tích Quốc gia Đặc biệt theo Quyết định số 1272/QĐ-TTg ngày 12/8/2009."
      ]
    },
    {
      id: 2,
      subject: "Địa lí",
      tag: "Môn Địa lí",
      icon: Compass,
      color: "from-amber-600 to-orange-900",
      accent: "border-amber-400",
      frontTitle: "Vị Thế Không Gian & 5 Cánh Quân Thọc Sâu",
      frontDesc: "Khảo sát vị trí địa lý đắc địa 12 ha giữa trung tâm Sài Gòn (10.777°N, 106.695°E) và mạng lưới chiến lược kết nối miền Đông Nam Bộ.",
      backTitle: "Đặc Điểm Địa Lý & Không Gian",
      backPoints: [
        "Tọa lạc tại 135 Nam Kỳ Khởi Nghĩa, Quận 1 với diện tích khuôn viên 120.000 m² (12 ha) rợp bóng cây cổ thụ.",
        "Trung tâm hội tụ mạng lưới giao thông thủy - bộ kết nối Củ Chi, Cần Giờ, Long Phước và chiến trường miền Đông.",
        "Điểm hội tụ của 5 cánh quân giải phóng từ các hướng Đông, Tây, Nam, Bắc và Tây Bắc trong chiến dịch lịch sử."
      ]
    },
    {
      id: 3,
      subject: "Mỹ thuật & Kiến trúc",
      tag: "Môn Mỹ thuật & Kiến trúc",
      icon: Building2,
      color: "from-emerald-700 to-teal-900",
      accent: "border-emerald-400",
      frontTitle: "Đồ Án KTS Ngô Viết Thụ & Triết Lý Chữ CÁT (吉)",
      frontDesc: "Kiệt tác kiến trúc hiện đại kết hợp rèm hoa đá hình đốt trúc thanh cao và triết lý phong thủy phương Đông độc bản.",
      backTitle: "Nét Độc Đáo Về Mỹ Thuật & Tạo Hình",
      backPoints: [
        "Bản vẽ do KTS Ngô Viết Thụ (Khôi nguyên La Mã 1955) thiết kế: toàn bộ mặt bằng bố cục thành hình chữ CÁT (吉 - may mắn, tốt lành).",
        "Mặt tiền trang trí rèm hoa đá hình nan trúc thanh nhã, vừa đón ánh sáng tự nhiên vừa chắn nắng gió nhiệt đới.",
        "Giao thoa hoàn hảo giữa kỹ thuật bê tông cốt thép hiện đại phương Tây với nét Á Đông truyền thống."
      ]
    },
    {
      id: 4,
      subject: "Kinh tế & Pháp luật",
      tag: "Môn GDKT&PL / GDCD",
      icon: Scale,
      color: "from-blue-700 to-indigo-950",
      accent: "border-blue-400",
      frontTitle: "Luật Di Sản Văn Hóa & Ý Thức Công Dân",
      frontDesc: "Hiểu rõ căn cứ pháp lý bảo vệ di sản, chủ quyền quốc gia và trách nhiệm công dân thế hệ trẻ trong giữ gìn bản sắc dân tộc.",
      backTitle: "Cơ Sở Pháp Lý & Trách Nhiệm Công Dân",
      backPoints: [
        "Quyết định xếp hạng Di tích Quốc gia Đặc biệt số 1272/QĐ-TTg ngày 12/8/2009 và Luật Di sản văn hóa Việt Nam.",
        "Ý thức bảo vệ hiện vật nguyên bản, không xâm hại cảnh quan, tôn trọng di sản lịch sử của dân tộc.",
        "Trách nhiệm của thế hệ trẻ trong chuyển đổi số, quảng bá giá trị di sản văn hóa ra thế giới."
      ]
    },
    {
      id: 5,
      subject: "Ngữ văn & Báo chí",
      tag: "Môn Ngữ văn & Báo chí",
      icon: ScrollText,
      color: "from-purple-700 to-fuchsia-950",
      accent: "border-purple-400",
      frontTitle: "Ký Ức Nhân Chứng & Áng Văn Lịch Sử",
      frontDesc: "Cảm nhận hào khí non sông qua các tác phẩm văn học, bài báo quốc tế và những trang hồi ký chân thực của nhân chứng ngày toàn thắng.",
      backTitle: "Giá Trị Văn Học & Tư Liệu Ngôn Ngữ",
      backPoints: [
        "Hồi ức chân thực của các nhân chứng: Bùi Quang Thận, Vũ Đăng Toàn, phi công Nguyễn Thành Trung và các chiến sĩ biệt động.",
        "Báo chí quốc tế và Việt Nam đồng loạt đưa tin ngày 30/4/1975 như một biểu tượng của khát vọng hòa bình và độc lập.",
        "Rèn luyện kỹ năng viết phóng sự, phân tích tư liệu lịch sử và thuyết minh di sản văn hóa."
      ]
    },
    {
      id: 6,
      subject: "Quốc phòng & An ninh",
      tag: "Môn GDQP-AN",
      icon: ShieldCheck,
      color: "from-stone-700 to-slate-900",
      accent: "border-stone-400",
      frontTitle: "Nghệ Thuật Quân Sự & Hiệp Đồng Binh Chủng",
      frontDesc: "Tìm hiểu chiến thuật hiệp đồng bộ binh - tăng thiết giáp cơ giới và sự chỉ huy quyết đoán trong Chiến dịch Hồ Chí Minh.",
      backTitle: "Đỉnh Cao Nghệ Thuật Quân Sự Việt Nam",
      backPoints: [
        "Đòn thọc sâu táo bạo của Lữ đoàn xe tăng 203 (Quân đoàn 2), đánh thẳng vào đầu não sụp đổ của đối phương.",
        "Bài học về nghệ thuật 'Thần tốc, thần tốc hơn nữa; Táo bạo, táo bạo hơn nữa' theo chỉ đạo của Đại tướng Võ Nguyên Giáp.",
        "Sự kết hợp giữa sức mạnh quân sự chính quy với phong trào nổi dậy của quần chúng nhân dân địa phương."
      ]
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <ScrollReveal>
        <div className="space-y-6">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-[#EADBC8]">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-[#7B1113] text-xs font-bold uppercase tracking-wider">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Giáo Dục Liên Môn GDPT 2018</span>
              </div>
              <h2 className="font-serif-title font-black text-2xl sm:text-3xl text-[#2C241E]">
                Khám Phá Di Tích Qua 6 Môn Học
              </h2>
              <p className="text-xs sm:text-sm text-[#6B5E55] max-w-2xl">
                Tích hợp kiến thức đa chiều chuẩn xác giúp học sinh, sinh viên và du khách thấu hiểu sâu sắc giá trị lịch sử, kiến trúc, văn hóa và nghệ thuật quân sự.
              </p>
            </div>
            <span className="text-xs text-[#7B1113] font-bold bg-white px-3 py-1.5 rounded-xl border border-[#EADBC8] shadow-2xs self-start sm:self-auto">
              💡 Bấm vào thẻ để lật xem kiến thức cốt lõi
            </span>
          </div>

          {/* 6 Subject Flip Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjectCards.map((card) => {
              const isFlipped = !!flippedCards[card.id];
              const IconComponent = card.icon;

              return (
                <div
                  key={card.id}
                  onClick={() => toggleFlip(card.id)}
                  className="h-[310px] perspective-1000 cursor-pointer group"
                >
                  <div
                    className={`relative w-full h-full duration-500 transform-style-3d transition-transform ${
                      isFlipped ? 'rotate-y-180' : ''
                    }`}
                  >
                    {/* Front Face */}
                    <div className="absolute inset-0 w-full h-full backface-hidden rounded-3xl p-6 bg-white border border-[#EADBC8] shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.color} text-white flex items-center justify-center shadow-md`}>
                            <IconComponent className="w-6 h-6" />
                          </div>
                          <span className="text-[11px] font-black uppercase px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
                            {card.tag}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <h3 className="font-serif-title font-bold text-lg text-[#2C241E] group-hover:text-[#7B1113] transition-colors leading-snug">
                            {card.frontTitle}
                          </h3>
                          <p className="text-xs sm:text-sm text-[#5A4D44] leading-relaxed line-clamp-3">
                            {card.frontDesc}
                          </p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#7B1113]">
                        <span className="flex items-center gap-1.5">
                          <RotateCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
                          <span>Lật xem bài học liên môn</span>
                        </span>
                        <span className="text-gray-400 text-[11px]">#{card.id}/6</span>
                      </div>
                    </div>

                    {/* Back Face */}
                    <div className={`absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-3xl p-6 bg-gradient-to-br ${card.color} text-white shadow-xl flex flex-col justify-between border-2 ${card.accent}`}>
                      <div className="space-y-3.5">
                        <div className="flex items-center justify-between border-b border-white/20 pb-2">
                          <span className="text-[10px] font-black uppercase tracking-wider text-amber-300">
                            {card.subject} • Bài học cốt lõi
                          </span>
                          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">
                            GDPT 2018
                          </span>
                        </div>

                        <h4 className="font-serif-title font-black text-base text-amber-100">
                          {card.backTitle}
                        </h4>

                        <ul className="space-y-2 text-xs text-white/90 leading-relaxed">
                          {card.backPoints.map((pt, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-amber-300 shrink-0 mt-0.5" />
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-2 border-t border-white/20 flex items-center justify-between text-[11px] text-white/80 font-bold">
                        <span>Bấm để lật lại mặt trước</span>
                        <RotateCw className="w-3.5 h-3.5" />
                      </div>
                    </div>
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
