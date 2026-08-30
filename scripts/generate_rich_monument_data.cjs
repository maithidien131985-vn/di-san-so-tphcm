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
const fullDocsText = d2 + '\n\n' + d1 + '\n\n' + d3;

// 4. Read Em Co Biet Google Doc (1vPjxSXT_1UZ7lSbZUCo7wtYsQ9QFHjUI)
const emText = fs.readFileSync(path.join(__dirname, '../em_co_biet_doc.txt'), 'utf8');
const emBlocks = emText.split(/(?:^|\n)(?=\d+\.\s*)/).filter(b => /^\d+\.\s*/.test(b.trim()));
const emCoBietMap = {};
emBlocks.forEach(b => {
  const match = b.trim().match(/^(\d+)\.\s*([^\n]+)/);
  if (match) {
    const stt = parseInt(match[1]);
    const lines = b.trim().split('\n')
      .map(l => l.replace(/\r/g, '').trim())
      .filter(l => l && !l.startsWith('💡 Em có biết?') && !/^\d+\.\s*/.test(l) && !l.startsWith('___') && !l.startsWith('GHI CHÚ') && !l.startsWith('•'));
    emCoBietMap[stt] = lines;
  }
});
console.log(`Parsed Em Co Biet entries: ${Object.keys(emCoBietMap).length}`);

// 5. Read Cau Hoi Dieu Tra Google Doc (155BmTBFnsytajxEnfjkYZr5W1Q5jiKiY)
const cauText = fs.readFileSync(path.join(__dirname, '../cau_hoi_dieu_tra_doc.txt'), 'utf8');
const cauLines = cauText.split('\n').map(l => l.replace(/\r/g, '').trim()).filter(Boolean);
const cauHoiDieuTraMap = {};
for (let i = 0; i < cauLines.length; i++) {
  const line = cauLines[i];
  if (/^\d+$/.test(line)) {
    const stt = parseInt(line);
    const question = cauLines[i + 2] || '';
    if (question) {
      cauHoiDieuTraMap[stt] = question;
    }
    i += 2;
  }
}
console.log(`Parsed Cau Hoi Dieu Tra entries: ${Object.keys(cauHoiDieuTraMap).length}`);

function extractDocSection(stt) {
  const startPattern = new RegExp('(?:^|\\n)\\s*' + stt + '\\.\\s*([^\\n]+)');
  const nextPattern = new RegExp('(?:^|\\n)\\s*' + (stt + 1) + '\\.\\s*[^\\n]+');
  const startMatch = fullDocsText.match(startPattern);
  if (!startMatch) return '';
  const startIndex = startMatch.index;
  const subStr = fullDocsText.slice(startIndex + startMatch[0].length);
  const nextMatch = subStr.match(nextPattern);
  const content = nextMatch ? subStr.slice(0, nextMatch.index) : subStr.slice(0, 5000);
  return cleanStr(content);
}

