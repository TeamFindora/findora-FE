import { Link } from 'react-router-dom'
import { useState } from 'react'

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
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('score');
  const labsPerPage = 5;

  const totalPages = Math.ceil(mockLabs.length / labsPerPage);
  const startIndex = (currentPage - 1) * labsPerPage;
  const currentLabs = mockLabs.slice(startIndex, startIndex + labsPerPage);

  // 검색 및 정렬 필터링
  const filteredLabs = mockLabs.filter(lab =>
    lab.name.toLowerCase().includes(search.toLowerCase()) ||
    lab.professor.toLowerCase().includes(search.toLowerCase())
  );

  const sortedLabs = [...filteredLabs].sort((a, b) => {
    switch (sortBy) {
      case 'score':
        return b.score - a.score;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'professor':
        return a.professor.localeCompare(b.professor);
      default:
        return 0;
    }
  });

  const paginatedLabs = sortedLabs.slice(startIndex, startIndex + labsPerPage);

  return (
    <div className="research-page min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800 py-12 px-4">
      <div className="research-container max-w-6xl mx-auto">
        {/* 검색창 */}
        <div className="research-search-section mb-8 flex gap-2">
          <div className="research-search-input-wrapper flex-1 relative">
            <span className="research-search-icon absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="연구실 이름 또는 교수 검색 (예: AI, UX, Robotics...)"
              className="research-search-input w-full pl-10 p-4 border border-gray-300 rounded-xl text-gray-800 bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-[#B8DCCC] focus:border-transparent"
            />
          </div>
          <select 
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="research-sort-select px-4 py-4 border border-gray-300 rounded-xl text-gray-800 bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-[#B8DCCC] focus:border-transparent"
          >
            <option value="score">평점 높은 순</option>
            <option value="name">이름순</option>
            <option value="professor">교수순</option>
          </select>
        </div>

        {/* 강조 섹션 - 연구실/교수 평가 */}
        <div className="research-hero-section bg-gradient-to-r from-[#B8DCCC] to-[#9BC5B3] rounded-xl p-6 mb-8 shadow-lg relative">
          <div className="research-hero-content text-center">
            <h1 className="research-hero-title text-2xl font-bold text-white">연구실 / 교수 평가</h1>
            <p className="research-hero-description text-white text-sm opacity-90 mt-2">
              원하는 연구실과 교수를 검색하고, 평가를 남겨보세요
            </p>
          </div>
        </div>

        {/* 연구실 리스트 */}
        <div className="research-labs-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16">
          {paginatedLabs.length === 0 ? (
            <div className="research-empty-state col-span-2 text-center text-gray-400 py-12">
              <div className="research-empty-icon-wrapper mb-4">
                <span className="research-empty-icon text-6xl">🔍</span>
              </div>
              <div className="research-empty-text text-xl">검색 결과가 없습니다.</div>
            </div>
          ) : paginatedLabs.map(lab => (
            <Link key={lab.id} to="/research/detail" className="research-lab-link">
              <div className="research-lab-card bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                {/* 상단 헤더 */}
                <div className="research-lab-header flex items-start justify-between mb-4">
                  <div className="research-lab-info flex-1">
                    <h3 className="research-lab-name text-xl font-bold text-gray-800 mb-2">{lab.name}</h3>
                    <div className="research-lab-professor text-sm text-gray-600 mb-3">지도교수: {lab.professor}</div>
                  </div>
                  <div className="research-lab-rating text-right">
                    <div className="research-rating-wrapper flex items-center gap-1 mb-1">
                      <span className="research-star-icon text-yellow-500">⭐</span>
                      <span className="research-lab-score font-semibold">{lab.score}</span>
                    </div>
                    <div className="research-rating-label text-xs text-gray-500">평균 평점</div>
                  </div>
                </div>

                {/* 연구실 상세보기 버튼 */}
                <div className="research-detail-section flex justify-end">
                  <button className="research-detail-button bg-gradient-to-r from-[#B8DCCC] to-[#9BC5B3] text-black px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    <span className="research-detail-icon mr-2">👁️</span>
                    연구실 상세보기
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="research-pagination flex justify-center mt-8">
            <div className="research-pagination-container flex items-center space-x-2">
              {/* 이전 페이지 */}
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="research-pagination-button research-prev-button px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition"
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
                      onClick={() => setCurrentPage(page)}
                      className={`research-page-button px-3 py-2 rounded-lg text-sm transition ${
                        currentPage === page
                          ? 'bg-[#B8DCCC] text-black font-semibold'
                          : 'border border-gray-300 hover:bg-gray-200'
                      }`}
                    >
                      {page}
                    </button>
                  )
                } else if (
                  page === currentPage - 3 ||
                  page === currentPage + 3
                ) {
                  return <span key={page} className="research-pagination-ellipsis px-2 text-gray-500">...</span>
                }
                return null
              })}

              {/* 다음 페이지 */}
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="research-pagination-button research-next-button px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition"
              >
                다음
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Research;