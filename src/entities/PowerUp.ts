import { Constants } from '../core/Constants';

export class PowerUp {
    public x: number;
    public y: number;
    public width: number = Constants.POWERUP_WIDTH;
    public height: number = Constants.POWERUP_HEIGHT;
    public active: boolean = true;
    private vx: number;
    private vy: number = 0;

    constructor(x: number, y: number, direction: number = 1) {
        this.x = x;
        this.y = y;
        this.vx = Constants.POWERUP_SPEED * direction; // 1 for right, -1 for left
    }

    public update(dt: number): void {
        this.x += this.vx * dt;
        this.y += this.vy * dt;

        // Deactivate if off screen
        if (this.x < -this.width || this.x > Constants.SCREEN_WIDTH + this.width) {
            this.active = false;
        }
    }

    public render(ctx: CanvasRenderingContext2D): void {
        // Draw power-up as a rotating star
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);

        // Rotate based on time for visual effect
        const rotation = (performance.now() / 1000) * 2;
        ctx.rotate(rotation);

        ctx.fillStyle = Constants.COLOR_POWERUP;
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;

        // Draw star shape
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
            const radius = i % 2 === 0 ? 12 : 6;
            const px = Math.cos(angle) * radius;
            const py = Math.sin(angle) * radius;
            if (i === 0) {
                ctx.moveTo(px, py);
            } else {
                ctx.lineTo(px, py);
            }
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.restore();
    }
}
