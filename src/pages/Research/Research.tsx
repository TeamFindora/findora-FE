import '../Home/Home.css'

const Research = () => {
  const mockLabs = [
    { id: 1, name: 'AI Vision Lab', professor: '김철수', score: 4.5 },
    { id: 2, name: 'UX Interaction Lab', professor: '이영희', score: 4.8 },
    { id: 3, name: 'Cognitive Robotics Lab', professor: '박지성', score: 4.2 }
  ]

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-[#B8DCCC] mb-2">연구실 / 교수 평가</h1>
          <p className="text-gray-300 text-sm">
            원하는 연구실과 교수를 검색하고, 평가를 남겨보세요.
          </p>
        </div>

        {/* 필터 */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <input
            type="text"
            placeholder="연구실 이름 또는 교수 검색"
            className="px-4 py-2 rounded-lg text-black text-sm w-full sm:w-auto flex-1"
          />
          <select className="px-3 py-2 rounded-lg text-black text-sm">
            <option>정렬: 평점 높은 순</option>
            <option>정렬: 평점 낮은 순</option>
            <option>정렬: 이름순</option>
          </select>
        </div>

        {/* 연구실 리스트 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockLabs.map((lab) => (
            <div key={lab.id} className="bg-white text-black rounded-lg p-6 shadow-md hover:-translate-y-1 transition">
              <h3 className="font-semibold text-lg text-[#B8DCCC] mb-1">{lab.name}</h3>
              <p className="text-sm text-gray-700 mb-2">지도교수: {lab.professor}</p>
              <p className="text-sm">평균 평점: ⭐ {lab.score}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Research
