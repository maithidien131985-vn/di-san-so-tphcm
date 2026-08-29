import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  Send, 
  CheckCircle2, 
  FileText, 
  Image as ImageIcon, 
  Calendar, 
  Landmark, 
  User, 
  ShieldCheck, 
  Clock,
  Check,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ContributeModal({
  isOpen,
  onClose,
  onSubmitContribution,
  existingContributions = []
}) {
  const [activeType, setActiveType] = useState('monument'); // 'monument' | 'gallery' | 'timeline' | 'story'
  const [authorName, setAuthorName] = useState('');
  const [authorRole, setAuthorRole] = useState('');
  const [authorContact, setAuthorContact] = useState('');
  
  // Fields for monument
  const [monumentName, setMonumentName] = useState('');
  const [monumentCategory, setMonumentCategory] = useState('Di tích Lịch sử cấp Quốc gia');
  const [monumentAddress, setMonumentAddress] = useState('');
  const [monumentSummary, setMonumentSummary] = useState('');
  const [monumentHighlight, setMonumentHighlight] = useState('');
  
  // Fields for gallery / artifact
  const [itemTitle, setItemTitle] = useState('');
  const [itemYear, setItemYear] = useState('');
  const [itemCaption, setItemCaption] = useState('');
  const [itemSource, setItemSource] = useState('');
  
  // Fields for timeline / story
  const [timelineYear, setTimelineYear] = useState('');
  const [timelineTitle, setTimelineTitle] = useState('');
  const [timelineDesc, setTimelineDesc] = useState('');

  // Image upload state
  const [imagePreview, setImagePreview] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageMode, setImageMode] = useState('upload'); // 'upload' | 'url'

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState('form'); // 'form' | 'my-submissions'

  if (!isOpen) return null;

  const handleImageFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      alert('Kích thước ảnh tối đa là 3MB. Vui lòng chọn ảnh dung lượng nhỏ hơn hoặc dán liên kết URL.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target.result);
      setImageUrl('');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!authorName.trim()) {
      alert('Vui lòng nhập họ và tên của bạn.');
      return;
    }

    const finalImage = imageMode === 'upload' ? imagePreview : imageUrl.trim();

    let newContribution = {
      id: 'contrib_' + Date.now(),
      authorName: authorName.trim(),
      authorRole: authorRole.trim() || 'Bạn đọc đóng góp',
      authorContact: authorContact.trim() || 'Chưa cung cấp',
      type: activeType,
      image: finalImage || '/assets/images/dinh-doc-lap-front.jpg',
      submittedAt: new Date().toISOString(),
      status: 'pending', // 'pending' | 'approved' | 'rejected'
      adminNotes: ''
    };

    if (activeType === 'monument') {
      if (!monumentName.trim() || !monumentSummary.trim()) {
        alert('Vui lòng điền tên di tích và tóm tắt giới thiệu.');
        return;
      }
      newContribution = {
        ...newContribution,
        title: monumentName.trim(),
        name: monumentName.trim(),
        category: monumentCategory,
        ranking: monumentCategory,
        address: monumentAddress.trim() || 'TP. Hồ Chí Minh',
        summary: monumentSummary.trim(),
        highlight: monumentHighlight.trim() || 'Di tích lịch sử văn hóa tiêu biểu TP.HCM.',
        targetSection: 'nextMonuments'
      };
    } else if (activeType === 'gallery') {
      if (!itemTitle.trim() || !itemCaption.trim()) {
        alert('Vui lòng điền tên tư liệu/hiện vật và phần mô tả.');
        return;
      }
      newContribution = {
        ...newContribution,
        title: itemTitle.trim(),
        year: itemYear.trim() || 'Tư liệu lịch sử',
        caption: itemCaption.trim(),
        source: itemSource.trim() || 'Độc giả cung cấp',
        targetSection: 'gallery'
      };
    } else if (activeType === 'timeline') {
      if (!timelineTitle.trim() || !timelineDesc.trim()) {
        alert('Vui lòng điền mốc thời gian, tiêu đề và tóm tắt sự kiện.');
        return;
      }
      newContribution = {
        ...newContribution,
        year: timelineYear.trim() || 'Lịch sử',
        title: timelineTitle.trim(),
        description: timelineDesc.trim(),
        targetSection: 'timeline'
      };
    } else if (activeType === 'story') {
      if (!itemTitle.trim() || !itemCaption.trim()) {
        alert('Vui lòng điền tiêu đề câu chuyện và nội dung chi tiết.');
        return;
      }
      newContribution = {
        ...newContribution,
        title: itemTitle.trim(),
        caption: itemCaption.trim(),
        source: itemSource.trim() || 'Ký ức nhân chứng',
        targetSection: 'dossiers'
      };
    }

    if (onSubmitContribution) {
      onSubmitContribution(newContribution);
    }

    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 }
    });

    setIsSubmitted(true);
  };

  const handleResetForm = () => {
    setIsSubmitted(false);
    setMonumentName('');
    setMonumentAddress('');
    setMonumentSummary('');
    setMonumentHighlight('');
    setItemTitle('');
    setItemYear('');
    setItemCaption('');
    setItemSource('');
    setTimelineYear('');
    setTimelineTitle('');
    setTimelineDesc('');
    setImagePreview('');
    setImageUrl('');
  };

  const contributionTypes = [
    {
      id: 'monument',
      label: 'Di tích địa phương mới',
      icon: Landmark,
      desc: 'Đề xuất thêm địa chỉ đỏ, di tích lịch sử TP.HCM',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300'
    },
    {
      id: 'gallery',
      label: 'Ảnh & Hiện vật tư liệu',
      icon: ImageIcon,
      desc: 'Đóng góp ảnh xưa, bảo vật, tài liệu hiếm',
      badgeColor: 'bg-red-100 text-[#7B1113] border-red-300'
    },
    {
      id: 'timeline',
      label: 'Dấu mốc & Sự kiện',
      icon: Calendar,
      desc: 'Bổ sung mốc thời gian, sự kiện lịch sử hào hùng',
      badgeColor: 'bg-blue-100 text-blue-900 border-blue-300'
    },
    {
      id: 'story',
      label: 'Ký ức & Lời kể nhân chứng',
      icon: FileText,
      desc: 'Ghi lại hồi ức của cựu chiến binh, nhân chứng sống',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#FAF7F2] w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl border border-[#EADBC8] flex flex-col max-h-[92vh] animate-scaleUp">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#7B1113] via-[#96171a] to-[#7B1113] text-white p-5 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center text-amber-300 shadow-inner border border-white/20">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-300 bg-black/20 px-2 py-0.5 rounded-full">
                  Cộng Đồng Đóng Góp Tư Liệu
                </span>
                <span className="text-[9px] bg-emerald-500/90 text-white font-bold px-2 py-0.5 rounded-full">
                  Kiểm duyệt 2 lớp
                </span>
              </div>
              <h3 className="font-serif-title font-black text-lg sm:text-xl text-white">
                Thu Thập & Đóng Góp Dữ Liệu Di Sản
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-nav tabs */}
        <div className="bg-white px-5 py-2.5 border-b border-[#EADBC8] flex items-center justify-between text-xs font-bold">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('form')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'form'
                  ? 'bg-[#7B1113] text-white shadow-xs'
                  : 'text-[#6B5E55] hover:bg-gray-100'
              }`}
            >
              Gửi tư liệu mới
            </button>
            <button
              onClick={() => setActiveTab('my-submissions')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'my-submissions'
                  ? 'bg-[#7B1113] text-white shadow-xs'
                  : 'text-[#6B5E55] hover:bg-gray-100'
              }`}
            >
              <span>Đóng góp của cộng đồng</span>
              <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-amber-100 text-[#7B1113] font-black">
                {existingContributions.length}
              </span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-[11px] text-gray-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Được kiểm duyệt trước khi đăng tải</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'my-submissions' ? (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 leading-relaxed">
                  <strong>Quy trình kiểm duyệt di sản số:</strong> Mọi dữ liệu đóng góp từ độc giả sẽ được lưu vào Hộp thư tiếp nhận và gửi đến Ban Quản Trị / Người sở hữu. Sau khi đối chiếu xác minh tài liệu, ban quản trị sẽ chính thức duyệt đăng lên trang web.
                </div>
              </div>

              {existingContributions.length === 0 ? (
                <div className="text-center py-10 text-gray-500 text-xs space-y-2">
                  <Clock className="w-8 h-8 mx-auto text-gray-400" />
                  <p>Chưa có dữ liệu đóng góp nào. Hãy là người đầu tiên đóng góp tư liệu!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {existingContributions.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl bg-white border border-[#EADBC8] shadow-xs hover:border-[#7B1113]/40 transition-all space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md bg-gray-100 text-gray-700">
                              {item.type === 'monument' && '🏛️ Di tích'}
                              {item.type === 'gallery' && '📸 Ảnh / Hiện vật'}
                              {item.type === 'timeline' && '📜 Mốc lịch sử'}
                              {item.type === 'story' && '✍️ Ký ức / Lời kể'}
                            </span>
                            <span className="text-xs font-bold text-gray-800">
                              {item.authorName}
                            </span>
                            <span className="text-[10px] text-gray-400">
                              • {item.authorRole}
                            </span>
                          </div>
                          <h4 className="font-serif-title font-bold text-sm sm:text-base text-[#7B1113]">
                            {item.title || item.name}
                          </h4>
                        </div>

                        <div>
                          {item.status === 'pending' && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                              <Clock className="w-3 h-3" />
                              <span>Chờ chủ web duyệt</span>
                            </span>
                          )}
                          {item.status === 'approved' && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                              <Check className="w-3 h-3" />
                              <span>Đã duyệt lên web</span>
                            </span>
                          )}
                          {item.status === 'rejected' && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-300">
                              <AlertCircle className="w-3 h-3" />
                              <span>Từ chối</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-[#555] leading-relaxed line-clamp-2">
                        {item.summary || item.caption || item.description}
                      </p>

                      {item.image && (
                        <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                          <img
                            src={item.image}
                            alt="Tư liệu preview"
                            className="w-16 h-12 object-cover rounded-lg border border-gray-200"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                          <div className="text-[11px] text-gray-500">
                            {item.year && <div><strong>Thời kỳ:</strong> {item.year}</div>}
                            {item.address && <div><strong>Địa chỉ:</strong> {item.address}</div>}
                            {item.source && <div><strong>Nguồn:</strong> {item.source}</div>}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : isSubmitted ? (
            <div className="text-center py-8 space-y-4 bg-white rounded-3xl p-6 border border-[#EADBC8] shadow-xs">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif-title font-black text-xl text-[#7B1113]">
                  Đã Gửi Dữ Liệu Thành Công!
                </h4>
                <p className="text-xs text-gray-600 max-w-md mx-auto leading-relaxed">
                  Tư liệu của bạn đã được chuyển thẳng tới <span className="font-bold text-[#7B1113]">Bảng Quản Trị của Người Sở Hữu website</span> để thẩm định và đối chiếu tư liệu.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 max-w-md mx-auto text-left text-xs text-amber-900 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-amber-950">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Trạng thái hiện tại: Đang chờ phê duyệt</span>
                </div>
                <p className="text-[11px] leading-relaxed text-amber-800">
                  Khi người sở hữu nhấn <strong>"Duyệt & Đăng web"</strong> trong Bảng quản trị CMS, tư liệu này sẽ tự động xuất hiện công khai trên hệ thống di sản số!
                </p>
              </div>

              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={handleResetForm}
                  className="px-5 py-2 rounded-xl bg-white border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  Đóng góp thêm tư liệu khác
                </button>
                <button
                  onClick={() => setActiveTab('my-submissions')}
                  className="px-5 py-2 rounded-xl bg-[#7B1113] hover:bg-[#96171a] text-xs font-bold text-white shadow cursor-pointer"
                >
                  Xem danh sách đóng góp
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1 */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-[#7B1113] block">
                  1. Bạn muốn đóng góp loại dữ liệu nào?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {contributionTypes.map((type) => {
                    const Icon = type.icon;
                    const isSelected = activeType === type.id;
                    return (
                      <div
                        key={type.id}
                        onClick={() => setActiveType(type.id)}
                        className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                          isSelected
                            ? 'bg-amber-50/70 border-[#7B1113] shadow-xs'
                            : 'bg-white border-gray-200 hover:border-amber-300'
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-[#7B1113] text-white' : 'bg-gray-100 text-gray-600'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-xs text-[#2C241E]">{type.label}</div>
                          <div className="text-[11px] text-gray-500 leading-tight mt-0.5">{type.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-4 rounded-2xl bg-white border border-[#EADBC8] space-y-3 shadow-xs">
                <label className="text-xs font-black uppercase tracking-wider text-[#7B1113] block flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  <span>2. Thông tin người đóng góp</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-gray-600 block mb-1">
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Nguyễn Văn A"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-gray-300 text-xs outline-none focus:border-[#7B1113] focus:ring-1 focus:ring-[#7B1113]"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-600 block mb-1">
                      Đơn vị / Trường học / Nghề nghiệp
                    </label>
                    <input
                      type="text"
                      placeholder="THPT Lê Hồng Phong / Người dân..."
                      value={authorRole}
                      onChange={(e) => setAuthorRole(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-gray-300 text-xs outline-none focus:border-[#7B1113]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-600 block mb-1">
                      Email hoặc Số điện thoại (tùy chọn)
                    </label>
                    <input
                      type="text"
                      placeholder="email@example.com hoặc SĐT"
                      value={authorContact}
                      onChange={(e) => setAuthorContact(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-gray-300 text-xs outline-none focus:border-[#7B1113]"
                    />
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-4 rounded-2xl bg-white border border-[#EADBC8] space-y-4 shadow-xs">
                <label className="text-xs font-black uppercase tracking-wider text-[#7B1113] block flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  <span>3. Chi tiết tư liệu di sản</span>
                </label>

                {activeType === 'monument' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-gray-700 block mb-1">
                          Tên di tích đề xuất <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Ví dụ: Bảo tàng Chứng tích Chiến tranh"
                          value={monumentName}
                          onChange={(e) => setMonumentName(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-gray-300 text-xs outline-none focus:border-[#7B1113]"
                          required
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-gray-700 block mb-1">
                          Cấp xếp hạng / Thể loại
                        </label>
                        <select
                          value={monumentCategory}
                          onChange={(e) => setMonumentCategory(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-gray-300 text-xs outline-none bg-white focus:border-[#7B1113]"
                        >
                          <option value="Di tích Lịch sử Quốc gia đặc biệt">Di tích Lịch sử Quốc gia đặc biệt</option>
                          <option value="Di tích Lịch sử cấp Quốc gia">Di tích Lịch sử cấp Quốc gia</option>
                          <option value="Di tích Lịch sử - Văn hóa cấp Thành phố">Di tích Lịch sử - Văn hóa cấp Thành phố</option>
                          <option value="Địa chỉ đỏ cách mạng">Địa chỉ đỏ cách mạng</option>
                          <option value="Bảo tàng & Địa điểm lưu niệm">Bảo tàng & Địa điểm lưu niệm</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-gray-700 block mb-1">
                        Địa chỉ di tích
                      </label>
                      <input
                        type="text"
                        placeholder="Số nhà, đường, phường, quận/huyện tại TP.HCM"
                        value={monumentAddress}
                        onChange={(e) => setMonumentAddress(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-gray-300 text-xs outline-none focus:border-[#7B1113]"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-gray-700 block mb-1">
                        Tóm tắt lịch sử & Ý nghĩa di tích <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Mô tả quá trình hình thành, các sự kiện gắn liền và giá trị lịch sử của di tích..."
                        value={monumentSummary}
                        onChange={(e) => setMonumentSummary(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-gray-300 text-xs outline-none focus:border-[#7B1113] leading-relaxed"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-gray-700 block mb-1">
                        Điểm nổi bật / Thông điệp truyền cảm hứng
                      </label>
                      <input
                        type="text"
                        placeholder="Ví dụ: Nơi lưu giữ những chứng tích đắt giá về khát vọng hòa bình của dân tộc."
                        value={monumentHighlight}
                        onChange={(e) => setMonumentHighlight(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-gray-300 text-xs outline-none focus:border-[#7B1113]"
                      />
                    </div>
                  </div>
                )}

                {activeType === 'gallery' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-gray-700 block mb-1">
                          Tên tư liệu / Tên hiện vật <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Ví dụ: Bức ảnh xe tăng 390 tại sân Dinh"
                          value={itemTitle}
                          onChange={(e) => setItemTitle(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-gray-300 text-xs outline-none focus:border-[#7B1113]"
                          required
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-gray-700 block mb-1">
                          Năm / Thời kỳ lịch sử
                        </label>
                        <input
                          type="text"
                          placeholder="Ví dụ: 1975, Thời kỳ 1968–1975..."
                          value={itemYear}
                          onChange={(e) => setItemYear(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-gray-300 text-xs outline-none focus:border-[#7B1113]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-gray-700 block mb-1">
                        Chú thích chi tiết / Câu chuyện đằng sau hiện vật <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Mô tả bối cảnh chụp bức ảnh, thông số hoặc ý nghĩa lịch sử của hiện vật..."
                        value={itemCaption}
                        onChange={(e) => setItemCaption(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-gray-300 text-xs outline-none focus:border-[#7B1113] leading-relaxed"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-gray-700 block mb-1">
                        Nguồn gốc tư liệu (Sách, Báo, Bảo tàng, Gia đình...)
                      </label>
                      <input
                        type="text"
                        placeholder="Ví dụ: Tư liệu do cựu chiến binh cung cấp / Sách Lịch sử Quân đoàn 2"
                        value={itemSource}
                        onChange={(e) => setItemSource(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-gray-300 text-xs outline-none focus:border-[#7B1113]"
                      />
                    </div>
                  </div>
                )}

                {activeType === 'timeline' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-1">
                        <label className="text-[11px] font-bold text-gray-700 block mb-1">
                          Mốc thời gian <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Ví dụ: 30/4/1975 hoặc 1968"
                          value={timelineYear}
                          onChange={(e) => setTimelineYear(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-gray-300 text-xs outline-none focus:border-[#7B1113]"
                          required
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="text-[11px] font-bold text-gray-700 block mb-1">
                          Tiêu đề dấu mốc <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Ví dụ: Đại đội trưởng Bùi Quang Thận cắm cờ giải phóng"
                          value={timelineTitle}
                          onChange={(e) => setTimelineTitle(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-gray-300 text-xs outline-none focus:border-[#7B1113]"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-gray-700 block mb-1">
                        Nội dung chi tiết diễn biến <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Mô tả diễn biến cụ thể và ý nghĩa của mốc lịch sử này..."
                        value={timelineDesc}
                        onChange={(e) => setTimelineDesc(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-gray-300 text-xs outline-none focus:border-[#7B1113] leading-relaxed"
                        required
                      />
                    </div>
                  </div>
                )}

                {activeType === 'story' && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-[11px] font-bold text-gray-700 block mb-1">
                        Tiêu đề câu chuyện / Ký ức <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Ví dụ: Ký ức ngày giải phóng của người lính thông tin"
                        value={itemTitle}
                        onChange={(e) => setItemTitle(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-gray-300 text-xs outline-none focus:border-[#7B1113]"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-gray-700 block mb-1">
                        Nội dung câu chuyện / Lời kể chi tiết <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Ghi lại chân thực câu chuyện, kỷ niệm hoặc chi tiết lịch sử ít người biết..."
                        value={itemCaption}
                        onChange={(e) => setItemCaption(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-gray-300 text-xs outline-none focus:border-[#7B1113] leading-relaxed"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-gray-700 block mb-1">
                        Nhân chứng / Người kể lại
                      </label>
                      <input
                        type="text"
                        placeholder="Ví dụ: Lời kể của bác Nguyễn Văn X (Cựu chiến binh Sư đoàn 304)"
                        value={itemSource}
                        onChange={(e) => setItemSource(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-gray-300 text-xs outline-none focus:border-[#7B1113]"
                      />
                    </div>
                  </div>
                )}

                {/* Upload or Link Image */}
                <div className="pt-3 border-t border-gray-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-gray-700 flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-[#7B1113]" />
                      <span>Hình ảnh đính kèm (nếu có)</span>
                    </label>
                    <div className="flex items-center gap-2 text-[10px]">
                      <button
                        type="button"
                        onClick={() => setImageMode('upload')}
                        className={`px-2 py-0.5 rounded ${imageMode === 'upload' ? 'bg-[#7B1113] text-white font-bold' : 'text-gray-500'}`}
                      >
                        Tải file từ máy
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageMode('url')}
                        className={`px-2 py-0.5 rounded ${imageMode === 'url' ? 'bg-[#7B1113] text-white font-bold' : 'text-gray-500'}`}
                      >
                        Dán link ảnh
                      </button>
                    </div>
                  </div>

                  {imageMode === 'upload' ? (
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 border border-dashed border-gray-300 hover:bg-gray-100 cursor-pointer text-xs text-gray-700">
                        <Upload className="w-4 h-4 text-gray-500" />
                        <span>Chọn ảnh từ thiết bị (tối đa 3MB)</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageFile}
                          className="hidden"
                        />
                      </label>
                      {imagePreview && (
                        <div className="relative group">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-14 h-14 object-cover rounded-lg border border-gray-200 shadow-xs"
                          />
                          <button
                            type="button"
                            onClick={() => setImagePreview('')}
                            className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white rounded-full flex items-center justify-center text-[10px]"
                          >
                            ×
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <input
                        type="url"
                        placeholder="https://example.com/hinh-anh-di-san.jpg"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-gray-300 text-xs outline-none focus:border-[#7B1113]"
                      />
                      {imageUrl && (
                        <img
                          src={imageUrl}
                          alt="Preview"
                          className="w-24 h-16 object-cover rounded-lg border"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Submit */}
              <div className="flex items-center justify-between pt-2">
                <div className="text-[11px] text-gray-500 max-w-sm">
                  🔒 Dữ liệu sẽ được gửi trực tiếp đến Bảng xét duyệt của Quản trị viên trước khi công khai.
                </div>

                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#7B1113] to-[#96171a] hover:from-[#96171a] hover:to-[#7B1113] text-white text-xs sm:text-sm font-black shadow-lg shadow-red-900/20 hover:scale-105 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Gửi duyệt tư liệu</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
