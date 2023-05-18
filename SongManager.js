import Song from './Song.js'
import SongListItemUI from './SongList_UI.js';

export default class SongManager {
    constructor(songs) {
        this.allSongs = songs;
        this.bpmRange = [60, 140]; // Default BPM range
        this.activeTags = ['Wedding', 'Club']; // Active tags
        this.filteredByTagsSongs = songs;
        this.listOfSongs_UI = document.getElementById('songs');//'#song-list'
        this.listOfSongs_UI.addEventListener('click', (event) => this.handleListClick(event));
    }
    // __________________________________ BPM __________________________________
    // Set the BPM range and update the song list
    
    applyTagsFilterToSongs(filterUsSongs){
        this.filteredByTagsSongs = filterUsSongs.filter(song => this.activeTags.every(tag => song.hasTag(tag)));
    }

    setBpmRange(bpmRange) {
        this.bpmRange = bpmRange;
        this.updateSongList();
    }

    // Get songs within the BPM range
    getSongsWithinBpmRange() {
        return this.filteredByTagsSongs.filter(song => song.isInBpmRange(this.bpmRange));
    }

    // __________________________________ Tags __________________________________ Start
    // Set active tags
    updateActiveTags(tags) {
        
        //if we added constraint (tag), we can just filter more deeply into the current collection
        if (this.activeTags.length < tags.length){
            this.applyTagsFilterToSongs(this.filteredByTagsSongs)
        }
        else{
            // if removed a tag (constraint), we need to refetch, 
            this.applyTagsFilterToSongs(this.allSongs)
        }

        this.activeTags = tags;
        this.updateSongList();
        
        // and if we added, we can just filter more deeply into the current collection
    }


    // __________________________________ Tags __________________________________ END
    distance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }

    sortByProximity(energy, popularity, sortUsSongs) {
        return sortUsSongs.sort((a, b) => {
            const aDistance = this.distance(a.popularity, a.energy, popularity, energy);
            const bDistance = this.distance(b.popularity, b.energy, popularity, energy);
            return aDistance - bDistance;
        });
    }


    
    // Update the song list based on the current BPM range
    updateSongList(energy, popularity) {
        // Clear the existing song list
        while (this.listOfSongs_UI.firstChild) {
            this.listOfSongs_UI.removeChild(this.listOfSongs_UI.firstChild);
        }
        this.applyTagsFilterToSongs(this.filteredByTagsSongs);
        let songsFilteredByBPM = this.getSongsWithinBpmRange(); //BPM Filger

        // Sort songs based on their distance to the selected point
        const sortedSongs = this.sortByProximity(energy, popularity, songsFilteredByBPM);

        // Display sorted songs (only first 5)
        sortedSongs.slice(0, 4).forEach((song, index) => {
            const songUI = new SongListItemUI(song);
            const listItem = songUI.createCollapsedState();
            listItem.dataset.index = index;
            this.listOfSongs_UI.appendChild(listItem);
        });
    }

    handleListClick(event) {
        // If the copy button was clicked, don't do anything.
        if (event.target.classList.contains('copy-button')) {
            return;
        }

        // Find the closest parent li of the clicked element
        const listItem = event.target.closest('li');
        
        if (listItem) {
            const song = JSON.parse(listItem.dataset.song);

            if (listItem.querySelector('.song-details')) {
                listItem.removeChild(listItem.querySelector('.song-details'));
            } else {
                const songUI = new SongListItemUI(song);
                songUI.createExpandedState(listItem);
            }
        }
    }
}