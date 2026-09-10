import { useParams } from 'react-router-dom';
import { ComingSoon } from '../components/ui/ComingSoon';
export function BenefitDetail() {
  const { id } = useParams();
  return <ComingSoon title="혜택 상세" description={`상세/요약 토글, 비교하기 화면입니다. (id: ${id})`} />;
}
