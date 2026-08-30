import React, { useState } from 'react';
import { 
  Compass, 
  MapPin, 
  Sparkles, 
  ArrowRight, 
  BookOpen, 
  Landmark, 
  Search, 
  Map, 
  ShieldCheck, 
  History, 
  Layers, 
  Award, 
  Users, 
  CheckCircle2,
  Calendar,
  Send,
  HelpCircle,
  FolderOpen
} from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export default function HomePage({ 
  allMonuments = [], 
  onSelectMonument, 
  onOpenExplorer, 
  onOpenMyMap,
  onOpenContribute
}) {
  // Survey State
  const [selectedLocation, setSelectedLocation] = useState('q1_q3');
  const [selectedInterest, setSelectedInterest] = useState('military');
  const [selectedTripType, setSelectedTripType] = useState('individual_study');
  const [isSurveySubmitted, setIsSurveySubmitted] = useState(false);

  // Featured monuments for showcase (STT 1, 2, 7, 56, 57, 59, 3, 11)
  const featuredIds = [1, 2, 7, 56, 57, 59, 3, 11];
  const featuredMonuments = featuredIds
    .map(stt => allMonuments.find(m => m.stt === stt))
    .filter(Boolean);

  // Survey Location Options
  const locationOptions = [
    { id: 'q1_q3', label: 'Quận 1, Quận 3, Quận 4', desc: 'Khu trung tâm lịch sử & kiến trúc cổ' },
    { id: 'q5_q6_q10_q11', label: 'Quận 5, Quận 6, Quận 10, Quận 11', desc: 'Không gian văn hóa Chợ Lớn, đình miếu cổ' },
    { id: 'thu_duc', label: 'TP. Thủ Đức (Q.9, Q.2, Thủ Đức)', desc: 'Địa đạo Long Phước, Chùa Hội Sơn, di tích Bến Nọc' },
    { id: 'cu_chi_hoc_mon', label: 'Huyện Củ Chi, Hóc Môn, Quận 12', desc: 'Vành đai Đất thép, Ngã Ba Giồng, 18 Thôn Vườn Trầu' },
    { id: 'can_gio_nha_be', label: 'Huyện Cần Giờ, Nhà Bè, Quận 7', desc: 'Chiến khu Rừng Sác, sông nước & biển đảo' },
    { id: 'binh_thanh_pn_gv', label: 'Bình Thạnh, Phú Nhuận, Gò Vấp, Tân Bình', desc: 'Lăng Tả quân Lê Văn Duyệt, Đình Thông Tây Hội' },
    { id: 'binh_duong_vung_tau', label: 'Bình Dương, Bà Rịa - Vũng Tàu', desc: 'Chiến dịch Bình Giã, Minh Đạm, Bạch Dinh, Chùa Hội Khánh' }
  ];

  // Survey Interest Options
  const interestOptions = [
    { id: 'military', label: 'Chiến tích Kháng chiến & Địa đạo ngầm', icon: '⚔️', desc: 'Dinh Độc Lập, Củ Chi, Rừng Sác, Hầm vũ khí bí mật' },
    { id: 'architecture', label: 'Kiến trúc Pháp & Bảo tàng nghệ thuật', icon: '🏛️', desc: 'Bảo tàng Lịch sử, Bạch Dinh, Tòa Án, Nhà Hát TP' },
    { id: 'spiritual', label: 'Cổ tự Phật giáo & Chạm khắc Hán Nôm', icon: '🛕', desc: 'Chùa Giác Lâm, Chùa Giác Viên, Chùa Hội Khánh' },
    { id: 'commune_house', label: 'Đình làng Nam Bộ & Phong tục truyền thống', icon: '🏮', desc: 'Đình Thông Tây Hội, Đình Phú Nhuận, Đình Bình Đông' },
    { id: 'revolution_base', label: 'Địa chỉ đỏ & Trường học Cách mạng', icon: '⭐', desc: 'Bệnh viện Chợ Quán, Bến Lộc An, Nhà tù Côn Đảo' }
  ];

  // Survey Trip Type Options
  const tripOptions = [
    { id: 'individual_study', label: 'Khám phá tự túc / Học tập sau giờ học', desc: 'Bán kính gần, di chuyển bằng xe buýt hoặc xe đạp' },
    { id: 'group_trip', label: 'Dã ngoại cuối tuần cùng lớp / Gia đình', desc: 'Trải nghiệm thực tế không gian ngoài trời, chụp ảnh check-in' },
    { id: 'khkt_research', label: 'Nghiên cứu dự thi KHKT / Dự án STEM', desc: 'Khảo sát hiện vật, tư liệu điều tra lịch sử chuyên sâu' }
  ];

  // Calculate recommended monuments based on survey answers
  const getRecommendations = () => {
    let list = [...allMonuments];

    // Filter by location affinity
    if (selectedLocation === 'q1_q3') {
      list = list.filter(m => m.info.address.includes('Quận 1') || m.info.address.includes('Quận 3') || m.info.address.includes('Quận 4') || m.stt === 1);
    } else if (selectedLocation === 'q5_q6_q10_q11') {
      list = list.filter(m => m.info.address.includes('Quận 5') || m.info.address.includes('Quận 6') || m.info.address.includes('Quận 10') || m.info.address.includes('Quận 11') || m.info.name.includes('Chùa') || m.info.name.includes('Hội quán'));
    } else if (selectedLocation === 'thu_duc') {
      list = list.filter(m => m.info.address.includes('Thủ Đức') || m.info.address.includes('Quận 9') || m.info.address.includes('Quận 2') || m.stt === 32 || m.stt === 62);
    } else if (selectedLocation === 'cu_chi_hoc_mon') {
      list = list.filter(m => m.info.address.includes('Củ Chi') || m.info.address.includes('Hóc Môn') || m.info.address.includes('Quận 12') || m.stt === 2 || m.stt === 15);
    } else if (selectedLocation === 'can_gio_nha_be') {
      list = list.filter(m => m.info.address.includes('Cần Giờ') || m.info.address.includes('Nhà Bè') || m.stt === 7);
    } else if (selectedLocation === 'binh_thanh_pn_gv') {
      list = list.filter(m => m.info.address.includes('Bình Thạnh') || m.info.address.includes('Phú Nhuận') || m.info.address.includes('Gò Vấp') || m.stt === 79 || m.stt === 88);
    } else if (selectedLocation === 'binh_duong_vung_tau') {
      list = list.filter(m => m.info.address.includes('Bình Dương') || m.info.address.includes('Vũng Tàu') || m.info.address.includes('Bà Rịa') || m.stt === 5 || m.stt === 6 || m.stt === 56 || m.stt === 61);
    }

    // Filter by interest
    if (selectedInterest === 'military') {
      list = list.filter(m => m.info.type.includes('Lịch sử') || m.info.overview.includes('chiến') || m.info.overview.includes('kháng chiến') || m.info.overview.includes('địa đạo'));
    } else if (selectedInterest === 'architecture') {
      list = list.filter(m => m.info.type.includes('Kiến trúc') || m.info.name.includes('Bảo tàng') || m.info.name.includes('Dinh') || m.info.name.includes('Bạch Dinh'));
    } else if (selectedInterest === 'spiritual') {
      list = list.filter(m => m.info.name.includes('Chùa') || m.info.name.includes('Tịnh xá') || m.info.name.includes('Tự'));
    } else if (selectedInterest === 'commune_house') {
      list = list.filter(m => m.info.name.includes('Đình') || m.info.name.includes('Miếu') || m.info.name.includes('Lăng') || m.info.name.includes('Hội quán'));
    }

    // If list is small, fallback with famous monuments
    if (list.length < 3) {
      const fallbacks = allMonuments.slice(0, 4);
      list = [...list, ...fallbacks];
    }

    // Return unique top 4
    const unique = [];
    const seen = new Set();
    for (const item of list) {
      if (!seen.has(item.stt)) {
        seen.add(item.stt);
        unique.push(item);
      }
      if (unique.length >= 4) break;
    }
    return unique;
  };

  const recommendedMonuments = getRecommendations();

  const handleStartDiscovery = () => {
    const surveySection = document.getElementById('survey-section');
    if (surveySection) {
      surveySection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2C241E]">
      {/* 1. HERO BANNER & INTRO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#2B090A] via-[#4A0E10] to-[#7B1113] text-white pt-12 pb-20 sm:pt-16 sm:pb-28">
        {/* Background Decorative Patterns */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FAF7F2_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal>
            <div className="text-center space-y-6 max-w-4xl mx-auto">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-300 text-xs sm:text-sm font-bold shadow-lg">
                <Sparkles className="w-4 h-4" />
                <span>NỀN TẢNG SỐ HÓA 103 DI TÍCH LỊCH SỬ - VĂN HÓA TP. HỒ CHÍ MINH</span>
              </div>

              {/* Main Title */}
              <h1 className="font-serif-title font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight">
                Hành Trình Di Sản Số
              </h1>

              {/* Exact Quotation Requested by User */}
              <div className="p-6 sm:p-8 rounded-3xl bg-black/30 backdrop-blur-md border border-white/15 shadow-2xl text-left space-y-4 font-serif-body text-sm sm:text-base lg:text-lg text-amber-50/95 leading-relaxed">
                <p className="font-semibold text-amber-200">
                  "Mỗi viên gạch cũ đều mang một cái tên, một câu chuyện, một phần ký ức của thành phố này.
                </p>
                <p>
                  Giữa nhịp sống hối hả của một Sài Gòn - Hồ Chí Minh không ngừng đổi thay, vẫn có những mái ngói, những bức tường rêu phong lặng lẽ giữ lại cả một dòng thời gian đã qua. Chúng chứng kiến những biến động của lịch sử, những đổi thay của thành phố, và cả những điều bình dị nhất trong đời sống của bao thế hệ đã từng đi qua nơi đây.
                </p>
                <p>
                  Có bao nhiêu di tích bạn đã từng đi ngang qua mà chưa một lần dừng lại? Có bao nhiêu câu chuyện đang ngủ quên trong lòng thành phố, chỉ chờ một ai đó bước vào và lắng nghe?
                </p>
                <p className="font-medium text-amber-100">
                  Chúng tôi bắt đầu hành trình này — không phải để kể lại lịch sử theo cách khô khan trong sách vở, mà để mời bạn chạm vào nó, theo cách gần gũi nhất với thế hệ mình."
                </p>
              </div>

              {/* CTA Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <button
                  onClick={handleStartDiscovery}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-[#540B0C] font-black text-base shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer flex items-center gap-2.5"
                >
                  <span>👉 Bắt đầu khám phá</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <button
                  onClick={onOpenExplorer}
                  className="px-7 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm sm:text-base border border-white/25 backdrop-blur-sm transition-all duration-300 cursor-pointer flex items-center gap-2"
                >
                  <Search className="w-4 h-4 text-amber-300" />
                  <span>Tra Cứu 103 Di Tích</span>
                </button>

                <button
                  onClick={onOpenMyMap}
                  className="px-7 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm sm:text-base border border-white/25 backdrop-blur-sm transition-all duration-300 cursor-pointer flex items-center gap-2"
                >
                  <Map className="w-4 h-4 text-amber-300" />
                  <span>Bản Đồ Số GPS</span>
                </button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 2. STATS OVERVIEW COUNTER BAR */}
      <section className="max-w-6xl mx-auto px-4 -mt-10 relative z-20">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white p-6 rounded-3xl border border-[#EADBC8] shadow-xl text-center">
          <div className="space-y-1 border-r border-gray-100 last:border-0">
            <div className="font-serif-title font-black text-2xl sm:text-3xl text-[#7B1113]">103</div>
            <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Di Tích Lịch Sử & Nghệ Thuật</div>
          </div>
          <div className="space-y-1 border-r border-gray-100 last:border-0">
            <div className="font-serif-title font-black text-2xl sm:text-3xl text-amber-600">100%</div>
            <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Định Vị Tọa Độ GPS & Chỉ Đường</div>
          </div>
          <div className="space-y-1 border-r border-gray-100 last:border-0">
            <div className="font-serif-title font-black text-2xl sm:text-3xl text-emerald-700">6 Môn</div>
            <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Khám Phá Liên Môn GDPT 2018</div>
          </div>
          <div className="space-y-1">
            <div className="font-serif-title font-black text-2xl sm:text-3xl text-purple-700">Audio AI</div>
            <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Thuyết Minh Giọng Đọc Tự Động</div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED MONUMENTS SHOWCASE */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <ScrollReveal>
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#EADBC8]">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-[#7B1113] bg-red-100 px-3 py-1 rounded-full">
                  Điểm Đến Nổi Bật
                </span>
                <h2 className="font-serif-title font-black text-2xl sm:text-4xl text-[#2C241E] mt-2">
                  Các Di Tích Tiêu Biểu & Đặc Sắc
                </h2>
                <p className="text-xs sm:text-sm text-[#6B5E55] mt-1 max-w-2xl">
                  Tuyển chọn các công trình Di tích Quốc gia Đặc biệt, căn cứ cách mạng và kiệt tác kiến trúc nghệ thuật có sức lan tỏa lịch sử sâu rộng.
                </p>
              </div>

              <button
                onClick={onOpenExplorer}
                className="self-start sm:self-auto px-4 py-2 rounded-xl bg-white border border-[#EADBC8] hover:border-[#7B1113] text-xs font-bold text-[#7B1113] transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <span>Xem toàn bộ 103 di tích</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Grid Showcase */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredMonuments.map((m) => (
                <div
                  key={m.id}
                  onClick={() => onSelectMonument(m.id)}
                  className="group bg-white rounded-3xl overflow-hidden border border-[#EADBC8] hover:border-[#7B1113]/50 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer transform hover:-translate-y-1"
                >
                  <div>
                    {/* Thumbnail Image */}
                    <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                      <img
                        src={m.info.heroImage}
                        alt={m.info.name}
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-black/65 backdrop-blur-xs text-white text-[10px] font-black uppercase tracking-wider">
                        #{m.stt} • {m.info.badge}
                      </div>
                      <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-amber-400 text-[#7B1113] text-[9px] font-black uppercase">
                        {m.info.type}
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-4 space-y-2">
                      <h3 className="font-serif-title font-bold text-base text-[#2C241E] group-hover:text-[#7B1113] transition-colors line-clamp-1 leading-snug">
                        {m.info.name}
                      </h3>
                      <p className="text-[11px] text-gray-500 flex items-center gap-1 line-clamp-1">
                        <MapPin className="w-3 h-3 text-[#7B1113] shrink-0" />
                        <span>{m.info.address}</span>
                      </p>
                      <p className="text-xs text-[#5A4D44] line-clamp-2 leading-relaxed">
                        {m.info.overview}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="p-4 pt-0">
                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#7B1113]">
                      <span>Khám phá trang di tích</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 4. INTERACTIVE STUDENT SURVEY & DISCOVERY RECOMMENDER */}
      <section id="survey-section" className="bg-gradient-to-b from-[#F5EFE6] to-[#FAF7F2] py-16 border-y border-[#EADBC8]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="space-y-8">
              {/* Header */}
              <div className="text-center space-y-3 max-w-2xl mx-auto">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-black uppercase tracking-wider">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Trắc Nghiệm Khảo Sát & Gợi Ý Di Tích</span>
                </div>
                <h2 className="font-serif-title font-black text-2xl sm:text-4xl text-[#2C241E]">
                  Tìm Kiếm Di Tích Dành Riêng Cho Bạn
                </h2>
                <p className="text-xs sm:text-sm text-[#6B5E55]">
                  Hãy chọn nơi bạn đang ở và sở thích khám phá lịch sử, hệ thống sẽ đề xuất ngay các trang di tích phù hợp nhất kèm liên kết truy cập!
                </p>
              </div>

              {/* Survey Form Box */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EADBC8] shadow-xl space-y-8">
                {/* Question 1: Location */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#7B1113] text-white flex items-center justify-center text-xs font-black">1</span>
                    <h3 className="font-bold text-sm sm:text-base text-[#2C241E]">
                      Bạn đang sinh sống, học tập tại khu vực nào?
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pl-8">
                    {locationOptions.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setSelectedLocation(opt.id);
                          setIsSurveySubmitted(true);
                        }}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                          selectedLocation === opt.id
                            ? 'bg-amber-100 border-[#7B1113] text-[#7B1113] font-bold ring-2 ring-[#7B1113]/20 shadow-xs'
                            : 'bg-gray-50/70 border-gray-200 hover:border-amber-400 text-gray-700'
                        }`}
                      >
                        <div className="text-xs font-bold">{opt.label}</div>
                        <div className="text-[10px] text-gray-500 mt-0.5">{opt.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Question 2: Interest */}
                <div className="space-y-3 pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#7B1113] text-white flex items-center justify-center text-xs font-black">2</span>
                    <h3 className="font-bold text-sm sm:text-base text-[#2C241E]">
                      Chủ đề lịch sử & trải nghiệm bạn muốn khám phá nhất?
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pl-8">
                    {interestOptions.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setSelectedInterest(opt.id);
                          setIsSurveySubmitted(true);
                        }}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                          selectedInterest === opt.id
                            ? 'bg-amber-100 border-[#7B1113] text-[#7B1113] font-bold ring-2 ring-[#7B1113]/20 shadow-xs'
                            : 'bg-gray-50/70 border-gray-200 hover:border-amber-400 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 text-xs font-bold">
                          <span>{opt.icon}</span>
                          <span>{opt.label}</span>
                        </div>
                        <div className="text-[10px] text-gray-500 mt-0.5">{opt.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Question 3: Trip Type */}
                <div className="space-y-3 pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#7B1113] text-white flex items-center justify-center text-xs font-black">3</span>
                    <h3 className="font-bold text-sm sm:text-base text-[#2C241E]">
                      Mục đích và hình thức trải nghiệm của bạn?
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pl-8">
                    {tripOptions.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setSelectedTripType(opt.id);
                          setIsSurveySubmitted(true);
                        }}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                          selectedTripType === opt.id
                            ? 'bg-amber-100 border-[#7B1113] text-[#7B1113] font-bold ring-2 ring-[#7B1113]/20 shadow-xs'
                            : 'bg-gray-50/70 border-gray-200 hover:border-amber-400 text-gray-700'
                        }`}
                      >
                        <div className="text-xs font-bold">{opt.label}</div>
                        <div className="text-[10px] text-gray-500 mt-0.5">{opt.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 5. SURVEY RECOMMENDATIONS RESULTS */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-600" />
                    <h3 className="font-serif-title font-bold text-lg sm:text-xl text-[#2C241E]">
                      Các Di Tích Đề Xuất Phù Hợp Với Bạn ({recommendedMonuments.length} địa điểm)
                    </h3>
                  </div>
                  <span className="text-xs text-[#7B1113] font-bold">
                    💡 Nhấn để mở ngay trang chi tiết
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {recommendedMonuments.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => onSelectMonument(m.id)}
                      className="bg-white rounded-2xl p-4 border border-[#EADBC8] hover:border-[#7B1113] shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between cursor-pointer group"
                    >
                      <div className="space-y-3">
                        <div className="aspect-[16/10] rounded-xl overflow-hidden bg-gray-100 relative">
                          <img
                            src={m.info.heroImage}
                            alt={m.info.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 text-white text-[9px] font-bold">
                            #{m.stt}
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] font-bold uppercase text-[#7B1113]">
                            {m.info.ranking}
                          </span>
                          <h4 className="font-serif-title font-bold text-sm text-[#2C241E] group-hover:text-[#7B1113] transition-colors line-clamp-1">
                            {m.info.name}
                          </h4>
                          <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                            📍 {m.info.address}
                          </p>
                        </div>
                      </div>

                      <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#7B1113]">
                        <span>Xem trang con</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 6. CALL TO ACTION / FOOTER PROMPT */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-6">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#7B1113] to-[#500B0D] text-white shadow-2xl space-y-4 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h3 className="font-serif-title font-black text-2xl sm:text-4xl text-white">
              Cùng Đóng Góp & Bảo Tồn Di Sản Số
            </h3>
            <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed">
              Bạn có câu chuyện, hình ảnh hoặc tài liệu lịch sử quý giá về các di tích tại địa phương? Hãy cùng chung tay đóng góp để hoàn thiện cơ sở dữ liệu di sản cho các thế hệ mai sau!
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <button
                onClick={onOpenContribute}
                className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#500B0D] font-black text-xs sm:text-sm shadow-md cursor-pointer transition-all hover:scale-105"
              >
                ✍️ Gửi Dữ Liệu & Hình Ảnh Đóng Góp
              </button>
              <button
                onClick={onOpenExplorer}
                className="px-6 py-3 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs sm:text-sm border border-white/20 cursor-pointer"
              >
                Tra cứu danh bạ di tích
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
