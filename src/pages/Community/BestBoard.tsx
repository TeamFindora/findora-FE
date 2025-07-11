import '../Home/Home.css'
import { useNavigate } from 'react-router-dom'
import { useState, useMemo, useEffect } from 'react'
import { postsApi } from '../../api/posts'
import type { PostResponseDto } from '../../api/posts'

const BestBoard = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('latest')
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 10
  const [posts, setPosts] = useState<PostResponseDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 게시글 데이터 로드
  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true)
        const allPosts = await postsApi.getAllPosts()
        console.log('BestBoard API 응답 데이터:', allPosts)
        
        if (Array.isArray(allPosts)) {
          console.log('BestBoard API 데이터 사용:', allPosts.length, '개의 게시글')
          setPosts(allPosts)
        } else if (allPosts && typeof allPosts === 'object' && 'data' in allPosts && Array.isArray((allPosts as any).data)) {
          console.log('BestBoard API data 필드 사용:', (allPosts as any).data.length, '개의 게시글')
          setPosts((allPosts as any).data)
        } else {
          console.log('BestBoard API 응답이 예상과 다름:', allPosts)
          setPosts([])
        }
        setError(null)
      } catch (err) {
        console.error('BestBoard 게시글 로드 실패:', err)
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
    console.log('BestBoard 사용할 데이터:', dataToUse.length, '개')
    
    // 1. 필터링
    let filtered = dataToUse.filter(post => {
      // 검색어 필터링 (제목, 작성자에서 검색)
      const searchMatch = searchTerm === '' || 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (('userNickname' in post ? post.userNickname : (post as any).writer) || '').toLowerCase().includes(searchTerm.toLowerCase())
      
      return searchMatch
    })

    // 2. 정렬 (베스트 게시판은 최신순으로 정렬)
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
          <h1 className="text-3xl font-bold text-[#B8DCCC] mb-2">베스트 게시판</h1>
          <p className="text-gray-300 text-sm">
            인기 있는 게시글들을 모아놓은 공간입니다.
          </p>
        </div>

        {/* 로딩 상태 */}
        {loading && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">게시글을 불러오는 중...</div>
            <div className="text-gray-400 text-sm mt-2">posts: {posts?.length || 0}개, loading: {loading.toString()}</div>
          </div>
        )}

        {/* 에러 상태 */}
        {error && (
          <div className="text-center py-12">
            <div className="text-red-500 text-lg mb-2">{error}</div>
            <button
              onClick={() => window.location.reload()}
              className="text-[#B8DCCC] hover:text-white transition"
            >
              다시 시도
            </button>
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
                      <div className="text-sm text-gray-600 mt-1">
                        작성자: {'userNickname' in post ? post.userNickname : (post as any).writer} · 💬 {'comments' in post ? (post as any).comments : 0} 댓글 · 👁️ {'views' in post ? (post as any).views : 0} 조회
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

            {/* 뒤로가기 버튼 */}
            <div className="text-center mt-8">
              <button
                onClick={() => navigate('/community')}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                ← 커뮤니티로 돌아가기
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default BestBoard 