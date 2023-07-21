import  Song from './Song.js'
import { showToast, formatSecondsToMinutes, formatViewCountNumber, formatMonthYear} from './Utils.js'


export default class SongListItemUI {
    constructor(song) {
        this.song = song;
        this.isTrackDSet = false;
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
        if (this.song.myTags.includes('Favorite')) {
            // listItem.style.backgroundColor = 'rgba(168, 142, 35, 0.9)';
            // title.style.color = '#FFB319';
            title.classList.add('favorite-song');
        }



        // // means this is youtube dset
        // if (this.song.myTags.includes('DSet')){
        //     title.classList.add('dset-title');
        // }
        leftContainer.appendChild(title);
    
        const artist = document.createElement('div');
        artist.className = 'song-artist';
        artist.textContent = `${this.song.artist}`;
        // means this is youtube dset
        if (this.song.myTags.includes('DSet')){
            artist.classList.add('dset-artist');
            this.isTrackDSet = true
        }
        leftContainer.appendChild(artist);
        container.appendChild(leftContainer);
        
        const copyButton = this.createCopyButton();
        container.appendChild(copyButton);
        
        /*  TODO - Display Tidal button UI
        const tidalButton = this.createTidalButton();
        container.appendChild(tidalButton);
        */

        listItem.appendChild(container);
        listItem.dataset.song = JSON.stringify(this.song);

        ////////////// _______________ ADD SONG TO FAVORITES ________________ Start
        let touchstartX = 0;
        let touchendX = 0;

        function handleGesture() {
            if (touchendX > touchstartX && Math.abs(touchendX - touchstartX) > 50) { // Right swipe
                this.addSongToFavorite(listItem);
            } else if (touchendX < touchstartX && Math.abs(touchendX - touchstartX) > 50) { // Left swipe
                this.removeSongFromFavorite(listItem);
            }
        }

        listItem.addEventListener('touchstart', (e) => {
            touchstartX = e.changedTouches[0].screenX;
        });

        listItem.addEventListener('touchend', (e) => {
            touchendX = e.changedTouches[0].screenX;
            handleGesture.bind(this)();
        });

        // Right click event listener
        listItem.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            if (!this.song.myTags.includes('Favorite')) {
                this.addSongToFavorite(listItem);
            } else {
                this.removeSongFromFavorite(listItem);

            }
        });

        listItem.addEventListener('animationend', () => {
            listItem.classList.remove('swipe-right');
            listItem.classList.remove('swipe-left');
        });

        
        return listItem;
    }

    createCopyButton() {
        const copyButton = document.createElement('button');
        
    
        const image = document.createElement('img');
        if (this.isTrackDSet){
            copyButton.className = 'copy-button-dset';

            image.src = 'images/colored/stage-light-colored.svg'; // The path to your image
            image.alt = 'Copy'; // Alt text for accessibility
            image.className = 'copy-icon-dset'; // You may want to add some styling to the image
            
        }
        // If it's a normal track
        else{
            copyButton.className = 'copy-button';
            image.src = 'images/copy.png'; // The path to your image
            image.alt = 'Copy'; // Alt text for accessibility
            image.className = 'copy-icon'; // You may want to add some styling to the image
        }
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

    addSongToFavorite(listItem){
        this.song.addTagToFavorite();
        listItem.classList.add('swipe-right');
        listItem.querySelector('.song-title').classList.add('favorite-song');
    }

    removeSongFromFavorite(listItem){
        this.song.removeFromFavorite();
        listItem.classList.add('swipe-left');
        listItem.querySelector('.song-title').classList.remove('favorite-song');
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
        // means this is youtube dset
        let tagNames = []; // let instead of const here
        if (this.song.myTags.includes('DSet')) {
            tagNames = [ // no const here
            { icon: 'images/colored/calendar-colored.svg', text: formatMonthYear(this.song.additional_info.dateReleased) },
            { icon: 'images/colored/clock-colored.svg', text: formatSecondsToMinutes(this.song.additional_info.videolength) },
            { icon: 'images/colored/Popular-trendy-colored.svg', text: this.song.popularity },
            { icon: 'images/colored/energy-colored.svg', text: this.song.energy },
            { icon: 'images/colored/drum-colored.svg', text: this.song.bpm }
              
            ];
        }
        else{
            tagNames = [ // no const here
                { icon: 'images/colored/drum-colored.svg', text: this.song.bpm },
                { icon: 'images/colored/sound_note-colored.svg', text: this.song.key },
                { icon: 'images/colored/energy-colored.svg', text: this.song.energy },
                { icon: 'images/colored/Popular-trendy-colored.svg', text: this.song.popularity },
                { icon: 'images/colored/play-colored.svg', text: this.song.djPlayCount }
            ];
        }
        const tagsContainer = this.createUIListOfTags(tagNames);
        detailsContainer.appendChild(tagsContainer);
        // Adding Additional Info
        if(this.song.additional_info) {
            let additionalInfoDiv;
            // means this is youtube dset
            if (this.song.myTags.includes('DSet')) {
                additionalInfoDiv = this.createDSetExpandedView();
            } else {
                additionalInfoDiv = this.createSpotifyExpandedView();
            }
            detailsContainer.appendChild(additionalInfoDiv);
        }
        listItem.appendChild(detailsContainer);
    
        return listItem;
    }



    setBackgroundThumbnailWGradient(additionalInfoDiv) {
    try {
        // Get the thumbnail url
        const thumbnailUrl = this.getThumbnailUrl();
            
        // Set the thumbnail as the background
        additionalInfoDiv.style.backgroundImage = `url(${thumbnailUrl})`;
        additionalInfoDiv.style.backgroundSize = 'cover'; // Make sure the image covers the full div
        additionalInfoDiv.style.backgroundPosition = 'center'; // Center the image within the div
        additionalInfoDiv.style.zIndex = '1'; // Image has lowest z-index

        // Set position relative on the parent element
        additionalInfoDiv.style.position = 'relative';
        additionalInfoDiv.style.borderRadius = '0.2rem';

        // Create pseudo-element for the overlay
        additionalInfoDiv.setAttribute('id', 'dset-info-overlay');
        const style = document.createElement('style');
        
        style.innerHTML = `
            #dset-info-overlay::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 70%; // preserve the 30% width
            bottom: 0; // ensure it doesn't overflow its container
            max-width: 33%;
            min-width: 15rem;
            height: 100%;
            background-color: #222F3E;
            opacity: 0.8;
            border-radius: 0 4rem 4rem 0;
            z-index: 2; // Overlay has second highest z-index
            }
        `;
        document.head.appendChild(style);
    } catch (error) {
        console.error('An error occurred while setting the background thumbnail:', error);
    }
    }

    createTagElement(tagText) {
        const tagElement = document.createElement('div');
        tagElement.className = 'dset-tag'; // Apply the CSS class
        tagElement.textContent = tagText; // Set tag text
        return tagElement;
    }

    createDSetExpandedView() {
        const additionalInfoDiv = document.createElement('div');
        additionalInfoDiv.className = 'dset-additional-info';
        additionalInfoDiv.style.marginTop = '3rem'; // Adding space from top
        const dsetLink = this.createYoutubeLink();
        additionalInfoDiv.appendChild(dsetLink);
        this.setBackgroundThumbnailWGradient(additionalInfoDiv);
        
        const tagsDict = {
            "occasion": ['Workout', 'Bach party', 'Victory Celebration', 'Birthday', 'Wedding', 'Vacation - Freedom', 'Kids Party', 'Corporate Event', 'College Party', '4July'],
            "listenerEngagement": ['Sing Along', 'Dance', 'Jump', 'Cheer Competitors', 'Relaxing', 'Background', 'Workout'],
            "genres": ['Pop', 'EDM', 'Hip Hop', 'Reggaeton', 'Rock', 'Tribal', 'Club-Hotel', 'Psy-Trance', 'Israeli - Kibutz', 'Mizrahit', 'Nostalgic', 'Calm Cover', 'Remake/Edit', 'Dance Remixes']
        }
    
           // Loop over each category in the tags dictionary
    for (let [category, tagsList] of Object.entries(tagsDict)) {
        const matchedTags = this.song.myTags.filter(tag => tagsList.includes(tag));
        if (matchedTags.length > 0) {
            const categoryDiv = document.createElement('div');
            categoryDiv.textContent = `${category}:`;
            categoryDiv.style.fontSize = '0.8rem'; // Decreasing text size
            categoryDiv.style.fontWeight = '600'; // Decreasing text size

            categoryDiv.style.marginBottom = '0.2rem'; // Center items vertically in the container
            additionalInfoDiv.appendChild(categoryDiv);

            // Container for tags
            const tagsContainerDiv = document.createElement('div');
            tagsContainerDiv.style.maxWidth = '33%'; // Set max width
            tagsContainerDiv.style.minWidth = '15rem'; // Ensure minimum width

            tagsContainerDiv.style.overflow = 'hidden'; // Hide overflow content
            
            // tagsContainerDiv.style.whiteSpace = 'nowrap'; // show only the first line

            // Create UI for each tag
            for(let tag of matchedTags) {
                const tagElement = this.createTagElement(tag);
                tagsContainerDiv.appendChild(tagElement);
            }

            additionalInfoDiv.appendChild(tagsContainerDiv);
        }
    }
        
        const viewCountDiv = document.createElement('div');
        const viewCountEasyRead = formatViewCountNumber(this.song.additional_info.viewcount)
        viewCountDiv.textContent = `Views: ${viewCountEasyRead}`;
        viewCountDiv.style.fontSize = '0.9rem'; // Decreasing text size
        viewCountDiv.style.marginBottom = '0.2rem'; // Center items vertically in the container
        additionalInfoDiv.appendChild(viewCountDiv);
        return additionalInfoDiv;
    }


    createSpotifyExpandedView() {
        const additionalInfoDiv = document.createElement('div');
        additionalInfoDiv.className = 'song-additional-info';
        additionalInfoDiv.style.marginTop = '0.6rem'; // Adding space from top
        // If it has spotify Link
        if (this.song.additional_info.id) {
            const spotifyLink = this.createSpotifyLink();
            additionalInfoDiv.appendChild(spotifyLink);
        }
        
        const releaseDateDiv = document.createElement('div');
        releaseDateDiv.textContent = `Release Date: ${this.song.additional_info.release_date}`;
        releaseDateDiv.style.fontSize = '0.9rem'; // Decreasing text size
        releaseDateDiv.style.marginBottom = '0.2rem'; // Center items vertically in the container
        additionalInfoDiv.appendChild(releaseDateDiv);
    
        const genresDiv = document.createElement('div');
        genresDiv.textContent = `Sub-genres: ${this.song.additional_info.genres.join(' | ')}`;
        genresDiv.style.fontSize = '0.9rem'; // Decreasing text size
        genresDiv.style.marginBottom = '0.2rem'; // Center items vertically in the container
        additionalInfoDiv.appendChild(genresDiv);
    
        const happinessDiv = document.createElement('div');
        happinessDiv.textContent = `Happiness: ${Math.round(this.song.additional_info.happiness)}`;
        happinessDiv.style.fontSize = '0.9rem'; // Decreasing text size
        happinessDiv.style.marginBottom = '0.2rem'; // Center items vertically in the container
        additionalInfoDiv.appendChild(happinessDiv);
    
        const danceabilityDiv = document.createElement('div');
        danceabilityDiv.textContent = `Danceability: ${Math.round(this.song.additional_info.danceability)}`;
        danceabilityDiv.style.fontSize = '0.9rem'; // Decreasing text size
        danceabilityDiv.style.marginBottom = '0.2rem'; // Center items vertically in the container
        additionalInfoDiv.appendChild(danceabilityDiv);
    
        const isExplicitText = this.song.additional_info.explicit ? 'Explicit' : 'Clean';
        const explicitDiv = document.createElement('div');
        explicitDiv.textContent = `Language: ${isExplicitText}`;
        explicitDiv.style.fontSize = '0.9rem'; // Decreasing text size
        additionalInfoDiv.appendChild(explicitDiv);
    
        return additionalInfoDiv;
    }




    getThumbnailUrl() {
        return `https://img.youtube.com/vi/${this.song.additional_info.link}/0.jpg`;
    }



    createYoutubeLink() {
        const youtubeLink = document.createElement('a');
        youtubeLink.alignItems = 'center';
        youtubeLink.target = '_blank'; // This should be set here
        console.log("SongListUI.createYoutubeLink - the link is" + this.song.additional_info.link);
        // Extract the YouTube video ID from the link
        const youtubeVideoId = this.song.additional_info.link;
    
        youtubeLink.href = `https://www.youtube.com/watch?v=${youtubeVideoId}`;
        youtubeLink.style.fontSize = '1rem'; // Keeping text size consistent
        youtubeLink.style.fontWeight = '700';
        youtubeLink.style.color = '#FA1B71'; // Change the color to red (the color of YouTube)
        youtubeLink.style.textDecoration = 'none'; // Remove underline from text
        youtubeLink.style.display = 'flex'; // Align items along a row
        youtubeLink.style.alignItems = 'center'; // Center items vertically in the container
        // youtubeLink.style.marginBottom = '1.5rem'; // Add some space below the link
        // youtubeLink.style.marginTop = '2.5rem'; // Add some space below the link
        youtubeLink.style.position = 'absolute'; // Set position to relative
        youtubeLink.style.transform = 'translateY(-2.5rem)';

        youtubeLink.style.zIndex = '3';
        
        
        const youtubeIcon = document.createElement('img');
        youtubeIcon.src = 'images/colored/tv-youtube-colored.svg';
        youtubeIcon.alt = 'Play on YouTube';
        youtubeIcon.style.marginLeft = '1rem'; // Add some spacing between the SVG and the text
    
        youtubeIcon.style.width = '1.5rem'; // Set the width of the SVG image
    
        const playNowText = document.createElement('span');
        playNowText.textContent = 'Play Now';
        youtubeLink.appendChild(playNowText);
        youtubeLink.appendChild(youtubeIcon);


        youtubeLink.addEventListener('click', (e) => {
            // Get user's preference from local storage
            let openInAppYoutube = localStorage.getItem('openInAppYoutube');
            
            // If user's preference is not saved yet, ask for it
            if (openInAppYoutube === null) {
                openInAppYoutube = confirm('Do you want to open the link in the YouTube app?');
                // Save user's preference to local storage
                localStorage.setItem('openInAppYoutube', openInAppYoutube);
            }
        
            if (openInAppYoutube === 'true') {
                e.preventDefault();
        
                // Differentiate between Android and iOS
                const isAndroid = /Android/i.test(navigator.userAgent);
                const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
                
                if (isAndroid) {
                    youtubeLink.href = `vnd.youtube:${youtubeVideoId}`;
                } else if (isIOS || !isAndroid) { // If we're on iOS or desktop
                    youtubeLink.href = `https://www.youtube.com/watch?v=${youtubeVideoId}`;
                    window.open(youtubeLink.href, '_blank');
                }
                
            } else {
                // Prevent the default action (navigation) and open the link in a new tab
                e.preventDefault();
                window.open(youtubeLink.href, '_blank');
            }
        });
        
    
        return youtubeLink;
    }

    createTidalButton() {
        // TODO: Tidal integration needs further device testing (iOS), image W/H and source require updating prior to implimenting UI element. Mobile checks are basic.
        const tidalButton = document.createElement('button');
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        tidalButton.className = 'tidal-button';
        
        const image = document.createElement('img');
        image.src = 'images/colored/tidal-round-black-icon.svg'; // The path to your image
        image.alt = 'Tidal'; // Alt text for accessibility
        image.className = 'tidal-icon'; // You may want to add some styling to the image
        // Apply CSS styling to scale down the image
        image.style.width = '15px';
        image.style.height = '15px';
        tidalButton.appendChild(image);
        tidalButton.addEventListener('click', () => {
            const tempTextarea = document.createElement('textarea');
            // Take the title + the artist field
            tempTextarea.value = this.song.trackTitle + ' ' + this.song.artist;
            document.body.appendChild(tempTextarea);
            tempTextarea.select();
            document.execCommand('copy');
            document.body.removeChild(tempTextarea);
            if (isMobile) {
            const url = `tidal://search?q=${encodeURIComponent(tempTextarea.value)}`;
            window.open(url, '_blank');
             } else {
                // Soundcloud example
                //const url = https://soundcloud.com/search?q=${encodeURIComponent(tempTextarea.value)}`;
            const url = `https://listen.tidal.com/search?q=${encodeURIComponent(tempTextarea.value)}`;
            window.open(url, '_blank');
             }
        });
        return tidalButton;
    }
     
    createSpotifyLink() {
        const spotifyLink = document.createElement('a');
        spotifyLink.alignItems = 'center';
        spotifyLink.href = `https://open.spotify.com/track/${this.song.additional_info.id}`;
        spotifyLink.style.fontSize = '1rem'; // Keeping text size consistent
        spotifyLink.style.fontWeight = '700';
        spotifyLink.style.color = '#09AD72'; // Change the color to blue (or any other desired color)
        spotifyLink.style.textDecoration = 'none'; // Remove underline from text
        spotifyLink.style.display = 'flex'; // Align items along a row
        spotifyLink.style.alignItems = 'center'; // Center items vertically in the container
        spotifyLink.style.marginBottom = '1rem'; // Center items vertically in the container

    
        const spotifyIcon = document.createElement('img');
        spotifyIcon.src = 'images/colored/Spotify-colored.svg';
        spotifyIcon.alt = 'Play on Spotify';
        spotifyIcon.style.marginLeft = '1rem'; // Add some spacing between the SVG and the text

        spotifyIcon.style.width = '1.5rem'; // Set the width of the SVG image
    
        const playNowText = document.createElement('span');
        playNowText.textContent = 'Play Now';
        spotifyLink.appendChild(playNowText);
        spotifyLink.appendChild(spotifyIcon);

    
        spotifyLink.addEventListener('click', (e) => {
            // Get user's preference from local storage
            let openInAppSpotify = localStorage.getItem('openInAppSpotify');
            
            // If user's preference is not saved yet, ask for it
            if (openInAppSpotify === null) {
                openInAppSpotify = confirm('Do you want to open the link in the Spotify app?');
                // Save user's preference to local storage
                localStorage.setItem('openInAppSpotify', openInAppSpotify);
            }
        
            if (openInAppSpotify === 'true') {
                e.preventDefault();
                spotifyLink.href = `spotify:track:${this.song.additional_info.id}`;
                window.location.href = spotifyLink.href;
            } else {
                spotifyLink.target = '_blank'; // Open link in a new tab
            }
        });
    
        return spotifyLink;
    }
    createUIListOfTags(tagsList) {
        const tagsContainer = document.createElement('div');
        tagsContainer.className = 'song-tags';
        tagsContainer.title = "Drum=BPM, Sound Note=Key, Energy=Energy, Sound Note=Popularity, Play = The number of playlists (we've scanned) that this song apeared in"
        
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
