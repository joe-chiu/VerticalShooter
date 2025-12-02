import { Constants } from '../core/Constants';

export class Bullet {
    public x: number;
    public y: number;
    public width: number = Constants.BULLET_WIDTH;
    public height: number = Constants.BULLET_HEIGHT;
    public active: boolean = true;
    public isPlayerBullet: boolean;
    private velocityX: number;
    private velocityY: number;

    constructor(x: number, y: number, vx: number, vy: number, isPlayerBullet: boolean) {
        this.x = x;
        this.y = y;
        this.velocityX = vx;
        this.velocityY = vy;
        this.isPlayerBullet = isPlayerBullet;
    }

    public update(dt: number): void {
        this.x += this.velocityX * dt;
        this.y += this.velocityY * dt;

        // Deactivate if out of bounds
        if (this.y < -this.height || this.y > Constants.SCREEN_HEIGHT ||
            this.x < -this.width || this.x > Constants.SCREEN_WIDTH) {
            this.active = false;
        }
    }

    public render(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.isPlayerBullet ? Constants.COLOR_BULLET_PLAYER : Constants.COLOR_BULLET_ENEMY;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
