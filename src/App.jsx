import { BrowserRouter, Routes, Route } from "react-router-dom";

// 페이지 컴포넌트 임포트
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import CookiePage from "./pages/CookiePage";

// 글로벌 스타일
import './App.css'

/**
 * App 컴포넌트 - 루트 컴포넌트
 *
 * 애플리케이션의 라우팅을 관리합니다.
 * React Router를 사용하여 클라이언트 사이드 라우팅을 구현합니다.
 *
 * 라우트:
 * - "/" : 메인 페이지 (로그인 상태 표시)
 * - "/login" : 로그인 페이지 (Google OAuth2)
 * - "/cookie" : 토큰 관리 페이지
 */
function App() {
  return (
    // BrowserRouter: URL 변경에 따라 컴포넌트를 렌더링하도록 함
    <BrowserRouter>
      {/* Routes: 라우트 규칙들을 정의하는 컨테이너 */}
      <Routes>
        {/* 메인 페이지 라우트 */}
        <Route path="/" element={<MainPage />} />

        {/* 로그인 페이지 라우트 */}
        <Route path="/login" element={<LoginPage />} />

        {/* 토큰 관리 페이지 라우트 */}
        <Route path="/cookie" element={<CookiePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App