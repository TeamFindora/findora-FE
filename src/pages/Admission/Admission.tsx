import { useState, useMemo } from 'react'

const mockTips = [
  {
    id: 1,
    title: 'MIT 합격 꿀팁',
    author: 'senior1',
    preview: 'SOP 작성에서 가장 중요한 것은...',
    content: 'SOP 작성에서 가장 중요한 것은 진정성입니다. ... (전체 내용)',
    paid: false,
    price: 3000
  },
  {
    id: 2,
    title: '스탠포드 인터뷰 후기',
    author: 'senior2',
    preview: '인터뷰에서 받은 질문은...',
    content: '인터뷰에서 받은 질문은 예상과 달랐습니다. ... (전체 내용)',
    paid: false,
    price: 3000
  }
]

const mockAdmissions = [
  { id: 1, school: 'MIT', country: 'USA', major: 'CS', deadline: '2024-12-01' },
  { id: 2, school: 'Stanford', country: 'USA', major: 'EE', deadline: '2024-12-10' },
  { id: 3, school: 'Cambridge', country: 'UK', major: 'Physics', deadline: '2024-11-20' }
]

const Admission = () => {
  const [selectedTip, setSelectedTip] = useState<typeof mockTips[0] | null>(null)
  const [paidTips, setPaidTips] = useState<number[]>([])
  const [search, setSearch] = useState('')

  // 검색 필터링
  const filteredTips = useMemo(() =>
    mockTips.filter(tip =>
      [tip.title, tip.preview, tip.content, tip.author]
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
    <div className="min-h-screen bg-[#F8FAFC] text-gray-800 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* 검색창 */}
        <div className="mb-8 flex gap-2">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="키워드로 후기/입시정보 검색 (예: ai, 인공지능, 미국, MIT...)"
            className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 bg-white shadow-sm"
          />
        </div>

        {/* 상단: 합격자 후기/꿀팁 */}
        <h2 className="text-2xl font-bold text-[#B8DCCC] mb-6">해외 대학원 합격자 후기/꿀팁</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {filteredTips.length === 0 ? (
            <div className="col-span-2 text-center text-gray-400">검색 결과가 없습니다.</div>
          ) : filteredTips.map(tip => (
            <div key={tip.id} className="bg-white text-gray-800 rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-semibold text-[#B8DCCC] mb-2">{tip.title}</h3>
              <div className="text-sm text-gray-600 mb-2">by {tip.author}</div>
              <div className="mb-4">{tip.preview}</div>
              <button
                className="bg-[#B8DCCC] text-black px-4 py-2 rounded font-semibold shadow hover:bg-[#a3cbb7] transition"
                onClick={() => setSelectedTip(tip)}
              >
                상세보기
              </button>
            </div>
          ))}
        </div>

        {/* 상세보기 모달/섹션 */}
        {selectedTip && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-white text-gray-800 rounded-lg p-8 max-w-lg w-full relative shadow-lg">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-black"
                onClick={() => setSelectedTip(null)}
              >✕</button>
              <h3 className="text-xl font-bold text-[#B8DCCC] mb-2">{selectedTip.title}</h3>
              <div className="text-sm text-gray-600 mb-2">by {selectedTip.author}</div>
              <div className="mb-4">
                {paidTips.includes(selectedTip.id)
                  ? selectedTip.content
                  : (
                    <>
                      <div className="mb-2">{selectedTip.preview}</div>
                      <div className="text-red-500 font-semibold mb-4">
                        전체 내용과 질문 기능은 결제 후 이용 가능합니다.
                      </div>
                      <button
                        className="bg-[#B8DCCC] text-black px-4 py-2 rounded font-semibold shadow hover:bg-[#a3cbb7] transition"
                        onClick={() => handlePay(selectedTip.id)}
                      >
                        {selectedTip.price}원 결제하고 전체보기/질문하기
                      </button>
                    </>
                  )
                }
              </div>
              {paidTips.includes(selectedTip.id) && (
                <div className="mt-6">
                  <textarea
                    className="w-full border border-gray-300 rounded p-2 mb-2 text-gray-800 bg-[#F8FAFC]"
                    placeholder="합격자에게 질문을 남겨보세요!"
                  />
                  <button className="bg-[#B8DCCC] text-black px-4 py-2 rounded font-semibold shadow hover:bg-[#a3cbb7] transition">
                    질문 보내기
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 하단: 해외 대학원 입시 정보 */}
        <h2 className="text-2xl font-bold text-[#B8DCCC] mb-4 mt-16">해외 대학원 입시 정보</h2>
        <div className="bg-white rounded-lg p-6 text-gray-800 shadow-md">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left py-2">학교명</th>
                <th className="text-left py-2">국가</th>
                <th className="text-left py-2">전공</th>
                <th className="text-left py-2">지원 마감일</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdmissions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center text-gray-400 py-4">검색 결과가 없습니다.</td>
                </tr>
              ) : filteredAdmissions.map(info => (
                <tr key={info.id} className="border-t border-gray-200">
                  <td className="py-2">{info.school}</td>
                  <td className="py-2">{info.country}</td>
                  <td className="py-2">{info.major}</td>
                  <td className="py-2">{info.deadline}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Admission
