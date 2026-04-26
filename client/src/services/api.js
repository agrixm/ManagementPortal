import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true
});

let accessToken = null;
let tokenUpdateHandler = null;

export function setApiAccessToken(token) {
  accessToken = token || null;
}

export function setApiTokenUpdateHandler(handler) {
  tokenUpdateHandler = handler;
}

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

let refreshing = false;
let queue = [];

function resolveQueue(token) {
  queue.forEach(({ resolve }) => resolve(token));
  queue = [];
}

function rejectQueue(error) {
  queue.forEach(({ reject }) => reject(error));
  queue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    const requestUrl = original?.url || '';
    const isAuthRoute =
      requestUrl.includes('/auth/login') ||
      requestUrl.includes('/auth/register') ||
      requestUrl.includes('/auth/refresh') ||
      requestUrl.includes('/auth/logout');

    if (error.response?.status !== 401 || original?._retry || isAuthRoute) {
      throw error;
    }

    if (refreshing) {
      return new Promise((resolve, reject) => {
        queue.push({
          resolve: (token) => {
          original.headers.Authorization = `Bearer ${token}`;
          resolve(api(original));
          },
          reject
        });
      });
    }

    original._retry = true;
    refreshing = true;

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/refresh`,
        {},
        { withCredentials: true }
      );

      setApiAccessToken(data.accessToken);
      if (typeof tokenUpdateHandler === 'function') {
        tokenUpdateHandler(data.accessToken);
      }

      const persisted = JSON.parse(localStorage.getItem('blockx_auth') || '{}');
      localStorage.setItem(
        'blockx_auth',
        JSON.stringify({ ...persisted, accessToken: data.accessToken })
      );

      resolveQueue(data.accessToken);
      original.headers.Authorization = `Bearer ${data.accessToken}`;
      return api(original);
    } catch (refreshError) {
      setApiAccessToken(null);
      rejectQueue(refreshError);
      throw refreshError;
    } finally {
      refreshing = false;
    }
  }
);

export default api;
