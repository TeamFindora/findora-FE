import { Routes, Route } from 'react-router-dom'
import { Home, Login, SignUp } from './pages'
import { Header, Footer } from './components'
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
      
      {/* 로그인 - 전체 화면 */}
      <Route path="/login" element={<Login />} />
      
      {/* 회원가입 - 전체 화면 */}
      <Route path="/signup" element={<SignUp />} />
      
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
