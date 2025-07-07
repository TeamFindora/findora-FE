import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { login } from '../../api'
import './Login.css'

// 카카오 SDK 타입 선언
declare global {
  interface Window {
    Kakao: any;
  }
}

const Login = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })

  // 카카오 SDK 초기화
  useEffect(() => {
    const initKakao = () => {
      if (window.Kakao && !window.Kakao.isInitialized()) {
        window.Kakao.init('ea9605c21ee2189302c49a7bddddd198')
        console.log('카카오 SDK 초기화 완료')
      }
    }

    // SDK 로드 대기
    if (window.Kakao) {
      initKakao()
    } else {
      // SDK 로드 대기
      const checkKakao = setInterval(() => {
        if (window.Kakao) {
          initKakao()
          clearInterval(checkKakao)
        }
      }, 100)
    }
  }, [])

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

  // 카카오 로그인 처리
  const handleKakaoLogin = () => {
    console.log('카카오 로그인 버튼 클릭됨')
    console.log('window.Kakao:', window.Kakao)
    
    if (window.Kakao) {
      window.Kakao.Auth.login({
        success: function(authObj: any) {
          console.log('카카오 로그인 성공:', authObj)
          
          // 카카오 사용자 정보 가져오기
          window.Kakao.API.request({
            url: '/v2/user/me',
            success: function(res: any) {
              console.log('카카오 사용자 정보:', res)
              
              // 백엔드로 카카오 사용자 정보 전송
              handleKakaoAuth(res, authObj.access_token)
            },
            fail: function(error: any) {
              console.error('카카오 사용자 정보 요청 실패:', error)
              alert('카카오 로그인 중 오류가 발생했습니다.')
            }
          })
        },
        fail: function(err: any) {
          console.error('카카오 로그인 실패:', err)
          alert('카카오 로그인에 실패했습니다.')
        }
      })
    } else {
      alert('카카오 SDK를 불러올 수 없습니다.')
    }
  }

  // 백엔드로 카카오 인증 정보 전송
  const handleKakaoAuth = async (userInfo: any, accessToken: string) => {
    try {
      setLoading(true)
      
      // 백엔드 API 호출 (임시로 콘솔에 출력)
      console.log('백엔드로 전송할 데이터:', {
        kakaoId: userInfo.id,
        email: userInfo.kakao_account?.email,
        nickname: userInfo.properties?.nickname,
        accessToken: accessToken
      })

      // TODO: 실제 백엔드 API 호출
      // const response = await fetch('/api/auth/kakao', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     kakaoId: userInfo.id,
      //     email: userInfo.kakao_account?.email,
      //     nickname: userInfo.properties?.nickname,
      //     accessToken: accessToken
      //   })
      // })

      // 임시로 성공 처리
      alert('카카오 로그인 성공! (백엔드 연동 필요)')
      
    } catch (error) {
      console.error('카카오 인증 오류:', error)
      alert('카카오 로그인 중 오류가 발생했습니다.')
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
        
        <button 
          className="kakao-login-button"
          onClick={handleKakaoLogin}
          disabled={loading}
        >
          <span className="kakao-icon">💬</span>
          {loading ? '로그인 중...' : '카카오 로그인'}
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