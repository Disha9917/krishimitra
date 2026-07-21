export interface UserProfile {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  role: "Farmer" | "Extension Worker" | "Agronomist" | "Admin";
  farmSizeAcres: number;
  primaryCrop: string;
  pinCode: string;
  state: string;
  district: string;
  village?: string;
  alertPreferences: {
    smsEnabled: boolean;
    whatsappEnabled: boolean;
    priceThresholdAlerts: boolean;
    diseaseAlerts: boolean;
    weatherAlerts: boolean;
    minPriceThresholdINR: number;
  };
  preferredLanguage: string;
  avatarUrl?: string;
}