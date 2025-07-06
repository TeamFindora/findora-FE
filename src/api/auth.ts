// 인증 관련 API 타입 정의
export interface ApiResponse {
  success: boolean;
  message: string;
}

export interface CheckResponse {
  exists: boolean;
}

// 로그인 응답 타입 정의
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: {
    userId: number;
    loginId: string;
    email: string;
    nickname: string;
    role: string;
  };
}

// API 기본 설정
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// 닉네임 중복 확인
export const checkNickname = async (nickname: string): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/check-nickname?nickname=${encodeURIComponent(nickname)}`);
    const data: CheckResponse = await response.json();
    
    if (data.exists) {
      return { success: false, message: "이미 사용중인 닉네임입니다." };
    } else {
      return { success: true, message: "사용할 수 있는 닉네임입니다." };
    }
  } catch (error) {
    console.error('닉네임 중복 확인 오류:', error);
    return { success: false, message: "네트워크 오류가 발생했습니다." };
  }
};

// 아이디 중복 확인
export const checkUsername = async (username: string): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/check-loginid?loginId=${encodeURIComponent(username)}`);
    const data: CheckResponse = await response.json();
    
    if (data.exists) {
      return { success: false, message: "이미 사용중인 아이디입니다." };
    } else {
      return { success: true, message: "사용할 수 있는 아이디입니다." };
    }
  } catch (error) {
    console.error('아이디 중복 확인 오류:', error);
    return { success: false, message: "네트워크 오류가 발생했습니다." };
  }
};

// 이메일 인증번호 발송
export const sendEmailVerification = async (email: string): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/email/send-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      return { success: true, message: data.message || "인증번호가 발송되었습니다." };
    } else {
      return { success: false, message: data.error || "이메일 발송에 실패했습니다." };
    }
  } catch (error) {
    console.error('이메일 인증 발송 오류:', error);
    return { success: false, message: "네트워크 오류가 발생했습니다." };
  }
};

// 이메일 인증번호 확인
export const verifyEmailCode = async (email: string, code: string): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/email/verify-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, code }),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      return { success: true, message: data.message || "이메일 인증이 완료되었습니다." };
    } else {
      return { success: false, message: data.error || "인증번호가 일치하지 않습니다." };
    }
  } catch (error) {
    console.error('이메일 인증 확인 오류:', error);
    return { success: false, message: "네트워크 오류가 발생했습니다." };
  }
};

// 로그인
export const login = async (username: string, password: string): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        loginId: username, 
        password 
      }),
    });
    
    if (response.ok) {
      const data: LoginResponse = await response.json();
      
      // 토큰 만료 시간 계산 (현재 시간 + expiresIn)
      const expirationTime = Date.now() + data.expiresIn;
      
      // 토큰과 사용자 정보 저장
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('tokenType', data.tokenType);
      localStorage.setItem('expiresIn', expirationTime.toString());
      localStorage.setItem('user', JSON.stringify(data.user));
      
      return { 
        success: true, 
        message: `${data.user.nickname}님, 환영합니다!` 
      };
    } else {
      const errorData = await response.json();
      return { 
        success: false, 
        message: errorData.message || errorData.error || "로그인에 실패했습니다." 
      };
    }
  } catch (error) {
    console.error('로그인 오류:', error);
    return { success: false, message: "네트워크 오류가 발생했습니다." };
  }
};

// 회원가입
export interface SignUpData {
  nickname: string;
  username: string;
  password: string;
  email: string;
  role?: string;
  agreements: AgreementData[];
}

export interface AgreementData {
  type: 'SERVICE' | 'PRIVACY' | 'MARKETING';
  agreed: boolean;
}

