import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { postsApi } from '../../api/posts'
import { getCurrentUser } from '../../api/auth'
import MessageSidebar from '../../components/Messaging/MessageSidebar'

const mockTips = [
  {
    id: 1,
    title: 'MIT 합격 꿀팁',
    author: 'senior1',
    preview: 'SOP 작성에서 가장 중요한 것은...',
    content: 'SOP 작성에서 가장 중요한 것은 진정성입니다. ... (전체 내용)',
    paid: false,
    price: 3000,
    school: 'MIT',
    major: 'Computer Science',
    year: '2024',
    views: 1250,
    rating: 4.8
  },
  {
    id: 2,
    title: '스탠포드 인터뷰 후기',
    author: 'senior2',
    preview: '인터뷰에서 받은 질문은...',
    content: '인터뷰에서 받은 질문은 예상과 달랐습니다. ... (전체 내용)',
    paid: false,
    price: 3000,
    school: 'Stanford',
    major: 'Electrical Engineering',
    year: '2024',
    views: 980,
    rating: 4.9
  },
  {
    id: 3,
    title: 'Cambridge Physics 합격 경험담',
    author: 'senior3',
    preview: '영국 대학원 지원 시 주의사항...',
    content: '영국 대학원 지원 시 주의사항과 팁을 공유합니다...',
    paid: false,
    price: 3000,
    school: 'Cambridge',
    major: 'Physics',
    year: '2024',
    views: 756,
    rating: 4.7
  },
  {
    id: 4,
    title: 'UC Berkeley AI 전공 합격기',
    author: 'senior4',
    preview: 'AI 전공 지원 시 필요한 준비사항...',
    content: 'AI 전공 지원 시 필요한 준비사항과 팁을 공유합니다...',
    paid: false,
    price: 3000,
    school: 'UC Berkeley',
    major: 'Artificial Intelligence',
    year: '2024',
    views: 1100,
    rating: 4.6
  }
]

const mockAdmissions = [
  { id: 1, school: 'MIT', country: 'USA', major: 'CS', deadline: '2024-12-01' },
  { id: 2, school: 'Stanford', country: 'USA', major: 'EE', deadline: '2024-12-10' },
  { id: 3, school: 'Cambridge', country: 'UK', major: 'Physics', deadline: '2024-11-20' }
]

