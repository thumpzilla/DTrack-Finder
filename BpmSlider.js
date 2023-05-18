import SongManager from './SongManager.js'

export default class BpmSlider {
    constructor(songManager) {
      this.sliderRange = document.getElementById("slider-range");
      this.sliderThumb = document.getElementById("slider-thumb");
      this.rangeValueElement = document.getElementById("range-value");
      this.dataBubble = document.getElementById("data-bubble");
      this.songManager = songManager
      this.min = 60;
      this.max = 140;
      this.rangeValues = [2, 6, 12]; // Range values
  
      this.currentValue = 100; // Default value
      this.currentRangeValue = this.rangeValues[0]; // Default range
      this.rangeValueIndex = 0; // Start with the first value
  
      this.sliderThumb.addEventListener("mousedown", this.moveSliderThumb.bind(this));
      this.dataBubble.addEventListener("click", this.updateRange.bind(this));
  
      this.updateUI();
    }
  
    updateThumbPosition(value) {
      const percentage = ((value - this.min) / (this.max - this.min)) * 100;
      this.sliderThumb.style.left = percentage + "%";
    }
  
    updateValuePosition() {
      const sliderValue = document.getElementById("slider-value");
      sliderValue.style.left = this.sliderThumb.style.left;
    }
  
    updateCurrentValue(value) {
      const pickedValueElement = document.getElementById("picked-value");
      pickedValueElement.textContent = value;
    }
  
    updateRangeValue(value) {
      this.rangeValueElement.textContent = '± ' + value;
    }
  
    updateUI() {
      const minValue = Math.max(this.min, this.currentValue - this.currentRangeValue);
      const maxValue = Math.min(this.max, this.currentValue + this.currentRangeValue);
      this.songManager.setBpmRange([minValue, maxValue]);
      this.updateThumbPosition(this.currentValue);
      this.updateValuePosition();
      this.updateCurrentValue(this.currentValue);
      this.updateRangeValue(this.currentRangeValue);
  
      const sliderActiveRange = document.getElementById("slider-active-range");
      const rangePercentage = ((this.currentRangeValue) / (this.max - this.min)) * 100;
      const leftPercentage = Math.max(0, parseFloat(this.sliderThumb.style.left) - rangePercentage);
      const rightPercentage = Math.min(100, parseFloat(this.sliderThumb.style.left) + rangePercentage);
      
      sliderActiveRange.style.left = leftPercentage + "%";
      sliderActiveRange.style.width = (rightPercentage - leftPercentage) + "%";
    }
  
    moveSliderThumb(event) {
      event.preventDefault();
  
      const sliderRect = this.sliderRange.getBoundingClientRect();
      const minPos = sliderRect.left;
      const maxPos = sliderRect.right;
      const sliderWidth = maxPos - minPos;
  
      const onMouseMove = (e) => {
        let position = e.clientX - minPos;
        position = Math.max(0, Math.min(position, sliderWidth));
        const percentage = (position / sliderWidth) * 100;
        this.sliderThumb.style.left = percentage + "%";
  
        const value = Math.round(((this.max - this.min) * percentage) / 100) + this.min;
        this.currentValue = value;
  
        this.updateUI();
      };
  
      const onMouseUp = () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };
  
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    }
  
    updateRange() {
      this.rangeValueIndex = (this.rangeValueIndex + 1) % this.rangeValues.length; // Cycle through the range values
      this.currentRangeValue = this.rangeValues[this.rangeValueIndex];
      this.rangeValueElement.style.transform = 'translate(-50%, 0%) scale(1.1)'; // Animate the change
      setTimeout(() => {
        this.rangeValueElement.style.transform = 'translate(-50%, 0%) scale(1)';
        }, 300); // Reset the scale after the animation
        this.updateUI();
      }
}