import { DistrictCropMap } from "../types/crop";
import { ALL_GUJARAT_DISTRICTS } from "./regions";
import { REGION_CROPS_MAP } from "./regionCrops";

/**
 * District-to-Crop Mapping dataset.
 * Dynamically resolves each district's crop list from its parent Region's NARP definition.
 */
export const DISTRICT_CROPS_MAP: Record<string, DistrictCropMap> = ALL_GUJARAT_DISTRICTS.reduce(
  (acc, district) => {
    const regionDefinition = REGION_CROPS_MAP[district.regionId];
    const cropIds = regionDefinition 
      ? [...regionDefinition.traditionalCropIds, ...regionDefinition.premiumCropIds]
      : ["bajra", "cotton", "maize", "groundnut"];

    acc[district.id] = {
      districtId: district.id,
      cropIds: cropIds,
      dataConfidence: "region-level",
    };
    return acc;
  },
  {} as Record<string, DistrictCropMap>
);
