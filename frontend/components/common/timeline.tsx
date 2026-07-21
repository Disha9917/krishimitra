import * as React from "react";
import { DayAdvisory } from "../../types/crop";
import { cn } from "../../lib/utils";
import { CloudRain, Droplets, Sprout, ShieldAlert, Calendar } from "lucide-react";

export interface TimelineProps {
  days: DayAdvisory[];
  className?: string;
}

export function Timeline({ days, className }: TimelineProps) {
  const [activeDay, setActiveDay] = React.useState<number>(1);

  return (
    <div className={cn("space-y-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm", className)}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-emerald-600" />
            7-Day Advisory Timeline
          </h3>
          <p className="text-xs text-slate-500">Day 1 to Day 7 micro-climate recommendations & field actions</p>
        </div>

        {/* Day Pills Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {days.map((d) => {
            const isSelected = activeDay === d.day;
            return (
              <button
                key={d.day}
                onClick={() => setActiveDay(d.day)}
                className={cn(
                  "flex flex-col items-center rounded-xl px-3 py-1.5 text-xs font-semibold transition-all min-w-[54px]",
                  isSelected
                    ? "bg-emerald-600 text-white shadow-sm shadow-emerald-200"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                )}
              >
                <span>Day {d.day}</span>
                <span className={cn("text-[10px]", isSelected ? "text-emerald-100" : "text-slate-400")}>
                  {d.dayName}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid Timeline Cards */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
        {days.map((d) => {
          const isSelected = activeDay === d.day;
          return (
            <div
              key={d.day}
              onClick={() => setActiveDay(d.day)}
              className={cn(
                "cursor-pointer rounded-2xl border p-3.5 transition-all flex flex-col justify-between space-y-3",
                isSelected
                  ? "border-emerald-500 bg-emerald-50/40 ring-2 ring-emerald-500/20 shadow-xs"
                  : "border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50/50"
              )}
            >
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 border-b border-slate-100 pb-2">
                  <span>Day {d.day}</span>
                  <span className="text-slate-500 font-normal">{d.date}</span>
                </div>
                <div className="mt-2 text-xs font-medium text-slate-600 flex items-center justify-between">
                  <span>{d.weatherCondition}</span>
                  <span className="font-bold text-slate-900">{d.temperature}</span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                {/* Weather / Rain */}
                <div className="flex items-center gap-1.5 text-slate-600">
                  <CloudRain className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                  <span className="truncate">{d.rainfallProbability}% Rain</span>
                </div>

                {/* Irrigation */}
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Droplets className="h-3.5 w-3.5 text-cyan-500 shrink-0" />
                  <span className="truncate">{d.irrigation}</span>
                </div>

                {/* Fertilizer */}
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Sprout className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">{d.fertilizer}</span>
                </div>

                {/* Disease Risk */}
                <div className="flex items-center gap-1.5">
                  <ShieldAlert className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                  <span
                    className={cn(
                      "font-semibold rounded px-1.5 py-0.5 text-[10px]",
                      d.diseaseRisk === "High"
                        ? "bg-rose-100 text-rose-800"
                        : d.diseaseRisk === "Medium"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-emerald-100 text-emerald-800"
                    )}
                  >
                    Risk: {d.diseaseRisk}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
