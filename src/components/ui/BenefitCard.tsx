import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Benefit } from '../../types/benefit';
import { StatusBadge } from './StatusBadge';
import { CategoryIcon } from './CategoryIcon';
import { useScrapStore } from '../../store/useScrapStore';

interface BenefitCardProps {
  benefit: Benefit;
  showScrapButton?: boolean;
  showCategoryIcon?: boolean;
}

function formatDateRange(start: string, end: string) {
  const fmt = (d: string) => d.replaceAll('-', '.');
  return `${fmt(start)} ~ ${fmt(end)}`;
}

export function BenefitCard({ benefit, showScrapButton = true, showCategoryIcon = false }: BenefitCardProps) {
  const navigate = useNavigate();
  const isScrapped = useScrapStore((s) => s.isScrapped(benefit.id));
  const toggleScrap = useScrapStore((s) => s.toggleScrap);

  return (
    <button
      onClick={() => navigate(`/benefits/${benefit.id}`)}
      className="w-full text-left flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 active:scale-[0.99] transition-transform"
    >
      {showCategoryIcon && <CategoryIcon category={benefit.category} />}
      <div className="flex-1 min-w-0">
        <div className="mb-1">
          <StatusBadge status={benefit.status} dDay={benefit.dDay} />
        </div>
        <p className="font-semibold text-[15px] text-[var(--color-navy)] truncate">
          {benefit.title}
        </p>
        <p className="text-sm text-[var(--color-muted)] truncate">{benefit.summary}</p>
        <p className="text-xs text-[var(--color-muted)] mt-1">
          신청 기간{' '}
          <span className="text-[var(--color-primary)] font-medium">
            {formatDateRange(benefit.applyStartDate, benefit.applyEndDate)}
          </span>
        </p>
      </div>
      {showScrapButton && (
        <span
          role="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleScrap(benefit.id);
          }}
          className="shrink-0 p-1"
        >
          <Star
            size={22}
            className={isScrapped ? 'fill-[var(--color-primary)] text-[var(--color-primary)]' : 'text-[var(--color-border)]'}
          />
        </span>
      )}
    </button>
  );
}
