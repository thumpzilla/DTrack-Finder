import Song from './Song.js'
import { showToast, KEYS_LOGIC, logEventToAnalytics } from './Utils.js'; // Make sure to import the showToast function
import SongListItemUI from './SongList_UI.js';

export default class SongManager {
    constructor(songs) {
        this.allSongs = songs; 
        this.filteredByTagsSongs = songs; // Using it to prevent additional computations. (don't need to go over the entire DB when adding constraint)

        this.isBpmFilterActive = true;
        this.bpmRange = [60, 150]; // Default BPM range
        // Play count filter
        this.isPlayCountFilterActive = true;
        this.playCountRange = [2, 150];


        this.isKeyFilterActive = true;
        this.keyRange = []

        this.activeTags = []; // Active tags
        this.listOfSongs_UI = document.getElementById('songs');//'#song-list'
        this.listOfSongs_UI.addEventListener('click', (event) => this.handleListClick(event));
        this.createLoadMoreTracksBtn()

        this.createFilterSortingSwitch();
    }


    handleListClick(event) {
        // If the copy button was clicked, don't do anything.
        if (event.target.classList.contains('copy-button') || event.target.classList.contains('copy-icon')) {            return;
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

    createSummaryObject(containerId, idOfTextField, svgImagePath, imageDivPath, activeIndicatorId) {
        // create the div container
        let container = document.createElement('div');
        container.id = containerId;
        container.style.display = 'flex';
        container.style.position = 'relative'; // Container needs to be relative for absolute child positioning.
        container.style.alignItems = 'center';
        container.style.justifyContent = 'space-between'; // Spread out the elements in the container
        container.style.flex = '1'; // This will spread out the child elements equally
    
        // create the image
        let image = document.createElement('img');
        image.src = svgImagePath;
        image.style.width = '1.8rem';
        image.style.height = '1.8rem';
        image.style.position = 'absolute'; // Image is positioned absolutely to the container
        image.style.left = '1.2rem'; // You may need to adjust this value
        image.style.bottom = '25%'; // You may need to adjust this value
        image.style.zIndex = '10';
    
        // create the text field
        let textField = document.createElement('p');
        textField.id = idOfTextField;
        textField.style.textAlign = 'center'; // center the text in the text field
    
        // create the div for the image
        let imageDiv = document.createElement('div');
        imageDiv.id = imageDivPath;
        imageDiv.appendChild(image);  // Append image to imageDiv
    
        // Create the active indicator
        let activeIndicator = document.createElement('div');
        activeIndicator.id = activeIndicatorId;
        activeIndicator.classList.add('active-indicator');
        imageDiv.appendChild(activeIndicator);
                   
        // append the elements to the container
        container.appendChild(imageDiv);
        container.appendChild(textField);
    
        return container;
    }
    
    // }
    createFilterSortingSwitch(){
        // Get the switch container
        this.filterSortingSwitchContainer = document.getElementById("filter-sorting-switch-container");
        this.filterSortingSwitchContainer.style.textAlign = 'center'; // or any other styles you want

        // Create summary objects similar to AdvancedFilters
        this.songCountSummaryObject = this.createSummaryObject('song-count-container',
                                                                'song-count-display',
                                                                'images/colored/tags.svg', 
                                                                'song-count-image-div',
                                                                'song-count-active-indicator');
        
        this.sortingCriteriaSummaryObject = this.createSummaryObject('sorting-criteria-container',
                                                                    'sorting-criteria-display',
                                                                    'images/sort.svg',
                                                                    'sorting-criteria-image-div',
                                                                    'sorting-criteria-active-indicator');
        // Append the new objects
        this.filterSortingSwitchContainer.appendChild(this.songCountSummaryObject);
        this.filterSortingSwitchContainer.appendChild(this.sortingCriteriaSummaryObject);


        // Highlight
        this.highlight = document.createElement('div');
        this.highlight.classList.add('highlight');
        this.highlight.style.transform = 'translateX(102%)';

        // Append highlight to the filterSortingSwitchContainer
        this.filterSortingSwitchContainer.appendChild(this.highlight);  
        

        
        // After the creation of songCountSummaryObject, add a 'contextmenu' event listener to it
        this.songCountSummaryObject.querySelector('p').addEventListener('contextmenu', (event) => {
            event.preventDefault();  // Prevent the browser's context menu from showing
            this.copySongsToClipboard();  // Call the new method
        });

        this.twoDSelector = document.getElementById('2dSelector'); // style.display - 'block' or 'none'
        this.tagCatalogElement = document.getElementById('tag-catalog'); // style.display - 'block' or 'none'

        // Update the event listener for addTagButton
        this.filterSortingSwitchContainer.addEventListener('click', () => {
            this.setTagsSortingView('toggle');
        });
        
        this.songTextInSummaryObject = document.getElementById("song-count-display");
        this.sortTextInSummaryObject = document.getElementById("sorting-criteria-display");
        let tagImageDiv = document.getElementById('song-count-image-div');
        this.tagImage = tagImageDiv.querySelector('img');
        this.loadSortingSummarySVGs()
        // Placing in the UI to container
        // const container = document.querySelector('.container');
        // container.insertBefore(this.filterSortingSwitchContainer, container.childNodes[2]); // inserting after song-list
    }

    setTagsSortingView(changeToState = 'toggle'){
        // 1. Deciding Which state we want to have after this function runs
        // if we just want to toggle the current state
        if (changeToState  === 'toggle') {
            // If we currently in 2Dselector (energy-popularity sorting)
            if (this.twoDSelector.style.display === 'block') {
                changeToState = 'tags-filter'; // song count is tags mode
            }
            else{
                // We want to change to sortingfd
                changeToState = 'sorting-criteria';
            }            
        }

        if (
            changeToState !== 'tags-filter' &&
            changeToState !== 'sorting-criteria'
          ) {
            // Invalid state, throw an error or handle the situation accordingly
            console.log("bad value of changeToState = " + changeToState);
            changeToState = 'tags-filter';
          }

        if (changeToState === 'sorting-criteria') {
            // 2a. apply the highlight change
            this.sortTextInSummaryObject.style.color = '#E6E6EA';
            this.sortTextInSummaryObject.style.fontWeight = '600';
            this.songTextInSummaryObject.style.color = '#CDCDD6';
            this.songTextInSummaryObject.style.fontWeight = '200';
            // highlight
            this.highlight.style.transform = 'translateX(102%)';


            // 3a. show / hide the sections
            this.tagCatalogElement.style.display = 'none';
            this.twoDSelector.style.display = 'block';
        } else {

            // 2b. apply the highlight change
            this.songTextInSummaryObject.style.color = '#E6E6EA';
            this.songTextInSummaryObject.style.fontWeight = '600';
            this.sortTextInSummaryObject.style.color = '#CDCDD6';
            this.sortTextInSummaryObject.style.fontWeight = '300';
            //highlight
            this.highlight.style.transform = 'translateX(-2%)';


             // 3b. show / hide the sections
            this.tagCatalogElement.style.display = 'block';
            this.twoDSelector.style.display = 'none';
        }

    }

 

    // __________________________________ BPM __________________________________
    // Set the BPM range and update the song list
    

    setBpmRange(bpmRange) {
        // Activate / deactivate the filter

        if (typeof bpmRange === 'boolean') {
            this.isBpmFilterActive = false
            logEventToAnalytics("set-bpm-range", "range-setter","bpm-range-off", false  );
        }
        else{
            // It's a number, and we want to filter according to it. 
            this.isBpmFilterActive = true
            //and update it obviously
            this.bpmRange = bpmRange;
            logEventToAnalytics("set-bpm-range", "range-setter","bpm-range-on", bpmRange  );

        }
        this.#updateSongList();
    }


    setKeyRange(keyRange) {
        // Activate / deactivate the fi
        if (typeof keyRange === 'boolean') {
            this.isKeyFilterActive = false
            logEventToAnalytics("set-key-range", "range-setter","key-range-off", false  );

        }
        // It's a number, and we want to filter according to it. 
        else{
            this.isKeyFilterActive = true
            //and update it obviously
            this.keyRange = keyRange;
            logEventToAnalytics("set-key-range", "range-setter","key-range-on", keyRange  );

        }
        this.#updateSongList();
    }

    applyTagsFilterToSongs(filterUsSongs){
        this.filteredByTagsSongs = filterUsSongs.filter(song => this.activeTags.every(tag => song.hasTag(tag)));
        return this.filteredByTagsSongs
    }

    // Get songs within the BPM range
    getSongsWithinBpmRange(applyBpmFilterToUs) {
        return applyBpmFilterToUs.filter(song => song.isInBpmRange(this.bpmRange));
    }

    getSongsWithinKeyRange(filterUsSongs) {
        return filterUsSongs.filter(song => this.keyRange.includes(song.key));
    }

    #updateSongList() {
        // Clear the existing song list
        while (this.listOfSongs_UI.firstChild) {
            this.listOfSongs_UI.removeChild(this.listOfSongs_UI.firstChild);
        }
        // Scroll to the top
        this.listOfSongs_UI.scrollTop = 0;


        let newSongList = this.applyTagsFilterToSongs(this.filteredByTagsSongs);

        if (this.isBpmFilterActive)
            newSongList = this.getSongsWithinBpmRange(newSongList); //BPM Filter
        
        if (this.isKeyFilterActive)
            newSongList = this.getSongsWithinKeyRange(newSongList); // Key Filter

        if (this.isPlayCountFilterActive)
            newSongList = this.getSongsWithinPlayCountRange(newSongList); // DJ Play Count Filter

        // _________________________________ TEXT REPLACE __________________________________ START
        this.songTextInSummaryObject.innerText = `${newSongList.length} results`;

        // Update the text
        this.energySpan.innerText = `${Math.round(this.current_energy)}`;
        this.popularitySpan.innerText = `${Math.round(this.current_popularity)}`;

        // _________________________________ TEXT REPLACE __________________________________ END
        // Sort songs based on their distance to the selected point

        this.currentSortedSongs = this.sortByProximity(this.current_energy, this.current_popularity, newSongList);
            
        
        // Reset the startIndex
        this.startIndex = 0;

        this.#loadMoreTracks();


        // Initially load the songs

    }

    getSongsWithinPlayCountRange(filterUsSongs) {
        return filterUsSongs.filter(song => song.isPlayCountInRange(this.playCountRange));
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
        /////////// UI Update
        if (tags.length < 1){         
            this.tagImage.src = 'images/tags.svg'; // 'images/colored/tags.svg', 
        }
        else{
            this.tagImage.src = 'images/colored/tags.svg'; // 'images/colored/tags.svg', 

        }

        this.activeTags = tags;
        logEventToAnalytics("set-active-tags", "tag-modified","tags-activated", tags);

        this.#updateSongList();
        
        // and if we added, we can just filter more deeply into the current collection
    }


    // __________________________________ Tags __________________________________ END
    updateTracksSorting(energy = KEYS_LOGIC.DEFAULT_ENERGY, popularity= KEYS_LOGIC.DEFAULT_POPULARITY){
        this.current_energy = energy;
        this.current_popularity = popularity;
        this.#updateSongList(energy, popularity);
        logEventToAnalytics("2d-selector-modified-energy-popularity", "set-energy-n-popularity-sorting","sorting-popularity-energy-changed", [energy, popularity] );

    }


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


    copySongsToClipboard() {
        // If there are no songs, we don't need to copy anything
        if (!this.currentSortedSongs.length) {
            console.log('No songs to copy');
            showToast('No songs to copy');  // Show a toast to indicate no songs were copied
            return;
        }
    
        // If there are less than 100 songs, copy them all; otherwise, copy the first 100
        let songsToCopy = this.currentSortedSongs.length > 100 ? this.currentSortedSongs.slice(0, 250) : this.currentSortedSongs;
        
        // Map over the songs to create an array of strings, each string is a CSV row
        const csvContent = songsToCopy.map(song => `${song.artist} - ${song.trackTitle}` ).join('\n');
        // const csvContent = songsToCopy.map(song => `${song.artist} - ${song.trackTitle} | Energy: ${song.energy} Popularity ${song.popularity}` ).join('\n');
    
        // Use the Clipboard API to copy the text to the clipboard
        navigator.clipboard.writeText(csvContent).then(() => {
            console.log('Copied song list to clipboard');
            showToast('Current tracklist copied to clipboard');  // Show a toast after successful copying
        }).catch(err => {
            console.error('Error copying song list to clipboard', err);
        });
    }
    
    
    loadSortingSummarySVGs() {
        this.energyImage = document.createElement('img');
        this.energyImage.src = 'images/colored/energy-colored.svg';
        this.energyImage.style.width = '1.1rem';
        this.energyImage.style.height = '1.1rem';
        this.energyImage.style.transform = 'translateY(0.1rem)';
        this.energyImage.style.marginRight = '0.3rem';  // add right margin to create space after the image
    
        this.popularityImage = document.createElement('img');
        this.popularityImage.src = 'images/colored/Popular-trendy-colored.svg';
        this.popularityImage.style.width = '1.2rem';
        this.popularityImage.style.height = '1.2rem';
        this.popularityImage.style.transform = 'translateY(0.3rem)';
        this.popularityImage.style.marginRight = '0.6rem';  // add right margin to create space after the image
    
        this.energySpan = document.createElement('span');
        this.energySpan.style.fontSize = '1.1rem';  // set the font size
        this.energySpan.style.marginRight = '1rem';  // add right margin to create space after the text
    
        this.seperator = document.createElement('span');
        this.seperator.innerText = `|`;
        this.seperator.style.fontSize = '1.0rem';  // set the font size
        this.seperator.style.fontWeight = '100'
        this.seperator.style.marginRight = '1.0rem';  // add right margin to create space after the text
    
        this.popularitySpan = document.createElement('span');
        this.popularitySpan.style.fontSize = '1.1rem';  // set the font size
    
        // Append images and spans to sortTextInSummaryObject
        this.sortTextInSummaryObject.appendChild(this.energyImage);
        this.sortTextInSummaryObject.appendChild(this.energySpan);
        this.sortTextInSummaryObject.appendChild(this.seperator);
        this.sortTextInSummaryObject.appendChild(this.popularityImage);
        this.sortTextInSummaryObject.appendChild(this.popularitySpan);
    }

    setGraphManager(graphManager) {
        this.graphManager = graphManager;
    }





    createLoadMoreTracksBtn(){
        // The amount of songs to load each time
        this.loadCount = 30;

        this.loadMoreButton = document.createElement('button');
        this.loadMoreButton.id = 'load-more-tracks-btn';
        this.loadMoreButton.textContent = 'See More';
        this.loadMoreButton.addEventListener('click', () => {
            this.#loadMoreTracks()
            showToast("You can sort the songs by energy and popularity, it is the best way to explore the results")
            this.setTagsSortingView('sorting-criteria');
            this.graphManager.animateDot();
        });
        this.createPlayCountStateCircle();

        this.listOfSongs_UI.appendChild(this.loadMoreButton);
    }

    createPlayCountStateCircle() {
        this.playCountStates = [[0,150], [4,150], [10,150]];
        this.currentStateIndex = 0;

        // Right click event listener
        this.loadMoreButton.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.setPlayCountRange();
        });

