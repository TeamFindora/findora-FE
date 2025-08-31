// API 설정 중앙화
const isDevelopment = import.meta.env.DEV

// 기본 API URL 설정
export const API_BASE_URL = isDevelopment 
  ? '' // 개발 환경에서는 Vite 프록시 사용 (빈 문자열)
  : import.meta.env.VITE_API_URL || 'http://localhost:8080'

// API 엔드포인트들
export const API_ENDPOINTS = {
  // 인증 관련
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    SIGNUP: '/api/auth/signup',
    KAKAO_LOGIN: '/api/auth/kakao',
    CHECK_USERNAME: '/api/auth/check-username'
  },
  
  // 게시글 관련
  POSTS: {
    BASE: '/api/posts',
    BY_ID: (id: string | number) => `/api/posts/${id}`,
    COMMENTS: (id: string | number) => `/api/posts/${id}/comments`,
    LIKE: (id: string | number) => `/api/posts/${id}/like`,
    BOOKMARK: (id: string | number) => `/api/posts/${id}/bookmark`
  },
  
  // 메시지 관련
  MESSAGES: {
    BASE: '/api/messages',
    SEND: '/api/messages/send',
    RECEIVED: '/api/messages/received',
    SENT: '/api/messages/sent',
    THREAD: (userId: string | number) => `/api/messages/thread/${userId}`,
    MARK_READ: (threadId: string | number) => `/api/messages/mark-read/${threadId}`,
    DELETE_THREAD: (threadId: string | number) => `/api/messages/delete-thread/${threadId}`,
    COUNT: '/api/messages/count'
  },
  
  // 메시지 권한 관리 관련
  MESSAGE_AUTH: {
    BASE: '/api/message-auth',
    GRANT: (userId: string | number) => `/api/message-auth/grant/${userId}`,
    USE: (userId: string | number) => `/api/message-auth/use/${userId}`,
    COUNT: (userId: string | number) => `/api/message-auth/count/${userId}`,
    ALL: '/api/message-auth/all'
  },
  
  // 이미지 관련
  IMAGES: {
    UPLOAD: '/api/images/upload'
  }
} as const

// API 호출을 위한 공통 fetch 함수
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const url = `${API_BASE_URL}${endpoint}`
  
  console.log('API 요청:', {
    url,
    method: options.method || 'GET',
    isDevelopment,
    baseUrl: API_BASE_URL
  })
  
  const defaultHeaders: HeadersInit = {}
  
  // FormData가 아닌 경우에만 Content-Type 설정
  if (!(options.body instanceof FormData)) {
    defaultHeaders['Content-Type'] = 'application/json'
  }
  
  // 인증 토큰 추가
  const token = localStorage.getItem('accessToken')
  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`
  }
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  })
  
  console.log('API 응답:', {
    url,
    status: response.status,
    statusText: response.statusText,
    contentType: response.headers.get('content-type')
  })
  
  return response
}

// 에러 처리를 포함한 JSON 응답 파싱
export const parseApiResponse = async (response: Response) => {
  const contentType = response.headers.get('content-type')
  
  if (contentType && contentType.includes('application/json')) {
    return await response.json()
  } else {
    const text = await response.text()
    console.log('Non-JSON 응답:', text)
    return { error: text || 'Unknown error' }
  }
}