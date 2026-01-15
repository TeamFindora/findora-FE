import { useBookmark } from '../hooks/useBookmark'
import { isAuthenticated } from '../api/auth'
import { useNavigate } from 'react-router-dom'

interface BookmarkButtonProps {
  postId: number
  size?: 'sm' | 'md' | 'lg'
}

const BookmarkButton = ({ postId, size = 'md' }: BookmarkButtonProps) => {
  const { isBookmarked, loading, toggleBookmark } = useBookmark(postId)
  const navigate = useNavigate()
  
  console.log(`BookmarkButton [post-${postId}] - isBookmarked: ${isBookmarked}, loading: ${loading}`)

  const handleBookmarkClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    console.log(`북마크 버튼 클릭 [post-${postId}]`)
    
    if (!isAuthenticated()) {
      const goToLogin = window.confirm('즐겨찾기를 사용하려면 로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?')
      if (goToLogin) {
        navigate('/login')
      }
      return
    }
    
    await toggleBookmark()
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

  // 북마크 아이콘 컴포넌트
  const BookmarkIcon = () => {
    const iconSize = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'
    
    return (
      <svg
        className={`${iconSize} transition-all duration-200 ${loading ? 'animate-pulse' : ''}`}
        viewBox="0 0 24 24"
        fill={isBookmarked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
      </svg>
    )
  }

  return (
    <button
      onClick={handleBookmarkClick}
      disabled={loading}
      className={`
        inline-flex items-center space-x-2 rounded-lg transition-all duration-200
        ${styles.button}
        ${isBookmarked 
          ? 'bg-yellow-50 text-yellow-600 border border-yellow-200 hover:bg-yellow-100 hover:text-yellow-700' 
          : 'bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100 hover:text-gray-600'
        }
        ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}
      `}
      title={isBookmarked ? '즐겨찾기 해제' : '즐겨찾기 추가'}
    >
      <BookmarkIcon />
      <span className={`font-medium ${styles.text}`}>
        {isBookmarked ? '북마크됨' : '북마크'}
      </span>
    </button>
  )
}

export default BookmarkButton 