function build6Subjects(stt, name, type, ranking, address, overview, events, figures, artifacts, docSnippet) {
  const isDinh = stt === 1;
  const isCuChi = stt === 2;
  const isLocAn = stt === 3;
  const isConDao = stt === 4;
  const isBinhGia = stt === 5;
  const isMinhDam = stt === 6;
  const isRungSac = stt === 7;
  const isBachDinh = stt === 56;
  const isBaoTangLS = stt === 57;
  const isBaoTangTP = stt === 58;
  const isChua = type.includes('Kiến trúc') || name.includes('Chùa') || name.includes('Đình') || name.includes('Miếu') || name.includes('Hội quán');

  return [
    {
      id: 1,
      subject: "Lịch sử",
      tag: "Môn Lịch sử",
      frontTitle: `Mốc Son Lịch Sử Gắn Liền Với ${name}`,
      frontDesc: `Khám phá bối cảnh lịch sử, quá trình hình thành và các sự kiện hào hùng đã diễn ra tại di tích ${name}.`,
      backTitle: "Kiến Thức Lịch Sử Cốt Lõi",
      backPoints: [
        isDinh 
          ? "Trưa 30/4/1975: Xe tăng 843 và 390 tiến vào Dinh, cắm cờ giải phóng trên nóc Dinh lúc 11h30, kết thúc 21 năm kháng chiến chống Mỹ."
          : isCuChi 
          ? "Mạng lưới địa đạo hơn 200km được quân dân Củ Chi đào kiên trì từ thời kháng Pháp đến kháng Mỹ, đánh bại các trận càn Crimp, Cedar Falls."
          : `Ghi dấu những sự kiện lịch sử tiêu biểu: ${events.slice(0, 180)}...`,
        `Được Nhà nước xếp hạng cấp ${ranking.toLowerCase()} theo Luật Di sản văn hóa.`,
        "Địa chỉ đỏ giáo dục truyền thống cách mạng và lòng tự hào dân tộc cho các thế hệ học sinh."
      ]
    },
    {
      id: 2,
      subject: "Địa lí",
      tag: "Môn Địa lí",
      frontTitle: `Vị Trí Không Gian & Mạng Lưới Giao Thông`,
      frontDesc: `Khảo sát vị trí địa lý, tọa độ và vai trò kết nối địa bàn của di tích tại ${address}.`,
      backTitle: "Đặc Điểm Địa Lý & Địa Bàn",
      backPoints: [
        `Tọa lạc tại địa chỉ: ${address}, thuộc vùng đất Đông Nam Bộ giàu truyền thống văn hóa lịch sử.`,
        isDinh 
          ? "Khuôn viên rộng 12 ha tại trung tâm Sài Gòn, nơi hội tụ 5 cánh quân giải phóng tiến vào giải phóng thành phố."
          : isCuChi 
          ? "Địa hình đất sét pha đá ong đặc thù của miền Đông Nam Bộ giúp tạo nên hệ thống đường hầm ngầm 3 tầng vững chắc."
          : isRungSac
          ? "Địa hình rừng ngập mặn Cần Giờ hiểm trở với mạng lưới sông rạch chằng chịt, khống chế tuyến đường thủy sông Lòng Tàu."
          : `Vị trí giao thương thuận lợi, kết nối các tuyến giao thông trọng điểm trong khu vực.`,
        "Ý nghĩa quan trọng trong quy hoạch không gian bảo tồn di sản đô thị hiện đại."
      ]
    },
    {
      id: 3,
      subject: "Mỹ thuật & Kiến trúc",
      tag: "Môn Mỹ thuật & Kiến trúc",
      frontTitle: `Đặc Trưng Nghệ Thuật & Bố Cục Tạo Hình`,
      frontDesc: `Tìm hiểu phong cách kiến trúc độc đáo, các chi tiết điêu khắc và dấu ấn mỹ thuật của di tích.`,
      backTitle: "Nét Độc Đáo Về Kiến Trúc & Mỹ Thuật",
      backPoints: [
        isDinh 
          ? "Đồ án do KTS Ngô Viết Thụ (Khôi nguyên La Mã 1955) thiết kế theo bình diện chữ CÁT (吉), mặt tiền rèm hoa đá hình nan trúc thanh cao."
          : isChua 
          ? "Nghệ thuật chạm khắc gỗ bao lam lộng hai mặt tinh xảo, hoa văn tứ linh, hoa lá dân gian và tượng Phật cổ thếp vàng."
          : isBachDinh || isBaoTangLS || isBaoTangTP
          ? "Phong cách kiến trúc phương Tây kết hợp Đông Dương tinh tế với vòm cuốn, mái ngói cong và hoa văn phù điêu gốm sứ."
          : `Kiến trúc mang đậm nét văn hóa truyền thống: ${artifacts.slice(0, 160)}...`,
        "Sự giao thoa hoàn hảo giữa kỹ thuật xây dựng và giá trị thẩm mỹ trường tồn theo thời gian.",
        "Nguồn cảm hứng phong phú cho các bài học mỹ thuật và di sản kiến trúc dân tộc."
      ]
    },
    {
      id: 4,
      subject: "Kinh tế & Pháp luật",
      tag: "Môn GDKT&PL / GDCD",
      frontTitle: `Cơ Sở Pháp Lý & Trách Nhiệm Công Dân`,
      frontDesc: `Nghiên cứu các văn bản xếp hạng di tích, Luật Di sản văn hóa và trách nhiệm bảo tồn của học sinh.`,
      backTitle: "Cơ Sở Pháp Lý & Ý Thức Bảo Tồn",
      backPoints: [
        `Di tích được xếp hạng ${ranking} theo Luật Di sản văn hóa và các quyết định công nhận của Nhà nước.`,
        "Trách nhiệm của công dân trong việc giữ gìn hiện vật gốc, bảo vệ môi trường cảnh quan di tích.",
        "Phát huy giá trị di sản trong phát triển kinh tế du lịch văn hóa bền vững của Thành phố."
      ]
    },
    {
      id: 5,
      subject: "Ngữ văn & Báo chí",
      tag: "Môn Ngữ văn & Báo chí",
      frontTitle: `Tác Phẩm Văn Học & Tư Liệu Ký Ức`,
      frontDesc: `Cảm nhận chiều sâu văn hóa qua thơ ca, hồi ký nhân chứng và những bài báo ghi dấu ấn lịch sử.`,
      backTitle: "Giá Trị Văn Học & Tư Liệu Ký Ức",
      backPoints: [
        `Gắn liền với ký ức của các nhân vật lịch sử: ${figures.slice(0, 160)}...`,
        "Các áng văn, bài thơ và hồi ký hào hùng ngợi ca tinh thần yêu nước, bất khuất của dân tộc.",
        "Rèn luyện kỹ năng viết bài cảm nghĩ, thuyết minh di tích và phỏng vấn nhân chứng lịch sử."
      ]
    },
    {
      id: 6,
      subject: "Quốc phòng & An ninh",
      tag: "Môn GDQP-AN",
      frontTitle: `Nghệ Thuật Quân Sự & Thế Trận Lòng Dân`,
      frontDesc: `Tìm hiểu nghệ thuật tác chiến, căn cứ hầm ngầm bí mật và ý chí bảo vệ chủ quyền Tổ quốc.`,
      backTitle: "Đỉnh Cao Nghệ Thuật Quân Sự",
      backPoints: [
        isDinh 
          ? "Nghệ thuật hiệp đồng quân binh chủng cơ giới thần tốc của Quân Giải phóng tiến công sào huyệt cuối cùng ngày 30/4/1975."
          : isCuChi 
          ? "Chiến tranh nhân dân 'bám đất, bám làng', đánh địch bằng 3 mũi giáp công ngay trong lòng đất với hệ thống hầm chông, bẫy mìn."
          : isRungSac
          ? "Chiến thuật đặc công thủy luồn sâu đánh hiểm của Đoàn 10 Đặc công Rừng Sác, khống chế sông Lòng Tàu và kho xăng Nhà Bè."
          : "Nghệ thuật xây dựng thế trận chiến tranh nhân dân, kết hợp sức mạnh quân sự với sự che chở của nhân dân địa phương.",
        "Bài học về tinh thần cảnh giác, bảo vệ vững chắc nền độc lập và chủ quyền thiêng liêng của Tổ quốc."
      ]
    }
  ];
}

