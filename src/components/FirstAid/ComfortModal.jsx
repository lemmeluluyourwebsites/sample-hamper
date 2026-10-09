import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, Sparkles } from 'lucide-react';
import { playPopSound, playHeartChime } from '../../utils/audio';

const COMFORT_DATA = {
  hug: {
    title: 'A Big, Tight Bear Hug 🧸',
    media: '/assets/hug.gif',
    badge: 'Warmest Embrace',
    message:
      "Wrap both arms tightly around yourself and squeeze. Close your eyes. Imagine my chin resting on your head, holding you safe from the entire world. Everything will be okay, my sweet girl. I'm right here with you.",
  },
  kiss: {
    title: 'Sweet Gentle Kisses 💋',
    media: '/assets/kiss.gif',
    badge: 'Infinite Affection',
    message:
      "One little kiss on your forehead, soft kisses across your eyelashes, and the sweetest kiss on your lips. You are so precious, so deeply adored, and the most beautiful thing in my life.",
  },
  both: {
    title: 'The Full Comfort Treatment 💖',
    media: '/assets/both.gif',
    badge: 'Hug + Endless Kisses',
    message:
      "Holding you as close as possible while raining soft kisses on you until you smile. Rest your head on my chest, listen to my heartbeat, and let all the stress melt away. You are never doing life alone.",
  },
};

export default function ComfortModal({ type, isOpen, onClose }) {
  if (!isOpen || !type || !COMFORT_DATA[type]) return null;

  const data = COMFORT_DATA[type];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.88, y: 25 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-sm glass-panel rounded-3xl p-6 border border-pink-400/35 shadow-[0_0_40px_rgba(255,133,161,0.35)] overflow-hidden text-center"
        >
          {/* Close button */}
          <button
            onClick={() => {
              playPopSound();
              onClose();
            }}
            className="absolute top-4 right-4 z-10 p-2 rounded-full text-pink-300/60 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/20 border border-pink-400/30 text-xs font-semibold text-[#ff85a1] mb-3">
            <Heart className="w-3.5 h-3.5 fill-[#ff85a1]" />
            <span>{data.badge}</span>
          </div>

          <h2 className="text-xl font-bold text-white mb-3">{data.title}</h2>

          {/* GIF / Illustration Image with glowing frame */}
          <div className="relative w-full aspect-square max-h-[220px] rounded-2xl overflow-hidden mb-4 border border-pink-400/25 bg-black/40 shadow-[0_0_20px_rgba(255,133,161,0.2)] flex items-center justify-center">
            <img
              src={data.media}
              alt={data.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback cute placeholder if image load fails
                e.target.style.display = 'none';
              }}
            />
          </div>

          {/* Comforting Message */}
          <p className="text-sm text-pink-100/90 leading-relaxed font-light px-2 mb-5">
            "{data.message}"
          </p>

          <button
            onClick={() => {
              playHeartChime();
              onClose();
            }}
            className="w-full min-h-[48px] rounded-2xl bg-gradient-to-r from-[#ff85a1] to-[#f472b6] text-black font-semibold text-sm shadow-[0_0_20px_rgba(255,133,161,0.4)] hover:shadow-[0_0_30px_rgba(255,133,161,0.6)] cursor-pointer active:scale-98 transition flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 fill-black" />
            <span>I feel better now 💕</span>
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
