import * as React from "react";
import { Sprout, Sparkles, ShieldCheck, Warehouse } from "lucide-react";

export function Hero() {
  return (
    <div className="relative py-16 sm:py-28 bg-gradient-to-b from-emerald-900/5 via-transparent to-transparent dark:from-emerald-950/20 dark:via-transparent dark:to-transparent">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/90 dark:bg-[#161B22]/90 backdrop-blur-md px-4 py-1.5 text-xs font-bold text-emerald-900 dark:text-emerald-400 border border-emerald-300/60 dark:border-[#2A2F3A] shadow-sm">
          <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400 animate-pulse" />
          <span>Precision AgriTech AI & Post-Harvest Loss Reduction</span>
        </div>

        <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-6xl max-w-4xl mx-auto leading-tight">
          Empowering Smallholder Farmers with <span className="text-emerald-700 dark:text-emerald-400 bg-gradient-to-r from-emerald-700 via-emerald-600 to-lime-600 dark:from-emerald-400 dark:via-emerald-300 dark:to-lime-400 bg-clip-text text-transparent">AI Crop Intelligence</span>
        </h1>

        <p className="text-base sm:text-xl text-slate-700 dark:text-[#C9D1D9] max-w-2xl mx-auto leading-relaxed font-medium">
          Top-ranked AI advisories, 7-day micro-climate timelines, leaf disease diagnosis, and post-harvest spoilage loss reduction for maximum farm profit.
        </p>

        <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left text-xs font-bold text-slate-800 dark:text-[#C9D1D9]">
          <div className="rounded-2xl border border-emerald-100/80 dark:border-[#2A2F3A] bg-white/85 dark:bg-[#161B22]/90 backdrop-blur-md p-4 shadow-sm hover:shadow-md transition-all flex items-center gap-3">
            <Sprout className="h-6 w-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Top 3 Ranked Advisories</span>
          </div>
          <div className="rounded-2xl border border-emerald-100/80 dark:border-[#2A2F3A] bg-white/85 dark:bg-[#161B22]/90 backdrop-blur-md p-4 shadow-sm hover:shadow-md transition-all flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Confidence Badge Indicators</span>
          </div>
          <div className="rounded-2xl border border-emerald-100/80 dark:border-[#2A2F3A] bg-white/85 dark:bg-[#161B22]/90 backdrop-blur-md p-4 shadow-sm hover:shadow-md transition-all flex items-center gap-3">
            <Warehouse className="h-6 w-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Sell / Store / Transport Engine</span>
          </div>
          <div className="rounded-2xl border border-emerald-100/80 dark:border-[#2A2F3A] bg-white/85 dark:bg-[#161B22]/90 backdrop-blur-md p-4 shadow-sm hover:shadow-md transition-all flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>7-Day Advisory Timeline</span>
          </div>
        </div>
      </div>
    </div>
  );
}