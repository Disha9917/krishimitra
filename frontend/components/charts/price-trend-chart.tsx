import * as React from "react";
import { PricePoint } from "../../types/market";
import { Tabs } from "../ui/tabs";
import { formatINR } from "../../utils/currency";
import { TrendingUp } from "lucide-react";

export interface PriceTrendChartProps {
  title?: string;
  cropName?: string;
  dailyData?: PricePoint[];
  weeklyData?: PricePoint[];
  monthlyData?: PricePoint[];
}

export function PriceTrendChart({
  title = "Market Price Trend Analysis",
  cropName = "Wheat",
  dailyData = [
    { label: "06:00 AM", price: 2390, date: "2026-07-21" },
    { label: "09:00 AM", price: 2400, date: "2026-07-21" },
    { label: "12:00 PM", price: 2415, date: "2026-07-21" },
    { label: "03:00 PM", price: 2420, date: "2026-07-21" },
  ],
  weeklyData = [
    { label: "Mon", price: 2360, date: "2026-07-15" },
    { label: "Tue", price: 2375, date: "2026-07-16" },
    { label: "Wed", price: 2390, date: "2026-07-17" },
    { label: "Thu", price: 2400, date: "2026-07-18" },
    { label: "Fri", price: 2410, date: "2026-07-19" },
    { label: "Sat", price: 2415, date: "2026-07-20" },
    { label: "Sun", price: 2420, date: "2026-07-21" },
  ],
  monthlyData = [
    { label: "Week 1", price: 2280, date: "2026-06-21" },
    { label: "Week 2", price: 2320, date: "2026-06-28" },
    { label: "Week 3", price: 2365, date: "2026-07-07" },
    { label: "Week 4", price: 2420, date: "2026-07-21" },
  ],
}: PriceTrendChartProps) {
  const [timeframe, setTimeframe] = React.useState<"daily" | "weekly" | "monthly">("weekly");

  const currentData = timeframe === "daily" ? dailyData : timeframe === "weekly" ? weeklyData : monthlyData;
  const prices = currentData.map((d) => d.price);
  const minPrice = Math.min(...prices) * 0.98;
  const maxPrice = Math.max(...prices) * 1.02;

  // SVG dimensions
  const svgWidth = 600;
  const svgHeight = 220;
  const padding = 35;

  const points = currentData.map((d, index) => {
    const x = padding + (index / (currentData.length - 1 || 1)) * (svgWidth - padding * 2);
    const y = svgHeight - padding - ((d.price - minPrice) / (maxPrice - minPrice || 1)) * (svgHeight - padding * 2);
    return { x, y, price: d.price, label: d.label };
  });

  const pathD = points.reduce((acc, point, index) => {
    return index === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`;
  }, "");

  const areaD = `${pathD} L ${points[points.length - 1]?.x || 0} ${svgHeight - padding} L ${padding} ${svgHeight - padding} Z`;

  return (
    <div className="space-y-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
            {title} ({cropName})
          </h3>
          <p className="text-xs text-slate-500">Historical APMC market prices in ₹ / Quintal</p>
        </div>

        <Tabs
          tabs={[
            { id: "daily", label: "Daily" },
            { id: "weekly", label: "Weekly" },
            { id: "monthly", label: "Monthly" },
          ]}
          activeTab={timeframe}
          onChange={(id) => setTimeframe(id as any)}
        />
      </div>

      {/* Responsive SVG Chart */}
      <div className="relative w-full overflow-hidden">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto overflow-visible">
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#059669" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1={padding} y1={padding} x2={svgWidth - padding} y2={padding} stroke="#f1f5f9" strokeDasharray="4 4" />
          <line x1={padding} y1={svgHeight / 2} x2={svgWidth - padding} y2={svgHeight / 2} stroke="#f1f5f9" strokeDasharray="4 4" />
          <line x1={padding} y1={svgHeight - padding} x2={svgWidth - padding} y2={svgHeight - padding} stroke="#e2e8f0" />

          {/* Area fill & Line path */}
          <path d={areaD} fill="url(#chartGradient)" />
          <path d={pathD} fill="none" stroke="#059669" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

          {/* Data Points */}
          {points.map((pt, idx) => (
            <g key={idx} className="group cursor-pointer">
              <circle cx={pt.x} cy={pt.y} r="5" fill="#059669" stroke="#ffffff" strokeWidth="2" />
              <text x={pt.x} y={pt.y - 10} textAnchor="middle" className="text-[10px] font-bold fill-slate-800 opacity-90">
                {formatINR(pt.price)}
              </text>
              <text x={pt.x} y={svgHeight - 12} textAnchor="middle" className="text-[10px] font-semibold fill-slate-400">
                {pt.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
