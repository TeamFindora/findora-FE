import { useState, useEffect } from 'react'
import { commentsApi } from '../api/posts'

interface CommentCountProps {
  postId: number
}

const CommentCount = ({ postId }: CommentCountProps) => {
  const [count, setCount] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCommentCount = async () => {
      try {
        const comments = await commentsApi.getCommentsByPostId(postId)
        setCount(comments.length)
      } catch (error) {
        console.error('댓글 수 로드 실패:', error)
        setCount(0)
      } finally {
        setLoading(false)
      }
    }

    loadCommentCount()
  }, [postId])

  if (loading) {
    return <span className="text-xs text-slate-500">💬 ...</span>
  }

  return <span className="text-xs text-slate-600">💬 {count}</span>
}

export default CommentCount 