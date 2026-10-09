import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Music, Sparkles } from 'lucide-react';
import { PENTATONIC_FREQUENCIES, playPentatonicNote } from '../../utils/audio';

const COLUMNS = 5; // C, D, E, G, A
const ROWS = 5;    // 5 Octaves (C3 to A7)
const NOTE_NAMES = ['C', 'D', 'E', 'G', 'A'];

export default function OctaveGrid() {
  const [activeSquare, setActiveSquare] = useState(null);
  const lastPlayedRef = useRef(null);
  const containerRef = useRef(null);

  const handlePointerInteraction = (clientX, clientY) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    if (x < 0 || x > rect.width || y < 0 || y > rect.height) return;

    const col = Math.floor((x / rect.width) * COLUMNS);
    const row = Math.floor((y / rect.height) * ROWS);
    const index = Math.min(COLUMNS * ROWS - 1, Math.max(0, row * COLUMNS + col));

    if (lastPlayedRef.current !== index) {
      lastPlayedRef.current = index;
      setActiveSquare(index);

      // Trigger Web Audio API pentatonic frequency
      const freq = PENTATONIC_FREQUENCIES[index % PENTATONIC_FREQUENCIES.length];
      playPentatonicNote(freq);

      // Reset flash state
      setTimeout(() => {
        setActiveSquare((curr) => (curr === index ? null : curr));
      }, 350);
    }
  };

  const handlePointerMove = (e) => {
    handlePointerInteraction(e.clientX, e.clientY);
  };

  const handlePointerDown = (e) => {
    lastPlayedRef.current = null;
    handlePointerInteraction(e.clientX, e.clientY);
  };

  const handlePointerLeave = () => {
    lastPlayedRef.current = null;
    setActiveSquare(null);
  };

  return (
    <div className="w-full flex flex-col items-center select-none">
      {/* Header bar */}
      <div className="w-full flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-1.5 text-xs text-pink-200/80 font-medium">
          <Music className="w-3.5 h-3.5 text-[#ff85a1]" />
          <span>Harmonic Pentatonic Harp (C, D, E, G, A)</span>
        </div>
        <span className="text-[11px] text-pink-300/60 bg-black/40 px-2.5 py-1 rounded-full border border-pink-400/20">
          Swipe Across
        </span>
      </div>

      {/* Octave Grid with touch-action: none */}
      <div
        ref={containerRef}
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerDown}
        onPointerLeave={handlePointerLeave}
        style={{ touchAction: 'none' }}
        className="w-full h-[380px] sm:h-[430px] p-3 rounded-3xl glass-card border border-pink-400/30 shadow-[0_4px_30px_rgba(255,133,161,0.25)] flex flex-col justify-between cursor-pointer"
      >
        <div className="grid grid-cols-5 gap-2.5 w-full h-full">
          {Array.from({ length: ROWS * COLUMNS }).map((_, index) => {
            const col = index % COLUMNS;
            const row = Math.floor(index / COLUMNS);
            const isHovered = activeSquare === index;
            const noteName = NOTE_NAMES[col];
            const octave = row + 3;

            return (
              <div
                key={index}
                className={`relative rounded-2xl flex flex-col items-center justify-center transition-all duration-200 border ${
                  isHovered
                    ? 'bg-gradient-to-tr from-[#ff85a1] to-[#f472b6] border-white text-black scale-105 z-10 shadow-[0_0_25px_rgba(255,133,161,0.85)]'
                    : 'bg-white/[0.04] border-pink-300/15 text-pink-200/40 hover:border-pink-300/30'
                }`}
              >
                <span className={`text-xs font-bold transition-colors ${isHovered ? 'text-black' : 'text-pink-200/60'}`}>
                  {noteName}
                </span>
                <span className={`text-[9px] transition-colors ${isHovered ? 'text-black/80' : 'text-pink-200/30'}`}>
                  {octave}
                </span>

                {isHovered && (
                  <motion.div
                    layoutId="sparkleFlash"
                    className="absolute inset-0 rounded-2xl bg-white/30 pointer-events-none"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-xs text-pink-300/50 mt-3 text-center">
        Glide your fingers freely — every combination forms a celestial harmonious melody ✨
      </p>
    </div>
  );
}
