import { usePostDetail } from '../posts/usePostDetail'
import { useComments } from '../comments/useComments'
import { useCommentCreate } from '../comments/useCommentCreate'
import { useCommentEdit } from '../comments/useCommentEdit'
import { useReplyManagement } from '../comments/useReplyManagement'
import { usePermissions } from '../common/usePermissions'

interface UsePostDetailPageOptions {
  postId: number
}

export const usePostDetailPage = ({ postId }: UsePostDetailPageOptions) => {
  // 게시글 상세 정보
  const {
    post,
    loading: postLoading,
    error: postError,
    refetch: refetchPost
  } = usePostDetail({
    postId,
    onSuccess: (post) => {
      console.log('PostDetailPage - 게시글 로드 완료:', post.title)
    }
  })

  // 댓글 목록
  const {
    comments,
    rawComments,
    loading: commentsLoading,
    error: commentsError,
    refreshComments
  } = useComments({ postId })

  // 댓글 작성
  const commentCreate = useCommentCreate({
    postId,
    onSuccess: () => {
      console.log('댓글 작성 완료 - 댓글 목록 새로고침')
      refreshComments()
    }
  })

  // 댓글 수정/삭제
  const commentEdit = useCommentEdit({
    onSuccess: () => {
      console.log('댓글 수정/삭제 완료 - 댓글 목록 새로고침')
      refreshComments()
    }
  })

  // 대댓글 관리
  const replyManagement = useReplyManagement({
    postId,
    onSuccess: () => {
      console.log('대댓글 작성 완료 - 댓글 목록 새로고침')
      refreshComments()
    }
  })

  // 권한 관리
  const permissions = usePermissions({ post })

  // 전체 로딩 상태
  const loading = postLoading || commentsLoading

  // 전체 에러 상태
  const error = postError || commentsError

  // 데이터 새로고침
  const refreshAll = () => {
    refetchPost()
    refreshComments()
  }

  return {
    // 게시글 데이터
    post,
    postLoading,
    postError,
    
    // 댓글 데이터
    comments,
    rawComments,
    commentsLoading,
    commentsError,
    
    // 댓글 작성
    ...commentCreate,
    
    // 댓글 수정/삭제
    ...commentEdit,
    
    // 대댓글 관리
    ...replyManagement,
    
    // 권한
    ...permissions,
    
    // 통합 상태
    loading,
    error,
    refreshAll,
    refreshComments
  }
}