import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Star, UserCircle2 } from 'lucide-react';
import { mockBenefits, mockComparisonGroups } from '../mocks/benefits';
import { BenefitCard } from '../components/ui/BenefitCard';
import { SubPageHeader } from '../components/layout/SubPageHeader';
import { useAuthStore } from '../store/useAuthStore';
import { useScrapStore } from '../store/useScrapStore';
import { recommendFromGroup } from '../utils/recommend';

export function Scrap() {
  const navigate = useNavigate();
  const { isLoggedIn, profile } = useAuthStore();
  const scrappedIds = useScrapStore((s) => s.scrappedIds);

  const scrappedBenefits = useMemo(
    () => mockBenefits.filter((b) => scrappedIds.has(b.id)),
    [scrappedIds],
  );

  const topRecommended = useMemo(
    () => [...mockBenefits].sort((a, b) => b.viewCount - a.viewCount).slice(0, 3),
    [],
  );

  // 같은 비교 그룹에 속한 혜택이 2개 이상 스크랩되어 있으면 비교 안내
  const conflictBanners = useMemo(() => {
    const groups = new Map<string, typeof mockBenefits>();
    scrappedBenefits.forEach((b) => {
      if (!b.comparisonGroupId) return;
      const list = groups.get(b.comparisonGroupId) ?? [];
      list.push(b);
      groups.set(b.comparisonGroupId, list);
    });
    return [...groups.entries()]
      .filter(([, list]) => list.length >= 2)
      .map(([groupId, list]) => ({
        groupName: mockComparisonGroups[groupId]?.name ?? '중복 지원 불가 혜택',
        list,
        recommendation: recommendFromGroup(list, profile),
      }));
  }, [scrappedBenefits, profile]);

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col">
        <SubPageHeader title="즐겨찾기" />
        <div className="flex flex-col items-center justify-center gap-3 px-6 py-24 text-center">
          <UserCircle2 size={48} className="text-[var(--color-border)]" />
          <p className="font-bold text-[var(--color-navy)]">로그인이 필요해요</p>
          <p className="text-sm text-[var(--color-muted)]">
            로그인하면 내 상황에 맞는 추천과 스크랩 목록을 볼 수 있어요.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="mt-2 rounded-xl bg-[var(--color-primary)] px-6 py-2.5 text-white font-semibold"
          >
            로그인 하러 가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <SubPageHeader title="즐겨찾기" />
      <div className="px-4 pb-10 flex flex-col gap-6">
      {/* 내 상황 요약 */}
      {profile && (
        <div className="rounded-2xl bg-[var(--color-bg)] p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="font-bold text-[var(--color-navy)]">내 상황 요약</p>
            <button
              onClick={() => navigate('/onboarding')}
              className="text-xs text-[var(--color-primary)] flex items-center font-semibold"
            >
              수정하기 <ChevronRight size={14} />
            </button>
          </div>
          <dl className="grid grid-cols-[72px_1fr] gap-y-2 text-sm">
            <dt className="text-[var(--color-muted)]">나이</dt>
            <dd className="text-[var(--color-navy)] font-medium">{profile.age}세</dd>
            <dt className="text-[var(--color-muted)]">거주지역</dt>
            <dd className="text-[var(--color-navy)] font-medium">{profile.region || '-'}</dd>
            <dt className="text-[var(--color-muted)]">소득 기준</dt>
            <dd className="text-[var(--color-navy)] font-medium">{profile.incomeLevel || '-'}</dd>
            <dt className="text-[var(--color-muted)]">학력</dt>
            <dd className="text-[var(--color-navy)] font-medium">{profile.educationStatus || '-'}</dd>
          </dl>
        </div>
      )}

      {/* AI 추천 혜택 TOP3 */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-[15px] text-[var(--color-navy)]">AI 추천 혜택 TOP3</h2>
          <span className="text-xs text-[var(--color-muted)]">조회수 기준</span>
        </div>
        <div className="flex flex-col gap-2">
          {topRecommended.map((b, idx) => (
            <div key={b.id} className="flex items-center gap-2">
              <span className="h-6 w-6 shrink-0 rounded-full bg-[var(--color-primary)] text-white text-xs font-bold flex items-center justify-center">
                {idx + 1}
              </span>
              <div className="flex-1">
                <BenefitCard benefit={b} showScrapButton={false} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 중복 지원 불가 혜택 비교 안내 */}
      {conflictBanners.map((banner) => (
        <div key={banner.groupName} className="rounded-2xl border border-[var(--color-accent)]/40 bg-orange-50 p-4 text-sm">
          <p className="font-semibold text-[var(--color-navy)]">
            '{banner.groupName}'은 중복 지원이 불가능해요
          </p>
          {banner.recommendation && (
            <>
              <p className="text-[var(--color-navy)]/80 mt-2">
                AI 추천:{' '}
                <span className="font-semibold text-[var(--color-primary)]">
                  {banner.recommendation.recommended.title}
                </span>
              </p>
              <p className="text-[var(--color-muted)] mt-1">{banner.recommendation.reason}</p>
            </>
          )}
        </div>
      ))}

      {/* 즐겨찾기 한 혜택 */}
      <section className="flex flex-col gap-3">
        <h2 className="font-bold text-[15px] text-[var(--color-navy)]">즐겨찾기 한 혜택</h2>
        {scrappedBenefits.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-[var(--color-border)] py-10 text-center">
            <Star size={28} className="text-[var(--color-border)]" />
            <p className="text-sm text-[var(--color-muted)]">
              아직 즐겨찾은 혜택이 없어요.
              <br />
              관심있는 혜택에 별표를 눌러보세요.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {scrappedBenefits.map((b) => (
              <BenefitCard key={b.id} benefit={b} showCategoryIcon />
            ))}
          </div>
        )}
      </section>
      </div>
    </div>
  );
}
