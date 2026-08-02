export interface RegionCropDefinition {
  regionId: string;
  narpZones: string[];
  primaryUniversity: string;
  traditionalCropIds: string[];
  premiumCropIds: string[];
  dataConfidence: "region-level";
}

export const REGION_CROPS_MAP: Record<string, RegionCropDefinition> = {
  kutch: {
    regionId: "kutch",
    narpZones: ["GJ-5 (North-West Arid Zone)"],
    primaryUniversity: "Junagadh Agricultural University (JAU) & SDAU",
    traditionalCropIds: ["bajra", "cotton", "castor", "groundnut", "cumin", "guar"],
    premiumCropIds: ["dragonfruit", "date-palm"],
    dataConfidence: "region-level",
  },
  saurashtra: {
    regionId: "saurashtra",
    narpZones: ["GJ-6 (North Saurashtra)", "GJ-7 (South Saurashtra)"],
    primaryUniversity: "Junagadh Agricultural University (JAU)",
    traditionalCropIds: ["groundnut", "cotton", "castor", "bajra", "sesame", "cumin", "wheat", "mustard", "coriander"],
    premiumCropIds: ["gir-kesar-mango", "sapota"],
    dataConfidence: "region-level",
  },
  "north-gujarat": {
    regionId: "north-gujarat",
    narpZones: ["GJ-4 (North Gujarat Zone)"],
    primaryUniversity: "Sardarkrushinagar Dantiwada Agricultural University (SDAU)",
    traditionalCropIds: ["cumin", "castor", "mustard", "bajra", "wheat", "potato", "fennel"],
    premiumCropIds: ["isabgol", "aloe-vera"],
    dataConfidence: "region-level",
  },
  "central-gujarat": {
    regionId: "central-gujarat",
    narpZones: ["GJ-3 (Middle Gujarat Zone)"],
    primaryUniversity: "Anand Agricultural University (AAU)",
    traditionalCropIds: ["rice", "cotton", "tobacco", "wheat", "maize", "groundnut", "sugarcane"],
    premiumCropIds: ["banana-g9", "lemon"],
    dataConfidence: "region-level",
  },
  "east-gujarat": {
    regionId: "east-gujarat",
    narpZones: ["GJ-3 (Middle Gujarat Extension / Eastern Belt)"],
    primaryUniversity: "Anand Agricultural University (AAU)",
    traditionalCropIds: ["maize", "rice", "soybean", "tur", "castor"],
    premiumCropIds: ["ashwagandha"],
    dataConfidence: "region-level",
  },
  "south-gujarat": {
    regionId: "south-gujarat",
    narpZones: ["GJ-1 (Heavy Rainfall Zone)", "GJ-2 (South Gujarat Zone)"],
    primaryUniversity: "Navsari Agricultural University (NAU)",
    traditionalCropIds: ["rice", "sugarcane", "cotton", "tur", "vegetables"],
    premiumCropIds: ["alphonso-mango", "rajapuri-mango", "dasheri-mango", "banana", "turmeric", "ginger", "papaya"],
    dataConfidence: "region-level",
  },
};
