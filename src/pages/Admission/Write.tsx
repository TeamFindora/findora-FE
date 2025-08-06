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
    admissionYear: '',
    admissionMonth: '',
    content: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim() || !formData.school.trim() || !formData.major.trim() || !formData.admissionYear.trim() || !formData.admissionMonth.trim() || !formData.content.trim()) {
      alert('모든 필수 항목을 입력해주세요.')
      return
    }

    try {
      setIsSubmitting(true)
      
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
📅 **합격**: ${formData.admissionYear} ${formData.admissionMonth}

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
      
      // 성공 상태 표시
      setIsSubmitting(false)
      setIsSuccess(true)
      
      // 1.5초 후 페이지 이동
      setTimeout(() => {
        navigate('/admission')
      }, 1500)
    } catch (error) {
      console.error('게시글 작성 실패:', error)
      setIsSubmitting(false)
      alert('게시글 작성에 실패했습니다. 다시 시도해주세요.')
    }
  }

  const handleCancel = () => {
    if (window.confirm('작성 중인 내용이 사라집니다. 정말 취소하시겠습니까?')) {
      navigate('/admission')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-3xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-3">합격수기 작성</h1>
          <p className="text-gray-600 text-base leading-relaxed">
            후배들에게 도움이 되는 생생한 합격 경험을 공유해주세요
          </p>
        </div>

        {/* 작성 폼 */}
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 기본 정보 */}
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-gray-900 pb-2 border-b border-gray-100">기본 정보</h2>
              
              {/* 제목 - 전체 폭 */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  제목 <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  maxLength={100}
                />
              </div>

              {/* 학교명, 전공 - 나란히 배치 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    학교명 <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="school"
                    value={formData.school}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    전공 <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="major"
                    value={formData.major}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              {/* 합격년월 - 년도/월 자유 입력 */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  합격년월 <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      name="admissionYear"
                      value={formData.admissionYear}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                    <p className="text-xs text-gray-500 mt-1">년도</p>
                  </div>
                  <div>
                    <input
                      type="text"
                      name="admissionMonth"
                      value={formData.admissionMonth}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                    <p className="text-xs text-gray-500 mt-1">월/학기</p>
                  </div>
                </div>
              </div>
            </div>


            {/* 내용 */}
            <div className="space-y-6">
              <div className="pb-2 border-b border-gray-100">
                <h2 className="text-lg font-medium text-gray-900 inline">합격수기<span className="text-red-400 text-lg ml-1">*</span></h2>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-4 p-4 bg-gray-50 rounded-md">
                  <p className="font-medium mb-2">다음 내용을 포함해 주세요:</p>
                  <ul className="space-y-1 text-sm">
                    <li>• 지원 동기와 준비 과정</li>
                    <li>• SOP/CV 작성 팁</li>
                    <li>• 인터뷰 경험담</li>
                    <li>• 추천서 준비 방법</li>
                    <li>• 시험 준비 (GRE, TOEFL 등)</li>
                    <li>• 합격 후 소감</li>
                  </ul>
                </div>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                  rows={16}
                  maxLength={5000}
                />
                <div className="flex justify-between items-center mt-2">
                  <div className="text-xs text-gray-500">최소 100자 이상 작성해주세요</div>
                  <div className="text-sm text-gray-500">
                    {formData.content.length}/5000
                  </div>
                </div>
              </div>
            </div>

            {/* 버튼 */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isSuccess}
                className={`px-6 py-2.5 rounded-md font-medium transition-all duration-300 ${
                  isSuccess 
                    ? 'bg-green-600 text-white' 
                    : isSubmitting
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isSuccess ? (
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    작성완료!
                  </div>
                ) : isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    작성 중...
                  </div>
                ) : (
                  '작성완료'
                )}
              </button>
            </div>
          </form>
        </div>
        </div>
      </div>
  )
}

export default AdmissionWrite