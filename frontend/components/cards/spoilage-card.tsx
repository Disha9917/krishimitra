import * as React from "react";
import { SpoilageRiskResult } from "../../types/postharvest";
import { RiskMeter } from "../common/risk-meter";
import { Warehouse, Calendar, MapPin, Package, ShieldCheck } from "lucide-react";

export interface SpoilageCardProps {
  result: SpoilageRiskResult;
  className?: string;
}

export function SpoilageCard({ result, className }: SpoilageCardProps) {
  return (
    <div className={`space-y-5 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm ${className || ""}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-amber-50 p-3 text-amber-700 border border-amber-100">
            <Warehouse className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">{result.crop} Post-Harvest Loss Assessment</h3>
            <p className="text-xs text-slate-500">Storage condition & degradation forecasting</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
          <span className="text-slate-400 font-medium flex items-center gap-1"><Package className="h-3.5 w-3.5" /> Quantity</span>
          <span className="text-sm font-bold text-slate-900 mt-1 block">{result.quantityKg} kg ({result.quantityKg / 100} Qtl)</span>
        </div>
        <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
          <span className="text-slate-400 font-medium flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Harvest Date</span>
          <span className="text-sm font-bold text-slate-900 mt-1 block">{result.harvestDate}</span>
        </div>
        <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
          <span className="text-slate-400 font-medium flex items-center gap-1"><Warehouse className="h-3.5 w-3.5" /> Storage</span>
          <span className="text-sm font-bold text-slate-900 mt-1 block truncate">{result.storageCondition}</span>
        </div>
        <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
          <span className="text-slate-400 font-medium flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> Location</span>
          <span className="text-sm font-bold text-slate-900 mt-1 block truncate">{result.location}</span>
        </div>
      </div>

      <RiskMeter
        percentage={result.spoilageRiskPercentage}
        riskLevel={result.riskLevel}
        shelfLifeDays={result.shelfLifeDays}
        daysRemaining={result.daysRemaining}
      />

      <div className="rounded-xl bg-emerald-50 p-4 border border-emerald-100">
        <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          AI Storage Recommendation
        </h4>
        <p className="text-xs font-semibold text-emerald-950 mt-1">{result.storageRecommendation}</p>
      </div>
    </div>
  );
}
