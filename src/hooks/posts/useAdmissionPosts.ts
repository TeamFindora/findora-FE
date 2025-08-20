import { usePostsList } from './usePostsList'

export const useAdmissionPosts = () => {
  const { posts, loading, error, refetch } = usePostsList({
    categoryId: 3, // 입시관 카테고리만
    onSuccess: (posts) => {
      console.log('입시관 API 데이터 로드 완료:', posts.length, '개')
    }
  })

  return {
    posts,
    loading,
    error,
    refetch
  }
}