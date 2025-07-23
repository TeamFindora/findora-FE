import { useNavigate } from 'react-router-dom'
import CommentCount from '../../components/CommentCount'
import { useBookmarkBoard } from '../../hooks/pages/useBookmarkBoard'

const BookmarkBoard = () => {
  const navigate = useNavigate()
  
  const {
    // 인증 상태
    isAuthenticated,
    
    // 데이터 상태
    loading,
    error,
    refetch,
    isEmpty,
    
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
  } = useBookmarkBoard()

  // 로그인이 필요한 경우
  if (!loading && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-white text-white">
        <div className="text-center py-20 bg-zinc-100">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-[#B8DCCC] mb-2">북마크 게시판</h1>
            <p className="text-gray-300 text-sm">
              북마크한 게시글들을 모아놓은 공간입니다.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-8 mx-auto max-w-md">
            <div className="text-gray-600 text-lg mb-4">
              🔒 로그인이 필요한 서비스입니다
            </div>
            <p className="text-gray-500 text-sm mb-6">
              북마크한 게시글을 보려면 로그인해주세요.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/login')}
                className="w-full px-6 py-3 bg-[#B8DCCC] text-black font-semibold rounded-lg hover:bg-opacity-90 transition"
              >
                로그인 하기
              </button>
              <button
                onClick={() => navigate('/community')}
                className="w-full px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                커뮤니티로 돌아가기
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-white">
      <div className="text-center py-20 bg-zinc-100">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-[#B8DCCC] mb-2">북마크 게시판</h1>
          <p className="text-gray-300 text-sm">
            북마크한 게시글들을 모아놓은 공간입니다.
          </p>
        </div>

        {/* 로딩 상태 */}
        {loading && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">북마크된 게시글을 불러오는 중...</div>
            <div className="text-gray-400 text-sm mt-2">loading: {loading.toString()}</div>
          </div>
        )}

        {/* 에러 상태 */}
        {error && (
          <div className="text-center py-12">
            <div className="text-red-500 text-lg mb-2">{error}</div>
            <button
              onClick={refetch}
              className="text-[#B8DCCC] hover:text-white transition"
            >
              다시 시도
            </button>
          </div>
        )}

        {/* 빈 상태 (북마크된 게시글이 없는 경우) */}
        {!loading && !error && isEmpty && !hasSearchTerm && (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg p-8 mx-auto max-w-md">
              <div className="text-gray-600 text-lg mb-4">
                📌 아직 북마크한 게시글이 없습니다
              </div>
              <p className="text-gray-500 text-sm mb-6">
                마음에 드는 게시글을 북마크해보세요!
              </p>
              <button
                onClick={() => navigate('/community')}
                className="px-6 py-2 bg-[#B8DCCC] text-black font-semibold rounded-lg hover:bg-opacity-90 transition"
              >
                게시글 둘러보기
              </button>
            </div>
          </div>
        )}

        {/* 검색 및 필터링 */}
        {!loading && !error && !isEmpty && (
          <div className="bg-white rounded-lg p-6 mb-6">
            <form onSubmit={handleSearchSubmit} className="space-y-4">
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
              {hasAnyFilter && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="text-sm text-gray-500 hover:text-gray-700 transition"
                  >
                    초기화
                  </button>
                </div>
              )}
            </form>
          </div>
        )}

        {/* 검색 결과 표시 */}
        {!loading && !error && !isEmpty && (
          <>
            {totalPosts === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg mb-2">검색 결과가 없습니다</div>
                <button
                  onClick={resetAllFilters}
                  className="text-[#B8DCCC] hover:text-white transition"
                >
                  검색 조건 초기화
                </button>
              </div>
            ) : (
              <div className="mb-4 text-sm text-gray-300">
                총 {totalPosts}개의 북마크된 게시글 (페이지 {currentPage}/{totalPages})
              </div>
            )}

            {/* 게시글 목록 */}
            <div className="space-y-4 mb-8">
              {currentPosts.map(post => (
                <div
                  key={post.id}
                  className="bg-white text-black rounded-lg px-6 py-4 shadow hover:-translate-y-1 transition cursor-pointer hover:shadow-lg relative"
                  onClick={() => navigate(`/community/post/${post.id}`)}
                >
                  {/* 북마크 표시 */}
                  <div className="absolute top-4 right-4">
                    <span className="text-yellow-500 text-lg">⭐</span>
                  </div>
                  
                  <div className="flex items-start justify-between pr-8">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[#B8DCCC]">{post.title}</h3>
                      <div className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                        <span>작성자: {'userNickname' in post ? post.userNickname : (post as any).writer}</span>
                        <span>·</span>
                        <CommentCount postId={post.id} />
                        <span>댓글</span>
                        <span>·</span>
                        <span>👁️ {'viewCount' in post ? post.viewCount : ('views' in post ? (post as any).views : 0)} 조회</span>
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
                    onClick={goToPreviousPage}
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
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition text-black"
                  >
                    다음
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* 뒤로가기 버튼 */}
        {!loading && (
          <div className="text-center mt-8">
            <button
              onClick={() => navigate('/community')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              ← 커뮤니티로 돌아가기
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default BookmarkBoard