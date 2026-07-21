"use client";

import * as React from "react";
import { PageHeader } from "../../../components/common/page-header";
import { WeatherInsightsModule } from "../../../components/dashboard/weather-insights-module";
import { MapView } from "../../../components/maps/map-view";

export default function WeatherPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        title="Micro-Climate Weather Center & Radar"
        description="Temperature, humidity, rainfall probability, wind speed indicators, and 7-day forecast."
      />
      <WeatherInsightsModule />
      <MapView />
    </div>
  );
}