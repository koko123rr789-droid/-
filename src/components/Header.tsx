import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Gamepad2, 
  Clock, 
  Calendar,
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  Download, 
  Settings, 
  Palette,
  Sparkles,
  Lock,
  Unlock,
  BookOpen,
  Play
} from 'lucide-react';
import { BackgroundSetting } from '../types';
import { playSound } from '../utils/audioSynth';
import { getFormattedNetworkDateTime } from '../utils/networkTime';
import { NetworkSpeedMeter } from './NetworkSpeedMeter';

interface Props {
  totalStudySeconds: number;
  earnedGameSeconds: number;
  usedGameSeconds: number;
  isInstallable: boolean;
  onInstallApp: () => void;
  bgSettings: BackgroundSetting;
  onUpdateBgSettings: (settings: BackgroundSetting) => void;
  onOpenSettings: () => void;
  onOpenMusicModal?: () => void;
  onToggleMusic?: () => void;
  isMusicPlaying?: boolean;
  onOpenPdfModal?: () => void;
  onOpenYouTubeStudy?: () => void;
}

export const Header: React.FC<Props> = ({
  totalStudySeconds,
  earnedGameSeconds,
  usedGameSeconds,
  isInstallable,
  onInstallApp,
  bgSettings,
  onUpdateBgSettings,
  onOpenSettings,
  onOpenMusicModal,
  onToggleMusic,
  isMusicPlaying = false,
  onOpenPdfModal,
  onOpenYouTubeStudy,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showBgMenu, setShowBgMenu] = useState(false);
  const [networkTime, setNetworkTime] = useState(() => getFormattedNetworkDateTime());

  // Tick clock every second using tamper-proof network time
  useEffect(() => {
    const interval = setInterval(() => {
      setNetworkTime(getFormattedNetworkDateTime());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Format seconds into HH:MM:SS
  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const remainingGameSeconds = Math.max(0, earnedGameSeconds - usedGameSeconds);
  const remainingGameMinutes = Math.floor(remainingGameSeconds / 60);

  const toggleFullscreen = () => {
    playSound('click');
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleSoundClick = () => {
    playSound('click');
    if (onToggleMusic) {
      onToggleMusic();
    } else if (onOpenMusicModal) {
      onOpenMusicModal();
    }
  };

  return (
    <header id="main-header" className="sticky top-0 z-40 backdrop-blur-md bg-neutral-950/70 border-b border-amber-500/20 px-4 py-3 sm:px-6 transition-all">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        
        {/* Logo & Slogan */}
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-600 p-0.5 shadow-lg shadow-amber-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-neutral-950 rounded-[10px] flex items-center justify-center">
                <Flame className="w-6 h-6 text-amber-400 animate-pulse" />
              </div>
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black tracking-tight text-white flex flex-wrap items-center gap-1.5 font-heading">
                <span>بوابة الثانوية العامة</span>
                <span className="text-amber-400 font-bold text-xs sm:text-sm px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 rounded-md">
                  بشمهندس كريم أبو المجد
                </span>
              </h1>
            </div>
            <p className="text-xs text-amber-200/70 hidden sm:block">
              مهمة تحديد المستقبل والمصير والتنافس • 5 ساعات يومياً لكل منصة
            </p>
          </div>
        </div>

        {/* Status Counters & Badges */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-3">
          
          {/* Total Study Timer Today */}
          <div 
            id="header-study-counter"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-900/80 border border-amber-500/30 shadow-inner"
            title="إجمالي وقت المذاكرة اليوم على المنصات"
          >
            <Clock className="w-4 h-4 text-amber-400" />
            <div className="text-right">
              <span className="text-[10px] text-neutral-400 block leading-none">مذاكرة اليوم</span>
              <span className="font-mono font-bold text-xs sm:text-sm text-amber-300">
                {formatTime(totalStudySeconds)}
              </span>
            </div>
          </div>

          {/* Network-Synced Clock & Date (Tamper-Proof from Phone Settings) */}
          <div 
            id="header-network-clock"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-900/90 border border-amber-500/30 shadow-inner"
            title={`الوقت والتاريخ المعتمد خارجياً: ${networkTime.dateStr} - ${networkTime.timeStr}`}
          >
            <div className="flex items-center text-amber-400">
              <Clock className="w-4 h-4 animate-spin-slow" />
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1">
                <span className="text-[9px] text-neutral-400 leading-none">الساعة والتاريخ</span>
                <span className="text-[8px] font-mono text-emerald-400 font-bold">🔒 موثوق</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-amber-300">
                <span>{networkTime.timeStr}</span>
                <span className="text-neutral-500 hidden md:inline">|</span>
                <span className="text-[10px] text-neutral-300 hidden md:inline font-sans">{networkTime.dateStr}</span>
              </div>
            </div>
          </div>

          {/* Real Network Speed Meter (Live Mbps and Ping) */}
          <NetworkSpeedMeter />

          {/* Game Balance / Reward Badge */}
          <div 
            id="header-game-credits"
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border shadow-inner transition-colors ${
              remainingGameSeconds > 0 
                ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300' 
                : 'bg-neutral-900/80 border-neutral-700/50 text-neutral-400'
            }`}
            title="رصيد وقت الألعاب المكتسب (ساعة مذاكرة = ربع ساعة ألعاب)"
          >
            <Gamepad2 className="w-4 h-4 text-emerald-400" />
            <div className="text-right">
              <span className="text-[10px] text-neutral-400 block leading-none">رصيد الألعاب</span>
              <div className="flex items-center gap-1">
                {remainingGameSeconds > 0 ? (
                  <Unlock className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Lock className="w-3 h-3 text-neutral-500" />
                )}
                <span className="font-mono font-bold text-xs sm:text-sm">
                  {remainingGameMinutes} دقيقة
                </span>
              </div>
            </div>
          </div>

          {/* PDF Notes Reader Button */}
          {onOpenPdfModal && (
            <button
              onClick={() => {
                playSound('click');
                onOpenPdfModal();
              }}
              className="p-2 rounded-lg bg-neutral-900/80 border border-neutral-700 hover:border-amber-400 text-neutral-300 hover:text-amber-300 transition-all flex items-center gap-1 text-xs"
              title="مكتبة ملازم ومذكرات PDF والمفاهيم (Samsung Notes)"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span className="hidden lg:inline text-xs font-bold">ملازم PDF</span>
            </button>
          )}

          {/* YouTube Study Focus Mode (Strictly 5 Channels) Button */}
          {onOpenYouTubeStudy && (
            <button
              id="open-youtube-study-btn"
              onClick={() => {
                playSound('click');
                onOpenYouTubeStudy();
              }}
              className="p-2 sm:px-2.5 rounded-lg bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-red-300 hover:text-white transition-all flex items-center gap-1.5 text-xs font-bold"
              title="يوتيوب المذاكرة الخالي من التشتيت (5 قنوات ثانوية عامة فقط مع خاصية التحميل)"
            >
              <Play className="w-4 h-4 fill-current text-red-400" />
              <span className="hidden md:inline">يوتيوب (5 قنوات)</span>
            </button>
          )}

          {/* Motivational Music Button (Sound icon preserved exactly as requested) */}
          <button
            id="toggle-ambient-sound-btn"
            onClick={handleSoundClick}
            aria-label="أغاني وموسيقى تحفيزية للمذاكرة"
            className={`p-2 rounded-lg border transition-all flex items-center gap-1 text-xs ${
              isMusicPlaying
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-sm shadow-amber-500/30'
                : 'bg-neutral-900/80 border-neutral-700 text-neutral-400 hover:text-white'
            }`}
            title="مشغل الأغاني والموسيقى التحفيزية المخصصة للمذاكرة"
          >
            {isMusicPlaying ? (
              <>
                <Volume2 className="w-4 h-4 text-amber-400 animate-pulse" />
                <span className="hidden md:inline font-bold text-xs text-amber-300">
                  أغاني التحفيز 🎵
                </span>
              </>
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>

          {/* Background Controller Dropdown */}
          <div className="relative">
            <button
              id="bg-settings-toggle-btn"
              onClick={() => {
                playSound('click');
                setShowBgMenu(!showBgMenu);
              }}
              aria-label="تغيير الخلفية"
              className={`p-2 rounded-lg border transition-all ${
                showBgMenu
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                  : 'bg-neutral-900/80 border-neutral-700 text-neutral-400 hover:text-white'
              }`}
              title="تخصيص الخلفية المتحركة والمؤثرات"
            >
              <Palette className="w-4 h-4" />
            </button>

            {showBgMenu && (
              <div 
                id="bg-theme-menu"
                className="absolute left-0 sm:right-0 sm:left-auto mt-2 w-64 bg-neutral-900/95 border border-amber-500/30 rounded-xl shadow-2xl p-3 z-50 backdrop-blur-xl animate-in fade-in slide-in-from-top-2"
              >
                <div className="text-xs font-bold text-amber-400 mb-2 flex items-center justify-between border-b border-neutral-800 pb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    خلفيات الفيديو والمؤثرات
                  </span>
                  <button 
                    onClick={() => setShowBgMenu(false)}
                    className="text-neutral-400 hover:text-white text-xs px-1"
                  >
                    ✕
                  </button>
                </div>

                {/* Background Presets */}
                <div className="space-y-1.5 mb-3">
                  {[
                    { id: 'thanaweya_poster', label: 'ملصق الثانوية - بابا المجال' },
                    { id: 'sunrise_motion', label: 'شروق شمس المستقبل المتحرك' },
                    { id: 'lofi_study', label: 'مكتبة المذاكرة الهادئة (Lo-Fi)' },
                    { id: 'deep_space', label: 'أفق الفضاء الكوني العميق' },
                  ].map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => {
                        playSound('click');
                        onUpdateBgSettings({
                          ...bgSettings,
                          mode: theme.id as BackgroundSetting['mode'],
                        });
                      }}
                      className={`w-full text-right px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        bgSettings.mode === theme.id
                          ? 'bg-amber-500 text-neutral-950 font-bold shadow'
                          : 'bg-neutral-800/60 text-neutral-300 hover:bg-neutral-800'
                      }`}
                    >
                      {theme.label}
                    </button>
                  ))}
                </div>

                {/* Darkness / Legibility Slider */}
                <div className="pt-2 border-t border-neutral-800">
                  <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
                    <span>عتامة الخلفية (لقراءة أسهل):</span>
                    <span className="text-amber-300 font-mono">{bgSettings.darknessOverlay}%</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="90"
                    value={bgSettings.darknessOverlay}
                    onChange={(e) => {
                      onUpdateBgSettings({
                        ...bgSettings,
                        darknessOverlay: Number(e.target.value),
                      });
                    }}
                    className="w-full accent-amber-500 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Particle Toggle */}
                <label className="flex items-center justify-between mt-2.5 text-[11px] text-neutral-300 cursor-pointer">
                  <span>جزيئات ذهبية متحركة</span>
                  <input
                    type="checkbox"
                    checked={bgSettings.enableParticles}
                    onChange={(e) => {
                      onUpdateBgSettings({
                        ...bgSettings,
                        enableParticles: e.target.checked,
                      });
                    }}
                    className="rounded accent-amber-500"
                  />
                </label>
              </div>
            )}
          </div>

          {/* PWA Install Button if available */}
          {isInstallable && (
            <button
              id="install-pwa-header-btn"
              onClick={() => {
                playSound('click');
                onInstallApp();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 text-neutral-950 font-bold text-xs shadow-md shadow-amber-500/20 hover:brightness-110 active:scale-95 transition-all"
              title="تثبيت التطبيق على الشاشة الرئيسية للهاتف"
            >
              <Download className="w-3.5 h-3.5" />
              <span>تثبيت التطبيق</span>
            </button>
          )}

          {/* Fullscreen Button */}
          <button
            id="fullscreen-toggle-btn"
            onClick={toggleFullscreen}
            aria-label="شاشة كاملة"
            className="p-2 rounded-lg bg-neutral-900/80 border border-neutral-700 text-neutral-400 hover:text-white transition-colors"
            title={isFullscreen ? 'تصغير الشاشة' : 'وضع الشاشة الكاملة للمذاكرة'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Settings button */}
          <button
            id="app-settings-btn"
            onClick={() => {
              playSound('click');
              onOpenSettings();
            }}
            aria-label="الإعدادات"
            className="p-2 rounded-lg bg-neutral-900/80 border border-neutral-700 text-neutral-400 hover:text-amber-400 transition-colors"
            title="إعدادات المنصات وساعات الدراسة"
          >
            <Settings className="w-4 h-4" />
          </button>

        </div>
      </div>
    </header>
  );
};
