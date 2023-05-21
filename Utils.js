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
    document.body.appendChild(toast);

    // Set a timeout to remove the toast after 3 seconds
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 1000);
    }, 3000);
}

export async function createSongExamplesFromJson() {
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
