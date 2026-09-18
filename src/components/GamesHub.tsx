import React, { useState, useEffect, useRef } from 'react';
import { 
  Gamepad2, 
  Lock, 
  Unlock, 
  Trophy, 
  Play, 
  RotateCcw, 
  Zap, 
  Calculator, 
  Sparkles, 
  Grid, 
  ArrowLeft, 
  Check, 
  X,
  Timer
} from 'lucide-react';
import { GameItem } from '../types';
import { GAMES_CATALOG } from '../data/defaultData';
import { playSound } from '../utils/audioSynth';
import { WaterSortGame } from './WaterSortGame';
import { GearsRacingGame } from './GearsRacingGame';
import confetti from 'canvas-confetti';

interface Props {
  totalStudySecondsToday: number;
  earnedGameSeconds: number;
  usedGameSeconds: number;
  onConsumeGameSecond: () => void;
}

export const GamesHub: React.FC<Props> = ({
  totalStudySecondsToday,
  earnedGameSeconds,
  usedGameSeconds,
  onConsumeGameSecond,
}) => {
  const [selectedGame, setSelectedGame] = useState<GameItem | null>(null);

  const remainingGameSeconds = Math.max(0, earnedGameSeconds - usedGameSeconds);
  const isUnlocked = remainingGameSeconds > 0;
  const remainingMinutes = Math.floor(remainingGameSeconds / 60);
  const remainingSecsOnly = remainingGameSeconds % 60;

  // Track gaming time while a game is actively played
  useEffect(() => {
    if (!selectedGame || remainingGameSeconds <= 0) return;

    const interval = setInterval(() => {
      onConsumeGameSecond();
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedGame, remainingGameSeconds, onConsumeGameSecond]);

  // When game time runs out while playing
  useEffect(() => {
    if (selectedGame && remainingGameSeconds <= 0) {
      playSound('alert');
      alert('⏰ انتهى وقت الألعاب المكتسب لهذا الدور! أحسنت الاستراحة، عُد الآن لمنصات المذاكرة لتحصيل مزيد من النقاط وساعات التفوق.');
      setSelectedGame(null);
    }
  }, [remainingGameSeconds, selectedGame]);

  return (
    <section id="games-hub-section" className="space-y-4">
      
      {/* Games Header Card */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-neutral-900/60 border border-emerald-500/30 rounded-2xl p-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl border ${
            isUnlocked 
              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300' 
              : 'bg-neutral-800 border-neutral-700 text-neutral-400'
          }`}>
            <Gamepad2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-black text-white font-heading">
                منطقة الألعاب والمكافآت المشروطة
              </h3>
              {isUnlocked ? (
                <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                  <Unlock className="w-3 h-3" />
                  مفتوحة للعب!
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-neutral-800 text-neutral-400 border border-neutral-700 font-bold">
                  <Lock className="w-3 h-3" />
                  مقفل مؤقتاً
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              نظام المكافأة: كل <b className="text-amber-300">ساعة مذاكرة كاملة (60 دقيقة)</b> على المنصات تمنحك <b className="text-emerald-300">ربع ساعة (15 دقيقة) ألعاب</b> كاستراحة ذكية.
            </p>
          </div>
        </div>

        {/* Remaining Time Pill */}
        <div className="flex items-center gap-2 bg-neutral-950/80 px-3.5 py-2 rounded-xl border border-emerald-500/30">
          <Timer className="w-4 h-4 text-emerald-400" />
          <div className="text-right">
            <span className="text-[10px] text-neutral-400 block leading-none">رصيد وقت اللعب</span>
            <span className="font-mono font-black text-emerald-400 text-sm">
              {remainingMinutes}د : {remainingSecsOnly.toString().padStart(2, '0')}ث
            </span>
          </div>
        </div>
      </div>

      {/* Active Game Modal or Games Grid */}
      {selectedGame ? (
        <div className="relative rounded-3xl border border-emerald-500/40 bg-neutral-950/90 p-5 backdrop-blur-2xl shadow-2xl">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
            <button
              onClick={() => {
                playSound('click');
                setSelectedGame(null);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>الرجوع لقائمة الألعاب</span>
            </button>

            <div className="text-center">
              <h4 className="font-black text-white text-base font-heading">
                {selectedGame.title}
              </h4>
              <span className="text-xs text-neutral-400">{selectedGame.subtitle}</span>
            </div>

            <div className="flex items-center gap-1 text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-3 py-1 rounded-xl">
              <Timer className="w-3.5 h-3.5" />
              <span>{remainingMinutes}:{remainingSecsOnly.toString().padStart(2, '0')}</span>
            </div>
          </div>

          {/* Render chosen game engine */}
          {selectedGame.id === 'water-sort-puzzle' && <WaterSortGame />}
          {selectedGame.id === 'gears-racing' && <GearsRacingGame />}
          {selectedGame.id === 'math-lightning' && <MathLightningGame />}
          {selectedGame.id === 'memory-matrix' && <MemoryMatrixGame />}
          {selectedGame.id === 'game-2048' && <Game2048Engine />}
          {selectedGame.id === 'reflex-trigger' && <ReflexTriggerGame />}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {GAMES_CATALOG.map((game) => {
            return (
              <div
                key={game.id}
                className={`relative rounded-2xl border p-4 transition-all flex flex-col justify-between ${
                  isUnlocked
                    ? 'bg-neutral-900/70 border-neutral-800 hover:border-emerald-500/50 hover:shadow-xl hover:-translate-y-1'
                    : 'bg-neutral-950/60 border-neutral-900 opacity-75'
                } backdrop-blur-md`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      {game.icon === 'Calculator' ? (
                        <Calculator className="w-5 h-5" />
                      ) : game.icon === 'Sparkles' ? (
                        <Sparkles className="w-5 h-5" />
                      ) : game.icon === 'Grid' ? (
                        <Grid className="w-5 h-5" />
                      ) : (
                        <Zap className="w-5 h-5" />
                      )}
                    </div>

                    <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-800 text-neutral-400 border border-neutral-700">
                      {game.category}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-white text-sm sm:text-base font-heading mb-1">
                    {game.title}
                  </h4>
                  {game.packageName && (
                    <span className="text-[9px] font-mono font-bold text-emerald-400 block mb-1 truncate bg-neutral-950 px-1.5 py-0.5 rounded border border-neutral-800">
                      {game.packageName}
                    </span>
                  )}
                  <p className="text-xs text-neutral-400 line-clamp-2 mb-4 leading-relaxed">
                    {game.description}
                  </p>
                </div>

                <div>
                  {isUnlocked ? (
                    <button
                      onClick={() => {
                        playSound('click');
                        setSelectedGame(game);
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-neutral-950 font-bold text-xs hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>ابدأ اللعب الآن</span>
                    </button>
                  ) : (
                    <div className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-center text-xs text-neutral-400 flex items-center justify-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-amber-500" />
                      <span>تحتاج مذاكرة لفتح اللعبة</span>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </section>
  );
};

/* =========================================================================
   1. MINI-GAME: Math Lightning (تحدي الحساب الخاطف للعباقرة)
   ========================================================================= */
const MathLightningGame: React.FC = () => {
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [num1, setNum1] = useState(12);
  const [num2, setNum2] = useState(7);
  const [op, setOp] = useState<'+' | '-' | '×'>('+');
  const [options, setOptions] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const generateProblem = () => {
    const ops: Array<'+' | '-' | '×'> = ['+', '-', '×'];
    const chosenOp = ops[Math.floor(Math.random() * ops.length)];
    let a = Math.floor(Math.random() * 25) + 3;
    let b = Math.floor(Math.random() * 15) + 2;

    if (chosenOp === '-') {
      if (a < b) [a, b] = [b, a];
    } else if (chosenOp === '×') {
      a = Math.floor(Math.random() * 12) + 2;
      b = Math.floor(Math.random() * 10) + 2;
    }

    let correct = 0;
    if (chosenOp === '+') correct = a + b;
    if (chosenOp === '-') correct = a - b;
    if (chosenOp === '×') correct = a * b;

    setNum1(a);
    setNum2(b);
    setOp(chosenOp);

    // Generate 3 wrong options
    const opts = new Set<number>([correct]);
    while (opts.size < 4) {
      const offset = (Math.floor(Math.random() * 7) + 1) * (Math.random() > 0.5 ? 1 : -1);
      const val = Math.max(1, correct + offset);
      opts.add(val);
    }
    setOptions(Array.from(opts).sort(() => Math.random() - 0.5));
    setFeedback(null);
  };

  useEffect(() => {
    generateProblem();
  }, []);

  const handleAnswer = (choice: number) => {
    let correct = 0;
    if (op === '+') correct = num1 + num2;
    if (op === '-') correct = num1 - num2;
    if (op === '×') correct = num1 * num2;

    if (choice === correct) {
      playSound('success');
      setScore((s) => s + 10 + streak * 2);
      setStreak((s) => s + 1);
      setFeedback('correct');
      setTimeout(generateProblem, 350);
    } else {
      playSound('alert');
      setStreak(0);
      setFeedback('wrong');
      setTimeout(generateProblem, 600);
    }
  };

  return (
    <div className="max-w-md mx-auto text-center space-y-5 py-4">
      {/* Score Header */}
      <div className="flex justify-between items-center bg-neutral-900/80 px-4 py-2 rounded-2xl border border-neutral-800">
        <div className="text-right">
          <span className="text-[10px] text-neutral-400 block">النقاط الحالية</span>
          <span className="font-mono font-black text-amber-400 text-lg">{score}</span>
        </div>
        <div className="text-left">
          <span className="text-[10px] text-neutral-400 block">سلسلة الإجابات المتتالية 🔥</span>
          <span className="font-mono font-black text-emerald-400 text-lg">{streak}</span>
        </div>
      </div>

      {/* Equation Card */}
      <div className={`p-8 rounded-3xl border transition-colors shadow-xl ${
        feedback === 'correct' 
          ? 'bg-emerald-950/60 border-emerald-500' 
          : feedback === 'wrong' 
          ? 'bg-red-950/60 border-red-500' 
          : 'bg-neutral-900/90 border-neutral-700'
      }`}>
        <div className="text-4xl sm:text-5xl font-black text-white font-mono tracking-wider" dir="ltr">
          {num1} {op} {num2} = ?
        </div>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-2 gap-3">
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(opt)}
            className="py-4 rounded-2xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-emerald-500 text-white font-mono text-xl sm:text-2xl font-bold transition-all active:scale-95 shadow-md"
            dir="ltr"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};

/* =========================================================================
   2. MINI-GAME: Memory Matrix (مصفوفة الذاكرة الصورية)
   ========================================================================= */
const ICONS = ['⚛️', '📐', '🚀', '🧠', '🏆', '💡', '🔬', '🌟'];

const MemoryMatrixGame: React.FC = () => {
  const [cards, setCards] = useState<Array<{ id: number; icon: string; flipped: boolean; matched: boolean }>>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);

  const initGame = () => {
    const deck = [...ICONS, ...ICONS]
      .sort(() => Math.random() - 0.5)
      .map((icon, id) => ({ id, icon, flipped: false, matched: false }));
    setCards(deck);
    setFlippedIndices([]);
    setMoves(0);
    setIsWon(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleCardClick = (index: number) => {
    if (flippedIndices.length === 2 || cards[index].flipped || cards[index].matched) return;

    playSound('click');
    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [first, second] = newFlipped;
      if (cards[first].icon === cards[second].icon) {
        playSound('success');
        setTimeout(() => {
          setCards((prev) => {
            const updated = [...prev];
            updated[first].matched = true;
            updated[second].matched = true;
            if (updated.every((c) => c.matched)) {
              setIsWon(true);
              confetti({ particleCount: 70, spread: 60 });
            }
            return updated;
          });
          setFlippedIndices([]);
        }, 400);
      } else {
        setTimeout(() => {
          setCards((prev) => {
            const updated = [...prev];
            updated[first].flipped = false;
            updated[second].flipped = false;
            return updated;
          });
          setFlippedIndices([]);
        }, 800);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto text-center space-y-4 py-2">
      <div className="flex justify-between items-center bg-neutral-900/80 px-4 py-2 rounded-2xl border border-neutral-800">
        <span className="text-xs text-neutral-300">
          الحركات: <b className="text-amber-400 font-mono text-sm">{moves}</b>
        </span>
        <button
          onClick={() => {
            playSound('click');
            initGame();
          }}
          className="flex items-center gap-1 text-xs text-neutral-400 hover:text-white bg-neutral-800 px-2.5 py-1 rounded-lg"
        >
          <RotateCcw className="w-3 h-3" />
          <span>إعادة ترتيب</span>
        </button>
      </div>

      {isWon && (
        <div className="p-3 rounded-2xl bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-xs font-bold animate-bounce">
          🎉 رائع جداً! استعدت نشاط ذاكرتك بالكامل في {moves} حركة فقط!
        </div>
      )}

      <div className="grid grid-cols-4 gap-2.5">
        {cards.map((card, idx) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(idx)}
            className={`h-16 sm:h-20 rounded-2xl text-2xl sm:text-3xl flex items-center justify-center transition-all duration-300 shadow-md ${
              card.flipped || card.matched
                ? 'bg-emerald-950 border-2 border-emerald-400 rotate-0'
                : 'bg-neutral-800 border border-neutral-700 hover:border-amber-400'
            }`}
          >
            {card.flipped || card.matched ? card.icon : '❓'}
          </button>
        ))}
      </div>
    </div>
  );
};

/* =========================================================================
   3. MINI-GAME: 2048 Puzzle (لغز 2048 الكلاسيكي)
   ========================================================================= */
const Game2048Engine: React.FC = () => {
  const [board, setBoard] = useState<number[][]>([
    [0, 2, 0, 0],
    [0, 0, 2, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  const [score, setScore] = useState(0);

  const initGame = () => {
    const newBoard = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    addRandom(newBoard);
    addRandom(newBoard);
    setBoard(newBoard);
    setScore(0);
  };

  const addRandom = (b: number[][]) => {
    const empty: Array<[number, number]> = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (b[r][c] === 0) empty.push([r, c]);
      }
    }
    if (empty.length > 0) {
      const [r, c] = empty[Math.floor(Math.random() * empty.length)];
      b[r][c] = Math.random() > 0.8 ? 4 : 2;
    }
  };

  const slide = (row: number[]) => {
    let arr = row.filter((val) => val);
    let addedScore = 0;
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === arr[i + 1]) {
        arr[i] *= 2;
        addedScore += arr[i];
        arr[i + 1] = 0;
      }
    }
    arr = arr.filter((val) => val);
    while (arr.length < 4) arr.push(0);
    return { arr, addedScore };
  };

  const move = (dir: 'up' | 'down' | 'left' | 'right') => {
    playSound('click');
    let newBoard = board.map((r) => [...r]);
    let totalAdded = 0;

    if (dir === 'left') {
      for (let r = 0; r < 4; r++) {
        const { arr, addedScore } = slide(newBoard[r]);
        newBoard[r] = arr;
        totalAdded += addedScore;
      }
    } else if (dir === 'right') {
      for (let r = 0; r < 4; r++) {
        const { arr, addedScore } = slide(newBoard[r].reverse());
        newBoard[r] = arr.reverse();
        totalAdded += addedScore;
      }
    } else if (dir === 'up') {
      for (let c = 0; c < 4; c++) {
        const col = [newBoard[0][c], newBoard[1][c], newBoard[2][c], newBoard[3][c]];
        const { arr, addedScore } = slide(col);
        for (let r = 0; r < 4; r++) newBoard[r][c] = arr[r];
        totalAdded += addedScore;
      }
    } else if (dir === 'down') {
      for (let c = 0; c < 4; c++) {
        const col = [newBoard[0][c], newBoard[1][c], newBoard[2][c], newBoard[3][c]].reverse();
        const { arr, addedScore } = slide(col);
        arr.reverse();
        for (let r = 0; r < 4; r++) newBoard[r][c] = arr[r];
        totalAdded += addedScore;
      }
    }

    addRandom(newBoard);
    setBoard(newBoard);
    setScore((s) => s + totalAdded);
  };

  return (
    <div className="max-w-sm mx-auto text-center space-y-4 py-2 select-none">
      <div className="flex justify-between items-center bg-neutral-900/80 px-4 py-2 rounded-2xl border border-neutral-800">
        <span className="text-xs text-neutral-300">
          النقاط: <b className="text-amber-400 font-mono text-base">{score}</b>
        </span>
        <button
          onClick={initGame}
          className="text-xs text-neutral-400 hover:text-white bg-neutral-800 px-2.5 py-1 rounded-lg"
        >
          لعبة جديدة
        </button>
      </div>

      {/* 4x4 Grid */}
      <div className="grid grid-cols-4 gap-2 bg-neutral-900 p-2.5 rounded-2xl border border-neutral-800">
        {board.flat().map((val, i) => (
          <div
            key={i}
            className={`h-16 rounded-xl flex items-center justify-center font-mono font-black text-lg transition-all ${
              val === 0
                ? 'bg-neutral-950/60 text-transparent'
                : val <= 8
                ? 'bg-amber-900/40 text-amber-200 border border-amber-500/30'
                : val <= 64
                ? 'bg-amber-600 text-neutral-950 shadow-md'
                : 'bg-yellow-400 text-neutral-950 font-black shadow-lg shadow-yellow-500/30'
            }`}
          >
            {val > 0 ? val : ''}
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-1.5 pt-1">
        <button
          onClick={() => move('up')}
          className="w-14 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs"
        >
          ▲
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => move('left')}
            className="w-14 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs"
          >
            ◀
          </button>
          <button
            onClick={() => move('down')}
            className="w-14 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs"
          >
            ▼
          </button>
          <button
            onClick={() => move('right')}
            className="w-14 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs"
          >
            ▶
          </button>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   4. MINI-GAME: Reflex Trigger (سرعة رد الفعل العصبي)
   ========================================================================= */
const ReflexTriggerGame: React.FC = () => {
  const [state, setState] = useState<'idle' | 'waiting' | 'ready' | 'result'>('idle');
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const startTest = () => {
    playSound('click');
    setState('waiting');
    setReactionTime(null);

    const delay = Math.floor(Math.random() * 2500) + 1500;
    timerRef.current = setTimeout(() => {
      setState('ready');
      startTimeRef.current = Date.now();
    }, delay);
  };

  const handleClick = () => {
    if (state === 'idle' || state === 'result') {
      startTest();
    } else if (state === 'waiting') {
      // Clicked too early
      if (timerRef.current) clearTimeout(timerRef.current);
      setState('result');
      setReactionTime(-1); // penalty
      playSound('alert');
    } else if (state === 'ready') {
      const elapsed = Date.now() - startTimeRef.current;
      setReactionTime(elapsed);
      setState('result');
      playSound('success');
    }
  };

  return (
    <div className="max-w-md mx-auto text-center py-4 space-y-4">
      <button
        onClick={handleClick}
        className={`w-full h-48 rounded-3xl flex flex-col items-center justify-center p-6 text-white transition-all shadow-2xl ${
          state === 'waiting'
            ? 'bg-red-700 cursor-pointer animate-pulse'
            : state === 'ready'
            ? 'bg-emerald-600 cursor-pointer shadow-emerald-500/50 scale-102'
            : 'bg-neutral-900 border border-neutral-700 hover:border-amber-500'
        }`}
      >
        {state === 'idle' && (
          <div>
            <Zap className="w-10 h-10 text-amber-400 mx-auto mb-2" />
            <span className="text-base font-bold block">اضغط هنا لبدء اختبار رد الفعل</span>
            <span className="text-xs text-neutral-400">انتظر تحول الشاشة للون الأخضر ثم اضغط فوراً!</span>
          </div>
        )}

        {state === 'waiting' && (
          <div>
            <span className="text-xl font-black block">انتظر... لا تضغط بعد!</span>
            <span className="text-xs text-red-200 mt-1 block">ركز عينك جيداً</span>
          </div>
        )}

        {state === 'ready' && (
          <div>
            <span className="text-3xl font-black block">اضغط الآن بسرعة!! ⚡</span>
          </div>
        )}

        {state === 'result' && (
          <div>
            {reactionTime === -1 ? (
              <div>
                <span className="text-lg font-bold text-amber-300 block">ضغطت مبكراً جداً! 😅</span>
                <span className="text-xs text-neutral-300 mt-1 block">اضغط للمحاولة مرة ثانية</span>
              </div>
            ) : (
              <div>
                <span className="text-xs text-neutral-300 block">سرعة استجابتك:</span>
                <span className="text-4xl font-mono font-black text-emerald-300 block my-1">
                  {reactionTime} مللي ثانية
                </span>
                <span className="text-xs text-amber-400">
                  {reactionTime! < 250 ? 'ما شاء الله! تركيز خارق وسريع جداً 👑' : 'جيد جداً! استجابة نشطة ومستيقظة 👍'}
                </span>
                <span className="text-[11px] text-neutral-400 block mt-2">اضغط لإعادة الاختبار</span>
              </div>
            )}
          </div>
        )}
      </button>
    </div>
  );
};
