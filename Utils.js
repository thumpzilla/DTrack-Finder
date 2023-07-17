import Song from './Song.js'


export const KEYS_LOGIC = {
    DEFAULT_ENERGY : 6, 
    DEFAULT_POPULARITY: 8,
}

export const KEYS_UI = {
    SHADOW_OVER_VIDEO_TUMBNAIL_PERCENT: 40
}
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

export function formatSecondsToMinutes(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
  }

export function formatViewCountNumber(n) {
    /*
    console.log(formatNumber(70)); // Output: "70"
    console.log(formatNumber(950)); // Output: "1,000"
    console.log(formatNumber(47211)); // Output: "47k"
    console.log(formatNumber(600444)); // Output: "600k"
    console.log(formatNumber(1533000)); // Output: "1.5M"
    console.log(formatNumber(21599999)); // Output: "21.6M"
 */
    n = typeof n === "string" ? parseInt(n) : n;
    if (isNaN(n)) {
        return "Input is not a number";
    }

    if (n < 1000) {
        return n.toString();
    } else if (n < 1000000) {
        return (n / 1000).toFixed(0) + "k";
    } else {
        return (n / 1000000).toFixed(2) + "M";
    }
  }

export function formatMonthYear(date) {
    /*
    console.log(formatMonthYear('11/11/2022')); // Output: Nov2022
    console.log(formatMonthYear('28/5/2001'));  // Output: May2001
    */
    console.log("Utils.formatMonthYear" + date);
    const [year, month, day] = date.split('-');
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    return `${months[parseInt(month) - 1]}${year}`;
  }

  export function logEventToAnalytics(event_name, category, label, value) {
    // 'event_name' is the name of the event you're tracking. This could be something like 'button_click', 'form_submission', etc.
    // 'event_category' is the category of the event. This is usually the object that was interacted with (e.g., 'button').
    // 'event_label' is an optional parameter that you can use for more granular reporting.
    // value is an optional numeric value associated with the event (e.g., a score in a game).
    gtag('event', event_name, {
      'event_category': category,
      'event_label': label,
      'value': value
    });
  }



  