import * as React from "react";
import { FarmerInputForm } from "../forms/farmer-input-form";
import { AIRecommendationSection } from "./ai-recommendation-section";
import { Timeline } from "../common/timeline";
import { useCropRecommendation } from "../../hooks/useCropRecommendation";

export function CropRecommendationModule() {
  const { advisory, isLoading, getAdvisory } = useCropRecommendation();

  return (
    <div className="space-y-8">
      <FarmerInputForm onSubmit={getAdvisory} isLoading={isLoading} />
      {advisory && (
        <div className="space-y-8 animate-fade-in">
          <AIRecommendationSection advisory={advisory} />
          <Timeline days={advisory.timeline7Days} />
        </div>
      )}
    </div>
  );
}