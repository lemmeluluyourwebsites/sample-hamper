import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas';
import { Sparkles, Camera, RotateCcw, Heart, Send, Check, Share2, X, Download, Loader2 } from 'lucide-react';
import { playPetalPluckSound, playBonusChime, playPopSound } from '../../utils/audio';

export default function PetalByPetal() {
  // Generate random total petals between 30 and 35
  const generateRandomPetals = useCallback(() => {
    const total = Math.floor(Math.random() * 6) + 30; // 30, 31, 32, 33, 34, or 35
    return Array.from({ length: total }, (_, index) => ({
      id: index,
      angle: (index * 360) / total,
      isDetached: false,
      driftX: 0,
      driftY: 0,
    }));
  }, []);

  const [petals, setPetals] = useState(generateRandomPetals);
  const [firstPhrase, setFirstPhrase] = useState(null); // 'I love him more' or 'He loves me more'
  const [lastPluckedText, setLastPluckedText] = useState(null);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [winnerText, setWinnerText] = useState('');
  const [isCapturing, setIsCapturing] = useState(false);
  const [shareStatus, setShareStatus] = useState(null);

  const dragStartPos = useRef({});
  const captureCardRef = useRef(null);

  const handlePointerDown = (index, e) => {
    dragStartPos.current[index] = {
      x: e.clientX,
      y: e.clientY,
      time: Date.now(),
    };
  };

  // TRUE OUTWARD SWIPE: Petal only detaches when swiped outward past threshold
  const handlePointerMove = (index, e) => {
    const start = dragStartPos.current[index];
    if (!start || petals[index].isDetached) return;

    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    const distance = Math.hypot(dx, dy);

    if (distance > 22) {
      delete dragStartPos.current[index];
      detachPetal(index, dx, dy);
    }
  };

  const handlePointerUp = (index) => {
    delete dragStartPos.current[index];
  };

  const detachPetal = (index, swipeDx, swipeDy) => {
    if (petals[index].isDetached) return;

    playPetalPluckSound();

    const currentlyDetachedCount = petals.filter((p) => p.isDetached).length;
    let assignedText = '';

    // First petal randomly sets starting phrase
    if (currentlyDetachedCount === 0) {
      const initial = Math.random() < 0.5 ? 'I love him more' : 'He loves me more';
      setFirstPhrase(initial);
      assignedText = initial;
    } else {
      // Subsequent petals strictly alternate
      const initial = firstPhrase;
      const other = initial === 'I love him more' ? 'He loves me more' : 'I love him more';
      assignedText = currentlyDetachedCount % 2 === 0 ? initial : other;
    }

    setLastPluckedText(assignedText);

    const remainingCount = petals.length - currentlyDetachedCount - 1;

    setPetals((prev) => {
      const next = [...prev];
      next[index] = {
        ...next[index],
        isDetached: true,
        driftX: swipeDx * 2.8,
        driftY: swipeDy * 2.8,
      };
      return next;
    });

    // When the final petal is detached (remainingCount === 0)
    if (remainingCount === 0) {
      setWinnerText(assignedText);
      playBonusChime();
      confetti({
        particleCount: 110,
        spread: 95,
        origin: { y: 0.55 },
        colors: ['#ff85a1', '#ffd1dc', '#ffffff', '#ec4899', '#f472b6'],
      });

      setTimeout(() => {
        setShowWinnerModal(true);
      }, 750);
    }
  };

  const handleTakeScreenshot = async () => {
    if (!captureCardRef.current || isCapturing) return;
    setIsCapturing(true);
    setShareStatus('Snapping screenshot...');
    playPopSound();

    try {
      const canvas = await html2canvas(captureCardRef.current, {
        backgroundColor: '#120716',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
      });

      const dataUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = dataUrl;
      downloadLink.download = `our-love-verdict-${Date.now()}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      playBonusChime();
      setShareStatus('Screenshot saved to your photos! 📸✨');
      setTimeout(() => setShareStatus(null), 4000);
    } catch (err) {
      console.error('Screenshot failed:', err);
      setShareStatus('Screenshot ready! You can also take a quick screen capture 📸');
      setTimeout(() => setShareStatus(null), 4000);
    } finally {
      setIsCapturing(false);
    }
  };

  const handleSendToHim = async () => {
    if (!captureCardRef.current || isCapturing) return;
    setIsCapturing(true);
    setShareStatus('Preparing keepsake...');
    playPopSound();

    const shareText = `Official verdict from our Cozy Hamper: ${winnerText}! 💖🌸 Screenshot proof ready!`;

    try {
      const canvas = await html2canvas(captureCardRef.current, {
        backgroundColor: '#120716',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
      });

      const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
      let sharedViaNative = false;

      if (blob && navigator.canShare) {
        const file = new File([blob], 'our-love-verdict.png', { type: 'image/png' });
        if (navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              title: 'Official Love Verdict 💕',
              text: shareText,
              files: [file],
            });
            sharedViaNative = true;
            playBonusChime();
            setShareStatus('Sent to him! 💌✨');
            setTimeout(() => setShareStatus(null), 3500);
          } catch (shareErr) {
            if (shareErr.name !== 'AbortError') {
              console.warn('Native file share failed:', shareErr);
            }
          }
        }
      }

      if (!sharedViaNative) {
        // Download the screenshot image
        const dataUrl = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.href = dataUrl;
        downloadLink.download = 'our-love-verdict.png';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        // Open WhatsApp or messaging app link
        const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
        window.open(whatsappUrl, '_blank');

        playBonusChime();
        setShareStatus('Screenshot saved & opening chat to send! 💌');
        setTimeout(() => setShareStatus(null), 4500);
      }
    } catch (err) {
      console.error('Send to him failed:', err);
      const fallbackUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
      window.open(fallbackUrl, '_blank');
      setShareStatus('Opening chat to share your love verdict! 💌');
      setTimeout(() => setShareStatus(null), 4000);
    } finally {
      setIsCapturing(false);
    }
  };

  const handleResetFlower = () => {
    playPopSound();
    setPetals(generateRandomPetals());
    setFirstPhrase(null);
    setLastPluckedText(null);
    setShowWinnerModal(false);
    setWinnerText('');
    setShareStatus(null);
  };

  return (
    <div className="w-full flex flex-col items-center select-none">
      {/* Header Bar */}
      <div className="w-full flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-1.5 text-xs text-pink-200/80 font-medium">
          <Heart className="w-3.5 h-3.5 text-[#ff85a1] fill-[#ff85a1]" />
          <span>Sunflower Bloom</span>
        </div>

        <button
          onClick={handleResetFlower}
          className="min-h-[44px] px-3.5 py-1.5 rounded-full bg-pink-500/15 border border-pink-400/30 text-xs font-semibold text-pink-200 hover:text-white flex items-center gap-1.5 cursor-pointer active:scale-95 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Regrow Bloom</span>
        </button>
      </div>

      {/* Realistic Flower Arena */}
      <div
        style={{ touchAction: 'pan-y' }}
        className="relative w-full aspect-square max-w-[370px] rounded-3xl overflow-hidden glass-card border border-pink-400/30 shadow-[0_4px_30px_rgba(255,133,161,0.25)] flex items-center justify-center bg-gradient-to-b from-black via-[#0d0711] to-black"
      >
        {/* Soft floral glow */}
        <div className="absolute w-56 h-56 bg-pink-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Center Botanical Seed Core */}
        <div className="relative z-10 w-22 h-22 rounded-full border-2 border-amber-400/40 shadow-[inset_0_0_15px_rgba(0,0,0,0.85),0_0_20px_rgba(245,158,11,0.3)] flex items-center justify-center bg-gradient-to-tr from-amber-950 via-amber-800 to-amber-700 overflow-hidden">
          <div className="absolute inset-0 opacity-45 bg-[radial-gradient(#fde68a_1px,transparent_1px)] [background-size:5px_5px]" />
          <div className="w-14 h-14 rounded-full border border-amber-400/30 bg-amber-950/70 flex items-center justify-center shadow-inner">
            <span className="text-lg select-none">🌻</span>
          </div>
        </div>

        {/* 30-35 Realistic Botanical Petals */}
        {petals.map((petal, index) => {
          const rad = (petal.angle * Math.PI) / 180;
          const distance = 86;
          const x = Math.cos(rad) * distance;
          const y = Math.sin(rad) * distance;

          return (
            <AnimatePresence key={petal.id}>
              {!petal.isDetached ? (
                <div
                  onPointerDown={(e) => handlePointerDown(index, e)}
                  onPointerMove={(e) => handlePointerMove(index, e)}
                  onPointerUp={() => handlePointerUp(index)}
                  onPointerLeave={() => handlePointerUp(index)}
                  style={{
                    position: 'absolute',
                    left: `calc(50% + ${x}px - 10px)`,
                    top: `calc(50% + ${y}px - 44px)`,
                    transform: `rotate(${petal.angle + 90}deg)`,
                    touchAction: 'none',
                  }}
                  className="z-20 cursor-grab active:cursor-grabbing select-none"
                >
                  <svg width="20" height="88" viewBox="0 0 20 88" className="filter drop-shadow-[0_2px_5px_rgba(255,133,161,0.35)]">
                    <defs>
                      <linearGradient id={`petalGrad-${petal.id}`} x1="0%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" stopColor="#ffd1dc" stopOpacity="0.85" />
                        <stop offset="50%" stopColor="#ff85a1" stopOpacity="0.95" />
                        <stop offset="100%" stopColor="#f472b6" stopOpacity="1" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 10,0 C 19,20 20,62 10,88 C 0,62 1,20 10,0 Z"
                      fill={`url(#petalGrad-${petal.id})`}
                      stroke="rgba(255,255,255,0.7)"
                      strokeWidth="0.75"
                    />
                    <line x1="10" y1="12" x2="10" y2="76" stroke="rgba(255,255,255,0.4)" strokeWidth="0.7" />
                  </svg>
                </div>
              ) : (
                <motion.div
                  key={`detached-${petal.id}`}
                  initial={{
                    x: x,
                    y: y,
                    scale: 1,
                    opacity: 1,
                    rotate: petal.angle + 90,
                  }}
                  animate={{
                    x: x + petal.driftX,
                    y: y + petal.driftY + 110,
                    scale: 0.45,
                    opacity: 0,
                    rotate: petal.angle + 90 + 150,
                  }}
                  transition={{ duration: 1.3, ease: 'easeOut' }}
                  className="absolute z-10 pointer-events-none"
                >
                  <svg width="18" height="78" viewBox="0 0 20 88">
                    <path
                      d="M 10,0 C 19,20 20,62 10,88 C 0,62 1,20 10,0 Z"
                      fill="#f472b6"
                      opacity="0.75"
                    />
                  </svg>
                </motion.div>
              )}
            </AnimatePresence>
          );
        })}
      </div>

      {/* PROMINENT HIGHLIGHTED PHRASE DIRECTLY AT THE BOTTOM OF THE FLOWER */}
      <div className="w-full max-w-[370px] mt-3 flex flex-col items-center">
        {lastPluckedText ? (
          <motion.div
            key={lastPluckedText + petals.filter((p) => p.isDetached).length}
            initial={{ scale: 0.85, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-pink-500/25 via-pink-400/35 to-rose-500/25 border-2 border-pink-400 text-center shadow-[0_0_25px_rgba(255,133,161,0.5)]"
          >
            <div className="text-base sm:text-lg font-bold text-white tracking-wide flex items-center justify-center gap-2">
              <span className="text-xl">🌸</span>
              <span className="text-pink-glow">{lastPluckedText}</span>
              <span className="text-xl">💖</span>
            </div>
          </motion.div>
        ) : (
          <div className="w-full py-2 px-3 rounded-xl bg-pink-500/10 border border-pink-400/20 text-center">
            <span className="text-xs text-pink-200/80 font-medium">
              Swipe petals outward into the breeze to reveal love verdicts 💕
            </span>
          </div>
        )}
      </div>

      {/* Finishing Victory Moment: Dedicated Couple Keepsake, Real Screenshot, and Send to Him */}
      <AnimatePresence>
        {showWinnerModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 30 }}
              transition={{ type: 'spring', damping: 22, stiffness: 280 }}
              className="relative w-full max-w-sm max-h-[92vh] overflow-y-auto glass-panel rounded-3xl p-4 sm:p-5 border-2 border-pink-400 shadow-[0_0_50px_rgba(255,133,161,0.5)] text-center"
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  playPopSound();
                  setShowWinnerModal(false);
                }}
                className="absolute top-3 right-3 z-30 p-2 rounded-full text-pink-300/60 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* CAPTURABLE KEEPSAKE CARD (Used by html2canvas for screenshot & sharing) */}
              <div
                ref={captureCardRef}
                className="w-full rounded-2xl p-3.5 bg-[#14081c] border border-pink-400/40 shadow-inner flex flex-col items-center"
              >
                {/* Couple Keepsake Polaroid Frame feature */}
                <div className="w-full max-w-[230px] p-2.5 rounded-2xl bg-white shadow-2xl mb-3.5 transform -rotate-1 border border-pink-200">
                  <div className="w-full h-44 rounded-xl overflow-hidden bg-neutral-900 border border-neutral-200">
                    <img
                      src="/assets/photo-2.jpg"
                      crossOrigin="anonymous"
                      alt="Couple special memory"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/assets/photo2.jpg';
                      }}
                    />
                  </div>
                  <div className="mt-2 text-center text-xs font-serif font-bold text-neutral-800 tracking-wide">
                    Our Forever Bloom 🌸
                  </div>
                </div>

                {/* Verified Verdict & Text */}
                {winnerText === 'I love him more' ? (
                  <>
                    <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-pink-500/20 border border-pink-400/40 text-xs font-bold text-[#ff85a1] mb-1.5">
                      <Sparkles className="w-3.5 h-3.5 fill-[#ff85a1]" />
                      <span>Official Verified Verdict 🏆</span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-1.5">
                      You Love Him More! 💖
                    </h3>

                    <div className="p-3.5 rounded-xl bg-gradient-to-r from-pink-900/50 to-rose-900/50 border border-pink-400/50 my-2 text-xs sm:text-sm font-semibold text-pink-100 shadow-[0_0_15px_rgba(255,133,161,0.3)]">
                      "Screenshot this and send this to your boyfriend to let him know that you love him more! 📸"
                    </div>
                  </>
                ) : (
                  <>
                    <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-pink-500/20 border border-pink-400/40 text-xs font-bold text-[#ff85a1] mb-1.5">
                      <Heart className="w-3.5 h-3.5 fill-[#ff85a1]" />
                      <span>He Loves You More! 🧸</span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-1.5">
                      He Loves You Endlessly! 💕
                    </h3>

                    <p className="text-xs text-pink-200/80 my-2 px-2">
                      The petals have spoken, his heart overflows with infinite warmth and love for you every day.
                    </p>
                  </>
                )}

                <div className="mt-1 text-[10px] text-pink-300/60 font-medium tracking-wider">
                  Digital Cozy Hamper 🌸 Forever & Always
                </div>
              </div>

              {/* Status Message / Notification */}
              {shareStatus && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 px-3 py-1.5 rounded-xl bg-pink-500/20 border border-pink-400/40 text-xs text-pink-200 font-semibold"
                >
                  {shareStatus}
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 mt-3.5">
                {/* Main Action: Send it to him */}
                <button
                  disabled={isCapturing}
                  onClick={handleSendToHim}
                  className="w-full min-h-[48px] rounded-2xl bg-gradient-to-r from-[#ff85a1] via-[#f472b6] to-[#ec4899] text-black font-bold text-sm shadow-[0_0_25px_rgba(255,133,161,0.5)] hover:shadow-[0_0_35px_rgba(255,133,161,0.7)] flex items-center justify-center gap-2 cursor-pointer active:scale-98 transition disabled:opacity-60"
                >
                  {isCapturing ? (
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                  ) : (
                    <Send className="w-4 h-4 text-black fill-black" />
                  )}
                  <span>Send it to him 💌</span>
                </button>

                {/* Secondary Row: Take Screenshot & Bloom Again */}
                <div className="flex gap-2">
                  <button
                    disabled={isCapturing}
                    onClick={handleTakeScreenshot}
                    className="flex-1 min-h-[44px] rounded-2xl bg-pink-500/20 border border-pink-400/40 hover:bg-pink-500/30 text-white font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition disabled:opacity-60"
                  >
                    <Camera className="w-3.5 h-3.5 text-[#ff85a1]" />
                    <span>Take Screenshot 📸</span>
                  </button>

                  <button
                    onClick={handleResetFlower}
                    className="flex-1 min-h-[44px] rounded-2xl bg-pink-500/10 border border-pink-400/25 hover:bg-pink-500/20 text-pink-200 hover:text-white font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Bloom Again 🔄</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
