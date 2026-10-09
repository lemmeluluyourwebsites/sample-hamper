import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, Heart, Crosshair, Flower2 } from 'lucide-react';
import CatchHeartsGame from './CatchHeartsGame';
import CupidsWorryPopper from './CupidsWorryPopper';
import PetalByPetal from './PetalByPetal';
import { playPopSound } from '../../utils/audio';

const GAMES_TABS = [
  { id: 'catch', label: 'Catch Hearts', icon: Heart },
  { id: 'cupid', label: 'Worry Popper', icon: Crosshair },
  { id: 'petal', label: 'Petal by Petal', icon: Flower2 },
];

export default function GamesSection() {
  const [activeGame, setActiveGame] = useState('catch');

  const handleSelectGame = (id) => {
    playPopSound();
    setActiveGame(id);
  };

  return (
    <div className="w-full h-full overflow-y-auto px-4 pt-16 pb-24 flex flex-col items-center">
      <div className="w-full max-w-md flex flex-col items-center">
        {/* Header */}
        <div className="text-center pt-2 pb-3">
          <h2 className="text-2xl font-bold text-white tracking-tight">Cozy Mini-Games</h2>
          <p className="text-xs text-pink-200/70 mt-1">
            Gentle, playful moments to brighten up your mood
          </p>
        </div>

        {/* Tab pill selector */}
        <div className="w-full overflow-x-auto no-scrollbar py-1 mb-4">
          <div className="flex items-center justify-center gap-1.5 min-w-max px-1 w-full">
            {GAMES_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeGame === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleSelectGame(tab.id)}
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

        {/* Active Game Display */}
        <div className="w-full">
          <AnimatePresence mode="wait">
            {activeGame === 'catch' && (
              <motion.div
                key="catch"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                <CatchHeartsGame />
              </motion.div>
            )}

            {activeGame === 'cupid' && (
              <motion.div
                key="cupid"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                <CupidsWorryPopper />
              </motion.div>
            )}

            {activeGame === 'petal' && (
              <motion.div
                key="petal"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                <PetalByPetal />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
