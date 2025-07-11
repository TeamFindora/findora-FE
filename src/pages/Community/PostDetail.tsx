import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import '../Home/Home.css'
import { postsApi } from '../../api/posts'
import type { PostResponseDto } from '../../api/posts'

const PostDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState<PostResponseDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingPost, setDeletingPost] = useState(false)

  // 현재 로그인한 사용자 정보
  const currentUserId = Number(localStorage.getItem('userId')) || 0
  const currentUserNickname = localStorage.getItem('userNickname') || ''

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

  // 게시글 삭제
  const handleDeletePost = async () => {
    if (!id) return
    const confirmed = window.confirm('정말로 이 게시글을 삭제하시겠습니까?')
    if (!confirmed) return
    try {
      setDeletingPost(true)
      await postsApi.deletePost(Number(id))
      alert('게시글이 삭제되었습니다.')
      navigate('/community')
    } catch (err) {
      console.error('게시글 삭제 실패:', err)
      alert('게시글 삭제에 실패했습니다.')
    } finally {
      setDeletingPost(false)
    }
  }

  // 게시글 작성자인지 확인
  const isAuthor = () => {
    if (!post) return false;
    if ('userId' in post) {
      console.log('로그인 userId:', currentUserId, typeof currentUserId);
      console.log('게시글 userId:', post.userId, typeof post.userId);
      console.log('isAuthor:', Number(post.userId) === Number(currentUserId));
      return Number(post.userId) === Number(currentUserId);
    }
    const postWriter = 'userNickname' in post ? (post as any).userNickname : (post as any).writer;
    return postWriter === currentUserNickname;
  }

  // Mock 데이터 (API 연동 전까지 사용)
  const mockPost = {
    id: Number(id),
    title: '석사 준비 중인데 연구실 추천 좀 부탁드려요!',
    writer: 'skywalker',
    content: `안녕하세요! 현재 석사 준비 중인 학생입니다.\n\n컴퓨터 공학 전공으로 AI/ML 분야에 관심이 많은데, 좋은 연구실 추천 부탁드립니다.\n\n특히 다음과 같은 조건을 고려하고 있습니다:\n- 서울/경기 지역\n- AI/ML 관련 연구\n- 학비 지원 가능한 곳\n- 좋은 연구 환경\n\n조언 부탁드립니다!`,
    comments: 3,
    views: 156,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  }

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

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 뒤로가기/수정/삭제 버튼 */}
        <div className="mb-6 flex justify-between items-center">
          <button 
            onClick={() => navigate('/community')}
            className="text-[#B8DCCC] hover:text-white transition flex items-center"
          >
            ← 커뮤니티로 돌아가기
          </button>
          {isAuthor() && (
            <div className="flex space-x-2">
              <button 
                onClick={() => navigate(`/community/edit/${id}`)}
                className="bg-blue-600 text-white font-semibold px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                ✏️ 수정
              </button>
              <button 
                onClick={handleDeletePost}
                disabled={deletingPost}
                className="bg-red-600 text-white font-semibold px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {deletingPost ? '삭제 중...' : '🗑️ 삭제'}
              </button>
            </div>
          )}
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
              {/* <span>💬 {displayComments.length} 댓글</span> */}
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

        {/* 댓글 섹션 (백엔드 완성 전까지 주석처리) */}
        {/**
        <div className="bg-white text-black rounded-lg p-6">
          <h3 className="text-lg font-semibold text-[#B8DCCC] mb-4">댓글 ({displayComments.length})</h3>
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
        */}
      </div>
    </div>
  )
}

export default PostDetail 