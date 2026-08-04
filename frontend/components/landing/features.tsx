import * as React from "react";
import { FeatureCard } from "../cards/feature-card";
import { Sprout, Scan, Warehouse, TrendingUp, Tractor, Landmark } from "lucide-react";

export function Features() {
  const items = [
    { icon: <Sprout />, title: "Precision Crop Advisory", description: "GPS location & sowing date based irrigation, fertilizer, and pest recommendations with confidence ratings." },
    { icon: <Warehouse />, title: "Post-Harvest Loss Planner", description: "Predict spoilage risk % and shelf life days. Receive SELL vs STORE vs TRANSPORT decisions with net profit estimates." },
    { icon: <Scan />, title: "AI Leaf Disease Scanner", description: "Instant leaf image analysis for crop disease detection, symptom isolation, and prescribed remedies." },
    { icon: <TrendingUp />, title: "APMC Mandi Intelligence", description: "Track daily, weekly, and monthly market price trends with integrated transport cost calculation." },
    { icon: <Tractor />, title: "Farm Equipment Rental", description: "Rent high-horsepower tractors, combine harvesters, and tools from verified local owners at hourly or daily rates." },
    { icon: <Landmark />, title: "Government Subsidies & Schemes", description: "Check eligibility and apply for PM-KISAN, solar pump subsidies, seed grants, and central welfare programs." },
  ];

  return (
    <section className="py-16 bg-transparent">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white sm:text-4xl">Comprehensive AgriTech Platform Features</h2>
          <p className="text-sm text-slate-600 dark:text-[#C9D1D9]">Built specifically for smallholder farmers to maximize yield and eliminate post-harvest losses.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <FeatureCard key={i} icon={item.icon} title={item.title} description={item.description} />
          ))}
        </div>
      </div>
    </section>
  );
}