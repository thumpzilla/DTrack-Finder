// const ctx = canvas.getContext('2d');
// const selectedPoint = document.getElementById('selectedPoint');

const canvas = document.getElementById('musicGraph');
const songList = document.getElementById('songs');//'#song-list'

const width = 300;
const height = 300;

canvas.width = width;
canvas.height = height;



class Song {
    constructor(trackTitle, artist, bpm, key, djPlayCount, rating, myTag, energy, popularity) {
        this.trackTitle = trackTitle; 
        this.artist = artist;
        this.bpm = Math.round(bpm);
        this.key = key;
        this.djPlayCount = djPlayCount;
        this.rating = rating;
        this.myTag = myTag;
        this.energy = energy;
        this.popularity = popularity;
    }

    // Add methods as needed
    display() {
        return `${this.trackTitle} (Energy: ${this.energy}, Popularity: ${this.popularity})`;
    }

    isInBpmRange(bpmRange) {
        //return (minValue < this.bpm < maxValue)
        return this.bpm >= bpmRange[0] && this.bpm <= bpmRange[1];
    }
}




class SongManager {
    constructor(songs) {
        this.songs = songs;
        this.bpmRange = [60, 140]; // Default BPM range
    }

    // Set the BPM range and update the song list
    setBpmRange(bpmRange) {
        this.bpmRange = bpmRange;
        this.updateSongList();
    }

    // Get songs within the BPM range
    getSongsWithinBpmRange() {
        return this.songs.filter(song => song.isInBpmRange(this.bpmRange));
    }

