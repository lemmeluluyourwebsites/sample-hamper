import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Play, Pause, RotateCcw, Heart, Zap } from 'lucide-react';
import { playHeartChime, playBonusChime, playPenaltySound, playPopSound } from '../../utils/audio';

export default function CatchHeartsGame() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    try {
      return parseInt(localStorage.getItem('hamper_game_highscore') || '0', 10);
    } catch {
      return 0;
    }
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [basketX, setBasketX] = useState(150);
  const [feedback, setFeedback] = useState(null);

  const containerRef = useRef(null);
  const itemsRef = useRef([]);
  const animFrameRef = useRef(null);
  const lastSpawnRef = useRef(0);
  const basketXRef = useRef(150);
  const scoreRef = useRef(0);

  basketXRef.current = basketX;
  scoreRef.current = score;

  const spawnItem = (width) => {
    const currentScore = scoreRef.current;
    // Progressively increasing falling speed to make it competitive and tough!
    const speedMultiplier = 1 + Math.min(2.5, currentScore * 0.08);

    const types = [
      { type: 'heart', emoji: '❤️', points: 1, sound: playHeartChime, baseSpeed: 2.4 },
      { type: 'heart', emoji: '💖', points: 1, sound: playHeartChime, baseSpeed: 2.6 },
      { type: 'kiss', emoji: '💋', points: 2, sound: playBonusChime, baseSpeed: 3.0 },
      { type: 'cloud', emoji: '🌧️', points: -1, sound: playPenaltySound, baseSpeed: 2.0 },
    ];

    const rand = Math.random();
    let selected;
    if (rand < 0.45) selected = types[0];
    else if (rand < 0.7) selected = types[2];
    else selected = types[3];

    return {
      id: Math.random(),
      x: Math.random() * (width - 40) + 10,
      y: -30,
      speed: (selected.baseSpeed + Math.random() * 0.8) * speedMultiplier,
      ...selected,
    };
  };

  const handleGameLoop = (time) => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Spawn interval speeds up with score (750ms down to 420ms)
    const currentScore = scoreRef.current;
    const spawnInterval = Math.max(420, 750 - currentScore * 12);

    if (time - lastSpawnRef.current > spawnInterval) {
      lastSpawnRef.current = time;
      itemsRef.current.push(spawnItem(width));
    }

    const currentBasketX = basketXRef.current;
    const basketWidth = 64;
    const basketY = height - 60;

    const remainingItems = [];

    itemsRef.current.forEach((item) => {
      item.y += item.speed;

      // Check collision with basket
      const hitX = item.x >= currentBasketX - 25 && item.x <= currentBasketX + basketWidth - 5;
      const hitY = item.y >= basketY - 20 && item.y <= basketY + 25;

      if (hitX && hitY) {
        // Caught!
        item.sound();
        setScore((prev) => {
          const next = Math.max(0, prev + item.points);
          if (next > highScore) {
            setHighScore(next);
            try {
              localStorage.setItem('hamper_game_highscore', next.toString());
            } catch (e) {}
          }
          return next;
        });

        // Trigger float feedback
        setFeedback({
          text: item.points > 0 ? `+${item.points}` : `${item.points}`,
          x: item.x,
          color: item.points > 0 ? 'text-[#ff85a1]' : 'text-blue-300',
        });
        setTimeout(() => setFeedback(null), 600);
      } else if (item.y < height + 40) {
        remainingItems.push(item);
      }
    });

    itemsRef.current = remainingItems;

    if (isPlaying) {
      animFrameRef.current = requestAnimationFrame(handleGameLoop);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      animFrameRef.current = requestAnimationFrame(handleGameLoop);
    } else {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    }
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying]);

  const handleStart = () => {
    playPopSound();
    itemsRef.current = [];
    setScore(0);
    setIsPlaying(true);
  };

  const handleTogglePlay = () => {
    playPopSound();
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    playPopSound();
    setIsPlaying(false);
    itemsRef.current = [];
    setScore(0);
  };

  // Speed multiplier indicator
  const currentSpeedMultiplier = (1 + Math.min(2.5, score * 0.08)).toFixed(1);

  return (
    <div className="w-full flex flex-col items-center select-none">
      {/* Top score & speed info */}
      <div className="w-full flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/20 border border-pink-400/30 text-xs font-bold text-white">
            <Heart className="w-3.5 h-3.5 fill-[#ff85a1] text-[#ff85a1]" />
            <span>Score: {score}</span>
          </div>

          <div className="flex items-center gap-1 text-xs text-pink-200/60 font-medium">
            <Trophy className="w-3.5 h-3.5 text-amber-300" />
            <span>Best: {highScore}</span>
          </div>

          {score > 0 && (
            <div className="flex items-center gap-1 text-[11px] text-[#ff85a1] font-semibold bg-pink-500/10 px-2 py-0.5 rounded-full border border-pink-400/20">
              <Zap className="w-3 h-3 text-[#ff85a1]" />
              <span>{currentSpeedMultiplier}x Speed</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleTogglePlay}
            className="min-h-[44px] min-w-[44px] p-2.5 rounded-full bg-pink-500/20 border border-pink-400/30 text-pink-100 hover:text-white flex items-center justify-center cursor-pointer transition active:scale-95"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={handleReset}
            className="min-h-[44px] min-w-[44px] p-2.5 rounded-full bg-pink-500/15 border border-pink-400/30 text-pink-200 hover:text-white flex items-center justify-center cursor-pointer transition active:scale-95"
            title="Reset Game"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Game Stage */}
      <div
        ref={containerRef}
        style={{ touchAction: 'none' }}
        className="relative w-full h-[380px] sm:h-[430px] rounded-3xl overflow-hidden glass-card border border-pink-400/30 shadow-[0_4px_30px_rgba(255,133,161,0.25)] bg-gradient-to-b from-black via-[#0d0710] to-black"
      >
        {/* Falling items */}
        {isPlaying &&
          itemsRef.current.map((item) => (
            <div
              key={item.id}
              style={{
                position: 'absolute',
                left: `${item.x}px`,
                top: `${item.y}px`,
                fontSize: item.type === 'kiss' ? '26px' : '24px',
                pointerEvents: 'none',
              }}
            >
              {item.emoji}
            </div>
          ))}

        {/* Floating feedback score popup */}
        {feedback && (
          <div
            style={{ left: `${feedback.x}px`, top: '260px' }}
            className={`absolute z-30 font-extrabold text-base pointer-events-none animate-bounce ${feedback.color}`}
          >
            {feedback.text}
          </div>
        )}

        {/* Draggable Basket at bottom (Framer Motion drag="x") */}
        <motion.div
          drag="x"
          dragConstraints={containerRef}
          dragElastic={0.05}
          dragMomentum={false}
          onDrag={(e, info) => {
            const container = containerRef.current;
            if (container) {
              const rect = container.getBoundingClientRect();
              const relX = info.point.x - rect.left - 32;
              setBasketX(Math.max(10, Math.min(rect.width - 70, relX)));
            }
          }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 cursor-grab active:cursor-grabbing touch-none flex flex-col items-center"
          style={{ minWidth: '56px', minHeight: '56px' }}
        >
          <div className="w-16 h-12 rounded-2xl bg-gradient-to-tr from-pink-500/40 via-rose-500/30 to-purple-500/20 border-2 border-pink-400/80 shadow-[0_0_20px_rgba(255,133,161,0.6)] flex items-center justify-center text-2xl select-none">
            🧺
          </div>
          <span className="text-[9px] text-pink-200/70 font-semibold mt-1">Drag Me</span>
        </motion.div>

        {/* Start Overlay if paused/stopped */}
        {!isPlaying && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-30">
            <span className="text-4xl mb-2">🧺</span>
            <h3 className="text-xl font-bold text-white mb-1">Catch the Hearts</h3>
            <p className="text-xs text-pink-200/80 max-w-xs mb-4">
              Drag basket left and right — catch Hearts (+1) & Kisses (+2), avoid Rainclouds (-1). Speed ramps up as you score!
            </p>
            <button
              onClick={handleStart}
              className="min-h-[48px] px-6 py-2.5 rounded-full bg-gradient-to-r from-[#ff85a1] to-[#f472b6] text-black font-bold text-sm shadow-[0_0_25px_rgba(255,133,161,0.5)] cursor-pointer active:scale-95 transition"
            >
              Start Playing ✨
            </button>
          </div>
        )}
      </div>

      <p className="text-xs text-pink-300/50 mt-3 text-center">
        Speed gradually ramps up with every point — test your reflexes and hold on tight!
      </p>
    </div>
  );
}
