import { useSyncExternalStore, useCallback } from "react";
import { authService } from "../services/auth.service";
import { authStore } from "../store/auth.store";

export function useAuth() {
  const session = useSyncExternalStore(authStore.subscribe, authStore.getSnapshot, authStore.getSnapshot);

  const logout = useCallback(async () => {
    await authService.logout().catch(() => undefined);
    authStore.clearSession();
  }, []);

  return {
    user: session.user,
    isAuthenticated: session.isAuthenticated,
    isLoading: session.isLoading,
    logout,
  };
}
