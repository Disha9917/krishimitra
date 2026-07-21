import * as React from "react";
import { MapPin, Store, Navigation } from "lucide-react";

export interface MarkerPopupProps {
  title: string;
  type: "Farm" | "Current Location" | "Market";
  address: string;
  distance?: string;
}

export function MarkerPopup({ title, type, address, distance }: MarkerPopupProps) {
  return (
    <div className="rounded-xl bg-white p-3 shadow-md border border-slate-100 space-y-1 text-xs">
      <div className="flex items-center gap-1.5 font-bold text-slate-900">
        {type === "Market" ? <Store className="h-4 w-4 text-emerald-600" /> : <MapPin className="h-4 w-4 text-rose-500" />}
        <span>{title}</span>
      </div>
      <p className="text-[11px] text-slate-500">{address}</p>
      {distance && <span className="inline-block font-semibold text-emerald-600">{distance} away</span>}
    </div>
  );
}