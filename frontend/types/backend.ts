/**
 * Types aligned with the Laravel backend API Resources (routes/api.php + app/Http/Resources).
 * Legacy UI types (types/user.ts, types/crop.ts, types/market.ts, types/report.ts,
 * types/disease.ts, store/notification.store.ts) remain the source of truth for mock data;
 * these types describe what the backend actually returns.
 */

// ---------- Reference objects (nested in several resources) ----------

export interface PrimaryCropRef {
  id: number;
  name: string;
  nameGujarati: string;
}

export interface DistrictRef {
  id: number;
  name: string;
}

export interface TalukaRef {
  id: number;
  name: string;
}

export interface AlertPreferences {
  smsEnabled: boolean;
  whatsappEnabled: boolean;
  priceThresholdAlerts: boolean;
  diseaseAlerts: boolean;
  weatherAlerts: boolean;
  minPriceThresholdINR: number;
}

// ---------- User (AuthController::profile — /auth/me, login, register) ----------

export interface BackendUser {
  id: number;
  uuid: string;
  fullName: string;
  phone: string;
  email: string | null;
  phoneVerifiedAt: string | null;
  emailVerifiedAt: string | null;
  preferredLanguage: string;
  isActive: boolean;
  lastLoginAt: string | null;
  roles: string[];
  permissions: string[];
}

// ---------- Farmer (FarmerProfileResource / FarmerFieldResource / FarmerCropResource) ----------

export interface FarmerProfile {
  id: number;
  userId: number;
  fullName: string | null;
  phone: string | null;
  email: string | null;
  preferredLanguage: string | null;
  farmSizeAcres: number | null;
  primaryCrop: PrimaryCropRef | null;
  pinCode: string | null;
  state: string | null;
  district: DistrictRef | null;
  taluka: TalukaRef | null;
  village: string | null;
  alertPreferences: AlertPreferences | null;
}

export interface FarmerField {
  id: number;
  name: string;
  sizeAcres: number | null;
  soilType: { id: number; name: string } | null;
  currentCrop: PrimaryCropRef | null;
  lat: number | null;
  lng: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface FarmerCrop {
  id: number;
  crop: PrimaryCropRef | null;
  field: { id: number; name: string } | null;
  season: string | null;
  sowingDate: string | null;
  expectedHarvestDate: string | null;
  isCurrent: boolean;
  createdAt: string;
  /** Present on GET /farmer/crops/{cropId} (CropDetailResource) */
  growthStage?: string | null;
  growthProgressPercent?: number | null;
  status?: string | null;
  isOverdue?: boolean;
  harvestCount?: number;
}

// ---------- Dashboard (FarmerDashboardResource — GET /farmer/dashboard) ----------

export interface FarmerDashboard {
  profile: FarmerProfile | null;
  fields: FarmerField[];
  crops: FarmerCrop[];
  harvests: unknown[];
  detections: unknown[];
  unreadNotifications: number;
}

export interface DashboardStats {
  totalFields: number;
  activeCrops: number;
  harvestedThisSeason: number;
  pendingHarvests: number;
  unreadNotifications: number;
}

/**
 * Unified dashboard payload (GET /dashboard/unified).
 * Only sections the backend exposes are populated; every section is optional.
 * `source` records which backend endpoint produced the payload.
 */
export interface UnifiedDashboard {
  source: "unified" | "farmer";
  user: FarmerProfile | null;
  overview: {
    fieldCount: number;
    cropCount: number;
    unreadCount: number;
    totalHarvestKg: number;
  } | null;
  crop: FarmerCrop[] | null;
  soil: SoilRecord[] | null;
  disease: unknown[] | null;
  market: unknown[] | null;
  schemes: GovernmentScheme[] | null;
  equipment: EquipmentListing[] | null;
  coldStorage: ColdStorageUnit[] | null;
  transport: TransportQuote[] | null;
  notifications: NotificationRecord[] | null;
  quickActions: string[] | null;
  statistics: DashboardStats | null;
  ai: unknown[] | null;
}

// ---------- Soil ----------

export interface SoilType {
  id: number;
  name: string;
  description?: string | null;
  suitableCrops?: string[];
  phRange?: string;
}

export interface SoilRecord {
  id: number;
  fieldId?: number;
  soilType: SoilType | null;
  ph?: number | null;
  organicCarbonPct?: number | null;
  nitrogenPct?: number | null;
  phosphorousPpm?: number | null;
  potassiumPpm?: number | null;
  testedAt?: string | null;
}

// ---------- Government Scheme (contract §8 — not yet registered on backend) ----------

export interface GovernmentScheme {
  id: number | string;
  title: string;
  category: string;
  description: string;
  benefits: string[];
  eligibilityCriteria: string[];
  documentsRequired: string[];
  state: string;
  deadline?: string | null;
  applyUrl?: string | null;
  officialLink?: string | null;
}

// ---------- Equipment (contract §9 — not yet registered on backend) ----------

export interface EquipmentListing {
  id: number | string;
  name: string;
  type: "Tractor" | "Harvester";
  description: string;
  hourlyRate: number;
  dailyRate: number;
  providerName: string;
  pinCode: string;
  district: string;
  availability: boolean;
  imageUrl?: string | null;
  rating?: number | null;
}

// ---------- Cold Storage (contract §10 — not yet registered on backend) ----------

export interface ColdStorageUnit {
  id: number | string;
  name: string;
  pinCode: string;
  district: string;
  capacityTonnes: number;
  availableCapacityTonnes: number;
  temperatureRange: string;
  rentPerQuintalPerMonth: number;
  contact: string;
  address?: string | null;
  rating?: number | null;
  imageUrl?: string | null;
}

// ---------- Transport (contract §6 — TransportCalculationResult in types/market.ts) ----------

export interface TransportQuote {
  providerName: string;
  vehicleType: string;
  distanceKm: number;
  quotedCost: number;
  estimatedTransitHours: number;
  available: boolean;
}

// ---------- Notification ----------

export interface NotificationRecord {
  id: string;
  type: "PRICE" | "DISEASE" | "WEATHER" | "ADVISORY";
  title: string;
  message: string;
  time: string;
  read: boolean;
  actionUrl?: string | null;
}
