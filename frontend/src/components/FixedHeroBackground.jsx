import React from 'react';

export default function FixedHeroBackground() {
  return (
    <div 
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* High-definition background artwork at restrained subtle opacity */}
      <img
        src="/hero-ai-database-bg.jpg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-center scale-105 opacity-[0.10] transition-opacity duration-1000"
        loading="eager"
      />

      {/* Deep Midnight Blue atmospheric depth overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#080D1A]/95 via-[#080D1A]/85 to-[#080D1A]" />
      
      {/* Subtle Midnight Blue spotlight */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.12),transparent_70%)] blur-3xl" />

      {/* Subtle grid in Midnight Blue */}
      <div className="absolute inset-0 bg-subtle-grid opacity-30" />

      {/* Peripheral edge vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,#080D1A_95%)]" />
    </div>
  );
}
