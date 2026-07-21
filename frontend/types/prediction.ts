import { ConfidenceLevel } from "./common";

export interface PredictionHistoryRecord {
  id: string;
  date: string;
  crop: string;
  predictionType: "Crop Advisory" | "Disease Detection" | "Spoilage Risk" | "Yield Forecast";
  prediction: string;
  disease?: string;
  recommendation: string;
  confidence: ConfidenceLevel;
  location: string;
  status: "Active" | "Archived";
  downloadUrl?: string;
}