import { authStore } from "../store/auth.store";
import { UserProfile } from "../types/user";

export const userService = {
  async getProfile(): Promise<UserProfile> {
    return authStore.getUser();
  },
  async updateProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
    const current = authStore.getUser();
    return { ...current, ...profile };
  },
};