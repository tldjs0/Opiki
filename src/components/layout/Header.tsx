import { CalendarDays, Bell, CircleUserRound, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Header() {
  const navigate = useNavigate();
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white">
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-1 text-lg font-bold text-[var(--color-navy)]"
      >
        <Search size={20} className="text-[var(--color-primary)]" strokeWidth={2.5} />
        Opiki
      </button>
      <div className="flex items-center gap-3 text-[var(--color-navy)]">
        <button onClick={() => navigate('/calendar')} aria-label="캘린더">
          <CalendarDays size={22} />
        </button>
        <button onClick={() => navigate('/notifications')} aria-label="알림">
          <Bell size={22} />
        </button>
        <button onClick={() => navigate('/profile')} aria-label="프로필">
          <CircleUserRound size={22} />
        </button>
      </div>
    </header>
  );
}