    distance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }

    sortByProximity(energy, popularity) {
        return this.songs.sort((a, b) => {
            const aDistance = this.distance(a.popularity, a.energy, popularity, energy);
            const bDistance = this.distance(b.popularity, b.energy, popularity, energy);
            return aDistance - bDistance;
        });
    }
    
    // Update the song list based on the current BPM range
    updateSongList(energy, popularity) {
        // Clear the existing song list
        while (songList.firstChild) {
            songList.removeChild(songList.firstChild);
        }

        let filteredSongs = this.getSongsWithinBpmRange();

        // Sort songs based on their distance to the selected point
        const sortedSongs = this.sortByProximity(energy, popularity);

        // Display sorted songs (only first 5)
        filteredSongs.slice(0, 6).forEach((song, index) => {
            const songUI = new SongListItemUI(song);
            const listItem = songUI.createCollapsedState();
            listItem.dataset.index = index;
            songList.appendChild(listItem);
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

class SongListItemUI {
    constructor(song) {
        this.song = song;
    }

    createCollapsedState() {
        const listItem = document.createElement('li');
        const container = document.createElement('div');
        container.className = 'copy-btn-container';

        const leftContainer = document.createElement('div');
        leftContainer.className = 'left-container';

        const title = document.createElement('div');
        title.className = 'song-title';
        title.textContent = `${this.song.trackTitle}`;
        leftContainer.appendChild(title);

        // Tags
        const tagNames = [`🥁${this.song.bpm}`, `🎻${this.song.key}`,
         `⚡️${this.song.energy}`, `🎤${this.song.popularity}`, `▶️${this.song.djPlayCount}`];
        const tagsContainer = this.createUIListOfTags(tagNames);
        leftContainer.appendChild(tagsContainer);

        container.appendChild(leftContainer);

        const copyButton = this.createCopyButton();
        container.appendChild(copyButton);

        listItem.appendChild(container);
        listItem.dataset.song = JSON.stringify(this.song);
        return listItem;
    }



    createExpandedState(listItem) {
        const detailsContainer = document.createElement('div');
        detailsContainer.className = 'song-details';

        const artist = document.createElement('p');
        artist.textContent = `By: ${this.song.artist}`;
        detailsContainer.appendChild(artist);

        listItem.appendChild(detailsContainer);

        // My Tag
        const myTag = document.createElement('p');
        let separetedTags = String(this.song.myTag).split(',')

        // Filter out tags that start with 'E' or 'P' followed by a number
        separetedTags = separetedTags.filter(tag => {
            return !(/^[EP]\d+/.test(tag.trim()));
        });

        const myTagsList = this.createUIListOfTags(separetedTags);
        
        detailsContainer.appendChild(myTagsList);

        return listItem;
    }

    createCopyButton() {
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
    
        const image = document.createElement('img');
        image.src = 'images/copy.png'; // The path to your image
        image.alt = 'Copy'; // Alt text for accessibility
        image.className = 'copy-icon'; // You may want to add some styling to the image
    
        copyButton.appendChild(image);
    
        copyButton.addEventListener('click', () => {
            const tempTextarea = document.createElement('textarea');
            tempTextarea.value = this.song.trackTitle;
            document.body.appendChild(tempTextarea);
            tempTextarea.select();
            document.execCommand('copy');
            document.body.removeChild(tempTextarea);
    
            showToast(`Copied "${this.song.trackTitle}" to clipboard`);
        });
    
        return copyButton;
    }

    createUIListOfTags(tagsList) {
        const tagsContainer = document.createElement('div');
        tagsContainer.className = 'song-tags';

        
        for (let tagName of tagsList) {
            const tag = this.createTagUI(tagName);
            tagsContainer.appendChild(tag);
        }

        return tagsContainer;
    }

    createTagUI(tagName) {
        const tag = document.createElement('span');
        tag.className = 'tag';
        tag.textContent = tagName;
        return tag;
    }
}

    
// Function to create SongExample instances from JSON data
async function createSongExamplesFromJson() {
    try {
        let response = await fetch('data/DTRacks All 1200 DTracks.json');
        if (!response.ok) { // Check if response went through
            console.error("HTTP Error Response: " + response.status);
            return;
        }
        let data = await response.json();
        let songExamples = data.map(item => new Song(item['Track Title'], item['Artist'], item['BPM'], item['Key'], item['DJ Play Count'], item['Rating'], item['My Tag'], item['Energy'], item['Popularity']));
        return songExamples;
    } catch (error) {
        console.error("Problem with fetch operation: ", error);
    }
}





function generateRandomFloats(amountOfNumbers, minValue, maxValue) {
    const floats = [];

    for (let i = 0; i < amountOfNumbers; i++) {
        const randomFloat = Math.random() * (maxValue - minValue) + minValue;
        floats.push(randomFloat);
    }

    return floats;
}





function showSongDetails(song, listItem) {
    const detailsContainer = document.createElement('div');
    detailsContainer.className = 'song-details';

    // // Track Title
    // const trackTitle = document.createElement('p');
    // trackTitle.textContent = `Track Title: ${song.trackTitle}`;
    // detailsContainer.appendChild(trackTitle);

    // Artist
    const artist = document.createElement('p');
    artist.textContent = `By: ${song.artist}`;
    detailsContainer.appendChild(artist);

    // // BPM
    // const bpm = document.createElement('p');
    // bpm.textContent = `BPM: ${song.bpm}`;
    // detailsContainer.appendChild(bpm);

    // // Key
    // const key = document.createElement('p');
    // key.textContent = `Key: ${song.key}`;
    // detailsContainer.appendChild(key);

    // // DJ Play Count
    // const djPlayCount = document.createElement('p');
    // djPlayCount.textContent = `DJ Play Count: ${song.djPlayCount}`;
    // detailsContainer.appendChild(djPlayCount);

    // // Rating
    // const rating = document.createElement('p');
    // rating.textContent = `Rating: ${song.rating}`;
    // detailsContainer.appendChild(rating);

    // // My Tag
    // const myTag = document.createElement('p');
    // myTag.textContent = `My Tag: ${song.myTag}`;
    // detailsContainer.appendChild(myTag);



    // Add a copy button
    const copyButton = document.createElement('button');
    copyButton.textContent = 'Copy song name';
    copyButton.className = 'copy-button';
    detailsContainer.appendChild(copyButton);

    // Add a click event listener to the copy button
    copyButton.addEventListener('click', () => {
        // Create a temporary textarea element to hold the song name
        const tempTextarea = document.createElement('textarea');
        tempTextarea.value = song.trackTitle;
        document.body.appendChild(tempTextarea);
        tempTextarea.select();
        document.execCommand('copy');
        document.body.removeChild(tempTextarea);
      
        // Show a message that the song name has been copied
        alert(`Copied "${song.trackTitle}" to clipboard`);
        showToast(`Copied "${song.trackTitle}" to clipboard`);
    });

    // // Energy
    // const energy = document.createElement('p');
    // energy.textContent = `Energy: ${song.energy}`;
    // detailsContainer.appendChild(energy);

    // Popularity
    const popularity = document.createElement('p');
    popularity.textContent = `Popularity: ${song.popularity}`;
    detailsContainer.appendChild(popularity);


    listItem.appendChild(detailsContainer);
  }


// __________________________ Graph ____________________ Start
class GraphManager {
    constructor(canvasId, width, height) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.width = width;
        this.height = height;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.selectedPoint = document.getElementById('selectedPoint');
        this.songList = document.getElementById('songs');
    }

    drawGraph() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        this.ctx.strokeStyle = '#F5F5F7';
        this.ctx.lineWidth = 0.1;
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.height / 2);
        this.ctx.lineTo(this.width, this.height / 2);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(this.width / 2, 0);
        this.ctx.lineTo(this.width / 2, this.height);
        this.ctx.stroke();
    }

    drawDot(x, y) {
        // Draw the white background
        this.ctx.beginPath();
        this.ctx.arc(x, y, 12, 0, 2 * Math.PI);
        this.ctx.fillStyle = '#fff';
        this.ctx.fill();
        
        // Draw the colored dot on top
        this.ctx.beginPath();
        this.ctx.arc(x, y, 10, 0, 2 * Math.PI); // Reduced the radius a bit to create a border effect
        this.ctx.fillStyle = '#8639DB';
        this.ctx.fill();
    }

    handleClick(event, songManager) {
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        // Ranging at [1,10]
        const energy = (x / this.width) * 9 + 1; // Change the scaling factor and add 1
        const popularity = ((this.height - y) / this.height) * 9 + 1; // Change the scaling factor and add 1

        const energyRounded = Math.round(energy); // Change the scaling factor and add 1
        const popularityRounded = Math.round(popularity); 
        this.drawGraph(); // Clear and redraw the graph
        this.drawDot(x, y); // Draw the new dot

        this.selectedPoint.textContent = `Selected Point: Energy ${energyRounded}, Popularity ${popularityRounded}`;

        songManager.updateSongList(energy, popularity);
    }

    initializeInteraction(songManager) {
        this.canvas.addEventListener('click', (event) => this.handleClick(event, songManager));
    }
}





