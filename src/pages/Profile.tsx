import { ChevronRight, Settings, Star, UserCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { SubPageHeader } from '../components/layout/SubPageHeader';

function shortStatusLabel(educationStatus: string) {
  if (educationStatus.includes('대학교')) return '대학생';
  if (educationStatus.includes('고등학교')) return '고등학생';
  if (educationStatus.includes('대학원')) return '대학원생';
  return educationStatus || '정보 미입력';
}

export function Profile() {
  const navigate = useNavigate();
  const { isLoggedIn, profile, logout } = useAuthStore();

  if (!isLoggedIn || !profile) {
    return (
      <div className="flex flex-col">
        <SubPageHeader title="프로필" />
        <div className="flex flex-col items-center justify-center gap-3 px-6 py-24 text-center">
          <UserCircle2 size={48} className="text-[var(--color-border)]" />
          <p className="font-bold text-[var(--color-navy)]">로그인이 필요해요</p>
          <p className="text-sm text-[var(--color-muted)]">
            로그인하면 맞춤 추천과 스크랩 기능을 이용할 수 있어요.
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
      <SubPageHeader title="프로필" />
      <div className="px-4 pb-10 flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="h-14 w-14 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-mint)] flex items-center justify-center">
          <UserCircle2 size={32} className="text-white" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-[var(--color-navy)]">{profile.nickname} 님</p>
          <p className="text-xs text-[var(--color-muted)]">{shortStatusLabel(profile.educationStatus)}</p>
        </div>
        <button aria-label="설정" className="text-[var(--color-muted)]">
          <Settings size={20} />
        </button>
      </div>

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
          <SummaryRow label="나이" value={`${profile.age}세`} />
          <SummaryRow label="거주지역" value={profile.region || '-'} />
          <SummaryRow label="소득 기준" value={profile.incomeLevel || '-'} />
          <SummaryRow label="학력" value={profile.educationStatus || '-'} />
          <SummaryRow label="전공" value={profile.major || '-'} />
          <SummaryRow label="취업상태" value={profile.employmentStatus || '-'} />
          <SummaryRow label="특화분야" value={profile.specialty || '-'} />
        </dl>
      </div>

      <div className="rounded-2xl border border-[var(--color-border)] divide-y divide-[var(--color-border)]">
        <MenuRow
          icon={<UserCircle2 size={20} className="text-[var(--color-primary)]" />}
          title="내 정보"
          description="내 상황 정보 관리하기"
          onClick={() => navigate('/onboarding')}
        />
        <MenuRow
          icon={<Star size={20} className="text-[var(--color-primary)]" />}
          title="추천 기준"
          description="혜택 추천 기준 관리하기"
          onClick={() => navigate('/scraps')}
        />
      </div>

      <button
        onClick={() => {
          logout();
          navigate('/');
        }}
        className="w-full rounded-xl bg-[var(--color-accent)] py-3 text-white font-bold"
      >
        로그아웃
      </button>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <>
      <dt className="text-[var(--color-muted)]">{label}</dt>
      <dd className="text-[var(--color-navy)] font-medium">{value}</dd>
    </>
  );
}

function MenuRow({
  icon,
  title,
  description,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-3 px-4 py-3.5 text-left">
      {icon}
      <div className="flex-1">
        <p className="text-sm font-semibold text-[var(--color-navy)]">{title}</p>
        <p className="text-xs text-[var(--color-muted)]">{description}</p>
      </div>
      <ChevronRight size={18} className="text-[var(--color-muted)]" />
    </button>
  );
}
