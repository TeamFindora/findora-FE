import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { login } from '../../api'
import './Login.css'

const Login = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })

  const handleClose = () => {
    navigate('/')
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.username.trim() || !formData.password.trim()) {
      alert('아이디와 비밀번호를 모두 입력해주세요.')
      return
    }

    setLoading(true)
    
    try {
      const result = await login(formData.username, formData.password)
      
      if (result.success) {
        alert(result.message)
        
        // 로그인 성공 후 상태 업데이트를 위한 커스텀 이벤트 발생
        window.dispatchEvent(new Event('auth-change'))
        
        navigate('/') // 로그인 성공 시 홈페이지로 이동
      } else {
        alert(result.message)
      }
    } catch (error) {
      alert('로그인 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-form">
        <div className="login-header">
          <h2>로그인</h2>
          <button className="close-button" onClick={handleClose}>
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">아이디</label>
            <input 
              type="text" 
              id="username" 
              name="username" 
              placeholder="아이디를 입력하세요"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              placeholder="비밀번호를 입력하세요"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              required 
            />
          </div>
          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>
        
        <div className="divider">
          <span>or</span>
        </div>
        
        <button className="kakao-login-button">
          <span className="kakao-icon">💬</span>
          카카오 로그인
        </button>
        
        <div className="login-links">
          <Link to="/signup">회원가입</Link>
          <Link to="/forgot-password">비밀번호찾기</Link>
        </div>
      </div>
    </div>
  )
}

export default Login 