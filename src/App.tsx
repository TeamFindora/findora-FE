import { Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Home, Login, SignUp, Profile, Admission, Research, Community, ResearchDetail } from './pages'
import DocumentEditor from './pages/DocumentEditor'
import { Header, Footer } from './components'
import MessageSidebar from './components/Messaging/MessageSidebar'
import ProtectedRoute from './components/ProtectedRoute'
import PostDetail from './pages/Community/PostDetail'
import WritePost from './pages/Community/WritePost'
import EditPost from './pages/Community/EditPost'
import FreeBoard from './pages/Community/FreeBoard'
import BestBoard from './pages/Community/BestBoard'
import BookmarkBoard from './pages/Community/BookmarkBoard'
import Verify from './pages/Admission/verify'
import AdmissionWrite from './pages/Admission/Write'
import AdminPage from './pages/AdminPage'
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
  const [isMessageSidebarOpen, setIsMessageSidebarOpen] = useState(false)

  // Nav에서 발생한 메시지 사이드바 열기 이벤트 수신
  useEffect(() => {
    const handleOpenMessageSidebar = () => {
      setIsMessageSidebarOpen(true)
    }

    window.addEventListener('open-message-sidebar', handleOpenMessageSidebar)
    return () => {
      window.removeEventListener('open-message-sidebar', handleOpenMessageSidebar)
    }
  }, [])

  const handleCloseMessageSidebar = () => {
    setIsMessageSidebarOpen(false)
  }

  return (
    <>
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

      {/* 입시관 인증 */}
      <Route 
        path="/admission/verify" 
        element={
          <Layout>
            <Verify />
          </Layout>
        } 
      />

      {/* 입시관 글쓰기 */}
      <Route 
        path="/admission/write" 
        element={
          <ProtectedRoute>
            <Layout>
              <AdmissionWrite />
            </Layout>
          </ProtectedRoute>
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

      {/* 커뮤니티 게시글 상세 */}
      <Route 
        path="/community/post/:id" 
        element={
          <Layout>
            <PostDetail />
          </Layout>
        } 
      />

      {/* 커뮤니티 글쓰기 */}
      <Route 
        path="/community/write" 
        element={
          <ProtectedRoute>
            <Layout>
              <WritePost />
            </Layout>
          </ProtectedRoute>
        } 
      />

      {/* 커뮤니티 게시글 수정 */}
      <Route 
        path="/community/edit/:id" 
        element={
          <ProtectedRoute>
            <Layout>
              <EditPost />
            </Layout>
          </ProtectedRoute>
        } 
      />

      {/* 자유 게시판 */}
      <Route 
        path="/community/free" 
        element={
          <Layout>
            <FreeBoard />
          </Layout>
        } 
      />

      {/* 베스트 게시판 */}
      <Route 
        path="/community/best" 
        element={
          <Layout>
            <BestBoard />
          </Layout>
        } 
      />

      {/* 북마크 게시판 */}
      <Route 
        path="/community/bookmark" 
        element={
          <ProtectedRoute>
            <Layout>
              <BookmarkBoard />
            </Layout>
          </ProtectedRoute>
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
      
      {/* 관리자 페이지 - 로그인 필요 */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute>
            <AdminPage />
          </ProtectedRoute>
        } 
      />

      {/* 문서 편집기 - Office Add-in용 */}
      <Route path="/document-editor" element={<DocumentEditor />} />
      
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
      
      {/* 메시지 사이드바 - 최상위 레벨에서 렌더링 */}
      <MessageSidebar 
        isOpen={isMessageSidebarOpen}
        onClose={handleCloseMessageSidebar}
      />
    </>
  )
}

export default App
