import MessageItem from './MessageItem'
import { MessageThread } from '../../hooks/messaging/useOptimizedMessages'

interface MessageListProps {
  threads: MessageThread[]
  onThreadSelect: (thread: MessageThread) => void
  onDeleteThread: (threadId: string) => void
}

const MessageList = ({ threads, onThreadSelect, onDeleteThread }: MessageListProps) => {
  if (threads.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">💬</div>
        <h4 className="empty-title">아직 쪽지가 없습니다</h4>
        <p className="empty-description">
          다른 사용자와 대화를 시작해보세요!
        </p>
      </div>
    )
  }

  return (
    <div className="message-list">
      {threads.map(thread => (
        <MessageItem
          key={thread.id}
          thread={thread}
          onClick={() => onThreadSelect(thread)}
          onDelete={() => onDeleteThread(thread.id)}
        />
      ))}
    </div>
  )
}

export default MessageList