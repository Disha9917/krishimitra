import { GUJARAT_REGIONS, ALL_GUJARAT_DISTRICTS } from "../data/regions";
import { CROPS_REPOSITORY } from "../data/crops";
import { DISTRICT_CROPS_MAP } from "../data/districtCrops";
import { REGION_CROPS_MAP, RegionCropDefinition } from "../data/regionCrops";
import { Region, District } from "../types/region";
import { Crop, DistrictCropMap } from "../types/crop";

/**
 * Get all 6 regions of Gujarat with their respective districts.
 */
export function getRegions(): Region[] {
  return GUJARAT_REGIONS;
}

/**
 * Get a specific region by its slug ID.
 */
export function getRegionById(regionId: string): Region | undefined {
  return GUJARAT_REGIONS.find((r) => r.id === regionId);
}

/**
 * Get all districts within a specific region.
 */
export function getDistrictsByRegion(regionId: string): District[] {
  const region = getRegionById(regionId);
  return region ? region.districts : [];
}

/**
 * Get a district by its slug ID across any region in Gujarat.
 */
export function getDistrictById(districtId: string): District | undefined {
  return ALL_GUJARAT_DISTRICTS.find((d) => d.id === districtId);
}

/**
 * Get NARP Agro-Climatic Zone definition for a region.
 */
export function getRegionCropDefinition(regionId: string): RegionCropDefinition | undefined {
  return REGION_CROPS_MAP[regionId];
}

/**
 * Get all crop objects associated with a specific district (inherited from its NARP region).
 * By default, filters out premium/exotic crops unless explicitly requested.
 */
export function getCropsByDistrict(districtId: string, includePremium: boolean = false): Crop[] {
  const mapping = DISTRICT_CROPS_MAP[districtId];
  if (!mapping || !mapping.cropIds || mapping.cropIds.length === 0) {
    return CROPS_REPOSITORY.filter((c) => includePremium || !c.isPremium).slice(0, 4);
  }

  const crops = mapping.cropIds
    .map((cropId) => CROPS_REPOSITORY.find((c) => c.id === cropId || c.name.toLowerCase() === cropId.toLowerCase()))
    .filter((c): c is Crop => c !== undefined);

  return crops.filter((c) => includePremium || !c.isPremium);
}

/**
 * Get data confidence level for a district's crop recommendations.
 */
export function getDistrictCropMap(districtId: string): DistrictCropMap | undefined {
  return DISTRICT_CROPS_MAP[districtId];
}

/**
 * Legacy city slug fallback resolver.
 */
export function getLegacyDistrictFallback(legacyId: string): { regionId: string; districtId: string } {
  const district = getDistrictById(legacyId);
  if (district) {
    return { regionId: district.regionId, districtId: district.id };
  }

  return { regionId: "central-gujarat", districtId: "anand" };
}
