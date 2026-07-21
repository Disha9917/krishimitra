export function calculateSpoilageRisk(
  crop: string,
  quantityKg: number,
  harvestDate: string,
  storageCondition: string
) {
  const harvest = new Date(harvestDate);
  const today = new Date();
  const diffDays = Math.max(0, Math.floor((today.getTime() - harvest.getTime()) / (1000 * 3600 * 24)));

  let baseShelfLife = 14; // default days
  if (crop.toLowerCase().includes("tomato") || crop.toLowerCase().includes("onion")) baseShelfLife = 10;
  if (crop.toLowerCase().includes("wheat") || crop.toLowerCase().includes("paddy")) baseShelfLife = 120;
  if (crop.toLowerCase().includes("potato")) baseShelfLife = 60;

  let multiplier = 1.0;
  if (storageCondition === "Cold Storage") multiplier = 2.5;
  if (storageCondition === "Ventilated Warehouse") multiplier = 1.4;
  if (storageCondition === "Ambient/Open") multiplier = 0.7;

  const totalShelfLife = Math.round(baseShelfLife * multiplier);
  const daysRemaining = Math.max(0, totalShelfLife - diffDays);
  const spoilageRiskPercentage = Math.min(100, Math.round(((diffDays + 1) / totalShelfLife) * 100));

  let riskLevel: "Low" | "Moderate" | "High" | "Critical" = "Low";
  if (spoilageRiskPercentage > 30) riskLevel = "Moderate";
  if (spoilageRiskPercentage > 60) riskLevel = "High";
  if (spoilageRiskPercentage > 85) riskLevel = "Critical";

  return {
    spoilageRiskPercentage,
    riskLevel,
    shelfLifeDays: totalShelfLife,
    daysRemaining,
  };
}