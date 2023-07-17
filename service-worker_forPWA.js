// Change this to your repository name
var GHPATH = '/DTrack-Finder';
 
// Choose a different app prefix name
var APP_PREFIX = 'dtrack_';
 
// The version of the cache. Every time you change any of the files
// you need to change this version (version_01, version_02…). 
// If you don't change the version, the service worker will give your
// users the old files!
var VERSION = 'version_06';
 
// The files to make available for offline use.
var URLS = [
  `${GHPATH}/data/collections/manifest.json`,
  `${GHPATH}/data/collections/Combined_everything_16Jul2023.json`,

  

  `${GHPATH}/`,
  `${GHPATH}/index.html`,
  `${GHPATH}/styles.css`,
  `${GHPATH}/app.js`,
  // Add other required files...
  `${GHPATH}/SongManager.js`,
  `${GHPATH}/GraphManager2D.js`,
  `${GHPATH}/BpmSlider.js`,
  `${GHPATH}/TagFilter_UI.js`,
  `${GHPATH}/Song.js`,
  `${GHPATH}/SongList_UI.js`,
  `${GHPATH}/Utils.js`,
  `${GHPATH}/AdvancedFilters.js`,
  `${GHPATH}/AdvancedFilters.js`,
  `${GHPATH}/service-worker_forPWA.js`,
  `${GHPATH}/images/tv.svg`,
  `${GHPATH}/images/output_192.png`,
  `${GHPATH}/images/output_512.png`,
  `${GHPATH}/images/Dark-background.svg`,
  `${GHPATH}/images/tags.svg`,
  `${GHPATH}/stopwatch.js`,
  `${GHPATH}/images/copy.png`,
  `${GHPATH}/data/TagsDict.json`,
  `${GHPATH}/favicon.ico`,

  `${GHPATH}/images/sort.svg`,
  `${GHPATH}/images/energy.svg`,
  `${GHPATH}/images/popularity.svg`,

  `${GHPATH}/images/colored/tags.svg`,
  `${GHPATH}/images/colored/Spotify-colored.svg`,
  `${GHPATH}/images/colored/play-colored.svg`,
  `${GHPATH}/images/colored/Popular-trendy-colored.svg`,
  `${GHPATH}/images/colored/energy-colored.svg`,

  `${GHPATH}/images/drum-bpm.svg`,
  `${GHPATH}/images/sound-note-single.svg`,
  `${GHPATH}/images/colored/drum-colored.svg`,
  `${GHPATH}/images/colored/sound_note-colored.svg`,
  `${GHPATH}/images/colored/calendar-colored.svg`,
  `${GHPATH}/images/colored/clock-colored.svg`,




  
  "https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@100;200;300;400;600;700;900&display=swap"
]

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(APP_PREFIX + VERSION).then(function(cache) {
      return cache.addAll(URLS)
        .then(function() {
          console.log('All files are cached');
          return;
        })
        .catch(function(error) {
          console.log('Failed to add files to cache:', error);
        });
    })
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key.indexOf(APP_PREFIX) !== 0 || key.indexOf(VERSION) === -1) {
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

/*
// Source: 
Turning github page into a pwa
https://christianheilmann.com/2022/01/13/turning-a-github-page-into-a-progressive-web-app/

*/

