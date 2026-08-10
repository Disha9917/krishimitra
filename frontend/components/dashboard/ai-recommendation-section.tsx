import * as React from "react";
import { CropAdvisoryResult } from "../../types/crop";
import { AiAdvisoryExtras } from "../../types/ai";
import { RecommendationCard } from "../cards/recommendation-card";
import { RecommendationItem } from "../../types/crop";
import { ConfidenceBadge } from "../common/confidence-badge";
import { Droplets, Sprout, ShieldAlert, Sparkles, CheckCircle2, AlertTriangle } from "lucide-react";

export type AIAdvisory = CropAdvisoryResult & AiAdvisoryExtras;

export interface AIRecommendationSectionProps {
  advisory: AIAdvisory;
  className?: string;
}

const RISK_STYLES: Record<string, string> = {
  Low: "bg-emerald-50 text-emerald-800 border-emerald-200",
  Medium: "bg-amber-50 text-amber-800 border-amber-200",
  High: "bg-orange-50 text-orange-800 border-orange-200",
  Critical: "bg-rose-50 text-rose-800 border-rose-200",
};

export function AIRecommendationSection({ advisory, className }: AIRecommendationSectionProps) {
  const riskLevel = advisory.riskLevel ? String(advisory.riskLevel) : null;
  return (
    <div className={`space-y-6 ${className || ""}`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200/60 pb-4">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-200 mb-1">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            AI Precision Crop Engine Active
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900 sm:text-2xl">
              Ranked Recommendations for {advisory.farmerInput?.cropType || advisory.cropName || "Wheat"}
            </h2>
            {advisory.category && (
              <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[10px] font-extrabold uppercase tracking-wider text-slate-600">
                {advisory.category}
              </span>
            )}
            {riskLevel && (
              <span className={`px-2 py-0.5 rounded-md border text-[10px] font-extrabold uppercase tracking-wider ${RISK_STYLES[riskLevel] || RISK_STYLES.Medium}`}>
                Risk: {riskLevel}
              </span>
            )}
            {advisory.confidence && (
              <span className="inline-flex items-center gap-1">
                <ConfidenceBadge confidence={advisory.confidence} />
                {advisory.confidenceScore !== undefined && (
                  <span className="text-[10px] font-bold text-slate-500">{advisory.confidenceScore}%</span>
                )}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500">Sowing Period: {advisory.farmerInput?.sowingDate || "Current Season"}</p>
          {advisory.summary && (
            <p className="text-sm text-slate-600 leading-relaxed mt-2 max-w-3xl">{advisory.summary}</p>
          )}
        </div>
      </div>

      {/* Top 3 Ranked Advisories */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Top 3 Ranked Field Advisories</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(advisory.top3Advisories || advisory.recommendations || ([] as RecommendationItem[])).map((rec, idx) => (
            <RecommendationCard key={rec.id || idx} item={rec} />
          ))}
        </div>
      </div>

      {/* Priority Tasks & Alerts (only when the backend returns them) */}
      {(advisory.priorityTasks?.length || advisory.alerts?.length) ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {advisory.priorityTasks?.length ? (
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-2.5">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Priority Tasks
              </h4>
              <ul className="space-y-2">
                {advisory.priorityTasks.map((task, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 leading-relaxed">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    {task}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {advisory.alerts?.length ? (
            <div className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm space-y-2.5">
              <h4 className="text-sm font-bold uppercase tracking-wider text-amber-600 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" /> Alerts
              </h4>
              <ul className="space-y-2">
                {advisory.alerts.map((alert, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 leading-relaxed">
                    <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                    {alert}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* Irrigation, Fertilizer, Pest Alert Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        {/* Irrigation Card */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="rounded-xl bg-blue-50 p-2 text-blue-600 border border-blue-100">
                <Droplets className="h-5 w-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Irrigation Advice</h4>
            </div>
            <ConfidenceBadge confidence={advisory.irrigation.confidence} />
          </div>
          <div className="space-y-2 text-xs">
            <p className="font-bold text-slate-800">{advisory.irrigation.title}</p>
            <p className="text-slate-600 leading-relaxed">{advisory.irrigation.explanation}</p>
            <div className="rounded-xl bg-slate-50 p-2.5 font-semibold text-slate-900 border border-slate-100">
              Quantity: {advisory.irrigation.waterQuantity} ({advisory.irrigation.frequency})
            </div>
            <div className="rounded-xl bg-blue-50 p-2.5 text-blue-900 font-bold border border-blue-100">
              Action: {advisory.irrigation.recommendedAction}
            </div>
          </div>
        </div>

        {/* Fertilizer Card */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600 border border-emerald-100">
                <Sprout className="h-5 w-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Fertilizer Plan</h4>
            </div>
            <ConfidenceBadge confidence={advisory.fertilizer.confidence} />
          </div>
          <div className="space-y-2 text-xs">
            <p className="font-bold text-slate-800">{advisory.fertilizer.title}</p>
            <p className="text-slate-600 leading-relaxed">{advisory.fertilizer.explanation}</p>
            <div className="rounded-xl bg-slate-50 p-2.5 font-semibold text-slate-900 border border-slate-100">
              Ratio: {advisory.fertilizer.npkRatio} • {advisory.fertilizer.dosagePerAcre}
            </div>
            <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-900 font-bold border border-emerald-100">
              Action: {advisory.fertilizer.recommendedAction}
            </div>
          </div>
        </div>

        {/* Pest & Disease Alert Card */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="rounded-xl bg-amber-50 p-2 text-amber-600 border border-amber-100">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Pest & Disease Alert</h4>
            </div>
            <ConfidenceBadge confidence={advisory.pestAlert.confidence} />
          </div>
          <div className="space-y-2 text-xs">
            <p className="font-bold text-slate-800">{advisory.pestAlert.pestOrDiseaseName}</p>
            <p className="text-slate-600 leading-relaxed">{advisory.pestAlert.explanation}</p>
            <div className="rounded-xl bg-amber-50 p-2.5 text-amber-900 font-bold border border-amber-100">
              Preventive Action: {advisory.pestAlert.recommendedAction}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
