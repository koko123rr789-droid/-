import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Minimize2, 
  Maximize2, 
  ExternalLink,
  X,
  Music2,
  Sparkles
} from 'lucide-react';
import { motivationalPlayer } from '../utils/motivationalMusic';
import { playSound } from '../utils/audioSynth';

interface Props {
  onOpenModal: () => void;
}

export const FloatingMusicPlayer: React.FC<Props> = ({ onOpenModal }) => {
  const [playerState, setPlayerState] = useState(motivationalPlayer.getPlaybackState());
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    const unsub = motivationalPlayer.subscribe(() => {
      setPlayerState(motivationalPlayer.getPlaybackState());
    });
    return unsub;
  }, []);

  const { isPlaying, currentTrack } = playerState;

  if (!isPlaying && !playerState.isPlayerVisible) {
    return null;
  }

  return (
    <aside
      aria-label="مشغل الصوت التحفيزي المصغر"
      className={`fixed bottom-4 left-4 z-40 transition-all duration-300 ${
        isMinimized ? 'w-auto' : 'w-72 sm:w-80'
      }`}
    >
      <div className="bg-neutral-950/95 border-2 border-amber-500/50 rounded-2xl shadow-2xl p-3 backdrop-blur-xl text-right overflow-hidden">
        
        {/* Top bar of widget */}
        <div className="flex items-center justify-between gap-2 pb-2 border-b border-neutral-800">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping shrink-0" />
            <span className="text-[11px] font-black text-amber-400 font-heading truncate">
              {currentTrack.type === 'youtube' ? 'يوتيوب الحقيقي' : 'ملف MP3 الخاص بك'}
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 rounded-md text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800"
              title={isMinimized ? 'تكبير المشغل' : 'تصغير'}
            >
              {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => {
                playSound('click');
                motivationalPlayer.pause();
                motivationalPlayer.setPlayerVisibility(false);
              }}
              className="p-1 rounded-md text-neutral-400 hover:text-red-400 bg-neutral-900 border border-neutral-800"
              title="إيقاف المشغل"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Minimized view */}
        {isMinimized ? (
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => {
                playSound('click');
                motivationalPlayer.togglePlay();
              }}
              className="p-2 rounded-xl bg-amber-500 text-neutral-950 font-bold"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            </button>
            <div className="truncate text-xs text-white font-bold cursor-pointer" onClick={onOpenModal}>
              {currentTrack.title}
            </div>
          </div>
        ) : (
          <div className="space-y-2 pt-2">
            
            {/* Embedded Real YouTube Player iframe when playing YouTube track */}
            {currentTrack.type === 'youtube' && currentTrack.youtubeId && (
              <div className="w-full aspect-video rounded-xl overflow-hidden bg-black border border-neutral-800 relative shadow-inner">
                <iframe
                  key={currentTrack.youtubeId}
                  src={`https://www.youtube.com/embed/${currentTrack.youtubeId}?autoplay=1&enablejsapi=1&playsinline=1&rel=0`}
                  title={currentTrack.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-none"
                />
              </div>
            )}

            {/* Track Info */}
            <div className="flex items-center justify-between cursor-pointer" onClick={onOpenModal}>
              <div className="truncate">
                <h5 className="text-xs font-black text-white truncate">{currentTrack.title}</h5>
                <p className="text-[10px] text-neutral-400 truncate">{currentTrack.artist}</p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold shrink-0">
                {currentTrack.tag.split('•')[0]}
              </span>
            </div>

            {/* Controls Bar */}
            <div className="flex items-center justify-between pt-1 border-t border-neutral-800/80">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    playSound('click');
                    motivationalPlayer.togglePlay();
                  }}
                  className="p-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-neutral-950 font-bold hover:scale-105 transition-all shadow-md shadow-amber-500/30"
                  title={isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                </button>

                <button
                  onClick={() => {
                    playSound('click');
                    motivationalPlayer.nextTrack();
                  }}
                  className="p-2 rounded-xl bg-neutral-900 text-neutral-300 hover:text-white border border-neutral-800"
                  title="الأنشودة التالية"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenModal}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-amber-400 bg-neutral-900 border border-neutral-800"
                  title="فتح قائمة الأناشيد الكاملة"
                >
                  <Music2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </aside>
  );
};
