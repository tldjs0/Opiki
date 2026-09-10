import { useMemo, useState } from 'react';
import { Bell, Megaphone, Star } from 'lucide-react';
import { mockNotifications } from '../mocks/user';

type Tab = 'all' | 'deadline' | 'notice';

const tabs: { key: Tab; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'deadline', label: '마감 임박' },
  { key: 'notice', label: '공지' },
];

export function Notifications() {
  const [tab, setTab] = useState<Tab>('all');

  const filtered = useMemo(() => {
    if (tab === 'all') return mockNotifications;
    if (tab === 'deadline') return mockNotifications.filter((n) => n.type === 'deadline');
    return mockNotifications.filter((n) => n.type === 'notice');
  }, [tab]);

  return (
    <div className="px-4 pt-4 pb-10 flex flex-col gap-4">
      <h1 className="text-lg font-bold text-[var(--color-navy)]">알림 내역</h1>

      <div className="flex gap-1 rounded-full bg-[var(--color-bg)] p-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 rounded-full py-2 text-sm font-semibold transition-colors ${
              tab === t.key ? 'bg-white text-[var(--color-primary)] shadow-sm' : 'text-[var(--color-muted)]'
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
              <span className="mt-0.5 shrink-0 h-8 w-8 rounded-full bg-[var(--color-bg)] flex items-center justify-center">
                {n.type === 'notice' ? (
                  <Megaphone size={16} className="text-[var(--color-muted)]" />
                ) : n.type === 'deadline' ? (
                  <Bell size={16} className="text-[var(--color-accent)]" />
                ) : (
                  <Star size={16} className="text-[var(--color-primary)]" />
                )}
              </span>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-[var(--color-navy)]">{n.title}</p>
                  {n.badge && (
                    <span
                      className={`text-xs font-semibold rounded-full px-2 py-0.5 ${
                        n.badge === '마감'
                          ? 'bg-gray-100 text-gray-400'
                          : 'bg-orange-50 text-[var(--color-accent)]'
                      }`}
                    >
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
  );
}
