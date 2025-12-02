import { Game } from '../core/Game';
import { Constants } from '../core/Constants';
import { Bullet } from './Bullet';
import { AudioManager } from '../core/AudioManager';

export class Player {
    private game: Game;
    public x: number;
    public y: number;
    public width: number = Constants.PLAYER_WIDTH;
    public height: number = Constants.PLAYER_HEIGHT;

    public lives: number = Constants.PLAYER_LIVES;
    public bombs: number = Constants.PLAYER_BOMBS;
    public score: number = 0;

    private speed: number = Constants.PLAYER_SPEED;
    private lastShotTime: number = 0;
    private shootCooldown: number = 0.2; // Seconds

    private shipType: number = 0;
    private invulnerableUntil: number = 0;

    constructor(game: Game, x: number, y: number, shipType: number = 0) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.shipType = shipType;
    }

    public update(dt: number, bullets: Bullet[]): void {
        const input = this.game.getInputManager();
        const canvas = this.game.getCanvas();

        // Movement
        if (input.isDown('ArrowLeft')) {
            this.x -= this.speed * dt;
        }
        if (input.isDown('ArrowRight')) {
            this.x += this.speed * dt;
        }
        if (input.isDown('ArrowUp')) {
            this.y -= this.speed * dt;
        }
        if (input.isDown('ArrowDown')) {
            this.y += this.speed * dt;
        }

        // Boundary checks
        if (this.x < 0) this.x = 0;
        if (this.x > canvas.width - this.width) this.x = canvas.width - this.width;
        if (this.y < 0) this.y = 0;
        if (this.y > canvas.height - this.height) this.y = canvas.height - this.height;

        // Shooting
        if (input.isDown('Space')) {
            const currentTime = performance.now() / 1000;
            if (currentTime - this.lastShotTime >= this.shootCooldown) {
                this.shoot(bullets);
                this.lastShotTime = currentTime;
            }
        }

    }

    public render(ctx: CanvasRenderingContext2D): void {
        // Different color based on ship type
        const colors = ['cyan', 'lime', 'magenta'];
        ctx.fillStyle = colors[this.shipType % colors.length];

        // Draw ship based on type
        ctx.beginPath();
        if (this.shipType === 0) {
            ctx.moveTo(this.x + this.width / 2, this.y);
            ctx.lineTo(this.x + this.width, this.y + this.height);
            ctx.lineTo(this.x, this.y + this.height);
        } else if (this.shipType === 1) {
            // Narrow
            ctx.moveTo(this.x + this.width / 2, this.y);
            ctx.lineTo(this.x + this.width * 0.8, this.y + this.height);
            ctx.lineTo(this.x + this.width * 0.2, this.y + this.height);
        } else {
            // Wide
            ctx.moveTo(this.x + this.width / 2, this.y + this.height * 0.2);
            ctx.lineTo(this.x + this.width, this.y + this.height);
            ctx.lineTo(this.x, this.y + this.height);
        }
        ctx.closePath();
        ctx.fill();
    }

    private shoot(bullets: Bullet[]): void {
        // Basic weapon: two bullets from wings
        const leftWingX = this.x;
        const rightWingX = this.x + this.width - Constants.BULLET_WIDTH;
        const y = this.y;

        bullets.push(new Bullet(leftWingX, y, 0, -Constants.BULLET_SPEED, true));
        bullets.push(new Bullet(rightWingX, y, 0, -Constants.BULLET_SPEED, true));

        // Play sound
        AudioManager.getInstance().playShootSound();
    }



    public tryUseBomb(): boolean {
        if (this.bombs > 0) {
            this.bombs--;
            return true;
        }
        return false;
    }

    public setInvulnerable(duration: number): void {
        this.invulnerableUntil = performance.now() / 1000 + duration;
    }

    public isInvulnerable(): boolean {
        return performance.now() / 1000 < this.invulnerableUntil;
    }

    public getShipType(): number {
        return this.shipType;
    }
}
