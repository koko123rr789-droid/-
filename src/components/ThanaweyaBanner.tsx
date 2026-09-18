import React, { useState, useEffect } from 'react';
import { Flame, Target, Trophy, Compass, Sparkles, BookOpen, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { MOTIVATIONAL_QUOTES } from '../data/defaultData';
import { playSound } from '../utils/audioSynth';
import { getNetworkNow } from '../utils/networkTime';

// Exact countdown anchor: strictly 286 days remaining as specified by user
const SESSION_START_TIME = Date.now();
const TOTAL_TARGET_SECONDS = (286 * 24 * 3600) + (14 * 3600) + (28 * 60);

export const ThanaweyaBanner: React.FC = () => {
  const [quoteIndex, setQuoteIndex] = useState(0);

  // Target exam countdown initialized to exactly 286 days
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 286,
    hours: 14,
    minutes: 28,
    seconds: 0,
  });

  useEffect(() => {
    const calculateCountdown = () => {
      const elapsedSeconds = Math.floor((Date.now() - SESSION_START_TIME) / 1000);
      const remainingTotalSeconds = Math.max(0, TOTAL_TARGET_SECONDS - elapsedSeconds);

      const days = Math.floor(remainingTotalSeconds / (24 * 3600));
      const hours = Math.floor((remainingTotalSeconds % (24 * 3600)) / 3600);
      const minutes = Math.floor((remainingTotalSeconds % 3600) / 60);
      const seconds = remainingTotalSeconds % 60;

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const triggerMotivationBooster = () => {
    playSound('success');
    setQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);

    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#eab308', '#ca8a04', '#ffffff', '#10b981'],
      });
    } catch {
      // fallback
    }
  };

  const currentQuote = MOTIVATIONAL_QUOTES[quoteIndex];

  return (
    <div id="thanaweya-hero-banner" className="relative rounded-3xl overflow-hidden border border-amber-500/30 bg-neutral-950/75 backdrop-blur-xl shadow-2xl p-5 sm:p-7 transition-all">
      {/* Glow background accents */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-yellow-500/10 rounded-full filter blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Main Inspirational Typography Matching the User's Poster */}
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>الثانوية العامة • رحلة العبور إلى القمة</span>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight font-heading">
              مهمة تحديد <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500">المستقبل والمصير</span> والتنافس
            </h2>
            <div className="flex items-center gap-3 pt-1">
              <span className="text-xl sm:text-2xl font-black text-amber-400 bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/40 shadow-inner inline-block">
                ولابد أن تكون بابا المجال! 👑
              </span>
            </div>
          </div>

          {/* Slogan Badges matching blackboard notes from image */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-900/90 border border-amber-500/20 text-neutral-200">
              <Target className="w-3.5 h-3.5 text-amber-400" />
              <span>طموح لا ينتهي</span>
            </span>
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-900/90 border border-amber-500/20 text-neutral-200">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>إصرار وعزيمة</span>
            </span>
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-900/90 border border-amber-500/20 text-neutral-200">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>نجاح مستحق</span>
            </span>
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold">
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>مستقبلك بإيدك</span>
            </span>
          </div>

          {/* Interactive Quote Rotator */}
          <div className="pt-2">
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-950/30 to-neutral-900/60 border border-amber-500/20 flex items-start justify-between gap-3">
              <div className="space-y-1">
                <p className="text-sm font-medium text-amber-100 leading-relaxed">
                  "{currentQuote.quote}"
                </p>
                <div className="text-[11px] text-amber-400/80 font-semibold">
                  — {currentQuote.author}
                </div>
              </div>

              <button
                id="boost-motivation-btn"
                onClick={triggerMotivationBooster}
                className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-neutral-950 font-bold text-xs shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all"
                title="اضغط لتغيير الحكمة وإشعال طاقة الحماس"
              >
                <Flame className="w-4 h-4 text-neutral-950 fill-neutral-950" />
                <span>حفّزني!</span>
              </button>
            </div>
          </div>

        </div>

        {/* Thanaweya Exam Countdown Widget */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl bg-neutral-900/90 border border-amber-500/30 shadow-xl">
          <div className="w-full flex items-center justify-between border-b border-neutral-800 pb-2 mb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
              <Clock className="w-4 h-4" />
              <span>العد التنازلي لامتحانات الثانوية</span>
            </div>
            <span className="text-[11px] text-neutral-400">كل ثانية تصنع فارقاً</span>
          </div>

          {/* Timer Digits */}
          <div className="grid grid-cols-4 gap-2 sm:gap-2.5 w-full text-center">
            <div className="bg-neutral-950/90 border border-amber-500/30 rounded-xl p-2 sm:p-3 shadow-inner">
              <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono">
                {timeLeft.days}
              </div>
              <div className="text-[10px] text-neutral-400 font-bold mt-0.5">يوم</div>
            </div>

            <div className="bg-neutral-950/90 border border-amber-500/30 rounded-xl p-2 sm:p-3 shadow-inner">
              <div className="text-xl sm:text-2xl font-black text-amber-300 font-mono">
                {timeLeft.hours.toString().padStart(2, '0')}
              </div>
              <div className="text-[10px] text-neutral-400 font-bold mt-0.5">ساعة</div>
            </div>

            <div className="bg-neutral-950/90 border border-amber-500/30 rounded-xl p-2 sm:p-3 shadow-inner">
              <div className="text-xl sm:text-2xl font-black text-amber-200 font-mono">
                {timeLeft.minutes.toString().padStart(2, '0')}
              </div>
              <div className="text-[10px] text-neutral-400 font-bold mt-0.5">دقيقة</div>
            </div>

            <div className="bg-neutral-950/90 border border-amber-500/30 rounded-xl p-2 sm:p-3 shadow-inner">
              <div className="text-xl sm:text-2xl font-black text-amber-500 font-mono animate-pulse">
                {timeLeft.seconds.toString().padStart(2, '0')}
              </div>
              <div className="text-[10px] text-neutral-400 font-bold mt-0.5">ثانية</div>
            </div>
          </div>

          {/* Daily 5 Hours Rule Notice */}
          <div className="w-full mt-3 pt-2.5 border-t border-neutral-800/80 flex items-center justify-between text-xs">
            <span className="text-neutral-300 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              نظام الوقت: <b className="text-amber-400">5 ساعات دراسة يومياً</b>
            </span>
            <span className="text-neutral-400 text-[11px]">مسموح لكل منصة</span>
          </div>
        </div>

      </div>
    </div>
  );
};
