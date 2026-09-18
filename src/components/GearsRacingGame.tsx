import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Zap, ExternalLink, Smartphone, Trophy, Gauge } from 'lucide-react';
import { playSound } from '../utils/audioSynth';

export const GearsRacingGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gear, setGear] = useState<number>(1);
  const [rpm, setRpm] = useState<number>(1000);
  const [speed, setSpeed] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [nitroActive, setNitroActive] = useState(false);

  // Game loop state in ref to avoid lag
  const stateRef = useRef({
    playerX: 150,
    playerY: 310,
    speed: 0,
    gear: 1,
    rpm: 1000,
    nitro: 100,
    isAccelerating: false,
    roadOffset: 0,
    obstacles: [] as Array<{ x: number; y: number; speed: number; color: string }>,
    score: 0,
    gameOver: false,
  });

  const startGame = () => {
    playSound('success');
    setIsPlaying(true);
    setIsGameOver(false);
    setScore(0);
    setGear(1);
    setSpeed(0);
    setRpm(1000);

    stateRef.current = {
      playerX: 150,
      playerY: 310,
      speed: 0,
      gear: 1,
      rpm: 1000,
      nitro: 100,
      isAccelerating: false,
      roadOffset: 0,
      obstacles: [
        { x: 100, y: -50, speed: 2, color: '#ef4444' },
        { x: 200, y: -250, speed: 2.5, color: '#3b82f6' },
      ],
      score: 0,
      gameOver: false,
    };
  };

  const shiftUp = () => {
    playSound('click');
    setGear((prev) => {
      const next = Math.min(5, prev + 1);
      stateRef.current.gear = next;
      stateRef.current.rpm = Math.max(1500, stateRef.current.rpm - 2500);
      return next;
    });
  };

  const shiftDown = () => {
    playSound('click');
    setGear((prev) => {
      const next = Math.max(1, prev - 1);
      stateRef.current.gear = next;
      stateRef.current.rpm = Math.min(7500, stateRef.current.rpm + 2000);
      return next;
    });
  };

  const activateNitro = () => {
    if (stateRef.current.nitro > 20) {
      playSound('complete');
      setNitroActive(true);
      stateRef.current.nitro -= 25;
      setTimeout(() => setNitroActive(false), 2000);
    }
  };

  // Keyboard navigation: Arrow keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying || stateRef.current.gameOver) return;
      if (e.key === 'ArrowLeft') {
        stateRef.current.playerX = Math.max(60, stateRef.current.playerX - 25);
      } else if (e.key === 'ArrowRight') {
        stateRef.current.playerX = Math.min(240, stateRef.current.playerX + 25);
      } else if (e.key === 'ArrowUp' || e.key === ' ') {
        stateRef.current.isAccelerating = true;
      } else if (e.key === 'Shift') {
        shiftUp();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === ' ') {
        stateRef.current.isAccelerating = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isPlaying]);

  // Main Canvas Render Loop
  useEffect(() => {
    if (!isPlaying) return;
    let animId: number;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const loop = () => {
      const s = stateRef.current;
      if (s.gameOver) {
        setIsGameOver(true);
        setIsPlaying(false);
        playSound('alert');
        return;
      }

      // Physics update
      const maxSpeedForGear = s.gear * 40;
      if (s.isAccelerating) {
        s.rpm = Math.min(8000, s.rpm + 55);
        s.speed = Math.min(maxSpeedForGear + (nitroActive ? 40 : 0), s.speed + 1.2);
      } else {
        s.rpm = Math.max(900, s.rpm - 35);
        s.speed = Math.max(0, s.speed - 0.6);
      }

      setSpeed(Math.round(s.speed));
      setRpm(Math.round(s.rpm));
      s.score += Math.round(s.speed * 0.05);
      setScore(s.score);

      // Move road
      s.roadOffset = (s.roadOffset + s.speed * 0.2) % 40;

      // Move obstacles
      s.obstacles.forEach((obs) => {
        obs.y += (s.speed * 0.15) - obs.speed;
        if (obs.y > 420) {
          obs.y = -60 - Math.random() * 150;
          obs.x = 60 + Math.random() * 180;
        }

        // Collision check
        const distX = Math.abs(obs.x - s.playerX);
        const distY = Math.abs(obs.y - s.playerY);
        if (distX < 26 && distY < 46) {
          s.gameOver = true;
        }
      });

      // Clear & Draw
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Road background
      ctx.fillStyle = '#171717';
      ctx.fillRect(40, 0, 220, canvas.height);

      // Road Curbs
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(36, 0, 4, canvas.height);
      ctx.fillRect(260, 0, 4, canvas.height);

      // Lane dividers
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 3;
      ctx.setLineDash([20, 20]);
      ctx.lineDashOffset = -s.roadOffset;

      ctx.beginPath();
      ctx.moveTo(113, 0);
      ctx.lineTo(113, canvas.height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(187, 0);
      ctx.lineTo(187, canvas.height);
      ctx.stroke();

      ctx.setLineDash([]);

      // Draw Obstacles (Traffic Cars)
      s.obstacles.forEach((obs) => {
        ctx.fillStyle = obs.color;
        ctx.beginPath();
        ctx.roundRect(obs.x - 14, obs.y - 24, 28, 48, 6);
        ctx.fill();

        // Windshield
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(obs.x - 10, obs.y - 10, 20, 10);
      });

      // Draw Player Racing Car
      ctx.fillStyle = nitroActive ? '#38bdf8' : '#eab308';
      ctx.beginPath();
      ctx.roundRect(s.playerX - 15, s.playerY - 25, 30, 50, 7);
      ctx.fill();

      // Windshield & Spoiler
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(s.playerX - 11, s.playerY - 8, 22, 12);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(s.playerX - 13, s.playerY + 20, 26, 4);

      // Nitro exhaust flames
      if (nitroActive) {
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(s.playerX, s.playerY + 28, 7, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, nitroActive]);

  return (
    <div className="space-y-4 text-center max-w-xl mx-auto p-4 rounded-3xl bg-neutral-950/90 border border-amber-500/30">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
        <div className="text-right">
          <span className="text-[10px] font-mono text-amber-400 font-bold block">
            حزمة: com.y4444.gears.racing
          </span>
          <h4 className="text-base font-black text-white font-heading">
            سباق التروس والسرعة • Gears Racing
          </h4>
        </div>

        <div className="flex items-center gap-2">
          <div className="font-mono text-left">
            <span className="text-[10px] text-neutral-400 block">المسافة</span>
            <span className="text-xs sm:text-sm font-bold text-amber-400">{score} م</span>
          </div>
        </div>
      </div>

      {/* Main Canvas & Dash */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        
        {/* Race Track Canvas (7 cols) */}
        <div className="sm:col-span-7 flex justify-center">
          <div className="relative rounded-2xl overflow-hidden border-2 border-neutral-800 bg-neutral-900 shadow-2xl">
            <canvas
              ref={canvasRef}
              width={300}
              height={380}
              className="block bg-neutral-900"
            />

            {!isPlaying && !isGameOver && (
              <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center p-4">
                <Gauge className="w-12 h-12 text-amber-400 mb-2 animate-pulse" />
                <h5 className="font-black text-white text-base mb-1 font-heading">
                  جاهز للانطلاق والتسارع؟
                </h5>
                <p className="text-[11px] text-neutral-300 mb-4 max-w-[200px]">
                  بدّل التروس مع ارتفاع عداد الـ RPM وتجنب السيارات الأخرى!
                </p>
                <button
                  onClick={startGame}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-neutral-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/30 hover:scale-105 transition-all"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>انطلاق 🏁</span>
                </button>
              </div>
            )}

            {isGameOver && (
              <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-4">
                <Trophy className="w-10 h-10 text-amber-400 mb-2 animate-bounce" />
                <h5 className="font-black text-red-400 text-base mb-1">
                  حادث على الطريق!
                </h5>
                <p className="text-xs text-neutral-300 mb-3">
                  قطعت مسافة <b className="text-amber-400">{score}</b> متر بنجاح.
                </p>
                <button
                  onClick={startGame}
                  className="px-5 py-2 rounded-xl bg-amber-500 text-neutral-950 font-bold text-xs flex items-center gap-1 hover:bg-amber-400 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>سباق جديد 🔄</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Dashboard & Transmission Controls (5 cols) */}
        <div className="sm:col-span-5 space-y-3 bg-neutral-900/80 p-3.5 rounded-2xl border border-neutral-800 text-right">
          
          {/* Speed & Gear Gauge */}
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="p-2 rounded-xl bg-neutral-950 border border-neutral-800">
              <span className="text-[10px] text-neutral-400 block">السرعة</span>
              <span className="text-lg font-black font-mono text-emerald-400">{speed}</span>
              <span className="text-[9px] text-neutral-500 block">كم/س</span>
            </div>

            <div className="p-2 rounded-xl bg-neutral-950 border border-neutral-800">
              <span className="text-[10px] text-neutral-400 block">الترس (Gear)</span>
              <span className="text-lg font-black font-mono text-amber-400">G{gear}</span>
              <span className="text-[9px] text-neutral-500 block">من 5</span>
            </div>
          </div>

          {/* RPM Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-mono text-neutral-400">
              <span>RPM: {rpm}</span>
              <span>{rpm > 6500 ? '🔥 REDLINE' : 'دوران المحرك'}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
              <div
                className={`h-full transition-all duration-150 ${
                  rpm > 6500 ? 'bg-red-500' : rpm > 4500 ? 'bg-amber-400' : 'bg-emerald-400'
                }`}
                style={{ width: `${Math.min(100, (rpm / 8000) * 100)}%` }}
              />
            </div>
          </div>

          {/* Gear Shifter Buttons */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] text-neutral-300 font-bold block">ناقل السرعات:</span>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={shiftUp}
                disabled={gear >= 5 || !isPlaying}
                className="py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 text-xs font-bold text-white border border-neutral-700"
              >
                ▲ تعشيق أعلى (+1)
              </button>
              <button
                onClick={shiftDown}
                disabled={gear <= 1 || !isPlaying}
                className="py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 text-xs font-bold text-white border border-neutral-700"
              >
                ▼ ترس أقل (-1)
              </button>
            </div>
          </div>

          {/* Nitro & Gas Controls */}
          <div className="pt-2 flex items-center gap-2">
            <button
              onMouseDown={() => (stateRef.current.isAccelerating = true)}
              onMouseUp={() => (stateRef.current.isAccelerating = false)}
              onTouchStart={() => (stateRef.current.isAccelerating = true)}
              onTouchEnd={() => (stateRef.current.isAccelerating = false)}
              className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs shadow-md select-none transition-all active:scale-95"
            >
              دواسة البنزين ⛽
            </button>

            <button
              onClick={activateNitro}
              disabled={!isPlaying}
              className="px-3 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-neutral-950 font-black text-xs flex items-center gap-1 shadow-md transition-all active:scale-95"
              title="نيترو تسارع خارق"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>NITRO</span>
            </button>
          </div>

          {/* Mobile Steering Touch Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1 sm:hidden">
            <button
              onClick={() => (stateRef.current.playerX = Math.max(60, stateRef.current.playerX - 30))}
              className="py-2 rounded-lg bg-neutral-800 text-xs font-bold text-white border border-neutral-700"
            >
              ◀ يسار
            </button>
            <button
              onClick={() => (stateRef.current.playerX = Math.min(240, stateRef.current.playerX + 30))}
              className="py-2 rounded-lg bg-neutral-800 text-xs font-bold text-white border border-neutral-700"
            >
              يمين ▶
            </button>
          </div>

        </div>

      </div>

      {/* Google Play Store Link */}
      <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400">
        <span className="text-amber-400 font-bold">
          لعبة سباق تفاعلية مستوحاة من متجر Google Play
        </span>

        <a
          href="https://play.google.com/store/apps/details?id=com.y4444.gears.racing"
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