export const signUp = async (data: SignUpData): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        loginId: data.username,
        password: data.password,
        nickname: data.nickname,
        email: data.email,
        role: data.role || 'USER',
        agreements: data.agreements
      }),
    });
    
    const responseData = await response.json();
    
    if (response.ok) {
      return { 
        success: true, 
        message: responseData.message || "회원가입이 완료되었습니다." 
      };
    } else {
      return { 
        success: false, 
        message: responseData.error || "회원가입에 실패했습니다." 
      };
    }
  } catch (error) {
    console.error('회원가입 오류:', error);
    return { success: false, message: "네트워크 오류가 발생했습니다." };
  }
};

// 인증 관련 유틸리티 함수들
export const getAuthHeader = (): { Authorization: string } | {} => {
  const accessToken = localStorage.getItem('accessToken');
  const tokenType = localStorage.getItem('tokenType');
  
  if (accessToken && tokenType) {
    return { Authorization: `${tokenType} ${accessToken}` };
  }
  return {};
};

export const isAuthenticated = (): boolean => {
  const accessToken = localStorage.getItem('accessToken');
  const expiresIn = localStorage.getItem('expiresIn');
  
  if (!accessToken || !expiresIn) {
    return false;
  }
  
  // 토큰 만료 시간 확인
  const currentTime = Date.now();
  const tokenExpiry = parseInt(expiresIn);
  
  return currentTime < tokenExpiry;
};

export const getCurrentUser = () => {
  const userString = localStorage.getItem('user');
  if (userString) {
    try {
      return JSON.parse(userString);
    } catch (error) {
      console.error('사용자 정보 파싱 오류:', error);
      return null;
    }
  }
  return null;
};

export const logout = (): void => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('tokenType');
  localStorage.removeItem('expiresIn');
  localStorage.removeItem('user');
};

// 사용자 프로필 조회
export const getUserProfile = async (): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
    });

    if (response.ok) {
      const data = await response.json();
      return { success: true, data };
    } else {
      const errorData = await response.json();
      return { 
        success: false, 
        message: errorData.message || "프로필 조회에 실패했습니다." 
      };
    }
  } catch (error) {
    console.error('프로필 조회 오류:', error);
    return { success: false, message: "네트워크 오류가 발생했습니다." };
  }
};

// 사용자 프로필 수정
export const updateUserProfile = async (profileData: {
  nickname?: string;
  email?: string;
}): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(profileData),
    });

    if (response.ok) {
      const data = await response.json();
      return { success: true, message: "프로필이 수정되었습니다." };
    } else {
      const errorData = await response.json();
      return { 
        success: false, 
        message: errorData.message || "프로필 수정에 실패했습니다." 
      };
    }
  } catch (error) {
    console.error('프로필 수정 오류:', error);
    return { success: false, message: "네트워크 오류가 발생했습니다." };
  }
};

// 토큰 갱신
export const refreshAccessToken = async (): Promise<ApiResponse> => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      return { success: false, message: "리프레시 토큰이 없습니다." };
    }

    const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (response.ok) {
      const data: LoginResponse = await response.json();
      
      // 새로운 토큰 만료 시간 계산
      const expirationTime = Date.now() + data.expiresIn;
      
      // 새로운 토큰 저장
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('tokenType', data.tokenType);
      localStorage.setItem('expiresIn', expirationTime.toString());
      
      return { success: true, message: "토큰이 갱신되었습니다." };
    } else {
      // 리프레시 토큰도 만료된 경우 로그아웃
      logout();
      return { success: false, message: "다시 로그인해주세요." };
    }
  } catch (error) {
    console.error('토큰 갱신 오류:', error);
    return { success: false, message: "네트워크 오류가 발생했습니다." };
  }
};

// 토큰 만료 체크 및 자동 갱신
export const checkAndRefreshToken = async (): Promise<boolean> => {
  const expiresIn = localStorage.getItem('expiresIn');
  if (!expiresIn) return false;

  const currentTime = Date.now();
  const tokenExpiry = parseInt(expiresIn);
  
  // 토큰이 5분 이내에 만료되면 갱신
  if (currentTime + 5 * 60 * 1000 >= tokenExpiry) {
    const result = await refreshAccessToken();
    return result.success;
  }
  
  return true;
}; 