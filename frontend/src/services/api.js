import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

const TOKEN_KEY = 'token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      setToken(null);
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
        // allow pages to handle auth state
      }
    }
    if (error.response && error.response.status === 429) {
      const retryAfter = error.response.data?.retryAfter || 120;
      error.config.retryAfter = retryAfter;
      error.config.retryAt = Date.now() + retryAfter * 1000;
    }
    return Promise.reject(error);
  }
);

export function getRetryStatus() {
  const retryAt = api.defaults.retryAt || null;
  if (!retryAt) return { blocked: false, secondsLeft: 0 };
  const secondsLeft = Math.max(0, Math.ceil((retryAt - Date.now()) / 1000));
  return { blocked: secondsLeft > 0, secondsLeft };
}

export function clearRetryStatus() {
  delete api.defaults.retryAt;
  delete api.defaults.retryAfter;
}

export default api;
