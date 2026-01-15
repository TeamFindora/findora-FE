import { useState } from 'react'
import { useApiCall } from '../common/useApiCall'
import { commentsApi } from '../../api/posts'
import type { CommentResponseDto } from '../../api/posts'

interface UseCommentsOptions {
  postId: number
}

export const useComments = ({ postId }: UseCommentsOptions) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const {
    data: comments,
    loading,
    error,
    refetch
  } = useApiCall({
    apiFunction: () => commentsApi.getCommentsByPostId(postId),
    dependencies: [postId, refreshTrigger],
    initialData: [],
    onSuccess: (data) => {
      console.log(`댓글 로드 완료 - postId: ${postId}, 댓글 수: ${data.length}`)
    },
    onError: (err) => {
      console.error('댓글 로드 실패:', err)
    }
  })

  // 댓글을 계층적으로 구조화 (부모 댓글과 대댓글 분리)
  const organizedComments = (comments || []).reduce((acc, comment) => {
    if (!comment.parentCommentId) {
      // 부모 댓글
      acc.push({
        ...comment,
        replies: []
      })
    } else {
      // 대댓글 - 부모 댓글을 찾아서 replies에 추가
      const parentComment = acc.find(c => c.id === comment.parentCommentId)
      if (parentComment) {
        parentComment.replies.push(comment)
      }
    }
    return acc
  }, [] as (CommentResponseDto & { replies: CommentResponseDto[] })[])

  const refreshComments = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  return {
    comments: organizedComments,
    rawComments: comments || [],
    loading,
    error,
    refetch,
    refreshComments
  }
}