import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import '../Home/Home.css'
import { postsApi, commentsApi } from '../../api/posts'
import type { PostResponseDto, CommentResponseDto } from '../../api/posts'

const PostDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState<PostResponseDto | null>(null)
  const [comments, setComments] = useState<CommentResponseDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [commentContent, setCommentContent] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)

  // 게시글 데이터 로드
  useEffect(() => {
    const loadPost = async () => {
      if (!id) return
      
      try {
        setLoading(true)
        const postData = await postsApi.getPostById(Number(id))
        setPost(postData)
        setError(null)
      } catch (err) {
        console.error('게시글 로드 실패:', err)
        setError('게시글을 불러오는데 실패했습니다.')
      } finally {
        setLoading(false)
      }
    }

    loadPost()
  }, [id])

  // 댓글 데이터 로드
  useEffect(() => {
    const loadComments = async () => {
      if (!id) return
      
      try {
        const commentsData = await commentsApi.getCommentsByPostId(Number(id))
        console.log('댓글 API 응답:', commentsData)
        setComments(commentsData)
      } catch (err) {
        console.error('댓글 로드 실패:', err)
        // 댓글 로드 실패는 에러로 처리하지 않고 빈 배열로 설정
        setComments([])
      }
    }

    if (post) {
      loadComments()
    }
  }, [id, post])

  // 댓글 작성
  const handleSubmitComment = async () => {
    if (!id || !commentContent.trim()) return

    try {
      setSubmittingComment(true)
      const userId = Number(localStorage.getItem('userId')) || 1 // 임시로 1 사용
      
      await commentsApi.createComment({
        postId: Number(id),
        userId: userId,
        content: commentContent.trim()
      })
      
      // 댓글 목록 새로고침
      const updatedComments = await commentsApi.getCommentsByPostId(Number(id))
      setComments(updatedComments)
      
      // 입력 필드 초기화
      setCommentContent('')
    } catch (err) {
      console.error('댓글 작성 실패:', err)
      alert('댓글 작성에 실패했습니다.')
    } finally {
      setSubmittingComment(false)
    }
  }

  // Mock 데이터 (API 연동 전까지 사용)
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

  // 로딩 상태
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-gray-500 text-lg">게시글을 불러오는 중...</div>
        </div>
      </div>
    )
  }

  // 에러 상태
  if (error) {
    return (
      <div className="min-h-screen bg-black text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-red-500 text-lg mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="text-[#B8DCCC] hover:text-white transition"
          >
            다시 시도
          </button>
        </div>
      </div>
    )
  }

  // 실제 게시글 데이터 또는 임시 데이터 사용
  const displayPost = post || mockPost
  // 실제 댓글 데이터 또는 임시 데이터 사용
  const displayComments = comments && comments.length > 0 ? comments : mockComments

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
          <h1 className="text-2xl font-bold text-[#B8DCCC] mb-4">{displayPost.title}</h1>
          
          {/* 메타 정보 */}
          <div className="flex items-center justify-between text-sm text-gray-600 mb-6 pb-4 border-b">
            <div className="flex items-center space-x-4">
              <span>작성자: {'userNickname' in displayPost ? displayPost.userNickname : (displayPost as any).writer}</span>
              <span>조회수: {'views' in displayPost ? (displayPost as any).views : 0}</span>
              <span>💬 {displayComments.length} 댓글</span>
            </div>
            <div>
              <span>작성일: {displayPost.createdAt}</span>
            </div>
          </div>

          {/* 본문 */}
          <div className="text-gray-800 leading-relaxed whitespace-pre-line">
            {displayPost.content}
          </div>
        </div>

        {/* 댓글 섹션 */}
        <div className="bg-white text-black rounded-lg p-6">
          <h3 className="text-lg font-semibold text-[#B8DCCC] mb-4">댓글 ({displayComments.length})</h3>
          
          {/* 댓글 목록 */}
          <div className="space-y-4 mb-6">
            {displayComments.map((comment) => (
              <div key={comment.id} className="border-b border-gray-200 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-[#B8DCCC]">
                    {'userNickname' in comment ? comment.userNickname : (comment as any).writer}
                  </span>
                  <span className="text-sm text-gray-500">{comment.createdAt}</span>
                </div>
                <p className="text-gray-700">{comment.content}</p>
              </div>
            ))}
          </div>

          {/* 댓글 작성 */}
          <div className="border-t pt-4">
            <textarea 
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="댓글을 입력하세요..."
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:border-[#B8DCCC]"
              rows={3}
              disabled={submittingComment}
            />
            <div className="flex justify-end mt-2">
              <button 
                onClick={handleSubmitComment}
                disabled={!commentContent.trim() || submittingComment}
                className="bg-[#B8DCCC] text-black font-semibold px-4 py-2 rounded hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submittingComment ? '작성 중...' : '댓글 작성'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostDetail 