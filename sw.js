// Listen for push broadcast signals coming from the app or backend server
self.addEventListener('push', function(event) {
  let data = { 
    title: "New Alert!", 
    body: "You have a new message.",
    url: "/"
  };

  // Safely parse incoming push data
  if (event.data) {
    try {
      data = Object.assign(data, event.data.json());
    } catch (e) {
      // Fallback if payload is plain text instead of JSON
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || 'https://via.placeholder.com/128',
    badge: data.badge || 'https://via.placeholder.com/128',
    vibrate: [200, 100, 200], // Mobile vibration pattern
    data: {
      url: data.url || '/' // Store target URL to open on click
    }
  };

  // Force the OS system notification banner to drop down
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Handle clicking the system notification banner
self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  const targetUrl = new URL(event.notification.data.url || '/', self.location.origin).href;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      // 1. If an existing app window/tab is already open, focus it
      for (let client of windowClients) {
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      // 2. If no matching window is open, open a new one
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});