import { useState, useEffect } from 'react'

export interface Message {
  id: string
  senderId: string
  senderNickname: string
  receiverId: string
  receiverNickname: string
  content: string
  isRead: boolean
  createdAt: string
  updatedAt?: string
}

export interface MessageThread {
  id: string
  otherUser: {
    id: string
    nickname: string
  }
  lastMessage: Message
  unreadCount: number
  messages: Message[]
}

export const useMessages = () => {
  const [threads, setThreads] = useState<MessageThread[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 임시 목 데이터
  const mockThreads: MessageThread[] = [
    {
      id: '1',
      otherUser: { id: '2', nickname: '김학생' },
      lastMessage: {
        id: '1',
        senderId: '2',
        senderNickname: '김학생',
        receiverId: '1',
        receiverNickname: '현재사용자',
        content: '안녕하세요! 질문이 있어서 연락드렸습니다.',
        isRead: false,
        createdAt: '2024-01-15 14:30:00'
      },
      unreadCount: 2,
      messages: [
        {
          id: '1',
          senderId: '2',
          senderNickname: '김학생',
          receiverId: '1',
          receiverNickname: '현재사용자',
          content: '안녕하세요! 질문이 있어서 연락드렸습니다.',
          isRead: false,
          createdAt: '2024-01-15 14:30:00'
        },
        {
          id: '2',
          senderId: '2',
          senderNickname: '김학생',
          receiverId: '1',
          receiverNickname: '현재사용자',
          content: '혹시 시간 있으실 때 답변 부탁드립니다!',
          isRead: false,
          createdAt: '2024-01-15 14:35:00'
        }
      ]
    },
    {
      id: '2',
      otherUser: { id: '3', nickname: '박교수' },
      lastMessage: {
        id: '3',
        senderId: '1',
        senderNickname: '현재사용자',
        receiverId: '3',
        receiverNickname: '박교수',
        content: '네, 알겠습니다. 감사합니다!',
        isRead: true,
        createdAt: '2024-01-14 16:20:00'
      },
      unreadCount: 0,
      messages: [
        {
          id: '3',
          senderId: '1',
          senderNickname: '현재사용자',
          receiverId: '3',
          receiverNickname: '박교수',
          content: '네, 알겠습니다. 감사합니다!',
          isRead: true,
          createdAt: '2024-01-14 16:20:00'
        }
      ]
    }
  ]

  useEffect(() => {
    // 실제 API 호출 시뮬레이션
    const fetchMessages = async () => {
      try {
        setLoading(true)
        // API 호출 대신 목 데이터 사용
        await new Promise(resolve => setTimeout(resolve, 500))
        setThreads(mockThreads)
        setError(null)
      } catch (err) {
        setError('메시지를 불러오는데 실패했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()
  }, [])

  const sendMessage = async (receiverId: string, content: string) => {
    try {
      const newMessage: Message = {
        id: Date.now().toString(),
        senderId: '1', // 현재 사용자 ID
        senderNickname: '현재사용자',
        receiverId,
        receiverNickname: threads.find(t => t.otherUser.id === receiverId)?.otherUser.nickname || '',
        content,
        isRead: false,
        createdAt: new Date().toLocaleString()
      }

      // 기존 스레드 찾기 또는 새 스레드 생성
      setThreads(prevThreads => {
        const existingThreadIndex = prevThreads.findIndex(t => t.otherUser.id === receiverId)
        
        if (existingThreadIndex >= 0) {
          // 기존 스레드에 메시지 추가
          const updatedThreads = [...prevThreads]
          updatedThreads[existingThreadIndex] = {
            ...updatedThreads[existingThreadIndex],
            lastMessage: newMessage,
            messages: [...updatedThreads[existingThreadIndex].messages, newMessage]
          }
          return updatedThreads
        } else {
          // 새 스레드 생성
          const newThread: MessageThread = {
            id: Date.now().toString(),
            otherUser: { id: receiverId, nickname: newMessage.receiverNickname },
            lastMessage: newMessage,
            unreadCount: 0,
            messages: [newMessage]
          }
          return [newThread, ...prevThreads]
        }
      })

      return newMessage
    } catch (err) {
      throw new Error('메시지 전송에 실패했습니다.')
    }
  }

  const markAsRead = async (threadId: string) => {
    try {
      setThreads(prevThreads =>
        prevThreads.map(thread =>
          thread.id === threadId
            ? {
                ...thread,
                unreadCount: 0,
                messages: thread.messages.map(message => ({
                  ...message,
                  isRead: true
                }))
              }
            : thread
        )
      )
    } catch (err) {
      console.error('메시지 읽음 처리 실패:', err)
    }
  }

  const deleteThread = async (threadId: string) => {
    try {
      setThreads(prevThreads => prevThreads.filter(thread => thread.id !== threadId))
    } catch (err) {
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
    refetch: () => {
      setLoading(true)
      setTimeout(() => {
        setThreads(mockThreads)
        setLoading(false)
      }, 500)
    }
  }
}