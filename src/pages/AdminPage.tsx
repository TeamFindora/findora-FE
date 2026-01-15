import { useState, useEffect } from 'react'
import { messageAuthApi } from '../api/messages'
import { getCurrentUser, isAuthenticated } from '../api/auth'
import { useNavigate } from 'react-router-dom'
import './AdminPage.css'

interface User {
  userId: number
  count: number
}

const AdminPage = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [editingUser, setEditingUser] = useState<number | null>(null)
  const [newCount, setNewCount] = useState<number>(0)
  const navigate = useNavigate()

  useEffect(() => {
    // 관리자 권한 확인
    if (!isAuthenticated()) {
      navigate('/login')
      return
    }

    const user = getCurrentUser()
    setCurrentUser(user)

    // 관리자가 아니면 홈으로 리다이렉트 (임시로 모든 사용자 허용)
    // if (user?.role !== 'ADMIN') {
    //   navigate('/')
    //   return
    // }

    fetchUsers()
  }, [navigate])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)

      const allUsers = await messageAuthApi.getAllUsers()
      setUsers(allUsers)
    } catch (err) {
      console.error('사용자 목록 조회 실패:', err)
      setError(err instanceof Error ? err.message : '사용자 목록을 불러올 수 없습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleEditClick = (userId: number, currentCount: number) => {
    setEditingUser(userId)
    setNewCount(currentCount)
  }

  const handleSaveClick = async (userId: number) => {
    try {
      setError(null)
      
      // 사용자에게 쪽지 권한 부여 (5회씩 추가)
      const grantCount = Math.ceil(newCount / 5) // 5의 배수로 올림
      for (let i = 0; i < grantCount; i++) {
        await messageAuthApi.grantAuthority(userId)
      }
      
      alert(`사용자 ${userId}에게 쪽지 권한 ${grantCount * 5}회가 부여되었습니다.`)
      
      // 목록 새로고침
      await fetchUsers()
      setEditingUser(null)
    } catch (err) {
      console.error('쪽지 권한 부여 실패:', err)
      setError(err instanceof Error ? err.message : '권한 부여에 실패했습니다.')
    }
  }

  const handleCancelClick = () => {
    setEditingUser(null)
    setNewCount(0)
  }

  const handleGrantAllUsers = async () => {
    if (!window.confirm('모든 사용자에게 쪽지 권한 5회를 부여하시겠습니까?')) {
      return
    }

    try {
      setError(null)
      
      for (const user of users) {
        await messageAuthApi.grantAuthority(user.userId)
      }
      
      alert(`총 ${users.length}명의 사용자에게 쪽지 권한 5회가 부여되었습니다.`)
      await fetchUsers()
    } catch (err) {
      console.error('전체 권한 부여 실패:', err)
      setError(err instanceof Error ? err.message : '전체 권한 부여에 실패했습니다.')
    }
  }

  if (!currentUser) {
    return (
      <div className="admin-page">
        <div className="admin-loading">로딩 중...</div>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <div className="admin-container">
        {/* 헤더 */}
        <div className="admin-header">
          <div className="admin-title-section">
            <h1 className="admin-title">관리자 페이지</h1>
            <p className="admin-subtitle">사용자 쪽지 권한 관리</p>
          </div>
          <div className="admin-user-info">
            <span className="current-user">
              관리자: {currentUser.nickname}님
            </span>
            <button 
              className="back-button"
              onClick={() => navigate('/')}
            >
              홈으로 돌아가기
            </button>
          </div>
        </div>

        {/* 통계 */}
        <div className="admin-stats">
          <div className="stat-card">
            <div className="stat-number">{users.length}</div>
            <div className="stat-label">총 사용자 수</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {users.reduce((sum, user) => sum + user.count, 0)}
            </div>
            <div className="stat-label">총 쪽지 개수</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {users.filter(user => user.count > 0).length}
            </div>
            <div className="stat-label">권한 보유 사용자</div>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="admin-actions">
          <button 
            className="grant-all-button"
            onClick={handleGrantAllUsers}
            disabled={loading}
          >
            🎁 모든 사용자에게 5회 부여
          </button>
          <button 
            className="refresh-button"
            onClick={fetchUsers}
            disabled={loading}
          >
            🔄 새로고침
          </button>
        </div>

        {/* 사용자 목록 */}
        <div className="admin-content">
          {error && (
            <div className="admin-error">
              <span className="error-icon">❌</span>
              <span className="error-text">{error}</span>
            </div>
          )}

          {loading ? (
            <div className="admin-loading">
              <div className="loading-spinner"></div>
              <p>사용자 목록을 불러오는 중...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="admin-empty">
              <div className="empty-icon">👥</div>
              <h3>등록된 사용자가 없습니다</h3>
              <p>가입된 사용자가 없습니다.</p>
            </div>
          ) : (
            <div className="users-table-container">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>사용자 ID</th>
                    <th>현재 쪽지 개수</th>
                    <th>상태</th>
                    <th>액션</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.userId} className={user.count === 0 ? 'user-empty' : ''}>
                      <td>
                        <div className="user-id-cell">
                          <div className="user-avatar">
                            {user.userId}
                          </div>
                          <span>사용자 {user.userId}</span>
                        </div>
                      </td>
                      <td>
                        <div className="count-cell">
                          {editingUser === user.userId ? (
                            <input
                              type="number"
                              value={newCount}
                              onChange={(e) => setNewCount(parseInt(e.target.value) || 0)}
                              className="count-input"
                              min="0"
                              max="100"
                            />
                          ) : (
                            <span className={`count-badge ${user.count === 0 ? 'count-zero' : user.count <= 5 ? 'count-low' : 'count-normal'}`}>
                              {user.count}회
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className={`status-badge ${user.count > 0 ? 'status-active' : 'status-inactive'}`}>
                          {user.count > 0 ? '활성' : '비활성'}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          {editingUser === user.userId ? (
                            <>
                              <button 
                                className="save-button"
                                onClick={() => handleSaveClick(user.userId)}
                              >
                                저장
                              </button>
                              <button 
                                className="cancel-button"
                                onClick={handleCancelClick}
                              >
                                취소
                              </button>
                            </>
                          ) : (
                            <button 
                              className="edit-button"
                              onClick={() => handleEditClick(user.userId, user.count)}
                            >
                              ✏️ 수정
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminPage