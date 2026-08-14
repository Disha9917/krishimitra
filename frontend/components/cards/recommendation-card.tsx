import * as React from "react";
import { RecommendationItem } from "../../types/crop";
import { ConfidenceBadge } from "../common/confidence-badge";
import { CheckCircle2, ArrowRight } from "lucide-react";

export interface RecommendationCardProps {
  item: RecommendationItem;
  className?: string;
}

export function RecommendationCard({ item, className }: RecommendationCardProps) {
  return (
    <div className={`rounded-2xl border border-slate-100 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22] p-5 shadow-sm transition-all hover:shadow-md ${className || ""}`}>
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-[#2A2F3A]">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-xs font-bold text-emerald-800 dark:text-emerald-300">
            #{item.rank}
          </span>
          <h4 className="text-base font-bold text-slate-900 dark:text-white leading-snug">{item.title}</h4>
        </div>
        <ConfidenceBadge confidence={item.confidence} score={item.confidenceScore} />
      </div>

      <div className="mt-3 space-y-3">
        {/* Plain language explanation */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-[#8B949E]">Analysis & Insights</p>
          <p className="text-sm text-slate-600 dark:text-[#C9D1D9] mt-0.5 leading-relaxed">{item.explanation}</p>
        </div>

        {/* Recommended Action */}
        <div className="rounded-xl bg-emerald-50/60 dark:bg-[#111827] p-3.5 border border-emerald-100/80 dark:border-[#2A2F3A]">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 dark:text-emerald-400 mb-1">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            Recommended Action
          </div>
          <p className="text-xs font-semibold text-emerald-950 dark:text-emerald-200">{item.recommendedAction}</p>
          {item.expectedYieldImprovement && (
            <div className="mt-2 inline-flex items-center gap-1 rounded-md bg-emerald-600 dark:bg-emerald-500 px-2 py-0.5 text-[11px] font-bold text-white">
              <span>{item.expectedYieldImprovement}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
