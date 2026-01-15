import { useState } from 'react'
import { commentsApi } from '../../api/posts'
import { isAuthenticated } from '../../api/auth'

interface UseReplyManagementOptions {
  postId: number
  onSuccess?: () => void
  onError?: (error: any) => void
}

export const useReplyManagement = ({ postId, onSuccess, onError }: UseReplyManagementOptions) => {
  const [replyingToCommentId, setReplyingToCommentId] = useState<number | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const [submittingReply, setSubmittingReply] = useState(false)

  const startReply = (commentId: number) => {
    if (!isAuthenticated()) {
      alert('로그인이 필요합니다.')
      return
    }
    setReplyingToCommentId(commentId)
    setReplyContent('')
  }

  const cancelReply = () => {
    setReplyingToCommentId(null)
    setReplyContent('')
  }

  const handleSubmitReply = async (parentCommentId: number) => {
    if (!isAuthenticated()) {
      alert('로그인이 필요합니다.')
      return
    }

    if (!replyContent.trim()) {
      alert('답글 내용을 입력해주세요.')
      return
    }

    try {
      setSubmittingReply(true)
      console.log('대댓글 작성 시작:', { postId, parentCommentId, content: replyContent })
      
      await commentsApi.createReply({
        postId,
        parentCommentId,
        content: replyContent
      })
      
      console.log('대댓글 작성 완료')
      setReplyingToCommentId(null)
      setReplyContent('')
      
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error('대댓글 작성 실패:', error)
      alert('답글 작성에 실패했습니다.')
      
      if (onError) {
        onError(error)
      }
    } finally {
      setSubmittingReply(false)
    }
  }

  return {
    replyingToCommentId,
    replyContent,
    submittingReply,
    setReplyContent,
    startReply,
    cancelReply,
    handleSubmitReply,
    isReplying: (commentId: number) => replyingToCommentId === commentId
  }
}