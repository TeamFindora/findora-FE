import { useState, useEffect } from 'react'
import { messageAuthApi } from '../../api/messages'
import { getCurrentUser, isAuthenticated } from '../../api/auth'

export const useMessageCount = () => {
  const [remainingCount, setRemainingCount] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMessageCount = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const currentUser = getCurrentUser()
      if (!currentUser?.userId) {
        setRemainingCount(0)
        return
      }

      const count = await messageAuthApi.getCurrentUserMessageCount()
      setRemainingCount(count)
      setError(null)
    } catch (err) {
      console.error('쪽지 개수 조회 실패:', err)
      // API 레이어에서 이미 인증 에러는 처리되므로 실제 에러만 여기서 처리
      setError(err instanceof Error ? err.message : '쪽지 개수를 불러올 수 없습니다.')
      setRemainingCount(0)
    } finally {
      setLoading(false)
    }
  }

  // 쪽지 개수 감소 (메시지 전송 후 호출)
  const decrementCount = () => {
    setRemainingCount(prev => Math.max(0, prev - 1))
  }

  // 쪽지 개수 증가 (권한 추가 후 호출)
  const incrementCount = (amount: number = 5) => {
    setRemainingCount(prev => prev + amount)
  }

  // 수동으로 개수 새로고침
  const refreshCount = () => {
    fetchMessageCount()
  }

  useEffect(() => {
    // 로그인 상태일 때만 쪽지 개수 조회
    if (isAuthenticated()) {
      fetchMessageCount()
    } else {
      setRemainingCount(0)
      setLoading(false)
      setError(null)
    }
  }, [isAuthenticated()]) // isAuthenticated() 의존성 추가

  return {
    remainingCount,
    loading,
    error,
    decrementCount,
    incrementCount,
    refreshCount,
    canSendMessage: remainingCount > 0
  }
}