import { useState, useEffect } from 'react'
import { messagesApi, messageAuthApi, MessageResponseDto, MessageThread } from '../../api/messages'
import { getCurrentUser } from '../../api/auth'

// 기존 Message 인터페이스를 MessageResponseDto와 호환되도록 변경
export interface Message extends MessageResponseDto {
  // 추가 필드가 필요하면 여기에 정의
}

// MessageThread는 api/messages.ts에서 import하므로 중복 제거

export const useMessages = () => {
  const [threads, setThreads] = useState<MessageThread[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // 실제 API 호출로 메시지 스레드 생성
        const messageThreads = await messagesApi.createMessageThreads()
        setThreads(messageThreads)
      } catch (err) {
        console.error('메시지 불러오기 실패:', err)
        setError(err instanceof Error ? err.message : '메시지를 불러오는데 실패했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()
  }, [])

  const sendMessage = async (receiverId: string, content: string) => {
    try {
      const currentUser = getCurrentUser()
      if (!currentUser) {
        throw new Error('로그인이 필요합니다.')
      }

      // 실제 API 호출로 메시지 전송 (권한 체크는 useMessageReply에서 이미 처리됨)
      const sentMessage = await messagesApi.sendMessage({
        receiverId: parseInt(receiverId),
        content
      })

      // 메시지 전송 후 스레드 목록 다시 불러오기
      const updatedThreads = await messagesApi.createMessageThreads()
      setThreads(updatedThreads)

      return sentMessage
    } catch (err) {
      console.error('메시지 전송 실패:', err)
      throw new Error(err instanceof Error ? err.message : '메시지 전송에 실패했습니다.')
    }
  }

  const markAsRead = async (threadId: string) => {
    try {
      const thread = threads.find(t => t.id === threadId)
      if (!thread) return

      const currentUser = getCurrentUser()
      if (!currentUser) return

      // 읽지 않은 메시지들에 대해 읽음 처리 API 호출
      const unreadMessages = thread.messages.filter(
        msg => msg.receiverId === currentUser.userId && !msg.isRead
      )

      // 각 읽지 않은 메시지에 대해 읽음 처리
      await Promise.all(
        unreadMessages.map(msg => messagesApi.markAsRead(msg.id))
      )

      // 스레드 목록 다시 불러오기
      const updatedThreads = await messagesApi.createMessageThreads()
      setThreads(updatedThreads)
    } catch (err) {
      console.error('메시지 읽음 처리 실패:', err)
    }
  }

  const deleteThread = async (threadId: string) => {
    try {
      const thread = threads.find(t => t.id === threadId)
      if (!thread) return

      // 스레드의 모든 메시지 삭제
      await Promise.all(
        thread.messages.map(msg => messagesApi.deleteMessage(msg.id))
      )

      // 스레드 목록 다시 불러오기
      const updatedThreads = await messagesApi.createMessageThreads()
      setThreads(updatedThreads)
    } catch (err) {
      console.error('대화 삭제 실패:', err)
      throw new Error('대화 삭제에 실패했습니다.')
    }
  }

  const getTotalUnreadCount = () => {
    return threads.reduce((total, thread) => total + thread.unreadCount, 0)
  }

  return {
    threads,
    loading,
    error,
    sendMessage,
    markAsRead,
    deleteThread,
    getTotalUnreadCount,
    refetch: async () => {
      try {
        setLoading(true)
        setError(null)
        const messageThreads = await messagesApi.createMessageThreads()
        setThreads(messageThreads)
      } catch (err) {
        console.error('메시지 다시 불러오기 실패:', err)
        setError(err instanceof Error ? err.message : '메시지를 불러오는데 실패했습니다.')
      } finally {
        setLoading(false)
      }
    },
    
    // 권한 체크 없이 순수하게 메시지만 전송하는 함수 (useMessageReply용)
    sendMessageDirectly: async (receiverId: string, content: string) => {
      try {
        const currentUser = getCurrentUser()
        if (!currentUser) {
          throw new Error('로그인이 필요합니다.')
        }

        // 권한 체크 없이 직접 API 호출
        const sentMessage = await messagesApi.sendMessage({
          receiverId: parseInt(receiverId),
          content
        })

        // 메시지 전송 후 스레드 목록 다시 불러오기 (즉시 업데이트)
        try {
          const updatedThreads = await messagesApi.createMessageThreads()
          setThreads(updatedThreads)
        } catch (refreshError) {
          console.error('스레드 새로고침 실패:', refreshError)
          // 메시지 전송은 성공했으므로 에러를 던지지 않음
        }

        return sentMessage
      } catch (err) {
        console.error('메시지 전송 실패:', err)
        throw new Error(err instanceof Error ? err.message : '메시지 전송에 실패했습니다.')
      }
    }
  }
}