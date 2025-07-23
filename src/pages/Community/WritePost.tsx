import { useNavigate } from 'react-router-dom'
import { useWritePost } from '../../hooks/pages/useWritePost'

const WritePost = () => {
  const navigate = useNavigate()
  
  const {
    title,
    content,
    submitting,
    handleTitleChange,
    handleContentChange,
    handleSubmit,
    handleCancel,
    isValid
  } = useWritePost()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">글쓰기</h1>
          <p className="text-gray-600">새로운 게시글을 작성해보세요.</p>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
          {/* 제목 입력 */}
          <div className="mb-6">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              제목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="제목을 입력해주세요"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#B8DCCC] transition"
              disabled={submitting}
              maxLength={100}
            />
            <div className="text-right text-sm text-gray-500 mt-1">
              {title.length}/100
            </div>
          </div>

          {/* 내용 입력 */}
          <div className="mb-6">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              내용 <span className="text-red-500">*</span>
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder="내용을 입력해주세요"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#B8DCCC] transition resize-none"
              rows={15}
              disabled={submitting}
              maxLength={5000}
            />
            <div className="text-right text-sm text-gray-500 mt-1">
              {content.length}/5000
            </div>
          </div>

          {/* 버튼 그룹 */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              disabled={submitting}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={submitting || !isValid}
              className="px-6 py-2 bg-[#B8DCCC] text-black font-medium rounded-lg hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? '작성 중...' : '게시글 작성'}
            </button>
          </div>
        </form>

        {/* 작성 가이드 */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">📝 작성 가이드</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• 제목과 내용을 모두 입력해주세요.</li>
            <li>• 다른 사용자에게 도움이 되는 내용을 작성해주세요.</li>
            <li>• 부적절한 내용은 관리자에 의해 삭제될 수 있습니다.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default WritePost