import React from 'react';
import BrandLogo from './BrandLogo';
import { Github, Linkedin, ShieldCheck, Terminal, Database, ArrowUpRight } from 'lucide-react';

export default function Footer({ setActiveTab }) {
  return (
    <footer className="w-full border-t border-[#1F2E47] bg-[#0B0F17]/95 mt-20 text-slate-400">
      <div className="max-w-[1150px] mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <BrandLogo size="md" showTagline={true} />
            <p className="text-sm text-slate-400 max-w-md leading-relaxed font-sans">
              An intelligent natural-language-to-SQL platform engineered with Spring Boot 3,
              JSqlParser AST verification, and proactive multi-turn clarification algorithms.
            </p>
            <div className="flex items-center gap-3 text-xs font-mono text-slate-500 pt-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                AST Read-Only Enforced
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Database className="w-3.5 h-3.5 text-blue-400" />
                MySQL 8 Relational
              </span>
            </div>
          </div>

          {/* Quick Nav */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-200 font-semibold mb-3">
              Platform Navigation
            </h4>
            <ul className="space-y-2 text-sm font-sans">
              <li>
                <button
                  onClick={() => setActiveTab('landing')}
                  className="hover:text-blue-400 transition-colors"
                >
                  Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('workspace')}
                  className="hover:text-blue-400 transition-colors"
                >
                  Query Console
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('explorer')}
                  className="hover:text-blue-400 transition-colors"
                >
                  Database Explorer
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('history')}
                  className="hover:text-blue-400 transition-colors"
                >
                  Audit Trail
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('about')}
                  className="hover:text-blue-400 transition-colors"
                >
                  Architecture & Defense
                </button>
              </li>
            </ul>
          </div>

          {/* Developer Portfolio Links */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-200 font-semibold mb-3">
              Developer
            </h4>
            <ul className="space-y-2.5 text-sm font-sans">
              <li>
                <span className="text-slate-300 font-medium">Nazish Saghir</span>
              </li>
              <li>
                <a
                  href="https://github.com/nazish-saghir-ahmed/Querify"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
                >
                  <Github className="w-4 h-4 text-slate-400" />
                  <span>GitHub Repository</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
                >
                  <Linkedin className="w-4 h-4 text-blue-400" />
                  <span>LinkedIn Profile</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[#1F2E47] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-500">
          <div>
            © {new Date().getFullYear()} Querify. Designed & built by <span className="text-slate-300 font-medium">Nazish Saghir</span>.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>All Systems Operational</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
