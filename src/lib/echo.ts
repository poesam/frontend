import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Make Pusher available globally for Laravel Echo
(window as any).Pusher = Pusher;

// Configuration Echo pour Laravel Reverb
let echo: Echo<any> | null = null;

const reverbKey = import.meta.env.VITE_REVERB_APP_KEY;
const reverbHost = import.meta.env.VITE_REVERB_HOST;
const reverbPort = import.meta.env.VITE_REVERB_PORT;
const reverbScheme = import.meta.env.VITE_REVERB_SCHEME || 'http';

if (reverbKey && reverbHost) {
  echo = new Echo({
    broadcaster: 'reverb',
    key: reverbKey,
    wsHost: reverbHost,
    wsPort: reverbPort || 8080,
    wssPort: reverbPort || 8080,
    forceTLS: reverbScheme === 'https',
    enabledTransports: ['ws', 'wss'],
    disableStats: true,
  });

  console.log('📡 Laravel Reverb WebSocket activé');
  console.log(`🔗 Connexion: ${reverbScheme}://${reverbHost}:${reverbPort}`);
} else {
  console.log('📡 WebSocket désactivé (Reverb non configuré)');
}

export default echo;
