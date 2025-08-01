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
      
      let postsArray = []
      
      if (Array.isArray(allPosts)) {
        console.log('API 데이터 사용:', allPosts.length, '개의 게시글')
        postsArray = allPosts
      } else if (allPosts && typeof allPosts === 'object' && 'data' in allPosts && Array.isArray((allPosts as any).data)) {
        console.log('API data 필드 사용:', (allPosts as any).data.length, '개의 게시글')
        postsArray = (allPosts as any).data
      } else {
        console.log('API 응답이 예상과 다름:', allPosts)
        return []
      }
      
      // 커뮤니티 페이지용: 입시관 카테고리(3번) 제외
      // API 응답에서 categoryId는 post.category.id 형태로 제공됨
      const communityPosts = postsArray.filter(post => {
        const categoryId = post.category?.id || post.categoryId
        return categoryId !== 3
      })
      console.log('커뮤니티 페이지 필터링 완료:', communityPosts.length, '개 (입시관 제외)')
      console.log('필터링된 게시글 카테고리들:', communityPosts.map(p => p.category?.id || p.categoryId))
      
      return communityPosts
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