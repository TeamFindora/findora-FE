import { Link } from 'react-router-dom'
import './SignUp.css'

const SignUp = () => {
  return (
    <div className="signup-container">
      <div className="signup-form">
        <h2>회원가입</h2>
        <form>
          <div className="form-group">
            <label htmlFor="name">이름</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              placeholder="이름을 입력하세요"
              required 
            />
          </div>
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
          <div className="form-group">
            <label htmlFor="confirmPassword">비밀번호 확인</label>
            <input 
              type="password" 
              id="confirmPassword" 
              name="confirmPassword" 
              placeholder="비밀번호를 다시 입력하세요"
              required 
            />
          </div>
          <button type="submit" className="signup-button">
            회원가입
          </button>
        </form>
        <div className="signup-links">
          <span>이미 계정이 있으신가요?</span>
          <Link to="/login">로그인</Link>
        </div>
      </div>
    </div>
  )
}

export default SignUp 