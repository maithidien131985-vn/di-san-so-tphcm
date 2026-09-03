// ==============================================================================
// STUDENT STORAGE & GAMIFIED HERITAGE PASSPORT DATA LAYER
// ==============================================================================

const STUDENT_PROFILE_KEY = 'di_san_so_student_profile_v1';
const STUDENT_EXPLORATION_KEY = 'di_san_so_student_exploration_v1';
const STUDENT_QUESTS_KEY = 'di_san_so_student_quests_v1';

export const AVATAR_OPTIONS = [
  { id: 'avatar_1', name: 'Nhà Thám Hiểm Trẻ', emoji: '🧭', bg: 'from-amber-400 to-amber-600' },
  { id: 'avatar_2', name: 'Mật Thám Lịch Sử', emoji: '🕵️', bg: 'from-rose-600 to-red-800' },
  { id: 'avatar_3', name: 'Chiến Sĩ Trẻ', emoji: '🎖️', bg: 'from-emerald-600 to-green-800' },
  { id: 'avatar_4', name: 'Học Sinh Thanh Lịch', emoji: '🧑‍🎓', bg: 'from-blue-600 to-indigo-800' },
  { id: 'avatar_5', name: 'Đoàn Viên Năng Động', emoji: '🌟', bg: 'from-red-500 to-rose-700' },
  { id: 'avatar_6', name: 'Nhà Khảo Cổ Nhí', emoji: '🏺', bg: 'from-yellow-600 to-amber-800' },
  { id: 'avatar_7', name: 'Thuyền Trưởng Biển Sâu', emoji: '⚓', bg: 'from-cyan-600 to-blue-800' },
  { id: 'avatar_8', name: 'Bậc Thầy Di Sản', emoji: '👑', bg: 'from-purple-600 to-amber-600' }
];

