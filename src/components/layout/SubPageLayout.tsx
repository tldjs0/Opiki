import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';

// 혜택 상세처럼 화면 자체 상단바(뒤로가기 등)를 갖는 서브 페이지용 레이아웃.
// 공통 Header 없이 BottomNav만 유지합니다.
export function SubPageLayout() {
  return (
    <div className="app-shell">
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
