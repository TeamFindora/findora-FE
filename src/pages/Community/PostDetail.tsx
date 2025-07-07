import { useParams, useNavigate } from 'react-router-dom'
import '../Home/Home.css'

const PostDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  // Mock 데이터 (실제로는 API에서 가져올 예정)
  const mockPost = {
    id: Number(id),
    title: '석사 준비 중인데 연구실 추천 좀 부탁드려요!',
    writer: 'skywalker',
    content: `안녕하세요! 현재 석사 준비 중인 학생입니다.

컴퓨터 공학 전공으로 AI/ML 분야에 관심이 많은데, 좋은 연구실 추천 부탁드립니다.

특히 다음과 같은 조건을 고려하고 있습니다:
- 서울/경기 지역
- AI/ML 관련 연구
- 학비 지원 가능한 곳
- 좋은 연구 환경

조언 부탁드립니다!`,
    comments: 3,
    views: 156,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  }

  const mockComments = [
    {
      id: 1,
      writer: 'ml_expert',
      content: 'KAIST AI 대학원 추천드립니다. 학비 지원도 잘 되고 연구 환경도 좋아요.',
      createdAt: '2024-01-15 14:30'
    },
    {
      id: 2,
      writer: 'grad_student',
      content: '서울대 컴퓨터공학부도 좋은 선택입니다. 특히 김교수님 연구실 추천해요.',
      createdAt: '2024-01-15 15:45'
    },
    {
      id: 3,
      writer: 'researcher',
      content: '포스텍도 고려해보세요. AI 분야에서 꽤 강세를 보이고 있습니다.',
      createdAt: '2024-01-15 16:20'
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 뒤로가기 버튼 */}
        <div className="mb-6">
          <button 
            onClick={() => navigate('/community')}
            className="text-[#B8DCCC] hover:text-white transition flex items-center"
          >
            ← 커뮤니티로 돌아가기
          </button>
        </div>

        {/* 게시글 내용 */}
        <div className="bg-white text-black rounded-lg p-8 mb-8">
          {/* 제목 */}
          <h1 className="text-2xl font-bold text-[#B8DCCC] mb-4">{mockPost.title}</h1>
          
          {/* 메타 정보 */}
          <div className="flex items-center justify-between text-sm text-gray-600 mb-6 pb-4 border-b">
            <div className="flex items-center space-x-4">
              <span>작성자: {mockPost.writer}</span>
              <span>조회수: {mockPost.views}</span>
              <span>💬 {mockPost.comments} 댓글</span>
            </div>
            <div>
              <span>작성일: {mockPost.createdAt}</span>
            </div>
          </div>

          {/* 본문 */}
          <div className="text-gray-800 leading-relaxed whitespace-pre-line">
            {mockPost.content}
          </div>
        </div>

        {/* 댓글 섹션 */}
        <div className="bg-white text-black rounded-lg p-6">
          <h3 className="text-lg font-semibold text-[#B8DCCC] mb-4">댓글 ({mockComments.length})</h3>
          
          {/* 댓글 목록 */}
          <div className="space-y-4 mb-6">
            {mockComments.map((comment) => (
              <div key={comment.id} className="border-b border-gray-200 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-[#B8DCCC]">{comment.writer}</span>
                  <span className="text-sm text-gray-500">{comment.createdAt}</span>
                </div>
                <p className="text-gray-700">{comment.content}</p>
              </div>
            ))}
          </div>

          {/* 댓글 작성 */}
          <div className="border-t pt-4">
            <textarea 
              placeholder="댓글을 입력하세요..."
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:border-[#B8DCCC]"
              rows={3}
            />
            <div className="flex justify-end mt-2">
              <button className="bg-[#B8DCCC] text-black font-semibold px-4 py-2 rounded hover:bg-opacity-90">
                댓글 작성
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostDetail 