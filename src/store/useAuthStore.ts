import { create } from 'zustand';
import type { UserProfile } from '../types/user';
import { mockUserProfile } from '../mocks/user';

interface AuthStore {
  isLoggedIn: boolean;
  onboardingCompleted: boolean;
  profile: UserProfile | null;
  login: () => void;
  logout: () => void;
  completeOnboarding: (profile: UserProfile) => void;
}

// 데모 목적: 실제 인증/서버 연동 전까지 목업 프로필로 로그인 처리
export const useAuthStore = create<AuthStore>((set) => ({
  isLoggedIn: false,
  onboardingCompleted: false,
  profile: null,
  login: () =>
    set({
      isLoggedIn: true,
      onboardingCompleted: true,
      profile: mockUserProfile,
    }),
  logout: () =>
    set({ isLoggedIn: false, onboardingCompleted: false, profile: null }),
  completeOnboarding: (profile) =>
    set({ onboardingCompleted: true, profile, isLoggedIn: true }),
}));
