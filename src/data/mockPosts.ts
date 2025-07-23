export const mockPosts = [
  { 
    id: 1, 
    title: '석사 준비 중인데 연구실 추천 좀 부탁드려요!', 
    writer: 'skywalker', 
    comments: 3,
    views: 156,
    createdAt: '2024-01-15'
  },
  { 
    id: 2, 
    title: '해외 대학원 지원 일정 같이 공유해요', 
    writer: 'dreamer', 
    comments: 5,
    views: 89,
    createdAt: '2024-01-14'
  },
  { 
    id: 3, 
    title: 'Findora UI 어때요?', 
    writer: 'neo', 
    comments: 2,
    views: 234,
    createdAt: '2024-01-13'
  },
  { 
    id: 4, 
    title: '대학원 면접 준비 팁 공유해요', 
    writer: 'interview_expert', 
    comments: 8,
    views: 567,
    createdAt: '2024-01-12'
  },
  { 
    id: 5, 
    title: 'AI 스터디 모집합니다', 
    writer: 'ai_study', 
    comments: 4,
    views: 123,
    createdAt: '2024-01-11'
  },
  { 
    id: 6, 
    title: '대학원 생활 후기 공유해요', 
    writer: 'grad_life', 
    comments: 12,
    views: 789,
    createdAt: '2024-01-10'
  },
  { 
    id: 7, 
    title: '연구실 선택할 때 고려사항', 
    writer: 'lab_guide', 
    comments: 6,
    views: 456,
    createdAt: '2024-01-09'
  },
  { 
    id: 8, 
    title: '논문 작성 팁 모음', 
    writer: 'paper_writer', 
    comments: 15,
    views: 1023,
    createdAt: '2024-01-08'
  }
]

export const sortOptions = [
  { value: 'latest', label: '최신순' },
  { value: 'oldest', label: '오래된순' },
  { value: 'popular', label: '인기순' },
  { value: 'comments', label: '댓글순' },
  { value: 'views', label: '조회순' }
]