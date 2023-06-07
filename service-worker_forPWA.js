self.addEventListener('install', function(e) {
    e.waitUntil(
      caches.open('your-app-name').then(function(cache) {
        return cache.addAll([
          '/',
          '/index.html',
          '/styles.css',
          '/app.js',
          // and so on, for all your files
        ]);
      })
    );
  });
  