import '../Home/Home.css'
import { useNavigate } from 'react-router-dom'
import { useState, useMemo, useEffect } from 'react'
import { bookmarksApi, postsApi, CATEGORIES } from '../../api/posts'
import type { PostResponseDto } from '../../api/posts'
import CommentCount from '../../components/CommentCount'
import { isAuthenticated } from '../../api/auth'

const Community = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('latest')
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 5
  const [activeTab, setActiveTab] = useState<'free' | 'best' | 'bookmark'>('free')
  const [posts, setPosts] = useState<PostResponseDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 북마크 관련 상태
  const [bookmarkLoading, setBookmarkLoading] = useState(false)
  const [bookmarkError, setBookmarkError] = useState<string | null>(null)
  const [bookmarkedPosts, setBookmarkedPosts] = useState<PostResponseDto[]>([])
  const [bookmarkSearch, setBookmarkSearch] = useState('')
  const [bookmarkSort, setBookmarkSort] = useState('latest')
  const [bookmarkPage, setBookmarkPage] = useState(1)
  const bookmarkPostsPerPage = 10;

  // 게시글 데이터 로드 (자유/베스트)
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

  // 북마크 게시글 데이터 로드
  useEffect(() => {
    if (activeTab !== 'bookmark') return;
    const loadBookmarkedPosts = async () => {
      if (!isAuthenticated()) {
        setBookmarkLoading(false)
        setBookmarkError('로그인이 필요한 서비스입니다.')
        return
      }
      try {
        setBookmarkLoading(true)
        const bookmarks = await bookmarksApi.getMyBookmarks()
        if (bookmarks.length === 0) {
          setBookmarkedPosts([])
          setBookmarkError(null)
          return
        }
        const postDetailsPromises = bookmarks.map(bookmark => 
          postsApi.getPostById(bookmark.postId).catch(() => null)
        )
        const postDetails = await Promise.all(postDetailsPromises)
        const validPosts = postDetails.filter((post): post is PostResponseDto => post !== null)
        setBookmarkedPosts(validPosts)
        setBookmarkError(null)
      } catch (err) {
        setBookmarkError('북마크 목록을 불러오는데 실패했습니다.')
        setBookmarkedPosts([])
      } finally {
        setBookmarkLoading(false)
      }
    }
    loadBookmarkedPosts()
  }, [activeTab])

  // 임시 데이터 (API 연동 전까지 사용)
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
    // API 데이터가 있으면 사용, 없으면 임시 데이터 사용
    const dataToUse = posts && posts.length > 0 ? posts : mockPosts
    console.log('사용할 데이터:', dataToUse.length, '개') // 디버깅용 로그
    
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
          // API 데이터의 viewCount 우선 사용, 없으면 임시 데이터의 views 사용
          if ('viewCount' in a && 'viewCount' in b) {
            return (b as any).viewCount - (a as any).viewCount
          } else if ('views' in a && 'views' in b) {
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

  // 인기 게시글 - API 데이터가 있으면 최신순, 없으면 임시 데이터 사용
  const popularPosts = posts && posts.length > 0 
    ? [...posts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 3)
    : [...mockPosts].sort((a, b) => (b.views + b.comments * 10) - (a.views + a.comments * 10)).slice(0, 3)

  // 자유게시판: 전체 게시글
  const freeBoardPosts = filteredAndSortedPosts
  // 베스트게시판: API 데이터가 있으면 최신순, 없으면 임시 데이터 사용
  const bestBoardPosts = posts && posts.length > 0 
    ? [...posts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    : [...mockPosts].sort((a, b) => (b.views + b.comments * 10) - (a.views + a.comments * 10))

  // 북마크 게시글 필터/정렬/페이지네이션
  const filteredAndSortedBookmarks = useMemo(() => {
    const filtered = bookmarkedPosts.filter(post => {
      const searchMatch = bookmarkSearch === '' || 
        post.title.toLowerCase().includes(bookmarkSearch.toLowerCase()) ||
        (post.userNickname || '').toLowerCase().includes(bookmarkSearch.toLowerCase())
      return searchMatch
    })
    filtered.sort((a, b) => {
      switch (bookmarkSort) {
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
  }, [bookmarkedPosts, bookmarkSearch, bookmarkSort])
  const bookmarkTotalPages = Math.ceil(filteredAndSortedBookmarks.length / bookmarkPostsPerPage)
  const bookmarkStartIndex = (bookmarkPage - 1) * bookmarkPostsPerPage
  const bookmarkEndIndex = bookmarkStartIndex + bookmarkPostsPerPage
  const bookmarkCurrentPosts = filteredAndSortedBookmarks.slice(bookmarkStartIndex, bookmarkEndIndex)

  // 페이지 변경 시 상단으로 스크롤
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // window.scrollTo({ top: 0, behavior: 'smooth' }) // 페이지 상단 스크롤 제거
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
      <div className="community-list-wrap">
        {/* Header */}
        <div className="text-center py-20 bg-zinc-100">
          <h1 className="text-3xl font-bold text-black mb-2">커뮤니티</h1>
          <p className="text-black text-sm mt-5">
            질문하고 나누는 자유로운 공간입니다.
          </p>
        </div>

        {/* 로딩 상태 */}
        {loading && (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <div className="text-slate-700 text-lg font-medium">게시글을 불러오는 중...</div>
            <div className="text-slate-500 text-sm mt-2">posts: {posts?.length || 0}개</div>
          </div>
        )}

        {/* 에러 상태 */}
        {error && (
          <div className="text-center py-16">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 inline-block">
              <div className="text-red-700 text-lg font-medium mb-3">{error}</div>
              <button
                onClick={() => window.location.reload()}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                다시 시도
              </button>
            </div>
          </div>
        )}

        {/* 검색 및 필터링 */}
        {!loading && !error && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-6">
            {/* 검색바 */}
            <div className="flex gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="제목, 작성자로 검색..."
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 text-lg"
                />
              </div>
              <button
                type="submit"
                className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                🔍 검색
              </button>
            </div>

            {/* 정렬 옵션 */}
            <div className="flex items-center justify-between">
              <div></div> {/* 왼쪽 공간 */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-700">정렬:</span>
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
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
                  className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
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
          <div className="text-right mb-8">
            <button 
              onClick={() => navigate('/community/write')}
              className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              ✍ 글쓰기
            </button>
          </div>
        )}

        {/* 검색 결과 표시 */}
        {!loading && !error && filteredAndSortedPosts && (
          filteredAndSortedPosts.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 inline-block">
                <div className="text-slate-600 text-lg mb-3">검색 결과가 없습니다</div>
                <button
                  onClick={clearSearch}
                  className="text-blue-600 hover:text-blue-700 transition-colors font-medium"
                >
                  검색 조건 초기화
                </button>
              </div>
            </div>
          ) : (
            <div className="mb-6 text-sm text-slate-600 bg-white rounded-lg p-3 border border-gray-200">
              총 {filteredAndSortedPosts.length}개의 게시글 (페이지 {currentPage}/{totalPages})
            </div>
          )
        )}

        {/* 상단 실시간 인기 게시글 */}
        {!loading && !error && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">🔥 실시간 인기게시글</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {popularPosts.map(post => (
                <div
                  key={post.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer"
                  onClick={() => navigate(`/community/post/${post.id}`)}
                >
                  <h3 className="text-lg font-semibold text-slate-800 mb-3 line-clamp-2">{post.title}</h3>
                  <div className="text-sm text-slate-600 mb-2">👤 {'userNickname' in post ? post.userNickname : (post as any).writer}</div>
                  <div className="text-xs text-slate-500 mb-2">📅 {post.createdAt}</div>
                  <div className="text-xs text-slate-600 flex items-center gap-3">
                    <span>👀 {'viewCount' in post ? post.viewCount : ('views' in post ? (post as any).views : 0)}</span>
                    <CommentCount postId={post.id} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 게시판 탭 */}
        {!loading && !error && (
          <div className="flex items-center justify-between mb-8">
            <div className="flex gap-3">
              <button
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${activeTab === 'free' ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 text-slate-700 hover:bg-gray-200'}`}
                onClick={() => setActiveTab('free')}
              >
                📝 자유 게시판
              </button>
              <button
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${activeTab === 'best' ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 text-slate-700 hover:bg-gray-200'}`}
                onClick={() => setActiveTab('best')}
              >
                ⭐ 베스트 게시판
              </button>
              <button
                className="px-6 py-3 rounded-lg font-semibold transition-colors bg-yellow-50 text-yellow-700 border border-yellow-200 hover:bg-yellow-100"
                onClick={() => setActiveTab('bookmark')}
              >
                📚 내 북마크
              </button>
            </div>
            <button
              onClick={() => navigate(`/community/${activeTab}`)}
              className="px-6 py-3 bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-700 transition-colors shadow-sm"
            >
              더보기 →
            </button>
          </div>
        )}

        {/* 게시글 목록 (탭에 따라 다르게) */}
        {!loading && !error && (
          <>
            {activeTab === 'bookmark' ? (
              <>
                {/* 북마크 전용 검색/정렬/초기화 */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                  <form onSubmit={e => { e.preventDefault(); }} className="space-y-6">
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={bookmarkSearch}
                          onChange={e => { setBookmarkSearch(e.target.value); setBookmarkPage(1); }}
                          placeholder="제목, 작성자로 검색..."
                          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-slate-800 text-lg"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div></div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-slate-700">정렬:</span>
                        <select
                          value={bookmarkSort}
                          onChange={e => { setBookmarkSort(e.target.value); setBookmarkPage(1); }}
                          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 text-slate-700"
                        >
                          <option value="latest">최신순</option>
                          <option value="oldest">오래된순</option>
                          <option value="views">조회순</option>
                        </select>
                      </div>
                    </div>
                    {(bookmarkSearch || bookmarkSort !== 'latest') && (
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => { setBookmarkSearch(''); setBookmarkSort('latest'); setBookmarkPage(1); }}
                          className="text-sm text-slate-500 hover:text-yellow-600 transition-colors"
                        >
                          초기화
                        </button>
                      </div>
                    )}
                  </form>
                </div>
                {/* 북마크 게시글 목록 */}
                <div className="space-y-4">
                  {bookmarkCurrentPosts.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 inline-block">
                        <div className="text-slate-600 text-lg mb-3">북마크한 게시글이 없습니다</div>
                        <button
                          onClick={() => setActiveTab('free')}
                          className="bg-yellow-400 text-black px-6 py-3 rounded-lg hover:bg-yellow-500 transition-colors font-medium"
                        >
                          게시글 둘러보기
                        </button>
                      </div>
                    </div>
                  ) : (
                    bookmarkCurrentPosts.map(post => (
                      <div
                        key={post.id}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer"
                        onClick={() => navigate(`/community/post/${post.id}`)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-slate-800 mb-3 line-clamp-2">{post.title}</h3>
                            <div className="text-sm text-slate-600 mb-2 flex items-center gap-4">
                              <span>👤 {post.userNickname || (post as any).writer}</span>
                              <CommentCount postId={post.id} />
                              <span>👀 {post.viewCount || (post as any).views || 0}</span>
                            </div>
                            <div className="text-xs text-slate-500">
                              📅 {post.createdAt}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                {/* 북마크 페이지네이션 */}
                {bookmarkTotalPages > 1 && (
                  <div className="flex justify-center items-center space-x-2 mt-8">
                    <button
                      onClick={() => setBookmarkPage(bookmarkPage - 1)}
                      disabled={bookmarkPage === 1}
                      className="px-3 py-2 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      이전
                    </button>
                    {Array.from({ length: bookmarkTotalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setBookmarkPage(page)}
                        className={`px-3 py-2 rounded-lg transition-colors ${
                          bookmarkPage === page
                            ? 'bg-yellow-400 text-black font-medium'
                            : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setBookmarkPage(bookmarkPage + 1)}
                      disabled={bookmarkPage === bookmarkTotalPages}
                      className="px-3 py-2 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      다음
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-4">
                {(activeTab === 'free' ? currentPosts : bestBoardPosts.slice(0, 5)).map(post => (
                  <div
                    key={post.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer"
                    onClick={() => navigate(`/community/post/${post.id}`)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-slate-800 mb-3 line-clamp-2">{post.title}</h3>
                        <div className="text-sm text-slate-600 mb-2 flex items-center gap-4">
                          <span>👤 {'userNickname' in post ? post.userNickname : (post as any).writer}</span>
                          <CommentCount postId={post.id} />
                          <span>👀 {'viewCount' in post ? post.viewCount : ('views' in post ? (post as any).views : 0)}</span>
                        </div>
                        <div className="text-xs text-slate-500">
                          📅 {post.createdAt}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Community