const Admission = () => {
  const navigate = useNavigate()
  const [selectedTip, setSelectedTip] = useState<any>(null)
  const [paidTips, setPaidTips] = useState<number[]>([])
  const [search, setSearch] = useState('')
  const [admissionPosts, setAdmissionPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isMessageSidebarOpen, setIsMessageSidebarOpen] = useState(false)
  const [selectedAuthorUserId, setSelectedAuthorUserId] = useState<string | null>(null)
  const [selectedAuthorNickname, setSelectedAuthorNickname] = useState<string | null>(null)
  
  // 현재 로그인한 사용자 정보
  const currentUser = getCurrentUser()

  // 백엔드 API에서 입시관 게시글들 불러오기 (categories 3번)
  useEffect(() => {
    const fetchAdmissionPosts = async () => {
      try {
        setLoading(true)
        const posts = await postsApi.getAllPosts()
        
        console.log('입시관 페이지 - 전체 게시글 수:', posts.length)
        console.log('입시관 페이지 - 전체 게시글 카테고리들:', posts.map(p => ({
          id: p.id,
          title: p.title,
          categoryId: p.category?.id || p.categoryId,
          category: p.category
        })))
        
        // categories 3번 (입시관) 게시글만 필터링하고 필요한 형태로 변환
        // API 응답에서 categoryId는 post.category.id 형태로 제공됨
        const admissionOnlyPosts = posts
          .filter(post => {
            const categoryId = post.category?.id || post.categoryId
            console.log('입시관 페이지 - 게시글 카테고리 확인:', categoryId, post.title)
            return categoryId === 3
          })
          .map(post => {
            // 내용에서 학교, 전공, 합격년도, 만족도 추출
            const content = post.content
            const schoolMatch = content.match(/🎓 \*\*학교\*\*: (.+)/)
            const majorMatch = content.match(/📚 \*\*전공\*\*: (.+)/)
            const yearMatch = content.match(/📅 \*\*합격년도\*\*: (.+)년/)
            const ratingMatch = content.match(/⭐ \*\*만족도\*\*: (.+)\/5/)
            
            // 실제 내용 부분 추출 (--- 이후)
            const actualContent = content.split('---')[1]?.trim() || content
            
            return {
              id: post.id,
              title: post.title,
              author: post.userNickname || '익명',
              userId: post.userId, // 쪽지 기능을 위한 작성자 userId 추가
              preview: actualContent.substring(0, 100) + (actualContent.length > 100 ? '...' : ''),
              content: actualContent,
              paid: false,
              price: 3000,
              school: schoolMatch ? schoolMatch[1].trim() : '미분류',
              major: majorMatch ? majorMatch[1].trim() : '미분류',
              year: yearMatch ? yearMatch[1].trim() : '2024',
              views: 0, // 추후 구현
              rating: ratingMatch ? parseFloat(ratingMatch[1]) : 5,
              createdAt: post.createdAt
            }
          })
        
        console.log('입시관 페이지 - 필터링된 게시글 수:', admissionOnlyPosts.length)
        setAdmissionPosts(admissionOnlyPosts)
      } catch (error) {
        console.error('입시관 게시글 불러오기 실패:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAdmissionPosts()
  }, [])

  // 검색 필터링
  // DB에서 불러온 게시글이 있으면 목업 데이터는 제외
  const allTips = admissionPosts.length > 0 ? admissionPosts : [...mockTips, ...admissionPosts]
  const filteredTips = useMemo(() =>
    allTips.filter(tip =>
      [tip.title, tip.preview, tip.content, tip.author, tip.school, tip.major]
        .some(field => field.toLowerCase().includes(search.toLowerCase()))
    ), [search, admissionPosts]
  )

  const filteredAdmissions = useMemo(() =>
    mockAdmissions.filter(info =>
      [info.school, info.country, info.major]
        .some(field => field.toLowerCase().includes(search.toLowerCase()))
    ), [search]
  )

  // 1:1 질문하기 버튼 클릭 시 쪽지 사이드바 열기
  const handlePay = (tip: any) => {
    if (!tip.userId) {
      alert('작성자 정보를 찾을 수 없습니다.')
      return
    }
    
    // 쪽지 사이드바 열기
    setSelectedAuthorUserId(tip.userId.toString())
    setSelectedAuthorNickname(tip.author)
    setIsMessageSidebarOpen(true)
    setSelectedTip(null) // 모달 닫기
  }

  // 쪽지 사이드바 닫기
  const handleCloseMessageSidebar = () => {
    setIsMessageSidebarOpen(false)
    setSelectedAuthorUserId(null)
    setSelectedAuthorNickname(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* 헤더 */}
        <div className="mb-12">
          <h1 className="text-3xl font-semibold text-gray-900 mb-3">합격수기</h1>
          <p className="text-gray-600 text-lg">실제 합격자들의 생생한 경험담을 만나보세요</p>
        </div>

        {/* 검색창 */}
        <div className="mb-8">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="학교명, 전공, 키워드로 검색"
            className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        {/* 작성 버튼 */}
        <div className="flex justify-end mb-8">
          <button
            onClick={() => navigate('/admission/write')}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            합격수기 작성
          </button>
        </div>

        {/* 합격수기 목록 */}
        <div className="space-y-4 mb-16">
          {loading ? (
            <div className="text-center text-gray-500 py-16">
              <div className="animate-spin w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full mx-auto mb-4"></div>
              <div>합격수기를 불러오는 중...</div>
            </div>
          ) : filteredTips.length === 0 ? (
            <div className="text-center text-gray-500 py-16">
              <div className="text-gray-400 mb-2">검색 결과가 없습니다</div>
              <div className="text-sm text-gray-400">다른 키워드로 검색해보세요</div>
            </div>
          ) : filteredTips.map(tip => (
            <div key={tip.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-md font-medium">
                      {tip.school}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-md">
                      {tip.major}
                    </span>
                    <span className="text-sm text-gray-500">{tip.year}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{tip.title}</h3>
                  <p className="text-gray-600 text-sm mb-3 leading-relaxed">{tip.preview}</p>
                  <div className="text-xs text-gray-500">
                    작성자: {tip.author} • {new Date(tip.createdAt).toLocaleString('ko-KR', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
                <div className="ml-6 flex-shrink-0">
                  <button
                    className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium text-sm border border-blue-200 hover:border-blue-300 rounded-md transition-colors"
                    onClick={() => setSelectedTip(tip)}
                  >
                    자세히 보기
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 상세보기 모달 */}
        {selectedTip && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full relative max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">{selectedTip.title}</h3>
                <button
                  className="text-gray-400 hover:text-gray-600"
                  onClick={() => setSelectedTip(null)}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              
              <div className="p-6">
                {/* 모달 헤더 */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-md font-medium">
                      {selectedTip.school}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-md">
                      {selectedTip.major}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    작성자: {selectedTip.author} • {selectedTip.year} • {new Date(selectedTip.createdAt).toLocaleString('ko-KR', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>

                {/* 모달 내용 */}
                <div className="mb-6">
                  {paidTips.includes(selectedTip.id) ? (
                    <div className="prose max-w-none">
                      <div className="text-gray-700 leading-relaxed">{selectedTip.content}</div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-gray-700 leading-relaxed mb-6">{selectedTip.preview}</div>
                      {/* 내가 작성한 글이 아닌 경우에만 1:1 질문하기 버튼 표시 */}
                      {currentUser && currentUser.userId !== selectedTip.userId && (
                        <div className="bg-gray-50 rounded-lg p-6 text-center">
                          <div className="text-sm text-gray-600 mb-4">작성자와 1:1 질문이 가능합니다</div>
                          <button
                            className="px-6 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                            onClick={() => handlePay(selectedTip)}
                          >
                            1:1 질문하기
                          </button>
                        </div>
                      )}
                      {/* 내가 작성한 글인 경우 */}
                      {currentUser && currentUser.userId === selectedTip.userId && (
                        <div className="bg-blue-50 rounded-lg p-6 text-center">
                          <div className="text-sm text-blue-600">내가 작성한 합격수기입니다</div>
                        </div>
                      )}
                      {/* 로그인하지 않은 경우 */}
                      {!currentUser && (
                        <div className="bg-gray-50 rounded-lg p-6 text-center">
                          <div className="text-sm text-gray-600 mb-4">작성자와 1:1 질문하려면 로그인이 필요합니다</div>
                          <button
                            className="px-6 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                            onClick={() => navigate('/login')}
                          >
                            로그인하기
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 하단: 해외 대학원 입시 정보 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">입시 정보</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">학교명</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">국가</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">전공</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">지원 마감일</th>
                </tr>
              </thead>
              <tbody>
                {filteredAdmissions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center text-gray-500 py-8">검색 결과가 없습니다</td>
                  </tr>
                ) : filteredAdmissions.map(info => (
                  <tr key={info.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-gray-900">{info.school}</td>
                    <td className="py-3 px-4 text-gray-600">{info.country}</td>
                    <td className="py-3 px-4 text-gray-600">{info.major}</td>
                    <td className="py-3 px-4 text-red-600 font-medium">{info.deadline}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 쪽지 사이드바 */}
      <MessageSidebar 
        isOpen={isMessageSidebarOpen} 
        onClose={handleCloseMessageSidebar}
        targetUserId={selectedAuthorUserId}
        authorNickname={selectedAuthorNickname}
      />
    </div>
  )
}

export default Admission
