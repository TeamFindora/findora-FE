import { useState, useEffect } from 'react'
import { messageAuthApi } from '../../api/messages'

interface User {
  userId: number
  nickname: string
  email: string
  role: string
}

interface UserSearchModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectUser: (user: User) => void
}

const UserSearchModal = ({ isOpen, onClose, onSelectUser }: UserSearchModalProps) => {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      fetchUsers()
    }
  }, [isOpen])

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = users.filter(user =>
        user.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredUsers(filtered)
    } else {
      setFilteredUsers(users)
    }
  }, [searchTerm, users])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // /api/users에서 직접 사용자 정보 가져오기
      const response = await fetch('http://localhost:8080/api/users', {
        method: 'GET',
        headers: {
          'accept': '*/*',
          'Authorization': `${localStorage.getItem('tokenType')} ${localStorage.getItem('accessToken')}`
        }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const allUsers = await response.json()
      
      // 실제 사용자 정보로 변환
      const userList: User[] = allUsers.map((user: any) => ({
        userId: user.id,
        nickname: user.nickname,
        email: user.email,
        role: user.role
      }))
      
      setUsers(userList)
      setFilteredUsers(userList)
    } catch (err) {
      console.error('사용자 목록 조회 실패:', err)
      setError(err instanceof Error ? err.message : '사용자 목록을 불러올 수 없습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleUserSelect = (user: User) => {
    onSelectUser(user)
    handleClose()
  }

  const handleClose = () => {
    setSearchTerm('')
    setError(null)
    onClose()
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="user-search-overlay" onClick={handleOverlayClick}>
      <div className="user-search-modal">
        {/* 헤더 */}
        <div className="modal-header">
          <h3 className="modal-title">새 쪽지 보내기</h3>
          <button className="modal-close-button" onClick={handleClose}>
            ✕
          </button>
        </div>

        {/* 검색 영역 */}
        <div className="search-section">
          <div className="search-input-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="닉네임 또는 이메일로 검색..."
              className="search-input"
              autoFocus
            />
          </div>
          <p className="search-help">
            쪽지를 보낼 사용자를 검색하고 선택하세요.
          </p>
        </div>

        {/* 사용자 목록 */}
        <div className="users-section">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>사용자 목록을 불러오는 중...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <p className="error-message">{error}</p>
              <button className="retry-button" onClick={fetchUsers}>
                다시 시도
              </button>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👤</div>
              <h4 className="empty-title">
                {searchTerm ? '검색 결과가 없습니다' : '사용자가 없습니다'}
              </h4>
              <p className="empty-description">
                {searchTerm ? '다른 검색어를 입력해보세요.' : '등록된 사용자가 없습니다.'}
              </p>
            </div>
          ) : (
            <div className="users-list">
              {filteredUsers.map(user => (
                <div
                  key={user.userId}
                  className="user-item"
                  onClick={() => handleUserSelect(user)}
                >
                  <div className="user-avatar">
                    {user.nickname.charAt(0).toUpperCase()}
                  </div>
                  <div className="user-info">
                    <div className="user-name">{user.nickname}</div>
                    <div className="user-email">{user.email}</div>
                  </div>
                  <div className="user-role">
                    <span className="role-badge">{user.role}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 푸터 */}
        <div className="modal-footer">
          <div className="footer-info">
            {!loading && !error && (
              <span className="user-count">
                총 {filteredUsers.length}명의 사용자
              </span>
            )}
          </div>
          <button className="cancel-button" onClick={handleClose}>
            취소
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserSearchModal