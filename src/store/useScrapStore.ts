import { create } from 'zustand';

interface ScrapStore {
  scrappedIds: Set<string>;
  toggleScrap: (benefitId: string) => void;
  isScrapped: (benefitId: string) => boolean;
}

export const useScrapStore = create<ScrapStore>((set, get) => ({
  scrappedIds: new Set(),
  toggleScrap: (benefitId) =>
    set((state) => {
      const next = new Set(state.scrappedIds);
      if (next.has(benefitId)) {
        next.delete(benefitId);
      } else {
        next.add(benefitId);
      }
      return { scrappedIds: next };
    }),
  isScrapped: (benefitId) => get().scrappedIds.has(benefitId),
}));
