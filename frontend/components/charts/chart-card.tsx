import * as React from "react";

export function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">{title}</h4>
      <div>{children}</div>
    </div>
  );
}