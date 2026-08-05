// Auth Request Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
}

export interface QRData {
  code: string;
}

export interface TwoFactorData {
  code: string;
  type: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
  onboardingComplete?: boolean;
}

export interface CheckOnboardingStatusData {
  resetToken: string;
}

export interface OnboardingStatusResponse {
  statusCode: number;
  message: string;
  data: {
    isOnboardingCompleted: boolean;
    email: string;
    userId: string;
  };
}

export interface GoogleAuthData {
  accessToken: string;
}

export interface MicrosoftAuthData {
  accessToken: string;
}

export interface RelinkAuthenticatorResponse {
  qrCode: string;
  pendingTwoFactorSecret: string;
}

export interface VerifyRelinkAuthenticatorData {
  code: string;
  pendingTwoFactorSecret: string;
}

export interface RelinkAuthenticatorApiResponse {
  data: RelinkAuthenticatorResponse;
  message: string;
  statusCode: number;
}

export interface VerifyRelinkAuthenticatorApiResponse {
  data: {
    hasSetQrCode: boolean;
    hasSavedRecoveryCode: boolean;
  };
  message: string;
  statusCode: number;
}

// Auth Response Types
export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  accountType?: string;
  roles?: string[];
  /**
   * Permission codes with descriptions from 2FA response (PRIMARY SOURCE)
   * This is the preferred source as it includes full permission data with descriptions
   */
  permissionDetails?: Array<{ code: string; description: string }>;
  /**
   * Permission codes from login response (FALLBACK ONLY)
   * Used only as fallback when permissionDetails is not available
   */
  permissions?: string[];
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthUserData extends AuthUser, AuthTokens {
  signupCompleted?: boolean;
  hasSavedRecoveryCode?: boolean;
  hasSetQrCode?: boolean;
  qrCode?: string;
  recoveryCode?: string;
  newRecoveryCode?: string;
}

export interface AuthResponse {
  data: {
    user: AuthUser;
    accessToken: string;
    refreshToken: string;
    signupCompleted?: boolean;
    hasSavedRecoveryCode?: boolean;
    hasSetQrCode?: boolean;
    qrCode?: string;
    recoveryCode?: string;
    newRecoveryCode?: string;
  };
  message: string;
  statusCode: number;
}

// Legacy User type for backward compatibility
export interface User {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
  signupCompleted?: boolean;
  hasSavedRecoveryCode?: boolean;
  hasSetQrCode?: boolean;
  qrCode?: string;
  recoveryCode?: string;
  /**
   * Permission codes with descriptions from 2FA response (PRIMARY SOURCE)
   * This is the preferred source as it includes full permission data with descriptions
   */
  permissionDetails?: Array<{ code: string; description: string }>;
  /**
   * Permission codes from login response (FALLBACK ONLY)
   * Used only as fallback when permissionDetails is not available
   */
  permissions?: string[];
}

// API Response Types
export interface RequestApiResponse {
  statusCode: number;
  message: string;
  data?: never;
}
