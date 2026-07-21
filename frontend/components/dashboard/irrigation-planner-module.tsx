import * as React from "react";
import { Droplets, Calendar, CheckCircle2, Clock } from "lucide-react";
import { Button } from "../ui/button";

export function IrrigationPlannerModule() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
            <Droplets className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Smart Water & Irrigation Planner</h3>
            <p className="text-xs text-slate-500">Evapotranspiration & micro-drip scheduling engine</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="rounded-xl bg-blue-50 p-4 border border-blue-100 space-y-1">
            <span className="text-blue-700 font-bold block">Next Water Cycle</span>
            <p className="text-lg font-black text-blue-950">Tomorrow, 06:00 AM</p>
            <p className="text-blue-800 font-medium">Duration: 40 Minutes Sprinkler</p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 space-y-1">
            <span className="text-slate-500 font-medium block">Soil Moisture Level</span>
            <p className="text-lg font-black text-slate-900">68% Retention</p>
            <p className="text-emerald-700 font-semibold">Optimal for Wheat Rooting</p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 space-y-1">
            <span className="text-slate-500 font-medium block">Water Saved This Month</span>
            <p className="text-lg font-black text-emerald-600">32,500 Liters</p>
            <p className="text-slate-600">Via drip micro-irrigation</p>
          </div>
        </div>
      </div>
    </div>
  );
}