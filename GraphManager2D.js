import songManager from './SongManager.js' 
import { KEYS_LOGIC } from './Utils.js';
export default class GraphManager {
    constructor() {
        this.canvas = document.getElementById('musicGraph');
        this.ctx = this.canvas.getContext('2d');

        // Update the canvas dimensions to match its display size
        this.updateDimensions();

        this.canvas.style.pointerEvents = 'auto'; // Enable click events
        this.listOfSongs_UI = document.getElementById('songs');

        // Update the canvas dimensions when the window is resized
        window.addEventListener('resize', this.updateDimensions.bind(this));
        
    }

    updateDimensions() {
        // Get the display size of the canvas in pixels
        const rect = this.canvas.getBoundingClientRect();
        this.width = rect.width;
        this.height = rect.height;

        // Set the actual pixel dimensions of the canvas
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        // Redraw the graph to fit the new dimensions
        this.drawGraph();
    }
    

    drawGraph() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        this.ctx.strokeStyle = '#F5F5F7';
        this.ctx.lineWidth = 0.1;
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.height / 2);
        this.ctx.lineTo(this.width, this.height / 2);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(this.width / 2, 0);
        this.ctx.lineTo(this.width / 2, this.height);
        this.ctx.stroke();
    }

    drawDot(x, y) {
        // Draw the white background
        this.ctx.beginPath();
        this.ctx.arc(x, y, 14, 0, 2 * Math.PI);
        this.ctx.fillStyle = '#F5F5F7';
        this.ctx.fill();
        
        // Draw the colored dot on top
        this.ctx.beginPath();
        this.ctx.arc(x, y, 11, 0, 2 * Math.PI);
    
        // Create radial gradient
        // let gradient = this.ctx.createRadialGradient(x, y, 0, x, y, 10);
        let gradient = this.ctx.createLinearGradient(x - 10, y + 10, x + 10, y - 10);

        gradient.addColorStop(0, '#6c4bf3');
        gradient.addColorStop(0.287, '#fe00ff');
        gradient.addColorStop(1, '#fea800');
    
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
    }

    drawStar(x, y, spikes, outerRadius, innerRadius) {
        var rotation = Math.PI / 2 * 3;
        var step = Math.PI / spikes;
        var ctx = this.ctx;
    
        ctx.beginPath();
        ctx.moveTo(x, y - outerRadius);
    
        for (let i = 0; i < spikes; i++) {
            ctx.lineTo(x + Math.cos(rotation) * outerRadius, y + Math.sin(rotation) * outerRadius);
            rotation += step;
    
            ctx.lineTo(x + Math.cos(rotation) * innerRadius, y + Math.sin(rotation) * innerRadius);
            rotation += step;
        }
        ctx.lineTo(x, y - outerRadius);
        ctx.closePath();
        
        // Fill with gradient
        let gradient = this.ctx.createLinearGradient(x - outerRadius, y + outerRadius, x + outerRadius, y - outerRadius);
    

        gradient.addColorStop(1, '#000');
        gradient.addColorStop(0.6, '#fff');
    
        ctx.fillStyle = gradient;
        ctx.fill();
    }
    

    handleClick(event, songManager) {
        const rect = this.canvas.getBoundingClientRect();
        this.currentX = event.clientX - rect.left;
        this.currentY = event.clientY - rect.top;
        // Ranging at [1,10]
        const energy = (this.currentX / this.width) * 9 + 1; // Change the scaling factor and add 1
        const popularity = ((this.height - this.currentY) / this.height) * 9 + 1; // Change the scaling factor and add 1

        const energyRounded = Math.round(energy); // Change the scaling factor and add 1
        const popularityRounded = Math.round(popularity); 
        this.drawGraph(); // Clear and redraw the graph
        // this.drawStar(x, y, 5, 17, 8);  // Example usage

        this.drawDot(this.currentX, this.currentY); // Draw the new dot

        songManager.updateTracksSorting(energy, popularity);
    }
    
    initializeInteraction(songManager) {
        let dragging = false;
    
        // Existing mouse events
        this.canvas.addEventListener('mousedown', () => dragging = true);
        this.canvas.addEventListener('mouseup', () => dragging = false);
        this.canvas.addEventListener('mouseleave', () => dragging = false);
        this.canvas.addEventListener('mousemove', (event) => {
            if (dragging) {
                this.handleClick(event, songManager);
            }
        });
    
        // New touch events
        this.canvas.addEventListener('touchstart', () => dragging = true);
        this.canvas.addEventListener('touchend', () => dragging = false);
        this.canvas.addEventListener('touchcancel', () => dragging = false);
        this.canvas.addEventListener('touchmove', (event) => {
            if (dragging) {
                // For touch events, the coordinates are in event.touches[0]
                this.handleClick(event.touches[0], songManager);
            }
            event.preventDefault(); // Prevent scrolling while dragging
        }, { passive: false }); // Enable preventDefault in passive event listener
    
        this.canvas.addEventListener('click', (event) => this.handleClick(event, songManager));
        this.mockClick(KEYS_LOGIC.DEFAULT_ENERGY, KEYS_LOGIC.DEFAULT_POPULARITY); 
        this.animateDot(300);

        // this.initializeDefaultSelection();
    }

    
    mockClick(energy, popularity) {
        // Convert energy and popularity to x, y coordinates
        const rect = this.canvas.getBoundingClientRect();
        const x = (energy - 1) / 9 * this.width + rect.left;
        const y = this.height - ((popularity - 1) / 9 * this.height) + rect.top;
    
        // Create a new click event
        const clickEvent = new MouseEvent('click', {
            clientX: x,
            clientY: y
        });
    
        // Dispatch the event
        this.canvas.dispatchEvent(clickEvent);
    }
    
    animateDot(duration = 600) {
        // Store original position
        const originalX = this.currentX;
        const originalY = this.currentY;
        // Define the amount of movement
        const deltaY = 20;
        // Define the duration of the animation in ms

    
        // Get the start time
        const startTime = performance.now();
    
        const animate = (currentTime) => {
            // Get the elapsed time
            const elapsedTime = currentTime - startTime;
    
            // Calculate the current position
            const currentY = originalY + deltaY * Math.sin((elapsedTime / duration) * 2 * Math.PI);
    
            // Draw the dot at the current position
            this.drawGraph();
            this.drawDot(originalX, currentY);
    
            // If the animation duration has not been exceeded, request another frame
            if (elapsedTime < duration) {
                requestAnimationFrame(animate);
            } else {
                // If the animation duration has been exceeded, draw the dot at the original position
                this.drawGraph();

                this.drawDot(originalX, originalY);
            }
        }
    
        // Start the animation
        requestAnimationFrame(animate);
    }
}