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
    /*for (let x = 0; x < 9; x++) {
      for (let y = 0; y < 3; y++) {
        this.context.rect(5 + 55 * x, 5 + 25 * y, 50, 20);
      }
    }*/
    for (let x = 0; x < AppConstants.WALLS_X; x++) {
      for (let y = 0; y < AppConstants.WALLS_Y; y++) {
        this.context.rect(Firewall.list[x][y].x, Firewall.list[x][y].y, Firewall.list[x][y].width, Firewall.list[x][y].height);
      }
    }
    this.context.fill();
    this.context.closePath();
  }
}
