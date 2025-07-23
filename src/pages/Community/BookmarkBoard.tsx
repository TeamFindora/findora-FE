import '../Home/Home.css'
import { useNavigate } from 'react-router-dom'
import { useState, useMemo, useEffect } from 'react'
import { bookmarksApi, postsApi } from '../../api/posts'
import type { PostResponseDto } from '../../api/posts'
import { isAuthenticated } from '../../api/auth'

const BookmarkBoard = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('latest')
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 10
  const [bookmarkedPosts, setBookmarkedPosts] = useState<PostResponseDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 북마크된 게시글 데이터 로드
  useEffect(() => {
    const loadBookmarkedPosts = async () => {
      if (!isAuthenticated()) {
        setLoading(false)
        setError('로그인이 필요한 서비스입니다.')
        return
      }

      try {
        setLoading(true)
        console.log('북마크 목록 조회 시작')
        
        // 1단계: 내 북마크 목록 가져오기
        const bookmarks = await bookmarksApi.getMyBookmarks()
        console.log('북마크 목록:', bookmarks)
        
        if (bookmarks.length === 0) {
          setBookmarkedPosts([])
          setError(null)
          console.log('북마크된 게시글이 없습니다')
          return
        }
        
        // 2단계: 각 북마크된 게시글의 상세 정보 가져오기
        const postDetailsPromises = bookmarks.map(bookmark => 
          postsApi.getPostById(bookmark.postId).catch(error => {
            console.error(`게시글 ${bookmark.postId} 조회 실패:`, error)
            return null
          })
        )
        
        const postDetails = await Promise.all(postDetailsPromises)
        const validPosts = postDetails.filter((post): post is PostResponseDto => post !== null)
        
        setBookmarkedPosts(validPosts)
        setError(null)
        console.log('북마크된 게시글 로드 완료:', validPosts.length, '개')
        
      } catch (err) {
        console.error('북마크 게시글 로드 실패:', err)
        setError('북마크 목록을 불러오는데 실패했습니다.')
        setBookmarkedPosts([])
      } finally {
        setLoading(false)
      }
    }

    loadBookmarkedPosts()
  }, [])

  const sortOptions = [
    { value: 'latest', label: '최신순' },
    { value: 'oldest', label: '오래된순' },
    { value: 'views', label: '조회순' }
  ]

  // 검색, 필터링, 정렬된 게시글
  const filteredAndSortedPosts = useMemo(() => {
    console.log('북마크 게시글 필터링/정렬:', bookmarkedPosts.length, '개')
    
    // 1. 필터링
    const filtered = bookmarkedPosts.filter(post => {
      // 검색어 필터링 (제목, 작성자에서 검색)
      const searchMatch = searchTerm === '' || 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (post.userNickname || '').toLowerCase().includes(searchTerm.toLowerCase())
      
      return searchMatch
    })

    // 2. 정렬
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'latest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'views':
          return (b.viewCount || 0) - (a.viewCount || 0)
        default:
          return 0
      }
    })

    return filtered
  }, [bookmarkedPosts, searchTerm, sortBy])

  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredAndSortedPosts.length / postsPerPage)
  const startIndex = (currentPage - 1) * postsPerPage
  const endIndex = startIndex + postsPerPage
  const currentPosts = filteredAndSortedPosts.slice(startIndex, endIndex)

  // 페이지 변경 시 상단으로 스크롤
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
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

  // 로그인하지 않은 경우
  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-black text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
            <div className="text-slate-300 text-xl mb-4">🔒 로그인이 필요합니다</div>
            <div className="text-slate-400 mb-6">북마크 기능을 사용하려면 로그인해주세요.</div>
            <button
              onClick={() => navigate('/login')}
              className="bg-[#B8DCCC] text-black px-6 py-3 rounded-lg hover:bg-[#A8CCC0] transition-colors font-medium"
            >
              로그인하기
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-black text-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#B8DCCC] to-white bg-clip-text text-transparent">
            📚 내 북마크
          </h1>
          <p className="text-slate-300 text-lg">즐겨찾기한 게시글을 모아보세요</p>
        </div>

        {/* 뒤로가기 버튼 */}
        <div className="mb-8">
          <button 
            onClick={() => navigate('/community')}
            className="text-[#B8DCCC] hover:text-white transition-colors flex items-center font-medium"
          >
            ← 커뮤니티로 돌아가기
          </button>
        </div>

        {/* 로딩 상태 */}
        {loading && (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#B8DCCC] mb-4"></div>
            <div className="text-slate-300 text-lg font-medium">북마크 목록을 불러오는 중...</div>
          </div>
        )}

        {/* 에러 상태 */}
        {error && (
          <div className="text-center py-16">
            <div className="bg-red-900 border border-red-700 rounded-lg p-6 inline-block">
              <div className="text-red-300 text-lg font-medium mb-4">{error}</div>
              <button
                onClick={() => window.location.reload()}
                className="bg-red-700 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
              >
                다시 시도
              </button>
            </div>
          </div>
        )}

        {/* 검색 및 필터 */}
        {!loading && !error && (
          <div className="bg-slate-800 rounded-lg p-6 mb-8 border border-slate-700">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="제목, 작성자로 검색..."
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#B8DCCC] focus:border-transparent"
                  />
                </div>
                <div className="sm:w-48">
                  <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#B8DCCC] focus:border-transparent"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              {(searchTerm || sortBy !== 'latest') && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="text-sm text-slate-400 hover:text-[#B8DCCC] transition-colors"
                  >
                    초기화
                  </button>
                </div>
              )}
            </form>
          </div>
        )}

        {/* 게시글 목록 */}
        {!loading && !error && (
          <>
            {filteredAndSortedPosts.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-slate-400 text-xl mb-4">📝 북마크한 게시글이 없습니다</div>
                <div className="text-slate-500 mb-6">관심 있는 게시글을 북마크해보세요!</div>
                <button
                  onClick={() => navigate('/community')}
                  className="bg-[#B8DCCC] text-black px-6 py-3 rounded-lg hover:bg-[#A8CCC0] transition-colors font-medium"
                >
                  게시글 둘러보기
                </button>
              </div>
            ) : (
              <>
                <div className="mb-4 text-sm text-slate-400">
                  총 {filteredAndSortedPosts.length}개의 북마크 (페이지 {currentPage}/{totalPages})
                </div>

                {/* 게시글 목록 */}
                <div className="space-y-4 mb-8">
                  {currentPosts.map(post => (
                    <div
                      key={post.id}
                      className="bg-slate-800 border border-slate-700 rounded-lg px-6 py-4 hover:bg-slate-750 hover:border-slate-600 transition cursor-pointer hover:shadow-lg"
                      onClick={() => navigate(`/community/post/${post.id}`)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-[#B8DCCC] mb-2">{post.title}</h3>
                          <div className="text-sm text-slate-400 mb-2 flex items-center gap-4">
                            <span>👤 {post.userNickname}</span>
                            <span>👁️ {post.viewCount || 0} 조회</span>
                            <span>📅 {post.createdAt}</span>
                          </div>
                        </div>
                        <div className="text-yellow-400 ml-4">
                          📚
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 페이지네이션 */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-2 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      이전
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 rounded-lg transition-colors ${
                          currentPage === page
                            ? 'bg-[#B8DCCC] text-black font-medium'
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      다음
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default BookmarkBoard 