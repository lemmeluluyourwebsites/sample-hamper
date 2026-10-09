import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, RefreshCw, Heart } from 'lucide-react';
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
  "Because you are my home, my peace, and my favorite person in the entire universe.",
];

export default function LoveJarModal({ isOpen, onClose }) {
  const [stage, setStage] = useState('jar'); // 'jar' | 'flying' | 'opening' | 'letter'
  const [selectedNote, setSelectedNote] = useState(null);
  const [usedIndexes, setUsedIndexes] = useState([]);

  const pickRandomNote = () => {
    playPaperRustleSound();
    setStage('flying');

    // Stage 1: Envelope flies out of jar (0 -> 500ms)
    setTimeout(() => {
      setStage('opening'); // Stage 2: Flap opens
    }, 600);

    // Stage 3: Letter slides out and unfolds (1100ms)
    setTimeout(() => {
      let available = REASONS.map((_, i) => i).filter((i) => !usedIndexes.includes(i));
      if (available.length === 0) {
        available = REASONS.map((_, i) => i);
        setUsedIndexes([]);
      }
      const nextIdx = available[Math.floor(Math.random() * available.length)];
      setUsedIndexes((prev) => [...prev, nextIdx]);
      setSelectedNote(REASONS[nextIdx]);
      setStage('letter');
    }, 1100);
  };

  const handleReset = () => {
    playPopSound();
    setStage('jar');
    setSelectedNote(null);
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
              handleReset();
            }}
            className="absolute top-4 right-4 z-30 p-2 rounded-full text-pink-300/60 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/20 border border-pink-400/30 text-xs font-semibold text-[#ff85a1] mb-2">
            <span>✨</span>
            <span>Memory Keepsake</span>
          </div>

          <h2 className="text-xl font-bold text-white mb-1">Reasons I Love You Jar</h2>
          <p className="text-xs text-pink-200/70 mb-3">
            Tap the jar to see an envelope float out, open, and unfold a secret letter
          </p>

          {/* Ultra-Refined 3D Glass Jar View */}
          {stage === 'jar' && (
            <div className="relative my-3 flex items-center justify-center">
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

                {/* Hanging Twine String & Tag */}
                <div className="relative z-25 w-22 h-1 bg-amber-700/80 -mt-1 shadow-sm">
                  <div className="absolute left-3 top-1 px-2 py-0.5 rounded bg-amber-900/90 border border-amber-600/50 text-[9px] font-serif text-amber-200 shadow-md transform -rotate-12 pointer-events-none">
                    For You 💌
                  </div>
                </div>

                {/* Cylindrical Glass Body */}
                <div
                  className="relative w-40 h-52 rounded-b-[36px] rounded-t-[14px] overflow-hidden -mt-0.5"
                  style={{
                    background: 'linear-gradient(90deg, rgba(255,255,255,0.22) 0%, rgba(255,182,193,0.06) 20%, rgba(20,15,25,0.35) 50%, rgba(255,182,193,0.08) 80%, rgba(255,255,255,0.28) 100%)',
                    border: '1.5px solid rgba(255, 255, 255, 0.35)',
                    boxShadow: 'inset 0 0 25px rgba(255, 255, 255, 0.25), inset 0 -12px 20px rgba(255, 133, 161, 0.2), 0 16px 36px rgba(0, 0, 0, 0.7)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  {/* Curvature Specular Highlights */}
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

                  {/* Envelopes & folded scrolls floating inside jar with 3D depth */}
                  <div className="absolute inset-x-3 bottom-3 flex flex-wrap justify-center items-end gap-1.5 p-1 pointer-events-none">
                    {[
                      { bg: 'from-pink-400 to-rose-500', rot: -18, scale: 0.95 },
                      { bg: 'from-rose-300 to-pink-500', rot: 15, scale: 1 },
                      { bg: 'from-purple-300 to-pink-400', rot: -6, scale: 0.9 },
                      { bg: 'from-pink-300 to-rose-400', rot: 22, scale: 0.95 },
                      { bg: 'from-rose-400 to-pink-600', rot: -28, scale: 1 },
                      { bg: 'from-pink-200 to-pink-400', rot: 8, scale: 0.9 },
                    ].map((item, idx) => (
                      <motion.div
                        key={idx}
                        animate={{ y: [-1.5, 1.5, -1.5] }}
                        transition={{ duration: 2.2 + idx * 0.4, repeat: Infinity, ease: 'easeInOut' }}
                        style={{
                          transform: `rotate(${item.rot}deg) scale(${item.scale})`,
                          boxShadow: '0 3px 6px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,255,255,0.4)',
                        }}
                        className={`w-9 h-6 rounded bg-gradient-to-tr ${item.bg} border border-white/60 flex items-center justify-center text-[10px]`}
                      >
                        💌
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="mt-3 px-3 py-1 rounded-full bg-black/60 border border-pink-400/40 backdrop-blur-md text-[11px] text-[#ff85a1] font-medium flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,133,161,0.3)]">
                  <span>Touch Jar to Open Envelope</span>
                  <Sparkles className="w-3 h-3 text-[#ff85a1]" />
                </div>
              </motion.div>
            </div>
          )}

          {/* STAGE: ENVELOPE COMES OUT & OPENS FLAP */}
          {(stage === 'flying' || stage === 'opening') && (
            <div className="relative w-full h-64 flex flex-col items-center justify-center my-2">
              <motion.div
                initial={{ y: 80, scale: 0.4, opacity: 0, rotate: -20 }}
                animate={{
                  y: stage === 'opening' ? -15 : 0,
                  scale: 1.15,
                  opacity: 1,
                  rotate: stage === 'opening' ? 0 : -5,
                }}
                transition={{ duration: 0.55, ease: 'easeOut' }}
                className="relative w-44 h-30 rounded-2xl bg-gradient-to-tr from-pink-300 via-rose-300 to-pink-200 border-2 border-white shadow-[0_0_35px_rgba(255,133,161,0.7)] flex items-center justify-center overflow-hidden"
              >
                {/* Triangular Opening Flap */}
                <motion.div
                  initial={{ rotateX: 0 }}
                  animate={{ rotateX: stage === 'opening' ? 180 : 0 }}
                  transition={{ duration: 0.45, ease: 'easeInOut' }}
                  style={{ transformOrigin: 'top center' }}
                  className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-rose-400 to-pink-300 border-b border-white/60 flex items-center justify-center z-20 shadow-md"
                >
                  <div className="w-5 h-5 rounded-full bg-rose-600 border border-white shadow flex items-center justify-center text-[9px] text-white font-bold">
                    ❤️
                  </div>
                </motion.div>

                {/* Letter beginning to slide up from inside */}
                {stage === 'opening' && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: -30, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="absolute z-10 w-36 h-22 rounded-lg bg-white border border-pink-200 shadow-lg flex flex-col items-center justify-center p-2"
                  >
                    <div className="w-full h-1.5 bg-pink-300/40 rounded mb-1.5" />
                    <div className="w-4/5 h-1.5 bg-pink-300/30 rounded mb-1.5" />
                    <span className="text-[10px] text-[#ff85a1] font-serif font-bold">
                      A Secret Love Note...
                    </span>
                  </motion.div>
                )}
              </motion.div>
            </div>
          )}

          {/* STAGE: LETTER UNROLLED MODAL */}
          {stage === 'letter' && selectedNote && (
            <motion.div
              initial={{ opacity: 0, scale: 0.75, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 260 }}
              className="mt-2 w-full p-5 rounded-3xl bg-gradient-to-br from-pink-950/80 via-purple-950/60 to-black/95 border-2 border-pink-400 shadow-[0_0_40px_rgba(255,133,161,0.5)] relative text-center"
            >
              {/* Little wax seal at top of letter */}
              <div className="w-8 h-8 mx-auto -mt-2 mb-3 rounded-full bg-gradient-to-tr from-rose-600 to-pink-500 border border-white shadow-lg flex items-center justify-center text-xs text-white">
                💌
              </div>

              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-[10px] tracking-widest uppercase text-pink-300/80 font-semibold">
                  Handwritten Note #{(usedIndexes.length % REASONS.length) + 1}
                </span>
                <Heart className="w-3.5 h-3.5 fill-[#ff85a1] text-[#ff85a1]" />
              </div>

              <p className="text-base font-serif font-medium text-pink-50 leading-relaxed italic px-2 py-3 bg-black/40 rounded-2xl border border-pink-400/25 shadow-inner">
                "{selectedNote}"
              </p>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={pickRandomNote}
                  className="flex-1 min-h-[46px] rounded-2xl bg-gradient-to-r from-[#ff85a1] to-[#f472b6] text-black font-bold text-xs shadow-[0_0_20px_rgba(255,133,161,0.4)] flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Pull Another Letter</span>
                </button>

                <button
                  onClick={handleReset}
                  className="min-h-[46px] px-3.5 rounded-2xl bg-pink-500/15 border border-pink-400/30 text-xs font-semibold text-pink-200 hover:text-white flex items-center justify-center cursor-pointer active:scale-95 transition"
                >
                  <span>Put Back</span>
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
