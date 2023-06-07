
import Song from './Song.js'
import TagFilter from './TagFilter_UI.js';
import SongManager from './SongManager.js';
import SongListItemUI from './SongList_UI.js';
import GraphManager from './GraphManager2D.js';
import BpmSlider from './BpmSlider.js';
import { showToast, createSongExamplesFromJson, generateRandomFloats } from './Utils.js'


// // Function to adjust the container size
function adjustContainerSize() {
    const container = document.querySelector('.container');

    // Get the viewport height and width, and convert them to 'rem' units
    let viewportHeight = window.innerHeight;
    let viewportWidth = window.innerWidth;
    
    let vhInRem = Math.min(viewportHeight / 16, 70); // 16 is the root font-size
    let vwInRem = Math.min(viewportWidth / 16, 60); // 16 is the root font-size

    // Apply the styles
    container.style.height = `${vhInRem}rem`;
    container.style.width = `${vwInRem}rem`;
}

window.onload = adjustContainerSize;
window.onresize = adjustContainerSize;

// ________________________ Prevent zoom in with double tag __________________________
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
    navigator.serviceWorker.register('/service-worker_forPWA.js')
    .then(function() { console.log('Service Worker Registered'); });
  }



// _____________________________ Start Program ________________________________ START

let songs = []; 
let songManager;
let graphManager;
let bpmSlider;
let tagFilter;

createSongExamplesFromJson().then((result) => {
    songs = result;
    songManager = new SongManager(songs);

    graphManager = new GraphManager();
    graphManager.drawGraph();
    graphManager.initializeInteraction(songManager);
    
    // Bind BpmSlider To Graph Manager
    bpmSlider = new BpmSlider(songManager);
    // Bind tagFliter
    tagFilter = new TagFilter(songManager);

}).catch((error) => {
    console.error("An error occurred:", error);
});

// _____________________________ Start Program ________________________________ END

// Luanch from mobile device: 
/*
http://192.168.0.210:5500/index.html 
*/



























// __________________________ Full Screen _______________________________________
// // var docElm = document.documentElement;
// // if (docElm.requestFullscreen) {
// //     docElm.requestFullscreen();
// // }
// // else if (docElm.mozRequestFullScreen) { // Firefox
// //     docElm.mozRequestFullScreen();
// // }
// // else if (docElm.webkitRequestFullScreen) { // Chrome, Safari and Opera
// //     docElm.webkitRequestFullScreen();
// // }
// // else if (docElm.msRequestFullscreen) { // IE/Edge
// //     docElm.msRequestFullscreen();
// // }

// window.addEventListener("load",function() { 
//     setTimeout(function(){
//       // This hides the address bar:
//       window.scrollTo(0, 1); 
//     }, 0); 
//   });