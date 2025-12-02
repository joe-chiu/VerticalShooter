import { State } from '../core/StateMachine';
import { Game } from '../core/Game';
import { Player } from '../entities/Player';

export class PlayingState implements State {
    // private game: Game;
    private player: Player;

    constructor(game: Game) {
        // this.game = game;
        this.player = new Player(game, 300, 500); // Start position
    }

    public enter(): void {
        console.log('Entering Playing State');
    }

    public exit(): void {
        console.log('Exiting Playing State');
    }

    public update(dt: number): void {
        this.player.update(dt);
    }

    public render(ctx: CanvasRenderingContext2D): void {
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;

        ctx.fillStyle = '#000033'; // Dark blue background
        ctx.fillRect(0, 0, width, height);

        this.player.render(ctx);

        ctx.fillStyle = 'white';
        ctx.font = '24px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('Score: 0', 10, 30);
    }
}
