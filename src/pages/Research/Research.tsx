import { Link } from 'react-router-dom'
import { useState } from 'react'
import { MagnifyingGlassIcon, StarIcon } from '@heroicons/react/24/outline'

const Research = () => {
  const mockLabs = [
    { 
      id: 1, 
      name: 'AI Vision Lab', 
      professor: '김철수', 
      score: 4.5,
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      keywords: ['#머신러닝', '#컴퓨터비전', '#딥러닝', '#이미지처리']
    },
    { 
      id: 2, 
      name: 'UX Interaction Lab', 
      professor: '이영희', 
      score: 4.8,
      profileImage: 'https://images.unsplash.com/photo-1494790108755-2616c9e1e4e9?w=150&h=150&fit=crop&crop=face',
      keywords: ['#UX디자인', '#HCI', '#인터랙션', '#사용자경험']
    },
    { 
      id: 3, 
      name: 'Cognitive Robotics Lab', 
      professor: '박지성', 
      score: 4.2,
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      keywords: ['#로보틱스', '#인지과학', '#자율주행', '#센서융합']
    },
    { 
      id: 4, 
      name: 'Human-AI Lab', 
      professor: '최은정', 
      score: 4.3,
      profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      keywords: ['#인공지능', '#인간컴퓨터상호작용', '#AI윤리', '#자연어처리']
    },
    { 
      id: 5, 
      name: 'Social Robotics Lab', 
      professor: '정우성', 
      score: 4.6,
      profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      keywords: ['#소셜로봇', '#감정인식', '#로봇윤리', '#인간로봇상호작용']
    },
    { 
      id: 6, 
      name: 'NLP & Ethics Lab', 
      professor: '장혜진', 
      score: 4.1,
      profileImage: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face',
      keywords: ['#자연어처리', '#AI윤리', '#텍스트분석', '#언어모델']
    },
    { 
      id: 7, 
      name: 'Data Visualization Lab', 
      professor: '홍길동', 
      score: 4.7,
      profileImage: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face',
      keywords: ['#데이터시각화', '#인포그래픽', '#빅데이터', '#시각적분석']
    },
    { 
      id: 8, 
      name: 'Cognitive Psychology Lab', 
      professor: '최지우', 
      score: 4.4,
      profileImage: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
      keywords: ['#인지심리학', '#뇌과학', '#학습연구', '#기억연구']
    },
    { 
      id: 9, 
      name: 'Emotion AI Lab', 
      professor: '박보검', 
      score: 4.0,
      profileImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face',
      keywords: ['#감정AI', '#얼굴인식', '#감정분석', '#컴퓨터비전']
    },
    { 
      id: 10, 
      name: 'Sound UX Lab', 
      professor: '이민호', 
      score: 4.6,
      profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
      keywords: ['#음향UX', '#오디오처리', '#음성인식', '#사운드디자인']
    },
    { 
      id: 11, 
      name: 'AR/VR Lab', 
      professor: '김연아', 
      score: 4.9,
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
      keywords: ['#증강현실', '#가상현실', '#3D그래픽스', '#몰입형미디어']
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('score');
  const labsPerPage = 5;

  const totalPages = Math.ceil(mockLabs.length / labsPerPage);
  const startIndex = (currentPage - 1) * labsPerPage;

  // 검색 및 정렬 필터링
  const filteredLabs = mockLabs.filter(lab =>
    lab.name.toLowerCase().includes(search.toLowerCase()) ||
    lab.professor.toLowerCase().includes(search.toLowerCase()) ||
    lab.keywords.some(keyword => keyword.toLowerCase().includes(search.toLowerCase()))
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
    <div className="research-page min-h-screen bg-gray-50 text-gray-800 py-12 px-4">
      <div className="research-container">
        {/* 강조 섹션 - 연구실/교수 평가 */}
        <div className="research-hero-section bg-white rounded-xl p-8 mb-8 shadow-sm border border-gray-100">
          <div className="research-hero-content text-center mb-6">
            <h1 className="research-hero-title text-3xl font-bold text-gray-800 mb-2">연구실 / 교수 평가</h1>
            <p className="research-hero-description text-gray-600 text-lg">
              원하는 연구실과 교수를 검색하고, 평가를 남겨보세요
            </p>
          </div>
          
          {/* 검색창 */}
          <div className="research-search-section flex gap-2">
            <div className="research-search-input-wrapper flex-1 relative">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="연구실 이름, 교수, 키워드 검색 (예: AI, UX, 머신러닝...)"
                className="research-search-input w-full pl-10 p-4 border border-gray-300 rounded-xl text-gray-800 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select 
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="research-sort-select px-4 py-4 border border-gray-300 rounded-xl text-gray-800 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="score">평점 높은 순</option>
              <option value="name">이름순</option>
              <option value="professor">교수순</option>
            </select>
          </div>
        </div>

        {/* 연구실 리스트 */}
        <div className="research-labs-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16">
          {paginatedLabs.length === 0 ? (
            <div className="research-empty-state col-span-2 text-center text-gray-400 py-12">
              <div className="research-empty-icon-wrapper mb-4">
                <MagnifyingGlassIcon className="w-16 h-16 mx-auto text-gray-300" />
              </div>
              <div className="research-empty-text text-xl">검색 결과가 없습니다.</div>
            </div>
          ) : paginatedLabs.map(lab => (
            <Link key={lab.id} to="/research/detail" className="research-lab-link">
              <div className="research-lab-card bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
                {/* 상단 헤더 */}
                {/* 교수 정보 - 프로필 이미지와 함께 */}
                <div className="research-lab-professor flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <img 
                        src={lab.profileImage} 
                        alt={`${lab.professor} 교수`}
                        className="w-6 h-6 rounded-full object-cover"
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(lab.professor)}&size=24&background=e5e7eb&color=6b7280`;
                        }}
                      />
                      <h3 className="text-base text-gray-800">{lab.professor}</h3>
                    </div>  
                <div className="research-lab-header flex items-start justify-between">
                  
                  <div className="research-lab-info flex-1">
                    <h3 className="research-lab-name text-xl font-bold text-gray-800 mb-2">{lab.name}</h3>
                    
                    {/* 키워드 태그 */}
                    <div className="research-lab-keywords flex flex-wrap gap-2">
                      {lab.keywords.map((keyword, index) => (
                        <span 
                          key={index}
                          className="bg-[#B8DCCC]/20 text-gray-700 px-3 py-1 rounded-full text-xs font-medium border border-[#B8DCCC]/30"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="research-lab-rating text-right">
                    <div className="research-rating-wrapper flex items-center gap-1 mb-1">
                      <StarIcon className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="research-lab-score font-semibold">{lab.score}</span>
                    </div>
                    <div className="research-rating-label text-xs text-gray-500">평균 평점</div>
                  </div>
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
                          ? 'bg-gray-800 text-white font-semibold'
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