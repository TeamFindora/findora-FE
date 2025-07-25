import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { isAuthenticated, getCurrentUser, logout } from '../../api'
import './Nav.css'

const Nav = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    
    // 로그인/로그아웃 시 상태 업데이트를 위한 이벤트 리스너 추가
    const handleAuthChange = () => {
      checkAuthStatus()
    }
    
    window.addEventListener('auth-change', handleAuthChange)
    window.addEventListener('storage', handleAuthChange)
    
    return () => {
      window.removeEventListener('auth-change', handleAuthChange)
      window.removeEventListener('storage', handleAuthChange)
    }
  }, [location.pathname]) // 경로 변경 시에도 다시 확인
  
  const handleLogout = () => {
    logout()
    setIsLoggedIn(false)
    setUser(null)
    alert('로그아웃되었습니다.')
    
    // 로그아웃 후 상태 업데이트를 위한 커스텀 이벤트 발생
    window.dispatchEvent(new Event('auth-change'))
    
    navigate('/')
  }
  
  return (
    <nav className="nav">
      <ul className="nav-list">
        <li className="nav-item">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            홈
          </Link>
        </li>
        <li className="nav-item">
          <Link 
            to="/research" 
            className={`nav-link ${location.pathname.startsWith('/research') ? 'active' : ''}`}
          >
            연구실/교수평가
          </Link>
        </li>
        <li className="nav-item">
          <Link 
            to="/community" 
            className={`nav-link ${location.pathname.startsWith('/community') ? 'active' : ''}`}
          >
            커뮤니티
          </Link>
        </li>
        <li className="nav-item">
          <Link 
            to="/admission" 
            className={`nav-link ${location.pathname.startsWith('/admission') ? 'active' : ''}`}
          >
            입시관
          </Link>
        </li>
        
        {isLoggedIn && user ? (
          <>
            <li className="nav-item">
              <Link 
                to="/profile" 
                className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}
              >
                내 프로필
              </Link>
            </li>
            <li className="nav-item">
              <span className="nav-user">
                {user.nickname}님
              </span>
            </li>
            <li className="nav-item">
              <button 
                className="nav-link logout-button"
                onClick={handleLogout}
              >
                로그아웃
              </button>
            </li>
          </>
        ) : (
          <>
            <li className="nav-item">
              <Link 
                to="/login" 
                className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}
              >
                로그인
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/signup" 
                className={`nav-link ${location.pathname === '/signup' ? 'active' : ''}`}
              >
                회원가입
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  )
}

export default Nav 