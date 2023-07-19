import TagFilter from './TagFilter_UI.js';
import SongManager from './SongManager.js';
import GraphManager from './GraphManager2D.js';
import AdvancedFilters from './AdvancedFilters.js';
import { showToast, createSongExamplesFromJson, generateRandomFloats } from './Utils.js'
import FirebaseManager from './FirebaseManager.js';



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

// _________________ Google Authentication __________________ START
// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBWuVfXqAPq5YfJfx5GmF-VCbnTrx8B9GU",
  authDomain: "dtrack-finder.firebaseapp.com",
  projectId: "dtrack-finder",
  storageBucket: "dtrack-finder.appspot.com",
  messagingSenderId: "842000276102",
  appId: "1:842000276102:web:587eea18f2efbfe2090f07",
  measurementId: "G-0VNXC4FWZ6"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Check user authentication status
firebase.auth().onAuthStateChanged(async user => {
  if (!user) { //if (true) { // 
    window.location.href = 'login.html';
  } else {
    const firebaseManager = new FirebaseManager();
    firebaseManager.setUser(user); // Set user
    const favorites = await firebaseManager.getFavorites(user);

    
    
    // User is signed in, continue to your app
    let songs = []; 
    let songManager;
    let graphManager;
    let tagFilter;
    let advancedFilters;

    createSongExamplesFromJson().then((result) => {
        songs = result;
        songManager = new SongManager(songs, favorites,  firebaseManager);

        graphManager = new GraphManager();
        graphManager.drawGraph();
        // Set GraphManager and SongManager Interactions
        graphManager.initializeInteraction(songManager);
        songManager.setGraphManager(graphManager);

        // Bind BpmSlider To Graph Manager
        advancedFilters = new AdvancedFilters(songManager)
        // Bind tagFliter
        tagFilter = new TagFilter(songManager);


    }).catch((error) => {
        console.error("An error occurred:", error);
    });
  }
});

// _____________________________ Start Program ________________________________ END

// Luanch from mobile device: 
/*
http://192.168.0.210:5500/index.html 
192.168.0.210
*/

// ______________________________________
/*
<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyBWuVfXqAPq5YfJfx5GmF-VCbnTrx8B9GU",
    authDomain: "dtrack-finder.firebaseapp.com",
    projectId: "dtrack-finder",
    storageBucket: "dtrack-finder.appspot.com",
    messagingSenderId: "842000276102",
    appId: "1:842000276102:web:587eea18f2efbfe2090f07",
    measurementId: "G-0VNXC4FWZ6"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
</script>
*/

// ______________________________________






// let isAuthenticated = true; // Replace this with actual authentication check

// if (!isAuthenticated) {
//   // If not, redirect to the login page
//   window.location.href = 'login.html';
// } 
// else {
// // _________________ Google Authentication __________________ END
//   let songs = []; 
//   let songManager;
//   let graphManager;
//   let bpmSlider;
//   let tagFilter;
//   let keySlider;
//   let advancedFilters;

//   createSongExamplesFromJson().then((result) => {
//       songs = result;
//       songManager = new SongManager(songs);

//       graphManager = new GraphManager();
//       graphManager.drawGraph();
//       // Set GraphManager and SongManager Interactions
//       graphManager.initializeInteraction(songManager);
//       songManager.setGraphManager(graphManager);

      
//       // Bind BpmSlider To Graph Manager
//       advancedFilters = new AdvancedFilters(songManager)
//       // keySlider = new KeySlider(songManager);
//       // bpmSlider = new BpmSlider(songManager);
//       // Bind tagFliter
//       tagFilter = new TagFilter(songManager);

//   }).catch((error) => {
//       console.error("An error occurred:", error);
//   });
// }

// _______________________________________________