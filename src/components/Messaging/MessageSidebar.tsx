import { useEffect, useState } from 'react'
import { useOptimizedMessages as useMessages } from '../../hooks/messaging/useOptimizedMessages'
import { useMessageCount } from '../../hooks/messaging/useMessageCount'
import { useUnreadMessageCount } from '../../hooks/messaging/useUnreadMessageCount'
import { isAuthenticated } from '../../api/auth'
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
    console.log('MessageSidebar - targetUserId 변경:', {
      targetUserId,
      authorNickname,
      threadsLength: threads.length,
      isOpen
    })
    
    if (targetUserId && isOpen) {
      console.log('MessageSidebar - 대상 사용자 스레드 처리 시작')
      
      // 스레드 로딩이 완료될 때까지 약간 대기
      const processTarget = () => {
        // 이미 해당 사용자와의 스레드가 있는지 확인
        const existingThread = threads.find(thread => 
          thread.otherUser.id === parseInt(targetUserId)
        )
        
        console.log('MessageSidebar - 기존 스레드 검색 결과:', existingThread)
        
        if (existingThread) {
          // 기존 스레드가 있으면 해당 스레드 선택
          console.log('MessageSidebar - 기존 스레드 선택:', existingThread.otherUser.nickname)
          selectThread(existingThread)
          setView('thread')
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
          console.log('MessageSidebar - 새 스레드 생성:', newThread.otherUser.nickname)
          selectThread(newThread)
          setView('thread')
        }
      }
      
      // 스레드가 로드되지 않았다면 잠시 후 다시 시도
      if (loading) {
        console.log('MessageSidebar - 스레드 로딩 중, 잠시 후 재시도')
        setTimeout(processTarget, 500)
      } else {
        processTarget()
      }
    }
  }, [targetUserId, threads, isOpen, authorNickname])

  // 사이드바가 열릴 때마다 상태 초기화
  useEffect(() => {
    if (isOpen) {
      setView('list')
      setSelectedThread(null)
    }
  }, [isOpen])

  // 토큰 변경 감지하여 메시지 새로고침
  useEffect(() => {
    if (isOpen && isAuthenticated()) {
      console.log('MessageSidebar - 토큰 변경 감지, 메시지 새로고침')
      // useMessages 훅의 refetch 함수가 있다면 호출
      // 현재는 useMessages 훅 자체가 토큰 변경을 감지하도록 수정됨
    }
  }, [isOpen, isAuthenticated()])

  const {
    remainingCount,
    loading: countLoading,
    error: countError,
    canSendMessage,
    refreshCount
  } = useMessageCount()

  const {
    refreshCount: refreshUnreadCount,
    decrementCount
  } = useUnreadMessageCount()

  // 읽음 처리 + 안읽은 메시지 개수 감소  
  const handleMarkAsRead = async (threadId: string) => {
    try {
      // 읽음 처리하기 전에 현재 스레드의 읽지 않은 메시지 개수 확인
      const thread = threads.find(t => t.id === threadId)
      const unreadCount = thread?.unreadCount || 0
      
      console.log('읽음 처리 시작:', { threadId, unreadCount })
      
      await markAsRead(threadId)
      
      // 읽음 처리 성공 시 해당 스레드의 읽지 않은 메시지 개수만큼 감소
      if (unreadCount > 0) {
        for (let i = 0; i < unreadCount; i++) {
          decrementCount()
        }
        console.log('드롭다운 카운트 감소 완료:', unreadCount, '개')
      }
    } catch (error) {
      console.error('읽음 처리 실패:', error)
      // 실패 시 서버에서 다시 조회하여 정확한 카운트 가져오기
      refreshUnreadCount()
    }
  }

  const handleThreadSelect = (thread: any) => {
    selectThread(thread)
    // 읽지 않은 메시지가 있는 경우에만 읽음 처리
    if (thread.unreadCount > 0) {
      handleMarkAsRead(thread.id)
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
                  ) : (
                    <span className={`remaining-count ${remainingCount === 0 ? 'count-zero' : remainingCount <= 5 ? 'count-low' : ''}`}>
                      남은 쪽지: {remainingCount}회
                    </span>
                  )}
                  {countError && (
                    <button 
                      className="retry-count-button" 
                      onClick={refreshCount}
                      title="쪽지 개수 새로고침"
                    >
                      🔄
                    </button>
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
              <p className="error-message">메시지를 불러올 수 없습니다</p>
              <button className="retry-button" onClick={() => window.location.reload()}>
                새로고침
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
              onMarkAsRead={handleMarkAsRead}
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