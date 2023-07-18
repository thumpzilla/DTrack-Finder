import { showToast} from './Utils.js'
import FirebaseManager from './FirebaseManager.js';
const firebaseManager = new FirebaseManager();
export default class Song {
    constructor(trackTitle, artist, bpm, key, djPlayCount, rating, myTag, energy, popularity, additional_info = null) {
        this.trackTitle = trackTitle; 
        this.artist = artist ? artist.replace(/;/g, ' & ') : ''; // Replace ';' with ' & ' if artist is not null
        this.bpm = Math.round(bpm);
        this.key = key === null ? 'unknown' : key; // Replace null with empty string
        this.djPlayCount = djPlayCount; // integer
        try{
            this.rating = rating.replace(/\*/g, '⭐️'); // Replace '*' with '⭐️'
        } catch (error) {
        console.error('No star rating:', error);
        } 
        // Split the tags, and then // Filter out tags that start with 'E' or 'P' followed by a number
        this.myTags = String(myTag).split(',').filter(tag => {
            return !(/^[EP]\d+/.test(tag.trim()));});
        this.energy = energy;
        this.popularity = popularity;
        this.additional_info = additional_info
    }

    // Add methods as needed
    display() {
        return `${this.trackTitle} (Energy: ${this.energy}, Popularity: ${this.popularity})`;
    }

    isInBpmRange(bpmRange) {
        //return (minValue < this.bpm < maxValue)
        return this.bpm >= bpmRange[0] && this.bpm <= bpmRange[1];
    }

    hasTag(tag) {
        return this.myTags.includes(tag);
    }

    // Check if Dj Play Count is more or less than the given value
    isPlayCountInRange(playCountRange) {
        // playCountRange is an array where playCountRange[0] is the min and playCountRange[1] is the max
        // if playCountRange[1] is null, we check if the play count is more than the min
        // if playCountRange[0] is null, we check if the play count is less than the max
        if(playCountRange[1] === null){
            return this.djPlayCount > playCountRange[0];
        } else if(playCountRange[0] === null){
            return this.djPlayCount < playCountRange[1];
        } else {
            return this.djPlayCount >= playCountRange[0] && this.djPlayCount <= playCountRange[1];
        }
    }

    async addTagToFavorite() {
        if (!this.myTags.includes('Favorite')) {
            this.myTags.push('Favorite');
            showToast(`${this.trackTitle} added to Favorite`);
            // Save favorite to Firestore
            await firebaseManager.addFavorite(this.trackTitle, this.artist);
        } else {
            showToast(`${this.trackTitle} is already a Favorite`);
        }
    }
    
    async removeFromFavorite() {
        const index = this.myTags.indexOf('Favorite');
        if (index > -1) {
            this.myTags.splice(index, 1);
            showToast(`${this.trackTitle} removed from Favorite`);
            // Remove favorite from Firestore
            await firebaseManager.removeFavorite(this.trackTitle, this.artist);
        } else {
            showToast(`${this.trackTitle} is not a Favorite`);
        }
    }
}