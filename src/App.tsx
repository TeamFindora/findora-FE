import { Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Home, Login, SignUp, Profile, Admission, Research, Community, ResearchDetail } from './pages'
import { Header, Footer } from './components'
import ProtectedRoute from './components/ProtectedRoute'
import PostDetail from './pages/Community/PostDetail'
import WritePost from './pages/Community/WritePost'
import EditPost from './pages/Community/EditPost'
import FreeBoard from './pages/Community/FreeBoard'
import BestBoard from './pages/Community/BestBoard'
import MessageSidebar from './components/Messaging/MessageSidebar'
import AdminPage from './pages/AdminPage'
import Verify from './pages/Admission/verify'
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
  const [messageTarget, setMessageTarget] = useState<{ userId?: string; nickname?: string }>({})

  // 쪽지 사이드바 열기 이벤트 리스너
  useEffect(() => {
    const handleOpenMessageSidebar = (event: any) => {
      const { userId, nickname } = event.detail || {}
      console.log('App.tsx - 쪽지 사이드바 이벤트 받음:', { userId, nickname })
      setMessageTarget({ userId, nickname })
      setIsMessageSidebarOpen(true)
    }

    const handleOpenMessageSidebarSimple = () => {
      setMessageTarget({})
      setIsMessageSidebarOpen(true)
    }

    window.addEventListener('open-message-sidebar-with-target', handleOpenMessageSidebar)
    window.addEventListener('open-message-sidebar', handleOpenMessageSidebarSimple)

    return () => {
      window.removeEventListener('open-message-sidebar-with-target', handleOpenMessageSidebar)
      window.removeEventListener('open-message-sidebar', handleOpenMessageSidebarSimple)
    }
  }, [])

  const closeMessageSidebar = () => {
    setIsMessageSidebarOpen(false)
    setMessageTarget({})
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
            <Layout>
              <AdminPage />
            </Layout>
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
    
    {/* 전역 쪽지 사이드바 */}
    <MessageSidebar
      isOpen={isMessageSidebarOpen}
      onClose={closeMessageSidebar}
      targetUserId={messageTarget.userId}
      authorNickname={messageTarget.nickname}
    />
    </>
  )
}

export default App
