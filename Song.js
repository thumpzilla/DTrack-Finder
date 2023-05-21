export default class Song {
    constructor(trackTitle, artist, bpm, key, djPlayCount, rating, myTag, energy, popularity) {
        this.trackTitle = trackTitle; 
        this.artist = artist ? artist.replace(/;/g, ' & ') : ''; // Replace ';' with ' & ' if artist is not null
        this.bpm = Math.round(bpm);
        this.key = key === null ? 'unknown' : key; // Replace null with empty string
        this.djPlayCount = djPlayCount;
        this.rating = rating.replace(/\*/g, '⭐️'); // Replace '*' with '⭐️'
        // Split the tags, and then // Filter out tags that start with 'E' or 'P' followed by a number
        this.myTags = String(myTag).split(',').filter(tag => {
            return !(/^[EP]\d+/.test(tag.trim()));});
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

    hasTag(tag) {
        return this.myTags.includes(tag);
    }
}