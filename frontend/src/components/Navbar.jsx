import React from 'react';
import BrandLogo from './BrandLogo';
import { Database, Terminal, History, Info, Sparkles, ArrowRight } from 'lucide-react';

/**
 * Premium Developer Navigation Bar
 * Features refined tab pills with electric mint indicators, live system health,
 * and high-contrast typography in the style of Linear & Raycast.
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
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.07] bg-[#06080D]/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="cursor-pointer" onClick={() => setActiveTab('landing')}>
          <BrandLogo size="md" showTagline={false} />
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-[#0A0E17] p-1 rounded-xl border border-white/[0.08]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium tracking-wide transition-all duration-200 ${
                  isActive
                    ? 'bg-[#131B2A] text-white border border-[#00F5A0]/40 shadow-[0_0_15px_-4px_rgba(0,245,160,0.3)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                {Icon && (
                  <Icon 
                    className={`w-3.5 h-3.5 transition-colors ${
                      isActive ? 'text-[#00F5A0]' : 'text-slate-400'
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
          {/* Active Engine Pill */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F1523] border border-white/[0.08] text-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-[#00F5A0]" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00F5A0]" />
            </span>
            <span className="text-slate-300 font-mono text-[11px]">
              {health ? (health.aiMode === 'live' ? 'Gemini 1.5/2.0' : 'Demo Engine') : 'Edge Ready'}
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.04] text-slate-300 border border-white/[0.08]">
              {isConnected ? 'MySQL 8' : 'Client Edge'}
            </span>
          </div>

          {/* Direct CTA */}
          {activeTab !== 'workspace' ? (
            <button
              onClick={() => setActiveTab('workspace')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#00F5A0] hover:bg-[#00DF89] text-[#06080D] text-xs font-semibold tracking-wide transition-all duration-200 shadow-[0_0_20px_-3px_rgba(0,245,160,0.4)]"
            >
              <span>Query Console</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('explorer')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0F1523] hover:bg-[#131B2A] text-slate-200 border border-white/[0.08] text-xs font-medium tracking-wide transition-all"
            >
              <Database className="w-3.5 h-3.5 text-[#00F5A0]" />
              <span>Explore Schema</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
