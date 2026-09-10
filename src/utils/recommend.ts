import type { Benefit } from '../types/benefit';
import type { UserProfile } from '../types/user';

// TODO(백엔드 연동 시 교체): 실제로는 AI가 사용자 정보 전체를 바탕으로 분석해야 합니다.
// 지금은 데모용으로 거주지역 하나만 보고 규칙 기반으로 추천합니다.
export function recommendFromGroup(
  benefits: Benefit[],
  profile: UserProfile | null,
): { recommended: Benefit; reason: string } | null {
  if (benefits.length < 2) return null;

  const seoulBenefit = benefits.find((b) => b.eligibility.region?.includes('서울'));
  const nationalBenefit = benefits.find((b) => !b.eligibility.region);

  if (profile?.region?.includes('서울') && seoulBenefit) {
    return {
      recommended: seoulBenefit,
      reason: `${profile.region}에 거주 중이라 지역 한정 혜택인 '${seoulBenefit.title}'이 유리해요.`,
    };
  }

  if (nationalBenefit) {
    return {
      recommended: nationalBenefit,
      reason: `거주지 제한이 없는 '${nationalBenefit.title}'을 더 많은 분들이 신청할 수 있어요.`,
    };
  }

  return { recommended: benefits[0], reason: '두 혜택의 조건을 비교해 보시고 선택해 주세요.' };
}
