import React, { useState } from 'react';
import BrandLogo from './BrandLogo';
import { Database, Terminal, History, Info, ArrowRight, Menu, X, ShieldCheck } from 'lucide-react';

/**
 * Dark Navy Developer Navigation Bar
 * Features translucent frosted glass with Dark Navy Blue accents,
 * honest database runtime mode indication, and responsive mobile navigation.
 */
export default function Navbar({ activeTab, setActiveTab, health }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'landing', label: 'Overview', icon: null },
    { id: 'workspace', label: 'Console', icon: Terminal },
    { id: 'explorer', label: 'DB Explorer', icon: Database },
    { id: 'history', label: 'Audit Trail', icon: History },
    { id: 'about', label: 'Architecture & Viva', icon: Info },
  ];

  // Determine database engine mode honestly
  const getDatabaseStatus = () => {
    if (!health || !health.databaseConnected) {
      return {
        label: 'Connecting Engine...',
        badgeColor: 'border-slate-500/40 text-slate-300',
        dotColor: 'bg-slate-400',
        isLive: false,
      };
    }
    const engine = health.databaseEngine || '';
    if (engine.toLowerCase().includes('embedded')) {
      return {
        label: 'Embedded In-Memory (H2)',
        badgeColor: 'border-[#D4AF37]/50 text-[#D4AF37]',
        dotColor: 'bg-[#D4AF37]',
        isLive: true,
      };
    }
    return {
      label: 'Live MySQL 8.0',
      badgeColor: 'border-emerald-500/50 text-emerald-400',
      dotColor: 'bg-emerald-400',
      isLive: true,
    };
  };

  const dbStatus = getDatabaseStatus();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#3A506B]/35 bg-[#0D1B2A]/85 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="cursor-pointer" onClick={() => { setActiveTab('landing'); setMobileMenuOpen(false); }}>
          <BrandLogo size="md" showTagline={false} />
        </div>

        {/* Desktop Navigation Tabs in Frosted Glass Container */}
        <nav className="hidden md:flex items-center gap-1 bg-[#1B263B]/60 backdrop-blur-md p-1 rounded-xl border border-[#3A506B]/40 shadow-inner">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium tracking-wide transition-all duration-200 ${
                  isActive
                    ? 'bg-[#1D3557] text-[#F7F3E9] border border-[#3A506B]/80 shadow-[0_0_15px_-4px_rgba(29,53,87,0.5)]'
                    : 'text-slate-300 hover:text-[#F7F3E9] hover:bg-white/[0.04]'
                }`}
              >
                {Icon && (
                  <Icon 
                    className={`w-3.5 h-3.5 transition-colors ${
                      isActive ? 'text-[#7FA1C3]' : 'text-slate-400'
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
          {/* Active Runtime Engine Pill in Frosted Glass */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[#1B263B]/60 backdrop-blur-md border border-[#3A506B]/40 text-xs">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dbStatus.dotColor}`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${dbStatus.dotColor}`} />
            </span>
            <span className="text-[#F7F3E9] font-mono text-[11px] flex items-center gap-1">
              <span className="text-[#D4AF37]">Nemotron 3.5</span>
            </span>
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#0D1B2A]/80 border ${dbStatus.badgeColor}`}>
              {dbStatus.label}
            </span>
          </div>

          {/* Desktop Direct CTA */}
          {activeTab !== 'workspace' ? (
            <button
              onClick={() => setActiveTab('workspace')}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#1D3557] hover:bg-[#14253D] text-[#F7F3E9] text-xs font-semibold tracking-wide transition-all duration-200 shadow-sm border border-[#3A506B]/80"
            >
              <span>Query Console</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('explorer')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1B263B]/60 hover:bg-[#1B263B] text-[#F7F3E9] border border-[#3A506B]/40 text-xs font-medium tracking-wide transition-all"
            >
              <Database className="w-3.5 h-3.5 text-[#7FA1C3]" />
              <span>Explore Schema</span>
            </button>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-[#1B263B]/60 border border-[#3A506B]/40 text-slate-300 hover:text-[#F7F3E9]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0D1B2A]/95 border-b border-[#3A506B]/40 px-4 pt-2 pb-4 space-y-2 backdrop-blur-2xl animate-fade-in">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#3A506B]/25 text-xs font-mono text-slate-300">
            <span>Database Mode:</span>
            <span className={`px-2 py-0.5 rounded bg-[#1B263B] text-[10px] border ${dbStatus.badgeColor}`}>
              {dbStatus.label}
            </span>
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors ${
                  isActive
                    ? 'bg-[#1D3557] text-[#F7F3E9] border border-[#3A506B]'
                    : 'text-slate-300 hover:text-white hover:bg-[#1B263B]/50'
                }`}
              >
                {Icon && <Icon className={`w-4 h-4 ${isActive ? 'text-[#7FA1C3]' : 'text-slate-400'}`} />}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
