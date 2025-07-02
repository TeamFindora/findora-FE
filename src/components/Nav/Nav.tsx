import { Link, useLocation } from 'react-router-dom'
import './Nav.css'

const Nav = () => {
  const location = useLocation()
  
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
      </ul>
    </nav>
  )
}

export default Nav 