import * as React from "react";
import { StatsCard } from "../cards/stats-card";
import { BarChart } from "../charts/bar-chart";
import { PieChart } from "../charts/pie-chart";
import { Sprout, TrendingUp, ShieldAlert, DollarSign } from "lucide-react";

export function AnalyticsModule() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Farm Size" value="4.5 Acres" subtitle="Active Wheat Cultivation" icon={<Sprout className="h-5 w-5" />} />
        <StatsCard title="Yield Projection" value="+18% Increase" subtitle="Compared to last season" icon={<TrendingUp className="h-5 w-5" />} trend="+18%" />
        <StatsCard title="Disease Outbreak Risk" value="Low" subtitle="Yellow Rust Monitored" icon={<ShieldAlert className="h-5 w-5" />} />
        <StatsCard title="Mandi Benchmark" value="₹2,420/Qtl" subtitle="Khanna Mandi Today" icon={<DollarSign className="h-5 w-5" />} trend="+2.8%" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BarChart
          title="Monthly Advisory Implementations"
          data={[
            { label: "Apr", value: 12 },
            { label: "May", value: 18 },
            { label: "Jun", value: 24 },
            { label: "Jul", value: 31 },
          ]}
        />
        <PieChart
          title="Field Resource Allocation"
          data={[
            { label: "Irrigation Drip", value: 40, color: "#3b82f6" },
            { label: "Nitrogen DAP", value: 35, color: "#10b981" },
            { label: "Pest Protection", value: 25, color: "#f59e0b" },
          ]}
        />
      </div>
    </div>
  );
}