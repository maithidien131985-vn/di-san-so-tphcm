// ==============================================================================
// HỆ THỐNG THU THẬP DỮ LIỆU HÀNH VI HỌC SINH (STUDENT BEHAVIORAL ANALYTICS ENGINE)
// Phục vụ thống kê, nghiên cứu giáo dục & minh chứng báo cáo Khoa học Kỹ thuật
// ==============================================================================

const WEBHOOK_STORAGE_KEY = 'di_san_so_google_sheet_webhook_v1';
const QUEUE_STORAGE_KEY = 'di_san_so_telemetry_queue_v1';

// URL mặc định (có thể được cấu hình hoặc thay đổi động qua giao diện quản trị)
export const DEFAULT_WEBHOOK_URL = '';

/**
 * Lấy URL Google Sheets Webhook hiện tại
 */
export function getGoogleSheetWebhookUrl() {
  if (typeof window === 'undefined') return DEFAULT_WEBHOOK_URL;
  try {
    return localStorage.getItem(WEBHOOK_STORAGE_KEY) || DEFAULT_WEBHOOK_URL;
  } catch (e) {
    return DEFAULT_WEBHOOK_URL;
  }
}

/**
 * Cập nhật URL Google Sheets Webhook mới
 */
export function setGoogleSheetWebhookUrl(url) {
  if (typeof window === 'undefined') return;
  try {
    if (url && url.trim()) {
      localStorage.setItem(WEBHOOK_STORAGE_KEY, url.trim());
    } else {
      localStorage.removeItem(WEBHOOK_STORAGE_KEY);
    }
  } catch (e) {
    console.warn('Không thể lưu Webhook URL:', e);
  }
}

/**
 * Gửi sự kiện telemetry ngầm đến Google Apps Script Webhook
 * @param {string} eventType - 'LOGIN' | 'JOURNEY_PROGRESS' | 'JOURNEY_COMPLETED' | 'CONTRIBUTION' | 'QUIZ'
 * @param {object} payload - Dữ liệu chi tiết của sự kiện
 */
export async function sendTelemetryEvent(eventType, payload = {}) {
  if (typeof window === 'undefined') return;

  const webhookUrl = getGoogleSheetWebhookUrl();
  const eventData = {
    eventType,
    timestamp: new Date().toISOString(),
    localTime: new Date().toLocaleString('vi-VN'),
    userAgent: navigator.userAgent || 'Unknown',
    screenWidth: window.innerWidth || 0,
    ...payload
  };

  // Log nội bộ để tiện kiểm tra
  console.log(`📡 [Telemetry: ${eventType}]`, eventData);

  // Nếu chưa có Webhook URL, lưu vào hàng đợi cục bộ để gửi sau khi có cấu hình
  if (!webhookUrl) {
    saveToOfflineQueue(eventData);
    return;
  }

  try {
    // Sử dụng mode no-cors để gửi Google Apps Script Webhook mà không bị chặn bởi CORS trình duyệt
    await fetch(webhookUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(eventData)
    });
    
    // Thử gửi các sự kiện còn tồn đọng trong queue
    flushOfflineQueue(webhookUrl);
  } catch (err) {
    console.warn('Lỗi gửi dữ liệu telemetry, lưu tạm offline queue:', err);
    saveToOfflineQueue(eventData);
  }
}

function saveToOfflineQueue(eventData) {
  try {
    const raw = localStorage.getItem(QUEUE_STORAGE_KEY);
    const queue = raw ? JSON.parse(raw) : [];
    queue.push(eventData);
    // Giữ tối đa 100 sự kiện gần nhất
    if (queue.length > 100) queue.shift();
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue));
  } catch (e) {
    // Bỏ qua lỗi bộ nhớ
  }
}

async function flushOfflineQueue(webhookUrl) {
  try {
    const raw = localStorage.getItem(QUEUE_STORAGE_KEY);
    if (!raw) return;
    const queue = JSON.parse(raw);
    if (!Array.isArray(queue) || queue.length === 0) return;

    // Lấy tối đa 5 sự kiện gửi dần
    const item = queue.shift();
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue));

    await fetch(webhookUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });
  } catch (e) {
    // Không làm gián đoạn luồng chính
  }
}

