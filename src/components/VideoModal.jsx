import React from 'react';
import { X, Play, Film, Sparkles, ExternalLink } from 'lucide-react';

export default function VideoModal({ isOpen, onClose, videoInfo }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#1A1A1A] w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl border border-neutral-700 flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-neutral-800 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-md">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-title font-bold text-base sm:text-lg text-amber-200">
                {videoInfo.title || 'Phim tư liệu: Dinh Độc Lập'}
              </h3>
              <p className="text-xs text-neutral-400">
                Tư liệu hình ảnh ngày 30/4/1975 & Khảo cứu lịch sử
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Embed */}
        <div className="aspect-video w-full bg-black">
          <iframe
            src={
              videoInfo?.videoType === 'drive' || videoInfo?.driveFileId || (videoInfo?.youtubeUrl && videoInfo.youtubeUrl.includes('drive.google.com'))
                ? (videoInfo?.driveFileId ? `https://drive.google.com/file/d/${videoInfo.driveFileId}/preview` : videoInfo?.youtubeUrl?.replace(/\/view.*$/, '/preview'))
                : (videoInfo?.embedUrl || `https://www.youtube.com/embed/${videoInfo.youtubeId || 'cplxidwCHyE'}?autoplay=1&rel=0`)
            }
            title={videoInfo?.title || "Video tư liệu di tích"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full border-0"
          />
        </div>

        {/* Video Footer info */}
        <div className="p-4 bg-neutral-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-neutral-300">
          <span className="text-amber-200 font-medium">
            {videoInfo?.copyright || (videoInfo?.channel ? `Bản quyền: ${videoInfo.channel}` : 'Bản quyền Kênh Tư liệu')}
          </span>
          <a
            href={videoInfo?.youtubeUrl || (videoInfo?.driveFileId ? `https://drive.google.com/file/d/${videoInfo.driveFileId}/view` : `https://www.youtube.com/watch?v=${videoInfo?.youtubeId || 'cplxidwCHyE'}`)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-400 hover:underline flex items-center gap-1 font-semibold shrink-0"
          >
            <span>{videoInfo?.videoType === 'drive' || videoInfo?.driveFileId || (videoInfo?.youtubeUrl && videoInfo.youtubeUrl.includes('drive.google.com')) ? 'Mở trên Google Drive' : 'Mở liên kết YouTube'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
