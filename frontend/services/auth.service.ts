import { API_ENDPOINTS } from "../constants/api";
import { tokenStore } from "../store/token.store";
import { authStore } from "../store/auth.store";
import {
  LoginRequest,
  LoginResponse,
  MeResponse,
  OtpRequest,
  RegisterRequest,
  RegisterResponse,
  ResetPasswordRequest,
  TokenPair,
} from "../types/auth";
import { BackendUser } from "../types/backend";
import { apiClient } from "./api";

function persistSession(pair: TokenPair): void {
  tokenStore.setTokens(pair.access_token, pair.refresh_token);
}

export const authService = {
  /**
   * Creates the account and sends an OTP to verify the phone.
   * No session is issued — call `verifyOtp` (or `login` with the OTP) to obtain tokens.
   */
  async register(payload: RegisterRequest): Promise<RegisterResponse> {
    return apiClient.post<RegisterResponse>(API_ENDPOINTS.AUTH.REGISTER, payload);
  },

  /** Password-based or OTP-based login. Stores the returned tokens. */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
    persistSession(response);
    authStore.setUser(response.user);
    return response;
  },

  async requestOtp(payload: OtpRequest): Promise<null> {
    return apiClient.post<null>(API_ENDPOINTS.AUTH.REQUEST_OTP, payload);
  },

  async verifyOtp(payload: OtpRequest & { otp: string }): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(API_ENDPOINTS.AUTH.VERIFY_OTP, payload);
    persistSession(response);
    authStore.setUser(response.user);
    return response;
  },

  async refresh(refreshToken: string): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(API_ENDPOINTS.AUTH.REFRESH, { refresh_token: refreshToken });
    persistSession(response);
    authStore.setUser(response.user);
    return response;
  },

  /** Invalidates the current token on the server and clears local session state. */
  async logout(): Promise<void> {
    try {
      await apiClient.post<null>(API_ENDPOINTS.AUTH.LOGOUT);
    } finally {
      tokenStore.clear();
      authStore.clearSession();
    }
  },

  /** Returns the currently authenticated user, or null when not logged in. */
  async getCurrentUser(): Promise<MeResponse | null> {
    if (!tokenStore.getAccessToken()) return null;
    const user = await apiClient.get<MeResponse>(API_ENDPOINTS.AUTH.ME);
    authStore.setUser(user);
    return user;
  },

  /**
   * Restores the session on page load using the persisted token.
   * The API client transparently refreshes an expired access token.
   * Returns null (and clears the session) when authentication cannot be restored.
   */
  async restoreSession(): Promise<BackendUser | null> {
    if (!tokenStore.getAccessToken() && !tokenStore.getRefreshToken()) {
      authStore.clearSession();
      return null;
    }
    try {
      const user = await this.getCurrentUser();
      if (user) return user;
      authStore.clearSession();
      return null;
    } catch {
      tokenStore.clear();
      authStore.clearSession();
      return null;
    }
  },

  async forgotPassword(identifier: string): Promise<null> {
    return apiClient.post<null>(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { identifier });
  },

  async resetPassword(payload: ResetPasswordRequest): Promise<null> {
    return apiClient.post<null>(API_ENDPOINTS.AUTH.RESET_PASSWORD, payload);
  },
};
