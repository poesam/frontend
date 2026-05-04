import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, AlertCircle, Trash2, Check } from 'lucide-react';
import type { Notification } from '../services/notificationService';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: number) => void;
  onDelete: (id: number) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  onDelete,
}) => {
  const isUnread = !notification.read_at;

  // Icône selon le type
  const getIcon = () => {
    switch (notification.type) {
      case 'verification_approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'verification_rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'risk_alert':
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'dispute_opened':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  // Couleur de fond selon le type
  const getBgColor = () => {
    if (!isUnread) return 'bg-white';
    
    switch (notification.type) {
      case 'verification_approved':
        return 'bg-green-50';
      case 'verification_rejected':
        return 'bg-red-50';
      case 'risk_alert':
        return 'bg-orange-50';
      case 'dispute_opened':
        return 'bg-red-50';
      default:
        return 'bg-blue-50';
    }
  };

  // Formater la date
  const getTimeAgo = () => {
    try {
      return formatDistanceToNow(new Date(notification.created_at), {
        addSuffix: true,
        locale: fr,
      });
    } catch {
      return 'À l\'instant';
    }
  };

  return (
    <div
      className={`p-4 hover:bg-gray-50 transition-colors ${getBgColor()} ${
        isUnread ? 'border-l-4 border-blue-500' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className={`text-sm font-medium ${isUnread ? 'text-gray-900' : 'text-gray-600'}`}>
              {notification.title}
            </h4>
            {isUnread && (
              <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-1.5"></span>
            )}
          </div>
          
          <p className="mt-1 text-sm text-gray-600 line-clamp-2">
            {notification.message}
          </p>

          {/* Additional data */}
          {notification.data && (
            <div className="mt-2 text-xs text-gray-500">
              {notification.data.company_name && (
                <span className="font-medium">{notification.data.company_name}</span>
              )}
              {notification.data.trust_code && (
                <span className="ml-2 text-gray-400">({notification.data.trust_code})</span>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-gray-400">{getTimeAgo()}</span>
            
            <div className="flex items-center gap-1">
              {isUnread && (
                <button
                  onClick={() => onMarkAsRead(notification.id)}
                  className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  title="Marquer comme lu"
                >
                  <Check className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => onDelete(notification.id)}
                className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                title="Supprimer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
