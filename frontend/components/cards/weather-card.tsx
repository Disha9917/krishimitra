import * as React from "react";
import { CloudSun, Droplets, Wind } from "lucide-react";

export interface WeatherCardProps {
  temperature: number;
  condition: string;
  humidity: number;
  rainfall: number;
}

export function WeatherCard({ temperature, condition, humidity, rainfall }: WeatherCardProps) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-amber-50 p-2 text-amber-600 border border-amber-100">
            <CloudSun className="h-6 w-6" />
          </div>
          <div>
            <h4 className="text-xl font-black text-slate-900">{temperature}°C</h4>
            <p className="text-xs text-slate-500 font-medium">{condition}</p>
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-slate-600">
        <span className="flex items-center gap-1"><Droplets className="h-3.5 w-3.5 text-blue-500" /> {humidity}% Humidity</span>
        <span className="flex items-center gap-1"><Wind className="h-3.5 w-3.5 text-slate-400" /> {rainfall}mm Rain</span>
      </div>
    </div>
  );
}