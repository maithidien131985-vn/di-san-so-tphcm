import React from 'react';
import { X, Leaf, Heart, CheckCircle2, Shield, Share2, Send, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ActionModal({ isOpen, onClose }) {
  const [pledgeName, setPledgeName] = React.useState('');
  const [pledgeMsg, setPledgeMsg] = React.useState('');
  const [pledges, setPledges] = React.useState([
    { name: 'Nguyễn Văn An', text: 'Em cam kết tìm hiểu sâu sắc lịch sử dân tộc và giới thiệu di tích Dinh Độc Lập đến bạn bè quốc tế!' },
    { name: 'Trần Thị Mai', text: 'Giữ gìn vệ sinh và tôn trọng không gian trang nghiêm khi đến tham quan các khu di tích lịch sử.' },
    { name: 'Lê Hoàng Nam', text: 'Tích cực chia sẻ các tư liệu lịch sử đúng đắn trên mạng xã hội để lan tỏa tinh thần yêu nước.' }
  ]);
  const [hasSubmitted, setHasSubmitted] = React.useState(false);

  if (!isOpen) return null;

  const handleAddPledge = (e) => {
    e.preventDefault();
    if (!pledgeName.trim() || !pledgeMsg.trim()) return;

    setPledges([{ name: pledgeName.trim(), text: pledgeMsg.trim() }, ...pledges]);
    setPledgeName('');
    setPledgeMsg('');
    setHasSubmitted(true);
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#FAF7F2] w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl border border-[#EADBC8] flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#A6732E] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-amber-200">
              <Leaf className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif-title font-bold text-lg text-amber-100">
                Hành Động: Giữ Gìn & Phát Huy Di Sản
              </h3>
              <p className="text-xs text-white/90">
                Trách nhiệm và niềm tự hào của thế hệ trẻ đối với di sản văn hóa dân tộc
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

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Action Guidelines */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-white border border-[#EADBC8] shadow-xs space-y-2">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-[#A6732E] flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h4 className="font-bold text-sm text-[#2C241E]">Học tập & Tự hào</h4>
              <p className="text-xs text-[#6B5E55] leading-relaxed">
                Nắm vững kiến thức lịch sử, tìm hiểu giá trị các hiện vật và thời khắc hào hùng 30/4/1975.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#EADBC8] shadow-xs space-y-2">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-[#A6732E] flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h4 className="font-bold text-sm text-[#2C241E]">Bảo vệ Di tích</h4>
              <p className="text-xs text-[#6B5E55] leading-relaxed">
                Ứng xử văn minh khi tham quan, không xâm hại hiện vật, giữ gìn cảnh quan xanh - sạch - đẹp.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#EADBC8] shadow-xs space-y-2">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-[#A6732E] flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h4 className="font-bold text-sm text-[#2C241E]">Lan tỏa Di sản số</h4>
              <p className="text-xs text-[#6B5E55] leading-relaxed">
                Ứng dụng công nghệ và truyền thông số để quảng bá giá trị di tích đến cộng đồng bạn bè thế giới.
              </p>
            </div>
          </div>

          {/* Sổ tay thông điệp / Lời cam kết */}
          <div className="p-5 rounded-2xl bg-white border border-[#EADBC8] shadow-xs space-y-4">
            <h4 className="font-serif-title font-bold text-base text-[#7B1113] flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              Gửi lời cam kết & thông điệp tri ân
            </h4>

            <form onSubmit={handleAddPledge} className="space-y-3">
              <input
                type="text"
                placeholder="Họ và tên của bạn / Lớp / Trường..."
                value={pledgeName}
                onChange={(e) => setPledgeName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm outline-none focus:border-[#A6732E]"
                required
              />
              <textarea
                rows={2}
                placeholder="Lời hứa hoặc cảm nghĩ của bạn sau khi tìm hiểu Di tích Dinh Độc Lập..."
                value={pledgeMsg}
                onChange={(e) => setPledgeMsg(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm outline-none focus:border-[#A6732E]"
                required
              />
              <button
                type="submit"
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#A6732E] hover:bg-[#8d5f24] text-white text-xs font-bold shadow transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Gửi lời cam kết</span>
              </button>
            </form>

            {/* List of pledges */}
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
              <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Thông điệp từ các bạn trẻ:</h5>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {pledges.map((p, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EADBC8] text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <strong className="text-[#7B1113]">{p.name}</strong>
                      <span className="text-[10px] text-gray-400">Vừa gửi</span>
                    </div>
                    <p className="text-[#555]">{p.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
