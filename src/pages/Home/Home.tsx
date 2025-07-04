import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { isAuthenticated, getCurrentUser } from '../../api'
import './Home.css'

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const checkAuthStatus = () => {
      const loggedIn = isAuthenticated()
      setIsLoggedIn(loggedIn)
      
      if (loggedIn) {
        const currentUser = getCurrentUser()
        setUser(currentUser)
      } else {
        setUser(null)
      }
    }
    
    // 페이지 로드 시 확인
    checkAuthStatus()
    
    // 로그인/로그아웃 상태 변경 감지
    const handleAuthChange = () => {
      checkAuthStatus()
    }
    
    window.addEventListener('auth-change', handleAuthChange)
    
    return () => {
      window.removeEventListener('auth-change', handleAuthChange)
    }
  }, [])

  return (
    <div className="home-container">
      <div className="home-content">
        <h1>Welcome to Findora</h1>
        <p>findora에 오신 것을 환영합니다</p>
        
        {isLoggedIn && user ? (
          <div className="user-section">
            <div className="welcome-message">
              <h2>안녕하세요, {user.nickname}님! 👋</h2>
              <p>오늘도 좋은 하루 보내세요!</p>
            </div>
            
            <div className="user-actions">
              <Link to="/profile" className="action-button primary">
                내 프로필 보기
              </Link>
              <Link to="/community" className="action-button secondary">
                커뮤니티 둘러보기
              </Link>
            </div>
          </div>
        ) : (
          <div className="guest-section">
            <div className="welcome-message">
              <h2>Findora와 함께 시작해보세요! 🚀</h2>
              <p>회원가입하고 다양한 서비스를 이용해보세요</p>
            </div>
            
            <div className="guest-actions">
              <Link to="/login" className="action-button primary">
                로그인
              </Link>
              <Link to="/signup" className="action-button secondary">
                회원가입
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home 