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
          "/images/resized_192.png",
          "/images/resized_512.png",
          "/images/Dark-background.svg",
          "/images/tags.svg",
          "/images/stopwatch.js",
          "/images/copy.png",
          "/data/TagsDict.json",
          "/data/collections/Sp- Bach Party.json",
          "/data/collections/Sp- Kids Party.json",
          "/data/collections/DTRacks All 1200 DTracks.json",
          "/data/collections/Sp- Sing-Along.json",
          "/data/collections/manifest.json",
          "/data/collections/Sp - Party by decades.json",
          // and so on, for all your files
        ]).catch(function(error) {
          console.log('Failed to add files to cache:', error);
      });
      })
    );
  });
  