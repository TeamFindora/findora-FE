import { useState } from 'react'
import { commentsApi } from '../../api/posts'

interface UseCommentEditOptions {
  onSuccess?: () => void
  onError?: (error: any) => void
}

export const useCommentEdit = ({ onSuccess, onError }: UseCommentEditOptions = {}) => {
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null)
  const [editingContent, setEditingContent] = useState('')
  const [submittingEdit, setSubmittingEdit] = useState(false)

  const startEditing = (commentId: number, currentContent: string) => {
    setEditingCommentId(commentId)
    setEditingContent(currentContent)
  }

  const cancelEditing = () => {
    setEditingCommentId(null)
    setEditingContent('')
  }

  const handleUpdateComment = async (commentId: number) => {
    if (!editingContent.trim()) {
      alert('댓글 내용을 입력해주세요.')
      return
    }

    try {
      setSubmittingEdit(true)
      console.log('댓글 수정 시작:', { commentId, content: editingContent })
      
      await commentsApi.updateComment(commentId, {
        content: editingContent
      })
      
      console.log('댓글 수정 완료')
      setEditingCommentId(null)
      setEditingContent('')
      
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error('댓글 수정 실패:', error)
      alert('댓글 수정에 실패했습니다.')
      
      if (onError) {
        onError(error)
      }
    } finally {
      setSubmittingEdit(false)
    }
  }

  const handleDeleteComment = async (commentId: number) => {
    if (!window.confirm('댓글을 삭제하시겠습니까?')) {
      return
    }

    try {
      console.log('댓글 삭제 시작:', commentId)
      await commentsApi.deleteComment(commentId)
      console.log('댓글 삭제 완료')
      
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error('댓글 삭제 실패:', error)
      alert('댓글 삭제에 실패했습니다.')
      
      if (onError) {
        onError(error)
      }
    }
  }

  return {
    editingCommentId,
    editingContent,
    submittingEdit,
    setEditingContent,
    startEditing,
    cancelEditing,
    handleUpdateComment,
    handleDeleteComment,
    isEditing: (commentId: number) => editingCommentId === commentId
  }
}