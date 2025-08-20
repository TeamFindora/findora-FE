// API 기본 설정
const API_BASE_URL = 'http://localhost:8080' // 백엔드 서버 URL

// auth.ts에서 getCurrentUser 함수 import
import { getCurrentUser } from './auth'

// 권한 에러 체크 헬퍼
const isAuthError = (error: any): boolean => {
  return error instanceof Error && (
    error.message.includes('401') || 
    error.message.includes('500') ||
    error.message.includes('Unauthorized') ||
    error.message.includes('인증이 필요')
  )
}

// API 클라이언트 함수
const apiClient = {
  get: async (url: string) => {
    const accessToken = localStorage.getItem('accessToken')
    const tokenType = localStorage.getItem('tokenType') || 'Bearer'
    
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'GET',
      headers: {
        'accept': '*/*',
        ...(accessToken && { Authorization: `${tokenType} ${accessToken}` })
      }
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
    }
    
    return await response.json()
  },

  post: async (url: string, data?: any) => {
    const accessToken = localStorage.getItem('accessToken')
    const tokenType = localStorage.getItem('tokenType') || 'Bearer'
    
    const headers: Record<string, string> = {
      'accept': '*/*',
      ...(accessToken && { Authorization: `${tokenType} ${accessToken}` })
    }
    
    const fetchOptions: RequestInit = {
      method: 'POST',
      headers
    }
    
    if (data !== undefined && data !== null) {
      headers['Content-Type'] = 'application/json'
      fetchOptions.body = JSON.stringify(data)
    }
    
    const response = await fetch(`${API_BASE_URL}${url}`, fetchOptions)
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
    }
    
    // 응답이 비어있는지 확인
    const responseText = await response.text()
    return responseText ? JSON.parse(responseText) : { success: true }
  },

  delete: async (url: string) => {
    const accessToken = localStorage.getItem('accessToken')
    const tokenType = localStorage.getItem('tokenType') || 'Bearer'
    
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'DELETE',
      headers: {
        'accept': '*/*',
        ...(accessToken && { Authorization: `${tokenType} ${accessToken}` })
      }
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
    }
    
    // DELETE는 보통 빈 응답이므로 응답이 있을 때만 파싱
    const responseText = await response.text()
    return responseText ? JSON.parse(responseText) : { success: true }
  }
}

// 메시지 타입 정의 (실제 API 응답에 맞춤)
export interface MessageResponseDto {
  id: number
  senderId: number
  receiverId: number
  content: string
  sentAt: string
  isRead: boolean
}

export interface MessageRequestDto {
  receiverId: number
  content: string
}

export interface MessageThread {
  id: string
  otherUser: {
    id: number
    nickname: string
  }
  lastMessage: MessageResponseDto
  unreadCount: number
  messages: MessageResponseDto[]
}

// 쪽지 권한 관련 타입 정의
export interface MessageAuthResponseDto {
  userId: number
  count: number
}

// 사용자 정보 캐시 (중복 요청 방지)
const userInfoCache = new Map<number, { nickname: string }>()

// 사용자 정보 가져오기 함수
const getUserInfo = async (userId: number): Promise<{ nickname: string }> => {
  // 캐시에서 먼저 확인
  if (userInfoCache.has(userId)) {
    return userInfoCache.get(userId)!
  }

  try {
    // /api/users 에서 모든 사용자를 가져와서 해당 사용자 찾기
    const allUsers = await apiClient.get('/api/users')
    const user = allUsers.find((u: any) => u.id === userId)
    
    if (user) {
      const userInfo = { nickname: user.nickname }
      userInfoCache.set(userId, userInfo)
      return userInfo
    } else {
      // 사용자를 찾을 수 없으면 기본값
      const defaultInfo = { nickname: `사용자${userId}` }
      userInfoCache.set(userId, defaultInfo)
      return defaultInfo
    }
  } catch (error) {
    console.error(`사용자 ${userId} 정보 조회 실패:`, error)
    const defaultInfo = { nickname: `사용자${userId}` }
    userInfoCache.set(userId, defaultInfo)
    return defaultInfo
  }
}

