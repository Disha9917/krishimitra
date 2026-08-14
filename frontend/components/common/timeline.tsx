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
    <div className={cn("space-y-6 rounded-2xl border border-slate-100 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22] p-6 shadow-sm", className)}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-[#2A2F3A] pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            7-Day Advisory Timeline
          </h3>
          <p className="text-xs text-slate-500 dark:text-[#8B949E]">Day 1 to Day 7 micro-climate recommendations & field actions</p>
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
                  "flex flex-col items-center rounded-xl px-3 py-1.5 text-xs font-semibold transition-all min-w-[54px] cursor-pointer",
                  isSelected
                    ? "bg-emerald-600 dark:bg-emerald-500 text-white shadow-sm shadow-emerald-200 dark:shadow-none"
                    : "bg-slate-50 dark:bg-[#111827] text-slate-600 dark:text-[#C9D1D9] hover:bg-slate-100 dark:hover:bg-[#1C212A]"
                )}
              >
                <span>Day {d.day}</span>
                <span className={cn("text-[10px]", isSelected ? "text-emerald-100" : "text-slate-400 dark:text-[#8B949E]")}>
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
                  ? "border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/30 ring-2 ring-emerald-500/20 shadow-xs"
                  : "border-slate-100 dark:border-[#2A2F3A] bg-white dark:bg-[#161B22] hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-[#1C212A]"
              )}
            >
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-[#2A2F3A] pb-2">
                  <span>Day {d.day}</span>
                  <span className="text-slate-500 dark:text-[#8B949E] font-normal">{d.date}</span>
                </div>
                <div className="mt-2 text-xs font-medium text-slate-600 dark:text-[#C9D1D9] flex items-center justify-between">
                  <span>{d.weatherCondition}</span>
                  <span className="font-bold text-slate-900 dark:text-white">{d.temperature}</span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                {/* Weather / Rain */}
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-[#C9D1D9]">
                  <CloudRain className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                  <span className="truncate">{d.rainfallProbability}% Rain</span>
                </div>

                {/* Irrigation */}
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-[#C9D1D9]">
                  <Droplets className="h-3.5 w-3.5 text-cyan-500 shrink-0" />
                  <span className="truncate">{d.irrigation}</span>
                </div>

                {/* Fertilizer */}
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-[#C9D1D9]">
                  <Sprout className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="truncate">{d.fertilizer}</span>
                </div>

                {/* Disease Risk */}
                <div className="flex items-center gap-1.5">
                  <ShieldAlert className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                  <span
                    className={cn(
                      "font-semibold rounded px-1.5 py-0.5 text-[10px]",
                      d.diseaseRisk === "High"
                        ? "bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300"
                        : d.diseaseRisk === "Medium"
                        ? "bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300"
                        : "bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300"
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
