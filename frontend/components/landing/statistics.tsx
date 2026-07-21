import * as React from "react";

export function Statistics() {
  const stats = [
    { label: "Smallholder Farmers Served", value: "50,000+" },
    { label: "Precision Advisories Generated", value: "125,000+" },
    { label: "Post-Harvest Crop Loss Saved", value: "₹4.2 Crore" },
    { label: "AI Diagnostic Accuracy Rate", value: "94.6%" },
  ];

  return (
    <section className="py-12 bg-emerald-600 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {stats.map((s, idx) => (
          <div key={idx} className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black">{s.value}</p>
            <p className="text-xs font-semibold text-emerald-100">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}