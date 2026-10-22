import React from 'react';
import BrandLogo from './BrandLogo';
import { Database, Sparkles, History, HelpCircle, Activity, Terminal } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, health }) {
  const navItems = [
    { id: 'landing', label: 'Home', icon: null },
    { id: 'workspace', label: 'Workspace', icon: Terminal },
    { id: 'explorer', label: 'DB Explorer', icon: Database },
    { id: 'history', label: 'History', icon: History },
    { id: 'about', label: 'Architecture & Viva', icon: HelpCircle },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#1E293B] bg-[#080B14]/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="cursor-pointer" onClick={() => setActiveTab('landing')}>
          <BrandLogo size="md" showTagline={false} />
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-[#101827] p-1 rounded-xl border border-[#1E293B]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-purple-600/20 text-cyan-300 border border-purple-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                {Icon && <Icon className="w-4 h-4 text-purple-400" />}
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* System Status Indicators */}
        <div className="flex items-center gap-3">
          {/* AI Mode Pill */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#151E30] border border-[#1E293B] text-xs">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                health?.databaseConnected ? 'bg-cyan-400' : 'bg-amber-400'
              }`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${
                health?.databaseConnected ? 'bg-cyan-500' : 'bg-amber-500'
              }`}></span>
            </span>
            <span className="text-slate-300 font-medium">
              {health ? (health.aiMode === 'live' ? 'Live Gemini' : 'Demo Engine') : 'Connecting...'}
            </span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
              health?.databaseConnected 
                ? 'text-cyan-300 bg-cyan-950/60 border-cyan-800/50' 
                : 'text-amber-400 bg-amber-950/60 border-amber-800/50'
            }`}>
              {health?.databaseConnected ? (health.databaseEngine?.includes('Embedded') ? 'DB Ready' : 'MySQL 8') : 'Offline'}
            </span>
          </div>

          {/* Quick Launch CTA if on landing */}
          {activeTab === 'landing' && (
            <button
              onClick={() => setActiveTab('workspace')}
              className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-semibold shadow-neon-violet transition-all"
            >
              <Sparkles className="w-4 h-4" />
              Launch Engine
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
