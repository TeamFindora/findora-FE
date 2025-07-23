import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import '../Home/Home.css'
import { postsApi, commentsApi } from '../../api/posts'
import type { PostResponseDto, CommentResponseDto, CommentRequestDto, CommentUpdateRequestDto } from '../../api/posts'
import { getCurrentUser, isAuthenticated } from '../../api/auth'
import PostLikeButton from '../../components/PostLikeButton'
import CommentLikeButton from '../../components/CommentLikeButton'
import BookmarkButton from '../../components/BookmarkButton'

const PostDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState<PostResponseDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingPost, setDeletingPost] = useState(false)
  
  // 댓글 관련 상태
  const [comments, setComments] = useState<CommentResponseDto[]>([])
  const [commentContent, setCommentContent] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null)
  const [editingCommentContent, setEditingCommentContent] = useState('')
  
  // 대댓글 관련 상태
  const [replyingToCommentId, setReplyingToCommentId] = useState<number | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const [submittingReply, setSubmittingReply] = useState(false)

  // 현재 로그인한 사용자 정보
  const currentUser = getCurrentUser()
  const currentUserId = currentUser?.userId || 0
  const currentUserNickname = currentUser?.nickname || ''
  
  // 현재 사용자 정보 디버깅
  console.log('현재 사용자 정보:', currentUser)

  // 댓글에서 닉네임을 가져오는 헬퍼 함수
  const getCommentAuthor = (comment: CommentResponseDto): string => {
    // 모든 가능한 닉네임 필드들을 확인
    const possibleFields = {
      userNickname: comment.userNickname,
      nickname: comment.nickname,
      author: comment.author,
      writer: comment.writer,
      user_nickname: (comment as any).user_nickname,
      authorNickname: (comment as any).authorNickname,
      author_nickname: (comment as any).author_nickname,
      writerNickname: (comment as any).writerNickname,
      writer_nickname: (comment as any).writer_nickname,
      userName: (comment as any).userName,
      user_name: (comment as any).user_name,
      name: (comment as any).name
    };
    
    console.log('가능한 닉네임 필드들:', possibleFields);
    
    const result = comment.userNickname || 
                   comment.nickname || 
                   comment.author || 
                   comment.writer || 
                   (comment as any).user_nickname ||
                   (comment as any).authorNickname ||
                   (comment as any).author_nickname ||
                   (comment as any).writerNickname ||
                   (comment as any).writer_nickname ||
                   (comment as any).userName ||
                   (comment as any).user_name ||
                   (comment as any).name ||
                   '익명';
    
    console.log('선택된 닉네임:', result);
    return result;
  }

  // 게시글 데이터 로드
  useEffect(() => {
    const loadPost = async () => {
      if (!id) return
      try {
        setLoading(true)
        const postData = await postsApi.getPostById(Number(id))
        setPost(postData)
        setError(null)
      } catch (err) {
        console.error('게시글 로드 실패:', err)
        setError('게시글을 불러오는데 실패했습니다.')
      } finally {
        setLoading(false)
      }
    }
    loadPost()
  }, [id])

  // 댓글 데이터 로드
  useEffect(() => {
    const loadComments = async () => {
      if (!id) return
      try {
        const commentsData = await commentsApi.getCommentsByPostId(Number(id))
        console.log('댓글 데이터:', commentsData) // 디버깅용
        console.log('첫 번째 댓글 상세:', commentsData[0]) // 첫 번째 댓글의 모든 필드 확인
        setComments(commentsData)
      } catch (err) {
        console.error('댓글 로드 실패:', err)
      }
    }
    loadComments()
  }, [id])

  // 게시글 삭제
  const handleDeletePost = async () => {
    if (!id) return
    const confirmed = window.confirm('정말로 이 게시글을 삭제하시겠습니까?')
    if (!confirmed) return
    try {
      setDeletingPost(true)
      await postsApi.deletePost(Number(id))
      alert('게시글이 삭제되었습니다.')
      navigate('/community')
    } catch (err) {
      console.error('게시글 삭제 실패:', err)
      alert('게시글 삭제에 실패했습니다.')
    } finally {
      setDeletingPost(false)
    }
  }

  // 게시글 작성자인지 확인 (JWT 기반)
  const isAuthor = () => {
    if (!post || !currentUser) return false;
    
    // JWT 토큰에서 가져온 사용자 정보와 게시글 작성자 닉네임 비교
    if ('userNickname' in post) {
      return post.userNickname === currentUser.nickname;
    }
    
    // 백업: userId 비교 (하지만 JWT 기반 닉네임 비교를 우선 사용)
    if ('userId' in post) {
      return Number(post.userId) === Number(currentUser.userId);
    }
    
    return false;
  }

  // 댓글 작성자인지 확인 (JWT 기반 개선된 검증)
  const isCommentAuthor = (comment: CommentResponseDto) => {
    console.log('=== 댓글 작성자 확인 (개선된 버전) 시작 ===')
    
    // 1단계: JWT 토큰 유효성 확인
    if (!isAuthenticated()) {
      console.log('❌ JWT 토큰이 없거나 만료됨')
      return false;
    }
    
    // 2단계: 현재 사용자 정보 확인
    if (!currentUser) {
      console.log('❌ 현재 사용자 정보가 없습니다.')
      return false;
    }
    
    console.log('현재 사용자:', { userId: currentUser.userId, nickname: currentUser.nickname })
    console.log('댓글 정보:', { userId: comment.userId, userNickname: comment.userNickname })
    
    // 3단계: userId 비교 (타입 안전)
    const commentUserId = Number(comment.userId);
    const currentUserId = Number(currentUser.userId);
    const userIdMatch = commentUserId === currentUserId;
    
    // 4단계: 닉네임 비교 (추가 검증)
    const commentNickname = comment.userNickname || getCommentAuthor(comment);
    const nicknameMatch = commentNickname === currentUser.nickname;
    
    console.log('검증 결과:', {
      userIdMatch,
      nicknameMatch,
      commentUserId,
      currentUserId,
      commentNickname,
      currentNickname: currentUser.nickname
    })
    
    // 5단계: 두 조건 모두 만족해야 작성자로 인정 (보안 강화)
    const isAuthor = userIdMatch && nicknameMatch;
    
    console.log('최종 결과:', isAuthor)
    console.log('=== 댓글 작성자 확인 끝 ===')
    
    return isAuthor;
  }

  // 댓글 작성
  const handleSubmitComment = async () => {
    if (!commentContent.trim() || !id || !currentUser) return;
    
    try {
      setSubmittingComment(true);
      
      // 디버깅: 현재 사용자 정보 확인
      console.log('=== 댓글 작성 디버깅 시작 ===');
      console.log('현재 사용자:', currentUser);
      console.log('게시글 ID:', id);
      console.log('댓글 내용:', commentContent.trim());
      
      const commentData: CommentRequestDto = {
        content: commentContent.trim(),
        userId: currentUser.userId  // 사용자 ID 추가
      };
      
      console.log('전송할 댓글 데이터:', commentData);
      
      // 1단계: 즉시 UI 업데이트 (로컬스토리지 정보 사용)
      const tempComment: CommentResponseDto = {
        id: Date.now(), // 임시 ID (타임스탬프 사용)
        postId: Number(id),
        userId: currentUser.userId,
        userNickname: currentUser.nickname,
        content: commentContent.trim(),
        createdAt: new Date().toISOString().split('T')[0], // 오늘 날짜
        updatedAt: new Date().toISOString().split('T')[0],
        parentId: undefined
      };
      
      // 댓글 목록에 즉시 추가
      setComments(prev => [...prev, tempComment]);
      setCommentContent('');
      
      console.log('임시 댓글 추가됨:', tempComment);
      
      // 2단계: 서버에 실제 댓글 작성 요청
      await commentsApi.createComment(Number(id), commentData);
      
      // 3단계: 서버에서 최신 댓글 목록 가져와서 실제 데이터로 교체
      const updatedComments = await commentsApi.getCommentsByPostId(Number(id));
      setComments(updatedComments);
      
      console.log('서버에서 최신 댓글 목록 가져옴');
      console.log('=== 댓글 작성 디버깅 끝 ===');
      
    } catch (err) {
      console.error('댓글 작성 실패 상세:', err);
      console.error('에러 타입:', typeof err);
      console.error('에러 메시지:', err instanceof Error ? err.message : String(err));
      
      // 에러 발생 시 댓글 목록 새로고침 (임시 댓글 제거)
      try {
        const updatedComments = await commentsApi.getCommentsByPostId(Number(id));
        setComments(updatedComments);
      } catch {
        // 새로고침도 실패하면 임시 댓글만 제거
        setComments(prev => prev.filter(comment => comment.id !== Date.now()));
      }
      
      alert('댓글 작성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setSubmittingComment(false);
    }
  };

  // 댓글 수정 시작
  const handleEditComment = (comment: CommentResponseDto) => {
    setEditingCommentId(comment.id);
    setEditingCommentContent(comment.content);
  };

  // 댓글 수정 완료
  const handleUpdateComment = async (commentId: number) => {
    if (!editingCommentContent.trim() || !id) return;
    
    try {
      const updateData: CommentUpdateRequestDto = {
        content: editingCommentContent.trim()
      };
      
      await commentsApi.updateComment(Number(id), commentId, updateData);
      setEditingCommentId(null);
      setEditingCommentContent('');
      
      // 댓글 목록 새로고침
      const updatedComments = await commentsApi.getCommentsByPostId(Number(id));
      setComments(updatedComments);
      
    } catch (err) {
      console.error('댓글 수정 실패:', err);
      alert('댓글 수정에 실패했습니다.');
    }
  };

  // 댓글 삭제
  const handleDeleteComment = async (commentId: number) => {
    if (!id) return;
    
    const confirmed = window.confirm('정말로 이 댓글을 삭제하시겠습니까?');
    if (!confirmed) return;
    
    try {
      await commentsApi.deleteComment(Number(id), commentId);
      
      // 댓글 목록 새로고침
      const updatedComments = await commentsApi.getCommentsByPostId(Number(id));
      setComments(updatedComments);
      
    } catch (err) {
      console.error('댓글 삭제 실패:', err);
      alert('댓글 삭제에 실패했습니다.');
    }
  };

  // 댓글 수정 취소
  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingCommentContent('');
  };

  // 대댓글 작성 시작
  const handleReplyToComment = (commentId: number) => {
    setReplyingToCommentId(commentId);
    setReplyContent('');
  };

  // 대댓글 작성 완료
  const handleSubmitReply = async (parentId: number) => {
    if (!replyContent.trim() || !id || !currentUser) return;
    
    try {
      setSubmittingReply(true);
      
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