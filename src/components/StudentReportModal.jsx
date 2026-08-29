import React, { useState, useEffect } from 'react';
import { X, Send, CheckCircle2, Download, RotateCcw, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function StudentReportModal({ 
  isOpen, 
  onClose,
  investigation,
  monumentName = 'Dinh Độc Lập'
}) {
  const [studentName, setStudentName] = useState('');
  const [className, setClassName] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [analysisText, setAnalysisText] = useState('');
  const [messageToFuture, setMessageToFuture] = useState(
    'Em xin hứa sẽ noi gương các thế hệ cha anh, tích cực học tập, rèn luyện và góp phần bảo tồn, phát huy giá trị di sản lịch sử văn hóa của dân tộc!'
  );
  const [isSubmitted, setIsSubmitted] = useState(false);

  const topicTitle = investigation?.investigationTopic || `Khảo sát & Nghiên cứu Di tích ${monumentName}`;
  const questionText = investigation?.investigationQuestion || `Di tích ${monumentName} mang những giá trị lịch sử, dấu ấn cách mạng và bài học gì cần được thế hệ trẻ gìn giữ?`;
  const defaultAnswer = investigation?.suggestedAnswer || `Di tích ${monumentName} là di sản lịch sử văn hóa tiêu biểu, ghi dấu những chiến công và công lao to lớn của các thế hệ đi trước.`;

  useEffect(() => {
    if (isOpen) {
      setAnalysisText(defaultAnswer);
      setIsSubmitted(false);
    }
  }, [isOpen, defaultAnswer]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!studentName.trim()) {
      alert('Vui lòng nhập họ và tên của học sinh!');
      return;
    }
    setIsSubmitted(true);
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#FAF7F2] w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl border border-[#EADBC8] flex flex-col max-h-[92vh] animate-scaleUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#7B1113] via-[#96171a] to-[#7B1113] text-white p-4 sm:p-5 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-400 text-[#7B1113] flex items-center justify-center font-bold shadow-md">
              ✍️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-300 bg-black/20 px-2.5 py-0.5 rounded-full">
                  Phiếu Học Tập Điều Tra Lịch Sử
                </span>
                <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full">
                  Câu hỏi chuyên biệt
                </span>
              </div>
              <h3 className="font-serif-title font-bold text-base sm:text-xl text-white">
                Báo Cáo Điều Tra: {monumentName}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Question Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/90 border border-amber-300 space-y-1.5 shadow-2xs">
                <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#7B1113]">
                  <HelpCircle className="w-4 h-4 text-[#7B1113]" />
                  <span>CÂU HỎI ĐIỀU TRA LỊCH SỬ CHUYÊN BIỆT:</span>
                </div>
                <h4 className="font-serif-title font-black text-sm sm:text-base text-[#2C241E] leading-snug">
                  "{questionText}"
                </h4>
                <div className="text-[11px] text-[#7B1113] font-bold pt-1">
                  Đề tài: {topicTitle}
                </div>
              </div>

              {/* Student info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Họ và tên học sinh *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Nguyễn Văn An"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-xs bg-white outline-none focus:border-[#7B1113]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Lớp</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: 9A1 / 12 chuyên Sử"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-xs bg-white outline-none focus:border-[#7B1113]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Trường</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: THPT Nguyễn Thị Minh Khai"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-xs bg-white outline-none focus:border-[#7B1113]"
                  />
                </div>
              </div>

              {/* Analysis Textarea */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-gray-700 block">
                    Kết quả phân tích & luận giải của học sinh:
                  </label>
                  <button
                    type="button"
                    onClick={() => setAnalysisText(defaultAnswer)}
                    className="text-[11px] text-[#7B1113] hover:underline font-bold cursor-pointer"
                  >
                    Nạp gợi ý tư liệu
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={analysisText}
                  onChange={(e) => setAnalysisText(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-300 text-xs sm:text-sm bg-white outline-none focus:border-[#7B1113] leading-relaxed"
                  placeholder="Trình bày quan điểm và phân tích lịch sử của em..."
                />
              </div>

              {/* Message to future */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Thông điệp gửi tương lai & Lời hứa thế hệ trẻ:
                </label>
                <input
                  type="text"
                  value={messageToFuture}
                  onChange={(e) => setMessageToFuture(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-300 text-xs bg-white outline-none focus:border-[#7B1113]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-[#7B1113] hover:bg-[#96171a] text-white font-bold text-sm shadow-md transition-all hover:scale-101 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Hoàn Thành & Xuất Báo Cáo Điều Tra</span>
                </button>
              </div>
            </form>
          ) : (
            /* Result Certificate */
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-white border-2 border-amber-300 shadow-xl space-y-4 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl shadow-inner">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#7B1113] bg-red-50 px-3 py-1 rounded-full border border-red-200">
                    BÁO CÁO ĐIỀU TRA ĐÃ HOÀN THÀNH
                  </span>
                  <h3 className="font-serif-title font-black text-xl sm:text-2xl text-[#2C241E] mt-2">
                    {studentName}
                  </h3>
                  <p className="text-xs text-[#6B5E55]">
                    {className ? `${className} • ` : ''}{schoolName || 'Học sinh tham gia điều tra di sản'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EADBC8] text-left space-y-2.5 text-xs">
                  <div>
                    <span className="font-bold text-[#7B1113]">Di tích nghiên cứu:</span> {monumentName}
                  </div>
                  <div>
                    <span className="font-bold text-[#7B1113]">Câu hỏi điều tra:</span> {questionText}
                  </div>
                  <div>
                    <span className="font-bold text-[#7B1113]">Luận giải:</span> {analysisText}
                  </div>
                  <div>
                    <span className="font-bold text-[#7B1113]">Lời hứa thế hệ trẻ:</span> {messageToFuture}
                  </div>
                </div>

                <div className="flex gap-2 justify-center pt-2">
                  <button
                    onClick={() => window.print()}
                    className="px-5 py-2.5 rounded-xl bg-[#7B1113] text-white text-xs font-bold shadow hover:bg-[#96171a] flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>In phiếu báo cáo</span>
                  </button>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="px-4 py-2.5 rounded-xl bg-gray-200 text-gray-800 text-xs font-bold hover:bg-gray-300 flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Làm lại báo cáo</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-[#FAF0E6] border-t border-[#EADBC8] flex items-center justify-between text-xs text-[#8C7A6B]">
          <span>Phiếu học tập điều tra di sản số TP.HCM</span>
          <span className="font-bold text-[#7B1113]">Hồ Sơ Di Sản Số</span>
        </div>
      </div>
    </div>
  );
}
