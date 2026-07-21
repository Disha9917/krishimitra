import * as React from "react";
import { ConfidenceBadge } from "../common/confidence-badge";
import { ConfidenceLevel } from "../../types/common";

export interface PredictionCardProps {
  title: string;
  crop: string;
  recommendation: string;
  confidence: ConfidenceLevel;
  date: string;
}

export function PredictionCard({ title, crop, recommendation, confidence, date }: PredictionCardProps) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-3">
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span className="font-semibold text-slate-700">{crop}</span>
        <span>{date}</span>
      </div>
      <div>
        <h4 className="text-base font-bold text-slate-900">{title}</h4>
        <p className="text-xs text-slate-600 mt-1">{recommendation}</p>
      </div>
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
        <ConfidenceBadge confidence={confidence} />
        <span className="text-[11px] font-bold text-emerald-600 cursor-pointer hover:underline">View Summary</span>
      </div>
    </div>
  );
}