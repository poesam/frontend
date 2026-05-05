import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const API_BASE = `${API_URL}/api`;

export interface DashboardStats {
  companies: {
    total: number;
    verified: number;
    pending: number;
    flagged: number;
  };
  transactions: {
    total: number;
    completed: number;
    pending: number;
    disputed: number;
    total_amount: number;
  };
  disputes: {
    total: number;
    open: number;
    resolved: number;
    escalated: number;
  };
  verifications: {
    pending: number;
    in_progress: number;
    approved: number;
    rejected: number;
  };
  risk_checks: {
    total: number;
    today: number;
    this_week: number;
  };
  users: {
    total: number;
    companies: number;
    verifiers: number;
    admins: number;
  };
  by_country: Array<{ country_code: string; total: number }>;
  by_business_type: Array<{ business_type: string; total: number }>;
  average_trust_score: number;
  trends: {
    new_companies: number;
    new_transactions: number;
    new_disputes: number;
  };
}

export interface Activity {
  type: string;
  title: string;
  description: string;
  timestamp: string;
  data: any;
}

export interface Alert {
  type: 'warning' | 'info' | 'danger';
  category: string;
  title: string;
  message: string;
  count: number;
  priority: 'high' | 'medium' | 'low';
}

const dashboardService = {
  // Obtenir les statistiques globales
  getStats: async (): Promise<DashboardStats> => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE}/dashboard/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  },

  // Obtenir les activités récentes
  getRecentActivities: async (limit: number = 20): Promise<Activity[]> => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE}/dashboard/recent-activities`, {
      params: { limit },
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  },

  // Obtenir les alertes
  getAlerts: async (): Promise<{ alerts: Alert[]; total: number }> => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE}/dashboard/alerts`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  },

  // Obtenir les vérifications en attente
  getPendingVerifications: async (page: number = 1, perPage: number = 15) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE}/dashboard/pending-verifications`, {
      params: { page, per_page: perPage },
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  },
};

export default dashboardService;
