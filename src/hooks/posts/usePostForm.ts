import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { isAuthenticated, getCurrentUser } from '../../api/auth'
import { postsApi, CATEGORIES } from '../../api/posts'

interface UsePostFormOptions {
  mode: 'create' | 'edit'
  postId?: number
  initialTitle?: string
  initialContent?: string
  onSuccess?: () => void
  onError?: (error: any) => void
}

export const usePostForm = ({
  mode,
  postId,
  initialTitle = '',
  initialContent = '',
  onSuccess,
  onError
}: UsePostFormOptions) => {
  const navigate = useNavigate()
  const [title, setTitle] = useState(initialTitle)
  const [content, setContent] = useState(initialContent)
  const [submitting, setSubmitting] = useState(false)

  // 인증 확인
  if (!isAuthenticated()) {
    alert('로그인이 필요합니다.')
    navigate('/login')
    return {
      title: '',
      content: '',
      submitting: false,
      handleTitleChange: () => {},
      handleContentChange: () => {},
      handleSubmit: () => {},
      handleCancel: () => {}
    }
  }

  const handleTitleChange = (value: string) => {
    setTitle(value)
  }

  const handleContentChange = (value: string) => {
    setContent(value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      alert('제목을 입력해주세요.')
      return
    }

    if (!content.trim()) {
      alert('내용을 입력해주세요.')
      return
    }

    try {
      setSubmitting(true)
      
      if (mode === 'create') {
        const currentUser = getCurrentUser()
        if (!currentUser || !currentUser.userId) {
          alert('사용자 정보를 찾을 수 없습니다.')
          return
        }
        
        console.log('게시글 작성 시작:', { title: title.trim(), content: content.trim() })
        await postsApi.createPost({
          title: title.trim(),
          content: content.trim(),
          categoryId: CATEGORIES.GENERAL,
          userId: currentUser.userId
        })
        console.log('게시글 작성 완료')
        alert('게시글이 작성되었습니다.')
      } else if (mode === 'edit' && postId) {
        console.log('게시글 수정 시작:', { postId, title: title.trim(), content: content.trim() })
        await postsApi.updatePost(postId, {
          title: title.trim(),
          content: content.trim()
        })
        console.log('게시글 수정 완료')
        alert('게시글이 수정되었습니다.')
      }

      if (onSuccess) {
        onSuccess()
      } else {
        navigate('/community')
      }
    } catch (error) {
      console.error(`게시글 ${mode === 'create' ? '작성' : '수정'} 실패:`, error)
      alert(`게시글 ${mode === 'create' ? '작성' : '수정'}에 실패했습니다.`)
      
      if (onError) {
        onError(error)
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleCancel = () => {
    if (window.confirm('작성을 취소하시겠습니까? 작성한 내용이 사라집니다.')) {
      navigate('/community')
    }
  }

  const resetForm = () => {
    setTitle('')
    setContent('')
  }

  return {
    title,
    content,
    submitting,
    handleTitleChange,
    handleContentChange,
    handleSubmit,
    handleCancel,
    resetForm,
    isValid: title.trim() && content.trim()
  }
}