import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Important pour CORS avec credentials
});

// Intercepteur pour ajouter le token à chaque requête
api.interceptors.request.use(
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

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Services API
export const authService = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  register: (data: any) =>
    api.post('/auth/register', data),
  
  logout: () =>
    api.post('/auth/logout'),
  
  getProfile: () =>
    api.get('/auth/profile'),
  
  updateProfile: (data: any) =>
    api.put('/auth/profile', data),
};

export const companyService = {
  getAll: (params?: any) =>
    api.get('/companies', { params }),
  
  getById: (id: number) =>
    api.get(`/companies/${id}`),
  
  getByTrustCode: (trustCode: string) =>
    api.get(`/trustpass/${trustCode}`),
  
  create: (data: any) =>
    api.post('/companies', data),
  
  update: (id: number, data: any) =>
    api.put(`/companies/${id}`, data),
  
  delete: (id: number) =>
    api.delete(`/companies/${id}`),
  
  recalculateScore: (id: number) =>
    api.post(`/companies/${id}/recalculate-score`),
};

export const transactionService = {
  getAll: (params?: any) =>
    api.get('/transactions', { params }),
  
  getById: (id: number) =>
    api.get(`/transactions/${id}`),
  
  create: (data: any) =>
    api.post('/transactions', data),
  
  markAsPaid: (id: number) =>
    api.post(`/transactions/${id}/mark-paid`),
  
  markAsDelivered: (id: number, data?: any) =>
    api.post(`/transactions/${id}/mark-delivered`, data),
  
  generateReceipt: (id: number) =>
    api.get(`/transactions/${id}/receipt`),
};

export const verificationService = {
  getAll: (params?: any) =>
    api.get('/verification-requests', { params }),
  
  getById: (id: number) =>
    api.get(`/verification-requests/${id}`),
  
  create: (data: any) =>
    api.post('/verification-requests', data),
  
  approve: (id: number, notes?: string) =>
    api.post(`/verification-requests/${id}/approve`, { notes }),
  
  reject: (id: number, notes: string) =>
    api.post(`/verification-requests/${id}/reject`, { notes }),
};

export const disputeService = {
  getAll: (params?: any) =>
    api.get('/disputes', { params }),
  
  getById: (id: number) =>
    api.get(`/disputes/${id}`),
  
  create: (data: any) =>
    api.post('/disputes', data),
  
  resolve: (id: number, resolution: string) =>
    api.post(`/disputes/${id}/resolve`, { resolution }),
  
  escalate: (id: number) =>
    api.post(`/disputes/${id}/escalate`),
};

export const riskCheckService = {
  check: (companyId: number) =>
    api.post('/risk-checks', { company_id: companyId }),
  
  getCompanyChecks: (companyId: number) =>
    api.get(`/risk-checks/company/${companyId}`),
};

export const dashboardService = {
  getStats: () =>
    api.get('/dashboard/stats'),
  
  getRecentActivities: (limit?: number) =>
    api.get('/dashboard/recent-activities', { params: { limit } }),
  
  getPendingVerifications: () =>
    api.get('/dashboard/pending-verifications'),
  
  getAlerts: () =>
    api.get('/dashboard/alerts'),
};
