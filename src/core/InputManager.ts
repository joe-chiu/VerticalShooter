export class InputManager {
    private keys: Set<string> = new Set();
    private previousKeys: Set<string> = new Set();

    constructor() {
        window.addEventListener('keydown', (e) => {
            this.keys.add(e.code);
        });

        window.addEventListener('keyup', (e) => {
            this.keys.delete(e.code);
        });
    }

    public update(): void {
        this.previousKeys = new Set(this.keys);
    }

    public isDown(code: string): boolean {
        return this.keys.has(code);
    }

    public isPressed(code: string): boolean {
        return this.keys.has(code) && !this.previousKeys.has(code);
    }
}
