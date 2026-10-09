import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, X, Sparkles, Wind } from 'lucide-react';
import { playBurnSound, playPopSound } from '../../utils/audio';

export default function VentModal({ isOpen, onClose }) {
  const [ventText, setVentText] = useState('');
  const [isBurning, setIsBurning] = useState(false);
  const [burnedOut, setBurnedOut] = useState(false);
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setVentText('');
      setIsBurning(false);
      setBurnedOut(false);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    }
  }, [isOpen]);

  const handleBurn = () => {
    if (!ventText.trim() || isBurning) return;
    setIsBurning(true);
    playBurnSound();

    // Procedural flame and smoke animation on canvas
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      const particles = [];
      const particleCount = 120;

      // Create fire and rising smoke particles
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: canvas.height * 0.7 + Math.random() * (canvas.height * 0.3),
          radius: Math.random() * 9 + 4,
          speedY: -(Math.random() * 4 + 2.5),
          speedX: (Math.random() - 0.5) * 2.5,
          opacity: 1,
          hue: Math.random() > 0.4 ? 15 + Math.random() * 30 : 340 + Math.random() * 25, // fiery orange/amber & pinkish fire
          isSmoke: Math.random() > 0.6,
        });
      }

      let start = performance.now();

      const animate = (time) => {
        const elapsed = time - start;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw and update flame & smoke particles
        particles.forEach((p) => {
          p.x += p.speedX;
          p.y += p.speedY;
          p.radius *= 0.985;
          p.opacity -= 0.012;

          if (p.opacity > 0 && p.radius > 0.5) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

            if (p.isSmoke) {
              // Rising ash/smoke particle
              ctx.fillStyle = `rgba(180, 180, 190, ${Math.max(0, p.opacity * 0.6)})`;
              ctx.shadowColor = 'rgba(255, 255, 255, 0.2)';
              ctx.shadowBlur = 10;
            } else {
              // Glowing flame particle
              ctx.fillStyle = `hsla(${p.hue}, 100%, 60%, ${Math.max(0, p.opacity)})`;
              ctx.shadowColor = `hsla(${p.hue}, 100%, 50%, 0.9)`;
              ctx.shadowBlur = 18;
            }
            ctx.fill();
            ctx.restore();
          }
        });

        // Add additional fresh rising flames while burning
        if (elapsed < 1400 && particles.length < 240) {
          for (let k = 0; k < 6; k++) {
            particles.push({
              x: Math.random() * canvas.width,
              y: canvas.height * 0.8 + Math.random() * (canvas.height * 0.2),
              radius: Math.random() * 10 + 4,
              speedY: -(Math.random() * 5 + 3),
              speedX: (Math.random() - 0.5) * 3,
              opacity: 1,
              hue: 20 + Math.random() * 35,
              isSmoke: Math.random() > 0.5,
            });
          }
        }

        if (elapsed < 2000) {
          animFrameRef.current = requestAnimationFrame(animate);
        } else {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          setIsBurning(false);
          setBurnedOut(true);
          setTimeout(() => {
            onClose();
          }, 1800);
        }
      };

      animFrameRef.current = requestAnimationFrame(animate);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          className="relative w-full max-w-md glass-panel rounded-3xl p-6 border border-pink-400/30 shadow-[0_0_40px_rgba(255,133,161,0.25)] overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={() => {
              playPopSound();
              onClose();
            }}
            disabled={isBurning}
            className="absolute top-4 right-4 p-2 rounded-full text-pink-300/60 hover:text-white hover:bg-white/10 transition cursor-pointer disabled:opacity-30"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500/30 to-rose-400/20 border border-pink-400/40 flex items-center justify-center text-pink-300">
              <Flame className="w-5 h-5 text-[#ff85a1]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Need to Vent?</h2>
              <p className="text-xs text-pink-200/70">Let it all out. Once burned, it's gone forever.</p>
            </div>
          </div>

          {/* Interactive Text & Flame Zone */}
          <div className="relative my-4 rounded-2xl overflow-hidden bg-black/60 border border-pink-400/20 min-h-[190px]">
            {/* Shake container when burning */}
            <motion.div
              animate={
                isBurning
                  ? {
                      x: [-4, 4, -5, 5, -2, 2, 0],
                      y: [-2, 2, -3, 3, -1, 1, 0],
                      transition: { duration: 0.25, repeat: 7 },
                    }
                  : {}
              }
              className="w-full h-full p-3.5"
            >
              {burnedOut ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full min-h-[160px] flex flex-col items-center justify-center text-center p-4"
                >
                  <Sparkles className="w-8 h-8 text-[#ff85a1] mb-2 animate-bounce" />
                  <p className="text-sm font-medium text-pink-100">
                    Dissolved into smoke & ash ✨
                  </p>
                  <p className="text-xs text-pink-200/70 mt-1">
                    You are safe, loved, and protected. Take a deep, gentle breath.
                  </p>
                </motion.div>
              ) : (
                <motion.textarea
                  animate={
                    isBurning
                      ? {
                          opacity: [1, 0.7, 0.4, 0],
                          filter: ['blur(0px)', 'blur(3px)', 'blur(7px)', 'blur(12px)'],
                          color: ['#ffd1dc', '#ff85a1', '#888888', '#333333'],
                        }
                      : {}
                  }
                  transition={{ duration: 1.6, ease: 'easeOut' }}
                  disabled={isBurning}
                  value={ventText}
                  onChange={(e) => setVentText(e.target.value)}
                  placeholder="Write whatever is hurting, frustrating, or overwhelming you... No judgments, no memories saved."
                  className="w-full h-40 bg-transparent text-sm text-pink-100 placeholder-pink-300/30 resize-none focus:outline-none leading-relaxed select-text"
                />
              )}
            </motion.div>

            {/* Canvas overlay for procedural flames & smoke particles */}
            <canvas
              ref={canvasRef}
              className="absolute inset-0 pointer-events-none z-20 w-full h-full"
            />
          </div>

          {/* Action button */}
          {!burnedOut && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleBurn}
              disabled={isBurning || !ventText.trim()}
              className="w-full min-h-[48px] rounded-2xl bg-gradient-to-r from-orange-500 via-[#ff85a1] to-rose-600 text-white font-semibold text-sm shadow-[0_0_25px_rgba(255,100,100,0.4)] hover:shadow-[0_0_35px_rgba(255,100,100,0.6)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition"
            >
              {isBurning ? (
                <>
                  <Flame className="w-4 h-4 animate-spin" />
                  <span>Burning into ash...</span>
                </>
              ) : (
                <>
                  <Flame className="w-4 h-4 text-amber-200" />
                  <span>Burn It & Release</span>
                </>
              )}
            </motion.button>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
