import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useUnreadMessageCount } from '../../hooks/messaging/useUnreadMessageCount'

interface UserDropdownProps {
  user: {
    nickname: string
  }
  onMessageClick: () => void
}

const UserDropdown = ({ user, onMessageClick }: UserDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { unreadCount } = useUnreadMessageCount()

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
        {/* 사용자 아바타 */}
        <div className="user-avatar">
          {user.nickname.charAt(0).toUpperCase()}
        </div>
        <span className="user-name">{user.nickname}</span>
        <svg 
          className={`dropdown-arrow ${isOpen ? 'open' : ''}`}
          width="12" 
          height="12" 
          viewBox="0 0 24 24" 
          fill="none"
        >
          <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      
      {isOpen && (
        <div className="dropdown-menu">
          <Link 
            to="/profile" 
            className="dropdown-item"
            onClick={() => setIsOpen(false)}
          >
            <svg className="dropdown-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
              <path d="M20 21C20 16.03 16.42 12 12 12S4 16.03 4 21" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span>내 프로필</span>
          </Link>
          <button 
            className="dropdown-item dropdown-button"
            onClick={handleMessageClick}
          >
            <svg className="dropdown-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7117 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.60573 8.7 3.9C9.87812 3.30493 11.1801 2.99656 12.5 3H13C15.0843 3.11499 17.053 3.99476 18.5291 5.47086C20.0052 6.94695 20.885 8.91565 21 11V11.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>쪽지함</span>
            {unreadCount > 0 && (
              <span className="message-count-badge">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      )}
    </div>
  )
}

export default UserDropdown