function buildCustomFlashcards(stt, name, type, ranking, decision, address, coords, overview, events, figures, artifacts) {
  if (stt === 1) {
    return [
      {
        id: 1,
        tag: "Nhân vật lịch sử",
        front: "Ai là người đã kéo lá cờ giải phóng trên nóc Dinh Độc Lập lúc 11h30 trưa 30/4/1975?",
        back: "Trung úy Bùi Quang Thận (Đại đội trưởng Đại đội 4, Lữ đoàn xe tăng 203, Quân đoàn 2), trưởng xe tăng 843, đã chạy lên sân thượng hạ cờ đối phương và kéo cờ Mặt trận Dân tộc Giải phóng miền Nam Việt Nam.",
        badge: "Bảo vật Quốc gia"
      },
      {
        id: 2,
        tag: "Chiến tích xe tăng",
        front: "Vai trò lịch sử của kíp xe tăng T59 số hiệu 390 trong ngày 30/4/1975?",
        back: "Do Trung úy Vũ Đăng Toàn làm trưởng xe, xe tăng 390 đã dũng mãnh húc bật tung cánh cổng chính Dinh Độc Lập, mở đường tiến thẳng vào sân Dinh, trở thành biểu tượng bất diệt của ngày toàn thắng.",
        badge: "Bảo vật Quốc gia"
      },
      {
        id: 3,
        tag: "Nghệ thuật kiến trúc",
        front: "Kiến trúc sư Ngô Viết Thụ đã thiết kế rèm hoa đá ở mặt tiền Dinh Độc Lập mang hình ảnh gì?",
        back: "Mặt tiền Dinh được trang trí bằng rèm hoa đá hình các đốt trúc thanh nhã, tượng trưng cho khí tiết thanh cao của người quân tử, đồng thời che nắng nhiệt đới và thông gió đối lưu tự nhiên.",
        badge: "KTS Khôi nguyên La Mã"
      },
      {
        id: 4,
        tag: "Sự kiện lịch sử",
        front: "Hội nghị Hiệp thương chính trị thống nhất Tổ quốc được tổ chức tại Dinh vào thời gian nào?",
        back: "Vào tháng 11–12/1975, Hội nghị Hiệp thương chính trị thống nhất hai miền Nam - Bắc được tổ chức trọng thể tại Hội trường chính Dinh Độc Lập, quyết định tổng tuyển cử bầu Quốc hội chung của cả nước.",
        badge: "Thống nhất non sông"
      },
      {
        id: 5,
        tag: "Công sự ngầm",
        front: "Hệ thống hầm ngầm dưới lòng Dinh Độc Lập có kết cấu và vai trò gì?",
        back: "Hầm ngầm kiên cố chịu được bom hạng nặng, được trang bị trung tâm tác chiến, hệ thống máy điện đàm vô tuyến và bản đồ chỉ huy quân sự thời kỳ trước 1975.",
        badge: "Công trình ngầm"
      },
      {
        id: 6,
        tag: "Xếp hạng Di sản",
        front: "Dinh Độc Lập được Thủ tướng Chính phủ xếp hạng Di tích Quốc gia Đặc biệt vào năm nào?",
        back: "Dinh Độc Lập được xếp hạng là Di tích Lịch sử cấp Quốc gia Đặc biệt theo Quyết định số 1272/QĐ-TTg ngày 12/8/2009 của Thủ tướng Chính phủ.",
        badge: "Di tích Quốc gia Đặc biệt"
      }
    ];
  } else if (stt === 2) {
    return [
      {
        id: 1,
        tag: "Cấu trúc địa đạo",
        front: "Hệ thống Địa đạo Củ Chi có cấu trúc mấy tầng ngầm và tổng chiều dài bao nhiêu?",
        back: "Hệ thống địa đạo gồm 3 tầng ngầm liên hoàn xuyên qua nền đất sét pha đá ong với tổng chiều dài hơn 200km, chịu được đạn pháo và các loại bom hạng nặng.",
        badge: "Đất thép thành đồng"
      },
      {
        id: 2,
        tag: "Sáng chế quân sự",
        front: "Bếp Hoàng Cầm trong hệ thống Địa đạo Củ Chi có đặc điểm kỳ diệu gì?",
        back: "Bếp Hoàng Cầm dẫn khói qua hệ thống nhiều rãnh ngầm dài tỏa khói sát mặt đất như làn sương mỏng, giúp nấu chín thức ăn nóng cho bộ đội giữa ban ngày mà máy bay địch không thể phát hiện.",
        badge: "Sáng tạo Việt Nam"
      },
      {
        id: 3,
        tag: "Chiến thuật tác chiến",
        front: "Quân và dân Củ Chi đã dùng phương châm tác chiến nào để đánh bại các trận càn Crimp, Cedar Falls?",
        back: "Phương châm 'Bám thắt lưng địch mà đánh', kết hợp 3 mũi giáp công, hầm chông, bãi mìn và mạng lưới hầm ngầm biến cả vùng đất thành pháo đài bất khả xâm phạm.",
        badge: "Nghệ thuật quân sự"
      },
      {
        id: 4,
        tag: "Công trình ngầm",
        front: "Các công trình sinh hoạt chủ yếu nào được bố trí bên trong Địa đạo Củ Chi?",
        back: "Bao gồm phòng hội họp giao ban chỉ huy, trạm phẫu thuật quân y cứu thương, xưởng đúc vũ khí tự tạo, giếng nước ngầm và hầm nấu ăn Hoàng Cầm.",
        badge: "Kiến trúc lòng đất"
      },
      {
        id: 5,
        tag: "Tri ân anh hùng",
        front: "Đền Tưởng niệm Liệt sĩ Bến Dược Củ Chi khắc ghi tên tuổi của bao nhiêu anh hùng liệt sĩ?",
        back: "Đền Bến Dược Củ Chi khắc ghi danh tính của hơn 44.000 anh hùng liệt sĩ đã hy sinh trên chiến trường Sài Gòn - Chợ Lớn - Gia Định qua hai cuộc kháng chiến.",
        badge: "Đền Bến Dược"
      },
      {
        id: 6,
        tag: "Danh hiệu cao quý",
        front: "Danh hiệu vẻ vang nào được trao tặng cho Củ Chi tại Đại hội Anh hùng và Chiến sĩ thi đua toàn Miền?",
        back: "Củ Chi vinh dự được Ủy ban Trung ương Mặt trận Dân tộc Giải phóng miền Nam trao tặng cờ danh dự và 8 chữ vàng 'Đất thép thành đồng' cùng Huân chương Thành đồng hạng Nhất.",
        badge: "Đất thép thành đồng"
      }
    ];
  }

  return [
    {
      id: 1,
      tag: "Sự kiện lịch sử",
      front: `Di tích "${name}" gắn liền với sự kiện lịch sử tiêu biểu nào?`,
      back: events !== 'Chưa bổ sung' ? events : overview,
      badge: "Mốc son lịch sử"
    },
    {
      id: 2,
      tag: "Nhân vật lịch sử",
      front: `Những nhân vật, anh hùng hoặc nhân chứng nào gắn liền với "${name}"?`,
      back: figures !== 'Chưa bổ sung' ? figures : `Gắn liền với các anh hùng liệt sĩ, đồng bào và chiến sĩ cách mạng kiên trung tại ${address}.`,
      badge: "Nhân chứng lịch sử"
    },
    {
      id: 3,
      tag: "Hiện vật & Công trình",
      front: `Hiện vật, dấu tích hoặc công trình tiêu biểu tại di tích "${name}" là gì?`,
      back: artifacts !== 'Chưa bổ sung' ? artifacts : `Hệ thống công trình kiến trúc, bia ghi công và hiện vật lịch sử nguyên bản tại ${address}.`,
      badge: "Bảo vật di sản"
    },
    {
      id: 4,
      tag: "Không gian & Vị trí",
      front: `Di tích "${name}" tọa lạc tại địa chỉ và khu vực nào của Thành phố?`,
      back: `Tọa lạc tại địa chỉ: ${address}. Tọa độ GPS chính xác: ${coords[0]}, ${coords[1]}.`,
      badge: "Địa chỉ đỏ"
    },
    {
      id: 5,
      tag: "Cấp độ Xếp hạng",
      front: `Di tích "${name}" đã được Nhà nước xếp hạng ở cấp độ nào?`,
      back: `Được Nhà nước xếp hạng là Di tích cấp ${ranking} (${type})${decision ? ', theo ' + decision : ''} theo Luật Di sản văn hóa.`,
      badge: "Xếp hạng Di sản"
    },
    {
      id: 6,
      tag: "Ý nghĩa giáo dục",
      front: `Ý nghĩa giáo dục và trách nhiệm lớn nhất của học sinh đối với "${name}" là gì?`,
      back: `Tìm hiểu truyền thống yêu nước, tự hào dân tộc, bảo vệ nguyên trạng cảnh quan hiện vật và tích cực quảng bá di sản số TP.HCM.`,
      badge: "Trách nhiệm thế hệ trẻ"
    }
  ];
}

