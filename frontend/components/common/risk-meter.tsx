import * as React from "react";
import { cn } from "../../lib/utils";
import { AlertTriangle, CheckCircle2, Flame, ShieldAlert } from "lucide-react";

export interface RiskMeterProps {
  percentage: number; // 0 to 100
  riskLevel: "Low" | "Moderate" | "High" | "Critical";
  shelfLifeDays: number;
  daysRemaining: number;
  className?: string;
}

export function RiskMeter({
  percentage,
  riskLevel,
  shelfLifeDays,
  daysRemaining,
  className,
}: RiskMeterProps) {
  const getMeterColor = () => {
    if (percentage > 85) return "bg-rose-500 text-rose-600";
    if (percentage > 60) return "bg-orange-500 text-orange-600";
    if (percentage > 30) return "bg-amber-500 text-amber-600";
    return "bg-emerald-500 text-emerald-600";
  };

  const getRiskIcon = () => {
    if (riskLevel === "Critical" || riskLevel === "High") return <Flame className="h-6 w-6 text-rose-500" />;
    if (riskLevel === "Moderate") return <AlertTriangle className="h-6 w-6 text-amber-500" />;
    return <CheckCircle2 className="h-6 w-6 text-emerald-500" />;
  };

  return (
    <div className={cn("space-y-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">{getRiskIcon()}</div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Spoilage Risk Level</h4>
            <p className="text-xs text-slate-500">Calculated based on crop type & storage condition</p>
          </div>
        </div>
        <span
          className={cn(
            "rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider border",
            riskLevel === "Critical"
              ? "bg-rose-50 text-rose-700 border-rose-200"
              : riskLevel === "High"
              ? "bg-orange-50 text-orange-700 border-orange-200"
              : riskLevel === "Moderate"
              ? "bg-amber-50 text-amber-700 border-amber-200"
              : "bg-emerald-50 text-emerald-700 border-emerald-200"
          )}
        >
          {riskLevel} Risk
        </span>
      </div>

      {/* Visual Meter Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-bold text-slate-700">
          <span>Risk Gauge</span>
          <span>{percentage}% Spoilage Probability</span>
        </div>
        <div className="h-3.5 w-full overflow-hidden rounded-full bg-slate-100 p-0.5 border border-slate-200/50">
          <div
            className={cn("h-full rounded-full transition-all duration-500", getMeterColor().split(" ")[0])}
            style={{ width: `${Math.min(100, Math.max(5, percentage))}%` }}
          />
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
          <p className="text-xs text-slate-500 font-medium">Estimated Shelf Life</p>
          <p className="text-base font-bold text-slate-900 mt-0.5">{shelfLifeDays} Days</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
          <p className="text-xs text-slate-500 font-medium">Safe Storage Days Left</p>
          <p className={cn("text-base font-bold mt-0.5", daysRemaining <= 3 ? "text-rose-600" : "text-emerald-700")}>
            {daysRemaining} Days
          </p>
        </div>
      </div>
    </div>
  );
}
