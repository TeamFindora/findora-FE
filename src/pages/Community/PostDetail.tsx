import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { EyeIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline'

const PostDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('content')

  // Mock 데이터 (나중에 API 연동 예정)
  const mockPost = {
    id: Number(id),
    title: '석사 준비 중인데 연구실 추천 좀 부탁드려요!',
    writer: 'skywalker',
    content: `안녕하세요! 현재 석사 준비 중인 학생입니다.\n\n컴퓨터 공학 전공으로 AI/ML 분야에 관심이 많은데, 좋은 연구실 추천 부탁드립니다.\n\n특히 다음과 같은 조건을 고려하고 있습니다:\n- 서울/경기 지역\n- AI/ML 관련 연구\n- 학비 지원 가능한 곳\n- 좋은 연구 환경\n\n조언 부탁드립니다!`,
    comments: 3,
    views: 156,
    likes: 12,
    createdAt: '2024-01-15',
    tags: ['연구실', '석사', 'AI/ML', '지원']
  }
  
  const mockComments = [
    {
      id: 1,
      author: 'ai_researcher',
      content: '안녕하세요! 서울대 AI연구원을 추천드립니다. 좋은 연구 환경과 지원이 있어요.',
      createdAt: '2024-01-15',
      likes: 5
    },
    {
      id: 2,
      author: 'grad_student',
      content: 'KAIST도 고려해보세요. ML 분야에 좋은 교수님들이 많습니다.',
      createdAt: '2024-01-16',
      likes: 3
    },
    {
      id: 3,
      author: 'lab_senior',
      content: '연구실 선택할 때 고려사항은 교수님 연구 스타일, 대학원생 수, 연구비 등이 중요해요.',
      createdAt: '2024-01-16',
      likes: 8
    }
  ]
  
  const mockRelatedPosts = [
    {
      id: 2,
      title: '대학원 면접 준비 팁 공유해요',
      writer: 'interview_expert',
      views: 567,
      comments: 8
    },
    {
      id: 3,
      title: 'AI 스터디 모집합니다',
      writer: 'ai_study',
      views: 123,
      comments: 4
    },
    {
      id: 4,
      title: '대학원 생활 후기 공유해요',
      writer: 'grad_life',
      views: 789,
      comments: 12
    }
  ]

  return (
    <div className="post-detail-page min-h-screen bg-white text-black py-12 px-6">
      <div className="post-detail-container">
        {/* 뒤로가기 버튼 */}
        <div className="post-detail-back-section text-left mt-10 mb-5">
          <button
            onClick={() => navigate('/community')}
            className="text-slate-600 hover:text-slate-800 transition-colors flex items-center font-medium"
          >
            ← 커뮤니티로 돌아가기
          </button>
        </div>

        {/* 게시글 프로필 카드 */}
        <div className="post-detail-profile-card bg-white rounded-xl shadow-lg border mb-8">
          <div className="post-detail-profile-content p-6 flex flex-row gap-6 items-start">
            <div className="post-detail-author-avatar w-20 h-20 rounded-lg bg-[#B8DCCC] flex items-center justify-center text-2xl font-bold text-black">
              {mockPost.writer.charAt(0).toUpperCase()}
            </div>
            <div className="post-detail-author-info flex-1 space-y-2">
              <h2 className="post-detail-title text-2xl font-bold">{mockPost.title}</h2>
              <p className="post-detail-author text-gray-600">작성자: {mockPost.writer}</p>
              <div className="post-detail-meta flex items-center space-x-4 text-sm text-gray-600">
                <span className="post-detail-views flex items-center gap-1"><EyeIcon className="w-4 h-4" /> 조회 {mockPost.views}</span>
                <span className="post-detail-comments flex items-center gap-1"><ChatBubbleLeftIcon className="w-4 h-4" /> 댓글 {mockPost.comments}</span>
                <span className="post-detail-likes">👍 좋아요 {mockPost.likes}</span>
                <span className="post-detail-date">작성일: {mockPost.createdAt}</span>
              </div>
            </div>
          </div>

          <div className="post-detail-tags-section px-6 mb-6">
            <p className="post-detail-tags-label font-semibold mb-2 text-sm">태그</p>
            <div className="post-detail-tags flex flex-wrap gap-2">
              {mockPost.tags.map((tag, idx) => (
                <span key={idx} className="post-detail-tag bg-[#B8DCCC] text-black px-3 py-1 rounded-full text-xs font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 탭 메뉴 */}
        <div className="post-detail-tabs-section mb-6 flex space-x-2">
          <button
            onClick={() => setActiveTab('content')}
            className={`post-detail-tab-button px-4 py-2 font-semibold rounded-t-md ${
              activeTab === 'content' ? 'bg-blue-200' : 'bg-gray-200'
            }`}
          >
            게시글 내용
          </button>
          <button
            onClick={() => setActiveTab('comments')}
            className={`post-detail-tab-button px-4 py-2 font-semibold rounded-t-md ${
              activeTab === 'comments' ? 'bg-blue-200' : 'bg-gray-200'
            }`}
          >
            댓글 ({mockComments.length})
          </button>
          <button
            onClick={() => setActiveTab('related')}
            className={`post-detail-tab-button px-4 py-2 font-semibold rounded-t-md ${
              activeTab === 'related' ? 'bg-blue-200' : 'bg-gray-200'
            }`}
          >
            관련 게시글
          </button>
        </div>

        {/* 탭 내용 */}
        <div className="post-detail-content bg-white rounded-xl border p-6 shadow-sm">
          {activeTab === 'content' && (
            <div className="post-detail-content-section">
              <h3 className="post-detail-content-title text-xl font-semibold mb-3">게시글 내용</h3>
              <div className="post-detail-content-text text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {mockPost.content}
              </div>
            </div>
          )}

          {activeTab === 'comments' && (
            <div className="post-detail-comments-section">
              <h3 className="post-detail-comments-title text-xl font-semibold mb-3">댓글</h3>
              <div className="post-detail-comments-list space-y-4">
                {mockComments.map((comment) => (
                  <div key={comment.id} className="post-detail-comment p-4 border border-gray-200 rounded-lg">
                    <div className="post-detail-comment-header flex items-center justify-between mb-2">
                      <div className="post-detail-comment-author-info flex items-center gap-3">
                        <span className="post-detail-comment-author font-medium text-[#B8DCCC]">{comment.author}</span>
                        <span className="post-detail-comment-date text-xs text-gray-500">{comment.createdAt}</span>
                      </div>
                      <span className="post-detail-comment-likes text-xs text-gray-600">👍 {comment.likes}</span>
                    </div>
                    <p className="post-detail-comment-content text-sm text-gray-700 leading-relaxed">{comment.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'related' && (
            <div className="post-detail-related-section">
              <h3 className="post-detail-related-title text-xl font-semibold mb-3">관련 게시글</h3>
              <div className="post-detail-related-list space-y-3">
                {mockRelatedPosts.map((post) => (
                  <div 
                    key={post.id} 
                    className="post-detail-related-item p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/community/post/${post.id}`)}
                  >
                    <h4 className="post-detail-related-title text-sm font-medium text-[#B8DCCC] mb-1">
                      {post.title}
                    </h4>
                    <div className="post-detail-related-meta text-xs text-gray-500">
                      작성자: {post.writer} · <EyeIcon className="w-4 h-4 inline" /> {post.views} · <ChatBubbleLeftIcon className="w-4 h-4 inline" /> {post.comments}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PostDetail 