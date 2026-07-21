export interface DashboardSummary {
  weatherTemp: number;
  currentCrop: string;
  advisoriesCount: number;
  diseaseRisk: string;
  marketPriceWheat: number;
  unreadNotificationsCount: number;
}

export const dashboardStore = {
  getSummary: (): DashboardSummary => ({
    weatherTemp: 28,
    currentCrop: "Wheat (HD-2967)",
    advisoriesCount: 3,
    diseaseRisk: "Low (Yellow Rust Monitoring Required)",
    marketPriceWheat: 2420,
    unreadNotificationsCount: 3,
  }),
};