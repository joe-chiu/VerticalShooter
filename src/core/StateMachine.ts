export interface State {
    enter(): void;
    exit(): void;
    update(dt: number): void;
    render(ctx: CanvasRenderingContext2D): void;
}

export class StateMachine {
    private currentState: State | null = null;

    public changeState(newState: State): void {
        if (this.currentState) {
            this.currentState.exit();
        }
        this.currentState = newState;
        this.currentState.enter();
    }

    public update(dt: number): void {
        if (this.currentState) {
            this.currentState.update(dt);
        }
    }

    public render(ctx: CanvasRenderingContext2D): void {
        if (this.currentState) {
            this.currentState.render(ctx);
        }
    }
}
