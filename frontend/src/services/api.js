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
  (response) => {
    const remaining = response.headers['ratelimit-remaining'] || response.headers['x-ratelimit-remaining'];
    if (remaining !== undefined) {
      const remainingNum = Number(remaining);
      if (remainingNum === 0) {
        const retryAfter = response.headers['retry-after'] || response.headers['ratelimit-reset'] || 120;
        api.defaults.retryAfter = Number(retryAfter);
        api.defaults.retryAt = Date.now() + Number(retryAfter) * 1000;
      } else {
        delete api.defaults.retryAt;
        delete api.defaults.retryAfter;
      }
    }
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      setToken(null);
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
      return Promise.resolve();
    }
    if (error.response && error.response.status === 429) {
      const retryAfter = error.response.data?.retryAfter || error.response.headers?.['retry-after'] || error.response.headers?.['ratelimit-reset'] || 120;
      api.defaults.retryAfter = Number(retryAfter);
      api.defaults.retryAt = Date.now() + Number(retryAfter) * 1000;
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
