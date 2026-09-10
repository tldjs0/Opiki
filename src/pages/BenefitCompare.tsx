import { useParams } from 'react-router-dom';
import { ComingSoon } from '../components/ui/ComingSoon';

// TODO: Step 3 이후 — AI 혜택 비교 추천 화면 (K패스 등 조건별 방식이 갈리는 혜택)
export function BenefitCompare() {
  const { id } = useParams();
  return (
    <ComingSoon
      title="AI 비교 추천"
      description={`조건별로 유리한 옵션을 분석해주는 화면입니다. (benefit id: ${id})`}
    />
  );
}
