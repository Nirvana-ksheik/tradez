/* eslint-disable no-restricted-globals */
// service-worker.js

self.addEventListener('push', function(event) {
  const data = event.data.json();
  if(!data){
    throw Error("Notification data body and title required");
  }
  console.log("Data in event listener: ", data);
  const options = {
    body: data.body
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});
  
//   this.addEventListener('notificationclick', (event) => {
//     event.notification.close();
  
//     // Add custom handling for notification click event, e.g., open a specific URL
//     this.clients.openWindow('https://example.com');
//   });
  
//   // Cache static assets for offline use
// //   this.addEventListener('install', (event) => {
// //     event.waitUntil(
// //       caches.open('my-cache').then((cache) => {
// //         return cache.addAll([
// //           '/',
// //           '/index.html',
// //           '/styles.css',
// //           '/script.js',
// //           // Add other static assets to cache
// //         ]);
// //       })
// //     );
// //   });
  
//   this.addEventListener('fetch', (event) => {
//     event.respondWith(
//       caches.match(event.request).then((response) => {
//         return response || fetch(event.request);
//       })
//     );
//   });
  