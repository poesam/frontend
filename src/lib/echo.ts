import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Make Pusher available globally for Laravel Echo
(window as any).Pusher = Pusher;

// Configuration Echo pour WebSocket - Désactivé si pas de clé Pusher
let echo: Echo | null = null;

const pusherKey = import.meta.env.VITE_PUSHER_APP_KEY;

if (pusherKey && pusherKey !== 'YOUR_PUSHER_APP_KEY' && pusherKey !== '') {
  echo = new Echo({
    broadcaster: 'pusher',
    key: pusherKey,
    wsHost: import.meta.env.VITE_PUSHER_HOST || '127.0.0.1',
    wsPort: import.meta.env.VITE_PUSHER_PORT || 6001,
    wssPort: import.meta.env.VITE_PUSHER_PORT || 6001,
    forceTLS: import.meta.env.VITE_PUSHER_SCHEME === 'https',
    encrypted: import.meta.env.VITE_PUSHER_SCHEME === 'https',
    disableStats: true,
    enabledTransports: ['ws', 'wss'],
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER || 'mt1',
  });

  console.log('📡 Echo WebSocket activé');
  console.log('🔗 Connexion:', `${import.meta.env.VITE_PUSHER_SCHEME || 'ws'}://${import.meta.env.VITE_PUSHER_HOST || '127.0.0.1'}:${import.meta.env.VITE_PUSHER_PORT || 6001}`);
} else {
  console.log('📡 WebSocket désactivé (pas de clé Pusher configurée)');
}

export default echo;

