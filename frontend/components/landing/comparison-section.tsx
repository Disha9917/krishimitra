"use client";

import * as React from "react";
import { CheckCircle2, XCircle, Sparkles } from "lucide-react";

export function ComparisonSection() {
  const points = [
    {
      feature: "Irrigation & Water Management",
      traditional: "Flood irrigation based on fixed calendar dates; 40% water wasted.",
      aiFarming: "Precision micro-drip timing based on soil moisture sensors & ET forecast.",
    },
    {
      feature: "Fertilizer Application",
      traditional: "Excessive single-dose Urea causing soil acidification & leaching.",
      aiFarming: "Split N-P-K dosage recommendation matched with crop growth stage.",
    },
    {
      feature: "Pest & Disease Diagnosis",
      traditional: "Manual observation after visible canopy destruction occurred.",
      aiFarming: "Early AI computer vision leaf scan detecting spores 7 days earlier.",
    },
    {
      feature: "Post-Harvest Commercial Strategy",
      traditional: "Panic selling at farmgate during distress harvest price dips.",
      aiFarming: "Sell vs Store decision engine predicting 30-day APMC mandi price spikes.",
    },
    {
      feature: "Logistics & Transport",
      traditional: "Unorganized local transport incurring high freight commission fees.",
      aiFarming: "Integrated transport calculator optimizing vehicle route & profit margin.",
    },
  ];

  return (
    <section id="about" className="py-32 bg-[#FAFAFA]">
      <div className="mx-auto max-w-7xl px-8 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#16A34A] bg-[#ECFDF5] px-4 py-1.5 rounded-full border border-[#16A34A]/20">
            Why Krishi.ai
          </span>
          <h2 className="text-3xl sm:text-[48px] font-bold text-neutral-900 leading-[1.15] tracking-tight">
            Traditional Farming vs AI Farming
          </h2>
          <p className="text-[18px] leading-[1.6] text-neutral-600">
            See how autonomous data-driven insights transform smallholder yield and profitability.
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="rounded-3xl border border-neutral-200 bg-white shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-neutral-200">
            {/* Traditional Column */}
            <div className="p-8 sm:p-12 space-y-8 bg-neutral-50/50">
              <div className="flex items-center gap-4 border-b border-neutral-200 pb-6">
                <div className="rounded-2xl bg-rose-100 p-4 text-rose-600">
                  <XCircle className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-neutral-900">Traditional Farming</h3>
                  <p className="text-sm text-neutral-500 mt-0.5">Uncertainty, high crop loss & price vulnerability</p>
                </div>
              </div>

              <div className="space-y-6">
                {points.map((pt, i) => (
                  <div key={i} className="space-y-2 text-sm">
                    <span className="font-bold text-neutral-800 block">{pt.feature}</span>
                    <p className="text-neutral-600 leading-relaxed bg-white p-4 rounded-2xl border border-neutral-200">
                      {pt.traditional}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Krishi AI Column */}
            <div className="p-8 sm:p-12 space-y-8 bg-gradient-to-b from-[#ECFDF5]/50 to-white">
              <div className="flex items-center gap-4 border-b border-[#16A34A]/20 pb-6">
                <div className="rounded-2xl bg-[#16A34A] p-4 text-white shadow-lg shadow-green-600/20">
                  <Sparkles className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-neutral-900 flex items-center gap-3">
                    Krishi AI Farming
                    <span className="rounded-full bg-[#16A34A] px-3 py-1 text-xs font-semibold text-white">
                      +18% Yield
                    </span>
                  </h3>
                  <p className="text-sm text-neutral-500 mt-0.5">Autonomous precision & post-harvest loss reduction</p>
                </div>
              </div>

              <div className="space-y-6">
                {points.map((pt, i) => (
                  <div key={i} className="space-y-2 text-sm">
                    <span className="font-bold text-neutral-900 block">{pt.feature}</span>
                    <p className="text-neutral-900 font-medium leading-relaxed bg-white p-4 rounded-2xl border border-[#16A34A]/30 shadow-sm">
                      <CheckCircle2 className="h-4 w-4 text-[#16A34A] inline mr-2 shrink-0" />
                      {pt.aiFarming}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
