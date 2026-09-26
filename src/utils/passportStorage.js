// ==============================================================================
// HỆ THỐNG LƯU TRỮ VÀ QUẢN LÝ HỘ CHIẾU DI SẢN HỌC SINH (HERITAGE PASSPORT ENGINE)
// Hỗ trợ 2 chế độ: Khách tự do & Học sinh lưu hành trình qua Mã Số Hộ Chiếu
// ==============================================================================

import { trackStudentLogin, trackJourneyProgress, trackJourneyCompleted, getGoogleSheetWebhookUrl } from './studentAnalytics';

const PASSPORTS_STORAGE_KEY = 'di_san_so_passports_v2';
const ACTIVE_PASSPORT_ID_KEY = 'di_san_so_active_passport_id_v2';

/**
 * Sinh mã số Hộ Chiếu Di Sản độc nhất ngẫu nhiên (VD: HC-2026-8942)
 */
export function generatePassportCode() {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `HC-2026-${randomNum}`;
}

/**
 * Lấy toàn bộ danh sách Hộ chiếu đã lưu
 */
export function getAllPassports() {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(PASSPORTS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.warn('Lỗi đọc dữ liệu hộ chiếu:', e);
    return {};
  }
}

/**
 * Lấy Hộ chiếu hiện đang kích hoạt (nếu có)
 */
export function getActivePassport() {
  if (typeof window === 'undefined') return null;
  try {
    const activeCode = localStorage.getItem(ACTIVE_PASSPORT_ID_KEY);
    if (!activeCode) return null;
    const all = getAllPassports();
    return all[activeCode] || null;
  } catch (e) {
    console.warn('Lỗi lấy hộ chiếu active:', e);
    return null;
  }
}

/**
 * Chuẩn hóa mã số Hộ chiếu thông minh
 * Tự động xử lý mọi định dạng người dùng nhập:
 * - "HC - 2026 - 1036" -> "HC-2026-1036"
 * - "hc-2026-1036"     -> "HC-2026-1036"
 * - "2026-1036"        -> "HC-2026-1036"
 * - "1036"             -> "HC-2026-1036"
 * - "HC20261036"       -> "HC-2026-1036"
 */
export function normalizePassportCode(raw) {
  if (!raw) return '';
  let str = String(raw).trim().toUpperCase();
  // Xóa toàn bộ khoảng trắng thừa
  str = str.replace(/\s+/g, '');

  // Nếu người dùng chỉ gõ 4 chữ số, VD: 1036 -> HC-2026-1036
  if (/^\d{4}$/.test(str)) {
    return `HC-2026-${str}`;
  }

  // Nếu người dùng gõ 2026-1036 hoặc 20261036
  if (/^(202[4-9])-?(\d{4})$/.test(str)) {
    const match = str.match(/^(202[4-9])-?(\d{4})$/);
    return `HC-${match[1]}-${match[2]}`;
  }

  // Nếu người dùng gõ HC20261036 (không có gạch nối)
  if (/^HC(202[4-9])(\d{4})$/.test(str)) {
    const match = str.match(/^HC(202[4-9])(\d{4})$/);
    return `HC-${match[1]}-${match[2]}`;
  }

  // Chuẩn hóa dấu gạch ngang (nhiều dấu gạch nối liên tiếp)
  str = str.replace(/-+/g, '-');

  return str;
}

/**
 * Đăng nhập / Kích hoạt hộ chiếu bằng mã số (Hỗ trợ tìm kiếm thông minh & khôi phục liên thiết bị)
 */
