import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  VolumeX, 
  Music2, 
  Flame, 
  ListMusic,
  FolderUp,
  Trash2,
  ExternalLink,
  Plus,
  Youtube
} from 'lucide-react';
import { 
  motivationalPlayer, 
  MOTIVATIONAL_TRACKS, 
  MotivationalTrack 
} from '../utils/motivationalMusic';
import { playSound } from '../utils/audioSynth';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const MotivationalMusicModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [playerState, setPlayerState] = useState(motivationalPlayer.getPlaybackState());
  const [customYtUrl, setCustomYtUrl] = useState('');
  const [customYtTitle, setCustomYtTitle] = useState('');
  const [showAddYt, setShowAddYt] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const unsub = motivationalPlayer.subscribe(() => {
      setPlayerState(motivationalPlayer.getPlaybackState());
    });
    return unsub;
  }, []);

  if (!isOpen) return null;

  const { isPlaying, currentTrack, currentIndex, volume } = playerState;

  const handleCustomAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      playSound('success');
      await motivationalPlayer.addCustomAudioFile(file);
    } catch (err) {
      console.error('Error adding custom audio:', err);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleAddCustomYouTube = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customYtUrl.trim()) return;

    playSound('success');
    const added = motivationalPlayer.addCustomYouTubeTrack(
      customYtTitle.trim() || 'أنشودة مخصصة من يوتيوب',
      customYtUrl.trim()
    );

    if (added) {
      setCustomYtUrl('');
      setCustomYtTitle('');
      setShowAddYt(false);
    } else {
      alert('يرجى التأكد من كتابة رابط يوتيوب صحيح (مثال: https://www.youtube.com/watch?v=...)');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative bg-neutral-900 border border-amber-500/40 rounded-3xl p-4 sm:p-6 max-w-2xl w-full shadow-2xl text-right overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Glow Accents */}
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="relative z-10 flex items-center justify-between border-b border-neutral-800 pb-3 mb-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Music2 className="w-4 h-4 animate-bounce" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base sm:text-lg font-heading flex items-center gap-2">
                <span>أناشيد الثانوية العامة الأصلية (صوت وفيديو حقيقي)</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-red-600/30 border border-red-500/50 text-red-300 font-sans font-bold flex items-center gap-1">
                  <Youtube className="w-3 h-3 text-red-400" />
                  <span>YouTube & MP3</span>
                </span>
              </h3>
              <p className="text-[11px] text-amber-300/80">
                صوت حقيقي 100% بدون أي محاكاة اصطناعية - أصوات المنشدين الأصلية
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playSound('click');
              onClose();
            }}
            className="text-neutral-400 hover:text-white p-1 rounded-lg bg-neutral-950 border border-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Main Content */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4">

          {/* Active Player Box */}
          <div className="relative z-10 p-3.5 sm:p-4 rounded-2xl bg-neutral-950 border border-amber-500/30 shadow-inner space-y-3">
            
            {/* Header of Active Track */}
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1 text-right min-w-0">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 inline-block">
                  {currentTrack.tag}
                </span>
                <h4 className="text-base sm:text-lg font-black text-white font-heading truncate">
                  {currentTrack.title}
                </h4>
                <p className="text-xs text-neutral-400 truncate">{currentTrack.artist}</p>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 p-0.5 shadow-lg flex items-center justify-center">
                  <div className="w-full h-full bg-neutral-900 rounded-[10px] flex items-center justify-center text-amber-400">
                    <Flame className={`w-5 h-5 ${isPlaying ? 'animate-pulse text-amber-400' : 'text-neutral-500'}`} />
                  </div>
                </div>
              </div>
            </div>

            {/* If YouTube track, embed real responsive player */}
            {currentTrack.type === 'youtube' && currentTrack.youtubeId && (
              <div className="w-full aspect-video rounded-xl overflow-hidden bg-black border border-neutral-800 shadow-2xl relative">
                <iframe
                  key={currentTrack.youtubeId}
                  src={`https://www.youtube.com/embed/${currentTrack.youtubeId}?autoplay=1&enablejsapi=1&playsinline=1`}
                  title={currentTrack.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-none"
                />
              </div>
            )}

            {/* Quick Play Controls */}
            <div className="flex items-center justify-between pt-1 border-t border-neutral-800">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    playSound('click');
                    motivationalPlayer.prevTrack();
                  }}
                  className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700"
                  title="الأنشودة السابقة"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    playSound('click');
                    motivationalPlayer.togglePlay();
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-neutral-950 font-black shadow-lg shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                  <span className="text-xs">{isPlaying ? 'إيقاف مؤقت' : 'تشغيل الأنشودة'}</span>
                </button>

                <button
                  onClick={() => {
                    playSound('click');
                    motivationalPlayer.nextTrack();
                  }}
                  className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700"
                  title="الأنشودة التالية"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>

              {/* Volume */}
              <div className="flex items-center gap-1.5">
                <VolumeX className="w-3.5 h-3.5 text-neutral-500" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => motivationalPlayer.setVolume(parseFloat(e.target.value))}
                  className="w-20 sm:w-28 accent-amber-500 cursor-pointer h-1.5 bg-neutral-800 rounded-lg"
                />
                <Volume2 className="w-3.5 h-3.5 text-amber-400" />
              </div>
            </div>

          </div>

          {/* Action Row: Upload MP3 or Add YouTube URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            
            {/* 1. Upload MP3 */}
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleCustomAudioUpload}
                accept="audio/*,.mp3,.m4a,.wav,.aac"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 px-3 rounded-xl bg-neutral-950 border border-amber-500/30 hover:border-amber-500/60 text-amber-300 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <FolderUp className="w-4 h-4 text-amber-400" />
                <span>رفع ملف MP3 من جهازك</span>
              </button>
            </div>

            {/* 2. Add YouTube link */}
            <div>
              <button
                onClick={() => setShowAddYt(!showAddYt)}
                className="w-full py-2.5 px-3 rounded-xl bg-neutral-950 border border-red-500/30 hover:border-red-500/60 text-red-300 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <Youtube className="w-4 h-4 text-red-400" />
                <span>إضافة أي أنشودة برابط يوتيوب</span>
              </button>
            </div>

          </div>

          {/* YouTube Link Input Form */}
          {showAddYt && (
            <form onSubmit={handleAddCustomYouTube} className="p-3 bg-neutral-950 border border-red-500/40 rounded-xl space-y-2 animate-in fade-in">
              <span className="text-xs font-bold text-red-400 block">إضافة أنشودة من يوتيوب:</span>
              <input
                type="text"
                placeholder="اسم الأنشودة (مثال: سوف نبقى هنا أو أي أنشودة)"
                value={customYtTitle}
                onChange={(e) => setCustomYtTitle(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-xs text-white placeholder-neutral-500"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="رابط يوتيوب: https://www.youtube.com/watch?v=..."
                  value={customYtUrl}
                  onChange={(e) => setCustomYtUrl(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-xs text-white placeholder-neutral-500 text-left font-mono"
                  required
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs shrink-0"
                >
                  إضافة وتشغيل
                </button>
              </div>
            </form>
          )}

          {/* Lyrics Box */}
          {currentTrack.lyrics && currentTrack.lyrics.length > 0 && (
            <div className="p-3 rounded-xl bg-neutral-950/70 border border-neutral-800 text-center">
              <span className="text-[10px] text-amber-400 font-bold block mb-1">كلمات الأنشودة:</span>
              <p className="text-xs text-amber-200/90 font-semibold leading-relaxed">
                {currentTrack.lyrics.join(' • ')}
              </p>
            </div>
          )}

          {/* All Songs Selector List */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-neutral-400 mb-1 font-bold">
              <div className="flex items-center gap-1.5">
                <ListMusic className="w-4 h-4 text-amber-400" />
                <span>قائمة الأناشيد المتاحة:</span>
              </div>
              <span className="text-[10px] text-neutral-500 font-mono">
                {MOTIVATIONAL_TRACKS.length} أنشودة
              </span>
            </div>

            {MOTIVATIONAL_TRACKS.map((t, idx) => (
              <div
                key={t.id}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-right transition-all ${
                  currentIndex === idx
                    ? 'bg-amber-500/15 border-amber-500/50 text-white shadow-sm'
                    : 'bg-neutral-950/60 border-neutral-800 text-neutral-300 hover:bg-neutral-800/60'
                }`}
              >
                <button
                  onClick={() => {
                    playSound('click');
                    motivationalPlayer.setTrack(idx);
                    motivationalPlayer.play();
                  }}
                  className="flex-1 flex items-center gap-2 min-w-0 text-right"
                >
                  <span className="w-6 h-6 rounded-lg bg-neutral-800 text-neutral-400 font-mono text-[11px] flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div className="truncate">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold truncate">{t.title}</span>
                      {t.type === 'youtube' && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-red-900/60 text-red-200 border border-red-700/50">
                          يوتيوب
                        </span>
                      )}
                      {t.type === 'local_audio' && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-900/60 text-blue-200 border border-blue-700/50">
                          MP3 جهازي
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-neutral-400 truncate block">{t.artist}</span>
                  </div>
                </button>

                <div className="flex items-center gap-2 shrink-0 mr-2">
                  {currentIndex === idx && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500 text-neutral-950 font-bold">
                      {isPlaying ? 'يعمل الآن' : 'مختار'}
                    </span>
                  )}
                  {t.isCustom && (
                    <button
                      onClick={() => {
                        playSound('alert');
                        motivationalPlayer.removeCustomTrack(t.id);
                      }}
                      className="p-1 rounded text-neutral-500 hover:text-red-400 transition-colors"
                      title="حذف هذه الأنشودة"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
};
