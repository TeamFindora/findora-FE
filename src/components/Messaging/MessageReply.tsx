import { useMessageReply } from '../../hooks/messaging/useMessageReply'

interface MessageReplyProps {
  receiverId: string
  receiverNickname: string
  onSendMessage: (receiverId: string, content: string) => Promise<void>
}

const MessageReply = ({ receiverId, receiverNickname, onSendMessage }: MessageReplyProps) => {
  const {
    replyContent,
    isSending,
    error,
    handleContentChange,
    handleSubmit,
    canSubmit
  } = useMessageReply()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const success = await handleSubmit(receiverId, onSendMessage)
    if (success) {
      // 메시지 전송 성공 시 추가 처리가 필요하다면 여기에
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (canSubmit) {
        onSubmit(e as any)
      }
    }
  }

  return (
    <div className="message-reply">
      <form onSubmit={onSubmit} className="reply-form">
        {/* 수신자 정보 */}
        <div className="reply-header">
          <span className="reply-to">
            {receiverNickname}님에게 답장
          </span>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="reply-error">
            <span className="error-text">{error}</span>
          </div>
        )}

        {/* 입력 영역 */}
        <div className="reply-input-container">
          <textarea
            value={replyContent}
            onChange={(e) => handleContentChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="메시지를 입력하세요... (Shift+Enter로 줄바꿈)"
            className="reply-textarea"
            disabled={isSending}
            rows={3}
            maxLength={500}
          />
          
          {/* 글자 수 표시 */}
          <div className="character-count">
            <span className={replyContent.length > 450 ? 'warning' : ''}>
              {replyContent.length}/500
            </span>
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="reply-actions">
          <button
            type="submit"
            disabled={!canSubmit}
            className="send-button"
          >
            {isSending ? (
              <>
                <span className="sending-spinner"></span>
                전송 중...
              </>
            ) : (
              <>
                <span className="send-icon">📤</span>
                전송
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default MessageReply