// __________________________ Graph ____________________ End


songList.addEventListener('click', (event) => songManager.handleListClick(event));

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    // Set a timeout to remove the toast after 3 seconds
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 1000);
    }, 3000);
}


/* _______________ BPM SLIDERS___________________ START */


class BpmSlider {
    constructor(songManager) {
      this.sliderRange = document.getElementById("slider-range");
      this.sliderThumb = document.getElementById("slider-thumb");
      this.rangeValueElement = document.getElementById("range-value");
      this.dataBubble = document.getElementById("data-bubble");
      this.songManager = songManager
      this.min = 60;
      this.max = 140;
      this.rangeValues = [2, 6, 12]; // Range values
  
      this.currentValue = 100; // Default value
      this.currentRangeValue = this.rangeValues[0]; // Default range
      this.rangeValueIndex = 0; // Start with the first value
  
      this.sliderThumb.addEventListener("mousedown", this.moveSliderThumb.bind(this));
      this.dataBubble.addEventListener("click", this.updateRange.bind(this));
  
      this.updateUI();
    }
  
    updateThumbPosition(value) {
      const percentage = ((value - this.min) / (this.max - this.min)) * 100;
      this.sliderThumb.style.left = percentage + "%";
    }
  
    updateValuePosition() {
      const sliderValue = document.getElementById("slider-value");
      sliderValue.style.left = this.sliderThumb.style.left;
    }
  
    updateCurrentValue(value) {
      const pickedValueElement = document.getElementById("picked-value");
      pickedValueElement.textContent = value;
    }
  
    updateRangeValue(value) {
      this.rangeValueElement.textContent = '± ' + value;
    }
  
    updateUI() {
      const minValue = Math.max(this.min, this.currentValue - this.currentRangeValue);
      const maxValue = Math.min(this.max, this.currentValue + this.currentRangeValue);
      this.songManager.setBpmRange([minValue, maxValue]);
      this.updateThumbPosition(this.currentValue);
      this.updateValuePosition();
      this.updateCurrentValue(this.currentValue);
      this.updateRangeValue(this.currentRangeValue);
  
      const sliderActiveRange = document.getElementById("slider-active-range");
      const rangePercentage = ((this.currentRangeValue) / (this.max - this.min)) * 100;
      const leftPercentage = Math.max(0, parseFloat(this.sliderThumb.style.left) - rangePercentage);
      const rightPercentage = Math.min(100, parseFloat(this.sliderThumb.style.left) + rangePercentage);
      
      sliderActiveRange.style.left = leftPercentage + "%";
      sliderActiveRange.style.width = (rightPercentage - leftPercentage) + "%";
    }
  
    moveSliderThumb(event) {
      event.preventDefault();
  
      const sliderRect = this.sliderRange.getBoundingClientRect();
      const minPos = sliderRect.left;
      const maxPos = sliderRect.right;
      const sliderWidth = maxPos - minPos;
  
      const onMouseMove = (e) => {
        let position = e.clientX - minPos;
        position = Math.max(0, Math.min(position, sliderWidth));
        const percentage = (position / sliderWidth) * 100;
        this.sliderThumb.style.left = percentage + "%";
  
        const value = Math.round(((this.max - this.min) * percentage) / 100) + this.min;
        this.currentValue = value;
  
        this.updateUI();
      };
  
      const onMouseUp = () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };
  
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    }
  
    updateRange() {
      this.rangeValueIndex = (this.rangeValueIndex + 1) % this.rangeValues.length; // Cycle through the range values
      this.currentRangeValue = this.rangeValues[this.rangeValueIndex];
      this.rangeValueElement.style.transform = 'translate(-50%, 0%) scale(1.1)'; // Animate the change
      setTimeout(() => {
        this.rangeValueElement.style.transform = 'translate(-50%, 0%) scale(1)';
        }, 300); // Reset the scale after the animation
        this.updateUI();
      }
    }
    

