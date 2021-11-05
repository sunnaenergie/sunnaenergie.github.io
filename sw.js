// Listen for install event, set callback
self.addEventListener('install', function(event) {
  // console.log('install',event);
});
self.addEventListener('activate', function(event) {
  // console.log('activate',event);
});

self.addEventListener('message', function(event) {
  // console.log('SELF.REGISTRATION', self.registration);
});
/** Fetch wordt itgeveord bij wijziging in href */
self.addEventListener('fetch', function(event) {
  // console.log('fetch',event);
});
self.addEventListener('push', function(event) {
  // console.log("Push recieved");
});
self.addEventListener('sync', function(event) {
  // console.log('sync',event);
});
