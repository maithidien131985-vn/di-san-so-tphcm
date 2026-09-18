import React, { useState } from 'react';
import { Shield, Lock, Eye, EyeOff, X, KeyRound, AlertCircle, RefreshCw, CheckCircle2, HelpCircle } from 'lucide-react';

const DEFAULT_ADMIN_PASSWORD = 'admin';
const STORAGE_PWD_KEY = 'heritage_admin_pwd_hash';
const STORAGE_AUTH_SESSION = 'heritage_admin_auth_active';
const RESCUE_CODES = ['THCSXABANG', 'thcsxabang', '2026', 'admin123', 'disanso'];

export const getStoredAdminPassword = () => {
  return localStorage.getItem(STORAGE_PWD_KEY) || DEFAULT_ADMIN_PASSWORD;
};

export const setStoredAdminPassword = (newPassword) => {
  if (newPassword && newPassword.trim()) {
    localStorage.setItem(STORAGE_PWD_KEY, newPassword.trim());
    return true;
  }
  return false;
};

export const resetAdminPasswordToDefault = () => {
  localStorage.removeItem(STORAGE_PWD_KEY);
  return DEFAULT_ADMIN_PASSWORD;
};

export const isAdminLoggedIn = () => {
  return sessionStorage.getItem(STORAGE_AUTH_SESSION) === 'true';
};

export const setAdminLoggedIn = (status) => {
  if (status) {
    sessionStorage.setItem(STORAGE_AUTH_SESSION, 'true');
  } else {
    sessionStorage.removeItem(STORAGE_AUTH_SESSION);
  }
};

