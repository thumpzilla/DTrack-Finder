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



    createExpandedState(listItem) {
        const detailsContainer = document.createElement('div');
        detailsContainer.className = 'song-details';
        // If rating is empty (for some reason the length of it is 5 when it's empty...)
        if ((this.song.rating).length > 5 ){
            const ratingDiv = document.createElement('div');
            ratingDiv.className = 'song-rating';
            ratingDiv.textContent = `rating : ${this.song.rating}`;
            detailsContainer.appendChild(ratingDiv);
        }

        // Tags
        const tagNames = [`🥁${this.song.bpm}`, `🎻${this.song.key}`,
         `⚡️${this.song.energy}`, `💡${this.song.popularity}`, `▶️${this.song.djPlayCount}`];
        const tagsContainer = this.createUIListOfTags(tagNames);
        detailsContainer.appendChild(tagsContainer);


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
        tagsContainer.title = "🥁=BPM, 🎻=Key, ⚡️=Energy, 💡=Popularity "

        
        for (let tagName of tagsList) {
            const tag = this.createTagUI(tagName);
            tagsContainer.appendChild(tag);
        }

        return tagsContainer;
    }

    createTagUI(tagName, tagDescription = "") {
        const tag = document.createElement('span');
        tag.className = 'tag';
        tag.textContent = tagName;
        return tag;
    }
}