export function loginPassport(code) {
  if (!code) return null;
  const cleanCode = normalizePassportCode(code);
  if (!cleanCode) return null;
  const all = getAllPassports();

  // 1. Tìm trực tiếp theo mã đã chuẩn hóa
  if (all[cleanCode]) {
    localStorage.setItem(ACTIVE_PASSPORT_ID_KEY, cleanCode);
    try {
      trackStudentLogin(all[cleanCode]);
    } catch (e) {}
    return all[cleanCode];
  }

  // 2. Tìm mềm (Fuzzy search) không phân biệt dấu gạch ngang hay khoảng trắng
  const strippedTarget = cleanCode.replace(/[^A-Z0-9]/g, '');
  for (const k of Object.keys(all)) {
    if (k.replace(/[^A-Z0-9]/g, '') === strippedTarget) {
      localStorage.setItem(ACTIVE_PASSPORT_ID_KEY, k);
      try {
        trackStudentLogin(all[k]);
      } catch (e) {}
      return all[k];
    }
  }

  // 3. Quét toàn bộ localStorage để tìm dữ liệu hộ chiếu trong các bản sao lưu
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const storageKey = localStorage.key(i);
      if (storageKey && (storageKey.includes('passport') || storageKey.includes('student'))) {
        const val = localStorage.getItem(storageKey);
        if (val && val.includes(cleanCode)) {
          try {
            const parsed = JSON.parse(val);
            if (parsed.code === cleanCode || parsed[cleanCode]) {
              const p = parsed.code === cleanCode ? parsed : parsed[cleanCode];
              all[cleanCode] = p;
              localStorage.setItem(PASSPORTS_STORAGE_KEY, JSON.stringify(all));
              localStorage.setItem(ACTIVE_PASSPORT_ID_KEY, cleanCode);
              try { trackStudentLogin(p); } catch (err) {}
              return p;
            }
          } catch (err) {}
        }
      }
    }
  } catch (e) {}

  // 4. Nếu mã đúng chuẩn HC-XXXX-XXXX (Ví dụ học sinh tạo mã trên điện thoại, giờ nhập trên máy tính)
  // Tự động khôi phục thẻ và kết nối phiên làm việc cho học sinh không bị gián đoạn
  if (/^HC-202[4-9]-\d{4}$/.test(cleanCode) || /^HC-\d{4}-\d{4}$/.test(cleanCode)) {
    let savedInfo = {};
    try {
      savedInfo = JSON.parse(localStorage.getItem('di_san_so_last_student_info') || '{}');
    } catch (e) {}

    const recoveredPassport = {
      code: cleanCode,
      fullName: savedInfo.studentName || `Nhà Thám Hiểm (${cleanCode})`,
      school: savedInfo.schoolName || 'TP. Hồ Chí Minh',
      grade: savedInfo.className || 'THCS',
      avatar: '🦁',
      createdAt: new Date().toISOString(),
      lastVisitedAt: new Date().toISOString(),
      visitedMonuments: {},
      totalXP: 0,
      badges: ['Tân Binh Thám Hiểm 🧭'],
      streakDays: 1,
      lastActiveDate: new Date().toDateString(),
      isRecovered: true
    };

    all[cleanCode] = recoveredPassport;
    localStorage.setItem(PASSPORTS_STORAGE_KEY, JSON.stringify(all));
    localStorage.setItem(ACTIVE_PASSPORT_ID_KEY, cleanCode);

    try {
      trackStudentLogin(recoveredPassport);
    } catch (e) {}

    return recoveredPassport;
  }

  return null;
}

/**
 * Đồng bộ dữ liệu học sinh từ Google Sheets Webhook qua Mã Hộ Chiếu (Đồng bộ đa thiết bị)
 */
