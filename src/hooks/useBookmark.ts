import { useState, useEffect } from 'react'
import { bookmarksApi } from '../api/posts'
import { isAuthenticated } from '../api/auth'

export const useBookmark = (postId: number) => {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [loading, setLoading] = useState(false)

  console.log(`=== useBookmark 초기화 [post-${postId}] ===`)

  // 북마크 상태 확인 (내 북마크 목록에서 해당 게시글이 있는지 확인)
  const loadBookmarkStatus = async () => {
    try {
      setLoading(true)
      
      if (isAuthenticated()) {
        console.log(`북마크 상태 조회 시작 - postId: ${postId}`)
        const myBookmarks = await bookmarksApi.getMyBookmarks()
        const isInBookmarks = myBookmarks.some(bookmark => bookmark.postId === postId)
        
        setIsBookmarked(isInBookmarks)
        console.log(`북마크 상태: ${isInBookmarks ? '북마크됨' : '북마크 안됨'}`)
      } else {
        setIsBookmarked(false)
        console.log('비로그인 사용자 - 북마크 상태 false')
      }
    } catch (error) {
      console.error('북마크 상태 로드 실패:', error)
      setIsBookmarked(false)
    } finally {
      setLoading(false)
    }
  }

  // 초기 로드
  useEffect(() => {
    console.log(`=== useBookmark useEffect 실행 [post-${postId}] ===`)
    loadBookmarkStatus()
  }, [postId])

  // 북마크 토글
  const toggleBookmark = async () => {
    if (!isAuthenticated()) {
      console.warn('로그인이 필요합니다')
      return
    }

    const originalState = isBookmarked

    try {
      setLoading(true)
      
      // 낙관적 업데이트
      setIsBookmarked(!isBookmarked)
      console.log(`북마크 토글 - ${isBookmarked} -> ${!isBookmarked}`)
      
      if (isBookmarked) {
        // 북마크 해제
        await bookmarksApi.removeBookmark(postId)
        console.log('북마크 삭제 완료')
      } else {
        // 북마크 추가
        await bookmarksApi.addBookmark(postId)
        console.log('북마크 추가 완료')
      }
      
    } catch (error) {
      console.error('북마크 토글 실패:', error)
      // 에러 시 원래 상태로 복원
      setIsBookmarked(originalState)
      
      // 에러 메시지 표시
      if (error instanceof Error) {
        if (error.message.includes('400')) {
          alert('이미 즐겨찾기한 게시글입니다.')
        } else if (error.message.includes('404')) {
          alert('즐겨찾기 내역이 없습니다.')
        } else {
          alert('즐겨찾기 처리 중 오류가 발생했습니다.')
        }
      }
    } finally {
      setLoading(false)
    }
  }

  return {
    isBookmarked,
    loading,
    toggleBookmark
  }
} 