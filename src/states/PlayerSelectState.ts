import { State } from '../core/StateMachine';
import { Game } from '../core/Game';
import { StageIntroState } from './StageIntroState';

export class PlayerSelectState implements State {
    private game: Game;
    private selectedShip: number = 0;

    constructor(game: Game) {
        this.game = game;
    }

    public enter(): void {
        console.log('Entering PlayerSelect State');
    }

    public exit(): void {
        console.log('Exiting PlayerSelect State');
    }

    public update(_dt: number): void {
        const input = this.game.getInputManager();

        if (input.isPressed('ArrowLeft')) {
            this.selectedShip = (this.selectedShip - 1 + 3) % 3;
        }
        if (input.isPressed('ArrowRight')) {
            this.selectedShip = (this.selectedShip + 1) % 3;
        }

        if (input.isPressed('Enter') || input.isPressed('Space')) {
            console.log(`Ship ${this.selectedShip} selected`);
            this.game.getStateMachine().changeState(new StageIntroState(this.game, this.selectedShip));
        }
    }

    public render(ctx: CanvasRenderingContext2D): void {
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;

        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = 'white';
        ctx.font = '36px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('SELECT YOUR SHIP', width / 2, height / 4);

        // Draw ship options
        for (let i = 0; i < 3; i++) {
            const x = width / 4 * (i + 1);
            const y = height / 2;

            // Draw selection box
            if (i === this.selectedShip) {
                ctx.strokeStyle = 'yellow';
                ctx.lineWidth = 3;
                ctx.strokeRect(x - 40, y - 40, 80, 80);
            }

            // Draw Ship
            const colors = ['cyan', 'lime', 'magenta'];
            ctx.fillStyle = colors[i];

            ctx.beginPath();
            // Simple triangle shape matching Player.render
            // We can make them slightly different per type if we want, but color is the main differentiator for now
            // Type 0: Standard
            // Type 1: Narrow
            // Type 2: Wide

            if (i === 0) {
                ctx.moveTo(x, y - 16);
                ctx.lineTo(x + 16, y + 16);
                ctx.lineTo(x - 16, y + 16);
            } else if (i === 1) {
                ctx.moveTo(x, y - 20);
                ctx.lineTo(x + 10, y + 16);
                ctx.lineTo(x - 10, y + 16);
            } else {
                ctx.moveTo(x, y - 12);
                ctx.lineTo(x + 20, y + 16);
                ctx.lineTo(x - 20, y + 16);
            }

            ctx.closePath();
            ctx.fill();
        }

        ctx.fillStyle = 'white';
        ctx.font = '24px Arial';
        ctx.fillText('Press SPACE to Confirm', width / 2, height * 0.8);
    }
}
