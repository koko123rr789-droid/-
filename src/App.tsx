import React, { useState, useEffect, useRef } from 'react';
import { StudyPlatform, DailyTask, BackgroundSetting } from './types';
import { 
  INITIAL_PLATFORMS, 
  DEFAULT_BACKGROUND_SETTING 
} from './data/defaultData';
import { Header } from './components/Header';
import { DynamicBackground } from './components/DynamicBackground';
import { ThanaweyaBanner } from './components/ThanaweyaBanner';
import { StudyPlatforms } from './components/StudyPlatforms';
import { PlatformViewerModal } from './components/PlatformViewerModal';
import { GamesHub } from './components/GamesHub';
import { DailyTasks } from './components/DailyTasks';
import { SettingsModal } from './components/SettingsModal';
import { MotivationalMusicModal } from './components/MotivationalMusicModal';
import { PdfReaderModal } from './components/PdfReaderModal';
import { FloatingMusicPlayer } from './components/FloatingMusicPlayer';
import { YouTubeStudyModal } from './components/YouTubeStudyModal';
import { playSound } from './utils/audioSynth';
import { syncNetworkTime } from './utils/networkTime';
import { musicPlayer } from './utils/motivationalMusic';
import { Timer, Pause, Play, ExternalLink, X, Volume2 } from 'lucide-react';

const STORAGE_KEY_PLATFORMS = 'thanaweya_hub_platforms_v2';
const STORAGE_KEY_TASKS = 'thanaweya_hub_tasks_v2';
const STORAGE_KEY_BG = 'thanaweya_hub_bg_v1';
const STORAGE_KEY_DATE = 'thanaweya_hub_last_date';
const STORAGE_KEY_GAME_USED = 'thanaweya_hub_game_used_v2';
const STORAGE_KEY_NOTES = 'thanaweya_hub_notes_v1';

