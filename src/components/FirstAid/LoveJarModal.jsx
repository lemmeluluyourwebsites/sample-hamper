import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, RefreshCw } from 'lucide-react';
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
            <span>✨</span>
            <span>Memory Keepsake</span>
          </div>

          <h2 className="text-xl font-bold text-white mb-1">Reasons I Love You Jar</h2>
          <p className="text-xs text-pink-200/70 mb-5">
            Tap the glass jar to pull out a secret handwritten note
          </p>

          {/* Refined 3D Glass Jar Rendering */}
          <div className="relative my-3 flex items-center justify-center">
            {/* Ambient table spotlight reflection */}
            <div className="absolute -bottom-4 w-44 h-8 bg-[#ff85a1]/25 rounded-full blur-xl pointer-events-none" />
            <div className="absolute top-6 w-36 h-48 bg-pink-500/10 rounded-full blur-2xl pointer-events-none" />

            <motion.div
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={pickRandomNote}
              className="relative cursor-pointer group flex flex-col items-center select-none"
            >
              {/* Cork Stopper with 3D Depth */}
              <div className="relative z-30 flex flex-col items-center">
                <div
                  className="w-20 h-4 rounded-t-md shadow-lg"
                  style={{
                    background: 'linear-gradient(90deg, #8a572a 0%, #b87b41 35%, #d6985c 50%, #b87b41 65%, #7a4b22 100%)',
                    boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.4), 0 3px 6px rgba(0,0,0,0.6)',
                  }}
                />
                <div
                  className="w-18 h-3 rounded-b-sm"
                  style={{
                    background: 'linear-gradient(90deg, #6c401d 0%, #9e6430 35%, #b57a44 50%, #9e6430 65%, #593315 100%)',
                  }}
                />
              </div>

              {/* Glass Neck & Lip with 3D Elliptical Ring */}
              <div
                className="relative z-20 w-24 h-4 rounded-full border border-white/40 -mt-1 shadow-md"
                style={{
                  background: 'linear-gradient(90deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 40%, rgba(255,255,255,0.5) 100%)',
                  boxShadow: 'inset 0 0 5px rgba(255,255,255,0.5), 0 2px 4px rgba(0,0,0,0.3)',
                }}
              />

              {/* Twine String & Hanging Tag around neck */}
              <div className="relative z-25 w-22 h-1 bg-amber-700/80 -mt-1 shadow-sm">
                <div className="absolute left-3 top-1 px-2 py-0.5 rounded bg-amber-900/90 border border-amber-600/50 text-[9px] font-serif text-amber-200 shadow-md transform -rotate-12 pointer-events-none">
                  For You 💌
                </div>
              </div>

              {/* Cylindrical Glass Body with realistic lighting & specular highlights */}
              <div
                className="relative w-40 h-52 rounded-b-[36px] rounded-t-[14px] overflow-hidden -mt-0.5"
                style={{
                  background: 'linear-gradient(90deg, rgba(255,255,255,0.22) 0%, rgba(255,182,193,0.06) 20%, rgba(20,15,25,0.35) 50%, rgba(255,182,193,0.08) 80%, rgba(255,255,255,0.28) 100%)',
                  border: '1.5px solid rgba(255, 255, 255, 0.35)',
                  boxShadow: 'inset 0 0 25px rgba(255, 255, 255, 0.25), inset 0 -12px 20px rgba(255, 133, 161, 0.2), 0 16px 36px rgba(0, 0, 0, 0.7)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                {/* 3D Specular Highlight Rods (Left & Right curvature) */}
                <div
                  className="absolute left-2.5 top-2 bottom-4 w-3.5 rounded-full pointer-events-none"
                  style={{
                    background: 'linear-gradient(90deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.1) 80%, transparent 100%)',
                    filter: 'blur(1px)',
                  }}
                />
                <div
                  className="absolute right-2 top-3 bottom-6 w-1.5 rounded-full pointer-events-none"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 100%)',
                  }}
                />
                <div
                  className="absolute inset-x-3 bottom-2 h-4 rounded-full pointer-events-none"
                  style={{
                    background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.4) 0%, transparent 80%)',
                  }}
                />

                {/* Layered folded origami hearts / paper notes inside the jar with 3D depth */}
                <div className="absolute inset-x-3 bottom-3 flex flex-wrap justify-center items-end gap-1.5 p-1 pointer-events-none">
                  {[
                    { bg: 'from-pink-400 to-rose-500', rot: -18, scale: 0.9, y: 0 },
                    { bg: 'from-rose-300 to-pink-500', rot: 15, scale: 1, y: -2 },
                    { bg: 'from-purple-300 to-pink-400', rot: -6, scale: 0.85, y: -1 },
                    { bg: 'from-pink-300 to-rose-400', rot: 22, scale: 0.95, y: -4 },
                    { bg: 'from-rose-400 to-pink-600', rot: -28, scale: 1, y: -3 },
                    { bg: 'from-pink-200 to-pink-400', rot: 8, scale: 0.9, y: -2 },
                    { bg: 'from-purple-400 to-pink-500', rot: -12, scale: 0.95, y: -6 },
                  ].map((item, idx) => (
                    <motion.div
                      key={idx}
                      animate={{ y: [item.y - 1.5, item.y + 1.5, item.y - 1.5] }}
                      transition={{ duration: 2.4 + idx * 0.4, repeat: Infinity, ease: 'easeInOut' }}
                      style={{
                        transform: `rotate(${item.rot}deg) scale(${item.scale})`,
                        boxShadow: '0 3px 6px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,255,255,0.4)',
                      }}
                      className={`w-8 h-6 rounded-md bg-gradient-to-tr ${item.bg} border border-white/60 flex items-center justify-center text-[10px]`}
                    >
                      💌
                    </motion.div>
                  ))}
                </div>

                {/* Flying note animation during opening */}
                {isOpening && (
                  <motion.div
                    initial={{ y: 60, scale: 0.3, opacity: 0, rotate: -40 }}
                    animate={{ y: -80, scale: 1.25, opacity: 1, rotate: 15 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="absolute z-30 inset-x-8 top-16 h-14 rounded-xl bg-gradient-to-tr from-pink-100 to-white border border-pink-400 shadow-[0_0_25px_rgba(255,133,161,0.6)] flex items-center justify-center text-2xl"
                  >
                    💌
                  </motion.div>
                )}
              </div>

              {/* Touch label badge */}
              <div className="mt-3 px-3 py-1 rounded-full bg-black/60 border border-pink-400/40 backdrop-blur-md text-[11px] text-[#ff85a1] font-medium flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,133,161,0.3)]">
                <span>Touch Jar to Open</span>
                <Sparkles className="w-3 h-3 text-[#ff85a1]" />
              </div>
            </motion.div>
          </div>

          {/* Unfolded Love Note Modal Card */}
          <AnimatePresence>
            {selectedNote && !isOpening && (
              <motion.div
                initial={{ opacity: 0, scale: 0.75, rotateX: 45 }}
                animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                exit={{ opacity: 0, scale: 0.75, rotateX: -30 }}
                transition={{ type: 'spring', damping: 20, stiffness: 260 }}
                className="mt-3 w-full p-4 rounded-2xl bg-gradient-to-br from-pink-950/70 via-purple-950/50 to-black/90 border border-pink-400/50 shadow-[0_0_35px_rgba(255,133,161,0.4)] relative"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] tracking-wider uppercase text-pink-300/70 font-semibold">
                    Folded Love Note #{(usedIndexes.length % REASONS.length) + 1}
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
            <p className="text-xs text-pink-300/60 mt-2">
              Every single note is a true piece of my heart ✨
            </p>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
