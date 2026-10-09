import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Sparkles, Camera, RotateCcw, Heart, Share2 } from 'lucide-react';
import { playPetalPluckSound, playBonusChime, playPopSound } from '../../utils/audio';

const TOTAL_PETALS = 8;

export default function PetalByPetal() {
  const [petals, setPetals] = useState(() =>
    Array.from({ length: TOTAL_PETALS }, (_, index) => ({
      id: index,
      angle: (index * 360) / TOTAL_PETALS,
      isDetached: false,
      text: null,
    }))
  );

  const [lastPluckedText, setLastPluckedText] = useState(null);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [winnerText, setWinnerText] = useState('');

  const handleDetachPetal = (index) => {
    if (petals[index].isDetached) return;

    playPetalPluckSound();

    // Randomize text: "I love him more" or "He loves me more"
    // To ensure the fun winning condition is naturally achievable, 60% weight to "I love him more"
    const randomText = Math.random() < 0.6 ? 'I love him more' : 'He loves me more';
    setLastPluckedText(randomText);

    const remainingCount = petals.filter((p, i) => !p.isDetached && i !== index).length;

    setPetals((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], isDetached: true, text: randomText };
      return next;
    });

    // Check if this was the final petal pulled
    if (remainingCount === 0) {
      setWinnerText(randomText);
      playBonusChime();
      confetti({
        particleCount: 100,
        spread: 90,
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
        text: null,
      }))
    );
    setLastPluckedText(null);
    setShowWinnerModal(false);
    setWinnerText('');
  };

  const detachedCount = petals.filter((p) => p.isDetached).length;
  const isAllDetached = detachedCount === TOTAL_PETALS;

  return (
    <div className="w-full flex flex-col items-center select-none">
      {/* Header bar */}
      <div className="w-full flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-1.5 text-xs text-pink-200/80 font-medium">
          <Heart className="w-3.5 h-3.5 text-[#ff85a1] fill-[#ff85a1]" />
          <span>
            Petals: {TOTAL_PETALS - detachedCount} left
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
          <span>Regrow Flower</span>
        </button>
      </div>

      {/* Flower Arena */}
      <div className="relative w-full aspect-square max-w-[360px] rounded-3xl overflow-hidden glass-card border border-pink-400/30 shadow-[0_4px_30px_rgba(255,133,161,0.25)] flex items-center justify-center bg-gradient-to-b from-black via-[#0d0711] to-black">
        {/* Ambient flower glow */}
        <div className="absolute w-52 h-52 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Flower Center with Couple's Photo revealed behind */}
        <div className="relative z-10 w-28 h-28 rounded-full overflow-hidden border-2 border-pink-300/60 shadow-[0_0_25px_rgba(255,133,161,0.5)] flex items-center justify-center bg-black">
          <img
            src="/assets/photo-2.jpg"
            alt="Couple center"
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
            onError={(e) => {
              e.target.src = '/assets/photo2.jpg';
            }}
          />

          {!isAllDetached && (
            <div
              style={{ opacity: Math.max(0, 1 - detachedCount / TOTAL_PETALS) }}
              className="absolute inset-0 bg-gradient-to-tr from-amber-400 via-pink-400 to-rose-400 flex items-center justify-center text-xs font-bold text-black pointer-events-none transition-opacity duration-300"
            >
              <span>🌸</span>
            </div>
          )}
        </div>

        {/* Radial Petals surrounding center */}
        {petals.map((petal, index) => {
          const rad = (petal.angle * Math.PI) / 180;
          const distance = 86;
          const x = Math.cos(rad) * distance;
          const y = Math.sin(rad) * distance;

          return (
            <AnimatePresence key={petal.id}>
              {!petal.isDetached ? (
                <motion.div
                  onClick={() => handleDetachPetal(index)}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.88 }}
                  style={{
                    position: 'absolute',
                    left: `calc(50% + ${x}px - 28px)`,
                    top: `calc(50% + ${y}px - 44px)`,
                    transform: `rotate(${petal.angle + 90}deg)`,
                  }}
                  className="z-20 cursor-pointer touch-manipulation group"
                >
                  {/* Organic petal SVG shape with baby pink gradient & highlight */}
                  <div className="relative w-14 h-22 rounded-full bg-gradient-to-t from-pink-300/90 via-pink-400/95 to-[#ff85a1] border border-white/60 shadow-[0_0_15px_rgba(255,133,161,0.6)] flex flex-col items-center justify-center">
                    <div className="w-1.5 h-10 bg-white/40 rounded-full blur-[0.6px] mt-1" />
                    <span className="text-[9px] font-bold text-black/80 mt-1 select-none">
                      Swipe
                    </span>
                  </div>
                </motion.div>
              ) : (
                /* Falling detached petal fluttering down */
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
                    x: x + (Math.random() - 0.5) * 80,
                    y: 190,
                    scale: 0.6,
                    opacity: 0,
                    rotate: petal.angle + 90 + 120,
                  }}
                  transition={{ duration: 1.2, ease: 'easeIn' }}
                  className="absolute z-10 pointer-events-none"
                >
                  <div className="w-12 h-18 rounded-full bg-gradient-to-t from-pink-400 to-rose-400 border border-white/40 shadow-sm" />
                </motion.div>
              )}
            </AnimatePresence>
          );
        })}
      </div>

      <p className="text-xs text-pink-300/50 mt-3 text-center">
        Swipe each petal outward to see who loves who more 💕
      </p>

      {/* Winning Condition Modal */}
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
              {/* Couple photo preview at top of modal */}
              <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-[#ff85a1] shadow-[0_0_20px_rgba(255,133,161,0.6)] mb-4">
                <img
                  src="/assets/photo-2.jpg"
                  alt="Couple celebration"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = '/assets/photo2.jpg';
                  }}
                />
              </div>

              {/* Specific prompt winning condition */}
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
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-900/40 to-rose-900/40 border border-pink-400/50 my-3 text-sm font-semibold text-pink-100 shadow-[0_0_20px_rgba(255,133,161,0.3)]">
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
                    The petals have spoken: his heart overflows with infinite love for you every single second.
                  </p>
                </>
              )}

              <div className="flex gap-2.5 mt-4">
                <button
                  onClick={handleResetFlower}
                  className="flex-1 min-h-[48px] rounded-2xl bg-pink-500/20 border border-pink-400/40 text-xs font-semibold text-white hover:bg-pink-500/30 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Play Again</span>
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
