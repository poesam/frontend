import api from './api';

export interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  data?: any;
  read_at?: string;
  created_at: string;
}

export interface NotificationSettings {
  email_notifications: boolean;
  push_notifications: boolean;
  sms_notifications: boolean;
  notification_types: {
    verification_updates: boolean;
    transaction_updates: boolean;
    dispute_alerts: boolean;
    risk_alerts: boolean;
    system_updates: boolean;
  };
}

class NotificationService {
  private vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;

  // Enregistrer le service worker pour les notifications push
  async registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker enregistré:', registration);
        return registration;
      } catch (error) {
        console.error('Erreur enregistrement Service Worker:', error);
        return null;
      }
    }
    return null;
  }

  // S'abonner aux notifications push
  async subscribeToPush(): Promise<PushSubscription | null> {
    try {
      const registration = await this.registerServiceWorker();
      if (!registration) return null;

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.vapidPublicKey
      });

      // Envoyer l'abonnement au backend
      await this.sendSubscriptionToBackend(subscription);
      
      return subscription;
    } catch (error) {
      console.error('Erreur abonnement push:', error);
      return null;
    }
  }

  // Envoyer l'abonnement au backend
  private async sendSubscriptionToBackend(subscription: PushSubscription): Promise<void> {
    try {
      await api.post('/notifications/subscribe', {
        subscription: subscription.toJSON()
      });
    } catch (error) {
      console.error('Erreur envoi abonnement:', error);
    }
  }

  // Se désabonner des notifications push
  async unsubscribeFromPush(): Promise<boolean> {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (!registration) return false;

      const subscription = await registration.pushManager.getSubscription();
      if (!subscription) return false;

      const success = await subscription.unsubscribe();
      
      if (success) {
        // Informer le backend
        await api.post('/notifications/unsubscribe', {
          endpoint: subscription.endpoint
        });
      }

      return success;
    } catch (error) {
      console.error('Erreur désabonnement push:', error);
      return false;
    }
  }

  // Récupérer les notifications
  async getNotifications(page = 1, limit = 20): Promise<{ data: Notification[]; total: number }> {
    try {
      const response = await api.get('/notifications', {
        params: { page, limit }
      });
      return response.data.data;
    } catch (error) {
      console.error('Erreur récupération notifications:', error);
      return { data: [], total: 0 };
    }
  }

  // Marquer une notification comme lue
  async markAsRead(id: number): Promise<boolean> {
    try {
      await api.post(`/notifications/${id}/read`);
      return true;
    } catch (error) {
      console.error('Erreur marquage lecture:', error);
      return false;
    }
  }

  // Marquer toutes les notifications comme lues
  async markAllAsRead(): Promise<boolean> {
    try {
      await api.post('/notifications/read-all');
      return true;
    } catch (error) {
      console.error('Erreur marquage toutes lues:', error);
      return false;
    }
  }

  // Supprimer une notification
  async deleteNotification(id: number): Promise<boolean> {
    try {
      await api.delete(`/notifications/${id}`);
      return true;
    } catch (error) {
      console.error('Erreur suppression notification:', error);
      return false;
    }
  }

  // Récupérer le nombre de notifications non lues
  async getUnreadCount(): Promise<number> {
    try {
      const response = await api.get('/notifications/unread-count');
      return response.data.data.count || 0;
    } catch (error) {
      console.error('Erreur comptage non lues:', error);
      return 0;
    }
  }

  // Récupérer les paramètres de notification
  async getSettings(): Promise<NotificationSettings | null> {
    try {
      const response = await api.get('/notifications/settings');
      return response.data.data;
    } catch (error) {
      console.error('Erreur récupération paramètres:', error);
      return null;
    }
  }

  // Mettre à jour les paramètres de notification
  async updateSettings(settings: Partial<NotificationSettings>): Promise<boolean> {
    try {
      await api.put('/notifications/settings', settings);
      return true;
    } catch (error) {
      console.error('Erreur mise à jour paramètres:', error);
      return false;
    }
  }

  // Créer une notification de test (admin uniquement)
  async createTestNotification(title: string, message: string): Promise<boolean> {
    try {
      await api.post('/notifications/test', { title, message });
      return true;
    } catch (error) {
      console.error('Erreur création notification test:', error);
      return false;
    }
  }

  // Vérifier si les notifications push sont supportées
  isPushSupported(): boolean {
    return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
  }

  // Vérifier le statut de l'abonnement push
  async getPushSubscriptionStatus(): Promise<{
    isSubscribed: boolean;
    subscription: PushSubscription | null;
  }> {
    try {
      if (!this.isPushSupported()) {
        return { isSubscribed: false, subscription: null };
      }

      const registration = await navigator.serviceWorker.getRegistration();
      if (!registration) {
        return { isSubscribed: false, subscription: null };
      }

      const subscription = await registration.pushManager.getSubscription();
      return {
        isSubscribed: !!subscription,
        subscription
      };
    } catch (error) {
      console.error('Erreur vérification statut push:', error);
      return { isSubscribed: false, subscription: null };
    }
  }
}

export const notificationService = new NotificationService();
export default notificationService;