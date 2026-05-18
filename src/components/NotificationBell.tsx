import React, { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import notificationService from '../services/notificationService';
import type { Notification } from '../services/notificationService';
import NotificationDropdown from './NotificationDropdown';
import echo from '../lib/echo';

const NotificationBell: React.FC = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Charger le nombre de notifications non lues
  const loadUnreadCount = async () => {
    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Erreur lors du chargement du compteur:', error);
    }
  };

  // Charger les notifications
  const loadNotifications = async () => {
    setLoading(true);
    try {
      const response = await notificationService.getNotifications(1, 10);
      setNotifications(response.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Écouter les nouvelles notifications en temps réel
  useEffect(() => {
    loadUnreadCount();

    // Si Echo n'est pas configuré (mode log), on s'arrête ici
    if (!echo) {
      console.log('📡 Notifications en mode polling (rechargement manuel)');
      return;
    }

    // Récupérer l'ID utilisateur depuis le localStorage
    const userStr = localStorage.getItem('user');
    if (!userStr) return;

    const user = JSON.parse(userStr);
    const userId = user.id;

    // Écouter le canal de l'utilisateur
    const channel = echo.channel(`user.${userId}`);
    
    channel.listen('.notification.created', (data: any) => {
      console.log('Nouvelle notification reçue:', data);
      
      // Incrémenter le compteur
      setUnreadCount(prev => prev + 1);
      
      // Ajouter la notification à la liste
      setNotifications(prev => [data, ...prev]);
      
      // Afficher une notification navigateur si autorisé
      if (Notification.permission === 'granted') {
        new Notification(data.title, {
          body: data.message,
          icon: '/logo.png',
        });
      }
    });

    // Demander la permission pour les notifications navigateur (seulement si Echo est actif)
    if (Notification.permission === 'default') {
      // On ne demande pas automatiquement, l'utilisateur peut cliquer sur un bouton
      console.log('💡 Notifications navigateur disponibles (cliquez pour activer)');
    }

    return () => {
      channel.stopListening('.notification.created');
    };
  }, []);

  // Fermer le dropdown en cliquant à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = () => {
    if (!isOpen) {
      loadNotifications();
    }
    setIsOpen(!isOpen);
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === id ? { ...notif, read_at: new Date().toISOString() } : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, read_at: new Date().toISOString() }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Erreur lors du marquage de toutes comme lues:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications(prev => prev.filter(notif => notif.id !== id));
      // Recharger le compteur
      loadUnreadCount();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <NotificationDropdown
          notifications={notifications}
          loading={loading}
          onMarkAsRead={handleMarkAsRead}
          onMarkAllAsRead={handleMarkAllAsRead}
          onDelete={handleDelete}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default NotificationBell;
