import { State } from '../core/StateMachine';
import { Game } from '../core/Game';
import { Player } from '../entities/Player';
import { Bullet } from '../entities/Bullet';
import { Enemy } from '../entities/Enemy';
import { Explosion } from '../entities/Explosion';
import { ClusterBomb } from '../entities/ClusterBomb';
import { TileMap } from '../core/TileMap';
import { LevelManager } from '../core/LevelManager';
import { Constants } from '../core/Constants';
import { GameOverState } from './GameOverState';
import { StageClearState } from './StageClearState';
import { AudioManager } from '../core/AudioManager';

export class PlayingState implements State {
    private game: Game;
    private player: Player;
    private bullets: Bullet[] = [];
    private enemies: Enemy[] = [];
    private explosions: Explosion[] = [];
    private clusterBomb: ClusterBomb | null = null;
    private tileMap: TileMap;
    private levelManager: LevelManager;

    private gameTimer: number = 0;
    private readonly LEVEL_DURATION: number = 300; // 5 minutes in seconds

    constructor(game: Game, shipType: number = 0) {
        this.game = game;
        this.player = new Player(game, Constants.SCREEN_WIDTH / 2 - Constants.PLAYER_WIDTH / 2, Constants.SCREEN_HEIGHT - 100, shipType);
        this.tileMap = new TileMap();
        this.levelManager = new LevelManager();
    }

    public enter(): void {
        console.log('Entering Playing State');
        AudioManager.getInstance().resume();
        AudioManager.getInstance().playBackgroundMusic();
    }

    public exit(): void {
        console.log('Exiting Playing State');
        AudioManager.getInstance().stopBackgroundMusic();
    }

    public update(dt: number): void {
        this.gameTimer += dt;

        // Check for level clear
        if (this.gameTimer >= this.LEVEL_DURATION) {
            this.game.getStateMachine().changeState(new StageClearState(this.game, this.player.score, this.player.getShipType()));
            return;
        }

        this.tileMap.update(dt);
        this.levelManager.update(dt, this.enemies);
        this.player.update(dt, this.bullets);

        // Update Bullets
        this.bullets.forEach(b => b.update(dt));
        this.bullets = this.bullets.filter(b => b.active);

        // Update Enemies
        this.enemies.forEach(e => e.update(dt, this.bullets, this.player.x, this.player.y));
        this.enemies = this.enemies.filter(e => e.active);

        // Update Explosions
        this.explosions.forEach(e => e.update(dt));
        this.explosions = this.explosions.filter(e => e.active);

        // Update Cluster Bomb
        if (this.clusterBomb) {
            this.clusterBomb.update(dt);
            if (!this.clusterBomb.active) {
                this.clusterBomb = null;
            }
        }

        // Collision Detection
        this.checkCollisions();

        // Check Game Over
        if (this.player.lives <= 0) {
            this.game.getStateMachine().changeState(new GameOverState(this.game, this.player.score));
        }

        // Bomb Check
        const input = this.game.getInputManager();
        if (input.isPressed('Enter')) {
            if (this.player.tryUseBomb()) {
                // Trigger animation
                this.clusterBomb = new ClusterBomb();
                AudioManager.getInstance().playBombSound();

                // Clear all enemy bullets
                this.bullets = this.bullets.filter(b => b.isPlayerBullet);

                // Destroy all enemies
                this.enemies.forEach(e => {
                    this.explosions.push(new Explosion(e.x + e.width / 2, e.y + e.height / 2));
                    this.player.score += 100;
                });
                this.enemies = [];

                // Set invulnerability: bomb animation (1s) + 5 seconds
                this.player.setInvulnerable(6.0);

                console.log("Bomb used! All enemies destroyed.");
            }
        }
    }

    private checkCollisions(): void {
        // Bullets hitting Enemies
        for (const bullet of this.bullets) {
            if (!bullet.active || !bullet.isPlayerBullet) continue;

            for (const enemy of this.enemies) {
                if (!enemy.active) continue;

                if (this.checkRectCollision(bullet, enemy)) {
                    bullet.active = false;
                    enemy.active = false; // One shot kill as per requirements
                    this.explosions.push(new Explosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2));
                    AudioManager.getInstance().playExplosionSound();
                    this.player.score += 100;
                    break;
                }
            }
        }

        // Bullets hitting Player
        for (const bullet of this.bullets) {
            if (!bullet.active || bullet.isPlayerBullet) continue;

            if (this.checkRectCollision(bullet, this.player)) {
                bullet.active = false;
                if (!this.player.isInvulnerable()) {
                    this.handlePlayerHit();
                }
            }
        }

        // Enemies hitting Player
        for (const enemy of this.enemies) {
            if (!enemy.active) continue;

            if (this.checkRectCollision(enemy, this.player)) {
                enemy.active = false;
                this.explosions.push(new Explosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2));
                if (!this.player.isInvulnerable()) {
                    this.handlePlayerHit();
                }
            }
        }
    }

    private handlePlayerHit(): void {
        this.player.lives--;
        this.explosions.push(new Explosion(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2));
        // Reset position or invulnerability? For now just simple hit.
        console.log('Player Hit! Lives:', this.player.lives);
    }

    private checkRectCollision(r1: { x: number, y: number, width: number, height: number },
        r2: { x: number, y: number, width: number, height: number }): boolean {
        return r1.x < r2.x + r2.width &&
            r1.x + r1.width > r2.x &&
            r1.y < r2.y + r2.height &&
            r1.y + r1.height > r2.y;
    }

    public render(ctx: CanvasRenderingContext2D): void {
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;

        // Clear background (TileMap will draw over it, but good practice)
        ctx.clearRect(0, 0, width, height);

        this.tileMap.render(ctx);

        this.player.render(ctx);

        this.bullets.forEach(b => b.render(ctx));
        this.enemies.forEach(e => e.render(ctx));
        this.explosions.forEach(e => e.render(ctx));

        if (this.clusterBomb) {
            this.clusterBomb.render(ctx);
        }

        // HUD
        this.renderHUD(ctx);
    }

    private renderHUD(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`Score: ${this.player.score}`, 10, 30);
        ctx.fillText(`Lives: ${this.player.lives}`, 10, 60);
        ctx.fillText(`Bombs: ${this.player.bombs}`, 10, 90);

        // Timer
        const timeLeft = Math.max(0, this.LEVEL_DURATION - this.gameTimer);
        const minutes = Math.floor(timeLeft / 60);
        const seconds = Math.floor(timeLeft % 60);
        ctx.textAlign = 'right';
        ctx.fillText(`Time: ${minutes}:${seconds.toString().padStart(2, '0')}`, Constants.SCREEN_WIDTH - 10, 30);
    }
}
