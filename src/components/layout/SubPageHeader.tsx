import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SubPageHeaderProps {
  title: string;
  right?: React.ReactNode;
}

// Figma 기준: 홈 화면을 제외한 대부분의 화면은 공통 Header(Opiki 로고) 대신
// "뒤로가기 + 가운데 정렬 타이틀" 상단바를 사용합니다.
export function SubPageHeader({ title, right }: SubPageHeaderProps) {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <button onClick={() => navigate(-1)} aria-label="뒤로가기">
        <ChevronLeft size={24} className="text-[var(--color-navy)]" />
      </button>
      <span className="font-bold text-[15px] text-[var(--color-navy)]">{title}</span>
      <div className="min-w-6">{right}</div>
    </div>
  );
}
