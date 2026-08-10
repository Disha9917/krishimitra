import { authStore } from "../store/auth.store";
import { BackendUser } from "../types/backend";

export const userService = {
  async getProfile(): Promise<BackendUser | null> {
    return authStore.getUser();
  },
  async updateProfile(profile: Partial<BackendUser>): Promise<BackendUser | null> {
    const current = authStore.getUser();
    if (!current) return null;
    const updated = { ...current, ...profile };
    authStore.setUser(updated);
    return updated;
  },
};
