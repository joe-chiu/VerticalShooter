import { Constants } from '../core/Constants';

export class TileMap {
    private map: number[][];
    private tileSize: number = 40;
    private scrollY: number = 0;
    private scrollSpeed: number = 50; // Pixels per second
    private rows: number;
    private cols: number;
    private colors: string[] = ['#000033', '#000044', '#000055', '#000066']; // Deep space/water colors

    constructor() {
        this.cols = Math.ceil(Constants.SCREEN_WIDTH / this.tileSize);
        this.rows = Math.ceil(Constants.SCREEN_HEIGHT / this.tileSize) + 2; // +2 for extra buffer
        this.map = this.generateMap();
    }

    private generateMap(): number[][] {
        const map = [];
        // Generate enough rows for a "level" or just infinite scrolling buffer?
        // Let's make it infinite for now by regenerating rows or just a large fixed map.
        // For simplicity, let's just have a fixed buffer that we cycle through or render with offset.
        // Actually, to simulate a long level, we can just render a grid and offset the drawing.
        // Let's generate a map that is slightly larger than screen and scroll it.
        // But for a 5 minute level, a real map would be huge.
        // Let's implement a "rolling" map where we generate new rows at the top as we scroll up.

        for (let y = 0; y < this.rows; y++) {
            const row = [];
            for (let x = 0; x < this.cols; x++) {
                row.push(Math.floor(Math.random() * this.colors.length));
            }
            map.push(row);
        }
        return map;
    }

    public update(dt: number): void {
        this.scrollY += this.scrollSpeed * dt;
        if (this.scrollY >= this.tileSize) {
            this.scrollY -= this.tileSize;
            // Remove last row and add new one at top (or bottom depending on direction)
            // We are scrolling UP (flying forward), so background moves DOWN.
            // So we remove bottom row and add new top row? 
            // Visual: Objects move down.
            // So we need to shift rows.
            this.map.pop(); // Remove bottom
            const newRow = [];
            for (let x = 0; x < this.cols; x++) {
                newRow.push(Math.floor(Math.random() * this.colors.length));
            }
            this.map.unshift(newRow); // Add to top
        }
    }

    public render(ctx: CanvasRenderingContext2D): void {
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                const tileVal = this.map[y][x];
                ctx.fillStyle = this.colors[tileVal];
                // Draw with offset
                // y index 0 is at the top.
                // We want to draw starting at -tileSize + scrollY?
                // If scrollY goes 0 -> 40.
                // At 0, row 0 is at y=0.
                // At 40, row 0 is at y=40.
                // So we draw at y * tileSize + scrollY - tileSize (to cover top gap)
                // Let's try: y * tileSize + scrollY - tileSize
                // If scrollY is 0, top row is at -40. That's fine if we have enough rows.
                // We have rows = screenHeight/tileSize + 1.

                const drawX = x * this.tileSize;
                const drawY = (y - 1) * this.tileSize + this.scrollY;

                ctx.fillRect(drawX, drawY, this.tileSize, this.tileSize);
            }
        }
    }
}
