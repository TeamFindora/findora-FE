import { Link } from 'react-router-dom'
import './Login.css'

const Login = () => {
  return (
    <div className="login-container">
      <div className="login-form">
        <h2>로그인</h2>
        <form>
          <div className="form-group">
            <label htmlFor="email">이메일</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              placeholder="이메일을 입력하세요"
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
              required 
            />
          </div>
          <button type="submit" className="login-button">
            로그인
          </button>
        </form>
        <div className="login-links">
          <Link to="/signup">회원가입</Link>
          <span>|</span>
          <Link to="/">홈으로 돌아가기</Link>
        </div>
      </div>
    </div>
  )
}

export default Login 