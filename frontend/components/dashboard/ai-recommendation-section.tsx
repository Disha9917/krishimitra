import * as React from "react";
import { CropAdvisoryResult } from "../../types/crop";
import { RecommendationCard } from "../cards/recommendation-card";
import { ConfidenceBadge } from "../common/confidence-badge";
import { Droplets, Sprout, ShieldAlert, Sparkles, CheckCircle2 } from "lucide-react";

export interface AIRecommendationSectionProps {
  advisory: CropAdvisoryResult;
  className?: string;
}

export function AIRecommendationSection({ advisory, className }: AIRecommendationSectionProps) {
  return (
    <div className={`space-y-6 ${className || ""}`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200/60 pb-4">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-200 mb-1">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            AI Precision Crop Engine Active
          </span>
          <h2 className="text-xl font-extrabold text-slate-900 sm:text-2xl">
            Ranked Recommendations for {advisory.farmerInput.cropType || "Wheat"}
          </h2>
          <p className="text-xs text-slate-500">Tailored for PIN {advisory.farmerInput.pinCode} • Sowing: {advisory.farmerInput.sowingDate}</p>
        </div>
      </div>

      {/* Top 3 Ranked Advisories */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Top 3 Ranked Field Advisories</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {advisory.top3Advisories.map((rec) => (
            <RecommendationCard key={rec.id} item={rec} />
          ))}
        </div>
      </div>

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
