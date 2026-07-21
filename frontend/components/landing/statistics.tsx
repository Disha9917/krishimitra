import * as React from "react";
import { Users, Sprout, TrendingUp, ShieldCheck } from "lucide-react";

export function Statistics() {
  const stats = [
    {
      icon: <Users className="h-6 w-6 text-emerald-600" />,
      label: "Smallholder Farmers Served",
      value: "50,000+",
      subtext: "Across 14 Agri-zones",
    },
    {
      icon: <Sprout className="h-6 w-6 text-emerald-600" />,
      label: "Precision Advisories Generated",
      value: "125,000+",
      subtext: "Real-time AI Insights",
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-emerald-600" />,
      label: "Post-Harvest Loss Saved",
      value: "₹4.2 Crore",
      subtext: "Enhanced Profitability",
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-emerald-600" />,
      label: "AI Diagnostic Accuracy Rate",
      value: "94.6%",
      subtext: "Verified Field Testing",
    },
  ];

  return (
    <section className="py-14 bg-transparent relative z-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Glow ambient backplate */}
        <div className="relative rounded-3xl bg-gradient-to-r from-emerald-500/10 dark:from-emerald-500/20 via-lime-500/15 dark:via-lime-500/10 to-teal-500/10 dark:to-teal-500/20 p-1 backdrop-blur-xl border border-emerald-200/60 dark:border-[#2A2F3A] shadow-xl shadow-emerald-900/5">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 p-6 sm:p-8 bg-white/75 dark:bg-[#161B22]/90 backdrop-blur-md rounded-[22px]">
            {stats.map((s, idx) => (
              <div
                key={idx}
                className="group relative flex flex-col items-center text-center p-4 rounded-2xl transition-all duration-300 hover:bg-emerald-50/60 dark:hover:bg-[#1C212A] hover:scale-[1.02]"
              >
                {/* Icon Capsule */}
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100/80 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/40 shadow-xs group-hover:bg-emerald-600 group-hover:text-white dark:group-hover:bg-emerald-500 transition-all duration-300">
                  {s.icon}
                </div>

                {/* Stat Value */}
                <p className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-emerald-800 via-emerald-600 to-lime-600 dark:from-emerald-400 dark:via-emerald-300 dark:to-lime-400 bg-clip-text text-transparent tracking-tight">
                  {s.value}
                </p>

                {/* Stat Label */}
                <p className="mt-1.5 text-xs font-bold text-slate-800 dark:text-white">
                  {s.label}
                </p>

                {/* Subtext Badge */}
                <span className="mt-2 inline-block rounded-full bg-emerald-100/60 dark:bg-emerald-950/50 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-800 dark:text-emerald-300 border border-emerald-200/40 dark:border-emerald-800/40">
                  {s.subtext}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}