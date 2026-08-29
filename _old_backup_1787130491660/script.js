/**
 * KHKT INNOVATION HUB - INTERACTIVE JAVASCRIPT ENGINE
 * Full-featured logic for filtering, idea generator, theme toggle, modals & forms.
 */

// ==========================================
// 1. DATA REPOSITORY: KHKT PROJECTS
// ==========================================
const projectsData = [
    {
        id: "khkt-01",
        title: "Cánh tay thủy lực điều khiển thông minh tích hợp cảm biến lực",
        category: "robotics",
        categoryName: "Robotics & IoT",
        badgeClass: "badge-robotics",
        award: "Giải Nhất Tỉnh",
        desc: "Thiết kế mô hình cánh tay robot 4 bậc tự do truyền động bằng hệ thống xi lanh thủy lực kết hợp vi điều khiển Arduino và cảm biến lực điện trở.",
        tags: ["Arduino", "Thủy lực", "Cơ điện tử", "In 3D"],
        author: "Trần Minh Đức & Lê Hoàng Quân",
        school: "THPT Chuyên KHTN",
        avatar: "ĐQ",
        details: {
            problem: "Các cánh tay robot công nghiệp có giá thành rất cao, khó ứng dụng vào các xưởng sản xuất nhỏ hoặc các bài học thực hành STEM tại trường phổ thông.",
            solution: "Sử dụng nguyên lý truyền áp suất chất lỏng Pascal kết hợp động cơ bước và cảm biến áp lực để tối ưu lực gắp chính xác, an toàn.",
            techStack: "Arduino Mega 2560, Động cơ Servo MG996R, Cảm biến áp lực FSR402, Khung Acrylic cắt laser & in 3D.",
            results: "Tải trọng nâng đạt 1.5kg với độ lệch vị trí dưới 1.5mm. Chi phí sản xuất rẻ hơn 85% so với sản phẩm thương mại."
        }
    },
    {
        id: "khkt-02",
        title: "Hệ thống AI nhận diện và tự động phân loại rác thải tại nguồn",
        category: "ai",
        categoryName: "AI & Phần mềm",
        badgeClass: "badge-ai",
        award: "Giải Nhì Quốc Gia",
        desc: "Ứng dụng mô hình mạng nơ-ron tích chập (YOLOv8) kết hợp Raspberry Pi 4 để nhận diện rác vô cơ, hữu cơ và tái chế theo thời gian thực.",
        tags: ["Python", "YOLOv8", "Raspberry Pi", "Thị giác máy tính"],
        author: "Nguyễn Thùy Linh",
        school: "THPT Chu Văn An",
        avatar: "TL",
        details: {
            problem: "Ý thức phân loại rác tại nguồn còn thấp, dẫn đến ô nhiễm môi trường và chi phí xử lý rác thải đô thị tăng cao.",
            solution: "Tích hợp camera góc rộng quét vật thể, nhận diện loại rác trong 0.2 giây và kích hoạt nắp thùng rác tự mở tương ứng.",
            techStack: "Raspberry Pi 4 (4GB), Camera V2 Sony IMX219, Mô hình YOLOv8 Nano tối ưu ONNX, Động cơ Servo điều hướng.",
            results: "Độ chính xác nhận diện đạt 96.8% trên tập dữ liệu 5,000 ảnh rác thải phổ biến tại Việt Nam."
        }
    },
    {
        id: "khkt-03",
        title: "Hệ thống cảnh báo sạt lở đất sớm ứng dụng mạng cảm biến LoRa",
        category: "environment",
        categoryName: "Môi trường & Sinh học",
        badgeClass: "badge-environment",
        award: "Giải Nhất Tỉnh",
        desc: "Cụm trạm quan trắc độ ẩm đất, độ rung chấn địa tầng truyền dữ liệu tầm xa LoRa về trung tâm điều hành phòng chống thiên tai vùng núi.",
        tags: ["LoRa SX1278", "ESP32", "Cảm biến địa chấn", "Năng lượng mặt trời"],
        author: "Hoàng Gia Bảo & Vũ Hải Đăng",
        school: "THCS & THPT Vùng Cao",
        avatar: "BĐ",
        details: {
            problem: "Sạt lở đất tại các vùng đồi núi xảy ra bất ngờ trong mùa mưa bão, gây thiệt hại nghiêm trọng về người và tài sản.",
            solution: "Mạng lưới các trạm đo cắm sâu vào tầng địa chất theo dõi biến dạng dịch chuyển và độ bão hòa nước trong đất.",
            techStack: "Module LoRa 433MHz tầm xa 5km, Cảm biến gia tốc MPU6050, Cảm biến điện dung độ ẩm đất Soil Moisture V2.",
            results: "Hệ thống phát tín hiệu còi hú và tin nhắn SMS cảnh báo trước nguy cơ sạt lở từ 15 đến 30 phút."
        }
    },
    {
        id: "khkt-04",
        title: "Mô hình chưng cất tinh dầu và sấy thảo dược bằng năng lượng mặt trời",
        category: "stem",
        categoryName: "Mô hình STEM",
        badgeClass: "badge-stem",
        award: "Giải Ba Tỉnh",
        desc: "Tận dụng gương cầu hội tụ và buồng sấy đối lưu nhiệt mặt trời để nâng cao năng suất chiết xuất tinh dầu sả, tràm và sấy khô nông sản sạch.",
        tags: ["STEM", "Nhiệt năng", "Nông nghiệp sạch", "Vật lý ứng dụng"],
        author: "Phạm Phương Thảo",
        school: "THPT Lê Quý Đôn",
        avatar: "PT",
        details: {
            problem: "Nông dân các làng nghề truyền thống sử dụng củi đốt gây khói bụi và tiêu hao nhiều năng lượng khi chưng cất tinh dầu.",
            solution: "Thiết kế buồng thu nhiệt parabol hội tụ gia nhiệt nồi hơi, kết hợp quạt đối lưu điều khiển bằng pin quang điện.",
            techStack: "Máng phản xạ Parabol inox 304, Hệ thống ống ngưng tụ sinh hàn đồng, Vi điều khiển đo nhiệt độ DS18B20.",
            results: "Tăng hiệu suất thu hồi tinh dầu thêm 22% và giảm 100% chi phí nhiên liệu đốt."
        }
    },
    {
        id: "khkt-05",
        title: "Kính thông minh hỗ trợ người khiếm thị tích hợp LiDAR và phản hồi xúc giác",
        category: "robotics",
        categoryName: "Robotics & IoT",
        badgeClass: "badge-robotics",
        award: "Giải Nhì Tỉnh",
        desc: "Thiết bị đeo thông minh hỗ trợ người khiếm thị định vị vật cản trong phạm vi 4m và chuyển đổi biển báo chữ viết thành giọng nói tiếng Việt.",
        tags: ["LiDAR", "TTS Tiếng Việt", "Rung xúc giác", "Thiết bị hỗ trợ"],
        author: "Võ Hoàng Nam",
        school: "THPT Nguyễn Du",
        avatar: "HN",
        details: {
            problem: "Người khiếm thị gặp nhiều khó khăn khi di chuyển ngoài không gian công cộng, đặc biệt là các vật cản ở tầm ngực và đầu.",
            solution: "Cảm biến LiDAR quét khoảng cách 3D, mô tơ rung phản hồi theo khoảng cách và camera OCR đọc chữ phát ra tai nghe.",
            techStack: "Cảm biến TF-Luna LiDAR, Module xử lý âm thanh DFPlayer, Động cơ rung mini rung đa điểm.",
            results: "Người dùng có thể phát hiện chướng ngại vật ở góc quét 45 độ với độ trễ phản hồi chỉ 50ms."
        }
    },
    {
        id: "khkt-06",
        title: "Chế phẩm sinh học bảo quản hoa quả tươi từ vỏ tôm và tinh dầu quế",
        category: "environment",
        categoryName: "Môi trường & Sinh học",
        badgeClass: "badge-environment",
        award: "Giải Nhất Tỉnh",
        desc: "Nghiên cứu chiết xuất màng bọc sinh học Chitosan từ phế phẩm vỏ tôm kết hợp hạt nano tinh dầu quế nhằm ức chế nấm mốc trên quả có múi.",
        tags: ["Chitosan", "Kháng khuẩn", "Hóa sinh", "Bảo quản nông sản"],
        author: "Đặng Mai Anh & Bùi Tuấn Kiệt",
        school: "THPT Lương Thế Vinh",
        avatar: "AK",
        details: {
            problem: "Hoa quả sau thu hoạch dễ bị thối hỏng do nấm bệnh, trong khi hóa chất bảo quản tổng hợp tiềm ẩn nguy cơ sức khỏe.",
            solution: "Tạo dung dịch màng phủ ăn được (edible coating) từ polymer sinh học tự nhiên thân thiện với môi trường.",
            techStack: "Chiết xuất Chitosan độ deacetyl 85%, Tinh dầu quế nguyên chất, Thử nghiệm kháng khuẩn đĩa thạch Agar.",
            results: "Kéo dài thời gian bảo quản cam quýt ở nhiệt độ thường lên đến 25 ngày mà không làm thay đổi hàm lượng đường và vitamin C."
        }
    }
];

