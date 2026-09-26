// SEO, Dynamic Document Title, OpenGraph Meta, and Clean URL Slug Utility for 103 Monuments
import { allMonumentsList } from '../data/allMonumentsData';

// Vietnamese diacritics remover
export function removeDiacritics(str = '') {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd');
}

// Convert text to clean SEO slug
export function toSlug(str = '') {
  const noDiacritics = removeDiacritics(str);
  return noDiacritics
    .replace(/[^a-z0-9\s-]/g, ' ')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// Custom friendly short slugs map for popular / primary monuments
export const customShortSlugs = {
  1: 'dinh-doc-lap',
  2: 'dia-dao-cu-chi',
  3: 'di-tich-duong-ho-chi-minh-tren-bien-loc-an',
  4: 'nha-tu-con-dao',
  5: 'di-tich-chien-thang-binh-gia',
  6: 'khu-can-cu-minh-dam',
  7: 'can-cu-rung-sac',
  8: 'chien-khu-d',
  9: 'dia-dao-kim-long',
  10: 'dia-dao-phu-tho-hoa',
  11: 'dia-dao-tay-nam-tam-giac-sat',
  12: 'dia-diem-luu-niem-chu-tich-ton-duc-thang-ba-son',
  13: 'tru-so-uy-ban-nhan-dan-thanh-pho-ho-chi-minh',
  14: 'ben-nha-rong-bao-tang-ho-chi-minh',
  15: 'bao-tang-lich-su-thanh-pho-ho-chi-minh',
  16: 'bao-tang-my-thuat-thanh-pho-ho-chi-minh',
  17: 'nha-hat-thanh-pho',
  18: 'buu-dien-trung-tam-sai-gon',
  19: 'cho-ben-thanh',
  20: 'chua-ngoc-hoang-dien-ngoc-hoang',
  21: 'chua-giac-lam',
  22: 'chua-giac-vien',
  23: 'dinh-thong-tay-hoi',
  24: 'dinh-phu-nhuan',
  25: 'dinh-chi-hoa',
  26: 'dinh-tan-thoi-hiep',
  27: 'lang-ong-ba-chieu-le-van-duyet'
};

// Get clean canonical slug for a monument
export function getMonumentSlug(monument) {
  if (!monument) return 'di-tich';
  const stt = monument.stt;
  if (customShortSlugs[stt]) return customShortSlugs[stt];
  
  if (monument.slug) {
    // If the data already has a slug, sanitize it
    const clean = toSlug(monument.slug);
    if (clean) return clean;
  }
  
  const name = monument.info?.name || `di-tich-${stt}`;
  return toSlug(name);
}

// Get full clean URL path for a monument
export function getMonumentUrl(monument) {
  if (!monument) return '/';
  const slug = getMonumentSlug(monument);
  return `/di-tich/${slug}`;
}

// Find monument by slug, STT, or path param
export function findMonumentBySlugOrParam(param, list = allMonumentsList) {
  if (!param) return null;
  const cleanParam = toSlug(String(param).trim());

  // 1. Check numeric STT
  const numericStt = parseInt(cleanParam, 10);
  if (!isNaN(numericStt) && numericStt >= 1 && numericStt <= list.length) {
    const foundByNum = list.find(m => m.stt === numericStt);
    if (foundByNum) return foundByNum;
  }

  // 2. Check custom short slugs map
  for (const [stt, slug] of Object.entries(customShortSlugs)) {
    if (cleanParam === slug || cleanParam === `di-tich-${slug}`) {
      const found = list.find(m => m.stt === parseInt(stt, 10));
      if (found) return found;
    }
  }

  // 3. Exact match with monument slug or generated slug
  const exact = list.find(m => {
    const monSlug = getMonumentSlug(m);
    const rawSlug = toSlug(m.slug || '');
    return cleanParam === monSlug || cleanParam === rawSlug || cleanParam === `monument-${m.stt}`;
  });
  if (exact) return exact;

  // 4. Prefix / Substring match (e.g. "dinh-doc-lap" matches "dinh-doc-lap-noi-ghi-dau...")
  const partial = list.find(m => {
    const monSlug = getMonumentSlug(m);
    const rawSlug = toSlug(m.slug || '');
    const nameSlug = toSlug(m.info?.name || '');
    return monSlug.startsWith(cleanParam) || rawSlug.startsWith(cleanParam) || nameSlug.startsWith(cleanParam) ||
           cleanParam.startsWith(monSlug) || cleanParam.startsWith(rawSlug);
  });
  if (partial) return partial;

  return null;
}

// Parse Current Browser URL to determine active state (mode & STT)
export function parseCurrentUrl(list = allMonumentsList) {
  if (typeof window === 'undefined') {
    return { mode: 'home', stt: 1 };
  }

  const pathname = window.location.pathname || '';
  const hash = window.location.hash || '';
  const search = window.location.search || '';
  const params = new URLSearchParams(search);

  // 1. Check Journey / Profile path or hash
  if (
    pathname === '/so-do-hanh-trinh' || 
    pathname === '/hanh-trinh' || 
    pathname === '/journey' || 
    pathname === '/profile' ||
    hash === '#journey' || 
    hash === '#so-do-hanh-trinh' || 
    hash === '#hanh-trinh' || 
    hash === '#profile' ||
    params.get('view') === 'journey'
  ) {
    return { mode: 'journey', stt: 1 };
  }

  // 2. Check /di-tich/:slug in Pathname
  const pathMatch = pathname.match(/\/di-tich\/([^/?#]+)/i);
  if (pathMatch && pathMatch[1]) {
    const matchedMon = findMonumentBySlugOrParam(pathMatch[1], list);
    if (matchedMon) {
      return { mode: 'detail', stt: matchedMon.stt, monument: matchedMon };
    }
  }

  // 3. Check /di-tich/:slug in Hash (e.g. #/di-tich/dinh-doc-lap or #di-tich/dia-dao-cu-chi)
  const hashPathMatch = hash.match(/#\/?di-tich\/([^/?#]+)/i);
  if (hashPathMatch && hashPathMatch[1]) {
    const matchedMon = findMonumentBySlugOrParam(hashPathMatch[1], list);
    if (matchedMon) {
      return { mode: 'detail', stt: matchedMon.stt, monument: matchedMon };
    }
  }

  // 4. Check #monument-9 or #stt-9
  if (hash && (hash.includes('monument') || hash.includes('stt'))) {
    const match = hash.match(/\d+/);
    if (match) {
      const parsed = parseInt(match[0], 10);
      if (parsed >= 1 && parsed <= list.length) {
        return { mode: 'detail', stt: parsed };
      }
    }
  }

  // 5. Check Query Params (?stt=1 or ?slug=dinh-doc-lap)
  const sttParam = params.get('stt') || params.get('id');
  if (sttParam) {
    const parsed = parseInt(sttParam, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= list.length) {
      return { mode: 'detail', stt: parsed };
    }
  }
  const slugParam = params.get('slug');
  if (slugParam) {
    const matchedMon = findMonumentBySlugOrParam(slugParam, list);
    if (matchedMon) {
      return { mode: 'detail', stt: matchedMon.stt, monument: matchedMon };
    }
  }

  return { mode: 'home', stt: 1 };
}

// Update Document Title, Meta Description, and OpenGraph tags
export function updatePageMetadata({ mode = 'home', monument = null } = {}) {
  if (typeof document === 'undefined') return;

  let pageTitle = 'Số hóa 103 di tích quốc gia và di tích quốc gia đặc biệt trên địa bàn TP. Hồ Chí Minh | Di Sản Số TP.HCM';
  let pageDescription = 'Cổng thông tin và bản đồ số hóa 103 di tích lịch sử - văn hóa cấp quốc gia và cấp quốc gia đặc biệt tại TP. Hồ Chí Minh. Khám phá tọa độ GPS, thuyết minh âm thanh, video tư liệu, hình ảnh và sơ đồ hành trình.';
  let pageImage = '/assets/icons/di tích lịch sử.png';
  let pageUrl = typeof window !== 'undefined' ? window.location.href : '';

  if (mode === 'detail' && monument) {
    const name = monument.info?.name || `Di tích #${monument.stt}`;
    const ranking = monument.info?.ranking ? `(${monument.info.ranking})` : '';
    const address = monument.info?.address || 'TP. Hồ Chí Minh';
    
    pageTitle = `${name} ${ranking} - Di Sản Số TP.HCM`;
    
    // Overview snippet or fallback
    if (monument.info?.overview) {
      const cleanDesc = monument.info.overview.replace(/\s+/g, ' ').trim();
      pageDescription = cleanDesc.length > 200 ? cleanDesc.slice(0, 197) + '...' : cleanDesc;
    } else {
      pageDescription = `Khám phá di tích ${name} tại ${address}. Thông tin lịch sử, tư liệu khảo cứu, trắc nghiệm tương tác và thuyết minh đa phương tiện.`;
    }

    if (monument.info?.heroImage) {
      pageImage = monument.info.heroImage;
    } else if (monument.gallery?.[0]?.src) {
      pageImage = monument.gallery[0].src;
    }
  } else if (mode === 'journey') {
    pageTitle = 'Sơ Đồ Hành Trình Khám Phá 103 Di Tích TP.HCM | Di Sản Số TP.HCM';
    pageDescription = 'Lộ trình thám hiểm di sản theo từng chủ đề, bảng vàng thành tích, huy hiệu và hộ chiếu khám phá 103 di tích lịch sử - văn hóa TP.HCM.';
  }

  // 1. Update Title
  document.title = pageTitle;

  // 2. Helper to set or create meta tag
  const setMetaTag = (selector, attrName, attrVal, content) => {
    let el = document.querySelector(selector);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attrName, attrVal);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  // 3. Update Standard Meta
  setMetaTag('meta[name="description"]', 'name', 'description', pageDescription);
  setMetaTag('meta[name="title"]', 'name', 'title', pageTitle);

  // 4. Update OpenGraph (Facebook / Zalo / Messenger)
  setMetaTag('meta[property="og:title"]', 'property', 'og:title', pageTitle);
  setMetaTag('meta[property="og:description"]', 'property', 'og:description', pageDescription);
  setMetaTag('meta[property="og:image"]', 'property', 'og:image', pageImage);
  setMetaTag('meta[property="og:url"]', 'property', 'og:url', pageUrl);
  setMetaTag('meta[property="og:type"]', 'property', 'og:type', mode === 'detail' ? 'article' : 'website');

  // 5. Update Twitter Card
  setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
  setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', pageTitle);
  setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', pageDescription);
  setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', pageImage);

  // 6. Update Canonical Link
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', pageUrl);
}
