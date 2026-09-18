import React from 'react';
import { 
  X, 
  Settings, 
  RotateCcw, 
  Download, 
  Smartphone, 
  Clock, 
  ShieldCheck, 
  HelpCircle,
  Award
} from 'lucide-react';
import { playSound } from '../utils/audioSynth';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  dailyLimitMinutes: number;
  onChangeDailyLimit: (mins: number) => void;
  onResetTodayData: () => void;
  onInstallPwa: () => void;
  isInstallable: boolean;
  onOpenMusicModal?: () => void;
}

export const SettingsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  dailyLimitMinutes,
  onChangeDailyLimit,
  onResetTodayData,
  onInstallPwa,
  isInstallable,
  onOpenMusicModal,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-neutral-900 border border-amber-500/30 rounded-3xl p-6 max-w-lg w-full shadow-2xl text-right max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
          <h3 className="font-extrabold text-white text-lg flex items-center gap-2 font-heading">
            <Settings className="w-5 h-5 text-amber-400" />
            إعدادات النظام وتثبيت التطبيق على الهاتف
          </h3>
          <button
            onClick={() => {
              playSound('click');
              onClose();
            }}
            className="text-neutral-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5 text-xs text-neutral-300">
          
          {/* Daily Limit Option */}
          <div className="p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-white flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400" />
                الحد اليومي المسموح به لكل منصة:
              </label>
              <span className="font-mono font-black text-amber-400 text-sm">
                {dailyLimitMinutes / 60} ساعات ({dailyLimitMinutes} دقيقة)
              </span>
            </div>

            <p className="text-[11px] text-neutral-400">
              تم ضبط الحد تلقائياً على 5 ساعات يومياً وفق طلبك لحماية عينك وتنظيم مذاكرتك.
            </p>

            <div className="flex items-center gap-2 pt-2">
              {[180, 240, 300, 360].map((mins) => (
                <button
                  key={mins}
                  onClick={() => {
                    playSound('click');
                    onChangeDailyLimit(mins);
                  }}
                  className={`flex-1 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                    dailyLimitMinutes === mins
                      ? 'bg-amber-500 text-neutral-950 border-amber-400 shadow-md'
                      : 'bg-neutral-900 border-neutral-700 text-neutral-300 hover:bg-neutral-800'
                  }`}
                >
                  {mins / 60} ساعات
                </button>
              ))}
            </div>
          </div>

          {/* How to Install as App / APK Guide */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-neutral-950 to-neutral-900 border border-amber-500/30 space-y-3">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
              <Smartphone className="w-4 h-4 text-amber-400" />
              <span>كيفية تثبيت التطبيق على هاتفك المحمول (Android و iPhone)</span>
            </div>

            <div className="space-y-2 text-neutral-300 leading-relaxed">
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  1
                </span>
                <span>
                  افتح رابط الموقع من متصفح الهاتف (مثل Google Chrome أو Safari).
                </span>
              </div>

              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  2
                </span>
                <span>
                  اضغط على زر <b>"تثبيت التطبيق"</b> في الأعلى، أو من قائمة المتصفح (الثلاث نقاط ⋮) اختر <b>"إضافة إلى الشاشة الرئيسية" (Add to Home Screen)</b> أو <b>"تثبيت التطبيق"</b>.
                </span>
              </div>

              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  3
                </span>
                <span>
                  سيظهر التطبيق فوراً كأيقونة على شاشة الهاتف، ويفتح بملء الشاشة وبدون شريط متصفح مثل أي تطبيق أصلي!
                </span>
              </div>
            </div>

            {isInstallable && (
              <button
                onClick={() => {
                  playSound('click');
                  onInstallPwa();
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-neutral-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:brightness-110 transition-all mt-2"
              >
                <Download className="w-4 h-4" />
                <span>تثبيت التطبيق على جهازي الآن</span>
              </button>
            )}
          </div>

          {/* Motivational Audio Files Management */}
          {onOpenMusicModal && (
            <div className="p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">أناشيد التحفيز وملفات الـ MP3</span>
                <span className="text-[11px] text-neutral-400">
                  إدارة الأناشيد وإضافة ملفات صوتية بصوت حقيقي من جهازك.
                </span>
              </div>

              <button
                onClick={() => {
                  playSound('click');
                  onClose();
                  onOpenMusicModal();
                }}
                className="px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all"
              >
                تخصيص الأناشيد 🎵
              </button>
            </div>
          )}

          {/* Reset Today's Stats */}
          <div className="p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800 flex items-center justify-between">
            <div>
              <span className="font-bold text-white block">تصفير عدادات اليوم</span>
              <span className="text-[11px] text-neutral-400">
                إعادة ضبط ساعات المذاكرة والألعاب لبدء يوم دراسي جديد.
              </span>
            </div>

            <button
              onClick={() => {
                if (window.confirm('هل أنت متأكد من تصفير عدادات اليوم لبدء يوم جديد؟')) {
                  playSound('click');
                  onResetTodayData();
                  onClose();
                }
              }}
              className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-red-900/50 text-neutral-300 hover:text-red-300 border border-neutral-700 hover:border-red-500/40 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>تصفير اليوم</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
