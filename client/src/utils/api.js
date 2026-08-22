import axios from 'axios';
import { API_BASE_URL } from './constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle expired/invalid tokens globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ---------- AUTH ----------
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
  logout: () => api.post('/auth/logout'),
};

// ---------- KPI ----------
export const kpiAPI = {
  getAll: (params) => api.get('/kpi', { params }),
  getMyKPIs: () => api.get('/kpi/my-kpis'),
  getById: (id) => api.get(`/kpi/${id}`),
  create: (data) => api.post('/kpi', data),
  update: (id, data) => api.put(`/kpi/${id}`, data),
  delete: (id) => api.delete(`/kpi/${id}`),
};

// ---------- PERFORMANCE ----------
export const performanceAPI = {
  submit: (formData) =>
    api.post('/performance/submit', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getMySubmissions: (params) => api.get('/performance/my-submissions', { params }),
  getPendingApprovals: () => api.get('/performance/pending-approvals'),
  review: (id, data) => api.put(`/performance/${id}/review`, data),
  getTeamPerformance: () => api.get('/performance/team'),
  getHistory: (employeeId = '') => api.get(`/performance/history/${employeeId}`),
};

// ---------- USER ----------
export const userAPI = {
  getAll: (params) => api.get('/user', { params }),
  getById: (id) => api.get(`/user/${id}`),
  getSupervisorsAndEmployees: () => api.get('/user/list/supervisors-employees'),
  update: (id, data) => api.put(`/user/${id}`, data),
  updateRole: (id, role) => api.put(`/user/${id}/role`, { role }),
  delete: (id) => api.delete(`/user/${id}`),
};

// ---------- DEPARTMENT ----------
export const departmentAPI = {
  getAll: () => api.get('/department'),
  getById: (id) => api.get(`/department/${id}`),
  create: (data) => api.post('/department', data),
  update: (id, data) => api.put(`/department/${id}`, data),
  delete: (id) => api.delete(`/department/${id}`),
};

// ---------- REPORTS ----------
export const reportsAPI = {
  getDashboardStats: () => api.get('/reports/dashboard-stats'),
  getDepartmentAnalytics: () => api.get('/reports/department-analytics'),
  exportPDF: (employeeId = '') =>
    api.get('/reports/export/pdf', { params: { employeeId }, responseType: 'blob' }),
  exportExcel: (employeeId = '') =>
    api.get('/reports/export/excel', { params: { employeeId }, responseType: 'blob' }),
};

export default api;