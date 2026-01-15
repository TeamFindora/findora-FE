import { usePostsList } from '../posts/usePostsList'
import { usePostsFilter } from '../posts/usePostsFilter'
import { mockPosts } from '../../data/mockPosts'

export const useFreeBoard = () => {
  // 게시글 데이터 로드
  const { posts: apiPosts, loading, error, refetch } = usePostsList({
    onSuccess: (posts) => {
      console.log('FreeBoard API 데이터 로드 완료:', posts.length, '개')
    },
    onError: (err) => {
      console.error('FreeBoard 게시글 로드 실패:', err)
    }
  })

  // API 데이터가 없으면 목 데이터 사용
  const postsToUse = apiPosts && apiPosts.length > 0 ? apiPosts : mockPosts
  console.log('FreeBoard 사용할 데이터:', postsToUse.length, '개')

  // 필터링, 정렬, 페이지네이션
  const filterProps = usePostsFilter({
    posts: postsToUse,
    itemsPerPage: 10,
    initialSortBy: 'latest'
  })

  return {
    // 데이터 상태
    loading,
    error,
    refetch,
    
    // 필터링된 데이터와 모든 필터 기능
    ...filterProps
  }
}