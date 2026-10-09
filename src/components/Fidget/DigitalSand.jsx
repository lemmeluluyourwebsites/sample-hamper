import React, { useRef, useEffect, useState } from 'react';
import { Compass, RotateCcw, Smartphone } from 'lucide-react';
import { playPopSound } from '../../utils/audio';

// STRICT COLOR RULE: Natural sand colors ONLY!
const NATURAL_SAND_PALETTE = [
  '#d2b48c', // Tan
  '#c2b280', // Sand
  '#e6d5ac', // Pale Golden Sand
  '#cbb994', // Desert Sand
  '#bca678', // Warm Dune
  '#ad9568', // Deep Grain
  '#9e8658', // Earthy Grain
];

export default function DigitalSand() {
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const particlesRef = useRef([]);
  const tiltRef = useRef({ gx: 0, gy: 1 });
  const [gyroActive, setGyroActive] = useState(false);
  const [particleCount, setParticleCount] = useState(0);

  // Initialize sand filled at least 1/4th of the container at the bottom
  const initSand = (width, height) => {
    const bottomQuarterY = height * 0.75;
    const count = 1600; // dense realistic granular volume
    const particles = [];

    for (let i = 0; i < count; i++) {
      const x = Math.random() * (width - 8) + 4;
      // Distributed across the bottom 25% of the container
      const y = bottomQuarterY + Math.random() * (height * 0.25 - 4);

      particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 5,
        vy: Math.random() * 5,
        radius: Math.random() * 1.4 + 1.1, // fine granular grains
        color: NATURAL_SAND_PALETTE[Math.floor(Math.random() * NATURAL_SAND_PALETTE.length)],
      });
    }

    particlesRef.current = particles;
    setParticleCount(count);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let width = (canvas.width = canvas.parentElement.clientWidth);
    let height = (canvas.height = canvas.parentElement.clientHeight);

    initSand(width, height);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // Device orientation handler
    const handleOrientation = (event) => {
      if (event.gamma !== null && event.beta !== null) {
        setGyroActive(true);
        // gamma is left/right tilt [-90, 90]
        // beta is front/back tilt [-180, 180]
        const gx = Math.max(-1.5, Math.min(1.5, event.gamma / 35));
        const gy = Math.max(0.1, Math.min(1.5, (event.beta - 25) / 35));
        tiltRef.current = { gx, gy };
      }
    };

    window.addEventListener('deviceorientation', handleOrientation);

    // Realistic granular physics loop
    const ctx = canvas.getContext('2d');
    let lastTime = performance.now();

    const updatePhysics = (time) => {
      const dt = Math.min(0.033, (time - lastTime) / 1000);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      const particles = particlesRef.current;
      const { gx, gy } = tiltRef.current;

      const gravityX = gx * 550;
      const gravityY = gy * 650;

      // Physics update with granular pile slumping & friction
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.vx += gravityX * dt;
        p.vy += gravityY * dt;

        // Granular friction & damping
        p.vx *= 0.92;
        p.vy *= 0.92;

        p.x += p.vx * dt;
        p.y += p.vy * dt;

        // Bottom floor collision with natural dune spreading
        if (p.y > height - p.radius - 1) {
          p.y = height - p.radius - 1;
          p.vy = 0;
          p.vx += (Math.random() - 0.5) * 8 * (gx !== 0 ? Math.sign(gx) : 1);
        }

        // Left boundary
        if (p.x < p.radius + 1) {
          p.x = p.radius + 1;
          p.vx *= -0.15;
        }
        // Right boundary
        else if (p.x > width - p.radius - 1) {
          p.x = width - p.radius - 1;
          p.vx *= -0.15;
        }

        // Draw individual realistic sand grain
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }

      animFrameRef.current = requestAnimationFrame(updatePhysics);
    };

    animFrameRef.current = requestAnimationFrame(updatePhysics);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('deviceorientation', handleOrientation);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Pointer drag to shift sand or stir grains
  const handlePointerMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;

    tiltRef.current = {
      gx: nx * 2.2,
      gy: Math.max(0.2, (ny + 0.6) * 1.6),
    };
  };

  const handlePointerDown = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Stir or add sand splash at touch coordinates
    const particles = particlesRef.current;
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const dist = Math.hypot(p.x - x, p.y - y);
      if (dist < 45) {
        p.vx += (p.x - x) * 5;
        p.vy -= 120 + Math.random() * 80;
      }
    }
  };

  const handleReset = () => {
    playPopSound();
    const canvas = canvasRef.current;
    if (!canvas) return;
    initSand(canvas.width, canvas.height);
  };

  const requestGyroPermission = async () => {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        const response = await DeviceOrientationEvent.requestPermission();
        if (response === 'granted') {
          setGyroActive(true);
        }
      } catch (err) {
        console.warn('Gyro permission error:', err);
      }
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Header bar with em dash */}
      <div className="w-full flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-1.5 text-xs text-pink-200/80 font-medium">
          <Compass className="w-3.5 h-3.5 text-amber-300" />
          <span>
            {gyroActive ? 'Gyroscope Active' : 'Tilt phone or swipe screen'} ({particleCount} grains)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function' && !gyroActive && (
            <button
              onClick={requestGyroPermission}
              className="min-h-[44px] px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-xs font-semibold text-amber-200 hover:text-white flex items-center gap-1 cursor-pointer transition active:scale-95"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Enable Tilt</span>
            </button>
          )}

          <button
            onClick={handleReset}
            className="min-h-[44px] px-3.5 py-1.5 rounded-full bg-pink-500/15 border border-pink-400/30 text-xs font-semibold text-pink-200 hover:text-white flex items-center gap-1.5 cursor-pointer transition active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Sand</span>
          </button>
        </div>
      </div>

      {/* Realistic granular sand container with bottom quarter filled at start */}
      <div className="relative w-full h-[380px] sm:h-[430px] rounded-3xl overflow-hidden glass-card border border-neutral-700/60 shadow-[0_4px_30px_rgba(0,0,0,0.85)]">
        <canvas
          ref={canvasRef}
          onPointerMove={handlePointerMove}
          onPointerDown={handlePointerDown}
          style={{ touchAction: 'none' }}
          className="w-full h-full cursor-grab bg-neutral-950"
        />

        <div className="absolute bottom-3 left-0 right-0 text-center pointer-events-none">
          <p className="text-[11px] text-amber-200/60">
            Bottom 1/4 filled with natural dune sand — shifts with gravity and phone tilt
          </p>
        </div>
      </div>
    </div>
  );
}
