import axios from 'axios';

// Fast API or staging backend URL
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.ongo-jishik.com/v1';

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
    // If token exists, attach to Header (authorization)
    // const token = await storage.getItem('auth_token');
    // if (token && config.headers) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for refresh token or common error handlers
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response ? error.response.status : null;
    if (status === 401) {
      console.warn('Unauthorized request - redirecting or clearing token');
    }
    return Promise.reject(error);
  }
);
