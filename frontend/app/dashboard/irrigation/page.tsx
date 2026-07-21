"use client";

import * as React from "react";
import { PageHeader } from "../../../components/common/page-header";
import { IrrigationPlannerModule } from "../../../components/dashboard/irrigation-planner-module";

export default function IrrigationPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Smart Irrigation & Drip Planner"
        description="Evapotranspiration monitoring, soil moisture tracking, and scheduled watering cycles."
      />
      <IrrigationPlannerModule />
    </div>
  );
}