import { useState } from 'react'
import { Link } from 'react-router-dom'

const ResearchDetail = () => {
  const [activeTab, setActiveTab] = useState<'info' | 'dashboard' | 'qa'>('info')

  const professor = {
    name: 'Luc Van Gool',
    affiliation: 'ETH Zurich',
    email: '',
    website: 'http://www.vision.ee.ethz.ch/en/members/get_member.cgi?id=1',
    scholar: 'https://scholar.google.com/citations?user=TwMib_QAAAAJ',
    photo: 'https://scholar.googleusercontent.com/citations?view_op=view_photo&user=TwMib_QAAAAJ&citpid=3',
    bio: 'Professor of Computer Vision at INSAIT Sofia University, emeritus at KU Leuven and ETHZ, Toyota Lab TRACE',
    keywords: ['computer vision', 'machine learning', 'AI', 'autonomous cars', 'cultural heritage'],
    papers: [
      {
        title: 'BSurf: Speeded up robust features',
        link: 'https://scholar.google.com/citations?view_op=view_citation&hl=ko&user=TwMib_QAAAAJ&citation_for_view=TwMib_QAAAAJ:hSRAE-fF4OAC',
        venue: 'Computer Vision ECCV 2006'
      },
      {
        title: 'Speeded-up robust features (SURF)',
        link: 'https://scholar.google.com/citations?view_op=view_citation&hl=ko&user=TwMib_QAAAAJ&citation_for_view=TwMib_QAAAAJ:isU91gLudPYC'
      },
      {
        title: 'The Pascal Visual Object Classes (VOC) Challenge',
        link: 'https://scholar.google.com/citations?view_op=view_citation&hl=ko&user=TwMib_QAAAAJ&citation_for_view=TwMib_QAAAAJ:Y0pCki6q_DkC'
      }
    ]
  }

  return (
    <div className="min-h-screen bg-white text-black py-12 px-6">
      <div className="py-10 px-40">
        <div className="text-left mt-10 mb-5">
          <Link
            to="/research"
            className="text-black px-3 py-1 rounded-full text-xs font-medium hover:underline bg-zinc-100"
          >
            ← 돌아가기
          </Link>
        </div>

        {/* 프로필 카드 */}
        <div className="bg-white rounded-xl shadow-lg border mb-8">
          <div className="p-6 flex flex-row gap-6 items-start">
            <img
              src={professor.photo}
              alt={professor.name}
              className="w-20 h-20 rounded-lg object-cover border"
            />
            <div className="flex-1 space-y-2">
              <h2 className="text-2xl font-bold">{professor.name} 교수</h2>
              <p className="text-gray-600">{professor.affiliation}</p>
              {professor.email && <p className="text-sm text-gray-600">{professor.email}</p>}

              <div className="flex flex-wrap gap-2 text-sm mt-2">
                {professor.website && (
                  <a href={professor.website} target="_blank" rel="noreferrer" className="text-[#B8DCCC] underline">
                    홈페이지
                  </a>
                )}
                {professor.scholar && (
                  <a href={professor.scholar} target="_blank" rel="noreferrer" className="text-[#B8DCCC] underline">
                    Google Scholar
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="keywords-wrap px-6 mb-6">
            <p className="font-semibold mb-2 text-sm">연구분야 키워드</p>
            <div className="flex flex-wrap gap-2">
              {professor.keywords.map((kw, idx) => (
                <span key={idx} className="bg-[#B8DCCC] text-black px-3 py-1 rounded-full text-xs font-medium">
                  {kw}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* === 탭 메뉴 === */}
        <div className="mb-6 flex space-x-2">
          <button
            onClick={() => setActiveTab('info')}
            className={`px-4 py-2 font-semibold rounded-t-md ${
              activeTab === 'info' ? 'bg-blue-200' : 'bg-gray-200'
            }`}
          >
            연구실 정보
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 font-semibold rounded-t-md ${
              activeTab === 'dashboard' ? 'bg-blue-200' : 'bg-gray-200'
            }`}
          >
            대시보드
          </button>
          <button
            onClick={() => setActiveTab('qa')}
            className={`px-4 py-2 font-semibold rounded-t-md ${
              activeTab === 'qa' ? 'bg-blue-200' : 'bg-gray-200'
            }`}
          >
            Q&A
          </button>
        </div>

        {/* === 탭 내용 === */}
        <div className="research-dashboard bg-white rounded-xl border p-6 shadow-sm">
          {activeTab === 'info' && (
            <>
              <h3 className="text-xl font-semibold mb-3">교수 소개</h3>
              <p className="text-sm text-gray-700 leading-relaxed">{professor.bio}</p>

              <h3 className="text-xl font-semibold mt-8 mb-3">대표 논문</h3>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                {professor.papers.map((paper, idx) => (
                  <li key={idx}>
                    <a
                      href={paper.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-gray-500 hover:underline"
                    >
                      {paper.title}
                    </a>{' '}
                    {paper.venue && <span className="text-gray-500">({paper.venue})</span>}
                  </li>
                ))}
              </ul>
            </>
          )}

          {activeTab === 'dashboard' && (
            <div>
              <h3 className="text-xl font-semibold mb-3">대시보드 (예시 콘텐츠)</h3>
              <p className="text-gray-600 text-sm">추후 차트/평점/그래프 등 표시</p>
            </div>
          )}

          {activeTab === 'qa' && (
            <div>
              <h3 className="text-xl font-semibold mb-3">Q&A</h3>
              <p className="text-gray-600 text-sm">질문과 답변, 코멘트 기능 등을 여기에 구현할 수 있습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ResearchDetail