export async function fetchStudentFromCloud(code) {
  if (!code) return null;
  const cleanCode = normalizePassportCode(code);
  if (!cleanCode) return null;

  try {
    const webhookUrl = getGoogleSheetWebhookUrl();
    if (!webhookUrl) return null;

    const res = await fetch(`${webhookUrl}?action=getStudent&code=${encodeURIComponent(cleanCode)}`, {
      method: 'GET'
    });
    if (!res.ok) return null;
    const json = await res.json();
    
    if (json && json.status === 'success' && json.found && json.student) {
      const st = json.student;
      const all = getAllPassports();
      const existing = all[cleanCode] || {};

      const mergedPassport = {
        ...existing,
        code: cleanCode,
        fullName: (st.fullName && !st.fullName.startsWith('Nhà Thám Hiểm')) ? st.fullName : (existing.fullName || st.fullName || `Nhà Thám Hiểm (${cleanCode})`),
        school: st.school || existing.school || 'TP. Hồ Chí Minh',
        grade: st.grade || existing.grade || 'THCS',
        avatar: existing.avatar || '🦁',
        totalXP: Math.max(Number(st.totalXP) || 0, existing.totalXP || 0),
        visitedMonuments: { ...(existing.visitedMonuments || {}), ...(st.visitedMonuments || {}) },
        badges: existing.badges || ['Tân Binh Thám Hiểm 🧭'],
        streakDays: existing.streakDays || 1,
        lastActiveDate: new Date().toDateString(),
        isRecovered: false
      };

      // Cập nhật huy hiệu tương ứng số di tích đã khám phá
      const count = Object.keys(mergedPassport.visitedMonuments).length;
      const b = [...mergedPassport.badges];
      if (count >= 1 && !b.includes('Dấu Chân Đầu Tiên 👣')) b.push('Dấu Chân Đầu Tiên 👣');
      if (count >= 5 && !b.includes('Nhà Thám Hiểm Tập Sự 🎒')) b.push('Nhà Thám Hiểm Tập Sự 🎒');
      if (count >= 15 && !b.includes('Chuyên Gia Di Tích Sài Gòn 🏛️')) b.push('Chuyên Gia Di Tích Sài Gòn 🏛️');
      if (count >= 50 && !b.includes('Đại Sứ Di Sản Học Đường 🎖️')) b.push('Đại Sứ Di Sản Học Đường 🎖️');
      if (count >= 103 && !b.includes('Huyền Thoại 103 Di Tích 👑')) b.push('Huyền Thoại 103 Di Tích 👑');
      mergedPassport.badges = b;

      all[cleanCode] = mergedPassport;
      localStorage.setItem(PASSPORTS_STORAGE_KEY, JSON.stringify(all));
      localStorage.setItem(ACTIVE_PASSPORT_ID_KEY, cleanCode);
      return mergedPassport;
    }
  } catch (err) {
    console.warn('Lỗi đồng bộ từ Cloud Webhook:', err);
  }
  return null;
}

/**
 * Cập nhật thông tin Họ tên, Trường, Lớp, Avatar cho Thẻ Khám Phá hiện tại
 */
export function updatePassportProfile(code, { fullName, school, grade, avatar }) {
  if (!code) return null;
  const cleanCode = normalizePassportCode(code);
  const all = getAllPassports();
  const existing = all[cleanCode] || getActivePassport() || {};

  const updated = {
    ...existing,
    code: cleanCode,
    fullName: fullName ? fullName.trim() : (existing.fullName || `Nhà Thám Hiểm (${cleanCode})`),
    school: school ? school.trim() : (existing.school || 'TP. Hồ Chí Minh'),
    grade: grade ? grade.trim() : (existing.grade || 'THCS'),
    avatar: avatar || existing.avatar || '🦁',
    isRecovered: false,
    lastVisitedAt: new Date().toISOString()
  };

  all[cleanCode] = updated;
  localStorage.setItem(PASSPORTS_STORAGE_KEY, JSON.stringify(all));
  localStorage.setItem(ACTIVE_PASSPORT_ID_KEY, cleanCode);

  try {
    localStorage.setItem('di_san_so_last_student_info', JSON.stringify({
      studentName: updated.fullName,
      schoolName: updated.school,
      className: updated.grade
    }));
    trackStudentLogin(updated);
  } catch (e) {}

  return updated;
}

/**
 * Đăng xuất / Quay lại Chế độ Khách tự do
 */
export function logoutPassport() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(ACTIVE_PASSPORT_ID_KEY);
  }
}

/**
 * Tạo mới một Hộ Chiếu Di Sản cho học sinh
 */
export function createPassport({ fullName, school, grade, avatar = '🦁' }) {
  const all = getAllPassports();
  let code = generatePassportCode();
  
  // Đảm bảo mã không trùng
  while (all[code]) {
    code = generatePassportCode();
  }

  const newPassport = {
    code,
    fullName: fullName.trim(),
    school: school ? school.trim() : 'TP. Hồ Chí Minh',
    grade: grade ? grade.trim() : 'Học sinh',
    avatar,
    createdAt: new Date().toISOString(),
    lastVisitedAt: new Date().toISOString(),
    visitedMonuments: {}, // { [stt]: { timestamp, name, xp, notes } }
    totalXP: 0,
    badges: ['Tân Binh Thám Hiểm 🧭'],
    streakDays: 1,
    lastActiveDate: new Date().toDateString()
  };

  all[code] = newPassport;
  localStorage.setItem(PASSPORTS_STORAGE_KEY, JSON.stringify(all));
  localStorage.setItem(ACTIVE_PASSPORT_ID_KEY, code);

  try {
    trackStudentLogin(newPassport);
  } catch (e) {}

  return newPassport;
}