// ==========================================
// 2. IDEA GENERATOR DATABASE
// ==========================================
const ideaDatabase = {
    iot: [
        {
            title: "Hệ thống giám sát chất lượng không khí trong lớp học và tự động kích hoạt lọc khí thông minh",
            goal: "Đo nồng độ bụi mịn PM2.5, CO2 và nhiệt ẩm để bảo vệ sức khỏe học đường, kết nối bảng điều khiển Web.",
            tech: "ESP32, Cảm biến bụi Plantower PMS7003, MQ-135, Bật quạt lọc HEPA qua Relay.",
            novelty: "Thuật toán điều khiển mờ (Fuzzy Logic) tự động tối ưu tốc độ gió, tiết kiệm điện 35%."
        },
        {
            title: "Thiết bị định vị và cảnh báo an toàn cho phao cứu sinh thông minh trên sông biển",
            goal: "Tự động phát tín hiệu SOS qua GPS và đèn chớp định vị khi người bơi gặp nạn trôi dạt.",
            tech: "Module GPS NEO-6M, Vi điều khiển nRF52840, Cảm biến gia tốc phát hiện vùng nước xoáy.",
            novelty: "Khả năng tự kích hoạt túi khí nổi và gửi tọa độ chính xác về trạm cứu hộ bờ biển."
        }
    ],
    env: [
        {
            title: "Tái chế bã mía và sợi lá dứa thành vật liệu cách nhiệt, tiêu âm thân thiện môi trường",
            goal: "Sản xuất tấm panel cách âm và chống nóng từ phế phẩm nông nghiệp thay thế xốp EPS và bông khoáng.",
            tech: "Kỹ thuật ép nhiệt sợi cellulose, chất kết dính sinh học từ tinh bột biến tính, kiểm tra truyền nhiệt ASTM.",
            novelty: "Hệ số dẫn nhiệt thấp 0.042 W/mK, khả năng tự phân hủy sinh học 100% trong đất sau 6 tháng."
        },
        {
            title: "Hệ thống lọc nước nhiễm mặn quy mô hộ gia đình sử dụng bấc thẩm thấu và thấu kính Fresnel",
            goal: "Cung cấp nước ngọt sinh hoạt cho bà con vùng đồng bằng sông Cửu Long bị xâm nhập mặn.",
            tech: "Thấu kính hội tụ Fresnel năng lượng mặt trời, vật liệu nano carbon siêu thấm, màng ngưng tụ đa tầng.",
            novelty: "Chi phí lắp đặt dưới 500.000 VNĐ, sản xuất được 8-12 lít nước tinh khiết mỗi ngày."
        }
    ],
    ai: [
        {
            title: "Trợ lý ảo AI hỗ trợ học sinh học phát âm tiếng Anh chuẩn ngữ điệu người bản ngữ",
            goal: "Chấm điểm phát âm từng âm tiết và phản hồi hình ảnh khẩu hình miệng trực quan.",
            tech: "Mô hình Whisper ASR + HuBERT, Framework PyTorch, Giao diện Web Audio API.",
            novelty: "Chạy trực tiếp trên trình duyệt máy tính phổ thông không cần kết nối máy chủ đám mây đắt tiền."
        },
        {
            title: "Hệ thống nhận diện bệnh lá lúa qua ảnh chụp camera điện thoại thông minh bằng MobileNetV3",
            goal: "Hỗ trợ nông dân chẩn đoán chính xác bệnh đạo ôn, đốm sọc, bạc lá và đề xuất phác đồ điều trị.",
            tech: "Flutter Mobile App, TensorFlow Lite, Google Cloud Firestore lưu trữ dữ liệu dịch tễ.",
            novelty: "Ứng dụng hoạt động Offline tại đồng ruộng không có sóng 4G/Wi-Fi."
        }
    ],
    med: [
        {
            title: "Vòng đeo tay theo dõi nhịp tim và phát hiện té ngã cho người cao tuổi truyền tin khẩn cấp",
            goal: "Cảnh báo ngay lập tức cho người thân qua cuộc gọi điện thoại tự động khi phát hiện cú ngã đột ngột.",
            tech: "Cảm biến quang học MAX30102, Cảm biến chuyển động 6 trục MPU6050, Module SIM A7680C 4G.",
            novelty: "Thuật toán lọc nhiễu sóng tim nâng cao, giảm tỷ lệ báo động giả dưới 2%."
        },
        {
            title: "Hộp đựng thuốc thông minh hẹn giờ và nhắc nhở uống thuốc tự động kết nối Zalo",
            goal: "Giúp bệnh nhân mãn tính uống thuốc đúng giờ, đúng liều lượng chỉ định của bác sĩ.",
            tech: "ESP8266, Khay chia thuốc xoay tự động bằng động cơ bước, Zalo Bot API thông báo cho con cháu.",
            novelty: "Tự khóa ngăn thuốc sau khi uống để tránh người già uống quá liều gây nguy hiểm."
        }
    ],
    stem: [
        {
            title: "Bộ thiết bị thí nghiệm ảo và mô hình trực quan hóa sóng dừng cơ học trong giảng dạy Vật lý",
            goal: "Giúp học sinh quan sát rõ ràng bụng sóng, nút sóng và đo chính xác vận tốc truyền sóng trên dây.",
            tech: "Máy phát tần số số DDS AD9833, Cầu H L298N kích rung loa, Cảm biến laser đo biên độ.",
            novelty: "Tích hợp màn hình OLED hiển thị tần số quét liên tục từ 1Hz đến 2000Hz."
        },
        {
            title: "Mô hình nhà kính thông minh mini tích hợp bộ kit học tập lập trình STEM cho học sinh THCS",
            goal: "Bộ kit thực hành giáo dục STEM liên môn Sinh học - Công nghệ - Tin học dễ lắp ráp.",
            tech: "Khung lắp ráp Lego tương thích, Vi điều khiển Micro:bit, Đèn LED quang phổ bổ sung quang hợp.",
            novelty: "Đi kèm sách cẩm nang 10 bài thực hành trải nghiệm chuẩn chương trình GDPT 2018."
        }
    ]
};

// ==========================================
// 3. INITIALIZATION & DOM EVENTS
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    // Render initial projects
    renderProjects(projectsData);

    // Initialize Components
    initTheme();
    initStatsCounter();
    initFiltersAndSearch();
    initIdeaGenerator();
    initModals();
    initForm();
    initDownloads();
    initNavbarScroll();
});

// ==========================================
// 4. THEME TOGGLE FUNCTIONALITY
// ==========================================
function initTheme() {
    const themeBtn = document.getElementById("theme-toggle");
    const currentTheme = localStorage.getItem("khkt-theme") || "dark";
    document.body.setAttribute("data-theme", currentTheme);

    themeBtn.addEventListener("click", () => {
        const theme = document.body.getAttribute("data-theme") === "dark" ? "light" : "dark";
        document.body.setAttribute("data-theme", theme);
        localStorage.setItem("khkt-theme", theme);
        showToast(`Đã chuyển sang giao diện ${theme === "dark" ? "Tối" : "Sáng"}`, "info");
    });
}

// ==========================================
// 5. RENDER PROJECTS FUNCTION
// ==========================================
function renderProjects(projects) {
    const grid = document.getElementById("projects-grid");
    const noResults = document.getElementById("no-results");

    if (!grid) return;

    if (projects.length === 0) {
        grid.innerHTML = "";
        noResults.classList.remove("hidden");
        return;
    }

    noResults.classList.add("hidden");
    grid.innerHTML = projects.map(p => `
        <article class="project-card" data-id="${p.id}">
            <div class="card-top">
                <span class="card-category-badge ${p.badgeClass}">${p.categoryName}</span>
                <span class="card-award">
                    <i data-lucide="award"></i> ${p.award}
                </span>
            </div>

            <div class="card-main">
                <h3 class="card-title">${p.title}</h3>
                <p class="card-desc">${p.desc}</p>
                <div class="card-tags">
                    ${p.tags.map(t => `<span class="card-tag">#${t}</span>`).join("")}
                </div>
            </div>

            <div class="card-footer">
                <div class="author-info">
                    <div class="author-avatar">${p.avatar}</div>
                    <div>
                        <div class="author-name">${p.author}</div>
                        <div class="author-school">${p.school}</div>
                    </div>
                </div>
                <button class="btn-card-detail" data-id="${p.id}">
                    <span>Chi tiết</span>
                    <i data-lucide="arrow-right"></i>
                </button>
            </div>
        </article>
    `).join("");

    // Re-initialize Lucide Icons for dynamic content
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // Attach click events for details button
    document.querySelectorAll(".btn-card-detail").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const cardId = e.currentTarget.getAttribute("data-id");
            openProjectModal(cardId);
        });
    });
}

// ==========================================
// 6. FILTER & SEARCH HANDLER
// ==========================================
function initFiltersAndSearch() {
    const searchInput = document.getElementById("project-search");
    const clearBtn = document.getElementById("clear-search-btn");
    const filterBtns = document.querySelectorAll(".filter-btn");

    let currentFilter = "all";
    let searchQuery = "";

    function filterData() {
        const filtered = projectsData.filter(p => {
            const matchCategory = currentFilter === "all" || p.category === currentFilter;
            const query = searchQuery.toLowerCase().trim();
            const matchSearch = query === "" || 
                p.title.toLowerCase().includes(query) ||
                p.desc.toLowerCase().includes(query) ||
                p.author.toLowerCase().includes(query) ||
                p.tags.some(tag => tag.toLowerCase().includes(query));
            return matchCategory && matchSearch;
        });

        renderProjects(filtered);
    }

    // Search Input
    searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value;
        clearBtn.classList.toggle("active", searchQuery.length > 0);
        filterData();
    });

    // Clear Search
    clearBtn.addEventListener("click", () => {
        searchInput.value = "";
        searchQuery = "";
        clearBtn.classList.remove("active");
        filterData();
        searchInput.focus();
    });

    // Filter Buttons
    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentFilter = btn.getAttribute("data-filter");
            filterData();
        });
    });
}

// ==========================================
// 7. IDEA GENERATOR ENGINE
// ==========================================
function initIdeaGenerator() {
    const generateBtn = document.getElementById("btn-generate-idea");
    const fieldSelect = document.getElementById("gen-field");
    const levelSelect = document.getElementById("gen-level");

    const resCard = document.getElementById("generated-result");
    const resTag = document.getElementById("res-tag");
    const resLevel = document.getElementById("res-level");
    const resTitle = document.getElementById("res-title");
    const resGoal = document.getElementById("res-goal");
    const resTech = document.getElementById("res-tech");
    const resNovelty = document.getElementById("res-novelty");

    generateBtn.addEventListener("click", () => {
        const field = fieldSelect.value;
        const levelText = levelSelect.options[levelSelect.selectedIndex].text;
        const fieldName = fieldSelect.options[fieldSelect.selectedIndex].text;

        const ideas = ideaDatabase[field] || ideaDatabase.iot;
        const randomIdea = ideas[Math.floor(Math.random() * ideas.length)];

        // Add subtle animation
        resCard.style.opacity = "0";
        resCard.style.transform = "translateY(10px)";

        setTimeout(() => {
            resTag.textContent = `Lĩnh vực: ${fieldName.split('(')[0]}`;
            resLevel.textContent = `Đề xuất: ${levelText}`;
            resTitle.textContent = randomIdea.title;
            resGoal.textContent = randomIdea.goal;
            resTech.textContent = randomIdea.tech;
            resNovelty.textContent = randomIdea.novelty;

            resCard.style.transition = "all 0.35s ease";
            resCard.style.opacity = "1";
            resCard.style.transform = "translateY(0)";

            showToast("Đã tạo ý tưởng nghiên cứu mới!", "success");
        }, 150);
    });
}

// ==========================================
// 8. PROJECT MODAL POPUP
// ==========================================
function initModals() {
    const modal = document.getElementById("project-modal");
    const closeBtn = document.getElementById("modal-close-btn");

    closeBtn.addEventListener("click", () => {
        modal.classList.add("hidden");
    });

    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.classList.add("hidden");
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && !modal.classList.contains("hidden")) {
            modal.classList.add("hidden");
        }
    });
}

function openProjectModal(projectId) {
    const project = projectsData.find(p => p.id === projectId);
    if (!project) return;

    const modal = document.getElementById("project-modal");
    const body = document.getElementById("modal-body-content");

    body.innerHTML = `
        <div style="margin-bottom: 1.5rem;">
            <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.75rem;">
                <span class="card-category-badge ${project.badgeClass}">${project.categoryName}</span>
                <span class="card-award"><i data-lucide="award"></i> ${project.award}</span>
            </div>
            <h2 style="font-size: 1.6rem; line-height: 1.35; margin-bottom: 0.5rem;">${project.title}</h2>
            <div style="font-size: 0.9rem; color: var(--text-muted);">
                Tác giả: <strong>${project.author}</strong> - Đơn vị: <strong>${project.school}</strong>
            </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 1.25rem; border-top: 1px solid var(--border-color); padding-top: 1.25rem;">
            <div>
                <h4 style="color: var(--primary); display: flex; align-items: center; gap: 0.4rem; font-size: 1rem; margin-bottom: 0.4rem;">
                    <i data-lucide="help-circle"></i> 1. Đặt vấn đề & Mục tiêu:
                </h4>
                <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6;">${project.details.problem}</p>
            </div>

            <div>
                <h4 style="color: var(--accent-emerald); display: flex; align-items: center; gap: 0.4rem; font-size: 1rem; margin-bottom: 0.4rem;">
                    <i data-lucide="check-circle-2"></i> 2. Giải pháp nghiên cứu:
                </h4>
                <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6;">${project.details.solution}</p>
            </div>

            <div>
                <h4 style="color: var(--secondary); display: flex; align-items: center; gap: 0.4rem; font-size: 1rem; margin-bottom: 0.4rem;">
                    <i data-lucide="cpu"></i> 3. Công nghệ & Thiết bị chế tạo:
                </h4>
                <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6;">${project.details.techStack}</p>
            </div>

            <div>
                <h4 style="color: var(--accent-amber); display: flex; align-items: center; gap: 0.4rem; font-size: 1rem; margin-bottom: 0.4rem;">
                    <i data-lucide="bar-chart-3"></i> 4. Kết quả thực nghiệm đạt được:
                </h4>
                <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6;">${project.details.results}</p>
            </div>
        </div>

        <div style="margin-top: 2rem; display: flex; justify-content: flex-end; gap: 0.75rem;">
            <button class="btn btn-secondary btn-sm download-trigger" data-filename="Bao_Cao_${project.id}.pdf">
                <i data-lucide="file-down"></i> Tải báo cáo tóm tắt
            </button>
        </div>
    `;

    modal.classList.remove("hidden");
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // Re-bind download on dynamic modal
    body.querySelectorAll(".download-trigger").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const filename = e.currentTarget.getAttribute("data-filename");
            simulateDownload(filename);
        });
    });
}

// ==========================================
// 9. ANIMATED NUMBER COUNTER (INTERSECTION OBSERVER)
// ==========================================
function initStatsCounter() {
    const statElements = document.querySelectorAll(".stat-number");
    let animated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                statElements.forEach(el => {
                    const target = parseInt(el.getAttribute("data-target"), 10);
                    let count = 0;
                    const duration = 1500;
                    const stepTime = Math.abs(Math.floor(duration / (target || 1)));

                    const timer = setInterval(() => {
                        count += Math.ceil(target / 40);
                        if (count >= target) {
                            el.textContent = target;
                            clearInterval(timer);
                        } else {
                            el.textContent = count;
                        }
                    }, 30);
                });
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector(".hero-stats");
    if (statsSection) {
        observer.observe(statsSection);
    }
}

// ==========================================
// 10. SUBMISSION FORM HANDLER
// ==========================================
function initForm() {
    const form = document.getElementById("submission-form");
    const submitBtn = document.getElementById("btn-submit-form");

    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const authorName = document.getElementById("author-name").value;
        const projectName = document.getElementById("project-name").value;

        // Button loading state
        const originalContent = submitBtn.innerHTML;
        submitBtn.innerHTML = `<span>Đang gửi thông tin...</span>`;
        submitBtn.disabled = true;

        setTimeout(() => {
            submitBtn.innerHTML = originalContent;
            submitBtn.disabled = false;
            form.reset();

            showToast(`Cảm ơn bạn ${authorName}! Đề tài "${projectName}" đã được gửi thành công. Ban Cố Vấn sẽ liên hệ sớm nhất.`, "success");
            if (window.lucide) window.lucide.createIcons();
        }, 1000);
    });

    // Newsletter footer
    const subBtn = document.getElementById("sub-btn");
    const subEmail = document.getElementById("sub-email");
    if (subBtn && subEmail) {
        subBtn.addEventListener("click", () => {
            if (subEmail.value && subEmail.value.includes("@")) {
                showToast("Đăng ký nhận bản tin KHKT thành công!", "success");
                subEmail.value = "";
            } else {
                showToast("Vui lòng nhập địa chỉ email hợp lệ.", "info");
            }
        });
    }
}

// ==========================================
// 11. DOCUMENT DOWNLOAD SIMULATOR
// ==========================================
function initDownloads() {
    document.querySelectorAll(".download-trigger").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const filename = e.currentTarget.getAttribute("data-filename") || "Tai_Lieu_KHKT.docx";
            simulateDownload(filename);
        });
    });
}

function simulateDownload(filename) {
    showToast(`Đang tải xuống: ${filename} (Lưu tại D:/KHKT/...)`, "success");
}

// ==========================================
// 12. NAVBAR SCROLL & ACTIVE LINK TRACKING
// ==========================================
function initNavbarScroll() {
    const navbar = document.getElementById("navbar");
    const mobileToggle = document.getElementById("mobile-toggle");
    const navMenu = document.getElementById("nav-menu");
    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll("section[id]");

    window.addEventListener("scroll", () => {
        if (window.scrollY > 40) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }

        // Active link tracking
        let current = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${current}`) {
                link.classList.add("active");
            }
        });
    });

    // Mobile Toggle
    if (mobileToggle) {
        mobileToggle.addEventListener("click", () => {
            navMenu.classList.toggle("open");
        });
    }

    // Close menu when clicking nav link
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            if (navMenu.classList.contains("open")) {
                navMenu.classList.remove("open");
            }
        });
    });
}

// ==========================================
// 13. TOAST NOTIFICATION SYSTEM
// ==========================================
function showToast(message, type = "info") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    
    const icon = type === "success" ? "check-circle-2" : "info";
    toast.innerHTML = `
        <i data-lucide="${icon}"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);
    if (window.lucide) window.lucide.createIcons();

    setTimeout(() => {
        toast.style.transition = "all 0.4s ease";
        toast.style.opacity = "0";
        toast.style.transform = "translateX(100%)";
        setTimeout(() => {
            toast.remove();
        }, 400);
    }, 3800);
}
