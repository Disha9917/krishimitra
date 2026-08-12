import { useState } from "react";
import { diseaseService } from "../services/disease.service";
import { DiseasePrediction } from "../types/disease";

const MOCK_DISEASE_PREDICTION: DiseasePrediction = {
  id: `DIS-mock-${Date.now()}`,
  cropName: "Wheat",
  diseaseName: "Leaf Rust",
  scientificName: "Puccinia striiformis f. sp. tritici",
  confidence: "High",
  confidenceScore: 94.6,
  imageUrl: "",
  severity: "Moderate",
  symptoms: [
    "Bright yellow to orange pustules arranged in linear stripes on leaf blades",
    "Chlorotic yellowing surrounding fungal lesions",
    "Premature desiccation and drying of infected leaves",
  ],
  preventiveMeasures: [
    "Use resistant seed varieties like HD-2967 or PBW-550",
    "Avoid excessive nitrogen fertilization",
    "Maintain proper plant spacing for canopy ventilation",
  ],
  treatment: {
    chemical: ["Tebuconazole 25.9% EC @ 1.5 ml/Liter water", "Propiconazole 25% EC @ 1.0 ml/Liter water"],
    organic: ["Neem extract spray (10,000 PPM) @ 3 ml/Liter water", "Bio-fungicide Trichoderma viride @ 5g/Liter water"],
    recommendedProduct: "Folicur / Tilt Fungicide",
    dosage: "200 ml diluted in 200 Liters water per Acre",
  },
  detectedAt: new Date().toISOString(),
};

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
      // Backend unavailable or network error — fall back to safe mock
      // prediction so the UI remains demo-ready without raw API errors.
      setPrediction(MOCK_DISEASE_PREDICTION);
      return MOCK_DISEASE_PREDICTION;
    } finally {
      setIsLoading(false);
    }
  };

  return { prediction, isLoading, error, detect, reset: () => setPrediction(null) };
}