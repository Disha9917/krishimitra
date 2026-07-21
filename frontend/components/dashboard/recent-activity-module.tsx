import * as React from "react";
import { Clock, CheckCircle, AlertTriangle } from "lucide-react";

export function RecentActivityModule() {
  const activities = [
    { title: "Precision Advisory Generated", time: "2 hours ago", desc: "Top 3 recommendations generated for Wheat HD-2967" },
    { title: "Disease Image Scan Completed", time: "Yesterday", desc: "Leaf Rust diagnosed with 94.6% confidence" },
    { title: "Market Price Alert Triggered", time: "2 days ago", desc: "Wheat price reached ₹2,420 / Qtl limit" },
  ];

  return (
    <div className="space-y-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
        <Clock className="h-5 w-5 text-emerald-600" />
        Recent Farm Activity & Audit Log
      </h3>
      <div className="space-y-3">
        {activities.map((act, i) => (
          <div key={i} className="flex items-start gap-3 rounded-xl bg-slate-50 p-3.5 border border-slate-100">
            <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-slate-900">{act.title}</h4>
              <p className="text-xs text-slate-600 mt-0.5">{act.desc}</p>
              <span className="text-[10px] text-slate-400 mt-1 block">{act.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}