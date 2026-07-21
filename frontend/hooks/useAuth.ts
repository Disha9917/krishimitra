import { useState } from "react";
import { authStore } from "../store/auth.store";
import { UserProfile } from "../types/user";

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(authStore.getUser());
  const [isAuthenticated] = useState<boolean>(true);

  return {
    user,
    isAuthenticated,
    logout: () => setUser(null),
  };
}