import React, { useState } from 'react';
import { 
  ExternalLink, 
  Play, 
  Pause, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  GraduationCap, 
  BookOpen, 
  Globe, 
  Sparkles,
  Info,
  Timer
} from 'lucide-react';
import { StudyPlatform } from '../types';
import { playSound } from '../utils/audioSynth';

interface Props {
  platforms: StudyPlatform[];
  activePlatformId: string | null;
  onLaunchPlatform: (platform: StudyPlatform, mode: 'in_app' | 'external') => void;
  onStopPlatform: (platformId: string) => void;
  onAddCustomPlatform: (platform: Omit<StudyPlatform, 'id' | 'usedTodaySeconds'>) => void;
  onDeleteCustomPlatform: (platformId: string) => void;
  onOpenYouTubeStudy?: () => void;
}

export const StudyPlatforms: React.FC<Props> = ({
  platforms,
  activePlatformId,
  onLaunchPlatform,
  onStopPlatform,
  onAddCustomPlatform,
  onDeleteCustomPlatform,
  onOpenYouTubeStudy,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const formatSeconds = (totalSecs: number) => {
    const hours = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) return;

    let finalUrl = newUrl.trim();
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
    }

    onAddCustomPlatform({
      name: newTitle.trim(),
      nameEn: newTitle.trim(),
      url: finalUrl,
      description: newDesc.trim() || 'منصة تعليمية إضافية للثانوية العامة',
      category: 'custom',
      color: 'from-blue-600 to-indigo-600',
      iconName: 'Globe',
      dailyLimitMinutes: 300, // 5 hours limit
    });

    setNewTitle('');
    setNewUrl('');
    setNewDesc('');
    setShowAddModal(false);
    playSound('success');
  };

  return (
    <section id="study-platforms-section" className="space-y-4">
      
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-neutral-900/60 border border-amber-500/20 rounded-2xl p-4 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg sm:text-xl font-black text-white font-heading">
              منصات الدراسة الرسمية المقررة
            </h3>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">
            الحد اليومي المخصص لكل منصة: <span className="text-amber-400 font-bold">5 ساعات (300 دقيقة)</span> لحماية تركيزك وتنظيم وقتك
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onOpenYouTubeStudy && (
            <button
              id="platforms-header-youtube-btn"
              onClick={() => {
                playSound('click');
                onOpenYouTubeStudy();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/40 text-xs font-bold transition-all shadow-sm"
              title="فتح يوتيوب المذاكرة (مغلق على 5 قنوات فقط بدون تشتيت)"
            >
              <Play className="w-4 h-4 fill-current text-red-400" />
              <span>يوتيوب المذاكرة (5 قنوات)</span>
            </button>
          )}

          <button
            id="add-custom-platform-btn"
            onClick={() => {
              playSound('click');
              setShowAddModal(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة منصة جديدة</span>
          </button>
        </div>
      </div>

      {/* Platforms Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {platforms.map((platform) => {
          const limitSeconds = platform.dailyLimitMinutes * 60;
          const usedSeconds = platform.usedTodaySeconds;
          const remainingSeconds = Math.max(0, limitSeconds - usedSeconds);
          const percentUsed = Math.min(100, Math.round((usedSeconds / limitSeconds) * 100));
          const isLimitReached = usedSeconds >= limitSeconds;
          const isActive = activePlatformId === platform.id;

          return (
            <div
              key={platform.id}
              id={`platform-card-${platform.id}`}
              className={`relative rounded-3xl border transition-all duration-300 p-5 sm:p-6 overflow-hidden flex flex-col justify-between ${
                isActive
                  ? 'bg-neutral-900/90 border-amber-400 shadow-2xl shadow-amber-500/20 ring-2 ring-amber-400/50'
                  : isLimitReached
                  ? 'bg-neutral-950/70 border-red-500/40 opacity-85'
                  : 'bg-neutral-900/70 border-neutral-800 hover:border-amber-500/40 hover:shadow-xl'
              } backdrop-blur-xl`}
            >
              {/* Active Breathing Indicator */}
              {isActive && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 animate-pulse" />
              )}

              {/* Card Top */}
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${platform.color} p-0.5 shadow-lg flex items-center justify-center text-white`}>
                      {platform.iconName === 'GraduationCap' ? (
                        <GraduationCap className="w-6 h-6" />
                      ) : platform.iconName === 'BookOpen' ? (
                        <BookOpen className="w-6 h-6" />
                      ) : (
                        <Globe className="w-6 h-6" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-white text-base sm:text-lg font-heading">
                          {platform.name}
                        </h4>
                        {platform.category === 'primary' && (
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                            رسمي
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-neutral-400 font-mono" dir="ltr">
                        {platform.nameEn}
                      </span>
                    </div>
                  </div>

                  {/* Active / Status Badge */}
                  <div>
                    {isActive ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/40 animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                        قيد المذاكرة
                      </span>
                    ) : isLimitReached ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-bold border border-red-500/40">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                        اكتمل الـ 5 ساعات
                      </span>
                    ) : (
                      <span className="text-xs text-neutral-400 font-medium">
                        متبقي {Math.floor(remainingSeconds / 3600)}س و {Math.floor((remainingSeconds % 3600) / 60)}د
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-neutral-300 line-clamp-2 mb-4 leading-relaxed">
                  {platform.description}
                </p>
              </div>

              {/* Time Progress Bar (5 Hours Goal) */}
              <div className="space-y-2 mb-5 bg-neutral-950/60 p-3.5 rounded-2xl border border-neutral-800/80">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-neutral-300">
                    <Timer className="w-3.5 h-3.5 text-amber-400" />
                    <span>المذاكرة المستغرقة اليوم:</span>
                  </div>
                  <div className="font-mono font-bold text-amber-300">
                    {formatSeconds(usedSeconds)} <span className="text-neutral-500 font-normal">/ 05:00:00</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2.5 bg-neutral-800 rounded-full overflow-hidden p-0.5">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isLimitReached
                        ? 'bg-red-500'
                        : percentUsed > 80
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                        : 'bg-gradient-to-r from-yellow-400 to-amber-500'
                    }`}
                    style={{ width: `${percentUsed}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-neutral-400">
                  <span>نسبة الإنجاز: {percentUsed}%</span>
                  <span>
                    {isLimitReached
                      ? 'تم استهلاك الحد المسموح بالكامل اليوم'
                      : `متبقي ${Math.floor(remainingSeconds / 60)} دقيقة حتى القفل`}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                {isLimitReached ? (
                  <div className="p-3 rounded-xl bg-red-950/30 border border-red-500/30 text-center text-xs text-red-200">
                    <CheckCircle2 className="w-4 h-4 text-red-400 mx-auto mb-1" />
                    أحسنت! أتممت الـ 5 ساعات المقررة على هذه المنصة اليوم. يمكنك أخذ قسط من الراحة أو الذهاب إلى منصتك الأخرى.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    
                    {/* Launch In-App Viewer */}
                    <button
                      id={`launch-inapp-${platform.id}`}
                      onClick={() => {
                        playSound('click');
                        if (isActive) {
                          onStopPlatform(platform.id);
                        } else {
                          onLaunchPlatform(platform, 'in_app');
                        }
                      }}
                      className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all shadow-md ${
                        isActive
                          ? 'bg-amber-500 text-neutral-950 hover:bg-amber-400 active:scale-95'
                          : 'bg-gradient-to-r from-amber-500 to-yellow-500 text-neutral-950 hover:brightness-110 active:scale-95'
                      }`}
                    >
                      {isActive ? (
                        <>
                          <Pause className="w-4 h-4 fill-neutral-950" />
                          <span>إيقاف المؤقت مؤقتاً</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-neutral-950" />
                          <span>فتح المنصة داخل التطبيق</span>
                        </>
                      )}
                    </button>

                    {/* Launch in External Tab with Active Tracker */}
                    <button
                      id={`launch-external-${platform.id}`}
                      onClick={() => {
                        playSound('click');
                        onLaunchPlatform(platform, 'external');
                      }}
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 text-xs font-bold transition-all active:scale-95"
                      title="فتح في علامة تبويب جديدة مع استمرار احتساب الـ 5 ساعات"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                      <span>فتح نافذة خارجية</span>
                    </button>
                  </div>
                )}

                {/* Remove custom platform if created by user */}
                {platform.category === 'custom' && (
                  <button
                    onClick={() => {
                      playSound('click');
                      onDeleteCustomPlatform(platform.id);
                    }}
                    className="w-full text-center text-[11px] text-neutral-500 hover:text-red-400 py-1 transition-colors flex items-center justify-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>حذف هذه المنصة</span>
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Modal to Add Custom Platform */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-neutral-900 border border-amber-500/30 rounded-3xl p-6 max-w-md w-full shadow-2xl text-right">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                إضافة منصة أو موقع دراسة جديد
              </h4>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  اسم المنصة أو القناة
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: منصة نجوى، دروس الكيمياء، يوتيوب..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  رابط الموقع (URL)
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://example.com"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white text-xs font-mono text-left focus:outline-none focus:border-amber-400"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  وصف مختصر أو المادة
                </label>
                <input
                  type="text"
                  placeholder="مثال: مراجعة وحل بنك الأسئلة"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-200 flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>سيتم تطبيق نظام الـ 5 ساعات تلقائياً على هذه المنصة أيضاً كباقي المنصات.</span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-amber-500 text-neutral-950 font-bold text-xs hover:bg-amber-400 transition-colors"
                >
                  حفظ المنصة
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 text-xs hover:bg-neutral-700 transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </section>
  );
};
