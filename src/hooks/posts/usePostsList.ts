import { useApiCall } from '../common/useApiCall'
import { postsApi } from '../../api/posts'
import type { PostResponseDto } from '../../api/posts'

interface UsePostsListOptions {
  categoryId?: number        // 특정 카테고리만
  excludeCategoryId?: number // 특정 카테고리 제외
  onSuccess?: (posts: PostResponseDto[]) => void
  onError?: (error: any) => void
}

export const usePostsList = (options: UsePostsListOptions = {}) => {
  const { categoryId, excludeCategoryId, ...otherOptions } = options
  
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
      
      // 카테고리별 필터링
      let filteredPosts = postsArray
      
      if (categoryId) {
        // 특정 카테고리만
        filteredPosts = postsArray.filter((post: any) => {
          const postCategoryId = post.category?.id || post.categoryId
          const isMatch = postCategoryId === categoryId
          console.log(`게시글 "${post.title}" - 카테고리 ID: ${postCategoryId}, 매치: ${isMatch}`)
          return isMatch
        })
        console.log(`카테고리 ${categoryId} 필터링 완료:`, filteredPosts.length, '개')
      } else if (excludeCategoryId) {
        // 특정 카테고리 제외
        filteredPosts = postsArray.filter((post: any) => {
          const postCategoryId = post.category?.id || post.categoryId
          const isExcluded = postCategoryId !== excludeCategoryId
          console.log(`게시글 "${post.title}" - 카테고리 ID: ${postCategoryId}, 제외 여부: ${isExcluded}`)
          return isExcluded
        })
        console.log(`카테고리 ${excludeCategoryId} 제외 필터링 완료:`, filteredPosts.length, '개')
        console.log(`제외된 게시글들:`, postsArray.filter((post: any) => {
          const postCategoryId = post.category?.id || post.categoryId
          return postCategoryId === excludeCategoryId
        }).map((p: any) => ({ id: p.id, title: p.title, categoryId: p.category?.id || p.categoryId })))
      } else {
        // 필터링 없음 - 모든 글
        console.log('카테고리 필터링 없음:', postsArray.length, '개')
      }
      
      console.log('최종 필터링된 게시글 카테고리들:', filteredPosts.map((p: any) => p.category?.id || p.categoryId))
      console.log('최종 필터링된 게시글 제목들:', filteredPosts.map((p: any) => p.title))
      
      return filteredPosts
    },
    dependencies: [categoryId, excludeCategoryId],
    initialData: [],
    onSuccess: otherOptions.onSuccess,
    onError: otherOptions.onError
  })

  return {
    posts: posts || [],
    loading,
    error,
    refetch,
    reset
  }
}