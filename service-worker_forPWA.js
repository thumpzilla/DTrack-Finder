self.addEventListener('install', function(e) {
    e.waitUntil(
      caches.open('DTrack Finder').then(function(cache) {
        return cache.addAll([
          "/",
          "/manifest_for_mobile_web_install.json",
          "/app.js",
          "/SongManager.js",
          "/GraphManager2D.js",
          "/BpmSlider.js",
          "/TagFilter_UI.js",
          "/Song.js",
          "/SongList_UI.js",
          "/Utils.js",          
          "/service-worker_forPWA.js",
          "/index.html",
          "/styles.css",
          "/images/tv.svg",
          "/images/output_192.png",
          "/images/output_512.png",
          "/images/Dark-background.svg",
          "/images/tags.svg",
          "/stopwatch.js",
          "/images/copy.png",
          "/data/TagsDict.json",
          "/favicon.ico",
          "/data/collections/Sp- Bach Party.json",
          "/data/collections/Sp- Kids Party.json",
          "/data/collections/DTRacks All 1200 DTracks.json",
          "/data/collections/Sp- Sing-Along.json",
          "/data/collections/manifest.json",
          "/data/collections/Sp - Party by decades.json",
          "https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@100;200;300;400;600;700;900&display=swap"
          // and so on, for all your files
        ]).catch(function(error) {
          console.log('Failed to add files to cache:', error);
      });
      })
    );
  });
  
  self.addEventListener('activate', (e) => {
    e.waitUntil(
      caches.keys().then((keyList) => {
        return Promise.all(keyList.map((key) => {
          if (key !== 'DTrack Finder') {
            return caches.delete(key);
          }
        }));
      })
    );
  });

  
  self.addEventListener('fetch', (e) => {
    e.respondWith(
      caches.match(e.request).then((response) => {
        return response || fetch(e.request).catch(() => {
          return new Response("Offline, content not available");
        });
      })
    );
  });