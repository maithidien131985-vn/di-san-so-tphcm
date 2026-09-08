import React from 'react';
import { RotateCcw, Home, AlertTriangle } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('=== CRASH DETAIL ===');
    console.error('Error message:', error?.message);
    console.error('Error stack:', error?.stack);
    console.error('Component stack:', errorInfo?.componentStack);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    try {
      localStorage.clear();
    } catch (e) {}
    window.location.hash = '#home';
    window.location.reload();
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.hash = '#home';
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const errMsg = this.state.error?.message || 'Lỗi không xác định';
      const componentStack = this.state.errorInfo?.componentStack || '';
      // Show first few lines of component stack for debugging
      const stackPreview = componentStack.split('\n').slice(0, 6).join('\n');

      return (
        <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-white rounded-2xl p-6 sm:p-8 border-2 border-red-200 shadow-xl space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-red-50 text-[#7E1819] flex items-center justify-center mx-auto shadow-sm">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="font-serif-title font-black text-xl text-[#7E1819] text-center">
              Đã khôi phục trang di tích
            </h2>
            <p className="text-xs sm:text-sm text-[#666666] leading-relaxed text-center">
              Hệ thống đã tự động bảo vệ dữ liệu để tránh lỗi trắng màn hình.
            </p>
            {/* Debug info - visible for troubleshooting */}
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-200 text-left">
              <p className="text-[11px] font-bold text-red-700 mb-1">Chi tiết lỗi (debug):</p>
              <p className="text-[10px] font-mono text-red-600 break-all leading-tight">{errMsg}</p>
              {stackPreview && (
                <pre className="text-[9px] font-mono text-gray-500 mt-2 overflow-auto max-h-24 whitespace-pre-wrap break-all">{stackPreview}</pre>
              )}
            </div>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={this.handleGoHome}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#7E1819] hover:bg-[#911d1e] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Home className="w-4 h-4" />
                <span>Về Trang Chủ</span>
              </button>
              <button
                onClick={this.handleReset}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer border border-amber-300"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Làm Mới & Tải Lại</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
