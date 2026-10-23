import React, { useEffect, useRef } from 'react';

/**
 * Lightweight, high-performance Canvas-based cursor trail.
 * Renders a subtle stream of luminous Royal Blue (#3B82F6) and Royal Gold (#D4AF37) particles
 * that follow the user's pointer with fluid damping and decay.
 *
 * Automatically disabled on touch/coarse devices and when prefers-reduced-motion is active.
 */
export default function CursorTrail() {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (prefersReducedMotion || isTouchDevice) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle pool
    const particles = [];
    const maxParticles = 24;
    let mouse = { x: -100, y: -100, prevX: -100, prevY: -100 };
    let isActive = false;

    const handleMouseMove = (e) => {
      mouse.prevX = mouse.x;
      mouse.prevY = mouse.y;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      isActive = true;

      // Add a couple of subtle particles on movement
      const speed = Math.hypot(mouse.x - mouse.prevX, mouse.y - mouse.prevY);
      if (speed > 1 && particles.length < maxParticles) {
        const isGold = Math.random() > 0.65;
        particles.push({
          x: mouse.x,
          y: mouse.y,
          size: Math.min(3.5, 1.2 + speed * 0.04),
          alpha: 0.65,
          decay: 0.025 + Math.random() * 0.015,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          isGold,
        });
      }
    };

    const handleMouseLeave = () => {
      isActive = false;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    // Animation Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render & update particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        if (p.isGold) {
          ctx.fillStyle = `rgba(212, 175, 55, ${p.alpha * 0.75})`;
          ctx.shadowColor = '#D4AF37';
        } else {
          ctx.fillStyle = `rgba(127, 161, 195, ${p.alpha * 0.65})`;
          ctx.shadowColor = '#1D3557';
        }
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
      }

      // Draw faint connecting thread between recent particles
      if (particles.length > 2) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(particles[0].x, particles[0].y);
        for (let i = 1; i < particles.length; i++) {
          ctx.lineTo(particles[i].x, particles[i].y);
        }
        ctx.strokeStyle = `rgba(59, 130, 246, 0.18)`;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
      style={{ pointerEvents: 'none' }}
    />
  );
}
