import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Gamepad2 } from 'lucide-react';
import { playPopSound } from '../utils/audio';

export default function Navbar({ activeTab, onSelectTab }) {
  const tabs = [
    { id: 'firstaid', label: 'First Aid', icon: Heart },
    { id: 'fidget', label: 'Fidget', icon: Sparkles },
    { id: 'games', label: 'Games', icon: Gamepad2 },
  ];

  const handleTabClick = (id) => {
    playPopSound();
    onSelectTab(id);
  };

  return (
    <nav className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-md">
      <div className="glass-panel rounded-full px-2 py-1.5 flex items-center justify-around border border-pink-400/25 shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className="relative flex-1 min-h-[52px] min-w-[48px] py-2 px-3 flex flex-col items-center justify-center rounded-full transition-all duration-300 cursor-pointer active:scale-95"
              aria-label={tab.label}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabBadge"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500/25 via-pink-400/30 to-rose-400/25 border border-pink-400/50 shadow-[0_0_15px_rgba(255,133,161,0.4)]"
                  transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                />
              )}

              <div className="relative z-10 flex flex-col items-center">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'text-[#ff85a1] scale-110' : 'text-pink-200/50 hover:text-pink-200/80'
                  }`}
                  fill={isActive ? 'currentColor' : 'none'}
                />
                <span
                  className={`text-[11px] mt-0.5 font-medium transition-colors duration-200 ${
                    isActive ? 'text-white font-semibold' : 'text-pink-200/50'
                  }`}
                >
                  {tab.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
