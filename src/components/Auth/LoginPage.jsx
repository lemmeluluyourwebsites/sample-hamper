import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Lock, Sparkles, Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { playPopSound } from '../../utils/audio';

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    playPopSound();

    if (!username.trim() || !password.trim()) {
      setError('Please fill in both fields 💕');
      return;
    }

    setIsLoading(true);

    // Brief delightful loading animation
    setTimeout(() => {
      const result = login(username, password);
      if (!result.success) {
        setIsLoading(false);
        setError(result.message);
      }
    }, 700);
  };

  return (
    <div className="relative min-h-screen w-screen bg-black flex items-center justify-center p-4 overflow-hidden select-none">
      {/* Ambient pink glowing orbs in background */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-pink-500/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-rose-400/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Decorative floating sparkles */}
      <motion.div
        animate={{ y: [-6, 6, -6], opacity: [0.4, 0.9, 0.4] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-12 left-12 text-pink-300/40 pointer-events-none"
      >
        <Sparkles size={28} />
      </motion.div>
      <motion.div
        animate={{ y: [6, -6, 6], opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute bottom-16 right-12 text-pink-400/40 pointer-events-none"
      >
        <Heart size={26} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-sm glass-panel rounded-3xl p-7 sm:p-8 border border-pink-400/25 pulse-glow"
      >
        {/* Lock / Gift Icon Header */}
        <div className="flex flex-col items-center text-center mb-7">
          <motion.div
            whileHover={{ scale: 1.08, rotate: [0, -5, 5, 0] }}
            whileTap={{ scale: 0.95 }}
            className="w-18 h-18 rounded-2xl bg-gradient-to-tr from-pink-500/30 via-pink-400/20 to-rose-300/20 border border-pink-300/40 flex items-center justify-center mb-4 shadow-[0_0_25px_rgba(255,133,161,0.35)]"
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles className="w-8 h-8 text-[#ff85a1]" />
              </motion.div>
            ) : (
              <Gift className="w-8 h-8 text-[#ff85a1]" />
            )}
          </motion.div>

          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Digital Cozy Hamper
          </h1>
          <p className="text-xs text-pink-200/70 mt-1.5 font-light">
            Your personal sanctuary & pocket of warmth ✨
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-pink-200/80 mb-1.5 ml-1">
              Username
            </label>
            <div className="relative">
              <input
                id="hamper-username"
                type="text"
                autoComplete="off"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                className="w-full min-h-[48px] px-4 rounded-xl bg-black/50 border border-pink-400/30 text-white placeholder-pink-300/30 text-sm focus:outline-none focus:border-[#ff85a1] focus:ring-2 focus:ring-[#ff85a1]/30 transition duration-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-pink-200/80 mb-1.5 ml-1">
              Password
            </label>
            <div className="relative">
              <input
                id="hamper-password"
                type="password"
                autoComplete="off"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full min-h-[48px] px-4 rounded-xl bg-black/50 border border-pink-400/30 text-white placeholder-pink-300/30 text-sm focus:outline-none focus:border-[#ff85a1] focus:ring-2 focus:ring-[#ff85a1]/30 transition duration-200"
              />
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -6, height: 0 }}
                className="text-xs text-rose-300 bg-rose-950/40 border border-rose-500/30 px-3.5 py-2.5 rounded-xl text-center"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            id="unlock-hamper-btn"
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full min-h-[48px] mt-2 rounded-xl bg-gradient-to-r from-[#ff85a1] to-[#f472b6] text-black font-semibold text-sm shadow-[0_0_20px_rgba(255,133,161,0.45)] hover:shadow-[0_0_30px_rgba(255,133,161,0.65)] transition duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Unwrapping your hamper...
              </span>
            ) : (
              <>
                <Lock className="w-4 h-4 text-black" />
                <span>Unlock Hamper</span>
              </>
            )}
          </motion.button>
        </form>

        <p className="text-[11px] text-center text-pink-300/40 mt-5">
          Crafted with love just for you 🎀
        </p>
      </motion.div>
    </div>
  );
}
