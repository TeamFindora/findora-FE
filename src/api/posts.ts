// API 기본 설정
const API_BASE_URL = 'http://localhost:8080' // 백엔드 서버 URL

// API 클라이언트 함수
const apiClient = {
  get: async (url: string) => {
    const accessToken = localStorage.getItem('accessToken')
    const tokenType = localStorage.getItem('tokenType') || 'Bearer'
    console.log('GET 요청 URL:', `${API_BASE_URL}${url}`)
    console.log('GET 요청 토큰:', accessToken)
    
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken && { Authorization: `${tokenType} ${accessToken}` })
      }
    })
    
    console.log('GET 응답 상태:', response.status)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.log('GET 에러 응답:', errorText)
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
    }
    
    const data = await response.json()
    console.log('GET 성공 응답:', data) // 디버깅용
    return data
  },

  post: async (url: string, data: any) => {
    const accessToken = localStorage.getItem('accessToken')
    const tokenType = localStorage.getItem('tokenType') || 'Bearer'
    console.log('POST 요청 토큰:', accessToken)
    console.log('POST 요청 토큰 타입:', tokenType)
    console.log('POST 요청 데이터:', data)
    
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken && { Authorization: `${tokenType} ${accessToken}` })
      },
      body: JSON.stringify(data)
    })
    
    console.log('POST 응답 상태:', response.status)
    console.log('POST 응답 헤더:', Object.fromEntries(response.headers.entries()))
    
    if (!response.ok) {
      const errorText = await response.text()
      console.log('POST 에러 응답:', errorText)
      console.log('POST 에러 상태:', response.status)
      console.log('POST 에러 헤더:', Object.fromEntries(response.headers.entries()))
      
      // 403 에러인 경우 더 자세한 정보 출력
      if (response.status === 403) {
        console.error('403 Forbidden - 권한 부족. 가능한 원인:')
        console.error('1. 토큰이 만료됨')
        console.error('2. 사용자 권한이 부족함')
        console.error('3. 백엔드 권한 검증 실패')
      }
      
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
    }
    
    const result = await response.json()
    console.log('POST 성공 응답:', result)
    return result
  },

  put: async (url: string, data: any) => {
    const accessToken = localStorage.getItem('accessToken')
    const tokenType = localStorage.getItem('tokenType') || 'Bearer'
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken && { Authorization: `${tokenType} ${accessToken}` })
      },
      body: JSON.stringify(data)
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
  },

  delete: async (url: string) => {
    const accessToken = localStorage.getItem('accessToken')
    const tokenType = localStorage.getItem('tokenType') || 'Bearer'
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken && { Authorization: `${tokenType} ${accessToken}` })
      }
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
  }
}

// 게시글 타입 정의
export interface PostCategory {
  id: number
  name: string
  visibility: string
  createdAt: string
}

export interface PostResponseDto {
  id: number
  category: PostCategory
  userId: number
  userNickname: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

export interface PostRequestDto {
  title: string
  content: string
  categoryId: number
  userId: number
}

// 게시글 수정용 타입 (제목과 내용만 수정 가능)
export interface PostUpdateDto {
  title: string
  content: string
}

// 댓글 타입 정의 (백엔드 API에 맞춰서 수정)
export interface CommentResponseDto {
  id: number
  postId: number
  userId: number
  userNickname?: string // 옵셔널로 변경
  nickname?: string // 가능한 다른 필드명
  author?: string // 가능한 다른 필드명
  writer?: string // 가능한 다른 필드명
  content: string
  createdAt: string
  updatedAt: string
  parentId?: number // 대댓글을 위한 부모 댓글 ID
  [key: string]: any // 다른 필드들도 허용
}

export interface CommentRequestDto {
  content: string
  parentId?: number // 대댓글을 위한 부모 댓글 ID (선택사항)
}

export interface CommentUpdateRequestDto {
  content: string
}

// 게시글 API 함수들
export const postsApi = {
  // 전체 게시글 조회
  getAllPosts: async (): Promise<PostResponseDto[]> => {
    const response = await apiClient.get('/api/posts')
    // 응답이 배열이면 그대로 반환, 객체이고 data 필드가 있으면 data 반환
    if (Array.isArray(response)) {
      return response
    } else if (response && typeof response === 'object' && 'data' in response) {
      return response.data
    } else {
      console.error('예상하지 못한 API 응답 구조:', response)
      return []
    }
  },

  // 게시글 상세 조회
  getPostById: async (id: number): Promise<PostResponseDto> => {
    const response = await apiClient.get(`/api/posts/${id}`)
    if (response && typeof response === 'object' && 'data' in response) {
      return response.data
    }
    return response
  },

  // 카테고리별 게시글 조회
  getPostsByCategory: async (categoryId: number): Promise<PostResponseDto[]> => {
    const response = await apiClient.get(`/api/posts/category/${categoryId}`)
    if (Array.isArray(response)) {
      return response
    } else if (response && typeof response === 'object' && 'data' in response) {
      return response.data
    } else {
      console.error('예상하지 못한 API 응답 구조:', response)
      return []
    }
  },

  // 게시글 작성
  createPost: async (postData: PostRequestDto): Promise<number> => {
    const response = await apiClient.post('/api/posts', postData)
    if (response && typeof response === 'object' && 'data' in response) {
      return response.data
    }
    return response
  },

  // 게시글 수정 (제목과 내용만 수정 가능)
  updatePost: async (id: number, postData: PostUpdateDto): Promise<void> => {
    console.log('PUT 요청 데이터:', postData)
    await apiClient.put(`/api/posts/${id}`, postData)
  },

  // 게시글 삭제
  deletePost: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/posts/${id}`)
  }
}

// 댓글 API 함수들 (백엔드 API에 맞춰서 수정)
export const commentsApi = {
  // 게시글의 댓글 조회
  getCommentsByPostId: async (postId: number): Promise<CommentResponseDto[]> => {
    const response = await apiClient.get(`/api/posts/${postId}/comments`)
    if (Array.isArray(response)) {
      return response
    } else if (response && typeof response === 'object' && 'data' in response) {
      return response.data
    } else {
      console.error('예상하지 못한 댓글 API 응답 구조:', response)
      return []
    }
  },

  // 댓글 작성
  createComment: async (postId: number, commentData: CommentRequestDto): Promise<any> => {
    const response = await apiClient.post(`/api/posts/${postId}/comments`, commentData)
    if (response && typeof response === 'object' && 'data' in response) {
      return response.data
    }
    return response
  },

  // 댓글 수정
  updateComment: async (postId: number, commentId: number, updateData: CommentUpdateRequestDto): Promise<void> => {
    await apiClient.put(`/api/posts/${postId}/comments/${commentId}`, updateData)
  },

  // 댓글 삭제
  deleteComment: async (postId: number, commentId: number): Promise<void> => {
    await apiClient.delete(`/api/posts/${postId}/comments/${commentId}`)
  }
}

// 카테고리 매핑
export const CATEGORIES = {
  GENERAL: 1,    // 일반
  NOTICE: 2,     // 공지사항
  QNA: 3         // 질문&답변
} as const

export const CATEGORY_NAMES = {
  [CATEGORIES.GENERAL]: '일반',
  [CATEGORIES.NOTICE]: '공지사항',
  [CATEGORIES.QNA]: '질문&답변'
} as const 