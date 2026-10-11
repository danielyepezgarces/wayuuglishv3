// Wayuuglish Offline-First Service Worker with Push & Background Notification Support
const CACHE_NAME = 'wayuuglish-cache-v2';
const OFFLINE_URLS = [
  '/',
  '/index.html'
];

let scheduledTimer = null;

// Install: Cache critical shell assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(OFFLINE_URLS);
    }).then(() => self.skipWaiting())
  );
});

// Activate: Clean up old caches and claim clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Network first with offline fallback cache
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          return cachedResponse || caches.match('/');
        });
      })
  );
});

// Push API: Handle background push messages from cloud/server
self.addEventListener('push', (event) => {
  let data = {
    title: 'Wayuuglish · Recordatorio de Racha 🔥',
    body: '¡Tu racha de aprendizaje está en juego! Completa tu meta diaria para proteger tus días consecutivos.',
    icon: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Ccircle cx="50" cy="50" r="48" fill="%23E11D48"/%3E%3Cpolygon points="50,15 62,35 38,35" fill="%23BE123C"/%3E%3Ccircle cx="50" cy="55" r="30" fill="%23EF4444"/%3E%3Cpolygon points="65,55 90,60 65,68" fill="%23F59E0B"/%3E%3C/svg%3E',
    badge: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Ccircle cx="50" cy="50" r="48" fill="%23E11D48"/%3E%3C/svg%3E',
    tag: 'wayuuglish-streak-alert',
    data: { url: '/' }
  };

  if (event.data) {
    try {
      data = { ...data, ...event.data.json() };
    } catch {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon,
    badge: data.badge,
    tag: data.tag || 'wayuuglish-streak-alert',
    renotify: true,
    vibrate: [200, 100, 200],
    data: data.data || { url: '/' },
    actions: [
      { action: 'practice', title: '¡Aprender Ahora! 🌵' },
      { action: 'close', title: 'Más tarde' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Handle notification interaction (clicking the notification card or action buttons)
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'close') return;

  const urlToOpen = (event.notification.data && event.notification.data.url) || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes(self.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(urlToOpen);
      }
    })
  );
});

// Communication with applet client (for local offline reminders and scheduling)
self.addEventListener('message', (event) => {
  if (!event.data) return;

  const iconSvg = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Ccircle cx="50" cy="50" r="48" fill="%23E11D48"/%3E%3Cpolygon points="50,15 62,35 38,35" fill="%23BE123C"/%3E%3Ccircle cx="50" cy="55" r="30" fill="%23EF4444"/%3E%3Cpolygon points="65,55 90,60 65,68" fill="%23F59E0B"/%3E%3C/svg%3E';

  if (event.data.type === 'SHOW_STREAK_NOTIFICATION') {
    const { title, body, streak } = event.data;
    self.registration.showNotification(title || `¡Tu racha de ${streak || 1} días te espera! 🔥`, {
      body: body || 'Recuerda practicar hoy para cumplir tu meta diaria de aprendizaje.',
      icon: iconSvg,
      badge: iconSvg,
      tag: 'wayuuglish-streak-alert',
      renotify: true,
      vibrate: [200, 100, 200],
      data: { url: '/' },
      actions: [
        { action: 'practice', title: 'Abrir Lección' },
        { action: 'close', title: 'Cerrar' }
      ]
    });
  }

  if (event.data.type === 'SCHEDULE_STREAK_REMINDER') {
    const { delayMs, title, body, streak } = event.data;
    if (scheduledTimer) {
      clearTimeout(scheduledTimer);
      scheduledTimer = null;
    }

    if (delayMs && delayMs > 0) {
      scheduledTimer = setTimeout(() => {
        self.registration.showNotification(title || `¡No dejes apagar tu racha de ${streak || 1} días! 🔥`, {
          body: body || 'Queda poco tiempo hoy para cumplir tu meta diaria en Wayuuglish.',
          icon: iconSvg,
          badge: iconSvg,
          tag: 'wayuuglish-streak-alert',
          renotify: true,
          vibrate: [200, 100, 200],
          data: { url: '/' },
          actions: [
            { action: 'practice', title: 'Cumplir Meta Ahora' },
            { action: 'close', title: 'Más tarde' }
          ]
        });
      }, delayMs);
    }
  }
});
