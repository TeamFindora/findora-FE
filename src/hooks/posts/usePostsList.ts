import { useApiCall } from '../common/useApiCall'
import { postsApi } from '../../api/posts'
import type { PostResponseDto } from '../../api/posts'

interface UsePostsListOptions {
  onSuccess?: (posts: PostResponseDto[]) => void
  onError?: (error: any) => void
}

export const usePostsList = (options: UsePostsListOptions = {}) => {
  const {
    data: posts,
    loading,
    error,
    refetch,
    reset
  } = useApiCall({
    apiFunction: async () => {
      const allPosts = await postsApi.getAllPosts()
      console.log('Posts API 응답 데이터:', allPosts)
      
      if (Array.isArray(allPosts)) {
        console.log('API 데이터 사용:', allPosts.length, '개의 게시글')
        return allPosts
      } else if (allPosts && typeof allPosts === 'object' && 'data' in allPosts && Array.isArray((allPosts as any).data)) {
        console.log('API data 필드 사용:', (allPosts as any).data.length, '개의 게시글')
        return (allPosts as any).data
      } else {
        console.log('API 응답이 예상과 다름:', allPosts)
        return []
      }
    },
    dependencies: [],
    initialData: [],
    onSuccess: options.onSuccess,
    onError: options.onError
  })

  return {
    posts: posts || [],
    loading,
    error,
    refetch,
    reset
  }
}