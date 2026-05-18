// Service Worker pour les notifications push - TrustRail MEA

const CACHE_NAME = 'trustrail-mea-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/favicon.ico'
];

// Installation du service worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installation');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Cache ouvert');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('Service Worker: Erreur cache:', error);
      })
  );
});

// Activation du service worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activation');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Suppression ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interception des requêtes réseau
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Retourner la réponse du cache si disponible
        if (response) {
          return response;
        }
        
        // Sinon, faire la requête réseau
        return fetch(event.request);
      })
      .catch((error) => {
        console.error('Service Worker: Erreur fetch:', error);
      })
  );
});

// Gestion des notifications push
self.addEventListener('push', (event) => {
  console.log('Service Worker: Notification push reçue');
  
  let notificationData = {
    title: 'TrustRail MEA',
    body: 'Nouvelle notification',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: 'trustrail-notification',
    requireInteraction: false,
    actions: [
      {
        action: 'view',
        title: 'Voir',
        icon: '/favicon.ico'
      },
      {
        action: 'dismiss',
        title: 'Ignorer'
      }
    ]
  };

  // Traiter les données de la notification si disponibles
  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = {
        ...notificationData,
        ...data
      };
    } catch (error) {
      console.error('Service Worker: Erreur parsing notification:', error);
      notificationData.body = event.data.text() || notificationData.body;
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      tag: notificationData.tag,
      requireInteraction: notificationData.requireInteraction,
      actions: notificationData.actions,
      data: notificationData.data || {}
    })
  );
});

// Gestion des clics sur les notifications
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Clic sur notification');
  
  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  // Ouvrir ou focuser l'application
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Si une fenêtre est déjà ouverte, la focuser
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Sinon, ouvrir une nouvelle fenêtre
        if (clients.openWindow) {
          const targetUrl = event.notification.data?.url || '/dashboard';
          return clients.openWindow(self.location.origin + targetUrl);
        }
      })
      .catch((error) => {
        console.error('Service Worker: Erreur ouverture fenêtre:', error);
      })
  );
});

// Gestion de la fermeture des notifications
self.addEventListener('notificationclose', (event) => {
  console.log('Service Worker: Notification fermée');
  
  // Optionnel: envoyer une analytics ou log
  if (event.notification.data?.trackClose) {
    // Envoyer un événement de fermeture au backend
    fetch('/api/notifications/track-close', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        notificationId: event.notification.data.id,
        timestamp: Date.now()
      })
    }).catch((error) => {
      console.error('Service Worker: Erreur tracking fermeture:', error);
    });
  }
});

// Gestion des erreurs de synchronisation en arrière-plan
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Synchronisation en arrière-plan');
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Effectuer des tâches de synchronisation si nécessaire
      Promise.resolve()
    );
  }
});

// Message du client vers le service worker
self.addEventListener('message', (event) => {
  console.log('Service Worker: Message reçu:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  // Répondre au client
  event.ports[0].postMessage({
    type: 'SW_RESPONSE',
    message: 'Service Worker actif'
  });
});