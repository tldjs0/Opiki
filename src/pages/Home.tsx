import { useMemo, useState } from 'react';
import { ChevronRight, Search as SearchIcon, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockBenefits } from '../mocks/benefits';
import { BenefitCard } from '../components/ui/BenefitCard';
import { useAuthStore } from '../store/useAuthStore';
import { useScrapStore } from '../store/useScrapStore';
import type { BenefitCategory } from '../types/benefit';

const categories: (BenefitCategory | '전체')[] = [
  '전체',
  '장학금',
  '주거',
  '생활비',
  '교육',
  '취업·창업',
];

export function Home() {
  const navigate = useNavigate();
  const { isLoggedIn, profile } = useAuthStore();
  const scrappedIds = useScrapStore((s) => s.scrappedIds);
  const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]>('전체');

  const scrappedBenefits = useMemo(
    () => mockBenefits.filter((b) => scrappedIds.has(b.id)).slice(0, 2),
    [scrappedIds],
  );

  const filteredBenefits = useMemo(
    () =>
      activeCategory === '전체'
        ? mockBenefits
        : mockBenefits.filter((b) => b.category === activeCategory),
    [activeCategory],
  );

  return (
    <div className="px-4 pt-2 pb-6 flex flex-col gap-6">
      {/* 인사말 */}
      {isLoggedIn && profile ? (
        <button
          onClick={() => navigate('/profile')}
          className="flex items-center gap-1 text-[15px] font-semibold text-[var(--color-navy)] -mb-2"
        >
          {profile.nickname}님 <ChevronRight size={16} />
        </button>
      ) : (
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-1 text-[15px] font-semibold text-[var(--color-navy)] -mb-2"
        >
          로그인하기 <ChevronRight size={16} />
        </button>
      )}

      {/* 히어로 배너 */}
      <div className="rounded-3xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-mint)] px-5 py-6 text-white relative overflow-hidden">
        <Sparkles className="absolute top-4 right-6 opacity-60" size={28} />
        <Sparkles className="absolute bottom-6 right-16 opacity-40" size={18} />
        <p className="text-xl font-bold leading-snug">
          당신의 기회를
          <br />
          대신 발견해드려요
        </p>
        <p className="text-sm mt-2 opacity-90">
          맞춤 혜택을 비교하고
          <br />
          빠르게 신청까지!
        </p>
        <SearchIcon
          size={72}
          strokeWidth={1.5}
          className="absolute -bottom-3 right-4 opacity-30"
        />
      </div>

      {/* 즐겨찾은 기회 */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-[15px] text-[var(--color-navy)]">즐겨찾은 기회</h2>
          <button
            onClick={() => navigate('/scraps')}
            className="text-xs text-[var(--color-muted)] flex items-center"
          >
            전체 보기 <ChevronRight size={14} />
          </button>
        </div>
        {!isLoggedIn ? (
          <div className="rounded-2xl border border-dashed border-[var(--color-border)] py-8 text-center text-sm text-[var(--color-muted)]">
            아직 즐겨찾은 혜택이 없어요.
            <br />
            <button
              onClick={() => navigate('/login')}
              className="text-[var(--color-primary)] font-semibold"
            >
              로그인 하고 즐겨찾기 →
            </button>
          </div>
        ) : scrappedBenefits.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--color-border)] py-8 text-center text-sm text-[var(--color-muted)]">
            아직 즐겨찾은 혜택이 없어요.
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {scrappedBenefits.map((b) => (
              <BenefitCard key={b.id} benefit={b} showScrapButton={false} />
            ))}
          </div>
        )}
      </section>

      {/* 기회 리스트 */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-[15px] text-[var(--color-navy)]">기회 리스트</h2>
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium border ${
                activeCategory === c
                  ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                  : 'bg-white text-[var(--color-muted)] border-[var(--color-border)]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {filteredBenefits.map((b) => (
            <BenefitCard key={b.id} benefit={b} showScrapButton={isLoggedIn} />
          ))}
        </div>
      </section>
    </div>
  );
}
