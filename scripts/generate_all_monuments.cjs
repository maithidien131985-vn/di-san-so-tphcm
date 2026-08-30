const fs = require('fs');
const path = require('path');

function parseCSV(text) {
  const p = [];
  let row = [''];
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i+1];
    if (c === '"') {
      if (inQuotes && next === '"') {
        row[row.length - 1] += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      row.push('');
    } else if ((c === '\r' || c === '\n') && !inQuotes) {
      if (c === '\r' && next === '\n') i++;
      p.push(row);
      row = [''];
    } else {
      row[row.length - 1] += c;
    }
  }
  if (row.length > 1 || (row.length === 1 && row[0] !== '')) p.push(row);
  return p;
}

function cleanStr(str) {
  if (!str) return '';
  return str.trim().replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/^[ \t]+/gm, '');
}

function createSlug(str) {
  if (!str) return 'di-tich';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function parseCoordinates(coordStr) {
  if (!coordStr) return [10.7769, 106.7009];
  const parts = coordStr.split(',').map(s => parseFloat(s.trim()));
  if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return [parts[0], parts[1]];
  }
  return [10.7769, 106.7009];
}

function getFallbackImage(type, name, stt) {
  const images = [
    '/assets/images/dinh-doc-lap-front.jpg',
    '/assets/images/dia-dao-cu-chi.jpg',
    '/assets/images/ben-nha-rong.jpg',
    '/assets/images/dia-dao-long-phuoc.jpg',
    '/assets/images/xe-tang-390-cong-dinh.jpg',
    '/assets/images/so-do-kien-truc.jpg',
    '/assets/images/may-danh-chu-hien-vat.jpg'
  ];
  return images[(stt - 1) % images.length];
}

function extractYoutubeId(url) {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : null;
}

// 1. Read main data sheet
const csvText = fs.readFileSync(path.join(__dirname, '../google_sheet_data.csv'), 'utf8');
const rows = parseCSV(csvText);
const dataRows = rows.slice(1).filter(r => r[0] && r[0].trim() && !isNaN(parseInt(r[0].trim())));

// 2. Read exact coordinates sheet
const coordsCsvText = fs.readFileSync(path.join(__dirname, '../coordinates_sheet.csv'), 'utf8');
const coordRows = parseCSV(coordsCsvText);
const coordDataRows = coordRows.slice(1).filter(r => r[0] && r[0].trim());

// 3. Read 3 docs text
const d1 = fs.readFileSync(path.join(__dirname, '../doc1.txt'), 'utf8');
const d2 = fs.readFileSync(path.join(__dirname, '../doc2.txt'), 'utf8');
const d3 = fs.readFileSync(path.join(__dirname, '../doc3.txt'), 'utf8');

