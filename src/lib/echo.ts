import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Make Pusher available globally for Laravel Echo
(window as any).Pusher = Pusher;

// En mode développement (log), on désactive Echo pour éviter les erreurs de connexion
// En production, décommenter le code ci-dessous et configurer les variables d'environnement

let echo: Echo | null = null;

// Vérifier si on est en mode production avec Pusher configuré
const isPusherConfigured = import.meta.env.VITE_PUSHER_APP_KEY && 
                          import.meta.env.VITE_PUSHER_APP_KEY !== 'local-key';

if (isPusherConfigured) {
  // Configuration Echo pour le mode production avec Pusher
  echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER || 'mt1',
    wsHost: import.meta.env.VITE_PUSHER_HOST || window.location.hostname,
    wsPort: import.meta.env.VITE_PUSHER_PORT || 6001,
    wssPort: import.meta.env.VITE_PUSHER_PORT || 6001,
    forceTLS: (import.meta.env.VITE_PUSHER_SCHEME || 'https') === 'https',
    enabledTransports: ['ws', 'wss'],
    disableStats: true,
    // Auth endpoint pour les canaux privés
    authEndpoint: `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/broadcasting/auth`,
    auth: {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        Accept: 'application/json',
      },
    },
  });
} else {
  // Mode développement (log) - Echo désactivé
  console.log('📡 Echo WebSocket désactivé (mode développement)');
  console.log('💡 Les notifications fonctionnent via la base de données');
  console.log('🚀 Pour activer le temps réel, configurez VITE_PUSHER_APP_KEY dans .env');
}

export default echo;
