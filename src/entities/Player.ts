import { Game } from '../core/Game';

export class Player {
    private game: Game;
    public x: number;
    public y: number;
    private speed: number = 300;
    private width: number = 32;
    private height: number = 32;

    constructor(game: Game, x: number, y: number) {
        this.game = game;
        this.x = x;
        this.y = y;
    }

    public update(dt: number): void {
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
        if (input.isPressed('Space')) {
            this.shoot();
        }
    }

    public render(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = 'cyan';
        // Draw a simple triangle for the ship
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y);
        ctx.lineTo(this.x + this.width, this.y + this.height);
        ctx.lineTo(this.x, this.y + this.height);
        ctx.closePath();
        ctx.fill();
    }

    private shoot(): void {
        console.log('Pew!');
        // TODO: Spawn bullet
    }
}
