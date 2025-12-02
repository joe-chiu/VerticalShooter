import { StateMachine } from './StateMachine';
import { InputManager } from './InputManager';
import { AttractState } from '../states/AttractState';

export class Game {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private stateMachine: StateMachine;
    private inputManager: InputManager;
    private lastTime: number = 0;

    constructor(canvasId: string) {
        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d')!;
        this.stateMachine = new StateMachine();
        this.inputManager = new InputManager();

        // Set initial state
        this.stateMachine.changeState(new AttractState(this));
    }

    public start(): void {
        this.lastTime = performance.now();
        requestAnimationFrame(this.loop.bind(this));
    }

    private loop(timestamp: number): void {
        const dt = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;

        this.update(dt);
        this.render();

        requestAnimationFrame(this.loop.bind(this));
    }

    private update(dt: number): void {
        this.inputManager.update();
        this.stateMachine.update(dt);
    }

    private render(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.stateMachine.render(this.ctx);
    }

    public getStateMachine(): StateMachine {
        return this.stateMachine;
    }

    public getInputManager(): InputManager {
        return this.inputManager;
    }

    public getCanvas(): HTMLCanvasElement {
        return this.canvas;
    }
}
