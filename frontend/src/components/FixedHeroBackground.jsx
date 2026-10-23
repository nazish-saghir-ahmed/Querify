import React from 'react';

/**
 * Fixed, performant background layer displaying the bespoke AI + Database artwork.
 * Uses Royal Navy & Slate depth overlays (#0D1B2A, #1B263B) with Royal Blue and Gold spotlights.
 * Transparent frosted glass boxes hover in front of this layer so it subtly shines through.
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
        className="absolute inset-0 w-full h-full object-cover object-center scale-105 opacity-[0.28] transition-transform duration-1000 ease-out"
        loading="eager"
      />

      {/* Royal Navy atmospheric depth gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0D1B2A]/90 via-[#0D1B2A]/70 to-[#0D1B2A]/95" />
      
      {/* Royal Blue spotlight from top center */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[1100px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.18),transparent_70%)] blur-3xl" />

      {/* Subtle Royal Gold accent corona */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[350px] bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.08),transparent_65%)] blur-3xl" />

      {/* Precision technical wireframe grid overlay in steel blue */}
      <div className="absolute inset-0 bg-tech-grid opacity-40" />

      {/* Peripheral royal navy edge vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,#0D1B2A_95%)]" />
    </div>
  );
}
