// Gujarat District Zones & Dedicated Crops Dataset
export const GUJARAT_DISTRICT_ZONES = [
  {
    id: "dahod",
    name: "Dahod (East)",
    zone: "East Gujarat",
    pincode: "389151",
    crops: [
      { name: "Maize", yield: "18 Qtl/Acre", match: 96, price: 2150, season: "Kharif", sowing: "Jun 15 - Jul 10" },
      { name: "Rice (Paddy)", yield: "22 Qtl/Acre", match: 92, price: 2183, season: "Kharif", sowing: "Jun 20 - Jul 15" },
      { name: "Soybean", yield: "12 Qtl/Acre", match: 88, price: 4600, season: "Kharif", sowing: "Jun 25 - Jul 15" },
      { name: "Tur (Arhar)", yield: "10 Qtl/Acre", match: 85, price: 7000, season: "Kharif", sowing: "Jun 15 - Jul 5" },
    ],
  },
  {
    id: "kutch",
    name: "Kutch/Bhuj (West)",
    zone: "West Gujarat",
    pincode: "370001",
    crops: [
      { name: "Bajra (Pearl Millet)", yield: "15 Qtl/Acre", match: 95, price: 2350, season: "Kharif", sowing: "Jul 1 - Jul 20" },
      { name: "Castor", yield: "14 Qtl/Acre", match: 93, price: 6200, season: "Kharif/Rabi", sowing: "Jul 15 - Aug 15" },
      { name: "Guar (Cluster Bean)", yield: "8 Qtl/Acre", match: 89, price: 5400, season: "Kharif", sowing: "Jul 5 - Jul 25" },
      { name: "Cumin (Jeera)", yield: "6 Qtl/Acre", match: 86, price: 28500, season: "Rabi", sowing: "Nov 1 - Nov 25" },
    ],
  },
  {
    id: "anand",
    name: "Anand (Central)",
    zone: "Central Gujarat",
    pincode: "388001",
    crops: [
      { name: "Tobacco", yield: "16 Qtl/Acre", match: 96, price: 4800, season: "Rabi", sowing: "Aug 15 - Sep 15" },
      { name: "Cotton", yield: "12 Qtl/Acre", match: 93, price: 6850, season: "Kharif", sowing: "May 15 - Jun 15" },
      { name: "Maize", yield: "20 Qtl/Acre", match: 90, price: 2150, season: "Kharif", sowing: "Jun 15 - Jul 10" },
      { name: "Groundnut", yield: "14 Qtl/Acre", match: 87, price: 6300, season: "Kharif", sowing: "Jun 20 - Jul 10" },
    ],
  },
  {
    id: "banaskantha",
    name: "Banaskantha (North)",
    zone: "North Gujarat",
    pincode: "385001",
    crops: [
      { name: "Cumin (Jeera)", yield: "7 Qtl/Acre", match: 97, price: 28500, season: "Rabi", sowing: "Oct 25 - Nov 20" },
      { name: "Castor", yield: "15 Qtl/Acre", match: 94, price: 6200, season: "Kharif/Rabi", sowing: "Jul 15 - Aug 15" },
      { name: "Mustard", yield: "9 Qtl/Acre", match: 91, price: 5450, season: "Rabi", sowing: "Oct 15 - Nov 10" },
      { name: "Bajra", yield: "16 Qtl/Acre", match: 88, price: 2350, season: "Kharif", sowing: "Jul 1 - Jul 20" },
    ],
  },
  {
    id: "navsari",
    name: "Navsari (South)",
    zone: "South Gujarat",
    pincode: "396445",
    crops: [
      { name: "Rice (Paddy)", yield: "26 Qtl/Acre", match: 98, price: 2250, season: "Kharif", sowing: "Jun 15 - Jul 15" },
      { name: "Sugarcane", yield: "350 Qtl/Acre", match: 95, price: 340, season: "Annual", sowing: "Oct 15 - Nov 30" },
      { name: "Banana", yield: "250 Qtl/Acre", match: 92, price: 1800, season: "Perennial", sowing: "Jun 1 - Jul 30" },
      { name: "Mango (Kesar/Alphonso)", yield: "80 Qtl/Acre", match: 89, price: 4200, season: "Perennial", sowing: "Jul 1 - Aug 31" },
    ],
  },
];

export const CROP_OPTIONS = [
  { label: "Maize (મકાઈ)", value: "Maize" },
  { label: "Rice / Paddy (ડાંગર / ચોખા)", value: "Rice" },
  { label: "Soybean (સોયાબીન)", value: "Soybean" },
  { label: "Tur / Arhar (તુવેર)", value: "Tur" },
  { label: "Bajra (બાજરી)", value: "Bajra" },
  { label: "Castor (એરંડા)", value: "Castor" },
  { label: "Guar (ગુવાર)", value: "Guar" },
  { label: "Cumin / Jeera (જીરૂ)", value: "Cumin" },
  { label: "Tobacco (તમ્બાકુ)", value: "Tobacco" },
  { label: "Cotton (કપાસ)", value: "Cotton" },
  { label: "Groundnut (મગફળી)", value: "Groundnut" },
  { label: "Mustard (રાયડો / સરસવ)", value: "Mustard" },
  { label: "Sugarcane (શેરડી)", value: "Sugarcane" },
  { label: "Banana (કેળા)", value: "Banana" },
  { label: "Mango (કેરી)", value: "Mango" },
];

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