import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useMessageCount } from '../../hooks/messaging/useMessageCount'

interface UserDropdownProps {
  user: {
    nickname: string
  }
  onMessageClick: () => void
}

const UserDropdown = ({ user, onMessageClick }: UserDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { remainingCount } = useMessageCount()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  const handleMessageClick = () => {
    onMessageClick()
    setIsOpen(false)
  }

  return (
    <div className="user-dropdown" ref={dropdownRef}>
      <button
        className="nav-user dropdown-trigger"
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {user.nickname}님
        <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>
      
      {isOpen && (
        <div className="dropdown-menu">
          <Link 
            to="/profile" 
            className="dropdown-item"
            onClick={() => setIsOpen(false)}
          >
            <span className="dropdown-icon">👤</span>
            내 프로필
          </Link>
          <button 
            className="dropdown-item dropdown-button"
            onClick={handleMessageClick}
          >
            <span className="dropdown-icon">💬</span>
            쪽지함
            {remainingCount > 0 && (
              <span className="message-count-badge">
                {remainingCount}
              </span>
            )}
          </button>
        </div>
      )}
    </div>
  )
}

export default UserDropdown