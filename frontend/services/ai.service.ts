import { API_ENDPOINTS } from "../constants/api";
import { apiClient } from "./axios";
import { CropAdvisoryResult, FarmerCropInput } from "../types/crop";
import {
  AiAdvisoryExtras,
  AiAdvisoryRequest,
  AiAdvisoryResponse,
  AiFeedbackRequest,
  AiHistoryItem,
  AiProvider,
} from "../types/ai";

export type AiAdvisory = CropAdvisoryResult & AiAdvisoryExtras;

const EMPTY_IRRIGATION = { confidence: "Low" as const, title: "Irrigation Plan", waterQuantity: "N/A", frequency: "As needed", explanation: "Data not available for this advisory.", recommendedAction: "Consult your local agricultural officer." };
const EMPTY_FERTILIZER = { confidence: "Low" as const, title: "Fertilizer Plan", npkRatio: "N/A", dosagePerAcre: "N/A", explanation: "Data not available for this advisory.", recommendedAction: "Consult your local agricultural officer." };
const EMPTY_PEST_ALERT = { confidence: "Low" as const, title: "Pest & Disease Alert", severity: "Low", pestOrDiseaseName: "N/A", explanation: "Data not available for this advisory.", recommendedAction: "Monitor your crops regularly." };

function toAdvisoryResult(res: AiAdvisoryResponse): AiAdvisory {
  return {
    farmerInput: res.inputSnapshot as FarmerCropInput | undefined,
    cropName: res.cropName,
    district: res.district,
    top3Advisories: res.top3Advisories ?? res.recommendations,
    recommendations: res.recommendations,
    timeline: res.timeline7Days,
    timeline7Days: res.timeline7Days,
    irrigation: res.irrigation ?? res.irrigationPlan ?? EMPTY_IRRIGATION,
    fertilizer: res.fertilizer ?? res.fertilizerPlan ?? EMPTY_FERTILIZER,
    pestAlert: res.pestAlert ?? EMPTY_PEST_ALERT,
    generatedAt: res.generatedAt,
    summary: res.summary,
    riskLevel: res.riskLevel,
    confidence: res.confidence,
    confidenceScore: res.confidenceScore,
    category: res.category,
    priorityTasks: res.priorityTasks,
    alerts: res.alerts,
    modelVersion: res.modelVersion,
  };
}

export const aiService = {
  /**
   * Generates a live AI advisory via POST /v1/ai/advisory. The payload maps
   * the farmer's inputs to the backend AiAdvisory contract (crop, pincode,
   * sowing date, etc.); the authenticated user is resolved server-side from
   * the Bearer token.
   */
  async generateAdvisory(input: FarmerCropInput): Promise<AiAdvisory> {
    const payload: AiAdvisoryRequest = {
      topic: input.cropType ?? "general",
      cropName: input.cropType,
      pinCode: input.pinCode,
      season: input.season,
      sowingDate: input.sowingDate,
      landSizeAcres: input.landSizeAcres,
      soilType: input.soilType,
      weatherObservation: input.weatherObservation,
    };
    const res = await apiClient.post<AiAdvisoryResponse>(API_ENDPOINTS.AI.ADVISORY, payload);
    return toAdvisoryResult(res);
  },

  /** Lists the authenticated farmer's saved AI advisories (GET /v1/ai/history). */
  async getHistory(): Promise<AiHistoryItem[]> {
    return apiClient.get<AiHistoryItem[]>(API_ENDPOINTS.AI.HISTORY);
  },

  /** Lists the AI providers configured on the backend (GET /v1/ai/providers). */
  async getProviders(): Promise<AiProvider[]> {
    return apiClient.get<AiProvider[]>(API_ENDPOINTS.AI.PROVIDERS);
  },

  /** Marks / unmarks an advisory as favorite (POST / DELETE /v1/ai/history/{id}/favorite). */
  async setFavorite(id: string | number, isFavorite: boolean): Promise<void> {
    const endpoint = API_ENDPOINTS.AI.FAVORITE(id);
    if (isFavorite) {
      await apiClient.post(endpoint);
    } else {
      await apiClient.delete(endpoint);
    }
  },

  /** Submits farmer feedback for an advisory (POST /v1/ai/history/{id}/feedback). */
  async submitFeedback(id: string | number, feedback: AiFeedbackRequest): Promise<void> {
    await apiClient.post(API_ENDPOINTS.AI.FEEDBACK(id), feedback);
  },
};