// 메시지 API 함수들
export const messagesApi = {
  // 받은 쪽지 목록 조회
  getReceivedMessages: async (): Promise<MessageResponseDto[]> => {
    try {
      const response = await apiClient.get('/api/messages/received')
      return Array.isArray(response) ? response : []
    } catch (error) {
      if (isAuthError(error)) {
        console.info('쪽지 권한이 없는 사용자 - 빈 배열 반환')
        return []
      }
      throw error
    }
  },

  // 보낸 쪽지 목록 조회
  getSentMessages: async (): Promise<MessageResponseDto[]> => {
    try {
      const response = await apiClient.get('/api/messages/sent')
      return Array.isArray(response) ? response : []
    } catch (error) {
      if (isAuthError(error)) {
        console.info('쪽지 권한이 없는 사용자 - 빈 배열 반환')
        return []
      }
      throw error
    }
  },

  // 쪽지 단건 조회
  getMessageById: async (id: number): Promise<MessageResponseDto> => {
    const response = await apiClient.get(`/api/messages/${id}`)
    return response
  },

  // 쪽지 보내기
  sendMessage: async (messageData: MessageRequestDto): Promise<MessageResponseDto> => {
    console.log('쪽지 전송 시작:', messageData)
    const response = await apiClient.post('/api/messages', messageData)
    console.log('쪽지 전송 완료:', response)
    return response
  },

  // 쪽지 읽음 처리
  markAsRead: async (id: number): Promise<{ success: boolean }> => {
    await apiClient.post(`/api/messages/${id}/read`)
    return { success: true }
  },

  // 쪽지 삭제
  deleteMessage: async (id: number): Promise<{ success: boolean }> => {
    await apiClient.delete(`/api/messages/${id}`)
    return { success: true }
  },

  // 대화 스레드 생성 (프론트엔드에서 받은/보낸 메시지를 스레드로 그룹화)
  createMessageThreads: async (): Promise<MessageThread[]> => {
    try {
      const [receivedMessages, sentMessages] = await Promise.all([
        messagesApi.getReceivedMessages(),
        messagesApi.getSentMessages()
      ])

      // 모든 메시지를 합치고 시간순으로 정렬
      const allMessages = [...receivedMessages, ...sentMessages]
        .sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime())

      // 사용자별로 그룹화하여 스레드 생성
      const threadsMap = new Map<number, MessageThread>()
      const currentUserId = JSON.parse(localStorage.getItem('user') || '{}').userId

      // 고유한 사용자 ID 목록 추출
      const uniqueUserIds = new Set<number>()
      allMessages.forEach(message => {
        const otherUserId = message.senderId === currentUserId ? message.receiverId : message.senderId
        uniqueUserIds.add(otherUserId)
      })

      // 모든 사용자의 닉네임을 병렬로 가져오기
      const userInfoPromises = Array.from(uniqueUserIds).map(userId => 
        getUserInfo(userId).then(info => ({ userId, info }))
      )
      const userInfoResults = await Promise.all(userInfoPromises)
      
      // 사용자 정보 맵 생성
      const userInfoMap = new Map<number, { nickname: string }>()
      userInfoResults.forEach(({ userId, info }) => {
        userInfoMap.set(userId, info)
      })

      allMessages.forEach(message => {
        // 상대방 ID 계산
        const otherUserId = message.senderId === currentUserId ? message.receiverId : message.senderId
        const otherUserInfo = userInfoMap.get(otherUserId) || { nickname: `사용자${otherUserId}` }

        if (!threadsMap.has(otherUserId)) {
          threadsMap.set(otherUserId, {
            id: otherUserId.toString(),
            otherUser: {
              id: otherUserId,
              nickname: otherUserInfo.nickname
            },
            lastMessage: message,
            unreadCount: 0,
            messages: []
          })
        }

        const thread = threadsMap.get(otherUserId)!
        thread.messages.push(message)
        thread.lastMessage = message

        // 읽지 않은 메시지 수 계산 (받은 메시지 중 읽지 않은 것만)
        if (message.receiverId === currentUserId && !message.isRead) {
          thread.unreadCount++
        }
      })

      // 최신 메시지 시간순으로 정렬
      return Array.from(threadsMap.values())
        .sort((a, b) => new Date(b.lastMessage.sentAt).getTime() - new Date(a.lastMessage.sentAt).getTime())
    } catch (error) {
      // 인증 에러인 경우 빈 배열 반환
      if (isAuthError(error)) {
        console.info('인증이 필요하거나 권한이 없는 사용자 - 빈 스레드 목록 반환')
        return []
      }
      console.error('메시지 스레드 생성 실패:', error)
      throw error
    }
  }
}

