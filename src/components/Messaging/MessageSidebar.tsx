import { useEffect, useState } from 'react'
import { useMessages } from '../../hooks/messaging/useMessages'
import { useMessageCount } from '../../hooks/messaging/useMessageCount'
import MessageList from './MessageList'
import MessageThread from './MessageThread'
import './MessageSidebar.css'
import './MessageComponents.css'

interface MessageSidebarProps {
  isOpen: boolean
  onClose: () => void
  targetUserId?: string // 특정 사용자와 대화를 시작할 때 사용
  authorNickname?: string // 작성자 닉네임
}

const MessageSidebar = ({ isOpen, onClose, targetUserId, authorNickname }: MessageSidebarProps) => {
  const [isClosing, setIsClosing] = useState(false)
  const [selectedThread, setSelectedThread] = useState<any>(null)
  const [view, setView] = useState<'list' | 'thread'>('list')
  
  const { 
    threads, 
    loading, 
    error, 
    sendMessage, 
    sendMessageDirectly,
    markAsRead, 
    deleteThread,
    getTotalUnreadCount 
  } = useMessages()
  
  const selectThread = (thread: any) => {
    setSelectedThread(thread)
    setView('thread')
  }

  const backToList = () => {
    setSelectedThread(null)
    setView('list')
  }

  // targetUserId가 제공된 경우 해당 사용자와의 스레드를 찾거나 새로 생성
  useEffect(() => {
    if (targetUserId && threads.length > 0 && isOpen) {
      // 이미 해당 사용자와의 스레드가 있는지 확인
      const existingThread = threads.find(thread => 
        thread.otherUser.id === parseInt(targetUserId)
      )
      
      if (existingThread) {
        // 기존 스레드가 있으면 해당 스레드 선택
        selectThread(existingThread)
      } else {
        // 기존 스레드가 없으면 새 스레드 생성
        const newThread = {
          id: `new-${targetUserId}`,
          otherUser: {
            id: parseInt(targetUserId),
            nickname: authorNickname || `사용자${targetUserId}`,
            email: ''
          },
          messages: [],
          lastMessage: null,
          lastMessageTime: new Date().toISOString(),
          unreadCount: 0,
          isNewConversation: true
        }
        selectThread(newThread)
      }
    }
  }, [targetUserId, threads, isOpen])

  // 사이드바가 열릴 때마다 상태 초기화
  useEffect(() => {
    if (isOpen && !targetUserId) {
      // targetUserId가 없으면 목록 뷰로 시작
      setView('list')
      setSelectedThread(null)
    }
  }, [isOpen, targetUserId])

  const {
    remainingCount,
    loading: countLoading,
    error: countError,
    canSendMessage,
    refreshCount
  } = useMessageCount()

  const handleThreadSelect = (thread: any) => {
    selectThread(thread)
    if (thread.unreadCount > 0) {
      markAsRead(thread.id)
    }
  }

  const handleSendMessage = async (receiverId: string, content: string) => {
    try {
      // useMessageReply에서 이미 권한 체크와 차감을 처리했으므로 직접 전송
      await sendMessageDirectly(receiverId, content)
      
      // 메시지 전송 성공 후 서버에서 실제 쪽지 개수 새로고침
      refreshCount()
    } catch (error) {
      console.error('메시지 전송 실패:', error)
      throw error
    }
  }

  const handleDeleteThread = async (threadId: string) => {
    if (window.confirm('이 대화를 삭제하시겠습니까?')) {
      await deleteThread(threadId)
      if (selectedThread?.id === threadId) {
        backToList()
      }
    }
  }


  // threads가 업데이트될 때 현재 선택된 스레드 동기화
  useEffect(() => {
    if (selectedThread && threads.length > 0) {
      const updatedThread = threads.find(t => t.id === selectedThread.id)
      if (updatedThread && JSON.stringify(updatedThread.messages) !== JSON.stringify(selectedThread.messages)) {
        selectThread(updatedThread)
      }
    }
  }, [threads])

  // 애니메이션과 함께 사이드바 닫기
  const handleClose = () => {
    setIsClosing(true)
    // 목록으로 돌아가기
    backToList()
    setTimeout(() => {
      setIsClosing(false)
      onClose()
    }, 300) // 애니메이션 시간과 맞춤
  }

  // 사이드바 열릴 때 배경 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      // 현재 스크롤 위치 저장
      const scrollY = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
      document.body.style.overflow = 'hidden'
      
      return () => {
        // 사이드바 닫힐 때 스크롤 복원
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.width = ''
        document.body.style.overflow = ''
        window.scrollTo(0, scrollY)
      }
    }
  }, [isOpen])

  // ESC 키로 사이드바 닫기
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen && !isClosing) {
        handleClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, isClosing])

  if (!isOpen) return null


  return (
    <>
      {/* 오버레이 */}
      <div 
        className={`message-sidebar-overlay ${isClosing ? 'closing' : ''}`} 
        onClick={handleClose}
      />
      
      {/* 사이드바 */}
      <div className={`message-sidebar ${isClosing ? 'closing' : ''}`}>
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
              <div className="header-title-container">
                <h3 className="header-title">
                  쪽지함
                  {getTotalUnreadCount() > 0 && (
                    <span className="unread-badge">
                      {getTotalUnreadCount()}
                    </span>
                  )}
                </h3>
                <div className="message-count-info">
                  {countLoading ? (
                    <span className="count-loading">⏳</span>
                  ) : countError ? (
                    <span className="count-error" title={countError}>❌</span>
                  ) : (
                    <span className={`remaining-count ${remainingCount === 0 ? 'count-zero' : remainingCount <= 5 ? 'count-low' : ''}`}>
                      남은 쪽지: {remainingCount}회
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
          <button 
            className="close-button"
            onClick={handleClose}
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
              canSendMessage={canSendMessage}
              remainingCount={remainingCount}
            />
          ) : null}
        </div>
      </div>
    </>
  )
}

export default MessageSidebar