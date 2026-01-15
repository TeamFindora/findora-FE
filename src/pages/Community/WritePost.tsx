import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../Home.css'
import { postsApi, CATEGORIES, CATEGORY_NAMES } from '../../api/posts'
import { getCurrentUser, isAuthenticated } from '../../api/auth'

const WritePost = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  
  // 로그인 상태 확인
  useEffect(() => {
    if (!isAuthenticated()) {
      alert('로그인이 필요합니다.')
      navigate('/login')
    }
  }, [navigate])
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    categoryId: CATEGORIES.GENERAL
  })

  const categories = [
    { value: CATEGORIES.GENERAL, label: CATEGORY_NAMES[CATEGORIES.GENERAL] },
    { value: CATEGORIES.NOTICE, label: CATEGORY_NAMES[CATEGORIES.NOTICE] },
    { value: CATEGORIES.QNA, label: CATEGORY_NAMES[CATEGORIES.QNA] }
  ]

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.')
      return
    }

    setLoading(true)
    
    try {
      // JWT 기반 사용자 정보 확인
      const currentUser = getCurrentUser()
      
      if (!currentUser || !isAuthenticated()) {
        alert('로그인이 필요합니다. 로그인 후 다시 시도해주세요.')
        navigate('/login')
        return
      }
      
      console.log('현재 사용자 정보:', currentUser)
      console.log('실제 사용자 ID:', currentUser.userId)
      
      // 실제 백엔드 API 호출
      const postData = {
        title: formData.title,
        content: formData.content,
        categoryId: formData.categoryId,
        userId: currentUser.userId
      }
      
      console.log('전송할 데이터:', postData)
      const postId = await postsApi.createPost(postData)
      console.log('게시글 작성 성공, ID:', postId)
      
      alert('게시글이 성공적으로 작성되었습니다!')
      navigate('/community')
      
    } catch (error) {
      console.error('게시글 작성 오류:', error)
      
      if (error instanceof Error && error.message.includes('403')) {
        alert('권한이 부족합니다. 로그인 상태를 확인해주세요.')
        navigate('/login')
      } else {
        alert('게시글 작성 중 오류가 발생했습니다.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    if (formData.title.trim() || formData.content.trim()) {
      if (confirm('작성 중인 내용이 있습니다. 정말 나가시겠습니까?')) {
        navigate('/community')
      }
    } else {
      navigate('/community')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-slate-800">✍️ 글쓰기</h1>
          <button 
            onClick={handleCancel}
            className="text-slate-500 hover:text-slate-700 transition-colors"
          >
            ✕ 취소
          </button>
        </div>

        {/* 글쓰기 폼 */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {/* 카테고리 선택 */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-slate-700 mb-3">
              📂 카테고리
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) => handleInputChange('categoryId', parseInt(e.target.value))}
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* 제목 입력 */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-slate-700 mb-3">
              📝 제목
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="제목을 입력하세요"
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 text-lg"
              maxLength={100}
            />
            <div className="text-right text-sm text-slate-500 mt-2">
              {formData.title.length}/100
            </div>
          </div>

          {/* 내용 입력 */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-slate-700 mb-3">
              📄 내용
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              placeholder="내용을 입력하세요"
              rows={15}
              className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 text-lg leading-relaxed"
            />
            <div className="text-right text-sm text-slate-500 mt-2">
              {formData.content.length}자
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 border border-gray-300 text-slate-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={loading || !formData.title.trim() || !formData.content.trim()}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {loading ? '작성 중...' : '✍️ 작성하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default WritePost 