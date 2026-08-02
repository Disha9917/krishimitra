import { ALL_GUJARAT_DISTRICTS, GUJARAT_REGIONS } from "../data/regions";
import { getCropsByDistrict, getRegionById } from "../lib/regionData";
import { CROPS_REPOSITORY } from "../data/crops";

// Re-export full 33 Districts dynamically formatted for legacy component compatibility
export const GUJARAT_DISTRICT_ZONES = ALL_GUJARAT_DISTRICTS.map((district) => {
  const region = getRegionById(district.regionId);
  const districtCrops = getCropsByDistrict(district.id);

  return {
    id: district.id,
    name: `${district.name} (${district.nameGujarati})`,
    zone: region?.name || "Gujarat",
    crops: districtCrops.map((c, index) => ({
      name: c.name,
      yield: c.baseYield || "15 Qtl/Acre",
      match: 98 - index * 3,
      price: c.avgPricePerQtl || 3500,
      season: c.season || "Kharif",
      sowing: c.sowingPeriod || "Jun 15 - Jul 15",
    })),
  };
});

export const CROP_OPTIONS = CROPS_REPOSITORY.map((c) => ({
  label: `${c.name} (${c.nameGujarati})`,
  value: c.name,
  isPremium: c.isPremium,
}));

export const STORAGE_CONDITIONS = [
  "Ambient/Open Storage",
  "Cold Storage Facility",
  "Airtight Hermetic Bags",
  "APMC Warehouse Silo",
] as const;

export const TRANSPORT_TYPES = [
  "Mini Truck (1-3 Ton)",
  "Medium Truck (5-10 Ton)",
  "Heavy Commercial Truck (10+ Ton)",
  "Cold Chain Reefer",
] as const;