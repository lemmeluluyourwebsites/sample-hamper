import React, { useRef, useEffect } from 'react';
import { Waves } from 'lucide-react';

export default function FluidCanvas() {
  const canvasRef = useRef(null);
  const ripplesRef = useRef([]);
  const animFrameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = canvas.parentElement.clientWidth);
    let height = (canvas.height = canvas.parentElement.clientHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // Ripple render loop
    let lastTime = performance.now();

    const render = (time) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      // Draw and update expanding, rapidly fading (0.5s) ripples
      const activeRipples = [];

      for (let i = 0; i < ripplesRef.current.length; i++) {
        const r = ripplesRef.current[i];
        r.age += dt;

        // Lifetime 0.5s
        if (r.age < 0.5) {
          const progress = r.age / 0.5;
          const radius = r.initialRadius + progress * 75;
          const opacity = Math.max(0, (1 - progress) * 0.85);

          ctx.save();
          ctx.beginPath();
          ctx.arc(r.x, r.y, radius, 0, Math.PI * 2);

          // Accent baby pink colored ripples
          ctx.strokeStyle = `rgba(255, 133, 161, ${opacity})`;
          ctx.lineWidth = Math.max(1, (1 - progress) * 5);
          ctx.shadowColor = 'rgba(255, 182, 193, 0.9)';
          ctx.shadowBlur = 15;
          ctx.stroke();

          // Second subtle outer echo ring
          if (progress > 0.15) {
            ctx.beginPath();
            ctx.arc(r.x, r.y, radius * 0.7, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(244, 114, 182, ${opacity * 0.5})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }

          ctx.restore();
          activeRipples.push(r);
        }
      }

      ripplesRef.current = activeRipples;
      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const addRipple = (clientX, clientY) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ripplesRef.current.push({
      x,
      y,
      initialRadius: 8,
      age: 0,
    });
  };

  const handlePointerMove = (e) => {
    addRipple(e.clientX, e.clientY);
  };

  const handlePointerDown = (e) => {
    addRipple(e.clientX, e.clientY);
  };

  return (
    <div className="relative w-full h-[360px] sm:h-[420px] rounded-3xl overflow-hidden glass-card border border-pink-400/25 flex flex-col shadow-[0_4px_30px_rgba(0,0,0,0.6)]">
      {/* Instructions header */}
      <div className="absolute top-3 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2">
          <Waves className="w-4 h-4 text-[#ff85a1]" />
          <span className="text-xs font-semibold text-white">Interactive Fluid Ripples</span>
        </div>
        <span className="text-[11px] text-pink-200/60 bg-black/40 px-2.5 py-1 rounded-full border border-pink-400/20">
          Touch or Drag
        </span>
      </div>

      {/* Ripple canvas with touch-action: pan-y to allow smooth page scroll */}
      <canvas
        ref={canvasRef}
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerDown}
        style={{ touchAction: 'pan-y' }}
        className="w-full h-full cursor-crosshair bg-gradient-to-b from-black via-[#0d0910] to-black"
      />

      <div className="absolute bottom-3 left-0 right-0 text-center pointer-events-none">
        <p className="text-[11px] text-pink-300/50">
          Glide your fingers across the dark pond to create glowing pink waves
        </p>
      </div>
    </div>
  );
}
