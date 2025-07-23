import { useParams, useNavigate } from 'react-router-dom'
import { useEditPost } from '../../hooks/pages/useEditPost'

const EditPost = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const postId = parseInt(id || '0')
  
  const {
    // 게시글 데이터
    post,
    postLoading,
    postError,
    
    // 권한
    canEditPost,
    
    // 폼 관리
    title,
    content,
    submitting,
    handleTitleChange,
    handleContentChange,
    handleSubmit,
    handleCancel,
    isValid,
    
    // 통합 로딩 상태
    loading
  } = useEditPost({ postId })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">게시글을 불러오는 중...</div>
      </div>
    )
  }

  if (postError || !post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">
            {postError || '게시글을 찾을 수 없습니다.'}
          </div>
          <button
            onClick={() => navigate('/community')}
            className="px-6 py-2 bg-[#B8DCCC] text-black rounded-lg hover:bg-opacity-90 transition"
          >
            목록으로 돌아가기
          </button>
        </div>
      </div>
    )
  }

  if (!canEditPost) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">
            게시글 수정 권한이 없습니다.
          </div>
          <button
            onClick={() => navigate(`/community/post/${postId}`)}
            className="px-6 py-2 bg-[#B8DCCC] text-black rounded-lg hover:bg-opacity-90 transition"
          >
            게시글로 돌아가기
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">게시글 수정</h1>
          <p className="text-gray-600">게시글 내용을 수정해보세요.</p>
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
              {submitting ? '수정 중...' : '게시글 수정'}
            </button>
          </div>
        </form>

        {/* 수정 가이드 */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-yellow-800 mb-2">✏️ 수정 가이드</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• 제목과 내용을 모두 입력해주세요.</li>
            <li>• 수정된 내용은 즉시 반영됩니다.</li>
            <li>• 부적절한 내용은 관리자에 의해 삭제될 수 있습니다.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default EditPost