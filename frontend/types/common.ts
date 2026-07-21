export type ConfidenceLevel = "High" | "Medium" | "Low";

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface LocationInfo {
  gpsLocation: string;
  pinCode: string;
  district?: string;
  state?: string;
  coordinates?: Coordinates;
}

export interface PaginationParams {
  page: number;
  limit: number;
  total?: number;
}

export interface FilterOption {
  label: string;
  value: string;
}