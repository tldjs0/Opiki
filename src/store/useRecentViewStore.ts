import { create } from 'zustand';

interface RecentViewStore {
  recentIds: string[]; // 최신순
  addRecentView: (benefitId: string) => void;
}

const MAX_RECENT = 20;

export const useRecentViewStore = create<RecentViewStore>((set) => ({
  recentIds: [],
  addRecentView: (benefitId) =>
    set((state) => {
      const filtered = state.recentIds.filter((id) => id !== benefitId);
      return { recentIds: [benefitId, ...filtered].slice(0, MAX_RECENT) };
    }),
}));
