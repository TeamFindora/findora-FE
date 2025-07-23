import { usePostDetail } from '../posts/usePostDetail'
import { usePostForm } from '../posts/usePostForm'
import { usePermissions } from '../common/usePermissions'

interface UseEditPostOptions {
  postId: number
}

export const useEditPost = ({ postId }: UseEditPostOptions) => {
  // 게시글 상세 정보 로드
  const {
    post,
    loading: postLoading,
    error: postError
  } = usePostDetail({
    postId,
    onSuccess: (post) => {
      console.log('EditPost - 게시글 로드 완료:', post.title)
    }
  })

  // 권한 확인
  const { canEditPost } = usePermissions({ post })

  // 폼 관리
  const formProps = usePostForm({
    mode: 'edit',
    postId,
    initialTitle: post?.title || '',
    initialContent: post?.content || ''
  })

  return {
    // 게시글 데이터
    post,
    postLoading,
    postError,
    
    // 권한
    canEditPost,
    
    // 폼 관리
    ...formProps,
    
    // 통합 로딩 상태
    loading: postLoading || formProps.submitting
  }
}