import { Enemy, EnemyType } from '../entities/Enemy';
import { Constants } from './Constants';

export class LevelManager {
    private gameTime: number = 0;
    private level: number = 1;
    private spawnTimer: number = 0;
    private spawnInterval: number = 2.0; // Seconds between spawns

    constructor() { }

    public update(dt: number, enemies: Enemy[]): void {
        this.gameTime += dt;
        this.spawnTimer += dt;

        if (this.spawnTimer >= this.spawnInterval) {
            this.spawnTimer = 0;
            this.spawnEnemy(enemies);

            // Increase difficulty over time
            if (this.spawnInterval > 0.5) {
                this.spawnInterval -= 0.01;
            }
        }
    }

    private spawnEnemy(enemies: Enemy[]): void {
        const x = Math.random() * (Constants.SCREEN_WIDTH - Constants.ENEMY_WIDTH);
        const y = -Constants.ENEMY_HEIGHT;

        // Random type based on level/difficulty
        // For now just random
        const type = Math.random() > 0.5 ? EnemyType.FAST : EnemyType.SLOW;

        enemies.push(new Enemy(x, y, type));
    }

    public getLevel(): number {
        return this.level;
    }
}
