/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Sentry from "@sentry/react";
import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import axios from "axios";
import { z } from "zod";

import { useToast } from "@/common/Toast/ToastContext";
import { ROUTES, SEGMENTS } from "@/routes/routeConfig";
import { API_ENDPOINTS, STORAGE_KEYS } from "@/utils/constants";
import {
  clearAuthCookies,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
} from "@/utils/cookieUtils";
import { removeSessionStorageItem } from "@/utils/sessionStorageHelper";

export interface ApiRequestConfig extends AxiosRequestConfig {
  skipValidation?: boolean;
}

export const API_BASE_URL = import.meta.env.VITE_PUBLIC_BASEURL;

// Flag to prevent multiple refresh requests
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
  config: InternalAxiosRequestConfig;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      // Resolve to allow the queued request to proceed
      // The request will be retried with the new token from cookies
      resolve(token);
    }
  });

  failedQueue = [];
};

const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
    timeout: 60000, // 60 seconds timeout
  });

  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = getAccessToken();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      if (config.data instanceof FormData) {
        delete config.headers["Content-Type"];
      }

      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      if (error.response?.status === 401 && !originalRequest._retry) {
        const errorMessage = (error.response.data as any)?.message;

        // Handle token expiration errors - try to refresh
        if (
          errorMessage === "Unauthorized Access" ||
          errorMessage === "Access token expired" ||
          errorMessage === "Invalid token"
        ) {
          if (isRefreshing) {
            // If already refreshing, queue this request
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject, config: originalRequest });
            })
              .then(() => {
                // Retry the original request after token refresh
                // Remove _retry flag to allow retry
                delete originalRequest._retry;
                return instance(originalRequest);
              })
              .catch(err => {
                return Promise.reject(err);
              });
          }

          originalRequest._retry = true;
          isRefreshing = true;

          const refreshToken = getRefreshToken();

          if (!refreshToken) {
            // Check if we're on a public route - don't redirect for public routes
            const currentPath = window.location.pathname;
            const isPublicRoute = currentPath.startsWith(
              `/${SEGMENTS.PUBLIC}/`
            );

            if (isPublicRoute) {
              // For public routes, reject the error without redirecting
              processQueue(new Error("No refresh token available"), null);
              return Promise.reject(error);
            }

            // No refresh token available, logout user (only for protected routes)
            processQueue(new Error("No refresh token available"), null);
            clearAuthCookies();
            localStorage.removeItem(STORAGE_KEYS.USER_DATA);
            // Clear permissions from sessionStorage to prevent permission leakage between users
            removeSessionStorageItem("user_permissions");
            window.location.href = ROUTES.AUTH.LOGIN;
            return Promise.reject(error);
          }

          try {
            const response = await axios.post(
              `${API_BASE_URL}${API_ENDPOINTS.AUTH.REFRESH}`,
              { refreshToken }
            );

            const { accessToken } = response.data.data;

            if (accessToken) {
              setAccessToken(accessToken);

              // Process queued requests first so they can retry with the new token
              processQueue(null, accessToken);

              // Retry the original request - the interceptor will add the new token from cookies
              // Remove _retry flag to allow the request to proceed
              delete originalRequest._retry;
              return instance(originalRequest);
            } else {
              throw new Error("No access token received from refresh");
            }
          } catch (refreshError) {
            // Process queued requests with error
            processQueue(refreshError, null);

            // Check if we're on a public route - don't redirect for public routes
            const currentPath = window.location.pathname;
            const isPublicRoute = currentPath.startsWith(
              `/${SEGMENTS.PUBLIC}/`
            );

            if (!isPublicRoute) {
              // Refresh failed, logout user (only for protected routes)
              clearAuthCookies();
              localStorage.removeItem(STORAGE_KEYS.USER_DATA);
              // Clear permissions from sessionStorage to prevent permission leakage between users
              removeSessionStorageItem("user_permissions");
              window.location.href = ROUTES.AUTH.LOGIN;
            }
            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        }

        // Handle "Refresh token expired" or "Invalid refresh token" - logout user
        if (
          errorMessage === "Refresh token expired" ||
          errorMessage === "Invalid refresh token"
        ) {
          // Check if we're on a public route - don't redirect for public routes
          const currentPath = window.location.pathname;
          const isPublicRoute = currentPath.startsWith(`/${SEGMENTS.PUBLIC}/`);

          if (!isPublicRoute) {
            clearAuthCookies();
            localStorage.removeItem(STORAGE_KEYS.USER_DATA);
            // Clear permissions from sessionStorage to prevent permission leakage between users
            removeSessionStorageItem("user_permissions");
            window.location.href = ROUTES.AUTH.LOGIN;
          }
          return Promise.reject(error);
        }
      }

      console.error("API request failed:", error);
      // Handle specific error cases
      if (error.response) {
        console.error("Error response:", error.response.data);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error setting up request:", error.message);
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

const axiosInstance = createAxiosInstance();

const makeRequest = async <T>(
  instance: AxiosInstance,
  endpoint: string,
  config: AxiosRequestConfig = {}
): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await instance.request({
      url: endpoint,
      ...config,
    });

    return response.data;
  } catch (error) {
    console.error("API request failed:", error);
    Sentry.captureException(error, {
      tags: { layer: "api", type: "request" },
      extra: { endpoint, method: config?.method },
    });
    throw error;
  }
};

