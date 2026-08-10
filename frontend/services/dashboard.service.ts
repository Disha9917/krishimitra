import { API_ENDPOINTS } from "../constants/api";
import { FarmerDashboard, UnifiedDashboard } from "../types/backend";
import { apiClient, isApiError } from "./api";

function sumHarvestKg(harvests: unknown[]): number {
  if (!Array.isArray(harvests)) return 0;
  return harvests.reduce<number>((sum, h) => {
    if (h && typeof h === "object" && "quantity_kg" in h) {
      const value = Number((h as { quantity_kg?: unknown }).quantity_kg);
      return sum + (Number.isFinite(value) ? value : 0);
    }
    return sum;
  }, 0);
}

function mapFarmerDashboard(dashboard: FarmerDashboard): UnifiedDashboard {
  const profile = dashboard.profile;
  return {
    source: "farmer",
    user: profile,
    overview: {
      fieldCount: dashboard.fields?.length ?? 0,
      cropCount: dashboard.crops?.length ?? 0,
      unreadCount: dashboard.unreadNotifications ?? 0,
      totalHarvestKg: sumHarvestKg(dashboard.harvests ?? []),
    },
    crop: dashboard.crops ?? [],
    soil: null,
    disease: dashboard.detections ?? [],
    market: null,
    schemes: null,
    equipment: null,
    coldStorage: null,
    transport: null,
    notifications: null,
    quickActions: null,
    statistics: null,
    ai: dashboard.detections ?? null,
  };
}

export const dashboardService = {
  /**
   * Fetches the unified dashboard. Primary endpoint: GET /dashboard/unified.
   * Falls back to the registered GET /farmer/dashboard until the unified
   * endpoint lands on the backend.
   */
  async getUnifiedDashboard(): Promise<UnifiedDashboard> {
    try {
      const data = await apiClient.get<UnifiedDashboard>(API_ENDPOINTS.DASHBOARD.UNIFIED);
      return { ...data, source: "unified" };
    } catch (error) {
      if (isApiError(error) && error.statusCode === 404) {
        const farmer = await apiClient.get<FarmerDashboard>(API_ENDPOINTS.FARMER.DASHBOARD);
        return mapFarmerDashboard(farmer);
      }
      throw error;
    }
  },
};
