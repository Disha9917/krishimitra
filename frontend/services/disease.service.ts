import { DiseasePrediction } from "../types/disease";

export const diseaseService = {
  async detectDisease(imageInput: File | string, cropName: string = "Wheat"): Promise<DiseasePrediction> {
    const previewUrl = typeof imageInput === "string" 
      ? imageInput 
      : URL.createObjectURL(imageInput);

    return {
      id: `DIS-${Date.now()}`,
      cropName: cropName,
      diseaseName: `${cropName} Leaf Rust (Puccinia striiformis)`,
      scientificName: "Puccinia striiformis f. sp. tritici",
      confidence: "High",
      confidenceScore: 94.6,
      imageUrl: previewUrl,
      severity: "Moderate",
      symptoms: [
        "Bright yellow to orange pustules arranged in linear stripes on leaf blades",
        "Chlorotic yellowing surrounding fungal lesions",
        "Premature desiccation and drying of infected leaves",
        "Reduced grain filling and shriveled kernels",
      ],
      preventiveMeasures: [
        "Use resistant seed varieties like HD-2967 or PBW-550",
        "Avoid excessive nitrogen fertilization",
        "Maintain proper plant spacing for canopy ventilation",
      ],
      treatment: {
        chemical: [
          "Tebuconazole 25.9% EC @ 1.5 ml/Liter water",
          "Propiconazole 25% EC @ 1.0 ml/Liter water",
        ],
        organic: [
          "Neem extract spray (10,000 PPM) @ 3 ml/Liter water",
          "Bio-fungicide Trichoderma viride @ 5g/Liter water",
        ],
        recommendedProduct: "Folicur / Tilt Fungicide",
        dosage: "200 ml diluted in 200 Liters water per Acre",
      },
      detectedAt: new Date().toISOString(),
    };
  },
};