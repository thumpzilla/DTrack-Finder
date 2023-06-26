import Song from './Song.js'

export function generateRandomFloats(amountOfNumbers, minValue, maxValue) {
    const floats = [];

    for (let i = 0; i < amountOfNumbers; i++) {
        const randomFloat = Math.random() * (maxValue - minValue) + minValue;
        floats.push(randomFloat);
    }

    return floats;
}

export function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;

    // Find the main container
    const container = document.querySelector('.container');
    container.appendChild(toast);

    // Set a timeout to remove the toast after 3 seconds
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => {
            container.removeChild(toast);
        }, 1000);
    }, 3000);
}

export async function createSongExamplesFromJson() {
    try {
        let manifestResponse = await fetch('data/collections/manifest.json');
        if (!manifestResponse.ok) { 
            console.error("HTTP Error Response: " + manifestResponse.status);
            return;
        }

        let manifest = await manifestResponse.json();
        let songExamples = [];

        for (let fileName of manifest) {
            let response = await fetch(`data/collections/${fileName}`);
            if (!response.ok) { 
                console.error("HTTP Error Response: " + response.status);
                return;
            }

            let data = await response.json();
            songExamples.push(...data.map(item => new Song(item['Track Title'], item['Artist'], item['BPM'], item['Key'], item['DJ Play Count'], item['Rating'], item['My Tag'], item['Energy'], item['Popularity'], item['Additional Info']
            )));
        }

        return songExamples;
    } catch (error) {
        console.error("Problem with fetch operation: ", error);
    }
}

export function createTagUI(tagName, tagDescription) {
    const tag = document.createElement('span');
    tag.className = 'tag';
    tag.textContent = tagName;

    // Create the tooltip element
    const tooltip = document.createElement('span');
    tooltip.className = 'tooltip';
    tooltip.textContent = tagDescription;

    // Append the tooltip to the tag
    tag.appendChild(tooltip);

    // Set up the hover event
    tag.addEventListener('mouseover', () => {
        tooltip.style.display = 'block';
    });
    tag.addEventListener('mouseout', () => {
        tooltip.style.display = 'none';
    });

    return tag;
}


export function removeSubStringFromString(mainString, subStringsToRemove) {
    let resultString = mainString;

    // Go through each substring in the array
    for (let subString of subStringsToRemove) {
        // Replace all occurrences of the substring with an empty string
        let regExp = new RegExp(subString, 'g');
        resultString = resultString.replace(regExp, '');
    }

    return resultString;
}

export const KEYS_LOGIC = {
    DEFAULT_ENERGY : 9, 
    DEFAULT_POPULARITY: 9,
}