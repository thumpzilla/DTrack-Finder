const canvas = document.getElementById('musicGraph');
const ctx = canvas.getContext('2d');
const selectedPoint = document.getElementById('selectedPoint');
const songList = document.getElementById('songs');//'#song-list'

const width = 300;
const height = 300;

canvas.width = width;
canvas.height = height;



class Song {
    constructor(name, popularity, energy, startTimeMs, endTimeMs, waveformLength, link) {
        this.name = name;
        this.popularity = popularity;
        this.energy = energy;
        this.startTimeMs = startTimeMs;
        this.endTimeMs = endTimeMs;
        this.waveform = generateRandomFloats(waveformLength, 0.1, 1);
        this.link = link;
    }

    // Add methods as needed
    display() {
        return `${this.title} (Energy: ${this.energy}, Popularity: ${this.popularity})`;
    }

}
const songs = [
    new Song('Song 1', 2, 8, 0, 180000, 100, 'https://example.com/song1'),
    new Song('Song 2', 5, 4, 30000, 210000, 150, 'https://example.com/song2'),
    new Song('Song 3', 7, 6, 10000, 240000, 240, 'https://example.com/song3'),
    new Song('Song 4', 1, 9, 45000, 300000, 80, 'https://example.com/song4'),
    new Song('Song 5', 8, 3, 70000, 270000, 8, 'https://example.com/song5'),
    new Song('Song 6', 4, 7, 5000, 180000, 500, 'https://example.com/song6'),
];

function generateRandomFloats(amountOfNumbers, minValue, maxValue) {
    const floats = [];

    for (let i = 0; i < amountOfNumbers; i++) {
        const randomFloat = Math.random() * (maxValue - minValue) + minValue;
        floats.push(randomFloat);
    }

    return floats;
}

function drawGraph() {
    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = '#000';
    ctx.lineWidth = 0.1;
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();
}



function showSongDetails(song, listItem) {
    const detailsContainer = document.createElement('div');
    detailsContainer.className = 'song-details';

    const startTime = document.createElement('p');
    startTime.textContent = `Start Time: ${song.startTimeMs} ms`;
    detailsContainer.appendChild(startTime);

    const endTime = document.createElement('p');
    endTime.textContent = `End Time: ${song.endTimeMs} ms`;
    detailsContainer.appendChild(endTime);

    const link = document.createElement('p');
    link.textContent = `link: ${song.link}`;
    detailsContainer.appendChild(link);

    // Add the waveform canvas to the details container
    const waveformContainer = document.createElement('div');
    waveformContainer.className = 'waveform-container';
    
    const waveformCanvas = drawWaveform(song.waveform);
    waveformContainer.appendChild(waveformCanvas);
    detailsContainer.appendChild(waveformContainer);

      // Add a copy button
      const copyButton = document.createElement('button');
      copyButton.textContent = 'Copy song name';
      copyButton.className = 'copy-button';
      detailsContainer.appendChild(copyButton);
  
      // Add a click event listener to the copy button
      copyButton.addEventListener('click', () => {
          // Create a temporary textarea element to hold the song name
          const tempTextarea = document.createElement('textarea');
          tempTextarea.value = song.name;
          document.body.appendChild(tempTextarea);
          tempTextarea.select();
          document.execCommand('copy');
          document.body.removeChild(tempTextarea);
        
          // Show a message that the song name has been copied
          alert(`Copied "${song.name}" to clipboard`);
          showToast(`Copied "${song.name}" to clipboard`);

      });
  
      listItem.appendChild(detailsContainer);
  }

function sortByProximity(songs, energy, popularity) {
    return songs.sort((a, b) => {
        const aDistance = Math.sqrt(Math.pow(a.energy - energy, 2) + Math.pow(a.popularity - popularity, 2));
        const bDistance = Math.sqrt(Math.pow(b.energy - energy, 2) + Math.pow(b.popularity - popularity, 2));
        return aDistance - bDistance;
    });
}

function drawDot(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, 2 * Math.PI);
    ctx.fillStyle = '#E1306C';
    ctx.fill();
}

function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function updateSongList(sortedSongs, selectedPopularity, selectedEnergy) {

    // Clear the existing song list
    while (songList.firstChild) {
        songList.removeChild(songList.firstChild);
    }

    // Sort songs based on their distance to the selected point
    sortedSongs = songs.slice().sort((a, b) => {
        const aDistance = distance(a.popularity, a.energy, selectedPopularity, selectedEnergy);
        const bDistance = distance(b.popularity, b.energy, selectedPopularity, selectedEnergy);
        return aDistance - bDistance;
    });

    // Display sorted songs (only first 5)
    sortedSongs.slice(0, 5).forEach((song, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${song.name} (popularity: ${song.popularity}, energy: ${song.energy})`;
        listItem.dataset.index = index;
        listItem.dataset.song = JSON.stringify(song); // Store the song object as a string
        songList.appendChild(listItem);
    });
}


canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    // Ranging at [1,10]
    const energy = Math.round((x / width) * 9) + 1; // Change the scaling factor and add 1
    const popularity = Math.round(((height - y) / height) * 9) + 1; // Change the scaling factor and add 1
    drawGraph(); // Clear and redraw the graph
    drawDot(x, y); // Draw the new dot

    selectedPoint.textContent = `Selected Point: Energy ${energy}, Popularity ${popularity}`;

    // Removed the `getSongs` function call and directly use the `songs` array
    const sortedSongs = sortByProximity(songs, energy, popularity);
    console.log(sortedSongs)
    updateSongList(sortedSongs, popularity, energy);

});

songList.addEventListener('click', (event) => {
    if (event.target.tagName === 'LI') {
        const song = JSON.parse(event.target.dataset.song); // Retrieve the song object from the dataset

        if (event.target.querySelector('.song-details')) { // If it's already open, close it.
            event.target.removeChild(event.target.querySelector('.song-details'));
        } else {
            showSongDetails(song, event.target);
        }
        
    }
});

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

function drawWaveform(waveform) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const containerWidth = 250; // Convert 3rem to pixels (assuming 16px as the default font size)
    const spacing = 0.1; // 0.1px spacing
    const numberOfBars = waveform.length;

    const canvasWidth = containerWidth - (spacing * (numberOfBars - 1)); // Subtracting the total spacing
    const barWidth = canvasWidth / numberOfBars;

    canvas.width = canvasWidth;
    canvas.height = 5;

    waveform.forEach((amplitude, index) => {
        const x = index * (barWidth + spacing);
        const barHeight = amplitude * canvas.height;
        const y = canvas.height - barHeight;

        ctx.fillStyle = '#E1306C'; // Instagram pink color
        ctx.fillRect(x, y, barWidth, barHeight);
    });

    return canvas;
}


drawGraph();

