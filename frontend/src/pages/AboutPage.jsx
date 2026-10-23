import React from 'react';
import {
  BookOpen, Layers, Cpu, Sparkles, ShieldCheck, Database
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="w-full max-w-[1150px] mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* 1. PROJECT VISION */}
      <section className="p-6 sm:p-8 rounded-2xl bg-[#111827] border border-[#1F2E47] space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-400" />
          <h1 className="text-xl sm:text-2xl font-bold text-white font-sans">
            Project Vision & Core Philosophy
          </h1>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed max-w-3xl font-sans">
          In business analytics, ambiguity is the primary failure mode of text-to-SQL systems. 
          When a stakeholder asks a deceptively simple question like <em>"Who is our top client?"</em>, standard AI chatbots blindly assume a metric (revenue, transaction count, retention, or profitability) and produce convincing but misleading numbers.
        </p>
        <p className="text-sm text-slate-300 leading-relaxed max-w-3xl font-sans">
          <strong>Querify</strong> solves this by introducing a <strong>Clarification Engine</strong> paired with a <strong>JSqlParser AST Security Guard</strong>. Execution halts when ambiguity is flagged, engaging the user in a rapid, structured clarification dialogue before generating mathematically sound, read-only SQL.
        </p>
      </section>

      {/* 2. ARCHITECTURE DIAGRAM */}
      <section className="p-6 sm:p-8 rounded-2xl bg-[#111827] border border-[#1F2E47] space-y-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-semibold">
            System Architecture
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-white font-sans mt-1">
            End-to-End Enterprise Data Flow
          </h2>
        </div>

        {/* Interactive Architecture Flow Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {/* Layer 1: React UI */}
          <div className="p-4 rounded-xl bg-[#0B0F17] border border-[#1F2E47] space-y-2">
            <div className="flex items-center gap-2 text-blue-400 text-xs font-mono font-semibold">
              <Layers className="w-4 h-4" />
              <span>1. React 18 UI</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Vite 5, Tailwind CSS, Recharts. Dispatches REST requests & renders sticky tables.
            </p>
          </div>

          {/* Layer 2: Spring Boot API */}
          <div className="p-4 rounded-xl bg-[#0B0F17] border border-[#1F2E47] space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-semibold">
              <Cpu className="w-4 h-4" />
              <span>2. Spring Boot 3</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Java 17/21 REST Gateway. Handles session UUIDs, turns, and exception mapping.
            </p>
          </div>

          {/* Layer 3: Clarification & AI */}
          <div className="p-4 rounded-xl bg-[#0B0F17] border border-[#1F2E47] space-y-2">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>3. AI Engine</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ambiguity detector, Gemini / Nemotron vector projections, and metric option synthesizer.
            </p>
          </div>

          {/* Layer 4: JSqlParser AST */}
          <div className="p-4 rounded-xl bg-[#0B0F17] border border-[#1F2E47] space-y-2">
            <div className="flex items-center gap-2 text-rose-400 text-xs font-mono font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>4. AST Guard</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Parses SQL tree. Strictly blocks DROP, DELETE, UPDATE, and statement chaining.
            </p>
          </div>

          {/* Layer 5: MySQL 8 */}
          <div className="p-4 rounded-xl bg-[#0B0F17] border border-[#1F2E47] space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-semibold">
              <Database className="w-4 h-4" />
              <span>5. MySQL 8 Store</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              HikariCP pool, 6 relational domain tables, and in-memory H2 test fallback.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
