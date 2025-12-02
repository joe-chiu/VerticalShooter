import { State } from '../core/StateMachine';
import { Game } from '../core/Game';
import { PlayerSelectState } from './PlayerSelectState';

export class AttractState implements State {
    private game: Game;

    constructor(game: Game) {
        this.game = game;
    }

    public enter(): void {
        console.log('Entering Attract State');
    }

    public exit(): void {
        console.log('Exiting Attract State');
    }

    public update(_dt: number): void {
        const input = this.game.getInputManager();
        // Press Space or Enter to start
        if (input.isPressed('Space') || input.isPressed('Enter')) {
            this.game.getStateMachine().changeState(new PlayerSelectState(this.game));
        }
    }

    public render(ctx: CanvasRenderingContext2D): void {
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;

        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = 'white';
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('VERTICAL SHOOTER', width / 2, height / 3);

        ctx.font = '24px Arial';
        ctx.fillText('Press SPACE to Start', width / 2, height / 2);
    }
}
