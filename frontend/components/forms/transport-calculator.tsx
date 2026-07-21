import * as React from "react";
import { marketService } from "../../services/market.service";
import { TransportCalculationResult } from "../../types/market";
import { TRANSPORT_TYPES } from "../../utils/constants";
import { formatINR } from "../../utils/currency";
import { Input } from "../ui/input";
import { Select } from "../ui/select";
import { Button } from "../ui/button";
import { Truck, Calculator, MapPin, DollarSign, Navigation, ArrowRight } from "lucide-react";

export function TransportCalculator() {
  const [origin, setOrigin] = React.useState("Farmgate (Ludhiana, PB)");
  const [destination, setDestination] = React.useState("Azadpur APMC (Delhi)");
  const [quantityKg, setQuantityKg] = React.useState(2500);
  const [transportType, setTransportType] = React.useState<any>("Medium Truck (5-10 Ton)");
  const [result, setResult] = React.useState<TransportCalculationResult | null>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const res = marketService.calculateTransportCost({
      origin,
      destination,
      quantityKg: Number(quantityKg),
      transportType,
    });
    setResult(res);
  };

  React.useEffect(() => {
    // Initial calculation
    const res = marketService.calculateTransportCost({
      origin,
      destination,
      quantityKg: Number(quantityKg),
      transportType,
    });
    setResult(res);
  }, []);

  return (
    <div className="space-y-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="border-b border-slate-100 pb-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Truck className="h-5 w-5 text-emerald-600" />
          Transport Cost & Logistics Calculator
        </h3>
        <p className="text-xs text-slate-500">Estimate distance, freight charges, and net profit margins</p>
      </div>

      <form onSubmit={handleCalculate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Origin (Farm or Local Mandi)"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          placeholder="e.g. Ludhiana, Punjab"
          required
        />

        <Input
          label="Destination APMC / Market"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="e.g. Azadpur Mandi, Delhi"
          required
        />

        <Input
          label="Produce Quantity (in Kilograms)"
          type="number"
          value={quantityKg}
          onChange={(e) => setQuantityKg(Number(e.target.value))}
          placeholder="e.g. 2500"
          required
        />

        <Select
          label="Vehicle / Logistics Mode"
          value={transportType}
          onChange={(e) => setTransportType(e.target.value as any)}
          options={TRANSPORT_TYPES.map((t) => ({ label: t, value: t }))}
        />

        <div className="md:col-span-2 pt-2">
          <Button type="submit" variant="primary" className="w-full">
            <Calculator className="h-4 w-4" />
            Calculate Distance & Transport Profit
          </Button>
        </div>
      </form>

      {/* Output Results */}
      {result && (
        <div className="rounded-2xl bg-emerald-50/60 p-5 border border-emerald-100 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Transport Calculation Output</span>
              <p className="text-xs text-emerald-700 font-medium">Estimated route: {result.origin} → {result.destination}</p>
            </div>
            <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white shadow-xs">
              {result.distanceKm} km ({result.estimatedTransitHours} hrs transit)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="rounded-xl bg-white p-3 border border-emerald-100">
              <span className="text-slate-500 font-medium">Distance</span>
              <span className="text-sm font-black text-slate-900 mt-1 block">{result.distanceKm} km</span>
            </div>

            <div className="rounded-xl bg-white p-3 border border-emerald-100">
              <span className="text-slate-500 font-medium">Transport Cost</span>
              <span className="text-sm font-black text-rose-600 mt-1 block">{formatINR(result.transportCost)}</span>
            </div>

            <div className="rounded-xl bg-white p-3 border border-emerald-100">
              <span className="text-slate-500 font-medium">Gross Revenue</span>
              <span className="text-sm font-black text-slate-900 mt-1 block">{formatINR(result.grossRevenue)}</span>
            </div>

            <div className="rounded-xl bg-emerald-600 p-3 text-white">
              <span className="text-emerald-100 font-medium block">Net Estimated Profit</span>
              <span className="text-base font-black mt-1 block">{formatINR(result.netEstimatedProfit)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
