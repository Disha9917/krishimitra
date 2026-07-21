import { useState } from "react";
import { cropService } from "../services/crop.service";
import { FarmerCropInput, CropAdvisoryResult } from "../types/crop";

export function useCropRecommendation() {
  const [advisory, setAdvisory] = useState<CropAdvisoryResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAdvisory = async (input: FarmerCropInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await cropService.generateAdvisory(input);
      setAdvisory(res);
      return res;
    } catch (err: any) {
      setError(err.message || "Failed to generate advisory");
    } finally {
      setIsLoading(false);
    }
  };

  return { advisory, isLoading, error, getAdvisory };
}