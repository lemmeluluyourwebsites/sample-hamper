import React from 'react';
import { Volume2, VolumeX, Lock, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { playPopSound } from '../utils/audio';

export default function Header() {
  const { isMusicPlaying, toggleMusic, lock } = useAuth();

  const handleAudioToggle = () => {
    playPopSound();
    toggleMusic();
  };

  const handleLock = () => {
    playPopSound();
    lock();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-4 pt-3 pb-2 flex items-center justify-between backdrop-blur-md bg-black/40 border-b border-pink-400/10">
      <div className="flex items-center gap-2">
        <span className="text-xl">🌸</span>
        <div>
          <h1 className="text-sm font-semibold tracking-wide text-white flex items-center gap-1.5">
            Cozy Hamper
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-pink-500/20 text-[#ff85a1] border border-pink-500/30 font-medium">
              Safe Space
            </span>
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Ambient background music toggle button */}
        <button
          onClick={handleAudioToggle}
          title={isMusicPlaying ? 'Pause calming music' : 'Play calming music'}
          aria-label={isMusicPlaying ? 'Pause calming music' : 'Play calming music'}
          className="min-h-[44px] min-w-[44px] px-3 py-1.5 rounded-full glass-panel border border-pink-400/25 flex items-center gap-2 text-xs text-pink-200 hover:text-white transition cursor-pointer active:scale-95"
        >
          {isMusicPlaying ? (
            <>
              <div className="flex items-end gap-0.5 h-3">
                <span className="w-0.5 h-2 bg-[#ff85a1] animate-pulse" />
                <span className="w-0.5 h-3 bg-[#ff85a1] animate-bounce" />
                <span className="w-0.5 h-1.5 bg-[#ff85a1] animate-pulse" />
              </div>
              <Volume2 className="w-3.5 h-3.5 text-[#ff85a1]" />
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-pink-300/60" />
              <span className="text-[11px] text-pink-300/60 hidden sm:inline">Play BGM</span>
            </>
          )}
        </button>

        {/* Lock button */}
        <button
          onClick={handleLock}
          title="Lock hamper"
          aria-label="Lock hamper"
          className="min-h-[44px] min-w-[44px] p-2.5 rounded-full glass-panel border border-pink-400/20 text-pink-300/70 hover:text-rose-300 transition cursor-pointer active:scale-95 flex items-center justify-center"
        >
          <Lock className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
