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
    return MOCK_HISTORY;
  },
};