import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { mockBenefits } from '../mocks/benefits';
import { useScrapStore } from '../store/useScrapStore';
import { StatusBadge } from '../components/ui/StatusBadge';
import { useNavigate } from 'react-router-dom';

const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

function toDateKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function calcDDay(dateStr: string): number {
  const today = new Date('2026-05-19'); // 데모 기준일 (Figma 예시와 동일)
  const target = new Date(dateStr);
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function CalendarPage() {
  const navigate = useNavigate();
  const scrappedIds = useScrapStore((s) => s.scrappedIds);
  const scrappedBenefits = useMemo(
    () => mockBenefits.filter((b) => scrappedIds.has(b.id)),
    [scrappedIds],
  );

  const [viewDate, setViewDate] = useState(new Date('2026-05-01'));
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  // 날짜별 이벤트 맵 (신청 시작일/마감일 기준)
  const eventsByDate = useMemo(() => {
    const map = new Map<string, typeof mockBenefits>();
    scrappedBenefits.forEach((b) => {
      if (b.status === 'always') return;
      [b.applyStartDate, b.applyEndDate].forEach((dateStr) => {
        const list = map.get(dateStr) ?? [];
        if (!list.find((x) => x.id === b.id)) list.push(b);
        map.set(dateStr, list);
      });
    });
    return map;
  }, [scrappedBenefits]);

  const upcoming = useMemo(
    () =>
      [...scrappedBenefits].sort((a, b) => {
        const da = a.status === 'always' ? Infinity : calcDDay(a.applyEndDate);
        const db = b.status === 'always' ? Infinity : calcDDay(b.applyEndDate);
        return da - db;
      }),
    [scrappedBenefits],
  );

  const firstWeekday = new Date(year, month, 1).getDay();
  const totalDays = daysInMonth(year, month);
  const cells: (number | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ];

  const todayKey = '2026-05-19';

  return (
    <div className="px-4 pt-4 pb-10 flex flex-col gap-6">
      {/* 월 이동 */}
      <div className="flex items-center justify-center gap-6">
        <button onClick={() => setViewDate(new Date(year, month - 1, 1))} aria-label="이전 달">
          <ChevronLeft size={20} className="text-[var(--color-muted)]" />
        </button>
        <p className="font-bold text-[var(--color-navy)]">
          {year}년 {month + 1}월
        </p>
        <button onClick={() => setViewDate(new Date(year, month + 1, 1))} aria-label="다음 달">
          <ChevronRight size={20} className="text-[var(--color-muted)]" />
        </button>
      </div>

      {/* 달력 그리드 */}
      <div>
        <div className="grid grid-cols-7 text-center text-[11px] text-[var(--color-muted)] mb-2">
          {WEEKDAYS.map((w) => (
            <span key={w}>{w}</span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-y-2 text-center text-sm">
          {cells.map((day, idx) => {
            if (day === null) return <span key={idx} />;
            const dateKey = toDateKey(new Date(year, month, day));
            const hasEvent = eventsByDate.has(dateKey);
            const isToday = dateKey === todayKey;
            return (
              <div key={idx} className="flex flex-col items-center gap-1">
                <span
                  className={`h-7 w-7 flex items-center justify-center rounded-full ${
                    isToday ? 'bg-[var(--color-primary)] text-white font-bold' : 'text-[var(--color-navy)]'
                  }`}
                >
                  {day}
                </span>
                <span
                  className={`h-1.5 w-1.5 rounded-full ${hasEvent ? 'bg-[var(--color-accent)]' : 'bg-transparent'}`}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* 마감 임박순 리스트 */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <CalendarDays size={16} className="text-[var(--color-muted)]" />
          <h2 className="font-bold text-[15px] text-[var(--color-navy)]">마감 임박순</h2>
        </div>
        {upcoming.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--color-border)] py-10 text-center text-sm text-[var(--color-muted)]">
            즐겨찾은 혜택이 없어요.
            <br />
            혜택을 스크랩하면 신청기간이 여기에 표시돼요.
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {upcoming.map((b) => (
              <button
                key={b.id}
                onClick={() => navigate(`/benefits/${b.id}`)}
                className="w-full text-left flex items-center gap-3 rounded-2xl border border-[var(--color-border)] px-4 py-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-[var(--color-navy)] truncate">{b.title}</p>
                  <p className="text-xs text-[var(--color-muted)] truncate">{b.summary}</p>
                  <p className="text-xs text-[var(--color-primary)] mt-1">
                    {b.applyStartDate.replaceAll('-', '.')} ~ {b.applyEndDate.replaceAll('-', '.')}
                  </p>
                </div>
                <StatusBadge status={b.status} dDay={b.status === 'always' ? undefined : Math.max(calcDDay(b.applyEndDate), 0)} />
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
