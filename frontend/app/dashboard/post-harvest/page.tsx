"use client";

import * as React from "react";
import { PageHeader } from "../../../components/common/page-header";
import { SpoilageCard } from "../../../components/cards/spoilage-card";
import { DecisionCard } from "../../../components/cards/decision-card";
import { Input } from "../../../components/ui/input";
import { Select } from "../../../components/ui/select";
import { Button } from "../../../components/ui/button";
import { CROP_OPTIONS, STORAGE_CONDITIONS } from "../../../utils/constants";
import { calculateSpoilageRisk } from "../../../lib/helpers";
import { SpoilageRiskResult } from "../../../types/postharvest";
import { Warehouse, Sparkles, Store, Truck, DollarSign } from "lucide-react";

export default function PostHarvestPlannerPage() {
  const [crop, setCrop] = React.useState("Wheat");
  const [quantityKg, setQuantityKg] = React.useState(5000);
  const [harvestDate, setHarvestDate] = React.useState("2026-07-15");
  const [storageCondition, setStorageCondition] = React.useState<any>("Ventilated Warehouse");
  const [location, setLocation] = React.useState("Ludhiana, Punjab");

  const [result, setResult] = React.useState<SpoilageRiskResult | null>(null);

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    const riskData = calculateSpoilageRisk(crop, Number(quantityKg), harvestDate, storageCondition);

    // Compute Sell vs Store vs Transport decision metrics
    const qtyQuintals = Number(quantityKg) / 100;
    const basePrice = 2420; // INR per quintal

    const sellProfit = Math.round(qtyQuintals * basePrice * 0.96); // immediate farmgate sale
    const storeProfit = Math.round(qtyQuintals * (basePrice * 1.12) - (qtyQuintals * 45)); // stored 30 days
    const transportProfit = Math.round(qtyQuintals * 2550 - (qtyQuintals * 65 + 1200)); // shipped to metro mandi

    setResult({
      crop,
      quantityKg: Number(quantityKg),
      harvestDate,
      storageCondition,
      location,
      spoilageRiskPercentage: riskData.spoilageRiskPercentage,
      riskLevel: riskData.riskLevel,
      shelfLifeDays: riskData.shelfLifeDays,
      daysRemaining: riskData.daysRemaining,
      storageRecommendation:
        storageCondition === "Cold Storage"
          ? "Storage condition is optimal. Maintain temperature between 4°C - 8°C with ventilation."
          : "Aeration required every 3 days. Monitor relative humidity to prevent fungal moisture build-up.",
      decisions: {
        sell: {
          type: "SELL",
          title: "Sell Now at Local APMC Mandi",
          expectedProfit: sellProfit,
          currency: "INR",
          reason: "Avoid spoilage risk and lock in current high market prices (₹2,420/Qtl).",
          risk: "Low",
          netReturnPerKg: Math.round(sellProfit / Number(quantityKg)),
          timeframe: "Immediate (1-2 Days)",
          recommended: riskData.spoilageRiskPercentage > 60,
        },
        store: {
          type: "STORE",
          title: "Store in Warehouse for 30 Days",
          expectedProfit: storeProfit,
          currency: "INR",
          reason: "Off-season price spike expected (+12%). Safe storage days remaining: " + riskData.daysRemaining + " days.",
          risk: riskData.spoilageRiskPercentage > 50 ? "High" : "Low",
          netReturnPerKg: Math.round(storeProfit / Number(quantityKg)),
          timeframe: "Hold 3-4 Weeks",
          recommended: riskData.spoilageRiskPercentage <= 60 && storageCondition !== "Ambient/Open",
        },
        transport: {
          type: "TRANSPORT",
          title: "Transport to Azadpur Metro Mandi",
          expectedProfit: transportProfit,
          currency: "INR",
          reason: "High demand in metro markets yielding premium prices (+₹130/Qtl margin).",
          risk: "Medium",
          netReturnPerKg: Math.round(transportProfit / Number(quantityKg)),
          timeframe: "24-48 Hours Transit",
          recommended: false,
        },
      },
      analyzedAt: new Date().toISOString(),
    });
  };

  React.useEffect(() => {
    // Initial analysis load
    const event = { preventDefault: () => {} } as any;
    handleAnalyze(event);
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        title="Post-Harvest Loss Reduction Planner"
        description="Calculate spoilage risk %, safe shelf life, and Sell vs Store vs Transport commercial decision matrix."
      />

      {/* Input Form */}
      <form onSubmit={handleAnalyze} className="space-y-5 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Warehouse className="h-5 w-5 text-emerald-600" />
            Harvest Batch & Storage Details
          </h3>
          <p className="text-xs text-slate-500">Provide harvest parameters to evaluate spoilage risk</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Harvested Crop"
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
            options={CROP_OPTIONS}
          />

          <Input
            label="Harvest Quantity (Kilograms)"
            type="number"
            value={quantityKg}
            onChange={(e) => setQuantityKg(Number(e.target.value))}
            placeholder="e.g. 5000"
            required
          />

          <Input
            label="Harvest Date"
            type="date"
            value={harvestDate}
            onChange={(e) => setHarvestDate(e.target.value)}
            required
          />

          <Select
            label="Current Storage Condition"
            value={storageCondition}
            onChange={(e) => setStorageCondition(e.target.value as any)}
            options={STORAGE_CONDITIONS.map((c) => ({ label: c, value: c }))}
          />

          <div className="md:col-span-2">
            <Input
              label="Storage Location / District"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Ludhiana, Punjab"
              required
            />
          </div>
        </div>

        <div className="pt-2">
          <Button type="submit" variant="primary" size="lg" className="w-full">
            <Sparkles className="h-5 w-5" />
            Calculate Spoilage Risk & Decision Matrix
          </Button>
        </div>
      </form>

      {/* Results Output */}
      {result && (
        <div className="space-y-8 animate-fade-in">
          {/* Requirement #8: Spoilage Risk Visualization */}
          <SpoilageCard result={result} />

          {/* Requirement #9: Sell / Store / Transport Recommendation Cards */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-emerald-600" />
              Sell / Store / Transport Decision Engine
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <DecisionCard decision={result.decisions.sell} />
              <DecisionCard decision={result.decisions.store} />
              <DecisionCard decision={result.decisions.transport} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
