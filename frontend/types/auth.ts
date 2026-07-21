import { UserProfile } from "./user";

export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  phoneOrEmail: string;
  password?: string;
  otp?: string;
}

export interface RegisterPayload {
  fullName: string;
  phone: string;
  pinCode: string;
  primaryCrop: string;
  role?: string;
}