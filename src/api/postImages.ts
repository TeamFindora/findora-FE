// API 기본 설정
const API_BASE_URL = 'http://localhost:8080' // 백엔드 서버 URL

// API 클라이언트 함수 (멀티파트 폼 데이터용)
const apiClient = {
  // 멀티파트 폼 데이터 전송 (이미지 업로드용)
  postMultipart: async (url: string, formData: FormData) => {
    const accessToken = localStorage.getItem('accessToken')
    const tokenType = localStorage.getItem('tokenType') || 'Bearer'
    
    console.log('POST Multipart 요청 URL:', `${API_BASE_URL}${url}`)
    console.log('POST Multipart 요청 토큰:', accessToken)
    
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'POST',
      headers: {
        // Content-Type을 설정하지 않음 - 브라우저가 자동으로 multipart/form-data로 설정
        ...(accessToken && { Authorization: `${tokenType} ${accessToken}` })
      },
      body: formData
    })
    
    console.log('POST Multipart 응답 상태:', response.status)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.log('POST Multipart 에러 응답:', errorText)
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
    }
    
    const result = await response.json()
    console.log('POST Multipart 성공 응답:', result)
    return result
  },

  // PUT 멀티파트 폼 데이터 전송 (이미지 수정용)
  putMultipart: async (url: string, formData: FormData) => {
    const accessToken = localStorage.getItem('accessToken')
    const tokenType = localStorage.getItem('tokenType') || 'Bearer'
    
    console.log('PUT Multipart 요청 URL:', `${API_BASE_URL}${url}`)
    console.log('PUT Multipart 요청 토큰:', accessToken)
    
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'PUT',
      headers: {
        // Content-Type을 설정하지 않음 - 브라우저가 자동으로 multipart/form-data로 설정
        ...(accessToken && { Authorization: `${tokenType} ${accessToken}` })
      },
      body: formData
    })
    
    console.log('PUT Multipart 응답 상태:', response.status)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.log('PUT Multipart 에러 응답:', errorText)
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
    }
    
    const result = await response.json()
    console.log('PUT Multipart 성공 응답:', result)
    return result
  },

  // GET 요청
  get: async (url: string) => {
    const accessToken = localStorage.getItem('accessToken')
    const tokenType = localStorage.getItem('tokenType') || 'Bearer'
    
    console.log('GET 요청 URL:', `${API_BASE_URL}${url}`)
    
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
    console.log('GET 성공 응답:', data)
    return data
  },

  // DELETE 요청
  delete: async (url: string) => {
    const accessToken = localStorage.getItem('accessToken')
    const tokenType = localStorage.getItem('tokenType') || 'Bearer'
    
    console.log('DELETE 요청 URL:', `${API_BASE_URL}${url}`)
    
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken && { Authorization: `${tokenType} ${accessToken}` })
      }
    })
    
    console.log('DELETE 응답 상태:', response.status)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.log('DELETE 에러 응답:', errorText)
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
    }
    
    // 응답이 있으면 JSON으로 파싱, 없으면 빈 객체 반환
    const responseText = await response.text()
    return responseText ? JSON.parse(responseText) : {}
  }
}

// 이미지 관련 타입 정의
export interface PostImageResponseDto {
  id: number
  imageUrl: string
}

export interface SuccessResponse {
  message: string
  timestamp: string
}

