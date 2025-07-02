import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Findora</h3>
            <p>findora footer 어쩌구저쩌구</p>
          </div>
          
          <div className="footer-section">
            <h4>서비스</h4>
            <ul>
              <li><a href="#trading">거래</a></li>
              <li><a href="#wallet">지갑</a></li>
              <li><a href="#defi">DeFi</a></li>
              <li><a href="#staking">스테이킹</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>지원</h4>
            <ul>
              <li><a href="#help">도움말</a></li>
              <li><a href="#contact">문의하기</a></li>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#api">API 문서</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>회사</h4>
            <ul>
              <li><a href="#about">회사소개</a></li>
              <li><a href="#careers">채용</a></li>
              <li><a href="#news">뉴스</a></li>
              <li><a href="#blog">블로그</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-legal">
            <span>&copy; 2024 Findora. All rights reserved.</span>
            <div className="footer-links">
              <a href="#privacy">개인정보처리방침</a>
              <a href="#terms">이용약관</a>
              <a href="#cookies">쿠키정책</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer 