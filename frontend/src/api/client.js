import axios from 'axios';

// Get API base URL from Vite environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL;

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Ensure cookies are sent along with requests if session auth is implemented later
  withCredentials: true,
});

// Request Interceptor: Attach JWT token automatically from localStorage if present
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Globally handle authentication errors (e.g. 401 token expired)
client.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid: clear local storage and notify the app.
      localStorage.removeItem('token');
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }
    return Promise.reject(error.response?.data || error.message || error);
  }
);

// Auth endpoints helper
export const authApi = {
  // Check if backend is alive
  checkHealth: () => client.get('/'),

  // Google OAuth URL
  getGoogleLoginUrl: () => `${API_BASE_URL}/api/auth/google`,

  // Get the currently authenticated MongoDB user
  getCurrentUser: () => client.get('/api/auth/me'),
};

// Medicine endpoints helper (MongoDB-backed, user-scoped)
export const medicineApi = {
  search: (query, limit = 10) =>
    client.get('/api/medicines/search', {
      params: {
        q: query,
        limit,
      },
    }),

  getDrugDetails: (sctId) =>
    client.get(`/api/medicines/drug/${sctId}`),

  list: () => client.get('/api/medicines'),

  getOne: (id) => client.get(`/api/medicines/${id}`),

  create: (payload) => client.post('/api/medicines', payload),

  update: (id, payload) => client.put(`/api/medicines/${id}`, payload),

  remove: (id) => client.delete(`/api/medicines/${id}`),

  getToday: () => client.get('/api/medicines/today'),

  logDose: (scheduleId, status) =>
    client.post(`/api/medicines/today/${scheduleId}/log`, { status }),
};

// Dose adherence endpoints helper (planned / partial)
export const doseApi = {
  getTodayDoses: () => client.get('/api/medicines/today'),
  markTaken: (id) => client.post(`/api/medicines/today/${id}/log`, { status: 'TAKEN' }),
  markMissed: (id) => client.post(`/api/medicines/today/${id}/log`, { status: 'MISSED' }),
  getAdherenceSummary: () => client.get('/api/adherence/summary'),
};

export default client;
