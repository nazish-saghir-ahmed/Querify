import React from 'react';
import BrandLogo from './BrandLogo';
import { Database, Terminal, History, Info, Sparkles, ArrowRight } from 'lucide-react';

/**
 * Premium Royal Developer Navigation Bar
 * Features translucent glass styling with Royal Blue and Royal Gold accents.
 */
export default function Navbar({ activeTab, setActiveTab, health }) {
  const navItems = [
    { id: 'landing', label: 'Overview', icon: null },
    { id: 'workspace', label: 'Console', icon: Terminal },
    { id: 'explorer', label: 'DB Explorer', icon: Database },
    { id: 'history', label: 'Audit Trail', icon: History },
    { id: 'about', label: 'Architecture & Viva', icon: Info },
  ];

  const isConnected = health?.databaseConnected;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#415A77]/30 bg-[#0D1B2A]/75 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="cursor-pointer" onClick={() => setActiveTab('landing')}>
          <BrandLogo size="md" showTagline={false} />
        </div>

        {/* Navigation Tabs in Frosted Glass Container */}
        <nav className="hidden md:flex items-center gap-1 bg-[#1B263B]/50 backdrop-blur-md p-1 rounded-xl border border-[#415A77]/35 shadow-inner">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium tracking-wide transition-all duration-200 ${
                  isActive
                    ? 'bg-[#0D1B2A]/80 text-[#F7F3E9] border border-blue-500/60 shadow-[0_0_15px_-4px_rgba(37,99,235,0.45)]'
                    : 'text-slate-400 hover:text-[#F7F3E9] hover:bg-white/[0.04]'
                }`}
              >
                {Icon && (
                  <Icon 
                    className={`w-3.5 h-3.5 transition-colors ${
                      isActive ? 'text-blue-400' : 'text-slate-400'
                    }`} 
                  />
                )}
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Status Indicators & Action */}
        <div className="flex items-center gap-3">
          {/* Active Engine Pill in Frosted Glass */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[#1B263B]/60 backdrop-blur-md border border-[#415A77]/35 text-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-[#3B82F6]" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2563EB]" />
            </span>
            <span className="text-[#F7F3E9] font-mono text-[11px]">
              {health ? (health.aiMode === 'live' ? 'Gemini 1.5/2.0' : 'Demo Engine') : 'Edge Ready'}
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#0D1B2A]/60 text-[#D4AF37] border border-[#D4AF37]/30">
              {isConnected ? 'MySQL 8' : 'Client Edge'}
            </span>
          </div>

          {/* Direct CTA */}
          {activeTab !== 'workspace' ? (
            <button
              onClick={() => setActiveTab('workspace')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-xs font-semibold tracking-wide transition-all duration-200 shadow-[0_0_20px_-3px_rgba(37,99,235,0.5)] border border-blue-400/40"
            >
              <span>Query Console</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('explorer')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1B263B]/60 hover:bg-[#1B263B] text-[#F7F3E9] border border-[#415A77]/35 text-xs font-medium tracking-wide transition-all"
            >
              <Database className="w-3.5 h-3.5 text-blue-400" />
              <span>Explore Schema</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
