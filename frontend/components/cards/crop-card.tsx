import * as React from "react";
import { Sprout, Calendar, Droplet, ArrowRight } from "lucide-react";
import Link from "next/link";

export interface CropCardProps {
  name: string;
  variety: string;
  sowingDate: string;
  stage: string;
  healthStatus: string;
}

export function CropCard({ name, variety, sowingDate, stage, healthStatus }: CropCardProps) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="rounded-xl bg-emerald-100 p-2 text-emerald-700">
            <Sprout className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900">{name}</h4>
            <p className="text-xs text-slate-500">{variety}</p>
          </div>
        </div>
        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
          {healthStatus}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 my-4 text-xs">
        <div className="rounded-xl bg-slate-50 p-2.5">
          <span className="text-slate-400 block font-medium">Sowing Date</span>
          <span className="font-bold text-slate-800 mt-0.5 block">{sowingDate}</span>
        </div>
        <div className="rounded-xl bg-slate-50 p-2.5">
          <span className="text-slate-400 block font-medium">Growth Stage</span>
          <span className="font-bold text-slate-800 mt-0.5 block">{stage}</span>
        </div>
      </div>

      <Link
        href="/dashboard/crop-advisor"
        className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-slate-50 py-2 text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
      >
        <span>View Advisory</span>
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}