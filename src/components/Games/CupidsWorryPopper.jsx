import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Sparkles, RotateCcw, Heart } from 'lucide-react';
import { playArrowShootSound, playWorryPopSound, playPopSound } from '../../utils/audio';

const INITIAL_WORRIES = [
  { id: 1, text: 'Stress', x: 20, y: 30, vx: 0.3 },
  { id: 2, text: 'Overthinking', x: 55, y: 55, vx: -0.4 },
  { id: 3, text: 'Self-Doubt', x: 15, y: 90, vx: 0.35 },
  { id: 4, text: 'Anxiety', x: 60, y: 115, vx: -0.3 },
  { id: 5, text: 'Exhaustion', x: 30, y: 150, vx: 0.25 },
  { id: 6, text: 'Pressure', x: 70, y: 80, vx: -0.35 },
];

const POSITIVE_MESSAGES = [
  "I've got you 💕",
  "You are safe here ✨",
  "Breathe easy, my love 🌸",
  "You are more than enough 🧸",
  "I believe in you always 💖",
  "Rest your weary mind 🌙",
  "Never alone in this world 💫"
];

export default function CupidsWorryPopper() {
  const containerRef = useRef(null);
  const [worries, setWorries] = useState(INITIAL_WORRIES);
  const [activeMessage, setActiveMessage] = useState(null);
  const [arrow, setArrow] = useState(null);
  const [aim, setAim] = useState({ isAiming: false, startX: 0, startY: 0, currX: 0, currY: 0 });
  const animFrameRef = useRef(null);

  // Floating gentle worry bubbles physics loop
  useEffect(() => {
    let last = performance.now();
    const loop = (t) => {
      const dt = Math.min(0.04, (t - last) / 1000);
      last = t;

      setWorries((prev) =>
        prev.map((w) => {
          let nx = w.x + w.vx * 15 * dt;
          let nvx = w.vx;
          if (nx < 8 || nx > 72) {
            nvx = -nvx;
          }
          return { ...w, x: nx, vx: nvx };
        })
      );

      // Arrow physics update
      setArrow((curr) => {
        if (!curr) return null;
        const nextX = curr.x + curr.vx * dt;
        const nextY = curr.y + curr.vy * dt;

        // Container bounds check
        if (nextY < -20 || nextX < -20 || nextX > 400) {
          return null; // off-screen
        }

        return { ...curr, x: nextX, y: nextY };
      });

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Collision detection between arrow and worries
  useEffect(() => {
    if (!arrow || !containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    worries.forEach((worry) => {
      const worryPxX = (worry.x / 100) * width + 40;
      const worryPxY = worry.y + 25;

      const dist = Math.hypot(arrow.x - worryPxX, arrow.y - worryPxY);

      if (dist < 42) {
        // Popped!
        playWorryPopSound();
        confetti({
          particleCount: 50,
          spread: 60,
          origin: {
            x: worryPxX / width,
            y: worryPxY / height,
          },
          colors: ['#ff85a1', '#ffd1dc', '#ec4899', '#ffffff'],
        });

        // Trigger positive message
        const msg = POSITIVE_MESSAGES[Math.floor(Math.random() * POSITIVE_MESSAGES.length)];
        setActiveMessage({ text: msg, x: worryPxX, y: worryPxY });
        setTimeout(() => setActiveMessage(null), 1800);

        // Remove popped worry
        setWorries((prev) => prev.filter((item) => item.id !== worry.id));
        setArrow(null);
      }
    });
  }, [arrow, worries]);

  const handlePointerDown = (e) => {
    if (arrow) return;
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setAim({
      isAiming: true,
      startX: x,
      startY: y,
      currX: x,
      currY: y,
    });
  };

  const handlePointerMove = (e) => {
    if (!aim.isAiming) return;
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setAim((prev) => ({ ...prev, currX: x, currY: y }));
  };

  const handlePointerUp = () => {
    if (!aim.isAiming) return;
    const container = containerRef.current;
    if (!container) return;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const bowX = width / 2;
    const bowY = height - 50;

    // Calculate pull vector (pull down & release up)
    const dx = bowX - aim.currX;
    const dy = bowY - aim.currY;

    // Shoot arrow
    playArrowShootSound();

    const speed = 700;
    const angle = Math.atan2(dy, dx);

    setArrow({
      x: bowX,
      y: bowY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      rotation: (angle * 180) / Math.PI,
    });

    setAim({ isAiming: false, startX: 0, startY: 0, currX: 0, currY: 0 });
  };

  const handleResetWorries = () => {
    playPopSound();
    setWorries(INITIAL_WORRIES);
  };

  return (
    <div className="w-full flex flex-col items-center select-none">
      {/* Header Bar */}
      <div className="w-full flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-1.5 text-xs text-pink-200/80 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-[#ff85a1]" />
          <span>No scores • No pressure • Just popping worries</span>
        </div>

        <button
          onClick={handleResetWorries}
          className="min-h-[44px] px-3.5 py-1.5 rounded-full bg-pink-500/15 border border-pink-400/30 text-xs font-semibold text-pink-200 hover:text-white flex items-center gap-1.5 cursor-pointer active:scale-95 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Worries</span>
        </button>
      </div>

      {/* Game Canvas / Arena */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{ touchAction: 'none' }}
        className="relative w-full h-[400px] sm:h-[450px] rounded-3xl overflow-hidden glass-card border border-pink-400/30 shadow-[0_4px_30px_rgba(255,133,161,0.25)] bg-gradient-to-b from-black via-[#0d0912] to-black cursor-crosshair"
      >
        {/* Floating Gray "Worry" Bubbles */}
        {worries.map((worry) => (
          <div
            key={worry.id}
            style={{ left: `${worry.x}%`, top: `${worry.y}px` }}
            className="absolute px-3 py-1.5 rounded-full bg-neutral-800/80 border border-neutral-600/50 shadow-md backdrop-blur-sm text-xs font-medium text-neutral-300 transition-all pointer-events-none select-none flex items-center gap-1"
          >
            <span className="text-[10px] text-neutral-400">💭</span>
            <span>{worry.text}</span>
          </div>
        ))}

        {/* Positive Message Flash upon pop */}
        <AnimatePresence>
          {activeMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.6, y: 10 }}
              animate={{ opacity: 1, scale: 1.15, y: -15 }}
              exit={{ opacity: 0, scale: 0.8 }}
              style={{ left: `${activeMessage.x - 60}px`, top: `${activeMessage.y - 30}px` }}
              className="absolute z-30 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-pink-500/90 to-rose-500/90 text-white font-bold text-xs shadow-[0_0_20px_rgba(255,133,161,0.8)] pointer-events-none"
            >
              {activeMessage.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Flying Heart Arrow */}
        {arrow && (
          <div
            style={{
              left: `${arrow.x}px`,
              top: `${arrow.y}px`,
              transform: `translate(-50%, -50%) rotate(${arrow.rotation + 90}deg)`,
            }}
            className="absolute z-20 pointer-events-none text-2xl filter drop-shadow-[0_0_8px_rgba(255,133,161,0.9)]"
          >
            💘
          </div>
        )}

        {/* Aiming Guide Line */}
        {aim.isAiming && containerRef.current && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
            <line
              x1={containerRef.current.clientWidth / 2}
              y1={containerRef.current.clientHeight - 50}
              x2={containerRef.current.clientWidth / 2 + (containerRef.current.clientWidth / 2 - aim.currX)}
              y2={containerRef.current.clientHeight - 50 + (containerRef.current.clientHeight - 50 - aim.currY)}
              stroke="rgba(255, 133, 161, 0.7)"
              strokeWidth="2.5"
              strokeDasharray="5,5"
            />
          </svg>
        )}

        {/* Pink Bow at bottom center */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none">
          <div className="w-16 h-16 rounded-full bg-pink-500/20 border-2 border-pink-400/50 shadow-[0_0_20px_rgba(255,133,161,0.5)] flex items-center justify-center text-3xl">
            🏹
          </div>
          <span className="text-[10px] text-pink-200/80 font-medium mt-1">
            {aim.isAiming ? 'Release to shoot heart!' : 'Drag down to aim bow'}
          </span>
        </div>

        {/* All worries popped celebration message */}
        {worries.length === 0 && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-30">
            <span className="text-4xl mb-2">🌸</span>
            <h4 className="text-xl font-bold text-white mb-1">All Worries Melted Away</h4>
            <p className="text-xs text-pink-200/80 max-w-xs mb-4">
              Your mind is light, serene, and embraced with endless warmth.
            </p>
            <button
              onClick={handleResetWorries}
              className="min-h-[48px] px-6 py-2.5 rounded-full bg-gradient-to-r from-[#ff85a1] to-[#f472b6] text-black font-bold text-sm shadow-[0_0_25px_rgba(255,133,161,0.5)] cursor-pointer active:scale-95 transition"
            >
              Pop More Worries ✨
            </button>
          </div>
        )}
      </div>

      <p className="text-xs text-pink-300/50 mt-3 text-center">
        Aim your bow at each worry — replace every anxious thought with gentle comfort 💖
      </p>
    </div>
  );
}
