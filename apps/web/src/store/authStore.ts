import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types/auth';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  setAuth: (data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  }) => void;
  logout: () => void;
}

// persist: token'ları localStorage'da saklar, sayfa yenilenince oturum korunur
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      setAuth: (data) =>
        set({
          user: data.user,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        }),
      logout: () =>
        set({ user: null, accessToken: null, refreshToken: null }),
    }),
    { name: 'auth-storage' }
  )
);
