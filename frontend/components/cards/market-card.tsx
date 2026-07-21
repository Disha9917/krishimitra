import * as React from "react";
import { formatINR } from "../../utils/currency";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export interface MarketCardProps {
  cropName: string;
  mandiName: string;
  price: number;
  change: number;
}

export function MarketCard({ cropName, mandiName, price, change }: MarketCardProps) {
  const isUp = change > 0;
  const isDown = change < 0;

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-base font-bold text-slate-900">{cropName}</h4>
          <p className="text-xs text-slate-500">{mandiName}</p>
        </div>
        <div
          className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
            isUp
              ? "bg-emerald-50 text-emerald-700"
              : isDown
              ? "bg-rose-50 text-rose-700"
              : "bg-slate-50 text-slate-700"
          }`}
        >
          {isUp && <TrendingUp className="h-3.5 w-3.5" />}
          {isDown && <TrendingDown className="h-3.5 w-3.5" />}
          {!isUp && !isDown && <Minus className="h-3.5 w-3.5" />}
          <span>{change > 0 ? `+${change}%` : `${change}%`}</span>
        </div>
      </div>
      <div className="mt-3 text-xl font-black text-slate-900">
        {formatINR(price)} <span className="text-xs font-normal text-slate-500">/ Quintal</span>
      </div>
    </div>
  );
}