import React from 'react';
import BrandLogo from './BrandLogo';
import { ShieldCheck, Cpu, Database, Terminal } from 'lucide-react';

export default function Footer({ setActiveTab }) {
  return (
    <footer className="relative z-10 w-full border-t border-white/[0.08] bg-[#06080D] py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <BrandLogo size="md" showTagline={true} />
            <p className="text-xs text-slate-400 max-w-md leading-relaxed font-sans">
              Querify is an AI-powered Text-to-SQL Clarification Engine engineered with Spring Boot,
              MySQL 8, and proactive multi-turn disambiguation algorithms.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-2">
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-[#00F5A0]" />
                Java 17 LTS Backend
              </span>
              <span className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-[#00F5A0]" />
                MySQL 8 Relational Store
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00F5A0]" />
                AST Read-Only Guard
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 mb-3">
              Platform Navigation
            </h4>
            <ul className="space-y-2 text-xs font-sans text-slate-400">
              <li>
                <button onClick={() => setActiveTab('landing')} className="hover:text-[#00F5A0] transition-colors">
                  Overview
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('workspace')} className="hover:text-[#00F5A0] transition-colors">
                  Query Console
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('explorer')} className="hover:text-[#00F5A0] transition-colors">
                  Database Explorer
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('history')} className="hover:text-[#00F5A0] transition-colors">
                  Audit Trail
                </button>
              </li>
            </ul>
          </div>

          {/* Architecture & Specs */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 mb-3">
              Architecture & Defense
            </h4>
            <ul className="space-y-2 text-xs font-sans text-slate-400">
              <li>
                <button onClick={() => setActiveTab('about')} className="hover:text-[#00F5A0] transition-colors">
                  System Architecture Pipeline
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('about')} className="hover:text-[#00F5A0] transition-colors">
                  Clarification Algorithm
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('about')} className="hover:text-[#00F5A0] transition-colors">
                  20+ Viva Voce Guide
                </button>
              </li>
              <li>
                <span className="text-[11px] font-mono text-slate-500">
                  Domain: AI & Financial Analytics
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-mono">
          <p>© 2026 Querify Engine. High-Assurance Text-to-SQL Disambiguation.</p>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#0A0E17] border border-white/[0.08] text-[11px] text-slate-400">
              Spring Boot • React 18 • Vite • Tailwind
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
