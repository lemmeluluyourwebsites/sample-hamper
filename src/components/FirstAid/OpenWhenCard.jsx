import React from 'react';
import { motion } from 'framer-motion';
import { Mail, ExternalLink, Heart, Sparkles } from 'lucide-react';
import { playPopSound } from '../../utils/audio';

const OPEN_WHEN_URL = 'https://openwhenletters.app/c/fa774264-b852-432a-8940-cdbdb8d08d66/v/270550c3e16610412919a2797e90cc1bab7363f5a445337e8df39ebfbb812f2e';

export default function OpenWhenCard() {
  const handleOpenLetters = () => {
    playPopSound();
    window.open(OPEN_WHEN_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleOpenLetters}
      className="glass-card rounded-3xl p-5 border border-pink-400/30 shadow-[0_4px_25px_rgba(0,0,0,0.5)] cursor-pointer group hover:border-[#ff85a1]/60 transition relative overflow-hidden"
    >
      {/* Background delicate glow highlight */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-pink-500/15 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500/30 via-rose-500/20 to-purple-500/20 border border-pink-400/30 flex items-center justify-center text-[#ff85a1] shrink-0 shadow-[0_0_15px_rgba(255,133,161,0.3)]">
            <Mail className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff85a1] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#ff85a1]" />
            </span>
          </div>

          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-1.5">
              My Open—When Letters
              <Heart className="w-3.5 h-3.5 text-[#ff85a1] fill-[#ff85a1]" />
            </h3>
            <p className="text-xs text-pink-200/70 mt-0.5 font-light">
              Heartfelt letters written specially for every feeling and moment.
            </p>
          </div>
        </div>

        <div className="w-10 h-10 rounded-full bg-pink-500/15 border border-pink-400/30 flex items-center justify-center text-pink-200 shrink-0 group-hover:bg-[#ff85a1] group-hover:text-black transition-all">
          <ExternalLink className="w-4 h-4" />
        </div>
      </div>

      <div className="mt-3.5 pt-3 border-t border-pink-400/10 flex items-center justify-between text-xs text-pink-300/80">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#ff85a1]" />
          <span>Open when you need love most</span>
        </span>
        <span className="text-[#ff85a1] font-semibold group-hover:translate-x-1 transition">
          Read Letters →
        </span>
      </div>
    </motion.div>
  );
}
