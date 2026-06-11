import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User } from '@/types';
import type { AppLanguage } from '@/i18n/types';

export type AuthMode = 'signin' | 'signup';

interface AuthStore {
  user: User | null;
  idToken: string | null;
  isLoading: boolean;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  updateUserLanguage: (language: AppLanguage) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      idToken: null,
      isLoading: false,
      setUser: (user) => set({ user }),
      setToken: (idToken) => set({ idToken }),
      updateUserLanguage: (language) =>
        set((s) => (s.user ? { user: { ...s.user, language } } : {})),
      // Firebase seam: replace with auth().signOut() when wiring real OTP auth
      logout: () => set({ user: null, idToken: null }),
    }),
    {
      name: 'skyvora-auth',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({ user: s.user, idToken: s.idToken }),
    }
  )
);
