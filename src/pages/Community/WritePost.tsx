import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../Home/Home.css'

const WritePost = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general'
  })

  const categories = [
    { value: 'general', label: '일반' },
    { value: 'question', label: '질문' },
    { value: 'review', label: '후기' },
    { value: 'info', label: '정보공유' },
    { value: 'study', label: '스터디' }
  ]

  const handleInputChange = (field: string, value: string) => {
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
      // TODO: 실제 백엔드 API 호출
      console.log('게시글 작성 데이터:', formData)
      
      // 임시로 성공 처리
      alert('게시글이 성공적으로 작성되었습니다!')
      navigate('/community')
      
    } catch (error) {
      console.error('게시글 작성 오류:', error)
      alert('게시글 작성 중 오류가 발생했습니다.')
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
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
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