import { useEffect } from 'react'
import { useMessages } from '../../hooks/messaging/useMessages'
import { useMessageSidebar } from '../../hooks/messaging/useMessageSidebar'
import MessageList from './MessageList'
import MessageThread from './MessageThread'
import './MessageSidebar.css'
import './MessageComponents.css'

interface MessageSidebarProps {
  isOpen: boolean
  onClose: () => void
}

const MessageSidebar = ({ isOpen, onClose }: MessageSidebarProps) => {
  const { 
    threads, 
    loading, 
    error, 
    sendMessage, 
    markAsRead, 
    deleteThread,
    getTotalUnreadCount 
  } = useMessages()
  
  const {
    selectedThread,
    view,
    selectThread,
    backToList
  } = useMessageSidebar()

  const handleThreadSelect = (thread: any) => {
    selectThread(thread)
    if (thread.unreadCount > 0) {
      markAsRead(thread.id)
    }
  }

  const handleSendMessage = async (receiverId: string, content: string) => {
    await sendMessage(receiverId, content)
  }

  const handleDeleteThread = async (threadId: string) => {
    if (window.confirm('이 대화를 삭제하시겠습니까?')) {
      await deleteThread(threadId)
      if (selectedThread?.id === threadId) {
        backToList()
      }
    }
  }

  // ESC 키로 사이드바 닫기
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <>
      {/* 오버레이 */}
      <div className="message-sidebar-overlay" onClick={onClose} />
      
      {/* 사이드바 */}
      <div className="message-sidebar">
        {/* 헤더 */}
        <div className="message-sidebar-header">
          <div className="header-content">
            {view === 'thread' && selectedThread ? (
              <>
                <button 
                  className="back-button"
                  onClick={backToList}
                  title="목록으로 돌아가기"
                >
                  ←
                </button>
                <h3 className="header-title">
                  {selectedThread.otherUser.nickname}
                </h3>
              </>
            ) : (
              <h3 className="header-title">
                쪽지함
                {getTotalUnreadCount() > 0 && (
                  <span className="unread-badge">
                    {getTotalUnreadCount()}
                  </span>
                )}
              </h3>
            )}
          </div>
          <button 
            className="close-button"
            onClick={onClose}
            title="닫기"
          >
            ✕
          </button>
        </div>

        {/* 콘텐츠 */}
        <div className="message-sidebar-content">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>메시지를 불러오는 중...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <p className="error-message">{error}</p>
              <button className="retry-button" onClick={() => window.location.reload()}>
                다시 시도
              </button>
            </div>
          ) : view === 'list' ? (
            <MessageList
              threads={threads}
              onThreadSelect={handleThreadSelect}
              onDeleteThread={handleDeleteThread}
            />
          ) : selectedThread ? (
            <MessageThread
              thread={selectedThread}
              onSendMessage={handleSendMessage}
              onBack={backToList}
            />
          ) : null}
        </div>
      </div>
    </>
  )
}

export default MessageSidebar