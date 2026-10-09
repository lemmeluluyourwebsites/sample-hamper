import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Sparkles, RotateCcw } from 'lucide-react';
import { playArrowShootSound, playWorryPopSound, playPopSound } from '../../utils/audio';

const INITIAL_WORRIES = [
  { id: 1, text: 'Stress', x: 18, y: 35, vx: 18 },
  { id: 2, text: 'Overthinking', x: 55, y: 65, vx: -22 },
  { id: 3, text: 'Self-Doubt', x: 22, y: 105, vx: 20 },
  { id: 4, text: 'Anxiety', x: 62, y: 135, vx: -18 },
  { id: 5, text: 'Exhaustion', x: 30, y: 170, vx: 16 },
  { id: 6, text: 'Pressure', x: 68, y: 95, vx: -20 },
];

const POSITIVE_MESSAGES = [
  "I've got you 💕",
  "You are safe here ✨",
  "Breathe easy, my love 🌸",
  "You are more than enough 🧸",
  "I believe in you always 💖",
  "Rest your weary mind 🌙",
  "Never alone in this world 💫",
];

export default function CupidsWorryPopper() {
  const containerRef = useRef(null);
  const bowRef = useRef(null);
  const [worries, setWorries] = useState(INITIAL_WORRIES);
  const [activeMessage, setActiveMessage] = useState(null);
  const [arrows, setArrows] = useState([]);
  const [isPullingBow, setIsPullingBow] = useState(false);
  const [pullOffset, setPullOffset] = useState({ x: 0, y: 0, dist: 0 });

  const animFrameRef = useRef(null);
  const worriesRef = useRef(INITIAL_WORRIES);
  const pullStartRef = useRef(null);

  worriesRef.current = worries;

  // Worries gentle floating drift
  useEffect(() => {
    let last = performance.now();
    const loop = (t) => {
      const dt = Math.min(0.04, (t - last) / 1000);
      last = t;

      setWorries((prev) =>
        prev.map((w) => {
          let nx = w.x + w.vx * dt;
          let nvx = w.vx;
          if (nx < 8) {
            nx = 8;
            nvx = Math.abs(nvx);
          } else if (nx > 68) {
            nx = 68;
            nvx = -Math.abs(nvx);
          }
          return { ...w, x: nx, vx: nvx };
        })
      );

      // Flying arrows physics & collision
      setArrows((currentArrows) => {
        if (currentArrows.length === 0) return currentArrows;
        const container = containerRef.current;
        if (!container) return [];

        const width = container.clientWidth;
        const height = container.clientHeight;
        const active = [];

        currentArrows.forEach((arr) => {
          const nextX = arr.x + arr.vx * dt;
          const nextY = arr.y + arr.vy * dt;

          if (nextY < -30 || nextX < -30 || nextX > width + 30 || nextY > height + 30) {
            return;
          }

          let hitBubble = null;
          const currentWorries = worriesRef.current;

          for (let i = 0; i < currentWorries.length; i++) {
            const w = currentWorries[i];
            const pxX = (w.x / 100) * width + 48;
            const pxY = w.y + 18;

            const dist = Math.hypot(nextX - pxX, nextY - pxY);
            if (dist < 46) {
              hitBubble = { ...w, pxX, pxY };
              break;
            }
          }

          if (hitBubble) {
            playWorryPopSound();
            confetti({
              particleCount: 55,
              spread: 65,
              origin: {
                x: Math.max(0.1, Math.min(0.9, hitBubble.pxX / width)),
                y: Math.max(0.1, Math.min(0.9, hitBubble.pxY / height)),
              },
              colors: ['#ff85a1', '#ffd1dc', '#ec4899', '#ffffff'],
            });

            const msg = POSITIVE_MESSAGES[Math.floor(Math.random() * POSITIVE_MESSAGES.length)];
            setActiveMessage({ text: msg, x: hitBubble.pxX, y: hitBubble.pxY });
            setTimeout(() => setActiveMessage(null), 1800);

            setWorries((prev) => prev.filter((item) => item.id !== hitBubble.id));
          } else {
            active.push({ ...arr, x: nextX, y: nextY });
          }
        });

        return active;
      });

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // TOUCH/DRAG MUST ORIGINATE SPECIFICALLY ON THE BOW
  const handleBowPointerDown = (e) => {
    e.stopPropagation();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (err) {}

    pullStartRef.current = {
      x: e.clientX,
      y: e.clientY,
    };
    setIsPullingBow(true);
    setPullOffset({ x: 0, y: 0, dist: 0 });
  };

  const handleBowPointerMove = (e) => {
    if (!isPullingBow || !pullStartRef.current) return;
    const dx = e.clientX - pullStartRef.current.x;
    const dy = e.clientY - pullStartRef.current.y;
    const dist = Math.hypot(dx, dy);

    // Limit maximum pull distance to 80px
    const clampedDist = Math.min(80, dist);
    const angle = Math.atan2(dy, dx);

    setPullOffset({
      x: Math.cos(angle) * clampedDist,
      y: Math.sin(angle) * clampedDist,
      dist: clampedDist,
    });
  };

  const handleBowPointerUp = (e) => {
    if (!isPullingBow) return;
    setIsPullingBow(false);

    const container = containerRef.current;
    if (container && pullOffset.dist > 18) {
      const width = container.clientWidth;
      const height = container.clientHeight;
      const bowX = width / 2;
      const bowY = height - 55;

      // Invert pull direction: pulling down shoots UP!
      const shootAngle = Math.atan2(-pullOffset.y, -pullOffset.x);
      const speed = 520 + (pullOffset.dist / 80) * 320; // 520 - 840 px/s

      playArrowShootSound();

      setArrows((prev) => [
        ...prev,
        {
          id: Math.random(),
          x: bowX,
          y: bowY,
          vx: Math.cos(shootAngle) * speed,
          vy: Math.sin(shootAngle) * speed,
          rotation: (shootAngle * 180) / Math.PI,
        },
      ]);
    }

    pullStartRef.current = null;
    setPullOffset({ x: 0, y: 0, dist: 0 });
  };

  const handleResetWorries = () => {
    playPopSound();
    setWorries(INITIAL_WORRIES);
    setArrows([]);
  };

  const bowCenterX = containerRef.current ? containerRef.current.clientWidth / 2 : 175;
  const bowCenterY = containerRef.current ? containerRef.current.clientHeight - 55 : 345;

  return (
    <div className="w-full flex flex-col items-center select-none">
      {/* Header bar */}
      <div className="w-full flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-1.5 text-xs text-pink-200/80 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-[#ff85a1]" />
          <span>No scores, no pressure: pull bow and release to shoot</span>
        </div>

        <button
          onClick={handleResetWorries}
          className="min-h-[44px] px-3.5 py-1.5 rounded-full bg-pink-500/15 border border-pink-400/30 text-xs font-semibold text-pink-200 hover:text-white flex items-center gap-1.5 cursor-pointer active:scale-95 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Worries</span>
        </button>
      </div>

      {/* Game Canvas / Arena with touch-action: pan-y outside the bow */}
      <div
        ref={containerRef}
        style={{ touchAction: 'pan-y' }}
        className="relative w-full h-[400px] sm:h-[450px] rounded-3xl overflow-hidden glass-card border border-pink-400/30 shadow-[0_4px_30px_rgba(255,133,161,0.25)] bg-gradient-to-b from-black via-[#0d0912] to-black"
      >
        {/* Floating Gray "Worry" Bubbles */}
        {worries.map((worry) => (
          <div
            key={worry.id}
            style={{ left: `${worry.x}%`, top: `${worry.y}px` }}
            className="absolute px-3.5 py-2 rounded-full bg-neutral-800/85 border border-neutral-600/60 shadow-lg backdrop-blur-md text-xs font-medium text-neutral-200 select-none flex items-center gap-1.5 z-10 pointer-events-none"
          >
            <span className="text-xs">💭</span>
            <span>{worry.text}</span>
          </div>
        ))}

        {/* Positive Message Toast upon popping */}
        <AnimatePresence>
          {activeMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.6, y: 10 }}
              animate={{ opacity: 1, scale: 1.15, y: -20 }}
              exit={{ opacity: 0, scale: 0.8 }}
              style={{
                left: `${Math.max(10, activeMessage.x - 70)}px`,
                top: `${Math.max(10, activeMessage.y - 35)}px`,
              }}
              className="absolute z-30 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-xs shadow-[0_0_25px_rgba(255,133,161,0.9)] pointer-events-none"
            >
              {activeMessage.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Flying Heart Arrows */}
        {arrows.map((arr) => (
          <div
            key={arr.id}
            style={{
              left: `${arr.x}px`,
              top: `${arr.y}px`,
              transform: `translate(-50%, -50%) rotate(${arr.rotation + 90}deg)`,
            }}
            className="absolute z-20 pointer-events-none text-3xl filter drop-shadow-[0_0_12px_rgba(255,133,161,0.95)]"
          >
            💘
          </div>
        ))}

        {/* Dynamic Trajectory Guide Line when pulling bow */}
        {isPullingBow && containerRef.current && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
            {/* Draw pulled bowstring */}
            <path
              d={`M ${bowCenterX - 24} ${bowCenterY} Q ${bowCenterX + pullOffset.x} ${bowCenterY + pullOffset.y} ${bowCenterX + 24} ${bowCenterY}`}
              stroke="rgba(255, 133, 161, 0.9)"
              strokeWidth="2.5"
              fill="none"
            />
            {/* Aim trajectory line pointing in launch direction */}
            <line
              x1={bowCenterX}
              y1={bowCenterY}
              x2={bowCenterX - pullOffset.x * 4}
              y2={bowCenterY - pullOffset.y * 4}
              stroke="rgba(255, 182, 193, 0.75)"
              strokeWidth="2.5"
              strokeDasharray="6,6"
            />
          </svg>
        )}

        {/* Pink Bow at bottom center - USER MUST TOUCH AND DRAG DIRECTLY FROM THIS BOW */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex flex-col items-center z-20">
          <div
            ref={bowRef}
            onPointerDown={handleBowPointerDown}
            onPointerMove={handleBowPointerMove}
            onPointerUp={handleBowPointerUp}
            onPointerCancel={handleBowPointerUp}
            style={{
              touchAction: 'none',
              transform: isPullingBow ? `translate(${pullOffset.x * 0.3}px, ${pullOffset.y * 0.3}px)` : 'none',
            }}
            className={`w-18 h-18 rounded-full border-2 flex items-center justify-center text-3xl cursor-grab active:cursor-grabbing select-none transition-shadow ${
              isPullingBow
                ? 'bg-pink-500/40 border-white shadow-[0_0_35px_rgba(255,133,161,0.9)] scale-105'
                : 'bg-pink-500/20 border-pink-400/60 shadow-[0_0_20px_rgba(255,133,161,0.5)] hover:scale-105'
            }`}
          >
            {isPullingBow ? '🏹' : '🏹'}
          </div>
          <span className="text-[10px] text-pink-200/90 font-medium mt-1 select-none">
            {isPullingBow ? 'Release to shoot arrow!' : 'Touch bow and pull back'}
          </span>
        </div>

        {/* All worries popped victory */}
        {worries.length === 0 && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-30">
            <span className="text-4xl mb-2">🌸</span>
            <h4 className="text-xl font-bold text-white mb-1">All Worries Melted Away</h4>
            <p className="text-xs text-pink-200/80 max-w-xs mb-4">
              Your mind is light, serene, and embraced with endless love.
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
        Touch the bow and drag backward to aim: release to pop worries into sweet affirmations 💖
      </p>
    </div>
  );
}
