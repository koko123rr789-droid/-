import React, { useEffect, useRef } from 'react';
import { BackgroundSetting } from '../types';

interface Props {
  settings: BackgroundSetting;
}

export const DynamicBackground: React.FC<Props> = ({ settings }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Canvas particle engine for dynamic video-like atmospheric effects (dust motes, golden sparkles, sunbeam particles)
  useEffect(() => {
    if (!settings.enableParticles) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle pool
    const particleCount = 45;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.5 + 0.8,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: -Math.random() * 0.6 - 0.2, // upward floating motes
      opacity: Math.random() * 0.7 + 0.2,
      pulse: Math.random() * 0.05,
      hue: Math.random() > 0.4 ? 45 : 35, // golden amber sparks
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.opacity += Math.sin(Date.now() * 0.002 + p.x) * 0.005;

        // Wrap around
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 95%, 65%, ${Math.max(0.1, Math.min(0.9, p.opacity))})`;
        ctx.shadowColor = 'rgba(250, 204, 21, 0.7)';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.restore();
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [settings.enableParticles]);

  return (
    <div id="dynamic-bg-container" className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Background layer according to mode */}
      {settings.mode === 'thanaweya_poster' && (
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <img
            id="thanaweya-main-bg"
            src="/assets/thanaweya_bg.jpg"
            alt="خلفية الثانوية العامة - بابا المجال"
            className="w-full h-full object-cover object-center transform scale-105 animate-float-slow transition-transform duration-1000 filter brightness-95 contrast-105"
          />
          {/* Subtle animated light sweep */}
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-transparent to-yellow-400/15 animate-pulse-glow" />
        </div>
      )}

      {settings.mode === 'sunrise_motion' && (
        <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-amber-950 via-slate-900 to-black">
          {/* Animated SVG sunrise glow */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120vw] h-[70vh] bg-gradient-to-t from-amber-500/30 via-orange-500/15 to-transparent rounded-t-full filter blur-3xl animate-pulse-glow" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-72 h-72 bg-yellow-400/20 rounded-full filter blur-2xl animate-sun-ray" />
        </div>
      )}

      {settings.mode === 'lofi_study' && (
        <div className="absolute inset-0 w-full h-full bg-slate-950">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/60 via-purple-950/40 to-neutral-950" />
          <div className="absolute top-10 right-10 w-96 h-96 bg-amber-500/10 rounded-full filter blur-3xl animate-pulse-glow" />
        </div>
      )}

      {settings.mode === 'deep_space' && (
        <div className="absolute inset-0 w-full h-full bg-neutral-950">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/30 via-slate-950 to-black" />
          <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-cyan-500/10 rounded-full filter blur-3xl animate-pulse-glow" />
        </div>
      )}

      {/* Sunbeam Light Rays Overlay */}
      {settings.enableRays && (
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-32 h-[120vh] bg-gradient-to-b from-amber-200/20 via-yellow-400/10 to-transparent rotate-12 filter blur-xl animate-sun-ray" />
          <div className="absolute top-0 left-1/3 w-48 h-[120vh] bg-gradient-to-b from-yellow-300/15 via-amber-400/5 to-transparent -rotate-6 filter blur-2xl animate-sun-ray" />
        </div>
      )}

      {/* Dynamic Floating Particles Canvas */}
      {settings.enableParticles && (
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-80" />
      )}

      {/* Dark tint Overlay based on user preference to ensure UI legibility */}
      <div
        id="bg-darkness-overlay"
        className="absolute inset-0 transition-opacity duration-300 pointer-events-none"
        style={{
          backgroundColor: `rgba(9, 13, 22, ${settings.darknessOverlay / 100})`,
          backdropFilter: settings.darknessOverlay > 50 ? 'blur(1px)' : 'none',
        }}
      />
    </div>
  );
};
