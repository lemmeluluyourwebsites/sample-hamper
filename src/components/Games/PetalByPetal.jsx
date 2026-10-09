import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Sparkles, Camera, RotateCcw, Heart } from 'lucide-react';
import { playPetalPluckSound, playBonusChime, playPopSound } from '../../utils/audio';

const TOTAL_PETALS = 16; // Realistic full botanical flower / dandelion bloom

export default function PetalByPetal() {
  const [petals, setPetals] = useState(() =>
    Array.from({ length: TOTAL_PETALS }, (_, index) => ({
      id: index,
      angle: (index * 360) / TOTAL_PETALS,
      isDetached: false,
      driftX: 0,
      driftY: 0,
      text: null,
    }))
  );

  const [lastPluckedText, setLastPluckedText] = useState(null);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [winnerText, setWinnerText] = useState('');
  const dragStartPos = useRef({});

  const handlePointerDown = (index, e) => {
    dragStartPos.current[index] = {
      x: e.clientX,
      y: e.clientY,
      time: Date.now(),
    };
  };

  // TRUE OUTWARD SWIPE DETECTION: Petal ONLY detaches when swiped outward!
  const handlePointerMove = (index, e) => {
    const start = dragStartPos.current[index];
    if (!start || petals[index].isDetached) return;

    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    const distance = Math.hypot(dx, dy);

    // Only detaches when dragged/swiped outward past 28px threshold
    if (distance > 28) {
      delete dragStartPos.current[index];
      detachPetal(index, dx, dy);
    }
  };

  const handlePointerUp = (index) => {
    delete dragStartPos.current[index];
  };

  const detachPetal = (index, swipeDx, swipeDy) => {
    if (petals[index].isDetached) return;

    playPetalPluckSound();

    // Randomized text: "I love him more" vs "He loves me more"
    const randomText = Math.random() < 0.6 ? 'I love him more' : 'He loves me more';
    setLastPluckedText(randomText);

    const remainingCount = petals.filter((p, i) => !p.isDetached && i !== index).length;

    setPetals((prev) => {
      const next = [...prev];
      next[index] = {
        ...next[index],
        isDetached: true,
        driftX: swipeDx * 3,
        driftY: swipeDy * 3,
        text: randomText,
      };
      return next;
    });

    // When final petal is plucked
    if (remainingCount === 0) {
      setWinnerText(randomText);
      playBonusChime();
      confetti({
        particleCount: 110,
        spread: 95,
        origin: { y: 0.55 },
        colors: ['#ff85a1', '#ffd1dc', '#ffffff', '#ec4899', '#f472b6'],
      });

      setTimeout(() => {
        setShowWinnerModal(true);
      }, 700);
    }
  };

  const handleResetFlower = () => {
    playPopSound();
    setPetals(
      Array.from({ length: TOTAL_PETALS }, (_, index) => ({
        id: index,
        angle: (index * 360) / TOTAL_PETALS,
        isDetached: false,
        driftX: 0,
        driftY: 0,
        text: null,
      }))
    );
    setLastPluckedText(null);
    setShowWinnerModal(false);
    setWinnerText('');
  };

  const detachedCount = petals.filter((p) => p.isDetached).length;

  return (
    <div className="w-full flex flex-col items-center select-none">
      {/* Header bar */}
      <div className="w-full flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-1.5 text-xs text-pink-200/80 font-medium">
          <Heart className="w-3.5 h-3.5 text-[#ff85a1] fill-[#ff85a1]" />
          <span>
            {TOTAL_PETALS - detachedCount} petals left
            {lastPluckedText && (
              <span className="ml-1.5 text-white font-semibold">({lastPluckedText})</span>
            )}
          </span>
        </div>

        <button
          onClick={handleResetFlower}
          className="min-h-[44px] px-3.5 py-1.5 rounded-full bg-pink-500/15 border border-pink-400/30 text-xs font-semibold text-pink-200 hover:text-white flex items-center gap-1.5 cursor-pointer active:scale-95 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Regrow Bloom</span>
        </button>
      </div>

      {/* Realistic Flower Arena */}
      <div className="relative w-full aspect-square max-w-[360px] rounded-3xl overflow-hidden glass-card border border-pink-400/30 shadow-[0_4px_30px_rgba(255,133,161,0.25)] flex items-center justify-center bg-gradient-to-b from-black via-[#0d0711] to-black">
        {/* Soft floral halo */}
        <div className="absolute w-56 h-56 bg-pink-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Center of the Flower: Natural Realistic Botanical Seed Core (NO photo in between) */}
        <div className="relative z-10 w-24 h-24 rounded-full border-2 border-amber-300/40 shadow-[inset_0_0_15px_rgba(0,0,0,0.8),0_0_20px_rgba(245,158,11,0.25)] flex items-center justify-center bg-gradient-to-tr from-amber-900 via-amber-700 to-amber-600 overflow-hidden">
          {/* Concentric spiral botanical seed textures */}
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#fde68a_1px,transparent_1px)] [background-size:6px_6px]" />
          <div className="w-16 h-16 rounded-full border border-amber-400/30 bg-amber-950/60 flex items-center justify-center shadow-inner">
            <span className="text-xl select-none">✨</span>
          </div>
        </div>

        {/* 16 Realistic Tapered Petals Layered Around Center */}
        {petals.map((petal, index) => {
          const rad = (petal.angle * Math.PI) / 180;
          const distance = 82;
          const x = Math.cos(rad) * distance;
          const y = Math.sin(rad) * distance;

          return (
            <AnimatePresence key={petal.id}>
              {!petal.isDetached ? (
                <div
                  onPointerDown={(e) => handlePointerDown(index, e)}
                  onPointerMove={(e) => handlePointerMove(index, e)}
                  onPointerUp={() => handlePointerUp(index)}
                  onPointerLeave={() => handlePointerUp(index)}
                  style={{
                    position: 'absolute',
                    left: `calc(50% + ${x}px - 14px)`,
                    top: `calc(50% + ${y}px - 44px)`,
                    transform: `rotate(${petal.angle + 90}deg)`,
                    touchAction: 'none',
                  }}
                  className="z-20 cursor-grab active:cursor-grabbing select-none"
                >
                  {/* Realistic tapered botanical petal shape via SVG with delicate vein line */}
                  <svg width="28" height="88" viewBox="0 0 28 88" className="filter drop-shadow-[0_2px_6px_rgba(255,133,161,0.4)]">
                    <defs>
                      <linearGradient id={`petalGrad-${index}`} x1="0%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" stopColor="#ffb6c1" stopOpacity="0.9" />
                        <stop offset="50%" stopColor="#f472b6" stopOpacity="0.95" />
                        <stop offset="100%" stopColor="#ff85a1" stopOpacity="1" />
                      </linearGradient>
                    </defs>
                    {/* Realistic botanical curved teardrop petal */}
                    <path
                      d="M 14,0 C 26,20 28,60 14,88 C 0,60 2,20 14,0 Z"
                      fill={`url(#petalGrad-${index})`}
                      stroke="rgba(255,255,255,0.7)"
                      strokeWidth="0.8"
                    />
                    {/* Delicate center vein */}
                    <line x1="14" y1="15" x2="14" y2="75" stroke="rgba(255,255,255,0.45)" strokeWidth="0.75" />
                  </svg>
                </div>
              ) : (
                /* Falling detached petal fluttering away along swipe trajectory */
                <motion.div
                  key={`detached-${petal.id}`}
                  initial={{
                    x: x,
                    y: y,
                    scale: 1,
                    opacity: 1,
                    rotate: petal.angle + 90,
                  }}
                  animate={{
                    x: x + petal.driftX,
                    y: y + petal.driftY + 120,
                    scale: 0.5,
                    opacity: 0,
                    rotate: petal.angle + 90 + 160,
                  }}
                  transition={{ duration: 1.4, ease: 'easeOut' }}
                  className="absolute z-10 pointer-events-none"
                >
                  <svg width="24" height="74" viewBox="0 0 28 88">
                    <path
                      d="M 14,0 C 26,20 28,60 14,88 C 0,60 2,20 14,0 Z"
                      fill="#f472b6"
                      opacity="0.8"
                    />
                  </svg>
                </motion.div>
              )}
            </AnimatePresence>
          );
        })}
      </div>

      <p className="text-xs text-pink-300/50 mt-3 text-center">
        Swipe each petal outward to blow it into the breeze — find out who loves who more 💕
      </p>

      {/* Finishing Victory Moment: Dedicated Couple Keepsake & Mandatory Boyfriend Screenshot Modal */}
      <AnimatePresence>
        {showWinnerModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 30 }}
              transition={{ type: 'spring', damping: 22, stiffness: 280 }}
              className="relative w-full max-w-sm glass-panel rounded-3xl p-6 border-2 border-pink-400 shadow-[0_0_50px_rgba(255,133,161,0.5)] text-center overflow-hidden"
            >
              {/* Couple Keepsake Polaroid Frame feature */}
              <div className="w-full max-w-[240px] mx-auto p-2.5 rounded-2xl bg-white shadow-2xl mb-4 transform -rotate-1 border border-pink-200">
                <div className="w-full h-44 rounded-xl overflow-hidden bg-neutral-900 border border-neutral-200">
                  <img
                    src="/assets/photo-2.jpg"
                    alt="Couple special memory"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/assets/photo2.jpg';
                    }}
                  />
                </div>
                <div className="mt-2 text-center text-xs font-serif font-bold text-neutral-800 tracking-wide">
                  Our Forever Bloom 🌸
                </div>
              </div>

              {/* Verified Verdict & Mandatory Screenshot Prompt */}
              {winnerText === 'I love him more' ? (
                <>
                  <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-pink-500/20 border border-pink-400/40 text-xs font-bold text-[#ff85a1] mb-2">
                    <Sparkles className="w-3.5 h-3.5 fill-[#ff85a1]" />
                    <span>Official Verified Verdict 🏆</span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">
                    You Love Him More! 💖
                  </h3>

                  {/* MANDATORY PROMPT TEXT REQUIREMENT */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-900/50 to-rose-900/50 border border-pink-400/50 my-3 text-sm font-semibold text-pink-100 shadow-[0_0_20px_rgba(255,133,161,0.3)]">
                    "Screenshot this and send this to your boyfriend to let him know that you love him more! 📸"
                  </div>
                </>
              ) : (
                <>
                  <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-pink-500/20 border border-pink-400/40 text-xs font-bold text-[#ff85a1] mb-2">
                    <Heart className="w-3.5 h-3.5 fill-[#ff85a1]" />
                    <span>He Loves You More! 🧸</span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">
                    He Loves You Endlessly! 💕
                  </h3>

                  <p className="text-xs text-pink-200/80 mb-4 px-2">
                    The petals have spoken — his heart overflows with infinite warmth and love for you every day.
                  </p>
                </>
              )}

              <div className="flex gap-2.5 mt-4">
                <button
                  onClick={handleResetFlower}
                  className="flex-1 min-h-[48px] rounded-2xl bg-pink-500/20 border border-pink-400/40 text-xs font-semibold text-white hover:bg-pink-500/30 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Bloom Again</span>
                </button>

                <button
                  onClick={() => {
                    playPopSound();
                    setShowWinnerModal(false);
                  }}
                  className="flex-1 min-h-[48px] rounded-2xl bg-gradient-to-r from-[#ff85a1] to-[#f472b6] text-black font-bold text-xs shadow-[0_0_20px_rgba(255,133,161,0.4)] flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Got it! 📸</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
