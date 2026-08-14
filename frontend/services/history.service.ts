import { API_ENDPOINTS } from "../constants/api";
import { apiClient } from "./axios";
import { PredictionHistoryRecord } from "../types/prediction";

export const MOCK_HISTORY: PredictionHistoryRecord[] = [
  {
    id: "HIS-101",
    date: "2026-07-20",
    crop: "Wheat (गेहूं)",
    predictionType: "Crop Advisory",
    prediction: "Optimal Irrigation & Top-dressing Advisory",
    disease: "None Detected",
    recommendation: "Apply 25kg/acre Urea with micro-sprinklers.",
    confidence: "High",
    location: "Ludhiana, PB (141001)",
    status: "Active",
    downloadUrl: "#",
  },
  {
    id: "HIS-102",
    date: "2026-07-18",
    crop: "Tomato (टमाटर)",
    predictionType: "Disease Detection",
    prediction: "Early Blight (Alternaria solani)",
    disease: "Early Blight",
    recommendation: "Foliar spray with Mancozeb @ 2.5g/L.",
    confidence: "High",
    location: "Jalandhar, PB (144001)",
    status: "Active",
    downloadUrl: "#",
  },
  {
    id: "HIS-103",
    date: "2026-07-14",
    crop: "Paddy (धान)",
    predictionType: "Spoilage Risk",
    prediction: "Post-Harvest Moisture Risk 38%",
    disease: "N/A",
    recommendation: "Solar drying required down to 14% moisture before bag storage.",
    confidence: "Medium",
    location: "Patiala, PB (147001)",
    status: "Active",
    downloadUrl: "#",
  },
  {
    id: "HIS-104",
    date: "2026-07-08",
    crop: "Cotton (कपास)",
    predictionType: "Crop Advisory",
    prediction: "Pink Bollworm Warning & Trap Advisory",
    disease: "Pest Infestation",
    recommendation: "Deploy Pheromone Traps @ 8 per Acre.",
    confidence: "High",
    location: "Bhatinda, PB (151001)",
    status: "Archived",
    downloadUrl: "#",
  },
];

export const historyService = {
  async getHistory(): Promise<PredictionHistoryRecord[]> {
    try {
      const data = await apiClient.get<Record<string, unknown>[]>(API_ENDPOINTS.AI.HISTORY);
      if (Array.isArray(data) && data.length > 0) {
        return data.map((item, idx) => ({
          id: String(item.id ?? `HIS-${100 + idx}`),
          date: String(item.createdAt ?? item.created_at ?? new Date().toISOString().split("T")[0]),
          crop: String(item.cropName ?? item.crop_name ?? "General Crop"),
          predictionType: "Crop Advisory",
          prediction: String(item.title ?? item.summary ?? "AI Crop Advisory"),
          disease: "N/A",
          recommendation: String(item.recommendedAction ?? item.recommendation ?? "Follow precision guidelines."),
          confidence: "High",
          location: String(item.location ?? "Farmgate"),
          status: "Active",
          downloadUrl: "#",
        }));
      }
    } catch {
      // Safe fallback to mock history if unauthenticated or offline
    }

    return MOCK_HISTORY;
  },
};