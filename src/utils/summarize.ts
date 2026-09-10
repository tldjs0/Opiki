import type { Benefit } from '../types/benefit';

// TODO(백엔드 연동 시 교체): 현재는 목업 데이터를 규칙 기반으로 재구성해
// "AI 요약"처럼 보여주는 임시 로직입니다. 실제로는 BenefitSummary API
// (docs/planning/04_API_명세서.md 의 GET /benefits/{id}/summary)를 호출해야 합니다.
export interface SummarySection {
  label: string;
  value: string;
}

function formatEligibility(benefit: Benefit): string {
  const e = benefit.eligibility;
  const parts = [
    e.age && `연령-${e.age}`,
    e.region && `거주지역-${e.region}`,
    e.income && `소득-${e.income}`,
    e.education && `학력-${e.education}`,
    e.major && `전공-${e.major}`,
    e.employmentStatus && `취업상태-${e.employmentStatus}`,
    e.specialty && `특화분야-${e.specialty}`,
  ].filter(Boolean);
  return parts.join('\n');
}

export function buildSummarySections(benefit: Benefit): SummarySection[] {
  const sections: SummarySection[] = [];

  sections.push({
    label: '지원내용',
    value: benefit.content.split('\n')[0],
  });

  if (benefit.content.includes('\n')) {
    sections.push({
      label: '핵심 포인트',
      value: benefit.content.split('\n').slice(1).join('\n').trim(),
    });
  }

  sections.push({ label: '신청자격', value: formatEligibility(benefit) });

  if (benefit.applyUrl) {
    sections.push({ label: '신청 사이트', value: benefit.applyUrl });
  }
  if (benefit.requiredDocuments) {
    sections.push({ label: '제출 서류', value: benefit.requiredDocuments });
  }

  return sections;
}
