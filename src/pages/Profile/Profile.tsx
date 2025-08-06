import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser, getUserProfile, updateNickname, deleteAccount } from '../../api'
import './Profile.css'

const Profile = () => {
  const navigate = useNavigate()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    nickname: ''
  })

  useEffect(() => {
    loadUserProfile()
  }, [])

  const loadUserProfile = async () => {
    try {
      // 로컬 스토리지에서 기본 사용자 정보 가져오기
      const localUser = getCurrentUser()
      if (localUser) {
        setUser(localUser)
        setFormData({
          nickname: localUser.nickname
        })
      }

      // 서버에서 최신 프로필 정보 가져오기 (ACCESS TOKEN 사용)
      const result = await getUserProfile()
      if (result.success) {
        setUser(result.data)
        setFormData({
          nickname: result.data.nickname
        })
      }
    } catch (error) {
      console.error('프로필 로드 오류:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      const result = await updateNickname(formData.nickname)
      
      if (result.success) {
        alert('닉네임이 성공적으로 수정되었습니다.')
        setEditing(false)
        
        // 로컬 사용자 정보 업데이트
        const updatedUser = { ...user, nickname: formData.nickname }
        localStorage.setItem('user', JSON.stringify(updatedUser))
        setUser(updatedUser)
        
        // 상태 업데이트 이벤트 발생
        window.dispatchEvent(new Event('auth-change'))
      } else {
        alert(result.message)
      }
    } catch (error) {
      alert('닉네임 수정 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      nickname: user?.nickname || ''
    })
    setEditing(false)
  }

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm('정말로 회원 탈퇴를 하시겠습니까?\n\n탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.')
    
    if (!confirmed) return

    const doubleConfirmed = window.confirm('한 번 더 확인합니다.\n\n정말로 회원 탈퇴를 진행하시겠습니까?')
    
    if (!doubleConfirmed) return

    try {
      setLoading(true)
      const result = await deleteAccount()
      
      if (result.success) {
        alert(result.message)
        // 상태 업데이트 이벤트 발생
        window.dispatchEvent(new Event('auth-change'))
        navigate('/')
      } else {
        alert(result.message)
      }
    } catch (error) {
      alert('회원 탈퇴 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading">프로필을 불러오는 중...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="profile-container">
        <div className="error">사용자 정보를 불러올 수 없습니다.</div>
      </div>
    )
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        {/* 헤더 */}
        <div className="profile-header">
          <button 
            className="back-button"
            onClick={() => navigate('/')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>홈으로</span>
          </button>
          <h1>내 프로필</h1>
        </div>

        {/* 사용자 아바타 섹션 */}
        <div className="profile-avatar-section">
          <div className="user-avatar-large">
            {user.nickname.charAt(0).toUpperCase()}
          </div>
          <div className="user-welcome">
            <h2>{user.nickname}님</h2>
            <p>안녕하세요! 계정 정보를 관리하세요.</p>
          </div>
        </div>

        {/* 프로필 정보 */}
        <div className="profile-content">
          <div className="info-section">
            <h3>계정 정보</h3>
            <div className="info-grid">
              <div className="info-item">
                <div className="info-content">
                  <label>사용자 ID</label>
                  <span>{user.userId}</span>
                </div>
              </div>
              
              <div className="info-item">
                <div className="info-content">
                  <label>로그인 ID</label>
                  <span>{user.loginId}</span>
                </div>
              </div>
              
              <div className="info-item">
                <div className="info-content">
                  <label>닉네임</label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.nickname}
                      onChange={(e) => handleInputChange('nickname', e.target.value)}
                      className="edit-input"
                      placeholder="닉네임을 입력하세요"
                    />
                  ) : (
                    <span>{user.nickname}</span>
                  )}
                </div>
              </div>
              
              <div className="info-item">
                <div className="info-content">
                  <label>이메일</label>
                  <span>{user.email}</span>
                </div>
              </div>
              
              <div className="info-item">
                <div className="info-content">
                  <label>권한</label>
                  <span className={`role-badge ${user.role.toLowerCase()}`}>
                    {user.role}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 액션 버튼들 */}
          <div className="profile-actions">
            {editing ? (
              <div className="edit-actions">
                <button 
                  className="save-button"
                  onClick={handleSave}
                  disabled={loading}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {loading ? '저장 중...' : '저장'}
                </button>
                <button 
                  className="cancel-button"
                  onClick={handleCancel}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  취소
                </button>
              </div>
            ) : (
              <div className="profile-buttons">
                <button 
                  className="edit-button"
                  onClick={() => setEditing(true)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18.5 2.50023C18.8978 2.1024 19.4374 1.87891 20 1.87891C20.5626 1.87891 21.1022 2.1024 21.5 2.50023C21.8978 2.89805 22.1213 3.43762 22.1213 4.00023C22.1213 4.56284 21.8978 5.1024 21.5 5.50023L12 15.0002L8 16.0002L9 12.0002L18.5 2.50023Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  프로필 수정
                </button>
                <button 
                  className="delete-button"
                  onClick={handleDeleteAccount}
                  disabled={loading}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {loading ? '처리 중...' : '회원 탈퇴'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile 