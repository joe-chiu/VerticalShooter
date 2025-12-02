import { State } from '../core/StateMachine';
import { Game } from '../core/Game';
import { AttractState } from './AttractState';

export class GameOverState implements State {
    private game: Game;
    private score: number;

    constructor(game: Game, score: number) {
        this.game = game;
        this.score = score;
    }

    public enter(): void {
        console.log('Entering GameOver State');
    }

    public exit(): void {
        console.log('Exiting GameOver State');
    }

    public update(_dt: number): void {
        const input = this.game.getInputManager();
        if (input.isPressed('Space') || input.isPressed('Enter')) {
            this.game.getStateMachine().changeState(new AttractState(this.game));
        }
    }

    public render(ctx: CanvasRenderingContext2D): void {
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;

        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = 'red';
        ctx.font = '64px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', width / 2, height / 3);

        ctx.fillStyle = 'white';
        ctx.font = '36px Arial';
        ctx.fillText(`Final Score: ${this.score}`, width / 2, height / 2);

        ctx.font = '24px Arial';
        ctx.fillText('Press SPACE to Restart', width / 2, height * 0.8);
    }
}
