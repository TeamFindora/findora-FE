import { useParams, useNavigate } from 'react-router-dom'
import { postsApi } from '../../api/posts'
import PostLikeButton from '../../components/PostLikeButton'
import CommentLikeButton from '../../components/CommentLikeButton'  
import BookmarkButton from '../../components/BookmarkButton'
import { usePostDetailPage } from '../../hooks/pages/usePostDetailPage'

const PostDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const postId = parseInt(id || '0')

  const {
    // 게시글 데이터
    post,
    postLoading,
    postError,
    
    // 댓글 데이터
    comments,
    commentsLoading,
    commentsError,
    
    // 댓글 작성
    commentContent,
    submittingComment,
    handleSubmitComment,
    handleCommentContentChange,
    
    // 댓글 수정/삭제
    editingCommentId,
    editingContent,
    submittingEdit,
    setEditingContent,
    startEditing,
    cancelEditing,
    handleUpdateComment,
    handleDeleteComment,
    isEditing,
    
    // 대댓글 관리
    replyingToCommentId,
    replyContent,
    submittingReply,
    setReplyContent,
    startReply,
    cancelReply,
    handleSubmitReply,
    isReplying,
    
    // 권한
    canEditPost,
    canDeletePost,
    canComment,
    canEditComment,
    canDeleteComment,
    
    // 통합 상태
    loading,
    error,
    refreshAll
  } = usePostDetailPage({ postId })

  // 댓글에서 닉네임을 가져오는 헬퍼 함수
  const getCommentAuthor = (comment: any): string => {
    return comment.userNickname || 
           comment.nickname || 
           comment.author || 
           comment.writer || 
           '익명'
  }

  // 게시글 삭제
  const handleDeletePost = async () => {
    if (!canDeletePost) {
      alert('게시글 삭제 권한이 없습니다.')
      return
    }
    
    const confirmed = window.confirm('정말로 이 게시글을 삭제하시겠습니까?')
    if (!confirmed) return
    
    try {
      await postsApi.deletePost(postId)
      alert('게시글이 삭제되었습니다.')
      navigate('/community')
    } catch (err) {
      console.error('게시글 삭제 실패:', err)
      alert('게시글 삭제에 실패했습니다.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">게시글을 불러오는 중...</div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">
            {error || '게시글을 찾을 수 없습니다.'}
          </div>
          <button
            onClick={refreshAll}
            className="px-6 py-2 bg-[#B8DCCC] text-black rounded-lg hover:bg-opacity-90 transition"
          >
            다시 시도
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* 뒤로가기 버튼 */}
        <button
          onClick={() => navigate('/community')}
          className="mb-4 text-gray-600 hover:text-gray-800 transition flex items-center"
        >
          ← 목록으로 돌아가기
        </button>

        {/* 게시글 내용 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          {/* 게시글 헤더 */}
          <div className="border-b pb-4 mb-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{post.title}</h1>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="space-x-4">
                <span>작성자: {post.userNickname || '익명'}</span>
                <span>작성일: {post.createdAt}</span>
              </div>
              {canEditPost && (
                <div className="space-x-2">
                  <button
                    onClick={() => navigate(`/community/edit/${post.id}`)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    수정
                  </button>
                  <button
                    onClick={handleDeletePost}
                    className="text-red-600 hover:text-red-800"
                  >
                    삭제
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 게시글 본문 */}
          <div className="prose max-w-none mb-6">
            <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
              {post.content}
            </div>
          </div>

          {/* 좋아요 및 북마크 버튼 */}
          <div className="flex items-center space-x-4 pt-4 border-t">
            <PostLikeButton postId={post.id} />
            <BookmarkButton postId={post.id} />
          </div>
        </div>

        {/* 댓글 섹션 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">
            댓글 ({comments.length})
          </h2>

          {/* 댓글 작성 폼 */}
          {canComment && (
            <form onSubmit={handleSubmitComment} className="mb-6">
              <textarea
                value={commentContent}
                onChange={(e) => handleCommentContentChange(e.target.value)}
                placeholder="댓글을 작성해주세요..."
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:border-[#B8DCCC]"
                rows={3}
                disabled={submittingComment}
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={submittingComment || !commentContent.trim()}
                  className="px-4 py-2 bg-[#B8DCCC] text-black font-medium rounded-lg hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submittingComment ? '작성 중...' : '댓글 작성'}
                </button>
              </div>
            </form>
          )}

          {/* 댓글 목록 */}
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="border-b pb-4 last:border-b-0">
                {/* 댓글 내용 */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-medium text-gray-900">
                        {getCommentAuthor(comment)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {comment.createdAt}
                      </span>
                    </div>
                    
                    {isEditing(comment.id) ? (
                      /* 댓글 수정 폼 */
                      <div className="space-y-2">
                        <textarea
                          value={editingContent}
                          onChange={(e) => setEditingContent(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded resize-none focus:outline-none focus:border-[#B8DCCC]"
                          rows={2}
                        />
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleUpdateComment(comment.id)}
                            disabled={submittingEdit}
                            className="px-3 py-1 text-sm bg-[#B8DCCC] text-black rounded hover:bg-opacity-90 transition disabled:opacity-50"
                          >
                            {submittingEdit ? '수정 중...' : '수정'}
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="px-3 py-1 text-sm bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
                          >
                            취소
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* 댓글 표시 */
                      <p className="text-gray-800 mb-2">{comment.content}</p>
                    )}
                  </div>
                </div>

                {/* 댓글 액션 버튼들 */}
                {!isEditing(comment.id) && (
                  <div className="flex items-center space-x-4 mt-2">
                    <CommentLikeButton postId={postId} commentId={comment.id} />
                    
                    {canComment && (
                      <button
                        onClick={() => startReply(comment.id)}
                        className="text-sm text-gray-600 hover:text-gray-800 transition"
                      >
                        답글
                      </button>
                    )}
                    
                    {canEditComment(comment) && (
                      <div className="space-x-2">
                        <button
                          onClick={() => startEditing(comment.id, comment.content)}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-sm text-red-600 hover:text-red-800"
                        >
                          삭제
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* 대댓글 작성 폼 */}
                {isReplying(comment.id) && (
                  <div className="mt-4 ml-8">
                    <form onSubmit={(e) => {
                      e.preventDefault()
                      handleSubmitReply(comment.id)
                    }}>
                      <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="답글을 작성해주세요..."
                        className="w-full p-2 border border-gray-300 rounded resize-none focus:outline-none focus:border-[#B8DCCC]"
                        rows={2}
                      />
                      <div className="flex space-x-2 mt-2">
                        <button
                          type="submit"
                          disabled={submittingReply || !replyContent.trim()}
                          className="px-3 py-1 text-sm bg-[#B8DCCC] text-black rounded hover:bg-opacity-90 transition disabled:opacity-50"
                        >
                          {submittingReply ? '작성 중...' : '답글 작성'}
                        </button>
                        <button
                          type="button"
                          onClick={cancelReply}
                          className="px-3 py-1 text-sm bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
                        >
                          취소
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* 대댓글 목록 */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="ml-8 mt-4 space-y-3">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="border-l-2 border-gray-200 pl-4">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-gray-900">
                            {getCommentAuthor(reply)}
                          </span>
                          <span className="text-sm text-gray-500">
                            {reply.createdAt}
                          </span>
                        </div>
                        <p className="text-gray-800 mb-2">{reply.content}</p>
                        <div className="flex items-center space-x-4">
                          <CommentLikeButton postId={postId} commentId={reply.id} />
                          {canDeleteComment(reply) && (
                            <button
                              onClick={() => handleDeleteComment(reply.id)}
                              className="text-sm text-red-600 hover:text-red-800"
                            >
                              삭제
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {comments.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              아직 댓글이 없습니다. 첫 번째 댓글을 작성해보세요!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PostDetail