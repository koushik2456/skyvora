import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User } from '@/types';

export type AuthMode = 'signin' | 'signup';

interface AuthStore {
  user: User | null;
  idToken: string | null;
  isLoading: boolean;
  /** True once the persisted session has been restored from storage. */
  isHydrated: boolean;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  setHydrated: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      idToken: null,
      isLoading: false,
      isHydrated: false,
      setUser: (user) => set({ user }),
      setToken: (idToken) => set({ idToken }),
      setHydrated: () => set({ isHydrated: true }),
      // Firebase seam: replace with auth().signOut() when wiring real OTP auth
      logout: () => set({ user: null, idToken: null }),
    }),
    {
      name: 'skyvora-auth',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({ user: s.user, idToken: s.idToken }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);
