import { useState, useEffect, useCallback } from 'react';

interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  requireInteraction?: boolean;
}

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Vérifier si les notifications sont supportées
    if ('Notification' in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async (): Promise<NotificationPermission> => {
    if (!isSupported) {
      throw new Error('Les notifications ne sont pas supportées');
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result;
    } catch (error) {
      console.error('Erreur lors de la demande de permission:', error);
      throw error;
    }
  }, [isSupported]);

  const showNotification = useCallback(async (options: NotificationOptions): Promise<Notification | null> => {
    if (!isSupported) {
      console.warn('Les notifications ne sont pas supportées');
      return null;
    }

    if (permission !== 'granted') {
      console.warn('Permission de notification non accordée');
      return null;
    }

    try {
      const notification = new Notification(options.title, {
        body: options.body,
        icon: options.icon || '/favicon.ico',
        badge: options.badge || '/favicon.ico',
        tag: options.tag,
        requireInteraction: options.requireInteraction || false,
      });

      return notification;
    } catch (error) {
      console.error('Erreur lors de l\'affichage de la notification:', error);
      return null;
    }
  }, [isSupported, permission]);

  const showSuccessNotification = useCallback((message: string) => {
    return showNotification({
      title: 'TrustRail MEA',
      body: message,
      tag: 'success'
    });
  }, [showNotification]);

  const showErrorNotification = useCallback((message: string) => {
    return showNotification({
      title: 'TrustRail MEA - Erreur',
      body: message,
      tag: 'error',
      requireInteraction: true
    });
  }, [showNotification]);

  const showInfoNotification = useCallback((message: string) => {
    return showNotification({
      title: 'TrustRail MEA - Information',
      body: message,
      tag: 'info'
    });
  }, [showNotification]);

  return {
    permission,
    isSupported,
    requestPermission,
    showNotification,
    showSuccessNotification,
    showErrorNotification,
    showInfoNotification,
  };
}