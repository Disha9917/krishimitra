import { BackendUser } from "./backend";
import { UserProfile } from "./user";

export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

/** @deprecated Legacy mock shape. Use `LoginRequest` for the Laravel backend. */
export interface LoginCredentials {
  phoneOrEmail: string;
  password?: string;
  otp?: string;
}

/** @deprecated Legacy mock shape. Use `RegisterRequest` for the Laravel backend. */
export interface RegisterPayload {
  fullName: string;
  phone: string;
  pinCode: string;
  primaryCrop: string;
  role?: string;
}

export interface LoginRequest {
  identifier: string;
  password?: string;
  otp?: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  pinCode: string;
  preferredLanguage?: "gu" | "hi" | "en";
  role?: string;
}

export interface OtpRequest {
  identifier: string;
  channel?: "sms" | "whatsapp" | "email";
  purpose?: "login" | "register" | "password_reset";
}

export interface ResetPasswordRequest {
  identifier: string;
  otp: string;
  newPassword: string;
}

export interface TokenPair {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: BackendUser;
}

export type LoginResponse = TokenPair;
export type RegisterResponse = TokenPair;
export type MeResponse = BackendUser;
