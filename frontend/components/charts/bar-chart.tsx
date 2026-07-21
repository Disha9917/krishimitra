import * as React from "react";

export interface BarChartProps {
  data: { label: string; value: number }[];
  title?: string;
}

export function BarChart({ data, title }: BarChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="space-y-3 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      {title && <h4 className="text-sm font-bold text-slate-900">{title}</h4>}
      <div className="flex items-end justify-between gap-2 h-40 pt-4">
        {data.map((d, i) => {
          const heightPct = Math.round((d.value / maxValue) * 100);
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
              <span className="text-[10px] font-bold text-slate-700">{d.value}</span>
              <div className="w-full rounded-t-lg bg-emerald-500/80 transition-all hover:bg-emerald-600" style={{ height: `${heightPct}%` }} />
              <span className="text-[10px] font-semibold text-slate-400 truncate w-full text-center">{d.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}