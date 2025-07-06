import { Navigate } from 'react-router-dom'
import { isAuthenticated } from '../api'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isLoggedIn = isAuthenticated()
  
  if (!isLoggedIn) {
    // 로그인하지 않은 경우 로그인 페이지로 리디렉션
    alert('로그인이 필요한 페이지입니다.')
    return <Navigate to="/login" replace />
  }
  
  return <>{children}</>
}

export default ProtectedRoute 