import { State } from '../core/StateMachine';
import { Game } from '../core/Game';
import { PlayingState } from './PlayingState';

export class StageIntroState implements State {
    private game: Game;
    private timer: number = 0;
    private duration: number = 2.0; // 2 seconds intro

    private shipType: number;

    constructor(game: Game, shipType: number = 0) {
        this.game = game;
        this.shipType = shipType;
    }

    public enter(): void {
        console.log('Entering StageIntro State');
    }

    public exit(): void {
        console.log('Exiting StageIntro State');
    }

    public update(dt: number): void {
        this.timer += dt;
        if (this.timer >= this.duration) {
            this.game.getStateMachine().changeState(new PlayingState(this.game, this.shipType));
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
        ctx.fillText('STAGE 1', width / 2, height / 2);

        ctx.font = '24px Arial';
        ctx.fillText('GET READY!', width / 2, height / 2 + 50);
    }
}
