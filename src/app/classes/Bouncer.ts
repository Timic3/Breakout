import { AppConstants } from '../app.constants';
import { Drawable } from './Drawable';

export class Bouncer extends Drawable {
  private movement = [];

  constructor(context: CanvasRenderingContext2D) {
    super((AppConstants.GAME_WIDTH - AppConstants.BOUNCER_WIDTH) / 2, AppConstants.GAME_HEIGHT - AppConstants.BOUNCER_HEIGHT - 10, context);
  }

  draw() {
    this.context.beginPath();
    this.context.fillStyle = 'rgb(255, 255, 255)';
    this.context.rect(this.x, this.y, AppConstants.BOUNCER_WIDTH, AppConstants.BOUNCER_HEIGHT);
    this.context.fill();
    this.context.closePath();

    let velocityX = 0;
    if (this.movement[37]) {
      velocityX = -AppConstants.BOUNCER_SPEED;
    } else if (this.movement[39]) {
      velocityX = AppConstants.BOUNCER_SPEED;
    }
    this.x = Math.min(Math.max(this.x + velocityX, 0), AppConstants.GAME_WIDTH - AppConstants.BOUNCER_WIDTH);
  }

  onKeyChange(event: KeyboardEvent, down: boolean) {
    if (event.keyCode === 37 || event.keyCode === 39) {
      this.movement[event.keyCode] = down;
    }
  }
}
