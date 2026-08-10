import { useState } from "react";
import { aiService, AiAdvisory } from "../services/ai.service";
import { FarmerCropInput } from "../types/crop";

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
      const message = err instanceof Error ? err.message : "Failed to generate advisory. Please try again.";
      // Live generation failed. Fall back to the latest saved advisory from
      // history when available (only data actually returned by the backend).
      try {
        const history = await aiService.getHistory();
        const latest = history.find((item) => item.top3Advisories?.length);
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
        // Ignore history failures; report the original generation error.
      }
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { advisory, isLoading, error, fromHistory, getAdvisory };
}