export default function AdminAuthModal({ isOpen, onClose, onSuccess }) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  // Recovery Mode State
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const [rescueCode, setRescueCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [recoverySuccess, setRecoverySuccess] = useState('');

  if (!isOpen) return null;

  const handleClose = () => {
    setError('');
    setPassword('');
    setIsRecoveryMode(false);
    setRescueCode('');
    setNewPassword('');
    setConfirmPassword('');
    setRecoverySuccess('');
    if (onClose) onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const correctPassword = getStoredAdminPassword();

    if (password.trim() === correctPassword) {
      setError('');
      setAdminLoggedIn(true);
      if (onSuccess) onSuccess();
      handleClose();
    } else {
      setError('Mật khẩu quản trị viên không chính xác! (Mật khẩu mặc định là: admin)');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  // Quick reset to default 'admin'
  const handleQuickResetDefault = () => {
    resetAdminPasswordToDefault();
    setPassword(DEFAULT_ADMIN_PASSWORD);
    setRecoverySuccess('Đã khôi phục về mật khẩu mặc định: "admin"');
    setError('');
    setTimeout(() => {
      setRecoverySuccess('');
      setIsRecoveryMode(false);
    }, 2000);
  };

  // Custom password recovery with rescue code
  const handleRecoverySubmit = (e) => {
    e.preventDefault();
    const cleanCode = rescueCode.trim();

    if (!RESCUE_CODES.includes(cleanCode)) {
      setError('Mã xác thực dự án không đúng! (Gợi ý: THCSXABANG)');
      return;
    }

    if (!newPassword || newPassword.length < 3) {
      setError('Mật khẩu mới phải có ít nhất 3 ký tự!');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Xác nhận mật khẩu mới không khớp!');
      return;
    }

    setStoredAdminPassword(newPassword.trim());
    setPassword(newPassword.trim());
    setRecoverySuccess('Khôi phục và cập nhật mật khẩu mới thành công!');
    setError('');
    setTimeout(() => {
      setRecoverySuccess('');
      setIsRecoveryMode(false);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className={'bg-white rounded-2xl shadow-2xl border border-amber-200/80 w-full max-w-md overflow-hidden transition-all transform ' + (isShaking ? 'animate-bounce' : '')}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#7E1819] via-[#911d1e] to-[#7E1819] px-6 py-5 text-white relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center shadow-inner">
              <Shield className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h3 className="font-serif-title font-black text-lg text-amber-100 tracking-wide">
                {isRecoveryMode ? 'KHÔI PHỤC MẬT KHẨU' : 'XÁC THỰC QUẢN TRỊ VIÊN'}
              </h3>
              <p className="text-xs text-amber-200/80 font-medium">
                Dự án Di Sản Số TP.HCM – THCS Xà Bang
              </p>
            </div>
          </div>
        </div>

        {/* Normal Login View */}
        {!isRecoveryMode ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="bg-amber-50/70 border border-amber-200/70 rounded-xl p-3 text-xs text-[#7E1819] leading-relaxed flex items-start gap-2">
              <Lock className="w-4 h-4 text-[#7E1819] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Khu vực bảo mật:</span> Dành cho quản trị viên và giáo viên phụ trách để duyệt đóng góp &amp; quản lý dữ liệu 103 di tích.
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Mật khẩu quản trị (PIN / Password)
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setIsRecoveryMode(true);
                    setError('');
                  }}
                  className="text-xs font-bold text-[#8B1417] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <span>Quên mật khẩu?</span>
                </button>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoFocus
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Nhập mật khẩu quản trị (mặc định: admin)..."
                  className="w-full pl-9 pr-10 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#7E1819] focus:border-transparent outline-hidden transition-all text-gray-900 font-medium placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {error && (
                <div className="mt-2 flex items-center gap-1.5 text-xs text-red-600 font-semibold animate-fadeIn">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 py-2.5 px-4 rounded-xl border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#7E1819] to-[#911d1e] text-white text-xs font-bold shadow-md hover:shadow-lg hover:from-[#6a1415] hover:to-[#7E1819] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Shield className="w-4 h-4 text-amber-300" />
                <span>Đăng Nhập</span>
              </button>
            </div>
          </form>
        ) : (
          /* Password Recovery View */
          <div className="p-6 space-y-4">
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-stone-700 space-y-1">
              <div className="font-bold text-[#8B1417] flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Khôi phục mật khẩu quản trị</span>
              </div>
              <p>
                Bạn có thể đặt lại mật khẩu về mặc định (<strong>admin</strong>) hoặc nhập mã xác thực dự án <strong>THCSXABANG</strong> để tạo mật khẩu mới.
              </p>
            </div>

            {recoverySuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{recoverySuccess}</span>
              </div>
            )}

            {error && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-semibold flex items-center gap-1.5 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Quick Option: Reset to default */}
            <div className="border-t border-b border-gray-100 py-3 space-y-2">
              <div className="text-xs font-bold text-gray-700">Cách 1: Khôi phục nhanh về mặc định</div>
              <button
                type="button"
                onClick={handleQuickResetDefault}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-100 hover:bg-amber-200 text-[#7E1819] font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer border border-amber-300"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#7E1819]" />
                <span>Đặt lại về mật khẩu mặc định (admin)</span>
              </button>
            </div>

            {/* Custom password reset form */}
            <form onSubmit={handleRecoverySubmit} className="space-y-3">
              <div className="text-xs font-bold text-gray-700">Cách 2: Đặt mật khẩu mới tùy ý</div>
              
              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">
                  Mã xác thực dự án (Rescue Code)
                </label>
                <input
                  type="text"
                  value={rescueCode}
                  onChange={(e) => {
                    setRescueCode(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Nhập: THCSXABANG"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#7E1819] focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">
                    Mật khẩu mới
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="Mật khẩu mới..."
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#7E1819] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">
                    Nhập lại mật khẩu
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="Xác nhận..."
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#7E1819] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsRecoveryMode(false);
                    setError('');
                  }}
                  className="flex-1 py-2 px-3 rounded-lg border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Quay lại đăng nhập
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-3 rounded-lg bg-[#7E1819] hover:bg-[#911d1e] text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                >
                  Lưu mật khẩu mới
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
