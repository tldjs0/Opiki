import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { mockBenefits } from '../mocks/benefits';
import { useAuthStore } from '../store/useAuthStore';
import { ComingSoon } from '../components/ui/ComingSoon';
import { SubPageHeader } from '../components/layout/SubPageHeader';

interface Variant {
  name: string;
  condition: string;
  benefitDetail: string;
  refundRate: string;
}

// TODO(백엔드 연동 시 교체): docs/planning/03_ERD_DB설계서.md의 BenefitVariant 테이블에 대응하는
// 목업입니다. 실제로는 서버에서 조건 규칙(JSON)을 받아 매칭해야 합니다.
const kPassVariants: Variant[] = [
  {
    name: '일반 이용자',
    condition: '만 35세 이상',
    benefitDetail: '월 15회 이상 대중교통 이용 시',
    refundRate: '20% 환급',
  },
  {
    name: '청년 (만 19~34세)',
    condition: '만 19세 ~ 34세',
    benefitDetail: '월 15회 이상 대중교통 이용 시',
    refundRate: '30% 환급',
  },
  {
    name: '저소득층',
    condition: '기초생활수급자 / 차상위계층',
    benefitDetail: '월 15회 이상 대중교통 이용 시',
    refundRate: '53% 환급',
  },
];

export function BenefitCompare() {
  const { id } = useParams();
  const navigate = useNavigate();
  const profile = useAuthStore((s) => s.profile);
  const benefit = useMemo(() => mockBenefits.find((b) => b.id === id), [id]);

  if (!benefit || !benefit.hasVariants) {
    return <ComingSoon title="비교 정보를 찾을 수 없어요" description="이 혜택은 조건별 비교 정보가 없습니다." />;
  }

  // 데모용 규칙: 프로필 나이가 19~34세면 '청년' 옵션을 추천
  const recommendedName =
    profile && profile.age >= 19 && profile.age <= 34 ? '청년 (만 19~34세)' : '일반 이용자';

  return (
    <div className="flex flex-col">
      <SubPageHeader title={`${benefit.title} 비교`} />
      <div className="px-4 pb-10 flex flex-col gap-5">

      <div className="rounded-2xl bg-[var(--color-bg)] p-4 flex items-start gap-2">
        <Sparkles size={18} className="text-[var(--color-primary)] shrink-0 mt-0.5" />
        <p className="text-sm text-[var(--color-navy)]">
          {profile
            ? `${profile.age}세 기준으로 분석했을 때, `
            : '내 상황 정보가 없어 일반 기준으로 분석했어요. '}
          <span className="font-semibold text-[var(--color-primary)]">{recommendedName}</span> 조건이 가장 유리해요.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {kPassVariants.map((v) => {
          const isRecommended = v.name === recommendedName;
          return (
            <div
              key={v.name}
              className={`rounded-2xl border p-4 ${
                isRecommended
                  ? 'border-[var(--color-primary)] bg-blue-50/50'
                  : 'border-[var(--color-border)]'
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="font-bold text-[var(--color-navy)]">{v.name}</p>
                {isRecommended && (
                  <span className="text-xs font-semibold text-white bg-[var(--color-primary)] rounded-full px-2.5 py-1">
                    AI 추천
                  </span>
                )}
              </div>
              <p className="text-xs text-[var(--color-muted)] mt-1">{v.condition}</p>
              <div className="flex items-center justify-between mt-3 text-sm">
                <span className="text-[var(--color-navy)]/80">{v.benefitDetail}</span>
                <span className="font-bold text-[var(--color-accent)]">{v.refundRate}</span>
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={() => navigate(`/benefits/${benefit.id}`)}
        className="w-full rounded-xl border border-[var(--color-border)] py-3 text-sm font-semibold text-[var(--color-navy)]"
      >
        혜택 상세로 돌아가기
      </button>
      </div>
    </div>
  );
}
