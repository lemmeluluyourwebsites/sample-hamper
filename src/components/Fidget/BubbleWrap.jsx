import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Sparkles } from 'lucide-react';
import { playPopSound } from '../../utils/audio';

const TOTAL_BUBBLES = 35; // 5 x 7 grid for comfortable mobile screen layout

export default function BubbleWrap() {
  const [poppedState, setPoppedState] = useState(() => Array(TOTAL_BUBBLES).fill(false));

  const handlePop = (index) => {
    if (poppedState[index]) return;

    // Trigger haptic vibration if supported
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(50);
      } catch (e) {
        // Ignore on unsupported browsers
      }
    }

    // Play soft synth pop Web Audio API sound
    playPopSound();

    setPoppedState((prev) => {
      const next = [...prev];
      next[index] = true;
      return next;
    });
  };

  const handleReset = () => {
    playPopSound();
    setPoppedState(Array(TOTAL_BUBBLES).fill(false));
  };

  const poppedCount = poppedState.filter(Boolean).length;

  return (
    <div className="w-full flex flex-col items-center">
      {/* Top bar with counter & reset button */}
      <div className="w-full flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-1.5 text-xs text-pink-200/80 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-[#ff85a1]" />
          <span>Popped: {poppedCount} / {TOTAL_BUBBLES}</span>
        </div>

        <button
          onClick={handleReset}
          className="min-h-[44px] px-3.5 py-1.5 rounded-full bg-pink-500/15 border border-pink-400/30 text-xs font-semibold text-pink-200 hover:text-white hover:bg-pink-500/25 flex items-center gap-1.5 cursor-pointer active:scale-95 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Bubbles</span>
        </button>
      </div>

      {/* CSS Grid of glassmorphic bubbles */}
      <div className="w-full p-4 rounded-3xl glass-card border border-pink-400/25 shadow-[0_4px_30px_rgba(0,0,0,0.6)]">
        <div className="grid grid-cols-5 gap-3.5 sm:gap-4 place-items-center">
          {poppedState.map((isPopped, index) => (
            <motion.button
              key={index}
              onClick={() => handlePop(index)}
              animate={
                isPopped
                  ? {
                      scale: [1, 0.78, 0.94],
                      opacity: 0.28,
                    }
                  : {
                      scale: 1,
                      opacity: 1,
                    }
              }
              whileTap={!isPopped ? { scale: 0.85 } : {}}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className={`w-13 h-13 sm:w-14 sm:h-14 rounded-full flex items-center justify-center cursor-pointer transition-shadow ${
                isPopped
                  ? 'bg-neutral-900/40 border border-neutral-700/30 shadow-none'
                  : 'glass-bubble border border-white/50 hover:shadow-[0_0_18px_rgba(255,133,161,0.5)]'
              }`}
              style={{ minWidth: '48px', minHeight: '48px' }}
              aria-label={`Bubble ${index + 1}`}
            >
              {isPopped ? (
                <span className="text-[10px] text-pink-300/30 font-bold select-none">✕</span>
              ) : (
                <div className="w-2.5 h-2.5 rounded-full bg-white/70 blur-[0.6px] translate-x-1.5 -translate-y-1.5 pointer-events-none" />
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
