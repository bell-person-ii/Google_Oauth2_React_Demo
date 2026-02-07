/**
 * 토큰 관리 및 API 통신 유틸리티 모듈
 *
 * JWT 기반 인증에서 다음 기능을 제공합니다:
 * - 액세스 토큰 갱신
 * - 자동 토큰 갱신을 포함한 API 요청
 * - 로그아웃 처리
 */

/**
 * 액세스 토큰을 갱신하는 함수
 *
 * 리프레시 토큰을 사용하여 새로운 액세스 토큰을 발급받습니다.
 * 이 함수는 기존 액세스 토큰이 만료되었을 때 호출됩니다.
 *
 * @returns {Promise<string>} 새로운 액세스 토큰
 * @throws {Error} 토큰 갱신 실패 시 에러 발생
 */
export async function refreshAccessToken() {
    // localStorage에서 리프레시 토큰을 조회합니다
    const refreshToken = localStorage.getItem("refreshToken");

    // 리프레시 토큰이 없으면 에러 발생
    if (!refreshToken) throw new Error("RefreshToken이 없습니다.");

    // 백엔드의 토큰 갱신 엔드포인트로 요청
    const response = await fetch(`${import.meta.env.VITE_BACKEND_API_BASE_URL}/jwt/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
    });

    // 응답이 실패한 경우 에러 발생
    if (!response.ok) throw new Error("AccessToken 갱신 실패");

    // 응답 데이터를 파싱합니다
    const data = await response.json();

    // 새로운 토큰들을 localStorage에 저장합니다
    localStorage.setItem("accessToken", data.data.accessToken);
    localStorage.setItem("refreshToken", data.data.refreshToken);

    // 새로운 액세스 토큰을 반환합니다
    return data.data.accessToken;
}

/**
 * 액세스 토큰을 포함한 API 요청 함수
 *
 * 자동으로 액세스 토큰을 Authorization 헤더에 추가하고,
 * 토큰이 만료되었을 때(401 응답) 자동으로 갱신 후 재요청합니다.
 *
 * @param {string} url - 요청할 API 엔드포인트
 * @param {object} options - fetch 요청 옵션 (method, headers, body 등)
 * @returns {Promise<Response>} fetch 응답 객체
 * @throws {Error} HTTP 오류 발생 시 에러 발생
 */
export async function fetchWithAccess(url, options = {}) {
    // localStorage에서 액세스 토큰을 조회합니다
    let accessToken = localStorage.getItem("accessToken");

    // 요청 옵션에 headers 속성이 없으면 생성합니다
    if (!options.headers) options.headers = {};

    // Authorization 헤더에 Bearer 토큰을 추가합니다
    options.headers["Authorization"] = `Bearer ${accessToken}`;

    // 첫 번째 요청을 진행합니다
    let response = await fetch(url, options);

    // 응답 상태가 401 (Unauthorized)인 경우 - 토큰이 만료됨
    if (response.status === 401) {
        try {
            // 새로운 액세스 토큰을 발급받습니다
            accessToken = await refreshAccessToken();

            // 새로운 토큰으로 Authorization 헤더를 업데이트합니다
            options.headers['Authorization'] = `Bearer ${accessToken}`;

            // 같은 요청을 다시 시도합니다
            response = await fetch(url, options);
        } catch (err) {
            // 토큰 갱신이 실패한 경우
            // 저장된 토큰을 모두 삭제하고 로그인 페이지로 리다이렉트합니다
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            location.href = '/login';
        }
    }

    // 응답이 실패한 경우 에러 발생
    if (!response.ok) {
        throw new Error(`HTTP 오류 : ${response.status}`);
    }

    // 성공한 응답을 반환합니다
    return response;
}

/**
 * 로그아웃 함수
 *
 * 백엔드 로그아웃 엔드포인트를 호출하고,
 * localStorage에 저장된 모든 토큰을 삭제합니다.
 */
export async function logout() {
    // localStorage에서 리프레시 토큰을 조회합니다
    const refreshToken = localStorage.getItem("refreshToken");

    try {
        // 백엔드의 로그아웃 엔드포인트로 요청합니다
        await fetch(`${import.meta.env.VITE_BACKEND_API_BASE_URL}/logout`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
        });
    } catch (err) {
        // 로그아웃 요청 실패 시에도 로컬 토큰은 삭제되어야 합니다
        console.error("로그아웃 요청 실패:", err);
    } finally {
        // 요청 성공 여부와 관계없이 항상 로컬 토큰을 삭제합니다
        // 이를 통해 사용자는 즉시 로그아웃 상태가 됩니다
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
    }
}