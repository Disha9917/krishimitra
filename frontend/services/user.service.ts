import { API_ENDPOINTS } from "../constants/api";
import { FarmerProfile, FarmerProfileUpdatePayload } from "../types/backend";
import { apiClient } from "./api";

export const userService = {
  /**
   * Fetches the authenticated farmer's profile from the backend.
   * Throws an ApiError on failure (401 clears the session via the apiClient).
   */
  async getProfile(): Promise<FarmerProfile> {
    return apiClient.get<FarmerProfile>(API_ENDPOINTS.FARMER.PROFILE);
  },

  /**
   * Updates the authenticated farmer's profile. All payload fields are optional.
   */
  async updateProfile(payload: FarmerProfileUpdatePayload): Promise<FarmerProfile> {
    return apiClient.patch<FarmerProfile>(API_ENDPOINTS.FARMER.PROFILE, payload);
  },
};
