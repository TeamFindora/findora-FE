import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AcademicCapIcon } from '@heroicons/react/24/outline'

const Verify = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    university: '',
    country: '',
    major: '',
    degree: '',
    enrollmentYear: '',
    expectedGraduation: '',
    studentId: '',
    verificationDocument: null as File | null
  })
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        verificationDocument: e.target.files![0]
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // 실제로는 API 호출을 통해 인증 요청을 보냄
    setTimeout(() => {
      setIsSubmitting(false)
      setCurrentStep(3) // 성공 단계로 이동
    }, 2000)
  }

  const nextStep = () => {
    setCurrentStep(prev => prev + 1)
  }

  const prevStep = () => {
    setCurrentStep(prev => prev - 1)
  }

  const countries = [
    '미국', '영국', '캐나다', '호주', '독일', '프랑스', '일본', '싱가포르', '홍콩', '기타'
  ]

  const degrees = [
    '석사 과정 (Master\'s)',
    '박사 과정 (PhD)',
    '석박사 통합 과정',
    '기타'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <button
            onClick={() => navigate('/admission')}
            className="text-[#B8DCCC] hover:text-[#9BC5B3] mb-4 flex items-center gap-2"
          >
            ← 입시관으로 돌아가기
          </button>
                      <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
              <AcademicCapIcon className="w-8 h-8" />
              해외대학원 재학 인증
            </h1>
          <p className="text-gray-600">합격자 후기를 작성하기 위해 재학 인증이 필요합니다</p>
        </div>

        {/* 진행 단계 표시 */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map(step => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  currentStep >= step 
                    ? 'bg-[#B8DCCC] text-black' 
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    currentStep > step ? 'bg-[#B8DCCC]' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 단계별 내용 */}
        {currentStep === 1 && (
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">📋 기본 정보 입력</h2>
            <form onSubmit={(e) => { e.preventDefault(); nextStep(); }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    이름 *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B8DCCC] focus:border-transparent"
                    placeholder="홍길동"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    이메일 *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B8DCCC] focus:border-transparent"
                    placeholder="example@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    대학원명 *
                  </label>
                  <input
                    type="text"
                    name="university"
                    value={formData.university}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B8DCCC] focus:border-transparent"
                    placeholder="예: MIT, Stanford University"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    국가 *
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B8DCCC] focus:border-transparent"
                  >
                    <option value="">국가를 선택하세요</option>
                    {countries.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    전공 *
                  </label>
                  <input
                    type="text"
                    name="major"
                    value={formData.major}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B8DCCC] focus:border-transparent"
                    placeholder="예: Computer Science, Electrical Engineering"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    학위 과정 *
                  </label>
                  <select
                    name="degree"
                    value={formData.degree}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B8DCCC] focus:border-transparent"
                  >
                    <option value="">학위 과정을 선택하세요</option>
                    {degrees.map(degree => (
                      <option key={degree} value={degree}>{degree}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    입학년도 *
                  </label>
                  <input
                    type="number"
                    name="enrollmentYear"
                    value={formData.enrollmentYear}
                    onChange={handleInputChange}
                    required
                    min="2020"
                    max="2030"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B8DCCC] focus:border-transparent"
                    placeholder="2024"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    예상 졸업년도
                  </label>
                  <input
                    type="number"
                    name="expectedGraduation"
                    value={formData.expectedGraduation}
                    onChange={handleInputChange}
                    min="2020"
                    max="2030"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B8DCCC] focus:border-transparent"
                    placeholder="2026"
                  />
                </div>
              </div>
              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  className="bg-[#B8DCCC] text-black px-8 py-3 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  다음 단계 →
                </button>
              </div>
            </form>
          </div>
        )}

        {currentStep === 2 && (
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">📄 인증 서류 업로드</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  학생증 또는 재학증명서 *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="hidden"
                    id="verificationDocument"
                    required
                  />
                  <label htmlFor="verificationDocument" className="cursor-pointer">
                    <div className="text-6xl mb-4">📁</div>
                    <p className="text-gray-600 mb-2">
                      {formData.verificationDocument 
                        ? `선택된 파일: ${formData.verificationDocument.name}`
                        : '클릭하여 파일을 선택하세요'
                      }
                    </p>
                    <p className="text-sm text-gray-500">
                      PDF, JPG, PNG 파일만 업로드 가능 (최대 10MB)
                    </p>
                  </label>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">📋 인증 서류 안내</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• 학생증: 현재 재학 중임을 확인할 수 있는 학생증</li>
                  <li>• 재학증명서: 대학원에서 발급한 공식 재학증명서</li>
                  <li>• 입학허가서: 최근 입학허가서 (신입생의 경우)</li>
                  <li>• 파일은 개인정보가 포함되지 않도록 주의해주세요</li>
                </ul>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 mb-2">⚠️ 주의사항</h3>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• 허위 정보 제출 시 계정이 제재될 수 있습니다</li>
                  <li>• 인증 완료 후 수강후기 작성이 가능합니다</li>
                  <li>• 인증 검토는 1-3일 소요됩니다</li>
                </ul>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={prevStep}
                  className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                >
                  ← 이전 단계
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!formData.verificationDocument || isSubmitting}
                  className="bg-[#B8DCCC] text-black px-8 py-3 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? '인증 요청 중...' : '인증 요청하기'}
                </button>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="bg-white rounded-2xl p-8 shadow-xl text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">인증 요청이 완료되었습니다!</h2>
            <p className="text-gray-600 mb-6">
              제출해주신 정보를 검토한 후 이메일로 결과를 알려드리겠습니다.<br />
              검토 기간은 보통 1-3일 소요됩니다.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-green-800 mb-2">📧 확인사항</h3>
              <p className="text-sm text-green-700">
                {formData.email}로 인증 결과를 발송해드립니다.<br />
                스팸메일함도 확인해주세요.
              </p>
            </div>
            <button
              onClick={() => navigate('/admission')}
              className="bg-[#B8DCCC] text-black px-8 py-3 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              입시관으로 돌아가기
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Verify 