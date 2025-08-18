# Findora FE

대학생을 위한 종합 플랫폼 Findora의 프론트엔드 프로젝트입니다.

## 🎯 프로젝트 소개

Findora는 대학생들이 연구실 정보, 교수 평가, 커뮤니티 활동, 입시 정보를 한 곳에서 찾을 수 있는 종합 플랫폼입니다.

## 🚀 기술 스택

### Frontend
- **React 19** - 최신 React 버전으로 성능 최적화
- **TypeScript** - 타입 안정성과 개발 생산성 향상
- **Vite** - 빠른 빌드 도구 및 개발 서버
- **TailwindCSS** - 유틸리티 우선 CSS 프레임워크
- **React Router v6** - 클라이언트 사이드 라우팅

### 개발 도구
- **ESLint** - 코드 품질 관리
- **PostCSS** - CSS 전처리
- **TypeScript** - 정적 타입 검사

## 📁 프로젝트 구조

```
findora-FE/
├── public/                 # 정적 파일
│   ├── findora_logo.png   # 로고 이미지
│   └── vite.svg           # Vite 아이콘
├── src/
│   ├── api/               # API 관련
│   │   ├── auth.ts        # 인증 API
│   │   └── index.ts       # API 통합
│   ├── components/        # 재사용 가능한 컴포넌트
│   │   ├── Header/        # 헤더 컴포넌트
│   │   ├── Nav/           # 네비게이션 바
│   │   ├── Footer/        # 푸터 컴포넌트
│   │   ├── ProtectedRoute.tsx  # 보호된 라우트
│   │   └── index.ts       # 컴포넌트 통합 export
│   ├── pages/             # 페이지 컴포넌트
│   │   ├── Home/          # 홈페이지
│   │   ├── Login/         # 로그인 페이지
│   │   ├── SignUp/        # 회원가입 페이지
│   │   ├── Profile/       # 프로필 페이지
│   │   ├── Research/      # 연구실/교수평가
│   │   ├── Community/     # 커뮤니티
│   │   ├── Admission/     # 입시관
│   │   └── index.ts       # 페이지 통합 export
│   ├── App.tsx            # 메인 앱 컴포넌트 (라우터 설정)
│   ├── main.tsx           # 앱 진입점
│   ├── index.css          # 글로벌 스타일
│   └── App.css            # 앱 레이아웃 스타일
├── package.json           # 프로젝트 의존성
├── tailwind.config.js     # Tailwind 설정
├── vite.config.ts         # Vite 설정
└── tsconfig.json          # TypeScript 설정
```

## 🎯 주요 기능

### ✅ 구현 완료
- **홈페이지** (`/`) - 메인 랜딩 페이지
- **로그인** (`/login`) - 사용자 로그인
- **회원가입** (`/signup`) - 신규 사용자 가입
- **프로필** (`/profile`) - 사용자 프로필 관리
- **네비게이션** - 반응형 헤더 및 네비게이션 바
- **보호된 라우트** - 인증이 필요한 페이지 보호

### 🚧 개발 중
- **연구실/교수평가** (`/research`) - 연구실 정보 및 교수 평가
- **커뮤니티** (`/community`) - 게시판 및 소통 공간
- **입시관** (`/admission`) - 입시 정보 및 관리

### 📋 예정 기능
- **사용자 인증 시스템** - JWT 기반 인증
- **API 연동** - 백엔드 서버와의 통신
- **상태 관리** - Redux/Zustand 도입
- **실시간 채팅** - 커뮤니티 내 실시간 소통
- **파일 업로드** - 이미지 및 문서 업로드

## 🎨 디자인 시스템

### 테마
- **다크 테마** - 어두운 배경 기반 UI
- **모던 디자인** - 블러 효과, 그라데이션, 부드러운 애니메이션
- **반응형 레이아웃** - 웹/태블릿/모바일 호환

