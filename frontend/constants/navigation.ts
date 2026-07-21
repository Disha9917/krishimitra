import { ROUTES } from "./routes";

export const PUBLIC_NAV_ITEMS = [
  { label: "Home", href: ROUTES.HOME },
  { label: "About", href: ROUTES.ABOUT },
  { label: "Contact", href: ROUTES.CONTACT },
];

export const DASHBOARD_NAV_ITEMS = [
  { label: "Overview", href: ROUTES.DASHBOARD.OVERVIEW, icon: "LayoutDashboard" },
  { label: "Crop Advisory", href: ROUTES.DASHBOARD.CROP_ADVISOR, icon: "Sprout" },
  { label: "Post-Harvest Loss Planner", href: ROUTES.DASHBOARD.POST_HARVEST, icon: "Warehouse" },
  { label: "AI Disease Detection", href: ROUTES.DASHBOARD.DISEASE_DETECTION, icon: "Scan" },
  { label: "Market Prices & Transport", href: ROUTES.DASHBOARD.MARKET_PRICES, icon: "TrendingUp" },
  { label: "Weather Center", href: ROUTES.DASHBOARD.WEATHER, icon: "CloudSun" },
  { label: "Advisory History", href: ROUTES.DASHBOARD.HISTORY, icon: "History" },
  { label: "Reports & Downloads", href: ROUTES.DASHBOARD.REPORTS, icon: "FileText" },
  { label: "Alert Settings", href: ROUTES.DASHBOARD.SETTINGS, icon: "BellRing" },
];