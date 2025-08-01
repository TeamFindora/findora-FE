import { useState, useEffect } from 'react'
import { messageAuthApi } from '../../api/messages'
import { getCurrentUser } from '../../api/auth'

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
    } catch (err) {
      console.error('쪽지 개수 조회 실패:', err)
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
    fetchMessageCount()
  }, [])

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