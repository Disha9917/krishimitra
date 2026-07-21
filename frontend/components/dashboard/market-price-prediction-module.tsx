import * as React from "react";
import { MarketPriceTable } from "../tables/market-price-table";
import { PriceTrendChart } from "../charts/price-trend-chart";
import { TransportCalculator } from "../forms/transport-calculator";
import { MOCK_MARKET_PRICES } from "../../store/market.store";
import { MarketPriceItem } from "../../types/market";

export function MarketPricePredictionModule() {
  const [selectedCrop, setSelectedCrop] = React.useState<MarketPriceItem>(MOCK_MARKET_PRICES[0]);

  return (
    <div className="space-y-8">
      <MarketPriceTable items={MOCK_MARKET_PRICES} onSelectCrop={setSelectedCrop} />
      <PriceTrendChart
        title="APMC Mandi Price Trend"
        cropName={selectedCrop.cropName}
        weeklyData={selectedCrop.weeklyTrend}
        monthlyData={selectedCrop.monthlyTrend}
      />
      <TransportCalculator />
    </div>
  );
}