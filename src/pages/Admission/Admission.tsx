import '../Home/Home.css'

const Admission = () => {
  const mockAdmissions = [
    { id: 1, university: 'MIT', deadline: '2025-12-01', link: '#' },
    { id: 2, university: 'Stanford', deadline: '2025-11-15', link: '#' },
    { id: 3, university: 'Harvard', deadline: '2025-12-10', link: '#' }
  ]

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-[#B8DCCC] mb-2">입시관</h1>
          <p className="text-gray-300 text-sm">
            주요 대학들의 입시 일정과 정보를 한 눈에 확인하세요.
          </p>
        </div>

        {/* 대학 리스트 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockAdmissions.map((item) => (
            <a
              key={item.id}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-black rounded-lg p-6 shadow-md hover:-translate-y-1 transition block"
            >
              <h3 className="text-lg font-semibold text-[#B8DCCC] mb-1">{item.university}</h3>
              <p className="text-sm">마감일: {item.deadline}</p>
              <p className="text-xs text-gray-500 mt-1">※ 상세 링크 클릭 시 이동</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Admission
