import { useBookmarkedPosts } from '../bookmarks/useBookmarkedPosts'
import { usePostsFilter } from '../posts/usePostsFilter'

export const useBookmarkBoard = () => {
  // 북마크된 게시글 데이터 로드
  const {
    bookmarkedPosts,
    loading,
    error,
    refresh,
    refetch,
    isEmpty,
    isAuthenticated
  } = useBookmarkedPosts()

  // 필터링, 정렬, 페이지네이션 (북마크된 게시글에 적용)
  const filterProps = usePostsFilter({
    posts: bookmarkedPosts,
    itemsPerPage: 10,
    initialSortBy: 'latest'
  })

  return {
    // 인증 상태
    isAuthenticated,
    
    // 데이터 상태
    loading,
    error,
    refresh,
    refetch,
    isEmpty,
    
    // 북마크된 게시글과 모든 필터 기능
    ...filterProps
  }
}