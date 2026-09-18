import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Sparkles, 
  Key, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  Lock, 
  Bot, 
  ArrowRight, 
  Zap, 
  EyeOff, 
  ShieldAlert, 
  Check, 
  RefreshCw,
  MessageSquareText,
  AlertTriangle
} from 'lucide-react';
import { 
  getDeepSeekApiKey, 
  saveDeepSeekApiKey, 
  removeDeepSeekApiKey, 
  hasDeepSeekApiKey, 
  testDeepSeekConnection 
} from '../utils/deepseekService';
import soundEffects from '../utils/soundEffects';

export default function DeepSeekApiPortal({ onOpenChatbot }) {
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null); // { type: 'success' | 'error' | 'info', text: string }
  const [showCopyWarning, setShowCopyWarning] = useState(false);

  // Check connection state on mount
  useEffect(() => {
    const keyExists = hasDeepSeekApiKey();
    setIsConnected(keyExists);
  }, []);

  // Handle Connect / Save API Key
  const handleConnect = async (e) => {
    if (e) e.preventDefault();
    const cleanKey = apiKeyInput.trim();

    if (!cleanKey) {
      soundEffects.playWarning();
      setStatusMessage({
        type: 'error',
        text: 'Vui lòng dán mã API DeepSeek (bắt đầu bằng sk-...) vào ô nhập.'
      });
      return;
    }

    if (!cleanKey.startsWith('sk-')) {
      soundEffects.playWarning();
      setStatusMessage({
        type: 'error',
        text: 'Mã API DeepSeek thường bắt đầu bằng tiền tố "sk-...". Vui lòng kiểm tra lại.'
      });
      return;
    }

    setIsTesting(true);
    setStatusMessage({
      type: 'info',
      text: 'Đang kiểm tra kết nối với máy chủ DeepSeek AI...'
    });

    try {
      await testDeepSeekConnection(cleanKey);
      saveDeepSeekApiKey(cleanKey);
      setIsConnected(true);
      setApiKeyInput('');
      soundEffects.playSuccess();
      setStatusMessage({
        type: 'success',
        text: '🎉 Kết nối thành công! Trợ lý AI Di sản đã được kích hoạt chế độ siêu trí tuệ DeepSeek-V3 LLM.'
      });
    } catch (err) {
      console.error('DeepSeek Connection Error:', err);
      soundEffects.playWarning();
      setStatusMessage({
        type: 'error',
        text: err.message || 'Không thể kết nối với DeepSeek API. Vui lòng kiểm tra lại mã API hoặc số dư tài khoản.'
      });
    } finally {
      setIsTesting(false);
    }
  };

  // Handle Disconnect
  const handleDisconnect = () => {
    soundEffects.playTap();
    removeDeepSeekApiKey();
    setIsConnected(false);
    setApiKeyInput('');
    setStatusMessage({
      type: 'info',
      text: 'Đã ngắt kết nối DeepSeek API. Hệ thống quay về chế độ Trợ lý AI Bản địa 3.605 Q&A.'
    });
  };

  // Intercept Copy / Cut attempts for security
  const handleBlockCopy = (e) => {
    e.preventDefault();
    soundEffects.playWarning();
    setShowCopyWarning(true);
    setTimeout(() => setShowCopyWarning(false), 3000);
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1C0507] via-[#2D090C] to-[#150304] border-2 border-amber-400/40 shadow-2xl text-white p-6 sm:p-10">
        
        {/* Futuristic Background Glow & Grid */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

        <div className="relative z-10 space-y-8">
          
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-6 border-b border-white/10">
            <div className="space-y-2.5 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-black uppercase tracking-wider">
                <Cpu className="w-3.5 h-3.5 animate-pulse text-amber-400" />
                <span>Cổng Kết Nối Mô Hình Ngôn Ngữ Lớn (LLM)</span>
                <span className="px-2 py-0.2 rounded bg-amber-400 text-[#200507] font-black text-[10px]">DEEPSEEK V3</span>
              </div>
              
              <h2 className="font-serif-title font-black text-2xl sm:text-3xl lg:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-200 to-yellow-300">
                Cổng Kết Nối Trí Tuệ Nhân Tạo DeepSeek AI
              </h2>
              
              <p className="text-xs sm:text-sm text-rose-100/80 leading-relaxed font-normal">
                Nâng cấp Trợ lý AI Di sản với trí tuệ nhân tạo thế hệ mới DeepSeek-V3: Tự động phân tích, suy luận đa chiều và giải đáp chuyên sâu 103 Di tích Lịch sử – Văn hóa TP.HCM.
              </p>
            </div>

            {/* Connection Status Badge */}
            <div className="self-start lg:self-center">
              {isConnected ? (
                <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-emerald-950/80 border-2 border-emerald-500/60 text-emerald-300 shadow-lg shadow-emerald-950/40 animate-fadeIn">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  <div>
                    <div className="text-xs font-black uppercase tracking-wide flex items-center gap-1.5">
                      <span>Đã Kết Nối DeepSeek-V3</span>
                      <Check className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="text-[10px] text-emerald-300/80">Trợ lý AI sẵn sàng suy luận siêu tốc</div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-black/40 border border-white/20 text-stone-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                  <div>
                    <div className="text-xs font-bold">Chế độ AI Bản Địa 3.605 Q&A</div>
                    <div className="text-[10px] text-stone-400">Kết nối API để kích hoạt DeepSeek LLM</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Connection Interactive Control Box */}
          <div className="bg-black/50 backdrop-blur-md rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-amber-400/30 shadow-inner space-y-6">
            
            {/* Input Form & Buttons */}
            {!isConnected ? (
              <form onSubmit={handleConnect} className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs sm:text-sm font-bold text-amber-200 flex items-center gap-2">
                      <Key className="w-4 h-4 text-amber-400" />
                      <span>Nhập Khóa API DeepSeek (DeepSeek API Key):</span>
                    </label>
                    <span className="text-[11px] text-amber-300/80 flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Bảo mật chống sao chép & che giấu tuyệt đối</span>
                    </span>
                  </div>

                  {/* Secret Password Masked Input with Anti-Copy & Anti-Cut Protection */}
                  <div className="relative">
                    <input
                      type="password"
                      value={apiKeyInput}
                      onChange={(e) => setApiKeyInput(e.target.value)}
                      onCopy={handleBlockCopy}
                      onCut={handleBlockCopy}
                      onContextMenu={(e) => e.preventDefault()}
                      autoComplete="new-password"
                      spellCheck="false"
                      placeholder="Dán mã API DeepSeek của bạn tại đây (ví dụ: sk-...)"
                      className="w-full py-3.5 sm:py-4 pl-4 pr-12 rounded-2xl bg-[#140305] border-2 border-amber-400/50 focus:border-amber-300 focus:bg-[#200507] text-amber-100 placeholder-stone-500 text-sm sm:text-base font-mono focus:outline-none focus:ring-4 focus:ring-amber-500/20 transition-all select-none shadow-inner"
                      style={{ WebkitTextSecurity: 'disc', userSelect: 'none' }}
                    />
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 text-amber-400/60" title="Trường được bảo mật">
                      <EyeOff className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* Submit & Action Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2 text-[11px] text-rose-200/70">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Khóa API được lưu mã hóa an toàn trên máy bạn, không gửi qua máy chủ trung gian.</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isTesting}
                    className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-[#200507] font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-amber-950/40 ring-2 ring-amber-300 hover:scale-103 transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
                  >
                    {isTesting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-[#200507]" />
                        <span>Đang Kiểm Tra...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 fill-current text-[#200507]" />
                        <span>Kết Nối API DeepSeek</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              /* Already Connected State */
              <div className="space-y-5">
                <div className="p-4 sm:p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shadow-inner shrink-0">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-emerald-200 flex items-center gap-2">
                        <span>Cổng Kết Nối DeepSeek AI Đang Hoạt Động</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase">
                          Model: deepseek-chat
                        </span>
                      </div>
                      <div className="text-xs text-stone-300 font-mono mt-0.5 select-none">
                        Mã khóa: •••••••••••••••••••••••• (Đã bảo mật)
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <button
                      onClick={onOpenChatbot}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 text-[#200507] font-black text-xs uppercase tracking-wider shadow-md hover:scale-105 transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <MessageSquareText className="w-4 h-4 text-[#200507]" />
                      <span>Trò Chuyện AI Ngay</span>
                    </button>

                    <button
                      onClick={handleDisconnect}
                      className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-rose-900/50 hover:text-rose-200 text-stone-300 font-bold text-xs border border-white/15 transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <XCircle className="w-4 h-4 text-rose-400" />
                      <span>Ngắt Kết Nối / Đổi Mã</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Notification & Status Messages */}
            {statusMessage && (
              <div className={`p-3.5 rounded-xl text-xs flex items-center gap-2.5 animate-fadeIn ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-200'
                  : statusMessage.type === 'error'
                  ? 'bg-rose-950/80 border border-rose-500/50 text-rose-200'
                  : 'bg-amber-950/60 border border-amber-500/40 text-amber-200'
              }`}>
                {statusMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                {statusMessage.type === 'error' && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                {statusMessage.type === 'info' && <RefreshCw className="w-4 h-4 text-amber-400 animate-spin shrink-0" />}
                <p className="flex-1 font-medium">{statusMessage.text}</p>
              </div>
            )}

            {/* Warning Toast for Copy Attempts */}
            {showCopyWarning && (
              <div className="p-3 rounded-xl bg-amber-500/20 border border-amber-400/50 text-amber-200 text-xs flex items-center gap-2 animate-bounce">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Vì lý do bảo mật an toàn thông tin, hệ thống không cho phép sao chép mã API này.</span>
              </div>
            )}
          </div>

          {/* 3 Pillars of DeepSeek Integration */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <h4 className="font-serif-title font-bold text-sm text-amber-200">Suy Luận Sâu Đa Chiều</h4>
              <p className="text-[11px] text-rose-100/70 leading-relaxed">
                Mô hình DeepSeek-V3 giải thích chi tiết ý nghĩa lịch sử, bối cảnh thời đại và giá trị văn hóa của từng di tích.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <h4 className="font-serif-title font-bold text-sm text-amber-200">Gắn Kết RAG 103 Di Tích</h4>
              <p className="text-[11px] text-rose-100/70 leading-relaxed">
                Dữ liệu được nạp trực tiếp từ 103 di tích cấp Quốc gia & Quốc gia đặc biệt chuẩn hóa bởi Sở VH&TT TP.HCM.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                <Lock className="w-4 h-4" />
              </div>
              <h4 className="font-serif-title font-bold text-sm text-amber-200">Bảo Mật Quyền Riêng Tư</h4>
              <p className="text-[11px] text-rose-100/70 leading-relaxed">
                Mã khóa được ẩn hoàn toàn và lưu trữ nội bộ (Client-side), nghiêm cấm mọi hình thức rò rỉ hay sao chép.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
