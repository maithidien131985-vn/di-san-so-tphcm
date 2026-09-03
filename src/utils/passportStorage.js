// ==============================================================================
// HỆ THỐNG LƯU TRỮ VÀ QUẢN LÝ HỘ CHIẾU DI SẢN HỌC SINH (HERITAGE PASSPORT ENGINE)
// Hỗ trợ 2 chế độ: Khách tự do & Học sinh lưu hành trình qua Mã Số Hộ Chiếu
// ==============================================================================

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
 * Đăng nhập / Kích hoạt hộ chiếu bằng mã số
 */
export function loginPassport(code) {
  if (!code) return null;
  const cleanCode = code.trim().toUpperCase();
  const all = getAllPassports();
  const passport = all[cleanCode];

  if (passport) {
    localStorage.setItem(ACTIVE_PASSPORT_ID_KEY, cleanCode);
    return passport;
  }
  return null;
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

  return newPassport;
}

/**
 * Đóng dấu khám phá di tích vào Hộ chiếu
 */
export function checkInMonument(stt, monumentName, earnedXP = 100, note = '') {
  const active = getActivePassport();
  if (!active) return null;

  const all = getAllPassports();
  const code = active.code;
  const passport = all[code] || active;

  const isAlreadyVisited = !!passport.visitedMonuments[stt];
  const now = new Date();

  passport.visitedMonuments[stt] = {
    stt,
    name: monumentName,
    visitedAt: now.toISOString(),
    earnedXP: isAlreadyVisited ? (passport.visitedMonuments[stt].earnedXP || 100) : earnedXP,
    notes: note || passport.visitedMonuments[stt]?.notes || ''
  };

  if (!isAlreadyVisited) {
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

  return passport;
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
