import { useState, useEffect } from 'react';
import { Bell, X, Check } from 'lucide-react';

export default function NotificationPermission() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    // Vérifier le statut des notifications
    if ('Notification' in window) {
      setPermission(Notification.permission);
      
      // Afficher le prompt si les notifications ne sont pas encore autorisées
      // et si l'utilisateur n'a pas déjà refusé récemment
      const dismissed = localStorage.getItem('notification-prompt-dismissed');
      if (Notification.permission === 'default' && !dismissed) {
        // Attendre 5 secondes après le chargement de la page
        setTimeout(() => {
          setShowPrompt(true);
        }, 5000);
      }
    }
  }, []);

  const handleRequestPermission = async () => {
    if ('Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        setPermission(permission);
        
        if (permission === 'granted') {
          // Afficher une notification de test
          new Notification('TrustRail MEA', {
            body: 'Notifications activées avec succès !',
            icon: '/favicon.ico',
            badge: '/favicon.ico'
          });
        }
        
        setShowPrompt(false);
      } catch (error) {
        console.error('Erreur lors de la demande de permission:', error);
        setShowPrompt(false);
      }
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Ne plus afficher pendant 3 jours
    const threeDays = 3 * 24 * 60 * 60 * 1000;
    localStorage.setItem('notification-prompt-dismissed', (Date.now() + threeDays).toString());
  };

  const handleDeny = () => {
    setShowPrompt(false);
    // Ne plus afficher pendant 30 jours si l'utilisateur refuse explicitement
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
    localStorage.setItem('notification-prompt-dismissed', (Date.now() + thirtyDays).toString());
  };

  // Ne pas afficher si les notifications ne sont pas supportées
  if (!('Notification' in window)) return null;
  
  // Ne pas afficher si déjà autorisé ou refusé
  if (permission !== 'default') return null;
  
  // Ne pas afficher si le prompt n'est pas activé
  if (!showPrompt) return null;

  return (
    <div className="fixed top-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-md z-50 animate-slide-down">
      <div className="glass p-6 rounded-2xl shadow-2xl border-2 border-amber-200">
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 p-1 hover:bg-slate-200 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-slate-600" />
        </button>

        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Bell className="w-6 h-6 text-white" />
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Activer les notifications
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              Recevez des alertes importantes sur vos transactions, vérifications et litiges
            </p>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleRequestPermission}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl transition-colors text-sm flex items-center space-x-2"
              >
                <Check className="w-4 h-4" />
                <span>Autoriser</span>
              </button>
              <button
                onClick={handleDeny}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors text-sm"
              >
                Non merci
              </button>
              <button
                onClick={handleDismiss}
                className="px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 font-medium rounded-xl transition-colors text-sm"
              >
                Plus tard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}