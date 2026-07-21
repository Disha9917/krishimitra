"use client";

import * as React from "react";
import { PageHeader } from "../../../components/common/page-header";
import { DiseaseDetectionModule } from "../../../components/dashboard/disease-detection-module";

export default function DiseaseDetectionPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="AI Leaf Disease Diagnostic Scanner"
        description="Upload leaf photos for automated disease classification, symptom breakdown, and fungicide remedies."
      />
      <DiseaseDetectionModule />
    </div>
  );
}