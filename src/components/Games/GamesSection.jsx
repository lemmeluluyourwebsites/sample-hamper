import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Crosshair, Flower2 } from 'lucide-react';
import CatchHeartsGame from './CatchHeartsGame';
import CupidsWorryPopper from './CupidsWorryPopper';
import PetalByPetal from './PetalByPetal';

export default function GamesSection() {
  return (
    <div className="w-full h-full overflow-y-auto px-4 pt-16 pb-48 flex flex-col items-center">
      <div className="w-full max-w-md space-y-8">
        {/* Section Title Header */}
        <div className="text-center pt-2 pb-1">
          <h2 className="text-2xl font-bold text-white tracking-tight">Cozy Mini Games</h2>
          <p className="text-xs text-pink-200/70 mt-1">
            Scroll down to play each gentle game, designed to bring warmth and smiles
          </p>
        </div>

        {/* 1. Catch the Hearts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          className="space-y-2"
        >
          <div className="flex items-center gap-2 px-1">
            <div className="w-7 h-7 rounded-lg bg-pink-500/20 border border-pink-400/30 flex items-center justify-center text-[#ff85a1]">
              <Heart className="w-4 h-4 fill-[#ff85a1]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Catch the Hearts</h3>
              <p className="text-[11px] text-pink-200/60">Catch hearts and kisses: dynamic speed scaling as you score</p>
            </div>
          </div>
          <CatchHeartsGame />
        </motion.div>

        {/* 2. Cupid's Worry Popper */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          className="space-y-2"
        >
          <div className="flex items-center gap-2 px-1">
            <div className="w-7 h-7 rounded-lg bg-pink-500/20 border border-pink-400/30 flex items-center justify-center text-[#ff85a1]">
              <Crosshair className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Cupid’s Worry Popper</h3>
              <p className="text-[11px] text-pink-200/60">Touch bow and pull back to pop stresses into sweet affirmations</p>
            </div>
          </div>
          <CupidsWorryPopper />
        </motion.div>

        {/* 3. Petal by Petal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          className="space-y-2"
        >
          <div className="flex items-center gap-2 px-1">
            <div className="w-7 h-7 rounded-lg bg-pink-500/20 border border-pink-400/30 flex items-center justify-center text-[#ff85a1]">
              <Flower2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Petal by Petal</h3>
              <p className="text-[11px] text-pink-200/60">Swipe petals outward into the breeze to reveal love verdicts</p>
            </div>
          </div>
          <PetalByPetal />
        </motion.div>

        {/* Generous bottom spacer so navigation bar never overlaps bottom content */}
        <div className="w-full h-24 pointer-events-none" />
      </div>
    </div>
  );
}