        // Mobile long press event listener
        let pressTimer;
        this.loadMoreButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            pressTimer = setTimeout(this.setPlayCountRange.bind(this), 1000);  // Trigger after one second
        });
        this.loadMoreButton.addEventListener('touchend', (e) => {
            clearTimeout(pressTimer);
        });
    }

    setPlayCountRange() {
        this.currentStateIndex = (this.currentStateIndex + 1) % this.playCountStates.length;
        this.playCountRange = this.playCountStates[this.currentStateIndex];
        showToast("Toggled Filter PlayCount, to minimum "
         +  this.playCountRange[0] +
          " Plays! got into the pro stuff ha?" );
        this.#updateSongList();
    }

    #loadMoreTracks() {
        // Remove the Load More button (it should be after all the songs)
        if (this.listOfSongs_UI.lastChild) {
            this.listOfSongs_UI.removeChild(this.listOfSongs_UI.lastChild);
        }

        // Display sorted songs
        this.currentSortedSongs.slice(this.startIndex, this.startIndex + this.loadCount).forEach((song, index) => {
            const songUI = new SongListItemUI(song);
            const listItem = songUI.createCollapsedState();
            listItem.dataset.index = this.startIndex + index; // Adjust the index
            this.listOfSongs_UI.appendChild(listItem);
        });

        // Increase the startIndex 
        this.startIndex += this.loadCount;

        // Show the 'See More' button if there are more songs to load
        if (this.currentSortedSongs.length > this.startIndex) {
            this.listOfSongs_UI.appendChild(this.loadMoreButton);
        }
        
    }

   
    

} 