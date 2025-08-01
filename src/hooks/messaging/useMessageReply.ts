import { useState } from 'react'
import { messageAuthApi } from '../../api/messages'

export const useMessageReply = () => {
  const [replyContent, setReplyContent] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [isCheckingPermission, setIsCheckingPermission] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [permissionInfo, setPermissionInfo] = useState<{
    canSend: boolean
    remainingCount: number
    message?: string
  } | null>(null)

  const handleContentChange = (content: string) => {
    setReplyContent(content)
    setError(null)
    // 내용이 변경될 때 권한 정보 초기화
    setPermissionInfo(null)
  }

  // 권한 확인 함수 (차감하지 않고 확인만)
  const checkPermission = async () => {
    try {
      setIsCheckingPermission(true)
      setError(null)
      
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
      if (!currentUser.userId) {
        const errorMessage = '사용자 정보를 찾을 수 없습니다.'
        setError(errorMessage)
        setPermissionInfo({ canSend: false, remainingCount: 0, message: errorMessage })
        return { canSend: false, remainingCount: 0, message: errorMessage }
      }

      // 현재 남은 쪽지 개수만 확인 (차감하지 않음)
      const countResponse = await messageAuthApi.getMessageCount(currentUser.userId)
      
      if (countResponse.count <= 0) {
        const errorMessage = '남은 쪽지 개수가 없습니다.'
        setError(errorMessage)
        setPermissionInfo({ canSend: false, remainingCount: 0, message: errorMessage })
        return { canSend: false, remainingCount: 0, message: errorMessage }
      }

      const permission = {
        canSend: true,
        remainingCount: countResponse.count,
        message: '쪽지를 전송할 수 있습니다.'
      }
      
      setPermissionInfo(permission)
      return permission
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '권한 확인 중 오류가 발생했습니다.'
      setError(errorMessage)
      setPermissionInfo({
        canSend: false,
        remainingCount: 0,
        message: errorMessage
      })
      return { canSend: false, remainingCount: 0, message: errorMessage }
    } finally {
      setIsCheckingPermission(false)
    }
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
      
      // Step 1: 권한 확인 (차감하지 않고 확인만)
      const permission = await checkPermission()
      if (!permission.canSend) {
        return false
      }
      
      // Step 2: 메시지 전송 (백엔드에서 자동으로 권한 차감 처리)
      await sendMessage(receiverId, replyContent.trim())
      
      // Step 3: 전송 성공 후 UI 카운트 업데이트 (백엔드에서 이미 차감되었다고 가정)
      setPermissionInfo(prev => prev ? {
        ...prev,
        remainingCount: Math.max(0, prev.remainingCount - 1)
      } : null)
      
      // 성공 후 폼 초기화
      setReplyContent('')
      setPermissionInfo(null)
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
    setIsCheckingPermission(false)
    setPermissionInfo(null)
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
    isCheckingPermission,
    error,
    permissionInfo,
    handleContentChange,
    handleSubmit,
    checkPermission,
    reset,
    validateContent,
    canSubmit: !isSending && !isCheckingPermission && replyContent.trim().length > 0 && replyContent.length <= 500,
    isLoading: isSending || isCheckingPermission
  }
}