// 쪽지 권한 API 함수들
export const messageAuthApi = {
  // 사용자 등록 (쪽지 권한 5회 추가)
  grantAuthority: async (userId: number): Promise<MessageAuthResponseDto> => {
    const response = await apiClient.post(`/api/message-auth/grant/${userId}`)
    return response
  },

  // 쪽지 사용 (count 1회 차감)
  useMessage: async (userId: number): Promise<string> => {
    const response = await apiClient.post(`/api/message-auth/use/${userId}`)
    return response || "쪽지 1회 사용 완료"
  },

  // 남은 쪽지 개수 조회
  getMessageCount: async (userId: number): Promise<MessageAuthResponseDto> => {
    const response = await apiClient.get(`/api/message-auth/count/${userId}`)
    return response
  },

  // 전체 사용자 조회 (users 테이블에서)
  getAllUsers: async (): Promise<MessageAuthResponseDto[]> => {
    try {
      // 먼저 users 테이블에서 모든 사용자 조회
      const allUsers = await apiClient.get('/api/users')
      
      // 각 사용자의 쪽지 개수 정보를 병렬로 조회
      const usersWithCounts = await Promise.all(
        allUsers.map(async (user: any) => {
          try {
            const authInfo = await messageAuthApi.getMessageCount(user.id)
            return {
              userId: user.id,
              count: authInfo.count
            }
          } catch (error) {
            // message-auth에 등록되지 않은 사용자는 count를 0으로 설정
            return {
              userId: user.id,
              count: 0
            }
          }
        })
      )
      
      return usersWithCounts
    } catch (error) {
      console.error('전체 사용자 조회 실패:', error)
      // 실패시 기존 방식으로 fallback
      const response = await apiClient.get('/api/message-auth/all')
      return Array.isArray(response) ? response : []
    }
  },

  // 현재 사용자의 남은 쪽지 개수 조회 (편의 함수)
  getCurrentUserMessageCount: async (): Promise<number> => {
    try {
      const currentUser = getCurrentUser()
      if (!currentUser?.userId) {
        return 0
      }
      
      const response = await messageAuthApi.getMessageCount(currentUser.userId)
      return response.count
    } catch (error: any) {
      // 인증 에러인 경우 0 반환
      if (isAuthError(error)) {
        console.info('쪽지 권한이 없거나 인증이 필요한 사용자 - count: 0 반환')
        return 0
      }
      console.error('남은 쪽지 개수 조회 실패:', error)
      return 0
    }
  },

  // 쪽지 전송 전 권한 확인 및 사용 처리
  checkAndUseMessagePermission: async (): Promise<{ canSend: boolean; remainingCount: number; message?: string }> => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
      if (!currentUser.userId) {
        return { 
          canSend: false, 
          remainingCount: 0, 
          message: '사용자 정보를 찾을 수 없습니다.' 
        }
      }

      // 현재 남은 쪽지 개수 확인
      const countResponse = await messageAuthApi.getMessageCount(currentUser.userId)
      
      if (countResponse.count <= 0) {
        return { 
          canSend: false, 
          remainingCount: 0, 
          message: '남은 쪽지 개수가 없습니다.' 
        }
      }

      // 쪽지 사용 처리
      await messageAuthApi.useMessage(currentUser.userId)
      
      return { 
        canSend: true, 
        remainingCount: countResponse.count - 1,
        message: '쪽지를 전송할 수 있습니다.' 
      }
    } catch (error) {
      console.error('쪽지 권한 확인 실패:', error)
      return { 
        canSend: false, 
        remainingCount: 0, 
        message: '쪽지 권한 확인에 실패했습니다.' 
      }
    }
  }
}