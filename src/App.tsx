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
        {/* 상단 공통 헤더 + 하단 네비게이션이 있는 화면 */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/scraps" element={<Scrap />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/ai" element={<AIChat />} />
          <Route path="/recent" element={<RecentViews />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* 화면 자체 상단바(뒤로가기 등) + 하단 네비게이션만 있는 화면 */}
        <Route element={<SubPageLayout />}>
          <Route path="/benefits/:id" element={<BenefitDetail />} />
          <Route path="/benefits/:id/compare" element={<BenefitCompare />} />
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