export default function App() {
  // 1. Daily Date & Reset Check
  const getTodayStr = () => new Date().toISOString().split('T')[0];

  // 2. State: Platforms (merging all 5 platforms)
  const [platforms, setPlatforms] = useState<StudyPlatform[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PLATFORMS);
      const savedDate = localStorage.getItem(STORAGE_KEY_DATE);
      const today = getTodayStr();

      if (saved) {
        const parsed: StudyPlatform[] = JSON.parse(saved);
        const existingIds = new Set(parsed.map((p) => p.id));
        const merged = [
          ...parsed,
          ...INITIAL_PLATFORMS.filter((p) => !existingIds.has(p.id)),
        ];
        if (savedDate !== today) {
          return merged.map((p) => ({ ...p, usedTodaySeconds: 0 }));
        }
        return merged;
      }
    } catch (e) {
      console.error('Error loading platforms', e);
    }
    return INITIAL_PLATFORMS;
  });

  // 3. State: Background settings
  const [bgSettings, setBgSettings] = useState<BackgroundSetting>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BG);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_BACKGROUND_SETTING;
  });

  // 4. State: Daily Tasks
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TASKS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      { id: '1', title: 'مذاكرة وحل مسائل فيزياء منصة مستر محمد عبدالمعبود', completed: false, priority: 'high' },
      { id: '2', title: 'متابعة شرح ومفردات منصة انجلشاوي (Mr Englishawy)', completed: false, priority: 'high' },
      { id: '3', title: 'مراجعة النحو والبلاغة على منصة أستاذي (وليد محسن)', completed: false, priority: 'high' },
      { id: '4', title: 'مذاكرة وحل تدريبات منصة Jaw Academy', completed: false, priority: 'medium' },
      { id: '5', title: 'متابعة شروحات واختبارات منصة MAG Academy', completed: false, priority: 'medium' },
    ];
  });

  // 5. State: Active Study Session
  const [activePlatformId, setActivePlatformId] = useState<string | null>(null);
  const [isViewerModalOpen, setIsViewerModalOpen] = useState(false);
  const [activeSessionSeconds, setActiveSessionSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // 6. State: Game Rewards
  const [usedGameSeconds, setUsedGameSeconds] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_GAME_USED);
      const savedDate = localStorage.getItem(STORAGE_KEY_DATE);
      if (saved && savedDate === getTodayStr()) {
        return Number(saved) || 0;
      }
    } catch (e) {
      console.error(e);
    }
    return 0;
  });

  // 7. State: Student Notes
  const [studentNotes, setStudentNotes] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_NOTES) || '';
  });

  // 8. PWA Install Prompt State
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  // 9. Modals: Settings, Music, PDF Reader, YouTube Study
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMusicModalOpen, setIsMusicModalOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isYouTubeModalOpen, setIsYouTubeModalOpen] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [musicToast, setMusicToast] = useState<string | null>(null);

  const handleToggleMusicDirectly = () => {
    if (musicPlayer.getIsPlaying()) {
      musicPlayer.pause();
      setMusicToast('⏸️ تم إيقاف الموسيقى');
      setTimeout(() => setMusicToast(null), 2500);
    } else {
      musicPlayer.playRandom();
      const track = musicPlayer.getCurrentTrack();
      setMusicToast(`🎵 جاري تشغيل: ${track.title} (${track.artist})`);
      setTimeout(() => setMusicToast(null), 4000);
    }
  };

  // Sync tamper-proof network time on mount
  useEffect(() => {
    syncNetworkTime();
    const interval = setInterval(syncNetworkTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Monitor music playing state
  useEffect(() => {
    setIsMusicPlaying(musicPlayer.getIsPlaying());
    const unsubscribe = musicPlayer.subscribe(() => {
      setIsMusicPlaying(musicPlayer.getIsPlaying());
    });
    return () => unsubscribe();
  }, []);

  // Synchronize localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_DATE, getTodayStr());
    localStorage.setItem(STORAGE_KEY_PLATFORMS, JSON.stringify(platforms));
  }, [platforms]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_BG, JSON.stringify(bgSettings));
  }, [bgSettings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(dailyTasks));
  }, [dailyTasks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_GAME_USED, usedGameSeconds.toString());
  }, [usedGameSeconds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_NOTES, studentNotes);
  }, [studentNotes]);

  // Handle PWA install prompt
  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
      setIsInstallable(true);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallApp = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const choiceResult = await installPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstallable(false);
      }
      setInstallPrompt(null);
    } else {
      setIsSettingsOpen(true);
    }
  };

  // 10. Study Timer Loop
  useEffect(() => {
    if (!activePlatformId || !isTimerRunning) return;

    const interval = setInterval(() => {
      setPlatforms((prev) => {
        return prev.map((p) => {
          if (p.id === activePlatformId) {
            const limitSeconds = p.dailyLimitMinutes * 60;
            const updated = p.usedTodaySeconds + 1;

            // Check if 5 hours reached
            if (updated >= limitSeconds && p.usedTodaySeconds < limitSeconds) {
              playSound('complete');
              alert(`🎉 أحسنت صنعاً! لقد أتممت اليوم الحد الأقصى المقرر على ${p.name} (5 ساعات كاملة)! حان وقت الراحة وتجديد النشاط.`);
              setIsTimerRunning(false);
            }

            return { ...p, usedTodaySeconds: updated };
          }
          return p;
        });
      });

      setActiveSessionSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [activePlatformId, isTimerRunning]);

  // Derived Calculations
  const totalStudySecondsToday = platforms.reduce((acc, p) => acc + p.usedTodaySeconds, 0);

  // Reward rule: Every 1 hour of study (3600s) = 15 minutes gaming (900s)
  // Ratio = 1/4 (each 4 seconds of study gives 1 second of gaming)
  const earnedGameSeconds = Math.floor(totalStudySecondsToday / 4);

  const activePlatform = platforms.find((p) => p.id === activePlatformId) || null;

  // Launch handlers
  const handleLaunchPlatform = (platform: StudyPlatform, mode: 'in_app' | 'external') => {
    const limitSeconds = platform.dailyLimitMinutes * 60;
    if (platform.usedTodaySeconds >= limitSeconds) {
      alert(`عذراً، لقد استهلكت الحد الأقصى اليومي المسموح به لهذه المنصة (${platform.dailyLimitMinutes / 60} ساعات).`);
      return;
    }

    setActivePlatformId(platform.id);
    setIsTimerRunning(true);
    setActiveSessionSeconds(0);
    playSound('click');

    if (mode === 'in_app') {
      setIsViewerModalOpen(true);
    } else {
      setIsViewerModalOpen(false);
      window.open(platform.url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleStopPlatform = (platformId: string) => {
    if (activePlatformId === platformId) {
      setIsTimerRunning(false);
      setActivePlatformId(null);
      setIsViewerModalOpen(false);
      playSound('click');
    }
  };

  const handleToggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const handleAddCustomPlatform = (newPlatform: Omit<StudyPlatform, 'id' | 'usedTodaySeconds'>) => {
    const created: StudyPlatform = {
      ...newPlatform,
      id: `custom-${Date.now()}`,
      usedTodaySeconds: 0,
    };
    setPlatforms((prev) => [...prev, created]);
  };

  const handleDeleteCustomPlatform = (id: string) => {
    setPlatforms((prev) => prev.filter((p) => p.id !== id));
  };

  // Task handlers
  const handleToggleTask = (taskId: string) => {
    setDailyTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleAddTask = (title: string, priority: 'high' | 'medium' | 'low') => {
    const newTask: DailyTask = {
      id: Date.now().toString(),
      title,
      completed: false,
      priority,
    };
    setDailyTasks((prev) => [newTask, ...prev]);
  };

  const handleDeleteTask = (taskId: string) => {
    setDailyTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  // Reset Today
  const handleResetTodayData = () => {
    setPlatforms((prev) => prev.map((p) => ({ ...p, usedTodaySeconds: 0 })));
    setUsedGameSeconds(0);
    setActiveSessionSeconds(0);
    setIsTimerRunning(false);
    setActivePlatformId(null);
    playSound('alert');
  };

  const handleChangeDailyLimit = (mins: number) => {
    setPlatforms((prev) => prev.map((p) => ({ ...p, dailyLimitMinutes: mins })));
  };

  const handleConsumeGameSecond = () => {
    setUsedGameSeconds((prev) => prev + 1);
  };

  return (
    <div className="relative min-h-screen flex flex-col selection:bg-amber-500 selection:text-black font-sans">
      
      {/* Dynamic Moving Wallpaper & Video Ambient Engine */}
      <DynamicBackground settings={bgSettings} />

      {/* Main App Bar */}
      <Header
        totalStudySeconds={totalStudySecondsToday}
        earnedGameSeconds={earnedGameSeconds}
        usedGameSeconds={usedGameSeconds}
        isInstallable={isInstallable}
        onInstallApp={handleInstallApp}
        bgSettings={bgSettings}
        onUpdateBgSettings={setBgSettings}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenMusicModal={() => setIsMusicModalOpen(true)}
        onToggleMusic={handleToggleMusicDirectly}
        isMusicPlaying={isMusicPlaying}
        onOpenPdfModal={() => setIsPdfModalOpen(true)}
        onOpenYouTubeStudy={() => setIsYouTubeModalOpen(true)}
      />

      {/* Direct Music Play Notification Toast */}
      {musicToast && (
        <div 
          id="music-toast-notification"
          className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-neutral-950/95 border-2 border-amber-400 text-amber-300 text-xs font-bold shadow-2xl backdrop-blur-md flex items-center gap-2 animate-in fade-in slide-in-from-top-3"
        >
          <Volume2 className="w-4 h-4 text-amber-400 animate-bounce" />
          <span>{musicToast}</span>
        </div>
      )}

      {/* Main Page Layout Container */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:px-6 space-y-8">
        
        {/* Inspirational Thanaweya Poster & Exam Countdown */}
        <ThanaweyaBanner />

        {/* Study Platforms Grid (5 Main Egyptian Thanaweya Platforms - 5 Hours Daily Limit) */}
        <StudyPlatforms
          platforms={platforms}
          activePlatformId={activePlatformId}
          onLaunchPlatform={handleLaunchPlatform}
          onStopPlatform={handleStopPlatform}
          onAddCustomPlatform={handleAddCustomPlatform}
          onDeleteCustomPlatform={handleDeleteCustomPlatform}
          onOpenYouTubeStudy={() => setIsYouTubeModalOpen(true)}
        />

        {/* Conditional Games Hub (Unlocked by Study Time: 1 hour study = 15 minutes gaming) */}
        <GamesHub
          totalStudySecondsToday={totalStudySecondsToday}
          earnedGameSeconds={earnedGameSeconds}
          usedGameSeconds={usedGameSeconds}
          onConsumeGameSecond={handleConsumeGameSecond}
        />

        {/* Daily Study Checklist & Goals */}
        <DailyTasks
          tasks={dailyTasks}
          onToggleTask={handleToggleTask}
          onAddTask={handleAddTask}
          onDeleteTask={handleDeleteTask}
        />

      </main>

      {/* Floating Active Study Session Bar (When running in background or external tab) */}
      {activePlatform && !isViewerModalOpen && (
        <aside
          id="floating-study-widget"
          aria-label="جلسة المذاكرة النشطة"
          className="fixed bottom-4 right-4 left-4 sm:left-auto sm:right-6 sm:w-96 z-40 bg-neutral-950/95 border-2 border-amber-400 rounded-2xl shadow-2xl p-3.5 backdrop-blur-xl flex items-center justify-between gap-3 animate-in slide-in-from-bottom-5"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <div className="truncate text-right">
              <span className="text-[10px] text-amber-400 block font-bold">جلسة مذاكرة نشطة</span>
              <span className="font-extrabold text-xs text-white truncate block">
                {activePlatform.name}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="font-mono font-black text-amber-300 text-xs px-2 py-1 rounded-lg bg-neutral-900 border border-neutral-800">
              {Math.floor(activePlatform.usedTodaySeconds / 3600).toString().padStart(2, '0')}:
              {Math.floor((activePlatform.usedTodaySeconds % 3600) / 60).toString().padStart(2, '0')}:
              {(activePlatform.usedTodaySeconds % 60).toString().padStart(2, '0')}
            </div>

            <button
              onClick={() => setIsViewerModalOpen(true)}
              className="p-1.5 rounded-lg bg-amber-500 text-neutral-950 font-bold text-xs hover:bg-amber-400 transition-colors"
              title="تكبير شاشة المذاكرة"
            >
              عرض
            </button>

            <button
              onClick={() => handleStopPlatform(activePlatform.id)}
              className="p-1.5 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white"
              title="إنهاء الجلسة"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </aside>
      )}

      {/* Fullscreen In-App Platform Viewer Modal */}
      {isViewerModalOpen && activePlatform && (
        <PlatformViewerModal
          platform={activePlatform}
          activeSessionSeconds={activeSessionSeconds}
          totalUsedTodaySeconds={activePlatform.usedTodaySeconds}
          onClose={() => setIsViewerModalOpen(false)}
          onToggleTimer={handleToggleTimer}
          isTimerRunning={isTimerRunning}
          notes={studentNotes}
          onSaveNotes={setStudentNotes}
        />
      )}

      {/* Motivational Music Player Modal */}
      <MotivationalMusicModal
        isOpen={isMusicModalOpen}
        onClose={() => setIsMusicModalOpen(false)}
      />

      {/* PDF Notes & Study Guides Reader Modal */}
      <PdfReaderModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
      />

      {/* Settings & PWA Install Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        dailyLimitMinutes={platforms[0]?.dailyLimitMinutes || 300}
        onChangeDailyLimit={handleChangeDailyLimit}
        onResetTodayData={handleResetTodayData}
        onInstallPwa={handleInstallApp}
        isInstallable={isInstallable}
        onOpenMusicModal={() => setIsMusicModalOpen(true)}
      />

      {/* Restricted YouTube Study Modal (Strictly 5 Allowed Channels) */}
      <YouTubeStudyModal
        isOpen={isYouTubeModalOpen}
        onClose={() => setIsYouTubeModalOpen(false)}
      />

      {/* Real YouTube & MP3 Floating Mini Player */}
      <FloatingMusicPlayer onOpenModal={() => setIsMusicModalOpen(true)} />

      {/* Footer */}
      <footer className="relative z-10 border-t border-neutral-900/80 bg-neutral-950/80 backdrop-blur-md py-6 text-center text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="flex items-center gap-1.5 justify-center">
            <span>بوابة الثانوية العامة • بشمهندس كريم أبو المجد</span>
            <span className="text-amber-500">⚡</span>
          </p>
          <p className="text-[11px] text-neutral-400">
            عبدالمعبود • انجلشاوي • وليد محسن • Jaw • MAG • 5 ساعات يومياً • ساعة مذاكرة = ربع ساعة ألعاب
          </p>
        </div>
      </footer>

    </div>
  );
}
