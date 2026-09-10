export type BenefitCategory =
  | '장학금'
  | '주거'
  | '생활비'
  | '교육'
  | '취업·창업';

export type BenefitStatus = 'ongoing' | 'urgent' | 'always' | 'closed';

export interface Benefit {
  id: string;
  title: string;
  summary: string; // 카드용 한 줄 설명 (예: "월 최대 3만 원 x 36개월 지원")
  category: BenefitCategory;
  status: BenefitStatus;
  dDay?: number; // status가 'urgent' | 'ongoing' 일 때 사용, 없으면 상시/마감
  applyStartDate: string; // YYYY-MM-DD
  applyEndDate: string; // YYYY-MM-DD
  organization: string;
  policyNumber?: string;
  content: string; // 원문 상세 지원내용
  eligibility: {
    age?: string;
    region?: string;
    income?: string;
    education?: string;
    major?: string;
    employmentStatus?: string;
    specialty?: string;
    note?: string;
  };
  applyMethod?: string;
  applyUrl?: string;
  requiredDocuments?: string;
  viewCount: number;
  comparisonGroupId?: string; // 중복 지원 불가 혜택 그룹
  hasVariants?: boolean; // K패스처럼 조건별 방식이 갈리는 경우
}

export interface BenefitSummaryAI {
  benefitId: string;
  summaryText: string; // AI 요약 (섹션별로 정리된 텍스트)
}
