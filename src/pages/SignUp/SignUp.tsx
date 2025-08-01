import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { checkNickname, checkUsername, sendEmailVerification, verifyEmailCode, signUp } from '../../api'
import type { AgreementData } from '../../api'
import './SignUp.css'

const SignUp = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  
  // 폼 데이터
  const [formData, setFormData] = useState({
    nickname: '',
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    verificationCode: ''
  });

  // 검증 상태
  const [validation, setValidation] = useState<{
    nickname: { status: string; message: string; checked: boolean };
    username: { status: string; message: string; checked: boolean };
    email: { status: string; message: string; verified: boolean; codeSent: boolean };
  }>({
    nickname: { status: '', message: '', checked: false },
    username: { status: '', message: '', checked: false },
    email: { status: '', message: '', verified: false, codeSent: false }
  });

  // 로딩 상태
  const [loading, setLoading] = useState({
    nickname: false,
    username: false,
    email: false,
    verification: false
  });

  const handleClose = () => {
    navigate('/')
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // 입력값이 변경되면 검증 상태 초기화
    if (field === 'nickname' || field === 'username') {
      setValidation(prev => ({
        ...prev,
        [field]: { status: '', message: '', checked: false }
      }));
    }
    
    // 이메일이 변경되면 인증 상태 초기화
    if (field === 'email') {
      setValidation(prev => ({
        ...prev,
        email: { status: '', message: '', verified: false, codeSent: false }
      }));
      setFormData(prev => ({ ...prev, verificationCode: '' }));
    }
  };

  const handleNicknameCheck = async () => {
    if (!formData.nickname.trim()) {
      alert('닉네임을 입력해주세요.');
      return;
    }

    setLoading(prev => ({ ...prev, nickname: true }));
    
    try {
      const result = await checkNickname(formData.nickname);
      setValidation(prev => ({
        ...prev,
        nickname: {
          status: result.success ? 'success' : 'error',
          message: result.message,
          checked: true
        }
      }));
    } catch (error) {
      setValidation(prev => ({
        ...prev,
        nickname: {
          status: 'error',
          message: '네트워크 오류가 발생했습니다.',
          checked: false
        }
      }));
    } finally {
      setLoading(prev => ({ ...prev, nickname: false }));
    }
  };

  const handleUsernameCheck = async () => {
    if (!formData.username.trim()) {
      alert('아이디를 입력해주세요.');
      return;
    }

    setLoading(prev => ({ ...prev, username: true }));
    
    try {
      const result = await checkUsername(formData.username);
      setValidation(prev => ({
        ...prev,
        username: {
          status: result.success ? 'success' : 'error',
          message: result.message,
          checked: true
        }
      }));
    } catch (error) {
      setValidation(prev => ({
        ...prev,
        username: {
          status: 'error',
          message: '네트워크 오류가 발생했습니다.',
          checked: false
        }
      }));
    } finally {
      setLoading(prev => ({ ...prev, username: false }));
    }
  };

  const handleEmailVerification = async () => {
    if (!formData.email.trim()) {
      alert('이메일을 입력해주세요.');
      return;
    }

    // 즉시 인증번호 입력칸 표시 (UX 개선)
    setValidation(prev => ({
      ...prev,
      email: {
        status: 'success',
        message: '인증번호를 발송했습니다. 이메일을 확인해주세요.',
        verified: false,
        codeSent: true
      }
    }));
    
    // 백그라운드에서 API 호출
    try {
      const result = await sendEmailVerification(formData.email);
      
      // API 실패 시에만 상태 업데이트
      if (!result.success) {
        setValidation(prev => ({
          ...prev,
          email: {
            status: 'error',
            message: result.message,
            verified: false,
            codeSent: false
          }
        }));
      }
    } catch (error) {
      // 네트워크 오류 시에만 상태 업데이트
      setValidation(prev => ({
        ...prev,
        email: {
          status: 'error',
          message: '네트워크 오류가 발생했습니다. 다시 시도해주세요.',
          verified: false,
          codeSent: false
        }
      }));
    }
  };

  const handleVerifyCode = async () => {
    if (!formData.verificationCode.trim()) {
      alert('인증번호를 입력해주세요.');
      return;
    }

    setLoading(prev => ({ ...prev, verification: true }));
    
    try {
      const result = await verifyEmailCode(formData.email, formData.verificationCode);
      setValidation(prev => ({
        ...prev,
        email: {
          ...prev.email,
          status: result.success ? 'success' : 'error',
          message: result.message,
          verified: result.success
        }
      }));
    } catch (error) {
      setValidation(prev => ({
        ...prev,
        email: {
          ...prev.email,
          status: 'error',
          message: '네트워크 오류가 발생했습니다.',
          verified: false
        }
      }));
    } finally {
      setLoading(prev => ({ ...prev, verification: false }));
    }
  };

  const getPasswordValidation = () => {
    if (!formData.password) return { status: '', message: '' };
    
    const hasLetter = /[a-zA-Z]/.test(formData.password);
    const hasNumber = /\d/.test(formData.password);
    const isLongEnough = formData.password.length >= 8;
    
    if (!hasLetter || !hasNumber || !isLongEnough) {
      return { status: 'error', message: '영문, 숫자 포함 8글자 이상의 비밀번호를 입력해주세요.' };
    }
    return { status: 'success', message: '사용 가능한 비밀번호입니다.' };
  };

  const getConfirmPasswordValidation = () => {
    if (!formData.confirmPassword) return { status: '', message: '' };
    
    if (formData.password !== formData.confirmPassword) {
      return { status: 'error', message: '비밀번호가 일치하지 않습니다.' };
    }
    return { status: 'success', message: '비밀번호가 일치합니다.' };
  };

  const passwordValidation = getPasswordValidation();
  const confirmPasswordValidation = getConfirmPasswordValidation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 필수 검증
    if (!validation.nickname.checked || validation.nickname.status !== 'success') {
      alert('닉네임 중복확인을 완료해주세요.');
      return;
    }
    
    if (!validation.username.checked || validation.username.status !== 'success') {
      alert('아이디 중복확인을 완료해주세요.');
      return;
    }
    
    if (passwordValidation.status !== 'success') {
      alert('비밀번호를 올바르게 입력해주세요.');
      return;
    }
    
    if (confirmPasswordValidation.status !== 'success') {
      alert('비밀번호 확인을 올바르게 입력해주세요.');
      return;
    }
    
    if (!validation.email.verified) {
      alert('이메일 인증을 완료해주세요.');
      return;
    }
    
    if (!agreedToTerms) {
      alert('약관에 동의해주세요.');
      return;
    }

    try {
      const agreements: AgreementData[] = [
        { type: 'SERVICE', agreed: true },
        { type: 'PRIVACY', agreed: true },
        { type: 'MARKETING', agreed: agreedToTerms }
      ];

      const result = await signUp({
        nickname: formData.nickname,
        username: formData.username,
        password: formData.password,
        email: formData.email,
        agreements
      });

      if (result.success) {
        alert(result.message);
        navigate('/login');
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert('회원가입 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <div className="signup-header">
          <h2 className="signup-title">회원가입</h2>
          <button className="close-button" onClick={handleClose}>
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="signup-form-content">
          {/* 닉네임 */}
          <div className="form-group signup-nickname-group">
            <label htmlFor="nickname" className="signup-label">닉네임</label>
            <span className={`message-text signup-message ${validation.nickname.status}`}>
              {validation.nickname.message}
            </span>
            <div className="input-group signup-input-group">
              <input 
                type="text" 
                id="nickname" 
                name="nickname" 
                placeholder="haneul"
                value={formData.nickname}
                onChange={(e) => handleInputChange('nickname', e.target.value)}
                className="signup-input"
                required 
              />
              <button 
                type="button" 
                className="check-button signup-check-button"
                onClick={handleNicknameCheck}
                disabled={loading.nickname}
              >
                {loading.nickname ? '확인중...' : '중복확인'}
              </button>
            </div>
          </div>

          {/* 아이디 */}
          <div className="form-group signup-username-group">
            <label htmlFor="username" className="signup-label">아이디</label>
            <span className={`message-text signup-message ${validation.username.status}`}>
              {validation.username.message}
            </span>
            <div className="input-group signup-input-group">
              <input 
                type="text" 
                id="username" 
                name="username" 
                placeholder="haneul1234"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                className="signup-input"
                required 
              />
              <button 
                type="button" 
                className="check-button signup-check-button"
                onClick={handleUsernameCheck}
                disabled={loading.username}
              >
                {loading.username ? '확인중...' : '중복확인'}
              </button>
            </div>
          </div>

          {/* 비밀번호 */}
          <div className="form-group signup-password-group">
            <label htmlFor="password" className="signup-label">비밀번호</label>
            <span className={`message-text signup-message ${passwordValidation.status}`}>
              {passwordValidation.message || '영문, 숫자 포함 8글자 이상의 비밀번호를 입력해주세요.'}
            </span>
            <div className="input-group password-group signup-input-group">
              <input 
                type={showPassword ? "text" : "password"}
                id="password" 
                name="password" 
                placeholder="••••••••••••"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="signup-input"
                required 
              />
              <button 
                type="button" 
                className="eye-button signup-eye-button"
                onClick={togglePasswordVisibility}
              >
                <span className="signup-eye-icon">👁️</span>
              </button>
            </div>
          </div>

          {/* 비밀번호 재입력 */}
          <div className="form-group signup-confirm-password-group">
            <label htmlFor="confirmPassword" className="signup-label">비밀번호 재입력</label>
            <span className={`message-text signup-message ${confirmPasswordValidation.status}`}>
              {confirmPasswordValidation.message}
            </span>
            <div className="input-group password-group signup-input-group">
              <input 
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword" 
                name="confirmPassword" 
                placeholder="••••••••••••"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className="signup-input"
                required 
              />
              <button 
                type="button" 
                className="eye-button signup-eye-button"
                onClick={toggleConfirmPasswordVisibility}
              >
                <span className="signup-eye-icon">👁️</span>
              </button>
            </div>
          </div>

          {/* 이메일 */}
          <div className="form-group signup-email-group">
            <label htmlFor="email" className="signup-label">이메일</label>
            <span className={`message-text signup-message ${validation.email.status}`}>
              {validation.email.message || '연락이 가능합니다.'}
            </span>
            <div className="input-group signup-input-group">
              <input 
                type="email" 
                id="email" 
                name="email" 
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="signup-input"
                required 
              />
              <button 
                type="button" 
                className="verify-button signup-verify-button"
                onClick={handleEmailVerification}
                disabled={validation.email.codeSent}
              >
                {validation.email.codeSent ? '발송완료' : '인증'}
              </button>
            </div>
          </div>

          {/* 인증번호 */}
          {validation.email.codeSent && (
            <div className="form-group signup-verification-group">
              <div className="input-group signup-input-group">
                <input 
                  type="text" 
                  name="verificationCode" 
                  placeholder="인증번호 입력"
                  className="verification-input signup-verification-input"
                  value={formData.verificationCode}
                  onChange={(e) => handleInputChange('verificationCode', e.target.value)}
                />
                <button 
                  type="button" 
                  className="verify-button signup-verify-button"
                  onClick={handleVerifyCode}
                  disabled={loading.verification}
                >
                  {loading.verification ? '확인중...' : '확인'}
                </button>
              </div>
            </div>
          )}

          {/* 약관 동의 */}
          <div className="form-group checkbox-group signup-terms-group">
            <label className="checkbox-label signup-checkbox-label">
              <input 
                type="checkbox" 
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="signup-checkbox"
              />
              <span className="checkmark signup-checkmark"></span>
              <span className="checkbox-text signup-checkbox-text">
                이용약관 제공업체 수집 및 동의, 마케팅 동의 및 선택사항 모두 동의합니다.
              </span>
            </label>
          </div>

          <button type="submit" className="signup-button">
            회원가입
          </button>
        </form>
        <div className="signup-links">
          <span className="signup-links-text">이미 계정이 있으신가요?</span>
          <Link to="/login" className="signup-login-link">로그인</Link>
        </div>
      </div>
    </div>
  )
}

export default SignUp 