import React, { useRef, useEffect, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, RotateCcw, Heart } from 'lucide-react';
import { playBonusChime, playPopSound } from '../../utils/audio';

const PHOTOS = [
  '/assets/photo-1.jpg',
  '/assets/photo-2.jpg',
  '/assets/photo-3.jpg',
  '/assets/photo-4.jpg',
  '/assets/photo-5.jpg',
  '/assets/photo-6.jpg',
  '/assets/photo-7.jpg',
  '/assets/photo-8.jpg',
];

export default function ScratchCard() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const imgRef = useRef(null);

  // Pick random photo on initial mount
  const [photoIndex, setPhotoIndex] = useState(() => Math.floor(Math.random() * PHOTOS.length));
  const [aspectRatio, setAspectRatio] = useState(1);
  const [isCleared, setIsCleared] = useState(false);
  const [clearedPercent, setClearedPercent] = useState(0);

  const isDrawingRef = useRef(false);
  const lastCheckRef = useRef(0);

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;
    if (width === 0 || height === 0) return;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    ctx.globalCompositeOperation = 'source-over';

    // Cute baby pink shimmering foil gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#ff85a1');
    gradient.addColorStop(0.5, '#f472b6');
    gradient.addColorStop(1, '#ffb6c1');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Decorative metallic sparkles
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    for (let i = 0; i < 35; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 2.5 + 1, 0, Math.PI * 2);
      ctx.fill();
    }

    // Centered label on foil
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✨ Scratch Here ✨', width / 2, height / 2 - 10);

    ctx.font = '12px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.fillText('Rub to reveal your mystery photo', width / 2, height / 2 + 14);

    setIsCleared(false);
    setClearedPercent(0);
  }, []);

  // When image loads, adapt container aspect ratio to match photo natural dimensions
  const handleImageLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.target;
    if (naturalWidth && naturalHeight) {
      setAspectRatio(naturalWidth / naturalHeight);
    }
  };

  useEffect(() => {
    // Delay slightly to allow layout reflow with new aspect ratio
    const timer = setTimeout(() => {
      initCanvas();
    }, 50);

    const handleResize = () => initCanvas();
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [photoIndex, aspectRatio, initCanvas]);

  // Accurate clearance percentage calculation
  const checkClearedPercentage = () => {
    const now = Date.now();
    if (now - lastCheckRef.current < 150) return;
    lastCheckRef.current = now;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imgData.data;

    let clearedSamples = 0;
    let totalSamples = 0;
    const step = 8; // high-resolution sampling grid

    for (let i = 3; i < pixels.length; i += 4 * step) {
      totalSamples++;
      // If alpha is below 128 (50% transparent), consider pixel cleared
      if (pixels[i] < 128) {
        clearedSamples++;
      }
    }

    const percent = Math.min(100, Math.round((clearedSamples / totalSamples) * 100));
    setClearedPercent(percent);

    // At 90% mark, snap canvas opacity to 0 and trigger confetti
    if (percent >= 90 && !isCleared) {
      setIsCleared(true);
      setClearedPercent(100);
      playBonusChime();
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#ff85a1', '#ffd1dc', '#ffffff', '#ec4899'],
      });
    }
  };

  const scratch = (clientX, clientY) => {
    if (isCleared) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const ctx = canvas.getContext('2d');
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 32, 0, Math.PI * 2);
    ctx.fill();

    checkClearedPercentage();
  };

  const handlePointerDown = (e) => {
    isDrawingRef.current = true;
    scratch(e.clientX, e.clientY);
  };

  const handlePointerMove = (e) => {
    if (!isDrawingRef.current && e.buttons !== 1) return;
    scratch(e.clientX, e.clientY);
  };

  const handlePointerUp = () => {
    isDrawingRef.current = false;
  };

  // Pick random next photo
  const handleRandomNextPhoto = () => {
    playPopSound();
    setPhotoIndex((prev) => {
      let next;
      do {
        next = Math.floor(Math.random() * PHOTOS.length);
      } while (next === prev && PHOTOS.length > 1);
      return next;
    });
  };

  const handleResetCard = () => {
    playPopSound();
    initCanvas();
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Header Bar */}
      <div className="w-full flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-1.5 text-xs text-pink-200/80 font-medium">
          <Heart className="w-3.5 h-3.5 text-[#ff85a1] fill-[#ff85a1]" />
          <span>Cleared: {isCleared ? '100%' : `${clearedPercent}%`}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRandomNextPhoto}
            className="min-h-[44px] px-3.5 py-1.5 rounded-full bg-pink-500/15 border border-pink-400/30 text-xs font-semibold text-pink-200 hover:text-white flex items-center gap-1 cursor-pointer transition active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#ff85a1]" />
            <span>Random Photo</span>
          </button>
          <button
            onClick={handleResetCard}
            className="min-h-[44px] p-2.5 rounded-full bg-pink-500/15 border border-pink-400/30 text-pink-200 hover:text-white flex items-center justify-center cursor-pointer transition active:scale-95"
            title="Reset Foil"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Adaptive Aspect Ratio Card Container */}
      <div
        ref={containerRef}
        style={{
          aspectRatio: `${aspectRatio}`,
          maxWidth: '360px',
          maxHeight: '480px',
        }}
        className="relative w-full rounded-3xl overflow-hidden glass-card border border-pink-400/30 shadow-[0_4px_30px_rgba(255,133,161,0.25)] select-none transition-all duration-300"
      >
        {/* Hidden <img> with natural aspect ratio */}
        <img
          ref={imgRef}
          src={PHOTOS[photoIndex]}
          alt="Mystery hidden moment"
          onLoad={handleImageLoad}
          className="w-full h-full object-cover pointer-events-none"
          onError={(e) => {
            e.target.src = '/assets/photo1.jpg';
          }}
        />

        {/* Scratchable Canvas */}
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          style={{
            touchAction: 'none',
            opacity: isCleared ? 0 : 1,
            pointerEvents: isCleared ? 'none' : 'auto',
            transition: 'opacity 0.4s ease-out',
          }}
          className="absolute inset-0 w-full h-full cursor-pointer z-10"
        />

        {/* Revealed badge overlay */}
        {isCleared && (
          <div className="absolute bottom-3 inset-x-3 py-2 px-3 rounded-2xl bg-black/60 backdrop-blur-md border border-pink-400/40 text-center animate-fade-in pointer-events-none">
            <p className="text-xs font-semibold text-white flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#ff85a1]" />
              <span>Revealed with Love! 100% Cleared 💖</span>
            </p>
          </div>
        )}
      </div>

      <p className="text-xs text-pink-300/50 mt-3 text-center">
        Scratch 90% of the foil to unlock full clarity & celebratory confetti ✨
      </p>
    </div>
  );
}
