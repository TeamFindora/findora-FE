import { useNavigate } from 'react-router-dom'
import { useState, useMemo } from 'react'

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

  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredAndSortedPosts.length / postsPerPage)
  const startIndex = (currentPage - 1) * postsPerPage
  const endIndex = startIndex + postsPerPage
  const currentPosts = filteredAndSortedPosts.slice(startIndex, endIndex)

  // 인기 게시글(조회수+댓글수 상위 3개)
  const popularPosts = [...mockPosts]
    .sort((a, b) => (b.views + b.comments * 10) - (a.views + a.comments * 10))
    .slice(0, 3)

  // 자유게시판: 전체 게시글
  const freeBoardPosts = filteredAndSortedPosts
  // 베스트게시판: 인기순 정렬(조회수+댓글수)
  const bestBoardPosts = [...filteredAndSortedPosts].sort((a, b) => (b.views + b.comments * 10) - (a.views + a.comments * 10))

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // 검색 실행 (이미 실시간으로 필터링됨)
  }

  const clearSearch = () => {
    setSearchTerm('')
    setSortBy('latest')
    setCurrentPage(1)
  }

  return (
    <div className="community-page min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800 py-12 px-4">
      <div className="community-container max-w-6xl mx-auto">
        {/* 검색창 */}
        <div className="community-search-section mb-8 flex gap-2">
          <div className="community-search-input-wrapper flex-1 relative">
            <span className="community-search-icon absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              value={searchTerm}
              onChange={e => handleSearchChange(e.target.value)}
              placeholder="제목, 작성자로 검색 (예: 연구실, 면접, 스터디...)"
              className="community-search-input w-full pl-10 p-4 border border-gray-300 rounded-xl text-gray-800 bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-[#B8DCCC] focus:border-transparent"
            />
          </div>
          <select
            value={sortBy}
            onChange={e => handleSortChange(e.target.value)}
            className="community-sort-select px-4 py-4 border border-gray-300 rounded-xl text-gray-800 bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-[#B8DCCC] focus:border-transparent"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* 강조 섹션 - 커뮤니티 */}
        <div className="community-hero-section bg-gradient-to-r from-[#B8DCCC] to-[#9BC5B3] rounded-xl p-6 mb-8 shadow-lg relative">
          <div className="community-hero-content text-center">
            <h1 className="community-hero-title text-2xl font-bold text-white">커뮤니티</h1>
            <p className="community-hero-description text-white text-sm opacity-90 mt-2">
              질문하고 나누는 자유로운 공간입니다
            </p>
          </div>
          <button
            onClick={() => navigate('/community/write')}
            className="community-write-button absolute bottom-4 right-4 bg-white text-[#B8DCCC] px-4 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            글쓰기
          </button>
        </div>

        {/* 검색 결과 표시 */}
        {filteredAndSortedPosts.length === 0 ? (
          <div className="community-empty-state text-center text-gray-400 py-12 mb-8">
            <div className="community-empty-icon-wrapper mb-4">
              <span className="community-empty-icon text-6xl">🔍</span>
            </div>
            <div className="community-empty-text text-xl">검색 결과가 없습니다.</div>
            <button
              onClick={clearSearch}
              className="community-clear-search-button mt-4 text-[#B8DCCC] hover:text-[#9BC5B3] transition"
            >
              검색 조건 초기화
            </button>
          </div>
        ) : (
          <div className="community-results-info mb-4 text-sm text-gray-600">
            총 {filteredAndSortedPosts.length}개의 게시글 (페이지 {currentPage}/{totalPages})
          </div>
        )}

        {/* 상단 실시간 인기 게시글 */}
        <div className="community-popular-section mb-12">
          <h2 className="community-popular-title text-xl font-bold text-[#B8DCCC] mb-4">실시간 인기게시글</h2>
          <div className="community-popular-grid grid grid-cols-1 md:grid-cols-3 gap-6">
            {popularPosts.map(post => (
              <div
                key={post.id}
                className="community-popular-post bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 cursor-pointer"
                onClick={() => navigate(`/community/post/${post.id}`)}
              >
                <h3 className="community-popular-post-title text-lg font-semibold text-[#B8DCCC] mb-2">{post.title}</h3>
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
            className={`community-tab-button px-4 py-2 rounded-xl font-semibold transition ${
              activeTab === 'free' 
                ? 'bg-[#B8DCCC] text-black shadow-lg' 
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
            onClick={() => setActiveTab('free')}
          >
            자유 게시판
          </button>
          <button
            className={`community-tab-button px-4 py-2 rounded-xl font-semibold transition ${
              activeTab === 'best' 
                ? 'bg-[#B8DCCC] text-black shadow-lg' 
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
            onClick={() => setActiveTab('best')}
          >
            베스트 게시판
          </button>
        </div>

        {/* 게시글 목록 (탭에 따라 다르게) */}
        <div className="community-posts-section space-y-4 mb-8">
          {(activeTab === 'free' ? currentPosts : bestBoardPosts.slice(startIndex, endIndex)).map(post => (
            <div
              key={post.id}
              className="community-post-card bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 cursor-pointer"
              onClick={() => navigate(`/community/post/${post.id}`)}
            >
              <div className="community-post-content flex items-start justify-between">
                <div className="community-post-info flex-1">
                  <h3 className="community-post-title text-lg font-semibold text-[#B8DCCC] mb-2">{post.title}</h3>
                  <div className="community-post-meta text-sm text-gray-600 mb-1">
                    작성자: {post.writer} · <span className="community-comment-icon">💬</span> {post.comments} 댓글 · <span className="community-view-icon">👁️</span> {post.views} 조회
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
                          ? 'bg-[#B8DCCC] text-black font-semibold'
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
