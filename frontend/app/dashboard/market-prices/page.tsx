"use client";

import * as React from "react";
import { PageHeader } from "../../../components/common/page-header";
import { MarketPricePredictionModule } from "../../../components/dashboard/market-price-prediction-module";

export default function MarketPricesPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="APMC Mandi Market Price & Logistics Intelligence"
        description="Today's commodity prices, daily/weekly/monthly trend analysis, and transport cost calculator."
      />
      <MarketPricePredictionModule />
    </div>
  );
}