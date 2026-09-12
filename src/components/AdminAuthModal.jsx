import React, { useState } from 'react';
import { Shield, Lock, Eye, EyeOff, X, KeyRound, AlertCircle, LogOut } from 'lucide-react';

const DEFAULT_ADMIN_PASSWORD = 'admin';
const STORAGE_PWD_KEY = 'heritage_admin_pwd_hash';
const STORAGE_AUTH_SESSION = 'heritage_admin_auth_active';

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

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const correctPassword = getStoredAdminPassword();

    if (password.trim() === correctPassword) {
      setError('');
      setAdminLoggedIn(true);
      if (onSuccess) onSuccess();
      if (onClose) onClose();
      setPassword('');
    } else {
      setError('Mật khẩu quản trị viên không chính xác! Vui lòng thử lại.');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className={'bg-white rounded-2xl shadow-2xl border border-amber-200/80 w-full max-w-md overflow-hidden transition-all transform ' + (isShaking ? 'animate-bounce' : '')}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#7E1819] via-[#911d1e] to-[#7E1819] px-6 py-5 text-white relative">
          <button
            onClick={() => {
              setError('');
              setPassword('');
              onClose();
            }}
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
                XÁC THỰC QUẢN TRỊ VIÊN
              </h3>
              <p className="text-xs text-amber-200/80 font-medium">
                Dự án Di Sản Số TP.HCM – THCS Xà Bang
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-amber-50/70 border border-amber-200/70 rounded-xl p-3 text-xs text-[#7E1819] leading-relaxed flex items-start gap-2">
            <Lock className="w-4 h-4 text-[#7E1819] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Khu vực bảo mật:</span> Chỉ người quản trị hệ thống và giáo viên phụ trách mới có quyền duyệt đóng góp, chỉnh sửa dữ liệu 103 di tích.
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Mật khẩu quản trị (PIN / Password)
            </label>
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
                placeholder="Nhập mật khẩu quản trị..."
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
              onClick={() => {
                setError('');
                setPassword('');
                onClose();
              }}
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
      </div>
    </div>
  );
}
