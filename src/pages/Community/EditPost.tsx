import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import '../Home/Home.css'
import { postsApi } from '../../api/posts'
import type { PostResponseDto, PostRequestDto } from '../../api/posts'

const EditPost = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [categoryId, setCategoryId] = useState(1) // 기본값: 일반
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [post, setPost] = useState<PostResponseDto | null>(null)

  // 현재 로그인한 사용자 정보
  const currentUserId = Number(localStorage.getItem('userId')) || 0

  // 게시글 데이터 로드
  useEffect(() => {
    const loadPost = async () => {
      if (!id) return
      
      try {
        setLoading(true)
        const postData = await postsApi.getPostById(Number(id))
        setPost(postData)
        
        // 폼 데이터 설정
        setTitle(postData.title)
        setContent(postData.content)
        setCategoryId(postData.category.id)
        
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

  // 작성자 권한 확인
  const isAuthor = () => {
    if (!post) return false
    return post.userId === currentUserId
  }

  // 폼 제출 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!id || !title.trim() || !content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.')
      return
    }

    try {
      setSubmitting(true)
      
      const postData: PostRequestDto = {
        title: title.trim(),
        content: content.trim(),
        categoryId: categoryId,
        userId: currentUserId
      }

      await postsApi.updatePost(Number(id), postData)
      alert('게시글이 수정되었습니다.')
      navigate(`/community/post/${id}`)
    } catch (err) {
      console.error('게시글 수정 실패:', err)
      alert('게시글 수정에 실패했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  // 카테고리 옵션
  const categories = [
    { id: 1, name: '일반' },
    { id: 2, name: '공지사항' },
    { id: 3, name: '질문&답변' }
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
            onClick={() => navigate('/community')}
            className="text-[#B8DCCC] hover:text-white transition"
          >
            커뮤니티로 돌아가기
          </button>
        </div>
      </div>
    )
  }

  // 권한 없음
  if (!isAuthor()) {
    return (
      <div className="min-h-screen bg-black text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-red-500 text-lg mb-4">게시글을 수정할 권한이 없습니다.</div>
          <button
            onClick={() => navigate(`/community/post/${id}`)}
            className="text-[#B8DCCC] hover:text-white transition"
          >
            게시글로 돌아가기
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-[#B8DCCC] mb-2">게시글 수정</h1>
          <p className="text-gray-300 text-sm">
            게시글을 수정할 수 있습니다.
          </p>
        </div>

        {/* 뒤로가기 버튼 */}
        <div className="mb-6">
          <button 
            onClick={() => navigate(`/community/post/${id}`)}
            className="text-[#B8DCCC] hover:text-white transition flex items-center"
          >
            ← 게시글로 돌아가기
          </button>
        </div>

        {/* 수정 폼 */}
        <div className="bg-white text-black rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 카테고리 선택 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                카테고리
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(Number(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#B8DCCC]"
                required
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 제목 입력 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                제목
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력하세요"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#B8DCCC]"
                required
                maxLength={100}
              />
              <div className="text-sm text-gray-500 mt-1">
                {title.length}/100
              </div>
            </div>

            {/* 내용 입력 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                내용
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="내용을 입력하세요"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#B8DCCC] resize-none"
                rows={15}
                required
                maxLength={5000}
              />
              <div className="text-sm text-gray-500 mt-1">
                {content.length}/5000
              </div>
            </div>

            {/* 버튼 그룹 */}
            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={() => navigate(`/community/post/${id}`)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={!title.trim() || !content.trim() || submitting}
                className="px-6 py-3 bg-[#B8DCCC] text-black font-semibold rounded-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {submitting ? '수정 중...' : '수정하기'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditPost 