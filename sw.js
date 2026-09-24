// Listen for push broadcast signals coming from the app or admin panel
self.addEventListener('push', function(event) {
  let data = { title: "New Alert!", body: "You have a new message." };
  
  if (event.data) {
    data = event.data.json();
  }

  const options = {
    body: data.body,
    icon: 'https://via.placeholder.com/128',
    badge: 'https://via.placeholder.com/128',
    vibrate: [200, 100, 200] // Mobile vibration pattern
  };

  // This command forces the OS system notification banner to drop down
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Handle clicking the system notification banner to bring user back to app
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});