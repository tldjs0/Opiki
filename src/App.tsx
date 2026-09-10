import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout, BareLayout } from './components/layout/AppLayout';
import { SubPageLayout } from './components/layout/SubPageLayout';
import { Home } from './pages/Home';
import { BenefitDetail } from './pages/BenefitDetail';
import { BenefitCompare } from './pages/BenefitCompare';
import { Scrap } from './pages/Scrap';
import { CalendarPage } from './pages/Calendar';
import { Notifications } from './pages/Notifications';
import { AIChat } from './pages/AIChat';
import { RecentViews } from './pages/RecentViews';
import { Login } from './pages/Login';
import { Onboarding } from './pages/Onboarding';
import { Profile } from './pages/Profile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 홈만 공통 헤더(Opiki 로고 + 아이콘)를 사용 — Figma 기준 */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
        </Route>

        {/* 그 외 모든 화면은 "뒤로가기 + 타이틀" 상단바 + 하단 네비게이션 유지 */}
        <Route element={<SubPageLayout />}>
          <Route path="/benefits/:id" element={<BenefitDetail />} />
          <Route path="/benefits/:id/compare" element={<BenefitCompare />} />
          <Route path="/scraps" element={<Scrap />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/ai" element={<AIChat />} />
          <Route path="/recent" element={<RecentViews />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* 하단 네비게이션이 없는 화면 */}
        <Route element={<BareLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/onboarding" element={<Onboarding />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
