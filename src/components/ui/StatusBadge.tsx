import type { Benefit } from '../../types/benefit';

interface StatusBadgeProps {
  status: Benefit['status'];
  dDay?: number;
}

const styleByStatus: Record<Benefit['status'], string> = {
  urgent: 'bg-orange-50 text-[var(--color-accent)] border border-[var(--color-accent)]/30',
  ongoing: 'bg-blue-50 text-[var(--color-primary)] border border-[var(--color-primary)]/30',
  always: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
  closed: 'bg-gray-100 text-gray-400 border border-gray-200',
};

function getLabel(status: Benefit['status'], dDay?: number) {
  if (status === 'always') return '상시';
  if (status === 'closed') return '마감';
  if (dDay !== undefined) return dDay === 0 ? 'D-0' : `D-${dDay}`;
  return '진행중';
}

export function StatusBadge({ status, dDay }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${styleByStatus[status]}`}
    >
      {getLabel(status, dDay)}
    </span>
  );
}
