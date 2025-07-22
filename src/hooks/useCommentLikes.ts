import { useState, useEffect } from 'react'
import { likesApi } from '../api/posts'
import type { CommentLikeResponseDto } from '../api/posts'
import { isAuthenticated } from '../api/auth'

export const useCommentLikes = (postId: number, commentId: number) => {
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [loading, setLoading] = useState(false)

  console.log(`=== useCommentLikes 초기화 [comment-${commentId}] ===`)

  // 댓글 좋아요 상태 로드
  const loadCommentLikeStatus = async () => {
    try {
      setLoading(true)
      console.log(`댓글 좋아요 상태 조회 시작 - commentId: ${commentId}`)
      
      // 댓글 좋아요 상태 조회 (로그인 사용자만)
      if (isAuthenticated()) {
        const response = await likesApi.getCommentLikeStatus(postId, commentId)
        console.log(`댓글 좋아요 상태 응답:`, response)
        
        // 새로운 응답 형식 사용
        setIsLiked(response.commentLiked)
        setLikeCount(response.likeCount)
        console.log(`댓글 좋아요 상태: ${response.commentLiked}, 수: ${response.likeCount}`)
      } else {
        // 비로그인 사용자는 좋아요 수만 조회
        const count = await likesApi.getCommentLikeCount(postId, commentId)
        setIsLiked(false)
        setLikeCount(count)
        console.log(`비로그인 사용자 - 댓글 좋아요 수: ${count}`)
      }
    } catch (error) {
      console.error(`댓글(${commentId}) 좋아요 상태 로드 실패:`, error)
      setIsLiked(false)
      setLikeCount(0)
    } finally {
      setLoading(false)
    }
  }

  // 초기 로드
  useEffect(() => {
    console.log(`=== useCommentLikes useEffect 실행 [comment-${commentId}] ===`)
    loadCommentLikeStatus()
  }, [postId, commentId])

  // 댓글 좋아요 토글
  const toggleLike = async () => {
    if (!isAuthenticated()) {
      console.warn('로그인이 필요합니다')
      return
    }

    const originalIsLiked = isLiked
    const originalCount = likeCount

    try {
      setLoading(true)
      
      const newIsLiked = !isLiked
      const newCount = isLiked ? likeCount - 1 : likeCount + 1
      
      setIsLiked(newIsLiked)
      setLikeCount(newCount)
      
      console.log(`댓글(${commentId}) 좋아요 토글 - ${isLiked} -> ${newIsLiked}`)
      
      await likesApi.toggleCommentLike(postId, commentId)
      console.log(`댓글(${commentId}) 좋아요 토글 완료`)
      
    } catch (error) {
      console.error('댓글 좋아요 토글 실패:', error)
      setIsLiked(originalIsLiked)
      setLikeCount(originalCount)
    } finally {
      setLoading(false)
    }
  }

  return {
    isLiked,
    likeCount,
    loading,
    toggleLike
  }
} 