export const INITIAL_QUESTS = [
  // 1. Nhiệm vụ hằng ngày (Daily Quests)
  {
    id: 'daily_1',
    category: 'daily',
    categoryLabel: 'Nhiệm vụ hằng ngày',
    title: 'Khám phá 1 di tích hôm nay',
    description: 'Truy cập và xem chi tiết ít nhất 1 di tích lịch sử trong ngày',
    target: 1,
    current: 1,
    rewardXP: 50,
    isCompleted: false,
    isClaimed: false,
    icon: '⚡'
  },
  {
    id: 'daily_2',
    category: 'daily',
    categoryLabel: 'Nhiệm vụ hằng ngày',
    title: 'Lắng nghe 1 đoạn Audio thuyết minh',
    description: 'Mở và nghe phần thuyết minh giọng đọc của bất kỳ di tích nào',
    target: 1,
    current: 1,
    rewardXP: 50,
    isCompleted: false,
    isClaimed: false,
    icon: '🎧'
  },
  {
    id: 'daily_3',
    category: 'daily',
    categoryLabel: 'Nhiệm vụ hằng ngày',
    title: 'Hỏi đáp với Trợ Lý Di Sản AI',
    description: 'Đặt ít nhất 1 câu hỏi tìm hiểu lịch sử với Trợ Lý Di Sản AI',
    target: 1,
    current: 1,
    rewardXP: 40,
    isCompleted: false,
    isClaimed: false,
    icon: '🤖'
  },

  // 2. Nhiệm vụ theo di tích (Monument Quests)
  {
    id: 'monument_1',
    category: 'monument',
    categoryLabel: 'Nhiệm vụ theo di tích',
    title: 'Giải mã Dinh Độc Lập (#1)',
    description: 'Hoàn thành thử thách giải mã bí ẩn tại Di tích Dinh Độc Lập',
    target: 1,
    current: 1,
    rewardXP: 100,
    isCompleted: true,
    isClaimed: true,
    icon: '🏛️'
  },
  {
    id: 'monument_2',
    category: 'monument',
    categoryLabel: 'Nhiệm vụ theo di tích',
    title: 'Chinh phục Địa đạo Củ Chi (#2)',
    description: 'Khám phá hệ thống hầm ngầm huyền thoại tại Địa đạo Củ Chi',
    target: 1,
    current: 1,
    rewardXP: 100,
    isCompleted: true,
    isClaimed: true,
    icon: '⚔️'
  },
  {
    id: 'monument_3',
    category: 'monument',
    categoryLabel: 'Nhiệm vụ theo di tích',
    title: 'Khám phá Bến Lộc An & Tàu Không Số (#3)',
    description: 'Tìm hiểu đường Hồ Chí Minh trên biển tại Bến Lộc An',
    target: 1,
    current: 1,
    rewardXP: 100,
    isCompleted: true,
    isClaimed: false,
    icon: '🌊'
  },

  // 3. Nhiệm vụ theo chủ đề (Thematic Quests)
  {
    id: 'topic_1',
    category: 'topic',
    categoryLabel: 'Nhiệm vụ theo chủ đề',
    title: 'Khám phá 3 di tích Kháng chiến',
    description: 'Hoàn thành 3 di tích thuộc chủ đề Chiến tích Kháng chiến & Địa đạo',
    target: 3,
    current: 3,
    rewardXP: 150,
    isCompleted: true,
    isClaimed: false,
    icon: '🔥'
  },
  {
    id: 'topic_2',
    category: 'topic',
    categoryLabel: 'Nhiệm vụ theo chủ đề',
    title: 'Khám phá 2 ngôi Chùa & Hội quán cổ',
    description: 'Tìm hiểu 2 di tích thuộc chủ đề Kiến trúc Phật giáo & Đình làng Nam Bộ',
    target: 2,
    current: 1,
    rewardXP: 120,
    isCompleted: false,
    isClaimed: false,
    icon: '🏮'
  },

  // 4. Nhiệm vụ theo khu vực (Regional Quests)
  {
    id: 'region_1',
    category: 'region',
    categoryLabel: 'Nhiệm vụ theo khu vực',
    title: 'Chinh phục 2 di tích Cần Giờ & Côn Đảo',
    description: 'Khám phá các di tích tại Chiến khu Rừng Sác hoặc Nhà tù Côn Đảo',
    target: 2,
    current: 2,
    rewardXP: 160,
    isCompleted: true,
    isClaimed: false,
    icon: '🏝️'
  },
  {
    id: 'region_2',
    category: 'region',
    categoryLabel: 'Nhiệm vụ theo khu vực',
    title: 'Thám hiểm 3 di tích tại Quận 1 & Trung tâm',
    description: 'Hoàn thành 3 di tích lịch sử nằm tại khu vực trung tâm Sài Gòn',
    target: 3,
    current: 2,
    rewardXP: 150,
    isCompleted: false,
    isClaimed: false,
    icon: '📍'
  },

  // 5. Nhiệm vụ đặc biệt (Special & Weekly Quests)
  {
    id: 'special_1',
    category: 'special',
    categoryLabel: 'Nhiệm vụ đặc biệt tuần',
    title: 'Khám phá 2 di tích trong tuần',
    description: 'Hoàn thành ít nhất 2 cuộc thám hiểm di tích mới trong tuần này',
    target: 2,
    current: 2,
    rewardXP: 200,
    isCompleted: true,
    isClaimed: false,
    icon: '🌟'
  },
  {
    id: 'special_2',
    category: 'special',
    categoryLabel: 'Nhiệm vụ đặc biệt tuần',
    title: 'Nghe 3 bài Audio thuyết minh',
    description: 'Lắng nghe trọn vẹn 3 đoạn thuyết minh âm thanh để tích lũy kiến thức',
    target: 3,
    current: 3,
    rewardXP: 180,
    isCompleted: true,
    isClaimed: false,
    icon: '🎙️'
  },
  {
    id: 'special_3',
    category: 'special',
    categoryLabel: 'Nhiệm vụ đặc biệt tuần',
    title: 'Hoàn thành 5 câu hỏi giải mã di sản',
    description: 'Trả lời đúng 5 câu hỏi manh mối trong trò chơi tương tác',
    target: 5,
    current: 5,
    rewardXP: 250,
    isCompleted: true,
    isClaimed: false,
    icon: '🏆'
  }
];

export const DEFAULT_STUDENT_PROFILE = {
  isLoggedIn: true,
  name: 'Nguyễn Hoàng Nam',
  school: 'Trường THCS Nguyễn Du',
  className: 'Lớp 9A1',
  classCode: 'ND9A1-2026',
  avatarId: 'avatar_1',
  joinedDate: '2026-08-15',
  bio: 'Nhà thám hiểm di sản trẻ đam mê tìm hiểu lịch sử Sài Gòn - TP.HCM'
};

export const INITIAL_EXPLORATION_DATA = {
  // Danh sách các di tích đã khám phá (kèm thời gian & điểm)
  exploredMonuments: [
    { stt: 1, name: 'Di tích Lịch sử Dinh Độc Lập', completedAt: '2026-08-16T08:30:00Z', score: 100 },
    { stt: 2, name: 'Di tích Lịch sử Địa đạo Củ Chi', completedAt: '2026-08-18T14:15:00Z', score: 100 },
    { stt: 3, name: 'Di tích lịch sử đường Hồ Chí Minh trên biển (Bến Lộc An)', completedAt: '2026-08-20T09:45:00Z', score: 100 },
    { stt: 4, name: 'Di tích lịch sử Nhà tù Côn Đảo', completedAt: '2026-08-22T16:20:00Z', score: 100 },
    { stt: 7, name: 'Di tích lịch sử Căn cứ Rừng Sác (Cần Giờ)', completedAt: '2026-08-25T11:10:00Z', score: 100 },
    { stt: 8, name: 'Di tích lịch sử Địa đạo Tam Giác Sắt', completedAt: '2026-08-28T15:00:00Z', score: 100 },
    { stt: 10, name: 'Chùa Giác Lâm (Cẩm Đệm Tự)', completedAt: '2026-08-30T10:30:00Z', score: 100 }
  ],
  totalXP: 1450,
  unlockedBadges: [
    { id: 'badge_first', title: 'Bước Chân Đầu Tiên', icon: '🧭', date: '16/08/2026' },
    { id: 'badge_cu_chi', title: 'Người Hùng Địa Đạo', icon: '⚔️', date: '18/08/2026' },
    { id: 'badge_sea_route', title: 'Thủy Thủ Tàu Không Số', icon: '🌊', date: '20/08/2026' },
    { id: 'badge_master', title: 'Nhà Thám Hiểm Xuất Sắc', icon: '🎖️', date: '30/08/2026' }
  ]
};

