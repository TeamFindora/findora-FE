import { useState, useEffect } from 'react'
import { likesApi } from '../api/posts'
import type { PostLikeResponseDto } from '../api/posts'
import { isAuthenticated } from '../api/auth'

export const usePostLikes = (postId: number) => {
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [loading, setLoading] = useState(false)

  console.log(`=== usePostLikes 초기화 [post-${postId}] ===`)

  // 게시글 좋아요 상태 로드
  const loadPostLikeStatus = async () => {
    try {
      setLoading(true)
      console.log(`게시글 좋아요 상태 조회 시작 - postId: ${postId}`)
      
      // 좋아요 상태 조회 (로그인 사용자만)
      if (isAuthenticated()) {
        const response = await likesApi.getPostLikeStatus(postId)
        console.log(`게시글 좋아요 상태 응답:`, response)
        
        // 새로운 응답 형식 사용
        setIsLiked(response.postLiked)
        setLikeCount(response.likeCount)
        console.log(`게시글 좋아요 상태: ${response.postLiked}, 수: ${response.likeCount}`)
      } else {
        // 비로그인 사용자는 좋아요 수만 조회
        const count = await likesApi.getPostLikeCount(postId)
        setIsLiked(false)
        setLikeCount(count)
        console.log(`비로그인 사용자 - 게시글 좋아요 수: ${count}`)
      }
    } catch (error) {
      console.error(`게시글 좋아요 상태 로드 실패:`, error)
      setIsLiked(false)
      setLikeCount(0)
    } finally {
      setLoading(false)
    }
  }

  // 초기 로드
  useEffect(() => {
    console.log(`=== usePostLikes useEffect 실행 [post-${postId}] ===`)
    loadPostLikeStatus()
    
    return () => {
      console.log(`=== usePostLikes 클린업 [post-${postId}] ===`)
    }
  }, [postId])

  // 게시글 좋아요 토글
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
      
      console.log(`게시글 좋아요 토글 시작 - ${isLiked} -> ${newIsLiked}`)
      console.log(`게시글 좋아요 토글 API 호출 - postId: ${postId}`)
      
      await likesApi.togglePostLike(postId)
      console.log(`게시글 좋아요 토글 서버 요청 완료`)
      
      // 서버 상태 동기화
      await loadPostLikeStatus()
      
    } catch (error) {
      console.error('게시글 좋아요 토글 실패:', error)
      setIsLiked(originalIsLiked)
      setLikeCount(originalCount)
      alert('좋아요 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
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