import { Constants } from '../core/Constants';
import { Explosion } from './Explosion';

export class ClusterBomb {
    public active: boolean = true;
    private duration: number = 1.0; // 1 second animation
    private timer: number = 0;
    private explosions: Explosion[] = [];
    private spawnTimer: number = 0;
    private spawnInterval: number = 0.05; // Spawn explosion every 50ms

    constructor() {
        // Initial flash or big explosion?
    }

    public update(dt: number): void {
        this.timer += dt;
        this.spawnTimer += dt;

        // Spawn random explosions only during the duration
        if (this.timer < this.duration && this.spawnTimer >= this.spawnInterval) {
            this.spawnTimer = 0;
            const x = Math.random() * Constants.SCREEN_WIDTH;
            const y = Math.random() * Constants.SCREEN_HEIGHT;
            this.explosions.push(new Explosion(x, y));
        }

        // Update explosions
        this.explosions.forEach(e => e.update(dt));
        this.explosions = this.explosions.filter(e => e.active);

        // End animation when duration is over and all explosions are done
        if (this.timer >= this.duration && this.explosions.length === 0) {
            this.active = false;
        }
    }

    public render(ctx: CanvasRenderingContext2D): void {
        // Screen flash effect
        if (this.timer < 0.2) {
            ctx.save();
            ctx.fillStyle = 'white';
            ctx.globalAlpha = 1 - (this.timer / 0.2);
            ctx.fillRect(0, 0, Constants.SCREEN_WIDTH, Constants.SCREEN_HEIGHT);
            ctx.restore();
        }

        this.explosions.forEach(e => e.render(ctx));
    }
}
