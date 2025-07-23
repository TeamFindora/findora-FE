import { useMemo } from 'react'
import { useSearch } from '../common/useSearch'
import { useSort, type SortOption } from '../common/useSort'
import { usePagination } from '../common/usePagination'
import type { PostResponseDto } from '../../api/posts'

export const sortOptions: SortOption[] = [
  { value: 'latest', label: '최신순' },
  { value: 'oldest', label: '오래된순' },
  { value: 'popular', label: '인기순' },
  { value: 'comments', label: '댓글순' },
  { value: 'views', label: '조회순' }
]

const createSortFunctions = () => ({
  latest: (a: PostResponseDto, b: PostResponseDto) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  oldest: (a: PostResponseDto, b: PostResponseDto) => 
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  popular: (a: PostResponseDto, b: PostResponseDto) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  comments: (a: PostResponseDto, b: PostResponseDto) => {
    // 댓글 수는 API에서 제공되지 않으므로 임시로 생성일순으로 정렬
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  },
  views: (a: PostResponseDto, b: PostResponseDto) => {
    const aViews = (a as any).viewCount || (a as any).views || 0
    const bViews = (b as any).viewCount || (b as any).views || 0
    return bViews - aViews
  }
})

interface UsePostsFilterProps {
  posts: PostResponseDto[]
  itemsPerPage?: number
  initialSortBy?: string
}

export const usePostsFilter = ({ 
  posts, 
  itemsPerPage = 10,
  initialSortBy = 'latest'
}: UsePostsFilterProps) => {
  // 검색 기능
  const {
    searchTerm,
    filteredData: searchedPosts,
    handleSearchChange,
    clearSearch,
    handleSearchSubmit,
    hasSearchTerm
  } = useSearch({
    data: posts,
    searchFields: ['title', 'userNickname'] as (keyof PostResponseDto)[],
    initialSearchTerm: ''
  })

  // 정렬 기능
  const {
    sortBy,
    sortedData: sortedPosts,
    handleSortChange,
    resetSort
  } = useSort({
    data: searchedPosts,
    sortOptions,
    initialSortBy,
    sortFunctions: createSortFunctions()
  })

  // 페이지네이션
  const {
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    handlePageChange,
    resetToFirstPage,
    goToNextPage,
    goToPreviousPage
  } = usePagination({
    totalItems: sortedPosts.length,
    itemsPerPage
  })

  // 현재 페이지 게시글
  const currentPosts = useMemo(() => 
    sortedPosts.slice(startIndex, endIndex),
    [sortedPosts, startIndex, endIndex]
  )

  // 통합 초기화 함수
  const resetAllFilters = () => {
    clearSearch()
    resetSort()
    resetToFirstPage()
  }

  // 검색이나 정렬 변경 시 첫 페이지로 이동
  const handleSearchChangeWithReset = (value: string) => {
    handleSearchChange(value)
    resetToFirstPage()
  }

  const handleSortChangeWithReset = (sort: string) => {
    handleSortChange(sort)
    resetToFirstPage()
  }

  return {
    // 데이터
    currentPosts,
    totalPosts: sortedPosts.length,
    
    // 검색
    searchTerm,
    handleSearchChange: handleSearchChangeWithReset,
    handleSearchSubmit,
    hasSearchTerm,
    
    // 정렬
    sortBy,
    sortOptions,
    handleSortChange: handleSortChangeWithReset,
    
    // 페이지네이션
    currentPage,
    totalPages,
    handlePageChange,
    goToNextPage,
    goToPreviousPage,
    
    // 통합 기능
    resetAllFilters,
    hasAnyFilter: hasSearchTerm || sortBy !== initialSortBy
  }
}