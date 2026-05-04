import api from './api';

export interface Notification {
  id: number;
  user_id: number;
  type: 'verification_approved' | 'verification_rejected' | 'risk_alert' | 'dispute_opened';
  title: string;
  message: string;
  data: any;
  read_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface NotificationResponse {
  success: boolean;
  data: {
    data: Notification[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface UnreadCountResponse {
  success: boolean;
  data: {
    unread_count: number;
  };
}

const notificationService = {
  /**
   * Obtenir les notifications
   */
  async getNotifications(page = 1, perPage = 20): Promise<NotificationResponse> {
    const response = await api.get(`/notifications?page=${page}&per_page=${perPage}`);
    return response.data;
  },

  /**
   * Obtenir le nombre de notifications non lues
   */
  async getUnreadCount(): Promise<number> {
    const response = await api.get<UnreadCountResponse>('/notifications/unread-count');
    return response.data.data.unread_count;
  },

  /**
   * Marquer une notification comme lue
   */
  async markAsRead(id: number): Promise<void> {
    await api.post(`/notifications/${id}/read`);
  },

  /**
   * Marquer toutes les notifications comme lues
   */
  async markAllAsRead(): Promise<void> {
    await api.post('/notifications/read-all');
  },

  /**
   * Supprimer une notification
   */
  async deleteNotification(id: number): Promise<void> {
    await api.delete(`/notifications/${id}`);
  },

  /**
   * Supprimer toutes les notifications lues
   */
  async deleteAllRead(): Promise<void> {
    await api.delete('/notifications/read/all');
  },
};

export default notificationService;
