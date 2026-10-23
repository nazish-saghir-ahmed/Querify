import React from 'react';

/**
 * Royal Developer Brand Logo
 * Features a bespoke architectural database cylinder fused with an intelligent gold diamond,
 * rendered in deep royal navy (#0D1B2A), royal blue (#2563EB), and prestigious royal gold (#D4AF37).
 */
export default function BrandLogo({ size = 'md', showTagline = false }) {
  const sizeClasses = {
    sm: 'h-7 w-7 text-lg',
    md: 'h-9 w-9 text-xl',
    lg: 'h-11 w-11 text-2xl',
  };

  return (
    <div className="flex items-center gap-3 group select-none cursor-pointer">
      {/* Precision Royal Geometric Brand Mark */}
      <div className="relative flex items-center justify-center rounded-xl bg-[#1B263B]/60 backdrop-blur-md border border-[#415A77]/40 group-hover:border-[#D4AF37]/50 p-2 shadow-sm transition-all duration-300">
        <svg 
          className={sizeClasses[size].split(' ')[0] + ' ' + sizeClasses[size].split(' ')[1]} 
          viewBox="0 0 100 100" 
          fill="none"
        >
          {/* Database Stack in Royal Blue & Slate */}
          <ellipse cx="50" cy="28" rx="34" ry="11" stroke="#3B82F6" strokeWidth="5" fill="#0D1B2A" />
          <path d="M16 28 v18 c0 6 15 11 34 11 s34 -5 34 -11 v-18" stroke="#415A77" strokeWidth="4.5" fill="none" opacity="0.85" />
          <path d="M16 46 v18 c0 6 15 11 34 11 s34 -5 34 -11 v-18" stroke="#2563EB" strokeWidth="4.5" fill="none" opacity="0.75" />
          
          {/* Intelligence Core Diamond Spark in Royal Gold */}
          <circle cx="70" cy="70" r="15" fill="#0D1B2A" stroke="#D4AF37" strokeWidth="3" />
          <path 
            d="M70 61 L72.5 67.5 L79 70 L72.5 72.5 L70 79 L67.5 72.5 L61 70 L67.5 67.5 Z" 
            fill="#D4AF37" 
          />
        </svg>

        {/* Ambient Royal Gold pulse */}
        <div className="absolute inset-0 rounded-xl bg-[#D4AF37]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm pointer-events-none" />
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className={`font-semibold tracking-tight font-sans text-[#F7F3E9] ${sizeClasses[size].split(' ')[2]}`}>
            Queri<span className="text-[#3B82F6]">fy</span>
          </span>
          <span className="text-[10px] font-mono font-medium tracking-wider px-1.5 py-0.5 rounded-full bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/35">
            SQL AI
          </span>
        </div>
        {showTagline && (
          <span className="text-xs text-slate-400 font-medium tracking-wide">
            Ask in English. Understand your data.
          </span>
        )}
      </div>
    </div>
  );
}
