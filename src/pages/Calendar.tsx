import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockBenefits } from '../mocks/benefits';
import { useScrapStore } from '../store/useScrapStore';
import { StatusBadge } from '../components/ui/StatusBadge';
import { CategoryIcon } from '../components/ui/CategoryIcon';

const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const BAR_COLORS = ['#ff9f5a', '#6ee2c8', '#5b8cff', '#8b5cf6', '#ff6b9d'];

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
  // 기간이 있는(상시가 아닌) 혜택만 캘린더 바 대상
  const rangedBenefits = useMemo(
    () => scrappedBenefits.filter((b) => b.status !== 'always'),
    [scrappedBenefits],
  );

  const [viewDate, setViewDate] = useState(new Date('2026-05-01'));
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const todayKey = '2026-05-19';

  const upcoming = useMemo(
    () =>
      [...scrappedBenefits].sort((a, b) => {
        const da = a.status === 'always' ? Infinity : calcDDay(a.applyEndDate);
        const db = b.status === 'always' ? Infinity : calcDDay(b.applyEndDate);
        return da - db;
      }),
    [scrappedBenefits],
  );

  // 월 전체를 주(week) 단위로 분할: 각 주는 7칸(day 숫자 또는 null)
  const weeks = useMemo(() => {
    const firstWeekday = new Date(year, month, 1).getDay();
    const totalDays = daysInMonth(year, month);
    const cells: (number | null)[] = [
      ...Array(firstWeekday).fill(null),
      ...Array.from({ length: totalDays }, (_, i) => i + 1),
    ];
    while (cells.length % 7 !== 0) cells.push(null);
    const result: (number | null)[][] = [];
    for (let i = 0; i < cells.length; i += 7) result.push(cells.slice(i, i + 7));
    return result;
  }, [year, month]);

  // 각 주(week)마다, 해당 주와 겹치는 혜택 신청기간을 바(bar) 세그먼트로 계산
  const weekBars = useMemo(() => {
    return weeks.map((week) => {
      const bars: { benefitId: string; colStart: number; colEnd: number; color: string }[] = [];
      rangedBenefits.forEach((b, idx) => {
        const start = new Date(b.applyStartDate);
        const end = new Date(b.applyEndDate);
        let colStart = -1;
        let colEnd = -1;
        week.forEach((day, col) => {
          if (day === null) return;
          const d = new Date(year, month, day);
          if (d >= start && d <= end) {
            if (colStart === -1) colStart = col;
            colEnd = col;
          }
        });
        if (colStart !== -1) {
          bars.push({ benefitId: b.id, colStart, colEnd, color: BAR_COLORS[idx % BAR_COLORS.length] });
        }
      });
      return bars;
    });
  }, [weeks, rangedBenefits, year, month]);

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

      {/* 달력 그리드 (주 단위로 렌더링 + 신청기간 바) */}
      <div>
        <div className="grid grid-cols-7 text-center text-[11px] text-[var(--color-muted)] mb-2">
          {WEEKDAYS.map((w) => (
            <span key={w}>{w}</span>
          ))}
        </div>
        <div className="flex flex-col gap-1.5">
          {weeks.map((week, wIdx) => (
            <div key={wIdx} className="flex flex-col gap-1">
              <div className="grid grid-cols-7 text-center text-sm">
                {week.map((day, dIdx) => {
                  if (day === null) return <span key={dIdx} />;
                  const dateKey = new Date(year, month, day).toISOString().slice(0, 10);
                  const isToday = dateKey === todayKey;
                  return (
                    <span
                      key={dIdx}
                      className={`mx-auto h-7 w-7 flex items-center justify-center rounded-full ${
                        isToday ? 'bg-[var(--color-primary)] text-white font-bold' : 'text-[var(--color-navy)]'
                      }`}
                    >
                      {day}
                    </span>
                  );
                })}
              </div>
              {weekBars[wIdx].map((bar) => (
                <div key={bar.benefitId} className="grid grid-cols-7">
                  <span
                    style={{
                      gridColumnStart: bar.colStart + 1,
                      gridColumnEnd: bar.colEnd + 2,
                      backgroundColor: bar.color,
                    }}
                    className="h-[3px] rounded-full mx-1"
                  />
                </div>
              ))}
            </div>
          ))}
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
                <CategoryIcon category={b.category} />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-[var(--color-navy)] truncate">{b.title}</p>
                  <p className="text-xs text-[var(--color-muted)] truncate">{b.summary}</p>
                  <p className="text-xs text-[var(--color-primary)] mt-1">
                    {b.applyStartDate.replaceAll('-', '.')} ~ {b.applyEndDate.replaceAll('-', '.')}
                  </p>
                </div>
                <StatusBadge
                  status={b.status}
                  dDay={b.status === 'always' ? undefined : Math.max(calcDDay(b.applyEndDate), 0)}
                />
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
