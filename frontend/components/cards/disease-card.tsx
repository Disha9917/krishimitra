import * as React from "react";
import { Scan, ShieldAlert, ArrowRight } from "lucide-react";
import Link from "next/link";

export interface DiseaseCardProps {
  crop: string;
  diseaseName: string;
  confidence: string;
  severity: string;
}

export function DiseaseCard({ crop, diseaseName, confidence, severity }: DiseaseCardProps) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="rounded-xl bg-rose-100 p-2 text-rose-700">
            <Scan className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900">{crop} Disease Status</h4>
            <p className="text-xs text-slate-500">{diseaseName}</p>
          </div>
        </div>
        <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 border border-amber-200">
          {confidence} Confidence
        </span>
      </div>
      <div className="mt-3 flex items-center justify-between text-xs">
        <span className="text-slate-500">Severity: <strong className="text-slate-800">{severity}</strong></span>
        <Link href="/dashboard/disease-detection" className="text-emerald-600 font-bold hover:underline inline-flex items-center gap-1">
          <span>Run Diagnosis</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}