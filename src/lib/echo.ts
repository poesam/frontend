import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Make Pusher available globally for Laravel Echo
(window as any).Pusher = Pusher;

// Configuration Echo pour Pusher
let echo: any = null;

const pusherKey = import.meta.env.VITE_PUSHER_APP_KEY;
const pusherCluster = import.meta.env.VITE_PUSHER_APP_CLUSTER;
const pusherHost = import.meta.env.VITE_PUSHER_HOST;
const pusherPort = import.meta.env.VITE_PUSHER_PORT;
const pusherScheme = import.meta.env.VITE_PUSHER_SCHEME || 'https';

// Désactiver temporairement Pusher pour éviter les erreurs de connexion
const pusherEnabled = false; // Changer à true quand les variables Vercel seront configurées

if (pusherEnabled && pusherKey && pusherKey !== 'YOUR_PUSHER_APP_KEY' && pusherKey !== '') {
  const config: any = {
    broadcaster: 'pusher',
    key: pusherKey,
    cluster: pusherCluster || 'eu',
    forceTLS: pusherScheme === 'https',
    encrypted: pusherScheme === 'https',
    disableStats: true,
  };

  // Si un host personnalisé est défini (pour les tests), l'utiliser
  if (pusherHost) {
    config.wsHost = pusherHost;
    config.wsPort = pusherPort || 443;
    config.wssPort = pusherPort || 443;
    config.enabledTransports = ['ws', 'wss'];
  }

  echo = new Echo(config);

  console.log('📡 Pusher WebSocket activé');
  console.log(`🔗 Cluster: ${pusherCluster || 'eu'}`);
  if (pusherHost) {
    console.log(`🔗 Host: ${pusherScheme}://${pusherHost}:${pusherPort}`);
  }
} else {
  console.log('📡 WebSocket désactivé temporairement');
}

export default echo;