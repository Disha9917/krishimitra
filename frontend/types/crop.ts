import { ConfidenceLevel } from "./common";

export type { ConfidenceLevel };

export interface Crop {
  id: string;             // slug, e.g. "cotton"
  name: string;           // English display name
  nameGujarati: string;   // Gujarati display name for UI
  category: "traditional" | "high-value" | "controlled-environment";
  isPremium: boolean;     // true for exotic/high-value crops (locked for non-premium)
  baseYield?: string;     // Average yield per acre
  avgPricePerQtl?: number;// Average APMC price
  season?: "Kharif" | "Rabi" | "Summer" | "Annual" | "Perennial" | "Kharif/Rabi";
  sowingPeriod?: string;  // Ideal sowing window
}

export interface DistrictCropMap {
  districtId: string;
  cropIds: string[];
  dataConfidence: "district-level" | "region-level";
}

// Legacy API & Store Types
export interface FarmerCropInput {
  district?: string;
  landSizeAcres?: number;
  season?: string;
  soilType?: string;
  sowingDate?: string;
  cropType?: string;
  pinCode?: string;
  weatherObservation?: string;
  leafImage?: any;
  gpsLocation?: any;
}

export interface RecommendationItem {
  id?: string;
  rank?: number;
  title?: string;
  cropName: string;
  gujaratiName?: string;
  confidence: ConfidenceLevel;
  confidenceScore?: number;
  expectedYield?: string;
  expectedYieldImprovement?: string;
  marketPricePerQtl?: number;
  waterRequirement?: string;
  fertilizerDose?: string;
  explanation?: string;
  recommendedAction?: string;
  reasons?: string[];
}

export interface DayAdvisory {
  day: number;
  date: string;
  dayName?: string;
  title?: string;
  action?: string;
  weatherCondition?: string;
  temperature?: string;
  rainfallProbability?: number;
  irrigation?: string;
  fertilizer?: string;
  riskLevel?: "Low" | "Medium" | "High" | "Critical";
  diseaseRisk?: "Low" | "Medium" | "High" | "Critical";
}

export interface CropAdvisoryResult {
  cropName?: string;
  district?: string;
  farmerInput?: FarmerCropInput;
  recommendations?: RecommendationItem[];
  top3Advisories?: any[];
  timeline?: DayAdvisory[];
  timeline7Days?: DayAdvisory[];
  generatedAt?: string;
  irrigation?: any;
  fertilizer?: any;
  pestAlert?: any;
}