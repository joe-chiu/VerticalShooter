import { State } from '../core/StateMachine';
import { Game } from '../core/Game';
import { StageIntroState } from './StageIntroState';


export class StageClearState implements State {
    private game: Game;
    private score: number;
    private shipType: number;

    constructor(game: Game, score: number, shipType: number) {
        this.game = game;
        this.score = score;
        this.shipType = shipType;
    }

    public enter(): void {
        console.log('Entering StageClear State');
    }

    public exit(): void {
        console.log('Exiting StageClear State');
    }

    public update(_dt: number): void {
        const input = this.game.getInputManager();
        if (input.isPressed('Space') || input.isPressed('Enter')) {
            // Go to next stage (for now just re-enter intro for same stage loop or next)
            this.game.getStateMachine().changeState(new StageIntroState(this.game, this.shipType));
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
        ctx.fillText('STAGE CLEAR!', width / 2, height / 3);

        ctx.font = '36px Arial';
        ctx.fillText(`Score: ${this.score}`, width / 2, height / 2);

        ctx.font = '24px Arial';
        ctx.fillText('Press SPACE for Next Stage', width / 2, height * 0.8);
    }
}
