import { Constants } from '../core/Constants';
import { Bullet } from './Bullet';

export enum EnemyType {
    FAST,
    SLOW
}

export class Enemy {
    public x: number;
    public y: number;
    public width: number = Constants.ENEMY_WIDTH;
    public height: number = Constants.ENEMY_HEIGHT;
    public active: boolean = true;
    public type: EnemyType;

    private speed: number;
    private shootTimer: number = 0;
    private shootInterval: number;

    constructor(x: number, y: number, type: EnemyType) {
        this.x = x;
        this.y = y;
        this.type = type;

        if (type === EnemyType.FAST) {
            this.speed = 150;
            this.shootInterval = 1.5; // Seconds
        } else {
            this.speed = 50;
            this.shootInterval = 2.5;
        }
    }

    public update(dt: number, bullets: Bullet[], playerX: number, playerY: number): void {
        // Simple movement: move down
        this.y += this.speed * dt;

        // Pattern specific movement
        if (this.type === EnemyType.FAST) {
            // Fast enemy might wobble or move diagonally? Let's keep it simple for now as per requirements "fast moving"
            // Maybe slight sine wave
            this.x += Math.sin(this.y * 0.05) * 2;
        }

        // Shooting logic
        this.shootTimer += dt;
        if (this.shootTimer >= this.shootInterval) {
            this.shootTimer = 0;
            this.shoot(bullets, playerX, playerY);
        }

        // Deactivate if out of bounds
        if (this.y > Constants.SCREEN_HEIGHT) {
            this.active = false;
        }
    }

    private shoot(bullets: Bullet[], playerX: number, playerY: number): void {
        if (this.type === EnemyType.FAST) {
            // Shoots at random intervals (handled by timer) - maybe random direction?
            // "shoots bullets at random intervals" - already doing interval.
            // Let's shoot straight down for now, or towards player?
            // "Enemy 2 ... shoots bullets in a straight line"
            // "Enemy 1 ... shoots bullets at random intervals"

            // Let's make Enemy 1 shoot towards player
            const dx = playerX - this.x;
            const dy = playerY - this.y;
            const angle = Math.atan2(dy, dx);
            const vx = Math.cos(angle) * Constants.BULLET_SPEED * 0.5;
            const vy = Math.sin(angle) * Constants.BULLET_SPEED * 0.5;
            bullets.push(new Bullet(this.x + this.width / 2, this.y + this.height, vx, vy, false));

        } else {
            // Enemy 2 shoots straight line
            bullets.push(new Bullet(this.x + this.width / 2, this.y + this.height, 0, Constants.BULLET_SPEED * 0.5, false));
        }
    }

    public render(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.type === EnemyType.FAST ? Constants.COLOR_ENEMY_1 : Constants.COLOR_ENEMY_2;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
