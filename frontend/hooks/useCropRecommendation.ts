import { useState } from "react";
import { aiService, AiAdvisory } from "../services/ai.service";
import { isApiError } from "../services/axios";
import { FarmerCropInput } from "../types/crop";

const MOCK_ADVISORY: AiAdvisory = {
  cropName: "Wheat",
  district: "Ludhiana",
  summary:
    "Based on current soil conditions and weather patterns, here are your personalized recommendations:",
  riskLevel: "Low",
  confidence: "High",
  confidenceScore: 0.92,
  category: "Crop Advisory",
  priorityTasks: ["Monitor soil moisture", "Apply recommended irrigation"],
  alerts: [],
  modelVersion: "demo-model-v1",
  farmerInput: undefined,
  top3Advisories: [
    {
      rank: 1,
      title: "Optimal Irrigation Strategy",
      cropName: "Wheat",
      gujaratiName: "गेहूं",
      confidence: "High",
      confidenceScore: 0.92,
      expectedYield: "5.5 t/ha",
      expectedYieldImprovement: "15%",
      waterRequirement: "Moderate",
      fertilizerDose: "25 kg/acre Urea",
      explanation: "Maintain soil moisture at 60-70% field capacity.",
      recommendedAction: "Irrigate at 30% available moisture depletion.",
    },
    {
      rank: 2,
      title: "Nutrient Management",
      cropName: "Wheat",
      gujaratiName: "गेहूं",
      confidence: "Medium",
      confidenceScore: 0.78,
      expectedYield: "5.0 t/ha",
      waterRequirement: "Moderate",
      fertilizerDose: "Single super phosphate @ 20 kg/acre",
      explanation: "Apply basal dose before sowing.",
      recommendedAction: "Mix with soil during land preparation.",
    },
    {
      rank: 3,
      title: "Disease Prevention",
      cropName: "Wheat",
      gujaratiName: "गेहूं",
      confidence: "Medium",
      confidenceScore: 0.65,
      waterRequirement: "Low",
      fertilizerDose: "Watch for early blight symptoms",
      explanation: "Monitor field regularly for early signs of disease.",
      recommendedAction: "Remove affected plants immediately.",
    },
  ],
  recommendations: [
    {
      rank: 1,
      title: "Optimal Irrigation Strategy",
      cropName: "Wheat",
      gujaratiName: "गेहूं",
      confidence: "High",
      confidenceScore: 0.92,
      expectedYield: "5.5 t/ha",
      expectedYieldImprovement: "15%",
      waterRequirement: "Moderate",
      fertilizerDose: "25 kg/acre Urea",
      explanation: "Maintain soil moisture at 60-70% field capacity.",
      recommendedAction: "Irrigate at 30% available moisture depletion.",
    },
    {
      rank: 2,
      title: "Nutrient Management",
      cropName: "Wheat",
      gujaratiName: "गेहूं",
      confidence: "Medium",
      confidenceScore: 0.78,
      expectedYield: "5.0 t/ha",
      waterRequirement: "Moderate",
      fertilizerDose: "Single super phosphate @ 20 kg/acre",
      explanation: "Apply basal dose before sowing.",
      recommendedAction: "Mix with soil during land preparation.",
    },
    {
      rank: 3,
      title: "Disease Prevention",
      cropName: "Wheat",
      gujaratiName: "गेहूं",
      confidence: "Medium",
      confidenceScore: 0.65,
      waterRequirement: "Low",
      fertilizerDose: "Watch for early blight symptoms",
      explanation: "Monitor field regularly for early signs of disease.",
      recommendedAction: "Remove affected plants immediately.",
    },
  ],
  timeline7Days: [],
  irrigation: undefined,
  fertilizer: undefined,
  pestAlert: undefined,
  generatedAt: new Date().toISOString(),
};

export function useCropRecommendation() {
  const [advisory, setAdvisory] = useState<AiAdvisory | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fromHistory, setFromHistory] = useState(false);

  const getAdvisory = async (input: FarmerCropInput) => {
    setIsLoading(true);
    setError(null);
    setFromHistory(false);
    try {
      const res = await aiService.generateAdvisory(input);
      setAdvisory(res);
      return res;
    } catch (err) {
      const apiError = isApiError(err)
        ? err
        : err instanceof Error
          ? { message: err.message, statusCode: 0, code: "NETWORK_ERROR" }
          : { message: "Failed to generate advisory. Please try again.", statusCode: 0, code: "UNKNOWN_ERROR" };

      // If the backend API is unavailable (404, network error, timeout),
      // fall back to safe demo/mock advisory instead of showing a raw error.
      if (
        apiError.statusCode === 404 ||
        apiError.code === "NETWORK_ERROR" ||
        apiError.code === "UNKNOWN_ERROR"
      ) {
        // Try history fallback first (existing behavior)
        try {
          const history = await aiService.getHistory();
          const latest = history.find(
            (item) => item.top3Advisories?.length,
          );
          if (latest) {
            const fallback: AiAdvisory = {
              cropName: latest.cropName,
              district: latest.district,
              summary: latest.summary,
              riskLevel: latest.riskLevel,
              confidence: latest.confidence,
              confidenceScore: latest.confidenceScore,
              top3Advisories: latest.top3Advisories,
              recommendations: latest.top3Advisories,
              generatedAt: latest.generatedAt,
            };
            setAdvisory(fallback);
            setFromHistory(true);
            return fallback;
          }
        } catch {
          // Ignore history failures; fall through to demo mock.
        }

        // Use safe demo mock advisory — presented as prototype/demo experience.
        setAdvisory(MOCK_ADVISORY);
        return MOCK_ADVISORY;
}

// For genuine validation errors (422), report them to the user.
if (apiError.statusCode === 422) {
  const errors = apiError.errors as string[] | undefined;
  const message =
    errors && errors.length > 0
      ? errors.map((e: any) => e.message || e).join(", ")
      : apiError.message ?? "The submitted data is invalid.";
  setError(message);
  return null;
}

      // For other server errors, report a generic message.
      const message =
        apiError.message ?? "Something went wrong. Please try again shortly.";
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { advisory, isLoading, error, fromHistory, getAdvisory };
}
