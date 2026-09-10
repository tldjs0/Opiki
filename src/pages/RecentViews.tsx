import { useMemo } from 'react';
import { History } from 'lucide-react';
import { mockBenefits } from '../mocks/benefits';
import { BenefitCard } from '../components/ui/BenefitCard';
import { SubPageHeader } from '../components/layout/SubPageHeader';
import { useRecentViewStore } from '../store/useRecentViewStore';

export function RecentViews() {
  const recentIds = useRecentViewStore((s) => s.recentIds);

  const recentBenefits = useMemo(
    () =>
      recentIds
        .map((id) => mockBenefits.find((b) => b.id === id))
        .filter((b): b is (typeof mockBenefits)[number] => Boolean(b)),
    [recentIds],
  );

  return (
    <div className="flex flex-col">
      <SubPageHeader title="최근 본 공고" />
      <div className="px-4 pb-10 flex flex-col gap-4">
        {recentBenefits.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-[var(--color-border)] py-16 text-center">
            <History size={28} className="text-[var(--color-border)]" />
            <p className="text-sm text-[var(--color-muted)]">
              아직 확인한 공고가 없어요.
              <br />
              관심있는 혜택을 눌러 상세 내용을 확인해보세요.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {recentBenefits.map((b) => (
              <BenefitCard key={b.id} benefit={b} showScrapButton={false} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
