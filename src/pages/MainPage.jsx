import { useNavigate } from "react-router-dom";
import './MainPage.css';

/**
 * MainPage 컴포넌트
 *
 * 애플리케이션의 메인 진입점입니다.
 * - 현재 로그인 상태를 표시
 * - Google 로그인 페이지로의 진입을 안내
 * - 로그인 상태에 따라 다른 배지를 표시
 */
function MainPage() {
  // 페이지 이동을 위한 네비게이션 훅
  const navigate = useNavigate();

  // localStorage에서 accessToken 존재 여부를 확인하여 로그인 상태 판별
  // !!를 사용하여 boolean 값으로 변환 (true 또는 false)
  const isLoggedIn = !!localStorage.getItem("accessToken");

  return (
    <div className="main-container">
      <div className="main-content">
        {/* 페이지 제목 */}
        <h1>OAuth2 React Demo</h1>

        {/* 페이지 설명 */}
        <p className="subtitle">Google, Naver를 통한 소셜 로그인 및 인증 관리 서비스</p>

        {/* 로그인 상태 표시 섹션 */}
        <div className="login-status">
          {/* 삼항 연산자로 로그인 상태에 따라 다른 배지 표시 */}
          {isLoggedIn ? (
            <span className="status-badge logged-in">✓ 로그인됨</span>
          ) : (
            <span className="status-badge logged-out">✗ 로그인 필요</span>
          )}
        </div>

        {/* 기능 카드들을 감싸는 컨테이너 */}
        <div className="cards-container">
          {/* 로그인 페이지로의 진입 카드 */}
          <div className="card">
            <div className="card-header">
              <h2>로그인</h2>
            </div>
            <div className="card-body">
              <p>
                Google 소셜 로그인으로
                <br />
                간편하게 로그인하세요.
              </p>
            </div>
            {/* 로그인 페이지로 이동하는 버튼 */}
            <button
              className="card-button"
              onClick={() => navigate('/login')}
            >
              로그인 페이지로 이동
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
