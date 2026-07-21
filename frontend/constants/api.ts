export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.krishimitra.agri/v1";

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    VERIFY_OTP: "/auth/verify-otp",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
  },
  CROP: {
    ADVISORY: "/crop/advisory",
    CROPS_LIST: "/crop/supported-crops",
    TIMELINE: "/crop/7-day-timeline",
  },
  DISEASE: {
    DETECT: "/disease/detect",
    SEARCH: "/disease/search",
  },
  MARKET: {
    PRICES: "/market/prices",
    TRENDS: "/market/trends",
    TRANSPORT_CALCULATE: "/market/transport-cost",
  },
  WEATHER: {
    CURRENT: "/weather/current",
    FORECAST: "/weather/forecast",
  },
  POST_HARVEST: {
    ANALYZE_RISK: "/post-harvest/analyze-risk",
  },
  NOTIFICATIONS: {
    LIST: "/notifications",
    SETTINGS: "/notifications/settings",
  },
  REPORTS: {
    GENERATE: "/reports/generate",
    DOWNLOAD: "/reports/download",
  },
};