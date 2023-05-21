
import Song from './Song.js'
import TagFilter from './TagFilter_UI.js';
import SongManager from './SongManager.js';
import SongListItemUI from './SongList_UI.js';
import GraphManager from './GraphManager2D.js';
import BpmSlider from './BpmSlider.js';
import { showToast, createSongExamplesFromJson, generateRandomFloats } from './Utils.js'


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
http://192.168.0.209:5500/index.html 
*/