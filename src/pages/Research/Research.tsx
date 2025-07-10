import { Link } from 'react-router-dom'
import { useState } from 'react'
import '../Home/Home.css'

const Research = () => {
  const mockLabs = [
    { id: 1, name: 'AI Vision Lab', professor: '김철수', score: 4.5 },
    { id: 2, name: 'UX Interaction Lab', professor: '이영희', score: 4.8 },
    { id: 3, name: 'Cognitive Robotics Lab', professor: '박지성', score: 4.2 },
    { id: 4, name: 'Human-AI Lab', professor: '최은정', score: 4.3 },
    { id: 5, name: 'Social Robotics Lab', professor: '정우성', score: 4.6 },
    { id: 6, name: 'NLP & Ethics Lab', professor: '장혜진', score: 4.1 },
    { id: 7, name: 'Data Visualization Lab', professor: '홍길동', score: 4.7 },
    { id: 8, name: 'Cognitive Psychology Lab', professor: '최지우', score: 4.4 },
    { id: 9, name: 'Emotion AI Lab', professor: '박보검', score: 4.0 },
    { id: 10, name: 'Sound UX Lab', professor: '이민호', score: 4.6 },
    { id: 11, name: 'AR/VR Lab', professor: '김연아', score: 4.9 },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const labsPerPage = 5;

  const totalPages = Math.ceil(mockLabs.length / labsPerPage);
  const startIndex = (currentPage - 1) * labsPerPage;
  const currentLabs = mockLabs.slice(startIndex, startIndex + labsPerPage);

  return (
    <div className="min-h-screen bg-white text-white">
      <div className="research-list-wrap">
        {/* Header */}
        <div className="text-center py-20 bg-zinc-100">
          <h1 className="text-3xl font-bold text-black mb-2">연구실 / 교수 평가</h1>
          <p className="text-black text-sm mt-5">
            원하는 연구실과 교수를 검색하고, 평가를 남겨보세요.
          </p>
        </div>

        {/* 필터 */}
        <div className="research-table-wrap py-10 px-40">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
            <input
              type="text"
              placeholder="연구실 이름 또는 교수 검색"
              className="border-zinc-100 border-2 border-solid px-4 py-2 rounded-lg text-black text-sm w-full sm:w-auto flex-1"
            />
            <select className="border-zinc-100 border-2 border-solid px-3 py-2 rounded-lg text-black text-sm">
              <option>정렬: 평점 높은 순</option>
              <option>정렬: 평점 낮은 순</option>
              <option>정렬: 이름순</option>
            </select>
          </div>

          {/* 연구실 리스트 */}
          <div className="research-list grid grid-cols-1 gap-6">
            {currentLabs.map((lab) => (
              <Link
                to = "/research/detail"
              >
                <div key={lab.id} className="research-list-item bg-white text-black rounded-lg p-6 shadow-md hover:-translate-y-1 transition">
                  <h3 className="font-semibold text-lg text-[#B8DCCC] mb-1">{lab.name}</h3>
                  <p className="text-sm text-gray-700 mb-2">지도교수: {lab.professor}</p>
                  <p className="text-sm">평균 평점: ⭐ {lab.score}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* 페이지네이션 */}
          <div className="flex justify-center mt-10 gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                className={`px-4 py-2 border rounded-lg text-sm ${
                  pageNum === currentPage ? 'bg-[#B8DCCC] text-white' : 'bg-white text-black border-gray-300'
                }`}
                onClick={() => setCurrentPage(pageNum)}
              >
                {pageNum}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Research;