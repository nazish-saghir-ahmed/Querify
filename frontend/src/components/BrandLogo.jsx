import React from 'react';

export default function BrandLogo({ size = 'md', showTagline = false }) {
  const sizeClasses = {
    sm: 'h-7 w-7 text-lg',
    md: 'h-9 w-9 text-xl',
    lg: 'h-12 w-12 text-3xl',
  };

  return (
    <div className="flex items-center gap-3 group select-none">
      {/* Animated glowing brand mark */}
      <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-400 p-[2px] shadow-neon-violet group-hover:shadow-neon-cyan transition-all duration-300`}>
        <div className="w-full h-full bg-[#080B14] rounded-[10px] flex items-center justify-center p-1.5">
          <svg className={sizeClasses[size].split(' ')[0] + ' ' + sizeClasses[size].split(' ')[1]} viewBox="0 0 100 100" fill="none">
            <ellipse cx="50" cy="30" rx="36" ry="12" stroke="url(#logoGrad)" strokeWidth="6" fill="#151E30" />
            <path d="M14 30 v20 c0 6.6 16.1 12 36 12 s36 -5.4 36 -12 v-20" stroke="url(#logoGrad)" strokeWidth="6" fill="none" />
            <path d="M14 50 v20 c0 6.6 16.1 12 36 12 s36 -5.4 36 -12 v-20" stroke="url(#logoGrad)" strokeWidth="6" fill="none" />
            <circle cx="68" cy="68" r="14" fill="#080B14" stroke="#22D3EE" strokeWidth="4" />
            <path d="M68 62 L69.5 66.5 L74 68 L69.5 69.5 L68 74 L66.5 69.5 L62 68 L66.5 66.5 Z" fill="#22D3EE" />
            <defs>
              <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#22D3EE" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={`font-extrabold tracking-tight font-sans text-white ${sizeClasses[size].split(' ')[2]}`}>
            Queri<span className="text-cyan-400">fy</span>
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
            Engine
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
