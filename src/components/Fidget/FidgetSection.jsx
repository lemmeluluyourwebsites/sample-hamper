import React from 'react';
import { motion } from 'framer-motion';
import { Waves, CircleDot, Image as ImageIcon, Box, Music } from 'lucide-react';
import FluidCanvas from './FluidCanvas';
import BubbleWrap from './BubbleWrap';
import ScratchCard from './ScratchCard';
import DigitalSand from './DigitalSand';
import OctaveGrid from './OctaveGrid';

export default function FidgetSection() {
  return (
    <div className="w-full h-full overflow-y-auto px-4 pt-16 pb-28 flex flex-col items-center">
      <div className="w-full max-w-md space-y-8">
        {/* Section Title Header */}
        <div className="text-center pt-2 pb-1">
          <h2 className="text-2xl font-bold text-white tracking-tight">Sensory Relief Playground</h2>
          <p className="text-xs text-pink-200/70 mt-1">
            Scroll down to explore each tactile fidget — tap, drag, play & unwind
          </p>
        </div>

        {/* 1. Fluid Ripples */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          className="space-y-2"
        >
          <div className="flex items-center gap-2 px-1">
            <div className="w-7 h-7 rounded-lg bg-pink-500/20 border border-pink-400/30 flex items-center justify-center text-[#ff85a1]">
              <Waves className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Interactive Fluid Ripple Zone</h3>
              <p className="text-[11px] text-pink-200/60">Glowing water shockwaves responding to your fingers</p>
            </div>
          </div>
          <FluidCanvas />
        </motion.div>

        {/* 2. Bubble Wrap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          className="space-y-2"
        >
          <div className="flex items-center gap-2 px-1">
            <div className="w-7 h-7 rounded-lg bg-pink-500/20 border border-pink-400/30 flex items-center justify-center text-[#ff85a1]">
              <CircleDot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Haptic Bubble Wrap</h3>
              <p className="text-[11px] text-pink-200/60">Crisp pops and haptic vibrations with instant reset</p>
            </div>
          </div>
          <BubbleWrap />
        </motion.div>

        {/* 3. Mystery Scratch Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          className="space-y-2"
        >
          <div className="flex items-center gap-2 px-1">
            <div className="w-7 h-7 rounded-lg bg-pink-500/20 border border-pink-400/30 flex items-center justify-center text-[#ff85a1]">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Mystery Scratch Card</h3>
              <p className="text-[11px] text-pink-200/60">Random photo foils revealing celebrations at 90% cleared</p>
            </div>
          </div>
          <ScratchCard />
        </motion.div>

        {/* 4. Digital Sand */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          className="space-y-2"
        >
          <div className="flex items-center gap-2 px-1">
            <div className="w-7 h-7 rounded-lg bg-pink-500/20 border border-pink-400/30 flex items-center justify-center text-[#ff85a1]">
              <Box className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Digital Dune Sand</h3>
              <p className="text-[11px] text-pink-200/60">Natural granular dune physics shifting with gravity and phone tilt</p>
            </div>
          </div>
          <DigitalSand />
        </motion.div>

        {/* 5. Octave Grid / Harp */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          className="space-y-2"
        >
          <div className="flex items-center gap-2 px-1">
            <div className="w-7 h-7 rounded-lg bg-pink-500/20 border border-pink-400/30 flex items-center justify-center text-[#ff85a1]">
              <Music className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Harmonic Octave Harp & Melody Composer</h3>
              <p className="text-[11px] text-pink-200/60">Full 3 octaves (Do, Re, Mi, Fa, Sol, La, Ti, Do) with song recording</p>
            </div>
          </div>
          <OctaveGrid />
        </motion.div>
      </div>
    </div>
  );
}
