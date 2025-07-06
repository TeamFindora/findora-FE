import { Link } from 'react-router-dom'
import Nav from '../Nav'
import './Header.css'

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="text-white findora-title">
          Findora
        </Link>
        
        <Nav />
      </div>
    </header>
  )
}

export default Header 