import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import HomePage from './components/HomePage';
import HeroBanner from './components/HeroBanner';
import QuickActionCards from './components/QuickActionCards';
import MonumentMediaAndLocationSection from './components/MonumentMediaAndLocationSection';
import HistorySection from './components/HistorySection';
import InfoSidebar from './components/InfoSidebar';
import FlipCardGrid from './components/FlipCardGrid';
import StatsCounterSection from './components/StatsCounterSection';
import ThreeKeyHighlightsSection from './components/ThreeKeyHighlightsSection';
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

function getInitialStateFromUrl() {
  if (typeof window !== 'undefined') {
    const hash = window.location.hash;
    if (hash && hash.includes('monument')) {
      const match = hash.match(/\d+/);
      if (match) {
        const parsed = parseInt(match[0]);
        if (parsed >= 1 && parsed <= allMonumentsList.length) {
          return { stt: parsed, mode: 'detail' };
        }
      }
      return { stt: 1, mode: 'detail' };
    }
    const params = new URLSearchParams(window.location.search);
    const sttParam = params.get('stt') || params.get('id');
    if (sttParam) {
      const parsed = parseInt(sttParam);
      if (parsed >= 1 && parsed <= allMonumentsList.length) {
        return { stt: parsed, mode: 'detail' };
      }
    }
  }
  return { stt: 1, mode: 'home' };
}

export default function App() {
  const initial = getInitialStateFromUrl();
  const [viewMode, setViewMode] = useState(initial.mode);
  const [currentStt, setCurrentStt] = useState(initial.stt);

  const baseMonument = useMemo(() => {
    return getMonumentByIdOrStt(currentStt);
  }, [currentStt]);

  const storageKey = `di_san_so_v10_monument_stt_${currentStt}`;

  const mergeWithBase = (base, saved) => {
    if (!saved) return base;
    return {
      ...base,
      ...saved,
      gallery: base.gallery, // Luôn đồng bộ danh sách ảnh thực tế từ Google Drive
      info: {
        ...base.info,
        ...(saved.info || {}),
        heroImage: base.info.heroImage, // Luôn ưu tiên ảnh đại diện thực tế từ Google Drive của di tích
        emCoBiet: base.info?.emCoBiet || [],
        driveReferenceData: base.info?.driveReferenceData || null
      },
      keyHighlights: base.keyHighlights || saved.keyHighlights,
      subjects6: base.subjects6 || saved.subjects6,
      investigation: {
        ...base.investigation,
        ...(saved.investigation || {}),
        investigationQuestion: base.investigation?.investigationQuestion || saved.investigation?.investigationQuestion,
        driveReferenceData: base.investigation?.driveReferenceData || null,
        dossier: base.investigation?.dossier || null,
        flashcards: base.investigation?.flashcards || saved.investigation?.flashcards,
        matchingPairs: base.investigation?.matchingPairs || saved.investigation?.matchingPairs
      }
    };
  };

  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return mergeWithBase(baseMonument, JSON.parse(saved));
    } catch (e) {
      console.warn('Failed to parse localStorage data:', e);
    }
    return baseMonument;
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setData(mergeWithBase(baseMonument, JSON.parse(saved)));
        return;
      }
    } catch (e) {
      console.warn('Failed to parse localStorage data:', e);
    }
    setData(baseMonument);
  }, [currentStt, storageKey, baseMonument]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#home' || hash === '' || hash === '#') {
        setViewMode('home');
      } else if (hash.includes('monument')) {
        const match = hash.match(/\d+/);
        if (match) {
          const parsed = parseInt(match[0]);
          if (parsed >= 1 && parsed <= allMonumentsList.length) {
            setCurrentStt(parsed);
            setViewMode('detail');
          }
        }
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (data) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(data));
      } catch (e) {
        console.warn('Failed to save to localStorage:', e);
      }
    }
  }, [data, storageKey]);

  // Modals state
  const [audioModalOpen, setAudioModalOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [investigationModalOpen, setInvestigationModalOpen] = useState(false);
  const [investigationMode, setInvestigationMode] = useState('quiz');
  const [selectedDossier, setSelectedDossier] = useState(null);
  const [studentReportOpen, setStudentReportOpen] = useState(false);
  const [nextMonumentModalOpen, setNextMonumentModalOpen] = useState(false);
  const [selectedNextMonument, setSelectedNextMonument] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [docsModalOpen, setDocsModalOpen] = useState(false);
  const [myMapModalOpen, setMyMapModalOpen] = useState(false);
  const [milestoneModalOpen, setMilestoneModalOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [adminDrawerOpen, setAdminDrawerOpen] = useState(false);
  const [contributeModalOpen, setContributeModalOpen] = useState(false);
  const [explorerModalOpen, setExplorerModalOpen] = useState(false);

  const [isEditMode, setIsEditMode] = useState(false);

  const [contributions, setContributions] = useState(() => {
    try {
      const saved = localStorage.getItem(CONTRIBUTIONS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse contributions:', e);
    }
    return initialSampleContributions;
  });

  useEffect(() => {
    try {
      localStorage.setItem(CONTRIBUTIONS_KEY, JSON.stringify(contributions));
    } catch (e) {
      console.warn('Failed to save contributions:', e);
    }
  }, [contributions]);

  const pendingContributionsCount = useMemo(() => {
    return contributions.filter(c => c.status === 'pending').length;
  }, [contributions]);

  const handleNavigate = (target) => {
    if (target === 'home') {
      setViewMode('home');
      window.location.hash = '#home';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (target === 'map') {
      setMyMapModalOpen(true);
    } else if (target === 'about') {
      setDocsModalOpen(true);
    } else if (target === 'investigation') {
      if (viewMode !== 'detail') {
        setViewMode('detail');
      }
      setTimeout(() => {
        const el = document.getElementById('investigation-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleSelectMonument = (monumentIdOrStt) => {
    let targetStt = currentStt;
    if (typeof monumentIdOrStt === 'number') {
      targetStt = monumentIdOrStt;
    } else if (typeof monumentIdOrStt === 'string') {
      const match = monumentIdOrStt.match(/\d+/);
      if (match) targetStt = parseInt(match[0]);
    }
    setCurrentStt(targetStt);
    setViewMode('detail');
    window.location.hash = `#monument-${targetStt}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateOverview = (newOverview) => {
    setData(prev => ({
      ...prev,
      info: {
        ...prev.info,
        overview: newOverview
      }
    }));
  };

  const handleUpdateInfo = (newInfo) => {
    setData(prev => ({
      ...prev,
      info: {
        ...prev.info,
        ...newInfo
      }
    }));
  };

  const handleUpdateTimeline = (newTimeline) => {
    setData(prev => ({
      ...prev,
      timeline: newTimeline
    }));
  };

  const handleUpdateGallery = (newGallery) => {
    setData(prev => ({
      ...prev,
      gallery: newGallery
    }));
  };

  const handleOpenLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handleOpenMilestone = (milestone) => {
    setSelectedMilestone(milestone);
    setMilestoneModalOpen(true);
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

  const handleSelectNextMonument = (monument) => {
    if (monument && monument.stt) {
      handleSelectMonument(monument.stt);
    } else {
      setSelectedNextMonument(monument);
      setNextMonumentModalOpen(true);
    }
  };

  const handleAddContribution = (newContrib) => {
    const contributionItem = {
      ...newContrib,
      id: `contrib_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      submittedAt: new Date().toISOString(),
      status: 'pending'
    };
    setContributions(prev => [contributionItem, ...prev]);
  };

  const handleApproveContribution = (id) => {
    const item = contributions.find(c => c.id === id);
    if (!item) return;

    if (item.targetSection === 'gallery' && item.image) {
      setData(prev => ({
        ...prev,
        gallery: [
          {
            id: Date.now(),
            src: item.image,
            title: item.title || item.name || 'Tư liệu đóng góp',
            caption: `${item.caption || item.summary || ''} (Đóng góp bởi: ${item.authorName})`,
            year: item.year || 'Tư liệu'
          },
          ...prev.gallery
        ]
      }));
    } else if (item.targetSection === 'timeline' && item.title) {
      setData(prev => ({
        ...prev,
        timeline: [
          ...prev.timeline,
          {
            id: Date.now(),
            year: item.year || 'Sự kiện',
            title: item.title,
            description: `${item.description || item.summary || ''} (Người đóng góp: ${item.authorName})`
          }
        ]
      }));
    }

    setContributions(prev =>
      prev.map(c => (c.id === id ? { ...c, status: 'approved' } : c))
    );
  };

  const handleRejectContribution = (id) => {
    setContributions(prev =>
      prev.map(c => (c.id === id ? { ...c, status: 'rejected' } : c))
    );
  };

  const handleDeleteContribution = (id) => {
    setContributions(prev => prev.filter(c => c.id !== id));
  };

  const nextMonumentsForSection = useMemo(() => {
    const list = [];
    for (let i = 1; i <= 3; i++) {
      let nextIndex = (currentStt - 1 + i) % allMonumentsList.length;
      list.push(allMonumentsList[nextIndex]);
    }
    return list;
  }, [currentStt]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] font-sans antialiased text-[#2C241E] selection:bg-[#7E1819] selection:text-white">
      {/* Scroll Progress Bar at very top */}
      <ScrollProgressBar />

      {/* Global Application Header */}
      <Header
        monumentName={data.info.name}
        monumentRanking={data.info.badge}
        monumentStt={currentStt}
        viewMode={viewMode}
        isEditMode={isEditMode}
        setIsEditMode={setIsEditMode}
        onOpenAdmin={() => setAdminDrawerOpen(true)}
        onOpenContribute={() => setContributeModalOpen(true)}
        onOpenExplorer={() => setExplorerModalOpen(true)}
        onOpenMyMap={() => setMyMapModalOpen(true)}
        pendingContributionsCount={pendingContributionsCount}
        onNavigate={handleNavigate}
      />

      {/* RENDER VIEW MODE: HOME OR DETAIL */}
      {viewMode === 'home' ? (
        /* HOME PAGE PORTAL HUB */
        <HomePage
          allMonuments={allMonumentsList}
          onSelectMonument={handleSelectMonument}
          onOpenExplorer={() => setExplorerModalOpen(true)}
          onOpenMyMap={() => setMyMapModalOpen(true)}
          onOpenContribute={() => setContributeModalOpen(true)}
        />
      ) : (
        /* MONUMENT DETAIL PAGE */
        <>
          {/* Quick Monument Switcher Bar (1-click Prev / Next & Dropdown selector) */}
          <MonumentSwitcherBar
            allMonuments={allMonumentsList}
            currentStt={currentStt}
            onSelectMonument={(stt) => handleSelectMonument(stt)}
            onOpenExplorer={() => setExplorerModalOpen(true)}
          />

          {/* Main Detail Content Area */}
          <main className="flex-1 space-y-6 pb-6">
            {/* 1. Hero Banner with Integrated Breadcrumb */}
            <HeroBanner
              info={data.info}
              onOpenAudio={() => setAudioModalOpen(true)}
              onOpenVideo={() => setVideoModalOpen(true)}
              onOpenGallery={() => handleOpenLightbox(0)}
              isEditMode={isEditMode}
              onUpdateInfo={handleUpdateInfo}
              onNavigateHome={() => handleNavigate('home')}
            />

            {/* 2. Quick Action Cards (3 cards: KHÁM PHÁ - ĐIỀU TRA - HÀNH ĐỘNG) */}
            <QuickActionCards
              onOpenAudio={() => setAudioModalOpen(true)}
              onOpenInvestigation={() => {
                const el = document.getElementById('investigation-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenAction={() => setActionModalOpen(true)}
              onOpenContribute={() => setContributeModalOpen(true)}
            />

            {/* 3. Ô VIDEO VÀ Ô VỊ TRÍ (New Component) */}
            <MonumentMediaAndLocationSection
              video={data.video}
              info={data.info}
              map={data.map}
              onOpenMyMap={() => setMyMapModalOpen(true)}
            />

            {/* 4. Giá trị lịch sử, Dấu mốc & Bảng thông tin di tích */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2">
              <ScrollReveal>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
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

            {/* 5. Stats Counter Section */}
            <StatsCounterSection />

            {/* 6. Khám Phá Di Tích Qua 6 Môn Học */}
            <FlipCardGrid
              subjects={data.subjects6}
              monumentName={data.info.name}
            />

            {/* 7. TRƯỚC PHẦN CÂU HỎI ĐIỀU TRA: 3 Ô Nhân vật liên quan, Hiện vật tiêu biểu, Sự kiện tiêu biểu */}
            <ThreeKeyHighlightsSection
              keyHighlights={data.keyHighlights}
              monumentName={data.info.name}
            />

            {/* 8. HỒ SƠ ĐIỀU TRA & Ô TÀI LIỆU THAM KHẢO */}
            <div id="investigation-section" className="pt-2">
              <InvestigationSection
                investigation={data.investigation}
                monumentImage={data.info.heroImage || data.gallery?.[0]?.src}
                onOpenDossierDetail={handleOpenDossier}
                onStartQuiz={handleStartQuiz}
                onOpenStudentReport={() => setStudentReportOpen(true)}
                onOpenDocsModal={() => setDocsModalOpen(true)}
              />
            </div>

            {/* 9. Next Monument Section: Gợi ý các di tích tiếp theo */}
            <ScrollReveal>
              <NextMonumentSection
                nextMonuments={nextMonumentsForSection}
                onSelectMonument={handleSelectNextMonument}
              />
            </ScrollReveal>
          </main>
        </>
      )}

      {/* Global Footer */}
      <Footer onNavigateHome={() => handleNavigate('home')} />

      {/* 103 Monuments Explorer Directory Modal */}
      <MonumentsExplorerModal
        isOpen={explorerModalOpen}
        onClose={() => setExplorerModalOpen(false)}
        currentMonumentStt={currentStt}
        onSelectMonument={(monument) => handleSelectMonument(monument.stt)}
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

      {/* Phim tư liệu Video Modal */}
      <VideoModal
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
        video={data.video}
      />

      {/* Investigation Dossier, 5-question Quiz, Flashcards & Matching Pairs Modal */}
      <InvestigationModal
        isOpen={investigationModalOpen}
        onClose={() => setInvestigationModalOpen(false)}
        dossier={selectedDossier}
        quiz={data.investigation?.quiz}
        flashcards={data.investigation?.flashcards}
        matchingPairs={data.investigation?.matchingPairs}
        monumentName={data.info.name}
        mode={investigationMode}
        onSwitchToQuiz={() => setInvestigationMode('quiz')}
      />

      {/* Student Report Investigation Form Modal */}
      <StudentReportModal
        isOpen={studentReportOpen}
        onClose={() => setStudentReportOpen(false)}
        investigation={data.investigation}
        monumentName={data.info.name}
      />

      {/* Next Monument Modal */}
      <NextMonumentModal
        isOpen={nextMonumentModalOpen}
        onClose={() => setNextMonumentModalOpen(false)}
        monument={selectedNextMonument}
        onSelectMonument={(monument) => handleSelectMonument(monument.stt)}
      />

      {/* Lightbox Gallery Modal */}
      <LightboxModal
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={data.gallery}
        currentIndex={lightboxIndex}
        setCurrentIndex={setLightboxIndex}
      />

      {/* Interactive Action Modal */}
      <ActionModal
        isOpen={actionModalOpen}
        onClose={() => setActionModalOpen(false)}
      />

      {/* Document Reference Modal */}
      <DocsModal
        isOpen={docsModalOpen}
        onClose={() => setDocsModalOpen(false)}
        referencesList={data.info?.referencesList}
        driveReferenceData={data.info?.driveReferenceData || data.investigation?.driveReferenceData}
        monumentName={data.info?.name}
      />

      {/* Full GPS Map Explorer Modal */}
      <MyMapModal
        isOpen={myMapModalOpen}
        onClose={() => setMyMapModalOpen(false)}
        mapData={data.map}
        allMonuments={allMonumentsList}
        currentMonumentStt={currentStt}
        onSelectMonument={(monument) => handleSelectMonument(monument.stt)}
      />

      {/* Milestone Detail Modal */}
      <MilestoneModal
        isOpen={milestoneModalOpen}
        onClose={() => setMilestoneModalOpen(false)}
        milestone={selectedMilestone}
      />

      {/* Admin CMS Drawer */}
      <AdminEditDrawer
        isOpen={adminDrawerOpen}
        onClose={() => setAdminDrawerOpen(false)}
        data={data}
        monumentData={data}
        onSaveData={(newData) => setData(newData)}
        onUpdateOverview={handleUpdateOverview}
        onUpdateInfo={handleUpdateInfo}
        onUpdateTimeline={handleUpdateTimeline}
        onUpdateGallery={handleUpdateGallery}
        contributions={contributions}
        onApproveContribution={handleApproveContribution}
        onRejectContribution={handleRejectContribution}
        onDeleteContribution={handleDeleteContribution}
      />
    </div>
  );
}
