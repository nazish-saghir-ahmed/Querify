import React from 'react';

export default function FixedHeroBackground() {
  return (
    <div 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* High-definition background artwork at restrained subtle opacity */}
      <img
        src="/hero-ai-database-bg.jpg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-center scale-105 opacity-[0.14] transition-opacity duration-1000"
        loading="eager"
      />

      {/* Dark neutral atmospheric depth overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F17]/95 via-[#0B0F17]/80 to-[#0B0F17]" />
      
      {/* Subtle blue accent spotlight */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.08),transparent_70%)] blur-3xl" />

      {/* Subtle grid */}
      <div className="absolute inset-0 bg-subtle-grid opacity-30" />

      {/* Peripheral edge vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,#0B0F17_95%)]" />
    </div>
  );
}
