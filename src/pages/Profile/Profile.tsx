import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser, getUserProfile, updateUserProfile } from '../../api'
import './Profile.css'

const Profile = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    nickname: '',
    email: ''
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
          nickname: localUser.nickname,
          email: localUser.email
        })
      }

      // 서버에서 최신 프로필 정보 가져오기 (ACCESS TOKEN 사용)
      const result = await getUserProfile()
      if (result.success) {
        setUser(result.data)
        setFormData({
          nickname: result.data.nickname,
          email: result.data.email
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
      const result = await updateUserProfile(formData)
      
      if (result.success) {
        alert('프로필이 성공적으로 수정되었습니다.')
        setEditing(false)
        
        // 로컬 사용자 정보 업데이트
        const updatedUser = { ...user, ...formData }
        localStorage.setItem('user', JSON.stringify(updatedUser))
        setUser(updatedUser)
        
        // 상태 업데이트 이벤트 발생
        window.dispatchEvent(new Event('auth-change'))
      } else {
        alert(result.message)
      }
    } catch (error) {
      alert('프로필 수정 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      nickname: user?.nickname || '',
      email: user?.email || ''
    })
    setEditing(false)
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
        <div className="profile-header">
          <h2>내 프로필</h2>
          <button 
            className="back-button"
            onClick={() => navigate('/')}
          >
            ← 홈으로
          </button>
        </div>

        <div className="profile-content">
          <div className="profile-info">
            <div className="info-item">
              <label>사용자 ID</label>
              <span>{user.userId}</span>
            </div>
            
            <div className="info-item">
              <label>로그인 ID</label>
              <span>{user.loginId}</span>
            </div>
            
            <div className="info-item">
              <label>닉네임</label>
              {editing ? (
                <input
                  type="text"
                  value={formData.nickname}
                  onChange={(e) => handleInputChange('nickname', e.target.value)}
                  className="edit-input"
                />
              ) : (
                <span>{user.nickname}</span>
              )}
            </div>
            
            <div className="info-item">
              <label>이메일</label>
              {editing ? (
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="edit-input"
                />
              ) : (
                <span>{user.email}</span>
              )}
            </div>
            
            <div className="info-item">
              <label>권한</label>
              <span className={`role-badge ${user.role.toLowerCase()}`}>
                {user.role}
              </span>
            </div>
          </div>

          <div className="profile-actions">
            {editing ? (
              <div className="edit-actions">
                <button 
                  className="save-button"
                  onClick={handleSave}
                  disabled={loading}
                >
                  {loading ? '저장 중...' : '저장'}
                </button>
                <button 
                  className="cancel-button"
                  onClick={handleCancel}
                >
                  취소
                </button>
              </div>
            ) : (
              <button 
                className="edit-button"
                onClick={() => setEditing(true)}
              >
                프로필 수정
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile 