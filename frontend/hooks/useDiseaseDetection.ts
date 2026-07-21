import { useState } from "react";
import { diseaseService } from "../services/disease.service";
import { DiseasePrediction } from "../types/disease";

export function useDiseaseDetection() {
  const [prediction, setPrediction] = useState<DiseasePrediction | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const detect = async (image: File | string, cropName: string = "Wheat") => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await diseaseService.detectDisease(image, cropName);
      setPrediction(res);
      return res;
    } catch (err: any) {
      setError(err.message || "Failed to detect disease");
    } finally {
      setIsLoading(false);
    }
  };

  return { prediction, isLoading, error, detect, reset: () => setPrediction(null) };
}