"use client";

import * as React from "react";
import { PageHeader } from "../../components/common/page-header";
import { WeatherWidget } from "../../components/cards/weather-widget";
import { CropCard } from "../../components/cards/crop-card";
import { DiseaseCard } from "../../components/cards/disease-card";
import { MarketCard } from "../../components/cards/market-card";
import { StatsCard } from "../../components/cards/stats-card";
import { NotificationPanel } from "../../components/dashboard/notification-panel";
import { RecentActivityModule } from "../../components/dashboard/recent-activity-module";
import { Button } from "../../components/ui/button";
import { MOCK_CURRENT_WEATHER } from "../../store/weather.store";
import { MOCK_MARKET_PRICES } from "../../store/market.store";
import Link from "next/link";
import { Sprout, Warehouse, Scan, TrendingUp, Sparkles, FileText, Bell } from "lucide-react";

export default function DashboardOverviewPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        title="KrishiMitra Farmer Dashboard"
        description="Precision Crop Advisory System & Post-Harvest Loss Reduction Planner"
        action={
          <div className="flex items-center gap-2">
            <Link href="/dashboard/crop-advisor">
              <Button variant="primary" size="sm">
                <Sparkles className="h-4 w-4" /> New Advisory
              </Button>
            </Link>
            <Link href="/dashboard/post-harvest">
              <Button variant="secondary" size="sm">
                <Warehouse className="h-4 w-4" /> Post-Harvest Planner
              </Button>
            </Link>
          </div>
        }
      />

      {/* Quick Action Navigation Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link href="/dashboard/crop-advisor" className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm hover:border-emerald-200 hover:shadow-md transition-all flex items-center gap-3">
          <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-700">
            <Sprout className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Crop Advisory</h4>
            <p className="text-[10px] text-slate-500">7-Day Timeline</p>
          </div>
        </Link>

        <Link href="/dashboard/post-harvest" className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm hover:border-amber-200 hover:shadow-md transition-all flex items-center gap-3">
          <div className="rounded-xl bg-amber-100 p-2.5 text-amber-700">
            <Warehouse className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Post-Harvest</h4>
            <p className="text-[10px] text-slate-500">Spoilage & Sell/Store</p>
          </div>
        </Link>

        <Link href="/dashboard/disease-detection" className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm hover:border-rose-200 hover:shadow-md transition-all flex items-center gap-3">
          <div className="rounded-xl bg-rose-100 p-2.5 text-rose-700">
            <Scan className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Disease Scanner</h4>
            <p className="text-[10px] text-slate-500">Upload Leaf Scan</p>
          </div>
        </Link>

        <Link href="/dashboard/market-prices" className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm hover:border-blue-200 hover:shadow-md transition-all flex items-center gap-3">
          <div className="rounded-xl bg-blue-100 p-2.5 text-blue-700">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Market Prices</h4>
            <p className="text-[10px] text-slate-500">Trends & Transport</p>
          </div>
        </Link>
      </div>

      {/* Grid Row 1: Weather Summary & Current Crop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <WeatherWidget weather={MOCK_CURRENT_WEATHER} />
        </div>
        <div>
          <CropCard
            name="Wheat (गेहूं)"
            variety="HD-2967 Variety"
            sowingDate="10 June 2026"
            stage="Vegetative (45 Days)"
            healthStatus="Healthy"
          />
        </div>
      </div>

      {/* Grid Row 2: AI Advisory Summary & Disease Status & Market Prices */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* AI Advisory Summary */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-emerald-600" />
              <h4 className="text-base font-bold text-slate-900">AI Advisory Summary</h4>
            </div>
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
              High Confidence
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Top recommendation: Split Urea top-dressing @ 25kg/acre with 40-minute morning micro-sprinkler cycle.
          </p>
          <Link href="/dashboard/crop-advisor" className="block text-xs font-bold text-emerald-600 hover:underline pt-1">
            View Full 7-Day Advisory Timeline →
          </Link>
        </div>

        {/* Disease Status */}
        <DiseaseCard
          crop="Wheat"
          diseaseName="Yellow Rust Check"
          confidence="94%"
          severity="Low Outbreak Risk"
        />

        {/* Market Prices */}
        <MarketCard
          cropName="Wheat (Khanna Mandi)"
          mandiName="Punjab APMC"
          price={MOCK_MARKET_PRICES[0].todaysPrice}
          change={MOCK_MARKET_PRICES[0].changePercentage}
        />
      </div>

      {/* Grid Row 3: Notifications & Recent Predictions / Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivityModule />
        </div>
        <div>
          <NotificationPanel />
        </div>
      </div>
    </div>
  );
}