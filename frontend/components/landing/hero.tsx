import * as React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { Sprout, Sparkles, ShieldCheck, Warehouse, ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-emerald-50/50 via-white to-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-xs font-bold text-emerald-800 border border-emerald-200">
          <Sparkles className="h-4 w-4 text-emerald-600" />
          <span>Precision AgriTech AI & Post-Harvest Loss Reduction</span>
        </div>

        <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-6xl max-w-4xl mx-auto leading-tight">
          Empowering Smallholder Farmers with <span className="text-emerald-600">AI Crop Intelligence</span>
        </h1>

        <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Top-ranked AI advisories, 7-day micro-climate timelines, leaf disease diagnosis, and post-harvest spoilage loss reduction for maximum farm profit.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link href="/dashboard">
            <Button variant="primary" size="lg" className="shadow-lg shadow-emerald-200">
              Launch Farmer Advisory System
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/dashboard/post-harvest">
            <Button variant="secondary" size="lg">
              <Warehouse className="h-5 w-5" />
              Post-Harvest Loss Planner
            </Button>
          </Link>
        </div>

        {/* Highlight Chips */}
        <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left text-xs font-bold text-slate-700">
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm flex items-center gap-3">
            <Sprout className="h-6 w-6 text-emerald-600 shrink-0" />
            <span>Top 3 Ranked Advisories</span>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-emerald-600 shrink-0" />
            <span>Confidence Badge Indicators</span>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm flex items-center gap-3">
            <Warehouse className="h-6 w-6 text-emerald-600 shrink-0" />
            <span>Sell / Store / Transport Engine</span>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-emerald-600 shrink-0" />
            <span>7-Day Advisory Timeline</span>
          </div>
        </div>
      </div>
    </div>
  );
}