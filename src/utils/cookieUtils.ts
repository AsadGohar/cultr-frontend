import { COOKIE_CONFIG } from "./constants";

/**
 * Cookie utility functions for secure token storage
 */

export interface CookieOptions {
  maxAge?: number;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
  path?: string;
  domain?: string;
}

/**
 * Set a cookie with the given name, value, and options
 */
export const setCookie = (
  name: string,
  value: string,
  options: CookieOptions = {}
): void => {
  const {
    maxAge,
    secure = true,
    sameSite = "strict",
    path = "/",
    domain,
  } = options;

  // Safari doesn't set secure cookies on localhost, so disable secure for local development
  const isLocalhost =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1");
  const effectiveSecure = isLocalhost ? false : secure;
  const effectiveSameSite = isLocalhost ? "lax" : sameSite;

  let cookieString = `${name}=${encodeURIComponent(value)}`;

  if (maxAge) {
    cookieString += `; Max-Age=${maxAge}`;
  }

  if (effectiveSecure) {
    cookieString += "; Secure";
  }

  cookieString += `; SameSite=${effectiveSameSite}`;
  cookieString += `; Path=${path}`;

  if (domain) {
    cookieString += `; Domain=${domain}`;
  }

  document.cookie = cookieString;
};

/**
 * Get a cookie value by name
 */
export const getCookie = (name: string): string | null => {
  const cookies = document.cookie.split(";");
  const cookie = cookies.find(c => c.trim().startsWith(`${name}=`));

  if (!cookie) return null;

  return decodeURIComponent(cookie.split("=")[1]);
};

/**
 * Delete a cookie by setting its expiration to the past
 */
export const deleteCookie = (name: string, path = "/"): void => {
  document.cookie = `${name}=; Max-Age=0; Path=${path}; Secure; SameSite=strict`;
};

/**
 * Set access token in secure cookie
 */
export const setAccessToken = (token: string): void => {
  setCookie(COOKIE_CONFIG.ACCESS_TOKEN.name, token, {
    secure: COOKIE_CONFIG.ACCESS_TOKEN.secure,
    sameSite: COOKIE_CONFIG.ACCESS_TOKEN.sameSite,
  });
};

/**
 * Set refresh token in secure cookie
 */
export const setRefreshToken = (token: string): void => {
  setCookie(COOKIE_CONFIG.REFRESH_TOKEN.name, token, {
    secure: COOKIE_CONFIG.REFRESH_TOKEN.secure,
    sameSite: COOKIE_CONFIG.REFRESH_TOKEN.sameSite,
  });
};

/**
 * Get access token from cookie
 */
export const getAccessToken = (): string | null => {
  return getCookie(COOKIE_CONFIG.ACCESS_TOKEN.name);
};

/**
 * Get refresh token from cookie
 */
export const getRefreshToken = (): string | null => {
  return getCookie(COOKIE_CONFIG.REFRESH_TOKEN.name);
};

/**
 * Clear all auth cookies
 */
export const clearAuthCookies = (): void => {
  deleteCookie(COOKIE_CONFIG.ACCESS_TOKEN.name);
  deleteCookie(COOKIE_CONFIG.REFRESH_TOKEN.name);
};
