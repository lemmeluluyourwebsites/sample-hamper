import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Flame, MessageCircleHeart } from 'lucide-react';
import VentModal from './VentModal';
import ComfortModal from './ComfortModal';
import LoveJarModal from './LoveJarModal';
import OpenWhenCard from './OpenWhenCard';
import { playPopSound } from '../../utils/audio';

export default function FirstAidSection() {
  const [isVentOpen, setIsVentOpen] = useState(false);
  const [comfortType, setComfortType] = useState(null);
  const [isJarOpen, setIsJarOpen] = useState(false);

  const handleOpenVent = () => {
    playPopSound();
    setIsVentOpen(true);
  };

  const handleOpenComfort = (type) => {
    playPopSound();
    setComfortType(type);
  };

  const handleOpenJar = () => {
    playPopSound();
    setIsJarOpen(true);
  };

  return (
    <div className="w-full h-full overflow-y-auto px-4 pt-16 pb-48 flex flex-col items-center">
      <div className="w-full max-w-md space-y-[18px]">
        {/* Header Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center pt-2 pb-1"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/15 border border-pink-400/25 text-xs text-[#ff85a1] font-medium mb-2 shadow-[0_0_12px_rgba(255,133,161,0.2)]">
            <Heart className="w-3.5 h-3.5 fill-[#ff85a1]" />
            <span>Emergency Warmth Station</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">First Aid For Your Heart</h2>
          <p className="text-xs text-pink-200/70 mt-1 max-w-xs mx-auto">
            Whenever life feels heavy, tap whatever you need most right now.
          </p>
        </motion.div>

        {/* Feature 1: Need to Vent? */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.01 }}
          onClick={handleOpenVent}
          className="glass-card rounded-3xl p-5 border border-pink-400/25 shadow-[0_4px_25px_rgba(0,0,0,0.5)] cursor-pointer group hover:border-[#ff85a1]/50 transition"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500/30 to-rose-500/20 border border-orange-400/30 flex items-center justify-center text-orange-300 shadow-[0_0_15px_rgba(251,146,60,0.3)]">
                <Flame className="w-6 h-6 text-orange-400 group-hover:scale-110 transition" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                  Need to Vent?
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-normal">
                    Burn & Release
                  </span>
                </h3>
                <p className="text-xs text-pink-200/70 mt-0.5">
                  Type your frustrations, watch them ignite and vanish into ash.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-3.5 pt-3 border-t border-pink-400/10 flex items-center justify-between text-xs text-pink-300/80">
            <span>Burn negative feelings away</span>
            <span className="text-[#ff85a1] font-semibold group-hover:translate-x-1 transition">
              Vent Now →
            </span>
          </div>
        </motion.div>

        {/* Feature 2: Quick Comfort Delivery */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-3xl p-5 border border-pink-400/25 shadow-[0_4px_25px_rgba(0,0,0,0.5)]"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-pink-500/20 border border-pink-400/30 flex items-center justify-center text-[#ff85a1]">
              <MessageCircleHeart className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Quick Comfort Delivery</h3>
              <p className="text-xs text-pink-200/70">Instant physical & emotional love sent to you</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => handleOpenComfort('hug')}
              className="min-h-[52px] p-2.5 rounded-2xl bg-black/40 border border-pink-400/25 hover:border-pink-300 hover:bg-pink-500/15 flex flex-col items-center justify-center text-center cursor-pointer transition shadow-[0_0_12px_rgba(255,133,161,0.15)]"
            >
              <span className="text-xl mb-1">🤗</span>
              <span className="text-[11px] font-semibold text-white">I need a hug</span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => handleOpenComfort('kiss')}
              className="min-h-[52px] p-2.5 rounded-2xl bg-black/40 border border-pink-400/25 hover:border-pink-300 hover:bg-pink-500/15 flex flex-col items-center justify-center text-center cursor-pointer transition shadow-[0_0_12px_rgba(255,133,161,0.15)]"
            >
              <span className="text-xl mb-1">💋</span>
              <span className="text-[11px] font-semibold text-white">I need a kiss</span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => handleOpenComfort('both')}
              className="min-h-[52px] p-2.5 rounded-2xl bg-gradient-to-b from-pink-500/25 to-pink-600/15 border border-pink-400/40 hover:border-[#ff85a1] flex flex-col items-center justify-center text-center cursor-pointer transition shadow-[0_0_18px_rgba(255,133,161,0.25)]"
            >
              <span className="text-xl mb-1">💖</span>
              <span className="text-[11px] font-bold text-[#ff85a1]">I need both</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Feature 3: My Open When Letters */}
        <OpenWhenCard />

        {/* Feature 4: Reasons I Love You Jar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.01 }}
          onClick={handleOpenJar}
          className="glass-card rounded-3xl p-5 border border-pink-400/25 shadow-[0_4px_25px_rgba(0,0,0,0.5)] cursor-pointer group hover:border-[#ff85a1]/50 transition relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500/30 to-purple-500/20 border border-pink-400/30 flex items-center justify-center text-pink-300 shadow-[0_0_15px_rgba(255,133,161,0.3)]">
                <span className="text-2xl group-hover:scale-110 transition">🫙</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                  Reasons I Love You Jar
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500/20 text-[#ff85a1] font-normal">
                    Interactive
                  </span>
                </h3>
                <p className="text-xs text-pink-200/70 mt-0.5">
                  Folded origami love notes waiting for you to pick.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-3.5 pt-3 border-t border-pink-400/10 flex items-center justify-between text-xs text-pink-300/80">
            <span>Pull out a random love note</span>
            <span className="text-[#ff85a1] font-semibold group-hover:translate-x-1 transition">
              Open Jar →
            </span>
          </div>
        </motion.div>

        {/* Generous bottom spacer so navigation bar never overlaps bottom content */}
        <div className="w-full h-24 pointer-events-none" />
      </div>

      {/* Modals */}
      <VentModal isOpen={isVentOpen} onClose={() => setIsVentOpen(false)} />
      <ComfortModal
        type={comfortType}
        isOpen={Boolean(comfortType)}
        onClose={() => setComfortType(null)}
      />
      <LoveJarModal isOpen={isJarOpen} onClose={() => setIsJarOpen(false)} />
    </div>
  );
}
