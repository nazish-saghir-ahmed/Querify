import React from 'react';

/**
 * Fixed, performant background layer displaying the bespoke AI + Database artwork.
 * Remains stationary while the application content scrolls smoothly in front.
 * Uses CSS overlays, technical grids, and atmospheric vignettes to guarantee
 * maximum text readability without dimming the visual impact.
 */
export default function FixedHeroBackground() {
  return (
    <div 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* High-definition bespoke artwork */}
      <img
        src="/hero-ai-database-bg.jpg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-center scale-105 opacity-[0.22] transition-transform duration-1000 ease-out"
        loading="eager"
      />

      {/* Atmospheric depth gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#06080D]/95 via-[#06080D]/75 to-[#06080D]/98" />
      
      {/* Radial spotlight from top center */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-[radial-gradient(ellipse_at_center,rgba(0,245,160,0.12),transparent_70%)] blur-2xl" />

      {/* Precision technical wireframe grid overlay */}
      <div className="absolute inset-0 bg-tech-grid opacity-35" />

      {/* Peripheral edge vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,#06080D_95%)]" />
    </div>
  );
}