const createHttpMethod = (method: string) => {
  return <T>(
    endpoint: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const requestConfig: AxiosRequestConfig = {
      method,
      ...(method === "GET" && data !== undefined && { params: data }),
      ...(method !== "GET" && data !== undefined && { data }),
      ...config,
    };

    return makeRequest<T>(axiosInstance, endpoint, requestConfig);
  };
};

const createValidatedHttpMethod = (method: string) => {
  return <T>(
    endpoint: string,
    data?: unknown,
    config?: ApiRequestConfig,
    schema?: z.ZodSchema<T>
  ): Promise<T> => {
    const requestConfig: AxiosRequestConfig = {
      method,
      ...(method === "GET" && data !== undefined && { params: data }),
      ...(method !== "GET" && data !== undefined && { data }),
      ...config,
    };

    return makeRequest<T>(axiosInstance, endpoint, requestConfig).then(
      response => {
        // Optional validation - only validate if schema is provided and skipValidation is not true
        if (schema && !config?.skipValidation) {
          return validateResponse(response, schema);
        }
        return response;
      }
    );
  };
};

/**
 * Optional validation helper - can be used when you want to validate responses
 */
export const validateResponse = <T>(
  data: unknown,
  schema: z.ZodSchema<T>
): T => {
  try {
    return schema.parse(data);
  } catch (error) {
    console.error("Response validation failed:", error);
    Sentry.captureException(error, {
      tags: { layer: "api", type: "validation" },
      extra: { raw: data },
    });
    throw new Error("Invalid response format");
  }
};

// Enhanced methods (optional to use)
const getWithValidation = createValidatedHttpMethod("GET");
const postWithValidation = createValidatedHttpMethod("POST");
const putWithValidation = createValidatedHttpMethod("PUT");
const patchWithValidation = createValidatedHttpMethod("PATCH");
const deleteWithValidation = createValidatedHttpMethod("DELETE");

const get = createHttpMethod("GET");
const post = createHttpMethod("POST");
const put = createHttpMethod("PUT");
const patch = createHttpMethod("PATCH");
const del = createHttpMethod("DELETE");

const request = {
  get,
  post,
  put,
  patch,
  delete: del,
  // Optional validation methods
  getWithValidation,
  postWithValidation,
  putWithValidation,
  patchWithValidation,
  deleteWithValidation,
};

export const apiService = request;
export default apiService;

// Module-level error cache to prevent duplicate toasts for the same request
const errorToastCache = new Map<string, { count: number; timestamp: number }>();
const ERROR_CACHE_TIMEOUT = 20000; // 20 seconds cache timeout
const MAX_RETRIES = 1; // Show error toast after 1 failed attempt (no retries)

// Clean up old entries from the cache
const cleanupErrorCache = () => {
  const now = Date.now();
  for (const [key, value] of errorToastCache.entries()) {
    if (now - value.timestamp > ERROR_CACHE_TIMEOUT) {
      errorToastCache.delete(key);
    }
  }
};

/**
 * Extracts all error messages from various error response structures
 * Handles:
 * - Simple message: { message: "Error" }
 * - Validation errors: { message: "...", errors: { field: ["error1", "error2"] } }
 * - Array of errors: { errors: ["error1", "error2"] }
 * - Nested errors: { errors: { field: { nested: ["error"] } } }
 */
