import * as React from "react";
import { DecisionOption } from "../../types/postharvest";
import { formatINR } from "../../utils/currency";
import { cn } from "../../lib/utils";
import { DollarSign, AlertTriangle, CheckCircle, Store, Truck, Warehouse } from "lucide-react";

export interface DecisionCardProps {
  decision: DecisionOption;
  className?: string;
}

export function DecisionCard({ decision, className }: DecisionCardProps) {
  const icons = {
    SELL: <Store className="h-5 w-5 text-emerald-600" />,
    STORE: <Warehouse className="h-5 w-5 text-amber-600" />,
    TRANSPORT: <Truck className="h-5 w-5 text-blue-600" />,
  };

  const badgeStyles = {
    SELL: "bg-emerald-50 text-emerald-700 border-emerald-200",
    STORE: "bg-amber-50 text-amber-700 border-amber-200",
    TRANSPORT: "bg-blue-50 text-blue-700 border-blue-200",
  };

  return (
    <div
      className={cn(
        "relative flex flex-col justify-between rounded-2xl border p-5 shadow-sm transition-all hover:shadow-md",
        decision.recommended
          ? "border-emerald-500 bg-white ring-2 ring-emerald-500/20"
          : "border-slate-100 bg-white",
        className
      )}
    >
      {decision.recommended && (
        <div className="absolute -top-3 right-4 inline-flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-0.5 text-xs font-bold text-white shadow-sm">
          <CheckCircle className="h-3.5 w-3.5" /> Best Recommended
        </div>
      )}

      <div>
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">{icons[decision.type]}</div>
          <div>
            <span className={cn("inline-block rounded-md px-2 py-0.5 text-[10px] font-bold border uppercase tracking-wider", badgeStyles[decision.type])}>
              {decision.type}
            </span>
            <h4 className="text-base font-bold text-slate-900 mt-0.5">{decision.title}</h4>
          </div>
        </div>

        {/* Expected Profit */}
        <div className="mt-4 rounded-xl bg-slate-50 p-3.5 border border-slate-100">
          <span className="text-xs font-medium text-slate-500">Expected Net Profit</span>
          <div className="text-xl font-black text-slate-900 mt-0.5 flex items-baseline gap-1">
            <span>{formatINR(decision.expectedProfit)}</span>
            <span className="text-xs font-normal text-slate-500">({formatINR(decision.netReturnPerKg)}/kg)</span>
          </div>
        </div>

        {/* Reason */}
        <div className="mt-3 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Strategy Reason</span>
          <p className="text-xs text-slate-600 leading-relaxed">{decision.reason}</p>
        </div>
      </div>

      {/* Risk & Timeframe footer */}
      <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
        <div className="flex items-center gap-1">
          <AlertTriangle className={cn("h-3.5 w-3.5", decision.risk === "High" ? "text-rose-500" : decision.risk === "Medium" ? "text-amber-500" : "text-emerald-500")} />
          <span className="font-semibold text-slate-700">Risk: {decision.risk}</span>
        </div>
        <span className="text-slate-400 font-medium">{decision.timeframe}</span>
      </div>
    </div>
  );
}
