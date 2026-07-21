export interface PricePoint {
  label: string;
  price: number;
  date: string;
}

export interface MarketPriceItem {
  id: string;
  cropName: string;
  category: string;
  mandiName: string;
  state: string;
  todaysPrice: number; // in INR per Quintal
  unit: string;
  changePercentage: number;
  trend: "UP" | "DOWN" | "STABLE";
  weeklyTrend: PricePoint[];
  monthlyTrend: PricePoint[];
  minPrice: number;
  maxPrice: number;
  updatedAt: string;
}

export interface TransportCalculationInput {
  origin: string;
  destination: string;
  quantityKg: number;
  transportType: "Mini Truck (1-3 Ton)" | "Medium Truck (5-10 Ton)" | "Heavy Truck (10+ Ton)" | "Cold Chain Reefer";
}

export interface TransportCalculationResult {
  origin: string;
  destination: string;
  quantityKg: number;
  transportType: string;
  distanceKm: number;
  transportCost: number;
  estimatedPriceAtDestination: number;
  grossRevenue: number;
  netEstimatedProfit: number;
  profitMarginPercentage: number;
  estimatedTransitHours: number;
}