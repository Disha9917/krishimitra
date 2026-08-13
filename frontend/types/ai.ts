import { ConfidenceLevel } from "./common";
import { DayAdvisory } from "./crop";

export type { ConfidenceLevel };

export type RiskLevel = "Low" | "Medium" | "High" | "Critical";

// Request payload for POST /v1/ai/advisory (Phase 15C AI Advisory API).
// Field names follow the backend AiAdvisory model + AIService conventions:
//   farmer_crop_id, crop_id, district_id, pincode, input_snapshot.
export interface AiAdvisoryRequest {
  topic: string;
  cropName?: string;
  cropId?: number;
  fieldId?: number;
  districtId?: number;
  pinCode?: string;
  season?: string;
  sowingDate?: string;
  landSizeAcres?: number;
  soilType?: string;
  weatherObservation?: string;
}

export interface AiRecommendation {
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

export interface AiIrrigationPlan {
  title?: string;
  confidence?: ConfidenceLevel;
  waterQuantity?: string;
  frequency?: string;
  method?: string;
  explanation?: string;
  recommendedAction?: string;
}

export interface AiFertilizerPlan {
  title?: string;
  confidence?: ConfidenceLevel;
  npkRatio?: string;
  dosagePerAcre?: string;
  applicationTime?: string;
  explanation?: string;
  recommendedAction?: string;
}

export interface AiPestAlert {
  title?: string;
  confidence?: ConfidenceLevel;
  severity?: string;
  pestOrDiseaseName?: string;
  symptoms?: string[];
  explanation?: string;
  recommendedAction?: string;
}

// Response shape of POST /v1/ai/advisory, aligned with the backend
// AiAdvisory model: top3_advisories, irrigation_plan, fertilizer_plan,
// pest_alert, timeline_7_days, input_snapshot, generated_at, model_version.
export interface AiAdvisoryResponse {
  id?: number;
  cropName?: string;
  district?: string;
  summary?: string;
  riskLevel?: RiskLevel;
  confidence?: ConfidenceLevel;
  confidenceScore?: number;
  category?: string;
  recommendations: AiRecommendation[];
  top3Advisories?: AiRecommendation[];
  irrigation?: AiIrrigationPlan;
  irrigationPlan?: AiIrrigationPlan;
  fertilizer?: AiFertilizerPlan;
  fertilizerPlan?: AiFertilizerPlan;
  pestAlert?: AiPestAlert;
  priorityTasks?: string[];
  alerts?: string[];
  timeline7Days?: DayAdvisory[];
  inputSnapshot?: Record<string, unknown>;
  generatedAt?: string;
  modelVersion?: string;
}

// Extra advisory metadata surfaced on top of the existing CropAdvisoryResult
// so the existing AI recommendation UI can render it without redesign.
export type AiAdvisoryExtras = Pick<
  AiAdvisoryResponse,
  | "summary"
  | "riskLevel"
  | "confidence"
  | "confidenceScore"
  | "category"
  | "priorityTasks"
  | "alerts"
  | "modelVersion"
>;

// Item shape of GET /v1/ai/history (backed by the AIService predictionHistory
// mirror into PredictionHistory records).
export interface AiHistoryItem {
  id: number;
  advisoryType?: string;
  cropName?: string;
  district?: string;
  summary?: string;
  riskLevel?: RiskLevel;
  confidence?: ConfidenceLevel;
  confidenceScore?: number;
  top3Advisories?: AiRecommendation[];
  isFavorite?: boolean;
  generatedAt: string;
}

export interface AiProvider {
  id: string;
  name: string;
  model: string;
  isActive: boolean;
}

export interface AiFeedbackRequest {
  rating: 1 | 2 | 3 | 4 | 5;
  comment?: string;
}
