import React, { useState } from 'react';
import { Shield, Lock, Eye, EyeOff, X, KeyRound, AlertCircle, Phone, CheckCircle2, ShieldCheck, ArrowLeft } from 'lucide-react';

const DEFAULT_ADMIN_PASSWORD = 'admin';
const STORAGE_PWD_KEY = 'heritage_admin_pwd_hash';
const STORAGE_AUTH_SESSION = 'heritage_admin_auth_active';

const normalizePhone = (p) => {
  if (!p) return '';
  return p.replace(/[^0-9]/g, '').replace(/^84/, '0');
};

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

  // Recovery Mode States (2-Step Phone Verification)
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const [recoveryStep, setRecoveryStep] = useState(1);
  const [phoneInput, setPhoneInput] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [recoverySuccess, setRecoverySuccess] = useState('');

  if (!isOpen) return null;

  const handleClose = () => {
    setError('');
    setPassword('');
    setIsRecoveryMode(false);
    setRecoveryStep(1);
    setPhoneInput('');
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
      setError('Mật khẩu quản trị viên không chính xác! Vui lòng thử lại.');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  // Step 1: Verify Admin Phone Number (0339443330)
  const handleVerifyPhone = (e) => {
    e.preventDefault();
    setError('');
    const cleanP = normalizePhone(phoneInput);

    if (cleanP === '0339443330') {
      setRecoveryStep(2);
      setError('');
    } else {
      setError('Số điện thoại không đúng với thông tin Quản trị viên đã đăng ký! Quyền truy cập bị từ chối.');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  // Step 2: Set & Save New Password
  const handleSetNewPassword = (e) => {
    e.preventDefault();
    setError('');

    if (!newPassword || newPassword.trim().length < 3) {
      setError('Mật khẩu mới phải có ít nhất 3 ký tự!');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Xác nhận mật khẩu mới không trùng khớp!');
      return;
    }

    const trimmedPwd = newPassword.trim();
    setStoredAdminPassword(trimmedPwd);
    setRecoverySuccess('Xác thực chính chủ thành công! Đã cập nhật mật khẩu mới.');
    
    setTimeout(() => {
      setAdminLoggedIn(true);
      if (onSuccess) onSuccess();
      handleClose();
    }, 1500);
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
                {isRecoveryMode ? 'XÁC THỰC KHÔI PHỤC MẬT KHẨU' : 'XÁC THỰC QUẢN TRỊ VIÊN'}
              </h3>
              <p className="text-xs text-amber-200/80 font-medium">
                Dự án Di Sản Số TP.HCM – THCS Xà Bang
              </p>
            </div>
          </div>
        </div>

        {/* View 1: Normal Login Form */}
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
                    setRecoveryStep(1);
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
          /* View 2: Strict Phone Verification & Recovery Flow */
          <div className="p-6 space-y-4">
            {recoverySuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-center space-y-2 animate-fadeIn">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto animate-bounce" />
                <div className="font-bold text-sm text-emerald-900">{recoverySuccess}</div>
                <p className="text-xs text-emerald-700">Đang tự động chuyển hướng vào Bảng Quản Trị...</p>
              </div>
            ) : recoveryStep === 1 ? (
              /* Step 1: Input Phone Number */
              <form onSubmit={handleVerifyPhone} className="space-y-4">
                <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3 text-xs text-[#7E1819] leading-relaxed flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#7E1819] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Bảo mật chính chủ:</span> Để bảo vệ hệ thống, vui lòng nhập chính xác <strong>Số điện thoại Quản trị viên</strong> đã đăng ký của dự án.
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Số điện thoại xác thực Quản trị viên
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      autoFocus
                      value={phoneInput}
                      onChange={(e) => {
                        setPhoneInput(e.target.value);
                        if (error) setError('');
                      }}
                      placeholder="Nhập số điện thoại quản trị viên..."
                      className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#7E1819] focus:border-transparent outline-hidden transition-all text-gray-900 font-medium placeholder:text-gray-400"
                    />
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
                      setIsRecoveryMode(false);
                      setError('');
                    }}
                    className="flex-1 py-2.5 px-4 rounded-xl border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-50 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Quay lại</span>
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#7E1819] to-[#911d1e] text-white text-xs font-bold shadow-md hover:shadow-lg hover:from-[#6a1415] hover:to-[#7E1819] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-300" />
                    <span>Xác Thực SĐT</span>
                  </button>
                </div>
              </form>
            ) : (
              /* Step 2: Set New Password after phone verified */
              <form onSubmit={handleSetNewPassword} className="space-y-4 animate-fadeIn">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-800 leading-relaxed flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold">Đã xác thực chính chủ:</span> Số điện thoại <strong>{phoneInput}</strong> hợp lệ. Vui lòng tạo mật khẩu mới bên dưới.
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Mật khẩu mới
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        autoFocus
                        value={newPassword}
                        onChange={(e) => {
                          setNewPassword(e.target.value);
                          if (error) setError('');
                        }}
                        placeholder="Nhập mật khẩu mới..."
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#7E1819] focus:outline-hidden"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Nhập lại mật khẩu mới
                    </label>
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (error) setError('');
                      }}
                      placeholder="Xác nhận mật khẩu mới..."
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#7E1819] focus:outline-hidden"
                    />
                  </div>

                  {error && (
                    <div className="flex items-center gap-1.5 text-xs text-red-600 font-semibold animate-fadeIn">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setRecoveryStep(1);
                      setError('');
                    }}
                    className="flex-1 py-2.5 px-4 rounded-xl border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Đổi SĐT khác
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#7E1819] to-[#911d1e] text-white text-xs font-bold shadow-md hover:shadow-lg hover:from-[#6a1415] hover:to-[#7E1819] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <KeyRound className="w-4 h-4 text-amber-300" />
                    <span>Lưu Mật Khẩu Mới</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}