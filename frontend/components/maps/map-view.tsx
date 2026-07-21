import * as React from "react";
import { MarkerPopup } from "./marker-popup";
import { MapPin, Navigation, Store, Layers } from "lucide-react";

export function MapView() {
  const [selectedMarker, setSelectedMarker] = React.useState<string>("farm");

  const markers = [
    { id: "current", title: "Current GPS Location", type: "Current Location" as const, address: "Ludhiana City Center (30.9010° N, 75.8573° E)", distance: "0 km" },
    { id: "farm", title: "Rajesh Kumar Farm Plot #4", type: "Farm" as const, address: "Gill Village Field, Ludhiana (30.8850° N, 75.8420° E)", distance: "3.2 km" },
    { id: "market1", title: "Khanna APMC Grain Mandi", type: "Market" as const, address: "GT Road, Khanna, Punjab", distance: "42 km" },
    { id: "market2", title: "Jalandhar APMC Sub-Mandi", type: "Market" as const, address: "Grand Trunk Rd, Jalandhar", distance: "65 km" },
  ];

  return (
    <div className="space-y-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Navigation className="h-5 w-5 text-emerald-600" />
            Interactive GIS Farm & APMC Market Map
          </h3>
          <p className="text-xs text-slate-500">View current GPS location, registered farm plot boundary, and nearby APMC mandis</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            <MapPin className="h-3.5 w-3.5 text-emerald-600" /> Farm Plot
          </span>
          <span className="flex items-center gap-1 text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
            <Store className="h-3.5 w-3.5 text-blue-600" /> Mandi Markets
          </span>
        </div>
      </div>

      {/* Visual GIS Canvas Mockup */}
      <div className="relative h-80 w-full overflow-hidden rounded-2xl bg-slate-900 p-4 border border-slate-800 flex flex-col justify-between">
        {/* Map Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Floating Controls */}
        <div className="relative z-10 flex justify-between items-start">
          <div className="rounded-xl bg-slate-800/90 backdrop-blur-xs px-3 py-1.5 text-xs text-slate-200 border border-slate-700 flex items-center gap-1.5">
            <Layers className="h-4 w-4 text-emerald-400" />
            <span>Satellite + Soil Grid Active</span>
          </div>
        </div>

        {/* Interactive Simulated Pin Markers */}
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-3">
          {markers.map((m) => {
            const isSelected = selectedMarker === m.id;
            return (
              <div
                key={m.id}
                onClick={() => setSelectedMarker(m.id)}
                className={`cursor-pointer rounded-xl p-3 transition-all border ${
                  isSelected
                    ? "bg-slate-800 text-white border-emerald-500 ring-2 ring-emerald-500/30"
                    : "bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold">
                  {m.type === "Market" ? (
                    <Store className="h-4 w-4 text-blue-400" />
                  ) : (
                    <MapPin className="h-4 w-4 text-emerald-400" />
                  )}
                  <span className="truncate">{m.title}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 truncate">{m.address}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Marker Detail Card */}
      {selectedMarker && (
        <div className="animate-fade-in">
          {(() => {
            const m = markers.find((item) => item.id === selectedMarker);
            if (!m) return null;
            return <MarkerPopup title={m.title} type={m.type} address={m.address} distance={m.distance} />;
          })()}
        </div>
      )}
    </div>
  );
}