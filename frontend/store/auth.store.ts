import { BackendUser } from "../types/backend";

export interface AuthSession {
  user: BackendUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

let session: AuthSession = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

type Listener = () => void;

const listeners = new Set<Listener>();

function emit(): void {
  listeners.forEach((listener) => listener());
}

export const authStore = {
  getSnapshot: (): AuthSession => session,
  getUser: (): BackendUser | null => session.user,
  isAuthenticated: (): boolean => session.isAuthenticated,

  setUser(user: BackendUser | null): void {
    session = { user, isAuthenticated: !!user, isLoading: false };
    emit();
  },

  setLoading(isLoading: boolean): void {
    session = { ...session, isLoading };
    emit();
  },

  clearSession(): void {
    session = { user: null, isAuthenticated: false, isLoading: false };
    emit();
  },

  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};
