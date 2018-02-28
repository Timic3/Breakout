import { AppConstants } from '../app.constants';
import { AppComponent } from '../app.component';
import { Drawable } from './Drawable';
import { Wall } from './Wall';

export class Firewall extends Drawable {
  public static list: Wall[][];

  constructor(context: CanvasRenderingContext2D) {
    super(0, 0, context);

    Firewall.list = [];
    for (let x = 0; x < AppConstants.WALLS_X; x++) {
      Firewall.list[x] = [];
      for (let y = 0; y < AppConstants.WALLS_Y; y++) {
        Firewall.list[x][y] = new Wall(
          x * AppConstants.WALLS_WIDTH + AppConstants.SPACING,
          y * AppConstants.WALLS_HEIGHT + AppConstants.SPACING,
          AppConstants.WALLS_WIDTH - AppConstants.SPACING * 2,
          AppConstants.WALLS_HEIGHT - AppConstants.SPACING * 2
        );
      }
    }
  }

  draw() {
    this.context.beginPath();
    this.context.fillStyle = 'white';
    for (let x = 0; x < AppConstants.WALLS_X; x++) {
      for (let y = 0; y < AppConstants.WALLS_Y; y++) {
        const wall = Firewall.list[x][y];
        if (wall.active) {
          this.context.rect(wall.x, wall.y, wall.width, wall.height);
        }
      }
    }
    this.context.fill();
    this.context.closePath();
  }
}
