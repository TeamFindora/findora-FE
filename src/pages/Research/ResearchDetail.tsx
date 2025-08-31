import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChatBubbleLeftIcon, UserCircleIcon, ChevronDownIcon, ChevronUpIcon, StarIcon, ChartBarIcon, AcademicCapIcon, ClockIcon, UserGroupIcon } from '@heroicons/react/24/outline'

interface Reply {
  id: number
  author: string
  content: string
  timestamp: string
  avatar?: string
}

interface Question {
  id: number
  author: string
  content: string
  timestamp: string
  avatar?: string
  replies: Reply[]
}

const ResearchDetail = () => {
  const [activeTab, setActiveTab] = useState<'info' | 'dashboard' | 'qa'>('info')
  
  // Q&A 시스템 상태
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 1,
      author: '김학생',
      content: '안녕하세요! 이 연구실에서 진행하는 주요 프로젝트가 궁금합니다. 특히 컴퓨터 비전 분야에서 어떤 연구를 하고 계신가요?',
      timestamp: '2024-01-15 14:30',
      replies: [
        {
          id: 101,
          author: '박연구원',
          content: '안녕하세요! 현재 자율주행차를 위한 실시간 객체 인식 시스템을 개발하고 있습니다. YOLO 기반의 모델을 개선하는 연구를 진행 중이에요.',
          timestamp: '2024-01-15 16:45'
        }
      ]
    },
    {
      id: 2,
      author: '이예비',
      content: '석사과정 지원을 준비하고 있는데, 연구실 입학을 위해 어떤 선수 지식이 필요한지 알고 싶습니다.',
      timestamp: '2024-01-14 10:15',
      replies: []
    }
  ])
  
  const [newQuestion, setNewQuestion] = useState('')
  const [replyInputs, setReplyInputs] = useState<{[key: number]: string}>({})
  const [showReplies, setShowReplies] = useState<{[key: number]: boolean}>({})
  const [showReplyForm, setShowReplyForm] = useState<{[key: number]: boolean}>({})

  // 평가 대시보드 데이터
  const evaluationData = {
    overallRating: 4.3,
    totalReviews: 127,
    ratings: {
      연구지도: 4.5,
      연구환경: 4.2,
      진로지원: 4.0,
      소통: 4.4,
      워라밸: 3.8
    },
    recentReviews: [
      {
        id: 1,
        author: '익명의 대학원생',
        rating: 5,
        comment: '교수님이 정말 친절하시고 연구 지도를 꼼꼼히 해주십니다. 논문 작성할 때도 많은 도움을 받았어요.',
        date: '2024-01-10',
        category: '연구지도'
      },
      {
        id: 2,
        author: '졸업생',
        rating: 4,
        comment: '연구실 분위기가 좋고 선후배 관계도 원만합니다. 다만 프로젝트가 많아서 조금 바쁠 수 있어요.',
        date: '2024-01-08',
        category: '연구환경'
      },
      {
        id: 3,
        author: '현재 재학생',
        rating: 4,
        comment: '최신 장비와 소프트웨어를 사용할 수 있어서 연구하기 좋은 환경입니다.',
        date: '2024-01-05',
        category: '연구환경'
      }
    ],
    stats: {
      graduationRate: 92,
      avgGraduationTime: 2.3,
      jobPlacementRate: 85,
      researchPapers: 45
    }
  }

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

  // 별점 렌더링 함수
  const renderStars = (rating: number, size: 'sm' | 'md' = 'sm') => {
    const stars = []
    const sizeClass = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <StarIcon
          key={i}
          className={`${sizeClass} ${
            i <= rating 
              ? 'text-yellow-500 fill-yellow-500' 
              : 'text-gray-300'
          }`}
        />
      )
    }
    return stars
  }

  // Q&A 핸들러 함수들
  const handleSubmitQuestion = () => {
    if (newQuestion.trim()) {
      const newQ: Question = {
        id: Date.now(),
        author: '익명 사용자', // 실제로는 로그인된 사용자 정보를 사용
        content: newQuestion,
        timestamp: new Date().toLocaleString('ko-KR'),
        replies: []
      }
      setQuestions([newQ, ...questions])
      setNewQuestion('')
    }
  }

  const handleSubmitReply = (questionId: number) => {
    const replyContent = replyInputs[questionId]
    if (replyContent?.trim()) {
      const newReply: Reply = {
        id: Date.now(),
        author: '익명 사용자',
        content: replyContent,
        timestamp: new Date().toLocaleString('ko-KR')
      }
      
      setQuestions(questions.map(q => 
        q.id === questionId 
          ? { ...q, replies: [...q.replies, newReply] }
          : q
      ))
      
      setReplyInputs({ ...replyInputs, [questionId]: '' })
      setShowReplyForm({ ...showReplyForm, [questionId]: false })
      setShowReplies({ ...showReplies, [questionId]: true })
    }
  }

  const toggleReplies = (questionId: number) => {
    setShowReplies({ ...showReplies, [questionId]: !showReplies[questionId] })
  }

  const toggleReplyForm = (questionId: number) => {
    setShowReplyForm({ ...showReplyForm, [questionId]: !showReplyForm[questionId] })
  }

  return (
    <div className="min-h-screen bg-white text-black py-12 px-6">
      <div className="wrapper">
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
                <span key={idx} className="bg-[#B8DCCC]/20 text-black px-3 py-1 rounded-full text-xs font-medium">
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
            <div className="space-y-6">
              {/* 헤더 */}
              <div className="flex items-center gap-2 mb-6">
                <ChartBarIcon className="w-6 h-6 text-gray-600" />
                <h3 className="text-xl font-semibold">평가 대시보드</h3>
              </div>

              {/* 전체 평점 카드 */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">전체 평점</h4>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-3xl font-bold text-blue-600">{evaluationData.overallRating}</span>
                      <div className="flex">{renderStars(Math.round(evaluationData.overallRating), 'md')}</div>
                    </div>
                    <p className="text-sm text-gray-600">{evaluationData.totalReviews}개의 평가</p>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                      <StarIcon className="w-10 h-10 text-blue-600 fill-blue-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* 세부 평점 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(evaluationData.ratings).map(([category, rating]) => (
                  <div key={category} className="bg-white border border-gray-200 rounded-lg p-4">
                    <h5 className="font-semibold text-gray-800 mb-2">{category}</h5>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl font-bold text-gray-700">{rating}</span>
                      <div className="flex">{renderStars(Math.round(rating))}</div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${(rating / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 통계 카드 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                  <AcademicCapIcon className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-800">{evaluationData.stats.graduationRate}%</div>
                  <div className="text-sm text-gray-600">졸업률</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                  <ClockIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-800">{evaluationData.stats.avgGraduationTime}년</div>
                  <div className="text-sm text-gray-600">평균 졸업기간</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                  <UserGroupIcon className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-800">{evaluationData.stats.jobPlacementRate}%</div>
                  <div className="text-sm text-gray-600">취업률</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                  <ChartBarIcon className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-800">{evaluationData.stats.researchPapers}</div>
                  <div className="text-sm text-gray-600">연구논문 수</div>
                </div>
              </div>

              {/* 최근 리뷰 */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">최근 평가</h4>
                <div className="space-y-4">
                  {evaluationData.recentReviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <UserCircleIcon className="w-6 h-6 text-gray-400" />
                          <span className="font-semibold text-gray-800">{review.author}</span>
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                            {review.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="flex">{renderStars(review.rating)}</div>
                          <span className="text-sm text-gray-500 ml-2">{review.date}</span>
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed ml-8">{review.comment}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <button className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors">
                    더 많은 평가 보기
                  </button>
                </div>
              </div>

              {/* 평가 작성 버튼 */}
              <div className="text-center">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-sm">
                  평가 작성하기
                </button>
              </div>
            </div>
          )}

          {activeTab === 'qa' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-6">
                <ChatBubbleLeftIcon className="w-6 h-6 text-gray-600" />
                <h3 className="text-xl font-semibold">Q&A</h3>
                <span className="text-sm text-gray-500">({questions.length}개의 질문)</span>
              </div>

              {/* 새 질문 작성 */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold mb-3">새 질문 작성</h4>
                <textarea
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="연구실에 대해 궁금한 점을 질문해보세요..."
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
                <div className="flex justify-end mt-3">
                  <button
                    onClick={handleSubmitQuestion}
                    disabled={!newQuestion.trim()}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    질문 등록
                  </button>
                </div>
              </div>

              {/* 질문 목록 */}
              <div className="space-y-4">
                {questions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <ChatBubbleLeftIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>아직 질문이 없습니다. 첫 번째 질문을 남겨보세요!</p>
                  </div>
                ) : (
                  questions.map((question) => (
                    <div key={question.id} className="bg-white border border-gray-200 rounded-lg p-4">
                      {/* 질문 */}
                      <div className="flex items-start gap-3 mb-3">
                        <UserCircleIcon className="w-8 h-8 text-gray-400 flex-shrink-0 mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-gray-800">{question.author}</span>
                            <span className="text-xs text-gray-500">{question.timestamp}</span>
                          </div>
                          <p className="text-gray-700 leading-relaxed">{question.content}</p>
                        </div>
                      </div>

                      {/* 답글 토글 및 답글 작성 버튼 */}
                      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
                        {question.replies.length > 0 && (
                          <button
                            onClick={() => toggleReplies(question.id)}
                            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                          >
                            {showReplies[question.id] ? (
                              <ChevronUpIcon className="w-4 h-4" />
                            ) : (
                              <ChevronDownIcon className="w-4 h-4" />
                            )}
                            답글 {question.replies.length}개
                          </button>
                        )}
                        <button
                          onClick={() => toggleReplyForm(question.id)}
                          className="text-sm text-gray-600 hover:text-gray-800"
                        >
                          답글 작성
                        </button>
                      </div>

                      {/* 답글 작성 폼 */}
                      {showReplyForm[question.id] && (
                        <div className="mt-4 ml-11 bg-gray-50 rounded-lg p-3">
                          <textarea
                            value={replyInputs[question.id] || ''}
                            onChange={(e) => setReplyInputs({
                              ...replyInputs,
                              [question.id]: e.target.value
                            })}
                            placeholder="답글을 작성해주세요..."
                            className="w-full p-2 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={2}
                          />
                          <div className="flex justify-end gap-2 mt-2">
                            <button
                              onClick={() => toggleReplyForm(question.id)}
                              className="text-sm text-gray-600 hover:text-gray-800 px-3 py-1"
                            >
                              취소
                            </button>
                            <button
                              onClick={() => handleSubmitReply(question.id)}
                              disabled={!replyInputs[question.id]?.trim()}
                              className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                              답글 등록
                            </button>
                          </div>
                        </div>
                      )}

                      {/* 답글 목록 */}
                      {showReplies[question.id] && question.replies.length > 0 && (
                        <div className="mt-4 ml-11 space-y-3">
                          {question.replies.map((reply) => (
                            <div key={reply.id} className="bg-gray-50 rounded-lg p-3">
                              <div className="flex items-start gap-3">
                                <UserCircleIcon className="w-6 h-6 text-gray-400 flex-shrink-0 mt-1" />
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold text-gray-800 text-sm">{reply.author}</span>
                                    <span className="text-xs text-gray-500">{reply.timestamp}</span>
                                  </div>
                                  <p className="text-gray-700 text-sm leading-relaxed">{reply.content}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ResearchDetail
