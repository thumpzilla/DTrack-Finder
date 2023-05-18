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

        // Tags
        const tagNames = [`🥁${this.song.bpm}`, `🎻${this.song.key}`,
         `⚡️${this.song.energy}`, `💡${this.song.popularity}`, `▶️${this.song.djPlayCount}`];
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
        const myTagsList = this.createUIListOfTags(this.song.myTags);
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
