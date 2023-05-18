
import Song from './Song.js'
import TagFilter from './TagFilter_UI.js';
import SongManager from './SongManager.js';
import SongListItemUI from './SongList_UI.js';
import GraphManager from './GraphManager2D.js';
import BpmSlider from './BpmSlider.js';
import { showToast, createSongExamplesFromJson, generateRandomFloats } from './Utils.js'

// Function to create SongExample instances from JSON data


// /* _____________________ General Functions _______________ START*/
// function generateRandomFloats(amountOfNumbers, minValue, maxValue) {
//     const floats = [];

//     for (let i = 0; i < amountOfNumbers; i++) {
//         const randomFloat = Math.random() * (maxValue - minValue) + minValue;
//         floats.push(randomFloat);
//     }

//     return floats;
// }

// function showToast(message) {
//     const toast = document.createElement('div');
//     toast.className = 'toast';
//     toast.textContent = message;
//     document.body.appendChild(toast);

//     // Set a timeout to remove the toast after 3 seconds
//     setTimeout(() => {
//         toast.classList.add('fade-out');
//         setTimeout(() => {
//             document.body.removeChild(toast);
//         }, 1000);
//     }, 3000);
// }

// async function createSongExamplesFromJson() {
//     try {
//         let response = await fetch('data/DTRacks All 1200 DTracks.json');
//         if (!response.ok) { // Check if response went through
//             console.error("HTTP Error Response: " + response.status);
//             return;
//         }
//         let data = await response.json();
//         let songExamples = data.map(item => new Song(item['Track Title'], item['Artist'], item['BPM'], item['Key'], item['DJ Play Count'], item['Rating'], item['My Tag'], item['Energy'], item['Popularity']));
//         return songExamples;
//     } catch (error) {
//         console.error("Problem with fetch operation: ", error);
//     }
// }


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
    // Bind BpmSlider To Graph Manager
    graphManager.initializeInteraction(songManager);
    // Bind BpmSlider To Graph Manager
    bpmSlider = new BpmSlider(songManager);
    // Bind tagFliter
    tagFilter = new TagFilter(songManager);

});
// _____________________________ Start Program ________________________________ END