import { Link } from 'react-router-dom'
import './Home.css'

const Home = () => {
  return (
    <div className="home-container">
      <div className="home-content">
        <h1>Welcome to Findora</h1>
        <p>findora에 오신 것을 환영합니다 하하</p>
        <div className="home-buttons">
          <Link to="/login" className="btn btn-primary">로그인</Link>
          <Link to="/signup" className="btn btn-secondary">회원가입</Link>
        </div>
      </div>
    </div>
  )
}

export default Home 