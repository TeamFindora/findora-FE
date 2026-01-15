import { useState, useEffect } from 'react'
import { likesApi } from '../api/posts'
import type { LikeResponseDto } from '../api/posts'
import { isAuthenticated } from '../api/auth'

export const useLikes = (postId: number, commentId?: number) => {
  // 고유 식별자로 완전히 독립적인 상태 관리
  const uniqueKey = commentId ? `comment-${commentId}` : `post-${postId}`
  
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [loading, setLoading] = useState(false)
  
  console.log(`=== useLikes 초기화 [${uniqueKey}] ===`)

  // 좋아요 상태와 수를 함께 로드
  const loadLikeStatus = async () => {
    try {
      setLoading(true)
      
      // 좋아요 수는 항상 조회 가능
      let count: number
      if (commentId) {
        count = await likesApi.getCommentLikeCount(postId, commentId)
      } else {
        count = await likesApi.getPostLikeCount(postId)
      }
      setLikeCount(count)
      
      // 좋아요 상태는 로그인된 사용자만 조회 가능
      if (isAuthenticated()) {
        let response: LikeResponseDto
        
        if (commentId) {
          console.log(`댓글 좋아요 상태 조회 시작 - postId: ${postId}, commentId: ${commentId}`)
          response = await likesApi.getCommentLikeStatus(postId, commentId)
          console.log(`댓글 좋아요 상태 응답:`, response)
        } else {
          console.log(`게시글 좋아요 상태 조회 시작 - postId: ${postId}`)
          response = await likesApi.getPostLikeStatus(postId)
          console.log(`게시글 좋아요 상태 응답:`, response)
        }
        
        // liked가 undefined인 경우 처리
        const likedStatus = response.liked !== undefined ? response.liked : false
        setIsLiked(likedStatus)
        
        const type = commentId ? `댓글(${commentId})` : '게시글'
        console.log(`${type} 좋아요 상태 로드 완료 - liked: ${response.liked} -> ${likedStatus}, count: ${count}`)
      } else {
        setIsLiked(false)
        console.log(`비로그인 사용자 - ${commentId ? '댓글' : '게시글'} 좋아요 상태 false로 설정`)
      }
    } catch (error) {
      const type = commentId ? `댓글(${commentId})` : '게시글'
      console.error(`${type} 좋아요 상태 로드 실패:`, error)
      
      // 에러 시 안전한 기본값으로 설정
      setIsLiked(false)
      setLikeCount(0)
      
      console.log(`${type} 에러로 인한 기본값 설정 - isLiked: false, count: 0`)
    } finally {
      setLoading(false)
    }
  }

  // 초기 로드 - 고유 키로 구분하여 독립적으로 작동하도록 수정
  useEffect(() => {
    console.log(`=== useEffect 실행 [${uniqueKey}] ===`)
    
    // 상태 초기화
    setIsLiked(false)
    setLikeCount(0)
    setLoading(false)
    
    // 상태 로드
    loadLikeStatus()
    
    // 클린업 함수로 다른 컴포넌트 간섭 방지
    return () => {
      console.log(`=== useEffect 클린업 [${uniqueKey}] ===`)
    }
  }, [uniqueKey, postId, commentId])

  // 좋아요 토글
  const toggleLike = async () => {
    if (!isAuthenticated()) {
      console.warn('로그인이 필요합니다')
      return
    }

    // 현재 상태 백업 (에러 시 복원용)
    const originalIsLiked = isLiked
    const originalCount = likeCount

    try {
      setLoading(true)
      
      // 낙관적 업데이트: 즉시 UI 반영
      const newIsLiked = !isLiked
      const newCount = isLiked ? likeCount - 1 : likeCount + 1
      
      setIsLiked(newIsLiked)
      setLikeCount(newCount)
      
      const type = commentId ? `댓글(${commentId})` : '게시글'
      console.log(`${type} 좋아요 토글 시작 - ${isLiked} -> ${newIsLiked}`)
      
      // 서버에 토글 요청
      if (commentId) {
        console.log(`댓글 좋아요 토글 API 호출 - postId: ${postId}, commentId: ${commentId}`)
        await likesApi.toggleCommentLike(postId, commentId)
      } else {
        console.log(`게시글 좋아요 토글 API 호출 - postId: ${postId}`)
        await likesApi.togglePostLike(postId)
      }
      
      console.log(`${type} 좋아요 토글 서버 요청 완료`)
      
      // 댓글 좋아요는 낙관적 업데이트만 사용 (게시글 간섭 방지)
      // 게시글 좋아요만 서버 상태 동기화 수행
      if (!commentId) {
        console.log('게시글 좋아요 - 서버 상태 동기화 수행')
        await loadLikeStatus()
      } else {
        console.log('댓글 좋아요 - 낙관적 업데이트만 사용 (동기화 생략)')
      }
      
    } catch (error) {
      console.error('좋아요 토글 실패:', error)
      // 에러 시 원래 상태로 복원
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