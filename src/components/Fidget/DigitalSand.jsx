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
];

export default function DigitalSand() {
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const particlesRef = useRef([]);
  const tiltRef = useRef({ gx: 0, gy: 0.5 });
  const [gyroActive, setGyroActive] = useState(false);
  const [particleCount, setParticleCount] = useState(0);

  // Initialize sand particles
  const initSand = (width, height) => {
    const count = 550;
    const particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * (height * 0.8),
        vx: 0,
        vy: Math.random() * 2 + 1,
        radius: Math.random() * 2.2 + 1.6,
        color: NATURAL_SAND_PALETTE[Math.floor(Math.random() * NATURAL_SAND_PALETTE.length)],
        settled: false,
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
        // gamma is left-to-right (-90 to 90)
        // beta is front-to-back (-180 to 180)
        const gx = Math.max(-1, Math.min(1, event.gamma / 45));
        const gy = Math.max(-1, Math.min(1, (event.beta - 30) / 45));
        tiltRef.current = { gx, gy: Math.max(0.2, gy) };
      }
    };

    window.addEventListener('deviceorientation', handleOrientation);

    // Sand Simulation Loop
    const ctx = canvas.getContext('2d');
    let lastTime = performance.now();

    const updatePhysics = (time) => {
      const dt = Math.min(0.04, (time - lastTime) / 1000);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      const particles = particlesRef.current;
      const { gx, gy } = tiltRef.current;

      // Gravity strength
      const gravityX = gx * 240;
      const gravityY = Math.max(80, gy * 320);

      // Render and update each sand grain
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Apply forces
        p.vx += gravityX * dt;
        p.vy += gravityY * dt;

        // Air drag
        p.vx *= 0.94;
        p.vy *= 0.94;

        // Position update
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        // Floor collision
        if (p.y > height - p.radius) {
          p.y = height - p.radius;
          p.vy *= -0.25;
          p.vx += (Math.random() - 0.5) * 15 * gx; // natural pile slumping
        }

        // Left / Right wall bounce & bounds
        if (p.x < p.radius) {
          p.x = p.radius;
          p.vx *= -0.25;
        } else if (p.x > width - p.radius) {
          p.x = width - p.radius;
          p.vx *= -0.25;
        }

        // Draw natural sand grain
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

  // Pointer drag to tilt sand simulation (great for desktop or manual tilting)
  const handlePointerMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    tiltRef.current = {
      gx: nx * 1.8,
      gy: Math.max(0.3, (ny + 0.5) * 1.5),
    };
  };

  const handlePointerDown = (e) => {
    // Add fresh grains of sand at touch location
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    for (let k = 0; k < 12; k++) {
      particlesRef.current.push({
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 20,
        vx: (Math.random() - 0.5) * 40,
        vy: Math.random() * 50 + 20,
        radius: Math.random() * 2.2 + 1.6,
        color: NATURAL_SAND_PALETTE[Math.floor(Math.random() * NATURAL_SAND_PALETTE.length)],
        settled: false,
      });
    }
    setParticleCount(particlesRef.current.length);
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
      {/* Header bar */}
      <div className="w-full flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-1.5 text-xs text-pink-200/80 font-medium">
          <Compass className="w-3.5 h-3.5 text-amber-300" />
          <span>
            {gyroActive ? 'Gyroscope Active' : 'Tilt phone or drag finger'} ({particleCount} grains)
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

      {/* Sand Canvas with strict natural sand aesthetic */}
      <div className="relative w-full h-[380px] sm:h-[440px] rounded-3xl overflow-hidden glass-card border border-neutral-700/50 shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
        <canvas
          ref={canvasRef}
          onPointerMove={handlePointerMove}
          onPointerDown={handlePointerDown}
          style={{ touchAction: 'none' }}
          className="w-full h-full cursor-grab bg-neutral-950"
        />

        <div className="absolute bottom-3 left-0 right-0 text-center pointer-events-none">
          <p className="text-[11px] text-amber-200/50">
            Tilt phone or swipe screen • Natural granular dune simulation
          </p>
        </div>
      </div>
    </div>
  );
}
