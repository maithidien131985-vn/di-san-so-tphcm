import React, { useState } from 'react';
import { 
  X, 
  User, 
  School, 
  BookOpen, 
  KeyRound, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  LogOut,
  Save,
  Smile
} from 'lucide-react';
import { AVATAR_OPTIONS, saveStudentProfile } from '../utils/studentStorage';

export default function StudentAuthModal({
  isOpen,
  onClose,
  profile,
  onUpdateProfile
}) {
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    school: profile?.school || '',
    className: profile?.className || '',
    classCode: profile?.classCode || '',
    avatarId: profile?.avatarId || 'avatar_1',
    bio: profile?.bio || 'Nhà thám hiểm di sản trẻ'
  });

  const [mode, setMode] = useState('profile'); // 'profile' | 'login' | 'register'
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const currentAvatar = AVATAR_OPTIONS.find(a => a.id === formData.avatarId) || AVATAR_OPTIONS[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Vui lòng nhập họ và tên học sinh.');
      return;
    }

    const updated = {
      ...profile,
      ...formData,
      isLoggedIn: true,
      updatedAt: new Date().toISOString()
    };

    saveStudentProfile(updated);
    if (onUpdateProfile) onUpdateProfile(updated);

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  const handleLogout = () => {
    const loggedOut = {
      ...profile,
      isLoggedIn: false
    };
    saveStudentProfile(loggedOut);
    if (onUpdateProfile) onUpdateProfile(loggedOut);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn select-none">
      <div className="bg-[#FAF7F2] w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border-2 border-[#EAE3D9] flex flex-col max-h-[92vh] animate-scaleUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#7E1819] via-[#941C1E] to-[#B31D21] text-white p-5 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${currentAvatar.bg} flex items-center justify-center text-2xl shadow-md border-2 border-white/40`}>
              {currentAvatar.emoji}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif-title font-black text-lg text-white">
                  TÀI KHOẢN HỌC SINH
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-[#7E1819] text-[10px] font-black uppercase">
                  Passport Di Sản
                </span>
              </div>
              <p className="text-xs text-rose-100/90">
                Lưu trữ thành tích, điểm thưởng &amp; hành trình khám phá
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {/* Avatar Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#7E1819] uppercase tracking-wider flex items-center gap-1.5">
              <Smile className="w-3.5 h-3.5 text-[#7E1819]" />
              <span>Chọn biểu tượng thám hiểm của em:</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {AVATAR_OPTIONS.map((av) => {
                const isSelected = formData.avatarId === av.id;
                return (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, avatarId: av.id })}
                    className={`p-2.5 rounded-2xl border-2 transition-all flex flex-col items-center gap-1 cursor-pointer ${
                      isSelected
                        ? 'bg-amber-100 border-[#7E1819] ring-2 ring-[#7E1819]/30 shadow-md scale-105'
                        : 'bg-white border-[#EAE3D9] hover:border-[#7E1819]/50 hover:bg-amber-50/50'
                    }`}
                  >
                    <span className="text-2xl">{av.emoji}</span>
                    <span className="text-[10px] font-bold text-[#2C241E] text-center truncate w-full">
                      {av.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 1. Họ và Tên */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#2C241E] flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#7E1819]" />
              <span>Họ và Tên Học Sinh:</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="VD: Nguyễn Hoàng Nam"
              className="w-full p-3 rounded-xl border border-[#EAE3D9] bg-white text-sm font-medium text-[#2C241E] focus:outline-none focus:ring-2 focus:ring-[#7E1819]"
            />
          </div>

          {/* 2. Trường Học */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#2C241E] flex items-center gap-1.5">
              <School className="w-3.5 h-3.5 text-[#7E1819]" />
              <span>Trường:</span>
            </label>
            <input
              type="text"
              required
              value={formData.school}
              onChange={(e) => setFormData({ ...formData, school: e.target.value })}
              placeholder="VD: THCS Nguyễn Du, Quận 1"
              className="w-full p-3 rounded-xl border border-[#EAE3D9] bg-white text-sm font-medium text-[#2C241E] focus:outline-none focus:ring-2 focus:ring-[#7E1819]"
            />
          </div>

          {/* 3. Lớp & Mã Lớp (2 cột) */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#2C241E] flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#7E1819]" />
                <span>Lớp:</span>
              </label>
              <input
                type="text"
                required
                value={formData.className}
                onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                placeholder="VD: 9A1 / 11B2"
                className="w-full p-3 rounded-xl border border-[#EAE3D9] bg-white text-sm font-medium text-[#2C241E] focus:outline-none focus:ring-2 focus:ring-[#7E1819]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#2C241E] flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-[#7E1819]" />
                <span>Mã Lớp (nếu có):</span>
              </label>
              <input
                type="text"
                value={formData.classCode}
                onChange={(e) => setFormData({ ...formData, classCode: e.target.value })}
                placeholder="VD: ND9A1-2026"
                className="w-full p-3 rounded-xl border border-[#EAE3D9] bg-white text-sm font-medium text-[#2C241E] focus:outline-none focus:ring-2 focus:ring-[#7E1819]"
              />
            </div>
          </div>

          {/* Privacy Note */}
          <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-2.5 text-xs text-[#7E1819]">
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-relaxed">
              <strong>Bảo mật thông tin:</strong> Hệ thống chỉ lưu thông tin học tập cần thiết để cấp Hộ Chiếu Di Sản và xếp hạng thi đua. Không yêu cầu số điện thoại hay thông tin cá nhân riêng tư.
            </span>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-between gap-3">
            {profile?.isLoggedIn && (
              <button
                type="button"
                onClick={handleLogout}
                className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Đăng xuất</span>
              </button>
            )}

            <button
              type="submit"
              className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-[#7E1819] to-[#9E2225] hover:from-[#6A1213] hover:to-[#881A1D] text-white font-bold text-sm shadow-md transition-all hover:scale-102 cursor-pointer flex items-center justify-center gap-2 ml-auto"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-amber-300" />
                  <span>Đã lưu thành công!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 text-amber-300" />
                  <span>Lưu Hồ Sơ &amp; Cập Nhật Passport</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
