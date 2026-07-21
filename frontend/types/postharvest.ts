import { ConfidenceLevel } from "./common";

export type StorageCondition = "Ambient/Open" | "Cold Storage" | "Ventilated Warehouse" | "Silo / Airtight";

export interface PostHarvestInput {
  crop: string;
  quantityKg: number;
  harvestDate: string;
  storageCondition: StorageCondition;
  location: string;
}

export interface DecisionOption {
  type: "SELL" | "STORE" | "TRANSPORT";
  title: string;
  expectedProfit: number;
  currency: string;
  reason: string;
  risk: "Low" | "Medium" | "High";
  netReturnPerKg: number;
  timeframe: string;
  recommended: boolean;
}

export interface SpoilageRiskResult {
  crop: string;
  quantityKg: number;
  harvestDate: string;
  storageCondition: StorageCondition;
  location: string;
  spoilageRiskPercentage: number;
  riskLevel: "Low" | "Moderate" | "High" | "Critical";
  shelfLifeDays: number;
  daysRemaining: number;
  storageRecommendation: string;
  decisions: {
    sell: DecisionOption;
    store: DecisionOption;
    transport: DecisionOption;
  };
  analyzedAt: string;
}
