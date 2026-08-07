import axios from 'axios';
import { useAuthStore } from '../store/authStore';

export const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Her isteğe access token'ı ekle
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 401 alınca refresh token ile yeni access token dene
let isRefreshing = false;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const { refreshToken, setAuth, logout, user } = useAuthStore.getState();

    if (
      error.response?.status === 401 &&
      !original._retry &&
      refreshToken &&
      user
    ) {
      original._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const { data } = await axios.post('/api/auth/refresh', {
            refreshToken,
          });
          setAuth({
            user,
            accessToken: data.data.accessToken,
            refreshToken: data.data.refreshToken,
          });
          isRefreshing = false;
          original.headers.Authorization = `Bearer ${data.data.accessToken}`;
          return api(original);
        } catch {
          isRefreshing = false;
          logout();
        }
      }
    }

    return Promise.reject(error);
  }
);
