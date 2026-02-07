import { useNavigate } from "react-router-dom";
import { logout } from "../util/fetchUtil";
import './LoginPage.css';

/**
 * Vite 환경 변수에서 백엔드 API 서버 주소를 가져옵니다.
 * .env 파일의 VITE_BACKEND_API_BASE_URL 값을 사용합니다.
 */
const BACKEND_API_BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL;

/**
 * LoginPage 컴포넌트
 *
 * Google OAuth2 로그인 및 사용자 관리 기능을 제공합니다.
 * - Google 소셜 로그인 진행
 * - 권한 테스트 (로그인 후에만 표시)
 * - 로그아웃 기능 (로그인 후에만 표시)
 * - 메인페이지로의 이동
 */
function LoginPage() {
    // 페이지 이동을 위한 네비게이션 훅
    const navigate = useNavigate();

    /**
     * Google OAuth2 소셜 로그인을 진행하는 핸들러
     * 백엔드의 OAuth2 인증 엔드포인트로 리다이렉트합니다.
     *
     * @param {string} provider - OAuth2 제공자 (예: 'google', 'naver')
     */
    const handleSocialLogin = (provider) => {
        // window.location.href를 사용하여 새 페이지로 리다이렉트
        // 이를 통해 백엔드의 OAuth2 인증 프로세스가 시작됩니다.
        window.location.href = `${BACKEND_API_BASE_URL}/oauth2/authorization/${provider}`
    };

    /**
     * 로그아웃을 처리하는 핸들러
     * 토큰을 제거하고 로그인 페이지로 리다이렉트합니다.
     */
    const handleLogout = async () => {
        // fetchUtil.js의 logout 함수를 호출하여 로그아웃 처리
        await logout();
        // 로그아웃 후 로그인 페이지로 이동
        navigate("/login");
    };

    /**
     * 메인페이지로 이동하는 핸들러
     */
    const handleGoToMain = () => {
        navigate("/");
    };

    /**
     * PREUSER 권한을 테스트하는 핸들러
     * 로그인된 사용자의 권한을 검증합니다.
     */
    const handleTestPreuser = async () => {
        // localStorage에서 액세스 토큰 조회
        const accessToken = localStorage.getItem("accessToken");

        // 액세스 토큰이 없으면 로그인 필요
        if (!accessToken) {
            alert("로그인이 필요합니다.");
            return;
        }

        try {
            // 백엔드의 권한 테스트 엔드포인트로 요청
            const response = await fetch(`${BACKEND_API_BASE_URL}/test/preuser-only`, {
                method: "GET",
                headers: {
                    // Authorization 헤더에 Bearer 토큰 추가
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            // 요청이 성공한 경우
            if (response.ok) {
                alert(data.data);
            } else {
                // 실패한 경우 에러 메시지 표시
                alert(`에러: ${data.message}`);
            }
        } catch (err) {
            // 네트워크 오류가 발생한 경우
            alert("서버와 통신할 수 없습니다.");
        }
    };

    // localStorage에서 accessToken 존재 여부를 확인하여 로그인 상태 판별
    const isLoggedIn = !!localStorage.getItem("accessToken");

    return (
        <div className="login-container">
            <div className="login-content">
                {/* 헤더: 제목과 로그인 상태 배지 */}
                <div className="login-header">
                    <h1>로그인</h1>
                    {/* 로그인된 경우에만 배지 표시 */}
                    {isLoggedIn && <span className="login-badge">✓ 로그인됨</span>}
                </div>

                {/* 로그인 폼 */}
                <div className="login-form">
                    {/* 소셜 로그인 섹션 */}
                    <div className="form-section">
                        <h2>소셜 로그인</h2>
                        {/* Google 로그인 버튼 */}
                        <button
                            className="btn btn-google"
                            onClick={() => handleSocialLogin("google")}
                        >
                            <span>Google로 계속하기</span>
                        </button>
                    </div>

                    {/* 권한 테스트 섹션 - 로그인된 경우에만 표시 */}
                    {isLoggedIn && (
                        <div className="form-section">
                            <h2>권한 테스트</h2>
                            <button
                                className="btn btn-secondary"
                                onClick={handleTestPreuser}
                            >
                                PREUSER 권한 테스트
                            </button>
                        </div>
                    )}

                    {/* 기타 기능 섹션 */}
                    <div className="form-section">
                        <h2>기타</h2>
                        <div className="button-group">
                            {/* 메인페이지로 이동 버튼 - 항상 표시 */}
                            <button
                                className="btn btn-primary"
                                onClick={handleGoToMain}
                            >
                                메인페이지로 이동
                            </button>
                            {/* 로그아웃 버튼 - 로그인된 경우에만 표시 */}
                            {isLoggedIn && (
                                <button
                                    className="btn btn-danger"
                                    onClick={handleLogout}
                                >
                                    로그아웃
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;