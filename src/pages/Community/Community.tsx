import '../Home/Home.css'
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
    <div className="min-h-screen bg-white text-white">
      <div className="text-center py-20 bg-zinc-100">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-[#B8DCCC] mb-2">커뮤니티</h1>
          <p className="text-gray-300 text-sm">
            질문하고 나누는 자유로운 공간입니다.
          </p>
        </div>

        {/* 검색 및 필터링 */}
        <div className="bg-white rounded-lg p-6 mb-6">
          <form onSubmit={handleSearch} className="space-y-4">
            {/* 검색바 */}
            <div className="flex gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="제목, 작성자로 검색..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#B8DCCC]"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-[#B8DCCC] text-black font-semibold rounded-lg hover:bg-opacity-90 transition"
              >
                🔍 검색
              </button>
            </div>

            {/* 정렬 옵션 */}
            <div className="flex items-center justify-between">
              <div></div> {/* 왼쪽 공간 */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700 text-black">정렬:</span>
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#B8DCCC] text-black"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 초기화 버튼 */}
            {(searchTerm || sortBy !== 'latest') && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={clearSearch}
                  className="text-sm text-gray-500 hover:text-gray-700 transition"
                >
                  초기화
                </button>
              </div>
            )}
          </form>
        </div>

        {/* 글쓰기 버튼 */}
        <div className="text-right mb-6">
          <button 
            onClick={() => navigate('/community/write')}
            className="bg-[#B8DCCC] text-black font-semibold px-4 py-2 rounded hover:bg-opacity-90 transition"
          >
            ✍ 글쓰기
          </button>
        </div>

        {/* 검색 결과 표시 */}
        {filteredAndSortedPosts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2">검색 결과가 없습니다</div>
            <button
              onClick={clearSearch}
              className="text-[#B8DCCC] hover:text-white transition"
            >
              검색 조건 초기화
            </button>
          </div>
        ) : (
          <div className="mb-4 text-sm text-gray-300">
            총 {filteredAndSortedPosts.length}개의 게시글 (페이지 {currentPage}/{totalPages})
          </div>
        )}

        {/* 상단 실시간 인기 게시글 */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-[#B8DCCC] mb-4">실시간 인기게시글</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {popularPosts.map(post => (
              <div
                key={post.id}
                className="bg-white text-black rounded-lg px-6 py-4 shadow hover:-translate-y-1 transition cursor-pointer hover:shadow-lg"
                onClick={() => navigate(`/community/post/${post.id}`)}
              >
                <h3 className="text-lg font-semibold text-[#B8DCCC] mb-2">{post.title}</h3>
                <div className="text-sm text-gray-600 mb-1">작성자: {post.writer}</div>
                <div className="text-xs text-gray-500 mb-1">{post.createdAt}</div>
                <div className="text-xs text-gray-700">조회수: {post.views} · 댓글: {post.comments}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 게시판 탭 */}
        <div className="flex gap-2 mb-6">
          <button
            className={`px-4 py-2 rounded font-semibold transition ${activeTab === 'free' ? 'bg-[#B8DCCC] text-black' : 'bg-gray-600 text-white hover:bg-gray-500'}`}
            onClick={() => setActiveTab('free')}
          >
            자유 게시판
          </button>
          <button
            className={`px-4 py-2 rounded font-semibold transition ${activeTab === 'best' ? 'bg-[#B8DCCC] text-black' : 'bg-gray-600 text-white hover:bg-gray-500'}`}
            onClick={() => setActiveTab('best')}
          >
            베스트 게시판
          </button>
        </div>

        {/* 게시글 목록 (탭에 따라 다르게) */}
        <div className="space-y-4">
          {(activeTab === 'free' ? currentPosts : bestBoardPosts.slice(startIndex, endIndex)).map(post => (
            <div
              key={post.id}
              className="bg-white text-black rounded-lg px-6 py-4 shadow hover:-translate-y-1 transition cursor-pointer hover:shadow-lg"
              onClick={() => navigate(`/community/post/${post.id}`)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#B8DCCC]">{post.title}</h3>
                  <div className="text-sm text-gray-600 mt-1">
                    작성자: {post.writer} · 💬 {post.comments} 댓글 · 👁️ {post.views} 조회
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {post.createdAt}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex items-center space-x-2">
              {/* 이전 페이지 */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition"
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
                      className={`px-3 py-2 rounded-lg text-sm transition ${
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
                  return <span key={page} className="px-2 text-gray-500">...</span>
                }
                return null
              })}

              {/* 다음 페이지 */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition"
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
