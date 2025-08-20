import { useEffect, useRef } from 'react'
import MessageReply from './MessageReply'
import { MessageThread as MessageThreadType, Message } from '../../hooks/messaging/useOptimizedMessages'
import { getCurrentUser } from '../../api/auth'

interface MessageThreadProps {
  thread: MessageThreadType
  onSendMessage: (receiverId: string, content: string) => Promise<void>
  onBack: () => void
  onMarkAsRead?: (threadId: string) => void
  canSendMessage?: boolean
  remainingCount?: number
}

const MessageThread = ({ thread, onSendMessage, onBack, onMarkAsRead, canSendMessage = true, remainingCount = 0 }: MessageThreadProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const currentUser = getCurrentUser()
  const currentUserId = currentUser?.userId

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [thread.messages])

  // 스레드가 열릴 때 읽지 않은 메시지들을 읽음 처리
  useEffect(() => {
    if (onMarkAsRead && thread.id && currentUserId) {
      // 읽지 않은 메시지가 있는지 확인
      const hasUnreadMessages = thread.messages.some(
        message => message.receiverId === currentUserId && !message.isRead
      )
      
      if (hasUnreadMessages) {
        // 약간의 지연을 두고 읽음 처리 (UX 향상)
        const timer = setTimeout(() => {
          onMarkAsRead(thread.id)
        }, 500)
        
        return () => clearTimeout(timer)
      }
    }
  }, [thread.id, thread.messages, currentUserId, onMarkAsRead])

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('ko-KR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }


  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [date: string]: Message[] } = {}
    
    messages.forEach(message => {
      const date = new Date(message.sentAt).toDateString()
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(message)
    })
    
    return groups
  }

  const formatDateHeader = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    if (date.toDateString() === today.toDateString()) {
      return '오늘'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return '어제'
    } else {
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
  }

  const messageGroups = groupMessagesByDate(thread.messages)
  const isNewThread = thread.messages.length === 0

  return (
    <div className="message-thread">
      {/* 메시지 목록 */}
      <div className="messages-container">
        {isNewThread ? (
          <div className="new-conversation-state">
            <div className="new-conversation-icon">💬</div>
            <h4 className="new-conversation-title">
              {thread.otherUser.nickname}님과의 첫 대화
            </h4>
            <p className="new-conversation-description">
              첫 메시지를 보내서 대화를 시작해보세요!
            </p>
          </div>
        ) : (
          Object.entries(messageGroups).map(([date, messages]) => (
            <div key={date} className="message-group">
              <div className="date-divider">
                <span className="date-text">{formatDateHeader(date)}</span>
              </div>
              {messages.map(message => {
                const isMyMessage = message.senderId === currentUserId
                return (
                  <div 
                    key={message.id}
                    className={`message ${isMyMessage ? 'my-message' : 'other-message'}`}
                  >
                    <div className="message-bubble">
                      <p className="message-text">{message.content}</p>
                      <div className="message-meta">
                        <span className="message-time">
                          {formatMessageTime(message.sentAt)}
                        </span>
                        {isMyMessage && (
                          <span className={`message-status ${message.isRead ? 'read' : 'unread'}`}>
                            {message.isRead ? '읽음' : '안읽음'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 답장 폼 */}
      <MessageReply
        receiverId={thread.otherUser.id.toString()}
        receiverNickname={thread.otherUser.nickname}
        onSendMessage={onSendMessage}
        canSendMessage={canSendMessage}
        remainingCount={remainingCount}
      />
    </div>
  )
}

export default MessageThread