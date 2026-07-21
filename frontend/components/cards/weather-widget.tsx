import * as React from "react";
import { CurrentWeather } from "../../types/weather";
import { Thermometer, Droplets, CloudRain, Wind, Sun, MapPin } from "lucide-react";

export interface WeatherWidgetProps {
  weather: CurrentWeather;
  className?: string;
}

export function WeatherWidget({ weather, className }: WeatherWidgetProps) {
  return (
    <div className={`rounded-2xl border border-slate-100 bg-white p-6 shadow-sm ${className || ""}`}>
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
            <MapPin className="h-3.5 w-3.5 text-emerald-600" />
            <span>{weather.location}</span>
          </div>
          <h3 className="text-2xl font-black text-slate-900 mt-1">{weather.temperature}°C</h3>
          <p className="text-xs font-semibold text-slate-600">{weather.weatherCondition} (Feels like {weather.feelsLike}°C)</p>
        </div>

        <div className="rounded-2xl bg-amber-50 p-4 border border-amber-100 text-amber-600">
          <Sun className="h-10 w-10" />
        </div>
      </div>

      {/* 4 Weather Indicator Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
        <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 border border-slate-100">
          <div className="rounded-lg bg-emerald-100 p-2 text-emerald-700">
            <Thermometer className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Temperature</span>
            <p className="text-sm font-bold text-slate-900">{weather.temperature}°C</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 border border-slate-100">
          <div className="rounded-lg bg-blue-100 p-2 text-blue-700">
            <Droplets className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Humidity</span>
            <p className="text-sm font-bold text-slate-900">{weather.humidity}%</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 border border-slate-100">
          <div className="rounded-lg bg-cyan-100 p-2 text-cyan-700">
            <CloudRain className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Rainfall</span>
            <p className="text-sm font-bold text-slate-900">{weather.rainfall} mm</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 border border-slate-100">
          <div className="rounded-lg bg-slate-200 p-2 text-slate-700">
            <Wind className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Wind Speed</span>
            <p className="text-sm font-bold text-slate-900">{weather.windSpeed} km/h</p>
          </div>
        </div>
      </div>
    </div>
  );
}
