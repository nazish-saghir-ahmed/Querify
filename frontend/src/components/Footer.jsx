import React from 'react';
import BrandLogo from './BrandLogo';
import { Github, ShieldCheck, Database, ArrowUpRight, Mail } from 'lucide-react';

export default function Footer({ setActiveTab }) {
  return (
    <footer className="w-full border-t border-blue-900/30 bg-[#080D1A]/95 mt-20 text-blue-200/70">
      <div className="max-w-[1150px] mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <BrandLogo size="md" showTagline={true} />
            <p className="text-sm text-blue-100/70 max-w-md leading-relaxed font-sans">
              An intelligent natural-language-to-SQL platform engineered with Spring Boot 3,
              JSqlParser AST verification, and proactive multi-turn clarification algorithms.
            </p>
            <div className="flex items-center gap-3 text-xs font-mono text-blue-300/80 pt-1">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                AST Read-Only Enforced
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-blue-400" />
                MySQL 8 Relational
              </span>
            </div>
          </div>

          {/* Quick Nav */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-[0.15em] text-white font-bold mb-3">
              Platform Navigation
            </h4>
            <ul className="space-y-2 text-sm font-sans">
              <li>
                <button
                  onClick={() => setActiveTab('landing')}
                  className="hover:text-white transition-colors"
                >
                  Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('workspace')}
                  className="hover:text-white transition-colors"
                >
                  Query Console
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('explorer')}
                  className="hover:text-white transition-colors"
                >
                  Database Explorer
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('history')}
                  className="hover:text-white transition-colors"
                >
                  Audit Trail
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('about')}
                  className="hover:text-white transition-colors"
                >
                  Architecture Guide
                </button>
              </li>
            </ul>
          </div>

          {/* Engineering Team */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-[0.15em] text-white font-bold mb-3">
              Engineering Team
            </h4>
            <div className="space-y-3 text-xs font-sans">
              <div className="space-y-1">
                <div className="text-white font-semibold">Nazish Saghir</div>
                <div className="flex flex-col gap-1 text-blue-300">
                  <a
                    href="mailto:saghirahmed0@gmail.com"
                    className="inline-flex items-center gap-1 hover:text-white transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>saghirahmed0@gmail.com</span>
                  </a>
                  <a
                    href="https://github.com/nazish-saghir-ahmed/Querify"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:text-white transition-colors"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>GitHub: Querify</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="space-y-1 pt-1 border-t border-blue-900/30">
                <div className="text-white font-semibold">Umar Imran</div>
                <div className="flex flex-col gap-1 text-blue-300">
                  <a
                    href="mailto:umarimran1882@gmail.com"
                    className="inline-flex items-center gap-1 hover:text-white transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>umarimran1882@gmail.com</span>
                  </a>
                  <a
                    href="https://github.com/umarimran1882"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:text-white transition-colors"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>GitHub: umarimran1882</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="space-y-1 pt-1 border-t border-blue-900/30">
                <div className="text-white font-semibold">Zuryat Fatima</div>
                <div className="flex flex-col gap-1 text-blue-300">
                  <a
                    href="mailto:zuryatfatima96@gmail.com"
                    className="inline-flex items-center gap-1 hover:text-white transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>zuryatfatima96@gmail.com</span>
                  </a>
                  <a
                    href="https://github.com/zuryatfatima96"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:text-white transition-colors"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>GitHub: zuryatfatima96</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-blue-900/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-blue-300/70">
          <div>
            © {new Date().getFullYear()} Querify. Designed & engineered by <span className="text-white font-medium">Nazish Saghir</span>, <span className="text-white font-medium">Umar Imran</span>, and <span className="text-white font-medium">Zuryat Fatima</span>.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-white">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
              <span>All Systems Operational</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
