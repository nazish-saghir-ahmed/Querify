import React from 'react';

export default function BrandLogo({ size = 'md', showTagline = false }) {
  const sizeClasses = {
    sm: 'h-6 w-6 text-base',
    md: 'h-8 w-8 text-lg',
    lg: 'h-10 w-10 text-xl',
  };

  return (
    <div className="flex items-center gap-2.5 group select-none cursor-pointer">
      {/* Precision Geometric Brand Mark */}
      <div className="relative flex items-center justify-center rounded-xl bg-[#111827] border border-[#1F2E47] group-hover:border-blue-500/50 p-1.5 shadow-sm transition-all duration-200">
        <svg 
          className={sizeClasses[size].split(' ')[0] + ' ' + sizeClasses[size].split(' ')[1]} 
          viewBox="0 0 100 100" 
          fill="none"
        >
          {/* Database Stack in Royal Blue & Slate */}
          <ellipse cx="50" cy="28" rx="34" ry="11" stroke="#3B82F6" strokeWidth="6" fill="#0B0F17" />
          <path d="M16 28 v18 c0 6 15 11 34 11 s34 -5 34 -11 v-18" stroke="#3B82F6" strokeWidth="5.5" fill="none" opacity="0.85" />
          <path d="M16 46 v18 c0 6 15 11 34 11 s34 -5 34 -11 v-18" stroke="#2563EB" strokeWidth="5.5" fill="none" opacity="0.9" />
          
          {/* Intelligence Core Spark in Pure White & Midnight Blue */}
          <circle cx="70" cy="70" r="14" fill="#0C152B" stroke="#2563EB" strokeWidth="3" />
          <path 
            d="M70 61 L72.5 67.5 L79 70 L72.5 72.5 L70 79 L67.5 72.5 L61 70 L67.5 67.5 Z" 
            fill="#FFFFFF" 
          />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className={`font-display font-black tracking-tight text-white ${sizeClasses[size].split(' ')[2]}`}>
            Queri<span className="text-blue-400 font-black">fy</span>
          </span>
          <span className="text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-600/30 text-white border border-blue-400/50 shadow-sm">
            SQL AI
          </span>
        </div>
        {showTagline && (
          <span className="text-[11px] text-slate-200 font-mono font-medium tracking-wide -mt-0.5">
            Ask in English. Get the right SQL.
          </span>
        )}
      </div>
    </div>
  );
}
