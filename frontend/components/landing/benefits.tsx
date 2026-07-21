import * as React from "react";
import { Check } from "lucide-react";

export function Benefits() {
  const benefits = [
    "Up to 25% increase in crop yield through precise split fertilizer timing.",
    "Up to 40% reduction in post-harvest spoilage loss using cold-chain / storage planners.",
    "Early fungal disease detection before visible widespread canopy damage.",
    "Transparent Sell vs Store profit calculations ensuring maximum returns for farmers.",
  ];

  return (
    <section className="py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <h2 className="text-3xl font-black text-slate-900 text-center">Measurable Impact for Smallholders</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {benefits.map((b, i) => (
            <div key={i} className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
              <div className="rounded-full bg-emerald-600 p-1 text-white shrink-0 mt-0.5">
                <Check className="h-3.5 w-3.5" />
              </div>
              <p className="text-xs font-semibold text-slate-800 leading-relaxed">{b}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}