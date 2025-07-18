import '../Home/Home.css'
import { useNavigate } from 'react-router-dom'
import { useState, useMemo, useEffect } from 'react'
import { postsApi, CATEGORIES } from '../../api/posts'
import type { PostResponseDto } from '../../api/posts'

const Community = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('latest')
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 5
  const [activeTab, setActiveTab] = useState<'free' | 'best'>('free')
  const [posts, setPosts] = useState<PostResponseDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 게시글 데이터 로드
  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true)
        const allPosts = await postsApi.getAllPosts()
        console.log('API 응답 데이터:', allPosts) // 디버깅용 로그
        
        // API 응답이 배열인지 확인하고 설정
        if (Array.isArray(allPosts)) {
          console.log('API 데이터 사용:', allPosts.length, '개의 게시글')
          setPosts(allPosts)
        } else if (allPosts && typeof allPosts === 'object' && 'data' in allPosts && Array.isArray((allPosts as any).data)) {
          console.log('API data 필드 사용:', (allPosts as any).data.length, '개의 게시글')
          setPosts((allPosts as any).data)
        } else {
          console.log('API 응답이 예상과 다름:', allPosts)
          setPosts([])
        }
        setError(null)
      } catch (err) {
        console.error('게시글 로드 실패:', err)
        setError('게시글을 불러오는데 실패했습니다.')
        setPosts([])
      } finally {
        setLoading(false)
      }
    }

    loadPosts()
  }, [])

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-slate-800 mb-3">커뮤니티</h1>
          <p className="text-slate-600 text-lg">
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
                    <span>👀 {'views' in post ? (post as any).views : 0}</span>
                    <span>💬 {'comments' in post ? (post as any).comments : 0}</span>
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
            </div>
            <button
              onClick={() => navigate(`/community/${activeTab}`)}
              className="px-6 py-3 bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-700 transition-colors shadow-sm"
            >
              더보기 →
            </button>
          </div>
        )}

        {/* 게시글 목록 (탭에 따라 다르게) - 최대 5개만 표시 */}
        {!loading && !error && (
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
                      <span>💬 {'comments' in post ? (post as any).comments : 0}</span>
                      <span>👀 {'views' in post ? (post as any).views : 0}</span>
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
      </div>
    </div>
  )
}

export default Community
