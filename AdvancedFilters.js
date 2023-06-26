import BpmSlider from './BpmSlider.js';
import KeySlider from './KeySlider.js';
import { showToast, removeSubStringFromString } from './Utils.js';

export default class AdvancedFilters {
    constructor(songManager) {

        // Initialize containers
        this.advancedFiltersSection = document.getElementById('advanced-section');
        this.bpmRangeContainer = document.getElementById('bpm-range');
        this.keyRangeContainer = document.getElementById('key-range');
    

        this.isBpmFilterActive = true;
        this.isKeyFilterActive = true;

        this.data_bpmRange;
        this.data_keyRange;

        this.expandedState = 'expanded';
        this.createToggleArrowElemet();
        // Initialize the selector element
        this.createBpmKeySwitch();
    
        // Update initial UI
        this.keyRangeContainer.style.display = 'none'

        this.createToggleActiveFilterSwitch();

        this.turnSwitchUICurrentFilter(true);

        this.songManager = songManager;
        this.bpmSlider = new BpmSlider(this);
        this.keySlider = new KeySlider(this);
        this.initDragSongInteraction();

        // Turn off the switches
        this.showBpm_hideKey();
        this.toggleActivateCurrentFilter();
        this.showKey_hideBpm();
        this.toggleActivateCurrentFilter();
        this.toggleExpandedCollapsedStates();


    }

    

