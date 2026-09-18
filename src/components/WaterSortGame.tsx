import React, { useState, useEffect } from 'react';
import { RotateCcw, Award, Sparkles, ExternalLink, Smartphone } from 'lucide-react';
import { playSound } from '../utils/audioSynth';
import confetti from 'canvas-confetti';

interface Props {
  onWin?: () => void;
}

const COLORS: Record<string, { bg: string; label: string }> = {
  R: { bg: 'bg-rose-500', label: 'أحمر' },
  B: { bg: 'bg-sky-500', label: 'أزرق' },
  G: { bg: 'bg-emerald-500', label: 'أخضر' },
  Y: { bg: 'bg-amber-400', label: 'أصفر' },
};

const INITIAL_TUBES: string[][] = [
  ['R', 'B', 'G', 'Y'],
  ['G', 'Y', 'R', 'B'],
  ['Y', 'G', 'B', 'R'],
  ['B', 'R', 'Y', 'G'],
  [], // Empty 1
  [], // Empty 2
];

export const WaterSortGame: React.FC<Props> = () => {
  const [tubes, setTubes] = useState<string[][]>(() => JSON.parse(JSON.stringify(INITIAL_TUBES)));
  const [selectedTube, setSelectedTube] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);

  // Check victory condition
  useEffect(() => {
    const filledTubes = tubes.filter((t) => t.length === 4);
    const emptyTubes = tubes.filter((t) => t.length === 0);

    if (filledTubes.length === 4 && emptyTubes.length === 2) {
      const allUniform = filledTubes.every((tube) => tube.every((c) => c === tube[0]));
      if (allUniform && !isWon) {
        setIsWon(true);
        playSound('success');
        try {
          confetti({
            particleCount: 80,
            spread: 80,
            origin: { y: 0.6 },
          });
        } catch {}
      }
    }
  }, [tubes, isWon]);

  const handleTubeClick = (index: number) => {
    playSound('click');
    if (selectedTube === null) {
      // Select source tube if not empty
      if (tubes[index].length > 0) {
        setSelectedTube(index);
      }
      return;
    }

    if (selectedTube === index) {
      // Deselect
      setSelectedTube(null);
      return;
    }

    // Try to pour from selectedTube to index
    const source = [...tubes[selectedTube]];
    const dest = [...tubes[index]];

    if (dest.length >= 4) {
      // Dest is full
      setSelectedTube(null);
      return;
    }

    const topSourceColor = source[source.length - 1];

    if (dest.length === 0 || dest[dest.length - 1] === topSourceColor) {
      // Valid pour!
      source.pop();
      dest.push(topSourceColor);

      const nextTubes = tubes.map((t, idx) => {
        if (idx === selectedTube) return source;
        if (idx === index) return dest;
        return t;
      });

      setTubes(nextTubes);
      setMoves((m) => m + 1);
      playSound('complete');
    }

    setSelectedTube(null);
  };

  const handleReset = () => {
    playSound('click');
    setTubes(JSON.parse(JSON.stringify(INITIAL_TUBES)));
    setSelectedTube(null);
    setMoves(0);
    setIsWon(false);
  };

  return (
    <div className="space-y-6 text-center max-w-xl mx-auto p-4 rounded-3xl bg-neutral-950/80 border border-emerald-500/30">
      
      {/* Title & Stats */}
      <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
        <div className="text-right">
          <span className="text-[10px] font-mono text-emerald-400 font-bold block">
            حزمة: com.water.sort.color.match.puzzle.game
          </span>
          <h4 className="text-base font-black text-white font-heading">
            لعبة فرز الألوان والمياه في الأنابيب
          </h4>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-left font-mono">
            <span className="text-[10px] text-neutral-400 block">الحركات</span>
            <span className="text-sm font-bold text-amber-400">{moves}</span>
          </div>

          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-neutral-900 border border-neutral-700 text-neutral-300 hover:text-white hover:border-amber-400 transition-colors"
            title="إعادة المحاولة"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isWon ? (
        <div className="py-8 space-y-3 animate-in zoom-in-95">
          <Award className="w-12 h-12 text-amber-400 mx-auto animate-bounce" />
          <h5 className="text-lg font-black text-emerald-400 font-heading">
            🎉 مبروك! قمت بحل لغز فرز الألوان بنجاح!
          </h5>
          <p className="text-xs text-neutral-300">
            أنهيت اللغز في {moves} حركة. تركيزك وهدوءك الذهني في أفضل حالاته.
          </p>
          <button
            onClick={handleReset}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-neutral-950 font-bold text-xs shadow-lg shadow-emerald-500/30 hover:scale-105 transition-all"
          >
            لعب جولة جديدة 🔄
          </button>
        </div>
      ) : (
        <div className="py-4">
          <p className="text-xs text-neutral-400 mb-6">
            اضغط على أنبوب لتحديده، ثم اضغط على الأنبوب المستهدف لصب اللون المطابق!
          </p>

          {/* Test Tubes Grid */}
          <div className="flex flex-wrap justify-center items-end gap-4 sm:gap-6 min-h-[220px]">
            {tubes.map((tube, idx) => {
              const isSelected = selectedTube === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleTubeClick(idx)}
                  className={`w-12 sm:w-14 h-44 rounded-b-3xl border-2 transition-all flex flex-col-reverse p-1 bg-neutral-900/60 overflow-hidden relative shadow-lg ${
                    isSelected
                      ? '-translate-y-4 border-amber-400 shadow-amber-500/40 ring-2 ring-amber-400/50'
                      : 'border-neutral-700 hover:border-emerald-400/70'
                  }`}
                >
                  {tube.map((colorKey, cIdx) => (
                    <div
                      key={cIdx}
                      className={`w-full h-9 rounded-md transition-all duration-300 ${COLORS[colorKey]?.bg || 'bg-neutral-600'} mb-0.5 shadow-sm`}
                    />
                  ))}
                  {tube.length === 0 && (
                    <span className="text-[10px] text-neutral-600 font-mono self-center mb-2">
                      فارغ
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Google Play Store Link */}
      <div className="pt-3 border-t border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400">
        <span className="flex items-center gap-1 text-emerald-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>مستوحاة من متجر Google Play</span>
        </span>

        <a
          href="https://play.google.com/store/apps/details?id=com.water.sort.color.match.puzzle.game"
          target="_blank"
          rel="noopener noreferrer"
          className="text-amber-400 hover:underline flex items-center gap-1 font-bold"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>فتح في متجر Play</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

    </div>
  );
};