// Specialized tailored investigation question & 5-question quiz for key monuments from doc1, doc2, doc3
function buildInvestigationForMonument(stt, name, type, ranking, address, decision, overview, events, figures, artifacts) {
  // Generate dedicated, customized investigation questions based on monument
  let investigationQuestion = '';
  let suggestedAnswer = '';
  let investigationTopic = '';

  if (stt === 1) {
    investigationTopic = 'Dấu ấn ngày toàn thắng 30–4–1975 & Hội nghị Hiệp thương';
    investigationQuestion = `Vì sao Dinh Độc Lập trở thành biểu tượng toàn thắng của Chiến dịch Hồ Chí Minh lịch sử trưa ngày 30–4–1975 và vai trò của Hội nghị Hiệp thương thống nhất đất nước tại đây?`;
    suggestedAnswer = `Trưa 30/4/1975, xe tăng 390 và 843 tiến vào húc đổ cổng Dinh Độc Lập, cờ Mặt trận Dân tộc Giải phóng tung bay trên nóc Dinh lúc 11h30, Tổng thống Dương Văn Minh tuyên bố đầu hàng vô điều kiện, kết thúc 21 năm kháng chiến chống Mỹ. Tháng 11-12/1975, Hội nghị Hiệp thương tại Dinh quyết định tổng tuyển cử bầu Quốc hội thống nhất non sông.`;
  } else if (stt === 2) {
    investigationTopic = 'Kỳ quan nghệ thuật quân sự Địa đạo Củ Chi';
    investigationQuestion = `Hệ thống Địa đạo Củ Chi với hơn 200km đường hầm 3 tầng, bếp Hoàng Cầm và 500km chiến hào đã giúp quân dân bám trụ, đánh bại các trận càn Crimp, Cedar Falls như thế nào?`;
    suggestedAnswer = `Địa đạo Củ Chi là công trình quân sự dưới lòng đất độc nhất vô nhị gồm 3 tầng ngầm (tầng 1: 3m, tầng 2: 5-8m, tầng 3: 8-12m) đào trong đất sét pha đá ong. Nhờ hệ thống hầm ngầm liên hoàn kết hợp hầm chông, bãi mìn và bếp Hoàng Cầm giấu khói, quân dân Củ Chi đã kiên cường đánh bại hàng ngàn trận càn quét khốc liệt của địch bằng 3 mũi giáp công.`;
  } else if (stt === 3) {
    investigationTopic = 'Huyền thoại Đoàn tàu Không số & Bến Lộc An';
    investigationQuestion = `Bến Lộc An (Đường Hồ Chí Minh trên biển) đã hoàn thành xuất sắc sứ mệnh tiếp nhận vũ khí bí mật chi viện cho chiến trường miền Đông Nam Bộ như thế nào?`;
    suggestedAnswer = `Bến Lộc An là một trong những bến tiếp nhận vũ khí đặc biệt quan trọng của Đường Hồ Chí Minh trên biển. Cán bộ, chiến sĩ và nhân dân đã bí mật bảo vệ vùng bến, tiếp nhận các chuyến tàu chở hàng chục tấn vũ khí từ miền Bắc vào chi viện kịp thời cho Chiến dịch Bình Giã và các chiến trường miền Đông Nam Bộ.`;
  } else if (stt === 4) {
    investigationTopic = 'Trường học Cách mạng kiên trung tại Nhà tù Côn Đảo';
    investigationQuestion = `Các chiến sĩ cách mạng bị giam cầm tại Nhà tù Côn Đảo (chuồng cọp, chuồng bò) đã biến 'địa ngục trần gian' thành trường học cách mạng và giữ vững khí tiết kiên trung ra sao?`;
    suggestedAnswer = `Dù phải chịu đựng chế độ lao dịch và tra tấn dã man trong hệ thống chuồng cọp, chuồng bò, các chiến sĩ cách mạng tại Côn Đảo đã kiên cường tổ chức chi bộ Đảng, dạy văn hóa, lý luận chính trị, biến nhà tù đế quốc thành trường học cách mạng tôi luyện ý chí và niềm tin tất thắng.`;
  } else if (stt === 5) {
    investigationTopic = 'Bước ngoặt Chiến dịch Bình Giã (1964 - 1965)';
    investigationQuestion = `Chiến thắng Bình Giã đã đánh bại chiến thuật 'trực thăng vận' và 'thiết xa vận', góp phần làm phá sản chiến lược 'Chiến tranh đặc biệt' của Mỹ như thế nào?`;
    suggestedAnswer = `Chiến dịch Bình Giã (2/12/1964 - 3/1/1965) là chiến dịch tiến công cấp sư đoàn đầu tiên của Quân Giải phóng miền Nam. Bằng nghệ thuật tạo thế nhử địch rời công sự rồi bất ngờ bao vây tiến công, ta đã tiêu diệt nhiều tiểu đoàn sừng sỏ và chi đoàn thiết giáp M113, làm thất bại về cơ bản chiến lược Chiến tranh đặc biệt của địch.`;
  } else if (stt === 6) {
    investigationTopic = 'Căn cứ Minh Đạm & Tình quân dân gắn kết';
    investigationQuestion = `Thế địa tự nhiên hơn 300 hang đá tại dãy núi Châu Long - Châu Viên và sự che chở của nhân dân đã giúp Căn cứ Minh Đạm đứng vững qua hai cuộc kháng chiến ra sao?`;
    suggestedAnswer = `Căn cứ Minh Đạm mang tên hai liệt sĩ Bùi Công Minh và Mạc Thanh Đạm. Dãy núi đá hoa cương hiểm trở với hơn 300 hang đá tự nhiên (hang Huyện ủy, Huyện đội, Quân y) kết hợp với sự tiếp tế lương thực, bảo bọc giữ bí mật của nhân dân vùng ven đã tạo nên sức mạnh 'thế đất và lòng dân' vững như pháo đài.`;
  } else if (stt === 7) {
    investigationTopic = 'Đoàn 10 Đặc công Rừng Sác - Pháo đài xanh';
    investigationQuestion = `Đoàn 10 Đặc công Rừng Sác đã khắc phục khó khăn thiên nhiên và dùng chiến thuật đặc công thủy luồn sâu đánh chìm tàu chiến, tập kích kho xăng Nhà Bè như thế nào?`;
    suggestedAnswer = `Đoàn 10 Đặc công Rừng Sác bám trụ giữa rừng ngập mặn Cần Giờ đầy sình lầy và thiếu nước ngọt. Nắm chắc quy luật thủy triều, các chiến sĩ bí mật luồn sâu thả thủy lôi, đánh gần 600 trận, phá hủy nhiều tàu chiến trên sông Lòng Tàu và thiêu rụi kho xăng dầu Nhà Bè, khống chế yết hầu đường thủy của địch.`;
  } else if (stt === 56) {
    investigationTopic = 'Dấu ấn lịch sử Bạch Dinh (Villa Blanche)';
    investigationQuestion = `Bạch Dinh trên sườn Núi Lớn đã ghi dấu sự kiện giam lỏng vua yêu nước Thành Thái và mang những giá trị nghệ thuật kiến trúc châu Âu cuối thế kỷ 19 nào?`;
    suggestedAnswer = `Bạch Dinh (Villa Blanche) xây dựng từ 1898-1902 theo phong cách kiến trúc châu Âu gồm 3 tầng với rèm hoa văn đắp nổi gốm sứ. Đây từng là nơi thực dân Pháp quản thúc vua yêu nước Thành Thái (1907-1916). Nơi đây hiện lưu giữ bộ sưu tập súng thần công và cổ vật gốm sứ thời Khang Hy trục vớt từ tàu cổ Hòn Cau - Côn Đảo.`;
  } else if (stt === 57) {
    investigationTopic = 'Bảo tàng Lịch sử TP.HCM & Phong cách Đông Dương';
    investigationQuestion = `Công trình Bảo tàng Lịch sử TP.HCM (KTS Auguste Delaval) đã kết hợp nghệ thuật kiến trúc phương Đông với kỹ thuật phương Tây và lưu giữ những báu vật di sản nào?`;
    suggestedAnswer = `Khởi dựng năm 1927 theo phong cách kiến trúc Đông Dương, bảo tàng có tháp bát giác mái ngói cong chồng diềm và hành lang rộng xử lý khí hậu nhiệt đới. Hiện bảo tàng lưu giữ hơn 36.000 hiện vật quý giá từ thời tiền sử, văn hóa Đông Sơn, Óc Eo, Champa đến xác ướp Xóm Cải độc bản.`;
  } else if (stt === 58) {
    investigationTopic = 'Lịch sử Bảo tàng TP.HCM & Dinh Gia Long';
    investigationQuestion = `Tòa nhà Bảo tàng TP.HCM (Dinh Gia Long, KTS Foulhoux) đã chứng kiến cuộc biểu tình của học sinh Trần Văn Ơn 1950 và các mốc lịch sử cách mạng như thế nào?`;
    suggestedAnswer = `Xây dựng năm 1885-1890, tòa nhà từng là Dinh Thống đốc Nam Kỳ, Dinh Khâm sai và Dinh Gia Long. Ngày 9/1/1950, hơn 2.000 học sinh sinh viên biểu tình trước dinh và anh Trần Văn Ơn hy sinh. Dinh có hệ thống hầm trú ẩn ngầm do KTS Ngô Viết Thụ thiết kế sau vụ ném bom 1962.`;
  } else if (stt === 59 || stt === 60) {
    investigationTopic = `Nghệ thuật chạm khắc gỗ và cổ tự Phật giáo Nam Bộ`;
    investigationQuestion = `Nghệ thuật chạm khắc gỗ bao lam lộng hai mặt và hệ thống tượng Phật cổ bằng gỗ mít tại ${name} thể hiện bản sắc văn hóa dân gian Nam Bộ ra sao?`;
    suggestedAnswer = `Ngôi cổ tự lưu giữ hệ thống bao lam chạm trổ tinh xảo với các đề tài dân gian Nam Bộ (chim muông, hoa lá, con vật gần gũi như trâu, bò, chim diệc) và hàng trăm pho tượng Phật cổ bằng gỗ mít thếp vàng, từng là cơ sở nuôi giấu cán bộ cách mạng kiên trung trong hai cuộc kháng chiến.`;
  } else {
    investigationTopic = `Giá trị lịch sử & Ý nghĩa văn hóa của ${name}`;
    investigationQuestion = `Di tích ${name} tại ${address} mang những giá trị lịch sử, nhân vật tiêu biểu hoặc dấu ấn văn hóa cách mạng nào cần được thế hệ trẻ gìn giữ?`;
    suggestedAnswer = `Di tích ${name} là ${type.toLowerCase()} được xếp hạng cấp ${ranking.toLowerCase()} (${decision || 'theo quy định của Nhà nước'}). Nơi đây ghi dấu các sự kiện lịch sử: ${events.slice(0, 200)}..., gắn liền với công lao của ${figures.slice(0, 150)}... và hệ thống hiện vật ${artifacts.slice(0, 150)}..., là địa chỉ đỏ giáo dục truyền thống yêu nước sâu sắc.`;
  }

  // Build 5 tailored, diverse questions for the Badge Challenge
  const quiz = [
    {
      id: 1,
      type: 'multiple_choice',
      category: 'Lịch sử & Sự kiện',
      question: `Sự kiện lịch sử tiêu biểu nhất gắn liền với di tích "${name}" là gì?`,
      options: [
        events.length > 15 && events !== 'Chưa bổ sung' ? events.slice(0, 90) + (events.length > 90 ? '...' : '') : `Ghi dấu những mốc son cách mạng và giá trị văn hóa tiêu biểu tại ${address}`,
        'Một cuộc triển lãm thương mại quốc tế tạm thời vào thế kỷ 21',
        'Công trình xây dựng phục vụ du lịch sinh thái thuần túy',
        'Địa điểm diễn ra lễ hội ẩm thực định kỳ hàng năm'
      ],
      correctIndex: 0,
      explanation: `Di tích ${name} ghi dấu sự kiện: ${events !== 'Chưa bổ sung' ? events : overview.slice(0, 180)}.`
    },
    {
      id: 2,
      type: 'multiple_choice',
      category: 'Nhân vật & Hiện vật',
      question: `Nhân vật lịch sử hoặc hiện vật tiêu biểu gắn bó sâu sắc với di tích "${name}" là ai/cái gì?`,
      options: [
        figures.length > 15 && figures !== 'Chưa bổ sung' ? figures.slice(0, 80) + '...' : `Các anh hùng liệt sĩ, đồng bào và hiện vật: ${artifacts.slice(0, 60)}...`,
        'Các thương gia châu Âu vào thế kỷ 15',
        'Các nhà thám hiểm Bắc Cực',
        'Một vị tướng thời cổ đại La Mã'
      ],
      correctIndex: 0,
      explanation: `Nhân vật và hiện vật tiêu biểu tại di tích: ${figures} - Hiện vật: ${artifacts}.`
    },
    {
      id: 3,
      type: 'true_false',
      category: 'Xếp hạng & Pháp lý',
      question: `Nhận định sau đây về di tích "${name}" là ĐÚNG hay SAI: "Di tích đã được xếp hạng là ${ranking} (${type}) theo quy định của Nhà nước nhằm bảo tồn di sản cho muôn đời sau"?`,
      options: [
        `ĐÚNG - Di tích được công nhận xếp hạng cấp ${ranking}`,
        `SAI - Di tích này chưa từng được xếp hạng công nhận`,
        `SAI - Di tích này không thuộc hệ thống di sản Việt Nam`,
        `SAI - Di tích đã bị xóa bỏ hoàn toàn trong quy hoạch`
      ],
      correctIndex: 0,
      explanation: `Nhận định trên là hoàn toàn chính xác. ${name} được xếp hạng cấp ${ranking} ${decision ? 'theo ' + decision : ''}.`
    },
    {
      id: 4,
      type: 'scenario_clue',
      category: 'Bí ẩn & Tình huống thực địa',
      question: `Khi đến khảo sát thực địa tại di tích "${name}", phát hiện nào sau đây phản ánh chính xác nhất về không gian và cảnh quan của di tích?`,
      options: [
        `Tọa lạc tại địa chỉ: ${address}, lưu giữ các dấu tích kiến trúc, hiện vật và không gian lịch sử nguyên bản`,
        'Công trình đã bị chuyển đổi hoàn toàn thành trung tâm thương mại cao ốc hiện đại',
        'Di tích nằm ở vùng hải đảo xa xôi ngoài lãnh thổ Việt Nam',
        'Chỉ là một mô hình thu nhỏ được dựng lại trong công viên giải trí'
      ],
      correctIndex: 0,
      explanation: `Vị trí chính xác của di tích nằm tại ${address}, nơi còn lưu giữ nguyên vẹn giá trị lịch sử và hiện vật tiêu biểu.`
    },
    {
      id: 5,
      type: 'matching_challenge',
      category: 'Ý nghĩa & Trách nhiệm',
      question: `Ý nghĩa giáo dục và trách nhiệm lớn nhất của thế hệ trẻ hôm nay đối với di tích "${name}" là gì?`,
      options: [
        'Tìm hiểu lịch sử, bảo vệ cảnh quan hiện vật nguyên gốc và tích cực quảng bá giá trị di sản số của dân tộc',
        'Tùy tiện khắc tên, vẽ bậy lên các bức tường và công trình di tích',
        'Mang các hiện vật cổ quý giá tại di tích về nhà làm kỷ niệm riêng',
        'Chia sẻ những thông tin lịch sử sai lệch, chưa được kiểm chứng lên mạng xã hội'
      ],
      correctIndex: 0,
      explanation: `Thế hệ trẻ cần có ý thức tôn trọng, gìn giữ hiện vật, không xâm hại di tích và tích cực học tập, lan tỏa niềm tự hào dân tộc.`
    }
  ];

  return {
    title: `Hồ sơ điều tra: ${name}`,
    subtitle: `Khảo sát chứng cứ lịch sử, giải mã tư liệu và trả lời câu hỏi điều tra tại ${address}.`,
    investigationTopic: investigationTopic,
    investigationQuestion: investigationQuestion,
    suggestedAnswer: suggestedAnswer,
    dossiers: [
      {
        id: 'events',
        title: 'Hồ sơ 01: Sự kiện lịch sử',
        subtitle: events.length > 100 ? events.slice(0, 100) + '...' : events,
        image: getFallbackImage(type, name, stt),
        detail: events !== 'Chưa bổ sung' ? events : overview,
        clues: [
          `Mốc sự kiện tiêu biểu tại ${name}`,
          `Địa chỉ diễn ra: ${address}`,
          `Cấp xếp hạng công nhận: ${ranking}`
        ]
      },
      {
        id: 'figures',
        title: 'Hồ sơ 02: Nhân vật & Nhân chứng',
        subtitle: figures.length > 100 ? figures.slice(0, 100) + '...' : figures,
        image: getFallbackImage(type, name, stt + 1),
        detail: figures !== 'Chưa bổ sung' ? figures : 'Ghi nhận công lao của các đồng bào, chiến sĩ và cán bộ cách mạng kiên trung.',
        clues: [
          `Nhân vật lịch sử tiêu biểu gắn liền với di tích`,
          `Công lao và dấu ấn trong lịch sử đấu tranh`,
          `Gương sáng anh dũng cho các thế hệ mai sau`
        ]
      },
      {
        id: 'artifacts',
        title: 'Hồ sơ 03: Hiện vật & Kiến trúc',
        subtitle: artifacts.length > 100 ? artifacts.slice(0, 100) + '...' : artifacts,
        image: getFallbackImage(type, name, stt + 2),
        detail: artifacts !== 'Chưa bổ sung' ? artifacts : 'Các hiện vật lịch sử, công trình kiến trúc và tư liệu khảo cổ nguyên bản.',
        clues: [
          `Hệ thống hiện vật và dấu tích nguyên bản`,
          `Giá trị khảo sát & nghiên cứu lịch sử`,
          `Chứng nhân thời gian cần được gìn giữ và bảo tồn`
        ]
      }
    ],
    quiz: quiz
  };
}