### 색상 팔레트
- Primary: 파란색 계열 (#3B82F6)
- Secondary: 회색 계열 (#6B7280)
- Background: 다크 그레이 (#111827)
- Text: 화이트 (#FFFFFF)

### 컴포넌트
- **Header** - 브랜드 로고와 메인 네비게이션
- **Nav** - 독립적인 네비게이션 바
- **Footer** - 사이트 정보 및 링크
- **ProtectedRoute** - 인증이 필요한 페이지 보호

## 🛠️ 설치 및 실행

### 필수 요구사항
- **Node.js** 18.0.0 이상
- **npm** 9.0.0 이상 또는 **yarn** 1.22.0 이상

### 설치
```bash
# 저장소 클론
git clone https://github.com/[username]/findora-FE.git
cd findora-FE

# 의존성 설치
npm install
# 또는
yarn install
```

### 개발 서버 실행
```bash
npm run dev
# 또는
yarn dev
```
개발 서버가 `http://localhost:5173`에서 실행됩니다.

### 빌드
```bash
npm run build
# 또는
yarn build
```

### 프리뷰 (빌드된 앱 미리보기)
```bash
npm run preview
# 또는
yarn preview
```

### 코드 품질 검사
```bash
npm run lint
# 또는
yarn lint
```

## 🌐 라우터 구성

| 경로 | 컴포넌트 | 설명 | 상태 | 레이아웃 |
|------|----------|------|------|----------|
| `/` | Home | 홈페이지 | ✅ 완료 | Header + Footer |
| `/login` | Login | 로그인 | ✅ 완료 | 전체 화면 |
| `/signup` | SignUp | 회원가입 | ✅ 완료 | 전체 화면 |
| `/profile` | Profile | 프로필 | ✅ 완료 | Header + Footer |
| `/research` | Research | 연구실/교수평가 | 🚧 개발중 | Header + Footer |
| `/community` | Community | 커뮤니티 | 🚧 개발중 | Header + Footer |
| `/admission` | Admission | 입시관 | 🚧 개발중 | Header + Footer |

## 👥 팀 작업 가이드

### 브랜치 전략
- `main` - 배포용 메인 브랜치
- `develop` - 개발 통합 브랜치
- `feature/[기능명]` - 기능 개발 브랜치
- `fix/[버그명]` - 버그 수정 브랜치

### 커밋 컨벤션
```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅
refactor: 코드 리팩토링
test: 테스트 코드 추가
chore: 빌드 프로세스 또는 보조 도구 변경
```

### 페이지별 담당
- **홈페이지**: 전체 팀
- **인증 시스템**: 전체 팀
- **연구실/교수평가**: [담당자명]
- **커뮤니티**: [담당자명]
- **입시관**: [담당자명]

## 📋 개발 로드맵

### Phase 1: 기본 구조 ✅
- [x] 프로젝트 초기 설정
- [x] 라우터 구성
- [x] 기본 컴포넌트 구현
- [x] 인증 페이지 구현

### Phase 2: 핵심 기능 🚧
- [ ] 연구실/교수평가 페이지
- [ ] 커뮤니티 페이지
- [ ] 입시관 페이지
- [ ] API 연동

### Phase 3: 고급 기능 📋
- [ ] 상태 관리 도입
- [ ] 실시간 기능
- [ ] 파일 업로드
- [ ] 검색 기능

### Phase 4: 최적화 📋
- [ ] 성능 최적화
- [ ] SEO 개선
- [ ] 접근성 향상
- [ ] 테스트 코드 작성

## 🤝 기여 방법

1. **이슈 생성** - 작업할 내용을 이슈로 등록
2. **브랜치 생성** - `feature/[기능명]` 형태로 브랜치 생성
3. **개발** - 기능 구현 및 테스트
4. **커밋** - 커밋 컨벤션에 따라 커밋
5. **Pull Request** - PR 생성 및 코드 리뷰 요청
6. **병합** - 리뷰 승인 후 main 브랜치로 병합

## 🐛 문제 해결

### 자주 발생하는 문제
1. **포트 충돌**: 다른 프로세스가 5173 포트를 사용 중인 경우
   ```bash
   # 포트 확인
   netstat -ano | findstr :5173
   # 프로세스 종료 후 재시작
   ```

2. **의존성 문제**: node_modules 삭제 후 재설치
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

## 📞 연락처

- **프로젝트 관리자**: [이름]
- **기술 문의**: [이메일]
- **이슈 리포트**: GitHub Issues

---

**Findora FE Team** 🚀

*대학생을 위한 최고의 플랫폼을 만들어갑니다.*
