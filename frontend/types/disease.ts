import { ConfidenceLevel } from "./common";

export interface DiseaseDetectionRequest {
  image: File | string;
  cropName?: string;
  location?: string;
}

export interface DiseasePrediction {
  id: string;
  cropName: string;
  diseaseName: string;
  scientificName?: string;
  confidence: ConfidenceLevel;
  confidenceScore: number;
  imageUrl: string;
  symptoms: string[];
  preventiveMeasures: string[];
  treatment: {
    chemical: string[];
    organic: string[];
    recommendedProduct?: string;
    dosage?: string;
  };
  severity: "Mild" | "Moderate" | "Severe";
  detectedAt: string;
}