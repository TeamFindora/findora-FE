import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { postsApi } from '../../api/posts'
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 검색창 */}
        <div className="mb-8 flex gap-2">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="키워드로 후기/입시정보 검색 (예: ai, 인공지능, 미국, MIT...)"
            className="w-full p-4 border border-gray-300 rounded-xl text-gray-800 bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-[#B8DCCC] focus:border-transparent"
          />
        </div>

        {/* 강조 섹션 - 합격자 후기/꿀팁 */}
        <div className="bg-gradient-to-r from-[#B8DCCC] to-[#9BC5B3] rounded-xl p-6 mb-8 shadow-lg relative">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">해외 대학원 합격자 후기/꿀팁</h1>
            <p className="text-white text-sm opacity-90 mt-2">
              실제 합격자들의 생생한 경험담과 꿀팁을 만나보세요
            </p>
          </div>
          <button
            onClick={() => navigate('/admission/write')}
            className="absolute bottom-4 right-4 bg-white text-[#B8DCCC] px-4 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            합격자 인증
          </button>
        </div>

        {/* 합격자 후기/꿀팁 카드 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16">
          {loading ? (
            <div className="col-span-2 text-center text-gray-400 py-12">
              <div className="text-6xl mb-4">⏳</div>
              <div className="text-xl">합격수기를 불러오는 중...</div>
            </div>
          ) : filteredTips.length === 0 ? (
            <div className="col-span-2 text-center text-gray-400 py-12">
              <div className="text-6xl mb-4">🔍</div>
              <div className="text-xl">검색 결과가 없습니다.</div>
            </div>
          ) : filteredTips.map(tip => (
            <div key={tip.id} className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              {/* 상단 헤더 */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-[#B8DCCC] text-black px-3 py-1 rounded-full text-sm font-semibold">
                      {tip.school}
                    </span>
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                      {tip.major}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{tip.title}</h3>
                  <div className="text-sm text-gray-600 mb-3">by {tip.author} • {tip.year}년 합격</div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-yellow-500">⭐</span>
                    <span className="font-semibold">{tip.rating}</span>
                  </div>
                  <div className="text-xs text-gray-500">조회 {tip.views}</div>
                </div>
              </div>

              {/* 미리보기 내용 */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <p className="text-gray-700 leading-relaxed">{tip.preview}</p>
              </div>

              {/* 합격수기 상세보기 버튼 */}
              <div className="flex justify-end">
                <button
                  className="bg-gradient-to-r from-[#B8DCCC] to-[#9BC5B3] text-black px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  onClick={() => setSelectedTip(tip)}
                >
                  📖 합격수기 상세보기
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 상세보기 모달 */}
        {selectedTip && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full relative shadow-2xl max-h-[90vh] overflow-y-auto">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-black text-2xl"
                onClick={() => setSelectedTip(null)}
              >✕</button>
              
              {/* 모달 헤더 */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-[#B8DCCC] text-black px-4 py-2 rounded-full text-sm font-semibold">
                    {selectedTip.school}
                  </span>
                  <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm">
                    {selectedTip.major}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{selectedTip.title}</h3>
                <div className="text-gray-600 mb-4">by {selectedTip.author} • {selectedTip.year}년 합격</div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>⭐ {selectedTip.rating} 평점</span>
                  <span>👁️ {selectedTip.views} 조회</span>
                </div>
              </div>

              {/* 모달 내용 */}
              <div className="mb-6">
                {paidTips.includes(selectedTip.id) ? (
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-bold text-lg mb-4 text-[#B8DCCC]">📖 전체 내용</h4>
                    <p className="text-gray-700 leading-relaxed">{selectedTip.content}</p>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-bold text-lg mb-4 text-[#B8DCCC]">📖 미리보기</h4>
                    <p className="text-gray-700 leading-relaxed mb-4">{selectedTip.preview}</p>
                    <div className="bg-white rounded-lg p-4 mb-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-[#B8DCCC] mb-2">{selectedTip.price.toLocaleString()}원</div>
                        <div className="text-sm text-gray-600 mb-4">전체 내용 + 1:1 질문 기능</div>
                        <button
                          className="bg-gradient-to-r from-[#B8DCCC] to-[#9BC5B3] text-black px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                          onClick={() => handlePay(selectedTip)}
                        >
                          💬 1:1 질문하기
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 질문 기능 */}
              {paidTips.includes(selectedTip.id) && (
                <div className="bg-[#B8DCCC] bg-opacity-10 rounded-xl p-6">
                  <h4 className="font-bold text-lg mb-4 text-[#B8DCCC]">💬 합격자에게 질문하기</h4>
                  <textarea
                    className="w-full border border-gray-300 rounded-xl p-4 mb-4 text-gray-800 bg-white resize-none"
                    placeholder="합격자에게 궁금한 점을 질문해보세요! (예: SOP 작성 팁, 인터뷰 준비 방법 등)"
                    rows={4}
                  />
                  <button className="bg-[#B8DCCC] text-black px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300">
                    질문 보내기
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 하단: 해외 대학원 입시 정보 */}
        <div className="bg-white rounded-2xl p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-[#B8DCCC] mb-6">해외 대학원 입시 정보</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">학교명</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">국가</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">전공</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">지원 마감일</th>
                </tr>
              </thead>
              <tbody>
                {filteredAdmissions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center text-gray-400 py-8">검색 결과가 없습니다.</td>
                  </tr>
                ) : filteredAdmissions.map(info => (
                  <tr key={info.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 font-medium">{info.school}</td>
                    <td className="py-4 px-4">{info.country}</td>
                    <td className="py-4 px-4">{info.major}</td>
                    <td className="py-4 px-4 text-red-600 font-medium">{info.deadline}</td>
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
