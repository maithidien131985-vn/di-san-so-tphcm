import React from 'react';
import { Landmark, Heart, Shield, Globe, Award } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#231B15] text-[#D1C7BD] mt-16 border-t border-[#3D3025]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1 */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#7B1113] flex items-center justify-center text-white shadow-md">
                <Landmark className="w-5 h-5" />
              </div>
              <span className="text-xl font-black tracking-wider text-white font-serif-title">
                DI SẢN SỐ TP.HCM
              </span>
            </div>
            <p className="text-xs text-[#A89A8D] leading-relaxed max-w-md">
              Dự án chuyển đổi số giáo dục lịch sử và quảng bá di sản văn hóa Thành phố Hồ Chí Minh. Mang đến không gian học tập trực quan, sinh động và kết nối lịch sử hào hùng đến thế hệ trẻ.
            </p>
          </div>

          {/* Col 2 */}
          <div className="space-y-3">
            <h4 className="font-serif-title font-bold text-sm text-white uppercase tracking-wider">
              Danh mục khám phá
            </h4>
            <ul className="space-y-2 text-xs text-[#A89A8D]">
              <li><a href="#" className="hover:text-amber-300 transition-colors">Bản đồ di tích TP.HCM</a></li>
              <li><a href="#" className="hover:text-amber-300 transition-colors">Kho hồ sơ điều tra 30/4</a></li>
              <li><a href="#" className="hover:text-amber-300 transition-colors">Thuyết minh tương tác giọng nói</a></li>
              <li><a href="#" className="hover:text-amber-300 transition-colors">Thư viện ảnh lịch sử</a></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-3">
            <h4 className="font-serif-title font-bold text-sm text-white uppercase tracking-wider">
              Liên hệ & Bản quyền
            </h4>
            <p className="text-xs text-[#A89A8D] leading-relaxed">
              📍 Địa chỉ: 135 Nam Kỳ Khởi Nghĩa, Phường Bến Thành, Quận 1, TP.HCM<br />
              🏛️ Di tích Lịch sử Dinh Độc Lập
            </p>
            <div className="pt-1 flex items-center gap-2 text-[11px] text-amber-300/80">
              <Shield className="w-3.5 h-3.5" />
              <span>Bảo tồn & phát huy giá trị di sản số</span>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[#3D3025] flex flex-wrap items-center justify-between gap-4 text-xs text-[#8C7A6B]">
          <p>© {new Date().getFullYear()} DI SẢN SỐ TP.HCM. Tất cả quyền được bảo lưu.</p>
          <p className="flex items-center gap-1">
            Thiết kế vì tình yêu lịch sử Việt Nam <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
          </p>
        </div>
      </div>
    </footer>
  );
}
