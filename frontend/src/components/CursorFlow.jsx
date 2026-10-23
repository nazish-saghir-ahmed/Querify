import React, { useEffect, useRef } from 'react';

/**
 * High-performance fluid cursor flow effect.
 * Produces a glowing Midnight Blue & Pure White particle ribbon and fluid stream
 * that reacts organically to cursor velocity and direction.
 */
export default function CursorFlow() {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Respect user motion preferences and touch devices
    if (typeof window === 'undefined') return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (prefersReducedMotion || isTouchDevice) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Trail points for smooth ribbon spline
    const trail = [];
    const maxTrail = 20;

    // Fluid sparks/flow particles
    const particles = [];
    const maxParticles = 40;

    let mouse = { x: -200, y: -200, prevX: -200, prevY: -200, vx: 0, vy: 0 };
    let isMoving = false;
    let idleTimer = null;

    const handleMouseMove = (e) => {
      const currentX = e.clientX;
      const currentY = e.clientY;

      const vx = currentX - (mouse.x === -200 ? currentX : mouse.x);
      const vy = currentY - (mouse.y === -200 ? currentY : mouse.y);
      const speed = Math.hypot(vx, vy);

      mouse.prevX = mouse.x;
      mouse.prevY = mouse.y;
      mouse.x = currentX;
      mouse.y = currentY;
      mouse.vx = vx;
      mouse.vy = vy;

      isMoving = true;
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        isMoving = false;
      }, 120);

      // Add to ribbon trail
      trail.unshift({
        x: currentX,
        y: currentY,
        age: 1,
        width: Math.min(10, 3 + speed * 0.18),
      });
      if (trail.length > maxTrail) {
        trail.pop();
      }

      // Spawn fluid flow droplets along motion vector
      if (speed > 1.5 && particles.length < maxParticles) {
        const count = Math.min(3, Math.ceil(speed / 6));
        for (let i = 0; i < count; i++) {
          const angle = Math.atan2(vy, vx) + (Math.random() - 0.5) * 1.2;
          const particleSpeed = (Math.random() * 1.5 + 0.5) * (speed * 0.1);
          const isWhiteSpark = Math.random() > 0.6;

          particles.push({
            x: currentX + (Math.random() - 0.5) * 6,
            y: currentY + (Math.random() - 0.5) * 6,
            vx: -Math.cos(angle) * particleSpeed * 0.3 + (Math.random() - 0.5) * 0.6,
            vy: -Math.sin(angle) * particleSpeed * 0.3 + (Math.random() - 0.5) * 0.6,
            size: isWhiteSpark ? Math.random() * 2.5 + 1.2 : Math.random() * 3.5 + 1.8,
            alpha: 0.9,
            decay: Math.random() * 0.035 + 0.02,
            isWhite: isWhiteSpark,
          });
        }
      }
    };

    const handleMouseLeave = () => {
      isMoving = false;
      trail.length = 0;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    // Animation Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw smooth fluid flowing ribbon
      if (trail.length > 2) {
        for (let i = 0; i < trail.length - 1; i++) {
          const p1 = trail[i];
          const p2 = trail[i + 1];

          // Fade out older trail segments
          p1.age *= 0.88;

          ctx.save();
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);

          // Midnight Blue gradient with crisp White core
          const alpha = p1.age * 0.45;
          ctx.strokeStyle = i % 2 === 0
            ? `rgba(59, 130, 246, ${alpha})`
            : `rgba(255, 255, 255, ${alpha * 0.85})`;
          ctx.lineWidth = Math.max(0.5, p1.width * p1.age);
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.shadowColor = '#2563EB';
          ctx.shadowBlur = 12;
          ctx.stroke();
          ctx.restore();
        }

        // Taper tail
        if (!isMoving && trail.length > 0) {
          trail.pop();
        }
      }

      // 2. Render & update fluid flow droplets/sparks
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96;
        p.vy *= 0.96;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.alpha, 0, Math.PI * 2);

        if (p.isWhite) {
          ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
          ctx.shadowColor = '#FFFFFF';
          ctx.shadowBlur = 10;
        } else {
          ctx.fillStyle = `rgba(37, 99, 235, ${p.alpha * 0.9})`;
          ctx.shadowColor = '#1D4ED8';
          ctx.shadowBlur = 12;
        }
        ctx.fill();
        ctx.restore();
      }

      // 3. Head glowing pointer flow droplet
      if (isMoving && mouse.x > 0 && mouse.y > 0) {
        ctx.save();
        const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 14);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
        grad.addColorStop(0.3, 'rgba(59, 130, 246, 0.4)');
        grad.addColorStop(1, 'rgba(37, 99, 235, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(idleTimer);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
      style={{ pointerEvents: 'none' }}
      aria-hidden="true"
    />
  );
}
