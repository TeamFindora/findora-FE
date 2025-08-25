import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  ChatBubbleLeftIcon,
  UserCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  StarIcon,
  AcademicCapIcon,
  ClockIcon,
  UserGroupIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline'

/**
 * ✅ What changed
 * - Pastel, modern look (sky / mint / lavender accents)
 * - Compact layout to fit (mostly) one viewport on laptop screens
 * - Smoother “활동 추이” area chart with gradient + hover tooltip
 * - Subtle motion on appear & hover (no heavy libs)
 * - Responsive grid replacing `.space-y-4.dashboard-wrap` stacking
 */

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

/* ------------------------------ Shared styles ------------------------------ */
const Card: React.FC<React.PropsWithChildren<{ className?: string; title?: string }>> = ({
  children,
  className = '',
  title,
}) => (
  <div
    className={
      'rounded-2xl border border-gray-200 bg-white/90 shadow-sm backdrop-blur ' +
      'transition-all duration-300 hover:shadow-md ' +
      className
    }
  >
    {title ? (
      <div className="flex items-center justify-between px-4 py-3">
        <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
      </div>
    ) : null}
    {children}
  </div>
)

/* ------------------------------ Radar (5-ax) ------------------------------- */
const RadarChart = ({ data }: { data: { [key: string]: number } }) => {
  const categories = Object.keys(data)
  const values = Object.values(data)
  const maxValue = 5
  const cx = 100
  const cy = 100
  const R = 64

  const points = (scale = 1) =>
    values
      .map((v, i) => {
        const a = (i * 2 * Math.PI) / categories.length - Math.PI / 2
        const r = (scale * (i !== undefined ? (v / maxValue) * R : R))
        return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`
      })
      .join(' ')

  const grid = () =>
    values
      .map((_, i) => {
        const a = (i * 2 * Math.PI) / categories.length - Math.PI / 2
        return `${cx + R * Math.cos(a)},${cy + R * Math.sin(a)}`
      })
      .join(' ')

  return (
    <div className="relative mx-auto w-full max-w-[260px]">
      <svg viewBox="0 0 200 200" className="h-auto w-full">
        {/* rings */}
        {[0.25, 0.5, 0.75, 1].map((s, i) => (
          <polygon key={i} points={grid()} transform={`scale(${s}) translate(${(1 - s) * 100} ${(1 - s) * 100})`} fill="none" stroke="#E5E7EB" strokeWidth={1} opacity={0.45} />
        ))}
        {/* axis */}
        {values.map((_, i) => {
          const a = (i * 2 * Math.PI) / categories.length - Math.PI / 2
          return (
            <line key={i} x1={cx} y1={cy} x2={cx + R * Math.cos(a)} y2={cy + R * Math.sin(a)} stroke="#E5E7EB" strokeWidth={1} />
          )
        })}
        {/* area */}
        <polygon points={points(1)} fill="url(#radarFill)" stroke="#7C8CF8" strokeWidth={1.5} />
        <defs>
          <linearGradient id="radarFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#93C5FD" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#C7D2FE" stopOpacity="0.22" />
          </linearGradient>
        </defs>
        {/* points */}
        {values.map((v, i) => {
          const a = (i * 2 * Math.PI) / categories.length - Math.PI / 2
          const x = cx + ((v / maxValue) * R) * Math.cos(a)
          const y = cy + ((v / maxValue) * R) * Math.sin(a)
          return <circle key={i} cx={x} cy={y} r={3} className="fill-indigo-400" />
        })}
        {/* labels */}
        {categories.map((c, i) => {
          const a = (i * 2 * Math.PI) / categories.length - Math.PI / 2
          const x = cx + (R + 16) * Math.cos(a)
          const y = cy + (R + 16) * Math.sin(a)
          return (
            <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle" className="fill-gray-500 text-[10px]">
              {c}
            </text>
          )
        })}
      </svg>
    </div>
  )
}

/* ---------------------------- Smooth Area Chart ---------------------------- */
const SmoothAreaChart = ({ data }: { data: { [key: string]: number } }) => {
  const entries = Object.entries(data)
  const maxValue = Math.max(...Object.values(data)) || 1
  const W = 360
  const H = 160
  const PX = 20
  const PY = 18

  const pts = entries.map(([label, value], i) => {
    const x = PX + (i / Math.max(entries.length - 1, 1)) * (W - PX * 2)
    const y = H - PY - (value / maxValue) * (H - PY * 2)
    return { x, y, label, value }
  })

  // Smooth path (Catmull–Rom → cubic Bezier)
  const d = pts
    .map((p, i) => {
      if (i === 0) return `M ${p.x} ${p.y}`
      const p0 = pts[i - 1]
      const p1 = p
      const cp1x = p0.x + (p1.x - p0.x) / 3
      const cp1y = p0.y
      const cp2x = p0.x + (p1.x - p0.x) * (2 / 3)
      const cp2y = p1.y
      return `C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`
    })
    .join(' ')

  const area = `${d} L ${pts[pts.length - 1]?.x ?? PX} ${H - PY} L ${pts[0]?.x ?? PX} ${H - PY} Z`

  const [iHover, setIHover] = useState<number | null>(null)

  const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = (e.currentTarget as SVGSVGElement).getBoundingClientRect()
    const mx = e.clientX - rect.left
    let ni = 0
    let md = Infinity
    pts.forEach((p, i) => {
      const d = Math.abs(p.x - mx)
      if (d < md) {
        md = d
        ni = i
      }
    })
    setIHover(ni)
  }

  return (
    <div className="relative mx-auto w-full max-w-[420px]">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" onMouseMove={onMove} onMouseLeave={() => setIHover(null)}>
        {[0, 0.25, 0.5, 0.75, 1].map((r, i) => (
          <line key={i} x1={PX} x2={W - PX} y1={H - PY - r * (H - PY * 2)} y2={H - PY - r * (H - PY * 2)} stroke="#E5E7EB" strokeWidth={1} opacity={0.5} />
        ))}
        <defs>
          <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#93C5FD" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#A7F3D0" stopOpacity="0.15" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#areaFill)" className="animate-draw-soft" />
        <path d={d} fill="none" stroke="#60A5FA" strokeWidth={2} className="[filter:drop-shadow(0_1px_0_rgba(96,165,250,0.25))]" />
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={iHover === i ? 4.5 : 3} className="fill-sky-500 transition-all" />
        ))}
        {pts.map((p, i) => (
          <text key={`x-${i}`} x={p.x} y={H - 4} textAnchor="middle" className="fill-gray-500 text-[10px]">
            {p.label}
          </text>
        ))}
      </svg>
      {iHover !== null && (
        <div
          className="pointer-events-none absolute rounded-md border border-gray-200 bg-white px-2 py-1 text-[11px] text-gray-800 shadow-sm"
          style={{ left: pts[iHover].x, top: pts[iHover].y - 28, transform: 'translate(-50%, -100%)' }}
        >
          <div className="font-semibold">{pts[iHover].value}</div>
          <div className="text-gray-500">{pts[iHover].label}</div>
        </div>
      )}
    </div>
  )
}

/* -------------------------------- Component -------------------------------- */
const ResearchDetail = () => {
  const [searchParams] = useSearchParams()
  const professorName = searchParams.get('professor') || 'Unknown Professor'
  const scholarId = searchParams.get('id') || ''
  
  const [activeTab, setActiveTab] = useState<'info' | 'dashboard' | 'qa'>('dashboard')
  const [animateStats, setAnimateStats] = useState(false)

  useEffect(() => {
    if (activeTab === 'dashboard') {
      const t = setTimeout(() => setAnimateStats(true), 250)
      return () => clearTimeout(t)
    }
    setAnimateStats(false)
  }, [activeTab])

  // Q&A
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 1,
      author: '김학생',
      content:
        '안녕하세요! 이 연구실에서 진행하는 주요 프로젝트가 궁금합니다. 특히 컴퓨터 비전 분야에서 어떤 연구를 하고 계신가요?',
      timestamp: '2024-01-15 14:30',
      replies: [
        {
          id: 101,
          author: '박연구원',
          content:
            '안녕하세요! 현재 자율주행차를 위한 실시간 객체 인식 시스템을 개발하고 있습니다. YOLO 기반 모델을 개선 중이에요.',
          timestamp: '2024-01-15 16:45',
        },
      ],
    },
  ])

  const [newQuestion, setNewQuestion] = useState('')
  const [replyInputs, setReplyInputs] = useState<{ [key: number]: string }>({})
  const [showReplies, setShowReplies] = useState<{ [key: number]: boolean }>({})
  const [showReplyForm, setShowReplyForm] = useState<{ [key: number]: boolean }>({})

  // Generate evaluation data based on professor name
  const generateEvaluationData = (name: string) => {
    // Simple hash function to generate consistent data for each professor
    const hash = name.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0)
      return a & a
    }, 0)
    
    const baseRating = 3.8 + (Math.abs(hash) % 12) / 10 // 3.8 to 5.0
    
    return {
      overallRating: Math.round(baseRating * 10) / 10,
      totalReviews: 85 + (Math.abs(hash) % 150), // 85 to 235 reviews
      ratings: {
        연구지도: Math.round((baseRating + (hash % 5) / 10) * 10) / 10,
        연구환경: Math.round((baseRating + ((hash * 2) % 5) / 10) * 10) / 10,
        진로지원: Math.round((baseRating + ((hash * 3) % 5) / 10) * 10) / 10,
        소통: Math.round((baseRating + ((hash * 4) % 5) / 10) * 10) / 10,
        워라밸: Math.round((baseRating + ((hash * 5) % 5) / 10) * 10) / 10,
      },
    }
  }

  const evaluationData = {
    ...generateEvaluationData(professorName),
    recentReviews: [
      {
        id: 1,
        author: '익명의 대학원생',
        rating: 5,
        comment: '교수님이 정말 친절하시고 연구 지도를 꼼꼼히 해주십니다. 논문 작성할 때도 많은 도움을 받았어요.',
        date: '2024-01-10',
        category: '연구지도',
      },
      {
        id: 2,
        author: '졸업생',
        rating: 4,
        comment: '연구실 분위기가 좋고 선후배 관계도 원만합니다. 다만 프로젝트가 많아서 바쁠 수 있어요.',
        date: '2024-01-08',
        category: '연구환경',
      },
      {
        id: 3,
        author: '현재 재학생',
        rating: 4,
        comment: '최신 장비와 소프트웨어를 사용할 수 있어 연구하기 좋습니다.',
        date: '2024-01-05',
        category: '연구환경',
      },
    ],
    stats: {
      graduationRate: 92,
      avgGraduationTime: 2.3,
      jobPlacementRate: 85,
      researchPapers: 45,
    },
    monthlyStats: {
      '1월': 12,
      '2월': 15,
      '3월': 8,
      '4월': 20,
      '5월': 18,
      '6월': 25,
    },
  }

  // Generate professor data based on URL parameters
  const generateProfessorData = (name: string, id: string) => {
    const hash = name.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0)
      return a & a
    }, 0)
    
    // Sample affiliations and bio templates
    const affiliations = [
      'MIT', 'Stanford University', 'UC Berkeley', 'Carnegie Mellon University', 
      'Harvard University', 'ETH Zurich', 'University of Toronto', 'Oxford University'
    ]
    
    const bioTemplates = [
      `Professor of Computer Science specializing in artificial intelligence and machine learning research.`,
      `Leading researcher in computer vision and deep learning with extensive industry collaboration.`,
      `Expert in robotics and autonomous systems with focus on real-world applications.`,
      `Distinguished professor working on natural language processing and computational linguistics.`,
      `Research focus on data mining, machine learning, and large-scale systems.`
    ]
    
    return {
      name,
      affiliation: affiliations[Math.abs(hash) % affiliations.length],
      email: '',
      website: '',
      scholar: id ? `https://scholar.google.com/citations?user=${id}` : '',
      photo: id && id !== 'NOSCHOLARPAGE' ? 
        `https://scholar.googleusercontent.com/citations?view_op=view_photo&user=${id}&citpid=3` :
        `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=128&background=e5e7eb&color=6b7280`,
      bio: bioTemplates[Math.abs(hash) % bioTemplates.length],
      keywords: ['artificial intelligence', 'machine learning', 'computer science', 'research'],
      papers: [
        {
          title: 'Recent Advances in Machine Learning',
          link: '#',
          venue: 'Top-tier Conference 2024',
        },
        {
          title: 'Deep Learning Applications in Computer Vision',
          link: '#',
          venue: 'International Journal 2023',
        },
        {
          title: 'Scalable AI Systems for Real-world Problems',
          link: '#',
          venue: 'ACM Conference 2023',
        },
      ],
    }
  }

  const professor = generateProfessorData(professorName, scholarId)

  const renderStars = (rating: number, size: 'sm' | 'md' = 'sm') => {
    const stars = []
    const sizeClass = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <StarIcon key={i} className={`${sizeClass} ${i <= rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}`} />,
      )
    }
    return stars
  }

  const handleSubmitQuestion = () => {
    if (!newQuestion.trim()) return
    const newQ: Question = {
      id: Date.now(),
      author: '익명 사용자',
      content: newQuestion,
      timestamp: new Date().toLocaleString('ko-KR'),
      replies: [],
    }
    setQuestions([newQ, ...questions])
    setNewQuestion('')
  }

  const handleSubmitReply = (qid: number) => {
    const content = replyInputs[qid]
    if (!content?.trim()) return
    const newR: Reply = {
      id: Date.now(),
      author: '익명 사용자',
      content,
      timestamp: new Date().toLocaleString('ko-KR'),
    }
    setQuestions((qs) => qs.map((q) => (q.id === qid ? { ...q, replies: [...q.replies, newR] } : q)))
    setReplyInputs({ ...replyInputs, [qid]: '' })
    setShowReplyForm({ ...showReplyForm, [qid]: false })
    setShowReplies({ ...showReplies, [qid]: true })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-white/60 px-4 py-8 text-gray-900">
      {/* Page header */}
      <div className="mx-auto mb-4 max-w-7xl">
        <Link
          to="/research"
          className="inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-medium text-gray-600 ring-1 ring-gray-200 transition-all hover:bg-white hover:shadow-sm"
        >
          ← 돌아가기
        </Link>
      </div>

      {/* Profile */}
      <div className="mx-auto mb-5 max-w-7xl">
        <Card className="overflow-hidden">
          <div className="flex items-start gap-6 px-5 py-5">
            <img src={professor.photo} alt={professor.name} className="h-20 w-20 rounded-2xl border border-gray-200 object-cover" />
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">{professor.name} 교수</h2>
              <p className="mt-1 text-gray-600">{professor.affiliation}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-sm">
                {professor.website && (
                  <a
                    href={professor.website}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg bg-sky-50 px-3 py-1.5 font-medium text-sky-700 ring-1 ring-sky-100 transition-colors hover:bg-sky-100"
                  >
                    홈페이지
                  </a>
                )}
                {professor.scholar && (
                  <a
                    href={professor.scholar}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg bg-emerald-50 px-3 py-1.5 font-medium text-emerald-700 ring-1 ring-emerald-100 transition-colors hover:bg-emerald-100"
                  >
                    Google Scholar
                  </a>
                )}
              </div>
            </div>
          </div>
          <div className="px-5 pb-4">
            <p className="mb-2 text-sm font-semibold text-gray-700">연구분야 키워드</p>
            <div className="flex flex-wrap gap-1.5">
              {professor.keywords.map((kw, i) => (
                <span key={i} className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                  {kw}
                </span>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="mx-auto mb-4 max-w-7xl">
        <div className="flex gap-1 rounded-2xl border border-gray-200 bg-white p-1 shadow-sm">
          {(['info', 'dashboard', 'qa'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`flex-1 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                activeTab === t ? 'bg-sky-500 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {t === 'info' ? '연구실 정보' : t === 'dashboard' ? '대시보드' : 'Q&A'}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl">
        {activeTab === 'info' && (
          <Card className="px-5 py-5">
            <h3 className="mb-2 text-base font-semibold">교수 소개</h3>
            <p className="text-sm leading-relaxed text-gray-700">{professor.bio}</p>
            <h3 className="mt-6 mb-2 text-base font-semibold">대표 논문</h3>
            <ul className="list-inside list-disc space-y-1 text-sm text-gray-700">
              {professor.papers.map((p, i) => (
                <li key={i}>
                  <a href={p.link} target="_blank" rel="noreferrer" className="text-gray-600 underline-offset-2 hover:underline">
                    {p.title}
                  </a>{' '}
                  {p.venue && <span className="text-gray-500">({p.venue})</span>}
                </li>
              ))}
            </ul>
          </Card>
        )}

        {activeTab === 'dashboard' && (
          <div className="dashboard-wrap grid gap-3 md:grid-cols-12">
             {/* 통계 */}
             <Card className="md:col-span-3 animate-reveal-up">
              <div className="px-4 py-4 text-center">
                <AcademicCapIcon className="mx-auto mb-1 h-6 w-6 text-emerald-600" />
                <div className="mb-1 text-xl font-bold text-gray-900">{evaluationData.stats.graduationRate}%</div>
                <div className="text-xs text-gray-600">졸업률</div>
              </div>
            </Card>
            <Card className="md:col-span-3 animate-reveal-up">
              <div className="px-4 py-4 text-center">
                <ClockIcon className="mx-auto mb-1 h-6 w-6 text-sky-600" />
                <div className="mb-1 text-xl font-bold text-gray-900">{evaluationData.stats.avgGraduationTime}년</div>
                <div className="text-xs text-gray-600">평균 졸업기간</div>
              </div>
            </Card>
            <Card className="md:col-span-3 animate-reveal-up">
              <div className="px-4 py-4 text-center">
                <UserGroupIcon className="mx-auto mb-1 h-6 w-6 text-violet-600" />
                <div className="mb-1 text-xl font-bold text-gray-900">{evaluationData.stats.jobPlacementRate}%</div>
                <div className="text-xs text-gray-600">취업률</div>
              </div>
            </Card>
            <Card className="md:col-span-3 animate-reveal-up">
              <div className="px-4 py-4 text-center">
                <DocumentTextIcon className="mx-auto mb-1 h-6 w-6 text-amber-600" />
                <div className="mb-1 text-xl font-bold text-gray-900">{evaluationData.stats.researchPapers}</div>
                <div className="text-xs text-gray-600">연구논문 수</div>
              </div>
            </Card>

            {/* 레이더 */}
            <Card className="md:col-span-6 animate-reveal-up" title="평가 영역별 분석">
              <div className="px-2">
                <RadarChart data={evaluationData.ratings} />
              </div>
            </Card>

          

            {/* 최근 리뷰 (컴팩트, 스크롤) */}
            <Card className="md:col-span-6 animate-reveal-up" title="최근 평가">
              <div className="max-h-64 space-y-2 overflow-auto px-4 pb-4">
                {evaluationData.recentReviews.map((r) => (
                  <div key={r.id} className="rounded-lg border border-gray-100 p-2 transition-colors hover:bg-gray-50">
                    <div className="mb-0.5 flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-gray-900">{r.author}</span>
                        <span className="rounded-full bg-sky-100 px-1.5 py-0.5 text-xs font-medium text-sky-700">
                          {r.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="flex gap-0.5">{renderStars(r.rating)}</div>
                        <span className="text-xs text-gray-500">{r.date}</span>
                      </div>
                    </div>
                    <p className="text-xs leading-relaxed text-gray-700">{r.comment}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* 전체 평점 */}
            <Card className="md:col-span-4 animate-reveal-up bg-gradient-to-br from-sky-50 to-indigo-50" >
              <div className="flex items-center justify-between px-4 py-4">
                <div>
                  <h4 className="mb-1 text-xs font-semibold text-gray-900">전체 평점</h4>
                  <div className="flex items-center gap-2 pt-6">
                    <span className="text-3xl font-bold text-sky-600">{evaluationData.overallRating}</span>
                    <div className="flex gap-1">{renderStars(Math.round(evaluationData.overallRating), 'md')}</div>
                  </div>
                  <p className="mt-1 text-xs text-gray-600">{evaluationData.totalReviews}개의 평가</p>
                </div>
                <div className="flex h-12 w-12 mt-6 items-center justify-center rounded-full bg-sky-500 shadow-sm">
                  <StarIcon className="h-6 w-6 text-white" />
                </div>
              </div>
            </Card>
              {/* 활동 추이 */}
              <Card className="md:col-span-4 animate-reveal-up" title="활동 추이">
              <div className="px-2 pb-3">
                <SmoothAreaChart data={evaluationData.monthlyStats} />
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'qa' && (
          <div className="space-y-4">
            <Card className="px-4 py-4">
              <div className="mb-3 flex items-center gap-2">
                <ChatBubbleLeftIcon className="h-5 w-5 text-gray-600" />
                <h3 className="text-base font-semibold">Q&amp;A</h3>
                <span className="text-sm text-gray-500">({questions.length}개의 질문)</span>
              </div>
              <div className="rounded-xl bg-gray-50 p-3">
                <h4 className="mb-2 font-semibold">새 질문 작성</h4>
                <textarea
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="연구실에 대해 궁금한 점을 질문해보세요..."
                  className="h-20 w-full resize-none rounded-lg border border-gray-300 p-3 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <div className="mt-2 flex justify-end">
                  <button
                    onClick={handleSubmitQuestion}
                    disabled={!newQuestion.trim()}
                    className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                  >
                    질문 등록
                  </button>
                </div>
              </div>
            </Card>

            <div className="space-y-3">
              {questions.length === 0 ? (
                <Card className="px-6 py-8 text-center text-gray-500">
                  <ChatBubbleLeftIcon className="mx-auto mb-3 h-10 w-10 text-gray-300" />
                  아직 질문이 없습니다. 첫 번째 질문을 남겨보세요!
                </Card>
              ) : (
                questions.map((q) => (
                  <Card key={q.id} className="px-4 py-4">
                    <div className="mb-3 flex items-start gap-3">
                      <UserCircleIcon className="mt-1 h-7 w-7 flex-shrink-0 text-gray-400" />
                      <div className="flex-1">
                        <div className="mb-0.5 flex items-center gap-2">
                          <span className="font-semibold text-gray-800">{q.author}</span>
                          <span className="text-xs text-gray-500">{q.timestamp}</span>
                        </div>
                        <p className="leading-relaxed text-gray-700">{q.content}</p>
                      </div>
                    </div>

                    <div className="mt-2 flex items-center gap-4 border-t border-gray-100 pt-2">
                      {q.replies.length > 0 && (
                        <button
                          onClick={() => setShowReplies({ ...showReplies, [q.id]: !showReplies[q.id] })}
                          className="flex items-center gap-1 text-sm text-sky-600 hover:text-sky-800"
                        >
                          {showReplies[q.id] ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
                          답글 {q.replies.length}개
                        </button>
                      )}
                      <button
                        onClick={() => setShowReplyForm({ ...showReplyForm, [q.id]: !showReplyForm[q.id] })}
                        className="text-sm text-gray-600 hover:text-gray-800"
                      >
                        답글 작성
                      </button>
                    </div>

                    {showReplyForm[q.id] && (
                      <div className="ml-10 mt-3 rounded-lg bg-gray-50 p-3">
                        <textarea
                          value={replyInputs[q.id] || ''}
                          onChange={(e) => setReplyInputs({ ...replyInputs, [q.id]: e.target.value })}
                          placeholder="답글을 작성해주세요..."
                          className="h-16 w-full resize-none rounded border border-gray-300 p-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                        <div className="mt-2 flex justify-end gap-2">
                          <button
                            onClick={() => setShowReplyForm({ ...showReplyForm, [q.id]: false })}
                            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                          >
                            취소
                          </button>
                          <button
                            onClick={() => handleSubmitReply(q.id)}
                            disabled={!replyInputs[q.id]?.trim()}
                            className="rounded bg-sky-600 px-3 py-1 text-sm font-semibold text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                          >
                            답글 등록
                          </button>
                        </div>
                      </div>
                    )}

                    {showReplies[q.id] && q.replies.length > 0 && (
                      <div className="ml-10 mt-3 space-y-2">
                        {q.replies.map((r) => (
                          <div key={r.id} className="rounded-lg bg-gray-50 p-3">
                            <div className="flex items-start gap-3">
                              <UserCircleIcon className="mt-1 h-5 w-5 flex-shrink-0 text-gray-400" />
                              <div className="flex-1">
                                <div className="mb-0.5 flex items-center gap-2">
                                  <span className="text-sm font-semibold text-gray-800">{r.author}</span>
                                  <span className="text-xs text-gray-500">{r.timestamp}</span>
                                </div>
                                <p className="text-sm leading-relaxed text-gray-700">{r.content}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Motion & helpers */}
      <style>{`
        @keyframes reveal-up { from { opacity: 0; transform: translateY(6px) } to { opacity: 1; transform: translateY(0) } }
        .animate-reveal-up { animation: reveal-up .5s ease both }
        @keyframes pop-fade { 0% { opacity: 0; transform: scale(.98) } 100% { opacity: 1; transform: scale(1) } }
        .animate-pop-fade { animation: pop-fade .45s ease both }
        @keyframes draw-soft { from { opacity:.6 } to { opacity:1 } }
        .animate-draw-soft { animation: draw-soft .6s ease both }
        @media (prefers-reduced-motion: reduce) {
          .animate-reveal-up, .animate-pop-fade, .animate-draw-soft { animation: none !important }
        }
      `}</style>
    </div>
  )
}

export default ResearchDetail
