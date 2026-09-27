import React from 'react';
import { X, Play, Film, Sparkles, ExternalLink } from 'lucide-react';

export default function VideoModal({ isOpen, onClose, videoInfo, video }) {
  if (!isOpen) return null;
  const currentVideo = videoInfo || video || {};

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
                {currentVideo?.title || 'Phim tư liệu di tích'}
              </h3>
              <p className="text-xs text-neutral-400">
                {currentVideo?.subtitle || 'Tư liệu lịch sử & Phim phóng sự khảo cứu'}
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
          {currentVideo?.videoType === 'local' || currentVideo?.localUrl || currentVideo?.mp4Url || (currentVideo?.src && currentVideo.src.endsWith('.mp4')) ? (
            <video
              className="w-full h-full object-contain bg-black"
              controls
              autoPlay
              playsInline
              src={currentVideo?.localUrl || currentVideo?.mp4Url || currentVideo?.src}
              title={currentVideo?.title || "Video tư liệu di tích"}
            >
              Trình duyệt không hỗ trợ xem video trực tiếp.
            </video>
          ) : (
            <iframe
              src={
                currentVideo?.videoType === 'drive' || currentVideo?.driveFileId || (currentVideo?.youtubeUrl && currentVideo.youtubeUrl.includes('drive.google.com'))
                  ? (currentVideo?.driveFileId ? `https://drive.google.com/file/d/${currentVideo.driveFileId}/preview` : currentVideo?.youtubeUrl?.replace(/\/view.*$/, '/preview'))
                  : (currentVideo?.embedUrl || `https://www.youtube.com/embed/${currentVideo?.youtubeId || 'cplxidwCHyE'}?autoplay=1&rel=0`)
              }
              title={currentVideo?.title || "Video tư liệu di tích"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full border-0"
            />
          )}
        </div>

        {/* Video Footer info */}
        <div className="p-4 bg-neutral-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-neutral-300">
          <span className="text-amber-200 font-medium">
            {currentVideo?.copyright || (currentVideo?.channel ? `Bản quyền: ${currentVideo.channel}` : 'Bản quyền Kênh Tư liệu')}
          </span>
          <a
            href={
              currentVideo?.videoType === 'local' || currentVideo?.localUrl || currentVideo?.mp4Url || (currentVideo?.src && currentVideo.src.endsWith('.mp4'))
                ? (currentVideo?.localUrl || currentVideo?.mp4Url || currentVideo?.src)
                : (currentVideo?.youtubeUrl || (currentVideo?.driveFileId ? `https://drive.google.com/file/d/${currentVideo.driveFileId}/view` : `https://www.youtube.com/watch?v=${currentVideo?.youtubeId || 'cplxidwCHyE'}`))
            }
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-400 hover:underline flex items-center gap-1 font-semibold shrink-0"
          >
            <span>
              {currentVideo?.videoType === 'local' || currentVideo?.localUrl || currentVideo?.mp4Url || (currentVideo?.src && currentVideo.src.endsWith('.mp4'))
                ? 'Mở video gốc MP4'
                : (currentVideo?.videoType === 'drive' || currentVideo?.driveFileId || (currentVideo?.youtubeUrl && currentVideo.youtubeUrl.includes('drive.google.com')) ? 'Mở trên Google Drive' : 'Mở liên kết YouTube')}
            </span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
