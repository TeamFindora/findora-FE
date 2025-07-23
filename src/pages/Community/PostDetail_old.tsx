import { useParams, useNavigate } from 'react-router-dom'
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
    rawComments,
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
    isPostAuthor,
    canEditComment,
    canDeleteComment,
    isCommentAuthor,
    currentUser,
    
    // 통합 상태
    loading,
    error,
    refreshAll,
    refreshComments
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


      
      const replyData: CommentRequestDto = {
        content: replyContent.trim(),
        parentId: parentId,
        userId: currentUser.userId  // 사용자 ID 추가
      };
      
      console.log('대댓글 작성 데이터:', replyData);
      
      // 1단계: 즉시 UI 업데이트 (로컬스토리지 정보 사용)
      const tempReply: CommentResponseDto = {
        id: Date.now(), // 임시 ID
        postId: Number(id),
        userId: currentUser.userId,
        userNickname: currentUser.nickname,
        content: replyContent.trim(),
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        parentId: parentId
      };
      
      // 댓글 목록에 즉시 추가
      setComments(prev => [...prev, tempReply]);
      setReplyContent('');
      setReplyingToCommentId(null);
      
      console.log('임시 대댓글 추가됨:', tempReply);
      
      // 2단계: 서버에 실제 대댓글 작성 요청
      await commentsApi.createComment(Number(id), replyData);
      
      // 3단계: 서버에서 최신 댓글 목록 가져와서 실제 데이터로 교체
      const updatedComments = await commentsApi.getCommentsByPostId(Number(id));
      setComments(updatedComments);
      
      console.log('서버에서 최신 댓글 목록 가져옴 (대댓글)');
      
    } catch (err) {
      console.error('대댓글 작성 실패:', err);
      
      // 에러 발생 시 댓글 목록 새로고침 (임시 대댓글 제거)
      try {
        const updatedComments = await commentsApi.getCommentsByPostId(Number(id));
        setComments(updatedComments);
      } catch {
        // 새로고침도 실패하면 임시 대댓글만 제거
        setComments(prev => prev.filter(comment => comment.id !== Date.now()));
      }
      
      alert('대댓글 작성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setSubmittingReply(false);
    }
  };

  // 대댓글 작성 취소
  const handleCancelReply = () => {
    setReplyingToCommentId(null);
    setReplyContent('');
  };

  // 댓글을 부모 댓글과 대댓글로 구분하는 함수
  const organizeComments = (comments: CommentResponseDto[]) => {
    const parentComments = comments.filter(comment => !comment.parentId);
    const replies = comments.filter(comment => comment.parentId);
    
    return parentComments.map(parent => ({
      ...parent,
      replies: replies.filter(reply => reply.parentId === parent.id)
    }));
  };

  const organizedComments = organizeComments(comments);

  // Mock 데이터 (API 연동 전까지 사용)
  const mockPost = {
    id: Number(id),
    title: '석사 준비 중인데 연구실 추천 좀 부탁드려요!',
    writer: 'skywalker',
    content: `안녕하세요! 현재 석사 준비 중인 학생입니다.\n\n컴퓨터 공학 전공으로 AI/ML 분야에 관심이 많은데, 좋은 연구실 추천 부탁드립니다.\n\n특히 다음과 같은 조건을 고려하고 있습니다:\n- 서울/경기 지역\n- AI/ML 관련 연구\n- 학비 지원 가능한 곳\n- 좋은 연구 환경\n\n조언 부탁드립니다!`,
    comments: 3,
    views: 156,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  }

  // 로딩 상태
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <div className="text-slate-700 text-lg font-medium">게시글을 불러오는 중...</div>
        </div>
      </div>
    )
  }

  // 에러 상태
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 inline-block">
            <div className="text-red-700 text-lg font-medium mb-4">{error}</div>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              다시 시도
            </button>
          </div>
        </div>
      </div>
    )
  }

  // 실제 게시글 데이터 또는 임시 데이터 사용
  const displayPost = post || mockPost

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 뒤로가기/수정/삭제 버튼 */}
        <div className="mb-8 flex justify-between items-center">
          <button 
            onClick={() => navigate('/community')}
            className="text-slate-600 hover:text-slate-800 transition-colors flex items-center font-medium"
          >
            ← 커뮤니티로 돌아가기
          </button>
          {isAuthor() && (
            <div className="flex space-x-3">
              <button 
                onClick={() => navigate(`/community/edit/${id}`)}
                className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                ✏️ 수정
              </button>
              <button 
                onClick={handleDeletePost}
                disabled={deletingPost}
                className="bg-red-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                {deletingPost ? '삭제 중...' : '🗑️ 삭제'}
              </button>
            </div>
          )}
        </div>

        {/* 게시글 내용 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          {/* 제목 */}
          <h1 className="text-3xl font-bold text-slate-800 mb-6">{displayPost.title}</h1>
          {/* 메타 정보 */}
          <div className="flex items-center justify-between text-sm text-slate-600 mb-8 pb-6 border-b border-gray-200">
            <div className="flex items-center space-x-6">
              <span className="flex items-center">
                <span className="text-slate-500 mr-2">👤</span>
                {'userNickname' in displayPost ? displayPost.userNickname : (displayPost as any).writer}
              </span>
              <span className="flex items-center">
                <span className="text-slate-500 mr-2">👀</span>
                {'viewCount' in displayPost ? displayPost.viewCount : ('views' in displayPost ? (displayPost as any).views : 0)}
              </span>
              <span className="flex items-center">
                <span className="text-slate-500 mr-2">💬</span>
                {comments.length} 댓글
              </span>
              <PostLikeButton key={`post-${displayPost.id}`} postId={displayPost.id} size="md" />
              <BookmarkButton key={`bookmark-${displayPost.id}`} postId={displayPost.id} size="md" />
            </div>
            <div className="flex items-center">
              <span className="text-slate-500 mr-2">📅</span>
              <span>{displayPost.createdAt}</span>
            </div>
          </div>
          {/* 본문 */}
          <div className="text-slate-800 leading-relaxed whitespace-pre-line text-lg">
            {displayPost.content}
          </div>
        </div>

        {/* 댓글 섹션 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-slate-800 mb-6">댓글 ({comments.length})</h3>
          
          {/* 댓글 목록 (계층 구조) */}
          <div className="space-y-6 mb-8">
            {organizedComments.map((comment) => (
              <div key={comment.id} className="space-y-4">
                {/* 부모 댓글 */}
                <div className="border-b border-gray-200 pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-4">
                      <span className="font-semibold text-slate-800 bg-slate-100 px-3 py-1 rounded-full text-sm">
                        {getCommentAuthor(comment)}
                      </span>
                      <span className="text-sm text-slate-500">
                        {comment.createdAt}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CommentLikeButton key={`comment-${comment.id}`} postId={Number(id)} commentId={comment.id} size="sm" />
                      {/* 답글 버튼 */}
                      {currentUser && (
                        <button
                          onClick={() => handleReplyToComment(comment.id)}
                          className="px-3 py-1 text-green-600 hover:text-green-700 hover:bg-green-50 text-sm transition-colors rounded-md border border-green-200"
                        >
                          답글
                        </button>
                      )}
                      {/* 수정/삭제 버튼 (작성자만) */}
                      {isCommentAuthor(comment) && (
                        <>
                          <button
                            onClick={() => handleEditComment(comment)}
                            className="px-3 py-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-sm transition-colors rounded-md border border-blue-200"
                          >
                            수정
                          </button>
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="px-3 py-1 text-red-600 hover:text-red-700 hover:bg-red-50 text-sm transition-colors rounded-md border border-red-200"
                          >
                            삭제
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* 댓글 내용 또는 수정 폼 */}
                  {editingCommentId === comment.id ? (
                    <div className="space-y-3">
                      <textarea
                        value={editingCommentContent}
                        onChange={(e) => setEditingCommentContent(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={handleCancelEdit}
                          className="px-3 py-1 text-slate-600 hover:text-slate-800 transition-colors"
                        >
                          취소
                        </button>
                        <button
                          onClick={() => handleUpdateComment(comment.id)}
                          disabled={!editingCommentContent.trim()}
                          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          수정
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-700 leading-relaxed">{comment.content}</p>
                  )}

                  {/* 대댓글 작성 폼 */}
                  {replyingToCommentId === comment.id && (
                    <div className="mt-4 ml-8 p-4 bg-gray-50 rounded-lg">
                      <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="답글을 입력하세요..."
                        className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        disabled={submittingReply}
                      />
                      <div className="flex justify-end space-x-2 mt-3">
                        <button
                          onClick={handleCancelReply}
                          className="px-3 py-1 text-slate-600 hover:text-slate-800 transition-colors"
                        >
                          취소
                        </button>
                        <button
                          onClick={() => handleSubmitReply(comment.id)}
                          disabled={!replyContent.trim() || submittingReply}
                          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {submittingReply ? '작성 중...' : '답글 작성'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 대댓글들 */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="ml-8 space-y-3">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="border-l-2 border-blue-200 pl-4 py-2">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <span className="font-semibold text-slate-700 bg-blue-50 px-2 py-1 rounded-full text-xs">
                              {getCommentAuthor(reply)}
                            </span>
                            <span className="text-xs text-slate-500">
                              {reply.createdAt}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <CommentLikeButton key={`reply-${reply.id}`} postId={Number(id)} commentId={reply.id} size="sm" />
                            {isCommentAuthor(reply) && (
                              <>
                                <button
                                  onClick={() => handleEditComment(reply)}
                                  className="px-2 py-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-xs transition-colors rounded-md border border-blue-200"
                                >
                                  수정
                                </button>
                                <button
                                  onClick={() => handleDeleteComment(reply.id)}
                                  className="px-2 py-1 text-red-600 hover:text-red-700 hover:bg-red-50 text-xs transition-colors rounded-md border border-red-200"
                                >
                                  삭제
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                        
                        {/* 대댓글 내용 또는 수정 폼 */}
                        {editingCommentId === reply.id ? (
                          <div className="space-y-3">
                            <textarea
                              value={editingCommentContent}
                              onChange={(e) => setEditingCommentContent(e.target.value)}
                              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                              rows={2}
                            />
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={handleCancelEdit}
                                className="px-3 py-1 text-slate-600 hover:text-slate-800 transition-colors text-xs"
                              >
                                취소
                              </button>
                              <button
                                onClick={() => handleUpdateComment(reply.id)}
                                disabled={!editingCommentContent.trim()}
                                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs"
                              >
                                수정
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-slate-600 leading-relaxed text-sm">{reply.content}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {comments.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                <p className="text-lg mb-2">아직 댓글이 없습니다.</p>
                <p className="text-sm">첫 댓글을 작성해보세요!</p>
                {currentUser && (
                  <p className="text-xs mt-2 text-slate-400">현재 로그인: {currentUser.nickname}</p>
                )}
              </div>
            )}
          </div>
          
          {/* 댓글 작성 폼 */}
          {currentUser ? (
            <div className="border-t pt-6">
              <textarea 
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="댓글을 입력하세요..."
                className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                rows={3}
                disabled={submittingComment}
              />
              <div className="flex justify-end mt-3">
                <button 
                  onClick={handleSubmitComment}
                  disabled={!commentContent.trim() || submittingComment}
                  className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                  {submittingComment ? '작성 중...' : '댓글 작성'}
                </button>
              </div>
            </div>
          ) : (
            <div className="border-t pt-6 text-center">
              <p className="text-slate-500 mb-4">댓글을 작성하려면 로그인이 필요합니다.</p>
              <button
                onClick={() => navigate('/login')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                로그인하기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PostDetail 