function buildCustomMatchingPairs(stt, name, type, ranking, address, events, figures, artifacts) {
  if (stt === 1) {
    return [
      { id: 'p1', left: 'Bùi Quang Thận', right: 'Trưởng xe tăng 843, kéo lá cờ giải phóng trên nóc Dinh Độc Lập lúc 11h30 trưa 30/4/1975', matched: false },
      { id: 'p2', left: 'Vũ Đăng Toàn', right: 'Trưởng xe tăng T59 số hiệu 390 dũng mãnh húc đổ cánh cổng chính Dinh Độc Lập', matched: false },
      { id: 'p3', left: 'Ngô Viết Thụ', right: 'KTS Khôi nguyên La Mã thiết kế đồ án Dinh theo hình chữ CÁT (吉)', matched: false },
      { id: 'p4', left: 'Nguyễn Thành Trung', right: 'Phi công lái F-5E ném bom Dinh Độc Lập ngày 8/4/1975', matched: false },
      { id: 'p5', left: 'Hội nghị Hiệp thương (11/1975)', right: 'Hội nghị thống nhất non sông hai miền Nam - Bắc tổ chức tại Hội trường Dinh', matched: false }
    ];
  } else if (stt === 2) {
    return [
      { id: 'p1', left: 'Mạng lưới Địa đạo 3 tầng', right: 'Hệ thống đường hầm ngầm hơn 200km xuyên lòng đất sét pha đá ong', matched: false },
      { id: 'p2', left: 'Bếp Hoàng Cầm', right: 'Sáng kiến dẫn khói ngầm nấu ăn không tỏa khói ban ngày', matched: false },
      { id: 'p3', left: 'Đền Liệt sĩ Bến Dược', right: 'Nơi khắc ghi danh tính của hơn 44.000 anh hùng liệt sĩ', matched: false },
      { id: 'p4', left: 'Đất thép thành đồng', right: 'Danh hiệu vẻ vang Mặt trận Dân tộc Giải phóng trao tặng Củ Chi', matched: false },
      { id: 'p5', left: 'Trận càn Cedar Falls', right: 'Chiến dịch càn quét quy mô lớn của địch bị quân dân địa đạo bẻ gãy', matched: false }
    ];
  }

  const cleanFig = figures && figures !== 'Chưa bổ sung' ? figures.slice(0, 32) : `Nhân vật gắn liền với ${name}`;
  const cleanArt = artifacts && artifacts !== 'Chưa bổ sung' ? artifacts.slice(0, 32) : `Hiện vật tiêu biểu tại ${name}`;
  const cleanEve = events && events !== 'Chưa bổ sung' ? events.slice(0, 32) : `Sự kiện lịch sử tiêu biểu`;

  return [
    { id: 'p1', left: cleanFig.length > 25 ? cleanFig + '...' : cleanFig, right: `Nhân vật lịch sử / Anh hùng / Nhân chứng gắn liền với ${name}`, matched: false },
    { id: 'p2', left: cleanArt.length > 25 ? cleanArt + '...' : cleanArt, right: `Hiện vật tiêu biểu / Bảo vật / Công trình nguyên bản tại di tích`, matched: false },
    { id: 'p3', left: `${ranking} (${type})`, right: `Cấp xếp hạng di sản chính thức theo Luật Di sản văn hóa`, matched: false },
    { id: 'p4', left: address.length > 30 ? address.slice(0, 30) + '...' : address, right: `Địa chỉ tọa lạc & Không gian địa lý của di tích`, matched: false },
    { id: 'p5', left: name.length > 25 ? name.slice(0, 25) + '...' : name, right: `Địa chỉ đỏ giáo dục truyền thống cách mạng và lòng yêu nước`, matched: false }
  ];
}

