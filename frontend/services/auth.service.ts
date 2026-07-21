import { authStore } from "../store/auth.store";
import { LoginCredentials, RegisterPayload } from "../types/auth";
import { UserProfile } from "../types/user";

export const authService = {
  async login(credentials: LoginCredentials): Promise<UserProfile> {
    return authStore.getUser();
  },
  async register(payload: RegisterPayload): Promise<UserProfile> {
    return authStore.getUser();
  },
  async logout(): Promise<void> {
    return;
  },
};