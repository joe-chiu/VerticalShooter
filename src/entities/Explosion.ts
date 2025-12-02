export class Explosion {
    public x: number;
    public y: number;
    public active: boolean = true;
    private duration: number = 0.5;
    private timer: number = 0;
    private maxRadius: number = 40;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public update(dt: number): void {
        this.timer += dt;
        if (this.timer >= this.duration) {
            this.active = false;
        }
    }

    public render(ctx: CanvasRenderingContext2D): void {
        const progress = this.timer / this.duration;
        const radius = this.maxRadius * Math.sin(progress * Math.PI);
        const alpha = 1 - progress;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = 'orange';
        ctx.beginPath();
        ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}
