import { ConfidenceLevel } from "./common";

export interface FarmerCropInput {
  gpsLocation: string;
  pinCode: string;
  cropType: string;
  sowingDate: string;
  weatherObservation: string;
  leafImage?: File | string | null;
}

export interface RecommendationItem {
  id: string;
  rank: number;
  title: string;
  cropName: string;
  confidence: ConfidenceLevel;
  confidenceScore: number; // percentage e.g. 92%
  explanation: string;
  recommendedAction: string;
  expectedYieldImprovement?: string;
}

export interface IrrigationRecommendation {
  title: string;
  confidence: ConfidenceLevel;
  waterQuantity: string;
  frequency: string;
  method: string;
  explanation: string;
  recommendedAction: string;
}

export interface FertilizerRecommendation {
  title: string;
  confidence: ConfidenceLevel;
  npkRatio: string;
  dosagePerAcre: string;
  applicationTime: string;
  explanation: string;
  recommendedAction: string;
}

export interface PestAlert {
  title: string;
  confidence: ConfidenceLevel;
  severity: "Low" | "Moderate" | "High" | "Critical";
  pestOrDiseaseName: string;
  symptoms: string[];
  explanation: string;
  recommendedAction: string;
}

export interface DayAdvisory {
  day: number;
  date: string;
  dayName: string;
  weatherCondition: string;
  temperature: string;
  rainfallProbability: number;
  irrigation: string;
  fertilizer: string;
  diseaseRisk: "Low" | "Medium" | "High";
  notes?: string;
}

export interface CropAdvisoryResult {
  farmerInput: FarmerCropInput;
  top3Advisories: RecommendationItem[];
  irrigation: IrrigationRecommendation;
  fertilizer: FertilizerRecommendation;
  pestAlert: PestAlert;
  timeline7Days: DayAdvisory[];
  generatedAt: string;
}