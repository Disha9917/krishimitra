import * as React from "react";
import { Sprout, Target, ShieldCheck } from "lucide-react";

export function AboutSection() {
  return (
    <section id="about" className="py-16 bg-transparent relative z-10 scroll-mt-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/80 dark:bg-[#161B22] px-3.5 py-1 text-xs font-bold text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-[#2A2F3A]">
            <Sprout className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Empowering Agriculture</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white sm:text-4xl">
            About KrishiMitra AI
          </h2>
          <p className="text-sm text-slate-600 dark:text-[#C9D1D9] max-w-2xl mx-auto leading-relaxed">
            Precision Crop Advisory System & Post-Harvest Loss Reduction Planner engineered for smallholder farmers.
          </p>
        </div>

        <div className="rounded-3xl border border-emerald-100/80 dark:border-[#2A2F3A] bg-white/80 dark:bg-[#161B22]/90 backdrop-blur-md p-8 sm:p-10 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-emerald-700 dark:text-emerald-400 font-extrabold text-lg">
                <Target className="h-6 w-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Our Mission</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-[#C9D1D9] leading-relaxed">
                Smallholder farmers face unpredictable weather, pest infestations, and severe post-harvest crop degradation that impacts rural livelihoods. KrishiMitra AI delivers hyper-local precision advisories, 7-day micro-climate timelines, AI leaf disease vision models, and commercial Sell vs Store decision engines to maximize farmer profitability.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-start gap-3 rounded-2xl bg-emerald-50/60 dark:bg-[#111827] p-4 border border-emerald-100/60 dark:border-[#2A2F3A]">
                <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Hyper-Local Intelligence</h4>
                  <p className="text-[11px] text-slate-600 dark:text-[#8B949E] mt-0.5">PIN-code microclimate and soil analysis.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl bg-emerald-50/60 dark:bg-[#111827] p-4 border border-emerald-100/60 dark:border-[#2A2F3A]">
                <Sprout className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Post-Harvest Protection</h4>
                  <p className="text-[11px] text-slate-600 dark:text-[#8B949E] mt-0.5">Spoilage prevention & commercial pricing engine.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