const extractAllErrorMessages = (errorData: unknown): string[] => {
  const messages: string[] = [];

  if (!errorData || typeof errorData !== "object") {
    return messages;
  }

  const data = errorData as {
    message?: string | string[];
    error?: string;
    errors?:
      | Record<string, string[] | string>
      | string[]
      | Record<string, unknown>;
  };

  // Extract errors first (more detailed), then add main message if it's different
  // This way we prioritize detailed field errors over generic messages

  // Extract errors object/array first
  const errorMessages: string[] = [];
  if (data.errors) {
    if (Array.isArray(data.errors)) {
      data.errors.forEach(err => {
        if (typeof err === "string" && !errorMessages.includes(err)) {
          errorMessages.push(err);
        }
      });
    } else if (typeof data.errors === "object") {
      const extractFromObject = (
        obj: Record<string, unknown>,
        prefix = ""
      ): void => {
        Object.entries(obj).forEach(([key, value]) => {
          const fieldPath = prefix ? `${prefix}.${key}` : key;

          if (Array.isArray(value)) {
            value.forEach(msg => {
              if (typeof msg === "string") {
                const fullMessage = fieldPath ? `${fieldPath}: ${msg}` : msg;
                if (!errorMessages.includes(fullMessage)) {
                  errorMessages.push(fullMessage);
                }
              }
            });
          } else if (typeof value === "string") {
            const fullMessage = fieldPath ? `${fieldPath}: ${value}` : value;
            if (!errorMessages.includes(fullMessage)) {
              errorMessages.push(fullMessage);
            }
          } else if (value && typeof value === "object") {
            extractFromObject(value as Record<string, unknown>, fieldPath);
          }
        });
      };
      extractFromObject(data.errors as Record<string, unknown>);
    }
  }

  // Add detailed error messages
  messages.push(...errorMessages);

  // Extract main message (only if not already covered by detailed errors)
  if (data.message) {
    if (Array.isArray(data.message)) {
      data.message.forEach(msg => {
        if (typeof msg === "string" && !messages.includes(msg)) {
          // Check if any error message contains this message (to avoid duplicates)
          const isCovered = messages.some(
            existing => existing === msg || existing.includes(msg)
          );
          if (!isCovered) {
            messages.push(msg);
          }
        }
      });
    } else if (typeof data.message === "string") {
      const mainMessage = data.message;
      // Check if message is already covered by detailed errors
      const isCovered = messages.some(
        existing => existing === mainMessage || existing.includes(mainMessage)
      );
      if (!isCovered) {
        messages.push(mainMessage);
      }
    }
  }

  // Extract error field (alternative to message)
  if (data.error && typeof data.error === "string") {
    const errorMessage = data.error;
    const isCovered = messages.some(
      existing => existing === errorMessage || existing.includes(errorMessage)
    );
    if (!isCovered) {
      messages.push(errorMessage);
    }
  }

  // If no messages found, return default
  if (messages.length === 0) {
    messages.push("Something went wrong");
  }

  return messages;
};

