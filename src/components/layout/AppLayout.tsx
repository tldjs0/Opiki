import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { BottomNav } from './BottomNav';

export function AppLayout() {
  return (
    <div className="app-shell">
      <Header />
      <main className="flex-1 overflow-y-auto pb-4">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}

// 로그인/온보딩 등 하단 네비 없이 꽉 찬 화면이 필요한 경우 사용
export function BareLayout() {
  return (
    <div className="app-shell">
      <Outlet />
    </div>
  );
}
