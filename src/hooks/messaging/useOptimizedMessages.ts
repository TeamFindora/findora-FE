import { useState, useEffect, useCallback, useRef } from 'react'
import { messagesApi, MessageResponseDto, MessageThread } from '../../api/messages'
import { getCurrentUser, isAuthenticated } from '../../api/auth'

export interface Message extends MessageResponseDto {}

// 디바운스된 스레드 새로고침을 위한 훅
export const useOptimizedMessages = () => {
  const [threads, setThreads] = useState<MessageThread[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // 디바운스된 새로고침 함수 (500ms 내 중복 호출 방지)
  const debouncedRefresh = useCallback(async () => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current)
    }
    
    refreshTimeoutRef.current = setTimeout(async () => {
      try {
        const messageThreads = await messagesApi.createMessageThreads()
        setThreads(messageThreads)
        setError(null)
      } catch (err) {
        console.error('메시지 새로고침 실패:', err)
        setError(err instanceof Error ? err.message : '메시지를 불러오는데 실패했습니다.')
      }
    }, 500)
  }, [])

  // 즉시 새로고침 함수 (최초 로딩용)
  const immediateRefresh = useCallback(async () => {
    try {
      const messageThreads = await messagesApi.createMessageThreads()
      setThreads(messageThreads)
      setError(null)
      return messageThreads
    } catch (err) {
      console.error('메시지 불러오기 실패:', err)
      setError(err instanceof Error ? err.message : '메시지를 불러오는데 실패했습니다.')
      return []
    }
  }, [])

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true)
      await immediateRefresh()
      setLoading(false)
    }
    
    // 로그인 상태일 때만 메시지 로드
    if (isAuthenticated()) {
      fetchMessages()
    } else {
      setThreads([])
      setLoading(false)
      setError(null)
    }
  }, [immediateRefresh, isAuthenticated()]) // isAuthenticated() 의존성 추가

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current)
      }
    }
  }, [])

  const sendMessage = useCallback(async (receiverId: string, content: string) => {
    try {
      const currentUser = getCurrentUser()
      if (!currentUser) {
        throw new Error('로그인이 필요합니다.')
      }

      const sentMessage = await messagesApi.sendMessage({
        receiverId: parseInt(receiverId),
        content
      })

      // 디바운스된 새로고침
      debouncedRefresh()
      return sentMessage
    } catch (err) {
      console.error('메시지 전송 실패:', err)
      throw new Error(err instanceof Error ? err.message : '메시지 전송에 실패했습니다.')
    }
  }, [debouncedRefresh])

  const markAsRead = useCallback(async (threadId: string) => {
    try {
      const thread = threads.find(t => t.id === threadId)
      if (!thread) return

      const currentUser = getCurrentUser()
      if (!currentUser) return

      const unreadMessages = thread.messages.filter(
        msg => msg.receiverId === currentUser.userId && !msg.isRead
      )

      if (unreadMessages.length === 0) return

      await Promise.all(
        unreadMessages.map(msg => messagesApi.markAsRead(msg.id))
      )

      // 디바운스된 새로고침
      debouncedRefresh()
    } catch (err) {
      console.error('메시지 읽음 처리 실패:', err)
    }
  }, [threads, debouncedRefresh])

  const deleteThread = useCallback(async (threadId: string) => {
    try {
      const thread = threads.find(t => t.id === threadId)
      if (!thread) return

      await Promise.all(
        thread.messages.map(msg => messagesApi.deleteMessage(msg.id))
      )

      // 즉시 새로고침 (삭제 결과 즉시 반영)
      await immediateRefresh()
    } catch (err) {
      console.error('대화 삭제 실패:', err)
      throw new Error('대화 삭제에 실패했습니다.')
    }
  }, [threads, immediateRefresh])

  const getTotalUnreadCount = useCallback(() => {
    return threads.reduce((total, thread) => total + thread.unreadCount, 0)
  }, [threads])

  const refetch = useCallback(async () => {
    setLoading(true)
    await immediateRefresh()
    setLoading(false)
  }, [immediateRefresh])

  const sendMessageDirectly = useCallback(async (receiverId: string, content: string) => {
    try {
      const currentUser = getCurrentUser()
      if (!currentUser) {
        throw new Error('로그인이 필요합니다.')
      }

      const sentMessage = await messagesApi.sendMessage({
        receiverId: parseInt(receiverId),
        content
      })

      // 백그라운드에서 디바운스된 새로고침
      debouncedRefresh()
      return sentMessage
    } catch (err) {
      console.error('메시지 전송 실패:', err)
      throw new Error(err instanceof Error ? err.message : '메시지 전송에 실패했습니다.')
    }
  }, [debouncedRefresh])

  return {
    threads,
    loading,
    error,
    sendMessage,
    sendMessageDirectly,
    markAsRead,
    deleteThread,
    getTotalUnreadCount,
    refetch
  }
}