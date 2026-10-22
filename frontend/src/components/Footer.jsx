import React from 'react';
import BrandLogo from './BrandLogo';
import { ShieldCheck, Cpu, Code2, Database } from 'lucide-react';

export default function Footer({ setActiveTab }) {
  return (
    <footer className="w-full border-t border-[#1E293B] bg-[#080B14] py-10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <BrandLogo size="md" showTagline={true} />
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              Querify is an AI-powered Text-to-SQL Clarification Engine engineered with Spring Boot,
              MySQL 8, and intelligent multi-turn clarification algorithms. Built as an end-to-end university software project.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-500 pt-2">
              <span className="flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-purple-400" />
                Java 17/21 LTS Backend
              </span>
              <span className="flex items-center gap-1">
                <Database className="w-3.5 h-3.5 text-cyan-400" />
                MySQL 8 Relational Store
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                AST Read-Only Guard
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
              Project Navigation
            </h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => setActiveTab('landing')} className="hover:text-cyan-400 transition-colors">
                  Product Home
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('workspace')} className="hover:text-cyan-400 transition-colors">
                  Query Workspace
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('explorer')} className="hover:text-cyan-400 transition-colors">
                  Database Explorer
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('history')} className="hover:text-cyan-400 transition-colors">
                  Audit History
                </button>
              </li>
            </ul>
          </div>

          {/* University Presentation Links */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
              Academic Evaluation
            </h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => setActiveTab('about')} className="hover:text-purple-400 transition-colors">
                  System Architecture
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('about')} className="hover:text-purple-400 transition-colors">
                  Clarification Algorithm
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('about')} className="hover:text-purple-400 transition-colors">
                  20+ Viva Q&A Guide
                </button>
              </li>
              <li>
                <span className="text-[11px] text-slate-500">
                  Domain: AI & Financial Performance
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[#1E293B]/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© 2026 Querify Engine. Designed for Academic Evaluation & Viva Presentation.</p>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#101827] border border-[#1E293B] text-[11px] text-slate-400">
              Spring Boot + React + Tailwind
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
