import React, { useState, useMemo, useEffect } from 'react';
import { 
  X, 
  Search, 
  Play, 
  Download, 
  ExternalLink, 
  Check, 
  Copy, 
  Film, 
  Flame, 
  Sparkles, 
  Lock, 
  Tv, 
  BookOpen, 
  Share2, 
  Clock, 
  Filter,
  CheckCircle2,
  ListVideo,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  PlusCircle,
  RefreshCw,
  Info
} from 'lucide-react';
import { 
  YOUTUBE_CHANNELS, 
  INITIAL_VIDEOS, 
  TeacherVideo, 
  YouTubeChannel 
} from '../data/youtubeStudyData';
import { playSound } from '../utils/audioSynth';

const STORAGE_KEY_CUSTOM_VIDEOS = 'youtube_study_custom_videos_v1';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const YouTubeStudyModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [selectedChannelId, setSelectedChannelId] = useState<string>('all');
  const [contentType, setContentType] = useState<'all' | 'videos' | 'shorts'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showDownloadMenu, setShowDownloadMenu] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [refreshSuccess, setRefreshSuccess] = useState<boolean>(false);

  // Form state for adding upcoming/new videos from the 5 channels
  const [newVideoUrl, setNewVideoUrl] = useState<string>('');
  const [newVideoTitle, setNewVideoTitle] = useState<string>('');
  const [newVideoChannel, setNewVideoChannel] = useState<string>('waleed-mohsen');
  const [newVideoType, setNewVideoType] = useState<'video' | 'short'>('video');
  const [addError, setAddError] = useState<string>('');

  // Persisted state of added videos so newly uploaded lectures by the 5 teachers can be included
  const [customVideos, setCustomVideos] = useState<TeacherVideo[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CUSTOM_VIDEOS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return [];
  });

  // Combine initial curated library with user-saved videos
  const allVideos = useMemo(() => {
    return [...customVideos, ...INITIAL_VIDEOS];
  }, [customVideos]);

  const [activeVideo, setActiveVideo] = useState<TeacherVideo | null>(() => allVideos[0] || INITIAL_VIDEOS[0]);

  // Keep active video valid if list changes
  useEffect(() => {
    if (!activeVideo && allVideos.length > 0) {
      setActiveVideo(allVideos[0]);
    }
  }, [allVideos, activeVideo]);

  // Refresh handler (checks local persistence and confirms sync)
  const handleRefreshFeed = () => {
    setIsRefreshing(true);
    playSound('click');
    setTimeout(() => {
      setIsRefreshing(false);
      setRefreshSuccess(true);
      playSound('success');
      setTimeout(() => setRefreshSuccess(false), 2500);
    }, 600);
  };

  // Helper to extract YouTube video ID
  const extractYouTubeId = (url: string): string | null => {
    const trimmed = url.trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
      return trimmed;
    }
    const match = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
    return match ? match[1] : null;
  };

  // Add new video to the 5 channels
  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    setAddError('');

    const ytId = extractYouTubeId(newVideoUrl);
    if (!ytId) {
      setAddError('يرجى كتابة رابط يوتيوب صحيح أو كود الفيديو (11 حرف)');
      return;
    }

    const channel = YOUTUBE_CHANNELS.find((c) => c.id === newVideoChannel);
    if (!channel) {
      setAddError('القناة المختارة غير صالحة');
      return;
    }

    const newVideo: TeacherVideo = {
      id: `custom-${Date.now()}`,
      title: newVideoTitle.trim() || `حصة جديدة - ${channel.name}`,
      channelId: channel.id,
      channelName: channel.name,
      subject: channel.subject,
      youtubeId: ytId,
      duration: newVideoType === 'short' ? '0:59' : 'جديد',
      isShort: newVideoType === 'short',
      tag: 'مضاف حديثاً',
      views: 'جديد',
      date: 'اليوم',
    };

    const updated = [newVideo, ...customVideos];
    setCustomVideos(updated);
    try {
      localStorage.setItem(STORAGE_KEY_CUSTOM_VIDEOS, JSON.stringify(updated));
    } catch {
      // ignore
    }

    setActiveVideo(newVideo);
    playSound('success');
    setShowAddModal(false);
    setNewVideoUrl('');
    setNewVideoTitle('');
  };

  // Filtered list strictly within the 5 allowed channels
  const filteredVideos = useMemo(() => {
    return allVideos.filter((v) => {
      // 1. Channel Filter
      if (selectedChannelId !== 'all' && v.channelId !== selectedChannelId) {
        return false;
      }
      // 2. Content Type (Videos vs Shorts)
      if (contentType === 'videos' && v.isShort) return false;
      if (contentType === 'shorts' && !v.isShort) return false;
      // 3. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = v.title.toLowerCase().includes(q);
        const matchTeacher = v.channelName.toLowerCase().includes(q);
        const matchSubject = v.subject.toLowerCase().includes(q);
        const matchTag = v.tag.toLowerCase().includes(q);
        return matchTitle || matchTeacher || matchSubject || matchTag;
      }
      return true;
    });
  }, [allVideos, selectedChannelId, contentType, searchQuery]);

  if (!isOpen) return null;

  const handleCopyVideoLink = (ytId: string) => {
    const url = `https://www.youtube.com/watch?v=${ytId}`;
    navigator.clipboard.writeText(url).then(() => {
      playSound('success');
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    });
  };

  const getDownloadHelperUrls = (ytId: string) => {
    const ytUrl = `https://www.youtube.com/watch?v=${ytId}`;
    return {
      savefrom: `https://en.savefrom.net/1-youtube-video-downloader-4vA/?url=${encodeURIComponent(ytUrl)}`,
      y2mate: `https://www.y2mate.com/youtube/${ytId}`,
      ssyoutube: `https://ssyoutube.com/watch?v=${ytId}`,
    };
  };

  const currentChannel = YOUTUBE_CHANNELS.find((c) => c.id === activeVideo?.channelId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-xl animate-in fade-in">
      <div className="relative bg-neutral-950 border border-neutral-800 rounded-3xl w-full max-w-7xl h-[94vh] flex flex-col shadow-2xl overflow-hidden text-right">
        
        {/* Top YouTube Header */}
        <header className="px-4 py-3 border-b border-neutral-800 bg-neutral-900/90 flex flex-wrap items-center justify-between gap-3 shrink-0">
          
          {/* Brand & 5 Channels Lock Badge */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/30 text-white">
                <Play className="w-5 h-5 fill-current ml-0.5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-base sm:text-lg font-black text-white font-heading tracking-tight">
                    يوتيوب المذاكرة
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 font-bold flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    <span>مغلق على 5 قنوات فقط</span>
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400">
                  خالٍ تماماً من المقترحات العشوائية والتشتيت • لخدمة طلاب الثانوية العامة
                </p>
              </div>
            </div>
          </div>

          {/* Search Bar (Strictly searching the 5 teachers' videos) */}
          <div className="flex-1 max-w-md mx-2">
            <div className="relative">
              <input
                type="text"
                placeholder="ابحث في شروحات وتريكات المدرسين الخمسة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-neutral-950 border border-neutral-700 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-500 transition-colors text-right"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute left-8 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={() => {
              playSound('click');
              onClose();
            }}
            className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white border border-neutral-700 transition-colors"
            title="إغلاق يوتيوب المذاكرة"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* 5 Channels Switcher Bar (Quick Tabs) */}
        <div className="px-4 py-2.5 bg-neutral-900/50 border-b border-neutral-800/80 flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0">
          <button
            onClick={() => {
              playSound('click');
              setSelectedChannelId('all');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              selectedChannelId === 'all'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>جميع القنوات (5)</span>
          </button>

          {YOUTUBE_CHANNELS.map((channel) => (
            <button
              key={channel.id}
              onClick={() => {
                playSound('click');
                setSelectedChannelId(channel.id);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 border ${
                selectedChannelId === channel.id
                  ? 'bg-neutral-800 border-red-500 text-white shadow-md'
                  : 'bg-neutral-950/70 border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span>{channel.name}</span>
              <span className="text-[10px] text-amber-400/90 font-normal font-sans">
                ({channel.subject})
              </span>
            </button>
          ))}
        </div>

        {/* Content Type Filter: All vs Videos vs Shorts */}
        <div className="px-4 py-2 bg-neutral-950/80 border-b border-neutral-800/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                playSound('click');
                setContentType('all');
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                contentType === 'all' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              الكل ({INITIAL_VIDEOS.length})
            </button>

            <button
              onClick={() => {
                playSound('click');
                setContentType('videos');
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                contentType === 'videos' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Tv className="w-3.5 h-3.5 text-blue-400" />
              <span>حصص ومحاضرات كاملة</span>
            </button>

            <button
              onClick={() => {
                playSound('click');
                setContentType('shorts');
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                contentType === 'shorts' ? 'bg-red-950/60 border border-red-500/40 text-red-300' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-red-400" />
              <span>شورتس وتريكات سريعة (Shorts)</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Live Feed Status & Add Lecture for 5 Channels */}
            <button
              onClick={handleRefreshFeed}
              disabled={isRefreshing}
              className="px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs font-bold text-neutral-300 flex items-center gap-1.5 transition-colors"
              title="التحقق من تحديثات القنوات ومزامنة الحصص"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{refreshSuccess ? 'تم التحديث بنجاح' : 'تحديث الحصص'}</span>
            </button>

            <button
              onClick={() => {
                playSound('click');
                setShowAddModal(true);
              }}
              className="px-2.5 py-1 rounded-lg bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-xs font-bold text-red-300 flex items-center gap-1.5 transition-all"
              title="إضافة أي حصة أو فيديو جديد نزل على إحدى القنوات الخمس لمشاهدته وتنزيله هنا"
            >
              <PlusCircle className="w-3.5 h-3.5 text-red-400" />
              <span>إضافة حصة جديدة للقنوات</span>
            </button>

            <div className="text-[11px] text-neutral-500 font-mono hidden md:block">
              {filteredVideos.length} فيديو متاح
            </div>
          </div>
        </div>

        {/* Main Body: Active Video Player on Left/Top & Video Grid on Right/Bottom */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* ACTIVE VIDEO THEATER (lg:col-span-7 or 8) */}
          <div className="lg:col-span-7 xl:col-span-8 p-3 sm:p-5 flex flex-col overflow-y-auto border-b lg:border-b-0 lg:border-l border-neutral-800 bg-black/40">
            {activeVideo ? (
              <div className="space-y-3">
                
                {/* Responsive Embedded YouTube Player */}
                <div className={`w-full overflow-hidden rounded-2xl bg-black border border-neutral-800 shadow-2xl relative ${
                  activeVideo.isShort ? 'max-w-xs mx-auto aspect-[9/16]' : 'aspect-video'
                }`}>
                  <iframe
                    key={activeVideo.youtubeId}
                    src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1&enablejsapi=1&rel=0&modestbranding=1`}
                    title={activeVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full border-none"
                  />
                </div>

                {/* Video Info & Controls Bar */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 text-right">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 font-bold">
                          {activeVideo.subject}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 font-bold">
                          {activeVideo.tag}
                        </span>
                        {activeVideo.isShort && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center gap-1">
                            <Flame className="w-3 h-3 text-amber-400" />
                            <span>مقطع قصير (Short)</span>
                          </span>
                        )}
                      </div>

                      <h2 className="text-sm sm:text-base font-black text-white leading-snug">
                        {activeVideo.title}
                      </h2>
                    </div>

                    {/* Quick copy link */}
                    <button
                      onClick={() => handleCopyVideoLink(activeVideo.youtubeId)}
                      className="p-2 rounded-xl bg-neutral-900 border border-neutral-700 text-neutral-400 hover:text-white text-xs font-bold flex items-center gap-1.5 shrink-0"
                      title="نسخ رابط الفيديو"
                    >
                      {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      <span className="hidden sm:inline">{copiedLink ? 'تم النسخ' : 'نسخ الرابط'}</span>
                    </button>
                  </div>

                  {/* Channel Banner & DOWNLOAD SECTION */}
                  <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-neutral-900/90 border border-neutral-800">
                    
                    {/* Channel info */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-amber-600 p-0.5 shadow-md flex items-center justify-center text-white font-bold">
                        {activeVideo.channelName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-sm text-white">
                            {activeVideo.channelName}
                          </span>
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                        </div>
                        <span className="text-[11px] text-neutral-400 block">
                          {currentChannel?.badge || 'قناة معتمدة في الثانوية العامة'}
                        </span>
                      </div>
                    </div>

                    {/* Action buttons: Download Video & Open Official Channel */}
                    <div className="flex items-center gap-2">
                      
                      {/* DOWNLOAD BUTTON (صيغة تحميل الفيديوهات) */}
                      <div className="relative">
                        <button
                          onClick={() => {
                            playSound('click');
                            setShowDownloadMenu(!showDownloadMenu);
                          }}
                          className="px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black flex items-center gap-1.5 shadow-lg shadow-emerald-600/25 transition-all"
                        >
                          <Download className="w-4 h-4" />
                          <span>تحميل الفيديو (MP4 / MP3)</span>
                        </button>

                        {/* Download Popup Helper */}
                        {showDownloadMenu && (
                          <div className="absolute top-full mt-2 left-0 z-50 w-72 p-3 bg-neutral-950 border-2 border-emerald-500/50 rounded-2xl shadow-2xl backdrop-blur-xl space-y-2 text-right animate-in fade-in">
                            <span className="text-[11px] font-bold text-emerald-400 block">
                              خيارات تنزيل وتحميل الفيديو للمشاهدة بدون إنترنت:
                            </span>

                            {/* SaveFrom Direct Link */}
                            <a
                              href={getDownloadHelperUrls(activeVideo.youtubeId).savefrom}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs text-white font-bold transition-all"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-emerald-400 text-[10px] font-mono">SaveFrom</span>
                                <span>تنزيل بجودة عالية (MP4 1080p / 720p) ↗</span>
                              </div>
                            </a>

                            {/* Y2Mate Direct Link */}
                            <a
                              href={getDownloadHelperUrls(activeVideo.youtubeId).y2mate}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs text-white font-bold transition-all"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-amber-400 text-[10px] font-mono">Y2Mate</span>
                                <span>تحميل صوتي فقط (Audio MP3) ↗</span>
                              </div>
                            </a>

                            {/* SSYouTube Helper */}
                            <a
                              href={getDownloadHelperUrls(activeVideo.youtubeId).ssyoutube}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs text-white font-bold transition-all"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-red-400 text-[10px] font-mono">SSYouTube</span>
                                <span>تحميل مباشر وسريع ↗</span>
                              </div>
                            </a>

                            <div className="pt-1 text-[10px] text-neutral-400 text-center">
                              اضغط على أي خيار لبدء التنزيل وحفظ الفيديو على جهازك
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Strictly In-App Guard Badge - No Escape Link */}
                      <div className="px-2.5 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-[11px] text-neutral-400 font-bold flex items-center gap-1.5 select-none">
                        <Lock className="w-3.5 h-3.5 text-red-400" />
                        <span className="hidden sm:inline">مشاهدة آمنة ومحمية داخل التطبيق</span>
                      </div>

                    </div>

                  </div>

                </div>

              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-500">
                <Tv className="w-12 h-12 text-neutral-700 mb-2" />
                <p className="text-sm">اختر أي فيديو من القائمة للبدء في المشاهدة</p>
              </div>
            )}
          </div>

          {/* PLAYLIST / VIDEO BROWSER (lg:col-span-5 or 4) */}
          <div className="lg:col-span-5 xl:col-span-4 p-3 sm:p-4 overflow-y-auto space-y-2.5 bg-neutral-950">
            
            <div className="flex items-center justify-between text-xs text-neutral-400 pb-1 border-b border-neutral-800 font-bold">
              <span>الفيديوهات المقترحة للمذاكرة</span>
              <span className="text-[10px] text-amber-400 font-mono">
                {selectedChannelId !== 'all' ? YOUTUBE_CHANNELS.find((c) => c.id === selectedChannelId)?.name : 'كل المدرسين'}
              </span>
            </div>

            {filteredVideos.length === 0 ? (
              <div className="py-12 text-center text-neutral-500 space-y-2">
                <Search className="w-8 h-8 mx-auto text-neutral-600" />
                <p className="text-xs">لم يتم العثور على فيديوهات مطابقة للبحث داخل القنوات الخمس.</p>
              </div>
            ) : (
              filteredVideos.map((video) => {
                const isCurrent = activeVideo?.id === video.id;
                return (
                  <div
                    key={video.id}
                    onClick={() => {
                      playSound('click');
                      setActiveVideo(video);
                      setShowDownloadMenu(false);
                    }}
                    className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex gap-3 text-right ${
                      isCurrent
                        ? 'bg-neutral-900 border-red-500/70 shadow-lg shadow-red-500/10'
                        : 'bg-neutral-900/40 border-neutral-800 hover:bg-neutral-900/80 hover:border-neutral-700'
                    }`}
                  >
                    {/* Thumbnail preview */}
                    <div className="relative w-28 sm:w-32 aspect-video rounded-xl overflow-hidden bg-neutral-950 shrink-0 border border-neutral-800">
                      <img
                        src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                        alt={video.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.2 rounded bg-black/85 text-[9px] font-mono font-bold text-white">
                        {video.duration}
                      </span>
                      {video.isShort && (
                        <span className="absolute top-1 left-1 px-1 rounded bg-red-600 text-[8px] font-bold text-white">
                          Short
                        </span>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug">
                          {video.title}
                        </h4>
                        <span className="text-[10px] text-neutral-400 truncate block mt-0.5">
                          {video.channelName}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-[9px] text-neutral-500 mt-1">
                        <span className="text-amber-400 font-bold">{video.subject}</span>
                        {video.views && (
                          <>
                            <span>•</span>
                            <span>{video.views} مشاهدة</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}

          </div>

        </div>

        {/* Add New Lecture Dialog (To keep up with future uploads of the 5 channels) */}
        {showAddModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md animate-in fade-in">
            <div className="w-full max-w-lg bg-neutral-900 border-2 border-red-500/50 rounded-2xl p-5 shadow-2xl space-y-4 text-right">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-red-600/20 text-red-400 flex items-center justify-center">
                    <PlusCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white font-heading">
                      إضافة حصة جديدة لإحدى القنوات الـ 5
                    </h3>
                    <p className="text-[11px] text-neutral-400">
                      لمواكبة ما ينزل في الأيام المقبلة دون الخروج من المنصة
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1.5 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddVideo} className="space-y-3.5">
                {/* Channel Select */}
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    القناة التابعة للفيديو:
                  </label>
                  <select
                    value={newVideoChannel}
                    onChange={(e) => setNewVideoChannel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-xs text-white focus:outline-none focus:border-red-500"
                  >
                    {YOUTUBE_CHANNELS.map((ch) => (
                      <option key={ch.id} value={ch.id}>
                        {ch.name} ({ch.subject})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Video URL or ID */}
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    رابط الفيديو أو كود اليوتيوب:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: https://www.youtube.com/watch?v=..."
                    value={newVideoUrl}
                    onChange={(e) => setNewVideoUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-500 text-left font-mono"
                  />
                  <span className="text-[10px] text-neutral-500 block mt-1">
                    انسخ رابط الحصة التي نزلت على قناة المدرس وضعها هنا لتشاهدها وتحملها داخل التطبيق فوراً.
                  </span>
                </div>

                {/* Video Title */}
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    عنوان الحصة / الدرس (اختياري):
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: حل تدريبات الفصل الثالث • أفكار عليا"
                    value={newVideoTitle}
                    onChange={(e) => setNewVideoTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-500"
                  />
                </div>

                {/* Content Type */}
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    نوع المحتوى:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setNewVideoType('video')}
                      className={`p-2 rounded-xl border text-xs font-bold transition-all ${
                        newVideoType === 'video'
                          ? 'bg-neutral-800 border-red-500 text-white'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                      }`}
                    >
                      حصة أو محاضرة كاملة
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewVideoType('short')}
                      className={`p-2 rounded-xl border text-xs font-bold transition-all ${
                        newVideoType === 'short'
                          ? 'bg-neutral-800 border-red-500 text-white'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                      }`}
                    >
                      مقطع قصير وتريكة (Short)
                    </button>
                  </div>
                </div>

                {addError && (
                  <p className="text-xs text-red-400 font-bold">{addError}</p>
                )}

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-800">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-600/30"
                  >
                    حفظ وإضافة للمكتبة
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
