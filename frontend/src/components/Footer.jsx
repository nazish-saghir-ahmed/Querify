import React from 'react';
import BrandLogo from './BrandLogo';
import { ShieldCheck, Cpu, Database, Terminal } from 'lucide-react';

export default function Footer({ setActiveTab }) {
  return (
    <footer className="relative z-10 w-full border-t border-[#415A77]/30 bg-[#0D1B2A]/85 backdrop-blur-xl py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <BrandLogo size="md" showTagline={true} />
            <p className="text-xs text-slate-300 max-w-md leading-relaxed font-sans">
              Querify is an AI-powered Text-to-SQL Clarification Engine engineered with Spring Boot,
              MySQL 8, and proactive multi-turn disambiguation algorithms.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-300 pt-2">
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-blue-400" />
                Java 17 LTS Backend
              </span>
              <span className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-blue-400" />
                MySQL 8 Relational Store
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                AST Read-Only Guard
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#D4AF37] mb-3">
              Platform Navigation
            </h4>
            <ul className="space-y-2 text-xs font-sans text-slate-300">
              <li>
                <button onClick={() => setActiveTab('landing')} className="hover:text-blue-400 transition-colors">
                  Overview
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('workspace')} className="hover:text-blue-400 transition-colors">
                  Query Console
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('explorer')} className="hover:text-blue-400 transition-colors">
                  Database Explorer
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('history')} className="hover:text-blue-400 transition-colors">
                  Audit Trail
                </button>
              </li>
            </ul>
          </div>

          {/* Academic & Architecture Context */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#D4AF37] mb-3">
              Architecture & Security
            </h4>
            <ul className="space-y-2 text-xs font-sans text-slate-300">
              <li>
                <button onClick={() => setActiveTab('about')} className="hover:text-blue-400 transition-colors">
                  System Architecture
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('about')} className="hover:text-blue-400 transition-colors">
                  Viva Voce Defense Guide
                </button>
              </li>
              <li className="pt-2 text-[11px] text-slate-400 font-mono">
                Status: <span className="text-emerald-400 font-semibold">100% Verified</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#415A77]/25 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
          <div>
            © {new Date().getFullYear()} Querify Enterprise. Royal Navy & Gold Theme.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-500">Dual-Mode: Gemini 2.0 / Local Heuristic</span>
            <span className="text-[#D4AF37]">•</span>
            <span>JSqlParser AST Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
