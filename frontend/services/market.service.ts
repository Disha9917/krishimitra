import { MOCK_MARKET_PRICES } from "../store/market.store";
import { TransportCalculationInput, TransportCalculationResult } from "../types/market";

export const marketService = {
  async getMarketPrices() {
    return MOCK_MARKET_PRICES;
  },

  calculateTransportCost(input: TransportCalculationInput): TransportCalculationResult {
    const qtyQuintals = input.quantityKg / 100;
    // Simulated distance calculation between locations
    const distanceKm = 145; // average mandi distance
    
    let ratePerKmKg = 0.8;
    if (input.transportType.includes("Mini Truck")) ratePerKmKg = 0.9;
    if (input.transportType.includes("Medium Truck")) ratePerKmKg = 0.65;
    if (input.transportType.includes("Heavy Truck")) ratePerKmKg = 0.5;
    if (input.transportType.includes("Cold Chain")) ratePerKmKg = 1.2;

    const transportCost = Math.round(distanceKm * qtyQuintals * ratePerKmKg);
    const destPricePerQuintal = 2520; // benchmark price at destination mandi
    const grossRevenue = Math.round(qtyQuintals * destPricePerQuintal);
    const netEstimatedProfit = Math.round(grossRevenue - transportCost);
    const profitMarginPercentage = Math.round((netEstimatedProfit / grossRevenue) * 100);

    return {
      origin: input.origin || "Farmgate (Ludhiana)",
      destination: input.destination || "Azadpur APMC (Delhi)",
      quantityKg: input.quantityKg,
      transportType: input.transportType,
      distanceKm,
      transportCost,
      estimatedPriceAtDestination: destPricePerQuintal,
      grossRevenue,
      netEstimatedProfit,
      profitMarginPercentage,
      estimatedTransitHours: Math.round(distanceKm / 45),
    };
  },
};