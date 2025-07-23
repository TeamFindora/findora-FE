import { useState, useEffect } from 'react'
import { commentsApi } from '../api/posts'

export const useCommentCount = (postId: number) => {
  const [commentCount, setCommentCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCommentCount = async () => {
      try {
        setLoading(true)
        const comments = await commentsApi.getCommentsByPostId(postId)
        setCommentCount(comments.length)
      } catch (error) {
        console.error('댓글 수 조회 실패:', error)
        setCommentCount(0)
      } finally {
        setLoading(false)
      }
    }

    loadCommentCount()
  }, [postId])

  return { commentCount, loading }
}

// 여러 게시글의 댓글 수를 한번에 조회하는 훅
export const useCommentCounts = (postIds: number[]) => {
  const [commentCounts, setCommentCounts] = useState<Record<number, number>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCommentCounts = async () => {
      try {
        setLoading(true)
        const counts: Record<number, number> = {}
        
        // 모든 게시글의 댓글 수를 병렬로 조회
        const promises = postIds.map(async (postId) => {
          try {
            const comments = await commentsApi.getCommentsByPostId(postId)
            counts[postId] = comments.length
          } catch (error) {
            console.error(`게시글 ${postId} 댓글 수 조회 실패:`, error)
            counts[postId] = 0
          }
        })
        
        await Promise.all(promises)
        setCommentCounts(counts)
      } catch (error) {
        console.error('댓글 수 일괄 조회 실패:', error)
      } finally {
        setLoading(false)
      }
    }

    if (postIds.length > 0) {
      loadCommentCounts()
    } else {
      setLoading(false)
    }
  }, [postIds.join(',')])

  return { commentCounts, loading }
} 