    initDragSongInteraction() {
        window.addEventListener('dragover', (event) => {
            event.preventDefault();
        });

        window.addEventListener('drop', (event) => {
            event.preventDefault();
            let files = event.dataTransfer.files;

            for (let i = 0; i < files.length; i++) {
                let file = files[i];
                if (file.type === "audio/mpeg") {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const buffer = new Uint8Array(event.target.result);
                        const id3Header = String.fromCharCode.apply(null, buffer.subarray(0,3));
                        if (id3Header === 'ID3') {
                            let title = '';
                            let artist = '';
                            let bpm = '';
                            let key = '';

                            for (let i = 0; i < buffer.length; i++) {
                                if (buffer[i] === 84 && buffer[i+1] === 80 && buffer[i+2] === 69 && buffer[i+3] === 49) { // TPE1 frame (Artist)
                                    let j = 0;
                                    while (buffer[i+11+j] !== 0) {
                                        artist += String.fromCharCode(buffer[i+11+j]);
                                        j++;
                                    }
                                }
                                if (buffer[i] === 84 && buffer[i+1] === 73 && buffer[i+2] === 84 && buffer[i+3] === 50) { // TIT2 frame (Title)
                                    let j = 0;
                                    while (buffer[i+11+j] !== 0) {
                                        title += String.fromCharCode(buffer[i+11+j]);
                                        j++;
                                    }
                                }
                                if (buffer[i] === 84 && buffer[i+1] === 66 && buffer[i+2] === 80 && buffer[i+3] === 77) { // TBPM frame (BPM)
                                    let j = 0;
                                    let encoding = buffer[i+10]; // Encoding byte
                                    if (encoding === 0) { // ISO-8859-1
                                        while (buffer[i+11+j] !== 0) {
                                            bpm += String.fromCharCode(buffer[i+11+j]);
                                            j++;
                                        }
                                    } else if (encoding === 1) { // UTF-16
                                        while (buffer[i+11+j] !== 0 || buffer[i+11+j+1] !== 0) {
                                            bpm += String.fromCharCode(buffer[i+11+j], buffer[i+11+j+1]);
                                            j += 2;
                                        }
                                    }
                                }
                                if (buffer[i] === 84 && buffer[i+1] === 75 && buffer[i+2] === 69 && buffer[i+3] === 89) { // TKEY frame (Key)
                                    let j = 0;
                                    let encoding = buffer[i+10]; // Encoding byte
                                    if (encoding === 0) { // ISO-8859-1
                                        while (buffer[i+11+j] !== 0) {
                                            key += String.fromCharCode(buffer[i+11+j]);
                                            j++;
                                        }
                                    } else if (encoding === 1) { // UTF-16
                                        while (buffer[i+11+j] !== 0 || buffer[i+11+j+1] !== 0) {
                                            key += String.fromCharCode(buffer[i+11+j], buffer[i+11+j+1]);
                                            j += 2;
                                        }
                                    }
                                }
                            }
                            // Log the title, artist, bpm and key
                            console.log('Title: ' + title);
                            console.log('Artist: ' + artist);
                            console.log('BPM: ' + bpm);
                            console.log('Key: ' + key);
                            // Handle Key: 
                            if (!bpm){
                                showToast("No BPM registered to this mp3. Analyse it and try again");
                                return
                            }
                            if (key){
                                key = removeSubStringFromString(key, ["TXXX", "RVA2"])
                                this.keySlider.setValues(key);
                                this.setKeyFilterUIToActive();
                            }
                            else{
                                this.setKeyFilterUIToNOTActive();
                                this.keySlider.setDisable(true);
                                key = 'All'

                            }
                            if (bpm){
                                bpm = removeSubStringFromString(bpm, ["GEOB","COMM"])
                                if (bpm>60 && bpm<150){
                                    this.bpmSlider.setValues(bpm);
                                    this.setBpmFilterUIToActive();
                                    this.expandAdvancedFilters();
                                    this.showBpm_hideKey();
                                    this.turnOnCurrentFilterActiveSwitch();
                                    this.setHighlightSummaryToStateBPM();                                }
                            }
                        
                        showToast("Applied Quick Seek! 🎉 Bpm = " + bpm + "🥁 Key = " + key + "♫ 🎉");
                        }
                    };
                    reader.readAsArrayBuffer(file);
                }
                else{
                    showToast("Quick Seek Currently Supports Only MP3 file formats");
                }
            }
        });
    }

    showBpm_hideKey(){
        this.bpmRangeContainer.style.display = 'block';
        this.keyRangeContainer.style.display = 'none';
    }
    showKey_hideBpm(){
        this.bpmRangeContainer.style.display = 'none';
        this.keyRangeContainer.style.display = 'block';
    }

    turnSwitchUICurrentFilter(isTurningOn){
        if(isTurningOn){
            this.turnOnCurrentFilterActiveSwitch();
        }
        else{
            this.turnOffCurrentFilterActiveSwitch();
        }
    }
    turnOnCurrentFilterActiveSwitch(){
        this.toggleSwitch.classList.remove('deactivated');
        this.toggleSwitch.classList.add('activated');
    }

    turnOffCurrentFilterActiveSwitch(){
        this.toggleSwitch.classList.remove('activated');
        this.toggleSwitch.classList.add('deactivated');
    }
    


    toggleActivateCurrentFilter() {

        // If BPM mode is now displayed
        if (this.keyRangeContainer.style.display === 'none') {
            this.isBpmFilterActive = !this.isBpmFilterActive;
            if (this.isBpmFilterActive) { 
                this.turnSwitchUICurrentFilter(true);
                this.songManager.setBpmRange(this.data_bpmRange);
                this.setBpmFilterUIToActive();


                // replace to bpm gray image
            } else {
                this.songManager.setBpmRange(false);
                this.turnSwitchUICurrentFilter(false);
                this.setBpmFilterUIToNOTActive();
                
            }
        } else {
            this.isKeyFilterActive = !this.isKeyFilterActive;
            if (this.isKeyFilterActive) {
                this.turnSwitchUICurrentFilter(true);
                this.songManager.setKeyRange(this.data_keyRange);
                this.setKeyFilterUIToActive();


            // replace to key gray image
            } else {
                this.turnSwitchUICurrentFilter(false);
                this.songManager.setKeyRange(false);
                this.setKeyFilterUIToNOTActive();


            }
        }
    }

    setBpmFilterUIToNOTActive(){
        this.bpmSlider.setDisable(true);
        this.bpmImageElement.src =  'images/drum-bpm.svg';
        this.bpmTextInSummaryObject.innerText = 'BPM filter'
        this.bpmTextInSummaryObject.style.fontSize = '0.9rem';  // set the font size
        this.isBpmFilterActive = false;

    }
    setBpmFilterUIToActive(){
        this.bpmSlider.setDisable(false);
        this.bpmImageElement.src = 'images/colored/drum-colored.svg'; // Or whatever the original SVG path was
        this.bpmTextInSummaryObject.style.fontSize = '1rem';  // set the font size
        this.bpmTextInSummaryObject.innerText = '[ ' + this.data_bpmRange[0] + ' - ' + this.data_bpmRange[1] + ' ]' ;
        this.isBpmFilterActive = true;
    }

    setKeyFilterUIToNOTActive(){
        this.keySlider.setDisable(true);
        this.keyImageElement.src = 'images/sound-note-single.svg';
        this.keyTextInSummaryObject.style.fontSize = '0.9rem';  // set the font size
        this.keyTextInSummaryObject.innerText = 'Key Filter'
        this.isKeyFilterActive = false;
    }

    setKeyFilterUIToActive(){
        this.keySlider.setDisable(false);
        this.keyImageElement.src = 'images/colored/sound_note-colored.svg'; // Or whatever the original SVG path was
        this.keyTextInSummaryObject.innerText = '[ ' + this.data_keyRange + ' ]' ;
        this.keyTextInSummaryObject.style.fontSize = '1rem';  // set the font size
        this.isKeyFilterActive = true;
    }
    
    updateParagraphStylesAdvanced() {
        requestAnimationFrame(() => {
            this.toggleSwitch.style.display='block';
            this.expandArrow.style.display = 'block';
            this.expandArrow.style.transform = 'rotate(45deg)'; // Rotate back to expanded state
            if (this.bpmRangeContainer.style.display === 'none') 
            {
                this.setHighlightSummaryToStateKEY();

            }
            else 
            {
                this.setHighlightSummaryToStateBPM();

            }
        });
    }

    setHighlightSummaryToStateKEY(){
        this.keyTextInSummaryObject.style.color = 'white';
        this.keyTextInSummaryObject.style.fontWeight = '600';
        this.bpmTextInSummaryObject.style.color = 'gray';
        this.bpmTextInSummaryObject.style.fontWeight = '200';
        // highlight
        this.highlightAdvanced.style.transform = 'translateX(102%)';
    }
    setHighlightSummaryToStateBPM(){
        this.bpmTextInSummaryObject.style.color = 'white';
        this.bpmTextInSummaryObject.style.fontWeight = '600';
        this.keyTextInSummaryObject.style.color = 'gray';
        this.keyTextInSummaryObject.style.fontWeight = '200';
        //highlight
        this.highlightAdvanced.style.transform = 'translateX(0%)';
    }
    


    createToggleArrowElemet(){
        // Create a new element for the expand arrow
        this.expandArrow = document.createElement('div');
        this.expandArrow.id = 'expand-arrow';
        // this.expandArrow.style.transform
        this.expandArrow.style.cursor = 'pointer';
        this.expandArrow.style.transform = 'rotate(45deg)'; // Rotate back to expanded state
  
        // Event Listener for the expand arrow
        this.expandArrow.addEventListener('click', this.toggleExpandedCollapsedStates.bind(this));
  
        // Add the expand arrow to the bpmRange
        this.advancedFiltersSection.appendChild(this.expandArrow);
    }
  


    toggleExpandedCollapsedStates() {
        if(this.expandedState === 'expanded') {
            this.collapseAdvancedFilters();
        } else {
            this.expandAdvancedFilters();
        }
    }

    collapseAdvancedFilters(){
        this.advancedFiltersSection.classList.add('collapsed');
        this.expandArrow.style.transform = 'rotate(225deg)'; // Rotate to collapsed state
        this.expandedState = 'collapsed';
        this.toggleSwitch.style.display='none';
        this.expandArrow.style.opacity = 0; // Add this line
    }
    expandAdvancedFilters() {
        this.advancedFiltersSection.classList.remove('collapsed');
        this.expandArrow.style.transform = 'rotate(45deg)'; // Rotate back to expanded state
        this.expandedState = 'expanded';
        this.toggleSwitch.style.display = 'block';
        this.expandArrow.style.opacity = 1; // Add this line
    }

    userUpdatedBpmRange(bpmRangeData){
        this.songManager.setBpmRange([bpmRangeData[0], bpmRangeData[1]]);
        
        this.data_bpmRange = bpmRangeData;
        
        // this.bpmTextInSummaryObject.style.fontSize = '1rem';  // set the font size
        this.bpmTextInSummaryObject.innerText = '[ ' + this.data_bpmRange[0] + ' - ' + this.data_bpmRange[1] + ' ]' ;

    }

    userUpdatedKeyRange(keyRangeData){
        this.data_keyRange = keyRangeData;
        this.songManager.setKeyRange(keyRangeData);
        
 

        // this.keyTextInSummaryObject.style.fontSize = '1rem';  // set the font size
        this.keyTextInSummaryObject.innerText = '[ ' + this.data_keyRange + ' ]' ;


    }

    createToggleActiveFilterSwitch() {
        // Create a new div for the switch
        this.toggleSwitch = document.createElement('div');
        this.toggleSwitch.id = 'toggle-switch';
        this.toggleSwitch.style.cursor = 'pointer';
        
        // Create a new checkbox
        this.toggleCheckbox = document.createElement('input');
        this.toggleCheckbox.type = 'checkbox';
        this.toggleCheckbox.id = 'toggle-checkbox';
        this.toggleCheckbox.style.display = 'none'; // Hide the checkbox
        
        // Event Listener for the toggle checkbox
        this.toggleCheckbox.addEventListener('change', this.toggleActivateCurrentFilter.bind(this));
        
        // OnClick listener for the switch
        this.toggleSwitch.addEventListener('click', () => {
            this.toggleCheckbox.checked = !this.toggleCheckbox.checked;
            this.toggleActivateCurrentFilter(); // Call a function that you'll implement later
        });
        
        // Add the checkbox to the switch
        this.toggleSwitch.appendChild(this.toggleCheckbox);
        
        // Add the switch to the advancedFiltersSection
        this.advancedFiltersSection.appendChild(this.toggleSwitch);
    }

    createSummaryObject(containerId, idOfTextField, svgImagePath, imageDivPath, activeIndicatorId) {
        // create the div container
        let container = document.createElement('div');
        container.id = containerId;
        container.style.display = 'flex';
        container.style.position = 'relative'; // Container needs to be relative for absolute child positioning.
        container.style.alignItems = 'center';
        container.style.justifyContent = 'space-between'; // Spread out the elements in the container
        container.style.flex = '1'; // This will spread out the child elements equally

        // create the image
        let image = document.createElement('img');
        image.src = svgImagePath;
        image.style.width = '1.8rem';
        image.style.height = '1.8rem';
        image.style.position = 'absolute'; // Image is positioned absolutely to the container
        image.style.left = '1.2rem'; // You may need to adjust this value
        image.style.bottom = '24%'; // You may need to adjust this value
        image.style.zIndex = '10';

        // create the text field
        let textField = document.createElement('p');
        textField.id = idOfTextField;
        textField.style.textAlign = 'center'; // center the text in the text field
        textField.style.transform = 'translateY(12%)';


        // create the div for the image
        let imageDiv = document.createElement('div');
        imageDiv.id = imageDivPath;
        imageDiv.appendChild(image);  // Append image to imageDiv

        // Create the active indicator
        let activeIndicator = document.createElement('div');
        activeIndicator.id = activeIndicatorId;
        activeIndicator.classList.add('active-indicator');
        imageDiv.appendChild(activeIndicator);
                
        // append the elements to the container
        container.appendChild(imageDiv);
        container.appendChild(textField);

        return container;
    }




    createBpmKeySwitch() {   

        this.bpmKeySwitchContainer = document.getElementById("bpm-key-switch-container");
        this.bpmKeySwitchContainer.style.textAlign = 'center'; // or any other styles you want
        // Create song count display
        
        

        // Call the new function to create the summary objects
        this.bpmSummaryObject = this.createSummaryObject('bpm-container',
                                                        'bpm-display-summary',
                                                        'images/colored/drum-colored.svg', //'images/drum-bpm.svg',
                                                        'bpm-image-div',
                                                        'bpm-active-indicator');
        
        this.keySummaryObject = this.createSummaryObject('key-container',
                                                        'key-display-summary',
                                                        'images/colored/sound_note-colored.svg',//'images/sound-note-double.svg',
                                                        'key-image-div',
                                                        'key-active-indicator');
        
        
        // Append the new objects
        this.bpmKeySwitchContainer.appendChild(this.bpmSummaryObject);
        this.bpmKeySwitchContainer.appendChild(this.keySummaryObject);

        // Set the initial innerText of the text fields
        // bpmSummaryObject.textField.innerText = 'BPM';
        // keySummaryObject.textField.innerText = 'Key';
    
        this.highlightAdvanced = document.createElement('div');
        this.highlightAdvanced.classList.add('highlight-advanced');
        this.highlightAdvanced.id = 'highlight-advanced-filters';
        

        
        this.bpmKeySwitchContainer.appendChild(this.highlightAdvanced);    
        this.bpmKeySwitchContainer.addEventListener('click', () => {
            this.updateParagraphStylesAdvanced();
        });
    
        
        // Update the event listener for addTagButton
        this.bpmKeySwitchContainer.addEventListener('click', () => {
            // If Bpm is open now 
            if (this.keyRangeContainer.style.display === 'none') {
                this.showKey_hideBpm();
                this.turnSwitchUICurrentFilter(this.isKeyFilterActive);
                
                
            } else {
                this.showBpm_hideKey();
                this.turnSwitchUICurrentFilter(this.isBpmFilterActive);

            }
            this.expandAdvancedFilters();
        });

        this.bpmTextInSummaryObject = document.getElementById("bpm-display-summary");
        this.keyTextInSummaryObject = document.getElementById("key-display-summary");
        let bpmImageDiv = document.getElementById('bpm-image-div');
        this.bpmImageElement = bpmImageDiv.querySelector('img');
        
        let keyImageDiv = document.getElementById('key-image-div');
        this.keyImageElement = keyImageDiv.querySelector('img');
    
    }

    

}

