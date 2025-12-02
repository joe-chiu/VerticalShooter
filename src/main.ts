import { Game } from './core/Game';
import './style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <canvas id="gameCanvas" width="600" height="800"></canvas>
  </div>
`

const game = new Game('gameCanvas');
game.start();

