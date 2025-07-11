import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../Home/Home.css'
import { postsApi, CATEGORIES, CATEGORY_NAMES } from '../../api/posts'

const WritePost = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  
  // 로그인 상태 확인
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken')
    if (!accessToken) {
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
      // 토큰 확인
      const accessToken = localStorage.getItem('accessToken')
      const tokenType = localStorage.getItem('tokenType')
      const expiresIn = localStorage.getItem('expiresIn')
      const user = localStorage.getItem('user')
      
      console.log('현재 accessToken:', accessToken)
      console.log('현재 tokenType:', tokenType)
      console.log('토큰 만료 시간:', expiresIn)
      console.log('현재 시간:', Date.now())
      console.log('사용자 정보:', user)
      
      if (!accessToken) {
        alert('로그인이 필요합니다. 로그인 후 다시 시도해주세요.')
        navigate('/login')
        return
      }
      
      // 토큰 만료 확인
      if (expiresIn && Date.now() > parseInt(expiresIn)) {
        alert('토큰이 만료되었습니다. 다시 로그인해주세요.')
        navigate('/login')
        return
      }
      
      // 실제 로그인된 사용자 정보 가져오기
      let userId = 1 // 기본값
      if (user) {
        try {
          const userInfo = JSON.parse(user)
          userId = userInfo.userId
          console.log('실제 사용자 ID:', userId)
        } catch (error) {
          console.error('사용자 정보 파싱 오류:', error)
        }
      }
      
      // 실제 백엔드 API 호출
      const postData = {
        title: formData.title,
        content: formData.content,
        categoryId: formData.categoryId,
        userId: userId
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
    <div className="min-h-screen bg-black text-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-[#B8DCCC]">글쓰기</h1>
          <button 
            onClick={handleCancel}
            className="text-gray-400 hover:text-white transition"
          >
            ✕ 취소
          </button>
        </div>

        {/* 글쓰기 폼 */}
        <form onSubmit={handleSubmit} className="bg-white text-black rounded-lg p-8">
          {/* 카테고리 선택 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              카테고리
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) => handleInputChange('categoryId', parseInt(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#B8DCCC]"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* 제목 입력 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              제목
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="제목을 입력하세요"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#B8DCCC]"
              maxLength={100}
            />
            <div className="text-right text-sm text-gray-500 mt-1">
              {formData.title.length}/100
            </div>
          </div>

          {/* 내용 입력 */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              내용
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              placeholder="내용을 입력하세요"
              rows={15}
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:border-[#B8DCCC]"
            />
            <div className="text-right text-sm text-gray-500 mt-1">
              {formData.content.length}자
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={loading || !formData.title.trim() || !formData.content.trim()}
              className="px-6 py-2 bg-[#B8DCCC] text-black font-semibold rounded-lg hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '작성 중...' : '작성하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default WritePost 