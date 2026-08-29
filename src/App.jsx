import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import Breadcrumb from './components/Breadcrumb';
import HeroBanner from './components/HeroBanner';
import QuickActionCards from './components/QuickActionCards';
import HistorySection from './components/HistorySection';
import InfoSidebar from './components/InfoSidebar';
import FlipCardGrid from './components/FlipCardGrid';
import StatsCounterSection from './components/StatsCounterSection';
import InvestigationSection from './components/InvestigationSection';
import NextMonumentSection from './components/NextMonumentSection';
import AudioNarratorModal from './components/AudioNarratorModal';
import VideoModal from './components/VideoModal';
import InvestigationModal from './components/InvestigationModal';
import StudentReportModal from './components/StudentReportModal';
import NextMonumentModal from './components/NextMonumentModal';
import LightboxModal from './components/LightboxModal';
import ActionModal from './components/ActionModal';
import DocsModal from './components/DocsModal';
import MyMapModal from './components/MyMapModal';
import MilestoneModal from './components/MilestoneModal';
import AdminEditDrawer from './components/AdminEditDrawer';
import ContributeModal from './components/ContributeModal';
import MonumentsExplorerModal from './components/MonumentsExplorerModal';
import MonumentSwitcherBar from './components/MonumentSwitcherBar';
import ScrollProgressBar from './components/ScrollProgressBar';
import ScrollReveal from './components/ScrollReveal';
import Footer from './components/Footer';
import { allMonumentsList, getMonumentByIdOrStt } from './data/allMonumentsData';

const CONTRIBUTIONS_KEY = 'di_san_so_contributions_v4';

const initialSampleContributions = [
  {
    id: 'contrib_sample_1',
    authorName: 'Trần Hoàng Nam',
    authorRole: 'Giáo viên Lịch sử, THPT Nguyễn Thị Minh Khai',
    authorContact: 'nam.tran.history@gmail.com',
    type: 'monument',
    title: 'Bảo Tàng Chứng Tích Chiến Tranh',
    name: 'Bảo Tàng Chứng Tích Chiến Tranh',
    category: 'Bảo tàng & Địa điểm lưu niệm',
    ranking: 'Di tích Lịch sử cấp Quốc gia',
    address: '28 Võ Văn Tần, Phường Võ Thị Sáu, Quận 3, TP.HCM',
    summary: 'Nơi trưng bày hơn 20.000 tài liệu, hiện vật và phim ảnh về cuộc chiến tranh và các hậu quả đối với nhân dân Việt Nam, gửi gắm thông điệp khát vọng hòa bình sâu sắc.',
    highlight: 'Bảo tàng tiêu biểu nằm trong top các điểm đến lịch sử thu hút đông đảo du khách trong nước và quốc tế nhất TP.HCM.',
    image: '/assets/images/dia-dao-long-phuoc.jpg',
    submittedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    status: 'pending',
    targetSection: 'nextMonuments'
  },
  {
    id: 'contrib_sample_2',
    authorName: 'Nguyễn Lê Thu Trang',
    authorRole: 'Sinh viên ĐHQG TP.HCM',
    authorContact: 'trang.nguyen@student.vn',
    type: 'gallery',
    title: 'Hiện vật: Điện thoại tác chiến và bản đồ chỉ huy 1975',
    year: 'Tháng 4/1975',
    caption: 'Hệ thống máy điện thoại vô tuyến và bản đồ tác chiến của Quân đoàn 2 trong chiến dịch giải phóng Sài Gòn.',
    source: 'Tư liệu Viện Lịch sử Quân sự Việt Nam',
    image: '/assets/images/may-danh-chu-hien-vat.jpg',
    submittedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    status: 'pending',
    targetSection: 'gallery'
  },
  {
    id: 'contrib_sample_3',
    authorName: 'Bác Phạm Văn Hùng',
    authorRole: 'Cựu chiến binh TP. Thủ Đức',
    authorContact: '0903.882.xxx',
    type: 'timeline',
    year: '15–21/11/1975',
    title: 'Hội nghị Hiệp thương chính trị thống nhất Tổ quốc tại Dinh',
    description: 'Hội nghị Hiệp thương chính trị thống nhất hai miền Nam - Bắc được tổ chức trọng thể tại Hội trường chính Dinh Độc Lập, quyết định tổng tuyển cử bầu Quốc hội chung của cả nước.',
    submittedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    status: 'pending',
    targetSection: 'timeline'
  }
];

