# OAuth2 React Demo

Google OAuth2 인증을 구현한 React + Vite 프론트엔드 애플리케이션입니다. JWT 토큰 관리, 자동 갱신, 그리고 사용자 정보 관리 기능을 포함하고 있습니다.

## 📋 목차

- [프로젝트 개요](#프로젝트-개요)
- [기술 스택](#기술-스택)
- [설치 및 실행](#설치-및-실행)
- [프로젝트 구조](#프로젝트-구조)
- [주요 기능](#주요-기능)
- [페이지 설명](#페이지-설명)
- [인증 플로우](#인증-플로우)
- [핵심 구현](#핵심-구현)
- [환경 설정](#환경-설정)
- [커스터마이징 가이드](#커스터마이징-가이드)

## 🎯 프로젝트 개요

이 프로젝트는 다음과 같은 기능을 제공합니다:

- ✅ Google OAuth2 소셜 로그인
- ✅ JWT 토큰 기반 인증
- ✅ 자동 토큰 갱신
- ✅ 사용자 정보 관리
- ✅ 권한 기반 접근 제어 (PREUSER 권한 테스트)
- ✅ 반응형 UI 디자인
- ✅ 로그인 상태 표시

## 🛠 기술 스택

- **React 18** - UI 라이브러리
- **Vite** - 빌드 도구 및 개발 서버
- **React Router** - 클라이언트 사이드 라우팅
- **Fetch API** - HTTP 통신
- **CSS3** - 스타일링 (모던 CSS, 그라데이션, 애니메이션)
- **ESLint** - 코드 품질 관리

## 🚀 설치 및 실행

### 1. 프로젝트 클론
```bash
git clone <repository-url>
cd Google_Oauth2_React_Demo
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경 변수 설정
프로젝트 루트에 `.env` 파일을 생성하세요:

```env
VITE_BACKEND_API_BASE_URL=http://localhost:8080
```

### 4. 개발 서버 실행
```bash
npm run dev
```

개발 서버가 `http://localhost:5173`에서 실행됩니다.

### 5. 빌드 및 배포
```bash
# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

## 📁 프로젝트 구조

```
src/
├── App.jsx                    # 라우팅 설정
├── App.css                    # 글로벌 스타일
├── main.jsx                   # 엔트리 포인트
├── pages/
│   ├── MainPage.jsx          # 메인 페이지 (로그인 상태 표시)
│   ├── MainPage.css
│   ├── LoginPage.jsx         # 로그인 페이지 (OAuth2)
│   ├── LoginPage.css
│   └── CookiePage.jsx        # 토큰 관리 페이지
└── util/
    └── fetchUtil.js          # API 통신 유틸리티 (토큰 관리)
```

## ✨ 주요 기능

### 🔐 Google OAuth2 로그인
- Google 계정으로 간편하게 로그인
- 백엔드에서 OAuth2 인증 처리
- 성공 시 액세스 토큰과 리프레시 토큰 발급

### 🔑 JWT 토큰 관리
- `accessToken`: API 요청에 사용 (단기 유효)
- `refreshToken`: 액세스 토큰 갱신용 (장기 유효)
- localStorage에 저장

### 🔄 자동 토큰 갱신
- API 응답이 401 Unauthorized인 경우 자동으로 토큰 갱신
- 사용자 인지 없이 백그라운드에서 처리
- 갱신 실패 시 로그인 페이지로 리다이렉트

### 👤 사용자 정보 조회
- 로그인한 사용자의 정보 조회 및 관리
- 권한에 따른 맞춤 기능 제공

### 🔓 권한 기반 접근 제어
- PREUSER, USER 등 다양한 권한 레벨 지원
- 권한별 접근 가능한 기능 제한

## 📄 페이지 설명

### 1️⃣ 메인 페이지 (`/`)

**파일**: `src/pages/MainPage.jsx`

애플리케이션의 진입점입니다. 로그인 상태를 표시하고 로그인 페이지로의 진입을 안내합니다.

**주요 요소**:
- 로그인 상태 배지 (로그인됨/로그인 필요)
- Google 로그인 안내 카드
- 로그인 페이지로 이동하는 버튼
- 그라데이션 배경 디자인

**로그인 상태 확인**:
```javascript
const isLoggedIn = !!localStorage.getItem("accessToken");

// 렌더링
{isLoggedIn ? (
  <span className="status-badge logged-in">✓ 로그인됨</span>
) : (
  <span className="status-badge logged-out">✗ 로그인 필요</span>
)}
```

### 2️⃣ 로그인 페이지 (`/login`)

**파일**: `src/pages/LoginPage.jsx`

Google OAuth2 인증 및 사용자 관리 기능을 제공합니다.

**주요 기능**:

| 기능 | 설명 | 조건 |
|------|------|------|
| **Google 로그인** | OAuth2 인증 프로세스 시작 | 항상 표시 |
| **권한 테스트** | PREUSER 권한 검증 | 로그인 후만 표시 |
| **메인페이지로 이동** | 메인 페이지 이동 | 항상 표시 |
| **로그아웃** | 토큰 제거 및 로그아웃 | 로그인 후만 표시 |

**Google 로그인 구현**:
```javascript
const handleSocialLogin = (provider) => {
  window.location.href = `${BACKEND_API_BASE_URL}/oauth2/authorization/${provider}`
};

// 호출
<button onClick={() => handleSocialLogin("google")}>
  Google로 계속하기
</button>
```

**로그아웃 구현**:
```javascript
const handleLogout = async () => {
  await logout();
  navigate("/login");
};
```

### 3️⃣ 토큰 관리 페이지 (`/cookie`)

**파일**: `src/pages/CookiePage.jsx`

JWT 토큰 및 쿠키 정보를 확인할 수 있습니다.

## 📡 라우트 목록

| 경로 | 컴포넌트 | 설명 |
|------|---------|------|
| `/` | MainPage | 메인 페이지 (로그인 상태 표시) |
| `/login` | LoginPage | Google OAuth2 로그인 및 관리 |
| `/cookie` | CookiePage | 토큰 및 쿠키 정보 확인 |

## 🔐 인증 플로우

```
┌─────────────────────────────────────────────────────────┐
│ 1. 사용자가 로그인 페이지 방문                          │
└──────────────────┬──────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────┐
│ 2. Google 로그인 버튼 클릭                             │
└──────────────────┬──────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────┐
│ 3. 백엔드의 OAuth2 인증 엔드포인트로 리다이렉트        │
│    /oauth2/authorization/google                         │
└──────────────────┬──────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────┐
│ 4. Google 로그인 창에서 인증                           │
└──────────────────┬──────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────┐
│ 5. 백엔드에서 토큰 발급 후 리다이렉트 콜백            │
└──────────────────┬──────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────┐
│ 6. accessToken, refreshToken을 localStorage에 저장   │
└──────────────────┬──────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────┐
│ 7. 메인 페이지로 리다이렉트 (로그인 상태 표시)       │
└──────────────────┬──────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────┐
│ 8. API 요청 시 accessToken을 Authorization 헤더에 포함│
└──────────────────┬──────────────────────────────────────┘
                   ↓
        ┌──────────┴──────────┐
        ↓                     ↓
   ┌─────────┐         ┌──────────┐
   │ 성공    │         │ 401 응답 │
   └─────────┘         └────┬─────┘
        ↓                   ↓
   데이터 반환    ┌────────────────────┐
                 │ 9. 토큰 자동 갱신   │
                 └────────┬───────────┘
                          ↓
                 ┌────────────────────┐
                 │ 10. 요청 재시도    │
                 └────────────────────┘
```

## 🔧 핵심 구현

### 1. 토큰 관리 유틸리티

**파일**: `src/util/fetchUtil.js`

토큰 관리 및 API 통신을 담당하는 핵심 유틸리티입니다.

#### `fetchWithAccess(url, options)`

토큰을 포함하여 API 요청을 수행합니다.

**기능**:
- 자동으로 accessToken을 Authorization 헤더에 추가
- 401 응답 시 토큰 갱신 후 재요청
- 갱신 실패 시 로그인 페이지로 리다이렉트

**사용 예**:
```javascript
// 사용자 정보 조회
const response = await fetchWithAccess('/api/user/info', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
});

const data = await response.json();

// 데이터 변경
const response = await fetchWithAccess('/api/user/update', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'New Name',
    email: 'new@example.com'
  })
});
```

#### `refreshAccessToken()`

리프레시 토큰을 사용하여 새로운 액세스 토큰을 발급받습니다.

**사용 예**:
```javascript
const result = await refreshAccessToken();

if (!result) {
  // 갱신 실패 - 로그인 페이지로 리다이렉트
  window.location.href = '/login';
  return;
}

// 갱신 성공 - 새 토큰이 localStorage에 저장됨
console.log('Token refreshed successfully');
```

#### `logout()`

토큰을 제거하고 백엔드 로그아웃 엔드포인트를 호출합니다.

**사용 예**:
```javascript
const handleLogout = async () => {
  await logout();
  navigate("/login");
};
```

### 2. 라우팅 설정

**파일**: `src/App.jsx`

```javascript
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import CookiePage from "./pages/CookiePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cookie" element={<CookiePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

**라우트 추가 방법**:
```javascript
// 새로운 페이지 임포트
import NewPage from "./pages/NewPage";

// 라우트 추가
<Route path="/new-page" element={<NewPage />} />
```

### 3. 로그인 상태 관리

localStorage를 사용하여 간단하게 로그인 상태를 관리합니다.

```javascript
// 로그인 여부 확인
const isLoggedIn = !!localStorage.getItem("accessToken");

// 토큰 저장 (백엔드에서 리다이렉트 시 query 파라미터로 전달)
localStorage.setItem("accessToken", token);
localStorage.setItem("refreshToken", refreshToken);

// 토큰 조회
const accessToken = localStorage.getItem("accessToken");
const refreshToken = localStorage.getItem("refreshToken");

// 로그아웃
localStorage.removeItem("accessToken");
localStorage.removeItem("refreshToken");
```

## ⚙️ 환경 설정

### Vite 설정

**파일**: `vite.config.js`

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

### ESLint 설정

**파일**: `eslint.config.js`

코드 품질 관리를 위한 ESLint 규칙이 설정되어 있습니다:
- React 훅 규칙 적용
- React Fast Refresh 호환성
- 미사용 변수 제외 규칙 (대문자, 언더스코어)

### 환경 변수

**.env 파일**

```env
# 백엔드 API 서버 주소 (개발 환경)
VITE_BACKEND_API_BASE_URL=http://localhost:8080

# 프로덕션 환경
# VITE_BACKEND_API_BASE_URL=https://api.example.com
```

**코드에서 사용**:
```javascript
const BACKEND_API_BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL;

const response = await fetch(`${BACKEND_API_BASE_URL}/api/user/info`);
```

## 🎨 커스터마이징 가이드

### 1. 다른 OAuth2 제공자 추가

**LoginPage.jsx**에서 `handleSocialLogin` 함수를 사용하면 다른 제공자도 추가할 수 있습니다:

```javascript
// Naver 로그인 추가 예
<button className="btn btn-naver" onClick={() => handleSocialLogin("naver")}>
  Naver로 로그인
</button>

// Kakao 로그인 추가 예
<button className="btn btn-kakao" onClick={() => handleSocialLogin("kakao")}>
  Kakao로 로그인
</button>
```

### 2. 로그인 페이지 커스터마이징

**LoginPage.jsx** 파일의 JSX 부분을 수정하여:
```javascript
// 섹션 추가
<div className="form-section">
  <h2>사용자명/비밀번호 로그인</h2>
  <input type="email" placeholder="이메일" />
  <input type="password" placeholder="비밀번호" />
  <button className="btn btn-login">로그인</button>
</div>
```

**LoginPage.css** 파일의 스타일을 수정하여:
```css
/* 색상 변경 */
.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* 새로운 버튼 스타일 추가 */
.btn-naver {
  background: #00C73C;
  color: white;
}

.btn-naver:hover {
  background: #00A72D;
  box-shadow: 0 5px 15px rgba(0, 199, 60, 0.4);
}
```

### 3. 메인 페이지 커스터마이징

**MainPage.jsx**에서:
```javascript
// 제목 변경
<h1>나만의 인증 서비스</h1>

// 설명 변경
<p className="subtitle">간편한 소셜 로그인으로 시작하세요.</p>

// 추가 카드 추가
<div className="card">
  <div className="card-header">
    <h2>토큰 정보</h2>
  </div>
  <div className="card-body">
    <p>저장된 JWT 토큰과 쿠키 정보를 확인하세요.</p>
  </div>
  <button className="card-button" onClick={() => navigate('/cookie')}>
    토큰 정보 페이지로 이동
  </button>
</div>
```

### 4. 색상 스키마 변경

**MainPage.css** 및 **LoginPage.css**에서 그라데이션 색상 변경:

```css
/* 기존 색상 */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* 변경 예1: 파란색 그라데이션 */
background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);

/* 변경 예2: 핑크 그라데이션 */
background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);

/* 변경 예3: 초록색 그라데이션 */
background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
```

### 5. 새로운 페이지 추가

**Step 1**: `src/pages/` 디렉토리에 새 파일 생성
```javascript
// src/pages/SettingsPage.jsx
import { useNavigate } from "react-router-dom";
import './SettingsPage.css';

function SettingsPage() {
  const navigate = useNavigate();

  return (
    <div className="settings-container">
      <h1>설정</h1>
      <button onClick={() => navigate("/")}>
        메인페이지로 이동
      </button>
    </div>
  );
}

export default SettingsPage;
```

**Step 2**: **App.jsx**에서 라우트 추가
```javascript
import SettingsPage from "./pages/SettingsPage";

<Route path="/settings" element={<SettingsPage />} />
```

**Step 3**: 필요한 스타일 작성
```css
/* src/pages/SettingsPage.css */
.settings-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}
```

### 6. API 엔드포인트 커스터마이징

**src/util/fetchUtil.js**에서 백엔드 엔드포인트 주소 수정:

```javascript
// 로그아웃 엔드포인트
const logoutResponse = await fetch(`${BACKEND_API_BASE_URL}/logout`, {
  method: 'POST'
});

// 토큰 갱신 엔드포인트
const refreshResponse = await fetch(`${BACKEND_API_BASE_URL}/api/auth/refresh`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    refreshToken: refreshToken
  })
});
```

## 📋 API 요청 가이드

### Authorization 헤더 포함 요청

```javascript
import { fetchWithAccess } from './util/fetchUtil';

// GET 요청
const response = await fetchWithAccess('/api/user/info', {
  method: 'GET'
});

// POST 요청 (데이터 전송)
const response = await fetchWithAccess('/api/user/update', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'New Name',
    email: 'new@example.com'
  })
});

// 응답 처리
if (response.ok) {
  const data = await response.json();
  console.log('Success:', data);
} else {
  console.error('Error:', response.status);
}
```

### 직접 fetch 사용 (공개 API)

```javascript
const BACKEND_API_BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL;

// 공개 API (인증 불필요)
const response = await fetch(`${BACKEND_API_BASE_URL}/api/public`, {
  method: 'GET'
});

const data = await response.json();
```

## 🧪 테스트 및 디버깅

### localStorage 확인

브라우저 개발자 도구의 콘솔에서 다음 명령으로 토큰 확인:

```javascript
// 액세스 토큰 확인
console.log(localStorage.getItem('accessToken'));

// 리프레시 토큰 확인
console.log(localStorage.getItem('refreshToken'));

// 모든 localStorage 출력
console.table(localStorage);
```

### 네트워크 요청 확인

1. 브라우저 개발자 도구 열기 (**F12** 또는 **우클릭 → 검사**)
2. **Network** 탭 선택
3. API 요청 클릭하여 상세 정보 확인
4. **Headers** 섹션에서 Authorization 헤더 확인

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### PREUSER 권한 테스트

1. 로그인 페이지 방문
2. Google로 로그인
3. 로그인 페이지의 **"PREUSER 권한 테스트"** 버튼 클릭
4. 권한 검증 결과 확인

## 📝 체크리스트

새 프로젝트에 이 구조를 적용할 때 확인할 사항:

- [ ] `.env` 파일 생성 및 백엔드 URL 설정
- [ ] 백엔드 OAuth2 인증 엔드포인트 확인
- [ ] Google OAuth2 설정 완료 (Google Cloud Console)
- [ ] 토큰 갱신 엔드포인트 구현
- [ ] 로그아웃 엔드포인트 구현
- [ ] API 응답 형식에 맞게 `fetchUtil.js` 수정
- [ ] 필요한 추가 페이지 생성
- [ ] 스타일 커스터마이징
- [ ] 권한 레벨 정의 및 구현
- [ ] 로그인 콜백 URL 설정
- [ ] 테스트 및 배포 준비

## 🚨 주의사항

### 보안
- ⚠️ **localStorage 보안**: accessToken과 refreshToken은 localStorage에 저장됩니다. 프로덕션 환경에서는 httpOnly 쿠키 사용을 고려하세요
- ⚠️ **HTTPS 사용**: 프로덕션 환경에서는 반드시 HTTPS를 사용하세요
- ⚠️ **CORS 설정**: 백엔드에서 올바른 CORS 설정이 필요합니다
- ⚠️ **민감한 정보**: 토큰이나 개인 정보를 콘솔에 출력하지 마세요

### 성능
- 🎯 **불필요한 API 요청 최소화**: 캐싱 및 메모이제이션 활용
- 🎯 **토큰 갱신 로직 최적화**: 중복 요청 방지
- 🎯 **라우트 코드 스플리팅**: lazy loading 고려
- 🎯 **이미지 최적화**: webp 형식 사용

## 📚 참고 자료

- [React 공식 문서](https://react.dev)
- [Vite 공식 문서](https://vitejs.dev)
- [React Router 공식 문서](https://reactrouter.com)
- [OAuth 2.0 specification](https://tools.ietf.org/html/rfc6749)
- [JWT (JSON Web Tokens)](https://jwt.io)

## 📧 문의 및 지원

프로젝트에 대한 질문이나 개선 사항이 있으면 이슈를 등록해주세요.

---

**작성일**: 2026년 2월
**버전**: 1.0.0
**라이선스**: MIT
