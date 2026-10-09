import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, X, RefreshCw } from 'lucide-react';
import { playPaperRustleSound, playPopSound } from '../../utils/audio';

const REASONS = [
  "I love your radiant smile that lights up the darkest rooms.",
  "You make my worst days instantly better just by existing.",
  "The gentle, adorable way you laugh when you're truly happy is my favorite melody.",
  "How deeply caring, pure, and thoughtful you are with everyone around you.",
  "Your sleepy voice in the morning makes my heart flutter every time.",
  "You are my safest harbor, my sweetest joy, and my favorite adventure.",
  "The cute little expressions you make when you're passionate about something.",
  "How effortlessly you make ordinary moments feel like warm poetry.",
  "The way your hand fits into mine like two puzzle pieces meant to be together.",
  "I fall in love with your mind, your kindness, and your soul all over again every day.",
  "Your warm hugs that make all my worries and fatigue instantly disappear.",
  "Because you are my home, my peace, and my favorite person in the entire universe."
];

export default function LoveJarModal({ isOpen, onClose }) {
  const [selectedNote, setSelectedNote] = useState(null);
  const [isOpening, setIsOpening] = useState(false);
  const [usedIndexes, setUsedIndexes] = useState([]);

  const pickRandomNote = () => {
    setIsOpening(true);
    playPaperRustleSound();

    setTimeout(() => {
      let available = REASONS.map((_, i) => i).filter((i) => !usedIndexes.includes(i));
      if (available.length === 0) {
        available = REASONS.map((_, i) => i);
        setUsedIndexes([]);
      }
      const nextIdx = available[Math.floor(Math.random() * available.length)];
      setUsedIndexes((prev) => [...prev, nextIdx]);
      setSelectedNote(REASONS[nextIdx]);
      setIsOpening(false);
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-sm glass-panel rounded-3xl p-6 border border-pink-400/30 shadow-[0_0_40px_rgba(255,133,161,0.3)] flex flex-col items-center text-center overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={() => {
              playPopSound();
              onClose();
            }}
            className="absolute top-4 right-4 p-2 rounded-full text-pink-300/60 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/20 border border-pink-400/30 text-xs font-semibold text-[#ff85a1] mb-2">
            <Heart className="w-3.5 h-3.5 fill-[#ff85a1]" />
            <span>Memory Keepsake</span>
          </div>

          <h2 className="text-xl font-bold text-white mb-1">Reasons I Love You Jar</h2>
          <p className="text-xs text-pink-200/70 mb-5">
            Tap the glass jar to pull out a secret handwritten love note
          </p>

          {/* 3D-styled glass jar graphic */}
          <div className="relative my-2 flex items-center justify-center">
            {/* Ambient halo glow behind jar */}
            <div className="absolute w-44 h-48 bg-pink-500/20 rounded-full blur-2xl pointer-events-none" />

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={pickRandomNote}
              className="relative cursor-pointer group flex flex-col items-center"
            >
              {/* Cork Lid */}
              <div className="w-24 h-6 rounded-t-lg bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800 border border-amber-500/50 shadow-md relative z-20">
                <div className="absolute inset-x-2 -bottom-1 h-2 bg-pink-500/80 rounded-full" />
              </div>

              {/* Jar Neck */}
              <div className="w-20 h-3 bg-white/15 border-x border-pink-300/40 relative z-10" />

              {/* Glass Jar Body */}
              <div className="relative w-40 h-52 rounded-b-[40px] rounded-t-[16px] bg-gradient-to-b from-white/20 via-pink-300/10 to-pink-500/15 backdrop-blur-md border-2 border-pink-300/40 shadow-[inset_0_0_20px_rgba(255,255,255,0.3),0_10px_30px_rgba(255,133,161,0.25)] flex items-center justify-center overflow-hidden">
                {/* Glass reflection streaks */}
                <div className="absolute left-3 top-4 bottom-6 w-3 bg-gradient-to-b from-white/40 via-white/10 to-transparent rounded-full transform -rotate-6 pointer-events-none" />
                <div className="absolute right-4 top-8 bottom-10 w-1.5 bg-gradient-to-b from-white/30 via-white/5 to-transparent rounded-full pointer-events-none" />

                {/* Little folded origami love notes inside the jar */}
                <div className="absolute inset-x-4 bottom-3 flex flex-wrap justify-center gap-1.5 p-2 pointer-events-none">
                  {[
                    { bg: 'from-pink-400 to-rose-400', rot: -15 },
                    { bg: 'from-rose-400 to-pink-500', rot: 20 },
                    { bg: 'from-pink-300 to-rose-300', rot: -5 },
                    { bg: 'from-purple-300 to-pink-400', rot: 12 },
                    { bg: 'from-rose-300 to-pink-400', rot: -25 },
                    { bg: 'from-pink-400 to-rose-500', rot: 8 },
                  ].map((item, idx) => (
                    <motion.div
                      key={idx}
                      animate={{ y: [-2, 2, -2] }}
                      transition={{ duration: 2 + idx * 0.5, repeat: Infinity, ease: 'easeInOut' }}
                      style={{ transform: `rotate(${item.rot}deg)` }}
                      className={`w-7 h-5 rounded-sm bg-gradient-to-tr ${item.bg} shadow-sm border border-white/40 flex items-center justify-center text-[8px]`}
                    >
                      💌
                    </motion.div>
                  ))}
                </div>

                {/* Flying note animation during opening */}
                {isOpening && (
                  <motion.div
                    initial={{ y: 50, scale: 0.3, opacity: 0, rotate: -40 }}
                    animate={{ y: -80, scale: 1.2, opacity: 1, rotate: 15 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="absolute z-30 w-16 h-12 rounded-lg bg-pink-100 border border-pink-400 shadow-xl flex items-center justify-center text-xl"
                  >
                    💌
                  </motion.div>
                )}
              </div>

              {/* Ribbon Label */}
              <div className="absolute bottom-6 px-3 py-1 rounded-full bg-black/60 border border-pink-400/40 backdrop-blur-sm text-[11px] text-[#ff85a1] font-medium flex items-center gap-1">
                <span>Touch Jar</span>
                <Sparkles className="w-3 h-3 text-[#ff85a1]" />
              </div>
            </motion.div>
          </div>

          {/* Unfolded Love Note Modal Overlay */}
          <AnimatePresence>
            {selectedNote && !isOpening && (
              <motion.div
                initial={{ opacity: 0, scale: 0.7, rotateX: 60 }}
                animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                exit={{ opacity: 0, scale: 0.7, rotateX: -40 }}
                transition={{ type: 'spring', damping: 20, stiffness: 260 }}
                className="mt-4 w-full p-4 rounded-2xl bg-gradient-to-br from-pink-950/60 via-purple-950/40 to-black/80 border border-pink-400/50 shadow-[0_0_30px_rgba(255,133,161,0.4)] relative"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] tracking-wider uppercase text-pink-300/70 font-semibold">
                    Folded Note #{(usedIndexes.length % REASONS.length) + 1}
                  </span>
                  <Sparkles className="w-3.5 h-3.5 text-[#ff85a1]" />
                </div>
                <p className="text-sm font-medium text-pink-50 leading-relaxed italic px-1 py-1">
                  "{selectedNote}"
                </p>

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={pickRandomNote}
                    className="flex-1 min-h-[44px] rounded-xl bg-pink-500/20 border border-pink-400/40 text-xs font-semibold text-pink-200 hover:text-white hover:bg-pink-500/30 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Pull Another Note</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!selectedNote && (
            <p className="text-xs text-pink-300/60 mt-3">
              Every note is a true piece of my heart ✨
            </p>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
