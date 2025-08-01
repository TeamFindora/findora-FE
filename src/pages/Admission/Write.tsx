import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { postsApi } from '../../api/posts'
import { getCurrentUser } from '../../api/auth'

const AdmissionWrite = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    school: '',
    major: '',
    year: new Date().getFullYear().toString(),
    content: '',
    rating: 5
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim() || !formData.school.trim() || !formData.major.trim() || !formData.content.trim()) {
      alert('모든 필수 항목을 입력해주세요.')
      return
    }

    try {
      const currentUser = getCurrentUser()
      if (!currentUser) {
        alert('로그인이 필요합니다.')
        navigate('/login')
        return
      }

      // 합격수기 내용을 포맷팅
      const formattedContent = `
🎓 **학교**: ${formData.school}
📚 **전공**: ${formData.major}  
📅 **합격년도**: ${formData.year}년
⭐ **만족도**: ${formData.rating}/5

---

${formData.content}
      `.trim()

      // 백엔드 API로 게시글 생성 (categories id 3번 = 입시관)
      await postsApi.createPost({
        title: formData.title.trim(),
        content: formattedContent,
        categoryId: 3, // 입시관 카테고리
        userId: currentUser.userId
      })
      
      alert('합격수기가 성공적으로 작성되었습니다!')
      navigate('/admission')
    } catch (error) {
      console.error('게시글 작성 실패:', error)
      alert('게시글 작성에 실패했습니다. 다시 시도해주세요.')
    }
  }

  const handleCancel = () => {
    if (window.confirm('작성 중인 내용이 사라집니다. 정말 취소하시겠습니까?')) {
      navigate('/admission')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-[#B8DCCC] to-[#9BC5B3] rounded-xl p-6 mb-8 shadow-lg">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">✏️ 합격수기 작성하기</h1>
            <p className="text-white text-sm opacity-90 mt-2">
              후배들에게 도움이 되는 생생한 합격 경험을 공유해주세요
            </p>
          </div>
        </div>

        {/* 작성 폼 */}
        <div className="bg-white rounded-2xl p-8 shadow-xl">
          <form onSubmit={handleSubmit}>
            {/* 기본 정보 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  제목 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="예: MIT 컴퓨터과학과 합격 후기"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B8DCCC] focus:border-transparent"
                  maxLength={100}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  학교명 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="school"
                  value={formData.school}
                  onChange={handleChange}
                  placeholder="예: MIT, Stanford, Cambridge"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B8DCCC] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  전공 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="major"
                  value={formData.major}
                  onChange={handleChange}
                  placeholder="예: Computer Science, Physics"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B8DCCC] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  합격년도 <span className="text-red-500">*</span>
                </label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B8DCCC] focus:border-transparent"
                >
                  {Array.from({ length: 10 }, (_, i) => {
                    const year = new Date().getFullYear() - i
                    return (
                      <option key={year} value={year.toString()}>
                        {year}년
                      </option>
                    )
                  })}
                </select>
              </div>
            </div>

            {/* 만족도 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                전반적 만족도
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                    className={`text-2xl ${star <= formData.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                  >
                    ⭐
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-600">({formData.rating}/5)</span>
              </div>
            </div>

            {/* 내용 */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                합격수기 내용 <span className="text-red-500">*</span>
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="합격 과정에서의 경험, 준비 방법, 팁 등을 자세히 작성해주세요.
예시:
- 지원 동기와 준비 과정
- SOP/CV 작성 팁
- 인터뷰 경험담
- 추천서 준비 방법
- 시험 준비 (GRE, TOEFL 등)
- 합격 후 소감"
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B8DCCC] focus:border-transparent resize-none"
                rows={15}
                maxLength={5000}
              />
              <div className="text-right text-sm text-gray-500 mt-2">
                {formData.content.length}/5000
              </div>
            </div>

            {/* 버튼 */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-[#B8DCCC] to-[#9BC5B3] text-black font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                작성완료
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AdmissionWrite