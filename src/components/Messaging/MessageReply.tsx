import { useMessageReply } from '../../hooks/messaging/useMessageReply'

interface MessageReplyProps {
  receiverId: string
  receiverNickname: string
  onSendMessage: (receiverId: string, content: string) => Promise<void>
  canSendMessage?: boolean
  remainingCount?: number
}

const MessageReply = ({ receiverId, receiverNickname, onSendMessage, canSendMessage = true, remainingCount = 0 }: MessageReplyProps) => {
  const {
    replyContent,
    isSending,
    isCheckingPermission,
    error,
    permissionInfo,
    handleContentChange,
    handleSubmit,
    canSubmit,
    isLoading
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
      if (canSubmit && !isLoading) {
        onSubmit(e as any)
      }
    }
  }

  return (
    <div className="message-reply">
      <form onSubmit={onSubmit} className="reply-form">
        {/* 수신자 정보 및 쪽지 개수 */}
        <div className="reply-header">
          <span className="reply-to">
            {receiverNickname}님에게 답장
          </span>
          <div className="permission-status">
            {isCheckingPermission ? (
              <span className="permission-checking">
                <span className="permission-spinner"></span>
                권한 확인 중...
              </span>
            ) : permissionInfo ? (
              <span className={`remaining-count-small ${permissionInfo.remainingCount === 0 ? 'count-zero' : permissionInfo.remainingCount <= 5 ? 'count-low' : ''}`}>
                남은 쪽지: {permissionInfo.remainingCount}회
              </span>
            ) : (
              <span className={`remaining-count-small ${remainingCount === 0 ? 'count-zero' : remainingCount <= 5 ? 'count-low' : ''}`}>
                남은 쪽지: {remainingCount}회
              </span>
            )}
          </div>
        </div>

        {/* 에러 메시지 및 권한 상태 알림 */}
        {permissionInfo && !permissionInfo.canSend && (
          <div className="reply-warning">
            <div className="warning-header">
              <span className="warning-icon">⚠️</span>
              <strong>쪽지 전송 불가</strong>
            </div>
            <div className="warning-content">
              <p className="warning-text">{permissionInfo.message}</p>
              <div className="warning-actions">
                <span className="warning-help">💡 추가 쪽지 구매 또는 권한 요청이 필요합니다.</span>
              </div>
            </div>
          </div>
        )}
        
        {error && !permissionInfo && (
          <div className="reply-error">
            <span className="error-text">{error}</span>
          </div>
        )}
        
        {!canSendMessage && !permissionInfo && (
          <div className="reply-error">
            <span className="error-text">쪽지 개수가 부족합니다. 추가 구매가 필요합니다.</span>
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
            disabled={isLoading}
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
            disabled={!canSubmit || !canSendMessage || (permissionInfo && !permissionInfo.canSend)}
            className="send-button"
            title={
              !canSendMessage ? '쪽지 개수가 부족합니다' : 
              (permissionInfo && !permissionInfo.canSend) ? '쪽지 전송 권한이 없습니다' : 
              ''
            }
          >
            {isCheckingPermission ? (
              <>
                <span className="permission-spinner"></span>
                권한 확인 중...
              </>
            ) : isSending ? (
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