import { useLayoutEffect, useState } from "react";

import { ROUTES } from "@/routes/routeConfig";

import type { User } from "../services/auth/types";
import { STORAGE_KEYS } from "../utils/constants";
import {
  clearAuthCookies,
  getAccessToken,
  setAccessToken,
  setRefreshToken,
} from "../utils/cookieUtils";
import { removeSessionStorageItem } from "../utils/sessionStorageHelper";

export const useAuth = () => {
  const [user, setUserState] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useLayoutEffect(() => {
    const storedToken = getAccessToken();
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER_DATA);

    // Set token state if we have a stored token
    if (storedToken) {
      setTokenState(storedToken);
      setIsAuthenticated(true);
    }

    // Set user state if we have stored user data
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserState(parsedUser);
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      }
    }

    // Mark loading as complete after initialization
    setIsLoading(false);
  }, []);

  const getToken = (): string | null => {
    return getAccessToken();
  };

  const getUser = (): User | null => {
    const user = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    return user ? JSON.parse(user) : null;
  };

  const setToken = (token: string): void => {
    setAccessToken(token);
    setTokenState(token);
    setIsAuthenticated(true);
  };

  const setRefreshTokenValue = (refreshToken: string): void => {
    setRefreshToken(refreshToken);
  };
  interface UserData extends User {
    isTwoFactorAuthenticated?: boolean;
  }
  const setUser = (user: UserData): void => {
    // Clear permissions from sessionStorage so the new user's permissions are loaded
    // (prevents same-browser login from showing the previous user's permission setup)
    removeSessionStorageItem("user_permissions");

    // Store non-sensitive user data in localStorage (persists across tabs until browser closes)
    const userDataForStorage = {
      user: user.user,
      signupCompleted: user.signupCompleted,
      hasSavedRecoveryCode: user.hasSavedRecoveryCode,
      hasSetQrCode: user.hasSetQrCode,
      qrCode: user.qrCode,
      recoveryCode: user.recoveryCode,
      isTwoFactorAuthenticated: user?.isTwoFactorAuthenticated ?? false,
      accessToken: user.accessToken,
      refreshToken: user.refreshToken,
      // Store permissions for PermissionProvider to pick up
      permissionDetails: user.permissionDetails,
      permissions: user.permissions,
    };

    localStorage.setItem(
      STORAGE_KEYS.USER_DATA,
      JSON.stringify(userDataForStorage)
    );
    setUserState(user);

    // Notify PermissionProvider that user data has changed
    // This allows PermissionProvider to initialize permissions from the new user data
    window.dispatchEvent(new Event("userDataChanged"));
  };

  const clearAuthData = (): void => {
    clearAuthCookies();
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    localStorage.removeItem("user_profile_data"); // Clear user profile cache
    // Clear permissions from sessionStorage to prevent permission leakage between users
    removeSessionStorageItem("user_permissions");
    setTokenState(null);
    setUserState(null);
    setIsAuthenticated(false);

    // Notify PermissionProvider that user data has been cleared
    window.dispatchEvent(new Event("userDataChanged"));
  };

  const logout = async (): Promise<void> => {
    try {
      // Clear storage/cookies synchronously without updating React state
      // This prevents white screen from state updates before navigation
      clearAuthCookies();
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      localStorage.removeItem("user_profile_data");
      removeSessionStorageItem("user_permissions");

      // Navigate immediately using replace to avoid history entry
      window.location.replace(ROUTES.AUTH.LOGIN);
    } catch (error) {
      console.error("Logout error:", error);
      // On error, still clear and navigate
      clearAuthCookies();
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      localStorage.removeItem("user_profile_data");
      removeSessionStorageItem("user_permissions");
      window.location.replace(ROUTES.AUTH.LOGIN);
    }
  };

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    getToken,
    getUser,
    setToken,
    setRefreshTokenValue,
    setUser,
    clearAuthData,
    logout,
  };
};
