import * as React from "react";

export interface PieChartProps {
  data: { label: string; value: number; color: string }[];
  title?: string;
}

export function PieChart({ data, title }: PieChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;

  return (
    <div className="space-y-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      {title && <h4 className="text-sm font-bold text-slate-900">{title}</h4>}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative h-32 w-32 shrink-0 rounded-full border-4 border-slate-100 bg-emerald-50 flex items-center justify-center font-bold text-emerald-800 text-sm">
          <span>100% Distribution</span>
        </div>
        <div className="space-y-2 text-xs flex-1">
          {data.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="font-semibold text-slate-700">{item.label}</span>
              </div>
              <span className="font-bold text-slate-900">{Math.round((item.value / total) * 100)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}