// 게시글 이미지 API 함수들
export const postImagesApi = {
  // 게시글 이미지 업로드 (최대 10개)
  uploadImages: async (postId: number, images: File[]): Promise<SuccessResponse> => {
    const formData = new FormData()
    
    // 이미지 파일들을 FormData에 추가
    images.forEach((image) => {
      formData.append('images', image)
    })
    
    console.log('업로드할 이미지 개수:', images.length)
    console.log('업로드할 이미지 파일들:', images.map(img => ({ name: img.name, size: img.size, type: img.type })))
    
    const response = await apiClient.postMultipart(`/api/posts/${postId}/images`, formData)
    return response
  },

  // 게시글 이미지 목록 조회
  getImages: async (postId: number): Promise<PostImageResponseDto[]> => {
    const response = await apiClient.get(`/api/posts/${postId}/images`)
    
    // 응답이 배열이면 그대로 반환, 객체이고 data 필드가 있으면 data 반환
    if (Array.isArray(response)) {
      return response
    } else if (response && typeof response === 'object' && 'data' in response) {
      return response.data
    } else {
      console.error('예상하지 못한 이미지 API 응답 구조:', response)
      return []
    }
  },

  // 게시글 이미지 수정 (기존 이미지 삭제하고 새로운 이미지 추가)
  updateImages: async (
    postId: number, 
    newImages?: File[], 
    remainImageIds?: number[]
  ): Promise<SuccessResponse> => {
    const formData = new FormData()
    
    // 새로 추가할 이미지 파일들을 FormData에 추가
    if (newImages && newImages.length > 0) {
      newImages.forEach((image) => {
        formData.append('images', image)
      })
    }
    
    // 유지할 기존 이미지 ID들을 FormData에 추가
    if (remainImageIds && remainImageIds.length > 0) {
      remainImageIds.forEach((id) => {
        formData.append('remainImageIds', id.toString())
      })
    }
    
    console.log('수정할 게시글 ID:', postId)
    console.log('새로 추가할 이미지 개수:', newImages?.length || 0)
    console.log('유지할 기존 이미지 ID들:', remainImageIds)
    
    const response = await apiClient.putMultipart(`/api/posts/${postId}/images`, formData)
    return response
  },

  // 게시글 모든 이미지 삭제
  deleteAllImages: async (postId: number): Promise<SuccessResponse> => {
    console.log('모든 이미지 삭제할 게시글 ID:', postId)
    const response = await apiClient.delete(`/api/posts/${postId}/images`)
    return response
  },

  // 개별 이미지 삭제
  deleteImage: async (postId: number, imageId: number): Promise<SuccessResponse> => {
    console.log('삭제할 게시글 ID:', postId, '이미지 ID:', imageId)
    const response = await apiClient.delete(`/api/posts/${postId}/images/${imageId}`)
    return response
  }
}

// 이미지 파일 유효성 검사 유틸리티 함수들
export const imageValidation = {
  // 지원되는 이미지 형식
  supportedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  
  // 최대 파일 크기 (10MB)
  maxFileSize: 10 * 1024 * 1024,
  
  // 최대 업로드 개수
  maxImageCount: 10,
  
  // 이미지 파일 유효성 검사
  validateImageFile: (file: File): { valid: boolean; error?: string } => {
    // 파일 타입 검사
    if (!imageValidation.supportedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `지원되지 않는 파일 형식입니다. 지원 형식: ${imageValidation.supportedTypes.join(', ')}`
      }
    }
    
    // 파일 크기 검사
    if (file.size > imageValidation.maxFileSize) {
      return {
        valid: false,
        error: `파일 크기가 너무 큽니다. 최대 ${Math.round(imageValidation.maxFileSize / (1024 * 1024))}MB까지 업로드 가능합니다.`
      }
    }
    
    return { valid: true }
  },
  
  // 여러 이미지 파일들 유효성 검사
  validateImageFiles: (files: File[]): { valid: boolean; errors: string[] } => {
    const errors: string[] = []
    
    // 개수 검사
    if (files.length > imageValidation.maxImageCount) {
      errors.push(`최대 ${imageValidation.maxImageCount}개의 이미지만 업로드 가능합니다.`)
      return { valid: false, errors }
    }
    
    // 각 파일 유효성 검사
    files.forEach((file, index) => {
      const validation = imageValidation.validateImageFile(file)
      if (!validation.valid && validation.error) {
        errors.push(`파일 ${index + 1} (${file.name}): ${validation.error}`)
      }
    })
    
    return {
      valid: errors.length === 0,
      errors
    }
  }
}