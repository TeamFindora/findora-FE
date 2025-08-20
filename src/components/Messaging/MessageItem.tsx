import { useState } from 'react'
import { MessageThread } from '../../hooks/messaging/useOptimizedMessages'

interface MessageItemProps {
  thread: MessageThread
  onClick: () => void
  onDelete: () => void
}

const MessageItem = ({ thread, onClick, onDelete }: MessageItemProps) => {
  const [showDeleteMenu, setShowDeleteMenu] = useState(false)

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 1) return '방금 전'
    if (minutes < 60) return `${minutes}분 전`
    if (hours < 24) return `${hours}시간 전`
    if (days < 7) return `${days}일 전`
    
    return date.toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric'
    })
  }

  const truncateMessage = (message: string, maxLength: number = 50) => {
    if (message.length <= maxLength) return message
    return message.substring(0, maxLength) + '...'
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowDeleteMenu(!showDeleteMenu)
  }

  const handleConfirmDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete()
    setShowDeleteMenu(false)
  }

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowDeleteMenu(false)
  }

  return (
    <div 
      className={`message-item ${thread.unreadCount > 0 ? 'unread' : ''}`}
      onClick={onClick}
    >
      <div className="message-item-content">
        {/* 사용자 정보 */}
        <div className="message-item-header">
          <div className="user-info">
            <div className="user-avatar">
              {thread.otherUser.nickname.charAt(0)}
            </div>
            <div className="user-details">
              <h4 className="user-name">
                {thread.otherUser.nickname}
                {thread.unreadCount > 0 && (
                  <span className="unread-dot"></span>
                )}
              </h4>
              <p className="message-time">
                {formatTime(thread.lastMessage.createdAt)}
              </p>
            </div>
          </div>
          
          {/* 액션 버튼 */}
          <div className="message-actions">
            {thread.unreadCount > 0 && (
              <span className="unread-count">{thread.unreadCount}</span>
            )}
            <button 
              className="delete-button"
              onClick={handleDeleteClick}
              title="삭제"
            >
              ⋯
            </button>
          </div>
        </div>

        {/* 마지막 메시지 */}
        <div className="last-message">
          <p className="message-content">
            {truncateMessage(thread.lastMessage.content)}
          </p>
        </div>
      </div>

      {/* 삭제 확인 메뉴 */}
      {showDeleteMenu && (
        <div className="delete-menu">
          <p className="delete-confirm-text">이 대화를 삭제하시겠습니까?</p>
          <div className="delete-actions">
            <button 
              className="confirm-delete"
              onClick={handleConfirmDelete}
            >
              삭제
            </button>
            <button 
              className="cancel-delete"
              onClick={handleCancelDelete}
            >
              취소
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default MessageItem