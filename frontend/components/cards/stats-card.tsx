import * as React from "react";

export interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: string;
}

export function StatsCard({ title, value, subtitle, icon, trend }: StatsCardProps) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{title}</span>
        {icon && <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600 border border-emerald-100">{icon}</div>}
      </div>
      <div className="mt-2 text-2xl font-black text-slate-900">{value}</div>
      {(subtitle || trend) && (
        <div className="mt-1 flex items-center gap-2 text-xs">
          {trend && <span className="font-bold text-emerald-600">{trend}</span>}
          {subtitle && <span className="text-slate-500">{subtitle}</span>}
        </div>
      )}
    </div>
  );
}