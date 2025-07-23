import { useCommentCount } from '../hooks/useCommentCount'

interface CommentCountProps {
  postId: number
  className?: string
}

const CommentCount = ({ postId, className = '' }: CommentCountProps) => {
  const { commentCount, loading } = useCommentCount(postId)

  if (loading) {
    return <span className={className}>💬 ...</span>
  }

  return <span className={className}>💬 {commentCount}</span>
}

export default CommentCount 