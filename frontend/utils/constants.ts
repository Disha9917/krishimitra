export const CROP_OPTIONS = [
  { label: "Wheat (गेहूं)", value: "Wheat" },
  { label: "Paddy / Rice (धान)", value: "Paddy" },
  { label: "Maize / Corn (मक्का)", value: "Maize" },
  { label: "Cotton (कपास)", value: "Cotton" },
  { label: "Sugarcane (गन्ना)", value: "Sugarcane" },
  { label: "Mustard (सरसों)", value: "Mustard" },
  { label: "Potato (आलू)", value: "Potato" },
  { label: "Tomato (टमाटर)", value: "Tomato" },
  { label: "Onion (प्याज)", value: "Onion" },
  { label: "Gram / Chickpea (चना)", value: "Gram" },
  { label: "Soybean (सोयाबीन)", value: "Soybean" },
];

export const STORAGE_CONDITIONS = [
  "Ambient/Open",
  "Cold Storage",
  "Ventilated Warehouse",
  "Silo / Airtight",
] as const;

export const TRANSPORT_TYPES = [
  "Mini Truck (1-3 Ton)",
  "Medium Truck (5-10 Ton)",
  "Heavy Truck (10+ Ton)",
  "Cold Chain Reefer",
] as const;