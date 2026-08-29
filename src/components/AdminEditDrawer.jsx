import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Save, 
  Download, 
  Upload, 
  RotateCcw, 
  Plus, 
  Trash2, 
  Check, 
  Edit,
  Sparkles,
  Layers,
  FileText,
  Calendar,
  Image as ImageIcon,
  Landmark,
  Inbox,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Sparkle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AdminEditDrawer({
  isOpen,
  onClose,
  data,
  onSaveData,
  onResetDefault,
  contributions = [],
  onApproveContribution,
  onRejectContribution,
  onDeleteContribution,
  onSeedSampleContributions,
  onRevokeContribution
}) {
  const [editData, setEditData] = useState(data);
  const [activeTab, setActiveTab] = useState('contributions');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const fileInputRef = useRef(null);

  // Filter state for contributions review
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'pending' | 'approved' | 'rejected'
  const [typeFilter, setTypeFilter] = useState('all');
  const [editingContribId, setEditingContribId] = useState(null);
  const [tempEditValues, setTempEditValues] = useState({});

  useEffect(() => {
    if (isOpen) {
      setEditData(JSON.parse(JSON.stringify(data)));
      setSaveSuccess(false);
      
      const pendingCount = contributions.filter(c => c.status === 'pending').length;
      if (pendingCount > 0) {
        setActiveTab('contributions');
      }
    }
  }, [isOpen, data, contributions]);

  if (!isOpen) return null;

  const pendingCount = contributions.filter(c => c.status === 'pending').length;
  const approvedCount = contributions.filter(c => c.status === 'approved').length;
  const rejectedCount = contributions.filter(c => c.status === 'rejected').length;

  const handleSave = () => {
    onSaveData(editData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleExportJSON = () => {
    const backupObj = {
      monumentData: editData,
      contributions: contributions,
      exportedAt: new Date().toISOString()
    };
    const jsonStr = JSON.stringify(backupObj, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'di-san-so-backup-data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.monumentData) {
          setEditData(parsed.monumentData);
          onSaveData(parsed.monumentData);
        } else {
          setEditData(parsed);
          onSaveData(parsed);
        }
        alert('Đã nhập dữ liệu thành công!');
      } catch (_err) {
        alert('Lỗi định dạng file JSON!');
      }
    };
    reader.readAsText(file);
  };

  // Direct approve & publish contribution
  const handleApprove = (item) => {
    const itemToPublish = editingContribId === item.id ? { ...item, ...tempEditValues } : item;
    
    if (onApproveContribution) {
      onApproveContribution(itemToPublish);
    }

    setEditingContribId(null);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  const handleStartEditContrib = (item) => {
    setEditingContribId(item.id);
    setTempEditValues({
      title: item.title || item.name || '',
      summary: item.summary || item.caption || item.description || '',
      year: item.year || '',
      address: item.address || '',
      image: item.image || '',
      source: item.source || ''
    });
  };

  const filteredContributions = contributions.filter((c) => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (typeFilter !== 'all' && c.type !== typeFilter) return false;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-3xl h-full shadow-2xl flex flex-col border-l border-[#EADBC8] animate-slideLeft">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#7B1113] via-[#96171a] to-[#7B1113] text-white p-5 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center border border-white/20 shadow-inner">
              <ShieldCheck className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif-title font-black text-lg sm:text-xl text-amber-100">
                  Trung Tâm Quản Trị & Kiểm Duyệt CMS
                </h3>
                {pendingCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-400 text-[#7B1113] text-[10px] font-black uppercase animate-pulse">
                    {pendingCount} chờ duyệt
                  </span>
                )}
              </div>
              <p className="text-xs text-white/80">
                Kiểm duyệt đóng góp độc giả, quản trị nội dung & xuất/nhập dữ liệu thời gian thực
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="bg-[#FAF7F2] px-4 py-2.5 border-b border-[#EADBC8] flex items-center gap-2 overflow-x-auto">
          {[
            { 
              id: 'contributions', 
              label: 'Kiểm duyệt dữ liệu', 
              icon: Inbox,
              badge: pendingCount > 0 ? pendingCount : null,
              highlight: true 
            },
            { id: 'general', label: 'Thông tin chung', icon: FileText },
            { id: 'timeline', label: 'Mốc lịch sử', icon: Calendar },
            { id: 'gallery', label: 'Kho ảnh & Hiện vật', icon: ImageIcon },
            { id: 'nextMonuments', label: 'Di tích tiếp theo', icon: Landmark },
            { id: 'investigation', label: 'Hồ sơ điều tra', icon: Layers },
            { id: 'audio', label: 'Thuyết minh', icon: Sparkles }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer relative ${
                  isActive
                    ? 'bg-[#7B1113] text-white shadow-sm'
                    : 'text-[#6B5E55] hover:bg-white hover:text-[#7B1113]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full bg-amber-400 text-[#7B1113] text-[10px] font-black">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: KIỂM DUYỆT ĐÓNG GÓP TỪ BẠN ĐỌC */}
          {activeTab === 'contributions' && (
            <div className="space-y-5">
              {/* Stat counters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div 
                  onClick={() => setStatusFilter('all')}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                    statusFilter === 'all' ? 'bg-gray-900 text-white border-gray-900 shadow-xs' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">Tổng đóng góp</div>
                  <div className="text-xl font-black">{contributions.length}</div>
                </div>

                <div 
                  onClick={() => setStatusFilter('pending')}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                    statusFilter === 'pending' ? 'bg-amber-600 text-white border-amber-600 shadow-xs ring-2 ring-amber-400' : 'bg-amber-50 border-amber-200 text-amber-900'
                  }`}
                >
                  <div className="text-[10px] font-bold uppercase tracking-wider opacity-90">Chờ xem xét</div>
                  <div className="text-xl font-black">{pendingCount}</div>
                </div>

                <div 
                  onClick={() => setStatusFilter('approved')}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                    statusFilter === 'approved' ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs' : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  }`}
                >
                  <div className="text-[10px] font-bold uppercase tracking-wider opacity-90">Đã đăng web</div>
                  <div className="text-xl font-black">{approvedCount}</div>
                </div>

                <div 
                  onClick={() => setStatusFilter('rejected')}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                    statusFilter === 'rejected' ? 'bg-rose-700 text-white border-rose-700 shadow-xs' : 'bg-rose-50 border-rose-200 text-rose-900'
                  }`}
                >
                  <div className="text-[10px] font-bold uppercase tracking-wider opacity-90">Từ chối</div>
                  <div className="text-xl font-black">{rejectedCount}</div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
                <div className="flex items-center gap-1.5 flex-wrap text-xs">
                  <span className="font-bold text-gray-500 text-[11px]">Loại:</span>
                  {[
                    { id: 'all', label: 'Tất cả' },
                    { id: 'monument', label: '🏛️ Di tích' },
                    { id: 'gallery', label: '📸 Ảnh/Hiện vật' },
                    { id: 'timeline', label: '📜 Mốc sử' },
                    { id: 'story', label: '✍️ Ký ức' }
                  ].map(f => (
                    <button
                      key={f.id}
                      onClick={() => setTypeFilter(f.id)}
                      className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                        typeFilter === f.id
                          ? 'bg-[#7B1113] text-white shadow-xs'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                {onSeedSampleContributions && (
                  <button
                    onClick={onSeedSampleContributions}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold transition-all cursor-pointer"
                    title="Tạo dữ liệu mẫu người đọc đóng góp để thử nghiệm quy trình duyệt"
                  >
                    <Sparkle className="w-3.5 h-3.5 text-amber-700" />
                    <span>Nạp 3 đóng góp mẫu để test</span>
                  </button>
                )}
              </div>

              {/* List of Contributions */}
              <div className="space-y-4">
                {filteredContributions.length === 0 ? (
                  <div className="p-8 text-center bg-gray-50 rounded-2xl border border-gray-200 text-gray-500 text-xs space-y-2">
                    <Inbox className="w-8 h-8 mx-auto text-gray-400" />
                    <p className="font-bold">Không có bản ghi đóng góp nào trong mục này.</p>
                    <p className="text-gray-400 text-[11px]">
                      Khi người đọc gửi dữ liệu từ nút "Đóng góp tư liệu", toàn bộ dữ liệu sẽ hiển thị tại đây để bạn xem xét và duyệt đăng.
                    </p>
                  </div>
                ) : (
                  filteredContributions.map((item) => {
                    const isEditing = editingContribId === item.id;
                    return (
                      <div
                        key={item.id}
                        className={`p-4 sm:p-5 rounded-2xl border transition-all space-y-3.5 relative ${
                          item.status === 'pending'
                            ? 'bg-amber-50/40 border-amber-300 shadow-sm'
                            : item.status === 'approved'
                            ? 'bg-emerald-50/30 border-emerald-200'
                            : 'bg-gray-50 border-gray-200 opacity-80'
                        }`}
                      >
                        {/* Header of Item */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md bg-white border border-gray-200 text-gray-800 shadow-2xs">
                                {item.type === 'monument' && '🏛️ Đề xuất Di tích mới'}
                                {item.type === 'gallery' && '📸 Đóng góp Ảnh / Hiện vật'}
                                {item.type === 'timeline' && '📜 Bổ sung Mốc lịch sử'}
                                {item.type === 'story' && '✍️ Ký ức / Lời kể'}
                              </span>

                              <div className="flex items-center gap-1 text-xs font-bold text-gray-700">
                                <User className="w-3 h-3 text-gray-400" />
                                <span>{item.authorName}</span>
                                <span className="text-[11px] text-gray-400 font-normal">({item.authorRole})</span>
                              </div>
                            </div>

                            <div className="text-[11px] text-gray-500 flex items-center gap-2">
                              <span>Liên hệ: <strong className="text-gray-700">{item.authorContact}</strong></span>
                              <span>•</span>
                              <span>Gửi lúc: {new Date(item.submittedAt || Date.now()).toLocaleString('vi-VN')}</span>
                            </div>
                          </div>

                          {/* Status Badge */}
                          <div>
                            {item.status === 'pending' && (
                              <span className="inline-flex items-center gap-1 text-xs font-black px-3 py-1 rounded-full bg-amber-500 text-white shadow-xs animate-pulse">
                                <Clock className="w-3.5 h-3.5" />
                                <span>Chờ xem xét</span>
                              </span>
                            )}
                            {item.status === 'approved' && (
                              <span className="inline-flex items-center gap-1 text-xs font-black px-3 py-1 rounded-full bg-emerald-600 text-white shadow-xs">
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>Đã đăng web</span>
                              </span>
                            )}
                            {item.status === 'rejected' && (
                              <span className="inline-flex items-center gap-1 text-xs font-black px-3 py-1 rounded-full bg-rose-600 text-white shadow-xs">
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Từ chối</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Content & Edit Mode */}
                        {isEditing ? (
                          <div className="p-4 bg-white rounded-xl border border-amber-300 space-y-3">
                            <div className="text-xs font-black text-[#7B1113] uppercase">
                              ✏️ Chỉnh sửa nội dung trước khi duyệt đăng
                            </div>

                            <div>
                              <label className="text-[11px] font-bold text-gray-700 block mb-1">Tiêu đề / Tên</label>
                              <input
                                type="text"
                                value={tempEditValues.title}
                                onChange={(e) => setTempEditValues({ ...tempEditValues, title: e.target.value })}
                                className="w-full p-2 rounded-lg border text-xs font-bold"
                              />
                            </div>

                            <div>
                              <label className="text-[11px] font-bold text-gray-700 block mb-1">Nội dung / Tóm tắt</label>
                              <textarea
                                rows={3}
                                value={tempEditValues.summary}
                                onChange={(e) => setTempEditValues({ ...tempEditValues, summary: e.target.value })}
                                className="w-full p-2 rounded-lg border text-xs leading-relaxed"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-[11px] font-bold text-gray-700 block mb-1">Năm / Mốc thời gian</label>
                                <input
                                  type="text"
                                  value={tempEditValues.year}
                                  onChange={(e) => setTempEditValues({ ...tempEditValues, year: e.target.value })}
                                  className="w-full p-2 rounded-lg border text-xs"
                                />
                              </div>
                              <div>
                                <label className="text-[11px] font-bold text-gray-700 block mb-1">Địa chỉ / Nguồn</label>
                                <input
                                  type="text"
                                  value={tempEditValues.address || tempEditValues.source}
                                  onChange={(e) => setTempEditValues({ ...tempEditValues, address: e.target.value, source: e.target.value })}
                                  className="w-full p-2 rounded-lg border text-xs"
                                />
                              </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                              <button
                                onClick={() => setEditingContribId(null)}
                                className="px-3 py-1.5 rounded-lg border text-xs font-bold text-gray-600 hover:bg-gray-100 cursor-pointer"
                              >
                                Hủy sửa
                              </button>
                              <button
                                onClick={() => handleApprove(item)}
                                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white shadow cursor-pointer flex items-center gap-1.5"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Lưu & Duyệt Đăng Ngay</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2 bg-white/80 p-3.5 rounded-xl border border-gray-200">
                            <h4 className="font-serif-title font-bold text-base text-[#7B1113]">
                              {item.title || item.name}
                            </h4>

                            <p className="text-xs text-gray-700 leading-relaxed">
                              {item.summary || item.caption || item.description}
                            </p>

                            {/* Additional metadata tags */}
                            <div className="flex items-center gap-4 text-[11px] text-gray-500 pt-1 flex-wrap">
                              {item.year && <div><strong>Mốc năm:</strong> {item.year}</div>}
                              {item.category && <div><strong>Xếp hạng:</strong> {item.category}</div>}
                              {item.address && <div><strong>Địa chỉ:</strong> {item.address}</div>}
                              {item.source && <div><strong>Nguồn:</strong> {item.source}</div>}
                            </div>

                            {/* Image preview */}
                            {item.image && (
                              <div className="pt-2 flex items-center gap-3">
                                <img
                                  src={item.image}
                                  alt="Preview tư liệu"
                                  className="w-24 h-16 object-cover rounded-lg border shadow-xs"
                                  onError={(e) => { e.target.style.display = 'none'; }}
                                />
                                <div className="text-[11px] text-gray-500">
                                  <span className="font-bold text-gray-700">Hình ảnh tư liệu gửi kèm:</span>
                                  <div className="text-gray-400 line-clamp-1">{item.image.slice(0, 50)}...</div>
                                </div>
                              </div>
                            )}

                            {item.adminNotes && (
                              <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800">
                                <strong>Lý do từ chối:</strong> {item.adminNotes}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Action buttons bar */}
                        <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            {item.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleApprove(item)}
                                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md cursor-pointer transition-transform hover:scale-105"
                                  title="Phê duyệt và tự động đưa tư liệu này hiển thị trên website"
                                >
                                  <Check className="w-4 h-4" />
                                  <span>Duyệt & Đăng Lên Web</span>
                                </button>

                                <button
                                  onClick={() => handleStartEditContrib(item)}
                                  className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer"
                                  title="Chỉnh sửa câu từ trước khi duyệt"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                  <span>Sửa trước khi duyệt</span>
                                </button>

                                <button
                                  onClick={() => {
                                    const reason = prompt('Nhập lý do từ chối bản ghi này (tùy chọn):', 'Thông tin chưa đủ nguồn kiểm chứng');
                                    if (reason !== null && onRejectContribution) {
                                      onRejectContribution(item.id, reason);
                                    }
                                  }}
                                  className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white border border-rose-200 text-xs font-bold text-rose-700 hover:bg-rose-50 cursor-pointer"
                                  title="Từ chối bản ghi này"
                                >
                                  <XCircle className="w-3.5 h-3.5" />
                                  <span>Từ chối</span>
                                </button>
                              </>
                            )}

                            {item.status === 'approved' && onRevokeContribution && (
                              <button
                                onClick={() => onRevokeContribution(item)}
                                className="flex items-center gap-1 text-xs text-gray-500 hover:text-amber-700 font-bold px-2 py-1 cursor-pointer"
                                title="Thu hồi trạng thái đăng tải"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Thu hồi / Gỡ khỏi web</span>
                              </button>
                            )}
                          </div>

                          {onDeleteContribution && (
                            <button
                              onClick={() => {
                                if (confirm('Bạn có chắc muốn xóa bản ghi đóng góp này?')) {
                                  onDeleteContribution(item.id);
                                }
                              }}
                              className="text-gray-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                              title="Xóa vĩnh viễn"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 2: THÔNG TIN CHUNG */}
          {activeTab === 'general' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Tên Di Tích</label>
                <input
                  type="text"
                  value={editData.info.name}
                  onChange={(e) => setEditData({ ...editData, info: { ...editData.info, name: e.target.value } })}
                  className="w-full p-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#7B1113] outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Khẩu hiệu / Phụ đề</label>
                <input
                  type="text"
                  value={editData.info.subtitle}
                  onChange={(e) => setEditData({ ...editData, info: { ...editData.info, subtitle: e.target.value } })}
                  className="w-full p-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#7B1113] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Cấp xếp hạng</label>
                  <input
                    type="text"
                    value={editData.info.ranking}
                    onChange={(e) => setEditData({ ...editData, info: { ...editData.info, ranking: e.target.value } })}
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Loại di tích</label>
                  <input
                    type="text"
                    value={editData.info.type}
                    onChange={(e) => setEditData({ ...editData, info: { ...editData.info, type: e.target.value } })}
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-sm outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Địa chỉ</label>
                <input
                  type="text"
                  value={editData.info.address}
                  onChange={(e) => setEditData({ ...editData, info: { ...editData.info, address: e.target.value } })}
                  className="w-full p-2.5 rounded-xl border border-gray-300 text-sm outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Đoạn văn Giá trị lịch sử</label>
                <textarea
                  rows={4}
                  value={editData.info.overview}
                  onChange={(e) => setEditData({ ...editData, info: { ...editData.info, overview: e.target.value } })}
                  className="w-full p-2.5 rounded-xl border border-gray-300 text-sm outline-none leading-relaxed"
                />
              </div>

              {/* Hero Image Edit */}
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
                <label className="text-xs font-bold text-gray-700 block">Ảnh bìa Hero Dinh Độc Lập</label>
                <div className="flex items-center gap-4">
                  <img
                    src={editData.info.heroImage || '/assets/images/dinh-doc-lap-front.jpg'}
                    alt="Hero Preview"
                    className="w-28 h-16 object-cover rounded-lg border shadow-xs"
                  />
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      placeholder="Đường dẫn ảnh hoặc URL..."
                      value={editData.info.heroImage}
                      onChange={(e) => setEditData({ ...editData, info: { ...editData.info, heroImage: e.target.value } })}
                      className="w-full p-2 rounded-lg border text-xs bg-white"
                    />
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold cursor-pointer transition-colors shadow-xs">
                      <span>📁 Tải ảnh mới từ máy tính</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            setEditData({ ...editData, info: { ...editData.info, heroImage: ev.target.result } });
                          };
                          reader.readAsDataURL(file);
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-3">
                <h4 className="font-bold text-xs text-amber-900 uppercase">Thông số "Em có biết?"</h4>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[11px] text-gray-600 block mb-1">Khuôn viên</label>
                    <input
                      type="text"
                      value={editData.info.stats.campusArea}
                      onChange={(e) => setEditData({
                        ...editData,
                        info: { ...editData.info, stats: { ...editData.info.stats, campusArea: e.target.value } }
                      })}
                      className="w-full p-2 rounded-lg border text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-gray-600 block mb-1">Số phòng</label>
                    <input
                      type="text"
                      value={editData.info.stats.roomsCount}
                      onChange={(e) => setEditData({
                        ...editData,
                        info: { ...editData.info, stats: { ...editData.info.stats, roomsCount: e.target.value } }
                      })}
                      className="w-full p-2 rounded-lg border text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-gray-600 block mb-1">Hiện vật</label>
                    <input
                      type="text"
                      value={editData.info.stats.artifactsCount}
                      onChange={(e) => setEditData({
                        ...editData,
                        info: { ...editData.info, stats: { ...editData.info.stats, artifactsCount: e.target.value } }
                      })}
                      className="w-full p-2 rounded-lg border text-xs bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MỐC LỊCH SỬ */}
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-700">Danh sách các mốc thời gian ({editData.timeline.length})</span>
                <button
                  onClick={() => {
                    const newId = Date.now();
                    setEditData({
                      ...editData,
                      timeline: [...editData.timeline, { id: newId, year: 'Mốc mới', title: 'Tiêu đề sự kiện', description: 'Chi tiết sự kiện...' }]
                    });
                  }}
                  className="flex items-center gap-1 text-xs font-bold text-[#7B1113] hover:underline cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Thêm mốc mới
                </button>
              </div>

              {editData.timeline.map((item, idx) => (
                <div key={item.id || idx} className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2 relative group">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={item.year}
                      onChange={(e) => {
                        const updated = [...editData.timeline];
                        updated[idx].year = e.target.value;
                        setEditData({ ...editData, timeline: updated });
                      }}
                      className="font-bold text-sm text-[#7B1113] bg-white border border-gray-300 rounded px-2 py-1 w-32"
                    />
                    <button
                      onClick={() => {
                        const updated = editData.timeline.filter((_, i) => i !== idx);
                        setEditData({ ...editData, timeline: updated });
                      }}
                      className="text-gray-400 hover:text-red-600 p-1 cursor-pointer"
                      title="Xóa mốc này"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => {
                      const updated = [...editData.timeline];
                      updated[idx].title = e.target.value;
                      setEditData({ ...editData, timeline: updated });
                    }}
                    className="w-full font-semibold text-xs text-gray-900 bg-white border border-gray-300 rounded px-2 py-1"
                  />

                  <textarea
                    rows={2}
                    value={item.description}
                    onChange={(e) => {
                      const updated = [...editData.timeline];
                      updated[idx].description = e.target.value;
                      setEditData({ ...editData, timeline: updated });
                    }}
                    className="w-full text-xs text-gray-600 bg-white border border-gray-300 rounded px-2 py-1"
                  />
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: KHO ẢNH & HIỆN VẬT */}
          {activeTab === 'gallery' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-700">Bộ sưu tập hình ảnh & hiện vật ({editData.gallery.length})</span>
                <label className="flex items-center gap-1 text-xs font-bold text-[#7B1113] hover:underline cursor-pointer">
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm ảnh từ máy tính</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        const newImg = {
                          id: Date.now(),
                          src: ev.target.result,
                          title: file.name.replace(/\.[^/.]+$/, ''),
                          caption: 'Ảnh tư liệu mới tải lên',
                          year: 'Tư liệu'
                        };
                        setEditData({ ...editData, gallery: [...editData.gallery, newImg] });
                      };
                      reader.readAsDataURL(file);
                    }}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {editData.gallery.map((img, idx) => (
                  <div key={img.id || idx} className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 space-y-2.5 relative group">
                    <div className="relative h-32 w-full rounded-xl overflow-hidden bg-black/10">
                      <img src={img.src} alt={img.title} className="w-full h-full object-cover" />
                      <button
                        onClick={() => {
                          const updated = editData.gallery.filter((_, i) => i !== idx);
                          setEditData({ ...editData, gallery: updated });
                        }}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-red-600 text-white shadow-md hover:bg-red-700 transition-colors cursor-pointer"
                        title="Xóa bức ảnh này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Tiêu đề ảnh</label>
                      <input
                        type="text"
                        value={img.title}
                        onChange={(e) => {
                          const updated = [...editData.gallery];
                          updated[idx].title = e.target.value;
                          setEditData({ ...editData, gallery: updated });
                        }}
                        className="w-full text-xs font-bold bg-white border border-gray-300 p-1.5 rounded-lg outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Chú thích ảnh</label>
                      <input
                        type="text"
                        value={img.caption}
                        onChange={(e) => {
                          const updated = [...editData.gallery];
                          updated[idx].caption = e.target.value;
                          setEditData({ ...editData, gallery: updated });
                        }}
                        className="w-full text-[11px] text-gray-600 bg-white border border-gray-300 p-1.5 rounded-lg outline-none"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <label className="text-[11px] text-[#7B1113] font-bold hover:underline cursor-pointer flex items-center gap-1">
                        <span>📁 Đổi file ảnh</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              const updated = [...editData.gallery];
                              updated[idx].src = ev.target.result;
                              setEditData({ ...editData, gallery: updated });
                            };
                            reader.readAsDataURL(file);
                          }}
                          className="hidden"
                        />
                      </label>
                      <input
                        type="text"
                        value={img.year || ''}
                        placeholder="Năm (vd: 1975)"
                        onChange={(e) => {
                          const updated = [...editData.gallery];
                          updated[idx].year = e.target.value;
                          setEditData({ ...editData, gallery: updated });
                        }}
                        className="text-[11px] w-24 p-1 rounded border bg-white text-center font-semibold"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: DI TÍCH TIẾP THEO */}
          {activeTab === 'nextMonuments' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-700">Kho di tích lân cận ({editData.nextMonuments?.length || 0})</span>
                <button
                  onClick={() => {
                    const newId = 'monument_' + Date.now();
                    const newMon = {
                      id: newId,
                      name: 'Di tích mới đề xuất',
                      category: 'Di tích Lịch sử cấp Quốc gia',
                      ranking: 'Di tích Lịch sử cấp Quốc gia',
                      address: 'TP. Hồ Chí Minh',
                      image: '/assets/images/dinh-doc-lap-front.jpg',
                      summary: 'Tóm tắt nội dung lịch sử di tích...',
                      highlight: 'Điểm nổi bật của di tích.'
                    };
                    setEditData({
                      ...editData,
                      nextMonuments: [...(editData.nextMonuments || []), newMon]
                    });
                  }}
                  className="flex items-center gap-1 text-xs font-bold text-[#7B1113] hover:underline cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Thêm di tích mới
                </button>
              </div>

              {(editData.nextMonuments || []).map((mon, idx) => (
                <div key={mon.id || idx} className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-3 relative group">
                  <div className="flex items-start justify-between gap-3">
                    <input
                      type="text"
                      value={mon.name}
                      onChange={(e) => {
                        const updated = [...editData.nextMonuments];
                        updated[idx].name = e.target.value;
                        setEditData({ ...editData, nextMonuments: updated });
                      }}
                      className="font-bold text-sm text-[#7B1113] bg-white border border-gray-300 rounded px-2 py-1 flex-1"
                    />
                    <button
                      onClick={() => {
                        const updated = editData.nextMonuments.filter((_, i) => i !== idx);
                        setEditData({ ...editData, nextMonuments: updated });
                      }}
                      className="text-gray-400 hover:text-red-600 p-1 cursor-pointer"
                      title="Xóa di tích này"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Cấp xếp hạng"
                      value={mon.ranking || mon.category}
                      onChange={(e) => {
                        const updated = [...editData.nextMonuments];
                        updated[idx].ranking = e.target.value;
                        updated[idx].category = e.target.value;
                        setEditData({ ...editData, nextMonuments: updated });
                      }}
                      className="text-xs bg-white border border-gray-300 rounded p-1.5"
                    />
                    <input
                      type="text"
                      placeholder="Địa chỉ"
                      value={mon.address}
                      onChange={(e) => {
                        const updated = [...editData.nextMonuments];
                        updated[idx].address = e.target.value;
                        setEditData({ ...editData, nextMonuments: updated });
                      }}
                      className="text-xs bg-white border border-gray-300 rounded p-1.5"
                    />
                  </div>

                  <textarea
                    rows={2}
                    placeholder="Tóm tắt giới thiệu"
                    value={mon.summary}
                    onChange={(e) => {
                      const updated = [...editData.nextMonuments];
                      updated[idx].summary = e.target.value;
                      setEditData({ ...editData, nextMonuments: updated });
                    }}
                    className="w-full text-xs text-gray-700 bg-white border border-gray-300 rounded p-2 leading-relaxed"
                  />

                  <div className="flex items-center gap-3">
                    <img
                      src={mon.image || '/assets/images/dinh-doc-lap-front.jpg'}
                      alt="Preview"
                      className="w-16 h-12 object-cover rounded border"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <input
                      type="text"
                      placeholder="Link ảnh..."
                      value={mon.image}
                      onChange={(e) => {
                        const updated = [...editData.nextMonuments];
                        updated[idx].image = e.target.value;
                        setEditData({ ...editData, nextMonuments: updated });
                      }}
                      className="flex-1 text-xs bg-white border border-gray-300 rounded p-1.5"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 6: HỒ SƠ ĐIỀU TRA */}
          {activeTab === 'investigation' && (
            <div className="space-y-4">
              <span className="text-xs font-bold text-gray-700 block">3 Hồ sơ điều tra di tích (Sự kiện, Nhân vật, Hiện vật)</span>
              {editData.investigation.dossiers.map((dos, idx) => (
                <div key={dos.id || idx} className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Tên hồ sơ</label>
                    <input
                      type="text"
                      value={dos.title}
                      onChange={(e) => {
                        const updated = [...editData.investigation.dossiers];
                        updated[idx].title = e.target.value;
                        setEditData({ ...editData, investigation: { ...editData.investigation, dossiers: updated } });
                      }}
                      className="w-full font-bold text-sm text-[#7B1113] bg-white border p-1.5 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Mô tả ngắn gọn</label>
                    <input
                      type="text"
                      value={dos.subtitle}
                      onChange={(e) => {
                        const updated = [...editData.investigation.dossiers];
                        updated[idx].subtitle = e.target.value;
                        setEditData({ ...editData, investigation: { ...editData.investigation, dossiers: updated } });
                      }}
                      className="w-full text-xs text-[#2C241E] bg-white border p-1.5 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Nội dung chi tiết hồ sơ</label>
                    <textarea
                      rows={3}
                      value={dos.detail}
                      onChange={(e) => {
                        const updated = [...editData.investigation.dossiers];
                        updated[idx].detail = e.target.value;
                        setEditData({ ...editData, investigation: { ...editData.investigation, dossiers: updated } });
                      }}
                      className="w-full text-xs text-gray-700 bg-white border p-2 rounded-lg leading-relaxed"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 7: THUYẾT MINH */}
          {activeTab === 'audio' && (
            <div className="space-y-4">
              <span className="text-xs font-bold text-gray-700 block">Văn bản thuyết minh tiếng Việt (10 đoạn)</span>
              {editData.audioScript.map((sec, idx) => (
                <div key={sec.index || idx} className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                  <input
                    type="text"
                    value={sec.title}
                    onChange={(e) => {
                      const updated = [...editData.audioScript];
                      updated[idx].title = e.target.value;
                      setEditData({ ...editData, audioScript: updated });
                    }}
                    className="w-full font-bold text-xs text-[#7B1113] bg-white border p-1.5 rounded-lg"
                  />
                  <textarea
                    rows={3}
                    value={sec.text}
                    onChange={(e) => {
                      const updated = [...editData.audioScript];
                      updated[idx].text = e.target.value;
                      setEditData({ ...editData, audioScript: updated });
                    }}
                    className="w-full text-xs text-gray-700 bg-white border p-2 rounded-lg leading-relaxed"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions Bar */}
        <div className="bg-[#FAF7F2] p-4 border-t border-[#EADBC8] flex flex-wrap items-center justify-between gap-3 shadow-inner">
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJSON}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer shadow-2xs"
              title="Xuất file JSON sao lưu toàn bộ dữ liệu & đóng góp"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Xuất JSON</span>
            </button>

            <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer shadow-2xs">
              <Upload className="w-3.5 h-3.5" />
              <span>Nhập JSON</span>
              <input ref={fileInputRef} type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
            </label>

            <button
              onClick={() => {
                if (confirm('Bạn có chắc muốn khôi phục lại dữ liệu ban đầu?')) {
                  onResetDefault();
                  alert('Đã khôi phục dữ liệu gốc!');
                }
              }}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-600 px-2 py-2 cursor-pointer"
              title="Khôi phục mặc định"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white shadow-md transition-all cursor-pointer ${
              saveSuccess ? 'bg-emerald-600' : 'bg-[#7B1113] hover:bg-[#96171a]'
            }`}
          >
            {saveSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Đã lưu vào bộ nhớ!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Lưu thay đổi</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
