import React, { useState } from 'react';
import { 
  X, 
  ExternalLink, 
  Maximize2, 
  Minimize2, 
  RefreshCw, 
  Pause, 
  Play, 
  Clock, 
  FileText, 
  AlertCircle,
  ShieldCheck,
  Headphones
} from 'lucide-react';
import { StudyPlatform } from '../types';
import { playSound } from '../utils/audioSynth';

interface Props {
  platform: StudyPlatform;
  activeSessionSeconds: number;
  totalUsedTodaySeconds: number;
  onClose: () => void;
  onToggleTimer: () => void;
  isTimerRunning: boolean;
  notes: string;
  onSaveNotes: (notes: string) => void;
}

export const PlatformViewerModal: React.FC<Props> = ({
  platform,
  activeSessionSeconds,
  totalUsedTodaySeconds,
  onClose,
  onToggleTimer,
  isTimerRunning,
  notes,
  onSaveNotes,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [localNotes, setLocalNotes] = useState(notes);
  const [iframeKey, setIframeKey] = useState(0);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  // Default to proxy enabled for educational platforms to bypass X-Frame-Options
  const [useProxy, setUseProxy] = useState<boolean>(true);

  const limitSeconds = platform.dailyLimitMinutes * 60;
  const remainingSeconds = Math.max(0, limitSeconds - totalUsedTodaySeconds);

  const currentIframeSrc = useProxy
    ? `/api/proxy?url=${encodeURIComponent(platform.url)}`
    : platform.url;

  const formatSecs = (total: number) => {
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleOpenExternal = () => {
    playSound('click');
    window.open(platform.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div 
      id="platform-viewer-overlay"
      className="fixed inset-0 z-50 flex flex-col bg-neutral-950/95 backdrop-blur-xl animate-in fade-in duration-200"
    >
      {/* Top Study Control Bar */}
      <header className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-neutral-900 border-b border-amber-500/30 text-white select-none">
        
        {/* Platform Info */}
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm sm:text-base text-amber-300 font-heading">
                {platform.name}
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-800 text-neutral-400 font-mono hidden sm:inline" dir="ltr">
                {platform.url}
              </span>
            </div>
            <span className="text-[11px] text-neutral-400 block">
              جلسة مذاكرة نشطة • حد 5 ساعات يومياً
            </span>
          </div>
        </div>

        {/* Live Timers Center */}
        <div className="flex items-center gap-2 sm:gap-4 bg-neutral-950/90 border border-amber-500/30 px-3 py-1.5 rounded-2xl">
          
          {/* Current Session */}
          <div className="text-right">
            <span className="text-[10px] text-neutral-400 block leading-none">الجلسة الحالية</span>
            <span className="font-mono font-bold text-xs sm:text-sm text-white">
              {formatSecs(activeSessionSeconds)}
            </span>
          </div>

          <div className="w-[1px] h-6 bg-neutral-800" />

          {/* Daily Total out of 5 Hours */}
          <div className="text-right">
            <span className="text-[10px] text-neutral-400 block leading-none">إجمالي اليوم (من 5 س)</span>
            <span className="font-mono font-bold text-xs sm:text-sm text-amber-400">
              {formatSecs(totalUsedTodaySeconds)}
            </span>
          </div>

          <div className="w-[1px] h-6 bg-neutral-800" />

          {/* Pause / Resume button */}
          <button
            id="toggle-modal-timer-btn"
            onClick={() => {
              playSound('click');
              onToggleTimer();
            }}
            className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
              isTimerRunning
                ? 'bg-amber-500 text-neutral-950 hover:bg-amber-400'
                : 'bg-emerald-600 text-white hover:bg-emerald-500'
            }`}
            title={isTimerRunning ? 'إيقاف المؤقت مؤقتاً (استراحة)' : 'استئناف حساب الوقت'}
          >
            {isTimerRunning ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span className="text-[11px] hidden md:inline">استراحة</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span className="text-[11px] hidden md:inline">استئناف</span>
              </>
            )}
          </button>
        </div>

        {/* Action Controls Right */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* In-app bypass proxy toggle */}
          <button
            onClick={() => {
              playSound('click');
              setUseProxy(!useProxy);
              setIframeKey((k) => k + 1);
            }}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1 transition-all ${
              useProxy
                ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300'
                : 'bg-neutral-800 border-neutral-700 text-neutral-300'
            }`}
            title={useProxy ? 'وضع تجاوز الحجب المباشر مفعل (يفتح المنصات المحجوبة داخل التطبيق)' : 'التبديل إلى وضع تجاوز الحجب'}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">
              {useProxy ? 'تجاوز الحجب مفعّل' : 'تفعيل فك الحجب'}
            </span>
          </button>

          {/* Notes Toggle */}
          <button
            onClick={() => {
              playSound('click');
              setShowNotes(!showNotes);
            }}
            className={`p-2 rounded-lg border text-xs font-medium flex items-center gap-1 transition-all ${
              showNotes 
                ? 'bg-amber-500/20 border-amber-500 text-amber-300' 
                : 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:text-white'
            }`}
            title="مفكرة الملاحظات السريعة"
          >
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">المفكرة</span>
          </button>

          {/* External Window launcher */}
          <button
            id="open-in-external-window-btn"
            onClick={handleOpenExternal}
            className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 text-xs font-medium flex items-center gap-1 transition-all"
            title="فتح في نافذة متصفح منفصلة مع استمرار حساب الـ 5 ساعات"
          >
            <ExternalLink className="w-4 h-4 text-amber-400" />
            <span className="hidden md:inline">نافذة خارجية</span>
          </button>

          {/* Reload iframe */}
          <button
            onClick={() => {
              playSound('click');
              setIframeKey((prev) => prev + 1);
            }}
            className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-300 transition-all"
            title="إعادة تحميل الصفحة"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Close Modal */}
          <button
            id="close-viewer-modal-btn"
            onClick={() => {
              playSound('click');
              onClose();
            }}
            className="p-2 rounded-lg bg-red-600/80 hover:bg-red-500 text-white transition-all shadow-md"
            title="إغلاق والعودة للبوابة الرئيسية"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </header>

      {/* Main Content Area: Iframe Viewer + Optional Notes Drawer */}
      <div className="relative flex-1 flex overflow-hidden">
        
        {/* Embedded Browser Area */}
        <div className="relative flex-1 bg-neutral-900 overflow-hidden flex flex-col">
          
          {/* Notification bar explaining security & direct access */}
          <div className="bg-neutral-900 border-b border-amber-500/30 px-3 py-2 text-xs text-amber-200 flex flex-wrap items-center justify-between gap-2 shadow-sm">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>{platform.name}</strong>: عداد الـ 5 ساعات يعمل بنجاح (المتبقي: {Math.floor(remainingSeconds / 60)} دقيقة).
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleOpenExternal}
                className="px-3 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 text-neutral-950 font-bold text-xs hover:brightness-110 flex items-center gap-1.5 shadow-sm transition-all"
                title="فتح المنصة بملء الشاشة مع استمرار حساب الـ 5 ساعات والمكافآت"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>فتح المنصة مباشرة لمشاهدة الفيديوهات ↗</span>
              </button>
            </div>
          </div>

          {/* Iframe */}
          <div className="relative flex-1 w-full h-full bg-neutral-950">
            <iframe
              key={`${iframeKey}-${useProxy ? 'proxy' : 'direct'}`}
              src={currentIframeSrc}
              title={platform.name}
              className="w-full h-full border-0 bg-white"
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals allow-presentation"
              referrerPolicy="no-referrer"
              onLoad={() => setIframeLoaded(true)}
            />
          </div>
        </div>

        {/* Collapsible Notes Drawer */}
        {showNotes && (
          <div 
            id="study-notes-drawer"
            className="w-80 border-r border-amber-500/30 bg-neutral-900/95 backdrop-blur-xl p-4 flex flex-col z-10 animate-in slide-in-from-left duration-200"
          >
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2 mb-3">
              <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <FileText className="w-4 h-4" />
                مفكرة تدوين الملاحظات السريعة
              </h4>
              <button
                onClick={() => setShowNotes(false)}
                className="text-neutral-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <textarea
              value={localNotes}
              onChange={(e) => {
                setLocalNotes(e.target.value);
                onSaveNotes(e.target.value);
              }}
              placeholder="اكتب هنا قوانينك، الملاحظات الهامة، الأسئلة التي تحتاج مراجعة..."
              className="flex-1 w-full p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 resize-none font-sans leading-relaxed"
            />

            <div className="mt-2 text-[10px] text-neutral-400 text-left" dir="rtl">
              ✓ تُحفظ ملاحظاتك تلقائياً
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
