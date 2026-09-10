import { Home, CalendarDays, Sparkles, History, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: '홈', icon: Home },
  { to: '/calendar', label: '일정', icon: CalendarDays },
  { to: '/ai', label: 'AI 추천', icon: Sparkles, isCenter: true },
  { to: '/recent', label: '기록', icon: History },
  { to: '/profile', label: '프로필', icon: User },
];

export function BottomNav() {
  return (
    <nav className="sticky bottom-0 left-0 right-0 z-20 bg-white border-t border-[var(--color-border)] flex items-center justify-around px-2 py-2">
      {navItems.map(({ to, label, icon: Icon, isCenter }) => (
        <NavLink
          key={to}
          to={to}
          className="flex flex-col items-center justify-center gap-1 flex-1 py-1"
        >
          {({ isActive }) =>
            isCenter ? (
              <span className="-mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-mint)] shadow-lg shadow-blue-200">
                <Icon size={24} className="text-white" />
              </span>
            ) : (
              <>
                <Icon
                  size={22}
                  className={isActive ? 'text-[var(--color-primary)]' : 'text-[var(--color-muted)]'}
                />
                <span
                  className={`text-[11px] ${isActive ? 'text-[var(--color-primary)] font-semibold' : 'text-[var(--color-muted)]'}`}
                >
                  {label}
                </span>
              </>
            )
          }
        </NavLink>
      ))}
    </nav>
  );
}