// Calculate Level based on XP
export function calculateLevel(xp) {
  if (xp < 300) return { level: 1, title: 'Tập Sự Di Sản', nextXP: 300, currentLevelXP: 0 };
  if (xp < 800) return { level: 2, title: 'Nhà Thám Hiểm Nhí', nextXP: 800, currentLevelXP: 300 };
  if (xp < 1500) return { level: 3, title: 'Thám Tử Lịch Sử', nextXP: 1500, currentLevelXP: 800 };
  if (xp < 2500) return { level: 4, title: 'Chuyên Gia Di Sản', nextXP: 2500, currentLevelXP: 1500 };
  if (xp < 4000) return { level: 5, title: 'Đại Sứ Di Sản Số', nextXP: 4000, currentLevelXP: 2500 };
  return { level: 6, title: 'Bậc Thầy Di Sản Hoàng Gia', nextXP: 10000, currentLevelXP: 4000 };
}

// Get Student Profile
export function getStudentProfile() {
  if (typeof window === 'undefined') return DEFAULT_STUDENT_PROFILE;
  try {
    const data = localStorage.getItem(STUDENT_PROFILE_KEY);
    return data ? JSON.parse(data) : DEFAULT_STUDENT_PROFILE;
  } catch (e) {
    return DEFAULT_STUDENT_PROFILE;
  }
}

// Save Student Profile
export function saveStudentProfile(profile) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STUDENT_PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.warn('Failed to save student profile:', e);
  }
}

// Get Exploration Data
export function getExplorationData() {
  if (typeof window === 'undefined') return INITIAL_EXPLORATION_DATA;
  try {
    const data = localStorage.getItem(STUDENT_EXPLORATION_KEY);
    return data ? JSON.parse(data) : INITIAL_EXPLORATION_DATA;
  } catch (e) {
    return INITIAL_EXPLORATION_DATA;
  }
}

// Save Exploration Data
export function saveExplorationData(data) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STUDENT_EXPLORATION_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Failed to save exploration data:', e);
  }
}

// Mark Monument as Explored / Completed
export function markMonumentAsExplored(monumentStt, monumentName, earnedScore = 100) {
  const current = getExplorationData();
  const exists = current.exploredMonuments.some(m => m.stt === monumentStt);

  const newExplored = exists
    ? current.exploredMonuments
    : [
        ...current.exploredMonuments,
        {
          stt: monumentStt,
          name: monumentName,
          completedAt: new Date().toISOString(),
          score: earnedScore
        }
      ];

  const newXP = current.totalXP + (exists ? 20 : earnedScore);

  const updated = {
    ...current,
    exploredMonuments: newExplored,
    totalXP: newXP
  };

  saveExplorationData(updated);
  return updated;
}

// Get Quests
export function getStudentQuests() {
  if (typeof window === 'undefined') return INITIAL_QUESTS;
  try {
    const data = localStorage.getItem(STUDENT_QUESTS_KEY);
    return data ? JSON.parse(data) : INITIAL_QUESTS;
  } catch (e) {
    return INITIAL_QUESTS;
  }
}

// Save Quests
export function saveStudentQuests(quests) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STUDENT_QUESTS_KEY, JSON.stringify(quests));
  } catch (e) {
    console.warn('Failed to save student quests:', e);
  }
}

// Claim Quest Reward
export function claimQuestReward(questId) {
  const quests = getStudentQuests();
  const quest = quests.find(q => q.id === questId);
  if (!quest || quest.isClaimed || !quest.isCompleted) return { success: false };

  const updatedQuests = quests.map(q => 
    q.id === questId ? { ...q, isClaimed: true } : q
  );
  saveStudentQuests(updatedQuests);

  // Add XP to exploration
  const exploration = getExplorationData();
  const updatedExploration = {
    ...exploration,
    totalXP: exploration.totalXP + quest.rewardXP
  };
  saveExplorationData(updatedExploration);

  return { success: true, rewardXP: quest.rewardXP, updatedExploration, updatedQuests };
}
