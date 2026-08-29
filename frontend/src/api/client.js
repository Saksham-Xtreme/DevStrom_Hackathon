import axios from 'axios';

// Get API base URL from Vite environment variables (fallback to localhost:8080 or proxy paths)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

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
      // Token expired or invalid: Clear local storage and redirect to login if appropriate
      localStorage.removeItem('token');
      // Option: window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error.message || error);
  }
);

// Auth endpoints helper
export const authApi = {
  // Check if backend is alive
  checkHealth: () => client.get('/'),

  // Get Google OAuth Redirection URL
  getGoogleLoginUrl: () => `${API_BASE_URL}/api/auth/google`,

  // Standard Login (Planned)
  login: (email, password) => client.post('/api/auth/login', { email, password }),

  // Send OTP (Planned)
  sendOtp: (email) => client.post('/api/auth/send-otp', { email }),

  // Verify OTP (Planned)
  verifyOtp: (email, otp) => client.post('/api/auth/verify-otp', { email, otp }),
};

// Prescription endpoints helper (Planned)
export const prescriptionApi = {
  upload: (formData) => {
    return client.post('/api/prescriptions/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getStatus: (id) => client.get(`/api/prescriptions/${id}/status`),
  confirm: (id, data) => client.post(`/api/prescriptions/${id}/confirm`, data),
};

// Dose adherence endpoints helper (Planned)
export const doseApi = {
  getTodayDoses: () => client.get('/api/doses/today'),
  markTaken: (id) => client.post(`/api/doses/${id}/taken`),
  markMissed: (id, reason) => client.post(`/api/doses/${id}/missed`, { reason }),
  getAdherenceSummary: () => client.get('/api/adherence/summary'),
};

export default client;
