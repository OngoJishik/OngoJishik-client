import axios, { AxiosError } from 'axios';
import { storage } from '@ongo/utils';
import type { TApiResponse } from './types/common';

declare const __DEV__: boolean;

// Fallback is a local endpoint to avoid exposing the real backend URL in the codebase.
const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8080/v1';

if (__DEV__ && !process.env.EXPO_PUBLIC_API_BASE_URL) {
  console.warn(
    '[apiClient] EXPO_PUBLIC_API_BASE_URL is not set. Falling back to local address (http://localhost:8080/v1).'
  );
}

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for inserting tokens
apiClient.interceptors.request.use(
  async (config) => {
    // Try to load a real token from AsyncStorage first, falling back to temporary token from env
    const token = (await storage.getItem<string>('ongo_auth_token')) || process.env.EXPO_PUBLIC_API_TEMP_TOKEN;
    if (token && config.headers) {

      config.headers.Authorization = `Bearer ${token}`;
    }
    if (__DEV__) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
      console.log('[API Request Headers]', JSON.stringify(config.headers));
    }
    return config;
  },
  (error) => {
    if (__DEV__) {
      console.error('[API Request Error]', error);
    }
    return Promise.reject(error);
  }
);

// Response interceptor for refresh token or common error handlers
apiClient.interceptors.response.use(
  (response) => {
    if (__DEV__) {
      console.log(`[API Response Success] ${response.status} ${response.config.url}`);
    }
    // Unwrap the backend's standard { success, code, message, data } response
    if (response.data && typeof response.data === 'object' && 'success' in response.data) {
      return response;
    }
    return response;
  },
  (error) => {
    if (__DEV__) {
      console.error('[API Response Error]', error.response?.status, error.message);
    }
    const status = error.response ? error.response.status : null;
    if (status === 401) {
      if (__DEV__) {
        console.warn('Unauthorized request - redirecting or clearing token');
      }
    }
    return Promise.reject(error);
  }
);

// Modify response data to be the unwrapped 'data'
apiClient.interceptors.response.use(
  (response) => {
    if (response.data && typeof response.data === 'object' && 'success' in response.data) {
      response.data = response.data.data;
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Axios 에러 타입가드 헬퍼 함수
 * @author Antigravity
 */
export const isApiError = (error: unknown): error is AxiosError<TApiResponse<unknown>> => {
  return axios.isAxiosError(error);
};

