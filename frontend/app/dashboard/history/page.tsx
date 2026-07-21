"use client";

import * as React from "react";
import { PageHeader } from "../../../components/common/page-header";
import { PredictionHistoryModule } from "../../../components/dashboard/prediction-history-module";

export default function HistoryPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Prediction & Advisory History Log"
        description="Searchable log of previous crop advisories, disease diagnoses, and report downloads."
      />
      <PredictionHistoryModule />
    </div>
  );
}