function getInitialStt() {
  if (typeof window !== 'undefined') {
    const hash = window.location.hash;
    if (hash) {
      const match = hash.match(/\d+/);
      if (match) {
        const parsed = parseInt(match[0]);
        if (parsed >= 1 && parsed <= allMonumentsList.length) return parsed;
      }
    }
    const params = new URLSearchParams(window.location.search);
    const sttParam = params.get('stt') || params.get('id');
    if (sttParam) {
      const parsed = parseInt(sttParam);
      if (parsed >= 1 && parsed <= allMonumentsList.length) return parsed;
    }
  }
  return 1;
}

export default function App() {
  // Current active monument index/STT (1 to 103)
  const [currentStt, setCurrentStt] = useState(getInitialStt);

  // Dynamic monument base data from 103 list
  const baseMonument = useMemo(() => {
    return getMonumentByIdOrStt(currentStt);
  }, [currentStt]);

  // Load saved modifications for the current monument or use base
  const storageKey = `di_san_so_monument_stt_${currentStt}`;
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse localStorage data:', e);
    }
    return baseMonument;
  });

  // When currentStt changes, update active data
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`di_san_so_monument_stt_${currentStt}`);
      if (saved) {
        setData(JSON.parse(saved));
      } else {
        setData(baseMonument);
      }
    } catch (e) {
      setData(baseMonument);
    }
    window.location.hash = `monument-${currentStt}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStt, baseMonument]);

  // Handle URL hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const newStt = getInitialStt();
      if (newStt !== currentStt) {
        setCurrentStt(newStt);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentStt]);

  // Calculate next 3 monuments in circular sequence
  const nextMonumentsForSection = useMemo(() => {
    const nextList = [];
    const total = allMonumentsList.length;
    for (let i = 1; i <= 3; i++) {
      const nextIdx = (currentStt - 1 + i) % total;
      const mon = allMonumentsList[nextIdx];
      nextList.push({
        id: mon.id,
        stt: mon.stt,
        name: mon.info.name,
        category: mon.info.type,
        ranking: mon.info.ranking,
        address: mon.info.address,
        image: mon.info.heroImage,
        summary: mon.info.overview.slice(0, 140) + '...',
        highlight: `Di tích ${mon.info.ranking} tại ${mon.info.address}.`,
        fullData: mon
      });
    }
    return nextList;
  }, [currentStt]);

  // State: Contributions (Data collected from readers)
  const [contributions, setContributions] = useState(() => {
    try {
      const saved = localStorage.getItem(CONTRIBUTIONS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse contributions:', e);
    }
    return initialSampleContributions;
  });

  // Modals & Drawers state
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [contributeModalOpen, setContributeModalOpen] = useState(false);
  const [explorerModalOpen, setExplorerModalOpen] = useState(false);

  const [audioModalOpen, setAudioModalOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [docsModalOpen, setDocsModalOpen] = useState(false);
  const [myMapModalOpen, setMyMapModalOpen] = useState(false);

  // Student report modal
  const [studentReportOpen, setStudentReportOpen] = useState(false);

  // Next monument modal
  const [nextMonumentModalOpen, setNextMonumentModalOpen] = useState(false);
  const [selectedNextMonument, setSelectedNextMonument] = useState(null);

  // Lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Investigation modal
  const [investigationModalOpen, setInvestigationModalOpen] = useState(false);
  const [selectedDossier, setSelectedDossier] = useState(null);
  const [investigationMode, setInvestigationMode] = useState('dossier');

  // Milestone modal
  const [milestoneModalOpen, setMilestoneModalOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState(null);

  // Save changes helper for website data
  const handleSaveData = (newData) => {
    setData(newData);
    try {
      localStorage.setItem(`di_san_so_monument_stt_${currentStt}`, JSON.stringify(newData));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  };

  const handleSaveContributions = (newContribs) => {
    setContributions(newContribs);
    try {
      localStorage.setItem(CONTRIBUTIONS_KEY, JSON.stringify(newContribs));
    } catch (e) {
      console.error('Failed to save contributions:', e);
    }
  };

  const handleResetDefault = () => {
    setData(baseMonument);
    try {
      localStorage.removeItem(`di_san_so_monument_stt_${currentStt}`);
    } catch (e) {}
  };

  // Handler: Reader submits new data contribution
  const handleAddContribution = (newContrib) => {
    const updated = [newContrib, ...contributions];
    handleSaveContributions(updated);
  };

  // Handler: Owner/Admin Approves & Publishes reader data to the active monument
  const handleApproveContribution = (item) => {
    const updatedContribs = contributions.map(c => 
      c.id === item.id ? { ...c, ...item, status: 'approved' } : c
    );
    handleSaveContributions(updatedContribs);

    const updatedData = { ...data };

    if (item.type === 'monument') {
      const newMonument = {
        id: item.id,
        name: item.title || item.name,
        category: item.category || item.ranking || 'Địa chỉ đỏ cách mạng',
        ranking: item.ranking || item.category || 'Di tích cấp Quốc gia',
        address: item.address || 'TP. Hồ Chí Minh',
        image: item.image || '/assets/images/dinh-doc-lap-front.jpg',
        summary: item.summary || item.caption || '',
        highlight: item.highlight || 'Di tích lịch sử văn hóa tiêu biểu do độc giả đóng góp.'
      };
      
      const existingIdx = (updatedData.nextMonuments || []).findIndex(m => m.id === item.id);
      if (existingIdx >= 0) {
        updatedData.nextMonuments[existingIdx] = newMonument;
      } else {
        updatedData.nextMonuments = [...(updatedData.nextMonuments || []), newMonument];
      }
    } else if (item.type === 'gallery') {
      const newGalleryItem = {
        id: Date.now(),
        src: item.image || '/assets/images/dinh-doc-lap-front.jpg',
        title: item.title,
        caption: item.caption || item.summary || '',
        year: item.year || 'Tư liệu độc giả'
      };
      updatedData.gallery = [newGalleryItem, ...(updatedData.gallery || [])];
    } else if (item.type === 'timeline') {
      const newTimelineItem = {
        id: Date.now(),
        year: item.year || 'Mốc lịch sử',
        title: item.title,
        description: item.description || item.summary || item.caption || ''
      };
      updatedData.timeline = [...(updatedData.timeline || []), newTimelineItem];
    } else if (item.type === 'story') {
      const newStoryDossier = {
        id: 'story_' + Date.now(),
        title: item.title,
        subtitle: `Tư liệu do ${item.authorName} cung cấp (${item.source || 'Nhân chứng'})`,
        image: item.image || '/assets/images/may-danh-chu-hien-vat.jpg',
        detail: item.caption || item.summary || '',
        clues: [
          `Đóng góp bởi: ${item.authorName} (${item.authorRole})`,
          `Nguồn tư liệu: ${item.source || 'Ký ức nhân chứng'}`,
          `Ngày tiếp nhận: ${new Date(item.submittedAt || Date.now()).toLocaleDateString('vi-VN')}`
        ]
      };
      updatedData.investigation = {
        ...updatedData.investigation,
        dossiers: [...(updatedData.investigation?.dossiers || []), newStoryDossier]
      };
    }

    handleSaveData(updatedData);
  };

  const handleRejectContribution = (id, reason = '') => {
    const updatedContribs = contributions.map(c => 
      c.id === id ? { ...c, status: 'rejected', adminNotes: reason } : c
    );
    handleSaveContributions(updatedContribs);
  };

  const handleDeleteContribution = (id) => {
    const updatedContribs = contributions.filter(c => c.id !== id);
    handleSaveContributions(updatedContribs);
  };

  const handleRevokeContribution = (item) => {
    const updatedContribs = contributions.map(c => 
      c.id === item.id ? { ...c, status: 'pending' } : c
    );
    handleSaveContributions(updatedContribs);
  };

  const handleSeedSampleContributions = () => {
    handleSaveContributions(initialSampleContributions);
    alert('Đã nạp 3 dữ liệu đóng góp mẫu đang chờ duyệt!');
  };

  const handleUpdateInfo = (key, val) => {
    const updated = { ...data, info: { ...data.info, [key]: val } };
    handleSaveData(updated);
  };

  const handleUpdateOverview = (newOverview) => {
    const updated = { ...data, info: { ...data.info, overview: newOverview } };
    handleSaveData(updated);
  };

  const handleOpenLightbox = (index = 0) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handleOpenDossier = (dossier) => {
    setSelectedDossier(dossier);
    setInvestigationMode('dossier');
    setInvestigationModalOpen(true);
  };

  const handleStartQuiz = () => {
    setInvestigationMode('quiz');
    setInvestigationModalOpen(true);
  };

  const handleOpenMilestone = (milestone) => {
    setSelectedMilestone(milestone);
    setMilestoneModalOpen(true);
  };

  const handleSelectNextMonument = (monument) => {
    if (monument && monument.stt) {
      setCurrentStt(monument.stt);
    } else if (monument && monument.fullData) {
      setCurrentStt(monument.fullData.stt);
    } else {
      setSelectedNextMonument(monument);
      setNextMonumentModalOpen(true);
    }
  };

  const handleNavigate = (page) => {
    if (page === 'map') setMyMapModalOpen(true);
    else if (page === 'monuments') setExplorerModalOpen(true);
    else if (page === 'investigation') {
      const el = document.getElementById('investigation-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (page === 'game') {
      handleStartQuiz();
    } else if (page === 'about') {
      setDocsModalOpen(true);
    } else if (page === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const pendingContributionsCount = contributions.filter(c => c.status === 'pending').length;

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2C241E] flex flex-col font-sans relative selection:bg-amber-200 selection:text-[#7B1113]">
      {/* Scroll Progress Bar at very top */}
      <ScrollProgressBar />

      {/* Edit Mode Notice Banner */}
      {isEditMode && (
        <div className="bg-amber-500 text-white text-xs py-2 px-4 text-center font-bold sticky top-0 z-50 shadow-md flex items-center justify-center gap-3">
          <span>🛠️ Đang bật Chế độ Chỉnh sửa trực tiếp di tích #{currentStt}: {data.info.name}</span>
          <button
            onClick={() => setIsAdminOpen(true)}
            className="px-2.5 py-0.5 rounded bg-white text-amber-900 text-xs font-black shadow hover:bg-amber-100 cursor-pointer"
          >
            Mở Bảng Quản trị CMS
          </button>
          <button
            onClick={() => setIsEditMode(false)}
            className="px-2 py-0.5 rounded bg-amber-700 text-white text-xs hover:bg-amber-800 cursor-pointer"
          >
            Đóng
          </button>
        </div>
      )}

      {/* Sticky Header with 103 Monument branding & controls */}
      <Header
        monumentName={data.info.name}
        monumentRanking={data.info.ranking}
        monumentStt={currentStt}
        isEditMode={isEditMode}
        setIsEditMode={setIsEditMode}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenContribute={() => setContributeModalOpen(true)}
        onOpenExplorer={() => setExplorerModalOpen(true)}
        pendingContributionsCount={pendingContributionsCount}
        onNavigate={handleNavigate}
      />

      {/* 103 Monument Quick Switcher Bar */}
      <MonumentSwitcherBar
        currentStt={currentStt}
        onSelectStt={(stt) => setCurrentStt(stt)}
        onOpenExplorer={() => setExplorerModalOpen(true)}
      />

      {/* Breadcrumb Bar */}
      <Breadcrumb
        monumentName={data.info.name}
        onNavigate={handleNavigate}
      />

      {/* Main Container */}
      <main className="flex-1 space-y-6 pb-6">
        {/* Hero Banner */}
        <HeroBanner
          info={data.info}
          onOpenAudio={() => setAudioModalOpen(true)}
          onOpenVideo={() => setVideoModalOpen(true)}
          onOpenGallery={() => handleOpenLightbox(0)}
          isEditMode={isEditMode}
          onUpdateInfo={handleUpdateInfo}
        />

        {/* Quick Action Cards (4 cards: KHÁM PHÁ - ĐIỀU TRA - ĐÓNG GÓP - HÀNH ĐỘNG) */}
        <QuickActionCards
          onOpenAudio={() => setAudioModalOpen(true)}
          onOpenInvestigation={() => {
            const el = document.getElementById('investigation-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenAction={() => setActionModalOpen(true)}
          onOpenContribute={() => setContributeModalOpen(true)}
        />

        {/* Scroll Reveal Section: Giá trị lịch sử & Thông tin di tích */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <ScrollReveal>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column (8 cols): Giá trị lịch sử, Dấu mốc lịch sử, Hình ảnh và video lịch sử */}
              <div className="lg:col-span-8">
                <HistorySection
                  overview={data.info.overview}
                  timeline={data.timeline}
                  gallery={data.gallery}
                  isEditMode={isEditMode}
                  onUpdateOverview={handleUpdateOverview}
                  onOpenLightbox={handleOpenLightbox}
                  onOpenMilestoneDetail={handleOpenMilestone}
                  onOpenVideo={() => setVideoModalOpen(true)}
                />
              </div>

              {/* Right Column (4 cols): Bảng thông tin, Nút nghe thuyết minh, Vị trí di tích, Em có biết */}
              <div className="lg:col-span-4">
                <InfoSidebar
                  info={data.info}
                  map={data.map}
                  isEditMode={isEditMode}
                  onUpdateInfo={handleUpdateInfo}
                  onOpenAudio={() => setAudioModalOpen(true)}
                  onOpenDocsModal={() => setDocsModalOpen(true)}
                  onOpenMyMap={() => setMyMapModalOpen(true)}
                />
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Stats Counter Section */}
        <StatsCounterSection />

        {/* FlipCardGrid (3D Flip Cards for 6 Interdisciplinary Subjects) */}
        <FlipCardGrid />

        {/* HỒ SƠ ĐIỀU TRA */}
        <div id="investigation-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <ScrollReveal>
            <InvestigationSection
              investigation={data.investigation}
              onOpenDossierDetail={handleOpenDossier}
              onStartQuiz={handleStartQuiz}
              onOpenStudentReport={() => setStudentReportOpen(true)}
            />
          </ScrollReveal>
        </div>

        {/* Next Monument Section: Gợi ý các di tích tiếp theo trong 103 di tích */}
        <ScrollReveal>
          <NextMonumentSection
            nextMonuments={nextMonumentsForSection}
            onSelectMonument={handleSelectNextMonument}
          />
        </ScrollReveal>
      </main>

      {/* Footer */}
      <Footer />

      {/* 103 Monuments Explorer Directory Modal */}
      <MonumentsExplorerModal
        isOpen={explorerModalOpen}
        onClose={() => setExplorerModalOpen(false)}
        currentMonumentStt={currentStt}
        onSelectMonument={(monument) => setCurrentStt(monument.stt)}
      />

      {/* Reader Contribution Modal */}
      <ContributeModal
        isOpen={contributeModalOpen}
        onClose={() => setContributeModalOpen(false)}
        onSubmitContribution={handleAddContribution}
        existingContributions={contributions}
      />

      {/* Audio Narrator Modal with Studio & Drive Audio support */}
      <AudioNarratorModal
        isOpen={audioModalOpen}
        onClose={() => setAudioModalOpen(false)}
        audioScript={data.audioScript}
        monumentName={data.info.name}
      />

      <VideoModal
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
        videoInfo={data.video}
      />

      <InvestigationModal
        isOpen={investigationModalOpen}
        onClose={() => setInvestigationModalOpen(false)}
        dossier={selectedDossier}
        quiz={data.investigation?.quiz}
        monumentName={data.info.name}
        mode={investigationMode}
        onSwitchToQuiz={() => setInvestigationMode('quiz')}
      />

      <StudentReportModal
        isOpen={studentReportOpen}
        onClose={() => setStudentReportOpen(false)}
        investigation={data.investigation}
        monumentName={data.info.name}
      />

      <NextMonumentModal
        isOpen={nextMonumentModalOpen}
        onClose={() => setNextMonumentModalOpen(false)}
        monument={selectedNextMonument}
      />

      <LightboxModal
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={data.gallery}
        currentIndex={lightboxIndex}
        setCurrentIndex={setLightboxIndex}
      />

      <ActionModal
        isOpen={actionModalOpen}
        onClose={() => setActionModalOpen(false)}
      />

      <DocsModal
        isOpen={docsModalOpen}
        onClose={() => setDocsModalOpen(false)}
      />

      <MyMapModal
        isOpen={myMapModalOpen}
        onClose={() => setMyMapModalOpen(false)}
        embedUrl={data.map?.googleMapsEmbedUrl}
        currentMonumentStt={currentStt}
        onSelectMonument={(monument) => setCurrentStt(monument.stt)}
      />

      <MilestoneModal
        isOpen={milestoneModalOpen}
        onClose={() => setMilestoneModalOpen(false)}
        milestone={selectedMilestone}
      />

      <AdminEditDrawer
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        data={data}
        onSaveData={handleSaveData}
        onResetDefault={handleResetDefault}
        contributions={contributions}
        onApproveContribution={handleApproveContribution}
        onRejectContribution={handleRejectContribution}
        onDeleteContribution={handleDeleteContribution}
        onSeedSampleContributions={handleSeedSampleContributions}
        onRevokeContribution={handleRevokeContribution}
      />
    </div>
  );
}