// ==============================================================================
// CÁC HÀM BẮT SỰ KIỆN CHUYÊN BIỆT CHO TỪNG HOẠT ĐỘNG CỦA HỌC SINH
// ==============================================================================

/**
 * 1. Thu thập sự kiện Học sinh Đăng nhập / Khởi tạo Hộ chiếu Di sản
 */
export function trackStudentLogin(passport) {
  if (!passport) return;
  sendTelemetryEvent('LOGIN', {
    passportCode: passport.code || 'N/A',
    fullName: passport.fullName || 'Học sinh',
    school: passport.school || 'TP.HCM',
    grade: passport.grade || 'THCS',
    avatar: passport.avatar || '🦁',
    totalXP: passport.totalXP || 0,
    visitedCount: Object.keys(passport.visitedMonuments || {}).length,
    actionDetail: 'Đăng nhập vào Hệ sinh thái số Di sản TP.HCM'
  });
}

/**
 * 2. Thu thập sự kiện Học sinh Khám phá Di tích & Đạt Cột mốc Hành trình
 */
export function trackJourneyProgress(passport, monumentStt, monumentName, totalVisited) {
  sendTelemetryEvent('JOURNEY_PROGRESS', {
    passportCode: passport?.code || 'GUEST',
    fullName: passport?.fullName || 'Khách trải nghiệm',
    school: passport?.school || 'Chưa đăng ký',
    grade: passport?.grade || 'Chưa đăng ký',
    monumentStt,
    monumentName,
    totalVisited,
    totalMonuments: 103,
    progressPercent: Math.round((totalVisited / 103) * 100),
    totalXP: passport?.totalXP || 0,
    actionDetail: `Khám phá di tích STT ${monumentStt}: ${monumentName} (${totalVisited}/103 di tích)`
  });
}

/**
 * 3. Thu thập sự kiện Học sinh Hoàn thành Toàn bộ Hành trình (103/103 di tích)
 */
export function trackJourneyCompleted(passport, summary = {}) {
  sendTelemetryEvent('JOURNEY_COMPLETED', {
    passportCode: passport?.code || 'N/A',
    fullName: passport?.fullName || 'Học sinh xuất sắc',
    school: passport?.school || 'TP.HCM',
    grade: passport?.grade || 'THCS',
    totalVisited: summary.totalVisited || 103,
    totalXP: passport?.totalXP || 0,
    badgesCount: (passport?.badges || []).length,
    actionDetail: '🏆 ĐÃ HOÀN THÀNH TOÀN BỘ 103 DI TÍCH LỊCH SỬ - VĂN HÓA TP.HCM'
  });
}

/**
 * 4. Thu thập sự kiện Học sinh Đóng góp Ý kiến / Hiện vật / Cảm nhận
 */
export function trackContribution(contribution) {
  if (!contribution) return;
  sendTelemetryEvent('CONTRIBUTION', {
    passportCode: contribution.passportCode || 'N/A',
    author: contribution.author || 'Học sinh',
    school: contribution.school || 'TP.HCM',
    grade: contribution.grade || 'THCS',
    monumentName: contribution.monumentName || 'Tổng thể Di sản',
    type: contribution.type || 'Ý kiến & Cảm nhận',
    title: contribution.title || '',
    content: contribution.content || '',
    actionDetail: `Đóng góp tư liệu / ý kiến: ${contribution.title || contribution.type}`
  });
}

/**
 * 5. Thu thập sự kiện Học sinh Tham gia Trắc nghiệm & Thử thách
 */
export function trackQuizAttempt({ passport, monumentStt, monumentName, question, isCorrect, score, totalQuestions }) {
  sendTelemetryEvent('QUIZ', {
    passportCode: passport?.code || 'GUEST',
    fullName: passport?.fullName || 'Học sinh',
    school: passport?.school || 'TP.HCM',
    grade: passport?.grade || 'THCS',
    monumentStt,
    monumentName,
    questionSummary: typeof question === 'string' ? question.slice(0, 100) : 'Trắc nghiệm di tích',
    result: isCorrect ? 'ĐÚNG' : 'CHƯA ĐÚNG',
    score: score !== undefined ? score : (isCorrect ? 10 : 0),
    totalQuestions: totalQuestions || 1,
    actionDetail: `Trả lời câu hỏi trắc nghiệm di tích ${monumentName} (${isCorrect ? 'Chính xác' : 'Sai'})`
  });
}
