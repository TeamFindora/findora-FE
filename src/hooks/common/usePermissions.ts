import { useMemo } from 'react'
import { getCurrentUser, isAuthenticated } from '../../api/auth'
import type { PostResponseDto, CommentResponseDto } from '../../api/posts'

interface UsePermissionsOptions {
  post?: PostResponseDto | null
  currentUser?: any
}

export const usePermissions = ({ post, currentUser }: UsePermissionsOptions = {}) => {
  const user = currentUser || (isAuthenticated() ? getCurrentUser() : null)

  const permissions = useMemo(() => {
    if (!user || !post) {
      return {
        canEditPost: false,
        canDeletePost: false,
        canComment: isAuthenticated(),
        isPostAuthor: false
      }
    }

    const isPostAuthor = post.userId === user.id || 
                        post.userNickname === user.nickname ||
                        (post as any).writer === user.nickname

    return {
      canEditPost: isPostAuthor,
      canDeletePost: isPostAuthor,
      canComment: isAuthenticated(),
      isPostAuthor
    }
  }, [user, post])

  const canEditComment = (comment: CommentResponseDto) => {
    if (!user || !comment) return false
    
    return comment.userId === user.id || 
           comment.userNickname === user.nickname ||
           (comment as any).writer === user.nickname
  }

  const canDeleteComment = (comment: CommentResponseDto) => {
    return canEditComment(comment)
  }

  const isCommentAuthor = (comment: CommentResponseDto) => {
    return canEditComment(comment)
  }

  return {
    ...permissions,
    canEditComment,
    canDeleteComment,
    isCommentAuthor,
    currentUser: user
  }
}