import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Waves, CircleDot, Image as ImageIcon, Box, Music } from 'lucide-react';
import FluidCanvas from './FluidCanvas';
import BubbleWrap from './BubbleWrap';
import ScratchCard from './ScratchCard';
import DigitalSand from './DigitalSand';
import OctaveGrid from './OctaveGrid';
import { playPopSound } from '../../utils/audio';

const FIDGET_TABS = [
  { id: 'ripple', label: 'Fluid Ripples', icon: Waves },
  { id: 'bubble', label: 'Bubble Wrap', icon: CircleDot },
  { id: 'scratch', label: 'Scratch Card', icon: ImageIcon },
  { id: 'sand', label: 'Digital Sand', icon: Box },
  { id: 'octave', label: 'Octave Harp', icon: Music },
];

export default function FidgetSection() {
  const [activeTab, setActiveTab] = useState('ripple');

  const handleSelectTab = (id) => {
    playPopSound();
    setActiveTab(id);
  };

  return (
    <div className="w-full h-full overflow-y-auto px-4 pt-16 pb-24 flex flex-col items-center">
      <div className="w-full max-w-md flex flex-col items-center">
        {/* Header */}
        <div className="text-center pt-2 pb-3">
          <h2 className="text-2xl font-bold text-white tracking-tight">Sensory Relief Playground</h2>
          <p className="text-xs text-pink-200/70 mt-1">
            Tap, drag, listen & let all tension drift away
          </p>
        </div>

        {/* Sub-navigation pill selector */}
        <div className="w-full overflow-x-auto no-scrollbar py-1 mb-4">
          <div className="flex items-center gap-1.5 min-w-max px-1">
            {FIDGET_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleSelectTab(tab.id)}
                  className={`min-h-[44px] px-3.5 py-2 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#ff85a1] to-[#f472b6] text-black font-semibold shadow-[0_0_15px_rgba(255,133,161,0.5)] scale-102'
                      : 'glass-panel text-pink-200/70 hover:text-white border border-pink-400/20'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Feature Display */}
        <div className="w-full">
          <AnimatePresence mode="wait">
            {activeTab === 'ripple' && (
              <motion.div
                key="ripple"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                <FluidCanvas />
              </motion.div>
            )}

            {activeTab === 'bubble' && (
              <motion.div
                key="bubble"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                <BubbleWrap />
              </motion.div>
            )}

            {activeTab === 'scratch' && (
              <motion.div
                key="scratch"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                <ScratchCard />
              </motion.div>
            )}

            {activeTab === 'sand' && (
              <motion.div
                key="sand"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                <DigitalSand />
              </motion.div>
            )}

            {activeTab === 'octave' && (
              <motion.div
                key="octave"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                <OctaveGrid />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
