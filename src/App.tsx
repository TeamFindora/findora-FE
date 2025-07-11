import { Routes, Route } from 'react-router-dom'
import { Home, Login, SignUp, Profile, Admission, Research, Community, ResearchDetail } from './pages'
import { Header, Footer } from './components'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

// 헤더/푸터가 있는 레이아웃 컴포넌트
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </>
  )
}

function App() {
  return (
    <Routes>
      {/* 홈페이지 - 헤더/푸터 포함 */}
      <Route 
        path="/" 
        element={
          <Layout>
            <Home />
          </Layout>
        } 
      />

      {/* 입시관 */}
      <Route 
        path="/admission" 
        element={
          <Layout>
            <Admission />
          </Layout>
        } 
      />

      {/* 커뮤니티 */}
      <Route 
        path="/community" 
        element={
          <Layout>
            <Community />
          </Layout>
        } 
      />

      {/* 연구실/교수평가 */}
      <Route 
        path="/research" 
        element={
          <Layout>
            <Research />
          </Layout>
        } 
      />

      {/* 연구실/교수평가 - 디테일 화면 */}
      <Route 
        path="/research/detail" 
        element={
          <Layout>
            <ResearchDetail />
          </Layout>
        } 
      />
      
      {/* 로그인 - 전체 화면 */}
      <Route path="/login" element={<Login />} />
      
      {/* 회원가입 - 전체 화면 */}
      <Route path="/signup" element={<SignUp />} />
      
      {/* 프로필 - 로그인 필요 */}
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } 
      />
      
      {/* 404 페이지 */}
      <Route 
        path="*" 
        element={
          <Layout>
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <h2>404 - 페이지를 찾을 수 없습니다</h2>
              <a href="/" style={{ color: '#646cff' }}>홈으로 돌아가기</a>
            </div>
          </Layout>
        } 
      />
    </Routes>
  )
}

export default App
