import  Song from './Song.js'
import { showToast } from './Utils.js'


export default class SongListItemUI {
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
    
        const artist = document.createElement('div');
        artist.className = 'song-artist';
        artist.textContent = `${this.song.artist}`;
        leftContainer.appendChild(artist);
        container.appendChild(leftContainer);

        const copyButton = this.createCopyButton();
        container.appendChild(copyButton);

        listItem.appendChild(container);
        listItem.dataset.song = JSON.stringify(this.song);
        return listItem;
    }


    createSpotifyLink() {
        const spotifyLink = document.createElement('a');
        spotifyLink.alignItems = 'center';
        spotifyLink.href = `https://open.spotify.com/track/${this.song.additional_info.id}`;
        spotifyLink.style.fontSize = '1rem'; // Keeping text size consistent
        spotifyLink.style.color = '#FE8C2A'; // Change the color to blue (or any other desired color)
        spotifyLink.style.textDecoration = 'none'; // Remove underline from text
        spotifyLink.style.display = 'flex'; // Align items along a row
        spotifyLink.style.alignItems = 'center'; // Center items vertically in the container
        spotifyLink.style.marginBottom = '1rem'; // Center items vertically in the container

    
        const spotifyIcon = document.createElement('img');
        spotifyIcon.src = 'images/colored/Spotify-colored.svg';
        spotifyIcon.alt = 'Play on Spotify';
        spotifyIcon.style.marginLeft = '1rem'; // Add some spacing between the SVG and the text

        spotifyIcon.style.width = '1.3rem'; // Set the width of the SVG image
    
        const playNowText = document.createElement('span');
        playNowText.textContent = 'Play Now';
        spotifyLink.appendChild(playNowText);
        spotifyLink.appendChild(spotifyIcon);

    
        spotifyLink.addEventListener('click', (e) => {
            // Get user's preference from local storage
            let openInApp = localStorage.getItem('openInApp');
            
            // If user's preference is not saved yet, ask for it
            if (openInApp === null) {
                openInApp = confirm('Do you want to open the link in the Spotify app?');
                // Save user's preference to local storage
                localStorage.setItem('openInApp', openInApp);
            }
    
            if (openInApp === 'true') {
                e.preventDefault();
                spotifyLink.href = `spotify:track:${this.song.additional_info.id}`;
                window.location.href = spotifyLink.href;
            } else {
                spotifyLink.target = '_blank'; // Open link in a new tab
            }
        });
    
        return spotifyLink;
    }


    createExpandedState(listItem) {
        const detailsContainer = document.createElement('div');
        detailsContainer.className = 'song-details';
        // If rating is empty (for some reason the length of it is 5 when it's empty...)
        console.log(this.song.rating.length)
        if (this.song.rating.length > 5 && this.song.rating.length <= 10) {
            const ratingDiv = document.createElement('div');
            ratingDiv.className = 'song-rating';
            ratingDiv.textContent = `rating : ${this.song.rating}`;
            detailsContainer.appendChild(ratingDiv);
        }
    
        // Tags
        // Tags
        const tagNames = [
            { icon: 'images/colored/drum-colored.svg', text: this.song.bpm },
            { icon: 'images/colored/sound_note-colored.svg', text: this.song.key },
            { icon: 'images/colored/energy-colored.svg', text: this.song.energy },
            { icon: 'images/colored/Popular-trendy-colored.svg', text: this.song.popularity },
            { icon: 'images/colored/play-colored.svg', text: this.song.djPlayCount }
        ];
        const tagsContainer = this.createUIListOfTags(tagNames);
        detailsContainer.appendChild(tagsContainer);
       
        // Adding Additional Info
        if(this.song.additional_info) {
            
            const additionalInfoDiv = document.createElement('div');
            additionalInfoDiv.className = 'song-additional-info';
            additionalInfoDiv.style.marginTop = '0.6rem'; // Adding space from top

            if (this.song.additional_info.id) {
                const spotifyLink = this.createSpotifyLink();
                additionalInfoDiv.appendChild(spotifyLink);
                additionalInfoDiv.appendChild(spotifyLink);
              }
            const releaseDateDiv = document.createElement('div');
            releaseDateDiv.textContent = `Release Date: ${this.song.additional_info.release_date}`;
            releaseDateDiv.style.fontSize = '0.9rem'; // Decreasing text size
            additionalInfoDiv.appendChild(releaseDateDiv);
    
            const genresDiv = document.createElement('div');
            genresDiv.textContent = `Sub-genres: ${this.song.additional_info.genres.join(' | ')}`;
            genresDiv.style.fontSize = '0.9rem'; // Decreasing text size
            additionalInfoDiv.appendChild(genresDiv);
    
            const happinessDiv = document.createElement('div');
            happinessDiv.textContent = `Happiness: ${Math.round(this.song.additional_info.happiness)}`;
            happinessDiv.style.fontSize = '0.9rem'; // Decreasing text size
            additionalInfoDiv.appendChild(happinessDiv);
    
            const danceabilityDiv = document.createElement('div');
            danceabilityDiv.textContent = `Danceability: ${Math.round(this.song.additional_info.danceability)}`;
            danceabilityDiv.style.fontSize = '0.9rem'; // Decreasing text size
            additionalInfoDiv.appendChild(danceabilityDiv);
    
            const explicitDiv = document.createElement('div');
            explicitDiv.textContent = `Is Explicit: ${this.song.additional_info.explicit}`;
            explicitDiv.style.fontSize = '0.9rem'; // Decreasing text size
            additionalInfoDiv.appendChild(explicitDiv);
    

        
            
              detailsContainer.appendChild(additionalInfoDiv);
            }
            
    
        listItem.appendChild(detailsContainer);
    
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
            // take the title + the first word of the artist field
            tempTextarea.value = this.song.trackTitle + ' - ' + this.song.artist.split(" ")[0];
            document.body.appendChild(tempTextarea);
            tempTextarea.select();
            document.execCommand('copy');
            document.body.removeChild(tempTextarea);
    
            showToast(`Copied "${tempTextarea.value }" to clipboard`);
        });
    
        return copyButton;
    }

    createUIListOfTags(tagsList) {
        const tagsContainer = document.createElement('div');
        tagsContainer.className = 'song-tags';
        tagsContainer.title = "Drum=BPM, Sound Note=Key, Energy=Energy, Sound Note=Popularity, Play=DJ Play Count"
        
        for (let tagInfo of tagsList) {
            const tag = this.createTagUI(tagInfo);
            tagsContainer.appendChild(tag);
        }
    
        return tagsContainer;
    }
    

    createTagUI(tagInfo) {
        const tag = document.createElement('span');
        tag.className = 'tag';
        
        // Create the SVG image and add it to the tag
        const tagIcon = document.createElement('img');
        tagIcon.src = tagInfo.icon;
        tagIcon.alt = tagInfo.text;
        tagIcon.className = 'tag-icon';
        tag.appendChild(tagIcon);
    
        // Add text next to the image
        const tagText = document.createElement('span');
        tagText.textContent = tagInfo.text;
        tag.appendChild(tagText);
    
        return tag;
    }
}