console.log(`Processing ${dataRows.length} monuments with tailored investigations and 5-question quizzes...`);

const monuments = dataRows.map((r, idx) => {
  const stt = parseInt(r[0].trim());
  const note = cleanStr(r[1]);
  let rawName = cleanStr(r[2]);
  const name = rawName.replace(/\n+/g, ' ').replace(/\s+/g, ' ');
  const type = cleanStr(r[3]) || 'Lịch sử';
  const ranking = cleanStr(r[4]) || 'Quốc gia';
  const decision = cleanStr(r[5]);
  const addressOld = cleanStr(r[6]);
  const addressNew = cleanStr(r[7]);
  const address = addressNew || addressOld || 'TP. Hồ Chí Minh';
  
  // Coordinates
  let coordStr = '';
  if (coordDataRows[idx] && coordDataRows[idx][1]) {
    coordStr = cleanStr(coordDataRows[idx][1]);
  } else {
    coordStr = cleanStr(r[8]);
  }
  const coords = parseCoordinates(coordStr);
  
  let rawImage = cleanStr(r[9]);
  const hasCustomImage = rawImage && rawImage !== 'Chưa bổ sung' && (rawImage.startsWith('http') || rawImage.startsWith('/'));
  let heroImage = hasCustomImage ? rawImage : getFallbackImage(type, name, stt);
  
  const videoUrl = cleanStr(r[10]);
  const youtubeId = extractYoutubeId(videoUrl) || (stt === 1 ? 'cplxidwCHyE' : null);

  const overview = cleanStr(r[11]) || `Di tích ${name} là một trong những công trình di sản văn hóa, lịch sử tiêu biểu tại Thành phố Hồ Chí Minh, mang đậm dấu ấn hào hùng và giá trị kiến trúc trường tồn theo thời gian.`;
  const figures = cleanStr(r[12]) || 'Các anh hùng liệt sĩ, đồng bào và chiến sĩ đã chiến đấu, hy sinh bảo vệ quê hương đất nước.';
  const artifacts = cleanStr(r[13]) || 'Các hiện vật lịch sử, công trình kiến trúc và tư liệu khảo cổ nguyên bản.';
  const events = cleanStr(r[14]) || `Các sự kiện lịch sử gắn liền với quá trình hình thành và phát triển của ${name}.`;
  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${coords[0]},${coords[1]}`;
  const googleMapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${coords[0]},${coords[1]}`;
  const references = cleanStr(r[16]) || 'Hồ sơ khoa học di tích - Sở Văn hóa và Thể thao TP.HCM.';

  const investigationObj = buildInvestigationForMonument(stt, name, type, ranking, address, decision, overview, events, figures, artifacts);

  // Audio transcript
  const audioScript = [
    {
      index: 1,
      title: `1. Tổng quan & Vị trí di tích ${name}`,
      text: `${name} tọa lạc tại địa chỉ ${address} (Tọa độ: ${coords[0]}, ${coords[1]}). Đây là ${type.toLowerCase()} được xếp hạng cấp ${ranking.toLowerCase()}, ${decision ? 'theo ' + decision : 'lưu giữ nhiều giá trị văn hóa lịch sử quý báu của dân tộc'}.`
    },
    {
      index: 2,
      title: `2. Giá trị lịch sử & Ý nghĩa văn hóa`,
      text: overview.length > 500 ? overview.slice(0, 500) + '...' : overview
    },
    {
      index: 3,
      title: `3. Sự kiện lịch sử tiêu biểu`,
      text: events !== 'Chưa bổ sung' ? events : `Nơi đây ghi dấu nhiều mốc son hào hùng trong tiến trình đấu tranh cách mạng và xây dựng bảo vệ Tổ quốc.`
    },
    {
      index: 4,
      title: `4. Nhân vật & Hiện vật liên quan`,
      text: `Di tích gắn liền với ${figures}. Cùng với đó là hệ thống hiện vật tiêu biểu: ${artifacts}.`
    }
  ];

  // Timeline
  const timeline = [
    {
      id: 1,
      year: 'Lịch sử',
      title: 'Khởi nguồn & Xây dựng',
      description: `Hình thành và xây dựng tại ${address}, ghi nhận nhiều sự kiện lịch sử quan trọng.`
    },
    {
      id: 2,
      year: 'Kháng chiến',
      title: 'Dấu ấn thời kỳ đấu tranh giải phóng',
      description: events.length > 200 ? events.slice(0, 200) + '...' : events
    },
    {
      id: 3,
      year: 'Xếp hạng',
      title: `Được xếp hạng ${ranking}`,
      description: decision || `Di tích được xếp hạng công nhận giá trị ${type} cấp ${ranking}.`
    }
  ];

  // Custom gallery & images for Dinh Doc Lap (1) and Dia Dao Cu Chi (2)
  let customGallery = null;
  if (stt === 1) {
    heroImage = '/assets/images/dinh-doc-lap/dinh-doc-lap-1.jpg';
    customGallery = [
      { id: 1, src: '/assets/images/dinh-doc-lap/dinh-doc-lap-1.jpg', title: 'Toàn cảnh Dinh Độc Lập', caption: 'Mặt tiền Dinh Độc Lập với rèm hoa đá hình nan trúc thanh cao và bãi cỏ hình bầu dục.', year: 'Kiến trúc' },
      { id: 2, src: '/assets/images/dinh-doc-lap/dinh-doc-lap-2.jpg', title: 'Xe tăng 390 tại cổng Dinh', caption: 'Bảo vật Quốc gia: Xe tăng 390 húc đổ cổng chính trưa 30/4/1975.', year: '1975' },
      { id: 3, src: '/assets/images/dinh-doc-lap/dinh-doc-lap-3.jpg', title: 'Phòng Khánh tiết', caption: 'Nơi diễn ra các cuộc họp nội các, tiếp tân ngoại giao và sự kiện lịch sử.', year: 'Nội thất' },
      { id: 4, src: '/assets/images/dinh-doc-lap/dinh-doc-lap-4.jpg', title: 'Phòng Trình Quốc thư', caption: 'Bức tranh sơn mài Bình Ngô Đại Cáo của họa sĩ Nguyễn Văn Minh.', year: 'Mỹ thuật' },
      { id: 5, src: '/assets/images/dinh-doc-lap/dinh-doc-lap-5.jpg', title: 'Hệ thống Hầm ngầm chỉ huy', caption: 'Trung tâm tác chiến ngầm kiên cố dưới lòng Dinh Độc Lập.', year: 'Công sự' },
      { id: 6, src: '/assets/images/dinh-doc-lap/dinh-doc-lap-6.jpg', title: 'Trực thăng UH-1 & Vị trí ném bom', caption: 'Sân thượng Dinh Độc Lập nơi máy bay F-5E ném bom ngày 8/4/1975.', year: 'Hiện vật' },
      { id: 7, src: '/assets/images/dinh-doc-lap/dinh-doc-lap-7.jpg', title: 'Khuôn viên công viên 12 ha', caption: 'Hàng cây cổ thụ xanh mát bao bọc quanh di tích lịch sử.', year: 'Cảnh quan' },
      { id: 8, src: '/assets/images/dinh-doc-lap/dinh-doc-lap-8.jpg', title: 'Phòng Đại yến', caption: 'Không gian tiệc chiêu đãi quốc tế sang trọng tại Dinh.', year: 'Nội thất' },
      { id: 9, src: '/assets/images/dinh-doc-lap/dinh-doc-lap-9.jpg', title: 'Sơ đồ thiết kế chữ Cát (吉)', caption: 'Triết lý phong thủy phương Đông độc đáo của KTS Ngô Viết Thụ.', year: 'Thiết kế' },
      { id: 10, src: '/assets/images/dinh-doc-lap/dinh-doc-lap-10.jpg', title: 'Cờ Giải phóng trên nóc Dinh', caption: 'Khoảnh khắc lịch sử trưa ngày 30/4/1975 non sông liền một dải.', year: 'Lịch sử' }
    ];
  } else if (stt === 2) {
    heroImage = '/assets/images/dia-dao-cu-chi/dia-dao-cu-chi-1.jpg';
    customGallery = [
      { id: 1, src: '/assets/images/dia-dao-cu-chi/dia-dao-cu-chi-1.jpg', title: 'Cổng vào Khu di tích Địa đạo Củ Chi', caption: 'Vùng Đất thép thành đồng với hơn 200km đường hầm ngầm.', year: 'Cảnh quan' },
      { id: 2, src: '/assets/images/dia-dao-cu-chi/dia-dao-cu-chi-2.jpg', title: 'Cửa hầm bí mật ngụy trang', caption: 'Nắp hầm bí mật giấu kín dưới lớp lá khô vừa vặn một người chui.', year: 'Quân sự' },
      { id: 3, src: '/assets/images/dia-dao-cu-chi/dia-dao-cu-chi-3.jpg', title: 'Cấu trúc đường hầm 3 tầng', caption: 'Hệ thống hầm ngầm liên hoàn xuyên lòng đất sét pha đá ong.', year: 'Kiến trúc ngầm' },
      { id: 4, src: '/assets/images/dia-dao-cu-chi/dia-dao-cu-chi-4.jpg', title: 'Bếp Hoàng Cầm giấu khói', caption: 'Sáng kiến kỳ diệu giúp nấu ăn không tỏa khói ban ngày.', year: 'Sáng tạo' },
      { id: 5, src: '/assets/images/dia-dao-cu-chi/dia-dao-cu-chi-5.jpg', title: 'Hầm phẫu thuật quân y', caption: 'Nơi cấp cứu, cứu chữa thương bệnh binh ngay dưới lòng đất.', year: 'Quân y' },
      { id: 6, src: '/assets/images/dia-dao-cu-chi/dia-dao-cu-chi-6.jpg', title: 'Xưởng chế tạo vũ khí tự tạo', caption: 'Các chiến sĩ tận dụng vỏ bom đạn địch để đúc mìn, lựu đạn.', year: 'Vũ khí' },
      { id: 7, src: '/assets/images/dia-dao-cu-chi/dia-dao-cu-chi-7.jpg', title: 'Hệ thống bẫy chông và bãi mìn', caption: 'Nghệ thuật chiến tranh nhân dân đánh bại các trận càn khổng lồ.', year: 'Chiến thuật' },
      { id: 8, src: '/assets/images/dia-dao-cu-chi/dia-dao-cu-chi-8.jpg', title: 'Khu vực Đền Tưởng niệm Bến Dược', caption: 'Nơi khắc ghi tên tuổi của hơn 44.000 anh hùng liệt sĩ.', year: 'Tri ân' },
      { id: 9, src: '/assets/images/dia-dao-cu-chi/dia-dao-cu-chi-9.jpg', title: 'Hầm hội họp giao ban', caption: 'Không gian chỉ huy tác chiến của Huyện ủy và Bộ Tư lệnh Quân khu.', year: 'Chỉ huy' },
      { id: 10, src: '/assets/images/dia-dao-cu-chi/dia-dao-cu-chi-10.jpg', title: 'Bắn súng thể thao quốc phòng', caption: 'Trải nghiệm thực tế lịch sử và giáo dục truyền thống cho thế hệ trẻ.', year: 'Trải nghiệm' }
    ];
  }

  // Gallery
  const gallery = customGallery || [
    {
      id: 1,
      src: heroImage,
      title: `Toàn cảnh ${name}`,
      caption: `Không gian kiến trúc và cảnh quan di tích ${name} tại ${address}.`,
      year: 'Tư liệu'
    },
    {
      id: 2,
      src: getFallbackImage(type, name, stt + 1),
      title: `Hiện vật & Tư liệu lịch sử`,
      caption: `Hình ảnh tư liệu hiện vật gắn liền với ${name}.`,
      year: 'Hiện vật'
    },
    {
      id: 3,
      src: getFallbackImage(type, name, stt + 2),
      title: `Tư liệu sự kiện lịch sử`,
      caption: `Các dấu mốc và hiện vật lịch sử tại di tích.`,
      year: 'Lịch sử'
    }
  ];

  return {
    id: `monument-${stt}`,
    stt: stt,
    slug: createSlug(name),
    note: note,
    info: {
      name: name,
      subtitle: `${type} • ${ranking}`,
      badge: ranking,
      type: type,
      ranking: ranking,
      decision: decision,
      addressOld: addressOld,
      address: address,
      coordinates: coords,
      lat: coords[0],
      lng: coords[1],
      googleMapsDirectionsUrl: googleMapsDirectionsUrl,
      googleMapsSearchUrl: googleMapsSearchUrl,
      referencesText: references,
      overview: overview,
      heroImage: heroImage,
      stats: {
        campusArea: 'Di tích số',
        roomsCount: ranking,
        artifactsCount: type
      }
    },
    video: {
      title: `Phim tư liệu: ${name}`,
      youtubeUrl: videoUrl || 'https://www.youtube.com/watch?v=cplxidwCHyE',
      youtubeId: youtubeId || 'cplxidwCHyE'
    },
    timeline: timeline,
    gallery: gallery,
    audioScript: audioScript,
    investigation: investigationObj,
    map: {
      lat: coords[0],
      lng: coords[1],
      coordinates: coords,
      zoom: 16,
      name: name,
      address: address,
      googleMapsDirectionsUrl: googleMapsDirectionsUrl,
      googleMapsSearchUrl: googleMapsSearchUrl,
      googleMapsEmbedUrl: 'https://www.google.com/maps/d/embed?mid=1UM24OubPpISXPfooW7VY8Vo4xMZ6dIg&ehbc=2E312F'
    }
  };
});

const fileContent = `// Hệ thống Di sản Số TP.HCM - Toàn bộ 103 Di Tích Lịch Sử & Văn Hóa
// Dữ liệu đồng bộ: Tọa độ GPS, Câu hỏi điều tra riêng biệt & Thử thách 5 câu hỏi đa dạng
export const allMonumentsList = ${JSON.stringify(monuments, null, 2)};

export const getMonumentByIdOrStt = (idOrStt) => {
  if (!idOrStt) return allMonumentsList[0];
  const num = parseInt(idOrStt);
  if (!isNaN(num)) {
    const found = allMonumentsList.find(m => m.stt === num);
    if (found) return found;
  }
  const foundById = allMonumentsList.find(m => m.id === idOrStt || m.slug === idOrStt);
  return foundById || allMonumentsList[0];
};
`;

const outputPath = path.join(__dirname, '../src/data/allMonumentsData.js');
fs.writeFileSync(outputPath, fileContent, 'utf8');
console.log(`Successfully generated all 103 monuments with custom investigations and 5-question quizzes at: ${outputPath}`);
