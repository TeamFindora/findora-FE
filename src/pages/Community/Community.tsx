import { useNavigate } from 'react-router-dom'
import { useState, useMemo } from 'react'
import { MagnifyingGlassIcon, ChatBubbleLeftIcon, EyeIcon } from '@heroicons/react/24/outline'

const Community = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('latest')
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 5
  const [activeTab, setActiveTab] = useState<'free' | 'best'>('free')
  const mockPosts = [
    { 
      id: 1, 
      title: '석사 준비 중인데 연구실 추천 좀 부탁드려요!', 
      writer: 'skywalker', 
      comments: 3,
      views: 156,
      createdAt: '2024-01-15'
    },
    { 
      id: 2, 
      title: '해외 대학원 지원 일정 같이 공유해요', 
      writer: 'dreamer', 
      comments: 5,
      views: 89,
      createdAt: '2024-01-14'
    },
    { 
      id: 3, 
      title: 'Findora UI 어때요?', 
      writer: 'neo', 
      comments: 2,
      views: 234,
      createdAt: '2024-01-13'
    },
    { 
      id: 4, 
      title: '대학원 면접 준비 팁 공유해요', 
      writer: 'interview_expert', 
      comments: 8,
      views: 567,
      createdAt: '2024-01-12'
    },
    { 
      id: 5, 
      title: 'AI 스터디 모집합니다', 
      writer: 'ai_study', 
      comments: 4,
      views: 123,
      createdAt: '2024-01-11'
    },
    { 
      id: 6, 
      title: '대학원 생활 후기 공유해요', 
      writer: 'grad_life', 
      comments: 12,
      views: 789,
      createdAt: '2024-01-10'
    },
    { 
      id: 7, 
      title: '연구실 선택할 때 고려사항', 
      writer: 'lab_guide', 
      comments: 6,
      views: 456,
      createdAt: '2024-01-09'
    },
    { 
      id: 8, 
      title: '논문 작성 팁 모음', 
      writer: 'paper_writer', 
      comments: 15,
      views: 1023,
      createdAt: '2024-01-08'
    }
  ]

  const sortOptions = [
    { value: 'latest', label: '최신순' },
    { value: 'oldest', label: '오래된순' },
    { value: 'popular', label: '인기순' },
    { value: 'comments', label: '댓글순' },
    { value: 'views', label: '조회순' }
  ]

  // 검색, 필터링, 정렬된 게시글
  const filteredAndSortedPosts = useMemo(() => {
    // 1. 필터링
    let filtered = mockPosts.filter(post => {
      // 검색어 필터링 (제목, 작성자에서 검색)
      const searchMatch = searchTerm === '' || 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.writer.toLowerCase().includes(searchTerm.toLowerCase())
      
      return searchMatch
    })

    // 2. 정렬
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'latest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'popular':
          // 조회수 + 댓글수로 인기도 계산
          const popularityA = a.views + (a.comments * 10)
          const popularityB = b.views + (b.comments * 10)
          return popularityB - popularityA
        case 'comments':
          return b.comments - a.comments
        case 'views':
          return b.views - a.views
        default:
          return 0
      }
    })

    return filtered
  }, [mockPosts, searchTerm, sortBy])

  // 인기 게시글(조회수+댓글수 상위 3개)
  const popularPosts = [...mockPosts]
    .sort((a, b) => (b.views + b.comments * 10) - (a.views + a.comments * 10))
    .slice(0, 3)

  // 자유게시판: 전체 게시글
  const freeBoardPosts = filteredAndSortedPosts
  // 베스트게시판: 인기순 정렬(조회수+댓글수)
  const bestBoardPosts = [...filteredAndSortedPosts].sort((a, b) => (b.views + b.comments * 10) - (a.views + a.comments * 10))

  // 현재 활성 탭에 따른 게시글 목록
  const currentTabPosts = activeTab === 'free' ? freeBoardPosts : bestBoardPosts
  
  // 페이지네이션 계산 (탭별로)
  const totalPages = Math.ceil(currentTabPosts.length / postsPerPage)
  const startIndex = (currentPage - 1) * postsPerPage
  const endIndex = startIndex + postsPerPage
  const currentPosts = currentTabPosts.slice(startIndex, endIndex)

  // 페이지 변경 시 상단으로 스크롤
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // 검색어나 필터 변경 시 페이지 초기화
  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handleSortChange = (sort: string) => {
    setSortBy(sort)
    setCurrentPage(1)
  }


  const clearSearch = () => {
    setSearchTerm('')
    setSortBy('latest')
    setCurrentPage(1)
  }

  // 탭 변경 시 페이지 초기화
  const handleTabChange = (tab: 'free' | 'best') => {
    setActiveTab(tab)
    setCurrentPage(1)
  }

  return (
    <div className="community-page min-h-screen bg-gray-50 text-gray-800 py-12 px-4">
      <div className="community-container">
        {/* 강조 섹션 - 커뮤니티 */}
        <div className="community-hero-section bg-white rounded-xl p-8 mb-8 shadow-sm border border-gray-100 relative">
          <div className="community-hero-content text-center mb-6">
            <h1 className="community-hero-title text-3xl font-bold text-gray-800 mb-2">커뮤니티</h1>
            <p className="community-hero-description text-gray-600 text-lg">
              질문하고 나누는 자유로운 공간입니다
            </p>
          </div>
          
          {/* 검색창 */}
          <div className="community-search-section flex gap-2 mb-4">
            <div className="community-search-input-wrapper flex-1 relative">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => handleSearchChange(e.target.value)}
                placeholder="제목, 작성자로 검색 (예: 연구실, 면접, 스터디...)"
                className="community-search-input w-full pl-10 p-4 border border-gray-300 rounded-xl text-gray-800 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={sortBy}
              onChange={e => handleSortChange(e.target.value)}
              className="community-sort-select px-4 py-4 border border-gray-300 rounded-xl text-gray-800 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 검색 결과 표시 */}
        {currentTabPosts.length === 0 ? (
                      <div className="community-empty-state text-center text-gray-400 py-12 mb-8">
            <div className="community-empty-icon-wrapper mb-4">
              <MagnifyingGlassIcon className="w-16 h-16 mx-auto text-gray-300" />
            </div>
            <div className="community-empty-text text-xl">검색 결과가 없습니다.</div>
            <button
              onClick={clearSearch}
              className="community-clear-search-button mt-4 text-gray-600 hover:text-gray-800 transition"
            >
              검색 조건 초기화
            </button>
          </div>
        ) : (
          <div className="community-results-info mb-4 text-sm text-gray-600">
            총 {currentTabPosts.length}개의 게시글 (페이지 {currentPage}/{totalPages})
          </div>
        )}

        {/* 상단 실시간 인기 게시글 */}
        <div className="community-popular-section mb-12">
          <h2 className="community-popular-title text-xl font-bold text-gray-800 mb-4">실시간 인기게시글</h2>
          <div className="community-popular-grid grid grid-cols-1 md:grid-cols-3 gap-6">
            {popularPosts.map(post => (
              <div
                key={post.id}
                className="community-popular-post bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 cursor-pointer"
                onClick={() => navigate(`/community/post/${post.id}`)}
              >
                <h3 className="community-popular-post-title text-lg font-semibold text-gray-800 mb-2">{post.title}</h3>
                <div className="community-popular-post-writer text-sm text-gray-600 mb-1">작성자: {post.writer}</div>
                <div className="community-popular-post-date text-xs text-gray-500 mb-1">{post.createdAt}</div>
                <div className="community-popular-post-stats text-xs text-gray-700">조회수: {post.views} · 댓글: {post.comments}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 게시판 탭 */}
        <div className="community-tabs-section flex gap-2 mb-6">
          <button 
            className={`community-tab-button px-4 py-2 rounded-lg font-semibold transition shadow-sm border ${
              activeTab === 'free' 
                ? 'bg-blue-200/40 text-blue-800 border-blue-300' 
                : 'bg-gray-200/20 text-gray-700 hover:bg-gray-200/30 border-gray-200/30'
            }`}
            onClick={() => handleTabChange('free')}
          >
            자유 게시판
          </button>
          <button 
            className={`community-tab-button px-4 py-2 rounded-lg font-semibold transition shadow-sm border ${
              activeTab === 'best' 
                ? 'bg-blue-200/40 text-blue-800 border-blue-300' 
                : 'bg-gray-200/20 text-gray-700 hover:bg-gray-200/30 border-gray-200/30'
            }`}
            onClick={() => handleTabChange('best')}
          >
            베스트 게시판
          </button>
          <button 
            className="community-write-button ml-auto text-white bg-gray-600 px-4 py-2 rounded-lg font-semibold shadow-sm hover:shadow-md hover:bg-blue-200/30 transition-all duration-300 border border-blue-200/30"
            onClick={() => navigate('/community/write')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              aria-hidden="true"
              data-slot="icon"
              className="w-4 h-4 inline mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 11 2.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zM16.863 4.487L19.5 7.125"
              />
            </svg>
            글쓰기
          </button>
        </div>

        {/* 게시글 목록 (탭에 따라 다르게) */}
        <div className="community-posts-section space-y-4 mb-8">
          {currentPosts.map(post => (
            <div
              key={post.id}
              className="community-post-card bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 cursor-pointer"
              onClick={() => navigate(`/community/post/${post.id}`)}
            >
              <div className="community-post-content flex items-start justify-between">
                <div className="community-post-info flex-1">
                  <h3 className="community-post-title text-lg font-semibold text-gray-800 mb-2">{post.title}</h3>
                  <div className="community-post-meta text-sm text-gray-600 mb-1">
                    작성자: {post.writer} · <ChatBubbleLeftIcon className="w-4 h-4 inline mx-1" /> {post.comments} 댓글 · <EyeIcon className="w-4 h-4 inline mx-1" /> {post.views} 조회
                  </div>
                  <div className="community-post-date text-xs text-gray-500">
                    {post.createdAt}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="community-pagination flex justify-center mt-8">
            <div className="community-pagination-container flex items-center space-x-2">
              {/* 이전 페이지 */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="community-pagination-button community-prev-button px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition"
              >
                이전
              </button>

              {/* 페이지 번호 */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                // 현재 페이지 주변 5개 페이지만 표시
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 2 && page <= currentPage + 2)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`community-page-button px-3 py-2 rounded-lg text-sm transition ${
                        currentPage === page
                          ? 'bg-gray-800 text-white font-semibold'
                          : 'border border-gray-300 hover:bg-gray-200'
                      }`}
                    >
                      {page}
                    </button>
                  )
                } else if (
                  page === currentPage - 3 ||
                  page === currentPage + 3
                ) {
                  return <span key={page} className="community-pagination-ellipsis px-2 text-gray-500">...</span>
                }
                return null
              })}

              {/* 다음 페이지 */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="community-pagination-button community-next-button px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition"
              >
                다음
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Community
