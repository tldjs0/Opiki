import { useMemo, useState } from 'react';
import { Star, Clock } from 'lucide-react';
import { mockNotifications } from '../mocks/user';
import { SubPageHeader } from '../components/layout/SubPageHeader';

type Tab = 'all' | 'deadline' | 'notice';

const tabs: { key: Tab; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'deadline', label: '마감 임박' },
  { key: 'notice', label: '공지' },
];

function badgeStyle(badge: string) {
  // D-N 등 진행중 뱃지는 민트 아웃라인, 마감은 회색 아웃라인
  if (badge === '마감') {
    return 'border border-gray-300 text-gray-400';
  }
  return 'border border-[var(--color-mint)] text-emerald-600';
}

export function Notifications() {
  const [tab, setTab] = useState<Tab>('all');

  const filtered = useMemo(() => {
    if (tab === 'all') return mockNotifications;
    if (tab === 'deadline') return mockNotifications.filter((n) => n.type === 'deadline');
    return mockNotifications.filter((n) => n.type === 'notice');
  }, [tab]);

  return (
    <div className="flex flex-col">
      <SubPageHeader title="알림 내역" />
      <div className="px-4 pb-10 flex flex-col gap-4">
      <div className="flex gap-5 border-b border-[var(--color-border)]">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`pb-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors ${
              tab === t.key
                ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                : 'border-transparent text-[var(--color-muted)]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div>
        <p className="text-xs text-[var(--color-muted)] mb-2">일주일 이내</p>
        <div className="flex flex-col divide-y divide-[var(--color-border)]">
          {filtered.map((n) => (
            <div key={n.id} className="flex items-start gap-3 py-3">
              <span className="mt-0.5 shrink-0 w-5 flex flex-col items-center gap-1.5">
                {n.starred && <Star size={16} className="fill-[var(--color-primary)] text-[var(--color-primary)]" />}
                {n.badge && <Clock size={15} className="text-[var(--color-muted)]" />}
              </span>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-[var(--color-navy)]">{n.title}</p>
                  {n.badge && (
                    <span className={`text-xs font-semibold rounded-full px-2.5 py-0.5 ${badgeStyle(n.badge)}`}>
                      {n.badge}
                    </span>
                  )}
                </div>
                {n.description && (
                  <p className="text-xs text-[var(--color-muted)] mt-0.5">{n.description}</p>
                )}
                <p className="text-[11px] text-[var(--color-muted)] mt-1">{n.timeAgo}</p>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="py-10 text-center text-sm text-[var(--color-muted)]">알림이 없어요.</p>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
