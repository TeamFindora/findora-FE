import { usePostLikes } from '../hooks/usePostLikes'
import { isAuthenticated } from '../api/auth'
import { useNavigate } from 'react-router-dom'

interface PostLikeButtonProps {
  postId: number
  size?: 'sm' | 'md' | 'lg'
}

const PostLikeButton = ({ postId, size = 'md' }: PostLikeButtonProps) => {
  const { isLiked, likeCount, loading, toggleLike } = usePostLikes(postId)
  const navigate = useNavigate()
  
  console.log(`PostLikeButton [post-${postId}] - isLiked: ${isLiked}, count: ${likeCount}`)

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    console.log(`게시글 좋아요 버튼 클릭 [post-${postId}]`)
    
    if (!isAuthenticated()) {
      const goToLogin = window.confirm('좋아요를 누르려면 로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?')
      if (goToLogin) {
        navigate('/login')
      }
      return
    }
    
    await toggleLike()
  }

  // 사이즈별 스타일
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          button: 'px-2 py-1 text-sm',
          text: 'text-xs'
        }
      case 'lg':
        return {
          button: 'px-4 py-3 text-lg',
          text: 'text-base'
        }
      default: // md
        return {
          button: 'px-3 py-2',
          text: 'text-sm'
        }
    }
  }

  const styles = getSizeStyles()

  // 하트 아이콘 컴포넌트
  const HeartIcon = () => {
    const heartSize = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'
    
    return (
      <svg
        className={`${heartSize} transition-all duration-200 ${loading ? 'animate-pulse' : ''}`}
        viewBox="0 0 24 24"
        fill={isLiked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    )
  }

  return (
    <button
      onClick={handleLikeClick}
      disabled={loading}
      className={`
        inline-flex items-center space-x-2 rounded-lg transition-all duration-200
        ${styles.button}
        ${isLiked 
          ? 'bg-red-50 text-red-500 border border-red-200 hover:bg-red-100 hover:text-red-600' 
          : 'bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100 hover:text-gray-600'
        }
        ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}
      `}
    >
      <HeartIcon />
      <span className={`font-medium ${styles.text}`}>
        {likeCount}
      </span>
    </button>
  )
}

export default PostLikeButton 