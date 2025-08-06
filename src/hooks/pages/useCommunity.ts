import { useMemo } from 'react'
import { useTabs, type TabType } from '../common/useTabs'
import { usePostsList } from '../posts/usePostsList'
import { usePostsFilter } from '../posts/usePostsFilter'
import { useBookmarkedPosts } from '../bookmarks/useBookmarkedPosts'
import { useCommentCounts } from '../useCommentCount'
import { mockPosts } from '../../data/mockPosts'

export const useCommunity = () => {
  // 탭 관리
  const { activeTab, handleTabChange, isActiveTab } = useTabs('free')

  // 일반 게시글 데이터 (자유/베스트 탭용)
  const { 
    posts: apiPosts, 
    loading: postsLoading, 
    error: postsError, 
    refetch: refetchPosts 
  } = usePostsList({
    onSuccess: (posts) => {
      console.log('Community API 데이터 로드 완료:', posts.length, '개')
    }
  })

  // 북마크된 게시글 데이터
  const {
    bookmarkedPosts,
    loading: bookmarkLoading,
    error: bookmarkError,
    refetch: refetchBookmarks,
    isEmpty: bookmarkIsEmpty,
    isAuthenticated: bookmarkIsAuthenticated
  } = useBookmarkedPosts()

  // API 데이터가 없으면 목 데이터 사용
  const postsToUse = apiPosts && apiPosts.length > 0 ? apiPosts : mockPosts

  // 자유 게시판 필터링 (모든 게시글)
  const freeBoard = usePostsFilter({
    posts: postsToUse,
    itemsPerPage: 5,
    initialSortBy: 'latest'
  })

  // 베스트 게시판 필터링 (인기 게시글만 - 여기서는 동일한 데이터 사용)
  const bestBoard = usePostsFilter({
    posts: postsToUse,
    itemsPerPage: 5,
    initialSortBy: 'popular'
  })

  // 북마크 게시판 필터링
  const bookmarkBoard = usePostsFilter({
    posts: bookmarkedPosts,
    itemsPerPage: 10,
    initialSortBy: 'latest'
  })

  // 댓글 수 조회 (현재 표시되는 게시글들의 ID만)
  const currentPostIds = useMemo(() => {
    switch (activeTab) {
      case 'free':
        return freeBoard.currentPosts.map(post => post.id)
      case 'best':
        return bestBoard.currentPosts.map(post => post.id)
      case 'bookmark':
        return bookmarkBoard.currentPosts.map(post => post.id)
      default:
        return []
    }
  }, [activeTab, freeBoard.currentPosts, bestBoard.currentPosts, bookmarkBoard.currentPosts])

  const { commentCounts, loading: commentCountsLoading } = useCommentCounts(currentPostIds)

  // 현재 활성 탭에 따른 데이터 선택
  const currentData = useMemo(() => {
    switch (activeTab) {
      case 'free':
        return {
          ...freeBoard,
          loading: postsLoading,
          error: postsError,
          refetch: refetchPosts
        }
      case 'best':
        return {
          ...bestBoard,
          loading: postsLoading,
          error: postsError,
          refetch: refetchPosts
        }
      case 'bookmark':
        return {
          ...bookmarkBoard,
          loading: bookmarkLoading,
          error: bookmarkError,
          refetch: refetchBookmarks,
          isEmpty: bookmarkIsEmpty,
          isAuthenticated: bookmarkIsAuthenticated
        }
      default:
        return freeBoard
    }
  }, [
    activeTab,
    freeBoard,
    bestBoard,
    bookmarkBoard,
    postsLoading,
    postsError,
    refetchPosts,
    bookmarkLoading,
    bookmarkError,
    refetchBookmarks,
    bookmarkIsEmpty,
    bookmarkIsAuthenticated
  ])

  return {
    // 탭 관리
    activeTab,
    handleTabChange,
    isActiveTab,
    
    // 현재 탭 데이터
    ...currentData,
    
    // 댓글 수 데이터
    commentCounts,
    commentCountsLoading,
    
    // 특별한 북마크 상태들
    ...(activeTab === 'bookmark' && {
      isEmpty: bookmarkIsEmpty,
      isAuthenticated: bookmarkIsAuthenticated
    })
  }
}