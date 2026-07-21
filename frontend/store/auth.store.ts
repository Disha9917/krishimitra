import { UserProfile } from "../types/user";

export interface MockAuthStore {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (user: UserProfile) => void;
  logout: () => void;
}

const DEFAULT_USER: UserProfile = {
  id: "USR-9842",
  fullName: "Rajesh Kumar",
  phone: "+91 98765 43210",
  email: "rajesh.kumar@farmer.in",
  role: "Farmer",
  farmSizeAcres: 4.5,
  primaryCrop: "Wheat",
  pinCode: "141001",
  state: "Punjab",
  district: "Ludhiana",
  village: "Gill",
  alertPreferences: {
    smsEnabled: true,
    whatsappEnabled: true,
    priceThresholdAlerts: true,
    diseaseAlerts: true,
    weatherAlerts: true,
    minPriceThresholdINR: 2350,
  },
  preferredLanguage: "Hindi",
};

export const authStore = {
  getUser: () => DEFAULT_USER,
  isAuthenticated: () => true,
};