console.log(`Generating rich knowledge dataset for all ${dataRows.length} monuments...`);

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
  const youtubeId = extractYoutubeId(videoUrl) || (stt === 1 ? 'cplxidwCHyE' : (stt === 2 ? 'l1uA3lFzE4o' : 'cplxidwCHyE'));

  const overview = cleanStr(r[11]) || `Di tích ${name} là một trong những công trình di sản văn hóa, lịch sử tiêu biểu tại Thành phố Hồ Chí Minh, mang đậm dấu ấn hào hùng và giá trị kiến trúc trường tồn theo thời gian.`;
  const figures = cleanStr(r[12]) || 'Các anh hùng liệt sĩ, đồng bào và chiến sĩ đã chiến đấu, hy sinh bảo vệ quê hương đất nước.';
  const artifacts = cleanStr(r[13]) || 'Các hiện vật lịch sử, công trình kiến trúc và tư liệu khảo cổ nguyên bản.';
  const events = cleanStr(r[14]) || `Các sự kiện lịch sử gắn liền với quá trình hình thành và phát triển của ${name}.`;
  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${coords[0]},${coords[1]}`;
  const googleMapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${coords[0]},${coords[1]}`;
  const references = cleanStr(r[16]) || `Hồ sơ khoa học di tích ${name} - Sở Văn hóa và Thể thao TP.HCM.`;

  const docSnippet = extractDocSection(stt);

  // Exact Investigation Question from cau_hoi_dieu_tra_doc.txt
  const exactDocQuestion = cauHoiDieuTraMap[stt];
  let investigationQuestion = exactDocQuestion || `Vì sao di tích ${name} tại ${address} trở thành dấu mốc lịch sử - văn hóa quan trọng cần được gìn giữ và phát huy giá trị?`;
  
  let suggestedAnswer = `Di tích ${name} là ${type.toLowerCase()} được xếp hạng cấp ${ranking.toLowerCase()} (${decision || 'theo quy định của Nhà nước'}). Nơi đây ghi dấu các sự kiện lịch sử tiêu biểu: ${events.slice(0, 180)}..., gắn liền với công lao to lớn của ${figures.slice(0, 140)}... và lưu giữ các hiện vật quý: ${artifacts.slice(0, 140)}..., là di sản văn hóa vô giá cho các thế hệ mai sau.`;

  if (stt === 1) {
    suggestedAnswer = "Trưa ngày 30/4/1975, xe tăng 390 và 843 tiến vào Dinh Độc Lập, cờ giải phóng tung bay trên nóc Dinh lúc 11h30, Tổng thống Dương Văn Minh tuyên bố đầu hàng vô điều kiện, kết thúc 21 năm kháng chiến chống Mỹ và 30 năm chiến tranh giải phóng, non sông thu về một mối.";
  } else if (stt === 2) {
    suggestedAnswer = "Địa đạo Củ Chi là công trình ngầm độc đáo gồm 3 tầng xuyên đất sét pha đá ong, kết hợp hầm chông, bãi mìn và bếp Hoàng Cầm giấu khói, giúp quân dân bám trụ kiên cường đánh bại các trận càn Crimp, Cedar Falls bằng 3 mũi giáp công.";
  } else if (stt === 3) {
    suggestedAnswer = "Bến Lộc An là bến tiếp nhận bí mật chiến lược của Đoàn tàu Không số, vận chuyển hàng chục tấn vũ khí từ miền Bắc vào chi viện trực tiếp cho Chiến dịch Bình Giã và các chiến trường miền Đông Nam Bộ.";
  } else if (stt === 4) {
    suggestedAnswer = "Dù bị đày ải trong hệ thống chuồng cọp, chuồng bò khắc nghiệt, các chiến sĩ cách mạng đã thành lập chi bộ Đảng, tổ chức học tập lý luận chính trị và giữ vững khí tiết bất khuất đến ngày toàn thắng.";
  }

  // Exact "Em có biết?" points from em_co_biet_doc.txt
  const emCoBietPoints = emCoBietMap[stt] || [
    `📏 Tọa độ: ${coords[0]}, ${coords[1]}`,
    `🏛️ Xếp hạng: ${ranking} (${type})`,
    `📍 Địa chỉ: ${address}`
  ];

  const keyHighlights = {
    figures: {
      title: "Nhân vật liên quan",
      subtitle: `Những con người lịch sử gắn liền với ${name}`,
      details: figures !== 'Chưa bổ sung' ? figures : `Các anh hùng liệt sĩ, đồng bào và chiến sĩ cách mạng kiên trung tại địa bàn ${address}.`,
      icon: "UserCheck",
      tag: "Nhân chứng lịch sử"
    },
    artifacts: {
      title: "Hiện vật tiêu biểu",
      subtitle: `Chứng tích, hiện vật và công trình nguyên bản tại di tích`,
      details: artifacts !== 'Chưa bổ sung' ? artifacts : `Hệ thống hiện vật, bia ký, công trình kiến trúc và tư liệu khoa học tại ${name}.`,
      icon: "Package",
      tag: "Bảo vật di sản"
    },
    events: {
      title: "Sự kiện tiêu biểu",
      subtitle: `Những mốc son và dấu ấn lịch sử hào hùng`,
      details: events !== 'Chưa bổ sung' ? events : `Các mốc sự kiện đấu tranh cách mạng, xây dựng và xếp hạng di tích ${ranking} tại ${address}.`,
      icon: "Flag",
      tag: "Dấu ấn lịch sử"
    }
  };

  const subjects6 = build6Subjects(stt, name, type, ranking, address, overview, events, figures, artifacts, docSnippet);

  const referencesList = [
    { title: `Hồ sơ khoa học Di tích ${name}`, source: "Sở Văn hóa và Thể thao TP. Hồ Chí Minh" },
    { title: decision ? `Quyết định xếp hạng ${ranking}: ${decision}` : `Danh mục Di tích Lịch sử - Văn hóa TP.HCM`, source: "Bộ Văn hóa, Thể thao và Du lịch / UBND TP.HCM" },
    { title: "Tư liệu Lịch sử Đảng bộ và Lịch sử Kháng chiến TP. Hồ Chí Minh", source: "NXB Tổng hợp TP. Hồ Chí Minh" },
    { title: "Địa chí Lịch sử - Văn hóa TP. Hồ Chí Minh", source: "Viện Lịch sử Quân sự Việt Nam" }
  ];

  const quiz = [
    {
      id: 1,
      type: 'multiple_choice',
      category: 'Sự kiện tiêu biểu',
      question: `Sự kiện lịch sử nổi bật nhất gắn liền với di tích "${name}" là gì?`,
      options: [
        events.length > 15 && events !== 'Chưa bổ sung' ? events.slice(0, 95) + (events.length > 95 ? '...' : '') : `Ghi dấu những mốc son cách mạng và giá trị văn hóa tiêu biểu tại ${address}`,
        'Một cuộc triển lãm thương mại quốc tế tạm thời vào thế kỷ 21',
        'Công trình xây dựng phục vụ du lịch sinh thái thuần túy',
        'Địa điểm tổ chức hội chợ nông sản thường niên'
      ],
      correctIndex: 0,
      explanation: `Di tích ${name} ghi dấu sự kiện: ${events !== 'Chưa bổ sung' ? events : overview.slice(0, 180)}.`
    },
    {
      id: 2,
      type: 'multiple_choice',
      category: 'Nhân vật & Hiện vật',
      question: `Nhân vật lịch sử hoặc hiện vật tiêu biểu gắn liền với di tích "${name}" là ai/cái gì?`,
      options: [
        figures.length > 15 && figures !== 'Chưa bổ sung' ? figures.slice(0, 85) + '...' : `Các anh hùng liệt sĩ, đồng bào và hiện vật: ${artifacts.slice(0, 60)}...`,
        'Các thương gia châu Âu vào thế kỷ 15',
        'Các nhà thám hiểm Bắc Cực',
        'Một vị tướng thời cổ đại La Mã'
      ],
      correctIndex: 0,
      explanation: `Nhân vật và hiện vật tiêu biểu: ${figures} - Hiện vật: ${artifacts}.`
    },
    {
      id: 3,
      type: 'true_false',
      category: 'Xếp hạng & Pháp lý',
      question: `Nhận định sau đây về di tích "${name}" là ĐÚNG hay SAI: "Di tích đã được xếp hạng là ${ranking} (${type}) theo quy định của Nhà nước"?`,
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
      category: 'Khảo sát thực địa',
      question: `Khi đến khảo sát thực địa tại di tích "${name}", phát hiện nào sau đây phản ánh chính xác nhất về không gian và cảnh quan di tích?`,
      options: [
        `Tọa lạc tại địa chỉ: ${address}, lưu giữ các dấu tích kiến trúc, hiện vật và không gian lịch sử nguyên bản`,
        'Công trình đã bị chuyển đổi hoàn toàn thành trung tâm thương mại cao ốc hiện đại',
        'Di tích nằm ở vùng hải đảo xa xôi ngoài lãnh thổ Việt Nam',
        'Chỉ là một mô hình thu nhỏ được dựng lại trong công viên giải trí'
      ],
      correctIndex: 0,
      explanation: `Vị trí chính xác của di tích nằm tại ${address}, nơi lưu giữ nguyên vẹn giá trị lịch sử và hiện vật tiêu biểu.`
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

  const flashcards = buildCustomFlashcards(stt, name, type, ranking, decision, address, coords, overview, events, figures, artifacts);
  const matchingPairs = buildCustomMatchingPairs(stt, name, type, ranking, address, events, figures, artifacts);

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

  const timeline = [
    {
      id: 1,
      year: 'Khởi nguồn',
      title: 'Quá trình hình thành & Xây dựng',
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
      referencesList: referencesList,
      overview: overview,
      heroImage: heroImage,
      emCoBiet: emCoBietPoints,
      stats: {
        campusArea: stt === 1 ? '120.000 m²' : (stt === 2 ? 'Khu vực 250 ha' : 'Di tích số'),
        roomsCount: stt === 1 ? '150+ phòng' : (stt === 2 ? '3 tầng hầm' : ranking),
        artifactsCount: stt === 1 ? '3.700+ hiện vật' : (stt === 2 ? 'Hàng ngàn hiện vật' : type)
      }
    },
    video: {
      title: `Phim tư liệu lịch sử: ${name}`,
      youtubeUrl: videoUrl || `https://www.youtube.com/watch?v=${youtubeId}`,
      youtubeId: youtubeId,
      description: `Thước phim tư liệu chân thực về di tích ${name} tại ${address}.`
    },
    keyHighlights: keyHighlights,
    subjects6: subjects6,
    timeline: timeline,
    gallery: gallery,
    audioScript: audioScript,
    investigation: {
      title: `Hồ sơ điều tra: ${name}`,
      subtitle: `Khảo sát chứng cứ lịch sử, giải mã tư liệu và trả lời câu hỏi điều tra tại ${address}.`,
      investigationTopic: `Nghiên cứu & Giải mã Di tích ${name}`,
      investigationQuestion: investigationQuestion,
      suggestedAnswer: suggestedAnswer,
      referencesList: referencesList,
      quiz: quiz,
      flashcards: flashcards,
      matchingPairs: matchingPairs,
      dossiers: [
        {
          id: 'map_dossier',
          title: 'Bản đồ',
          subtitle: `Sơ đồ vị trí và không gian di tích ${name}`,
          image: '/assets/images/so-do-kien-truc.jpg',
          detail: `Bản đồ phân bố không gian và các vị trí trọng điểm của di tích tại ${address}.`,
          clues: [`Tọa độ: ${coords[0]}, ${coords[1]}`, `Địa bàn: ${address}`, `Cấp xếp hạng: ${ranking}`]
        },
        {
          id: 'doc_dossier',
          title: 'Tư liệu',
          subtitle: `Hồ sơ khoa học và văn bản lịch sử`,
          image: '/assets/images/co-giai-phong-dinh.jpg',
          detail: `Tài liệu lưu trữ, văn bản quyết định và bài báo lịch sử về di tích.`,
          clues: [`Quyết định: ${decision || 'Hồ sơ Di sản TP.HCM'}`, `Sự kiện: ${events.slice(0, 100)}...`]
        },
        {
          id: 'artifact_dossier',
          title: 'Hiện vật',
          subtitle: `Bảo vật và chứng tích lịch sử`,
          image: '/assets/images/may-danh-chu-hien-vat.jpg',
          detail: `Hệ thống hiện vật tiêu biểu: ${artifacts}`,
          clues: [`Hiện vật: ${artifacts.slice(0, 100)}...`, `Nhân vật: ${figures.slice(0, 100)}...`]
        }
      ]
    },
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
// Dữ liệu đồng bộ: Tọa độ GPS, Video, 3 Ô Điểm nhấn, 6 Môn học, Em có biết & 103 Câu hỏi điều tra cốt lõi từ Google Docs
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
console.log(`Successfully generated rich dataset for all 103 monuments with Em Co Biet & Cau Hoi Dieu Tra at: ${outputPath}`);
