import { useState, useEffect } from 'react'
import { messagesApi } from '../../api/messages'
import { getCurrentUser } from '../../api/auth'

// 전역 상태 관리를 위한 변수들
let globalUnreadCount = 0
let globalListeners: ((count: number) => void)[] = []

// 전역 카운트 업데이트 함수
const updateGlobalCount = (newCount: number) => {
  globalUnreadCount = newCount
  globalListeners.forEach(listener => listener(newCount))
}

export const useUnreadMessageCount = () => {
  const [unreadCount, setUnreadCount] = useState<number>(globalUnreadCount)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUnreadCount = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const currentUser = getCurrentUser()
      if (!currentUser?.userId) {
        setUnreadCount(0)
        return
      }

      // 받은 메시지 중 읽지 않은 것들 조회
      const receivedMessages = await messagesApi.getReceivedMessages()
      
      // isRead가 false인 메시지 개수 계산
      const unreadMessages = Array.isArray(receivedMessages) 
        ? receivedMessages.filter(message => message && !message.isRead)
        : []
      const count = unreadMessages.length
      setUnreadCount(count)
      updateGlobalCount(count) // 전역 상태 업데이트
      setError(null)
    } catch (err) {
      console.error('안읽은 쪽지 개수 조회 실패:', err)
      // API 레이어에서 이미 인증 에러는 처리되므로 실제 에러만 여기서 처리
      setError(err instanceof Error ? err.message : '안읽은 메시지 개수를 불러올 수 없습니다.')
      setUnreadCount(0)
    } finally {
      setLoading(false)
    }
  }

  // 메시지를 읽었을 때 카운트 감소
  const decrementCount = () => {
    const newCount = Math.max(0, globalUnreadCount - 1)
    updateGlobalCount(newCount)
    setUnreadCount(newCount)
  }

  // 새 메시지 도착 시 카운트 증가
  const incrementCount = () => {
    const newCount = globalUnreadCount + 1
    updateGlobalCount(newCount)
    setUnreadCount(newCount)
  }

  // 수동으로 개수 새로고침
  const refreshCount = () => {
    fetchUnreadCount()
  }

  // 컴포넌트 마운트 시 리스너 등록 및 초기 데이터 로드
  useEffect(() => {
    // 전역 리스너에 등록
    const updateListener = (count: number) => {
      setUnreadCount(count)
    }
    globalListeners.push(updateListener)
    
    // 초기 데이터 로드
    fetchUnreadCount()

    // 컴포넌트 언마운트 시 리스너 제거
    return () => {
      const index = globalListeners.indexOf(updateListener)
      if (index > -1) {
        globalListeners.splice(index, 1)
      }
    }
  }, [])

  return {
    unreadCount,
    loading,
    error,
    decrementCount,
    incrementCount,
    refreshCount
  }
}