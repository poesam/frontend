import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Make Pusher available globally for Laravel Echo
(window as any).Pusher = Pusher;

// Configuration Echo pour WebSocket local
const echo = new Echo({
  broadcaster: 'pusher',
  key: import.meta.env.VITE_PUSHER_APP_KEY || 'local-key',
  wsHost: import.meta.env.VITE_PUSHER_HOST || '127.0.0.1',
  wsPort: import.meta.env.VITE_PUSHER_PORT || 6001,
  wssPort: import.meta.env.VITE_PUSHER_PORT || 6001,
  forceTLS: false,
  encrypted: false,
  disableStats: true,
  enabledTransports: ['ws'],
  cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER || 'mt1',
});

console.log('📡 Echo WebSocket activé');
console.log('🔗 Connexion:', `ws://${import.meta.env.VITE_PUSHER_HOST || '127.0.0.1'}:${import.meta.env.VITE_PUSHER_PORT || 6001}`);

export default echo;
