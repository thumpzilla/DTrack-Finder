import TagFilter from './TagFilter_UI.js';
import SongManager from './SongManager.js';
import GraphManager from './GraphManager2D.js';
import AdvancedFilters from './AdvancedFilters.js';
import { showToast, createSongExamplesFromJson, generateRandomFloats } from './Utils.js'


// // Function to adjust the container size
function adjustContainerSize() {
    const container = document.querySelector('.container');
    const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);

    // Get the viewport height and width, and convert them to 'rem' units
    let viewportHeight = window.innerHeight;
    let viewportWidth = window.innerWidth;
    let vhInRem = Math.min(viewportHeight /rootFontSize, 70); // 16 is the root font-size
    let vwInRem = Math.min(viewportWidth / rootFontSize, 45); // 16 is the root font-size

    // Apply the styles
    container.style.height = `${vhInRem}rem`;
    container.style.width = `${vwInRem}rem`;
}

window.onresize = adjustContainerSize;
// _________________________ Prevent rotation ________________________________
window.onload = function() {
  adjustContainerSize();
  if (window.screen.orientation) {
    window.screen.orientation.lock('portrait')
      .catch(function(error) {
        console.log("Orientation lock error: " + error);
      });
  }
};

// ________________________ Prevent zoom on double tap on mobile devices __________________________
let lastTouchEnd = 0;
window.addEventListener('touchend', function (event) {
  let now = (new Date()).getTime();
  if (now - lastTouchEnd <= 200) {
    event.preventDefault();
  }
  lastTouchEnd = now;
}, false);
// ___________________________________ PWA ___________________________________ 

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker_forPWA.js')
    .then(function() { console.log('Service Worker Registered'); });
  }
// _____________________________ Start Program ________________________________ START

// Check if the user is authenticated
let isAuthenticated = true; // Replace this with actual authentication check

if (!isAuthenticated) {
  // If not, redirect to the login page
  window.location.href = 'login.html';
} else {
  let songs = []; 
  let songManager;
  let graphManager;
  let bpmSlider;
  let tagFilter;
  let keySlider;
  let advancedFilters;

  createSongExamplesFromJson().then((result) => {
      songs = result;
      songManager = new SongManager(songs);

      graphManager = new GraphManager();
      graphManager.drawGraph();
      // Set GraphManager and SongManager Interactions
      graphManager.initializeInteraction(songManager);
      songManager.setGraphManager(graphManager);

      
      // Bind BpmSlider To Graph Manager
      advancedFilters = new AdvancedFilters(songManager)
      // keySlider = new KeySlider(songManager);
      // bpmSlider = new BpmSlider(songManager);
      // Bind tagFliter
      tagFilter = new TagFilter(songManager);

  }).catch((error) => {
      console.error("An error occurred:", error);
  });
}
// _____________________________ Start Program ________________________________ END

// Luanch from mobile device: 
/*
http://192.168.0.210:5500/index.html 
192.168.0.210
*/