export function useApi() {
  const { addToast } = useToast();

  const handleApi = async <T>(
    fn: () => Promise<T>,
    successMsg?: string,
    cacheKey?: string
  ): Promise<T> => {
    // Create a unique key based on the function and endpoint
    const requestKey = cacheKey || fn.toString();

    try {
      const result = await fn();
      if (successMsg) {
        addToast({ type: "success", message: successMsg });
      }
      // Clear error cache on success
      errorToastCache.delete(requestKey);
      return result;
    } catch (error: unknown) {
      // Report every useApi error to Sentry (covers all useApi.get/post/put/patch/delete and *WithValidation)
      Sentry.captureException(error, {
        tags: { layer: "api", source: "useApi" },
        extra: { requestKey },
      });

      let errorMessages: string[] = ["Something went wrong"];

      // Extract error messages from axios error response
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: {
            status?: number;
            data?: unknown;
          };
        };

        if (axiosError.response?.data) {
          // Extract all error messages from the response
          errorMessages = extractAllErrorMessages(axiosError.response.data);
        } else if (error instanceof Error) {
          errorMessages = [error.message];
        }
      } else if (error instanceof Error) {
        errorMessages = [error.message];
      }

      // Clean up old cache entries
      cleanupErrorCache();

      // Track error attempts to prevent duplicate toasts for the same request
      const now = Date.now();
      const cachedError = errorToastCache.get(requestKey);

      if (!cachedError || now - cachedError.timestamp > ERROR_CACHE_TIMEOUT) {
        // First attempt or cache expired, start counting
        errorToastCache.set(requestKey, { count: 1, timestamp: now });
        console.log(
          `[API Error Cache] ${requestKey}: Starting error count (1/${MAX_RETRIES})`
        );
      } else {
        // Increment error count
        cachedError.count++;
        errorToastCache.set(requestKey, cachedError);
        console.log(
          `[API Error Cache] ${requestKey}: Incremented error count (${cachedError.count}/${MAX_RETRIES})`
        );
      }

      // Show error toast after reaching max attempts (immediately since MAX_RETRIES = 1)
      const currentError = errorToastCache.get(requestKey);
      if (currentError && currentError.count >= MAX_RETRIES) {
        console.log(
          `[API Error Cache] ${requestKey}: Showing final error toasts (${errorMessages.length} message(s))`
        );

        // Show a toast for each error message
        // React's functional state updates ensure all toasts are added correctly
        // even when called in quick succession. The ToastContainer will render
        // all toasts stacked vertically with proper spacing.
        errorMessages.forEach(message => {
          // Skip certain expected error messages that don't need user notification
          const suppressedMessages = [
            "No presentations found for this project",
          ];
          const suppressedPatterns = [/^BOQ for project .+ not found$/];
          if (
            !suppressedMessages.includes(message) &&
            !suppressedPatterns.some(p => p.test(message))
          ) {
            addToast({ type: "error", message });
          }
        });

        // Clear the cache after showing the final errors
        errorToastCache.delete(requestKey);
      }

      throw error;
    }
  };

  // Wrap each method
  return {
    get: <T = unknown>(
      endpoint: string,
      data?: unknown,
      config?: AxiosRequestConfig,
      successMsg?: string
    ) => {
      return handleApi<T>(
        () => apiService.get(endpoint, data, config),
        successMsg,
        `GET:${endpoint}`
      );
    },
    post: <T = unknown>(
      endpoint: string,
      data?: unknown,
      config?: AxiosRequestConfig,
      successMsg?: string
    ) =>
      handleApi<T>(
        () => apiService.post(endpoint, data, config),
        successMsg,
        `POST:${endpoint}`
      ),
    put: <T = unknown>(
      endpoint: string,
      data?: unknown,
      config?: AxiosRequestConfig,
      successMsg?: string
    ) =>
      handleApi<T>(
        () => apiService.put(endpoint, data, config),
        successMsg,
        `PUT:${endpoint}`
      ),
    patch: <T = unknown>(
      endpoint: string,
      data?: unknown,
      config?: AxiosRequestConfig,
      successMsg?: string
    ) =>
      handleApi<T>(
        () => apiService.patch(endpoint, data, config),
        successMsg,
        `PATCH:${endpoint}`
      ),
    delete: <T = unknown>(
      endpoint: string,
      config?: AxiosRequestConfig,
      successMsg?: string
    ) =>
      handleApi<T>(
        () => apiService.delete(endpoint, config),
        successMsg,
        `DELETE:${endpoint}`
      ),
    // Optionally add validated methods
    getWithValidation: <T = unknown>(
      endpoint: string,
      data?: unknown,
      config?: ApiRequestConfig,
      schema?: z.ZodSchema<T>,
      successMsg?: string
    ) =>
      handleApi<T>(
        () => apiService.getWithValidation(endpoint, data, config, schema),
        successMsg,
        `GET:${endpoint}`
      ),
    postWithValidation: <T = unknown>(
      endpoint: string,
      data?: unknown,
      config?: ApiRequestConfig,
      schema?: z.ZodSchema<T>,
      successMsg?: string
    ) =>
      handleApi<T>(
        () => apiService.postWithValidation(endpoint, data, config, schema),
        successMsg,
        `POST:${endpoint}`
      ),
    putWithValidation: <T = unknown>(
      endpoint: string,
      data?: unknown,
      config?: ApiRequestConfig,
      schema?: z.ZodSchema<T>,
      successMsg?: string
    ) =>
      handleApi<T>(
        () => apiService.putWithValidation(endpoint, data, config, schema),
        successMsg,
        `PUT:${endpoint}`
      ),
    patchWithValidation: <T = unknown>(
      endpoint: string,
      data?: unknown,
      config?: ApiRequestConfig,
      schema?: z.ZodSchema<T>,
      successMsg?: string
    ) =>
      handleApi<T>(
        () => apiService.patchWithValidation(endpoint, data, config, schema),
        successMsg,
        `PATCH:${endpoint}`
      ),
    deleteWithValidation: <T = unknown>(
      endpoint: string,
      data?: unknown,
      config?: ApiRequestConfig,
      schema?: z.ZodSchema<T>,
      successMsg?: string
    ) =>
      handleApi<T>(
        () => apiService.deleteWithValidation(endpoint, data, config, schema),
        successMsg,
        `DELETE:${endpoint}`
      ),
  };
}