let songs = []; 
let songManager;
let graphManager;
let bpmSlider;

canvas.style.pointerEvents = 'none'; // Disable click events

createSongExamplesFromJson().then((result) => {
    songs = result;
    songManager = new SongManager(songs);
    canvas.style.pointerEvents = 'auto'; // Enable click events
    graphManager = new GraphManager('musicGraph', 400, 200);
    graphManager.drawGraph();
    graphManager.initializeInteraction(songManager);
    
    // Instantiate the BpmSlider here
    bpmSlider = new BpmSlider(songManager);

});
    
    
    // Creating the instance after fetching the songs from the json



/* _______________ BPM SLIDERS___________________ END */





/* 
class SongInListUI {
    constructor(song) {
        this.song = song;
        this.collapsedState = this.createCollapsedState();
        this.expandedState = this.createExpandedState();
    }

    createCollapsedState() {
        const listItem = document.createElement('li');
        listItem.className = 'collapsed-song';
        listItem.textContent = `${this.song.trackTitle}        [🥁${this.song.bpm} |🎻${this.song.key}| ⚡️${this.song.energy}]`;

        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.innerHTML = '<img src="copy-icon.png" alt="Copy">';
        listItem.appendChild(copyButton);

        return listItem;
    }

    createExpandedState() {
        const listItem = document.createElement('li');
        listItem.className = 'expanded-song';
        listItem.textContent = `${this.song.trackTitle}        [🥁${this.song.bpm} |🎻${this.song.key}| ⚡️${this.song.energy}]`;

        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.innerHTML = '<img src="copy-icon.png" alt="Copy">';
        listItem.appendChild(copyButton);

        const detailsContainer = document.createElement('div');
        detailsContainer.className = 'song-details';

        const artist = document.createElement('p');
        artist.textContent = `By: ${this.song.artist}`;
        detailsContainer.appendChild(artist);

        const popularity = document.createElement('p');
        popularity.textContent = `Popularity: ${this.song.popularity}`;
        detailsContainer.appendChild(popularity);

        listItem.appendChild(detailsContainer);

        return listItem;


        /*  const detailsContainer = document.createElement('div');
    detailsContainer.className = 'song-details';

    // // Track Title
    // const trackTitle = document.createElement('p');
    // trackTitle.textContent = `Track Title: ${song.trackTitle}`;
    // detailsContainer.appendChild(trackTitle);

    // Artist
    const artist = document.createElement('p');
    artist.textContent = `By: ${song.artist}`;
    detailsContainer.appendChild(artist);

    // // BPM
    // const bpm = document.createElement('p');
    // bpm.textContent = `BPM: ${song.bpm}`;
    // detailsContainer.appendChild(bpm);

    // // Key
    // const key = document.createElement('p');
    // key.textContent = `Key: ${song.key}`;
    // detailsContainer.appendChild(key);

    // // DJ Play Count
    // const djPlayCount = document.createElement('p');
    // djPlayCount.textContent = `DJ Play Count: ${song.djPlayCount}`;
    // detailsContainer.appendChild(djPlayCount);

    // // Rating
    // const rating = document.createElement('p');
    // rating.textContent = `Rating: ${song.rating}`;
    // detailsContainer.appendChild(rating);

    // // My Tag
    // const myTag = document.createElement('p');
    // myTag.textContent = `My Tag: ${song.myTag}`;
    // detailsContainer.appendChild(myTag);



    // Add a copy button
    const copyButton = document.createElement('button');
    copyButton.textContent = 'Copy song name';
    copyButton.className = 'copy-button';
    detailsContainer.appendChild(copyButton);

    // Add a click event listener to the copy button
    copyButton.addEventListener('click', () => {
        // Create a temporary textarea element to hold the song name
        const tempTextarea = document.createElement('textarea');
        tempTextarea.value = song.trackTitle;
        document.body.appendChild(tempTextarea);
        tempTextarea.select();
        document.execCommand('copy');
        document.body.removeChild(tempTextarea);
      
        // Show a message that the song name has been copied
        alert(`Copied "${song.trackTitle}" to clipboard`);
        showToast(`Copied "${song.trackTitle}" to clipboard`);
    });

    // // Energy
    // const energy = document.createElement('p');
    // energy.textContent = `Energy: ${song.energy}`;
    // detailsContainer.appendChild(energy);

    // Popularity
    const popularity = document.createElement('p');
    popularity.textContent = `Popularity: ${song.popularity}`;
    detailsContainer.appendChild(popularity);


    listItem.appendChild(detailsContainer);*/
