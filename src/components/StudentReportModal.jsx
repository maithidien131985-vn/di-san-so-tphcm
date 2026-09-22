import React, { useState, useEffect } from 'react';
import { X, Send, CheckCircle2, Download, RotateCcw, HelpCircle, Sparkles, CloudCheck, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import soundEffects from '../utils/soundEffects';
import { checkInMonument, getSavedInvestigationReport } from '../utils/passportStorage';
import { trackInvestigationReport } from '../utils/studentAnalytics';

export default function StudentReportModal({ 
  isOpen, 
  onClose,
  investigation,
  monumentName = 'Dinh Độc Lập',
  monumentStt = 1,
  onOpenActionModal,
  activePassport = null,
  onPassportUpdate,
  onCompleteInvestigation
}) {
  const [studentName, setStudentName] = useState(() => {
    if (activePassport?.fullName) return activePassport.fullName;
    try {
      const saved = JSON.parse(localStorage.getItem('di_san_so_last_student_info') || '{}');
      return saved.studentName || '';
    } catch (e) {
      return '';
    }
  });

  const [className, setClassName] = useState(() => {
    if (activePassport?.grade) return activePassport.grade;
    try {
      const saved = JSON.parse(localStorage.getItem('di_san_so_last_student_info') || '{}');
      return saved.className || '';
    } catch (e) {
      return '';
    }
  });

  const [schoolName, setSchoolName] = useState(() => {
    if (activePassport?.school) return activePassport.school;
    try {
      const saved = JSON.parse(localStorage.getItem('di_san_so_last_student_info') || '{}');
      return saved.schoolName || '';
    } catch (e) {
      return '';
    }
  });

  const [analysisText, setAnalysisText] = useState('');
  const [messageToFuture, setMessageToFuture] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSavedLocally, setIsSavedLocally] = useState(false);

  const topicTitle = investigation?.investigationTopic || `Khảo sát & Nghiên cứu Di tích ${monumentName}`;
  const questionText = investigation?.investigationQuestion || `Di tích ${monumentName} mang những giá trị lịch sử, dấu ấn cách mạng và bài học gì cần được thế hệ trẻ gìn giữ?`;
  const defaultAnswer = investigation?.suggestedAnswer || `Di tích ${monumentName} là di sản lịch sử văn hóa tiêu biểu, ghi dấu những chiến công và công lao to lớn của các thế hệ đi trước.`;

  useEffect(() => {
    if (isOpen) {
      setIsSubmitted(false);

      // Kiểm tra xem học sinh đã từng lưu báo cáo điều tra cho di tích này chưa
      const savedReport = getSavedInvestigationReport(monumentStt);
      if (savedReport) {
        setAnalysisText(savedReport.answer || '');
        setMessageToFuture(savedReport.messageToFuture || '');
        setIsSavedLocally(true);
      } else {
        try {
          const raw = localStorage.getItem(`di_san_so_report_${monumentStt}`);
          if (raw) {
            const parsed = JSON.parse(raw);
            setAnalysisText(parsed.analysisText || '');
            setMessageToFuture(parsed.messageToFuture || '');
            setIsSavedLocally(true);
          } else {
            setAnalysisText('');
            setMessageToFuture('');
            setIsSavedLocally(false);
          }
        } catch (e) {
          setAnalysisText('');
          setMessageToFuture('');
          setIsSavedLocally(false);
        }
      }

      // Auto fill student info if empty
      if (!studentName && activePassport?.fullName) {
        setStudentName(activePassport.fullName);
      }
      if (!className && activePassport?.grade) {
        setClassName(activePassport.grade);
      }
      if (!schoolName && activePassport?.school) {
        setSchoolName(activePassport.school);
      }
    }
  }, [isOpen, activePassport, monumentStt]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!studentName.trim()) {
      soundEffects.playWrong();
      alert('Vui lòng nhập họ và tên của học sinh!');
      return;
    }

    if (!analysisText.trim()) {
      soundEffects.playWrong();
      alert('Vui lòng điền câu trả lời phân tích điều tra di tích (hoặc bấm nút "Nạp gợi ý tư liệu")!');
      return;
    }

    const reportData = {
      studentName: studentName.trim(),
      className: className.trim(),
      schoolName: schoolName.trim(),
      monumentStt,
      monumentName,
      question: questionText,
      answer: analysisText.trim(),
      messageToFuture: messageToFuture.trim() || 'Em xin hứa luôn trân trọng, gìn giữ và lan tỏa niềm tự hào di sản lịch sử dân tộc!',
      submittedAt: new Date().toISOString()
    };

    // 1. Lưu thông tin học sinh vào localStorage dùng cho các lần sau
    try {
      localStorage.setItem('di_san_so_last_student_info', JSON.stringify({
        studentName: studentName.trim(),
        className: className.trim(),
        schoolName: schoolName.trim(),
        messageToFuture: messageToFuture.trim()
      }));
      localStorage.setItem(`di_san_so_report_${monumentStt}`, JSON.stringify(reportData));
    } catch (err) {}

    // 2. Lưu vào Hộ Chiếu Di Sản & Thưởng +300 XP
    let updatedPassport = null;
    try {
      updatedPassport = checkInMonument(monumentStt, monumentName, 300, analysisText.trim().slice(0, 100), reportData);
      if (updatedPassport && onPassportUpdate) {
        onPassportUpdate(updatedPassport);
      }
    } catch (err) {}

    // 3. Gửi sự kiện Telemetry đồng bộ dữ liệu về Google Sheets Webhook
    try {
      trackInvestigationReport({
        passport: updatedPassport || activePassport || {
          code: 'GUEST',
          fullName: studentName.trim(),
          school: schoolName.trim(),
          grade: className.trim(),
          totalXP: 300
        },
        monumentStt,
        monumentName,
        question: questionText,
        answer: analysisText.trim(),
        messageToFuture: messageToFuture.trim() || 'Gìn giữ và phát huy truyền thống lịch sử',
        earnedXP: 300,
        totalVisited: updatedPassport ? Object.keys(updatedPassport.visitedMonuments || {}).length : 1,
        totalXP: updatedPassport ? updatedPassport.totalXP : 300
      });
    } catch (err) {
      console.warn('Lỗi gửi báo cáo điều tra về Google Sheets:', err);
    }

    soundEffects.playCorrect();
    setIsSubmitted(true);
    setIsSavedLocally(true);

    if (onCompleteInvestigation) {
      onCompleteInvestigation(monumentStt);
    }
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
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
            onClick={() => {
              soundEffects.playTap();
              onClose();
            }}
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
                  <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                    <span>💡 Câu trả lời & Luận giải điều tra di tích:</span>
                    {isSavedLocally && (
                      <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md font-bold">
                        Đã có bản lưu
                      </span>
                    )}
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      soundEffects.playTap();
                      setAnalysisText(defaultAnswer);
                    }}
                    className="text-[11px] text-[#7B1113] hover:underline font-bold cursor-pointer flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Nạp gợi ý tư liệu</span>
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={analysisText}
                  onChange={(e) => setAnalysisText(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-300 text-xs sm:text-sm bg-white outline-none focus:border-[#7B1113] leading-relaxed"
                  placeholder="Trình bày quan điểm, phân tích và luận giải lịch sử của em..."
                />
              </div>

              {/* Message to future */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  📜 Lời cam kết và thông điệp tri ân (Gửi tương lai):
                </label>
                <input
                  type="text"
                  value={messageToFuture}
                  onChange={(e) => setMessageToFuture(e.target.value)}
                  placeholder="Nhập lời hứa và thông điệp của em gửi tới thế hệ tương lai..."
                  className="w-full p-2.5 rounded-xl border border-gray-300 text-xs bg-white outline-none focus:border-[#7B1113]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-[#7B1113] hover:bg-[#96171a] text-white font-bold text-sm shadow-md transition-all hover:scale-101 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Hoàn Thành & Lưu Báo Cáo Điều Tra (+300 XP)</span>
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
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-black uppercase tracking-wider mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                    <span>+300 XP • ĐÃ ĐỒNG BỘ GOOGLE SHEETS & HỘ CHIẾU</span>
                  </div>
                  <h3 className="font-serif-title font-black text-xl sm:text-2xl text-[#2C241E]">
                    {studentName}
                  </h3>
                  <p className="text-xs text-[#6B5E55]">
                    {className ? `${className} • ` : ''}{schoolName || 'Học sinh tham gia điều tra di sản'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EADBC8] text-left space-y-2.5 text-xs">
                  <div>
                    <span className="font-bold text-[#7B1113]">🏛️ Di tích nghiên cứu:</span> {monumentName}
                  </div>
                  <div>
                    <span className="font-bold text-[#7B1113]">🎯 Câu hỏi điều tra:</span> {questionText}
                  </div>
                  <div>
                    <span className="font-bold text-[#7B1113]">💡 Câu trả lời điều tra di tích:</span> {analysisText}
                  </div>
                  <div>
                    <span className="font-bold text-[#7B1113]">📜 Lời cam kết & thông điệp tri ân:</span> {messageToFuture}
                  </div>
                </div>

                {/* Action Callout Before Leaving Monument */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-[#BA8438]/20 to-amber-500/15 border-2 border-[#BA8438]/40 text-center space-y-3 shadow-sm">
                  <div className="flex items-center justify-center gap-2 text-[#8C5D1E] font-black text-xs uppercase tracking-wider">
                    <span className="text-base">🌱</span>
                    <span>BƯỚC TIẾP THEO TRƯỚC KHI RỜI DI TÍCH</span>
                  </div>
                  <h4 className="font-serif-title font-black text-sm sm:text-base text-[#2C241E]">
                    Hãy biến bài học lịch sử thành hành động thiết thực!
                  </h4>
                  <p className="text-xs text-[#555] max-w-lg mx-auto leading-relaxed">
                    Sau khi hoàn thành điều tra, hãy cùng nhau gửi thông điệp cam kết gìn giữ, bảo vệ và lan tỏa di sản <strong>{monumentName}</strong>.
                  </p>
                  <button
                    onClick={() => {
                      soundEffects.playUnlock();
                      if (onOpenActionModal) {
                        onOpenActionModal({
                          studentName: studentName.trim(),
                          className: className.trim(),
                          schoolName: schoolName.trim(),
                          messageToFuture: messageToFuture.trim()
                        });
                      } else if (onClose) {
                        onClose();
                      }
                    }}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#BA8438] hover:bg-[#a3702b] text-white font-black text-sm shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2.5 mx-auto cursor-pointer border border-amber-200"
                  >
                    <span>🌱 HÀNH ĐỘNG: Đóng Góp Ý Tưởng & Gìn Giữ Di Sản</span>
                    <span>&rarr;</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2.5 justify-center pt-1">
                  <button
                    onClick={() => {
                      soundEffects.playTap();
                      window.print();
                    }}
                    className="px-5 py-2.5 rounded-xl bg-[#7B1113] text-white text-xs font-bold shadow hover:bg-[#96171a] flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>In phiếu báo cáo</span>
                  </button>
                  <button
                    onClick={() => {
                      soundEffects.playTap();
                      setIsSubmitted(false);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-gray-200 text-gray-800 text-xs font-bold hover:bg-gray-300 flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Chỉnh sửa lại</span>
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
