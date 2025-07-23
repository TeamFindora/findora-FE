import { useState, useEffect } from 'react'
import { bookmarksApi, postsApi } from '../../api/posts'
import type { PostResponseDto } from '../../api/posts'
import { isAuthenticated } from '../../api/auth'

export const useBookmarkedPosts = () => {
  const [bookmarkedPosts, setBookmarkedPosts] = useState<PostResponseDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    const loadBookmarkedPosts = async () => {
      if (!isAuthenticated()) {
        setLoading(false)
        setError('로그인이 필요한 서비스입니다.')
        return
      }

      try {
        setLoading(true)
        setError(null)
        console.log('북마크 목록 조회 시작')
        
        // 1단계: 내 북마크 목록 가져오기
        const bookmarks = await bookmarksApi.getMyBookmarks()
        console.log('북마크 목록:', bookmarks)
        
        if (bookmarks.length === 0) {
          setBookmarkedPosts([])
          console.log('북마크된 게시글이 없습니다')
          return
        }
        
        // 2단계: 각 북마크된 게시글의 상세 정보 가져오기
        const postDetailsPromises = bookmarks.map(bookmark => 
          postsApi.getPostById(bookmark.postId).catch(error => {
            console.error(`게시글 ${bookmark.postId} 조회 실패:`, error)
            return null
          })
        )
        
        const postDetails = await Promise.all(postDetailsPromises)
        
        // null이 아닌 게시글만 필터링
        const validPosts = postDetails.filter((post): post is PostResponseDto => post !== null)
        
        console.log('북마크된 게시글 상세 정보:', validPosts)
        setBookmarkedPosts(validPosts)
        
      } catch (err) {
        console.error('북마크된 게시글 로드 실패:', err)
        setError('북마크된 게시글을 불러오는데 실패했습니다.')
        setBookmarkedPosts([])
      } finally {
        setLoading(false)
      }
    }

    loadBookmarkedPosts()
  }, [refreshTrigger])

  const refresh = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  const refetch = refresh

  return {
    bookmarkedPosts,
    loading,
    error,
    refresh,
    refetch,
    isEmpty: bookmarkedPosts.length === 0,
    isAuthenticated: isAuthenticated()
  }
}