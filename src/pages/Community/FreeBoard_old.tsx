import { useNavigate } from 'react-router-dom'
import CommentCount from '../../components/CommentCount'
import { useFreeBoard } from '../../hooks/pages/useFreeBoard'

const FreeBoard = () => {
  const navigate = useNavigate()
  
  const {
    // 데이터 상태
    loading,
    error,
    refetch,
    
    // 현재 페이지 데이터
    currentPosts,
    totalPosts,
    
    // 검색 기능
    searchTerm,
    handleSearchChange,
    handleSearchSubmit,
    hasSearchTerm,
    
    // 정렬 기능
    sortBy,
    sortOptions,
    handleSortChange,
    
    // 페이지네이션
    currentPage,
    totalPages,
    handlePageChange,
    goToNextPage,
    goToPreviousPage,
    
    // 통합 기능
    resetAllFilters,
    hasAnyFilter
  } = useFreeBoard()

  // 게시글 데이터 로드
  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true)
        const allPosts = await postsApi.getAllPosts()
        if (Array.isArray(allPosts)) {
          setPosts(allPosts)
        } else if (allPosts && typeof allPosts === 'object' && 'data' in allPosts && Array.isArray((allPosts as any).data)) {
          setPosts((allPosts as any).data)
        } else {
          setPosts([])
        }
        setError(null)
      } catch (err) {
        setError('게시글을 불러오는데 실패했습니다.')
        setPosts([])
      } finally {
        setLoading(false)
      }
    }

    loadPosts()
  }, [])


  // 검색, 필터링, 정렬된 게시글
  const filteredAndSortedPosts = useMemo(() => {
    // API 데이터가 있으면 사용, 없으면 임시 데이터 사용
    const dataToUse = posts && posts.length > 0 ? posts : mockPosts
    
    // 1. 필터링
    let filtered = dataToUse.filter(post => {
      // 검색어 필터링 (제목, 작성자에서 검색)
      const searchMatch = searchTerm === '' || 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (('userNickname' in post ? post.userNickname : (post as any).writer) || '').toLowerCase().includes(searchTerm.toLowerCase())
      
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
          // API 데이터는 생성일 기준으로 정렬 (조회수/댓글수 정보가 없으므로)
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'comments':
          // 임시 데이터용
          if ('comments' in a) {
            return (b as any).comments - (a as any).comments
          }
          return 0
        case 'views':
          // 임시 데이터용
          if ('views' in a) {
            return (b as any).views - (a as any).views
          }
          return 0
        default:
          return 0
      }
    })

    return filtered
  }, [posts, searchTerm, sortBy])

  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredAndSortedPosts.length / postsPerPage)
  const startIndex = (currentPage - 1) * postsPerPage
  const endIndex = startIndex + postsPerPage
  const currentPosts = filteredAndSortedPosts.slice(startIndex, endIndex)

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
  }

  const clearSearch = () => {
    setSearchTerm('')
    setSortBy('latest')
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">자유 게시판</h1>
          <p className="text-slate-600 text-lg">
            자유롭게 의견을 나누는 공간입니다.
          </p>
        </div>

        {loading && (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <div className="text-slate-700 text-lg font-medium">게시글을 불러오는 중...</div>
          </div>
        )}

        {error && (
          <div className="text-center py-16">
            <div className="bg-red-50 border border-red-200 rounded-xl p-8 inline-block">
              <div className="text-red-700 text-lg font-medium mb-4">{error}</div>
              <button
                onClick={() => window.location.reload()}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                다시 시도
              </button>
            </div>
          </div>
        )}

        {/* 검색 및 필터링 */}
        {!loading && !error && (
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#B8DCCC] text-black"
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
        )}

        {/* 글쓰기 버튼 */}
        {!loading && !error && (
          <div className="text-right mb-6">
            <button 
              onClick={() => navigate('/community/write')}
              className="bg-[#B8DCCC] text-black font-semibold px-4 py-2 rounded hover:bg-opacity-90 transition"
            >
              ✍ 글쓰기
            </button>
          </div>
        )}

        {/* 검색 결과 표시 */}
        {!loading && !error && (
          <>
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

            {/* 게시글 목록 */}
            <div className="space-y-4 mb-8">
              {currentPosts.map(post => (
                <div
                  key={post.id}
                  className="bg-white text-black rounded-lg px-6 py-4 shadow hover:-translate-y-1 transition cursor-pointer hover:shadow-lg"
                  onClick={() => navigate(`/community/post/${post.id}`)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[#B8DCCC]">{post.title}</h3>
                      <div className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                        <span>작성자: {'userNickname' in post ? post.userNickname : (post as any).writer}</span>
                        <span>·</span>
                        <CommentCount postId={post.id} />
                        <span>댓글</span>
                        <span>·</span>
                        <span>👁️ {'views' in post ? (post as any).views : 0} 조회</span>
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
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition text-black"
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
                              : 'border border-gray-300 hover:bg-gray-200 text-black'
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
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition text-black"
                  >
                    다음
                  </button>
                </div>
              </div>
            )}

            <div className="text-center mt-8">
              <button
                onClick={() => navigate('/community')}
                className="px-6 py-3 bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-700 transition-colors shadow-sm"
              >
                커뮤니티로 돌아가기
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default FreeBoard 