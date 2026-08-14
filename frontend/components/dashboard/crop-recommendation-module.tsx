import * as React from "react";
import { FarmerInputForm } from "../forms/farmer-input-form";
import { AIRecommendationSection } from "./ai-recommendation-section";
import { Timeline } from "../common/timeline";
import { AlertBanner } from "../feedback/alert-banner";
import { useCropRecommendation } from "../../hooks/useCropRecommendation";
import { Sparkles } from "lucide-react";

export function CropRecommendationModule() {
  const { advisory, isLoading, error, fromHistory, getAdvisory } = useCropRecommendation();

  return (
    <div className="space-y-8">
      {error && !advisory && (
        <AlertBanner
          type="error"
          title="AI advisory unavailable"
          message={`${error} Please try again shortly.`}
        />
      )}
      <FarmerInputForm onSubmit={getAdvisory} isLoading={isLoading} />
      {isLoading && (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 dark:border-[#2A2F3A] bg-emerald-50/70 dark:bg-[#111827] p-4 text-sm font-semibold text-emerald-800 dark:text-emerald-300">
          <Sparkles className="h-5 w-5 animate-pulse text-emerald-600 dark:text-emerald-400" />
          Generating AI advisory with the precision engine...
        </div>
      )}
      {advisory && (
        <div className="space-y-8 animate-fade-in">
          {fromHistory && (
            <AlertBanner
              type="info"
              title="Showing your last saved advisory"
              message="Live generation failed, so we loaded your most recent advisory from history."
            />
          )}
          <AIRecommendationSection advisory={advisory} />
          <Timeline days={advisory.timeline7Days || advisory.timeline || []} />
        </div>
      )}
    </div>
  );
}
