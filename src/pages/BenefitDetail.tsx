import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Share2, Star } from 'lucide-react';
import { mockBenefits, mockComparisonGroups } from '../mocks/benefits';
import { StatusBadge } from '../components/ui/StatusBadge';
import { SubPageHeader } from '../components/layout/SubPageHeader';
import { useScrapStore } from '../store/useScrapStore';
import { useRecentViewStore } from '../store/useRecentViewStore';
import { buildSummarySections } from '../utils/summarize';
import { ComingSoon } from '../components/ui/ComingSoon';

type ViewMode = 'detail' | 'summary';

export function BenefitDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mode, setMode] = useState<ViewMode>('detail');

  const benefit = useMemo(() => mockBenefits.find((b) => b.id === id), [id]);
  const isScrapped = useScrapStore((s) => (benefit ? s.isScrapped(benefit.id) : false));
  const toggleScrap = useScrapStore((s) => s.toggleScrap);
  const scrappedIds = useScrapStore((s) => s.scrappedIds);
  const addRecentView = useRecentViewStore((s) => s.addRecentView);

  useEffect(() => {
    if (benefit) addRecentView(benefit.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [benefit?.id]);

  if (!benefit) {
    return <ComingSoon title="혜택을 찾을 수 없어요" description="삭제되었거나 존재하지 않는 공고입니다." />;
  }

  const summarySections = buildSummarySections(benefit);

  // 중복 지원 불가 혜택 그룹에 속해 있고, 같은 그룹의 다른 혜택도 스크랩되어 있을 때만 안내
  const comparisonGroup =
    benefit.comparisonGroupId &&
    mockComparisonGroups[benefit.comparisonGroupId]?.benefitIds.filter((bid) => scrappedIds.has(bid))
      .length >= 2
      ? mockComparisonGroups[benefit.comparisonGroupId]
      : undefined;

  return (
    <div className="flex flex-col min-h-full">
      {/* 상단바: 뒤로가기 + 타이틀 + 상세/요약 토글 */}
      <SubPageHeader
        title="혜택 상세"
        right={
          <div className="flex items-center rounded-full bg-[var(--color-bg)] p-1 text-xs font-semibold">
            <button
              onClick={() => setMode('detail')}
              className={`rounded-full px-3 py-1 transition-colors ${
                mode === 'detail' ? 'bg-[var(--color-primary)] text-white' : 'text-[var(--color-muted)]'
              }`}
            >
              상세
            </button>
            <button
              onClick={() => setMode('summary')}
              className={`rounded-full px-3 py-1 transition-colors ${
                mode === 'summary' ? 'bg-[var(--color-primary)] text-white' : 'text-[var(--color-muted)]'
              }`}
            >
              요약
            </button>
          </div>
        }
      />

      <div className="flex-1 px-4 pb-28 flex flex-col gap-5">
        {/* 카드 헤더 */}
        <div className="rounded-2xl border border-[var(--color-border)] p-4">
          <div className="flex items-start justify-between gap-2">
            <h1 className="text-lg font-bold text-[var(--color-navy)] leading-snug">
              {benefit.title}
            </h1>
            <div className="flex items-center gap-2 shrink-0 pt-0.5">
              <button onClick={() => toggleScrap(benefit.id)} aria-label="즐겨찾기">
                <Star
                  size={20}
                  className={isScrapped ? 'fill-[var(--color-primary)] text-[var(--color-primary)]' : 'text-[var(--color-border)]'}
                />
              </button>
              <button aria-label="공유">
                <Share2 size={19} className="text-[var(--color-muted)]" />
              </button>
            </div>
          </div>
          <p className="text-sm text-[var(--color-muted)] mt-1">{benefit.summary}</p>
          <div className="flex items-center gap-2 mt-3">
            <span className="rounded-lg bg-[var(--color-bg)] px-2 py-1 text-xs text-[var(--color-navy)]">
              {benefit.category}
            </span>
            <StatusBadge status={benefit.status} dDay={benefit.dDay} />
          </div>
          <p className="text-xs text-[var(--color-muted)] mt-3">
            신청 기간{' '}
            <span className="text-[var(--color-primary)] font-medium">
              {benefit.applyStartDate.replaceAll('-', '.')} ~ {benefit.applyEndDate.replaceAll('-', '.')}
            </span>
          </p>
        </div>

        {mode === 'detail' ? (
          <div className="flex flex-col gap-4 text-sm">
            {benefit.policyNumber && (
              <DetailBlock label="정책번호" value={benefit.policyNumber} />
            )}
            <DetailBlock label="정책분야" value={benefit.category} />
            <DetailBlock label="지원내용" value={benefit.content} multiline />
            <DetailBlock
              label="사업 신청기간"
              value={
                benefit.status === 'always'
                  ? '상시'
                  : `${benefit.applyStartDate} ~ ${benefit.applyEndDate}`
              }
            />
            <DetailBlock label="신청자격" value={formatEligibilityLines(benefit)} multiline />
            {benefit.applyMethod && <DetailBlock label="신청방법" value={benefit.applyMethod} multiline />}
            {benefit.applyUrl && (
              <DetailBlock
                label="신청 사이트"
                value={benefit.applyUrl}
                link={benefit.applyUrl}
              />
            )}
            <DetailBlock label="제출 서류" value={benefit.requiredDocuments ?? '-'} />
          </div>
        ) : (
          <div className="flex flex-col gap-4 text-sm">
            {summarySections.map((section) => (
              <DetailBlock key={section.label} label={section.label} value={section.value} multiline />
            ))}
          </div>
        )}

        {/* 중복 지원 불가 혜택 비교 안내 (스크랩된 동일 그룹 혜택이 있을 때) */}
        {comparisonGroup && (
          <div className="rounded-2xl bg-[var(--color-bg)] p-4 text-sm">
            <p className="font-semibold text-[var(--color-navy)]">
              '{comparisonGroup.name}'은 중복 지원이 불가능해요
            </p>
            <p className="text-[var(--color-muted)] mt-1">
              즐겨찾기 화면에서 내 상황에 더 유리한 혜택을 AI가 비교해드려요.
            </p>
          </div>
        )}

        {/* 조건별 방식이 갈리는 혜택(K패스 등) 비교 프롬프트 */}
        {benefit.hasVariants && (
          <div className="rounded-2xl bg-[var(--color-bg)] p-4 text-sm">
            <p className="font-semibold text-[var(--color-navy)]">상세 혜택을 비교하시겠어요?</p>
            <p className="text-[var(--color-muted)] mt-1">
              상세 공고에서 비교할만한 조건을 발견했어요. 지금 비교하고 혜택을 받아보세요
            </p>
            <button
              onClick={() => navigate(`/benefits/${benefit.id}/compare`)}
              className="mt-3 w-full rounded-xl bg-[var(--color-primary)] py-2.5 text-white font-semibold"
            >
              비교하기
            </button>
          </div>
        )}
      </div>

      {/* 신청하기 버튼 (하단 고정) */}
      <div className="sticky bottom-0 px-4 py-3 bg-white border-t border-[var(--color-border)]">
        <a
          href={benefit.applyUrl ?? '#'}
          target="_blank"
          rel="noreferrer"
          className="block text-center w-full rounded-xl bg-[var(--color-mint)] py-3 font-bold text-white"
        >
          신청하기 ↗
        </a>
      </div>
    </div>
  );
}

function formatEligibilityLines(benefit: (typeof mockBenefits)[number]) {
  const e = benefit.eligibility;
  return [
    e.age && `연령-${e.age}`,
    e.region && `거주지역-${e.region}`,
    e.income && `소득-${e.income}`,
    e.education && `학력-${e.education}`,
    e.major && `전공-${e.major}`,
    e.employmentStatus && `취업상태-${e.employmentStatus}`,
    e.specialty && `특화분야-${e.specialty}`,
    e.note,
  ]
    .filter(Boolean)
    .join('\n');
}

function DetailBlock({
  label,
  value,
  multiline = false,
  link,
}: {
  label: string;
  value: string;
  multiline?: boolean;
  link?: string;
}) {
  return (
    <div>
      <p className="font-semibold text-[var(--color-navy)] mb-1">{label}</p>
      {link ? (
        <a href={link} target="_blank" rel="noreferrer" className="text-[var(--color-primary)] underline break-all">
          {value}
        </a>
      ) : (
        <p className={`text-[var(--color-navy)]/80 ${multiline ? 'whitespace-pre-line leading-relaxed' : ''}`}>
          {value}
        </p>
      )}
    </div>
  );
}
