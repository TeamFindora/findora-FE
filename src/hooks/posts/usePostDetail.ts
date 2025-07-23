import { useApiCall } from '../common/useApiCall'
import { postsApi } from '../../api/posts'
import type { PostResponseDto } from '../../api/posts'

interface UsePostDetailOptions {
  postId: number
  onSuccess?: (post: PostResponseDto) => void
  onError?: (error: any) => void
}

export const usePostDetail = ({ postId, onSuccess, onError }: UsePostDetailOptions) => {
  const {
    data: post,
    loading,
    error,
    refetch,
    reset
  } = useApiCall({
    apiFunction: () => postsApi.getPostById(postId),
    dependencies: [postId],
    onSuccess: (data) => {
      console.log('게시글 상세 정보 로드 완료:', data)
      if (onSuccess) {
        onSuccess(data)
      }
    },
    onError: (err) => {
      console.error('게시글 로드 실패:', err)
      if (onError) {
        onError(err)
      }
    }
  })

  return {
    post,
    loading,
    error,
    refetch,
    reset
  }
}