/**
 * Đóng dấu khám phá di tích vào Hộ chiếu & lưu báo cáo điều tra
 */
export function checkInMonument(stt, monumentName, earnedXP = 100, note = '', reportData = null) {
  const active = getActivePassport();
  if (!active) return null;

  const all = getAllPassports();
  const code = active.code;
  const passport = all[code] || active;

  const existingEntry = passport.visitedMonuments[stt];
  const isAlreadyVisited = !!existingEntry;
  const now = new Date();

  passport.visitedMonuments[stt] = {
    stt,
    name: monumentName,
    visitedAt: existingEntry?.visitedAt || now.toISOString(),
    earnedXP: isAlreadyVisited ? ((existingEntry.earnedXP || 100) + (reportData ? earnedXP : 0)) : earnedXP,
    notes: note || existingEntry?.notes || '',
    report: reportData || existingEntry?.report || null
  };

  if (!isAlreadyVisited) {
    passport.totalXP = (passport.totalXP || 0) + earnedXP;
  } else if (reportData && !existingEntry?.report) {
    // Thưởng thêm XP khi nộp báo cáo điều tra lần đầu
    passport.totalXP = (passport.totalXP || 0) + earnedXP;
  }

  // Cập nhật chuỗi ngày thám hiểm
  const todayStr = now.toDateString();
  if (passport.lastActiveDate !== todayStr) {
    passport.streakDays = (passport.streakDays || 1) + 1;
    passport.lastActiveDate = todayStr;
  }
  passport.lastVisitedAt = now.toISOString();

  // Kiểm tra mở khóa huy hiệu theo số lượng di tích đã khám phá
  const visitedCount = Object.keys(passport.visitedMonuments).length;
  const newBadges = [...(passport.badges || [])];

  if (visitedCount >= 1 && !newBadges.includes('Dấu Chân Đầu Tiên 👣')) {
    newBadges.push('Dấu Chân Đầu Tiên 👣');
  }
  if (visitedCount >= 5 && !newBadges.includes('Nhà Thám Hiểm Tập Sự 🎒')) {
    newBadges.push('Nhà Thám Hiểm Tập Sự 🎒');
  }
  if (visitedCount >= 15 && !newBadges.includes('Chuyên Gia Di Tích Sài Gòn 🏛️')) {
    newBadges.push('Chuyên Gia Di Tích Sài Gòn 🏛️');
  }
  if (visitedCount >= 50 && !newBadges.includes('Đại Sứ Di Sản Học Đường 🎖️')) {
    newBadges.push('Đại Sứ Di Sản Học Đường 🎖️');
  }
  if (visitedCount >= 103 && !newBadges.includes('Huyền Thoại 103 Di Tích 👑')) {
    newBadges.push('Huyền Thoại 103 Di Tích 👑');
  }

  passport.badges = newBadges;

  all[code] = passport;
  localStorage.setItem(PASSPORTS_STORAGE_KEY, JSON.stringify(all));

  // Gửi telemetry tiến độ hành trình
  try {
    trackJourneyProgress(passport, stt, monumentName, visitedCount);
    if (visitedCount >= 103) {
      trackJourneyCompleted(passport, { totalVisited: visitedCount, totalXP: passport.totalXP });
    }
  } catch (e) {}

  return passport;
}

/**
 * Lấy báo cáo điều tra đã lưu của một di tích
 */
export function getSavedInvestigationReport(stt) {
  const active = getActivePassport();
  if (!active) {
    try {
      const allReports = JSON.parse(localStorage.getItem('di_san_so_guest_reports') || '{}');
      return allReports[stt] || null;
    } catch (e) {
      return null;
    }
  }
  return active.visitedMonuments?.[stt]?.report || null;
}

/**
 * Lưu ghi chú/bút ký của học sinh cho một di tích cụ thể
 */
export function saveMonumentNote(stt, noteText) {
  const active = getActivePassport();
  if (!active) return null;

  const all = getAllPassports();
  const passport = all[active.code];
  if (!passport) return null;

  if (passport.visitedMonuments[stt]) {
    passport.visitedMonuments[stt].notes = noteText;
    all[active.code] = passport;
    localStorage.setItem(PASSPORTS_STORAGE_KEY, JSON.stringify(all));
  }
  return passport;
}
