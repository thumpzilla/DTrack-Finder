import songManager from './SongManager.js' 
export default class GraphManager {
    constructor(width=400, height=200) {
        this.canvas = document.getElementById('musicGraph');
        this.ctx = this.canvas.getContext('2d');
        this.width = width;
        this.height = height;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.style.pointerEvents = 'auto'; // Enable click events
        this.listOfSongs_UI = document.getElementById('songs');
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
        // // Draw the white background
        // this.ctx.beginPath();
        // this.ctx.arc(x, y, 12, 0, 2 * Math.PI);
        // this.ctx.fillStyle = '#fff';
        // this.ctx.fill();
        
        // // Draw the colored dot on top
        // this.ctx.beginPath();
        // this.ctx.arc(x, y, 10, 0, 2 * Math.PI); // Reduced the radius a bit to create a border effect
        // this.ctx.fillStyle = '#8639DB';
        // this.ctx.fill();

            // Draw the white background
        this.ctx.beginPath();
        this.ctx.arc(x, y, 14, 0, 2 * Math.PI);
        this.ctx.fillStyle = '#fff';
        this.ctx.fill();
        
        // Draw the colored dot on top
        this.ctx.beginPath();
        this.ctx.arc(x, y, 11, 0, 2 * Math.PI);

        // Create radial gradient
        let gradient = this.ctx.createRadialGradient(x, y, 0, x, y, 10);
        gradient.addColorStop(0, '#EB5CE4');
        gradient.addColorStop(1, '#D545F6');

        this.ctx.fillStyle = gradient;
        this.ctx.fill();
    }

    handleClick(event, songManager) {
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        // Ranging at [1,10]
        const energy = (x / this.width) * 9 + 1; // Change the scaling factor and add 1
        const popularity = ((this.height - y) / this.height) * 9 + 1; // Change the scaling factor and add 1

        const energyRounded = Math.round(energy); // Change the scaling factor and add 1
        const popularityRounded = Math.round(popularity); 
        this.drawGraph(); // Clear and redraw the graph
        this.drawDot(x, y); // Draw the new dot

        songManager.updateSongList(energy, popularity);
    }
    
    initializeInteraction(songManager) {
        let dragging = false;
    
        this.canvas.addEventListener('mousedown', () => dragging = true);
        this.canvas.addEventListener('mouseup', () => dragging = false);
        this.canvas.addEventListener('mouseleave', () => dragging = false);
    
        this.canvas.addEventListener('mousemove', (event) => {
            if (dragging) {
                this.handleClick(event, songManager);
            }
        });
    
        this.canvas.addEventListener('click', (event) => this.handleClick(event, songManager));
        this.initializeDefaultSelection()
    }


    initializeDefaultSelection() {
        /* NOTE THAT THE DEFAULT Energy=4 and Popularity=8 Are in SongManager.updateSongList*/
        const energy = 4;
        const popularity = 8;
        
        // Convert energy and popularity to x, y coordinates
        const x = (energy - 1) / 9 * this.width;
        const y = this.height - ((popularity - 1) / 9 * this.height);
    
        // Draw the graph and the dot
        this.drawGraph();
        this.drawDot(x, y);
    }
    

    
}