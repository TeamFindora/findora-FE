import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { MagnifyingGlassIcon, StarIcon, EyeIcon, BookOpenIcon, ChatBubbleLeftEllipsisIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'

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
  const [selectedTip, setSelectedTip] = useState<typeof mockTips[0] | null>(null)
  const [paidTips, setPaidTips] = useState<number[]>([])
  const [search, setSearch] = useState('')

  // 검색 필터링
  const filteredTips = useMemo(() =>
    mockTips.filter(tip =>
      [tip.title, tip.preview, tip.content, tip.author, tip.school, tip.major]
        .some(field => field.toLowerCase().includes(search.toLowerCase()))
    ), [search]
  )

  const filteredAdmissions = useMemo(() =>
    mockAdmissions.filter(info =>
      [info.school, info.country, info.major]
        .some(field => field.toLowerCase().includes(search.toLowerCase()))
    ), [search]
  )

  // 결제 시
  const handlePay = (id: number) => {
    setPaidTips([...paidTips, id])
    alert('결제가 완료되었습니다! 전체 내용을 확인하고 질문할 수 있습니다.')
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 py-12 px-4">
      <div className="wrapper">
        {/* 강조 섹션 - 합격자 후기/꿀팁 */}
        <div className="bg-white rounded-xl p-8 mb-8 shadow-sm border border-gray-100 relative">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">입시관</h1>
            <p className="text-gray-600 text-lg">
              실제 합격자들의 생생한 경험담과 꿀팁을 만나보세요
            </p>
          </div>
          
          {/* 검색창과 합격자 인증 버튼 */}
          <div className="flex gap-3 items-center">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="키워드로 후기/입시정보 검색 (예: ai, 인공지능, 미국, MIT...)"
                className="w-full pl-10 p-4 border border-gray-300 rounded-xl text-gray-800 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              type="button"
              onClick={() => navigate('/admission/verify')}
              className="flex items-center gap-2 bg-gray-800 text-white px-4 py-4 rounded-xl font-semibold shadow-sm hover:shadow-md hover:bg-gray-700 transition-all duration-300 whitespace-nowrap"
            >
              <ShieldCheckIcon className="w-4 h-4" />
              합격자 인증
            </button>
          </div>
        </div>

        {/* 합격자 후기/꿀팁 카드 그리드 */}
        <div className="grid grid-cols-1 gap-8 mb-16">
          {filteredTips.length === 0 ? (
            <div className="col-span-2 text-center text-gray-400 py-12">
              <MagnifyingGlassIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <div className="text-xl">검색 결과가 없습니다.</div>
            </div>
          ) : filteredTips.map(tip => (
            <div key={tip.id} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
              {/* 상단 헤더 */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm font-semibold">
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
                    <StarIcon className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold">{tip.rating}</span>
                  </div>
                  <div className="text-xs text-gray-500">조회 {tip.views}</div>
                </div>
              </div>

              {/* 미리보기 내용 */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6 flex items-center justify-between">
                <p className="text-gray-700 leading-relaxed flex-1 mr-4">{tip.preview}</p>
                <button
                  className="bg-blue-200/40 text-gray-700 px-6 py-3 rounded-lg font-semibold shadow-sm hover:shadow-md hover:bg-[#B8DCCC]/30 transition-all duration-300 border border-[#B8DCCC]/30 whitespace-nowrap"
                  onClick={() => setSelectedTip(tip)}
                >
                  <BookOpenIcon className="w-4 h-4 inline mr-2" />
                  합격수기 상세보기
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
                  <span className="bg-black text-white px-4 py-2 rounded-full text-sm font-semibold">
                    {selectedTip.school}
                  </span>
                  <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm">
                    {selectedTip.major}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{selectedTip.title}</h3>
                <div className="text-gray-600 mb-4">by {selectedTip.author} • {selectedTip.year}년 합격</div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <StarIcon className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    {selectedTip.rating} 평점
                  </span>
                  <span className="flex items-center gap-1">
                    <EyeIcon className="w-4 h-4" />
                    {selectedTip.views} 조회
                  </span>
                </div>
              </div>

              {/* 모달 내용 */}
              <div className="mb-6">
                {paidTips.includes(selectedTip.id) ? (
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-bold text-lg mb-4 text-gray-800 flex items-center gap-2">
                      <BookOpenIcon className="w-5 h-5" />
                      전체 내용
                    </h4>
                    <p className="text-gray-700 leading-relaxed">{selectedTip.content}</p>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-bold text-lg mb-4 text-gray-800 flex items-center gap-2">
                      <BookOpenIcon className="w-5 h-5" />
                      미리보기
                    </h4>
                    <p className="text-gray-700 leading-relaxed mb-4">{selectedTip.preview}</p>
                    <div className="bg-white rounded-lg p-4 mb-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-gray-800 mb-2">{selectedTip.price.toLocaleString()}원</div>
                        <div className="text-sm text-gray-600 mb-4">전체 내용 + 1:1 질문 기능</div>
                        <button
                          className="bg-blue-200 text-black px-8 py-3 rounded-lg font-semibold shadow-sm hover:shadow-md hover:bg-gray-700 transition-all duration-300"
                          onClick={() => handlePay(selectedTip.id)}
                        >
                          <ChatBubbleLeftEllipsisIcon className="w-4 h-4 inline mr-2" />
                          1:1 질문하기
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 질문 기능 */}
              {paidTips.includes(selectedTip.id) && (
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-bold text-lg mb-4 text-gray-800 flex items-center gap-2">
                    <ChatBubbleLeftEllipsisIcon className="w-5 h-5" />
                    합격자에게 질문하기
                  </h4>
                  <textarea
                    className="w-full border border-gray-300 rounded-xl p-4 mb-4 text-gray-800 bg-white resize-none"
                    placeholder="합격자에게 궁금한 점을 질문해보세요! (예: SOP 작성 팁, 인터뷰 준비 방법 등)"
                    rows={4}
                  />
                  <button className="bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold shadow-sm hover:shadow-md hover:bg-gray-700 transition-all duration-300">
                    질문 보내기
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 하단: 해외 대학원 입시 정보 */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">해외 대학원 입시 정보</h2>
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
    </div>
  )
}

export default Admission
