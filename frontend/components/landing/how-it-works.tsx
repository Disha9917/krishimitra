import * as React from "react";

export function HowItWorks() {
  const steps = [
    { number: "01", title: "Enter Farmer Field Parameters", desc: "GPS coordinates, PIN code, crop type, sowing date, and weather observations." },
    { number: "02", title: "AI Precision Analysis", desc: "KrishiMitra evaluates micro-climate, regional soil profile, and market trend forecasts." },
    { number: "03", title: "Get Ranked Advisories & Timeline", desc: "Top 3 ranked advisories, 7-day timeline, disease remedies, and sell/store decision matrix." },
  ];

  return (
    <section className="py-16 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <h2 className="text-3xl font-black text-slate-900 text-center">How KrishiMitra AI Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, idx) => (
            <div key={idx} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-3">
              <span className="text-3xl font-black text-emerald-600">{step.number}</span>
              <h3 className="text-base font-bold text-slate-900">{step.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}