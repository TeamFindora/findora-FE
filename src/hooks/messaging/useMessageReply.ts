import { useState } from 'react'

export const useMessageReply = () => {
  const [replyContent, setReplyContent] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleContentChange = (content: string) => {
    setReplyContent(content)
    setError(null)
  }

  const handleSubmit = async (
    receiverId: string,
    sendMessage: (receiverId: string, content: string) => Promise<any>
  ) => {
    if (!replyContent.trim()) {
      setError('메시지 내용을 입력해주세요.')
      return false
    }

    if (replyContent.length > 500) {
      setError('메시지는 500자 이내로 입력해주세요.')
      return false
    }

    try {
      setIsSending(true)
      setError(null)
      
      await sendMessage(receiverId, replyContent.trim())
      
      // 성공 후 폼 초기화
      setReplyContent('')
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : '메시지 전송에 실패했습니다.')
      return false
    } finally {
      setIsSending(false)
    }
  }

  const reset = () => {
    setReplyContent('')
    setError(null)
    setIsSending(false)
  }

  const validateContent = (content: string) => {
    if (!content.trim()) {
      return '메시지 내용을 입력해주세요.'
    }
    if (content.length > 500) {
      return '메시지는 500자 이내로 입력해주세요.'
    }
    return null
  }

  return {
    replyContent,
    isSending,
    error,
    handleContentChange,
    handleSubmit,
    reset,
    validateContent,
    canSubmit: !isSending && replyContent.trim().length > 0 && replyContent.length <= 500
  }
}