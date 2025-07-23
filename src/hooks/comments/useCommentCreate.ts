import { useState } from 'react'
import { commentsApi } from '../../api/posts'
import { isAuthenticated } from '../../api/auth'

interface UseCommentCreateOptions {
  postId: number
  onSuccess?: () => void
  onError?: (error: any) => void
}

export const useCommentCreate = ({ postId, onSuccess, onError }: UseCommentCreateOptions) => {
  const [commentContent, setCommentContent] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isAuthenticated()) {
      alert('로그인이 필요합니다.')
      return
    }

    if (!commentContent.trim()) {
      alert('댓글 내용을 입력해주세요.')
      return
    }

    try {
      setSubmittingComment(true)
      console.log('댓글 작성 시작:', { postId, content: commentContent })
      
      await commentsApi.createComment({
        postId,
        content: commentContent
      })
      
      console.log('댓글 작성 완료')
      setCommentContent('')
      
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error('댓글 작성 실패:', error)
      alert('댓글 작성에 실패했습니다.')
      
      if (onError) {
        onError(error)
      }
    } finally {
      setSubmittingComment(false)
    }
  }

  const handleCommentContentChange = (value: string) => {
    setCommentContent(value)
  }

  const resetComment = () => {
    setCommentContent('')
  }

  return {
    commentContent,
    submittingComment,
    handleSubmitComment,
    handleCommentContentChange,
    resetComment
  }
}