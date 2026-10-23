import React, { useState } from 'react';
import BrandLogo from './BrandLogo';
import { Database, Terminal, History, Info, Github, Menu, X } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, health }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'landing', label: 'Overview', icon: null },
    { id: 'workspace', label: 'Query Console', icon: Terminal },
    { id: 'explorer', label: 'DB Explorer', icon: Database },
    { id: 'history', label: 'Audit Trail', icon: History },
    { id: 'about', label: 'Architecture Guide', icon: Info },
  ];

  // Determine system mode: "Demo Mode" or "Live Gemini" in strict Midnight Blue & White
  const getSystemStatus = () => {
    const isLive = Boolean(health?.databaseConnected && health?.aiMode !== 'demo');
    const provider = (health?.aiProvider || '').toLowerCase();
    
    if (isLive && provider.includes('gemini')) {
      return {
        label: 'Live Gemini',
        dotColor: 'bg-white',
        badgeColor: 'bg-blue-600 text-white border-blue-500 shadow-midnight',
      };
    }

    if (isLive) {
      return {
        label: 'Live Engine',
        dotColor: 'bg-white',
        badgeColor: 'bg-blue-600 text-white border-blue-500 shadow-midnight',
      };
    }

    return {
      label: 'Demo Mode',
      dotColor: 'bg-blue-400',
      badgeColor: 'bg-blue-950/40 text-blue-200 border-blue-600/40',
    };
  };

  const status = getSystemStatus();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-blue-900/30 bg-[#080D1A]/90 backdrop-blur-xl">
      <div className="max-w-[1150px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          className="cursor-pointer" 
          onClick={() => { setActiveTab('landing'); setMobileMenuOpen(false); }}
        >
          <BrandLogo size="md" showTagline={false} />
        </div>

        {/* Desktop Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-blue-950/30 p-1 rounded-xl border border-blue-900/40 backdrop-blur-md">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-150 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-midnight'
                    : 'text-blue-200/80 hover:text-white hover:bg-blue-900/30'
                }`}
              >
                {Icon && (
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-blue-300'}`} />
                )}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Status Badge & GitHub CTA */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Status Badge: "Demo Mode" or "Live Gemini" */}
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono font-medium ${status.badgeColor}`}>
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${status.dotColor}`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${status.dotColor}`} />
            </span>
            <span>{status.label}</span>
          </div>

          {/* GitHub Link */}
          <a
            href="https://github.com/nazish-saghir-ahmed/Querify"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-blue-950/40 hover:bg-blue-900/40 border border-blue-800/40 transition-colors"
          >
            <Github className="w-3.5 h-3.5 text-blue-300" />
            <span>GitHub</span>
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-mono ${status.badgeColor}`}>
            <span className={`inline-block w-1.5 h-1.5 rounded-full ${status.dotColor}`} />
            <span>{status.label}</span>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg bg-blue-950/40 border border-blue-800/40 text-blue-200 hover:text-white"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-blue-900/30 bg-[#080D1A] px-4 pt-2 pb-4 space-y-1">
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
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white font-bold'
                    : 'text-blue-200 hover:bg-blue-900/30'
                }`}
              >
                {Icon && <Icon className="w-4 h-4 text-blue-300" />}
                <span>{item.label}</span>
              </button>
            );
          })}
          <div className="pt-2 border-t border-blue-900/30 mt-2">
            <a
              href="https://github.com/nazish-saghir-ahmed/Querify"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-white bg-blue-950/40 border border-blue-800/40"
            >
              <Github className="w-4 h-4" />
              <span>View on GitHub</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
