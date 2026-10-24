import React from 'react';
import BrandLogo from './BrandLogo';
import { Github, ShieldCheck, Database, ArrowUpRight, Mail } from 'lucide-react';

export default function Footer({ setActiveTab }) {
  return (
    <footer className="w-full border-t border-blue-600/30 bg-[#0A1224] mt-24 text-slate-200">
      <div className="max-w-[1150px] mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <BrandLogo size="md" showTagline={true} />
            <p className="text-sm text-slate-200 max-w-md leading-relaxed font-sans font-normal">
              An intelligent natural-language-to-SQL platform engineered with Spring Boot 3,
              JSqlParser AST verification, and proactive multi-turn clarification algorithms.
            </p>
            <div className="flex items-center gap-3 text-xs font-mono text-slate-200 pt-1 flex-wrap">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/90 border border-blue-500/40 text-blue-100 font-semibold shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                AST Read-Only Enforced
              </span>
              <span className="text-blue-400 font-bold">•</span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/90 border border-blue-500/40 text-blue-100 font-semibold shadow-sm">
                <Database className="w-3.5 h-3.5 text-blue-400" />
                MySQL 8 Relational
              </span>
            </div>
          </div>

          {/* Quick Nav */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-white font-extrabold mb-4 pb-1 border-b border-blue-800/40">
              Platform Navigation
            </h4>
            <ul className="space-y-2.5 text-sm font-sans font-medium">
              <li>
                <button
                  onClick={() => setActiveTab('landing')}
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('workspace')}
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Query Console
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('explorer')}
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Database Explorer
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('history')}
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Audit Trail
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('about')}
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Architecture Guide
                </button>
              </li>
            </ul>
          </div>

          {/* Engineering Team */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-white font-extrabold mb-4 pb-1 border-b border-blue-800/40">
              Engineering Team
            </h4>
            <div className="space-y-4 text-xs font-sans">
              <div className="space-y-1">
                <div className="text-white font-bold text-sm">Nazish Saghir</div>
                <div className="flex flex-col gap-1.5">
                  <a
                    href="mailto:saghirahmed0@gmail.com"
                    className="inline-flex items-center gap-1.5 text-blue-300 hover:text-white font-medium transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>saghirahmed0@gmail.com</span>
                  </a>
                  <a
                    href="https://github.com/nazish-saghir-ahmed/Querify"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white font-medium transition-colors"
                  >
                    <Github className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>GitHub: Querify</span>
                    <ArrowUpRight className="w-3 h-3 text-slate-400" />
                  </a>
                </div>
              </div>

              <div className="space-y-1 pt-2.5 border-t border-blue-900/40">
                <div className="text-white font-bold text-sm">Zuryat Fatima</div>
                <div className="flex flex-col gap-1.5">
                  <a
                    href="mailto:zuryatfatima96@gmail.com"
                    className="inline-flex items-center gap-1.5 text-blue-300 hover:text-white font-medium transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>zuryatfatima96@gmail.com</span>
                  </a>
                  <a
                    href="https://github.com/zuryatfatima96"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white font-medium transition-colors"
                  >
                    <Github className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>GitHub: zuryatfatima96</span>
                    <ArrowUpRight className="w-3 h-3 text-slate-400" />
                  </a>
                </div>
              </div>

              <div className="space-y-1 pt-2.5 border-t border-blue-900/40">
                <div className="text-white font-bold text-sm">Umar Imran</div>
                <div className="flex flex-col gap-1.5">
                  <a
                    href="mailto:umarimran1882@gmail.com"
                    className="inline-flex items-center gap-1.5 text-blue-300 hover:text-white font-medium transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>umarimran1882@gmail.com</span>
                  </a>
                  <a
                    href="https://github.com/umarimran1882"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white font-medium transition-colors"
                  >
                    <Github className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>GitHub: umarimran1882</span>
                    <ArrowUpRight className="w-3 h-3 text-slate-400" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-blue-800/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-200">
          <div>
            © {new Date().getFullYear()} Querify. Designed & engineered by <span className="text-white font-bold">Nazish Saghir</span>, <span className="text-white font-bold">Zuryat Fatima</span>, and <span className="text-white font-bold">Umar Imran</span>.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 text-white font-semibold px-3 py-1 rounded-full bg-blue-950/90 border border-blue-500/40 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
              <span>All Systems Operational</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
