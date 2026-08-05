import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { useAuth } from "@/hooks/useAuth";
import { queryKeys } from "@/lib/query-keys";
import { ROUTES } from "@/routes/routeConfig";
import { API_ENDPOINTS } from "@/utils/constants";

import { useApi } from "../api";
import type {
  AuthResponse,
  CheckOnboardingStatusData,
  ForgotPasswordData,
  LoginCredentials,
  OnboardingStatusResponse,
  QRData,
  RegisterData,
  RelinkAuthenticatorApiResponse,
  ResetPasswordData,
  TwoFactorData,
  VerifyRelinkAuthenticatorApiResponse,
  VerifyRelinkAuthenticatorData,
} from "./types";

export const useLogin = () => {
  const { t: tAuth } = useTranslation("auth");
  const queryClient = useQueryClient();
  const api = useApi();
  const { setUser, setToken, setRefreshTokenValue } = useAuth();

  return useMutation<AuthResponse, unknown, LoginCredentials>({
    mutationFn: (credentials: LoginCredentials) =>
      api.post<AuthResponse>(
        `${API_ENDPOINTS.AUTH.LOGIN}`,
        credentials,
        undefined,
        tAuth("auth.messages.loginSuccess", "Login successful!")
      ),
    onSuccess: data => {
      if (data?.data?.accessToken) setToken(data?.data?.accessToken);
      if (data?.data?.refreshToken)
        setRefreshTokenValue(data?.data?.refreshToken);
      setUser(data?.data);
      queryClient.setQueryData(queryKeys.auth.profile(), data?.data?.user);
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
};

export const useRegister = () => {
  const { t: tAuth } = useTranslation("auth");
  const queryClient = useQueryClient();
  const api = useApi();
  const { setUser, setToken, setRefreshTokenValue } = useAuth();

  return useMutation<AuthResponse, unknown, RegisterData>({
    mutationFn: (data: RegisterData) =>
      api.post<AuthResponse>(
        `${API_ENDPOINTS.AUTH.REGISTER}`,
        data,
        undefined,
        tAuth("auth.messages.registrationSuccess", "Registration successful!")
      ),
    onSuccess: data => {
      if (data?.data?.accessToken) setToken(data?.data?.accessToken);
      if (data?.data?.refreshToken)
        setRefreshTokenValue(data?.data?.refreshToken);
      setUser(data?.data);
      queryClient.setQueryData(queryKeys.auth.profile(), data?.data?.user);
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
};

export const useVerifyQR = () => {
  const { t: tAuth } = useTranslation("auth");
  const queryClient = useQueryClient();
  const api = useApi();
  const { setUser, user, setToken, setRefreshTokenValue } = useAuth();

  return useMutation<AuthResponse, unknown, QRData>({
    mutationFn: (data: QRData) =>
      api.post<AuthResponse>(
        `${API_ENDPOINTS.AUTH.VERIFY_QR}`,
        data,
        undefined,
        tAuth("auth.messages.registrationSuccess", "Registration successful!")
      ),
    onSuccess: data => {
      if (data?.data?.accessToken) setToken(data?.data?.accessToken);
      if (data?.data?.refreshToken)
        setRefreshTokenValue(data?.data?.refreshToken);
      if (user) {
        const updatedUser = {
          ...user,
          hasSavedRecoveryCode: data?.data?.hasSavedRecoveryCode,
          hasSetQrCode: data?.data?.hasSetQrCode,
        };
        setUser(updatedUser);
      }
      queryClient.setQueryData(queryKeys.auth.profile(), data?.data?.user);
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
};

export const useConfirmRecoveryCode = () => {
  const { t: tAuth } = useTranslation("auth");
  const queryClient = useQueryClient();
  const api = useApi();
  const { setUser, user, setToken, setRefreshTokenValue } = useAuth();

  return useMutation<AuthResponse, unknown>({
    mutationFn: () =>
      api.post<AuthResponse>(
        `${API_ENDPOINTS.AUTH.CONFIRM_RECOVERY_CODE}`,
        {},
        undefined,
        tAuth("auth.messages.recoveryCodeConfirmed", "Recovery code confirmed!")
      ),
    onSuccess: data => {
      if (data?.data?.accessToken) setToken(data?.data?.accessToken);
      if (data?.data?.refreshToken)
        setRefreshTokenValue(data?.data?.refreshToken);
      if (user) {
        const updatedUser = {
          ...user,
          hasSavedRecoveryCode: data?.data?.hasSavedRecoveryCode,
          hasSetQrCode: data?.data?.hasSetQrCode,
          signupCompleted: data?.data?.signupCompleted,
          isTwoFactorAuthenticated: true,
        };
        setUser(updatedUser);
      }
      queryClient.setQueryData(queryKeys.auth.profile(), data?.data?.user);
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
};

export const useVerify2FA = () => {
  const queryClient = useQueryClient();
  const api = useApi();
  const { setUser, user, setToken, setRefreshTokenValue } = useAuth();

  return useMutation<AuthResponse, unknown, TwoFactorData>({
    mutationFn: (data: TwoFactorData) =>
      api.post<AuthResponse>(
        `${API_ENDPOINTS.AUTH.VERIFY_2FA}`,
        data,
        undefined,
        "2FA verified!"
      ),
    onSuccess: data => {
      // Always set access token if present
      if (data?.data?.accessToken) {
        setToken(data?.data?.accessToken);
      }

      // Always set refresh token if present - this is critical for token refresh functionality
      // Check for both string type and non-empty value to ensure we set it properly
      const refreshToken = data?.data?.refreshToken;
      if (
        refreshToken &&
        typeof refreshToken === "string" &&
        refreshToken.trim().length > 0
      ) {
        setRefreshTokenValue(refreshToken);
      } else {
        console.error(
          "Refresh token not found or invalid in 2FA verification response",
          { refreshToken, fullResponse: data }
        );
      }

      if (user) {
        const updatedUser = {
          ...user,
          hasSavedRecoveryCode: data?.data?.hasSavedRecoveryCode,
          recoveryCode: data?.data?.newRecoveryCode,
          isTwoFactorAuthenticated: true,
        };
        setUser(updatedUser);
      }
      queryClient.setQueryData(queryKeys.auth.profile(), data?.data?.user);
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
};

export const useForgotPassword = () => {
  const { t: tAuth } = useTranslation("auth");
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation<AuthResponse, unknown, ForgotPasswordData>({
    mutationFn: (data: ForgotPasswordData) =>
      api.post<AuthResponse>(
        `${API_ENDPOINTS.AUTH.FORGOT_PASS}`,
        data,
        undefined,
        tAuth("auth.messages.forgotPasswordLinkSent", "Link sent")
      ),
    onSuccess: data => {
      localStorage.setItem(
        "reset_token",
        "U2FsdGVkX1+kGsvmCsgxmqCZx+rUvZlouBDuOfAAfFq6Vi2PXMuJqWKxYssQqzSbC1kyUirjyF6eedoAejrffy9Cl3ee84g0Wm/fCchGmkBEaMtkFE0GNk4r0+y/Ye2gJayZvNQnVlAU06vVZsTyyUPr1MjG+nRkW3Ok6MeSuarfQr7Xs2oN4TtdQQ3uADEaVulVCGPNaW4CUpo41qOZbAtNqcqhdE31zlMoa4o/lQZmu7fDRFZm/yreMwuuGy3JPzcz9P7l0il0J+XAn1VmJbdbPeWdtWShipWcq6Sp8tH+bwoYfgAb2rXb7QWKX2cOoQ62utxg6A8ZbSYEdK2ogl3N2/XidiEO6sXAxcc+P2Jb93ArNRqYDhNsJnI5qRme"
      );
      queryClient.setQueryData(queryKeys.auth.profile(), data?.data?.user);
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
};

export const useResetPasswordMutation = () => {
  const { t: tAuth } = useTranslation("auth");
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation<AuthResponse, unknown, ResetPasswordData>({
    mutationFn: (data: ResetPasswordData) =>
      api.post<AuthResponse>(
        `${API_ENDPOINTS.AUTH.RESET_PASS}`,
        data,
        undefined,
        tAuth(
          "auth.messages.passwordResetSuccess",
          "Password reset successful!"
        )
      ),
    onSuccess: data => {
      queryClient.setQueryData(queryKeys.auth.profile(), data?.data?.user);
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
};

export const useLogout = () => {
  const { t: tAuth } = useTranslation("auth");
  const queryClient = useQueryClient();
  const api = useApi();
  const { clearAuthData } = useAuth();

  return useMutation({
    mutationFn: () =>
      api.post(
        API_ENDPOINTS.AUTH.LOGOUT,
        undefined,
        undefined,
        tAuth("auth.messages.logoutSuccess", "Logged out successfully!")
      ),
    onSuccess: () => {
      // Clear all auth data (cookies and localStorage)
      clearAuthData();
      // Clear all cached data
      queryClient.clear();

      window.location.href = ROUTES.AUTH.LOGIN;
    },
  });
};

export const useResetPassword = () => {
  const { t: tAuth } = useTranslation("auth");
  const api = useApi();
  return useMutation({
    mutationFn: ({ token, password }: ResetPasswordData) =>
      api.post(
        API_ENDPOINTS.AUTH.RESET_PASS,
        { token, password },
        undefined,
        tAuth(
          "auth.messages.passwordResetSuccess",
          "Password reset successful!"
        )
      ),
  });
};

export const useGoogleAuth = () => {
  const { t: tAuth } = useTranslation("auth");
  const queryClient = useQueryClient();
  const api = useApi();
  const { setUser, setToken, setRefreshTokenValue } = useAuth();

  return useMutation<AuthResponse, unknown, string>({
    mutationFn: (token: string) =>
      api.post<AuthResponse>(
        `${API_ENDPOINTS.AUTH.GOOGLE}`,
        { accessToken: token },
        undefined,
        tAuth("auth.messages.googleLoginSuccess", "Google login successful!")
      ),
    onSuccess: data => {
      if (data?.data?.accessToken) setToken(data?.data?.accessToken);
      if (data?.data?.refreshToken)
        setRefreshTokenValue(data?.data?.refreshToken);
      setUser(data?.data);
      queryClient.setQueryData(queryKeys.auth.profile(), data?.data?.user);
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
};

export const useMicrosoftAuth = () => {
  const { t: tAuth } = useTranslation("auth");
  const queryClient = useQueryClient();
  const api = useApi();
  const { setUser, setToken, setRefreshTokenValue } = useAuth();

  return useMutation<AuthResponse, unknown, string>({
    mutationFn: (token: string) =>
      api.post<AuthResponse>(
        `${API_ENDPOINTS.AUTH.MICROSOFT}`,
        { accessToken: token },
        undefined,
        tAuth(
          "auth.messages.microsoftLoginSuccess",
          "Microsoft login successful!"
        )
      ),
    onSuccess: data => {
      if (data?.data?.accessToken) setToken(data?.data?.accessToken);
      if (data?.data?.refreshToken)
        setRefreshTokenValue(data?.data?.refreshToken);
      setUser(data?.data);
      queryClient.setQueryData(queryKeys.auth.profile(), data?.data?.user);
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
};

export const useRelinkAuthenticator = () => {
  const { t: tSettings } = useTranslation("settings");
  const api = useApi();

  return useMutation<RelinkAuthenticatorApiResponse, unknown>({
    mutationFn: () =>
      api.get<RelinkAuthenticatorApiResponse>(
        `${API_ENDPOINTS.AUTH.RELINK_AUTHENTICATOR}`,
        undefined,
        undefined,
        tSettings(
          "settings.relinkAuthenticator.qrGenerated",
          "QR code generated successfully"
        )
      ),
  });
};

export const useVerifyRelinkAuthenticator = () => {
  const { t: tSettings } = useTranslation("settings");
  const queryClient = useQueryClient();
  const api = useApi();
  const { setUser, user } = useAuth();

  return useMutation<
    VerifyRelinkAuthenticatorApiResponse,
    unknown,
    VerifyRelinkAuthenticatorData
  >({
    mutationFn: (data: VerifyRelinkAuthenticatorData) =>
      api.post<VerifyRelinkAuthenticatorApiResponse>(
        `${API_ENDPOINTS.AUTH.VERIFY_RELINK_AUTHENTICATOR}`,
        data,
        undefined,
        tSettings(
          "settings.relinkAuthenticator.success",
          "Authenticator relinked successfully"
        )
      ),
    onSuccess: data => {
      if (user) {
        const updatedUser = {
          ...user,
          hasSetQrCode: data?.data?.hasSetQrCode,
          hasSavedRecoveryCode: data?.data?.hasSavedRecoveryCode,
        };
        setUser(updatedUser);
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.profile() });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
};

export const useCheckOnboardingStatus = () => {
  const api = useApi();

  return useMutation<
    OnboardingStatusResponse,
    unknown,
    CheckOnboardingStatusData
  >({
    mutationFn: (data: CheckOnboardingStatusData) =>
      api.post<OnboardingStatusResponse>(
        API_ENDPOINTS.AUTH.CHECK_ONBOARDING_STATUS,
        data
      ),
  });
};
