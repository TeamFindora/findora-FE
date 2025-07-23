import { useNavigate } from 'react-router-dom'
import CommentCount from '../../components/CommentCount'
import { useCommunity } from '../../hooks/pages/useCommunity'

const Community = () => {
  const navigate = useNavigate()
  
  const {
    // 탭 관리
    activeTab,
    handleTabChange,
    isActiveTab,
    
    // 현재 탭 데이터
    currentPosts,
    totalPosts,
    loading,
    error,
    refetch,
    
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
    hasAnyFilter,
    
    // 북마크 특별 상태들
    isEmpty,
    isAuthenticated
  } = useCommunity()

  const getTabTitle = () => {
    switch (activeTab) {
      case 'free': return '자유 게시판'
      case 'best': return '베스트 게시판'
      case 'bookmark': return '북마크 게시판'
      default: return '커뮤니티'
    }
  }

  const getTabDescription = () => {
    switch (activeTab) {
      case 'free': return '자유롭게 소통할 수 있는 공간입니다.'
      case 'best': return '인기 있는 게시글들을 모아놓은 공간입니다.'
      case 'bookmark': return '북마크한 게시글들을 모아놓은 공간입니다.'
      default: return '커뮤니티에 오신 것을 환영합니다.'
    }
  }

  // 북마크 탭에서 로그인이 필요한 경우
  const renderBookmarkLoginRequired = () => (
    <div className="text-center py-12">
      <div className="bg-white rounded-lg p-8 mx-auto max-w-md">
        <div className="text-gray-600 text-lg mb-4">
          🔒 로그인이 필요한 서비스입니다
        </div>
        <p className="text-gray-500 text-sm mb-6">
          북마크한 게시글을 보려면 로그인해주세요.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="w-full px-6 py-3 bg-[#B8DCCC] text-black font-semibold rounded-lg hover:bg-opacity-90 transition"
        >
          로그인 하기
        </button>
      </div>
    </div>
  )

  // 북마크 탭에서 빈 상태인 경우
  const renderBookmarkEmpty = () => (
    <div className="text-center py-12">
      <div className="bg-white rounded-lg p-8 mx-auto max-w-md">
        <div className="text-gray-600 text-lg mb-4">
          📌 아직 북마크한 게시글이 없습니다
        </div>
        <p className="text-gray-500 text-sm mb-6">
          마음에 드는 게시글을 북마크해보세요!
        </p>
        <button
          onClick={() => handleTabChange('free')}
          className="px-6 py-2 bg-[#B8DCCC] text-black font-semibold rounded-lg hover:bg-opacity-90 transition"
        >
          게시글 둘러보기
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-white">
      <div className="py-12 px-4 max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#B8DCCC] mb-4">커뮤니티</h1>
          <p className="text-gray-600 text-lg">
            함께 소통하고 정보를 나누는 공간입니다
          </p>
        </div>

        {/* 탭 네비게이션 */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 rounded-lg p-1 flex space-x-1">
            <button
              onClick={() => handleTabChange('free')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition ${
                isActiveTab('free')
                  ? 'bg-[#B8DCCC] text-black shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
              }`}
            >
              자유 게시판
            </button>
            <button
              onClick={() => handleTabChange('best')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition ${
                isActiveTab('best')
                  ? 'bg-[#B8DCCC] text-black shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
              }`}
            >
              베스트 게시판
            </button>
            <button
              onClick={() => handleTabChange('bookmark')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition ${
                isActiveTab('bookmark')
                  ? 'bg-[#B8DCCC] text-black shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
              }`}
            >
              북마크 게시판
            </button>
          </div>
        </div>

        {/* 탭 제목 */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{getTabTitle()}</h2>
          <p className="text-gray-600">{getTabDescription()}</p>
        </div>

        {/* 로딩 상태 */}
        {loading && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">게시글을 불러오는 중...</div>
          </div>
        )}

        {/* 에러 상태 */}
        {error && (
          <div className="text-center py-12">
            <div className="text-red-500 text-lg mb-2">{error}</div>
            <button
              onClick={refetch}
              className="text-[#B8DCCC] hover:text-opacity-80 transition"
            >
              다시 시도
            </button>
          </div>
        )}

        {/* 북마크 탭 특별 처리 */}
        {!loading && !error && activeTab === 'bookmark' && (
          <>
            {isAuthenticated === false && renderBookmarkLoginRequired()}
            {isAuthenticated && isEmpty && !hasSearchTerm && renderBookmarkEmpty()}
          </>
        )}

        {/* 메인 콘텐츠 */}
        {!loading && !error && 
         !(activeTab === 'bookmark' && (isAuthenticated === false || (isEmpty && !hasSearchTerm))) && (
          <>
            {/* 검색 및 필터링 */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <form onSubmit={handleSearchSubmit} className="space-y-4">
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
                  <div></div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">정렬:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => handleSortChange(e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#B8DCCC]"
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

            {/* 글쓰기 버튼 */}
            {activeTab !== 'bookmark' && (
              <div className="text-right mb-6">
                <button 
                  onClick={() => navigate('/community/write')}
                  className="bg-[#B8DCCC] text-black font-semibold px-6 py-2 rounded-lg hover:bg-opacity-90 transition"
                >
                  ✍ 글쓰기
                </button>
              </div>
            )}

            {/* 게시글 수 표시 */}
            {totalPosts === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg mb-2">검색 결과가 없습니다</div>
                <button
                  onClick={resetAllFilters}
                  className="text-[#B8DCCC] hover:text-opacity-80 transition"
                >
                  검색 조건 초기화
                </button>
              </div>
            ) : (
              <div className="mb-4 text-sm text-gray-500 text-center">
                총 {totalPosts}개의 게시글 (페이지 {currentPage}/{totalPages})
              </div>
            )}

            {/* 게시글 목록 */}
            <div className="space-y-4 mb-8">
              {currentPosts.map(post => (
                <div
                  key={post.id}
                  className="bg-white border border-gray-200 rounded-lg px-6 py-4 shadow-sm hover:shadow-md transition cursor-pointer relative"
                  onClick={() => navigate(`/community/post/${post.id}`)}
                >
                  {/* 북마크 탭에서는 북마크 표시 */}
                  {activeTab === 'bookmark' && (
                    <div className="absolute top-4 right-4">
                      <span className="text-yellow-500 text-lg">⭐</span>
                    </div>
                  )}
                  
                  <div className="flex items-start justify-between">
                    <div className="flex-1 pr-8">
                      <h3 className="text-lg font-semibold text-[#B8DCCC] hover:text-opacity-80 transition">
                        {post.title}
                      </h3>
                      <div className="text-sm text-gray-600 mt-2 flex items-center gap-2">
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
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition"
                  >
                    이전
                  </button>

                  {/* 페이지 번호 */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
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
                              : 'border border-gray-300 hover:bg-gray-100'
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
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition"
                  >
                    다음
                  </button>
                </div>
              </div>
            )}

            {/* 더 보기 버튼들 */}
            <div className="flex justify-center gap-4 mt-12">
              {activeTab === 'free' && (
                <button
                  onClick={() => navigate('/community/free')}
                  className="px-6 py-2 border border-[#B8DCCC] text-[#B8DCCC] rounded-lg hover:bg-[#B8DCCC] hover:text-black transition"
                >
                  자유 게시판 더보기 →
                </button>
              )}
              {activeTab === 'best' && (
                <button
                  onClick={() => navigate('/community/best')}
                  className="px-6 py-2 border border-[#B8DCCC] text-[#B8DCCC] rounded-lg hover:bg-[#B8DCCC] hover:text-black transition"
                >
                  베스트 게시판 더보기 →
                </button>
              )}
              {activeTab === 'bookmark' && (
                <button
                  onClick={() => navigate('/community/bookmark')}
                  className="px-6 py-2 border border-[#B8DCCC] text-[#B8DCCC] rounded-lg hover:bg-[#B8DCCC] hover:text-black transition"
                >
                  북마크 게시판 더보기 →
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Community