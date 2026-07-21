"use client";

import * as React from "react";
import { PageHeader } from "../../../components/common/page-header";
import { CropRecommendationModule } from "../../../components/dashboard/crop-recommendation-module";

export default function CropAdvisorPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="AI Precision Crop Advisory System"
        description="Ranked crop recommendations, irrigation, fertilizer dosages, and 7-day advisory timeline."
      />
      <CropRecommendationModule />
    </div>
  );
}